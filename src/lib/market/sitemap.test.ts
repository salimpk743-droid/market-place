import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SITEMAP_CORE_PATHS } from "./sitemap-core.ts";

describe("sitemap core paths", () => {
  it("keeps only always-indexable public pages", () => {
    assert.deepEqual(SITEMAP_CORE_PATHS, [
      "",
      "/phones",
      "/accessories",
      "/guides",
      "/guides/inspect-used-phone",
      "/guides/pta-status",
      "/guides/battery-health",
      "/guides/common-scams",
      "/about",
      "/buyer-safety",
      "/privacy",
      "/terms",
      "/seller-terms",
      "/rules",
      "/prohibited",
    ]);
  });

  it("omits empty catalog, filter, and account URLs from the core set", () => {
    const set = new Set(SITEMAP_CORE_PATHS.map((path) => path || "/"));
    for (const path of [
      "/browse",
      "/contact",
      "/delete-account",
      "/pta-approved-phones",
      "/non-pta-phones",
      "/phones/apple",
      "/used-phones/islamabad",
      "/accessories/earbuds",
      "/login",
      "/sell",
    ]) {
      assert.equal(set.has(path), false, path);
    }
  });
});
