/**
 * Expiry rules for signed listing-photo URLs.
 *
 * Expiry times are rounded up to a fixed 30-day boundary so the same photo keeps the
 * same URL for weeks. That lets browsers, the CDN and Google Images cache it, instead
 * of seeing a new URL on every page render. Every URL stays valid for at least 7 days.
 */
export const MEDIA_MIN_TTL_SECONDS = 60 * 60 * 24 * 7;
export const MEDIA_BUCKET_SECONDS = 60 * 60 * 24 * 30;
/** Latest expiry a freshly issued URL can carry (min TTL + one bucket). */
export const MEDIA_MAX_TTL_SECONDS = MEDIA_MIN_TTL_SECONDS + MEDIA_BUCKET_SECONDS;

export function stableMediaExpiry(nowSeconds: number) {
  const earliest = nowSeconds + MEDIA_MIN_TTL_SECONDS;
  return Math.ceil(earliest / MEDIA_BUCKET_SECONDS) * MEDIA_BUCKET_SECONDS;
}

export function isMediaExpiryAcceptable(exp: number, nowSeconds: number) {
  if (!Number.isFinite(exp)) return false;
  if (exp < nowSeconds - 30) return false;
  return exp <= nowSeconds + MEDIA_MAX_TTL_SECONDS + 60;
}
