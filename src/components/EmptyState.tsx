import Link from "next/link";

export function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="card px-6 py-12 text-center">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="btn btn-primary mx-auto mt-5">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
