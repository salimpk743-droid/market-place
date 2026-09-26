import type { Metadata } from "next";
import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { ListingGrid, Page, PageTitle } from "@/components/ui";
import { EmptyState } from "@/components/EmptyState";
import { BRANDS, popularCities } from "@/lib/market/catalog";
import { activePhoneCities, activePhoneModels, searchListings } from "@/lib/market/listings";
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
  const [result, activeModels, activeCities] = await Promise.all([\n    searchListings({ category: "phone" }),\n    activePhoneModels(12, 2),\n    activePhoneCities(24, 1),\n  ]);
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
      {activeModels.length ? (
        <section className="mb-8 rounded-lg border border-line bg-surface p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Popular used phone models</h2>
          <p className="mt-1 text-sm text-muted">Models with at least two active seller listings, so these pages have real marketplace depth behind them.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {activeModels.map((item) => {
              const brandSlug = BRANDS.find((brand) => brand.name === item.brand)?.slug;
              if (!brandSlug) return null;
              const modelSlug = item.model.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              return (
                <Link key={`${item.brand}-${item.model}`} href={`/phones/${brandSlug}/${modelSlug}`} className="rounded-md border border-line bg-white px-4 py-3 hover:border-brand/30">
                  <span className="font-medium text-ink">{item.brand} {item.model}</span>
                  <span className="mt-1 block text-xs text-muted">{item.count} active seller listings</span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
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
          {activeCities.map((item) => (
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
