import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SellForm } from "@/components/SellForm";
import { getCurrentUser } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Sell your phone",
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl("/sell") },
};

export default async function SellPage() {
  const { user } = await getCurrentUser();
  if (!user) redirect("/login?next=/sell");
  return (
    <main id="main" className="page max-w-3xl">
      <p className="section-kicker">Seller</p>
      <h1 className="mt-1 text-2xl sm:text-3xl">Sell a phone or accessory</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Phones, power banks, chargers, AirPods, covers and other mobile accessories. Accurate photos, city and price.
        You can edit, mark sold or delete it later from My Ads.
      </p>
      <div className="card mt-6 p-5 sm:p-7">
        <SellForm />
      </div>
    </main>
  );
}
