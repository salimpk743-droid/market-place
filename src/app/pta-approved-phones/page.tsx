import type { Metadata } from "next";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
import { ListingGrid, Page, PageTitle } from "@/components/ui";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PTA approved used phones",
  description: "Used phones whose sellers declared PTA approved status. Confirm on official PTA/DIRBS tools yourself.",
  alternates: { canonical: absoluteUrl("/pta-approved-phones") },
};

export default async function PtaApprovedPage() {
  const result = await searchListings({ pta: "official" });
  return (
    <Page>
      <PageTitle
        kicker="PTA"
        title="PTA approved used phones"
        description={
          <>
            These ads are here because the seller selected “PTA Approved”. Mobile Market does not query PTA systems. Read
            the{" "}
            <Link className="link" href="/guides/pta-status">
              PTA guide
            </Link>{" "}
            and verify the IMEI yourself.
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
        <EmptyState title="No PTA-declared ads yet" body="This page lists only real seller ads marked PTA approved." />
      )}
    </Page>
  );
}
