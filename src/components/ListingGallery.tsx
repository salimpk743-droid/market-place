"use client";

import { useState } from "react";

export function ListingGallery({
  images,
  title,
  sold,
}: {
  images: { id: string; url?: string; public_url?: string }[];
  title: string;
  sold?: boolean;
}) {
  const [i, setI] = useState(0);
  const srcOf = (img?: { url?: string; public_url?: string }) => img?.url || img?.public_url;
  const current = srcOf(images[i]);
  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-line bg-surface">
        {current ? (
          <img
            src={current}
            alt={title}
            className={`aspect-[4/3] w-full object-cover outline outline-1 -outline-offset-1 outline-black/10 ${sold ? "opacity-50" : ""}`}
          />
        ) : (
          <div className="grid aspect-[4/3] place-items-center text-sm text-muted">No photo</div>
        )}
        {sold ? (
          <div className="absolute inset-0 grid place-items-center">
            <span className="rounded-md bg-ink px-5 py-1.5 text-sm font-semibold tracking-[0.2em] text-white">SOLD</span>
          </div>
        ) : null}
      </div>
      {images.length > 1 ? (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((im, idx) => (
            <li key={im.id}>
              <button
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Photo ${idx + 1}`}
                aria-current={idx === i}
                className={`overflow-hidden rounded-md border ${idx === i ? "border-brand ring-1 ring-brand" : "border-line"}`}
              >
                <img src={srcOf(im)} alt="" className="h-16 w-full object-cover sm:h-20" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
