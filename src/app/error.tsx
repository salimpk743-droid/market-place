"use client";

import { SUPPORT_EMAIL } from "@/lib/market/site";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="page max-w-lg text-center">
      <h1 className="text-2xl">Something went wrong</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        Please try again. If this keeps happening, email {SUPPORT_EMAIL}.
      </p>
      <button type="button" onClick={reset} className="btn btn-primary mx-auto mt-6">
        Try again
      </button>
    </main>
  );
}
