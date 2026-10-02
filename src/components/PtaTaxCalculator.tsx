"use client";

import { useMemo, useState } from "react";
import { estimatePtaTax, type PtaRoute } from "@/lib/market/pta-tax";

const pkr = (n: number) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;

export function PtaTaxCalculator() {
  const [usd, setUsd] = useState("");
  const [rate, setRate] = useState("");
  const [route, setRoute] = useState<PtaRoute>("cnic");
  const [atl, setAtl] = useState(true);

  const result = useMemo(
    () => estimatePtaTax({ usd: Number(usd), pkrPerUsd: Number(rate), route, activeTaxpayer: atl }),
    [usd, rate, route, atl],
  );

  return (
    <div className="not-prose card p-4 sm:p-5" id="calculator">
      <p className="section-kicker">Calculator</p>
      <h2 className="mt-1 text-lg text-ink">Estimate the statutory PTA tax components</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="label">Phone value (C&amp;F, US$ per set)</span>
          <input
            className="input mt-1"
            inputMode="decimal"
            placeholder="e.g. 450"
            value={usd}
            onChange={(e) => setUsd(e.target.value.replace(/[^0-9.]/g, ""))}
          />
        </label>
        <label className="block text-sm">
          <span className="label">Exchange rate (Rs per US$)</span>
          <input
            className="input mt-1"
            inputMode="decimal"
            placeholder="today's rate"
            value={rate}
            onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ""))}
          />
        </label>
        <label className="block text-sm">
          <span className="label">Registration route</span>
          <select className="input mt-1" value={route} onChange={(e) => setRoute(e.target.value as PtaRoute)}>
            <option value="cnic">CNIC (local applicant)</option>
            <option value="baggage">Passport, personal baggage (within 60 days of arrival)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" checked={atl} onChange={(e) => setAtl(e.target.checked)} />
          <span>I am on FBR&apos;s Active Taxpayers List (filer)</span>
        </label>
      </div>

      {result ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <tbody>
              <tr>
                <td className="border-b border-line px-3 py-2">Value in rupees</td>
                <td className="border-b border-line px-3 py-2 text-right">{pkr(result.valuePkr)}</td>
              </tr>
              <tr>
                <td className="border-b border-line px-3 py-2">Regulatory duty (S.R.O. 1064(I)/2026)</td>
                <td className="border-b border-line px-3 py-2 text-right">{pkr(result.regulatoryDuty)}</td>
              </tr>
              <tr>
                <td className="border-b border-line px-3 py-2">
                  Sales tax {Math.round(result.salesTaxRate * 100)}% (Ninth Schedule)
                </td>
                <td className="border-b border-line px-3 py-2 text-right">{pkr(result.salesTax)}</td>
              </tr>
              <tr>
                <td className="border-b border-line px-3 py-2">
                  Income tax s.148{route === "baggage" ? " (not charged on personal baggage)" : atl ? "" : " (doubled, not on ATL)"}
                </td>
                <td className="border-b border-line px-3 py-2 text-right">{pkr(result.incomeTax)}</td>
              </tr>
              <tr>
                <td className="border-b border-line px-3 py-2">Mobile handset levy</td>
                <td className="border-b border-line px-3 py-2 text-right">{pkr(result.handsetLevy)}</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold text-ink">Total of these components</td>
                <td className="px-3 py-2 text-right font-semibold text-ink">{pkr(result.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Enter the phone value and the exchange rate to see the breakdown.</p>
      )}
      <p className="mt-3 text-xs text-muted">
        This adds up only the four charges we could verify in FBR&apos;s legal texts. Customs uses its own assessed value and
        may add other charges, so the amount DIRBS shows on your PSID can be much higher (see the published iPhone 17 figures
        below). Always pay the DIRBS amount, not this estimate.
      </p>
    </div>
  );
}
