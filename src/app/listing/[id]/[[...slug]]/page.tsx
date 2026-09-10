import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ContactSeller } from "@/components/ContactSeller";
import { ShareButton } from "@/components/ShareButton";
import { ListingCard } from "@/components/ListingCard";
import { ListingGallery } from "@/components/ListingGallery";
import { JsonLd } from "@/components/JsonLd";
import { ListingGrid, Page, SectionHead, StatusBadge } from "@/components/ui";
import { cityLabel, brandSlug, categoryPath, getCategory, isPhoneCategory, ptaMeta } from "@/lib/market/catalog";
import { formatPkr, listingPath, listingSlug, listingTitle, timeAgo } from "@/lib/market/format";
import { getListingById, getListingImages, getRelatedListings, isOwnListing } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
import { OwnerTools } from "@/components/OwnerTools";
import { MapPin, ShieldAlert } from "lucide-react";

type Props = { params: Promise<{ id: string; slug?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing || listing.status === "removed") {
    return { title: "Listing not found", robots: { index: false } };
  }
  const title = listingTitle(listing);
  const cat = getCategory(listing.category);
  const pta = ptaMeta(listing.pta_status);
  const ptaBit = pta ? ` Seller-declared ${pta.label}.` : "";
  const desc = `${title} (${cat.name}) in ${cityLabel(listing.city_slug, listing.area)} — ${formatPkr(listing.price_pkr)}.${ptaBit}`;
  const index = listing.status === "active";
  const image = listing.image_url ? absoluteUrl(listing.image_url) : undefined;
  return {
    title,
    description: desc,
    alternates: { canonical: absoluteUrl(listingPath(listing)) },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description: desc,
      url: absoluteUrl(listingPath(listing)),
      type: "website",
      images: image ? [{ url: image, alt: title }] : undefined,
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const { id, slug } = await params;
  const listing = await getListingById(id);
  if (!listing || listing.status === "removed") notFound();
  const want = listingSlug(listing);
  const got = slug?.[0];
  if (got !== want) redirect(listingPath(listing));

  const [images, related, mine] = await Promise.all([
    getListingImages(listing.id),
    getRelatedListings(listing),
    isOwnListing(listing.id),
  ]);
  const phone = isPhoneCategory(listing.category);
  const cat = getCategory(listing.category);
  const pta = ptaMeta(listing.pta_status);
  const title = listingTitle(listing);
  const gallery = images.length
    ? images
    : listing.image_url
      ? [{ id: "cover", url: listing.image_url }]
      : [];
  const sold = listing.status === "sold";
  const specs: [string, string][] = [
    ["Category", cat.name],
    listing.storage_gb ? ["Storage", `${listing.storage_gb} GB`] : null,
    listing.ram_gb ? ["RAM", `${listing.ram_gb} GB`] : null,
    listing.battery_health ? ["Battery", `${listing.battery_health}%`] : null,
    listing.condition ? ["Condition", listing.condition] : null,
    listing.color ? ["Color", listing.color] : null,
    listing.year ? ["Year", String(listing.year)] : null,
    phone && pta ? ["PTA", pta.label] : null,
  ].filter(Boolean) as [string, string][];

  return (
    <Page className="pb-24 lg:pb-0">
      <Link href={categoryPath(listing.category)} className="text-sm font-medium text-brand hover:underline">
        ← {phone ? "All used phones" : cat.name}
      </Link>
      {sold ? (
        <div className="mt-3 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white">This listing is marked sold</div>
      ) : null}
      <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div>
          <ListingGallery images={gallery} title={title} sold={sold} />
          <div className="card mt-5 p-5 sm:p-6">
            <h2 className="text-base font-semibold">Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {listing.description || "No extra details provided."}
            </p>
          </div>
        </div>
        <aside className="card h-fit p-5 sm:p-6">
          <StatusBadge pta={listing.pta_status} sold={sold} featured={listing.featured} category={listing.category} />
          <h1 className="mt-3 text-xl font-semibold sm:text-2xl">{title}</h1>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-brand-ink">{formatPkr(listing.price_pkr)}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {cityLabel(listing.city_slug, listing.area)}
          </p>
          <p className="mt-1 text-xs text-muted">Listed {timeAgo(listing.created_at)}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
            {specs.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 border-t border-line pt-4">
            <ContactSeller listingId={listing.id} sellerName={listing.seller_name || "Seller"} sold={sold} priceLabel={formatPkr(listing.price_pkr)} />
            <ShareButton title={title} text={`${title} — ${formatPkr(listing.price_pkr)}`} />
            <Link href={`/report?listing=${encodeURIComponent(listing.id)}`} className="mt-3 flex items-center justify-center gap-1.5 text-sm text-danger hover:underline">
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
              Report this listing
            </Link>
          </div>
          {mine ? <OwnerTools id={listing.id} sold={sold} /> : null}
          <p className="mt-4 text-xs text-muted">
            {phone
              ? "PTA, battery and condition are declared by the seller. Mobile Market does not verify devices, IMEI or ownership."
              : "Brand, condition and whether the item is original are declared by the seller. Mobile Market does not verify accessories."}{" "}
            Read{" "}
            <Link href="/buyer-safety" className="link">
              buyer safety
            </Link>
            .
          </p>
        </aside>
      </div>
      {related.length ? (
        <section className="mt-12">
          <SectionHead
            title={`More ${listing.brand} ${phone ? "phones" : cat.short.toLowerCase()}`}
            href={phone ? `/phones/${brandSlug(listing.brand)}` : categoryPath(listing.category)}
          />
          <ListingGrid>
            {related.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </ListingGrid>
        </section>
      ) : null}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            {
              "@type": "ListItem",
              position: 2,
              name: cat.name,
              item: absoluteUrl(categoryPath(listing.category)),
            },
            { "@type": "ListItem", position: 3, name: title, item: absoluteUrl(listingPath(listing)) },
          ],
        }}
      />
      {listing.status === "active" ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: title,
            description: listing.description || title,
            image: gallery[0]?.url || undefined,
            brand: { "@type": "Brand", name: listing.brand },
            category: cat.name,
            offers: {
              "@type": "Offer",
              priceCurrency: "PKR",
              price: listing.price_pkr,
              availability: "https://schema.org/InStock",
              url: absoluteUrl(listingPath(listing)),
              itemCondition: "https://schema.org/UsedCondition",
            },
          }}
        />
      ) : null}
    </Page>
  );
}
