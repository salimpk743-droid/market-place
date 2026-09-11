import type { MetadataRoute } from "next";
import { ACCESSORY_SLUGS, BRANDS, canonicalCategory, getCity } from "@/lib/market/catalog";
import { countBy, recentListings } from "@/lib/market/listings";
import { listingPath } from "@/lib/market/format";
import { getSiteUrl } from "@/lib/market/site";
import { SITEMAP_CORE_PATHS } from "@/lib/market/sitemap-core";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [brandCounts, cityCounts, categoryCounts, ptaCounts, recent] = await Promise.all([
    countBy("brand"),
    countBy("city_slug"),
    countBy("category"),
    countBy("pta_status"),
    recentListings(500),
  ]);

  const catalogPaths: string[] = [];

  for (const brand of BRANDS) {
    if ((brandCounts[brand.name] || 0) > 0) catalogPaths.push(`/phones/${brand.slug}`);
  }

  for (const slug of Object.keys(cityCounts)) {
    if ((cityCounts[slug] || 0) > 0 && getCity(slug)) catalogPaths.push(`/used-phones/${slug}`);
  }

  for (const slug of ACCESSORY_SLUGS) {
    const total = Object.entries(categoryCounts).reduce((sum, [key, count]) => {
      return canonicalCategory(key) === slug ? sum + count : sum;
    }, 0);
    if (total > 0) catalogPaths.push(`/accessories/${slug}`);
  }

  if ((ptaCounts.official || 0) > 0) catalogPaths.push("/pta-approved-phones");
  if ((ptaCounts["non-pta"] || 0) > 0) catalogPaths.push("/non-pta-phones");

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
    ...catalogPaths.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "daily" as const,
      priority: 0.5,
    })),
    ...listingEntries,
  ];
}
