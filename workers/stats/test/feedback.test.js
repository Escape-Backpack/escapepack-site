import test from "node:test";
import assert from "node:assert/strict";
import { normalise, alertText, alertSubject, buildMime } from "../src/feedback.js";

test("a filled honeypot is ignored, not stored", () => {
  assert.deepEqual(normalise({ form: "feedback", message: "hi", _gotcha: "x" }, "https://escapepack.ca"), { ignore: true });
});

test("a normal feedback form becomes one row", () => {
  const { row } = normalise({ form: "feedback", game: "hiking", rating: "4", email: "", message: " Great ", device: "phone", _subject: "x" }, "https://crypticbureau.com");
  assert.equal(row.form, "feedback");
  assert.equal(row.rating, 4);
  assert.equal(row.email, null);
  assert.equal(row.message, "Great");
  assert.equal(row.status, "new");
  assert.deepEqual(JSON.parse(row.data), { device: "phone" });
});

test("local previews are marked test", () => {
  assert.equal(normalise({ form: "feedback", message: "x" }, "http://localhost:8742").row.status, "test");
});

test("repeated fields are joined; empty ones dropped", () => {
  const { row } = normalise({ form: "norse-feedback", stuck: ["a", "b"], other: "" }, "https://escapepack.ca");
  assert.deepEqual(JSON.parse(row.data), { stuck: "a, b" });
});

test("errors", () => {
  assert.match(normalise({ message: "x" }, "").error, /form/);
  assert.match(normalise({ form: "feedback" }, "").error, /nothing/);
  assert.match(normalise({ form: "feedback", message: "x", email: "nope" }, "").error, /email/);
  assert.match(normalise({ form: "borrow", name: "A" }, "").error, /email/);
  assert.equal(normalise({ form: "borrow", name: "A", email: "a@b.ca" }, "").row.email, "a@b.ca");
});

test("alert email has CRLF headers and no header injection", () => {
  const { row } = normalise({ form: "feedback", game: "hiking", rating: 5, message: "Nice\nline", email: "a@b.ca" }, "https://escapepack.ca");
  const mime = buildMime({ from: "alerts@crypticbureau.com", to: "me@example.com", subject: "Bad\r\nBcc: x@y.z", text: alertText(row, 7), replyTo: row.email });
  assert.ok(!/\r\nBcc:/i.test(mime.split("\r\n\r\n")[0]));
  assert.ok(mime.includes("Reply-To: a@b.ca"));
  assert.ok(mime.includes("feedback #7"));
  assert.equal(alertSubject(row), "[Bureau] New feedback · hiking · 5/5");
});
