import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, BRAND, SUPPORT_EMAIL } from "@/lib/market/site";

export const metadata: Metadata = {
  title: { absolute: "About Mobile Market: Used Phone Classifieds in Pakistan" },
  description:
    "Mobile Market is a Pakistan classifieds site for used phones and accessories. How ads work, how we handle PTA status, prices, reports and your data.",
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

          <h2 className="pt-2 text-lg font-semibold text-ink">How listings work</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Sellers sign in and post an ad with the brand, model, storage, condition, PTA status, city, area, price and photos.</li>
            <li>Ads must follow our <Link href="/rules" className="link">marketplace rules</Link> and <Link href="/prohibited" className="link">prohibited items list</Link>; ads reported for breaking them can be removed. The sell form stops a seller from posting the same item again at a similar price in the same area.</li>
            <li>Buyers contact the seller directly from the ad. The deal, payment and hand-over happen between buyer and seller.</li>
            <li>Sellers can mark an ad sold or remove it from <Link href="/my-ads" className="link">My ads</Link>.</li>
          </ul>

          <h2 className="pt-2 text-lg font-semibold text-ink">PTA status and prices</h2>
          <p>
            The PTA label on an ad (PTA approved, non-PTA, CPID or JV) is what the seller says. Always check the IMEI yourself; our{" "}
            <Link href="/guides/pta-status" className="link">PTA guide</Link> shows how. New-phone prices and PTA tax figures in our guides come from
            dated, named sources (official distributors, retailers, FBR documents) and show a &ldquo;last updated&rdquo; date. If we can&apos;t verify a figure,
            we leave it out.
          </p>

          <h2 className="pt-2 text-lg font-semibold text-ink">Reports, safety and your data</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Anyone can <Link href="/report" className="link">report an ad</Link> that looks fake, duplicated or against the rules.</li>
            <li>Read <Link href="/buyer-safety" className="link">buyer safety</Link> before meeting a seller or paying.</li>
            <li>See the <Link href="/privacy" className="link">privacy policy</Link>, <Link href="/terms" className="link">terms</Link>, <Link href="/return-policy" className="link">return policy</Link>, and how to <Link href="/delete-account" className="link">delete your account</Link>.</li>
          </ul>

          <h2 className="pt-2 text-lg font-semibold text-ink">Contact</h2>
          <p>
            Email{" "}
            <a className="link" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>{" "}
            or use the <Link href="/contact" className="link">contact page</Link>. The Android app is a Trusted Web Activity of this same website.
          </p>
        </div>
      </article>
    </main>
  );
}
