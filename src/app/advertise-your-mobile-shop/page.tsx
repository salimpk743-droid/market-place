import type { Metadata } from "next";
import Link from "next/link";
import { AdvertiseContact } from "@/components/AdvertiseContact";
import { ADVERTISE_PATH, absoluteUrl } from "@/lib/market/site";

const TITLE = "Advertise Your Mobile Shop";
const DESCRIPTION =
  "Mobile shop owners: promote your shop and products on Mobile Market, next to our city guides for new, used and second hand phones and accessories. Email us your shop details.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(ADVERTISE_PATH) },
  robots: { index: true, follow: true },
  openGraph: { title: `${TITLE} | Mobile Market`, description: DESCRIPTION, url: absoluteUrl(ADVERTISE_PATH), type: "website" },
};

export default function AdvertisePage() {
  return (
    <main id="main" className="page max-w-3xl">
      <article className="card p-6 sm:p-8">
        <p className="section-kicker">For shop owners</p>
        <h1 className="mt-1 text-2xl sm:text-3xl">{TITLE}</h1>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft">
          <p>
            Run a mobile shop in Pakistan? Mobile Market publishes{" "}
            <Link href="/guides" className="link">city mobile market guides</Link> for people looking for second hand and
            used phones, brand new phones and accessories in Karachi, Lahore, Rawalpindi, Islamabad, Peshawar, Multan and
            many other cities. If you want to promote your shop or your products to those buyers, email us.
          </p>

          <div className="rounded-xl border border-line bg-page p-4">
            <p className="font-semibold text-ink">Email us to advertise</p>
            <div className="mt-2">
              <AdvertiseContact />
            </div>
            <p className="mt-3 text-xs text-muted">
              Subject: &ldquo;Advertise my mobile shop on mobilemarket.pk&rdquo;. Email is the only way to reach us about
              advertising for now.
            </p>
          </div>

          <h2 className="text-lg font-semibold text-ink">What to send</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Shop name</li>
            <li>Market or plaza, with the shop number if you have one</li>
            <li>City</li>
            <li>Phone and WhatsApp number</li>
            <li>What you sell: new phones, used or second hand phones, open box, accessories, repairs</li>
            <li>A few photos of the shop front, counter or products</li>
          </ul>

          <h2 className="text-lg font-semibold text-ink">How sponsored placements work</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Any sponsored or paid placement will be clearly labelled as sponsored, so buyers can tell it apart from our own content.</li>
            <li>Advertising does not change our guides. Shop names in the city guides come from published distributor, brand and news sources, and that stays the same.</li>
            <li>We review every request and may decline a shop. Promoted products must follow our <Link href="/rules" className="link">marketplace rules</Link> and <Link href="/prohibited" className="link">prohibited items list</Link>.</li>
            <li>We reply by email to discuss options. We do not publish advertising prices on this page.</li>
          </ul>

          <h2 className="text-lg font-semibold text-ink">Just want to sell a phone?</h2>
          <p>
            Anyone can <Link href="/sell" className="link">post an ad</Link> for a phone or accessory. Please read the{" "}
            <Link href="/seller-terms" className="link">seller terms</Link> first. For account or listing problems, use the{" "}
            <Link href="/contact" className="link">contact page</Link>.
          </p>
        </div>
      </article>
    </main>
  );
}
