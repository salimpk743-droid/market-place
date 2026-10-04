/**
 * Pure helpers for posting an ad. No browser or Supabase imports, so every rule here is unit-tested
 * (post-ad.test.ts). SellForm wires them to the real browser APIs and Supabase client.
 *
 * Posting order (so a half-finished ad is never live):
 *   1. Photos are checked, shrunk and uploaded the moment they are picked (3 at a time).
 *   2. Publish creates the ad as a hidden draft (status "pending_moderation") with an id made once per form.
 *   3. Photo rows are saved, then cover + status "active" are set in one update.
 *   4. The media cache warm-up ("ingest") runs in the background and never blocks posting.
 */
import { serializeStoragePaths } from "./media-path";

export const PHOTO_CONCURRENCY = 3;
/** Raw file limit before shrinking on the phone. Photos are resized to ~1200px / ~350 KB before upload. */
export const MAX_RAW_PHOTO_BYTES = 40 * 1024 * 1024;
export const DRAFT_STATUS = "pending_moderation";

const DIRECT_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DIRECT_EXT = /\.(jpe?g|png|webp)$/i;
const HEIC_TYPES = ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"];
const HEIC_EXT = /\.(heic|heif)$/i;

export const PHOTO_MESSAGES = {
  notImage: "This file is not a photo. Please choose a JPG, PNG or iPhone (HEIC) photo.",
  tooBig: "This photo is too big (over 40 MB). Please choose a smaller photo.",
  badName: "This file name is not allowed. Please rename the photo and try again.",
  heicFailed:
    "This iPhone photo (HEIC) could not be opened here. On your iPhone go to Settings > Camera > Formats > Most Compatible, or send the photo to yourself on WhatsApp and pick it again.",
  readFailed: "This photo could not be opened. Please try another photo.",
  uploadFailed: "Upload failed. Check your internet and tap Retry.",
} as const;

export function isHeicFile(file: { type?: string; name?: string }) {
  const type = String(file.type || "").toLowerCase();
  return HEIC_TYPES.includes(type) || HEIC_EXT.test(String(file.name || ""));
}

export type PhotoPrecheck = { kind: "direct" } | { kind: "heic" } | { kind: "reject"; message: string };

/** Decide what to do with a picked file before reading it. No size limit below 40 MB: big photos are shrunk on the phone. */
export function precheckPhoto(file: { type?: string; name?: string; size: number }): PhotoPrecheck {
  const name = String(file.name || "");
  if (name.includes("..") || name.includes("/") || name.includes("\\") || /\.(svg|html?|js|exe|php|sh)$/i.test(name)) {
    return { kind: "reject", message: PHOTO_MESSAGES.badName };
  }
  if (file.size > MAX_RAW_PHOTO_BYTES) return { kind: "reject", message: PHOTO_MESSAGES.tooBig };
  if (isHeicFile(file)) return { kind: "heic" };
  const type = String(file.type || "").toLowerCase();
  if (DIRECT_TYPES.includes(type) || (!type && DIRECT_EXT.test(name))) return { kind: "direct" };
  return { kind: "reject", message: PHOTO_MESSAGES.notImage };
}

/** Synchronous lock: the first tap wins, every later tap is ignored until release(). */
export function createSubmitLock() {
  let held = false;
  return {
    tryAcquire() {
      if (held) return false;
      held = true;
      return true;
    },
    release() {
      held = false;
    },
    get held() {
      return held;
    },
  };
}

/**
 * Small work queue: runs at most `limit` tasks at once and starts the next one as soon as a slot frees up.
 * Used for photo uploads, so photos picked at different times still share the same 3 lanes.
 */
export function createTaskQueue<T>(limit: number, worker: (item: T) => Promise<unknown>) {
  const queue: T[] = [];
  let active = 0;
  const idle: (() => void)[] = [];
  const settle = () => {
    if (!active && !queue.length) idle.splice(0).forEach((fn) => fn());
  };
  const pump = () => {
    while (active < Math.max(1, limit) && queue.length) {
      const item = queue.shift() as T;
      active++;
      Promise.resolve()
        .then(() => worker(item))
        .catch(() => {
          // the worker reports its own errors; one failed photo must not stop the others
        })
        .finally(() => {
          active--;
          pump();
          settle();
        });
    }
  };
  return {
    add(item: T) {
      queue.push(item);
      pump();
    },
    get active() {
      return active;
    },
    get waiting() {
      return queue.length;
    },
    /** Resolves when nothing is running or waiting. */
    onIdle() {
      return !active && !queue.length ? Promise.resolve() : new Promise<void>((resolve) => idle.push(resolve));
    },
  };
}

type DbError = { code?: string; message?: string; status?: number } | null | undefined;

/** Postgres unique violation (23505) or HTTP 409: the row was already created by an earlier try. */
export function isDuplicateKeyError(err: DbError) {
  if (!err) return false;
  return err.code === "23505" || err.status === 409 || /duplicate key/i.test(err.message || "");
}

export type PublishPhoto = { path: string };
export type PublishStage = "create" | "save" | "photos" | "activate";

export type PublishDeps = {
  insertListing: (row: Record<string, unknown>) => Promise<{ error?: DbError }>;
  updateListing: (id: string, patch: Record<string, unknown>) => Promise<{ error?: DbError }>;
  insertImageRow: (row: Record<string, unknown>) => Promise<{ error?: DbError }>;
  /** Background cache warm-up. Its result is never awaited by publishAd. */
  ingest?: (listingId: string, path: string) => Promise<unknown>;
  log?: (stage: string, message: string, listingId: string) => void;
};

export type PublishInput = {
  listingId: string;
  sellerId: string;
  payload: Record<string, unknown>;
  /** Uploaded photos in display order (new uploads only). */
  photos: PublishPhoto[];
  /** Paths already saved on the ad (edit mode). */
  existingPaths?: string[];
  /** Paths whose listing_images row was saved by an earlier try; they are not inserted again. */
  recordedPaths?: Iterable<string>;
  mode: "create" | "edit";
  /** Current status in edit mode. A draft (pending) becomes active once it has a photo. */
  currentStatus?: string | null;
};

export type PublishResult =
  | { ok: true; listingId: string; created: boolean; recordedPaths: string[]; status: string | null }
  | { ok: false; listingId: string; stage: PublishStage; message: string; draftSaved: boolean; recordedPaths: string[] };

function errText(err: DbError) {
  return String(err?.message || err?.code || "unknown error").slice(0, 300);
}

export async function publishAd(deps: PublishDeps, input: PublishInput): Promise<PublishResult> {
  const { listingId, sellerId, payload } = input;
  const recorded = new Set(input.recordedPaths || []);
  const log = deps.log || (() => {});
  let created = false;
  let draftSaved = input.mode === "edit";

  if (input.mode === "create") {
    const { error } = await deps.insertListing({ ...payload, id: listingId, seller_id: sellerId, status: DRAFT_STATUS });
    if (error && !isDuplicateKeyError(error)) {
      log("create", errText(error), listingId);
      return { ok: false, listingId, stage: "create", message: errText(error), draftSaved: false, recordedPaths: [...recorded] };
    }
    if (error) {
      // An earlier try already created this draft: bring its details up to date instead of making a second ad.
      const upd = await deps.updateListing(listingId, payload);
      if (upd.error) {
        log("save", errText(upd.error), listingId);
        return { ok: false, listingId, stage: "save", message: errText(upd.error), draftSaved: true, recordedPaths: [...recorded] };
      }
    } else {
      created = true;
    }
    draftSaved = true;
  } else {
    const { error } = await deps.updateListing(listingId, payload);
    if (error) {
      log("save", errText(error), listingId);
      return { ok: false, listingId, stage: "save", message: errText(error), draftSaved, recordedPaths: [...recorded] };
    }
  }

  const existing = input.existingPaths || [];
  const fresh = input.photos.map((p) => p.path).filter((p) => !existing.includes(p));
  for (let i = 0; i < fresh.length; i++) {
    const path = fresh[i];
    if (recorded.has(path)) continue;
    const { error } = await deps.insertImageRow({
      listing_id: listingId,
      seller_id: sellerId,
      storage_path: path,
      public_url: path,
      sort_order: existing.length + i,
    });
    if (error && !isDuplicateKeyError(error)) {
      log("photos", errText(error), listingId);
      return { ok: false, listingId, stage: "photos", message: errText(error), draftSaved, recordedPaths: [...recorded] };
    }
    recorded.add(path);
  }

  const all = [...existing, ...fresh];
  const patch: Record<string, unknown> = {};
  const imageValue = serializeStoragePaths(all);
  if (imageValue) patch.image_url = imageValue;
  let status: string | null = input.currentStatus ?? null;
  if (input.mode === "create" || (input.currentStatus === DRAFT_STATUS && all.length > 0)) {
    patch.status = "active";
    status = "active";
  }
  if (Object.keys(patch).length) {
    const { error } = await deps.updateListing(listingId, patch);
    if (error) {
      log("activate", errText(error), listingId);
      return { ok: false, listingId, stage: "activate", message: errText(error), draftSaved, recordedPaths: [...recorded] };
    }
  }

  if (deps.ingest) {
    for (const path of fresh) {
      deps.ingest(listingId, path).catch((err: unknown) => log("ingest", err instanceof Error ? err.message : String(err), listingId));
    }
  }
  return { ok: true, listingId, created, recordedPaths: [...recorded], status };
}

/** Plain-language message for a failed publish. The form keeps everything the seller typed. */
export function publishFailureMessage(result: Extract<PublishResult, { ok: false }>, offline = false) {
  if (offline) return "No internet connection. Your details are still here. Connect and tap Publish again.";
  if (result.stage === "create") return "Your ad could not be saved. Your details are still here. Please tap Publish again.";
  if (result.stage === "save") return "Your changes could not be saved. Your details are still here. Please tap Save again.";
  return "Your ad is saved as a hidden draft, but the photos could not be attached. Tap Publish again, or open the draft to finish it.";
}

/** Index of listing_images rows → first photo path per listing (lowest sort_order). */
export function firstImagePathByListing(rows: readonly { listing_id?: unknown; storage_path?: unknown; public_url?: unknown; sort_order?: unknown }[]) {
  const best = new Map<string, { path: string; order: number }>();
  for (const row of rows) {
    const id = String(row.listing_id || "");
    const path = String(row.storage_path || row.public_url || "");
    if (!id || !path) continue;
    const order = Number(row.sort_order) || 0;
    const cur = best.get(id);
    if (!cur || order < cur.order) best.set(id, { path, order });
  }
  return new Map([...best].map(([id, v]) => [id, v.path]));
}

/** Fill a missing cover from the ad's first saved photo. Rows that already have a cover are untouched. */
export function applyCoverFallback<T extends { id: string; image_url?: string | null }>(rows: readonly T[], firstPaths: Map<string, string>): T[] {
  return rows.map((row) => (row.image_url ? row : firstPaths.has(row.id) ? { ...row, image_url: firstPaths.get(row.id)! } : row));
}

export type PriceRef = { newFrom: number; path: string };
export type PriceHint = { kind: "high" | "low"; text: string; path: string };

/**
 * Gentle hint (never blocks) when a used price is far from the new price on our price page:
 * above the lowest verified new price, or under a quarter of it (often a missing zero).
 */
export function priceHint(price: number, ref: PriceRef | null | undefined, boxPack = false): PriceHint | null {
  if (!ref || !Number.isFinite(price) || price <= 0 || !ref.newFrom) return null;
  const fmt = (n: number) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;
  const highAt = boxPack ? ref.newFrom * 1.15 : ref.newFrom;
  if (price > highAt) {
    return { kind: "high", path: ref.path, text: `This is more than the new price on our price page (from ${fmt(ref.newFrom)}). Buyers may skip it. Please check the price.` };
  }
  if (price < ref.newFrom * 0.25) {
    return { kind: "low", path: ref.path, text: `This looks very low. The new price starts from ${fmt(ref.newFrom)}. Please check you typed it correctly (zeros).` };
  }
  return null;
}

export const SELL_PREFS_KEY = "mm.sell.prefs.v1";
export type SellPrefs = { city?: string; area?: string; sellerName?: string; contactPhone?: string };

/** Parse saved seller details (city, area, name, phone) from localStorage text. Never throws. */
export function parseSellPrefs(raw: string | null | undefined): SellPrefs {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    if (!v || typeof v !== "object") return {};
    const pick = (k: string, max: number) => (typeof v[k] === "string" ? String(v[k]).slice(0, max) : undefined);
    return { city: pick("city", 80), area: pick("area", 80), sellerName: pick("sellerName", 80), contactPhone: pick("contactPhone", 20) };
  } catch {
    return {};
  }
}
