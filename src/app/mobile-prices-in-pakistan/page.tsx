import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { BRANDS, MODELS_BY_BRAND } from "@/lib/market/catalog";
import { absoluteUrl } from "@/lib/market/site";
import { Page, PageTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mobile Prices in Pakistan — Used, PTA & Non-PTA Phones",
  description:
    "Explore Mobile Market's Pakistan mobile price hub: Apple, Samsung, Xiaomi, Vivo, Oppo, Infinix, Google, OnePlus, Realme, Tecno and more, with model pages, PTA guidance and live used-phone listings.",
  alternates: { canonical: absoluteUrl("/mobile-prices-in-pakistan") },
  openGraph: {
    title: "Mobile Prices in Pakistan — Used, PTA & Non-PTA Phones",
    description:
      "A Pakistan-focused hub for mobile prices, phone models, PTA status, used-phone market information and live Mobile Market listings.",
    url: absoluteUrl("/mobile-prices-in-pakistan"),
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Mobile Prices in Pakistan" }],
  },
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function MobilePricesPakistanPage() {
  return (
    <Page>
      <PageTitle
        kicker="Pakistan mobile market"
        title="Mobile Prices in Pakistan"
        description="Use Mobile Market as a starting point for checking phone models, used-market asking prices, PTA and non-PTA considerations, and live seller listings."
      />
      <div className="space-y-8">
        <section className="rounded-lg border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-ink">How Mobile Market pricing works</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">
            There is rarely one correct used-phone price in Pakistan. Storage, condition, battery health, warranty,
            PTA status, import status and seller location can all change the asking price. Live listings on this site
            are seller asking prices; they are not manufacturer prices or independent valuations.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-line bg-white p-4"><p className="text-sm font-semibold">New / official</p><p className="mt-1 text-xs leading-5 text-muted">Manufacturer or retailer pricing when verified and available.</p></div>
            <div className="rounded-md border border-line bg-white p-4"><p className="text-sm font-semibold">Used market</p><p className="mt-1 text-xs leading-5 text-muted">Current seller asking prices from Mobile Market listings.</p></div>
            <div className="rounded-md border border-line bg-white p-4"><p className="text-sm font-semibold">PTA / Non-PTA</p><p className="mt-1 text-xs leading-5 text-muted">Treat PTA status as a device-level detail and verify IMEI before purchase.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Browse mobile prices by brand</h2>
          <p className="mt-1 text-sm text-muted">Each brand page leads to supported models and, where available, current marketplace listings.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {BRANDS.map((brand) => (
              <Link key={brand.slug} href={`/phones/${brand.slug}`} className="card p-4 hover:border-brand/30">
                <p className="font-semibold text-ink">{brand.name}</p>
                <p className="mt-1 text-xs text-muted">{(MODELS_BY_BRAND[brand.name] || []).length} supported models</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Popular model price pages</h2>
          <p className="mt-1 text-sm text-muted">These pages connect model information with real marketplace inventory when sellers have listed the device.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {BRANDS.flatMap((brand) =>
              (MODELS_BY_BRAND[brand.name] || []).slice(0, 4).map((model) => (
                <Link key={`${brand.slug}-${slugify(model)}`} href={`/phones/${brand.slug}/${slugify(model)}`} className="rounded-md border border-line px-4 py-3 text-sm hover:border-brand/30 hover:bg-surface">
                  <span className="font-medium text-ink">{brand.name} {model}</span>
                  <span className="mt-1 block text-xs text-muted">Price, PTA status & live listings</span>
                </Link>
              )),
            )}
          </div>
        </section>

        <section className="border-t border-line pt-7">
          <h2 className="text-lg font-semibold text-ink">PTA, buying and used-phone guides</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link className="link" href="/guides/pta-status">How to check PTA status</Link>
            <Link className="link" href="/guides/buy-used-phone">How to buy a used phone</Link>
            <Link className="link" href="/guides/inspect-used-phone">How to inspect a used phone</Link>
            <Link className="link" href="/guides/battery-health">Battery health guide</Link>
            <Link className="link" href="/buyer-safety">Buyer Safety</Link>
          </div>
        </section>
      </div>
      <JsonLd data={{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":absoluteUrl("/")},
        {"@type":"ListItem","position":2,"name":"Mobile Prices in Pakistan","item":absoluteUrl("/mobile-prices-in-pakistan")}
      ]}} />
    </Page>
  );
}
