import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SITEMAP_CORE_PATHS } from "./sitemap-core.ts";

describe("sitemap core paths", () => {
  it("keeps only always-indexable public pages", () => {
    assert.deepEqual(SITEMAP_CORE_PATHS, [
      "",
      "/phones",
      "/accessories",
      "/mobile-prices-in-pakistan",
      "/used-mobile-phones",
      "/used-mobile-phones/under-20000",
      "/used-mobile-phones/under-30000",
      "/used-mobile-phones/under-50000",
      "/used-mobile-phones/under-100000",
      "/iphone-18-price-in-pakistan",
      "/iphone-18-pro-price-in-pakistan",
      "/iphone-18-pro-max-price-in-pakistan",
      "/best-mobile-phones/under-30000",
      "/best-mobile-phones/under-50000",
      "/best-mobile-phones/under-100000",
      "/guides",
      "/guides/best-mobile-markets-in-pakistan",
      "/guides/best-mobile-market-in-karachi",
      "/guides/best-mobile-market-in-lahore",
      "/guides/best-mobile-market-in-islamabad",
      "/guides/best-mobile-market-in-rawalpindi",
      "/guides/best-mobile-market-in-multan",
      "/guides/best-mobile-market-in-faisalabad",
      "/guides/best-mobile-market-in-peshawar",
      "/guides/best-mobile-market-in-hyderabad",
      "/guides/best-mobile-market-in-quetta",
      "/guides/best-mobile-market-in-mardan",
      "/guides/best-mobile-market-in-gujranwala",
      "/guides/best-mobile-market-in-swat",
      "/guides/best-mobile-market-in-sukkur",
      "/guides/best-mobile-market-in-sialkot",
      "/guides/best-mobile-market-in-gujrat",
      "/guides/best-mobile-market-in-kasur",
      "/guides/best-mobile-market-in-jhang",
      "/guides/best-mobile-market-in-taxila",
      "/guides/best-mobile-market-in-abbottabad",
      "/guides/best-mobile-market-in-swabi",
      "/guides/best-mobile-market-in-buner",
      "/guides/best-mobile-market-in-kohat",
      "/guides/best-mobile-market-in-karak",
      "/guides/best-mobile-market-in-larkana",
      "/guides/authorized-mobile-dealers-in-pakistan",
      "/guides/inspect-used-phone",
      "/guides/buy-used-phone",
      "/guides/pta-status",
      "/guides/pta-tax",
      "/guides/battery-health",
      "/guides/common-scams",
      "/about",
      "/contact",
      "/buyer-safety",
      "/privacy",
      "/terms",
      "/seller-terms",
      "/rules",
      "/prohibited",
      "/return-policy",
    ]);
  });

  it("omits empty catalog, filter, and account URLs from the core set", () => {
    const set = new Set(SITEMAP_CORE_PATHS.map((path) => path || "/"));
    for (const path of [
      "/browse",
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
