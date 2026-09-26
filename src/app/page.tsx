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
import { activePhoneModels, countBy, featuredListings, recentListings } from "@/lib/market/listings";
import { BRAND, absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: { absolute: "Mobile Market — Used Mobile Phones & Accessories in Pakistan" },
  description:
    "Buy and sell used mobile phones and accessories in Pakistan. Browse iPhone, Samsung and other phones by city, PTA status, storage and price.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    url: absoluteUrl("/"),
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: BRAND }],
  },
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

const POPULAR_SEARCHES = [
  ["iPhone 18 Price in Pakistan", "/iphone-18-price-in-pakistan"],
  ["iPhone 18 Pro Price in Pakistan", "/iphone-18-pro-price-in-pakistan"],
  ["iPhone 18 Pro Max Price in Pakistan", "/iphone-18-pro-max-price-in-pakistan"],
  ["iPhone 17 Pro Max Price in Pakistan", "/phones/apple"],
  ["Samsung Galaxy S26 Ultra Price", "/phones/samsung"],
  ["Used iPhone Price in Pakistan", "/phones/apple"],
  ["PTA Approved iPhones", "/pta-approved-phones"],
  ["Non-PTA iPhones", "/non-pta-phones"],
  ["Used Mobile Phones in Lahore", "/used-phones/lahore"],
  ["Used Mobile Phones in Karachi", "/used-phones/karachi"],
  ["Used Mobile Phones in Islamabad", "/used-phones/islamabad"],
  ["Used Mobile Phones in Rawalpindi", "/used-phones/rawalpindi"],
] as const;

export default async function HomePage() {
  const [featured, recent, brandCounts, cityCounts, activeModels] = await Promise.all([
    featuredListings(6),
    recentListings(12),
    countBy("brand", "phone"),
    countBy("city_slug", "phone"),
    activePhoneModels(8, 2),
  ]);

  return (
    <main id="main" className="flex-grow">
      <section className="border-b border-line bg-brand-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="section-kicker text-white/60">Phones & accessories · {CITY_COUNT} locations</p>
          <h1 className="mt-2 max-w-2xl text-[1.65rem] font-semibold tracking-tight sm:text-4xl">
            Buy and sell used mobile phones and accessories across Pakistan
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
            {BRAND} is a classifieds marketplace for mobiles only — used phones, AirPods, chargers, power banks, covers
            and related accessories. Buyers and sellers deal directly. We do not inspect, certify or guarantee items.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
            Search listings by brand, city, PTA status, storage and other details. Buyers can contact sellers directly,
            while sellers can list their phones and accessories for local buyers across Pakistan.
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

        <section id="used-phone-hubs">
          <SectionHead
            title="Used phone price & budget hubs"
            description="Start with the type of phone you want, then compare real seller listings by budget, brand and city."
            href="/used-mobile-phones"
            linkLabel="All used phones"
          />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Used phones under Rs 20,000", "/used-mobile-phones/under-20000"],
              ["Used phones under Rs 30,000", "/used-mobile-phones/under-30000"],
              ["Used phones under Rs 50,000", "/used-mobile-phones/under-50000"],
              ["Used phones under Rs 100,000", "/used-mobile-phones/under-100000"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-md border border-line px-3 py-3 text-sm font-medium text-brand hover:border-brand/30 hover:bg-surface">
                {label}
              </Link>
            ))}
          </div>
        </section>

        {activeModels.length ? (
          <section id="active-models">
            <SectionHead
              title="Models with active marketplace inventory"
              description="These model pages are prioritized from current seller inventory, keeping the strongest internal links tied to real listings."
              href="/used-mobile-phones"
              linkLabel="All used phones"
            />
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {activeModels.map((item) => {
                const brand = BRANDS.find((b) => b.name === item.brand);
                if (!brand) return null;
                const modelSlug = item.model.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                return (
                  <Link key={`${item.brand}-${item.model}`} href={`/phones/${brand.slug}/${modelSlug}`} className="rounded-md border border-line px-3 py-3 hover:border-brand/30 hover:bg-surface">
                    <span className="text-sm font-semibold text-ink">{item.brand} {item.model}</span>
                    <span className="mt-1 block text-xs text-muted">{item.count} active seller listings</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <section id="popular-searches" className="card p-6 sm:p-8">
          <SectionHead
            title="Popular mobile prices & searches in Pakistan"
            description="Explore current phone prices, PTA information and used-phone listings on Mobile Market."
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_SEARCHES.map(([label, href]) => (
              <Link key={href + label} href={href} className="rounded-md border border-line px-3 py-3 text-sm font-medium text-brand hover:border-brand/30 hover:bg-surface">
                {label}
              </Link>
            ))}
          </div>
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
          <SectionHead title="Browse by city" description="Cities with live used-phone inventory, across every province, AJK and GB." href="/browse" linkLabel="All locations" />
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
          "@type": "WebSite",
          name: BRAND,
          url: absoluteUrl("/"),
          potentialAction: {
            "@type": "SearchAction",
            target: `${absoluteUrl("/browse")}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
    </main>
  );
}
