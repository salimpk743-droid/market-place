import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/market/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/listing-media/"],
        disallow: ["/sell", "/my-ads", "/account", "/login", "/register", "/forgot-password", "/auth/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
