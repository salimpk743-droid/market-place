"use client";

import { useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { formatPkMobile, whatsappDigits } from "@/lib/market/validation";

export function ContactSeller({
  listingId,
  sellerName,
  sold,
  priceLabel,
  isPhone = true,
}: {
  listingId: string;
  sellerName: string;
  sold?: boolean;
  priceLabel?: string;
  isPhone?: boolean;
}) {
  const [phone, setPhone] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (sold) {
    return <p className="mt-2 text-sm text-muted">This listing is no longer available.</p>;
  }

  async function reveal() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || "Could not load the seller number right now.");
        return;
      }
      setPhone(body.contact_phone);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const display = phone ? formatPkMobile(phone) : "";
  const wa = phone ? whatsappDigits(phone) : "";
  const tel = phone ? phone.replace(/[^0-9+]/g, "") : "";

  return (
    <>
      <div>
        <p className="text-sm font-semibold text-ink">{sellerName || "Seller"}</p>
        <p className="mt-0.5 text-xs text-muted">
          {phone ? "Number revealed for this visit only." : "Number is shown only after you request it."}
        </p>
        {phone ? (
          <>
            <a href={`tel:${tel}`} className="btn btn-primary mt-3 w-full">
              <Phone className="h-4 w-4" aria-hidden />
              {display}
            </a>
            <a href={`https://wa.me/${encodeURIComponent(wa)}`} className="btn btn-ghost mt-2 w-full">
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp
            </a>
          </>
        ) : (
          <button type="button" onClick={reveal} disabled={loading} className="btn btn-primary mt-3 w-full">
            <Phone className="h-4 w-4" aria-hidden />
            {loading ? "Requesting…" : "Contact seller"}
          </button>
        )}
        <p className="mt-2 text-xs text-muted">
          Meet in public, inspect the {isPhone ? "phone" : "item"}, and never send advance money to someone you do not
          know.
        </p>
        {error ? (
          <p className="mt-2 text-xs text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_18px_rgba(18,40,79,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted">{sellerName || "Seller"}</p>
            {priceLabel ? <p className="font-semibold tabular-nums text-brand-ink">{priceLabel}</p> : null}
          </div>
          {phone ? (
            <div className="flex min-w-0 flex-1 gap-2">
              <a href={`tel:${tel}`} className="btn btn-primary btn-compact min-h-11 flex-1">
                Call
              </a>
              <a href={`https://wa.me/${encodeURIComponent(wa)}`} className="btn btn-ghost btn-compact min-h-11 flex-1">
                WhatsApp
              </a>
            </div>
          ) : (
            <button type="button" onClick={reveal} disabled={loading} className="btn btn-primary min-h-11 min-w-0 flex-1">
              <Phone className="h-4 w-4" aria-hidden />
              {loading ? "Requesting…" : "Contact seller"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
