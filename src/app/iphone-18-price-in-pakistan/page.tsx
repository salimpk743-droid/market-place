import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Page, PageTitle } from "@/components/ui";
import { absoluteUrl } from "@/lib/market/site";

const pagePath = "/iphone-18-price-in-pakistan";

export const metadata: Metadata = {
  title: "iPhone 18 Price in Pakistan 2026 — PTA, Non-PTA & Used",
  description:
    "Check the latest iPhone 18 price information in Pakistan, including expected pricing, PTA and non-PTA guidance, used-market considerations and where to find current listings.",
  alternates: { canonical: absoluteUrl(pagePath) },
  openGraph: {
    title: "iPhone 18 Price in Pakistan 2026 — PTA, Non-PTA & Used",
    description:
      "iPhone 18 price information for Pakistan, with PTA, non-PTA, used-phone guidance and Mobile Market listings.",
    url: absoluteUrl(pagePath),
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "iPhone 18 Price in Pakistan" }],
  },
};

export default function IPhone18PakistanPage() {
  return (
    <Page className="max-w-4xl">
      <PageTitle
        kicker="Apple · Pakistan"
        title="iPhone 18 Price in Pakistan"
        description="A practical Pakistan-focused guide to iPhone 18 pricing, PTA status, non-PTA devices and the used market."
      />

      <article className="prose prose-sm max-w-none text-ink-soft">
        <div className="card not-prose p-5 sm:p-6">
          <p className="section-kicker">Price status</p>
          <h2 className="mt-1 text-xl text-ink">Price can vary by storage, PTA status and seller</h2>
          <p className="mt-2 text-sm text-muted">
            Pakistani market prices can differ from official or international launch prices. Mobile Market will show real
            seller listings when the device is listed, while estimates are clearly labeled as estimates rather than seller offers.
          </p>
        </div>

        <h2>iPhone 18 price in Pakistan</h2>
        <p>
          The price of an iPhone 18 in Pakistan depends on storage, whether the phone is PTA approved, whether it is new or
          used, its warranty and the seller&apos;s asking price. For that reason, buyers should compare more than one listing
          before purchasing.
        </p>

        <div className="not-prose overflow-hidden rounded-lg border border-line">
          <div className="grid grid-cols-4 border-b border-line bg-surface px-4 py-3 text-xs font-semibold text-muted">
            <span>Variant</span><span>Storage</span><span>Status</span><span>Price</span>
          </div>
          {[
            ["iPhone 18", "256GB", "PTA", "Check latest market price"],
            ["iPhone 18", "256GB", "Non-PTA", "Check current listings"],
            ["iPhone 18", "512GB", "PTA", "Check latest market price"],
            ["iPhone 18", "Used", "PTA / Non-PTA", "Varies by condition"],
          ].map(([model, storage, status, price]) => (
            <div key={`${storage}-${status}`} className="grid grid-cols-4 border-b border-line px-4 py-3 text-sm last:border-b-0">
              <span className="font-medium text-ink">{model}</span><span>{storage}</span><span>{status}</span><span>{price}</span>
            </div>
          ))}
        </div>

        <h2>PTA and non-PTA iPhone 18 in Pakistan</h2>
        <p>
          PTA status can materially change the purchase price and long-term usability of an imported phone. Buyers should
          verify the device IMEI and current status independently before paying. A seller&apos;s PTA declaration on a
          marketplace listing is not the same thing as an official verification.
        </p>
        <p>
          See our <Link href="/guides/pta-status" className="link">PTA status guide</Link> for the verification process,
          and browse <Link href="/pta-approved-phones" className="link">PTA approved phones</Link> when suitable listings are available.
        </p>

        <h2>Used iPhone 18 price in Pakistan</h2>
        <p>
          Used prices depend on condition, battery health, storage, warranty, PTA status and whether the seller has the
          original box and accessories. Once Mobile Market sellers begin listing iPhone 18 devices, this page can point buyers
          to live market listings rather than relying only on estimates.
        </p>

        <div className="not-prose grid gap-3 sm:grid-cols-3">
          <Link className="card p-4 hover:border-brand/30" href="/iphone-18-pro-price-in-pakistan">
            <p className="font-semibold text-ink">iPhone 18 Pro</p>
            <p className="mt-1 text-sm text-muted">Pakistan price and availability guide</p>
          </Link>
          <Link className="card p-4 hover:border-brand/30" href="/iphone-18-pro-max-price-in-pakistan">
            <p className="font-semibold text-ink">iPhone 18 Pro Max</p>
            <p className="mt-1 text-sm text-muted">Pakistan price and availability guide</p>
          </Link>
          <Link className="card p-4 hover:border-brand/30" href="/phones/apple">
            <p className="font-semibold text-ink">Used iPhones</p>
            <p className="mt-1 text-sm text-muted">Browse current Apple listings</p>
          </Link>
        </div>

        <h2>Frequently asked questions</h2>
        <h3>What is the iPhone 18 price in Pakistan?</h3>
        <p>
          There is no single market price. Storage, PTA status, warranty, import source and seller condition all affect the
          final price.
        </p>
        <h3>Is iPhone 18 PTA approved in Pakistan?</h3>
        <p>
          PTA status is device-specific. Verify the IMEI and current status through official tools before buying, especially for
          imported or used phones.
        </p>
        <h3>What is the iPhone 18 non-PTA price in Pakistan?</h3>
        <p>
          Non-PTA pricing varies by seller and storage. Mobile Market listings should be treated as seller asking prices, not
          official Apple pricing.
        </p>
        <h3>Where can I buy a used iPhone 18 in Pakistan?</h3>
        <p>
          When sellers list the phone on Mobile Market, current listings will appear in the marketplace. Always inspect the device
          and verify IMEI and PTA status before payment.
        </p>
      </article>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "iPhone 18 Price in Pakistan", item: absoluteUrl(pagePath) },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is the iPhone 18 price in Pakistan?",
              acceptedAnswer: { "@type": "Answer", text: "There is no single market price. Storage, PTA status, warranty, import source and seller condition all affect the final price." },
            },
            {
              "@type": "Question",
              name: "Is iPhone 18 PTA approved in Pakistan?",
              acceptedAnswer: { "@type": "Answer", text: "PTA status is device-specific. Verify the IMEI and current status through official tools before buying." },
            },
            {
              "@type": "Question",
              name: "What is the iPhone 18 non-PTA price in Pakistan?",
              acceptedAnswer: { "@type": "Answer", text: "Non-PTA pricing varies by seller and storage. Mobile Market listings are seller asking prices, not official Apple pricing." },
            },
            {
              "@type": "Question",
              name: "Where can I buy a used iPhone 18 in Pakistan?",
              acceptedAnswer: { "@type": "Answer", text: "When sellers list the phone on Mobile Market, current listings will appear in the marketplace. Inspect the device and verify IMEI and PTA status before payment." },
            },
          ],
        }}
      />
    </Page>
  );
}
