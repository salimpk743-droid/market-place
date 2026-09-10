const STATIC_CACHE = "mm-static-v4";
const STATIC_ASSETS = ["/icons/icon-192.png", "/icons/icon-512.png", "/manifest.webmanifest", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Never cache marketplace HTML, APIs, or auth — sold/deleted ads and private data must not reappear.
  if (
    req.mode === "navigate" ||
    req.headers.get("accept")?.includes("text/html") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/listing/") ||
    url.pathname.startsWith("/my-ads") ||
    url.pathname.startsWith("/account")
  ) {
    event.respondWith(
      fetch(req)
        .then((res) => res)
        .catch(() => caches.match("/offline.html"))
    );
    return;
  }

  if (url.pathname.startsWith("/icons/") || url.pathname === "/manifest.webmanifest") {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetched = fetch(req).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        });
        return cached || fetched;
      })
    );
  }
});
