"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function PreviewHostBridge() {
  const router = useRouter();
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "preview-navigate" && typeof data.path === "string") {
        router.push(data.path);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);
  return null;
}
