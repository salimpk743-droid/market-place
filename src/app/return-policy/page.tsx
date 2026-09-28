import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SUPPORT_EMAIL, absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "How returns and refunds work on Mobile Market, a direct-deal classifieds marketplace.",
  alternates: { canonical: absoluteUrl("/return-policy") },
};

export default function ReturnPolicyPage() {
  return (
    <LegalPage title="Return & Refund Policy" updated="28 September 2026">
      <p>
        Mobile Market is a classifieds marketplace. We connect buyers and sellers, but we do not sell the phones or
        accessories listed on the site. Buyers and sellers deal directly with each other.
      </p>

      <h2>Mobile Market does not process sales or refunds</h2>
      <p>
        Mobile Market does not take payment from buyers, hold buyer funds, own the listed items, ship items, or complete
        transactions between buyers and sellers. Because Mobile Market is not the seller, we do not accept returns,
        issue refunds, provide exchanges, or reimburse buyers for marketplace transactions.
      </p>

      <h2>Returns and refunds between buyers and sellers</h2>
      <p>
        Any return, refund, exchange, warranty, or cancellation arrangement is a matter between the buyer and the seller
        who are completing the deal. Sellers may choose to offer their own return or refund terms, but those terms should
        be agreed clearly before payment.
      </p>
      <ul className="list-disc space-y-1 pl-6">
        <li>Ask the seller about returns or refunds before you pay.</li>
        <li>Agree on any return period, reason for return, item condition, refund amount, and return method before completing the deal.</li>
        <li>Inspect the phone or accessory and verify important claims, including IMEI and PTA/DIRBS status, before payment.</li>
        <li>If a seller has promised a return or refund, keep the agreement and relevant messages as evidence.</li>
      </ul>

      <h2>If there is a problem with an item</h2>
      <p>
        Contact the seller first because the seller is the party who sold the item. Mobile Market cannot issue a refund
        or require a seller to accept a return on a direct buyer-seller transaction.
      </p>
      <p>
        If you believe a listing violates our Marketplace Rules, is fraudulent, or involves prohibited activity, you can
        report the listing to Mobile Market. A report may lead to moderation or account action, but reporting a listing
        does not create a right to a refund.
      </p>

      <h2>Before completing a deal</h2>
      <p>
        Mobile Market recommends meeting in a safe public place, inspecting the item in person, checking the actual
        device IMEI and PTA/DIRBS status, and avoiding advance payments to strangers. See our{" "}
        <a className="text-brand underline" href="/buyer-safety">Buyer Safety</a> guidance.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or a marketplace report:{" "}
        <a className="link" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </p>
    </LegalPage>
  );
}
