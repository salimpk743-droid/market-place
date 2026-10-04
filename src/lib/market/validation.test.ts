import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  findDuplicateListing,
  formatPkMobile,
  isAllowedImageFile,
  isValidPkMobile,
  normalizePhone,
  parseListingForm,
  safeImageFilename,
  slugify,
  stripHtml,
  whatsappDigits,
} from "./validation.ts";
import { inferCategory } from "./catalog.ts";

describe("phone numbers", () => {
  it("accepts Pakistani mobiles in local and 92 form", () => {
    assert.equal(isValidPkMobile("03001234567"), true);
    assert.equal(isValidPkMobile("0300-1234567"), true);
    assert.equal(isValidPkMobile("923001234567"), true);
    assert.equal(isValidPkMobile("021-34567890"), false);
    assert.equal(isValidPkMobile("123"), false);
  });

  it("normalizes and formats for display and WhatsApp", () => {
    assert.equal(normalizePhone("923001234567"), "03001234567");
    assert.equal(formatPkMobile("03001234567"), "0300-1234567");
    assert.equal(whatsappDigits("03001234567"), "923001234567");
  });
});

describe("listing form", () => {
  it("rejects missing required fields and sanitizes HTML", () => {
    const parsed = parseListingForm({
      brand: "NotABrand",
      model: "<script>x</script>",
      city: "",
      price: "10",
      sellerName: "A",
      contactPhone: "123",
      description: "<img src=x onerror=alert(1)>nice phone",
    });
    assert.ok(parsed.errors.brand);
    assert.ok(parsed.errors.city);
    assert.ok(parsed.errors.price);
    assert.ok(parsed.errors.contactPhone);
    assert.equal(stripHtml("<b>ok</b>"), "ok");
  });

  it("accepts a complete legitimate listing", () => {
    const parsed = parseListingForm({
      brand: "Apple",
      model: "iPhone 13",
      city: "lahore",
      area: "DHA Phase 5",
      pta: "official",
      condition: "9/10",
      price: "145000",
      storage: "128",
      ram: "6",
      sellerName: "Ali Traders",
      contactPhone: "03001234567",
      description: "Box pack, 88% battery",
      color: "Blue",
      year: "2022",
      battery: "88",
    });
    assert.deepEqual(parsed.errors, {});
    assert.equal(parsed.data?.brand, "Apple");
    assert.equal(parsed.data?.contactPhone, "0300-1234567");
    assert.equal(parsed.data?.pricePkr, 145000);
  });

  it("accepts an accessory listing without PTA or storage", () => {
    const parsed = parseListingForm({
      category: "earbuds",
      brand: "Apple",
      model: "AirPods Pro 2",
      city: "lahore",
      area: "DHA Phase 5",
      condition: "9/10",
      price: "18000",
      sellerName: "Ali Traders",
      contactPhone: "03001234567",
      description: "Original, with box",
    });
    assert.deepEqual(parsed.errors, {});
    assert.equal(parsed.data?.category, "earbuds");
    assert.equal(parsed.data?.ptaStatus, null);
    assert.equal(parsed.data?.storageGb, null);
  });

  it("only requires the essentials: area is optional, Pakistan sell-only brands and Other are accepted", () => {
    const base = { brand: "Honor", model: "X9b", city: "lahore", pta: "official", condition: "9/10", price: "60000", sellerName: "Ali", contactPhone: "03001234567" };
    const parsed = parseListingForm(base);
    assert.deepEqual(parsed.errors, {});
    assert.equal(parsed.data?.area, "");
    assert.deepEqual(parseListingForm({ ...base, brand: "Other", model: "Vgotel Note 23" }).errors, {});
    assert.deepEqual(parseListingForm({ ...base, brand: "Itel" }).errors, {});
    assert.ok(parseListingForm({ ...base, area: "Not an area" }).errors.area);
    const empty = parseListingForm({});
    for (const k of ["brand", "model", "city", "condition", "price", "sellerName", "contactPhone"]) assert.ok(empty.errors[k], k);
    assert.equal(empty.errors.area, undefined);
    assert.match(empty.errors.price, /Please enter your price/);
  });

  it("maps accessory search terms to categories", () => {
    assert.equal(inferCategory("airpods pro"), "earbuds");
    assert.equal(inferCategory("20000mah power bank"), "power-banks");
    assert.equal(inferCategory("iPhone 13 cover"), "covers");
    assert.equal(inferCategory("65W GaN charger"), "chargers");
  });
});

describe("uploads and slugs", () => {
  it("blocks path traversal and oversize files", () => {
    assert.ok(isAllowedImageFile({ type: "image/jpeg", size: 1000, name: "ok.jpg" }) === null);
    assert.ok(isAllowedImageFile({ type: "image/svg+xml", size: 1000, name: "x.svg" }));
    assert.ok(isAllowedImageFile({ type: "image/jpeg", size: 9_000_000, name: "big.jpg" }));
    assert.ok(isAllowedImageFile({ type: "image/jpeg", size: 1000, name: "../secret.jpg" }));
  });

  it("generates a uuid filename with a safe extension", () => {
    const name = safeImageFilename("Photo.JPEG");
    assert.match(name, /^[0-9a-f-]{36}\.jpg$/);
    assert.equal(slugify("iPhone 13 Pro / Lahore"), "iphone-13-pro-lahore");
  });
});


describe("findDuplicateListing", () => {
  const now = Date.parse("2026-10-04T12:00:00Z");
  const input = { category: "phone", brand: "Nothing", model: "Phone (1)", storageGb: 128, citySlug: "lahore", pricePkr: 55000 };
  const row = { id: "a", category: "phone", brand: "Nothing", model: "Phone (1)", storage_gb: 128, city_slug: "lahore", area: "Canal Bank", price_pkr: 55000, status: "active", created_at: "2026-09-18T13:48:08Z" };

  it("flags the same phone re-posted at a similar price, in any area", () => {
    assert.equal(findDuplicateListing(input, [row], null, now)?.id, "a");
    assert.equal(findDuplicateListing({ ...input, pricePkr: 52000 }, [row], null, now)?.id, "a");
    assert.equal(findDuplicateListing({ ...input, model: "phone  (1)" }, [row], null, now)?.id, "a");
    assert.equal(findDuplicateListing(input, [{ ...row, area: "Samanabad" }], null, now)?.id, "a", "changing the area is not a new phone");
  });

  it("counts the seller's unfinished drafts from the last 24 hours", () => {
    const draft = { ...row, id: "d", status: "pending_moderation", created_at: "2026-10-04T08:00:00Z" };
    assert.equal(findDuplicateListing(input, [draft], null, now)?.id, "d");
    assert.equal(findDuplicateListing(input, [{ ...draft, created_at: "2026-10-02T08:00:00Z" }], null, now), null, "old abandoned draft");
    assert.equal(findDuplicateListing(input, [{ ...draft, created_at: null }], null, now), null);
  });

  it("never blocks the form's own ad id (retry)", () => {
    assert.equal(findDuplicateListing(input, [row], "a", now), null);
    assert.equal(findDuplicateListing(input, [{ ...row, status: "pending_moderation", created_at: "2026-10-04T11:59:00Z" }], "a", now), null);
  });

  it("allows genuinely different ads", () => {
    assert.equal(findDuplicateListing({ ...input, storageGb: 256 }, [row], null, now), null);
    assert.equal(findDuplicateListing({ ...input, citySlug: "karachi" }, [row], null, now), null);
    assert.equal(findDuplicateListing({ ...input, pricePkr: 40000 }, [row], null, now), null);
    assert.equal(findDuplicateListing(input, [{ ...row, status: "sold" }], null, now), null);
    assert.equal(findDuplicateListing(input, [{ ...row, status: "removed" }], null, now), null);
  });
});
