import type { ModelPriceData, PricePoint } from "@/lib/market/model-prices";
import { formatCheckedDate as formatDate, priceSourceById } from "@/lib/market/model-prices";

function rs(n: number) {
  return `Rs ${n.toLocaleString("en-PK")}`;
}

function PriceCell({ data, points }: { data: ModelPriceData; points?: PricePoint[] }) {
  if (!points?.length) return <span className="text-muted">—</span>;
  return (
    <span className="flex flex-col gap-0.5">
      {points.map((pt) => {
        const src = priceSourceById(data, pt.source);
        return (
          <span key={`${pt.source}-${pt.pkr}-${pt.note || ""}`}>
            <span className="font-semibold text-ink">{rs(pt.pkr)}</span>
            {pt.note || src ? <span className="block text-xs text-muted">{pt.note ? pt.note : null}{pt.note && src ? " · " : null}{src ? formatDate(src.date) : null}</span> : null}
          </span>
        );
      })}
    </span>
  );
}

/** Dated, sourced price + spec panel for a model page. Renders only verified data. */
export function ModelPricePanel({ data, headingLevel = 2 }: { data: ModelPriceData; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const taxSource = data.ptaTax ? priceSourceById(data, data.ptaTax.source) : undefined;
  const specSource = priceSourceById(data, data.specSource);
  return (
    <section className="mb-7 rounded-lg border border-line bg-surface p-4 sm:p-5" aria-labelledby="model-price-heading">
      <p className="section-kicker">Verified prices · last updated {formatDate(data.lastUpdated)}</p>
      <H id="model-price-heading" className="mt-1 text-lg font-semibold text-ink">
        {data.brand} {data.model} price in Pakistan (new)
      </H>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{data.summary}</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <th scope="col" className="py-2 pr-3">Version</th>
              <th scope="col" className="py-2 pr-3">Official price (PTA approved)</th>
              <th scope="col" className="py-2 pr-3">Retailer price, PTA approved</th>
              <th scope="col" className="py-2 pr-3">Retailer price, non-PTA</th>
            </tr>
          </thead>
          <tbody>
            {data.variants.map((v) => (
              <tr key={v.storage} className="border-b border-line align-top last:border-b-0">
                <th scope="row" className="py-2 pr-3 font-medium text-ink">{v.storage}</th>
                <td className="py-2 pr-3"><PriceCell data={data} points={v.official} /></td>
                <td className="py-2 pr-3"><PriceCell data={data} points={v.ptaRetail} /></td>
                <td className="py-2 pr-3"><PriceCell data={data} points={v.nonPta} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted">
        “—” means we could not find a verified, dated price for that version. Official prices come from the brand&apos;s Pakistan website, distributors or authorised resellers; retailer prices
        are what one named shop listed on the date shown, and they change often. These are new-phone prices, not used prices; used listings appear further down this page.
      </p>

      {data.ptaTax ? (
        <div className="mt-4 rounded-md border border-line bg-white p-3 text-sm">
          <p className="font-semibold text-ink">Published PTA tax for a non-PTA {data.model}</p>
          <p className="mt-1 text-ink-soft">
            Passport: <strong>{rs(data.ptaTax.passport)}</strong> · CNIC: <strong>{rs(data.ptaTax.cnic)}</strong>
            {taxSource ? <span className="text-muted"> ({taxSource.label})</span> : null}
          </p>
        </div>
      ) : null}

      {data.specs.length ? (
        <div className="mt-5">
          <H className="text-base font-semibold text-ink">{data.model} key specifications</H>
          <dl className="mt-2 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {data.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-3 border-b border-line pb-2">
                <dt className="text-muted">{s.label}</dt>
                <dd className="text-right font-medium text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
          {specSource ? <p className="mt-2 text-xs text-muted">Specifications: {specSource.label}.</p> : null}
        </div>
      ) : null}

      {data.notes.length ? (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-muted">
          {data.notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      ) : null}

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Sources</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
          {data.sources.map((s) => (
            <li key={s.id}>
              <a href={s.href} rel="nofollow noopener" target="_blank" className="link">{s.label}</a>
              <span className="text-muted"> · {s.kind === "retailer" || s.kind === "official" || s.date === data.lastUpdated ? "checked" : "published"} {formatDate(s.date)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
