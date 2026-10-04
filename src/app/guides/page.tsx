import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Mobile market and used phone guides",
  description:
    "Pakistan phone guides: mobile markets in Karachi, Lahore, Islamabad, Rawalpindi, Multan, Peshawar and 20 more cities, second hand phone checks, PTA and scams.",
  alternates: { canonical: absoluteUrl("/guides") },
};

const GUIDES = [
  { href: "/guides/best-mobile-markets-in-pakistan", title: "What are the best mobile markets in Pakistan?", body: "Karachi, Lahore, Islamabad and Rawalpindi: the markets people actually walk, and what to check before you pay." },
  { href: "/guides/best-mobile-market-in-karachi", title: "What is the best mobile market in Karachi?", body: "Saddar, Star City Mall, Amma Tower and Al Najeebi: second hand phones and iPhones, raids and checks." },
  { href: "/guides/best-mobile-market-in-lahore", title: "What is the best mobile market in Lahore?", body: "Hafeez Centre, Hassan Tower and Hall Road: second hand phones, iPhones and e-Gadget checks." },
  { href: "/guides/best-mobile-market-in-islamabad", title: "What is the best mobile market in Islamabad?", body: "Blue Area, G-9, Centaurus and F-6, with shop names and shop numbers." },
  { href: "/guides/best-mobile-market-in-rawalpindi", title: "What is the best mobile market in Rawalpindi?", body: "Singapore Plaza, Bank Road plazas and Raja Bazaar: second hand phones and checks." },
  { href: "/guides/best-mobile-market-in-multan", title: "What is the best mobile market in Multan?", body: "Hussain Agahi and Mall Plaza: second hand phones, e-Gadget and China phones." },
  { href: "/guides/best-mobile-market-in-faisalabad", title: "What is the best mobile market in Faisalabad?", body: "Katchery Bazaar by the Clock Tower and D Ground, with named counters." },
  { href: "/guides/best-mobile-market-in-peshawar", title: "What is the best mobile market in Peshawar?", body: "Saddar, Bilour Plaza, Karzai Plaza and Karkhano: second hand phones and accessories." },
  { href: "/guides/best-mobile-market-in-hyderabad", title: "What is the best mobile market in Hyderabad?", body: "The Chandni mobile market in Saddar, a Samsung store, and the 2025 Customs raid." },
  { href: "/guides/best-mobile-market-in-quetta", title: "What is the best mobile market in Quetta?", body: "Liaquat Bazaar counters a distributor lists, service and PTA checks. Shorter: few shops publish an address." },
  { href: "/guides/best-mobile-market-in-mardan", title: "What is the best mobile market in Mardan?", body: "What we could verify: service, the police E-Gadget system for traders, and PTA checks." },
  { href: "/guides/best-mobile-market-in-gujranwala", title: "What is the best mobile market in Gujranwala?", body: "The Trade Centre counter a distributor lists, service and PTA checks." },
  { href: "/guides/best-mobile-market-in-swat", title: "What is the best mobile market in Swat (Mingora)?", body: "What we could and could not verify, and how to buy safely." },
  { href: "/guides/best-mobile-market-in-sukkur", title: "What is the best mobile market in Sukkur?", body: "The Clock Tower counter a distributor lists, service and PTA checks." },
  { href: "/guides/best-mobile-market-in-sialkot", title: "What is the best mobile market in Sialkot?", body: "The Mujahid Road shop a distributor lists, the 2025 cloned-Pixel raids and e-Gadget checks." },
  { href: "/guides/best-mobile-market-in-gujrat", title: "What is the best mobile market in Gujrat?", body: "Gulzar-e-Madina Road, Zaib Super Market and Kashmir Plaza, and PTA's 2025 cloned-phone raids." },
  { href: "/guides/best-mobile-market-in-kasur", title: "What is the best mobile market in Kasur?", body: "Two Railway Road shops a distributor lists, and when to go to Lahore instead." },
  { href: "/guides/best-mobile-market-in-jhang", title: "What is the best mobile market in Jhang?", body: "The Shaheed Road shop a distributor lists, nearest service and PTA checks." },
  { href: "/guides/best-mobile-market-in-taxila", title: "What is the best mobile market in Taxila?", body: "The nearest listed shop in Wah Cantt, Rawalpindi Saddar, and e-Gadget checks." },
  { href: "/guides/best-mobile-market-in-abbottabad", title: "What is the best mobile market in Abbottabad?", body: "What we could verify, PTA's 2025 IMEI raids in Mansehra, and safe buying." },
  { href: "/guides/best-mobile-market-in-swabi", title: "What is the best mobile market in Swabi?", body: "What we could and could not verify, nearest service in Mardan, and checks." },
  { href: "/guides/best-mobile-market-in-buner", title: "What is the best mobile market in Buner?", body: "What a 2020 report says about Buner's phone markets, and how to buy safely." },
  { href: "/guides/best-mobile-market-in-kohat", title: "What is the best mobile market in Kohat?", body: "Nearest service in Peshawar, KP's eGadget for shops, and used-phone checks." },
  { href: "/guides/best-mobile-market-in-karak", title: "What is the best mobile market in Karak?", body: "No verified market list, so: nearest service and the checks that matter." },
  { href: "/guides/best-mobile-market-in-larkana", title: "What is the best mobile market in Larkana?", body: "The Main Market shop a distributor lists, nearest service in Sukkur, and PTA checks." },
  { href: "/best-mobile-phones/under-30000", title: "Best phones under Rs 30,000", body: "New PTA-approved phones with verified, dated prices." },
  { href: "/best-mobile-phones/under-50000", title: "Best phones under Rs 50,000", body: "New PTA-approved phones from Rs 30,000 to Rs 50,000." },
  { href: "/best-mobile-phones/under-100000", title: "Best phones under Rs 100,000", body: "New PTA-approved phones from Rs 50,000 to Rs 100,000." },
  { href: "/guides/authorized-mobile-dealers-in-pakistan", title: "Who are the authorized Apple dealers in Pakistan?", body: "No Apple Store. How to check Apple, Samsung and other brand dealers." },
  { href: "/guides/inspect-used-phone", title: "Inspect a used phone before you pay", body: "Screen, cameras, IMEI, ports, and a meeting checklist." },
  { href: "/guides/pta-status", title: "Non-PTA meaning: PTA approved vs non-PTA", body: "PTA full form, the 60-day rule, JV and CPID, *8484# and how to check an IMEI." },
  { href: "/guides/pta-tax", title: "PTA tax on mobile phones (2026-27)", body: "FBR slabs, a calculator, iPhone 17 amounts and FBR values for used phones." },
  { href: "/guides/battery-health", title: "Battery health on used phones", body: "What the percentage means and how people fake it." },
  { href: "/guides/common-scams", title: "Common used-phone scams in Pakistan", body: "Advance payment, dummy units, cloned IMEIs, and too-cheap ads." },
  { href: "/buyer-safety", title: "Buyer safety", body: "Public meetings, no advance money, and reporting." },
];

export default function GuidesPage() {
  return (
    <main id="main" className="page max-w-3xl">
      <p className="section-kicker">Advice</p>
      <h1 className="mt-1 text-2xl sm:text-3xl">Guides</h1>
      <p className="mt-2 text-sm text-muted">
        Written for people comparing mobile markets and used phones in Pakistan. City pages name buildings and shops that publish an address. They are not a ranking, and they are not a government certificate.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <Link href="/used-mobile-phones" className="link">Used phones in Pakistan</Link>
        <Link href="/mobile-prices-in-pakistan" className="link">Mobile prices in Pakistan</Link>
        <Link href="/pta-approved-phones" className="link">PTA approved phones</Link>
        <Link href="/non-pta-phones" className="link">Non-PTA phones</Link>
      </div>
      <ul className="mt-8 space-y-3">
        {GUIDES.map((g) => (
          <li key={g.href}>
            <Link href={g.href} className="card block p-5 hover:border-brand/30">
              <p className="text-base font-semibold text-brand-ink">{g.title}</p>
              <p className="mt-1 text-sm text-muted">{g.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
