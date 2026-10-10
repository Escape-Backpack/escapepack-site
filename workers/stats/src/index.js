// escapepack-stats: logs hint-page runs to D1, lets other phones join a run by game code,
// and serves the numbers the end screen compares against. Routes (on escapepack.ca/api/*):
//   POST /api/runs               start a run            -> state (with its code)
//   GET  /api/runs/:code         join / refresh a run   -> state
//   POST /api/runs/:code/ops     apply queued actions   -> state
//   GET  /api/stats?backpack=&version=[&session=]       -> comparison numbers
// Actions carry `ago` (ms since they happened on the phone), so a queue sent late, or from a
// phone with a wrong clock, still lands at the right moment on the server's timer.
import { parse, summarise } from "./rules.js";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I
const MAX_BODY = 32_000;
const MAX_AGE = 6 * 3600_000;

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const fail = (status, message) => { throw new HttpError(status, message); };

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request.headers.get("Origin"), env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/^\/api/, "");
      let m;
      if (path === "/runs" && request.method === "POST") return json(await createRun(env, await readBody(request)), cors);
      if ((m = path.match(/^\/runs\/([A-Z2-9]{5})$/)) && request.method === "GET") return json(state(await load(env, m[1])), cors);
      if ((m = path.match(/^\/runs\/([A-Z2-9]{5})\/ops$/)) && request.method === "POST") return json(await applyOps(env, m[1], await readBody(request)), cors);
      if (path === "/stats" && request.method === "GET") return json(await stats(env, url.searchParams), cors, 200, "public, max-age=60");
      fail(404, "not found");
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, cors, e.status);
      console.error(e);
      return json({ error: "server error" }, cors, 500);
    }
  },
};

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  const h = { "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin" };
  if (origin && allowed.includes(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

function json(data, cors, status = 200, cache = "no-store") {
  return new Response(JSON.stringify(data), { status, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": cache } });
}

async function readBody(request) {
  const text = await request.text();
  if (text.length > MAX_BODY) fail(413, "too large");
  try { return JSON.parse(text || "{}"); } catch { fail(400, "bad json"); }
}

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "") || null;
const int = (v, lo, hi) => (Number.isInteger(v) && v >= lo && v <= hi ? v : null);
const iso = ms => (ms == null ? null : new Date(ms).toISOString().replace(/\.\d+Z$/, "Z"));

function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return Array.from(bytes, b => ALPHABET[b % ALPHABET.length]).join("");
}

async function createRun(env, b) {
  const backpack = str(b.backpack, 30);
  const version = str(b.version, 40);
  const locks = int(b.locks_total, 1, 40);
  if (!backpack || !/^[a-z0-9-]+$/.test(backpack) || !version || !locks) fail(400, "backpack, version and locks_total are required");
  const session = /^s\d{10,16}_[a-z0-9]{1,8}$/.test(b.session_id || "") ? b.session_id : `s${Date.now()}_${newCode().toLowerCase()}`;

  // Started a while ago while offline, and only now reaching the server.
  const existing = await env.DB.prepare("SELECT * FROM runs WHERE session_id = ?").bind(session).first();
  if (existing) return state(parse(existing));

  const now = Date.now();
  const started = now - Math.min(MAX_AGE, Math.max(0, int(b.age_ms, 0, MAX_AGE) ?? 0));
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newCode();
    try {
      await env.DB.prepare(`INSERT INTO runs (session_id, code, backpack, version, team, team_size, started_at, updated_at,
          started_ms, elapsed_s, locks_total, lock_times, hints, device, browser, is_test, source)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'web')`)
        .bind(session, code, backpack, version, str(b.team, 40), int(b.team_size, 1, 20), iso(started), iso(now), started,
          Math.floor((now - started) / 1000), locks, JSON.stringify(Array(locks).fill(null)),
          JSON.stringify(Array.from({ length: locks }, () => [])), str(b.device, 20), str(b.browser, 20), b.test ? 1 : 0)
        .run();
      return state(await load(env, code));
    } catch (e) {
      if (!/UNIQUE/i.test(String(e.message))) throw e; // code clash: try another
    }
  }
  fail(503, "could not make a game code");
}

async function load(env, code) {
  const row = await env.DB.prepare("SELECT * FROM runs WHERE code = ?").bind(code).first();
  if (!row) fail(404, "no game with that code");
  return parse(row);
}

function elapsedAt(r, t) {
  const pausedNow = r.paused_since_ms != null ? Math.max(0, t - r.paused_since_ms) : 0;
  return Math.max(0, Math.floor((t - r.started_ms - r.paused_total_ms - pausedNow) / 1000));
}

function apply(r, op, now) {
  const at = Math.min(now, Math.max(r.started_ms, now - (int(op.ago, 0, MAX_AGE) ?? 0)));
  const lock = int(op.lock, 0, r.locks_total - 1);
  if (r.finished_ms != null && op.t !== "hint") return; // the game is over; only hint reads still count
  switch (op.t) {
    case "pause":
      if (r.paused_since_ms == null) r.paused_since_ms = at;
      break;
    case "resume":
      if (r.paused_since_ms != null) { r.paused_total_ms += Math.max(0, at - r.paused_since_ms); r.paused_since_ms = null; }
      break;
    case "solve": { // upto: every earlier lock still open is marked too (locks opened in order)
      if (lock == null) return;
      const el = elapsedAt(r, at);
      for (let j = op.upto ? 0 : lock; j <= lock; j++) if (r.lock_times[j] == null) r.lock_times[j] = el;
      break;
    }
    case "unsolve": // after: every later lock is unmarked too
      if (lock == null) return;
      for (let j = lock; j <= (op.after ? r.locks_total - 1 : lock); j++) r.lock_times[j] = null;
      break;
    case "hint": {
      const level = int(op.level, 0, 9);
      if (lock == null || level == null) return;
      if (!r.hints[lock].includes(level)) r.hints[lock].push(level);
      break;
    }
    case "finish":
      if (r.paused_since_ms != null) { r.paused_total_ms += Math.max(0, at - r.paused_since_ms); r.paused_since_ms = null; }
      r.finished_ms = at;
      break;
    case "team": {
      const size = int(op.size, 1, 20);
      if (size) r.team_size = size;
      break;
    }
  }
}

async function applyOps(env, code, b) {
  const ops = Array.isArray(b.ops) ? b.ops.slice(0, 300) : fail(400, "ops must be a list");
  // Oldest first, so a queue from a phone that was offline replays in order.
  ops.sort((a, c) => (int(c.ago, 0, MAX_AGE) ?? 0) - (int(a.ago, 0, MAX_AGE) ?? 0));
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await load(env, code);
    const now = Date.now();
    for (const op of ops) if (op && typeof op.t === "string") apply(r, op, now);
    const end = r.finished_ms ?? now;
    r.elapsed_s = elapsedAt(r, end);
    const res = await env.DB.prepare(`UPDATE runs SET team_size = ?, updated_at = ?, finished_at = ?, paused_total_ms = ?,
        paused_since_ms = ?, finished_ms = ?, elapsed_s = ?, lock_times = ?, hints = ?, rev = rev + 1
        WHERE session_id = ? AND rev = ?`)
      .bind(r.team_size, iso(now), iso(r.finished_ms), r.paused_total_ms, r.paused_since_ms, r.finished_ms, r.elapsed_s,
        JSON.stringify(r.lock_times), JSON.stringify(r.hints), r.session_id, r.rev)
      .run();
    if (res.meta.changes === 1) return state({ ...r, rev: r.rev + 1 });
    // Another phone wrote in between: reload and apply again.
  }
  fail(409, "busy, try again");
}

function state(r) {
  return {
    code: r.code, session_id: r.session_id, backpack: r.backpack, version: r.version, team: r.team, team_size: r.team_size,
    locks_total: r.locks_total, started_ms: r.started_ms, paused_total_ms: r.paused_total_ms,
    paused_since_ms: r.paused_since_ms, finished_ms: r.finished_ms, elapsed_s: r.elapsed_s,
    lock_times: r.lock_times, hints: r.hints, now: Date.now(),
  };
}

async function stats(env, q) {
  const backpack = q.get("backpack"), version = q.get("version");
  if (!backpack || !version) fail(400, "backpack and version are required");
  const { results } = await env.DB.prepare(`SELECT session_id, team, is_test, finished_at, finished_ms, elapsed_s, lock_times, hints
      FROM runs WHERE backpack = ? AND version = ?`).bind(backpack, version).all();
  return { backpack, version, ...summarise(results.map(parse), q.get("session")) };
}
