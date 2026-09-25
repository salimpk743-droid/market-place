import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { JsonLd } from "@/components/JsonLd";
import { getCity, BRANDS } from "@/lib/market/catalog";
import { searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
import { ListingGrid, Page, PageTitle } from "@/components/ui";

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return { title: "City not found", robots: { index: false, follow: true } };
  const result = await searchListings({ city: c.slug, category: "phone" });
  return {
    title: `Used Mobile Phones in ${c.name}, Pakistan — Buy & Sell`,
    description: `Browse used mobile phones for sale in ${c.name}, Pakistan. Compare live seller listings by brand, model, price, storage, condition and seller-declared PTA status.`,
    alternates: { canonical: absoluteUrl(`/used-phones/${c.slug}`) },
    robots: { index: true, follow: true },
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();
  const result = await searchListings({ city: c.slug, category: "phone" });
  const liveBrands = Array.from(new Set(result.rows.map((listing) => listing.brand).filter(Boolean)))
    .map((name) => BRANDS.find((brand) => brand.name.toLowerCase() === name.toLowerCase()))
    .filter((brand): brand is NonNullable<typeof brand> => Boolean(brand))
    .slice(0, 12);
  const islamabad = c.slug === "islamabad";
  return (
    <Page>
      <PageTitle
        kicker="City"
        title={`Used Mobile Phones in ${c.name}`}
        description={
          islamabad ? (
            <>Browse used phones for sale in Islamabad on Mobile Market. Compare live listings by brand, model, storage, PTA status and condition. Meet in a public place, inspect the phone, and verify the IMEI and PTA status before paying. <Link href="/guides/pta-status" className="link">How to check PTA status</Link>. <Link href="/guides/buy-used-phone" className="link">How to check a used phone before buying</Link>. Browse <Link href="/phones" className="link">all used phones</Link>.</>
          ) : (
            <>Classifieds posted by sellers in {c.name}. Meet in a public place, inspect the device, and verify IMEI and PTA status yourself. Browse <Link href="/phones" className="link">all used phones</Link>.</>
          )
        }
      />
      {liveBrands.length ? (
        <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5">
          <h2 className="text-base font-semibold">Used Mobile Phones by Brand in {c.name}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {liveBrands.map((brand) => <Link key={brand.slug} href={`/used-phones/${c.slug}/${brand.slug}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">{brand.name}</Link>)}
          </div>
        </section>
      ) : null}
      <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <h2 className="text-base font-semibold">Buy used mobile phones in {c.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">Compare real seller listings in {c.name} by phone brand, model, price, storage, condition and seller-declared PTA status. Listings are posted by sellers, so inspect the device and independently verify its IMEI and PTA status before paying.</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/phones" className="link">Used phones in Pakistan</Link>
          <Link href="/mobile-prices-in-pakistan" className="link">Mobile prices in Pakistan</Link>
          <Link href="/pta-approved-phones" className="link">PTA approved phones</Link>
          <Link href="/guides/pta-status" className="link">PTA status guide</Link>
        </div>
      </section>
      {result.rows.length ? <ListingGrid>{result.rows.map((l) => <ListingCard key={l.id} listing={l} />)}</ListingGrid> : <EmptyState title={`No live ads in ${c.name} yet`} body="City pages are only filled by real seller listings." actionHref="/sell" actionLabel="Sell your phone" />}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: c.name, item: absoluteUrl(`/used-phones/${c.slug}`) },
        ],
      }} />
    </Page>
  );
}
