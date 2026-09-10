"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useState } from "react";

export function OwnerTools({ id, sold, compact = false }: { id: string; sold: boolean; compact?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function setStatus(status: "sold" | "active") {
    const supabase = createBrowserSupabase();
    if (!supabase) return;
    const { error: err } = await supabase.from("listings").update({ status }).eq("id", id);
    if (err) setError(err.message);
    else router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this listing? Buyers will no longer see it.")) return;
    const supabase = createBrowserSupabase();
    if (!supabase) return;
    const { error: err } = await supabase.from("listings").update({ status: "removed" }).eq("id", id);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/my-ads");
    router.refresh();
  }

  return (
    <div className={compact ? "mt-3" : "mt-5 border-t border-line pt-4"}>
      {compact ? null : <p className="mb-2 text-sm font-semibold text-ink">Manage listing</p>}
      <div className={compact ? "flex flex-wrap gap-2" : "grid gap-2"}>
        <Link href={`/sell/${id}`} className={compact ? "btn btn-ghost btn-compact" : "btn btn-primary"}>
          Edit
        </Link>
        {sold ? (
          <button type="button" onClick={() => setStatus("active")} className={compact ? "btn btn-ghost btn-compact" : "btn btn-ghost"}>
            Relist
          </button>
        ) : (
          <button type="button" onClick={() => setStatus("sold")} className={compact ? "btn btn-ghost btn-compact" : "btn btn-ghost"}>
            Mark as sold
          </button>
        )}
        <button type="button" onClick={remove} className={compact ? "btn btn-danger btn-compact" : "btn btn-danger"}>
          Delete
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
