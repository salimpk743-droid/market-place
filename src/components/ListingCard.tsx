import Link from "next/link";
import { MapPin } from "lucide-react";
import { cityLabel } from "@/lib/market/catalog";
import { formatPkr, listingPath, listingTitle, timeAgo } from "@/lib/market/format";
import type { PublicListing } from "@/lib/market/types";
import { StatusBadge } from "@/components/ui";

export function ListingCard({ listing }: { listing: PublicListing }) {
  const spec = [listing.storage_gb ? `${listing.storage_gb} GB` : null, listing.condition || null].filter(Boolean).join(" · ");
  const alt = listingTitle(listing);
  const sold = listing.status === "sold";
  return (
    <Link
      href={listingPath(listing)}
      className="group block overflow-hidden rounded-lg border border-line bg-surface shadow-[var(--shadow-card)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-page">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={alt}
            className={`h-full w-full object-cover outline outline-1 -outline-offset-1 outline-black/10 ${sold ? "opacity-50" : ""}`}
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center px-4 text-center text-sm text-muted">No photo yet</div>
        )}
        <div className="absolute left-2.5 top-2.5">
          <StatusBadge pta={listing.pta_status} sold={sold} featured={listing.featured} category={listing.category} />
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="text-sm font-semibold leading-snug text-ink">{alt}</h3>
        <p className="mt-1.5 text-lg font-semibold tabular-nums text-brand-ink">{formatPkr(listing.price_pkr)}</p>
        {spec ? <p className="mt-1 text-xs text-muted">{spec}</p> : null}
        <p className="mt-2 flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden />
          <span className="truncate">{cityLabel(listing.city_slug, listing.area)}</span>
          {listing.created_at ? <span className="ml-auto shrink-0">{timeAgo(listing.created_at)}</span> : null}
        </p>
      </div>
    </Link>
  );
}
