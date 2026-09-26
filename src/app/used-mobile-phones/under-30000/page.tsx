import type { Metadata } from "next";
import { ListingCard } from "@/components/ListingCard";
import { ListingGrid, Page, PageTitle } from "@/components/ui";
import { EmptyState } from "@/components/EmptyState";
import { searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
const MAX = 30000;
export const metadata: Metadata = { title: "Used Phones Under Rs 30,000 in Pakistan", description: "Browse used mobile phones under Rs 30,000 in Pakistan from real seller listings.", alternates: { canonical: absoluteUrl("/used-mobile-phones/under-30000") } };
export default async function PageComponent(){ const result=await searchListings({category:"phone",maxPrice:String(MAX)}); return <Page><PageTitle kicker="Budget phones" title="Used Phones Under Rs 30,000 in Pakistan" description="Current seller listings at or below Rs 30,000. Compare condition, storage, PTA status and location." />{result.rows.length?<ListingGrid>{result.rows.map(l=><ListingCard key={l.id} listing={l}/>)}</ListingGrid>:<EmptyState title="No listings under Rs 30,000 yet" body="Browse all used phones or check back as sellers add inventory." actionHref="/used-mobile-phones" actionLabel="Browse used phones" />}</Page>; }
