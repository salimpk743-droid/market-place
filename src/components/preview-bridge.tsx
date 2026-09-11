"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { safeInternalPath } from "@/lib/market/site";

function allowedPreviewOrigin(origin: string) {
  try {
    const host = new URL(origin).hostname;
    return (
      host === window.location.hostname ||
      host === "grok.com" ||
      host.endsWith(".grok.com") ||
      host === "x.com" ||
      host.endsWith(".x.com")
    );
  } catch {
    return false;
  }
}

export function PreviewHostBridge() {
  const router = useRouter();
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (!allowedPreviewOrigin(event.origin)) return;
      if (data.type === "preview-navigate" && typeof data.path === "string" && data.path.startsWith("/")) {
        router.push(safeInternalPath(data.path, "/"));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);
  return null;
}
