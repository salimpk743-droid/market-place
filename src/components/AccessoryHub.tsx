import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { AuthorBox, SourceList } from "@/components/GuideMeta";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/market/site";
import type { AccessoryPage } from "@/lib/market/accessory-hubs";

const rs = (n: number) => `Rs ${n.toLocaleString("en-US")}`;

export function accessoryMetadata(page: AccessoryPage): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: absoluteUrl(page.path) },
    robots: { index: true, follow: true },
    openGraph: { title: page.title, description: page.description, url: absoluteUrl(page.path), type: "article" },
  };
}

export function AccessoryHub({ page }: { page: AccessoryPage }) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return (
    <LegalPage title={page.h1} updated={page.updated}>
      <JsonLd data={faqLd} />
      {page.intro.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {page.tables.map((t) => (
        <section key={t.heading}>
          <h2>{t.heading}</h2>
          {t.intro ? <p className="mt-2">{t.intro}</p> : null}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                  <th scope="col" className="py-2 pr-3">Model</th>
                  <th scope="col" className="py-2 pr-3">Listed price</th>
                  <th scope="col" className="py-2 pr-3">Source (checked {page.updated})</th>
                </tr>
              </thead>
              <tbody>
                {t.rows.map((r) => (
                  <tr key={r.href + r.name} className="border-b border-line/60 align-top">
                    <th scope="row" className="py-2 pr-3 font-medium text-ink">
                      {r.name}
                      {r.note ? <span className="block text-xs font-normal text-muted">{r.note}</span> : null}
                    </th>
                    <td className="whitespace-nowrap py-2 pr-3">{rs(r.pkr)}</td>
                    <td className="py-2 pr-3">
                      <a href={r.href} rel="nofollow noopener" target="_blank">
                        {r.retailer}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      {page.tables.length ? (
        <p className="text-xs text-muted">
          Prices are each retailer&apos;s listed price on {page.updated}, for items shown in stock that day. They are not
          Mobile Market prices and change often; open the source link for today&apos;s price and warranty terms.
        </p>
      ) : null}
      {page.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.paragraphs.map((p) => (
            <p key={p} className="mt-2">
              {p}
            </p>
          ))}
          {s.bullets ? (
            <ul className="mt-2 list-disc space-y-1 pl-6">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
          {s.links ? (
            <ul className="mt-2 list-disc space-y-1 pl-6">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      <h2>Frequently asked questions</h2>
      {page.faqs.map((f) => (
        <div key={f.question}>
          <h3 className="font-semibold text-ink">{f.question}</h3>
          <p className="mt-1">{f.answer}</p>
        </div>
      ))}
      <h2>Related pages</h2>
      <ul className="list-disc space-y-1 pl-6">
        {page.related.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
      <h2>Sources</h2>
      <SourceList sources={page.sources} />
      <AuthorBox
        reviewed={page.updated}
        sourcesNote="Prices are retailer listings linked on this page; Apple facts come from Apple's own support pages. We do not publish used prices we cannot source."
      />
    </LegalPage>
  );
}
