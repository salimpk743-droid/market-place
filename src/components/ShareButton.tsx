"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

type Props = {
  title: string;
  text: string;
};

export function ShareButton({ title, text }: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    const payload: ShareData = { title, text, url };

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(payload);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("textarea");
        input.value = url;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sharing/copying can be cancelled by the user. Keep the existing UI unchanged.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="btn btn-ghost mt-2 w-full"
      aria-label={copied ? "Listing link copied" : "Share this listing"}
    >
      <Share2 className="h-4 w-4" aria-hidden />
      {copied ? "Link copied" : "Share this ad"}
    </button>
  );
}
