import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { OwnerTools } from "@/components/OwnerTools";
import { cityLabel, getCategory, ptaMeta } from "@/lib/market/catalog";
import { formatPkr, listingPath, listingTitle } from "@/lib/market/format";
import { myListings } from "@/lib/market/listings";
import { Page, PageTitle, StatusBadge } from "@/components/ui";

export const metadata: Metadata = { title: "My ads", robots: { index: false, follow: false } };

export default async function MyAdsPage() {
  const { user, rows } = await myListings();
  if (!user) redirect("/login?next=/my-ads");
  const active = rows.filter((l) => l.status === "active");
  const sold = rows.filter((l) => l.status === "sold");
  const other = rows.filter((l) => l.status !== "active" && l.status !== "sold");

  function Group({ title, items }: { title: string; items: typeof rows }) {
    if (!items.length) return null;
    return (
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{title}</h2>
        <div className="space-y-3">
          {items.map((l) => (
            <article key={l.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
              <Link href={listingPath(l)} className="shrink-0 sm:w-36">
                {l.image_url ? (
                  <img
                    src={l.image_url}
                    alt={listingTitle(l)}
                    className={`h-28 w-full rounded-md object-cover sm:h-24 ${l.status === "sold" ? "opacity-50" : ""}`}
                  />
                ) : (
                  <div className="grid h-24 place-items-center rounded-md bg-page text-xs text-muted">No photo</div>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold">
                    <Link href={listingPath(l)} className="hover:underline">
                      {listingTitle(l)}
                    </Link>
                  </h3>
                  <StatusBadge pta={l.pta_status} status={l.status} featured={l.featured} category={l.category} />
                </div>
                <p className="mt-1 font-semibold tabular-nums text-brand-ink">{formatPkr(l.price_pkr)}</p>
                <p className="mt-1 text-xs text-muted">
                  {cityLabel(l.city_slug, l.area)} · {getCategory(l.category).short}
                  {ptaMeta(l.pta_status) ? ` · ${ptaMeta(l.pta_status)?.label}` : ""}
                </p>
                <OwnerTools id={l.id} sold={l.status === "sold"} compact />
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <Page>
      <PageTitle
        kicker="Seller dashboard"
        title="My ads"
        description={`Signed in as ${user.email}. Ownership is tied to this account, not a phone number.`}
        actions={
          <Link href="/sell" className="btn btn-primary btn-compact">
            Sell your phone
          </Link>
        }
      />
      {!rows.length ? (
        <EmptyState
          title="You haven't posted any ads yet"
          body="Post a phone or accessory after confirming your email. You can edit, mark sold or delete it from this page."
          actionHref="/sell"
          actionLabel="Sell your first item"
        />
      ) : (
        <>
          <Group title={`Active (${active.length})`} items={active} />
          <Group title={`Sold (${sold.length})`} items={sold} />
          <Group title="Other" items={other} />
        </>
      )}
    </Page>
  );
}
