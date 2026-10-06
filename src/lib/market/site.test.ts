import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ADVERTISE_EMAIL, ADVERTISE_GMAIL_URL, ADVERTISE_MAILTO, BRAND, DEFAULT_SITE_URL, SUPPORT_EMAIL, safeInternalPath } from "./site.ts";

describe("branding and redirects", () => {
  it("uses Mobile Market and the support mailbox", () => {
    assert.equal(BRAND, "Mobile Market");
    assert.equal(SUPPORT_EMAIL, "help@mobilemarket.pk");
    assert.equal(DEFAULT_SITE_URL, "https://mobilemarket.pk");
    assert.match(DEFAULT_SITE_URL, /^https:\/\/mobilemarket\.pk$/);
    assert.doesNotMatch(DEFAULT_SITE_URL, /vercel\.app/);
  });

  it("rejects open redirects", () => {
    assert.equal(safeInternalPath("/sell"), "/sell");
    assert.equal(safeInternalPath("/my-ads"), "/my-ads");
    assert.equal(safeInternalPath("https://evil.example/phish"), "/my-ads");
    assert.equal(safeInternalPath("//evil.example"), "/my-ads");
    assert.equal(safeInternalPath("\\evil"), "/my-ads");
    assert.equal(safeInternalPath("/%2f%2fevil.example"), "/my-ads");
    assert.equal(safeInternalPath("/login?next=https://evil.example"), "/my-ads");
    assert.equal(safeInternalPath(null, "/account"), "/account");
  });
});

describe("advertising contact", () => {
  it("uses the advertising address with a prefilled subject and leaves support email alone", () => {
    assert.equal(ADVERTISE_EMAIL, "buildskillspk@gmail.com");
    assert.equal(SUPPORT_EMAIL, "help@mobilemarket.pk");
    assert.equal(ADVERTISE_MAILTO, "mailto:buildskillspk@gmail.com?subject=Advertise%20my%20mobile%20shop%20on%20mobilemarket.pk");
    assert.equal(
      ADVERTISE_GMAIL_URL,
      "https://mail.google.com/mail/?view=cm&fs=1&to=buildskillspk@gmail.com&su=Advertise%20my%20mobile%20shop%20on%20mobilemarket.pk",
    );
  });
});
