import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/market/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Buyer safety",
  description: "How to reduce risk when buying a used phone in Pakistan through Mobile Market.",
  alternates: { canonical: absoluteUrl("/buyer-safety") },
};

export default function BuyerSafetyPage() {
  return (
    <LegalPage title="Buyer safety" updated="9 September 2026">
      <p>
        Mobile Market is a notice board. The seller is not us. Treat every ad as unverified until you have checked the
        phone yourself.
      </p>
      <h2>Before you pay</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Meet in a busy public place — a mall, Hafeez Centre corridor, or a well-lit market. Tell someone where you are going.</li>
        <li>Inspect the screen, cameras, charging, SIM trays, Face ID / fingerprint, and IMEI in Settings vs the tray.</li>
        <li>Check PTA / DIRBS status yourself. Seller badges on this site are not a government certificate.</li>
        <li>Ask the seller to show the purchase proof if they claim an invoice.</li>
        <li>Never send advance money, “token”, or courier-on-delivery payment to a stranger who will not meet.</li>
        <li>Be careful with deals that are far below the going price.</li>
      </ul>
      <p>
        More detail: <Link className="link" href="/guides/inspect-used-phone">inspection guide</Link> and{" "}
        <Link className="link" href="/guides/common-scams">common scams</Link>.
      </p>
    </LegalPage>
  );
}
