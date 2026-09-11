"use client";

import { useEffect, useState } from "react";

export function ListingPhoto({
  src,
  alt,
  className = "",
  ratio = "aspect-[4/3]",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  ratio?: string;
}) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-[#e8edf4] ${ratio}`}>
      {!failed && src ? (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover ${className}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center px-3 text-center"
          role="img"
          aria-label={alt ? `${alt}, no photo available` : "No photo available"}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">No photo available</span>
        </div>
      )}
    </div>
  );
}
