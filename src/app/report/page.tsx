"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { SUPPORT_EMAIL } from "@/lib/market/site";

function ReportInner() {
  const params = useSearchParams();
  const listingId = params.get("listing") || "";
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId: String(form.get("listingId") || ""),
        kind: String(form.get("kind") || "listing"),
        reason: String(form.get("reason") || ""),
        details: String(form.get("details") || ""),
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) setError(body.error || "Could not send the report.");
    else setDone(true);
  }

  if (done) {
    return (
      <p className="rounded-md border border-line bg-brand-soft p-4 text-sm text-brand-ink">
        Thank you. We will review this. We may not reply on every report.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} method="post" className="space-y-4">
      <div>
        <label htmlFor="listingId" className="label">
          Listing id (if you have it)
        </label>
        <input id="listingId" name="listingId" defaultValue={listingId} className="input" />
      </div>
      <div>
        <label htmlFor="kind" className="label">
          What are you reporting?
        </label>
        <select id="kind" name="kind" className="input">
          <option value="listing">A listing</option>
          <option value="seller">A seller</option>
        </select>
      </div>
      <div>
        <label htmlFor="reason" className="label">
          Reason
        </label>
        <select id="reason" name="reason" required className="input">
          <option value="stolen">Looks stolen or snatched</option>
          <option value="scam">Suspected scam / advance payment</option>
          <option value="wrong-pta">Misleading PTA status</option>
          <option value="wrong-photos">Fake or stock photos</option>
          <option value="prohibited">Prohibited item</option>
          <option value="other">Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor="details" className="label">
          Details
        </label>
        <textarea id="details" name="details" className="input min-h-28" />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button className="btn btn-primary w-full">Submit report</button>
    </form>
  );
}

export default function ReportPage() {
  return (
    <main id="main" className="page max-w-xl">
      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl">Report a listing or seller</h1>
        <p className="mb-6 mt-2 text-sm text-muted">
          If someone is in immediate danger, contact local police. For marketplace abuse, use this form or email{" "}
          <a className="link" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        <Suspense>
          <ReportInner />
        </Suspense>
      </div>
    </main>
  );
}
