import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Page, PageTitle } from "@/components/ui";
import { absoluteUrl } from "@/lib/market/site";

const path = "/iphone-18-pro-max-price-in-pakistan";

export const metadata: Metadata = {
  title: "iPhone 18 Pro Max Price in Pakistan 2026 — PTA & Non-PTA",
  description:
    "Guide to iPhone 18 Pro Max price information in Pakistan, including PTA and non-PTA buying considerations, storage, used-market pricing and Mobile Market listings.",
  alternates: { canonical: absoluteUrl(path) },
};

export default function IPhone18ProMaxPage() {
  return (
    <Page className="max-w-4xl">
      <PageTitle
        kicker="Apple · iPhone 18 Pro Max"
        title="iPhone 18 Pro Max Price in Pakistan"
        description="Pakistan-focused price guidance, PTA considerations and links to the current Mobile Market marketplace."
      />
      <article className="prose prose-sm max-w-none text-ink-soft">
        <div className="card not-prose p-5 sm:p-6">
          <p className="section-kicker">Pricing</p>
          <h2 className="mt-1 text-xl text-ink">Compare official information with actual seller listings</h2>
          <p className="mt-2 text-sm text-muted">
            Market prices can differ by storage, PTA status, warranty, import route, condition and seller. Mobile Market will
            keep editorial estimates separate from live seller asking prices.
          </p>
        </div>
        <h2>iPhone 18 Pro Max price in Pakistan</h2>
        <p>
          For the iPhone 18 Pro Max, compare like-for-like devices before judging a price. Storage, PTA status, warranty and
          condition can move the final price substantially.
        </p>
        <h2>PTA and non-PTA iPhone 18 Pro Max</h2>
        <p>
          PTA status belongs to the individual device. Verify the IMEI and current status independently before paying. A
          marketplace seller declaration should not be treated as official verification.
        </p>
        <p>
          Use the <Link href="/guides/pta-status" className="link">PTA status guide</Link> for verification steps and browse
          <Link href="/non-pta-phones" className="link"> non-PTA phones</Link> when appropriate.
        </p>
        <h2>Used iPhone 18 Pro Max price in Pakistan</h2>
        <p>
          Used prices depend on battery health, condition, storage, warranty, accessories and PTA status. Once sellers post
          iPhone 18 Pro Max devices on Mobile Market, the marketplace can provide a live comparison of seller asking prices.
        </p>
        <div className="not-prose grid gap-3 sm:grid-cols-2">
          <Link className="card p-4 hover:border-brand/30" href="/iphone-18-price-in-pakistan">
            <p className="font-semibold text-ink">iPhone 18</p>
            <p className="mt-1 text-sm text-muted">Main Pakistan price hub</p>
          </Link>
          <Link className="card p-4 hover:border-brand/30" href="/iphone-18-pro-price-in-pakistan">
            <p className="font-semibold text-ink">iPhone 18 Pro</p>
            <p className="mt-1 text-sm text-muted">Pakistan price guide</p>
          </Link>
        </div>
        <h2>Frequently asked questions</h2>
        <h3>What is the iPhone 18 Pro Max price in Pakistan?</h3>
        <p>The price varies by storage, PTA status, warranty, import source, condition and seller.</p>
        <h3>Is the iPhone 18 Pro Max PTA approved?</h3>
        <p>PTA status is device-specific. Verify the IMEI and current status before buying.</p>
      </article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "iPhone 18 Pro Max Price in Pakistan", item: absoluteUrl(path) },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What is the iPhone 18 Pro Max price in Pakistan?", acceptedAnswer: { "@type": "Answer", text: "The price varies by storage, PTA status, warranty, import source, condition and seller." } },
            { "@type": "Question", name: "Is the iPhone 18 Pro Max PTA approved?", acceptedAnswer: { "@type": "Answer", text: "PTA status is device-specific. Verify the IMEI and current status before buying." } },
          ],
        }}
      />
    </Page>
  );
}
