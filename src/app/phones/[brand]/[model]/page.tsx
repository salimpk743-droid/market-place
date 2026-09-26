import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { JsonLd } from "@/components/JsonLd";
import { getPhoneBrandBySlug, MODELS_BY_BRAND, cityName } from "@/lib/market/catalog";
import { activePhoneCitiesByModel, activePhoneModels } from "@/lib/market/listings";
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

function ptaLabel(value: string) {
  if (value === "official") return "PTA approved";
  if (value === "non-pta") return "Non-PTA";
  if (value === "tax-pending") return "Tax pending";
  return value.replace(/-/g, " ");
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

  const [result, activeModels, activeCities] = await Promise.all([
    searchPhoneSeoListings({ brand: b.name, model: modelName }),
    activePhoneModels(50, 2),
    activePhoneCitiesByModel(b.name, modelName, 10, 1),
  ]);
  const relatedModels = activeModels
    .filter((item) => item.brand === b.name && item.model !== modelName)
    .slice(0, 8);
  const cities = activeCities.map((item) => item.city);
  const storageOptions = Array.from(new Set(result.rows.map((listing) => listing.storage_gb).filter((value): value is number => typeof value === "number"))).sort((a, z) => a - z);
  const ramOptions = Array.from(new Set(result.rows.map((listing) => listing.ram_gb).filter((value): value is number => typeof value === "number"))).sort((a, z) => a - z);
  const ptaStatuses = Array.from(new Set(result.rows.map((listing) => listing.pta_status).filter(Boolean)));
  const batteryValues = result.rows.map((listing) => listing.battery_health).filter((value): value is number => typeof value === "number");
  const batteryMin = batteryValues.length ? Math.min(...batteryValues) : null;
  const batteryMax = batteryValues.length ? Math.max(...batteryValues) : null;
  const conditionValues = Array.from(new Set(result.rows.map((listing) => listing.condition).filter(Boolean)));
  const cityLabels = cities.map((city) => cityName(city));
  const canonical = `/phones/${b.slug}/${slugify(modelName)}`;
  const minPrice = result.total ? Math.min(...result.rows.map((x) => x.price_pkr)) : null;
  const faqItems = [
    {
      question: `What is the ${b.name} ${modelName} used price in Pakistan?`,
      answer: "Mobile Market shows current seller asking prices when active listings are available. The exact price depends on storage, condition, battery health, PTA status and other device details.",
    },
    {
      question: `Which ${b.name} ${modelName} storage options are available?`,
      answer: storageOptions.length ? `Current listings declare ${storageOptions.map((value) => `${value}GB`).join(", ")}. Availability can change with new seller inventory.` : "Storage is not currently declared in live listings.",
    },
    {
      question: `What battery health is reported for used ${b.name} ${modelName} phones?`,
      answer: batteryMin !== null ? `Current listings report battery health from ${batteryMin}% to ${batteryMax}%. Battery health is seller-provided and should be checked on the device.` : "Battery health is not currently declared in live listings.",
    },
    {
      question: `Is the ${b.name} ${modelName} PTA approved?`,
      answer: `PTA status can differ by handset and IMEI. Current seller labels include ${ptaStatuses.length ? ptaStatuses.map(ptaLabel).join(", ") : "no declared status"}. Verify the actual IMEI before buying.`,
    },
    {
      question: `Where can I find a used ${b.name} ${modelName} in Pakistan?`,
      answer: cities.length ? `Current listings are available in ${cityLabels.join(", ")}. Use the city links above to browse broader local inventory.` : "No city-level inventory is currently available.",
    },
  ];

  return (
    <Page>
      <PageTitle
        kicker={`${b.name} · Pakistan mobile market`}
        title={`${b.name} ${modelName} Price in Pakistan`}
        description={`Market information for ${b.name} ${modelName}: current seller asking prices, available configurations, PTA status and live listings.`}
      />

      <section className="mb-7 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-surface p-5"><p className="section-kicker">Current asking price</p><p className="mt-1 text-xl font-semibold text-ink">{result.total ? `Rs ${Math.min(...result.rows.map((x) => x.price_pkr)).toLocaleString("en-PK")} – Rs ${Math.max(...result.rows.map((x) => x.price_pkr)).toLocaleString("en-PK")}` : "No live price yet"}</p><p className="mt-1 text-xs text-muted">{result.total ? `Based on ${result.total} active seller listing${result.total === 1 ? "" : "s"}` : "We do not invent a price without live marketplace data."}</p></div>
        <div className="rounded-lg border border-line bg-surface p-5"><p className="section-kicker">Marketplace configurations</p><p className="mt-1 text-lg font-semibold text-ink">{storageOptions.length ? storageOptions.map((value) => `${value} GB`).join(" / ") : "Not listed"}</p><p className="mt-1 text-xs text-muted">RAM: {ramOptions.length ? ramOptions.map((value) => `${value} GB`).join(" / ") : "Not currently declared"}</p></div>
        <div className="rounded-lg border border-line bg-surface p-5"><p className="section-kicker">PTA status</p><p className="mt-1 text-lg font-semibold text-ink">{ptaStatuses.length ? ptaStatuses.map(ptaLabel).join(", ") : "No seller status yet"}</p><p className="mt-1 text-xs text-muted">Seller-declared status should be independently verified.</p></div>
      </section>

      <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <h2 className="text-base font-semibold">{b.name} {modelName} configurations and buying signals</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Storage</p><p className="mt-1 text-sm text-ink">{storageOptions.length ? storageOptions.map((value) => `${value}GB`).join(", ") : "Not currently listed"}</p></div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">RAM</p><p className="mt-1 text-sm text-ink">{ramOptions.length ? ramOptions.map((value) => `${value}GB`).join(", ") : "Not currently declared"}</p></div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Battery health</p><p className="mt-1 text-sm text-ink">{batteryMin !== null ? batteryMin === batteryMax ? `${batteryMin}% reported` : `${batteryMin}%–${batteryMax}% reported` : "Not currently declared"}</p></div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Condition</p><p className="mt-1 text-sm text-ink">{conditionValues.length ? conditionValues.join(", ") : "Not currently declared"}</p></div>
        </div>
        {ptaStatuses.length ? <p className="mt-4 text-sm text-muted">Current listings include {ptaStatuses.map(ptaLabel).join(" and ")} options. PTA status belongs to the individual handset, so verify the IMEI rather than assuming every {modelName} is approved.</p> : null}
      </section>

      <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <h2 className="text-base font-semibold">{b.name} {modelName} availability in Pakistan</h2>
        <p className="mt-2 text-sm text-muted">{cities.length ? `Current listings are represented in ${cityLabels.join(", ")}. City availability changes as sellers add or remove inventory.` : "No city-level inventory is currently available."}</p>
        {activeCities.length ? <div className="mt-4 flex flex-wrap gap-2">{activeCities.map((item) => <Link key={item.city} href={`/used-phones/${item.city}/${b.slug}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">{modelName} in {cityName(item.city)} <span className="ml-1 text-xs text-muted">({item.count})</span></Link>)}</div> : null}
      </section>

      <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <h2 className="text-base font-semibold">Explore {b.name} {modelName} by buying intent</h2>
        <p className="mt-2 text-sm text-muted">Use the broader marketplace hubs for price bands and PTA status; this model page remains the canonical destination for model-specific searches, configurations and local availability.</p>
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

      <ListingGrid>{result.rows.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</ListingGrid>

      <section className="mt-8 border-t border-line pt-7">
        <h2 className="text-lg font-semibold">Related {b.name} models</h2>
        <p className="mt-1 text-sm text-muted">Related links are prioritized by active seller inventory, keeping the strongest model-to-model connections tied to real marketplace depth.</p>
        {relatedModels.length ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {relatedModels.map((item) => (
              <Link key={item.model} href={`/phones/${b.slug}/${slugify(item.model)}`} className="rounded-md border border-line px-3 py-3 hover:border-brand/40 hover:bg-surface">
                <span className="text-sm font-medium text-ink">{item.model}</span>
                <span className="mt-1 block text-xs text-muted">{item.count} active seller listings</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">No other {b.name} model currently has enough active inventory for a prioritized related-model link.</p>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3 text-sm"><Link href={`/phones/${b.slug}`} className="link">All {b.name} phones</Link><Link href="/phones" className="link">All used phones</Link><Link href="/guides/buy-used-phone" className="link">How to buy a used phone</Link></div>

      <section className="mt-8 border-t border-line pt-7">
        <h2 className="text-lg font-semibold">Frequently asked questions</h2>
        <div className="mt-4 space-y-4 text-sm leading-6">
          <div><h3 className="font-semibold text-ink">What is the {b.name} {modelName} used price in Pakistan?</h3><p className="text-muted">Mobile Market shows current seller asking prices when active listings are available. The exact price depends on storage, condition, battery health, PTA status and other device details.</p></div>
          <div><h3 className="font-semibold text-ink">Which {b.name} {modelName} storage options are available?</h3><p className="text-muted">{storageOptions.length ? `Current listings declare ${storageOptions.map((value) => `${value}GB`).join(", ")}. Availability can change with new seller inventory.` : "Storage is not currently declared in live listings."}</p></div>
          <div><h3 className="font-semibold text-ink">What battery health is reported for used {b.name} {modelName} phones?</h3><p className="text-muted">{batteryMin !== null ? `Current listings report battery health from ${batteryMin}% to ${batteryMax}%. Battery health is seller-provided and should be checked on the device.` : "Battery health is not currently declared in live listings."}</p></div>
          <div><h3 className="font-semibold text-ink">Is the {b.name} {modelName} PTA approved?</h3><p className="text-muted">PTA status can differ by handset and IMEI. Current seller labels include {ptaStatuses.length ? ptaStatuses.map(ptaLabel).join(", ") : "no declared status"}. Verify the actual IMEI before buying.</p></div>
          <div><h3 className="font-semibold text-ink">Where can I find a used {b.name} {modelName} in Pakistan?</h3><p className="text-muted">{cities.length ? `Current listings are available in ${cityLabels.join(", ")}. Use the city links above to browse broader local inventory.` : "No city-level inventory is currently available."}</p></div>
        </div>
      </section>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: `Used ${b.name} phones`, item: absoluteUrl(`/phones/${b.slug}`) },
              { "@type": "ListItem", position: 3, name: `Used ${b.name} ${modelName}`, item: absoluteUrl(canonical) },
            ],
          },
          {
            "@type": "Product",
            "@id": absoluteUrl(canonical) + "#product",
            name: `Used ${b.name} ${modelName}`,
            brand: { "@type": "Brand", name: b.name },
            category: "Used mobile phone",
            offers: result.total ? {
              "@type": "AggregateOffer",
              priceCurrency: "PKR",
              lowPrice: Math.min(...result.rows.map((x) => x.price_pkr)),
              highPrice: Math.max(...result.rows.map((x) => x.price_pkr)),
              offerCount: result.total,
              url: absoluteUrl(canonical),
            } : undefined,
          },
          {
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ],
      }} />
    </Page>
  );
}
