import Link from "next/link";
import { ADVERTISE_EMAIL, ADVERTISE_MAILTO, ADVERTISE_PATH } from "@/lib/market/site";

/** Short call to action for shop owners, shown at the end of city market guides. */
export function AdvertiseCta({ city }: { city?: string }) {
  return (
    <aside className="not-prose mt-8 rounded-xl border border-line bg-page p-4 text-sm text-ink-soft" aria-label="Advertise your mobile shop">
      <p className="font-semibold text-ink">Own a mobile shop{city ? ` in ${city}` : ""}?</p>
      <p className="mt-1">
        Promote your shop and products to people reading our city guides for new, used and second hand phones and
        accessories. Sponsored placements are always clearly labelled.{" "}
        <Link href={ADVERTISE_PATH} className="link">
          Advertise Your Mobile Shop
        </Link>{" "}
        or email{" "}
        <a href={ADVERTISE_MAILTO} className="link">
          {ADVERTISE_EMAIL}
        </a>
        .
      </p>
    </aside>
  );
}
