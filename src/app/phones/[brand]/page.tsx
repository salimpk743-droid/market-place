import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { JsonLd } from "@/components/JsonLd";
import { getPhoneBrandBySlug } from "@/lib/market/catalog";
import { searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
import { ListingGrid, Page, PageTitle } from "@/components/ui";

type Props = { params: Promise<{ brand: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const b = getPhoneBrandBySlug(brand);
  if (!b) return { title: "Brand not found", robots: { index: false, follow: true } };
  const result = await searchListings({ brand: b.name, category: "phone" });
  return {
    title: `Used ${b.name} phones in Pakistan`,
    description:
      b.slug === "apple"
        ? "Browse used Apple phones for sale in Pakistan on Mobile Market. See live listings by city, PTA status and storage."
        : `Browse used ${b.name} phones for sale on Mobile Market. Filter by city, PTA status and storage.`,
    alternates: { canonical: absoluteUrl(`/phones/${b.slug}`) },
    robots: result.total > 0 ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function BrandPage({ params }: Props) {
  const { brand } = await params;
  const b = getPhoneBrandBySlug(brand);
  if (!b) notFound();
  const result = await searchListings({ brand: b.name, category: "phone" });
  const apple = b.slug === "apple";
  return (
    <Page>
      <PageTitle
        kicker="Brand"
        title={apple ? "Used Apple phones in Pakistan" : `Used ${b.name} phones`}
        description={
          <>
            Live classifieds for {b.name} posted by sellers. PTA status and condition are declared by the seller — confirm
            independently before you pay.
            {apple ? (
              <>
                {" "}
                Browse{" "}
                <Link href="/phones" className="link">
                  all used phones
                </Link>
                .
              </>
            ) : null}
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
        <EmptyState title={`No live ${b.name} ads yet`} body="When a seller posts a real listing, it will show up here." actionHref="/sell" actionLabel="Sell your phone" />
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: b.name, item: absoluteUrl(`/phones/${b.slug}`) },
          ],
        }}
      />
    </Page>
  );
}
