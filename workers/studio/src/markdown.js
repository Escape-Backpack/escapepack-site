// Record files <-> JSON, matching backpack-kit's parser (kit.py parse_record): a small YAML subset
// (`key: value`, `key: [a, b]`, `- item` lists, full-line # comments) between --- lines, then a Markdown body.
// serialize() writes values back into the original frontmatter lines, so comments and key order survive.

const KEY_RE = /^([A-Za-z_][\w-]*)\s*:(.*)$/;
const INT_FIELDS = ["order", "difficulty"];

function scalar(s) {
  s = s.trim();
  if (s.length >= 2 && s[0] === s[s.length - 1] && (s[0] === '"' || s[0] === "'")) return s.slice(1, -1);
  return s;
}

function value(s) {
  s = s.trim();
  if (s === "") return null;
  if (s.startsWith("[") && s.endsWith("]")) {
    const inner = s.slice(1, -1).trim();
    return inner ? inner.split(",").filter(x => x.trim()).map(scalar) : [];
  }
  return scalar(s);
}

export function parse(text) {
  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  if (lines[0]?.trim() !== "---") throw new Error("no frontmatter (file must start with ---)");
  let end = -1;
  for (let i = 1; i < lines.length; i++) if (lines[i].trim() === "---") { end = i; break; }
  if (end < 0) throw new Error("frontmatter is never closed with ---");
  const data = {};
  let key = null;
  for (const ln of lines.slice(1, end)) {
    const s = ln.trim();
    if (!s || s.startsWith("#")) continue;
    if ((s.startsWith("- ") || s === "-") && key !== null) {
      if (!Array.isArray(data[key])) data[key] = [];
      const item = scalar(s.slice(1));
      if (item) data[key].push(item);
      continue;
    }
    const m = ln.match(KEY_RE);
    if (!m) continue;
    key = m[1];
    data[key] = value(m[2]);
  }
  for (const k of INT_FIELDS) if (typeof data[k] === "string" && /^-?\d+$/.test(data[k])) data[k] = Number(data[k]);
  return { data, body: lines.slice(end + 1).join("\n").replace(/^\n+|\n+$/g, ""), front: lines.slice(1, end).join("\n") };
}

// A value as the kit reads it back: lists inline, quotes only when the text would be misread.
export function format(v) {
  if (v == null || v === "") return "";
  if (Array.isArray(v)) return "[" + v.map(x => String(x).replace(/[,\[\]]/g, " ").trim()).filter(Boolean).join(", ") + "]";
  const s = String(v).replace(/\r?\n/g, " ").trim();
  if (/^[\["']/.test(s) || /\s#/.test(s) || /[,\]]$/.test(s)) return '"' + s + '"';
  return s;
}

export function serialize(data, body, front = "") {
  const out = [], written = new Set();
  let skipping = false;
  for (const ln of front.replace(/\r\n/g, "\n").split("\n")) {
    const s = ln.trim();
    if (skipping && (s.startsWith("- ") || s === "-")) continue; // old block list: rewritten inline
    skipping = false;
    const m = ln.match(KEY_RE);
    if (m && !s.startsWith("#")) {
      const key = m[1];
      if (written.has(key) || !(key in data)) continue; // removed field
      written.add(key);
      const v = format(data[key]);
      out.push(v ? `${key}: ${v}` : `${key}:`);
      skipping = true;
      continue;
    }
    if (ln !== "" || out.length) out.push(ln);
  }
  for (const [key, v] of Object.entries(data)) {
    if (written.has(key)) continue;
    const f = format(v);
    out.push(f ? `${key}: ${f}` : `${key}:`);
  }
  while (out.length && out[out.length - 1].trim() === "") out.pop();
  return `---\n${out.join("\n")}\n---\n${body ? "\n" + body.replace(/\s+$/, "") + "\n" : ""}`;
}

export function slugify(title) {
  const s = String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return s.slice(0, 40).replace(/-+$/, "") || "untitled";
}

export const TYPES = {
  premise: { prefix: "PR", folder: "premise" },
  beat: { prefix: "ST", folder: "structure" },
  puzzle: { prefix: "PZ", folder: "puzzles" },
  prop: { prefix: "PP", folder: "props" },
  question: { prefix: "Q", folder: "questions" },
  asset: { prefix: "AS", folder: "assets" },
};
export const PREFIX_TYPE = Object.fromEntries(Object.entries(TYPES).map(([t, v]) => [v.prefix, t]));
