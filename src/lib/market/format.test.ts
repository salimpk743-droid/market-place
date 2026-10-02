import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { listingSeoTitle } from "./format.ts";

describe("listingSeoTitle", () => {
  const base = { brand: "Apple", model: "iPhone 13 Pro Max", storage_gb: 256, price_pkr: 120000, city_slug: "islamabad", pta_status: "official", condition: "9/10", category: "phone" };

  it("builds the used-phone title with storage, PTA, city and price", () => {
    assert.equal(listingSeoTitle(base), "Used Apple iPhone 13 Pro Max 256GB, PTA, Islamabad – Rs 120,000");
  });

  it("handles non-PTA, TB storage, box pack and missing fields", () => {
    assert.equal(listingSeoTitle({ ...base, pta_status: "non-pta", storage_gb: 1024 }), "Used Apple iPhone 13 Pro Max 1TB, Non-PTA, Islamabad – Rs 120,000");
    assert.equal(listingSeoTitle({ ...base, condition: "Box pack", storage_gb: null }), "Box-pack Apple iPhone 13 Pro Max, PTA, Islamabad – Rs 120,000");
    assert.equal(listingSeoTitle({ ...base, category: "earbuds", brand: "Apple", model: "AirPods Pro 2", storage_gb: null, pta_status: null, price_pkr: 25000 }), "Apple AirPods Pro 2, Islamabad – Rs 25,000");
  });
});
