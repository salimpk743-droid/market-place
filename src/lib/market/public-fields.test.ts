import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PUBLIC_LISTING_COLUMNS } from "./types.ts";
import { assertNoContactPhone, assertNoPrivateListingFields, stripPrivateFields } from "./public-fields.ts";

describe("public listing fields", () => {
  it("never includes contact_phone in the public column list", () => {
    assert.equal(PUBLIC_LISTING_COLUMNS.includes("contact_phone" as (typeof PUBLIC_LISTING_COLUMNS)[number]), false);
    assert.equal(
      (PUBLIC_LISTING_COLUMNS as readonly string[]).includes("seller_id"),
      false,
    );
  });

  it("strips contact_phone even if a row contains it", () => {
    const row = stripPrivateFields({
      id: "abc",
      seller_id: "u1",
      brand: "Apple",
      model: "iPhone 13",
      storage_gb: 128,
      ram_gb: null,
      price_pkr: 120000,
      city_slug: "lahore",
      area: "DHA",
      pta_status: "official",
      battery_health: 88,
      condition: "9/10",
      description: "Clean",
      color: "Blue",
      year: 2022,
      image_url: null,
      seller_name: "Ali",
      status: "active",
      featured: false,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: null,
      slug: "iphone-13-lahore",
      contact_phone: "03001234567",
      contactPhone: "03001234567",
    });
    assert.equal("contact_phone" in row, false);
    assert.equal("contactPhone" in row, false);
    assert.equal("seller_id" in row, false);
    assert.equal(row.brand, "Apple");
    assert.equal(row.id, "abc");
  });

  it("assertNoContactPhone throws on leaked keys", () => {
    assert.throws(() => assertNoContactPhone({ id: "1", contact_phone: "0300" }), /contact_phone leaked/);
    assert.throws(() => assertNoContactPhone([{ nested: { contactPhone: "x" } }]), /contact_phone leaked/);
    assert.doesNotThrow(() => assertNoContactPhone({ id: "1", seller_name: "Ali" }));
  });

  it("assertNoPrivateListingFields rejects seller_id too", () => {
    assert.throws(() => assertNoPrivateListingFields({ id: "1", seller_id: "u1" }), /seller_id leaked/);
    assert.doesNotThrow(() => assertNoPrivateListingFields({ id: "1", image_url: "/api/listing-media/x/a.jpg" }));
  });
});
