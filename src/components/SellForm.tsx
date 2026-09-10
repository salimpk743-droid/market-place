"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORIES,
  CITIES,
  CONDITIONS,
  PTA,
  RAM_OPTIONS,
  STORAGE_OPTIONS,
  brandsForCategory,
  getCategory,
  getCity,
  isPhoneCategory,
  modelsForCategory,
} from "@/lib/market/catalog";
import { MAX_PHOTOS, MIN_PHONE_PRICE, MIN_PRICE, isAllowedImageFile, parseListingForm, safeImageFilename, slugify } from "@/lib/market/validation";
import { serializeStoragePaths, storagePathsFromStored } from "@/lib/market/media-path";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { PublicListing } from "@/lib/market/types";
import { FieldError } from "@/components/ui";
import { formatPkr } from "@/lib/market/format";

async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const max = 1200;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process that photo.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  let quality = 0.72;
  let blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  while (blob && blob.size > 350_000 && quality > 0.4) {
    quality -= 0.08;
    blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  }
  if (!blob) throw new Error("Could not compress that photo.");
  return blob;
}

async function ingestPublishedPhoto(listingId: string, path: string, accessToken?: string) {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await fetch("/api/listing-media/ingest", {
    method: "POST",
    headers,
    body: JSON.stringify({ listingId, path }),
  });
  if (!res.ok) {
    throw new Error("Photo uploaded but could not be published for buyers.");
  }
}

function Block({ n, title, hint, children }: { n: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line pb-6 last:border-b-0 last:pb-0">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{n}</p>
        <h2 className="mt-0.5 text-base font-semibold text-ink">{title}</h2>
        {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function SellForm({ existing, contactPhone = "" }: { existing?: PublicListing | null; contactPhone?: string }) {
  const router = useRouter();
  const [category, setCategory] = useState(existing?.category || "phone");
  const brandOptions = brandsForCategory(category);
  const [brand, setBrand] = useState(existing?.brand || brandOptions[0]?.name || "");
  const [model, setModel] = useState(existing?.model || "");
  const [city, setCity] = useState(existing?.city_slug || "");
  const [price, setPrice] = useState(existing?.price_pkr ? String(existing.price_pkr) : "");
  const [pta, setPta] = useState(existing?.pta_status && existing.pta_status !== "n/a" ? existing.pta_status : "official");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const phone = isPhoneCategory(category);
  const cat = getCategory(category);
  const models = modelsForCategory(category, brand);
  const areas = useMemo(() => getCity(city)?.areas || [], [city]);
  const cityName = getCity(city)?.name;
  const minPrice = phone ? MIN_PHONE_PRICE : MIN_PRICE;

  function changeCategory(next: string) {
    setCategory(next);
    const options = brandsForCategory(next);
    if (!options.some((b) => b.name === brand)) setBrand(options[0]?.name || "");
    if (isPhoneCategory(next)) setModel("");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const parsed = parseListingForm(form);
    if (!parsed.data) {
      setFieldErrors(parsed.errors);
      setError("Please fix the highlighted fields.");
      return;
    }
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setError("Listings cannot be saved until the site is connected to the marketplace database.");
      return;
    }
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      router.push("/login?next=/sell");
      return;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    setBusy(true);
    try {
      const slug = slugify(`${parsed.data.category} ${parsed.data.brand} ${parsed.data.model} ${parsed.data.citySlug}`);
      const payload = {
        category: parsed.data.category,
        brand: parsed.data.brand,
        model: parsed.data.model,
        storage_gb: parsed.data.storageGb,
        ram_gb: parsed.data.ramGb,
        price_pkr: parsed.data.pricePkr,
        city_slug: parsed.data.citySlug,
        area: parsed.data.area,
        pta_status: parsed.data.ptaStatus,
        battery_health: parsed.data.batteryHealth,
        condition: parsed.data.condition,
        description: parsed.data.description,
        color: parsed.data.color,
        year: parsed.data.year,
        seller_name: parsed.data.sellerName,
        contact_phone: parsed.data.contactPhone,
        slug,
      };

      let listingId = existing?.id;
      if (existing) {
        const { error: upd } = await supabase.from("listings").update(payload).eq("id", existing.id);
        if (upd) throw upd;
      } else {
        const { data, error: ins } = await supabase
          .from("listings")
          .insert({ ...payload, id: crypto.randomUUID(), status: "active", seller_id: auth.user.id })
          .select("id")
          .single();
        if (ins) throw ins;
        listingId = String(data.id);
      }
      if (!listingId) throw new Error("Listing was not created.");

      if (files.length) {
        const storedPaths = storagePathsFromStored(existing?.image_url);
        for (let i = 0; i < Math.min(files.length, MAX_PHOTOS); i++) {
          const file = files[i];
          const bad = isAllowedImageFile(file);
          if (bad) throw new Error(bad);
          const blob = await compressImage(file);
          const filename = safeImageFilename(file.name.endsWith(".png") ? "x.jpg" : file.name);
          const path = `${auth.user.id}/${listingId}/${filename}`;
          const { error: up } = await supabase.storage.from("listing-images").upload(path, blob, {
            contentType: "image/jpeg",
            upsert: false,
          });
          if (up) throw up;
          storedPaths.push(path);
          const { error: imgErr } = await supabase.from("listing_images").insert({
            listing_id: listingId,
            seller_id: auth.user.id,
            storage_path: path,
            public_url: path,
            sort_order: storedPaths.length - 1,
          });
          if (imgErr) throw imgErr;
          await ingestPublishedPhoto(listingId, path, accessToken);
        }
        const imageValue = serializeStoragePaths(storedPaths);
        if (imageValue) {
          const { error: coverErr } = await supabase.from("listings").update({ image_url: imageValue }).eq("id", listingId);
          if (coverErr) throw coverErr;
        }
      }
      router.push(`/listing/${listingId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this listing.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Block n="01" title="What are you selling?" hint="Mobile Market is only for phones and mobile accessories.">
        <label htmlFor="category" className="label">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          value={category}
          onChange={(e) => changeCategory(e.target.value)}
          className="input max-w-md"
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <FieldError>{fieldErrors.category}</FieldError>
      </Block>

      <Block
        n="02"
        title={`${cat.short} details`}
        hint={phone ? "Use the real model. Buyers filter by brand and storage." : "Use the real brand and model so buyers can find this accessory."}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="brand" className="label">
              Brand
            </label>
            <select id="brand" name="brand" required value={brand} onChange={(e) => setBrand(e.target.value)} className="input">
              {brandOptions.map((b) => (
                <option key={b.slug}>{b.name}</option>
              ))}
            </select>
            <FieldError>{fieldErrors.brand}</FieldError>
          </div>
          <div>
            <label htmlFor="model" className="label">
              {phone ? "Model" : "Model / item"}
            </label>
            {phone && models.length ? (
              <select
                id="model"
                name="model"
                required
                value={model || models[0]}
                onChange={(e) => setModel(e.target.value)}
                className="input"
              >
                {models.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            ) : (
              <>
                <input
                  id="model"
                  name="model"
                  required
                  list="model-suggestions"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder={phone ? "e.g. iPhone 13 Pro" : "e.g. AirPods Pro 2, 20000mAh, iPhone 13 case"}
                  className="input"
                />
                {models.length ? (
                  <datalist id="model-suggestions">
                    {models.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                ) : null}
              </>
            )}
            <FieldError>{fieldErrors.model}</FieldError>
          </div>
          {phone ? (
            <>
              <div>
                <label htmlFor="storage" className="label">
                  Storage
                </label>
                <select id="storage" name="storage" defaultValue={existing?.storage_gb || 128} className="input">
                  {STORAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} GB
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ram" className="label">
                  RAM
                </label>
                <select id="ram" name="ram" defaultValue={existing?.ram_gb || ""} className="input">
                  <option value="">Optional</option>
                  {RAM_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} GB
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : null}
          <div>
            <label htmlFor="color" className="label">
              Color
            </label>
            <input id="color" name="color" defaultValue={existing?.color || ""} className="input" />
          </div>
          {phone ? (
            <div>
              <label htmlFor="year" className="label">
                Year
              </label>
              <input id="year" name="year" type="number" min={2014} max={2027} defaultValue={existing?.year || 2024} className="input" />
            </div>
          ) : null}
        </div>
      </Block>

      <Block
        n="03"
        title="Condition"
        hint={phone ? "PTA status is your declaration, not a Mobile Market certificate." : "Describe wear honestly. Original vs copy must be clear in the description."}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {phone ? (
            <div>
              <label htmlFor="pta" className="label">
                PTA status
              </label>
              <select id="pta" name="pta" value={pta} onChange={(e) => setPta(e.target.value)} className="input">
                {PTA.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <input type="hidden" name="pta" value="" />
          )}
          <div>
            <label htmlFor="condition" className="label">
              Condition
            </label>
            <select id="condition" name="condition" defaultValue={existing?.condition || "9/10"} className="input">
              {CONDITIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          {phone ? (
            <div>
              <label htmlFor="battery" className="label">
                Battery health (%)
              </label>
              <input id="battery" name="battery" type="number" min={1} max={100} defaultValue={existing?.battery_health || ""} className="input" />
            </div>
          ) : null}
        </div>
        <div className="mt-3">
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={existing?.description || ""}
            className="input"
            placeholder={phone ? "Scratches, box, accessories, reason for selling" : "Fits which phone, original or copy, cable included, reason for selling"}
          />
        </div>
      </Block>

      <Block n="04" title="Location">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="label">
              City
            </label>
            <select id="city" name="city" required value={city} onChange={(e) => setCity(e.target.value)} className="input">
              <option value="">Select city</option>
              {CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <FieldError>{fieldErrors.city}</FieldError>
          </div>
          <div>
            <label htmlFor="area" className="label">
              Area
            </label>
            <select id="area" name="area" required defaultValue={existing?.area || ""} className="input" disabled={!city}>
              <option value="">{city ? "Select area" : "Pick a city first"}</option>
              {areas.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <FieldError>{fieldErrors.area}</FieldError>
          </div>
        </div>
      </Block>

      <Block n="05" title="Photos" hint={`Up to ${MAX_PHOTOS} photos of the actual item. JPG, PNG or WebP, under 5 MB each.`}>
        <label
          htmlFor="photo"
          className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-line bg-page px-4 py-8 text-center hover:border-brand/40"
        >
          <span className="text-sm font-medium text-ink">Add photos of the actual item</span>
          <span className="mt-1 text-xs text-muted">Tap to choose files · compressed on this device before upload</span>
          <input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, MAX_PHOTOS))}
          />
        </label>
        {files.length ? (
          <p className="mt-2 text-xs text-muted">
            {files.length} photo{files.length === 1 ? "" : "s"} selected
          </p>
        ) : null}
      </Block>

      <Block n="06" title="Price">
        <label htmlFor="price" className="label">
          Demand price (PKR)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          required
          min={minPrice}
          max={10000000}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input max-w-xs"
        />
        <FieldError>{fieldErrors.price}</FieldError>
      </Block>

      <Block n="07" title="Seller information" hint="Shown only after a buyer taps Contact seller. It is not a login.">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="sellerName" className="label">
              Your name
            </label>
            <input id="sellerName" name="sellerName" required defaultValue={existing?.seller_name || ""} className="input" />
            <FieldError>{fieldErrors.sellerName}</FieldError>
          </div>
          <div>
            <label htmlFor="contactPhone" className="label">
              WhatsApp / phone
            </label>
            <input id="contactPhone" name="contactPhone" type="tel" required placeholder="03xx-xxxxxxx" defaultValue={contactPhone} className="input" />
            <FieldError>{fieldErrors.contactPhone}</FieldError>
          </div>
        </div>
      </Block>

      <Block n="08" title="Preview">
        <div className="rounded-md bg-page px-4 py-3 text-sm">
          <p className="text-xs uppercase tracking-wide text-muted">{cat.name}</p>
          <p className="mt-1 font-semibold text-ink">
            {brand} {model || (phone ? models[0] : "") || ""}
          </p>
          <p className="mt-1 tabular-nums text-brand-ink">{price ? formatPkr(Number(price)) : "Price not set"}</p>
          <p className="mt-1 text-xs text-muted">
            {cityName || "City not selected"}
            {phone ? ` · ${PTA.find((p) => p.id === pta)?.label || ""}` : ""}
            {" · "}
            {files.length} photo{files.length === 1 ? "" : "s"}
          </p>
        </div>
      </Block>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={busy} className="btn btn-primary w-full">
        {busy ? "Saving…" : existing ? "Save changes" : "Publish listing"}
      </button>
      <p className="text-center text-xs text-muted">
        By publishing you confirm the photos are of this item and that category, city and price are accurate.
      </p>
    </form>
  );
}
