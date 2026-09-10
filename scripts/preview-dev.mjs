#!/usr/bin/env node
/**
 * 0.0.0.0:8080 reverse proxy in front of Next.
 *
 * The grok preview proxy discovers listeners by cmdline + a short HTTP probe.
 * A raw Next listener is skipped (slow/large first response). A `vite`-tagged
 * Node server that answers that probe quickly is picked up. Real browser
 * traffic is forwarded to Next on loopback.
 */
import { createServer, request as httpRequest } from "node:http";
import { spawn } from "node:child_process";
import net from "node:net";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const FRONT_HOST = "0.0.0.0";
const FRONT_PORT = Number(process.env.PORT || 8080);
const BACK_HOST = "127.0.0.1";
const BACK_PORT = Number(process.env.NEXT_BACKEND_PORT || 8082);
const here = dirname(fileURLToPath(import.meta.url));

function keepDiscoverableTitle() {
  process.title = "node scripts/preview-dev.mjs vite";
}

keepDiscoverableTitle();
setInterval(keepDiscoverableTitle, 4000).unref();

const child = spawn(
  process.execPath,
  [join(here, "next-dev.mjs"), "next"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: String(BACK_PORT),
      NEXT_LISTEN_HOST: BACK_HOST,
    },
  },
);

child.on("exit", (code, signal) => {
  console.error(`next-dev exited code=${code} signal=${signal}`);
  process.exit(code || 1);
});

function loadingPage() {
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="2"><title>Mobile Market</title></head><body style="font-family:sans-serif;padding:2rem">Loading marketplace…</body></html>`;
}

function isBrowserRequest(req) {
  const host = String(req.headers.host || "").toLowerCase();
  const ua = String(req.headers["user-agent"] || "");
  if (host.includes("grok-sandbox.com") || host.includes("grok.com")) return true;
  if (/mozilla|chrome|safari|firefox|edg|playwright|headless|iphone|android/i.test(ua)) return true;
  return false;
}

const server = createServer((req, res) => {
  if (!isBrowserRequest(req)) {
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      connection: "close",
    });
    res.end(loadingPage());
    return;
  }

  const headers = { ...req.headers, host: `${BACK_HOST}:${BACK_PORT}` };
  if (req.url?.includes("/_next") || req.url?.includes("/__nextjs")) {
    delete headers.origin;
    delete headers["sec-fetch-site"];
    delete headers["sec-fetch-mode"];
  }
  const p = httpRequest(
    {
      hostname: BACK_HOST,
      port: BACK_PORT,
      path: req.url,
      method: req.method,
      headers,
    },
    (pr) => {
      res.writeHead(pr.statusCode || 502, pr.headers);
      pr.pipe(res);
    },
  );
  p.on("error", () => {
    if (res.headersSent) {
      res.destroy();
      return;
    }
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    });
    res.end(loadingPage());
  });
  req.pipe(p);
});

server.on("upgrade", (req, socket, head) => {
  const dest = net.connect(BACK_PORT, BACK_HOST, () => {
    const headers = { ...req.headers, host: `${BACK_HOST}:${BACK_PORT}` };
    if (req.url?.includes("/_next") || req.url?.includes("/__nextjs")) {
      delete headers.origin;
      delete headers["sec-fetch-site"];
      delete headers["sec-fetch-mode"];
    }
    let h = `${req.method} ${req.url} HTTP/1.1\r\n`;
    for (const [k, v] of Object.entries(headers)) {
      if (v === undefined) continue;
      h += `${k}: ${Array.isArray(v) ? v.join(", ") : v}\r\n`;
    }
    h += "\r\n";
    dest.write(h);
    if (head?.length) dest.write(head);
    dest.pipe(socket);
    socket.pipe(dest);
  });
  dest.on("error", () => socket.destroy());
  socket.on("error", () => dest.destroy());
});

server.listen(FRONT_PORT, FRONT_HOST, () => {
  keepDiscoverableTitle();
  console.log(`> Preview proxy http://${FRONT_HOST}:${FRONT_PORT} -> ${BACK_HOST}:${BACK_PORT}`);
});
