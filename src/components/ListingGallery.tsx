"use client";

import { useState } from "react";
import { ListingPhoto } from "@/components/ListingPhoto";

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
        <ListingPhoto src={current} alt={title} className={sold ? "opacity-50" : ""} />
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
                aria-label={`Photo ${idx + 1} of ${title}`}
                aria-current={idx === i}
                className={`w-full overflow-hidden rounded-md border ${idx === i ? "border-brand ring-1 ring-brand" : "border-line"}`}
              >
                <ListingPhoto src={srcOf(im)} alt="" ratio="aspect-square" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
