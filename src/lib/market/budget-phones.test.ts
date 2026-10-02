import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BUDGETS, budgetPicks } from "./budget-phones.ts";
import { MODEL_PRICES, lowestPtaPrice } from "./model-prices.ts";

describe("budget phone pages", () => {
  it("keeps every pick inside its band, sorted high to low, with a dated source", () => {
    for (const b of BUDGETS) {
      const picks = budgetPicks(b);
      assert.ok(picks.length > 0, b.slug);
      for (let i = 0; i < picks.length; i++) {
        const p = picks[i];
        assert.ok(p.price <= b.max && p.price > b.min, `${b.slug} ${p.data.model}`);
        assert.match(p.sourceDate, /^\d{4}-\d{2}-\d{2}$/);
        if (i) assert.ok(picks[i - 1].price >= p.price);
      }
    }
  });

  it("never uses non-PTA prices", () => {
    const s26u = MODEL_PRICES.find((m) => m.model === "Galaxy S26 Ultra")!;
    assert.equal(lowestPtaPrice(s26u)?.pkr, 447999);
    for (const b of BUDGETS) for (const p of budgetPicks(b)) assert.ok(p.kind === "official" || p.kind === "ptaRetail");
  });
});
