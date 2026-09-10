import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/market/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PTA approved vs Non-PTA, CPID and JV",
  description: "Plain-language explanation of PTA labels used in Pakistan’s used-phone market.",
  alternates: { canonical: absoluteUrl("/guides/pta-status") },
};

export default function PtaGuide() {
  return (
    <LegalPage title="PTA approved, Non-PTA, CPID and JV" updated="9 September 2026">
      <p>
        On Mobile Market, PTA status is typed by the seller. It is not a certificate from the Pakistan Telecommunication
        Authority and not a check we run on the IMEI.
      </p>
      <h2>PTA Approved</h2>
      <p>
        Usually means the IMEI is registered so local SIMs should work without the device being blocked for unpaid tax.
        Confirm on official PTA/DIRBS channels yourself — those systems change, and a screenshot in an ad can be old.
      </p>
      <h2>Non-PTA (tax pending)</h2>
      <p>
        Often a phone that has not had applicable duties paid. Local SIMs may not work, or may stop working. Price is
        usually lower. Factor in tax and the risk that rules change.
      </p>
      <h2>CPID / patch</h2>
      <p>
        Informal market language for a phone that was brought onto a network by unofficial means. It may work today and
        fail later. Treat this as higher risk. We do not endorse patching.
      </p>
      <h2>JV (SIM locked)</h2>
      <p>
        Typically a handset locked to a specific operator’s SIM. Ask which network, and whether it can be unlocked
        legitimately.
      </p>
      <p>
        Browse live ads: <Link className="link" href="/pta-approved-phones">PTA approved</Link> ·{" "}
        <Link className="link" href="/non-pta-phones">Non-PTA</Link>
      </p>
    </LegalPage>
  );
}
