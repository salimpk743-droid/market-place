import type { Metadata } from "next";
import Link from "next/link";
import { SUPPORT_EMAIL, absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Account deletion",
  description: "How to delete a Mobile Market account, listings and photos.",
  alternates: { canonical: absoluteUrl("/delete-account") },
};

export default function PublicDeletePage() {
  return (
    <main id="main" className="page max-w-3xl">
      <article className="card p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl">Delete a Mobile Market account</h1>
        <p className="mt-4 text-sm text-ink-soft">
          Google Play and our own policy require a real way to delete an account. This page is that public instruction.
          Deletion is not a freeze.
        </p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-ink-soft">
          <li>
            Sign in at{" "}
            <Link className="link" href="/login">
              the login page
            </Link>
            .
          </li>
          <li>
            Open{" "}
            <Link className="link" href="/account/delete">
              Delete account
            </Link>
            .
          </li>
          <li>Type DELETE and confirm.</li>
        </ol>
        <p className="mt-4 text-sm text-ink-soft">
          We then delete or anonymize your profile, listings you own, and listing photos. Reports and some security logs
          may be kept for a limited period where Pakistani law or fraud investigations require it.
        </p>
        <p className="mt-4 text-sm">
          If you cannot sign in, email{" "}
          <a className="link" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>{" "}
          from the address on the account.
        </p>
      </article>
    </main>
  );
}
