import Link from "next/link";
import type { ReactNode } from "react";
import { FilterForm } from "@/components/FilterForm";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { ListingGrid, Page, PageTitle } from "@/components/ui";
import type { ListingFilters } from "@/lib/market/types";
import type { PublicListing } from "@/lib/market/types";

type Result = {
  rows: PublicListing[];
  total: number;
  page: number;
  pageCount: number;
};

export function CatalogResults({
  result,
  filters,
  action,
  lockedCategory,
  kicker,
  title,
  description,
  emptyTitle,
  emptyBody,
  intro,
}: {
  result: Result;
  filters: ListingFilters;
  action: string;
  lockedCategory?: string;
  kicker: string;
  title: string;
  description?: string;
  emptyTitle: string;
  emptyBody: string;
  intro?: ReactNode;
}) {
  const q = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v && k !== "page") q.set(k, v);
  });
  if (lockedCategory) q.set("category", lockedCategory);

  return (
    <Page>
      <PageTitle
        kicker={kicker}
        title={title}
        description={description || `${result.total} listing${result.total === 1 ? "" : "s"} match your filters`}
      />
      {intro}
      <FilterForm filters={filters} action={action} lockedCategory={lockedCategory} />
      {result.rows.length ? (
        <ListingGrid>
          {result.rows.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </ListingGrid>
      ) : (
        <EmptyState title={emptyTitle} body={emptyBody} actionHref="/sell" actionLabel="Sell your phone" />
      )}
      {result.pageCount > 1 ? (
        <nav className="mt-8 flex justify-center gap-3" aria-label="Pagination">
          {result.page > 1 ? (
            <Link className="btn btn-ghost" href={`${action}?${new URLSearchParams({ ...Object.fromEntries(q), page: String(result.page - 1) })}`}>
              Previous
            </Link>
          ) : null}
          <span className="px-2 py-2 text-sm text-muted">
            Page {result.page} of {result.pageCount}
          </span>
          {result.page < result.pageCount ? (
            <Link className="btn btn-ghost" href={`${action}?${new URLSearchParams({ ...Object.fromEntries(q), page: String(result.page + 1) })}`}>
              Next
            </Link>
          ) : null}
        </nav>
      ) : null}
    </Page>
  );
}
