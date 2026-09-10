import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/market/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Common used-phone scams in Pakistan",
  description: "Advance payment, dummy units, cloned IMEIs and other patterns to walk away from.",
  alternates: { canonical: absoluteUrl("/guides/common-scams") },
};

export default function ScamsGuide() {
  return (
    <LegalPage title="Common used-phone scams in Pakistan" updated="9 September 2026">
      <p>These patterns show up in classifieds markets everywhere, including Pakistan. None of this is legal advice.</p>
      <h2>Advance payment / courier</h2>
      <p>
        A seller who will not meet, needs a JazzCash/Easypaisa “token”, or will only ship after full payment is a common
        fraud pattern. Prefer a public meeting and pay when the phone is in your hand.
      </p>
      <h2>The dummy unit</h2>
      <p>
        You inspect one phone, look away, and leave with another. Keep the unit in your hand. Check IMEI again just
        before you pay.
      </p>
      <h2>Too cheap, too far</h2>
      <p>
        An iPhone far below street price, only available in another city after a transfer, is often bait. Compare a few
        live ads on this site and in the physical market.
      </p>
      <h2>Stock photos</h2>
      <p>Ask for a photo of the phone next to today’s newspaper or a handwritten date if you cannot meet immediately.</p>
      <p>
        Report ads: <Link className="link" href="/report">report form</Link>.
      </p>
    </LegalPage>
  );
}
