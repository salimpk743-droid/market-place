/**
 * Listings removed by the site owner (2 Oct 2026) that the database still marks active:
 * re-posted duplicates (the oldest listing with photos in each group is kept) and
 * implausible / off-topic ads. Remove an ID here only after its row is changed in the DB.
 *
 * Every public read path excludes these IDs: listing detail and API (404), browse,
 * model, city and brand lists, counts, related listings, structured data, sitemap, media
 * and contact reveal.
 */
export const REMOVED_LISTING_IDS: readonly string[] = [
  // Nothing Phone (1) 128GB, Lahore (kept: 6c07428b-ff8f-4a2b-bd43-464c28c155a1)
  "a85efae9-a557-43de-8820-7837681f06b6",
  "52b7cb8a-af4c-4702-b881-9dfefad05f36",
  "6bd8999f-d2ab-4058-9746-4285274b4796",
  // Oppo A78, Islamabad (kept: 7b73196b-c73d-4478-9944-69a5d0415348)
  "e83cc220-9a3c-4214-b104-7bb0953af20c",
  "09fcb9c5-13b9-43ed-bfe7-331105330b0a",
  // Nothing Phone (1) 256GB, Mardan (kept: a13ab52e-531f-4d22-816e-ae0f3ea6fcd1)
  "8596af8e-7fed-4ed9-96ee-91e10adf6a9d",
  // Infinix Note 30, Kasur (kept: 52b0eb06-483b-44f5-b273-0094c6b0a125)
  "22c5d744-92ad-424d-ace4-33f666591f71",
  // iPhone 13 Pro Max, Islamabad (kept: a2a1a6ea-80b3-406a-a909-cb277f736790)
  "ebcf7ca0-2254-4b7c-88ac-de3c76707929",
  // Implausible / off-topic
  "f1764bcc-917a-40f7-993d-f973eff81fb0",
  "7eefc0e2-ad1b-43c5-a21f-3f8734b0c000",
  "40cef1aa-86a0-43b8-b2e4-6555b185ac72",
  "ef08dc98-78d4-421d-a257-3fd8a7441eee",
];

const removed = new Set(REMOVED_LISTING_IDS.map((id) => id.toLowerCase()));

export function isRemovedListing(id: string | null | undefined) {
  return Boolean(id) && removed.has(String(id).toLowerCase());
}

/** PostgREST list for `.not("id", "in", REMOVED_LISTING_FILTER)`. */
export const REMOVED_LISTING_FILTER = `(${REMOVED_LISTING_IDS.join(",")})`;

export function withoutRemovedListings<T extends { id?: string | null }>(rows: T[]) {
  return rows.filter((row) => !isRemovedListing(row.id));
}
