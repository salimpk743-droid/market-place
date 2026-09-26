import type { Metadata } from "next";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { activePhoneBrandsByPta, activePhoneCitiesByPta, activePhoneModelsByPta, searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
import { ListingGrid, Page, PageTitle } from "@/components/ui";
import Link from "next/link";

const PTA_STATUS = "official";

export async function generateMetadata(): Promise<Metadata> {
  const result = await searchListings({ pta: PTA_STATUS });
  return {
    title: "PTA approved used phones",
    description: "Used phones whose sellers declared PTA approved status. Confirm on official PTA/DIRBS tools yourself.",
    alternates: { canonical: absoluteUrl("/pta-approved-phones") },
    robots: { index: true, follow: true },
  };
}

export default async function PtaApprovedPage() {
  const [brands, models, cities] = await Promise.all([
    activePhoneBrandsByPta(PTA_STATUS, 8, 1),
    activePhoneModelsByPta(PTA_STATUS, 12, 1),
    activePhoneCitiesByPta(PTA_STATUS, 8, 1),
  ]);
  const result = await searchListings({ pta: "official" });
  return (
    <Page>
      <PageTitle
        kicker="PTA"
        title="PTA approved used phones"
        description={
          <>
            These ads are here because the seller selected “PTA Approved”. Mobile Market does not query PTA systems. Read
            the{" "}
            <Link className="link" href="/guides/pta-status">
              PTA guide
            </Link>{" "}
            and verify the IMEI yourself.
          </>
        }
      />
      {(brands.length || models.length || cities.length) ? (
        <section className="mb-7 grid gap-5 rounded-lg border border-line bg-surface p-4 sm:p-5 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold">Brands with live inventory</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {brands.map((item) => (
                <Link key={item.brand} href={`/phones/${item.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">
                  {item.brand} <span className="text-xs text-muted">({item.count})</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold">Models with live inventory</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {models.map((item) => (
                <Link key={`${item.brand}-${item.model}`} href={`/phones/${item.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/${item.model.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">
                  {item.brand} {item.model} <span className="text-xs text-muted">({item.count})</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold">Cities with live inventory</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {cities.map((item) => (
                <Link key={item.city} href={`/used-phones/${item.city}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand/40">
                  {item.city.replace(/-/g, " ")} <span className="text-xs text-muted">({item.count})</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {result.rows.length ? (
        <ListingGrid>
          {result.rows.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </ListingGrid>
      ) : (
        <EmptyState title="No PTA-declared ads yet" body="This page lists only real seller ads marked PTA approved." />
      )}
    </Page>
  );
}
