import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { JsonLd } from "@/components/JsonLd";
import { getCity, BRANDS } from "@/lib/market/catalog";
import { activePhoneBrandsByCity, activePhoneModelsByCity, searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
import { ListingGrid, Page, PageTitle } from "@/components/ui";

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return { title: "City not found", robots: { index: false, follow: true } };
  const result = await searchListings({ city: c.slug, category: "phone" });
  return {
    title: `Used phones in ${c.name}`,
    description: `Browse used phones for sale in ${c.name}, Pakistan on Mobile Market. See live listings from sellers in ${c.name} by brand, PTA status and area.`,
    alternates: { canonical: absoluteUrl(`/used-phones/${c.slug}`) },
    robots: result.total > 0 ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();
  const [result, rankedBrands] = await Promise.all([
    searchListings({ city: c.slug, category: "phone" }),
    activePhoneBrandsByCity(c.slug, 8, 1),
  ]);
  const liveBrands = rankedBrands
    .map((item) => {
      const brand = BRANDS.find((candidate) => candidate.name.toLowerCase() === item.brand.toLowerCase());
      return brand ? { ...brand, count: item.count } : null;
    })
    .filter((brand): brand is NonNullable<typeof brand> => Boolean(brand));
  const brandModels = await Promise.all(
    liveBrands.slice(0, 6).map(async (brand) => ({
      brand,
      models: await activePhoneModelsByCity(c.slug, brand.name, 5, 1),
    })),
  );
  const islamabad = c.slug === "islamabad";
  return (
    <Page>
      <PageTitle
        kicker="City"
        title={`Used phones in ${c.name}`}
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
          <h2 className="text-base font-semibold">Phone brands with live inventory in {c.name}</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {brandModels.map(({ brand, models }) => (
              <div key={brand.slug} className="rounded-md border border-line bg-white p-3">
                <div className="flex items-baseline justify-between gap-3">
                  <Link href={`/used-phones/${c.slug}/${brand.slug}`} className="font-semibold hover:text-brand">{brand.name}</Link>
                  <span className="text-xs text-muted">{brand.count} active listings</span>
                </div>
                {models.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {models.map((item) => (
                      <Link key={item.model} href={`/phones/${brand.slug}/${item.model.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`} className="rounded border border-line px-2 py-1 text-xs hover:border-brand/40">
                        {item.model} ({item.count})
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {liveBrands.length > 6 ? <p className="mt-3 text-xs text-muted">Showing the six strongest brands by active inventory; each brand links to its city-specific listings.</p> : null}
        </section>
      ) : null}
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
