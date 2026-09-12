import type { Metadata } from "next";
import Link from "next/link";
import { CatalogResults } from "@/components/CatalogResults";
import { BRANDS, cityLabel, getCity, ptaMeta } from "@/lib/market/catalog";
import { countBy, searchListings } from "@/lib/market/listings";
import { absoluteUrl, BRAND } from "@/lib/market/site";
import type { ListingFilters } from "@/lib/market/types";

type Props = { searchParams: Promise<ListingFilters> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = await searchParams;
  const filtered = Boolean(f.q || f.brand || f.city || f.pta || f.storage || f.area || f.condition);
  return {
    title: filtered ? "Filtered used phones" : "Used phones for sale",
    description: "Browse used mobile phones for sale across Pakistan. Filter by brand, PTA status, city and storage.",
    alternates: { canonical: absoluteUrl("/phones") },
    openGraph: {
      url: absoluteUrl("/phones"),
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: BRAND }],
    },
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function PhonesPage({ searchParams }: Props) {
  const f = await searchParams;
  const [result, brandCounts, cityCounts] = await Promise.all([
    searchListings({ ...f, category: "phone" }),
    countBy("brand", "phone"),
    countBy("city_slug", "phone"),
  ]);
  const liveBrands = BRANDS.filter((brand) => (brandCounts[brand.name] || 0) > 0);
  const liveCities = Object.keys(cityCounts)
    .filter((slug) => (cityCounts[slug] || 0) > 0)
    .map((slug) => getCity(slug))
    .filter((city): city is NonNullable<typeof city> => Boolean(city))
    .sort((a, b) => a.name.localeCompare(b.name));
  const bits = [
    f.brand,
    f.storage ? `${f.storage} GB` : "",
    f.pta ? ptaMeta(f.pta)?.label : "",
    f.city ? cityLabel(f.city, f.area) : "",
  ].filter(Boolean);
  return (
    <CatalogResults
      result={result}
      filters={{ ...f, category: "phone" }}
      action="/phones"
      lockedCategory="phone"
      kicker="Marketplace"
      title={bits.length ? bits.join(" · ") : "Used phones for sale"}
      emptyTitle="No phones match those filters"
      emptyBody="Try another brand, city or PTA status. Only real seller ads are shown — there are no demo listings in this catalog."
      intro={
        <>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-ink-soft">
            Browse used phones for sale across Pakistan. Compare listings by brand, PTA status, city and storage, then
            contact sellers directly. Check the phone and confirm its condition and PTA status before paying.
          </p>
          {liveBrands.length || liveCities.length ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {liveBrands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/phones/${brand.slug}`}
                  className="rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium hover:border-brand/40"
                >
                  {brand.name}
                </Link>
              ))}
              {liveCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/used-phones/${city.slug}`}
                  className="rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium hover:border-brand/40"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          ) : null}
          <p className="mb-6 text-sm text-muted">
            PTA status on listings is declared by the seller.{" "}
            <Link href="/guides/pta-status" className="link">
              Read the PTA status guide
            </Link>{" "}
            before you buy.
          </p>
        </>
      }
    />
  );
}
