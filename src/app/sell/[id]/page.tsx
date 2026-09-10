import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SellForm } from "@/components/SellForm";
import { getCurrentUser, getOwnedListingById, getOwnListingContact } from "@/lib/market/listings";

export const metadata: Metadata = { title: "Edit listing", robots: { index: false, follow: false } };

export default async function EditSellPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await getCurrentUser();
  if (!user) redirect(`/login?next=/sell/${id}`);
  const owned = await getOwnedListingById(id);
  if (!owned.listing) notFound();
  const listing = owned.listing;
  const contactPhone = await getOwnListingContact(id);
  return (
    <main id="main" className="page max-w-3xl">
      <p className="section-kicker">Seller</p>
      <h1 className="mt-1 text-2xl sm:text-3xl">Edit your listing</h1>
      <p className="mt-2 text-sm text-muted">Change the price, city, photos or details, then save.</p>
      <div className="card mt-6 p-5 sm:p-7">
        <SellForm existing={listing} contactPhone={contactPhone} />
      </div>
    </main>
  );
}
