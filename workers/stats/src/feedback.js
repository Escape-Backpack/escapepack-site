// Feedback and request forms: turn a submitted form (JSON or multipart) into one `feedback` row,
// and build the alert email. Pure functions, so they can be tested with `node --test`.

const LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const SKIP = new Set(["form", "game", "rating", "email", "message", "note"]);

const clean = (v, max) => (typeof v === "string" ? v.replace(/\u0000/g, "").trim().slice(0, max) : "");

// `obj`: the submitted fields (values may be strings, or arrays when a field repeats).
// Returns { ignore: true } for a filled honeypot, { error } for a bad request, or { row }.
export function normalise(obj, origin) {
  if (!obj || typeof obj !== "object") return { error: "empty submission" };
  if (clean(obj._gotcha, 200)) return { ignore: true }; // bots fill the hidden field; pretend it worked

  const form = (clean(obj.form, 40) || clean(obj.game, 40)).toLowerCase();
  if (!/^[a-z0-9-]+$/.test(form)) return { error: "form is required" };
  const game = clean(obj.game, 40).toLowerCase() || null;

  const rating = Number(obj.rating);
  const email = clean(obj.email, 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "that email address does not look right" };
  if (form === "borrow" && !email) return { error: "email is required for this form" };

  const data = {};
  let n = 0;
  for (const [k, raw] of Object.entries(obj)) {
    if (k.startsWith("_") || SKIP.has(k) || !/^[A-Za-z0-9_.#-]{1,60}$/.test(k)) continue;
    const v = clean(Array.isArray(raw) ? raw.join(", ") : String(raw ?? ""), 2000);
    if (!v) continue;
    if (++n > 120) break;
    data[k] = v;
  }
  const message = clean(obj.message ?? obj.note, 6000) || null;
  if (!message && !Object.keys(data).length && !(rating >= 1 && rating <= 5)) return { error: "nothing to send" };

  return {
    row: {
      form,
      game,
      rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null,
      email: email || null,
      message,
      data: JSON.stringify(data),
      origin: clean(origin || "", 100) || null,
      // Submissions from a local preview are kept apart and send no email.
      status: LOCAL.test(origin || "") ? "test" : "new",
    },
  };
}

const header = v => String(v).replace(/[\r\n]+/g, " ").slice(0, 200);

export function alertText(row, id) {
  const data = JSON.parse(row.data || "{}");
  const lines = [
    `Form: ${row.form}${row.game ? ` (${row.game})` : ""}`,
    row.rating ? `Rating: ${row.rating} / 5` : null,
    `Email: ${row.email || "(none given)"}`,
    "",
    row.message || "(no message)",
    "",
    ...Object.entries(data).map(([k, v]) => `${k}: ${v}`),
    "",
    `Stored as feedback #${id}.`,
  ];
  return lines.filter(l => l !== null).join("\r\n");
}

// A plain-text email. Cloudflare's send_email binding takes the raw message.
export function buildMime({ from, to, subject, text, replyTo }) {
  const head = [
    `From: The Cryptic Bureau <${header(from)}>`,
    `To: ${header(to)}`,
    replyTo ? `Reply-To: ${header(replyTo)}` : null,
    `Subject: ${header(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${header(from).split("@")[1] || "crypticbureau.com"}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
  ].filter(Boolean);
  return head.join("\r\n") + "\r\n\r\n" + text.replace(/\r?\n/g, "\r\n");
}

export function alertSubject(row) {
  const bits = [row.form, row.game && row.game !== row.form ? row.game : null, row.rating ? `${row.rating}/5` : null].filter(Boolean);
  return `[Bureau] New ${bits.join(" · ")}`;
}
