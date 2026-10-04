import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DRAFT_STATUS,
  MAX_RAW_PHOTO_BYTES,
  PHOTO_MESSAGES,
  applyCoverFallback,
  createSubmitLock,
  createTaskQueue,
  firstImagePathByListing,
  isDuplicateKeyError,
  isHeicFile,
  parseSellPrefs,
  precheckPhoto,
  priceHint,
  publishAd,
  publishFailureMessage,
  type PublishDeps,
} from "./post-ad.ts";
import { OTHER_BRAND, SELL_EXTRA_PHONE_BRANDS, BRANDS, sellBrandsForCategory, hasPhoneBrandPage } from "./catalog.ts";
import { priceRefsForSellForm } from "./price-refs.ts";

const SELLER = "11111111-2222-4333-8444-555555555555";
const AD = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
const path = (n: number) => `${SELLER}/${AD}/0000000${n}-0000-4000-8000-000000000000.jpg`;

/** In-memory Supabase stand-in that behaves like the real tables (unique id, owner rows). */
function fakeDb(opts: { failImageInsertOnce?: boolean; failActivateOnce?: boolean } = {}) {
  const listings = new Map<string, Record<string, unknown>>();
  const images: Record<string, unknown>[] = [];
  const ingested: string[] = [];
  const logs: string[] = [];
  let failImage = Boolean(opts.failImageInsertOnce);
  let failActivate = Boolean(opts.failActivateOnce);
  const deps: PublishDeps = {
    async insertListing(row) {
      const id = String(row.id);
      if (listings.has(id)) return { error: { code: "23505", message: 'duplicate key value violates unique constraint "listings_pkey"' } };
      listings.set(id, { ...row });
      return {};
    },
    async updateListing(id, patch) {
      if (failActivate && "status" in patch) {
        failActivate = false;
        return { error: { message: "network error" } };
      }
      const row = listings.get(id);
      if (row) Object.assign(row, patch);
      return {};
    },
    async insertImageRow(row) {
      if (failImage) {
        failImage = false;
        return { error: { message: "Failed to fetch" } };
      }
      images.push(row);
      return {};
    },
    ingest: async (_id, p) => {
      ingested.push(p);
      throw new Error("ingest down"); // must never block or fail posting
    },
    log: (stage, message) => logs.push(`${stage}: ${message}`),
  };
  return { deps, listings, images, ingested, logs };
}

describe("photo checks at pick time", () => {
  it("accepts big camera photos (no 5 MB limit) and normal web formats", () => {
    assert.deepEqual(precheckPhoto({ type: "image/jpeg", size: 14 * 1024 * 1024, name: "IMG_1234.JPG" }), { kind: "direct" });
    assert.deepEqual(precheckPhoto({ type: "image/png", size: 1000, name: "a.png" }), { kind: "direct" });
    assert.deepEqual(precheckPhoto({ type: "", size: 1000, name: "a.webp" }), { kind: "direct" });
  });

  it("sends HEIC/HEIF to conversion instead of rejecting it", () => {
    assert.equal(isHeicFile({ type: "image/heic", name: "x" }), true);
    assert.equal(isHeicFile({ type: "", name: "IMG_0001.HEIC" }), true);
    assert.equal(isHeicFile({ type: "image/heif", name: "a.heif" }), true);
    assert.equal(isHeicFile({ type: "image/jpeg", name: "a.jpg" }), false);
    assert.deepEqual(precheckPhoto({ type: "", size: 2_000_000, name: "IMG_0001.HEIC" }), { kind: "heic" });
  });

  it("rejects non-photos, huge files and unsafe names with a clear message", () => {
    assert.deepEqual(precheckPhoto({ type: "application/pdf", size: 1000, name: "bill.pdf" }), { kind: "reject", message: PHOTO_MESSAGES.notImage });
    assert.deepEqual(precheckPhoto({ type: "image/jpeg", size: MAX_RAW_PHOTO_BYTES + 1, name: "a.jpg" }), { kind: "reject", message: PHOTO_MESSAGES.tooBig });
    assert.equal(precheckPhoto({ type: "image/svg+xml", size: 10, name: "x.svg" }).kind, "reject");
    assert.equal(precheckPhoto({ type: "image/jpeg", size: 10, name: "../x.jpg" }).kind, "reject");
  });
});

describe("submit lock (double tap)", () => {
  it("lets only the first of many taps through until released", () => {
    const lock = createSubmitLock();
    const results = [lock.tryAcquire(), lock.tryAcquire(), lock.tryAcquire()];
    assert.deepEqual(results, [true, false, false]);
    lock.release();
    assert.equal(lock.tryAcquire(), true);
  });
});

describe("photo upload queue", () => {
  it("runs at most 3 uploads at once and finishes all, even when one fails", async () => {
    let running = 0;
    let peak = 0;
    const done: number[] = [];
    const q = createTaskQueue<number>(3, async (n) => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((r) => setTimeout(r, 5 + (n % 3) * 3));
      running--;
      if (n === 2) throw new Error("upload failed");
      done.push(n);
    });
    for (let i = 0; i < 6; i++) q.add(i);
    await q.onIdle();
    assert.equal(peak, 3);
    assert.deepEqual(done.sort(), [0, 1, 3, 4, 5]);
    assert.equal(q.active, 0);
    await q.onIdle(); // resolves at once when idle
  });
});

describe("publishAd", () => {
  const payload = { brand: "Vivo", model: "Y11d", price_pkr: 48500, city_slug: "lahore" };

  it("creates a hidden draft, saves photos, then goes live with the cover in one step", async () => {
    const db = fakeDb();
    const updates: Record<string, unknown>[] = [];
    const deps = { ...db.deps, updateListing: async (id: string, patch: Record<string, unknown>) => (updates.push(patch), db.deps.updateListing(id, patch)) };
    const res = await publishAd(deps, { listingId: AD, sellerId: SELLER, payload, photos: [{ path: path(1) }, { path: path(2) }], mode: "create" });
    assert.equal(res.ok, true);
    const row = db.listings.get(AD)!;
    assert.equal(row.status, "active");
    assert.equal(row.image_url, JSON.stringify([path(1), path(2)]));
    assert.equal(db.images.length, 2);
    assert.deepEqual(db.images.map((r) => r.sort_order), [0, 1]);
    assert.deepEqual(updates, [{ image_url: JSON.stringify([path(1), path(2)]), status: "active" }]);
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(db.ingested.length, 2, "ingest is started in the background");
    assert.ok(db.logs.some((l) => l.startsWith("ingest")), "ingest failure is logged, not thrown");
  });

  it("the draft is inserted with pending status first (never live without photos)", async () => {
    const seen: string[] = [];
    const db = fakeDb();
    const deps = { ...db.deps, insertListing: async (row: Record<string, unknown>) => (seen.push(String(row.status)), db.deps.insertListing(row)) };
    await publishAd(deps, { listingId: AD, sellerId: SELLER, payload, photos: [{ path: path(1) }], mode: "create" });
    assert.deepEqual(seen, [DRAFT_STATUS]);
  });

  it("retry after a failed photo step reuses the same ad (23505 = already created) and makes no second ad", async () => {
    const db = fakeDb({ failImageInsertOnce: true });
    const input = { listingId: AD, sellerId: SELLER, payload, photos: [{ path: path(1) }, { path: path(2) }], mode: "create" as const };
    const first = await publishAd(db.deps, input);
    assert.equal(first.ok, false);
    if (!first.ok) {
      assert.equal(first.stage, "photos");
      assert.equal(first.draftSaved, true);
      assert.match(publishFailureMessage(first), /hidden draft/);
    }
    assert.equal(db.listings.get(AD)!.status, DRAFT_STATUS, "not live while photos are missing");
    const second = await publishAd(db.deps, { ...input, recordedPaths: first.recordedPaths, payload: { ...payload, price_pkr: 47000 } });
    assert.equal(second.ok, true);
    assert.equal(db.listings.size, 1);
    assert.equal(db.listings.get(AD)!.status, "active");
    assert.equal(db.listings.get(AD)!.price_pkr, 47000, "retry saves the latest form values");
    assert.equal(db.images.length, 2, "no duplicate photo rows");
  });

  it("retry after the activate step failed does not duplicate photo rows", async () => {
    const db = fakeDb({ failActivateOnce: true });
    const input = { listingId: AD, sellerId: SELLER, payload, photos: [{ path: path(1) }], mode: "create" as const };
    const first = await publishAd(db.deps, input);
    assert.equal(first.ok, false);
    if (!first.ok) assert.equal(first.stage, "activate");
    const second = await publishAd(db.deps, { ...input, recordedPaths: first.recordedPaths });
    assert.equal(second.ok, true);
    assert.equal(db.images.length, 1);
    assert.equal(db.listings.size, 1);
  });

  it("two parallel publishes of the same form session end with one ad", async () => {
    const db = fakeDb();
    const input = { listingId: AD, sellerId: SELLER, payload, photos: [{ path: path(1) }], mode: "create" as const };
    const [a, b] = await Promise.all([publishAd(db.deps, input), publishAd(db.deps, input)]);
    assert.equal(a.ok && b.ok, true);
    assert.equal(db.listings.size, 1);
  });

  it("a create error (not a duplicate) keeps nothing live and reports the stage", async () => {
    const db = fakeDb();
    const res = await publishAd({ ...db.deps, insertListing: async () => ({ error: { code: "42501", message: "permission denied" } }) }, { listingId: AD, sellerId: SELLER, payload, photos: [{ path: path(1) }], mode: "create" });
    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.stage, "create");
      assert.equal(res.draftSaved, false);
    }
    assert.equal(db.images.length, 0);
  });

  it("edit keeps existing photos, appends new ones and publishes a draft", async () => {
    const db = fakeDb();
    db.listings.set(AD, { id: AD, status: DRAFT_STATUS, image_url: null });
    const res = await publishAd(db.deps, { listingId: AD, sellerId: SELLER, payload, existingPaths: [path(1)], photos: [{ path: path(2) }], mode: "edit", currentStatus: DRAFT_STATUS });
    assert.equal(res.ok, true);
    assert.equal(db.listings.get(AD)!.status, "active");
    assert.equal(db.listings.get(AD)!.image_url, JSON.stringify([path(1), path(2)]));
    assert.deepEqual(db.images.map((r) => r.sort_order), [1]);
  });

  it("editing a sold ad never changes its status", async () => {
    const db = fakeDb();
    db.listings.set(AD, { id: AD, status: "sold", image_url: path(1) });
    await publishAd(db.deps, { listingId: AD, sellerId: SELLER, payload, existingPaths: [path(1)], photos: [], mode: "edit", currentStatus: "sold" });
    assert.equal(db.listings.get(AD)!.status, "sold");
  });

  it("recognises duplicate-key errors from Postgres and HTTP", () => {
    assert.equal(isDuplicateKeyError({ code: "23505" }), true);
    assert.equal(isDuplicateKeyError({ status: 409 }), true);
    assert.equal(isDuplicateKeyError({ message: "duplicate key value violates unique constraint" }), true);
    assert.equal(isDuplicateKeyError({ code: "42501" }), false);
    assert.equal(isDuplicateKeyError(null), false);
  });
});

describe("cover fallback", () => {
  it("uses the first saved photo (lowest sort order) when the cover is empty", () => {
    const first = firstImagePathByListing([
      { listing_id: "a", storage_path: "s/a/2.jpg", sort_order: 1 },
      { listing_id: "a", storage_path: "s/a/1.jpg", sort_order: 0 },
      { listing_id: "b", public_url: "s/b/1.jpg", sort_order: 0 },
      { listing_id: "", storage_path: "x" },
    ]);
    assert.equal(first.get("a"), "s/a/1.jpg");
    assert.equal(first.get("b"), "s/b/1.jpg");
    const rows = applyCoverFallback(
      [
        { id: "a", image_url: null },
        { id: "b", image_url: "s/b/cover.jpg" },
        { id: "c", image_url: null },
      ],
      first,
    );
    assert.deepEqual(rows, [
      { id: "a", image_url: "s/a/1.jpg" },
      { id: "b", image_url: "s/b/cover.jpg" },
      { id: "c", image_url: null },
    ]);
  });
});

describe("price hint", () => {
  const ref = { newFrom: 100_000, path: "/phones/x/y" };
  it("hints when the price is above the new price or suspiciously low, never blocks", () => {
    assert.equal(priceHint(120_000, ref)?.kind, "high");
    assert.equal(priceHint(110_000, ref, true), null, "box pack gets 15% room");
    assert.equal(priceHint(9_000, ref)?.kind, "low");
    assert.equal(priceHint(70_000, ref), null);
    assert.equal(priceHint(70_000, null), null);
    assert.match(priceHint(9_000, ref)!.text, /Rs 100,000/);
  });

  it("price refs come from verified price data and only link to pages that exist", () => {
    const refs = priceRefsForSellForm();
    assert.ok(Object.keys(refs).length > 10);
    for (const r of Object.values(refs)) {
      assert.ok(r.newFrom > 1000);
      assert.ok(r.path === "" || r.path.startsWith("/"));
    }
  });
});

describe("sell prefs autofill", () => {
  it("parses saved details and ignores junk", () => {
    assert.deepEqual(parseSellPrefs('{"city":"lahore","area":"Ichhra","sellerName":"Ali","contactPhone":"0300-1234567"}'), {
      city: "lahore",
      area: "Ichhra",
      sellerName: "Ali",
      contactPhone: "0300-1234567",
    });
    assert.deepEqual(parseSellPrefs("not json"), {});
    assert.deepEqual(parseSellPrefs(null), {});
    assert.deepEqual(parseSellPrefs('{"city":5}'), { city: undefined, area: undefined, sellerName: undefined, contactPhone: undefined });
  });
});

describe("sell-form brands", () => {
  it("offers the extra Pakistan brands and Other without adding browse brands", () => {
    const names = sellBrandsForCategory("phone").map((b) => b.name);
    for (const b of ["Honor", "Itel", "Motorola", "Nokia", "ZTE", "Sparx", "Asus", "Lenovo", "Other"]) assert.ok(names.includes(b), b);
    assert.equal(names[names.length - 1], OTHER_BRAND.name);
    assert.equal(new Set(names).size, names.length);
    for (const b of SELL_EXTRA_PHONE_BRANDS) assert.equal(BRANDS.some((x) => x.name === b.name), false, `${b.name} must not become a homepage/browse brand`);
    assert.equal(hasPhoneBrandPage("Honor"), false);
    assert.equal(hasPhoneBrandPage("Samsung"), true);
    assert.ok(sellBrandsForCategory("chargers").some((b) => b.name === "Other"));
  });
});
