import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LegalPage } from "@/components/LegalPage";
import { AuthorBox, SourceList } from "@/components/GuideMeta";
import { PtaTaxCalculator } from "@/components/PtaTaxCalculator";
import {
  FBR_VR_2070,
  HANDSET_LEVY,
  INCOME_TAX_148,
  PTA_TAX_RATES_CHECKED,
  PTA_TAX_SOURCES,
  PUBLISHED_PTA_TAX,
  REGULATORY_DUTY,
} from "@/lib/market/pta-tax";
import { BRAND, absoluteUrl } from "@/lib/market/site";

const path = "/guides/pta-tax";
const TITLE = "PTA Tax on Mobile Phones 2026: Rates & Calculator";
const DESCRIPTION =
  "PTA tax 2026-27: FBR regulatory duty, sales tax, s.148 income tax and handset levy slabs, a calculator, iPhone 17 amounts and FBR used-phone values.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(path) },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(path), type: "article", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: TITLE }] },
};

const pkr = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;
const cell = "border-b border-line px-3 py-2 align-top";

const SLAB_LABELS = ["Up to US$30", "US$30–100", "US$100–200", "US$200–350", "US$350–500", "Above US$500"];
const LEVY_LABELS = ["Up to US$30", "US$30–100", "US$101–200", "US$201–350", "US$351–500", "US$501–700", "Above US$701"];

const FAQS = [
  {
    q: "What is PTA tax?",
    a: "PTA tax is the common name for the FBR customs duty and taxes you pay when you register a phone's IMEI in PTA's DIRBS system. PTA runs the registration; FBR sets and collects the tax.",
  },
  {
    q: "Why is PTA tax lower on passport?",
    a: "Phones brought in personal baggage are exempt from the s.148 advance income tax (Income Tax Ordinance 2001, Second Schedule clause 60E). Travellers must register within 60 days of arrival to use the passport route.",
  },
  {
    q: "How much is the PTA tax on the iPhone 17 Pro Max?",
    a: "PhoneWorld's table (updated 8 July 2026) lists Rs 204,954 on passport and Rs 225,449 on CNIC. These are published estimates; the PSID that DIRBS generates for your IMEI is the amount you pay.",
  },
  {
    q: "How do I pay PTA tax?",
    a: "Dial *8484# or use dirbs.pta.gov.pk, enter your CNIC or passport details and the IMEI, and pay the PSID (valid for 7 days) at a bank. The IMEI is whitelisted once payment is confirmed.",
  },
  {
    q: "Does PTA tax change with the dollar rate?",
    a: "Yes. Sales tax is a percentage of the phone's value in rupees, so it changes with the exchange rate. Regulatory duty, s.148 income tax and the handset levy are fixed rupee amounts per slab.",
  },
];

export default function PtaTaxPage() {
  const url = absoluteUrl(path);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: TITLE,
              description: DESCRIPTION,
              inLanguage: "en-PK",
              datePublished: "2026-10-02",
              dateModified: "2026-10-02",
              mainEntityOfPage: url,
              author: { "@type": "Organization", name: `${BRAND} editorial team`, url: absoluteUrl("/about") },
              publisher: {
                "@type": "Organization",
                name: BRAND,
                url: absoluteUrl("/"),
                logo: { "@type": "ImageObject", url: absoluteUrl("/icons/icon-512.png") },
              },
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") },
                { "@type": "ListItem", position: 3, name: "PTA tax", item: url },
              ],
            },
          ],
        }}
      />
      <LegalPage title="PTA tax on mobile phones in Pakistan (2026-27)" updated={PTA_TAX_RATES_CHECKED}>
        <div className="not-prose rounded-xl border border-brand/20 bg-brand-soft p-4 text-ink">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Short answer</p>
          <p className="mt-2 text-base">
            &quot;PTA tax&quot; is the <strong>FBR duty and tax</strong> you pay to register a non-PTA phone in DIRBS. It has four
            statutory parts, all set by the phone&apos;s value in US dollars: <strong>regulatory duty</strong>,{" "}
            <strong>sales tax</strong> (18% up to US$500, 25% above), <strong>s.148 income tax</strong> (not charged on phones in
            personal baggage) and the <strong>mobile handset levy</strong>. DIRBS shows the final amount on your PSID.
          </p>
        </div>

        <p>
          New to the terms? Read{" "}
          <Link href="/guides/pta-status" className="link">
            what non-PTA and PTA approved mean
          </Link>
          . Registration is done by dialling *8484# or on dirbs.pta.gov.pk.
        </p>

        <PtaTaxCalculator />

        <h2 id="slabs">PTA tax slabs for 2026-27 (CBU smartphones)</h2>
        <p>Fixed amounts are rupees per set. The phone&apos;s value is its C&amp;F value in US dollars.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {["C&F value", "Regulatory duty", "Sales tax", "Income tax s.148 (filer, CNIC)"].map((h) => (
                  <th key={h} className={`${cell} font-semibold text-ink`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLAB_LABELS.map((label, i) => (
                <tr key={label}>
                  <td className={cell}>{label}</td>
                  <td className={cell}>{pkr(REGULATORY_DUTY[i].amount)}</td>
                  <td className={cell}>{i === 5 ? "25%" : "18%"} of value</td>
                  <td className={cell}>{pkr(i === 0 ? INCOME_TAX_148[0].amount : INCOME_TAX_148[i - 1].amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="list-disc space-y-1 pl-6 text-xs">
          <li>Regulatory duty: S.R.O. 1064(I)/2026, in force from 1 July 2026 (20% lower than the 2025-26 amounts).</li>
          <li>Sales tax: the 25% rate applies to the whole value once it is above US$500, not just the part above.</li>
          <li>
            Income tax: smartphones up to US$100 pay Rs 100. People not on the Active Taxpayers List pay double (Tenth Schedule).
            Not charged on phones in personal baggage (clause 60E).
          </li>
        </ul>

        <h3 className="!mt-4 text-base font-semibold text-ink">Mobile handset levy</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <tbody>
              {LEVY_LABELS.map((label, i) => (
                <tr key={label}>
                  <td className={cell}>{label}</td>
                  <td className={cell}>{pkr(HANDSET_LEVY[i].amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="iphone-17-pta-tax">Published PTA tax for iPhone 17 models</h2>
        <p>
          These are the amounts PhoneWorld publishes from DIRBS assessments. They are higher than the four components above
          because Customs uses its own assessed value and may add other charges. We show them as published and do not adjust
          them.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {["Model", "Passport", "CNIC"].map((h) => (
                  <th key={h} className={`${cell} font-semibold text-ink`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PUBLISHED_PTA_TAX.rows.map((r) => (
                <tr key={r.model}>
                  <td className={cell}>{r.model}</td>
                  <td className={cell}>{pkr(r.passport)}</td>
                  <td className={cell}>{pkr(r.cnic)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs">
          Source:{" "}
          <a href={PUBLISHED_PTA_TAX.href} rel="nofollow noopener" target="_blank">
            {PUBLISHED_PTA_TAX.source}
          </a>
          . We have not found a reliable published PTA tax figure for the iPhone 18 series yet, so we do not list one.
        </p>

        <h2 id="fbr-valuation-ruling">FBR customs values for used phones (Valuation Ruling 2070/2026)</h2>
        <p>
          FBR&apos;s Directorate General of Customs Valuation fixes C&amp;F values for{" "}
          <strong>old and used phones imported in commercial quantity</strong> (without packing or accessories). These values
          apply to commercial imports. They are a useful guide to which slab a used model falls in, but they are not a quote
          for an individual DIRBS registration.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {["Model (used)", "FBR value (US$)", "Slab"].map((h) => (
                  <th key={h} className={`${cell} font-semibold text-ink`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FBR_VR_2070.rows.map(([brand, model, usd]) => (
                <tr key={model}>
                  <td className={cell}>
                    {brand === "Samsung" || brand === "Google" ? `${brand} ` : ""}
                    {model}
                  </td>
                  <td className={cell}>{usd}</td>
                  <td className={cell}>{SLAB_LABELS[REGULATORY_DUTY.findIndex((b) => usd <= b.upTo)]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs">
          Source:{" "}
          <a href={FBR_VR_2070.href} rel="nofollow noopener" target="_blank">
            {FBR_VR_2070.title}
          </a>
          .{" "}
          <a href={FBR_VR_2070.litigationHref} rel="nofollow noopener" target="_blank">
            {FBR_VR_2070.litigationNote}
          </a>
        </p>

        <h2 id="faq">FAQ</h2>
        {FAQS.map((f) => (
          <section key={f.q}>
            <h3 className="!mt-4 text-base font-semibold text-ink">{f.q}</h3>
            <p>{f.a}</p>
          </section>
        ))}

        <h2 id="sources">Sources</h2>
        <SourceList sources={[...PTA_TAX_SOURCES, { label: PUBLISHED_PTA_TAX.source, href: PUBLISHED_PTA_TAX.href }, { label: FBR_VR_2070.title, href: FBR_VR_2070.href }]} />
        <AuthorBox reviewed={PTA_TAX_RATES_CHECKED} sourcesNote="Rates are copied from the FBR legal texts listed above." />
      </LegalPage>
    </>
  );
}
