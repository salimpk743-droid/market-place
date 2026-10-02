import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox } from "@/components/GuideMeta";
import { ModelPricePanel } from "@/components/ModelPricePanel";
import { Page, PageTitle } from "@/components/ui";
import type { ModelPriceData } from "@/lib/market/model-prices";
import { formatCheckedDate, lowestOfficialPrice } from "@/lib/market/model-prices";
import { absoluteUrl } from "@/lib/market/site";

export type GuideFaq = { question: string; answer: string };

/** Editorial price page for one model: verified price panel, buying notes, FAQ and schema. */
export function IPhonePriceGuide({
  data,
  path,
  modelPagePath,
  related,
  extraFaq = [],
}: {
  data: ModelPriceData;
  path: string;
  modelPagePath: string;
  related: { href: string; title: string; text: string }[];
  extraFaq?: GuideFaq[];
}) {
  const from = lowestOfficialPrice(data);
  const updated = formatCheckedDate(data.lastUpdated);
  const nonPtaKnown = data.variants.some((v) => v.nonPta?.length);
  const faq: GuideFaq[] = [
    { question: `What is the ${data.model} price in Pakistan?`, answer: data.summary },
    {
      question: `What is the ${data.model} non-PTA price in Pakistan?`,
      answer: nonPtaKnown
        ? `Non-PTA prices we verified are in the table above, with the retailer and date. Non-PTA prices change often and a non-PTA phone only works on Pakistani networks after the PTA tax is paid.`
        : `We have not found a verified non-PTA retail price for the ${data.model} yet, so we don't show one. A non-PTA phone only works on Pakistani networks after the PTA tax is paid.`,
    },
    {
      question: `What is the PTA tax on the ${data.model}?`,
      answer: data.ptaTax
        ? `The published estimate is Rs ${data.ptaTax.passport.toLocaleString("en-PK")} on passport and Rs ${data.ptaTax.cnic.toLocaleString("en-PK")} on CNIC. The PSID amount on DIRBS on the day you pay is final.`
        : `No reliable PTA tax figure for the ${data.model} has been published yet. Generate a PSID on DIRBS to see the exact amount, and read our PTA tax guide for how it is calculated.`,
    },
    ...extraFaq,
  ];
  return (
    <Page className="max-w-4xl">
      <PageTitle
        kicker={`Apple · ${data.model} · updated ${updated}`}
        title={`${data.model} Price in Pakistan`}
        description={from ? `Official PTA-approved prices from Rs ${from.toLocaleString("en-PK")}, every storage option, verified non-PTA prices, specs and sources.` : undefined}
      />

      <ModelPricePanel data={data} />

      <article className="prose prose-sm max-w-none text-ink-soft">
        <h2>PTA approved or non-PTA {data.model}: what to check</h2>
        <ul>
          <li><strong>Official PTA approved</strong> units come through Apple&apos;s Pakistan distributors with local warranty and work on every network.</li>
          <li><strong>Non-PTA</strong> units are cheaper up front, but they stop working on Pakistani SIMs unless you pay the PTA tax through DIRBS.</li>
          <li>Check the IMEI on the phone (dial <code>*#06#</code>) and verify it on DIRBS before paying. A seller&apos;s &ldquo;PTA&rdquo; label is a claim, not proof.</li>
        </ul>
        <p>
          Read the <Link href="/guides/pta-status">non-PTA meaning guide</Link> and the{" "}
          <Link href="/guides/pta-tax">PTA tax guide and calculator</Link> before you buy.
        </p>

        <h2>Used {data.model} on Mobile Market</h2>
        <p>
          Used prices depend on condition, battery health, storage, warranty and PTA status. See current seller listings on the{" "}
          <Link href={modelPagePath}>used {data.model} page</Link>, or browse all <Link href="/phones/apple">used iPhones</Link>.
        </p>

        <div className="not-prose grid gap-3 sm:grid-cols-3">
          {related.map((r) => (
            <Link key={r.href} className="card p-4 hover:border-brand/30" href={r.href}>
              <p className="font-semibold text-ink">{r.title}</p>
              <p className="mt-1 text-sm text-muted">{r.text}</p>
            </Link>
          ))}
        </div>

        <h2>Frequently asked questions</h2>
        {faq.map((f) => (
          <div key={f.question}>
            <h3>{f.question}</h3>
            <p>{f.answer}</p>
          </div>
        ))}
        <AuthorBox reviewed={updated} sourcesNote="Prices and specifications are taken from the dated sources listed in the price table." />
      </article>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Apple phones", item: absoluteUrl("/phones/apple") },
                { "@type": "ListItem", position: 3, name: `${data.model} Price in Pakistan`, item: absoluteUrl(path) },
              ],
            },
            {
              "@type": "Article",
              headline: `${data.model} Price in Pakistan`,
              dateModified: data.lastUpdated,
              author: { "@type": "Organization", name: "Mobile Market", url: absoluteUrl("/") },
              publisher: { "@type": "Organization", name: "Mobile Market", url: absoluteUrl("/") },
              mainEntityOfPage: absoluteUrl(path),
            },
            {
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
            },
          ],
        }}
      />
    </Page>
  );
}
