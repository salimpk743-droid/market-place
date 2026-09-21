import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { JsonLd } from "@/components/JsonLd";
import { getPhoneBrandBySlug, MODELS_BY_BRAND } from "@/lib/market/catalog";
import { searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
import { ListingGrid, Page, PageTitle } from "@/components/ui";

type Props = { params: Promise<{ brand: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const b = getPhoneBrandBySlug(brand);
  if (!b) return { title: "Brand not found", robots: { index: false, follow: true } };
  const result = await searchListings({ brand: b.name, category: "phone" });
  return {
    title: `${b.name} Mobile Prices in Pakistan — Used, PTA & Non-PTA`,
    description: `Explore ${b.name} phone models, Pakistan market prices, used listings, storage, condition and PTA/non-PTA information on Mobile Market.`,
    alternates: { canonical: absoluteUrl(`/phones/${b.slug}`) },
    robots: result.total > 0 ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function BrandPage({ params }: Props) {
  const { brand } = await params;
  const b = getPhoneBrandBySlug(brand);
  if (!b) notFound();
  const result = await searchListings({ brand: b.name, category: "phone" });
  const apple = b.slug === "apple";
  const catalogModels = MODELS_BY_BRAND[b.name] || [];
  const models = Array.from(new Set(result.rows.map((listing) => listing.model).filter(Boolean))).slice(0, 12);
  const cities = Array.from(new Set(result.rows.map((listing) => listing.city_slug).filter(Boolean))).slice(0, 10);
  return (
    <Page>
      <PageTitle
        kicker="Brand"
        title={apple ? "Used Apple phones in Pakistan" : `Used ${b.name} phones`}
        description={
          <>
            Live classifieds for {b.name} posted by sellers. PTA status and condition are declared by the seller — confirm
            independently before you pay.
            {apple ? <> Browse <Link href="/phones" className="link">all used phones</Link>.</> : null}
          </>
        }
      />
      {models.length || cities.length ? (
        <section className="mb-7 grid gap-5 rounded-lg border border-line bg-surface p-4 sm:p-5 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold">Phone models & prices</h2>
            <p className="mt-1 text-sm text-muted">Browse every {b.name} model in the Mobile Market catalog. Live seller prices appear on each model page when inventory exists.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {catalogModels.map((model) => {
                const slug = model.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                return <Link key={model} href={`/phones/${b.slug}/${slug}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">{model}</Link>;
              })}
            </div>
          </div>
          {cities.length ? (
            <div>
              <h2 className="text-base font-semibold">{b.name} phones by city</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {cities.map((city) => <Link key={city} href={`/used-phones/${city}/${b.slug}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">{city.replace(/-/g, " ")}</Link>)}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
      {result.rows.length ? (
        <ListingGrid>{result.rows.map((l) => <ListingCard key={l.id} listing={l} />)}</ListingGrid>
      ) : (
        <EmptyState title={`No live ${b.name} ads yet`} body="When a seller posts a real listing, it will show up here." actionHref="/sell" actionLabel="Sell your phone" />
      )}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: b.name, item: absoluteUrl(`/phones/${b.slug}`) },
        ],
      }} />
    </Page>
  );
}
