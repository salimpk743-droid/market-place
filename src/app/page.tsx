import Link from "next/link";
import type { Metadata } from "next";
import {
  BatteryCharging,
  Cable,
  Headphones,
  Smartphone,
  Watch,
  Speaker,
  TabletSmartphone,
  ScanLine,
} from "lucide-react";
import { SearchForm } from "@/components/SearchForm";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { JsonLd } from "@/components/JsonLd";
import { ListingGrid, SectionHead } from "@/components/ui";
import { ACCESSORY_SLUGS, BRANDS, CATEGORIES, CITY_COUNT, categoryPath, popularCities } from "@/lib/market/catalog";
import { countBy, featuredListings, recentListings } from "@/lib/market/listings";
import { BRAND, absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: `${BRAND} — Buy & sell used phones and mobile accessories in Pakistan`,
  description:
    "Search used iPhone, Samsung, AirPods, chargers, power banks, covers and more by city across Pakistan.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: { url: absoluteUrl("/") },
};

const CATEGORY_ICON: Record<string, typeof Smartphone> = {
  phone: Smartphone,
  "power-bank": BatteryCharging,
  "charger-cable": Cable,
  earbuds: Headphones,
  headphones: Headphones,
  "cover-case": TabletSmartphone,
  "screen-protector": ScanLine,
  "smartwatch-band": Watch,
  "other-accessory": Speaker,
};

export default async function HomePage() {
  const [featured, recent, brandCounts, cityCounts] = await Promise.all([
    featuredListings(6),
    recentListings(12),
    countBy("brand"),
    countBy("city_slug"),
  ]);

  return (
    <main id="main" className="flex-grow">
      <section className="border-b border-line bg-brand-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="section-kicker text-white/60">Phones & accessories · {CITY_COUNT} locations</p>
          <h1 className="mt-2 max-w-2xl text-[1.65rem] font-semibold tracking-tight sm:text-4xl">
            Buy and sell phones and mobile accessories across Pakistan
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
            {BRAND} is a classifieds marketplace for mobiles only — used phones, AirPods, chargers, power banks, covers
            and related accessories. Buyers and sellers deal directly. We do not inspect, certify or guarantee items.
          </p>
          <div className="mt-6">
            <SearchForm />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl space-y-12 px-4 py-10 sm:space-y-14 sm:py-14">
        <section id="categories">
          <SectionHead
            title="Browse categories"
            description="This marketplace is only for mobile phones and things that go with them."
            href="/browse"
            linkLabel="All listings"
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICON[c.slug] || Smartphone;
              return (
                <Link key={c.slug} href={categoryPath(c.slug)} className="card px-3 py-4 hover:border-brand/30">
                  <Icon className="h-5 w-5 text-brand" aria-hidden />
                  <p className="mt-2 text-sm font-semibold text-ink">{c.short}</p>
                  <p className="mt-1 text-xs leading-snug text-muted">{c.blurb}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {featured.length ? (
          <section>
            <SectionHead
              title="Featured listings"
              description="Staff-highlighted ads from real sellers. Featured is not a verification of the item or seller."
              href="/browse"
            />
            <ListingGrid>
              {featured.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </ListingGrid>
          </section>
        ) : null}

        <section>
          <SectionHead
            title="Recently added"
            description="Newest public listings from sellers on Mobile Market."
            href="/browse"
          />
          {recent.rows.length ? (
            <ListingGrid>
              {recent.rows.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </ListingGrid>
          ) : (
            <EmptyState
              title="No live listings yet"
              body="When sellers post real phones or accessories, they will appear here. There are no sample or demo ads in the public marketplace."
              actionHref="/sell"
              actionLabel="Sell your phone"
            />
          )}
        </section>

        <section id="brands">
          <SectionHead title="Browse phones by brand" description="Open a brand to filter by storage, PTA status and city." href="/phones" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {BRANDS.map((b) => (
              <Link key={b.slug} href={`/phones/${b.slug}`} className="card px-3 py-3.5 text-center hover:border-brand/30">
                <p className="text-sm font-semibold text-ink">{b.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {brandCounts[b.name] ? `${brandCounts[b.name]} live ad${brandCounts[b.name] === 1 ? "" : "s"}` : "Browse models"}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section id="cities">
          <SectionHead title="Browse by city" description="Districts, tehsils and major towns across every province, AJK and GB." href="/browse" linkLabel="All locations" />
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 md:grid-cols-4">
            {popularCities().map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/used-phones/${c.slug}`}
                  className="flex min-h-10 items-center justify-between gap-2 rounded-md px-1 py-1.5 text-sm hover:bg-surface"
                >
                  <span className="font-medium text-brand-ink">{c.name}</span>
                  <span className="text-xs tabular-nums text-muted">{cityCounts[c.slug] ? cityCounts[c.slug] : ""}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <Link href="/pta-approved-phones" className="card p-5 hover:border-brand/30">
            <p className="section-kicker">PTA</p>
            <h2 className="mt-1 text-lg">PTA approved phones</h2>
            <p className="mt-1 text-sm text-muted">Seller-declared PTA approved ads. Confirm IMEI on official tools yourself.</p>
          </Link>
          <Link href="/accessories" className="card p-5 hover:border-brand/30">
            <p className="section-kicker">Accessories</p>
            <h2 className="mt-1 text-lg">Chargers, AirPods and more</h2>
            <p className="mt-1 text-sm text-muted">
              {ACCESSORY_SLUGS.length} accessory categories, from power banks to covers. Phones stay on Used Phones.
            </p>
          </Link>
        </section>

        <section id="how-it-works" className="card p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl">How Mobile Market works</h2>
          <ol className="mt-4 grid gap-4 text-sm text-ink-soft sm:grid-cols-3">
            <li>
              <p className="font-semibold text-ink">1. Search</p>
              <p className="mt-1">Filter by category, brand, city and price. Listings are posted by independent sellers.</p>
            </li>
            <li>
              <p className="font-semibold text-ink">2. Inspect</p>
              <p className="mt-1">Meet in public. For phones, check IMEI and PTA before you pay. For accessories, check original vs copy.</p>
            </li>
            <li>
              <p className="font-semibold text-ink">3. Deal directly</p>
              <p className="mt-1">We do not take payment or hold stock. The sale is between buyer and seller.</p>
            </li>
          </ol>
        </section>

        <section className="border-t border-line pt-8">
          <h2 className="text-lg">Safety and trust</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Contact numbers are hidden until you request them. You can report a listing. Featured is not a certificate.
            Read{" "}
            <Link href="/buyer-safety" className="link">
              Buyer Safety
            </Link>{" "}
            and{" "}
            <Link href="/rules" className="link">
              Marketplace Rules
            </Link>
            .
          </p>
        </section>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") }],
        }}
      />
    </main>
  );
}
