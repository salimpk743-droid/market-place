import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SUPPORT_EMAIL, absoluteUrl } from "@/lib/market/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Mobile Market classifieds marketplace.",
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="9 September 2026">
      <p>
        By using Mobile Market you agree to these terms, the <Link className="link" href="/rules">Marketplace Rules</Link>,{" "}
        <Link className="link" href="/seller-terms">Seller Terms</Link> and{" "}
        <Link className="link" href="/privacy">Privacy Policy</Link>.
      </p>
      <h2>What Mobile Market is</h2>
      <p>
        Mobile Market is an online classifieds board. We publish listings created by sellers. We do not own the phones,
        take payment, hold stock, or complete the sale. The contract for a phone is between buyer and seller.
      </p>
      <h2>What we do not do</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>We do not verify IMEI, PTA status, theft status or ownership unless we later say so in writing for a specific programme — and we do not have such a programme today.</li>
        <li>We do not guarantee price, quality or that a seller will show up.</li>
        <li>Badges such as “Featured” only mean the ad was highlighted on the site, not that the phone is authentic.</li>
      </ul>
      <h2>Your responsibilities</h2>
      <p>
        Provide accurate information. Do not post stolen devices, prohibited items, or impersonate another shop. Buyers
        should inspect devices in person. See <Link className="link" href="/buyer-safety">Buyer Safety</Link>.
      </p>
      <h2>Accounts</h2>
      <p>
        Keep your password to yourself. You are responsible for ads posted from your account. We may suspend accounts
        that break these terms or the law.
      </p>
      <h2>Content licence</h2>
      <p>
        You keep ownership of your photos and text. You give Mobile Market a licence to host and display them so the
        marketplace can function, including in search results and the Android app.
      </p>
      <h2>Limitation</h2>
      <p>
        To the extent allowed by Pakistani law, Mobile Market is not liable for disputes between buyers and sellers,
        device defects, or losses from meetings you arrange. This does not exclude liability that cannot legally be
        excluded.
      </p>
      <h2>Contact</h2>
      <p>
        <a className="link" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </p>
    </LegalPage>
  );
}
