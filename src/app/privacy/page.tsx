import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SUPPORT_EMAIL, absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Mobile Market collects, uses and deletes personal information.",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="9 September 2026">
      <p>
        This policy applies to the Mobile Market website and the Mobile Market Android app (package{" "}
        <code>pk.mobilemarket.app</code>), which opens this website in a Trusted Web Activity.
      </p>
      <h2>Who we are</h2>
      <p>
        Mobile Market is a classifieds marketplace for used mobile phones and mobile accessories in Pakistan. We connect buyers and sellers. We
        are not the seller, not a shop, and not a PTA or government verification service.
      </p>
      <h2>What we collect</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>
          <strong>Account data:</strong> email address, password hash stored by our authentication provider (Supabase
          Auth — we do not store passwords in the listings database), display name.
        </li>
        <li>
          <strong>Listing data:</strong> brand, model, price, city, area, PTA status as you declare it, battery,
          condition, description, photos, seller name and contact phone.
        </li>
        <li>
          <strong>Contact events:</strong> when a buyer requests a seller number we store a timestamp, listing id, and a
          coarse requester identifier for rate limiting and abuse handling.
        </li>
        <li>
          <strong>Reports:</strong> reason and optional details you send about a listing or seller.
        </li>
        <li>
          <strong>Technical data:</strong> standard server logs (IP, user agent) for security and uptime.
        </li>
      </ul>
      <h2>Why we collect it</h2>
      <p>
        To run the marketplace: show ads, let sellers manage their ads, let buyers contact sellers, handle reports,
        prevent abuse, and comply with account-deletion and Play requirements.
      </p>
      <h2>Seller contact information</h2>
      <p>
        Contact phone numbers are stored with the listing but are <strong>not</strong> printed in ordinary public listing
        pages or public listing queries. They are released through a controlled contact action, only for active listings,
        with rate limits. Do not put someone else’s number on an ad.
      </p>
      <h2>Photos</h2>
      <p>
        Listing photos are stored in object storage so buyers can see the device. Public listings make those photos
        publicly readable. Do not upload photos of other people or documents you do not have the right to share.
      </p>
      <h2>Cookies and similar storage</h2>
      <p>
        We use cookies or local storage for signed-in sessions. Harmless UI preferences may use local storage. We do not
        use local storage as the marketplace database. If advertising is later enabled, that partner may use cookies;
        we will update this policy before that happens. AdSense is not active on this site at the date above.
      </p>
      <h2>Third parties</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Supabase — authentication, database, file storage (processors acting on our instructions).</li>
        <li>Vercel — website hosting.</li>
        <li>Email delivery used by authentication (password reset, confirmation).</li>
      </ul>
      <h2>Account deletion</h2>
      <p>
        You can delete your account from Account → Delete account, or follow the public instructions at /delete-account.
        We delete or anonymize profile, listings and listing photos. Limited reports or security logs may be retained
        where the law requires. Email {SUPPORT_EMAIL} if you cannot sign in.
      </p>
      <h2>Children</h2>
      <p>Mobile Market is not directed at children under 13. Do not create an account for a child.</p>
      <h2>Contact</h2>
      <p>
        Privacy questions: <a className="link" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </p>
      <h2>Pakistan-specific review</h2>
      <p>
        Data protection, PECA, consumer, and electronic marketing rules in Pakistan should be reviewed by a qualified
        Pakistani lawyer. This page is not a substitute for that review.
      </p>
    </LegalPage>
  );
}
