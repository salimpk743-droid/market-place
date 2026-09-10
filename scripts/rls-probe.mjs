#!/usr/bin/env node
/**
 * Read-only-ish RLS probe using only the publishable/anon key.
 * Never prints contact numbers or row contents.
 */
const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function redact(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const copy = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (/phone|contact|token|key|secret|password/i.test(k)) copy[k] = "[redacted]";
    else copy[k] = v;
  }
  return copy;
}

if (!url || !anon) {
  console.log(
    JSON.stringify(
      {
        configured: false,
        applied: false,
        note: "Publishable URL and anon key are not set. Schema, RLS, storage, and listing CRUD were not tested against a live project.",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const headers = {
  apikey: anon,
  Authorization: `Bearer ${anon}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function rest(path, init = {}) {
  const res = await fetch(`${url}${path}`, { ...init, headers: { ...headers, ...(init.headers || {}) } });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text.slice(0, 200) };
  }
  return { status: res.status, body };
}

const specRes = await fetch(`${url}/rest/v1/`, {
  headers: { ...headers, Accept: "application/openapi+json" },
});
const spec = specRes.ok ? await specRes.json() : {};
const props = spec.definitions?.listings?.properties || spec.components?.schemas?.listings?.properties || {};
const columns = Object.keys(props).sort();

const publicSelect = await rest(
  "/rest/v1/listings?select=id,category,brand,model,price_pkr,status,seller_id,contact_phone&status=eq.active&limit=3",
);
const leakedPhone =
  Array.isArray(publicSelect.body) &&
  publicSelect.body.some((row) => row && Object.prototype.hasOwnProperty.call(row, "contact_phone") && row.contact_phone);
const leakedSeller =
  Array.isArray(publicSelect.body) &&
  publicSelect.body.some((row) => row && row.seller_id);

const anonInsert = await rest("/rest/v1/listings", {
  method: "POST",
  headers: { Prefer: "return=minimal" },
  body: JSON.stringify({
    brand: "probe",
    model: "should-fail",
    price_pkr: 1000,
    city_slug: "lahore",
    status: "active",
  }),
});

const storageList = await rest("/storage/v1/bucket/listing-images");

const report = {
  configured: true,
  listings_columns: columns,
  exposes_contact_phone_in_openapi: Object.prototype.hasOwnProperty.call(props, "contact_phone"),
  public_select_status: publicSelect.status,
  public_select_leaked_contact_phone: Boolean(leakedPhone),
  public_select_leaked_seller_id: Boolean(leakedSeller),
  anon_insert_status: anonInsert.status,
  anon_insert_rejected: anonInsert.status >= 400,
  listing_images_bucket: storageList.status,
  errors: [],
};

if (report.exposes_contact_phone_in_openapi) report.errors.push("OpenAPI still advertises contact_phone.");
if (report.public_select_leaked_contact_phone) report.errors.push("Public select returned contact_phone.");
if (!report.anon_insert_rejected) report.errors.push("Anonymous insert was not rejected.");

console.log(JSON.stringify(redact(report), null, 2));
process.exit(report.errors.length ? 1 : 0);
