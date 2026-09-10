import type { NextConfig } from "next";

const supabaseHost = (() => {
  try {
    const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return raw ? new URL(raw).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // grok-sandbox hosts are nested (a.b.c.grok-sandbox.com). `*.x` matches one
  // label; `**.x` matches the rest. Exact host covers the current preview.
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
    "*.grok-sandbox.com",
    "**.grok-sandbox.com",
    "*.hades-www.grok-sandbox.com",
    "*.grok-code-wild.hades-www.grok-sandbox.com",
    "**.grok.com",
  ],
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
  async redirects() {
    return [
      { source: "/accessories/power-banks", destination: "/accessories/power-bank", permanent: true },
      { source: "/accessories/chargers", destination: "/accessories/charger-cable", permanent: true },
      { source: "/accessories/covers", destination: "/accessories/cover-case", permanent: true },
      { source: "/accessories/screen-protectors", destination: "/accessories/screen-protector", permanent: true },
      { source: "/accessories/smartwatches", destination: "/accessories/smartwatch-band", permanent: true },
      { source: "/accessories/other", destination: "/accessories/other-accessory", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/.well-known/assetlinks.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [{ key: "Content-Type", value: "application/manifest+json" }],
      },
    ];
  },
};

export default nextConfig;
