"use client";

import { useRef, useState } from "react";
import { ADVERTISE_EMAIL, ADVERTISE_GMAIL_URL, ADVERTISE_MAILTO } from "@/lib/market/site";

/**
 * Advertising contact: the address as selectable text plus three ways to use it.
 * "Email us" is a plain mailto link with no handlers, because a click handler or target=_blank can stop
 * the OS mail app opening. Many Windows/Chrome desktops have no default mail app, so a mailto click
 * silently does nothing there; "Open in Gmail" and "Copy email" cover that case.
 */
export function AdvertiseContact({ compact = false }: { compact?: boolean }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "selected">("idle");
  const size = compact ? " btn-compact" : "";
  // Guides wrap content in a prose-like block that underlines and recolours every <a>; keep the real button look.
  const keep = " !no-underline";

  function selectText() {
    const el = textRef.current;
    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    if (!el || !sel) return false;
    const range = document.createRange();
    range.selectNodeContents(el);
    sel.removeAllRanges();
    sel.addRange(range);
    return true;
  }

  async function copy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(ADVERTISE_EMAIL);
        setStatus("copied");
        return;
      }
    } catch {
      // fall through to selecting the text
    }
    if (selectText()) {
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      setStatus(ok ? "copied" : "selected");
    }
  }

  return (
    <div>
      <p className={compact ? "font-semibold text-ink" : "text-lg font-semibold text-ink"}>
        <span ref={textRef} className="select-all" data-testid="advertise-email">
          {ADVERTISE_EMAIL}
        </span>
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <a href={ADVERTISE_MAILTO} className={`btn btn-primary${size}${keep} !text-white`} data-testid="advertise-mailto">
          Email us
        </a>
        <a
          href={ADVERTISE_GMAIL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-ghost${size}${keep} !text-ink`}
          data-testid="advertise-gmail"
        >
          Open in Gmail
        </a>
        <button type="button" onClick={copy} className={`btn btn-ghost${size}`} data-testid="advertise-copy">
          {status === "copied" ? "Copied" : "Copy email"}
        </button>
      </div>
      <p className="mt-2 text-xs text-muted" aria-live="polite">
        {status === "copied"
          ? `Copied ${ADVERTISE_EMAIL} to your clipboard.`
          : status === "selected"
            ? "The address is selected. Press Ctrl+C (or Cmd+C) to copy it."
            : "If “Email us” does nothing, your device has no mail app set up: use Gmail or copy the address."}
      </p>
    </div>
  );
}
