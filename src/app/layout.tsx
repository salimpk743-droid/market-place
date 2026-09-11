import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";
import { PreviewHostBridge } from "@/components/preview-bridge";
import { ConfigBanner } from "@/components/ConfigBanner";
import { JsonLd } from "@/components/JsonLd";
import { BRAND, SUPPORT_EMAIL, getSiteUrl } from "@/lib/market/site";
import { getCurrentUser } from "@/lib/market/listings";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${BRAND} — Buy & sell used phones and mobile accessories in Pakistan`,
    template: `%s | ${BRAND}`,
  },
  description: "Search used iPhone, Samsung, AirPods, chargers, power banks, covers and more by city across Pakistan.",
  applicationName: BRAND,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: BRAND,
    locale: "en_PK",
    url: getSiteUrl(),
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: BRAND }],
  },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getCurrentUser();
  const { configured } = getSupabasePublicConfig();
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#12284f" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={`${plex.className} flex min-h-screen flex-col bg-page text-ink antialiased`}>
        <PreviewHostBridge />
        <SkipLink />
        <Header email={user?.email} />
        <ConfigBanner configured={configured} />
        {children}
        <Footer />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: BRAND,
            url: getSiteUrl(),
            potentialAction: {
              "@type": "SearchAction",
              target: `${getSiteUrl()}/browse?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: BRAND,
            url: getSiteUrl(),
            email: SUPPORT_EMAIL,
          }}
        />
        {process.env.NODE_ENV === "production" ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `if("serviceWorker" in navigator){navigator.serviceWorker.register("/sw.js");}`,
            }}
          />
        ) : (
          <script
            dangerouslySetInnerHTML={{
              __html: `if("serviceWorker" in navigator){navigator.serviceWorker.getRegistrations().then((rs)=>rs.forEach((r)=>r.unregister()));}`,
            }}
          />
        )}
      </body>
    </html>
  );
}
