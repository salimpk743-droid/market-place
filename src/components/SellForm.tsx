"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORIES,
  CITIES,
  CONDITIONS,
  OTHER_BRAND,
  OTHER_MODEL_VALUE,
  PTA,
  RAM_OPTIONS,
  STORAGE_OPTIONS,
  getCategory,
  getCity,
  isPhoneCategory,
  modelsForCategory,
  sellBrandsForCategory,
} from "@/lib/market/catalog";
import { MAX_PHOTOS, MIN_PHONE_PRICE, MIN_PRICE, findDuplicateListing, parseListingForm, safeImageFilename, slugify } from "@/lib/market/validation";
import {
  DRAFT_STATUS,
  PHOTO_CONCURRENCY,
  PHOTO_MESSAGES,
  SELL_PREFS_KEY,
  createSubmitLock,
  createTaskQueue,
  parseSellPrefs,
  precheckPhoto,
  priceHint,
  publishAd,
  publishFailureMessage,
  type PriceRef,
} from "@/lib/market/post-ad";
import { getSupabasePublicConfig } from "@/lib/supabase/env";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { PublicListing } from "@/lib/market/types";
import { FieldError } from "@/components/ui";
import { formatPkr } from "@/lib/market/format";

type PhotoStatus = "preparing" | "uploading" | "ready" | "failed";
type Photo = {
  key: string;
  name: string;
  preview: string;
  status: PhotoStatus;
  progress: number;
  path?: string;
  error?: string;
  /** Already saved on the ad (edit mode). */
  saved?: boolean;
  file?: File;
  blob?: Blob;
};

const MAX_EDGE = 1200;
const TARGET_BYTES = 350_000;

async function decodeImage(source: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(source, { imageOrientation: "from-image" });
  } catch {
    return await createImageBitmap(source);
  }
}

/** Shrink to max 1200px JPEG around 350 KB. HEIC/HEIF is converted first (heic2any loads only when needed). */
async function preparePhoto(file: File, heic: boolean): Promise<Blob> {
  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await decodeImage(file); // Safari and some Android browsers open HEIC natively
  } catch {
    if (!heic) throw new Error(PHOTO_MESSAGES.readFailed);
  }
  if (!bitmap) {
    try {
      const { default: heic2any } = await import("heic2any");
      const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.85 });
      bitmap = await decodeImage(Array.isArray(out) ? out[0] : out);
    } catch {
      throw new Error(PHOTO_MESSAGES.heicFailed);
    }
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error(PHOTO_MESSAGES.readFailed);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  let quality = 0.78;
  let blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  while (blob && blob.size > TARGET_BYTES && quality > 0.45) {
    quality -= 0.08;
    blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  }
  if (!blob) throw new Error(PHOTO_MESSAGES.readFailed);
  return blob;
}

/** Direct upload to Supabase Storage (same endpoint supabase-js uses) so we can show upload progress. */
function uploadWithProgress(path: string, blob: Blob, accessToken: string, onProgress: (pct: number) => void) {
  const { url, anonKey } = getSupabasePublicConfig();
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${url}/storage/v1/object/listing-images/${path}`);
    xhr.setRequestHeader("authorization", `Bearer ${accessToken}`);
    xhr.setRequestHeader("apikey", anonKey);
    xhr.setRequestHeader("content-type", "image/jpeg");
    xhr.setRequestHeader("cache-control", "max-age=3600");
    xhr.setRequestHeader("x-upsert", "false");
    xhr.timeout = 90_000;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`HTTP ${xhr.status} ${xhr.responseText.slice(0, 120)}`)));
    xhr.onerror = () => reject(new Error("network error"));
    xhr.ontimeout = () => reject(new Error("timeout"));
    xhr.send(blob);
  });
}

async function ingestPublishedPhoto(listingId: string, path: string, accessToken?: string) {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await fetch("/api/listing-media/ingest", { method: "POST", headers, body: JSON.stringify({ listingId, path }) });
  if (!res.ok) throw new Error(`ingest HTTP ${res.status}`);
}

/** Send a posting step failure to the server log. Never throws, never blocks. */
function logStep(step: string, listingId: string, message: string, detail = "") {
  try {
    void fetch("/api/listing-events", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step, listingId, message: message.slice(0, 300), detail: detail.slice(0, 200) }),
    }).catch(() => {});
  } catch {
    // logging must never break posting
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

function Req() {
  return (
    <span className="ml-0.5 text-danger" aria-hidden="true">
      *
    </span>
  );
}

function Chips({
  name,
  value,
  options,
  onChange,
  invalid,
}: {
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  return (
    <div role="radiogroup" aria-invalid={invalid || undefined} className="flex flex-wrap gap-2">
      {options.map((o, i) => {
        const on = value === o.value;
        return (
          <label
            key={o.value}
            className={`inline-flex min-h-12 min-w-[4.5rem] cursor-pointer items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors ${
              on ? "border-brand bg-brand text-white" : invalid ? "border-danger/60 bg-surface text-ink" : "border-line bg-surface text-ink hover:border-brand/40"
            }`}
          >
            <input
              type="radio"
              id={i === 0 ? name : undefined}
              name={name}
              value={o.value}
              checked={on}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        );
      })}
    </div>
  );
}

const FIELD_ORDER = ["category", "brand", "model", "condition", "pta", "photos", "price", "city", "area", "sellerName", "contactPhone", "storage", "ram", "battery", "year", "description"];

export function SellForm({
  existing,
  contactPhone = "",
  existingPhotos = [],
  priceRefs = {},
}: {
  existing?: PublicListing | null;
  contactPhone?: string;
  existingPhotos?: { path: string; url: string }[];
  priceRefs?: Record<string, PriceRef>;
}) {
  const router = useRouter();
  const isEdit = Boolean(existing);
  const isDraft = existing?.status === DRAFT_STATUS;
  const formRef = useRef<HTMLFormElement>(null);
  const lockRef = useRef(createSubmitLock());
  /** One ad id for this form session: reused on every retry so a retry never makes a second ad. */
  const adIdRef = useRef<string>(existing?.id ? String(existing.id) : "");
  const recordedRef = useRef<string[]>([]);
  const supabaseRef = useRef<ReturnType<typeof createBrowserSupabase> | undefined>(undefined);

  const initialCategory = existing?.category || "phone";
  const initialModels = modelsForCategory(initialCategory, existing?.brand || "");
  const existingModelKnown = Boolean(existing?.model && initialModels.includes(existing.model));

  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState(existing?.brand || "");
  const [modelChoice, setModelChoice] = useState(existing?.model ? (existingModelKnown || !initialModels.length ? existing.model : OTHER_MODEL_VALUE) : "");
  const [modelText, setModelText] = useState(existing?.model && !existingModelKnown ? existing.model : "");
  const [city, setCity] = useState(existing?.city_slug || "");
  const [area, setArea] = useState(existing?.area || "");
  const [price, setPrice] = useState(existing?.price_pkr ? String(existing.price_pkr) : "");
  const [pta, setPta] = useState(existing?.pta_status && existing.pta_status !== "n/a" ? existing.pta_status : "official");
  const [condition, setCondition] = useState(existing?.condition || "");
  const [sellerName, setSellerName] = useState(existing?.seller_name || "");
  const [phoneNo, setPhoneNo] = useState(contactPhone);
  const [prefilled, setPrefilled] = useState(false);

  const [error, setError] = useState("");
  const [link, setLink] = useState<{ href: string; label: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("");
  const [photos, setPhotos] = useState<Photo[]>(() =>
    existingPhotos.map((p, i) => ({ key: `saved-${i}`, name: `Photo ${i + 1}`, preview: p.url, status: "ready" as const, progress: 100, path: p.path, saved: true })),
  );
  const photosRef = useRef(photos);

  const phone = isPhoneCategory(category);
  const cat = getCategory(category);
  const brandOptions = sellBrandsForCategory(category);
  const models = brand && brand !== OTHER_BRAND.name ? modelsForCategory(category, brand) : [];
  const useModelSelect = phone && (models.length > 0 || !brand);
  const model = useModelSelect ? (modelChoice === OTHER_MODEL_VALUE ? modelText : modelChoice) : modelText;
  const areas = useMemo(() => getCity(city)?.areas || [], [city]);
  const cityName = getCity(city)?.name;
  const minPrice = phone ? MIN_PHONE_PRICE : MIN_PRICE;
  const readyCount = photos.filter((p) => p.status === "ready").length;
  const workingCount = photos.filter((p) => p.status === "preparing" || p.status === "uploading").length;
  const hint = phone && brand && model ? priceHint(Number(price), priceRefs[`${brand}|${model}`.toLowerCase()], condition === "Box pack") : null;

  function getClient() {
    if (supabaseRef.current === undefined) supabaseRef.current = createBrowserSupabase();
    return supabaseRef.current;
  }

  function newAdId() {
    if (!adIdRef.current) adIdRef.current = crypto.randomUUID();
    return adIdRef.current;
  }

  // Autofill city, area, name and phone from this seller's last successful post (stored on this phone only).
  // When editing, only empty contact fields are filled.
  useEffect(() => {
    let prefs;
    try {
      prefs = parseSellPrefs(window.localStorage.getItem(SELL_PREFS_KEY));
    } catch {
      return;
    }
    let used = false;
    if (!isEdit && prefs.city && getCity(prefs.city)) {
      setCity((c) => c || prefs.city!);
      if (prefs.area && getCity(prefs.city)?.areas.includes(prefs.area)) setArea((a) => a || prefs.area!);
      used = true;
    }
    if (prefs.sellerName) {
      setSellerName((v) => v || prefs.sellerName!);
      used = true;
    }
    if (prefs.contactPhone) {
      setPhoneNo((v) => v || prefs.contactPhone!);
      used = true;
    }
    if (used && !isEdit) setPrefilled(true);
  }, [isEdit]);

  // Free thumbnail memory when the form goes away.
  useEffect(
    () => () => {
      for (const p of photosRef.current) if (p.preview.startsWith("blob:")) URL.revokeObjectURL(p.preview);
    },
    [],
  );

  // Warn before leaving while photos are still uploading or the ad is being saved.
  useEffect(() => {
    if (!busy && !workingCount) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [busy, workingCount]);

  /** photosRef is the source of truth (updated synchronously, so parallel uploads never lose an update). */
  function patchPhoto(key: string, patch: Partial<Photo>) {
    const next = photosRef.current.map((p) => (p.key === key ? { ...p, ...patch } : p));
    photosRef.current = next;
    setPhotos(next);
  }

  const queueRef = useRef<ReturnType<typeof createTaskQueue<string>> | null>(null);
  function queue() {
    if (!queueRef.current) queueRef.current = createTaskQueue<string>(PHOTO_CONCURRENCY, processPhoto);
    return queueRef.current;
  }

  async function processPhoto(key: string) {
    const photo = photosRef.current.find((p) => p.key === key);
    if (!photo || photo.saved) return;
    const listingId = newAdId();
    let stage = "photo-prepare";
    try {
      let blob = photo.blob;
      if (!blob) {
        if (!photo.file) throw new Error(PHOTO_MESSAGES.readFailed);
        const check = precheckPhoto(photo.file);
        if (check.kind === "reject") throw new Error(check.message);
        patchPhoto(key, { status: "preparing", progress: 0, error: undefined });
        blob = await preparePhoto(photo.file, check.kind === "heic");
        const preview = URL.createObjectURL(blob);
        if (photo.preview.startsWith("blob:")) URL.revokeObjectURL(photo.preview);
        patchPhoto(key, { blob, preview });
      }
      stage = "photo-upload";
      const supabase = getClient();
      if (!supabase) throw new Error("not configured");
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session?.user) throw new Error("Please sign in again, then tap Retry.");
      if (!photosRef.current.some((p) => p.key === key)) return; // removed while preparing
      const path = photo.path || `${session.user.id}/${listingId}/${safeImageFilename("photo.jpg")}`;
      patchPhoto(key, { status: "uploading", progress: 1, path, error: undefined });
      await uploadWithProgress(path, blob, session.access_token, (pct) => patchPhoto(key, { progress: pct }));
      patchPhoto(key, { status: "ready", progress: 100 });
      setFieldErrors((fe) => (fe.photos ? { ...fe, photos: "" } : fe));
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err);
      const friendly = Object.values(PHOTO_MESSAGES).includes(raw as never) || raw.startsWith("Please") ? raw : PHOTO_MESSAGES.uploadFailed;
      // A duplicate object name means this exact upload already landed (retry after a lost reply).
      if (stage === "photo-upload" && /HTTP (409|400).*(exists|Duplicate)/i.test(raw)) {
        patchPhoto(key, { status: "ready", progress: 100 });
        return;
      }
      patchPhoto(key, { status: "failed", error: friendly });
      logStep(stage, listingId, raw, `${photo.file?.type || ""} ${photo.file?.size || 0}`);
    }
  }

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const room = MAX_PHOTOS - photosRef.current.length;
    const picked = Array.from(list).slice(0, Math.max(0, room));
    const added: Photo[] = picked.map((file, i) => {
      const check = precheckPhoto(file);
      const key = `p-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`;
      const preview = check.kind === "direct" ? URL.createObjectURL(file) : "";
      return check.kind === "reject"
        ? { key, name: file.name, preview, status: "failed", progress: 0, error: check.message }
        : { key, name: file.name, preview, status: "preparing", progress: 0, file };
    });
    const next = [...photosRef.current, ...added];
    photosRef.current = next;
    setPhotos(next);
    for (const p of added) if (p.status !== "failed") queue().add(p.key);
    if (list.length > picked.length) setFieldErrors((fe) => ({ ...fe, photos: `You can add up to ${MAX_PHOTOS} photos.` }));
    else setFieldErrors((fe) => (fe.photos ? { ...fe, photos: "" } : fe));
  }

  function retryPhoto(key: string) {
    const p = photosRef.current.find((x) => x.key === key);
    if (!p || !p.blob) return; // only uploads are retried; a photo that cannot be opened will not open on retry
    patchPhoto(key, { status: "uploading", progress: 0, error: undefined });
    queue().add(key);
  }

  function removePhoto(key: string) {
    const p = photosRef.current.find((x) => x.key === key);
    if (!p || p.saved) return;
    if (p.preview.startsWith("blob:")) URL.revokeObjectURL(p.preview);
    const next = photosRef.current.filter((x) => x.key !== key);
    photosRef.current = next;
    setPhotos(next);
  }

  function changeCategory(next: string) {
    setCategory(next);
    if (!sellBrandsForCategory(next).some((b) => b.name === brand)) setBrand("");
    setModelChoice("");
    setModelText("");
  }

  function changeBrand(next: string) {
    setBrand(next);
    setModelChoice("");
    setModelText("");
    if (touched.brand) setFieldErrors((fe) => ({ ...fe, brand: "" }));
  }

  function photoError(list: Photo[]) {
    const ready = list.filter((p) => p.status === "ready").length;
    if (ready > 0) return "";
    if (isEdit && !isDraft) return "";
    return list.some((p) => p.status === "failed") ? "Your photos did not upload. Tap Retry on a photo, or add another photo." : "Please add at least 1 photo of the item.";
  }

  function currentErrors() {
    if (!formRef.current) return {};
    const errs = { ...parseListingForm(new FormData(formRef.current)).errors };
    const pe = photoError(photosRef.current);
    if (pe) errs.photos = pe;
    return errs;
  }

  /** Inline validation: check a field when the seller leaves it, and re-check fields already showing an error. */
  function onFieldBlur(e: React.FocusEvent<HTMLFormElement>) {
    const target = e.target as unknown as HTMLInputElement;
    const name = target.name === "modelChoice" || target.name === "modelText" ? "model" : target.name;
    if (!name || !FIELD_ORDER.includes(name)) return;
    const nextTouched = { ...touched, [name]: true };
    setTouched(nextTouched);
    const errs = currentErrors();
    setFieldErrors((fe) => {
      const out: Record<string, string> = {};
      for (const k of Object.keys({ ...fe, ...errs })) if (nextTouched[k] || fe[k]) out[k] = errs[k] || "";
      return out;
    });
  }

  function onFieldChange() {
    if (!Object.values(fieldErrors).some(Boolean)) return;
    window.setTimeout(() => {
      const errs = currentErrors();
      setFieldErrors((fe) => {
        const out: Record<string, string> = {};
        for (const k of Object.keys(fe)) out[k] = fe[k] ? errs[k] || "" : "";
        return out;
      });
    }, 0);
  }

  function showErrors(errs: Record<string, string>) {
    setFieldErrors(errs);
    setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) {
      const id = first === "model" ? (useModelSelect && modelChoice !== OTHER_MODEL_VALUE ? "modelChoice" : "model") : first === "photos" ? "photo" : first;
      const el = document.getElementById(id);
      el?.closest("section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => el?.focus({ preventScroll: true }), 350);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Lock on the very first tap, before any network call, so double taps cannot create two ads.
    if (!lockRef.current.tryAcquire()) return;
    setBusy(true);
    setError("");
    setLink(null);
    setStep("Checking your details…");
    let leaving = false;
    const listingId = isEdit ? String(existing!.id) : newAdId();
    try {
      const parsed = parseListingForm(new FormData(e.currentTarget));
      if (workingCount || queueRef.current?.active || queueRef.current?.waiting) {
        setStep("Finishing photo uploads…");
        await queue().onIdle();
      }
      const errs: Record<string, string> = { ...parsed.errors };
      const pe = photoError(photosRef.current);
      if (pe) errs.photos = pe;
      if (!parsed.data || Object.values(errs).some(Boolean)) {
        showErrors(errs);
        setError("Please fix the fields marked in red. Everything you typed is still here.");
        return;
      }
      const supabase = getClient();
      if (!supabase) {
        setError("Listings cannot be saved until the site is connected to the marketplace database.");
        return;
      }
      setStep("Saving your ad…");
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session?.user) {
        setError("You are signed out. Open Login in a new tab, sign in, then tap Publish again. Your details are still here.");
        setLink({ href: `/login?next=${encodeURIComponent(isEdit ? `/sell/${listingId}` : "/sell")}`, label: "Sign in" });
        logStep("auth", listingId, "no session at publish");
        return;
      }
      const uid = session.user.id;

      if (!isEdit) {
        // Same phone posted again (any area) at a similar price: point the seller to the ad they already have.
        const { data: mine, error: dupErr } = await supabase
          .from("listings")
          .select("id, category, brand, model, storage_gb, city_slug, price_pkr, status, created_at")
          .eq("seller_id", uid)
          .in("status", ["active", DRAFT_STATUS])
          .limit(200);
        if (dupErr) logStep("duplicate-check", listingId, dupErr.message);
        const dup = findDuplicateListing(parsed.data, mine || [], listingId);
        if (dup) {
          const draft = dup.status === DRAFT_STATUS;
          setError(
            draft
              ? "You started an ad for this same phone in the last 24 hours. Open it to finish it instead of posting it again."
              : "You already have a live ad for this same phone at a similar price. Open it and edit it instead of posting it again.",
          );
          setLink(draft ? { href: `/sell/${dup.id}`, label: "Finish that ad" } : { href: `/listing/${dup.id}`, label: "Open your ad" });
          return;
        }
      }

      const d = parsed.data;
      const payload = {
        category: d.category,
        brand: d.brand,
        model: d.model,
        storage_gb: d.storageGb,
        ram_gb: d.ramGb,
        price_pkr: d.pricePkr,
        city_slug: d.citySlug,
        area: d.area || null,
        pta_status: d.ptaStatus,
        battery_health: d.batteryHealth,
        condition: d.condition,
        description: d.description,
        color: d.color,
        year: d.year,
        seller_name: d.sellerName,
        contact_phone: d.contactPhone,
        slug: slugify(`${d.category} ${d.brand} ${d.model} ${d.citySlug}`),
      };
      const ready = photosRef.current.filter((p) => p.status === "ready" && p.path);
      setStep(isEdit ? "Saving changes…" : "Publishing your ad…");
      const result = await publishAd(
        {
          insertListing: async (row) => ({ error: (await supabase.from("listings").insert(row)).error }),
          updateListing: async (id, patch) => ({ error: (await supabase.from("listings").update(patch).eq("id", id)).error }),
          insertImageRow: async (row) => ({ error: (await supabase.from("listing_images").insert(row)).error }),
          ingest: (id, path) => ingestPublishedPhoto(id, path, session.access_token),
          log: (stage, message, id) => logStep(stage, id, message),
        },
        {
          listingId,
          sellerId: uid,
          payload,
          photos: ready.filter((p) => !p.saved).map((p) => ({ path: p.path! })),
          existingPaths: ready.filter((p) => p.saved).map((p) => p.path!),
          recordedPaths: recordedRef.current,
          mode: isEdit ? "edit" : "create",
          currentStatus: existing?.status || null,
        },
      );
      recordedRef.current = result.recordedPaths;
      if (!result.ok) {
        setError(publishFailureMessage(result, typeof navigator !== "undefined" && navigator.onLine === false));
        if (result.draftSaved && !isEdit) setLink({ href: `/sell/${listingId}`, label: "Open your draft" });
        return;
      }
      try {
        window.localStorage.setItem(
          SELL_PREFS_KEY,
          JSON.stringify({ city: d.citySlug, area: d.area, sellerName: d.sellerName, contactPhone: d.contactPhone }),
        );
      } catch {
        // private mode: autofill is a nice-to-have
      }
      setStep(isEdit ? "Saved. Opening your ad…" : "Published! Opening your ad…");
      leaving = true;
      router.push(`/listing/${listingId}`);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logStep(isEdit ? "save" : "create", listingId, message);
      setError(
        typeof navigator !== "undefined" && navigator.onLine === false
          ? "No internet connection. Your details are still here. Connect and tap Publish again."
          : "Something went wrong while saving. Your details are still here. Please tap Publish again.",
      );
    } finally {
      if (!leaving) {
        lockRef.current.release();
        setBusy(false);
        setStep("");
      }
    }
  }

  const err = (k: string) => fieldErrors[k] || "";
  const inv = (k: string) => (err(k) ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {});
  const errCls = (k: string) => (err(k) ? " border-danger" : "");
  const submitLabel = isEdit ? (isDraft ? "Publish ad" : "Save changes") : "Publish ad";

  return (
    <form ref={formRef} onSubmit={onSubmit} onBlur={onFieldBlur} onChange={onFieldChange} className="sell-form space-y-6" noValidate>
      <p className="text-xs text-muted">
        Fields marked <span className="text-danger">*</span> are required. Everything else is optional.
      </p>
      <Block n="01" title="What are you selling?" hint="Mobile Market is only for phones and mobile accessories.">
        <label htmlFor="category" className="label">
          Category
        </label>
        <select id="category" name="category" required value={category} onChange={(e) => changeCategory(e.target.value)} className="input max-w-md">
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <FieldError>{err("category")}</FieldError>
      </Block>

      <Block n="02" title={`${cat.short} details`} hint={phone ? "Pick the real brand and model. Not in the list? Choose Other and type it." : "Use the real brand and model so buyers can find this accessory."}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="brand" className="label">
              Brand
              <Req />
            </label>
            <select id="brand" name="brand" required value={brand} onChange={(e) => changeBrand(e.target.value)} className={`input${errCls("brand")}`} {...inv("brand")}>
              <option value="">Choose brand</option>
              {brandOptions.map((b) => (
                <option key={b.slug} value={b.name}>
                  {b.name === OTHER_BRAND.name ? "Other brand" : b.name}
                </option>
              ))}
            </select>
            <span id="brand-error">
              <FieldError>{err("brand")}</FieldError>
            </span>
          </div>
          <div>
            <label htmlFor={useModelSelect && modelChoice !== OTHER_MODEL_VALUE ? "modelChoice" : "model"} className="label">
              {phone ? "Model" : "Model / item"}
              <Req />
            </label>
            {useModelSelect ? (
              <>
                <select
                  id="modelChoice"
                  name="modelChoice"
                  value={modelChoice}
                  onChange={(e) => setModelChoice(e.target.value)}
                  disabled={!brand}
                  className={`input${errCls("model")}`}
                  {...(modelChoice !== OTHER_MODEL_VALUE ? inv("model") : {})}
                >
                  <option value="">{brand ? "Choose model" : "Choose brand first"}</option>
                  {models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  {brand ? <option value={OTHER_MODEL_VALUE}>Other model (type it)</option> : null}
                </select>
                {modelChoice === OTHER_MODEL_VALUE ? (
                  <input
                    id="model"
                    name="modelText"
                    value={modelText}
                    onChange={(e) => setModelText(e.target.value)}
                    placeholder={`Type the ${brand} model`}
                    autoComplete="off"
                    className={`input mt-2${errCls("model")}`}
                    {...inv("model")}
                  />
                ) : null}
                <input type="hidden" name="model" value={model} />
              </>
            ) : (
              <>
                <input
                  id="model"
                  name="model"
                  required
                  list={models.length ? "model-suggestions" : undefined}
                  value={modelText}
                  onChange={(e) => setModelText(e.target.value)}
                  placeholder={phone ? (brand && brand !== OTHER_BRAND.name ? `e.g. ${brand} model name` : "e.g. Honor X9b") : "e.g. AirPods Pro 2, 20000mAh, iPhone 13 case"}
                  autoComplete="off"
                  className={`input${errCls("model")}`}
                  {...inv("model")}
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
            <span id="model-error">
              <FieldError>{err("model")}</FieldError>
            </span>
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
                  <option value="">Not sure / skip</option>
                  {RAM_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} GB
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : null}
        </div>
      </Block>

      <Block n="03" title="Condition" hint={phone ? "PTA status is your declaration, not a Mobile Market certificate." : "Describe wear honestly. Original vs copy must be clear in the description."}>
        <p className="label" id="condition-label">
          Condition
          <Req />
        </p>
        <Chips name="condition" value={condition} options={CONDITIONS.map((c) => ({ value: c, label: c }))} onChange={setCondition} invalid={Boolean(err("condition"))} />
        <span id="condition-error">
          <FieldError>{err("condition")}</FieldError>
        </span>
        {phone ? (
          <div className="mt-4">
            <p className="label">
              PTA status
              <Req />
            </p>
            <Chips name="pta" value={pta} options={PTA.map((p) => ({ value: p.id, label: p.short || p.label }))} onChange={setPta} invalid={Boolean(err("pta"))} />
            <FieldError>{err("pta")}</FieldError>
          </div>
        ) : (
          <input type="hidden" name="pta" value="" />
        )}
      </Block>

      <Block n="04" title="Photos" hint={`Add 1 to ${MAX_PHOTOS} real photos. Any phone photo works, including iPhone (HEIC). We make them smaller before upload.`}>
        {photos.length ? (
          <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label="Your photos">
            {photos.map((p, i) => (
              <li key={p.key} className="relative overflow-hidden rounded-md border border-line bg-page" data-photo-status={p.status}>
                <div className="aspect-square w-full">
                  {p.preview ? (
                    <img src={p.preview} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-1 text-center text-[11px] text-muted">{p.status === "failed" ? "Can't open" : "Opening…"}</div>
                  )}
                </div>
                {i === 0 && p.status === "ready" ? <span className="absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">Cover</span> : null}
                {p.status === "preparing" || p.status === "uploading" ? (
                  <div className="absolute inset-x-0 bottom-0 bg-ink/70 px-1.5 py-1 text-[11px] font-medium text-white">
                    {p.status === "preparing" ? "Preparing…" : `Uploading ${p.progress}%`}
                    <div className="mt-0.5 h-1 overflow-hidden rounded bg-white/30">
                      <div className="h-full bg-white transition-all" style={{ width: `${p.status === "preparing" ? 8 : p.progress}%` }} />
                    </div>
                  </div>
                ) : null}
                {p.status === "ready" && !p.saved ? <span className="absolute bottom-1 left-1 rounded bg-success px-1.5 py-0.5 text-[10px] font-semibold text-white">✓ Uploaded</span> : null}
                {p.status === "failed" ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white p-1 text-center">
                    <span className="text-[11px] font-medium text-danger">{p.blob ? "Upload failed" : "Can't use"}</span>
                    {p.blob ? (
                      <button type="button" onClick={() => retryPhoto(p.key)} className="min-h-9 rounded border border-brand px-2 text-xs font-semibold text-brand-ink">
                        Retry
                      </button>
                    ) : null}
                  </div>
                ) : null}
                {!p.saved ? (
                  <button
                    type="button"
                    onClick={() => removePhoto(p.key)}
                    aria-label={`Remove photo ${i + 1}`}
                    className="absolute right-0.5 top-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-base leading-none text-white"
                  >
                    ×
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
        {photos.some((p) => p.status === "failed" && p.error) ? (
          <ul className="mb-3 space-y-1 text-xs text-danger" role="alert">
            {Array.from(new Set(photos.filter((p) => p.status === "failed" && p.error).map((p) => p.error))).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        ) : null}
        {photos.length < MAX_PHOTOS ? (
          <label
            htmlFor="photo"
            className={`flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed bg-page px-4 py-6 text-center hover:border-brand/40 ${err("photos") ? "border-danger/60" : "border-line"}`}
          >
            <span className="text-base font-semibold text-ink">{photos.length ? "+ Add more photos" : "+ Add photos"}</span>
            <span className="mt-1 text-xs text-muted">
              Tap to choose from gallery or camera · {MAX_PHOTOS - photos.length} more allowed
            </span>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*,.heic,.heif"
              multiple
              className="sr-only"
              {...inv("photos")}
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        ) : null}
        <span id="photos-error">
          <FieldError>{err("photos")}</FieldError>
        </span>
        {isEdit && !isDraft && !readyCount ? <p className="mt-2 text-xs text-muted">Ads with photos get many more calls. Add at least one photo.</p> : null}
      </Block>

      <Block n="05" title="Price">
        <label htmlFor="price" className="label">
          Your price (Rs)
          <Req />
        </label>
        <input
          id="price"
          name="price"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          required
          placeholder="e.g. 45000"
          value={price}
          onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))}
          className={`input max-w-xs text-lg tabular-nums${errCls("price")}`}
          {...inv("price")}
        />
        {price && Number(price) >= minPrice ? <p className="mt-1 text-sm font-medium tabular-nums text-brand-ink">{formatPkr(Number(price))}</p> : null}
        <span id="price-error">
          <FieldError>{err("price")}</FieldError>
        </span>
        {hint ? (
          <p className="mt-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-ink" role="status">
            {hint.text}{" "}
            {hint.path ? (
              <Link href={hint.path} target="_blank" className="font-semibold text-brand-ink underline">
                See price page
              </Link>
            ) : null}{" "}
            <span className="text-muted">You can still post at this price.</span>
          </p>
        ) : null}
      </Block>

      <Block n="06" title="Location">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="label">
              City
              <Req />
            </label>
            <select
              id="city"
              name="city"
              required
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setArea("");
              }}
              className={`input${errCls("city")}`}
              {...inv("city")}
            >
              <option value="">Choose city</option>
              {CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <span id="city-error">
              <FieldError>{err("city")}</FieldError>
            </span>
          </div>
          <div>
            <label htmlFor="area" className="label">
              Area <span className="font-normal normal-case tracking-normal text-muted">(optional)</span>
            </label>
            <select id="area" name="area" value={area} onChange={(e) => setArea(e.target.value)} className={`input${errCls("area")}`} disabled={!city} {...inv("area")}>
              <option value="">{city ? "Choose area (optional)" : "Choose a city first"}</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <span id="area-error">
              <FieldError>{err("area")}</FieldError>
            </span>
          </div>
        </div>
      </Block>

      <Block n="07" title="Your contact" hint="Shown only after a buyer taps Contact seller.">
        {prefilled ? (
          <p className="mb-3 text-xs text-muted">
            Filled from your last ad on this phone.{" "}
            <button
              type="button"
              className="min-h-9 font-semibold text-brand-ink underline"
              onClick={() => {
                setCity("");
                setArea("");
                setSellerName("");
                setPhoneNo("");
                setPrefilled(false);
                try {
                  window.localStorage.removeItem(SELL_PREFS_KEY);
                } catch {
                  // ignore
                }
              }}
            >
              Clear
            </button>
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="sellerName" className="label">
              Your name
              <Req />
            </label>
            <input
              id="sellerName"
              name="sellerName"
              required
              autoComplete="name"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              className={`input${errCls("sellerName")}`}
              {...inv("sellerName")}
            />
            <span id="sellerName-error">
              <FieldError>{err("sellerName")}</FieldError>
            </span>
          </div>
          <div>
            <label htmlFor="contactPhone" className="label">
              WhatsApp / phone
              <Req />
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="0300-1234567"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className={`input${errCls("contactPhone")}`}
              {...inv("contactPhone")}
            />
            <span id="contactPhone-error">
              <FieldError>{err("contactPhone")}</FieldError>
            </span>
          </div>
        </div>
      </Block>

      <details className="rounded-md border border-line bg-page px-4 py-3" open={Boolean(existing?.description || existing?.color || existing?.battery_health || existing?.year)}>
        <summary className="min-h-10 cursor-pointer py-2 text-sm font-semibold text-ink">More details (optional): description, colour, battery, year</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={existing?.description || ""}
              className="input"
              placeholder={phone ? "Scratches, box, charger, warranty, reason for selling" : "Fits which phone, original or copy, cable included, reason for selling"}
            />
          </div>
          <div>
            <label htmlFor="color" className="label">
              Colour
            </label>
            <input id="color" name="color" defaultValue={existing?.color || ""} className="input" />
          </div>
          {phone ? (
            <>
              <div>
                <label htmlFor="battery" className="label">
                  Battery health (%)
                </label>
                <input id="battery" name="battery" type="number" inputMode="numeric" min={1} max={100} defaultValue={existing?.battery_health || ""} className={`input${errCls("battery")}`} />
                <FieldError>{err("battery")}</FieldError>
              </div>
              <div>
                <label htmlFor="year" className="label">
                  Year bought
                </label>
                <input id="year" name="year" type="number" inputMode="numeric" min={2014} max={2027} placeholder="e.g. 2023" defaultValue={existing?.year || ""} className={`input${errCls("year")}`} />
                <FieldError>{err("year")}</FieldError>
              </div>
            </>
          ) : null}
        </div>
      </details>

      <div className="rounded-md bg-page px-4 py-3 text-sm" aria-live="polite">
        <p className="text-xs uppercase tracking-wide text-muted">Preview · {cat.name}</p>
        <p className="mt-1 font-semibold text-ink">{[brand === OTHER_BRAND.name ? "" : brand, model].filter(Boolean).join(" ") || "Brand and model"}</p>
        <p className="mt-1 tabular-nums text-brand-ink">{price ? formatPkr(Number(price)) : "Price not set"}</p>
        <p className="mt-1 text-xs text-muted">
          {cityName ? (area ? `${cityName}, ${area}` : cityName) : "City not chosen"}
          {phone ? ` · ${PTA.find((p) => p.id === pta)?.label || ""}` : ""}
          {condition ? ` · ${condition}` : ""}
          {" · "}
          {readyCount} photo{readyCount === 1 ? "" : "s"}
          {workingCount ? ` (${workingCount} uploading)` : ""}
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
          <p>{error}</p>
          {link ? (
            <Link href={link.href} className="mt-2 inline-flex min-h-11 items-center font-semibold text-brand-ink underline">
              {link.label} →
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="sticky bottom-0 z-10 -mx-5 border-t border-line bg-surface/95 px-5 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-primary min-h-14 w-full text-base">
          {busy ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
              <span>{step || "Saving…"}</span>
            </>
          ) : workingCount ? (
            `${submitLabel} (photos uploading…)`
          ) : (
            submitLabel
          )}
        </button>
      </div>
      <p className="text-center text-xs text-muted">By publishing you confirm the photos are of this item and that category, city and price are accurate.</p>
    </form>
  );
}
