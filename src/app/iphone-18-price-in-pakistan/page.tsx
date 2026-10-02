import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox, SourceList } from "@/components/GuideMeta";
import { Page, PageTitle } from "@/components/ui";
import { formatCheckedDate, getModelPriceData, lowestOfficialPrice, MODEL_PRICES } from "@/lib/market/model-prices";
import { absoluteUrl } from "@/lib/market/site";

const pagePath = "/iphone-18-price-in-pakistan";
const UPDATED = "2026-10-02";

const pro = getModelPriceData("Apple", "iPhone 18 Pro");
const proMax = getModelPriceData("Apple", "iPhone 18 Pro Max");
const proFrom = pro ? lowestOfficialPrice(pro) : null;
const proMaxFrom = proMax ? lowestOfficialPrice(proMax) : null;
const rs = (n: number | null) => (n ? `Rs ${n.toLocaleString("en-PK")}` : "—");

const iphone17 = MODEL_PRICES.filter((m) => m.brand === "Apple" && !m.model.startsWith("iPhone 18"));

const sources = [
  { label: "Apple Newsroom: Apple debuts iPhone 18 Pro and iPhone 18 Pro Max (9 Sep 2026)", href: "https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/" },
  { label: "Apple Newsroom: Apple unveils iPhone Duo (9 Sep 2026)", href: "https://www.apple.com/newsroom/2026/09/apple-unveils-iphone-duo/" },
  { label: "PhoneWorld: iPhone 18 Pro series launches in Pakistan, iSelect by Airlink and GNext prices (25 Sep 2026)", href: "https://www.phoneworld.com.pk/iphone-18-pro-series-launches-in-pakistan-with-prices-starting-at-rs-563999/" },
  { label: "Minute Mirror: iPhone 18 Pro prices announced in Pakistan, Mercantile price list (25 Sep 2026)", href: "https://minutemirror.com.pk/iphone-18-pro-prices-announced-in-pakistan-635340/" },
];

const faq = [
  {
    question: "Is the iPhone 18 available in Pakistan?",
    answer:
      "Not the base iPhone 18. As of 2 October 2026 Apple has announced only the iPhone 18 Pro, iPhone 18 Pro Max and the foldable iPhone Duo. Apple has not announced a standard iPhone 18, so there is no official Pakistan price for it.",
  },
  {
    question: "What is the iPhone 18 Pro price in Pakistan?",
    answer: `The official PTA-approved iPhone 18 Pro starts at ${rs(proFrom)} (256GB) at iSelect by Airlink and GNext. The iPhone 18 Pro Max starts at ${rs(proMaxFrom)}.`,
  },
  {
    question: "When will the iPhone Duo come to Pakistan?",
    answer:
      "Apple says iPhone Duo pre-orders begin 16 October 2026 and sales start 23 October 2026 in its first-wave countries, with more countries from 30 October. Pakistan is not named in Apple's list, and no Pakistan price has been announced.",
  },
  {
    question: "Should I buy a non-PTA iPhone 18 Pro?",
    answer:
      "Only if you are ready to pay the PTA tax, which can be a large share of the phone's price. A non-PTA phone stops working on Pakistani SIMs until the tax is paid. Check the IMEI on DIRBS before paying.",
  },
];

export const metadata: Metadata = {
  title: { absolute: "iPhone 18 Price in Pakistan 2026: Which Models Are Out" },
  description:
    "Apple has not announced a base iPhone 18. Official Pakistan prices for the iPhone 18 Pro and 18 Pro Max, iPhone Duo dates, and iPhone 17 prices.",
  alternates: { canonical: absoluteUrl(pagePath) },
  openGraph: {
    title: "iPhone 18 Price in Pakistan 2026",
    description: "Which iPhone 18 models exist, official Pakistan prices for the 18 Pro and 18 Pro Max, and iPhone Duo dates.",
    url: absoluteUrl(pagePath),
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "iPhone 18 Price in Pakistan" }],
  },
};

export default function IPhone18PakistanPage() {
  return (
    <Page className="max-w-4xl">
      <PageTitle
        kicker={`Apple · updated ${formatCheckedDate(UPDATED)}`}
        title="iPhone 18 Price in Pakistan"
        description="Which iPhone 18 models Apple has actually announced, and their verified Pakistan prices."
      />

      <article className="prose prose-sm max-w-none text-ink-soft">
        <div className="card not-prose p-5 sm:p-6">
          <p className="section-kicker">Short answer</p>
          <h2 className="mt-1 text-xl text-ink">There is no base iPhone 18 yet</h2>
          <p className="mt-2 text-sm text-muted">
            In September 2026 Apple announced the <strong>iPhone 18 Pro</strong>, <strong>iPhone 18 Pro Max</strong> and the foldable{" "}
            <strong>iPhone Duo</strong>. Apple has not announced a standard iPhone 18, so any &ldquo;iPhone 18 price&rdquo; you see for it is a guess. We
            don&apos;t publish one.
          </p>
        </div>

        <h2>iPhone 18 series prices in Pakistan</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th scope="col" className="py-2 pr-3">Model</th>
                <th scope="col" className="py-2 pr-3">Status</th>
                <th scope="col" className="py-2 pr-3">Official price (PTA approved)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <th scope="row" className="py-2 pr-3 font-medium text-ink"><Link href="/iphone-18-pro-price-in-pakistan" className="link">iPhone 18 Pro</Link></th>
                <td className="py-2 pr-3">On sale in Pakistan</td>
                <td className="py-2 pr-3">From {rs(proFrom)} (256GB)</td>
              </tr>
              <tr className="border-b border-line">
                <th scope="row" className="py-2 pr-3 font-medium text-ink"><Link href="/iphone-18-pro-max-price-in-pakistan" className="link">iPhone 18 Pro Max</Link></th>
                <td className="py-2 pr-3">On sale in Pakistan</td>
                <td className="py-2 pr-3">From {rs(proMaxFrom)} (256GB)</td>
              </tr>
              <tr className="border-b border-line">
                <th scope="row" className="py-2 pr-3 font-medium text-ink">iPhone Duo (foldable)</th>
                <td className="py-2 pr-3">Announced; first-wave sales from 23 Oct 2026</td>
                <td className="py-2 pr-3">No Pakistan price announced</td>
              </tr>
              <tr>
                <th scope="row" className="py-2 pr-3 font-medium text-ink">iPhone 18 (base)</th>
                <td className="py-2 pr-3">Not announced by Apple</td>
                <td className="py-2 pr-3">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">
          Prices are from iSelect by Airlink / GNext as reported on 25 Sep 2026. Full storage-by-storage tables, Mercantile prices and verified non-PTA prices are on the
          iPhone 18 Pro and iPhone 18 Pro Max pages.
        </p>

        <h2>Looking for a cheaper new iPhone? iPhone 17 series prices</h2>
        <ul>
          {iphone17.map((m) => (
            <li key={m.model}>
              <Link href={`/phones/apple/${m.model.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{m.model}</Link>: from {rs(lowestOfficialPrice(m))} official PTA approved
            </li>
          ))}
        </ul>

        <h2>PTA and non-PTA iPhones</h2>
        <p>
          A non-PTA iPhone stops working on Pakistani SIMs until its PTA tax is paid on DIRBS. Read the{" "}
          <Link href="/guides/pta-status">non-PTA meaning guide</Link> and use the <Link href="/guides/pta-tax">PTA tax calculator</Link> before buying an imported
          phone. Used iPhones listed by sellers are on <Link href="/phones/apple">used Apple phones</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        {faq.map((f) => (
          <div key={f.question}>
            <h3>{f.question}</h3>
            <p>{f.answer}</p>
          </div>
        ))}

        <h2>Sources</h2>
        <SourceList sources={sources} />
        <AuthorBox reviewed={formatCheckedDate(UPDATED)} />
      </article>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "iPhone 18 Price in Pakistan", item: absoluteUrl(pagePath) },
              ],
            },
            { "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
          ],
        }}
      />
    </Page>
  );
}
