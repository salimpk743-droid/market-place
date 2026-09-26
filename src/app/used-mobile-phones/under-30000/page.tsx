import type { Metadata } from "next";
import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { ListingGrid, Page, PageTitle } from "@/components/ui";
import { EmptyState } from "@/components/EmptyState";
import { activePhoneModelsByMaxPrice, searchListings } from "@/lib/market/listings";
import { brandSlug } from "@/lib/market/catalog";
import { absoluteUrl } from "@/lib/market/site";

const MAX = 30000;
export const metadata: Metadata = {
  title: "Used Phones Under Rs 30000 in Pakistan",
  description: "Browse used mobile phones under Rs 30000 in Pakistan from real seller listings.",
  alternates: { canonical: absoluteUrl("/used-mobile-phones/under-30000") },
};

function modelSlug(model: string) {
  return model.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function PageComponent() {
  const [result, models] = await Promise.all([
    searchListings({ category: "phone", maxPrice: String(MAX) }),
    activePhoneModelsByMaxPrice(MAX, 12, 1),
  ]);

  return (
    <Page>
      <PageTitle kicker="Budget phones" title="Used Phones Under Rs 30000 in Pakistan" description="Current seller listings at or below Rs 30000. Compare condition, storage, PTA status and location." />
      {models.length ? (
        <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5">
          <h2 className="text-base font-semibold">Popular models with live inventory under Rs 30000</h2>
          <p className="mt-1 text-sm text-muted">Ranked from current active seller listings in this budget.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {models.map((item) => (
              <Link key={`${item.brand}-${item.model}`} href={`/phones/${brandSlug(item.brand)}/${modelSlug(item.model)}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">
                {item.brand} {item.model} <span className="text-xs text-muted">({item.count})</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {result.rows.length ? (
        <ListingGrid>{result.rows.map((l) => <ListingCard key={l.id} listing={l} />)}</ListingGrid>
      ) : (
        <EmptyState title="No listings under Rs 30000 yet" body="Browse all used phones or check back as sellers add inventory." actionHref="/used-mobile-phones" actionLabel="Browse used phones" />
      )}
    </Page>
  );
}
