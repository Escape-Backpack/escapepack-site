import test from "node:test";
import assert from "node:assert/strict";
import { normaliseSignup, CONSENT } from "../src/signup.js";

test("a valid sign-up becomes a row", () => {
  const { row } = normaliseSignup({ email: " Me@Example.COM ", consent: "on", interest: "norse", playtest: "on" }, "https://crypticbureau.com");
  assert.equal(row.email, "me@example.com");
  assert.equal(row.interest, "norse");
  assert.equal(row.playtest, 1);
  assert.equal(row.status, "active");
  assert.equal(row.consent, CONSENT);
});
test("consent is required", () => {
  assert.match(normaliseSignup({ email: "a@b.ca" }, "").error, /tick/);
});
test("bad email, honeypot, unknown interest", () => {
  assert.match(normaliseSignup({ email: "nope", consent: "on" }, "").error, /email/);
  assert.deepEqual(normaliseSignup({ email: "a@b.ca", consent: "on", _gotcha: "x" }, ""), { ignore: true });
  assert.equal(normaliseSignup({ email: "a@b.ca", consent: "on", interest: "zzz" }, "").row.interest, null);
});
test("addresses that would be spreadsheet formulas are refused", () => {
  for (const e of ["=cmd@x.ca", "+1@x.ca", "-a@x.ca", "@x@y.ca"]) assert.match(normaliseSignup({ email: e, consent: "on" }, "").error, /email/);
  assert.equal(normaliseSignup({ email: "first.last+tag@x.ca", consent: "on" }, "").row.email, "first.last+tag@x.ca");
});
test("local previews are test rows", () => {
  assert.equal(normaliseSignup({ email: "a@b.ca", consent: "on" }, "http://localhost:8742").row.status, "test");
});
