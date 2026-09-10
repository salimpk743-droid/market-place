import type { Metadata } from "next";
import { SUPPORT_EMAIL, absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Contact & support",
  description: "Contact Mobile Market support.",
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
        <ul className="mt-6 list-disc space-y-1 pl-6 text-sm text-ink-soft">
          <li>Privacy and account deletion</li>
          <li>Report a listing you cannot submit in the form</li>
          <li>Copyright or impersonation complaints</li>
        </ul>
        <p className="mt-4 text-xs text-muted">We aim to read mail on business days. This is not an emergency police line.</p>
      </article>
    </main>
  );
}
