import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/market/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      // Keep public listing media crawlable because these URLs are used as
      // image resources on otherwise indexable listing pages.
      allow: ["/", "/api/listing-media/"],
      // Keep private/account flows and application APIs out of crawling.
      // Public SEO pages are not covered by these rules.
      disallow: [
        "/sell",
        "/my-ads",
        "/account",
        "/register",
        "/forgot-password",
        "/auth/",
        "/api/",
      ],
    },
    sitemap: base + "/sitemap.xml",
    host: base,
  };
}
