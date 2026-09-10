import type { Metadata } from "next";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
import { ListingGrid, Page, PageTitle } from "@/components/ui";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Non-PTA used phones",
  description: "Used phones whose sellers declared non-PTA (tax pending) status.",
  alternates: { canonical: absoluteUrl("/non-pta-phones") },
};

export default async function NonPtaPage() {
  const result = await searchListings({ pta: "non-pta" });
  return (
    <Page>
      <PageTitle
        kicker="PTA"
        title="Non-PTA used phones"
        description={
          <>
            Sellers marked these as non-PTA / tax pending. Local SIMs may not work. Confirm the law and DIRBS status
            yourself. See the{" "}
            <Link className="link" href="/guides/pta-status">
              PTA guide
            </Link>
            .
          </>
        }
      />
      {result.rows.length ? (
        <ListingGrid>
          {result.rows.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </ListingGrid>
      ) : (
        <EmptyState title="No non-PTA ads yet" body="This page lists only real seller ads marked non-PTA." />
      )}
    </Page>
  );
}
