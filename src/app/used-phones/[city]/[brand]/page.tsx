import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { JsonLd } from "@/components/JsonLd";
import { getCity, getPhoneBrandBySlug } from "@/lib/market/catalog";
import { activePhoneModelsByCity } from "@/lib/market/listings";
import { searchPhoneSeoListings } from "@/lib/market/seo-facets";
import { absoluteUrl } from "@/lib/market/site";
import { ListingGrid, Page, PageTitle } from "@/components/ui";

type Props = { params: Promise<{ city: string; brand: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, brand } = await params;
  const c = getCity(city);
  const b = getPhoneBrandBySlug(brand);
  if (!c || !b) return { title: "Page not found", robots: { index: false, follow: true } };
  const result = await searchPhoneSeoListings({ city: c.slug, brand: b.name });
  const canonical = `/used-phones/${c.slug}/${b.slug}`;
  return {
    title: `Used ${b.name} phones in ${c.name}`,
    description: `Browse used ${b.name} phones for sale in ${c.name}, Pakistan. Compare live seller listings, prices, storage and PTA status.`,
    alternates: { canonical: absoluteUrl(canonical) },
    robots: result.total > 0 ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function CityBrandPage({ params }: Props) {
  const { city, brand } = await params;
  const c = getCity(city);
  const b = getPhoneBrandBySlug(brand);
  if (!c || !b) notFound();

  const [result, rankedModels] = await Promise.all([
    searchPhoneSeoListings({ city: c.slug, brand: b.name }),
    activePhoneModelsByCity(c.slug, b.name, 12, 1),
  ]);

  return (
    <Page>
      <PageTitle
        kicker="City + brand"
        title={`Used ${b.name} phones in ${c.name}`}
        description={`Live ${b.name} phone classifieds from sellers in ${c.name}. Compare prices and specifications, then inspect the phone and verify PTA status before paying.`}
      />

      {rankedModels.length ? (
        <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5">
          <h2 className="text-base font-semibold">Used {b.name} models with live inventory in {c.name}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {rankedModels.map((item) => {
              const slug = item.model.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              return (
                <Link key={item.model} href={`/phones/${b.slug}/${slug}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">
                  <span>{item.model}</span><span className="ml-2 text-xs text-muted">{item.count} listings</span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {result.rows.length ? (
        <ListingGrid>{result.rows.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</ListingGrid>
      ) : (
        <EmptyState title={`No live ${b.name} ads in ${c.name} yet`} body="No live seller ads are available right now. Check back when sellers add inventory." actionHref="/sell" actionLabel="Sell your phone" />
      )}

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href={`/phones/${b.slug}`} className="link">All {b.name} phones</Link>
        <Link href={`/used-phones/${c.slug}`} className="link">All phones in {c.name}</Link>
        <Link href="/guides/pta-status" className="link">Check PTA status</Link>
      </div>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: `Used ${b.name} phones`, item: absoluteUrl(`/phones/${b.slug}`) },
          { "@type": "ListItem", position: 3, name: `Used ${b.name} phones in ${c.name}`, item: absoluteUrl(`/used-phones/${c.slug}/${b.slug}`) },
        ],
      }} />
    </Page>
  );
}
