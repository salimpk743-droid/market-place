#!/usr/bin/env node
/**
 * Read-only: print public.listings column names from PostgREST OpenAPI.
 * Never prints row data or contact numbers.
 *
 * Uses NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY only.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!url || !anon) {
  console.log(
    JSON.stringify(
      {
        configured: false,
        listings_columns: null,
        note: "Publishable URL and anon key are not set. No live schema probe was run.",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/`, {
  headers: {
    apikey: anon,
    Authorization: `Bearer ${anon}`,
    Accept: "application/openapi+json",
  },
});

if (!res.ok) {
  console.error("Could not read OpenAPI from Supabase:", res.status);
  process.exit(1);
}

const spec = await res.json();
const props = spec.definitions?.listings?.properties || spec.components?.schemas?.listings?.properties || {};
const columns = Object.keys(props).sort();
console.log(
  JSON.stringify(
    {
      configured: true,
      listings_columns: columns,
      exposes_contact_phone: Object.prototype.hasOwnProperty.call(props, "contact_phone"),
    },
    null,
    2,
  ),
);
