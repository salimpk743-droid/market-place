import type { Metadata } from "next";
import Link from "next/link";
import { SUPPORT_EMAIL, absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Contact & support",
  description:
    "Contact Mobile Market support by email for account, privacy, listing and report questions. To ask about a phone, use Contact seller on the ad.",
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactPage() {
  return (
    <main id="main" className="page max-w-3xl">
      <article className="card p-6 sm:p-8">
        <p className="section-kicker">Support</p>
        <h1 className="mt-1 text-2xl sm:text-3xl">Contact & support</h1>
        <p className="mt-4 text-sm text-ink-soft">
          Mobile Market does not operate phone shops. For a listing, use Contact seller on that ad. For the platform
          itself, email us.
        </p>
        <p className="mt-5 text-lg">
          <a className="font-semibold text-brand hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>

        <h2 className="mt-6 text-base font-semibold text-ink">What we can help with</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-ink-soft">
          <li>Account, sign-in and privacy questions, including <Link href="/delete-account" className="link">deleting your account</Link></li>
          <li>Reporting a listing you cannot submit with the <Link href="/report" className="link">report form</Link></li>
          <li>Copyright or impersonation complaints</li>
          <li>Mistakes in our guides or price tables (tell us the page and the source)</li>
        </ul>

        <h2 className="mt-6 text-base font-semibold text-ink">What we can&apos;t help with</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-ink-soft">
          <li>Questions about a specific phone: ask the seller from the ad.</li>
          <li>Payments, refunds or delivery: deals are between buyer and seller. See the <Link href="/return-policy" className="link">return policy</Link>.</li>
          <li>PTA registration or tax payment: use PTA&apos;s DIRBS. Our <Link href="/guides/pta-status" className="link">PTA guide</Link> explains the steps.</li>
        </ul>

        <p className="mt-4 text-sm text-ink-soft">
          Before you buy, read <Link href="/buyer-safety" className="link">buyer safety</Link>. If you think you&apos;ve been scammed, contact the police or FIA cybercrime; we can help by
          removing the ad once it is reported.
        </p>
        <p className="mt-4 text-xs text-muted">We aim to read mail on business days. This is not an emergency police line.</p>
      </article>
    </main>
  );
}
