import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
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
