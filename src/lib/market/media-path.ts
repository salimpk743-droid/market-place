/** Storage object paths for listing-images. Never a public URL. */

export const LISTING_IMAGES_BUCKET = "listing-images";

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";
const FILE = "[A-Za-z0-9._-]+\\.(?:jpe?g|png|webp)";
const PATH_RE = new RegExp(`^(${UUID})/(${UUID})/(${FILE})$`, "i");

export type ListingStoragePath = {
  sellerId: string;
  listingId: string;
  filename: string;
  path: string;
};

export function isListingStoragePath(value: string): boolean {
  return PATH_RE.test(String(value || "").trim());
}

export function parseListingStoragePath(value: string): ListingStoragePath | null {
  const raw = String(value || "").trim();
  const m = raw.match(PATH_RE);
  if (!m) return null;
  const path = `${m[1]}/${m[2]}/${m[3]}`;
  return {
    sellerId: m[1].toLowerCase(),
    listingId: m[2].toLowerCase(),
    filename: m[3],
    path,
  };
}

/** Pull `{seller}/{listing}/{file}` out of a stored path, JSON list, or legacy getPublicUrl value. */
export function extractStoragePath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!value || value.startsWith("data:") || value.startsWith("/api/")) return null;
  if (isListingStoragePath(value)) return parseListingStoragePath(value)?.path || null;

  const markers = [
    "/storage/v1/object/public/listing-images/",
    "/storage/v1/object/sign/listing-images/",
    "/storage/v1/object/authenticated/listing-images/",
    "/storage/v1/object/listing-images/",
  ];
  for (const marker of markers) {
    const idx = value.indexOf(marker);
    if (idx === -1) continue;
    const rest = value.slice(idx + marker.length).split("?")[0];
    let decoded = rest;
    try {
      decoded = decodeURIComponent(rest);
    } catch {
      decoded = rest;
    }
    const parsed = parseListingStoragePath(decoded);
    return parsed?.path || null;
  }
  return null;
}

export function storagePathsFromStored(raw: unknown): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return uniquePaths(raw.map(extractStoragePath));
  }
  if (typeof raw !== "string") return [];
  const value = raw.trim();
  if (!value) return [];
  if (value.startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return uniquePaths(parsed.map(extractStoragePath));
    } catch {
      // fall through to single-value parsing
    }
  }
  const one = extractStoragePath(value);
  return one ? [one] : [];
}

export function serializeStoragePaths(paths: string[]): string | null {
  const unique = uniquePaths(paths.map(extractStoragePath));
  if (!unique.length) return null;
  if (unique.length === 1) return unique[0];
  return JSON.stringify(unique);
}

export function filenameFromStoragePath(path: string): string | null {
  return parseListingStoragePath(path)?.filename || null;
}

function uniquePaths(paths: (string | null)[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const path of paths) {
    if (!path || seen.has(path)) continue;
    seen.add(path);
    out.push(path);
  }
  return out;
}
