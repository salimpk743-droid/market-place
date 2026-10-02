import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MODEL_PRICES, getModelPriceData, lowestOfficialPrice, formatCheckedDate } from "./model-prices.ts";
import catalog from "../catalog-data.json" with { type: "json" };

const ISO = /^\d{4}-\d{2}-\d{2}$/;

describe("model price data", () => {
  it("every price point cites a source listed on the same model", () => {
    for (const m of MODEL_PRICES) {
      const ids = new Set(m.sources.map((s) => s.id));
      for (const v of m.variants) {
        for (const pt of [...(v.official || []), ...(v.ptaRetail || []), ...(v.nonPta || [])]) {
          assert.ok(ids.has(pt.source), `${m.model} ${v.storage} -> ${pt.source}`);
          assert.ok(Number.isInteger(pt.pkr) && pt.pkr > 10000, `${m.model} ${v.storage} price`);
        }
      }
      if (m.ptaTax) assert.ok(ids.has(m.ptaTax.source), `${m.model} tax source`);
      assert.ok(ids.has(m.specSource), `${m.model} spec source`);
    }
  });

  it("every source and model carries a date", () => {
    for (const m of MODEL_PRICES) {
      assert.match(m.lastUpdated, ISO);
      for (const s of m.sources) assert.match(s.date, ISO, `${m.model} ${s.id}`);
    }
  });

  it("every priced model exists in the phone catalog", () => {
    const models = (catalog as { MODELS_BY_BRAND: Record<string, string[]> }).MODELS_BY_BRAND;
    for (const m of MODEL_PRICES) assert.ok((models[m.brand] || []).includes(m.model), m.model);
  });

  it("official prices rise with storage", () => {
    for (const m of MODEL_PRICES) {
      const firsts = m.variants.map((v) => v.official?.[0]?.pkr).filter((x): x is number => typeof x === "number");
      for (let i = 1; i < firsts.length; i++) assert.ok(firsts[i] > firsts[i - 1], m.model);
    }
  });

  it("looks up models case-insensitively and finds the lowest official price", () => {
    const d = getModelPriceData("apple", "iphone 17 pro max");
    assert.ok(d);
    assert.equal(lowestOfficialPrice(d!), 535600);
    assert.equal(getModelPriceData("Apple", "iPhone 18"), undefined);
    assert.equal(formatCheckedDate("2026-10-02"), "2 Oct 2026");
  });
});
