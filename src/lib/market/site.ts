export const BRAND = "Mobile Market";
export const SUPPORT_EMAIL = "help@mobilemarket.pk";
/** Shop advertising enquiries only. Support and other contact emails stay on SUPPORT_EMAIL. */
export const ADVERTISE_EMAIL = "salimpk742@gmail.com";
export const ADVERTISE_PATH = "/advertise-your-mobile-shop";
export const ADVERTISE_MAILTO = `mailto:${ADVERTISE_EMAIL}?subject=${encodeURIComponent("Advertise my mobile shop on mobilemarket.pk")}`;
export const DEFAULT_SITE_URL = "https://mobilemarket.pk";
export const PAGE_SIZE = 24;

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${p}`;
}

/** Reject open redirects. Only same-origin relative paths are allowed. */
export function safeInternalPath(raw: string | null | undefined, fallback = "/my-ads") {
  if (!raw) return fallback;
  let value = raw.trim();
  try {
    value = decodeURIComponent(value);
  } catch {
    return fallback;
  }
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("://") || value.includes("\\") || value.includes("\0") || value.includes("@")) return fallback;
  return value;
}
