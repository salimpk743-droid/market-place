import type { Metadata } from "next";
import Link from "next/link";
import { FilterForm } from "@/components/FilterForm";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { CATEGORIES, categoryPath } from "@/lib/market/catalog";
import { searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
import type { ListingFilters } from "@/lib/market/types";
import { ListingGrid, Page, PageTitle } from "@/components/ui";

export async function generateMetadata({ searchParams }: { searchParams: Promise<ListingFilters> }): Promise<Metadata> {
  const f = await searchParams;
  const filtered = Boolean(f.q || f.brand || f.city || f.pta || f.storage || f.area || f.condition);
  return {
    title: "Mobile accessories for sale",
    description: "Buy and sell power banks, chargers, AirPods, headphones, covers and other mobile accessories in Pakistan.",
    alternates: { canonical: absoluteUrl("/accessories") },
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function AccessoriesPage({ searchParams }: { searchParams: Promise<ListingFilters> }) {
  const f = await searchParams;
  const category = f.category && f.category !== "phone" && f.category !== "phones" ? f.category : "accessories";
  const result = await searchListings({ ...f, category });
  const cats = CATEGORIES.filter((c) => c.slug !== "phone");
  return (
    <Page>
      <PageTitle
        kicker="Accessories"
        title="Mobile accessories"
        description="Power banks, chargers, AirPods, headphones, covers, screen protectors, smartwatches and other phone-related items. Laptops and unrelated goods are not listed here."
      />
      <div className="mb-5 flex flex-wrap gap-2">
        {cats.map((c) => (
          <Link
            key={c.slug}
            href={categoryPath(c.slug)}
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium hover:border-brand/40"
          >
            {c.short}
          </Link>
        ))}
      </div>
      <FilterForm filters={{ ...f, category }} action="/accessories" lockedCategory="accessories" />
      {result.rows.length ? (
        <ListingGrid>
          {result.rows.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </ListingGrid>
      ) : (
        <EmptyState
          title="No accessory ads yet"
          body="When sellers post power banks, chargers, earbuds or covers, they will appear here."
          actionHref="/sell"
          actionLabel="Sell an accessory"
        />
      )}
    </Page>
  );
}
