import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/market/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Marketplace Rules",
  description: "Community rules for Mobile Market buyers and sellers.",
  alternates: { canonical: absoluteUrl("/rules") },
};

export default function RulesPage() {
  return (
    <LegalPage title="Marketplace Rules" updated="9 September 2026">
      <ol className="list-decimal space-y-2 pl-5">
        <li>Be honest about the item, price, city and — for phones — PTA status. This site is only for mobiles and mobile accessories.</li>
        <li>No stolen goods, fraud, or impersonation.</li>
        <li>No hate, threats, or sexual content.</li>
        <li>No fake listings, fake reviews, or fake “verified” claims.</li>
        <li>Contact people only about the ad they posted.</li>
        <li>Report problems instead of posting revenge ads.</li>
      </ol>
      <p>
        Breaking these rules can get an ad or account removed. Report via{" "}
        <Link className="link" href="/report">
          Report a listing
        </Link>
        .
      </p>
    </LegalPage>
  );
}
