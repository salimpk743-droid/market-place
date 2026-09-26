import type { Metadata } from "next";
import { ListingCard } from "@/components/ListingCard";
import { ListingGrid, Page, PageTitle } from "@/components/ui";
import { EmptyState } from "@/components/EmptyState";
import { searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";

const MAX = 20000;
export const metadata: Metadata = {
  title: "Used Phones Under Rs 20,000 in Pakistan",
  description: "Browse used mobile phones under Rs 20,000 in Pakistan from real seller listings.",
  alternates: { canonical: absoluteUrl("/used-mobile-phones/under-20000") },
};
export default async function PageComponent() {
  const result = await searchListings({ category: "phone", maxPrice: String(MAX) });
  return <Page><PageTitle kicker="Budget phones" title="Used Phones Under Rs 20,000 in Pakistan" description="Current seller listings at or below Rs 20,000. Prices are asking prices; inspect and verify the exact phone before paying." />{result.rows.length ? <ListingGrid>{result.rows.map((l) => <ListingCard key={l.id} listing={l} />)}</ListingGrid> : <EmptyState title="No listings under Rs 20,000 yet" body="Try the main used-phone catalog or check back as sellers add inventory." actionHref="/used-mobile-phones" actionLabel="Browse used phones" />}</Page>;
}
