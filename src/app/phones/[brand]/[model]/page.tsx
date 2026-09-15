import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { JsonLd } from "@/components/JsonLd";
import { getPhoneBrandBySlug } from "@/lib/market/catalog";
import { searchPhoneSeoListings } from "@/lib/market/seo-facets";
import { absoluteUrl } from "@/lib/market/site";
import { ListingGrid, Page, PageTitle } from "@/components/ui";

 type Props = { params: Promise<{ brand: string; model: string }> };

function modelNameFromSlug(slug: string) {
  return decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => /^\d+$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function modelSlug(model: string) {
  return model.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand, model } = await params;
  const b = getPhoneBrandBySlug(brand);
  if (!b) return { title: "Model not found", robots: { index: false, follow: true } };
  const modelName = modelNameFromSlug(model);
  const result = await searchPhoneSeoListings({ brand: b.name, model: modelName });
  const canonical = `/phones/${b.slug}/${modelSlug(modelName)}`;
  return {
    title: `Used ${b.name} ${modelName} Price in Pakistan`,
    description: `Browse used ${b.name} ${modelName} phones for sale in Pakistan. Compare live seller prices, storage, condition and PTA status.`,
    alternates: { canonical: absoluteUrl(canonical) },
    robots: result.total > 0 ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function ModelPage({ params }: Props) {
  const { brand, model } = await params;
  const b = getPhoneBrandBySlug(brand);
  if (!b) notFound();
  const modelName = modelNameFromSlug(model);
  const result = await searchPhoneSeoListings({ brand: b.name, model: modelName });
  if (!result.total) return <EmptyState title={`${b.name} ${modelName} is not currently listed`} body="Model pages are generated from real seller inventory and become indexable when live listings exist." actionHref={`/phones/${b.slug}`} actionLabel={`Browse ${b.name} phones`} />;

  const cities = Array.from(new Set(result.rows.map((listing) => listing.city_slug).filter(Boolean))).slice(0, 10);
  const canonical = `/phones/${b.slug}/${modelSlug(modelName)}`;

  return (
    <Page>
      <PageTitle
        kicker="Phone model"
        title={`Used ${b.name} ${modelName} in Pakistan`}
        description={`Live seller listings for the ${b.name} ${modelName}. Compare asking prices and specifications, then inspect the device and verify PTA status before paying.`}
      />

      <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <h2 className="text-base font-semibold">About this model</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Prices on this page are seller asking prices from current marketplace listings, not an official manufacturer price. Actual value depends on storage, condition, battery health, PTA status and accessories.
        </p>
        {cities.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link key={city} href={`/used-phones/${city}/${b.slug}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">
                {modelName} in {city.replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <ListingGrid>{result.rows.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</ListingGrid>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href={`/phones/${b.slug}`} className="link">All {b.name} phones</Link>
        <Link href="/phones" className="link">All used phones</Link>
        <Link href="/guides/buy-used-phone" className="link">How to buy a used phone</Link>
      </div>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: `Used ${b.name} phones`, item: absoluteUrl(`/phones/${b.slug}`) },
          { "@type": "ListItem", position: 3, name: `Used ${b.name} ${modelName}`, item: absoluteUrl(canonical) },
        ],
      }} />
    </Page>
  );
}
