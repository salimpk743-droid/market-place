"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SUPPORT_EMAIL } from "@/lib/market/site";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const typed = String(new FormData(e.currentTarget).get("confirm") || "");
    if (typed !== "DELETE") {
      setError("Type DELETE in capital letters to confirm.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/account/delete", { method: "POST" });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(body.error || "Could not delete this account.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main id="main" className="page max-w-xl">
      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl">Delete your account</h1>
        <p className="mt-3 text-sm text-muted">
          This removes your seller account, your listings, and photos we store for those listings. It cannot be undone.
          We may keep reports and security logs for a limited time if the law requires it.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label htmlFor="confirm" className="label">
            Type DELETE to confirm
          </label>
          <input id="confirm" name="confirm" required className="input" />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <button disabled={busy} className="btn w-full bg-danger text-white hover:brightness-95">
            {busy ? "Deleting…" : "Delete account permanently"}
          </button>
        </form>
        <p className="mt-4 text-xs text-muted">
          Need help first? Email{" "}
          <a className="link" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </main>
  );
}
