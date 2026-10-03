import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BRAND_HUBS } from "./brand-hubs.ts";
import catalog from "../catalog-data.json" with { type: "json" };

const ISO = /^\d{4}-\d{2}-\d{2}$/;

describe("brand hubs", () => {
  it("has one hub per phone brand", () => {
    const brands = (catalog as { BRANDS: { slug: string }[] }).BRANDS.map((b) => b.slug).sort();
    assert.deepEqual(BRAND_HUBS.map((h) => h.slug).sort(), brands);
  });

  it("every extra price cites a dated source on the same row", () => {
    for (const h of BRAND_HUBS) {
      assert.match(h.updated, ISO);
      for (const m of h.extraPrices || []) {
        const ids = new Set(m.sources.map((s) => s.id));
        for (const s of m.sources) assert.match(s.date, ISO, `${h.slug} ${m.model}`);
        for (const v of m.variants) {
          for (const pt of [...(v.official || []), ...(v.ptaRetail || []), ...(v.nonPta || [])]) {
            assert.ok(ids.has(pt.source), `${h.slug} ${m.model} ${v.storage}`);
            assert.ok(Number.isInteger(pt.pkr) && pt.pkr > 10000, `${h.slug} ${m.model} price`);
          }
        }
      }
    }
  });

  it("has FAQs, links to the PTA guides and unique questions", () => {
    for (const h of BRAND_HUBS) {
      assert.ok(h.faqs.length >= 4, h.slug);
      assert.equal(new Set(h.faqs.map((f) => f.question)).size, h.faqs.length, h.slug);
      const hrefs = h.links.map((l) => l.href);
      assert.ok(hrefs.includes("/guides/pta-tax") && hrefs.includes("/guides/pta-status"), h.slug);
      assert.ok(h.title.length <= 60, `${h.slug} title length ${h.title.length}`);
    }
  });
});
