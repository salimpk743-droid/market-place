import type { Metadata } from "next";
import { CatalogResults } from "@/components/CatalogResults";
import { searchListings } from "@/lib/market/listings";
import { cityLabel, ptaMeta } from "@/lib/market/catalog";
import { absoluteUrl, BRAND } from "@/lib/market/site";
import type { ListingFilters } from "@/lib/market/types";

type Props = { searchParams: Promise<ListingFilters> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = await searchParams;
  const filtered = Boolean(f.q || f.brand || f.city || f.pta || f.storage || f.area || f.condition);
  return {
    title: filtered ? "Filtered used phones" : "Used phones for sale",
    description: "Browse used mobile phones for sale across Pakistan. Filter by brand, PTA status, city and storage.",
    alternates: { canonical: absoluteUrl("/phones") },
    openGraph: {
      url: absoluteUrl("/phones"),
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: BRAND }],
    },
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function PhonesPage({ searchParams }: Props) {
  const f = await searchParams;
  const result = await searchListings({ ...f, category: "phone" });
  const bits = [
    f.brand,
    f.storage ? `${f.storage} GB` : "",
    f.pta ? ptaMeta(f.pta)?.label : "",
    f.city ? cityLabel(f.city, f.area) : "",
  ].filter(Boolean);
  return (
    <CatalogResults
      result={result}
      filters={{ ...f, category: "phone" }}
      action="/phones"
      lockedCategory="phone"
      kicker="Marketplace"
      title={bits.length ? bits.join(" · ") : "Used phones for sale"}
      emptyTitle="No phones match those filters"
      emptyBody="Try another brand, city or PTA status. Only real seller ads are shown — there are no demo listings in this catalog."
    />
  );
}
