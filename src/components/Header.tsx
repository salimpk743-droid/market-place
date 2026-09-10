"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Plus, Search, X } from "lucide-react";
import { BRAND } from "@/lib/market/site";

const NAV = [
  { href: "/phones", label: "Used Phones" },
  { href: "/accessories", label: "Accessories" },
  { href: "/guides", label: "Guides" },
  { href: "/my-ads", label: "My Ads" },
];

const BROWSE = [
  { href: "/phones", label: "Used Phones" },
  { href: "/accessories", label: "Accessories" },
  { href: "/accessories/power-bank", label: "Power banks" },
  { href: "/accessories/charger-cable", label: "Chargers" },
  { href: "/accessories/earbuds", label: "Earbuds & AirPods" },
  { href: "/accessories/cover-case", label: "Covers & cases" },
  { href: "/#brands", label: "Browse by brand" },
  { href: "/#cities", label: "Browse by city" },
  { href: "/pta-approved-phones", label: "PTA phones" },
  { href: "/guides", label: "Guides" },
  { href: "/buyer-safety", label: "Buyer safety" },
];

export function Header({ email }: { email?: string | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 text-ink backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:h-16 md:gap-5">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2" onClick={close}>
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-brand-ink text-[11px] font-bold tracking-[0.04em] text-white">
            MM
          </span>
          <span className="hidden text-[1.05rem] font-semibold tracking-tight text-brand-ink sm:inline">{BRAND}</span>
          <span className="sr-only">{BRAND} home</span>
        </Link>

        <form action="/browse" method="get" className="relative hidden min-w-0 flex-1 md:block">
          <label htmlFor="header-q" className="sr-only">
            Search phones and accessories
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="header-q"
            name="q"
            placeholder="Search phones, AirPods, chargers, covers"
            className="input h-10 min-h-10 pl-9"
          />
        </form>

        <nav className="hidden items-center gap-5 text-sm font-medium text-ink-soft lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-ink">
              {item.label}
            </Link>
          ))}
          {email ? (
            <Link href="/account" className="hover:text-brand-ink">
              Account
            </Link>
          ) : (
            <Link href="/login" className="hover:text-brand-ink">
              Sign in
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/sell" className="btn btn-primary btn-compact gap-1.5 px-3">
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Sell your phone
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-line bg-surface px-4 py-4 md:max-h-[calc(100dvh-4rem)] lg:hidden"
          aria-label="Mobile"
        >
          <form action="/browse" method="get" className="mb-4 md:hidden">
            <label htmlFor="mobile-q" className="sr-only">
              Search phones and accessories
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input id="mobile-q" name="q" placeholder="Search phones, AirPods, chargers" className="input pl-9" />
            </div>
          </form>
          <p className="section-kicker mb-1">Browse</p>
          <ul className="mb-4">
            {BROWSE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center border-b border-line text-sm font-medium"
                  onClick={close}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="section-kicker mb-1">Account</p>
          <ul className="mb-4">
            <li>
              <Link href="/my-ads" className="flex min-h-11 items-center border-b border-line text-sm font-medium" onClick={close}>
                My ads
              </Link>
            </li>
            <li>
              <Link
                href={email ? "/account" : "/login"}
                className="flex min-h-11 items-center border-b border-line text-sm font-medium"
                onClick={close}
              >
                {email ? "Account" : "Sign in"}
              </Link>
            </li>
            {email ? null : (
              <li>
                <Link href="/register" className="flex min-h-11 items-center text-sm font-medium" onClick={close}>
                  Create seller account
                </Link>
              </li>
            )}
          </ul>
          <Link href="/sell" className="btn btn-primary w-full" onClick={close}>
            <Plus className="h-4 w-4" aria-hidden />
            Sell your phone
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
