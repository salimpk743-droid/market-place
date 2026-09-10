import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Used phone guides",
  description: "Practical guides for buying used phones in Pakistan: PTA, inspection, battery health and scams.",
  alternates: { canonical: absoluteUrl("/guides") },
};

const GUIDES = [
  { href: "/guides/inspect-used-phone", title: "Inspect a used phone before you pay", body: "Screen, cameras, IMEI, ports, and a meeting checklist." },
  { href: "/guides/pta-status", title: "PTA approved, Non-PTA, CPID and JV", body: "What sellers mean by these labels, and what you should still check." },
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
        Written for people actually buying and selling used phones in Pakistan. These pages are advice, not a government
        certificate.
      </p>
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
