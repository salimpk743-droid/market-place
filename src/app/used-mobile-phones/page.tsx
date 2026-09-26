import type { Metadata } from "next";
import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { ListingGrid, Page, PageTitle } from "@/components/ui";
import { EmptyState } from "@/components/EmptyState";
import { BRANDS, popularCities } from "@/lib/market/catalog";
import { searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Used Mobile Phones in Pakistan — Buy & Sell",
  description:
    "Browse used mobile phones for sale in Pakistan. Compare iPhone, Samsung, Xiaomi, Vivo, Oppo, Infinix and more by city, PTA status, storage and price.",
  alternates: { canonical: absoluteUrl("/used-mobile-phones") },
};

const BUDGETS = [
  ["Used phones under Rs 20,000", "/used-mobile-phones/under-20000"],
  ["Used phones under Rs 30,000", "/used-mobile-phones/under-30000"],
  ["Used phones under Rs 50,000", "/used-mobile-phones/under-50000"],
  ["Used phones under Rs 100,000", "/used-mobile-phones/under-100000"],
] as const;

export default async function UsedMobilePhonesHub() {
  const result = await searchListings({ category: "phone" });
  return (
    <Page>
      <PageTitle
        kicker="Used phones · Pakistan"
        title="Used Mobile Phones in Pakistan"
        description="Compare real seller listings for used phones across Pakistan. Filter by brand, city, storage and PTA status, then inspect the exact device before paying."
      />
      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BUDGETS.map(([label, href]) => (
          <Link key={href} href={href} className="card p-4 hover:border-brand/30">
            <p className="font-semibold text-ink">{label}</p>
            <p className="mt-1 text-xs text-muted">Browse current marketplace inventory.</p>
          </Link>
        ))}
      </section>
      <section className="mb-8">
        <h2 className="text-lg font-semibold">Used phones by brand</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {BRANDS.map((b) => (
            <Link key={b.slug} href={"/phones/" + b.slug} className="rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium hover:border-brand/40">
              Used {b.name} phones
            </Link>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-lg font-semibold">Used phones by city</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {popularCities().slice(0, 24).map((c) => (
            <Link key={c.slug} href={"/used-phones/" + c.slug} className="rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium hover:border-brand/40">
              Used phones in {c.name}
            </Link>
          ))}
        </div>
      </section>
      {result.rows.length ? <ListingGrid>{result.rows.map((l) => <ListingCard key={l.id} listing={l} />)}</ListingGrid> : <EmptyState title="No live used-phone listings yet" body="Real seller ads will appear here when inventory is available." actionHref="/sell" actionLabel="Sell your phone" />}
    </Page>
  );
}
