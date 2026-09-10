import type { MetadataRoute } from "next";
import { ACCESSORY_SLUGS, BRANDS, popularCities } from "@/lib/market/catalog";
import { recentListings } from "@/lib/market/listings";
import { listingPath } from "@/lib/market/format";
import { getSiteUrl } from "@/lib/market/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticPaths = [
    "",
    "/phones",
    "/browse",
    "/accessories",
    "/about",
    "/guides",
    "/guides/inspect-used-phone",
    "/guides/pta-status",
    "/guides/battery-health",
    "/guides/common-scams",
    "/buyer-safety",
    "/privacy",
    "/terms",
    "/seller-terms",
    "/rules",
    "/prohibited",
    "/contact",
    "/delete-account",
    "/pta-approved-phones",
    "/non-pta-phones",
  ];
  const { rows } = await recentListings(500);
  const listingEntries = rows.map((l) => ({
    url: `${base}${listingPath(l)}`,
    lastModified: l.updated_at || l.created_at,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));
  return [
    ...staticPaths.map((path) => ({
      url: `${base}${path || "/"}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
    ...BRANDS.map((b) => ({
      url: `${base}/phones/${b.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.5,
    })),
    ...ACCESSORY_SLUGS.map((slug) => ({
      url: `${base}/accessories/${slug}`,
      changeFrequency: "daily" as const,
      priority: 0.5,
    })),
    ...popularCities().map((c) => ({
      url: `${base}/used-phones/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.4,
    })),
    ...listingEntries,
  ];
}
