import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { REMOVED_LISTING_FILTER, REMOVED_LISTING_IDS, isRemovedListing, withoutRemovedListings } from "./listing-blocklist.ts";

const KEPT = [
  "6c07428b-ff8f-4a2b-bd43-464c28c155a1",
  "7b73196b-c73d-4478-9944-69a5d0415348",
  "a13ab52e-531f-4d22-816e-ae0f3ea6fcd1",
  "52b0eb06-483b-44f5-b273-0094c6b0a125",
  "a2a1a6ea-80b3-406a-a909-cb277f736790",
  "705d03c0-be68-4dea-8dce-d25e30fdc910",
  "1db923a7-2430-4dac-b5cd-4edc9957ef59",
];

describe("removed listing blocklist", () => {
  it("holds exactly the 14 approved UUIDs and none of the kept listings", () => {
    assert.equal(REMOVED_LISTING_IDS.length, 14);
    assert.equal(new Set(REMOVED_LISTING_IDS).size, 14);
    for (const id of REMOVED_LISTING_IDS) assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    for (const id of KEPT) assert.equal(isRemovedListing(id), false, id);
  });

  it("matches case-insensitively and filters rows", () => {
    assert.equal(isRemovedListing("F1764BCC-917A-40F7-993D-F973EFF81FB0"), true);
    assert.equal(isRemovedListing(undefined), false);
    const rows = [{ id: KEPT[0] }, { id: REMOVED_LISTING_IDS[0] }];
    assert.deepEqual(withoutRemovedListings(rows), [{ id: KEPT[0] }]);
    assert.equal(REMOVED_LISTING_FILTER, `(${REMOVED_LISTING_IDS.join(",")})`);
  });
});
