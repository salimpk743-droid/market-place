import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { JsonLd } from "@/components/JsonLd";
import { getPhoneBrandBySlug, MODELS_BY_BRAND, PTA, STORAGE_OPTIONS, RAM_OPTIONS } from "@/lib/market/catalog";
import { searchPhoneSeoListings } from "@/lib/market/seo-facets";
import { absoluteUrl } from "@/lib/market/site";
import { ListingGrid, Page, PageTitle } from "@/components/ui";

type Props = { params: Promise<{ brand: string; model: string }> };

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getModel(brandSlug: string, modelSlug: string) {
  const brand = getPhoneBrandBySlug(brandSlug);
  const models = brand ? MODELS_BY_BRAND[brand.name] || [] : [];
  return models.find((model) => slugify(model) === modelSlug.toLowerCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand, model } = await params;
  const b = getPhoneBrandBySlug(brand);
  const modelName = b ? getModel(b.slug, model) : undefined;
  if (!b || !modelName) return { title: "Model not found", robots: { index: false, follow: true } };
  const result = await searchPhoneSeoListings({ brand: b.name, model: modelName });
  const canonical = `/phones/${b.slug}/${slugify(modelName)}`;
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
  const modelName = b ? getModel(b.slug, model) : undefined;
  if (!b || !modelName) notFound();

  const result = await searchPhoneSeoListings({ brand: b.name, model: modelName });
  const cities = Array.from(new Set(result.rows.map((listing) => listing.city_slug).filter(Boolean))).slice(0, 10);
  const canonical = `/phones/${b.slug}/${slugify(modelName)}`;

  return (
    <Page>
      <PageTitle
        kicker={`${b.name} · Pakistan mobile market`}
        title={`${b.name} ${modelName} Price in Pakistan`}
        description={`Market information for ${b.name} ${modelName}: current seller asking prices, available configurations, PTA status and live listings.`}
      />
      <section className="mb-7 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-surface p-5"><p className="section-kicker">Current asking price</p><p className="mt-1 text-xl font-semibold text-ink">{result.total ? `Rs ${Math.min(...result.rows.map((x) => x.price_pkr)).toLocaleString("en-PK")} – Rs ${Math.max(...result.rows.map((x) => x.price_pkr)).toLocaleString("en-PK")}` : "No live price yet"}</p><p className="mt-1 text-xs text-muted">{result.total ? `Based on ${result.total} active seller listing${result.total === 1 ? "" : "s"}` : "We do not invent a price without live marketplace data."}</p></div>
        <div className="rounded-lg border border-line bg-surface p-5"><p className="section-kicker">Marketplace configurations</p><p className="mt-1 text-lg font-semibold text-ink">{Array.from(new Set(result.rows.map((x) => x.storage_gb).filter(Boolean))).join(" / ") || "Not listed"} GB</p><p className="mt-1 text-xs text-muted">RAM: {Array.from(new Set(result.rows.map((x) => x.ram_gb).filter(Boolean))).join(" / ") || "Not currently declared"} GB</p></div>
        <div className="rounded-lg border border-line bg-surface p-5"><p className="section-kicker">PTA status</p><p className="mt-1 text-lg font-semibold text-ink">{Array.from(new Set(result.rows.map((x) => x.pta_status).filter(Boolean))).join(", ") || "No seller status yet"}</p><p className="mt-1 text-xs text-muted">Seller-declared status should be independently verified.</p></div>
      </section>
      <section className="mb-7 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line p-5"><h2 className="text-lg font-semibold text-ink">Phone information</h2><dl className="mt-4 grid gap-3 text-sm"><div className="flex justify-between border-b border-line pb-2"><dt className="text-muted">Brand</dt><dd className="font-medium">{b.name}</dd></div><div className="flex justify-between border-b border-line pb-2"><dt className="text-muted">Model</dt><dd className="font-medium">{modelName}</dd></div><div className="flex justify-between"><dt className="text-muted">Active listings</dt><dd className="font-medium">{result.total}</dd></div></dl></div>
        <div className="rounded-lg border border-line p-5"><h2 className="text-lg font-semibold text-ink">Pakistan buying information</h2><ul className="mt-3 space-y-2 text-sm leading-6 text-muted"><li><strong className="text-ink">PTA:</strong> verify the device IMEI and seller-declared status.</li><li><strong className="text-ink">Condition:</strong> inspect display, cameras, charging, speakers and biometrics.</li><li><strong className="text-ink">Battery:</strong> check battery health and charging before purchase.</li><li><strong className="text-ink">Configuration:</strong> confirm exact storage and RAM.</li></ul><div className="mt-3 flex flex-wrap gap-3 text-sm"><Link href="/guides/pta-status" className="link">PTA guide</Link><Link href="/guides/inspect-used-phone" className="link">Inspection guide</Link></div></div>
      </section>
      <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <h2 className="text-base font-semibold">About this model</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">Prices on this page are seller asking prices from current marketplace listings, not an official manufacturer price. Actual value depends on storage, condition, battery health, PTA status and accessories.</p>
        {cities.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {cities.map((city) => <Link key={city} href={`/used-phones/${city}/${b.slug}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">{modelName} in {city.replace(/-/g, " ")}</Link>)}
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
