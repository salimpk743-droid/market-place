import type { Metadata } from "next";
import { CatalogResults } from "@/components/CatalogResults";
import { searchListings } from "@/lib/market/listings";
import { cityLabel, getCategory } from "@/lib/market/catalog";
import { absoluteUrl } from "@/lib/market/site";
import type { ListingFilters } from "@/lib/market/types";

type Props = { searchParams: Promise<ListingFilters> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = await searchParams;
  const filtered = Boolean(f.q || f.brand || f.city || f.pta || f.storage || f.area || f.condition || f.category);
  const cat = f.category ? getCategory(f.category).name : "phones and accessories";
  return {
    title: filtered ? "Filtered listings" : "Browse phones and accessories",
    description: `Browse used ${cat} for sale across Pakistan.`,
    alternates: { canonical: absoluteUrl("/browse") },
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function BrowsePage({ searchParams }: Props) {
  const f = await searchParams;
  const result = await searchListings(f);
  const bits = [f.category ? getCategory(f.category).name : "", f.brand, f.city ? cityLabel(f.city, f.area) : ""].filter(Boolean);
  return (
    <CatalogResults
      result={result}
      filters={f}
      action="/browse"
      kicker="Marketplace"
      title={bits.length ? bits.join(" · ") : "Phones and accessories"}
      emptyTitle="No listings match those filters"
      emptyBody="Try another category, brand or city. Only real seller ads are shown — there are no demo listings in this catalog."
    />
  );
}
