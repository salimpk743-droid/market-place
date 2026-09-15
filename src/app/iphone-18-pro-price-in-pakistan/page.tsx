import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Page, PageTitle } from "@/components/ui";
import { absoluteUrl } from "@/lib/market/site";

const path = "/iphone-18-pro-price-in-pakistan";

export const metadata: Metadata = {
  title: "iPhone 18 Pro Price in Pakistan 2026 — PTA & Non-PTA",
  description:
    "Guide to iPhone 18 Pro price information in Pakistan, including PTA and non-PTA buying considerations, storage, used-market pricing and Mobile Market listings.",
  alternates: { canonical: absoluteUrl(path) },
};

export default function IPhone18ProPage() {
  return (
    <Page className="max-w-4xl">
      <PageTitle
        kicker="Apple · iPhone 18 Pro"
        title="iPhone 18 Pro Price in Pakistan"
        description="Pakistan-focused price guidance, PTA considerations and links to the current Mobile Market marketplace."
      />
      <article className="prose prose-sm max-w-none text-ink-soft">
        <div className="card not-prose p-5 sm:p-6">
          <p className="section-kicker">Pricing</p>
          <h2 className="mt-1 text-xl text-ink">Treat estimates and seller prices separately</h2>
          <p className="mt-2 text-sm text-muted">
            The final Pakistan price depends on storage, PTA status, warranty, import route and seller condition. Mobile Market
            will surface actual seller listings separately from editorial price estimates.
          </p>
        </div>
        <h2>iPhone 18 Pro price in Pakistan</h2>
        <p>
          Buyers comparing the iPhone 18 Pro should look at storage, PTA status and warranty before comparing rupee prices.
          A higher asking price is not automatically better value, and a cheaper imported phone may require additional PTA-related costs.
        </p>
        <h2>PTA and non-PTA iPhone 18 Pro</h2>
        <p>
          PTA status is device-specific. Verify the IMEI and current status independently before buying. Seller-declared status on
          a classifieds listing should always be treated as a claim that needs checking.
        </p>
        <p>
          Read the <Link href="/guides/pta-status" className="link">PTA status guide</Link> and browse
          <Link href="/pta-approved-phones" className="link"> PTA approved phones</Link> when inventory is available.
        </p>
        <h2>Used iPhone 18 Pro price in Pakistan</h2>
        <p>
          Used pricing can vary with battery health, cosmetic condition, storage, warranty, accessories and PTA status. When
          listings become available on Mobile Market, buyers can compare real seller asking prices rather than relying only on published estimates.
        </p>
        <div className="not-prose grid gap-3 sm:grid-cols-2">
          <Link className="card p-4 hover:border-brand/30" href="/iphone-18-price-in-pakistan">
            <p className="font-semibold text-ink">iPhone 18</p>
            <p className="mt-1 text-sm text-muted">Main Pakistan price hub</p>
          </Link>
          <Link className="card p-4 hover:border-brand/30" href="/iphone-18-pro-max-price-in-pakistan">
            <p className="font-semibold text-ink">iPhone 18 Pro Max</p>
            <p className="mt-1 text-sm text-muted">Pakistan price and availability guide</p>
          </Link>
        </div>
        <h2>Frequently asked questions</h2>
        <h3>What is the iPhone 18 Pro price in Pakistan?</h3>
        <p>The price varies by storage, PTA status, warranty, import source and seller.</p>
        <h3>Is the iPhone 18 Pro PTA approved?</h3>
        <p>PTA status is device-specific, so verify the IMEI before purchase.</p>
      </article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "iPhone 18 Pro Price in Pakistan", item: absoluteUrl(path) },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What is the iPhone 18 Pro price in Pakistan?", acceptedAnswer: { "@type": "Answer", text: "The price varies by storage, PTA status, warranty, import source and seller." } },
            { "@type": "Question", name: "Is the iPhone 18 Pro PTA approved?", acceptedAnswer: { "@type": "Answer", text: "PTA status is device-specific, so verify the IMEI before purchase." } },
          ],
        }}
      />
    </Page>
  );
}
