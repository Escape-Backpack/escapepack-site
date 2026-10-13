// GitHub in and out.
//   download(): one tarball per repo (a Worker may only make ~50 requests per call, and an adventure has
//     more files than that), keeping only the files asked for.
//   commit(): one commit with many files through the Git Data API. Text files go inline in the tree;
//     binary files (uploads) become blobs first.

const DEFAULT_API = "https://api.github.com";
const api = env => env.GITHUB_API || DEFAULT_API; // GITHUB_API: a fake GitHub for local tests only

function headers(env, extra = {}) {
  const h = { "User-Agent": "escapepack-studio", Accept: "application/vnd.github+json", ...extra };
  if (env.GITHUB_TOKEN) h.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  return h;
}

async function gh(env, method, path, body) {
  const res = await fetch(api(env) + path, { method, headers: headers(env, body ? { "Content-Type": "application/json" } : {}), body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`GitHub ${method} ${path}: ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

// Reads a .tar stream and yields { path, bytes } for entries whose path (minus the top folder) passes want().
async function* untar(stream, want) {
  const reader = stream.getReader();
  let buf = new Uint8Array(0), done = false;
  const need = async n => {
    while (buf.length < n && !done) {
      const r = await reader.read();
      if (r.done) { done = true; break; }
      const next = new Uint8Array(buf.length + r.value.length);
      next.set(buf); next.set(r.value, buf.length); buf = next;
    }
    return buf.length >= n;
  };
  const take = n => { const out = buf.slice(0, n); buf = buf.slice(n); return out; };
  const str = (b, a, z) => new TextDecoder().decode(b.subarray(a, z)).replace(/\0.*$/s, "");
  let longName = null;
  while (await need(512)) {
    const h = take(512);
    if (h.every(x => x === 0)) break;
    const size = parseInt(str(h, 124, 136).trim() || "0", 8);
    const type = String.fromCharCode(h[156] || 48);
    const prefix = str(h, 345, 500);
    let name = longName || (prefix ? prefix + "/" : "") + str(h, 0, 100);
    longName = null;
    const padded = Math.ceil(size / 512) * 512;
    const rel = name.split("/").slice(1).join("/");
    const keep = (type === "0" || type === "\0") && want(rel);
    const isPax = type === "x";
    if (keep || isPax) {
      await need(padded);
      const data = take(padded).subarray(0, size);
      if (isPax) {
        const m = new TextDecoder().decode(data).match(/\d+ path=([^\n]*)\n/);
        if (m) longName = m[1];
      } else yield { path: rel, bytes: data };
    } else {
      let left = padded;
      while (left > 0) { await need(Math.min(left, 65536)); const n = Math.min(left, buf.length); take(n); left -= n; if (!n) break; }
    }
  }
  reader.releaseLock();
}

export async function download(env, repo, want, ref = "main") {
  const res = await fetch(`${api(env)}/repos/${repo}/tarball/${ref}`, { headers: headers(env) });
  if (!res.ok) throw new Error(`could not download ${repo}: ${res.status}`);
  const files = {};
  for await (const f of untar(res.body.pipeThrough(new DecompressionStream("gzip")), want)) files[f.path] = f.bytes;
  return files;
}

// files: { path: string (text) | Uint8Array (binary) }. Returns the new commit sha, or null if nothing changed.
export async function commit(env, repo, files, message, branch = "main") {
  const ref = await gh(env, "GET", `/repos/${repo}/git/ref/heads/${branch}`);
  const head = await gh(env, "GET", `/repos/${repo}/git/commits/${ref.object.sha}`);
  const tree = [];
  for (const [path, content] of Object.entries(files)) {
    if (typeof content === "string") tree.push({ path, mode: "100644", type: "blob", content });
    else {
      let bin = "";
      for (let i = 0; i < content.length; i += 0x8000) bin += String.fromCharCode(...content.subarray(i, i + 0x8000));
      const blob = await gh(env, "POST", `/repos/${repo}/git/blobs`, { content: btoa(bin), encoding: "base64" });
      tree.push({ path, mode: "100644", type: "blob", sha: blob.sha });
    }
  }
  if (!tree.length) return null;
  const t = await gh(env, "POST", `/repos/${repo}/git/trees`, { base_tree: head.tree.sha, tree });
  if (t.sha === head.tree.sha) return null;
  const c = await gh(env, "POST", `/repos/${repo}/git/commits`, { message, tree: t.sha, parents: [head.sha] });
  await gh(env, "PATCH", `/repos/${repo}/git/refs/heads/${branch}`, { sha: c.sha });
  return c.sha;
}
