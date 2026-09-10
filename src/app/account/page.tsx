import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/AuthForms";
import { getCurrentUser } from "@/lib/market/listings";
import { SUPPORT_EMAIL } from "@/lib/market/site";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default async function AccountPage() {
  const { user } = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  return (
    <main id="main" className="page max-w-xl">
      <div className="card p-6 sm:p-8">
        <p className="section-kicker">Account</p>
        <h1 className="mt-1 text-2xl">Your account</h1>
        <p className="mt-2 text-sm text-muted">{user.email}</p>
        <ul className="mt-6 divide-y divide-line text-sm">
          <li>
            <Link className="flex min-h-11 items-center font-medium text-brand-ink" href="/my-ads">
              My ads
            </Link>
          </li>
          <li>
            <Link className="flex min-h-11 items-center font-medium text-brand-ink" href="/sell">
              Sell a phone or accessory
            </Link>
          </li>
          <li>
            <Link className="flex min-h-11 items-center font-medium text-brand-ink" href="/forgot-password">
              Change password
            </Link>
          </li>
          <li>
            <Link className="flex min-h-11 items-center font-medium text-danger" href="/account/delete">
              Delete account
            </Link>
          </li>
        </ul>
        <div className="mt-6">
          <LogoutButton />
        </div>
        <p className="mt-6 text-xs text-muted">
          Questions:{" "}
          <a className="link" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </main>
  );
}
