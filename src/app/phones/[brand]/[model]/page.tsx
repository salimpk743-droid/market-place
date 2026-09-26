import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { JsonLd } from "@/components/JsonLd";
import { getPhoneBrandBySlug, MODELS_BY_BRAND } from "@/lib/market/catalog";
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
  const minPrice = result.total ? Math.min(...result.rows.map((x) => x.price_pkr)) : null;

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

      <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <h2 className="text-base font-semibold">Explore {b.name} {modelName} by buying intent</h2>
        <p className="mt-2 text-sm text-muted">Use the broader marketplace hubs for price bands and PTA status; this model page remains the canonical destination for the model-specific query.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/used-mobile-phones/under-20000" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">Used phones under Rs 20,000</Link>
          <Link href="/used-mobile-phones/under-30000" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">Used phones under Rs 30,000</Link>
          <Link href="/used-mobile-phones/under-50000" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">Used phones under Rs 50,000</Link>
          <Link href="/used-mobile-phones/under-100000" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">Used phones under Rs 100,000</Link>
          <Link href="/pta-approved-phones" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">PTA approved phones</Link>
          <Link href="/non-pta-phones" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">Non-PTA phones</Link>
          {minPrice !== null && minPrice <= 100000 ? <span className="rounded-md border border-dashed border-line px-3 py-2 text-sm text-muted">Current listings start at Rs {minPrice.toLocaleString("en-PK")}</span> : null}
        </div>
      </section>

      <section className="mb-7 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line p-5"><h2 className="text-lg font-semibold text-ink">Phone information</h2><dl className="mt-4 grid gap-3 text-sm"><div className="flex justify-between border-b border-line pb-2"><dt className="text-muted">Brand</dt><dd className="font-medium">{b.name}</dd></div><div className="flex justify-between border-b border-line pb-2"><dt className="text-muted">Model</dt><dd className="font-medium">{modelName}</dd></div><div className="flex justify-between"><dt className="text-muted">Active listings</dt><dd className="font-medium">{result.total}</dd></div></dl></div>
        <div className="rounded-lg border border-line p-5"><h2 className="text-lg font-semibold text-ink">Pakistan buying information</h2><ul className="mt-3 space-y-2 text-sm leading-6 text-muted"><li><strong className="text-ink">PTA:</strong> verify the device IMEI and seller-declared status.</li><li><strong className="text-ink">Condition:</strong> inspect display, cameras, charging, speakers and biometrics.</li><li><strong className="text-ink">Battery:</strong> check battery health and charging before purchase.</li><li><strong className="text-ink">Configuration:</strong> confirm exact storage and RAM.</li></ul><div className="mt-3 flex flex-wrap gap-3 text-sm"><Link href="/guides/pta-status" className="link">PTA guide</Link><Link href="/guides/inspect-used-phone" className="link">Inspection guide</Link></div></div>
      </section>

      <section className="mb-7 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-5">
          <h2 className="text-base font-semibold">About the {b.name} {modelName} price in Pakistan</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">The prices shown here are current seller asking prices on Mobile Market, not an official retail price. Used {b.name} {modelName} prices can vary with storage, condition, battery health, PTA status, warranty and accessories. Compare the exact device and verify its IMEI before paying.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm"><div className="rounded-md border border-line bg-white p-3"><p className="text-muted">Listings</p><p className="mt-1 font-semibold text-ink">{result.total}</p></div><div className="rounded-md border border-line bg-white p-3"><p className="text-muted">Cities</p><p className="mt-1 font-semibold text-ink">{cities.length || "—"}</p></div></div>
        </div>
        <div className="rounded-lg border border-line p-5">
          <h2 className="text-base font-semibold">Buying a used {b.name} {modelName}</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted"><li>Check the IMEI on the actual phone.</li><li>Verify PTA/DIRBS status independently.</li><li>Confirm storage, condition and battery information.</li><li>Test display, cameras, charging, audio and network.</li><li>Inspect the exact device before payment.</li></ol>
          <div className="mt-4 flex flex-wrap gap-3 text-sm"><Link href="/guides/pta-status" className="link">PTA status guide</Link><Link href="/guides/buy-used-phone" className="link">Used-phone buying guide</Link></div>
        </div>
      </section>

      <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <h2 className="text-base font-semibold">{b.name} {modelName} listings by city</h2>
        <p className="mt-2 text-sm text-muted">Where current listings are available. City pages contain the broader brand inventory.</p>
        {cities.length ? <div className="mt-4 flex flex-wrap gap-2">{cities.map((city) => <Link key={city} href={`/used-phones/${city}/${b.slug}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">{modelName} in {city.replace(/-/g, " ")}</Link>)}</div> : <p className="mt-3 text-sm text-muted">No city-level inventory is currently available.</p>}
      </section>

      <ListingGrid>{result.rows.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</ListingGrid>

      <section className="mt-8 border-t border-line pt-7">
        <h2 className="text-lg font-semibold">Related {b.name} models</h2>
        <p className="mt-1 text-sm text-muted">Compare nearby models in the same {b.name} catalog.</p>
        <div className="mt-3 flex flex-wrap gap-2">{(MODELS_BY_BRAND[b.name] || []).filter((m) => m !== modelName).slice(0, 8).map((m) => <Link key={m} href={`/phones/${b.slug}/${slugify(m)}`} className="rounded-md border border-line px-3 py-2 text-sm font-medium hover:border-brand/40">{m}</Link>)}</div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3 text-sm"><Link href={`/phones/${b.slug}`} className="link">All {b.name} phones</Link><Link href="/phones" className="link">All used phones</Link><Link href="/guides/buy-used-phone" className="link">How to buy a used phone</Link></div>

      <section className="mt-8 border-t border-line pt-7">
        <h2 className="text-lg font-semibold">Frequently asked questions</h2>
        <div className="mt-4 space-y-4 text-sm leading-6">
          <div><h3 className="font-semibold text-ink">What is the {b.name} {modelName} used price in Pakistan?</h3><p className="text-muted">Mobile Market shows current seller asking prices when active listings are available. The exact price depends on storage, condition, battery health, PTA status and other device details.</p></div>
          <div><h3 className="font-semibold text-ink">Is the {b.name} {modelName} PTA approved?</h3><p className="text-muted">PTA status can differ by handset and IMEI. Treat a listing's PTA label as seller-provided information and verify the actual IMEI before buying.</p></div>
          <div><h3 className="font-semibold text-ink">What should I check before buying a used {b.name} {modelName}?</h3><p className="text-muted">Check the IMEI, PTA/DIRBS status, storage, physical condition, display, cameras, charging, audio, battery information and mobile-network function before payment.</p></div>
        </div>
      </section>

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
