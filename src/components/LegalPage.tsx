import { SUPPORT_EMAIL } from "@/lib/market/site";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main id="main" className="page max-w-3xl">
      <article className="card p-6 sm:p-8">
        <h1 className="text-2xl text-ink sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted">Last updated: {updated}</p>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-soft [&_a]:text-brand [&_a]:underline [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:text-ink">
          {children}
        </div>
        <p className="mt-8 border-t border-line pt-4 text-xs text-muted">
          This is information about how Mobile Market works. It is not legal advice. Pakistani regulatory questions
          should be reviewed by a qualified lawyer. Contact{" "}
          <a className="text-brand underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </article>
    </main>
  );
}
