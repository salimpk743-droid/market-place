"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

export function ShareButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const payload = { title, text, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      /* user cancelled */
    }
  }
  return (
    <button type="button" onClick={share} className="btn btn-ghost mt-2 w-full">
      <Share2 className="h-4 w-4" aria-hidden />
      {copied ? "Link copied" : "Share this ad"}
    </button>
  );
}
