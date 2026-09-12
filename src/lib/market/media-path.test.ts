import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  extractStoragePath,
  isListingStoragePath,
  parseListingStoragePath,
  serializeStoragePaths,
  storagePathsFromStored,
  withMediaWidth,
} from "./media-path.ts";

const seller = "11111111-1111-4111-8111-111111111111";
const listing = "22222222-2222-4222-8222-222222222222";
const path = `${seller}/${listing}/abc.jpg`;

describe("listing storage paths", () => {
  it("accepts bucket object paths only", () => {
    assert.equal(isListingStoragePath(path), true);
    assert.equal(isListingStoragePath("https://example.com/photo.jpg"), false);
    assert.equal(isListingStoragePath("../secret.jpg"), false);
    assert.equal(parseListingStoragePath(path)?.filename, "abc.jpg");
  });

  it("extracts a path from a legacy public URL", () => {
    const url = `https://proj.supabase.co/storage/v1/object/public/listing-images/${path}`;
    assert.equal(extractStoragePath(url), path);
    assert.deepEqual(storagePathsFromStored(url), [path]);
  });

  it("extracts paths from a JSON list and signed URL", () => {
    const signed = `https://proj.supabase.co/storage/v1/object/sign/listing-images/${path}?token=abc`;
    const second = `${seller}/${listing}/def.webp`;
    assert.deepEqual(storagePathsFromStored(JSON.stringify([signed, second, path])), [path, second]);
  });

  it("serializes one path as a string and many as JSON", () => {
    assert.equal(serializeStoragePaths([path]), path);
    assert.equal(serializeStoragePaths([path, `${seller}/${listing}/b.png`]), JSON.stringify([path, `${seller}/${listing}/b.png`]));
  });

  it("ignores public API urls and empty values", () => {
    assert.equal(extractStoragePath("/api/listing-media/x/y.jpg"), null);
    assert.deepEqual(storagePathsFromStored(""), []);
    assert.deepEqual(storagePathsFromStored(null), []);
  });

  it("appends card width without changing HMAC params", () => {
    const signed = `/api/listing-media/${listing}/abc.jpg?exp=1&sig=abc`;
    assert.equal(withMediaWidth(signed, 800), `${signed}&w=800`);
    assert.equal(withMediaWidth(signed, 800)?.includes("sig=abc"), true);
    assert.equal(withMediaWidth("/cover.jpg", 800), "/cover.jpg");
    assert.equal(withMediaWidth(undefined, 800), undefined);
  });
});
