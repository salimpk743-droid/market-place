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
  const filtered = Boolean(
    f.q || f.brand || f.city || f.pta || f.storage || f.area || f.condition || f.minPrice || f.maxPrice || f.page,
  );
  return {
    title: filtered ? "Used Mobile Phones in Pakistan" : "Used Mobile Phones in Pakistan — Buy & Sell Used Phones",
    description:
      "Browse used mobile phones for sale across Pakistan. Compare iPhone, Samsung, Vivo, Oppo, Infinix, Tecno and Xiaomi listings by price, city, storage, condition and seller-declared PTA status.",
    alternates: { canonical: absoluteUrl("/phones") },
    openGraph: {
      url: absoluteUrl("/phones"),
      title: "Used Mobile Phones in Pakistan — Buy & Sell Used Phones",
      description:
        "Browse used mobile phones for sale across Pakistan. Compare brands, models, prices, cities, storage and seller-declared PTA status.",
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
      title={bits.length ? bits.join(" · ") : "Used Mobile Phones in Pakistan"}
      emptyTitle="No used phones match those filters"
      emptyBody="Try another brand, city or PTA status. Only real seller ads are shown — there are no demo listings in this catalog."
      intro={
        <>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-ink-soft">
            Browse used mobile phones for sale across Pakistan. Compare real seller listings by brand, model, price,
            PTA status, city, storage and condition, then contact sellers directly. Popular searches include used
            iPhone, Samsung, Vivo, Oppo, Infinix, Tecno and Xiaomi phones in Pakistan. Always inspect the phone and
            independently confirm its condition and PTA status before paying.
          </p>

          {liveBrands.length ? (
            <section aria-labelledby="popular-phone-brands" className="mb-5">
              <h2 id="popular-phone-brands" className="mb-3 text-base font-semibold">
                Used Mobile Phones by Brand
              </h2>
              <div className="flex flex-wrap gap-2">
                {liveBrands.map((brand) => (
                  <Link
                    key={brand.slug}
                    href={`/phones/${brand.slug}`}
                    className="rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium hover:border-brand/40"
                  >
                    {brand.name} Mobile Phones
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {liveCities.length ? (
            <section aria-labelledby="popular-phone-cities" className="mb-5">
              <h2 id="popular-phone-cities" className="mb-3 text-base font-semibold">
                Used Mobile Phones by City
              </h2>
              <div className="flex flex-wrap gap-2">
                {liveCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/used-phones/${city.slug}`}
                    className="rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium hover:border-brand/40"
                  >
                    Used Phones in {city.name}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section aria-labelledby="phone-searches" className="mb-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-line bg-surface p-4">
              <h2 id="phone-searches" className="text-sm font-semibold">
                Mobile Prices & Model Searches
              </h2>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-sm">
                <Link href="/mobile-prices-in-pakistan" className="link">
                  Mobile Prices in Pakistan
                </Link>
                <Link href="/phones/apple" className="link">
                  iPhone Prices in Pakistan
                </Link>
                <Link href="/phones/samsung" className="link">
                  Samsung Mobile Prices
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-surface p-4">
              <h2 className="text-sm font-semibold">PTA Mobile Phones</h2>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-sm">
                <Link href="/pta-approved-phones" className="link">
                  PTA Approved Phones
                </Link>
                <Link href="/non-pta-phones" className="link">
                  Non-PTA Phones
                </Link>
                <Link href="/guides/pta-status" className="link">
                  PTA Status Guide
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-surface p-4">
              <h2 className="text-sm font-semibold">Buy by Budget</h2>
              <p className="mt-2 text-sm text-muted">
                Use the filters above to find phones in your price range, then compare actual seller listings.
              </p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-sm">
                <Link href="/mobile-prices-in-pakistan" className="link">
                  Compare Mobile Prices
                </Link>
                <Link href="/guides/buy-used-phone" className="link">
                  Used Phone Buying Guide
                </Link>
              </div>
            </div>
          </section>

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
