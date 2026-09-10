import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/market/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seller Terms",
  description: "Rules for posting and managing ads on Mobile Market.",
  alternates: { canonical: absoluteUrl("/seller-terms") },
};

export default function SellerTermsPage() {
  return (
    <LegalPage title="Seller Terms" updated="9 September 2026">
      <p>If you post an ad you are a seller on Mobile Market and these terms apply in addition to the Terms of Use.</p>
      <h2>You must</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Only list a phone you have the right to sell.</li>
        <li>Use photos of the actual device, not stock shots passed off as the unit.</li>
        <li>Declare PTA status honestly (approved, CPID/patch, non-PTA, JV). We do not certify PTA status.</li>
        <li>Keep the price, city and contact method accurate.</li>
        <li>Mark the ad sold or delete it when the phone is gone.</li>
        <li>Meet buyers in a safe public place. Do not demand advance transfers from strangers.</li>
      </ul>
      <h2>You must not</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>List stolen, cloned, or prohibited devices — see <Link className="link" href="/prohibited">Prohibited listings</Link>.</li>
        <li>Use another person’s phone number or shop name.</li>
        <li>Put contact details in the description to bypass the contact button.</li>
        <li>Create multiple accounts to evade a removal or report.</li>
      </ul>
      <h2>Ownership of ads</h2>
      <p>
        Ads belong to the signed-in account that created them. A phone number is not a password and is not used to take
        over an ad.
      </p>
    </LegalPage>
  );
}
