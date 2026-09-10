import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Prohibited listings",
  description: "What you may not list on Mobile Market.",
  alternates: { canonical: absoluteUrl("/prohibited") },
};

export default function ProhibitedPage() {
  return (
    <LegalPage title="Prohibited listings" updated="9 September 2026">
      <p>Do not list:</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>Stolen, lost, or snatched phones</li>
        <li>Devices you do not own or are not authorised to sell</li>
        <li>Cloned IMEIs or tools whose main purpose is fraud</li>
        <li>Weapons, drugs, or other illegal goods</li>
        <li>Services that are not a phone or mobile accessory (jobs, loans, crypto, “investment”)</li>
        <li>Laptops, TVs, bikes, furniture, or any goods that are not mobile-related</li>
        <li>Counterfeit accessories sold as genuine where that would mislead a buyer</li>
        <li>Anything that violates Pakistani law</li>
      </ul>
      <p>
        Listing a non-PTA or JV phone is allowed if you say so clearly. Hiding that status is not. PTA tax and DIRBS
        rules still apply to you — Mobile Market is not PTA.
      </p>
      <p>
        <strong>Lawyer review:</strong> import, IMEI, and telecom offences in Pakistan should be confirmed with qualified
        counsel. This list is operational, not a complete criminal code.
      </p>
    </LegalPage>
  );
}
