// Launch-list sign-ups: turn a submitted form into one `signups` row. Pure, so `node --test` can check it.

const LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const INTERESTS = ["norse", "hiking", "any"];
// Bump the version whenever the wording on /updates changes; each row keeps the version it agreed to.
export const CONSENT = "launch-note-v1: Email me when the campaign launches. Nothing else without asking again. Delete on request.";

const clean = (v, max) => (typeof v === "string" ? v.replace(/\u0000/g, "").trim().slice(0, max) : "");

export function normaliseSignup(obj, origin) {
  if (!obj || typeof obj !== "object") return { error: "empty submission" };
  if (clean(obj._gotcha, 200)) return { ignore: true };
  const email = clean(obj.email, 254).toLowerCase();
  // A leading = + - or @ would run as a formula if the exported list is opened in a spreadsheet.
  if (!/^[^\s@=+\-][^\s@]*@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "that email address does not look right" };
  const yes = v => ["1", "true", "yes", "on"].includes(String(v ?? "").toLowerCase());
  if (!yes(obj.consent)) return { error: "please tick the box to say you agree" };
  const interest = clean(obj.interest, 20).toLowerCase();
  return {
    row: {
      email,
      interest: INTERESTS.includes(interest) ? interest : null,
      playtest: yes(obj.playtest) ? 1 : 0,
      consent: CONSENT,
      origin: clean(origin || "", 100) || null,
      status: LOCAL.test(origin || "") ? "test" : "active",
    },
  };
}
