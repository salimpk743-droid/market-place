import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Mobile market and used phone guides",
  description:
    "Question guides for Pakistan: best mobile markets and shop names in Karachi, Lahore, Islamabad and Rawalpindi, authorized Apple and Samsung dealers, PTA, battery health and scams.",
  alternates: { canonical: absoluteUrl("/guides") },
};

const GUIDES = [
  { href: "/guides/best-mobile-markets-in-pakistan", title: "What are the best mobile markets in Pakistan?", body: "Karachi, Lahore, Islamabad and Rawalpindi: the markets people actually walk, and what to check before you pay." },
  { href: "/guides/best-mobile-market-in-karachi", title: "What is the best mobile market in Karachi?", body: "Saddar, Star City Mall and Amma Tower, plus Saddar shop names with a published address." },
  { href: "/guides/best-mobile-market-in-lahore", title: "What is the best mobile market in Lahore?", body: "Hafeez Centre and Hall Road, with shop numbers from public lists." },
  { href: "/guides/best-mobile-market-in-islamabad", title: "What is the best mobile market in Islamabad?", body: "Blue Area, G-9, Centaurus and F-6, with shop names and shop numbers." },
  { href: "/guides/best-mobile-market-in-rawalpindi", title: "What is the best mobile market in Rawalpindi?", body: "Singapore Plaza and the other Saddar counters Samsung names." },
  { href: "/guides/authorized-mobile-dealers-in-pakistan", title: "Who are the authorized Apple dealers in Pakistan?", body: "No Apple Store. How to check Apple, Samsung and other brand dealers." },
  { href: "/guides/inspect-used-phone", title: "Inspect a used phone before you pay", body: "Screen, cameras, IMEI, ports, and a meeting checklist." },
  { href: "/guides/pta-status", title: "Non-PTA meaning: PTA approved vs non-PTA", body: "PTA full form, the 60-day rule, JV and CPID, *8484# and how to check an IMEI." },
  { href: "/guides/pta-tax", title: "PTA tax on mobile phones (2026-27)", body: "FBR slabs, a calculator, iPhone 17 amounts and FBR values for used phones." },
  { href: "/guides/battery-health", title: "Battery health on used phones", body: "What the percentage means and how people fake it." },
  { href: "/guides/common-scams", title: "Common used-phone scams in Pakistan", body: "Advance payment, dummy units, cloned IMEIs, and too-cheap ads." },
  { href: "/buyer-safety", title: "Buyer safety", body: "Public meetings, no advance money, and reporting." },
];

export default function GuidesPage() {
  return (
    <main id="main" className="page max-w-3xl">
      <p className="section-kicker">Advice</p>
      <h1 className="mt-1 text-2xl sm:text-3xl">Guides</h1>
      <p className="mt-2 text-sm text-muted">
        Written for people comparing mobile markets and used phones in Pakistan. City pages name buildings and shops that publish an address. They are not a ranking, and they are not a government certificate.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <Link href="/used-mobile-phones" className="link">Used phones in Pakistan</Link>
        <Link href="/mobile-prices-in-pakistan" className="link">Mobile prices in Pakistan</Link>
        <Link href="/pta-approved-phones" className="link">PTA approved phones</Link>
        <Link href="/non-pta-phones" className="link">Non-PTA phones</Link>
      </div>
      <ul className="mt-8 space-y-3">
        {GUIDES.map((g) => (
          <li key={g.href}>
            <Link href={g.href} className="card block p-5 hover:border-brand/30">
              <p className="text-base font-semibold text-brand-ink">{g.title}</p>
              <p className="mt-1 text-sm text-muted">{g.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
