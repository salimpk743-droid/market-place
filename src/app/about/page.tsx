import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, BRAND } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "About Mobile Market",
  description: "Mobile Market is a classifieds marketplace for used mobile phones and mobile accessories in Pakistan.",
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: {
    url: absoluteUrl("/about"),
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: BRAND }],
  },
};

export default function AboutPage() {
  return (
    <main id="main" className="page max-w-3xl">
      <article className="card p-6 sm:p-8">
        <p className="section-kicker">About</p>
        <h1 className="mt-1 text-2xl sm:text-3xl">About Mobile Market</h1>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-soft">
          <p>
            Mobile Market is a classifieds website for used mobile phones and mobile accessories in Pakistan — chargers,
            power banks, AirPods, headphones, covers and related items. Sellers post ads. Buyers search, inspect and
            contact sellers themselves. This is not a general classifieds site.
          </p>
          <p>
            We are not a shop, not a courier, and not a PTA or government verification service. We do not take payment
            for phones and we do not guarantee that a listing is accurate.
          </p>
          <p>
            The Android app is a Trusted Web Activity of this same website. Support:{" "}
            <a className="link" href="mailto:help@mobilemarket.pk">
              help@mobilemarket.pk
            </a>
            .
          </p>
          <p>
            <Link href="/#how-it-works" className="link">
              How it works
            </Link>
            {" · "}
            <Link href="/buyer-safety" className="link">
              Buyer safety
            </Link>
            {" · "}
            <Link href="/rules" className="link">
              Marketplace rules
            </Link>
          </p>
        </div>
      </article>
    </main>
  );
}
