import { test } from "node:test";
import assert from "node:assert/strict";
import { placeGuides } from "./place-guides";
import { SITEMAP_CORE_PATHS } from "./sitemap-core";

const NEW_CITIES = ["sialkot", "gujrat", "kasur", "jhang", "taxila", "abbottabad", "swabi", "buner", "kohat", "karak", "larkana"];

test("place guides have unique slugs, FAQs and sitemap entries", () => {
  const slugs = placeGuides.map((g) => g.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const city of NEW_CITIES) {
    const slug = `best-mobile-market-in-${city}`;
    assert.ok(slugs.includes(slug), slug);
    assert.ok(SITEMAP_CORE_PATHS.includes(`/guides/${slug}`), `sitemap ${slug}`);
  }
  for (const g of placeGuides) {
    assert.ok(g.faqs.length >= 3, `${g.slug} faqs`);
    assert.ok(g.sources.length >= 1, `${g.slug} sources`);
    const headings = g.sections.map((s) => s.heading);
    assert.equal(new Set(headings).size, headings.length, `${g.slug} duplicate heading`);
    const questions = g.faqs.map((f) => f.question);
    assert.equal(new Set(questions).size, questions.length, `${g.slug} duplicate question`);
    for (const s of g.sections) for (const l of s.links ?? []) assert.ok(l.href.startsWith("/"), `${g.slug} ${l.href}`);
    const related = g.related.map((r) => r.href);
    assert.equal(new Set(related).size, related.length, `${g.slug} duplicate related link`);
    const sources = g.sources.map((r) => r.href);
    assert.equal(new Set(sources).size, sources.length, `${g.slug} duplicate source`);
    for (const s of g.sections) {
      const hrefs = (s.links ?? []).map((l) => l.href);
      assert.equal(new Set(hrefs).size, hrefs.length, `${g.slug} duplicate section link`);
      assert.equal(new Set(s.paragraphs).size, s.paragraphs.length, `${g.slug} duplicate paragraph`);
    }
  }
});

test("FAQ questions are unique across guides", () => {
  const all = placeGuides.flatMap((g) => g.faqs.map((f) => f.question));
  assert.equal(new Set(all).size, all.length);
});
