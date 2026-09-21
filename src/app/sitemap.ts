import type { MetadataRoute } from "next";
import { ACCESSORY_SLUGS, BRANDS, MODELS_BY_BRAND, canonicalCategory, getCity } from "@/lib/market/catalog";
import { countBy, recentListings } from "@/lib/market/listings";
import { listingPath } from "@/lib/market/format";
import { getSiteUrl } from "@/lib/market/site";
import { SITEMAP_CORE_PATHS } from "@/lib/market/sitemap-core";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [brandCounts, cityCounts, categoryCounts, ptaCounts, recent] = await Promise.all([
    countBy("brand", "phone"),
    countBy("city_slug", "phone"),
    countBy("category"),
    countBy("pta_status", "phone"),
    recentListings(500),
  ]);

  const catalogPaths = new Set<string>();

  for (const brand of BRANDS) {
    catalogPaths.add(`/phones/${brand.slug}`);
    for (const model of MODELS_BY_BRAND[brand.name] || []) catalogPaths.add(`/phones/${brand.slug}/${slugify(model)}`);
  }

  for (const slug of Object.keys(cityCounts)) {
    if ((cityCounts[slug] || 0) > 0 && getCity(slug)) catalogPaths.add(`/used-phones/${slug}`);
  }

  for (const slug of ACCESSORY_SLUGS) {
    const total = Object.entries(categoryCounts).reduce((sum, [key, count]) => {
      return canonicalCategory(key) === slug ? sum + count : sum;
    }, 0);
    if (total > 0) catalogPaths.add(`/accessories/${slug}`);
  }

  if ((ptaCounts.official || 0) > 0) catalogPaths.add("/pta-approved-phones");
  if ((ptaCounts["non-pta"] || 0) > 0) catalogPaths.add("/non-pta-phones");

  for (const listing of recent.rows) {
    const brand = BRANDS.find((item) => item.name.toLowerCase() === listing.brand.toLowerCase());
    if (!brand || !getCity(listing.city_slug)) continue;
    if (listing.category && canonicalCategory(listing.category) !== "phone") continue;
    catalogPaths.add(`/used-phones/${listing.city_slug}/${brand.slug}`);
    if (listing.model && (MODELS_BY_BRAND[brand.name] || []).some((model) => slugify(model) === slugify(listing.model))) {
      catalogPaths.add(`/phones/${brand.slug}/${slugify(listing.model)}`);
    }
  }

  const listingEntries = recent.rows.map((listing) => ({
    url: `${base}${listingPath(listing)}`,
    lastModified: listing.updated_at || listing.created_at,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    ...SITEMAP_CORE_PATHS.map((path) => ({
      url: `${base}${path || "/"}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
    ...Array.from(catalogPaths).map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "daily" as const,
      priority: path.startsWith("/phones/") && path.split("/").length === 4 ? 0.6 : 0.5,
    })),
    ...listingEntries,
  ];
}
