import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ACCESSORY_CHECKED, ACCESSORY_PAGES } from "./accessory-hubs";
import { SITEMAP_CORE_LASTMOD, SITEMAP_CORE_PATHS } from "./sitemap-core";

describe("accessory hubs", () => {
  it("has unique paths, all in the sitemap with a lastmod", () => {
    const paths = ACCESSORY_PAGES.map((p) => p.path);
    assert.equal(new Set(paths).size, paths.length);
    for (const p of paths) {
      assert.ok(SITEMAP_CORE_PATHS.includes(p), `${p} missing from sitemap`);
      assert.ok(SITEMAP_CORE_LASTMOD[p], `${p} missing lastmod`);
    }
  });

  it("dates every page and every price, and links each price to a retailer product page", () => {
    for (const page of ACCESSORY_PAGES) {
      assert.equal(page.updated, ACCESSORY_CHECKED);
      assert.ok(page.sources.length > 0, `${page.path} has no sources`);
      assert.ok(page.faqs.length >= 3, `${page.path} needs FAQs`);
      for (const t of page.tables) {
        for (const r of t.rows) {
          assert.ok(Number.isInteger(r.pkr) && r.pkr > 1000 && r.pkr < 500000, `${r.name} price looks wrong`);
          assert.match(r.href, /^https:\/\/(priceoye\.pk\/wireless-earbuds\/|www\.shophive\.com\/)[a-z0-9-/]+$/, r.href);
        }
      }
    }
  });

  it("keeps internal links relative and points hubs at real listing pages", () => {
    for (const page of ACCESSORY_PAGES) {
      const links = [...page.related, ...page.sections.flatMap((s) => s.links ?? [])];
      for (const l of links) assert.ok(l.href.startsWith("/"), `${page.path}: ${l.href}`);
    }
    const hubs = ACCESSORY_PAGES.filter((p) => p.path.startsWith("/accessories/"));
    for (const h of hubs) {
      assert.ok(h.related.some((l) => l.href === "/accessories/earbuds" || l.href === "/accessories/headphones"), h.path);
    }
  });
});
