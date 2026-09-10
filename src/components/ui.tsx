import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ptaMeta, getCategory, isPhoneCategory } from "@/lib/market/catalog";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Page({
  children,
  className,
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <main id="main" className={cn("page", wide ? "max-w-6xl" : "", className)}>
      {children}
    </main>
  );
}

export function PageTitle({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {kicker ? <p className="section-kicker mb-1">{kicker}</p> : null}
        <h1 className="text-2xl text-ink sm:text-[1.75rem]">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function SectionHead({
  title,
  description,
  href,
  linkLabel = "View all",
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg text-ink sm:text-xl">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="shrink-0 text-sm font-medium text-brand hover:underline">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="mx-auto w-full max-w-md flex-grow px-4 py-10 sm:py-14">
      <div className="card p-6 sm:p-8">
        <h1 className="text-xl text-ink sm:text-2xl">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-muted">{description}</p> : null}
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}

export function ListingGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">{children}</div>;
}

const PTA_CLASS: Record<string, string> = {
  official: "bg-success/10 text-success",
  cpid: "bg-accent/15 text-accent-ink",
  "non-pta": "bg-danger/10 text-danger",
  jv: "bg-page text-muted",
};

export function StatusBadge({
  pta,
  sold,
  featured,
  status,
  category,
}: {
  pta?: string | null;
  sold?: boolean;
  featured?: boolean;
  status?: string;
  category?: string | null;
}) {
  const phone = isPhoneCategory(category);
  const meta = phone && pta ? ptaMeta(pta) : null;
  const cat = category && !phone ? getCategory(category) : null;
  return (
    <span className="flex flex-wrap gap-1">
      {sold || status === "sold" ? <span className="badge bg-ink text-white">Sold</span> : null}
      {status === "removed" ? <span className="badge bg-danger/10 text-danger">Removed</span> : null}
      {status === "pending_moderation" ? <span className="badge bg-brand-soft text-brand-ink">Pending</span> : null}
      {featured && !sold && status !== "sold" ? (
        <span className="badge border border-accent/40 bg-accent/15 text-accent-ink">Featured</span>
      ) : null}
      {cat ? <span className="badge bg-brand-soft text-brand-ink">{cat.short}</span> : null}
      {meta ? <span className={cn("badge", PTA_CLASS[meta.id] || "bg-page text-muted")}>{meta.short}</span> : null}
    </span>
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p className="mt-1 text-xs text-danger" role="alert">
      {children}
    </p>
  );
}
