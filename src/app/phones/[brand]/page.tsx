import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { JsonLd } from "@/components/JsonLd";
import { getPhoneBrandBySlug } from "@/lib/market/catalog";
import { activePhoneCitiesByBrand, activePhoneModels, searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
import { ListingGrid, Page, PageTitle } from "@/components/ui";

type Props = { params: Promise<{ brand: string }> };

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const b = getPhoneBrandBySlug(brand);
  if (!b) return { title: "Brand not found", robots: { index: false, follow: true } };
  return {
    title: `${b.name} Mobile Prices in Pakistan — Used, PTA & Non-PTA`,
    description: `Explore ${b.name} phone models, Pakistan market prices, used listings, storage, condition and PTA/non-PTA information on Mobile Market.`,
    alternates: { canonical: absoluteUrl(`/phones/${b.slug}`) },
    robots: { index: true, follow: true },
  };
}

export default async function BrandPage({ params }: Props) {
  const { brand } = await params;
  const b = getPhoneBrandBySlug(brand);
  if (!b) notFound();

  const [result, rankedModels, rankedCities] = await Promise.all([
    searchListings({ brand: b.name, category: "phone" }),
    activePhoneModels(50, 2),
    activePhoneCitiesByBrand(b.name, 10, 1),
  ]);
  const activeModels = rankedModels.filter((item) => item.brand === b.name).slice(0, 24);
  const cities = rankedCities;

  return (
    <Page>
      <PageTitle
        kicker="Mobile price database · Pakistan"
        title={`${b.name} Mobile Prices in Pakistan`}
        description={`Explore ${b.name} phone models, Pakistan market prices, used listings, storage, condition and PTA/non-PTA information on Mobile Market.`}
      />

      <section className="mb-7 grid gap-5 rounded-lg border border-line bg-surface p-4 sm:p-5 md:grid-cols-2">
        <div>
          <h2 className="text-base font-semibold">Live {b.name} models & prices</h2>
          <p className="mt-1 text-sm text-muted">Model pages below are linked from current marketplace inventory, so visitors can move from the brand hub into live model-specific price and buying information.</p>
          {activeModels.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeModels.map((item) => (
                <Link key={item.model} href={`/phones/${b.slug}/${slugify(item.model)}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">
                  {item.model}
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">No live model inventory yet.</p>
          )}
        </div>

        <div>
          <h2 className="text-base font-semibold">Browse {b.name} by buyer intent</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/used-mobile-phones/under-20000" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">Under Rs 20,000</Link>
            <Link href="/used-mobile-phones/under-30000" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">Under Rs 30,000</Link>
            <Link href="/used-mobile-phones/under-50000" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">Under Rs 50,000</Link>
            <Link href="/used-mobile-phones/under-100000" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">Under Rs 100,000</Link>
            <Link href="/pta-approved-phones" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">PTA approved</Link>
            <Link href="/non-pta-phones" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">Non-PTA</Link>
          </div>
        </div>
      </section>

      {cities.length ? (
        <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5">
          <h2 className="text-base font-semibold">{b.name} phones by city</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link key={city} href={`/used-phones/${city.city}/${b.slug}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">
                {city.city.replace(/-/g, " ")} <span className="ml-1 text-xs text-muted">({city.count})</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {result.rows.length ? (
        <ListingGrid>{result.rows.map((l) => <ListingCard key={l.id} listing={l} />)}</ListingGrid>
      ) : (
        <EmptyState title={`No live ${b.name} ads yet`} body="When a seller posts a real listing, it will show up here." actionHref="/sell" actionLabel="Sell your phone" />
      )}

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/used-mobile-phones" className="link">All used mobile phones</Link>
        <Link href="/mobile-prices-in-pakistan" className="link">Mobile prices in Pakistan</Link>
        <Link href="/guides/pta-status" className="link">PTA status guide</Link>
      </div>

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
