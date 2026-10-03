import Link from "next/link";
import type { ModelPriceData, PricePoint, PriceSource } from "@/lib/market/model-prices";
import { formatCheckedDate } from "@/lib/market/model-prices";
import type { BrandHub, BrandHubSection } from "@/lib/market/brand-hubs";

function rs(n: number) {
  return `Rs ${n.toLocaleString("en-PK")}`;
}

function shortSource(src: PriceSource) {
  if (src.id.startsWith("mega")) return "Mega.pk";
  if (src.id.startsWith("priceoye")) return "PriceOye";
  return src.label.split(/[:(,]/)[0].trim();
}

function Cell({ data, points }: { data: ModelPriceData; points?: PricePoint[] }) {
  if (!points?.length) return <span className="text-muted">—</span>;
  return (
    <span className="flex flex-col gap-0.5">
      {points.map((pt) => {
        const src = data.sources.find((s) => s.id === pt.source);
        return (
          <span key={`${pt.source}-${pt.pkr}`}>
            <span className="font-semibold text-ink">{rs(pt.pkr)}</span>
            <span className="block text-xs text-muted">
              {[pt.note, src ? `${shortSource(src)}, ${formatCheckedDate(src.date)}` : null].filter(Boolean).join(" · ")}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function BrandPriceTable({
  brandName,
  models,
  modelHref,
  note,
}: {
  brandName: string;
  models: ModelPriceData[];
  modelHref: (model: ModelPriceData) => string | null;
  note: string;
}) {
  const sources = new Map<string, PriceSource>();
  for (const m of models) for (const s of m.sources) if (s.kind !== "specs" && s.kind !== "tax") sources.set(s.href, s);
  const display = (m: ModelPriceData) => (brandName === "Apple" ? m.model : `${brandName} ${m.model}`);
  return (
    <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5" aria-labelledby="brand-prices">
      <h2 id="brand-prices" className="text-lg font-semibold text-ink">
        {brandName} price list in Pakistan (new phones)
      </h2>
      {models.length ? (
        <>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                  <th scope="col" className="py-2 pr-3">Model</th>
                  <th scope="col" className="py-2 pr-3">Version</th>
                  <th scope="col" className="py-2 pr-3">Official price (PTA approved)</th>
                  <th scope="col" className="py-2 pr-3">Retailer, PTA approved</th>
                  <th scope="col" className="py-2 pr-3">Retailer, non-PTA</th>
                </tr>
              </thead>
              <tbody>
                {models.flatMap((m) =>
                  m.variants.map((v, i) => {
                    const href = i === 0 ? modelHref(m) : null;
                    return (
                      <tr key={`${m.model}-${v.storage}`} className="border-b border-line align-top last:border-b-0">
                        <th scope="row" className="py-2 pr-3 font-medium text-ink">
                          {i === 0 ? href ? <Link href={href} className="link">{display(m)}</Link> : display(m) : <span className="sr-only">{display(m)}</span>}
                        </th>
                        <td className="py-2 pr-3">{v.storage}</td>
                        <td className="py-2 pr-3"><Cell data={m} points={v.official} /></td>
                        <td className="py-2 pr-3"><Cell data={m} points={v.ptaRetail} /></td>
                        <td className="py-2 pr-3"><Cell data={m} points={v.nonPta} /></td>
                      </tr>
                    );
                  }),
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">
            “—” means we could not find a verified, dated price for that version, not that it is free or unavailable to buy. {note} These are new-phone prices; used listings are further down this page.
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">Price sources</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
            {Array.from(sources.values()).map((s) => (
              <li key={s.href}>
                <a href={s.href} rel="nofollow noopener" target="_blank" className="link">{s.label}</a>
                <span className="text-muted"> · {s.kind === "news" ? "published" : "checked"} {formatCheckedDate(s.date)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{note}</p>
      )}
    </section>
  );
}

export function HubSection({ section, id }: { section: BrandHubSection; id: string }) {
  return (
    <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5" aria-labelledby={id}>
      <h2 id={id} className="text-lg font-semibold text-ink">{section.heading}</h2>
      {section.paragraphs.map((p) => (
        <p key={p} className="mt-2 text-sm leading-relaxed text-ink-soft">{p}</p>
      ))}
      {section.bullets ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
          {section.bullets.map((b) => <li key={b}>{b}</li>)}
        </ul>
      ) : null}
    </section>
  );
}

export function HubFaqs({ hub }: { hub: BrandHub }) {
  return (
    <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5" aria-labelledby="brand-faqs">
      <h2 id="brand-faqs" className="text-lg font-semibold text-ink">Questions people ask</h2>
      {hub.faqs.map((f) => (
        <div key={f.question} className="mt-3">
          <h3 className="text-sm font-semibold text-ink">{f.question}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{f.answer}</p>
        </div>
      ))}
    </section>
  );
}
