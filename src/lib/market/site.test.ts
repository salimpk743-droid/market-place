import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BRAND, DEFAULT_SITE_URL, SUPPORT_EMAIL, safeInternalPath } from "./site.ts";

describe("branding and redirects", () => {
  it("uses Mobile Market and the support mailbox", () => {
    assert.equal(BRAND, "Mobile Market");
    assert.equal(SUPPORT_EMAIL, "help@mobilemarket.pk");
    assert.equal(DEFAULT_SITE_URL, "https://mobilemarket.pk");
    assert.match(DEFAULT_SITE_URL, /^https:\/\/mobilemarket\.pk$/);
    assert.doesNotMatch(DEFAULT_SITE_URL, /vercel\.app/);
  });

  it("rejects open redirects", () => {
    assert.equal(safeInternalPath("/sell"), "/sell");
    assert.equal(safeInternalPath("/my-ads"), "/my-ads");
    assert.equal(safeInternalPath("https://evil.example/phish"), "/my-ads");
    assert.equal(safeInternalPath("//evil.example"), "/my-ads");
    assert.equal(safeInternalPath("\\evil"), "/my-ads");
    assert.equal(safeInternalPath("/%2f%2fevil.example"), "/my-ads");
    assert.equal(safeInternalPath("/login?next=https://evil.example"), "/my-ads");
    assert.equal(safeInternalPath(null, "/account"), "/account");
  });
});
