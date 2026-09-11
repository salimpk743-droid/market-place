import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { JsonLd } from "@/components/JsonLd";
import { getCity } from "@/lib/market/catalog";
import { searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
import { ListingGrid, Page, PageTitle } from "@/components/ui";

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return { title: "City not found", robots: { index: false, follow: true } };
  const result = await searchListings({ city: c.slug });
  return {
    title: `Used phones in ${c.name}`,
    description: `Used mobile phones for sale in ${c.name}. Search by brand, PTA status and area on Mobile Market.`,
    alternates: { canonical: absoluteUrl(`/used-phones/${c.slug}`) },
    robots: result.total > 0 ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();
  const result = await searchListings({ city: c.slug });
  return (
    <Page>
      <PageTitle
        kicker="City"
        title={`Used phones in ${c.name}`}
        description={`Classifieds posted by sellers in ${c.name}. Meet in a public place, inspect the device, and verify IMEI and PTA status yourself.`}
      />
      {result.rows.length ? (
        <ListingGrid>
          {result.rows.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </ListingGrid>
      ) : (
        <EmptyState title={`No live ads in ${c.name} yet`} body="City pages are only filled by real seller listings." actionHref="/sell" actionLabel="Sell your phone" />
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: c.name, item: absoluteUrl(`/used-phones/${c.slug}`) },
          ],
        }}
      />
    </Page>
  );
}
