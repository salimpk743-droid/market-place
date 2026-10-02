import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MEDIA_MIN_TTL_SECONDS, isMediaExpiryAcceptable, stableMediaExpiry } from "./media-expiry.ts";

describe("stable media expiry", () => {
  const now = 1_790_000_000;

  it("keeps the same expiry across renders in the same window", () => {
    assert.equal(stableMediaExpiry(now), stableMediaExpiry(now + 3600));
    assert.equal(stableMediaExpiry(now), stableMediaExpiry(now + 86400));
  });

  it("always leaves at least the minimum lifetime", () => {
    for (let t = now; t < now + 90 * 86400; t += 7919) {
      assert.ok(stableMediaExpiry(t) - t >= MEDIA_MIN_TTL_SECONDS);
      assert.ok(isMediaExpiryAcceptable(stableMediaExpiry(t), t));
    }
  });

  it("rejects expired and far-future expiries, accepts legacy 7-day URLs", () => {
    assert.equal(isMediaExpiryAcceptable(now - 120, now), false);
    assert.equal(isMediaExpiryAcceptable(now + 400 * 86400, now), false);
    assert.equal(isMediaExpiryAcceptable(now + MEDIA_MIN_TTL_SECONDS, now), true);
    assert.equal(isMediaExpiryAcceptable(Number.NaN, now), false);
  });
});
