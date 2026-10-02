import Link from "next/link";
import { BRAND } from "@/lib/market/site";

/** Small "who wrote this / where it comes from" box for editorial guides. */
export function AuthorBox({ reviewed, sourcesNote }: { reviewed: string; sourcesNote?: string }) {
  return (
    <aside className="not-prose mt-8 rounded-xl border border-line bg-page p-4 text-sm text-muted">
      <p className="font-semibold text-ink">Written by the {BRAND} editorial team</p>
      <p className="mt-1">
        Last checked {reviewed}. {sourcesNote || "Facts are taken from the official or published sources listed on this page."} {BRAND} is a
        classifieds site, not PTA, FBR or a law firm. Found a mistake?{" "}
        <Link href="/contact" className="link">
          Tell us
        </Link>
        .
      </p>
    </aside>
  );
}

export function SourceList({ sources }: { sources: readonly { label: string; href: string }[] }) {
  return (
    <ul className="list-disc space-y-1 pl-6 text-xs">
      {sources.map((s) => (
        <li key={s.href + s.label}>
          <a href={s.href} rel="nofollow noopener" target="_blank">
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
