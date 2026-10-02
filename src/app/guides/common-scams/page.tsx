import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { AuthorBox, SourceList } from "@/components/GuideMeta";
import { absoluteUrl } from "@/lib/market/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Common used-phone scams in Pakistan",
  description: "Advance payment, dummy units, cloned IMEIs and other patterns to walk away from.",
  alternates: { canonical: absoluteUrl("/guides/common-scams") },
};

export default function ScamsGuide() {
  return (
    <LegalPage title="Common used-phone scams in Pakistan" updated="2 October 2026">
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
      <h2>The non-PTA phone sold as PTA</h2>
      <p>
        A phone described as “PTA approved” can still fail the IMEI check. Send the IMEI from the phone (dial *#06#) by
        SMS to 8484 before you pay, and make sure it matches the box and the bill.{" "}
        <Link className="link" href="/guides/pta-status">
          How to check PTA status
        </Link>
        .
      </p>
      <h2>Stock photos</h2>
      <p>Ask for a photo of the phone next to today’s newspaper or a handwritten date if you cannot meet immediately.</p>
      <p>
        Report ads: <Link className="link" href="/report">report form</Link>.
      </p>
      <h2>Sources</h2>
      <SourceList sources={[{ label: "PTA DIRBS: device verification", href: "https://dirbs.pta.gov.pk/" }]} />
      <AuthorBox reviewed="2 October 2026" sourcesNote="These are patterns our editorial team sees in classifieds; they are general advice, not legal advice." />
    </LegalPage>
  );
}
