import { test } from "node:test";
import assert from "node:assert/strict";
import { estimatePtaTax } from "./pta-tax.ts";

test("flagship over US$700 on CNIC, active taxpayer", () => {
  const r = estimatePtaTax({ usd: 1000, pkrPerUsd: 280, route: "cnic", activeTaxpayer: true })!;
  assert.equal(r.valuePkr, 280000);
  assert.equal(r.regulatoryDuty, 17600);
  assert.equal(r.salesTaxRate, 0.25);
  assert.equal(r.salesTax, 70000);
  assert.equal(r.incomeTax, 11500);
  assert.equal(r.handsetLevy, 16000);
  assert.equal(r.total, 17600 + 70000 + 11500 + 16000);
});

test("baggage route skips s.148 income tax; band edges are inclusive", () => {
  const r = estimatePtaTax({ usd: 500, pkrPerUsd: 280, route: "baggage", activeTaxpayer: false })!;
  assert.equal(r.incomeTax, 0);
  assert.equal(r.salesTaxRate, 0.18);
  assert.equal(r.regulatoryDuty, 12000);
  assert.equal(r.handsetLevy, 4000);
});

test("non-ATL doubles income tax", () => {
  const r = estimatePtaTax({ usd: 150, pkrPerUsd: 280, route: "cnic", activeTaxpayer: false })!;
  assert.equal(r.incomeTax, 1860);
  assert.equal(r.handsetLevy, 600);
});

test("rejects bad input", () => {
  assert.equal(estimatePtaTax({ usd: 0, pkrPerUsd: 280, route: "cnic", activeTaxpayer: true }), null);
});
