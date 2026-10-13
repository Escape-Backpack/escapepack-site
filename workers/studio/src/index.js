// escapepack-studio: the live, shared design board on escapepack.ca/studio/.
// D1 holds the real copy of every adventure's records; a cron (and the Snapshot button) commits changed
// records back to the adventure's GitHub repo as the same Markdown files backpack-kit reads.
//
// Pages poll GET .../changes?since=<seq> every 2 s: every write adds an event, and its seq tells
// each page what it hasn't seen yet. Edits carry the rev they started from; if someone else changed
// the same field in between, the edit is refused with both versions (409) instead of overwriting.
//
// API (all under /studio/api, behind Cloudflare Access):
//   GET/POST /me                         who you are / set your display name
//   GET  /adventures, POST /adventures   list / import one from GitHub {bp, repo}
//   GET  /a/:bp/state                    everything the page needs
//   GET  /a/:bp/changes?since=&viewing=  what changed since seq (also reports who's here)
//   POST /a/:bp/records                  new record {type, title, set}
//   PATCH /a/:bp/records/:id             edit {base_rev, set, unset, body}
//   PUT  /a/:bp/records/:id/raw          edit or create from a Markdown file (kit.py studio push)
//   GET  /a/:bp/records/:id/history      saved versions
//   POST /a/:bp/records/:id/comments     comment {text};  DELETE /a/:bp/comments/:cid
//   POST /a/:bp/files?record=&name=      upload (body = the file) -> asset record
//   GET  /a/:bp/files/<path>             a file (R2, else the GitHub repo)
//   POST /a/:bp/snapshot                 commit changes to GitHub now
//   POST /a/:bp/pull-github              take edits made directly in GitHub
//   GET  /a/:bp/export                   every record as Markdown (kit.py studio pull)
import { caller } from "./auth.js";
import { parse, serialize, slugify, TYPES, PREFIX_TYPE } from "./markdown.js";
import { texts, commit } from "./github.js";

const KIT_REPO = "Escape-Backpack/backpack-kit";
const MAX_BODY = 200_000, MAX_FILE = 20_000_000;

class HttpError extends Error { constructor(status, message, extra) { super(message); this.status = status; this.extra = extra; } }
const fail = (status, message, extra) => { throw new HttpError(status, message, extra); };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const now = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/studio/api/")) return env.ASSETS.fetch(request);
    try {
      const who = await caller(request, env);
      if (!who) fail(401, "not signed in");
      return await route(request, env, url, who);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message, ...e.extra }, e.status);
      console.error(e);
      return json({ error: "server error: " + e.message }, 500);
    }
  },
  async scheduled(event, env, ctx) {
    const { results } = await env.DB.prepare("SELECT bp FROM adventures").all();
    for (const { bp } of results) ctx.waitUntil(snapshot(env, bp).catch(e => console.error("snapshot", bp, e)));
  },
};

async function body(request) {
  const text = await request.text();
  if (text.length > MAX_BODY) fail(413, "too large");
  try { return JSON.parse(text || "{}"); } catch { fail(400, "bad json"); }
}

async function nameOf(env, who) {
  if (who.service) return "Claude";
  const row = await env.DB.prepare("SELECT name FROM people WHERE email = ?").bind(who.email).first();
  return row?.name || null;
}

async function route(request, env, url, who) {
  const path = url.pathname.slice("/studio/api".length);
  const method = request.method;
  if (path === "/me") {
    if (method === "POST") {
      const name = String((await body(request)).name || "").trim().slice(0, 30);
      if (!name || name === "Claude" || name === "GitHub") fail(400, "pick another name");
      await env.DB.prepare("INSERT INTO people (email, name) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET name = excluded.name").bind(who.email, name).run();
    }
    return json({ email: who.email, name: await nameOf(env, who) });
  }
  const name = await nameOf(env, who);
  if (!name) fail(403, "name needed", { needName: true });

  if (path === "/adventures" && method === "GET") {
    const { results } = await env.DB.prepare("SELECT bp, repo, config, exported_at FROM adventures ORDER BY bp").all();
    return json(results.map(r => ({ bp: r.bp, repo: r.repo, name: JSON.parse(r.config).name || r.bp, exported_at: r.exported_at })));
  }
  if (path === "/adventures" && method === "POST") {
    const b = await body(request);
    const bp = String(b.bp || "").toLowerCase(), repo = String(b.repo || "");
    if (!/^[a-z0-9-]{1,30}$/.test(bp) || !/^[\w.-]+\/[\w.-]+$/.test(repo)) fail(400, "bp (slug) and repo (owner/name) are required");
    if (await env.DB.prepare("SELECT 1 FROM adventures WHERE bp = ?").bind(bp).first()) fail(409, "already in the Studio");
    return json(await importAdventure(env, bp, repo, name));
  }

  let m = path.match(/^\/a\/([a-z0-9-]+)(\/.*)?$/);
  if (!m) fail(404, "not found");
  const bp = m[1], rest = m[2] || "";
  const adv = await env.DB.prepare("SELECT * FROM adventures WHERE bp = ?").bind(bp).first();
  if (!adv) fail(404, "no adventure " + bp);

  if (rest === "/state" && method === "GET") return json(await state(env, adv));
  if (rest === "/changes" && method === "GET") return json(await changes(env, adv, Number(url.searchParams.get("since") || 0), name, url.searchParams.get("viewing")));
  if (rest === "/records" && method === "POST") {
    const b = await body(request);
    return json(await createRecord(env, adv, b.type, b.title, b.set || {}, b.body || "", name));
  }
  if ((m = rest.match(/^\/records\/([A-Z]{1,2}-\d{3,})$/)) && method === "PATCH") {
    const b = await body(request);
    return json(await patchRecord(env, bp, m[1], b.base_rev, b.set || {}, b.unset || [], b.body, name));
  }
  if ((m = rest.match(/^\/records\/([A-Z]{1,2}-\d{3,})\/raw$/)) && method === "PUT") {
    const b = await body(request);
    return json(await putRaw(env, adv, m[1], String(b.markdown || ""), b.base_rev, name));
  }
  if ((m = rest.match(/^\/records\/([A-Z]{1,2}-\d{3,})\/history$/)) && method === "GET") {
    const { results } = await env.DB.prepare("SELECT rev, data, body, by_name, at FROM history WHERE bp = ? AND id = ? ORDER BY rev DESC LIMIT 50").bind(bp, m[1]).all();
    return json(results.map(h => ({ ...h, data: JSON.parse(h.data) })));
  }
  if ((m = rest.match(/^\/records\/([A-Z]{1,2}-\d{3,})\/comments$/)) && method === "POST") {
    const text = String((await body(request)).text || "").trim().slice(0, 5000);
    if (!text) fail(400, "empty comment");
    if (!(await env.DB.prepare("SELECT 1 FROM records WHERE bp = ? AND id = ?").bind(bp, m[1]).first())) fail(404, "no record " + m[1]);
    const seq = await event(env, bp, m[1], name, "commented on");
    await env.DB.prepare("INSERT INTO comments (bp, record_id, by_name, text, at, seq) VALUES (?, ?, ?, ?, ?, ?)").bind(bp, m[1], name, text, now(), seq).run();
    return json({ ok: true, seq });
  }
  if ((m = rest.match(/^\/comments\/(\d+)$/)) && method === "DELETE") {
    const c = await env.DB.prepare("SELECT * FROM comments WHERE bp = ? AND cid = ?").bind(bp, Number(m[1])).first();
    if (!c) fail(404, "no comment");
    if (c.by_name !== name) fail(403, "you can only delete your own comments");
    const seq = await event(env, bp, c.record_id, name, "deleted a comment on");
    await env.DB.prepare("UPDATE comments SET deleted = 1, seq = ? WHERE cid = ?").bind(seq, c.cid).run();
    return json({ ok: true });
  }
  if (rest === "/files" && method === "POST") return json(await upload(env, adv, request, url, name));
  if ((m = rest.match(/^\/files\/(.+)$/)) && method === "GET") return file(env, adv, decodeURIComponent(m[1]));
  if (rest === "/snapshot" && method === "POST") return json(await snapshot(env, bp));
  if (rest === "/pull-github" && method === "POST") return json(await pullGithub(env, adv));
  if (rest === "/export" && method === "GET") {
    const { results } = await env.DB.prepare("SELECT id, rev, data, body, front, path FROM records WHERE bp = ?").bind(bp).all();
    const seq = (await env.DB.prepare("SELECT MAX(seq) AS s FROM events WHERE bp = ?").bind(bp).first()).s || 0;
    return json({ seq, records: results.map(r => ({ id: r.id, rev: r.rev, path: r.path, markdown: serialize(JSON.parse(r.data), r.body, r.front) })) });
  }
  fail(404, "not found");
}

// ---------- records ----------

const rowOut = r => ({ id: r.id, type: r.type, rev: r.rev, data: JSON.parse(r.data), body: r.body, path: r.path, updated_at: r.updated_at, updated_by: r.updated_by, seq: r.seq });

async function event(env, bp, recordId, name, action) {
  const r = await env.DB.prepare("INSERT INTO events (bp, record_id, by_name, action, at) VALUES (?, ?, ?, ?, ?) RETURNING seq").bind(bp, recordId, name, action, now()).first();
  return r.seq;
}

async function state(env, adv) {
  const bp = adv.bp;
  const [recs, coms, evs, seq] = await Promise.all([
    env.DB.prepare("SELECT * FROM records WHERE bp = ?").bind(bp).all(),
    env.DB.prepare("SELECT cid, record_id, by_name, text, at, seq FROM comments WHERE bp = ? AND deleted = 0").bind(bp).all(),
    env.DB.prepare("SELECT seq, record_id, by_name, action, at FROM events WHERE bp = ? ORDER BY seq DESC LIMIT 60").bind(bp).all(),
    env.DB.prepare("SELECT MAX(seq) AS s FROM events WHERE bp = ?").bind(bp).first(),
  ]);
  return {
    adventure: { bp, repo: adv.repo, config: JSON.parse(adv.config), kit: JSON.parse(adv.kit), exported_seq: adv.exported_seq, exported_at: adv.exported_at, last_commit: adv.last_commit },
    records: recs.results.map(rowOut), comments: coms.results, events: evs.results, seq: seq.s || 0,
  };
}

async function changes(env, adv, since, name, viewing) {
  const bp = adv.bp, t = Date.now();
  const pres = (await env.DB.prepare("SELECT name, viewing, at FROM presence WHERE bp = ?").bind(bp).all()).results;
  const mine = pres.find(p => p.name === name);
  viewing = viewing && /^[A-Z]{1,2}-\d{3,}$/.test(viewing) ? viewing : null;
  if (!mine || mine.viewing !== viewing || t - mine.at > 15_000)
    await env.DB.prepare("INSERT INTO presence (bp, name, viewing, at) VALUES (?, ?, ?, ?) ON CONFLICT(bp, name) DO UPDATE SET viewing = excluded.viewing, at = excluded.at").bind(bp, name, viewing, t).run();
  const [recs, coms, evs, seq] = await Promise.all([
    env.DB.prepare("SELECT * FROM records WHERE bp = ? AND seq > ?").bind(bp, since).all(),
    env.DB.prepare("SELECT cid, record_id, by_name, text, at, seq, deleted FROM comments WHERE bp = ? AND seq > ?").bind(bp, since).all(),
    env.DB.prepare("SELECT seq, record_id, by_name, action, at FROM events WHERE bp = ? AND seq > ? ORDER BY seq DESC LIMIT 60").bind(bp, since).all(),
    env.DB.prepare("SELECT MAX(seq) AS s FROM events WHERE bp = ?").bind(bp).first(),
  ]);
  return {
    seq: seq.s || 0, records: recs.results.map(rowOut), comments: coms.results, events: evs.results,
    presence: pres.filter(p => p.name !== name && t - p.at < 40_000).map(p => ({ name: p.name, viewing: p.viewing })),
    exported_seq: adv.exported_seq, exported_at: adv.exported_at,
  };
}

function describe(type, before, after, bodyChanged) {
  if (!before) return "added";
  if (before.status !== after.status) return type === "question" && after.status === "answered" ? "answered" : `marked ${after.status || "no status"}`;
  if (!same(before.turn, after.turn)) return after.turn ? `passed to ${after.turn}:` : "cleared the turn on";
  if (before.title !== after.title) return "renamed";
  if (type === "question" && !same(before.answer, after.answer)) return "answered";
  return bodyChanged && Object.keys(after).every(k => same(before[k], after[k])) ? "edited the notes of" : "edited";
}

async function write(env, bp, cur, data, body, name, action) {
  const rev = cur.rev + 1, at = now();
  const seq = await event(env, bp, cur.id, name, action);
  const res = await env.DB.prepare("UPDATE records SET rev = ?, data = ?, body = ?, updated_at = ?, updated_by = ?, seq = ?, type = ? WHERE bp = ? AND id = ? AND rev = ?")
    .bind(rev, JSON.stringify(data), body, at, name, seq, data.type || cur.type, bp, cur.id, cur.rev).run();
  if (res.meta.changes !== 1) return null; // someone saved in between
  await env.DB.prepare("INSERT OR REPLACE INTO history (bp, id, rev, data, body, by_name, at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(bp, cur.id, rev, JSON.stringify(data), body, name, at).run();
  return { ...cur, rev, data: JSON.stringify(data), body, updated_at: at, updated_by: name, seq };
}

async function patchRecord(env, bp, id, baseRev, set, unset, body, name) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const cur = await env.DB.prepare("SELECT * FROM records WHERE bp = ? AND id = ?").bind(bp, id).first();
    if (!cur) fail(404, "no record " + id);
    const curData = JSON.parse(cur.data);
    if (baseRev != null && baseRev !== cur.rev) {
      // Edited from an older copy: fine unless someone else changed the same thing since.
      const base = await env.DB.prepare("SELECT data, body FROM history WHERE bp = ? AND id = ? AND rev = ?").bind(bp, id, baseRev).first();
      const baseData = base ? JSON.parse(base.data) : {};
      const conflicts = [...Object.keys(set), ...unset].filter(k => !base || (!same(baseData[k], curData[k]) && !same(set[k], curData[k])));
      if (body !== undefined && (!base || (base.body !== cur.body && body !== cur.body))) conflicts.push("body");
      if (conflicts.length) {
        const others = (await env.DB.prepare("SELECT DISTINCT by_name FROM history WHERE bp = ? AND id = ? AND rev > ? AND by_name != ?").bind(bp, id, baseRev, name).all()).results.map(r => r.by_name);
        fail(409, `${others.join(" and ") || "Someone"} changed this at the same time`, { conflicts, record: rowOut(cur) });
      }
    }
    const data = { ...curData };
    for (const [k, v] of Object.entries(set)) if (!["id", "type"].includes(k)) data[k] = v === undefined ? null : v;
    for (const k of unset) if (!["id", "type", "title", "status"].includes(k)) delete data[k];
    const newBody = body === undefined ? cur.body : String(body);
    if (same(data, curData) && newBody === cur.body) return { record: rowOut(cur) };
    const done = await write(env, bp, cur, data, newBody, name, describe(cur.type, curData, data, newBody !== cur.body));
    if (done) return { record: rowOut(done) };
  }
  fail(409, "busy, try again");
}

async function createRecord(env, adv, type, title, set, body, name, front) {
  if (!TYPES[type]) fail(400, "unknown type " + type);
  title = String(title || "").trim().slice(0, 200);
  if (!title) fail(400, "a title is required");
  const kit = JSON.parse(adv.kit);
  const tpl = parse((kit.templates[type] || `---\nid: {{id}}\ntitle: {{title}}\ntype: ${type}\nstatus: idea\n---\n`).replace(/\{\{title\}\}/g, "TITLE"));
  const prefix = TYPES[type].prefix;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { results } = await env.DB.prepare("SELECT id FROM records WHERE bp = ? AND id LIKE ?").bind(adv.bp, prefix + "-%").all();
    const n = Math.max(0, ...results.map(r => Number(r.id.split("-")[1]) || 0)) + 1 + attempt;
    const id = `${prefix}-${String(n).padStart(3, "0")}`;
    const data = { ...tpl.data, id, title, type };
    for (const [k, v] of Object.entries(set)) if (!["id", "type"].includes(k)) data[k] = v;
    if (!data.status) data.status = type === "question" ? "open" : "idea";
    const text = body || tpl.body;
    const path = `records/${TYPES[type].folder}/${id}-${slugify(title)}.md`;
    const at = now();
    try {
      const seq = await event(env, adv.bp, id, name, type === "question" ? "asked" : "added");
      await env.DB.batch([
        env.DB.prepare("INSERT INTO records (bp, id, type, rev, data, body, front, path, updated_at, updated_by, seq) VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)")
          .bind(adv.bp, id, type, JSON.stringify(data), text, front ?? tpl.front, path, at, name, seq),
        env.DB.prepare("INSERT INTO history (bp, id, rev, data, body, by_name, at) VALUES (?, ?, 1, ?, ?, ?, ?)").bind(adv.bp, id, JSON.stringify(data), text, name, at),
      ]);
      return { record: rowOut({ id, type, rev: 1, data: JSON.stringify(data), body: text, path, updated_at: at, updated_by: name, seq }) };
    } catch (e) {
      if (!/UNIQUE|PRIMARY/i.test(String(e.message))) throw e;
    }
  }
  fail(409, "could not pick an ID, try again");
}

// kit.py studio push: a whole Markdown file, edited from the copy at base_rev.
async function putRaw(env, adv, id, markdown, baseRev, name) {
  let p;
  try { p = parse(markdown); } catch (e) { fail(400, e.message); }
  if (p.data.id !== id) fail(400, `the file's id is ${p.data.id}, not ${id}`);
  const cur = await env.DB.prepare("SELECT * FROM records WHERE bp = ? AND id = ?").bind(adv.bp, id).first();
  if (!cur) {
    // A record made locally with `kit.py new`: keep its ID if it's free.
    const type = PREFIX_TYPE[id.split("-")[0]];
    if (!type || p.data.type !== type) fail(400, "type doesn't match the ID prefix");
    const path = `records/${TYPES[type].folder}/${id}-${slugify(p.data.title || "untitled")}.md`, at = now();
    const seq = await event(env, adv.bp, id, name, "added");
    await env.DB.batch([
      env.DB.prepare("INSERT INTO records (bp, id, type, rev, data, body, front, path, updated_at, updated_by, seq) VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)")
        .bind(adv.bp, id, type, JSON.stringify(p.data), p.body, p.front, path, at, name, seq),
      env.DB.prepare("INSERT INTO history (bp, id, rev, data, body, by_name, at) VALUES (?, ?, 1, ?, ?, ?, ?)").bind(adv.bp, id, JSON.stringify(p.data), p.body, name, at),
    ]);
    return { created: true, rev: 1 };
  }
  const base = baseRev ? await env.DB.prepare("SELECT data, body FROM history WHERE bp = ? AND id = ? AND rev = ?").bind(adv.bp, id, baseRev).first() : null;
  const baseData = base ? JSON.parse(base.data) : JSON.parse(cur.data);
  const set = {}, unset = [];
  for (const [k, v] of Object.entries(p.data)) if (!same(v, baseData[k])) set[k] = v;
  for (const k of Object.keys(baseData)) if (!(k in p.data)) unset.push(k);
  const bodyArg = p.body !== (base ? base.body : cur.body) ? p.body : undefined;
  const r = await patchRecord(env, adv.bp, id, baseRev ?? cur.rev, set, unset, bodyArg, name);
  if (p.front !== cur.front) await env.DB.prepare("UPDATE records SET front = ? WHERE bp = ? AND id = ?").bind(p.front, adv.bp, id).run();
  return { rev: r.record.rev };
}

// ---------- GitHub ----------

const RECORD_FILE = /^records\/[^/]+\/[^/]+\.md$/;

async function kitFiles(env) {
  const files = await texts(env, KIT_REPO, { files: ["ciphers.json"], folders: ["templates/records"] });
  const templates = {};
  for (const [p, t] of Object.entries(files)) if (/^templates\/records\/\w+\.md$/.test(p)) templates[p.split("/").pop().replace(".md", "")] = t;
  return { ciphers: JSON.parse(files["ciphers.json"] || "{}"), templates };
}

async function readRepo(env, repo) {
  const files = await texts(env, repo, { files: ["backpack.json"], folders: ["records"] });
  const records = [], skipped = [];
  for (const [path, text] of Object.entries(files)) {
    if (!RECORD_FILE.test(path)) continue;
    try {
      const p = parse(text);
      const id = p.data.id, type = p.data.type || PREFIX_TYPE[String(id).split("-")[0]];
      if (!/^[A-Z]{1,2}-\d{3,}$/.test(id || "") || !TYPES[type]) throw new Error("bad id or type");
      records.push({ ...p, id, type, path });
    } catch (e) { skipped.push(`${path}: ${e.message}`); }
  }
  return { config: files["backpack.json"] ? JSON.parse(files["backpack.json"]) : {}, records, skipped };
}

async function importAdventure(env, bp, repo, name) {
  const [{ config, records, skipped }, kit] = await Promise.all([readRepo(env, repo), kitFiles(env)]);
  if (!records.length) fail(400, `no records found in ${repo}`);
  const at = now();
  const seq = await event(env, bp, null, name, `imported ${records.length} records from GitHub`);
  const stmts = [env.DB.prepare("INSERT INTO adventures (bp, repo, config, kit, imported_at, exported_seq, exported_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(bp, repo, JSON.stringify(config), JSON.stringify(kit), at, seq, at)];
  for (const r of records) {
    stmts.push(env.DB.prepare("INSERT INTO records (bp, id, type, rev, data, body, front, path, updated_at, updated_by, seq) VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, 'GitHub', ?)")
      .bind(bp, r.id, r.type, JSON.stringify(r.data), r.body, r.front, r.path, at, seq));
    stmts.push(env.DB.prepare("INSERT INTO history (bp, id, rev, data, body, by_name, at) VALUES (?, ?, 1, ?, ?, 'GitHub', ?)").bind(bp, r.id, JSON.stringify(r.data), r.body, at));
  }
  await env.DB.batch(stmts);
  return { bp, imported: records.length, skipped };
}

// Edits made straight in GitHub (a Claude session that skipped `kit.py studio push`, a hand edit):
// taken when the Studio hasn't changed that record since the last snapshot; otherwise reported.
async function pullGithub(env, adv) {
  const bp = adv.bp;
  const [{ config, records }, kit] = await Promise.all([readRepo(env, adv.repo), kitFiles(env)]);
  await env.DB.prepare("UPDATE adventures SET config = ?, kit = ? WHERE bp = ?").bind(JSON.stringify(config), JSON.stringify(kit), bp).run();
  const updated = [], added = [], conflicts = [];
  for (const r of records) {
    const cur = await env.DB.prepare("SELECT * FROM records WHERE bp = ? AND id = ?").bind(bp, r.id).first();
    if (!cur) {
      const at = now(), seq = await event(env, bp, r.id, "GitHub", "added");
      await env.DB.batch([
        env.DB.prepare("INSERT INTO records (bp, id, type, rev, data, body, front, path, updated_at, updated_by, seq) VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, 'GitHub', ?)")
          .bind(bp, r.id, r.type, JSON.stringify(r.data), r.body, r.front, r.path, at, seq),
        env.DB.prepare("INSERT INTO history (bp, id, rev, data, body, by_name, at) VALUES (?, ?, 1, ?, ?, 'GitHub', ?)").bind(bp, r.id, JSON.stringify(r.data), r.body, at),
      ]);
      added.push(r.id);
      continue;
    }
    if (same(JSON.parse(cur.data), r.data) && cur.body === r.body) continue;
    if (cur.seq > adv.exported_seq) { conflicts.push(r.id); continue; }
    const done = await write(env, bp, cur, r.data, r.body, "GitHub", "updated from GitHub");
    if (done) {
      await env.DB.prepare("UPDATE records SET front = ? WHERE bp = ? AND id = ?").bind(r.front, bp, r.id).run();
      updated.push(r.id);
    }
  }
  // What came from GitHub is already in GitHub.
  if (updated.length || added.length) {
    const s = (await env.DB.prepare("SELECT MAX(seq) AS s FROM events WHERE bp = ?").bind(bp).first()).s;
    const pending = await env.DB.prepare("SELECT 1 FROM records WHERE bp = ? AND seq > ? AND updated_by != 'GitHub' LIMIT 1").bind(bp, adv.exported_seq).first();
    if (!pending) await env.DB.prepare("UPDATE adventures SET exported_seq = ? WHERE bp = ?").bind(s, bp).run();
  }
  return { updated, added, conflicts };
}

async function snapshot(env, bp) {
  const adv = await env.DB.prepare("SELECT * FROM adventures WHERE bp = ?").bind(bp).first();
  const top = (await env.DB.prepare("SELECT MAX(seq) AS s FROM events WHERE bp = ?").bind(bp).first()).s || 0;
  if (top <= adv.exported_seq) return { committed: false, reason: "nothing new" };
  const files = {};
  const recs = (await env.DB.prepare("SELECT id, data, body, front, path FROM records WHERE bp = ? AND seq > ?").bind(bp, adv.exported_seq).all()).results;
  for (const r of recs) files[r.path] = serialize(JSON.parse(r.data), r.body, r.front);
  if (await env.DB.prepare("SELECT 1 FROM comments WHERE bp = ? AND seq > ? LIMIT 1").bind(bp, adv.exported_seq).first()) {
    const all = (await env.DB.prepare("SELECT cid, record_id, by_name, text, at FROM comments WHERE bp = ? AND deleted = 0 ORDER BY cid").bind(bp).all()).results;
    files["studio/comments.json"] = JSON.stringify(all, null, 1) + "\n";
  }
  const uploads = (await env.DB.prepare("SELECT path FROM files WHERE bp = ? AND exported = 0 LIMIT 15").bind(bp).all()).results;
  for (const u of uploads) {
    const obj = await env.FILES.get(`${bp}/${u.path}`);
    if (obj) files[u.path] = new Uint8Array(await obj.arrayBuffer());
  }
  const who = (await env.DB.prepare("SELECT DISTINCT by_name FROM events WHERE bp = ? AND seq > ?").bind(bp, adv.exported_seq).all()).results.map(r => r.by_name);
  const ids = recs.map(r => r.id);
  const message = `Studio: ${ids.slice(0, 8).join(", ") || "comments"}${ids.length > 8 ? ` and ${ids.length - 8} more` : ""} (${who.join(", ")})`;
  const sha = Object.keys(files).length ? await commit(env, adv.repo, files, message) : null;
  await env.DB.prepare("UPDATE adventures SET exported_seq = ?, exported_at = ?, last_commit = COALESCE(?, last_commit) WHERE bp = ?").bind(top, now(), sha, bp).run();
  for (const u of uploads) await env.DB.prepare("UPDATE files SET exported = 1 WHERE bp = ? AND path = ?").bind(bp, u.path).run();
  return { committed: !!sha, sha, files: Object.keys(files).length };
}

// ---------- files ----------

const KIND = t => /^image\//.test(t) ? "image" : /^audio\//.test(t) ? "audio" : /^text\//.test(t) ? "text" : "print";

async function upload(env, adv, request, url, name) {
  const recordId = url.searchParams.get("record");
  const fname = String(url.searchParams.get("name") || "").toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+/, "").slice(0, 80);
  if (!fname || !/\.[a-z0-9]{1,5}$/.test(fname)) fail(400, "the file needs a name with an extension");
  const owner = await env.DB.prepare("SELECT type, data FROM records WHERE bp = ? AND id = ?").bind(adv.bp, recordId).first();
  if (!owner) fail(404, "no record " + recordId);
  const size = Number(request.headers.get("Content-Length") || 0);
  if (size > MAX_FILE) fail(413, "files up to 20 MB");
  const type = request.headers.get("Content-Type") || "application/octet-stream";
  let path = `assets/${fname}`;
  if (await env.DB.prepare("SELECT 1 FROM files WHERE bp = ? AND path = ?").bind(adv.bp, path).first()) path = `assets/${Date.now().toString(36)}-${fname}`;
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > MAX_FILE) fail(413, "files up to 20 MB");
  await env.FILES.put(`${adv.bp}/${path}`, bytes, { httpMetadata: { contentType: type } });
  await env.DB.prepare("INSERT OR REPLACE INTO files (bp, path, type, size, by_name, at, exported) VALUES (?, ?, ?, ?, ?, ?, 0)").bind(adv.bp, path, type, bytes.byteLength, name, now()).run();
  const set = { kind: KIND(type), file: path, status: "built" };
  if (owner.type === "prop") set.for = recordId; else set.links = [recordId];
  return createRecord(env, adv, "asset", fname.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "), set, `Uploaded in the Studio by ${name}.`, name);
}

async function file(env, adv, path) {
  if (path.includes("..")) fail(400, "bad path");
  const obj = await env.FILES.get(`${adv.bp}/${path}`);
  if (obj) return new Response(obj.body, { headers: { "Content-Type": obj.httpMetadata?.contentType || "application/octet-stream", "Cache-Control": "private, max-age=3600" } });
  const h = { "User-Agent": "escapepack-studio" };
  if (env.GITHUB_TOKEN) h.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  const res = await fetch(`https://raw.githubusercontent.com/${adv.repo}/main/${path.split("/").map(encodeURIComponent).join("/")}`, { headers: h });
  if (!res.ok) fail(404, "no file " + path);
  const ext = path.split(".").pop().toLowerCase();
  const types = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml", pdf: "application/pdf" };
  return new Response(res.body, { headers: { "Content-Type": types[ext] || "application/octet-stream", "Cache-Control": "private, max-age=3600" } });
}
