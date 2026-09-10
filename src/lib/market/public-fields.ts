import { PUBLIC_LISTING_COLUMNS, type PublicListing } from "./types";

const PUBLIC_SET = new Set<string>(PUBLIC_LISTING_COLUMNS);

export function stripPrivateFields<T extends Record<string, unknown>>(row: T): PublicListing {
  const out: Record<string, unknown> = {};
  for (const key of PUBLIC_LISTING_COLUMNS) {
    if (key in row) out[key] = row[key];
  }
  delete (out as { contact_phone?: unknown }).contact_phone;
  delete (out as { seller_id?: unknown }).seller_id;
  if (!out.category) out.category = "phone";
  return out as PublicListing;
}

function walkPrivateKeys(payload: unknown, keys: string[], label: string) {
  if (!payload || typeof payload !== "object") return;
  if (Array.isArray(payload)) {
    payload.forEach((item) => walkPrivateKeys(item, keys, label));
    return;
  }
  const rec = payload as Record<string, unknown>;
  for (const key of keys) {
    if (key in rec) {
      throw new Error(`${label} leaked into a public payload`);
    }
  }
  for (const value of Object.values(rec)) {
    if (value && typeof value === "object") walkPrivateKeys(value, keys, label);
  }
}

export function assertNoContactPhone(payload: unknown) {
  walkPrivateKeys(payload, ["contact_phone", "contactPhone"], "contact_phone");
}

export function assertNoPrivateListingFields(payload: unknown) {
  assertNoContactPhone(payload);
  walkPrivateKeys(payload, ["seller_id", "sellerId"], "seller_id");
}

export function isPublicColumn(name: string) {
  return PUBLIC_SET.has(name);
}
