import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox } from "@/components/GuideMeta";
import { Page, PageTitle } from "@/components/ui";
import { BUDGETS, budgetCheckedDate, budgetPicks, getBudget } from "@/lib/market/budget-phones";
import { brandSlug } from "@/lib/market/catalog";
import { formatCheckedDate } from "@/lib/market/model-prices";
import { BRAND, absoluteUrl } from "@/lib/market/site";

type Props = { params: Promise<{ budget: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return BUDGETS.map((b) => ({ budget: b.slug }));
}

const pkr = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function monthYear(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

function titleFor(label: string, checked: string | null) {
  return `Best Phones Under ${label} in Pakistan${checked ? ` (${monthYear(checked)})` : ""}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { budget } = await params;
  const b = getBudget(budget);
  if (!b) return { title: "Not found", robots: { index: false, follow: true } };
  const picks = budgetPicks(b);
  const checked = budgetCheckedDate(picks);
  const title = titleFor(b.label, checked);
  const description = `${picks.length} new PTA-approved phones under ${b.label} in Pakistan, with prices from brand sites and named retailers${checked ? ` checked ${formatCheckedDate(checked)}` : ""}. Specs and sources.`;
  const path = `/best-mobile-phones/${b.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: absoluteUrl(path), type: "article", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: title }] },
  };
}

export default async function BestPhonesBudgetPage({ params }: Props) {
  const { budget } = await params;
  const b = getBudget(budget);
  if (!b) notFound();
  const picks = budgetPicks(b);
  const checked = budgetCheckedDate(picks);
  const path = `/best-mobile-phones/${b.slug}`;
  const url = absoluteUrl(path);
  const title = titleFor(b.label, checked);
  const usedPath = `/used-mobile-phones/${b.slug}`;
  const others = BUDGETS.filter((x) => x.slug !== b.slug);
  const band = b.min ? `between ${pkr(b.min)} and ${b.label}` : `up to ${b.label}`;

  return (
    <Page>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: title,
              inLanguage: "en-PK",
              ...(checked ? { dateModified: checked } : {}),
              mainEntityOfPage: url,
              author: { "@type": "Organization", name: `${BRAND} editorial team`, url: absoluteUrl("/about") },
              publisher: { "@type": "Organization", name: BRAND, url: absoluteUrl("/"), logo: { "@type": "ImageObject", url: absoluteUrl("/icons/icon-512.png") } },
            },
            {
              "@type": "ItemList",
              name: title,
              itemListElement: picks.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${p.data.brand} ${p.data.model}`,
                url: absoluteUrl(`/phones/${brandSlug(p.data.brand)}/${slugify(p.data.model)}`),
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Mobile prices in Pakistan", item: absoluteUrl("/mobile-prices-in-pakistan") },
                { "@type": "ListItem", position: 3, name: `Best phones under ${b.label}`, item: url },
              ],
            },
          ],
        }}
      />
      <PageTitle
        kicker={checked ? `New phones · prices checked ${formatCheckedDate(checked)}` : "New phones"}
        title={title}
        description={`New, PTA-approved phones whose lowest verified price in Pakistan is ${band}. Every price links to the official brand page or named retailer it came from, with the date we checked it.`}
      />

      <section className="mb-7 rounded-lg border border-line bg-surface p-4 text-sm leading-relaxed text-ink-soft sm:p-5">
        <h2 className="text-base font-semibold text-ink">How this list is made</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Only new, PTA-approved units: the brand&apos;s own Pakistan price, or a named Pakistani retailer&apos;s PTA-approved listing. Non-PTA prices are never used here.</li>
          <li>Phones are ordered from the highest price to the lowest inside the budget, so the first entries show the most phone this budget buys. We do not run our own benchmark tests, so we do not score or rank them beyond that.</li>
          <li>Specs come from the brand&apos;s official specification page or press release. Where we have not verified a spec sheet yet, we show only the versions on sale.</li>
          <li>Retail prices change often and can include short discounts. Check the seller before you pay.</li>
        </ul>
        <p className="mt-3">
          Looking for a used phone instead? See <Link className="link" href={usedPath}>used phones under {b.label}</Link> from real seller listings.
        </p>
      </section>

      {picks.length ? (
        <ol className="space-y-4">
          {picks.map((p, i) => {
            const href = `/phones/${brandSlug(p.data.brand)}/${slugify(p.data.model)}`;
            return (
              <li key={`${p.data.brand}-${p.data.model}`} className="rounded-lg border border-line bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold text-ink">
                    {i + 1}. <Link href={href} className="hover:text-brand">{p.data.brand} {p.data.model}</Link>
                  </h2>
                  <p className="text-base font-semibold text-ink">{pkr(p.price)}</p>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {p.storage} · {p.kind === "official" ? "official brand price" : "PTA-approved retailer price"} ·{" "}
                  <a href={p.sourceHref} rel="nofollow noopener" target="_blank" className="link">{p.sourceLabel}</a> · checked {formatCheckedDate(p.sourceDate)}
                </p>
                {p.highlights.length ? (
                  <dl className="mt-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
                    {p.highlights.map((h) => (
                      <div key={h.label} className="flex gap-2">
                        <dt className="shrink-0 text-muted">{h.label}:</dt>
                        <dd className="text-ink-soft">{h.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <p className="mt-3 text-sm">
                  <Link href={href} className="link">All {p.data.model} versions, prices{p.fullSpecs ? ", specs" : ""} and used listings</Link>
                </p>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="rounded-lg border border-line bg-surface p-4 text-sm text-muted">We have no verified new-phone prices in this budget right now.</p>
      )}

      {b.slug === "under-30000" ? (
        <p className="mt-4 text-sm text-muted">
          Only a few current smartphones from the brands we track have a verified PTA-approved price under Rs 30,000. If your budget can stretch, see{" "}
          <Link className="link" href="/best-mobile-phones/under-50000">phones under Rs 50,000</Link>, or compare{" "}
          <Link className="link" href={usedPath}>used phones under Rs 30,000</Link>.
        </p>
      ) : null}

      <section className="mt-8 border-t border-line pt-6 text-sm">
        <h2 className="text-base font-semibold text-ink">Other budgets</h2>
        <div className="mt-2 flex flex-wrap gap-3">
          {others.map((o) => (
            <Link key={o.slug} className="link" href={`/best-mobile-phones/${o.slug}`}>Best phones under {o.label}</Link>
          ))}
          <Link className="link" href="/guides/pta-status">How to check PTA status</Link>
          <Link className="link" href="/guides/pta-tax">PTA tax calculator</Link>
        </div>
      </section>

      <AuthorBox
        reviewed={checked ? formatCheckedDate(checked) : "recently"}
        sourcesNote="Prices are copied from the official brand page or retailer listing linked next to each phone, on the date shown."
      />
    </Page>
  );
}
