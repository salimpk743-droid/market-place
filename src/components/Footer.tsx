import Link from "next/link";
import { BRAND, SUPPORT_EMAIL } from "@/lib/market/site";

const COLUMNS = [
  {
    title: "Mobile Market",
    links: [
      { href: "/about", label: "About Mobile Market" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/sell", label: "Sell your phone" },
    ],
  },
  {
    title: "Buy",
    links: [
      { href: "/phones", label: "Used Phones" },
      { href: "/accessories", label: "Accessories" },
      { href: "/accessories/earbuds", label: "Earbuds & AirPods" },
      { href: "/accessories/charger-cable", label: "Chargers & cables" },
      { href: "/#brands", label: "Browse by Brand" },
      { href: "/#cities", label: "Browse by City" },
      { href: "/pta-approved-phones", label: "PTA Phones" },
    ],
  },
  {
    title: "Safety & Support",
    links: [
      { href: "/buyer-safety", label: "Buyer Safety" },
      { href: "/rules", label: "Marketplace Rules" },
      { href: "/report", label: "Report a Listing" },
      { href: "/contact", label: "Contact Support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/seller-terms", label: "Seller Terms" },
      { href: "/prohibited", label: "Prohibited items" },
      { href: "/delete-account", label: "Account Deletion" },
    ],
  },
];

function Links({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.href + l.label}>
          <Link href={l.href} className="hover:text-white">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-line bg-brand-ink text-sm text-white/75">
      <div className="mx-auto hidden max-w-6xl grid-cols-4 gap-8 px-4 py-12 md:grid">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="font-semibold text-white">{col.title}</p>
            <div className="mt-3">
              <Links links={col.links} />
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-4 py-2 md:hidden">
        {COLUMNS.map((col) => (
          <details key={col.title} className="border-b border-white/10">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-2 font-semibold text-white">
              {col.title}
              <span className="footer-plus text-lg leading-none text-white/50 transition-transform" aria-hidden>
                +
              </span>
            </summary>
            <div className="pb-3">
              <Links links={col.links} />
            </div>
          </details>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND}. All rights reserved.
          </p>
          <p>
            Support:{" "}
            <a className="text-accent hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
