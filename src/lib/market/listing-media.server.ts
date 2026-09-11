import "server-only";

import { createHmac, createHash, randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { readServerEnv } from "@/lib/supabase/server-env";
import { LISTING_IMAGES_BUCKET, filenameFromStoragePath, parseListingStoragePath } from "./media-path";

const TTL_SECONDS = 60 * 60;
const MAX_CACHE_BYTES = 5 * 1024 * 1024;

function dataDir() {
  for (const dir of ["/workspace/.data", "/tmp/mobile-market-data"]) {
    try {
      mkdirSync(dir, { recursive: true });
      return dir;
    } catch {
      // try next
    }
  }
  return "/tmp";
}

function cacheDir() {
  const dir = join(dataDir(), "listing-media");
  mkdirSync(dir, { recursive: true });
  return dir;
}

function getSecret() {
  const env = readServerEnv("LISTING_MEDIA_SECRET", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY");
  if (env) return env;
  const file = join(dataDir(), "listing-media-secret");
  try {
    if (existsSync(file)) {
      const existing = readFileSync(file, "utf8").trim();
      if (existing) return existing;
    }
    const created = randomBytes(32).toString("hex");
    writeFileSync(file, created, { mode: 0o600 });
    return created;
  } catch {
    return "listing-media-dev-secret";
  }
}

function cacheKey(path: string) {
  return createHash("sha256").update(path).digest("hex");
}

type CachedImage = { bytes: Buffer; contentType: string };

const memory = new Map<string, CachedImage>();

export function publicMediaUrl(listingId: string, filename: string) {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const sig = signMedia(listingId, filename, exp);
  return `/api/listing-media/${encodeURIComponent(listingId)}/${encodeURIComponent(filename)}?exp=${exp}&sig=${sig}`;
}

export function signMedia(listingId: string, filename: string, exp: number) {
  return createHmac("sha256", getSecret()).update(`${listingId}:${filename}:${exp}`).digest("hex");
}

export function verifyMediaSig(listingId: string, filename: string, expRaw: string, sig: string) {
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000) - 30) return false;
  if (exp > Math.floor(Date.now() / 1000) + TTL_SECONDS + 60) return false;
  if (!/^[a-f0-9]{32,128}$/i.test(sig || "")) return false;
  const expected = signMedia(listingId, filename, exp);
  if (expected.length !== sig.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) mismatch |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return mismatch === 0;
}

export function readCachedImage(path: string): CachedImage | null {
  const parsed = parseListingStoragePath(path);
  if (!parsed) return null;
  const key = cacheKey(parsed.path);
  const mem = memory.get(key);
  if (mem) return mem;
  try {
    const base = join(cacheDir(), key);
    const bytes = readFileSync(base);
    const meta = existsSync(`${base}.type`) ? readFileSync(`${base}.type`, "utf8").trim() : "image/jpeg";
    const cached = { bytes, contentType: meta || "image/jpeg" };
    memory.set(key, cached);
    return cached;
  } catch {
    return null;
  }
}

export function writeCachedImage(path: string, bytes: Buffer, contentType: string) {
  const parsed = parseListingStoragePath(path);
  if (!parsed) return;
  if (!bytes.length || bytes.length > MAX_CACHE_BYTES) return;
  const type = contentType.startsWith("image/") ? contentType : "image/jpeg";
  const key = cacheKey(parsed.path);
  const cached = { bytes, contentType: type };
  memory.set(key, cached);
  try {
    const base = join(cacheDir(), key);
    writeFileSync(base, bytes);
    writeFileSync(`${base}.type`, type);
  } catch {
    // Memory cache is enough for this process.
  }
}

export async function downloadListingImage(
  path: string,
  clients: Array<SupabaseClient | null | undefined>,
): Promise<CachedImage | null> {
  const parsed = parseListingStoragePath(path);
  if (!parsed) return null;
  const cached = readCachedImage(parsed.path);
  if (cached) return cached;
  for (const client of clients) {
    if (!client) continue;
    const { data, error } = await client.storage.from(LISTING_IMAGES_BUCKET).download(parsed.path);
    if (!error && data) {
      const buf = Buffer.from(await data.arrayBuffer());
      const type = data.type || "image/jpeg";
      writeCachedImage(parsed.path, buf, type);
      return { bytes: buf, contentType: type };
    }
    const signed = await client.storage.from(LISTING_IMAGES_BUCKET).createSignedUrl(parsed.path, 60);
    if (signed.data?.signedUrl) {
      try {
        const res = await fetch(signed.data.signedUrl);
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length) {
            const type = res.headers.get("content-type") || "image/jpeg";
            writeCachedImage(parsed.path, buf, type);
            return { bytes: buf, contentType: type };
          }
        }
      } catch {
        // try next client
      }
    }
  }
  return null;
}

export async function ingestListingImage(path: string, client: SupabaseClient) {
  return downloadListingImage(path, [client, createAdminSupabase()]);
}

export function mediaUrlForPath(path: string) {
  const parsed = parseListingStoragePath(path);
  if (!parsed) return null;
  return publicMediaUrl(parsed.listingId, parsed.filename);
}

export function mediaUrlsForPaths(paths: string[]) {
  const out: { id: string; url: string; filename: string }[] = [];
  const seen = new Set<string>();
  for (const path of paths) {
    const parsed = parseListingStoragePath(path);
    if (!parsed || seen.has(parsed.filename)) continue;
    seen.add(parsed.filename);
    out.push({
      id: parsed.filename,
      filename: parsed.filename,
      url: publicMediaUrl(parsed.listingId, parsed.filename),
    });
  }
  return out;
}

export { filenameFromStoragePath };
