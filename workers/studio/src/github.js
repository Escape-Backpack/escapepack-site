// GitHub in and out.
//   texts(): the text files under some folders, in ONE GraphQL request. (A Worker on the free plan gets
//     ~10 ms of CPU and ~50 requests per call, so no tarballs and no file-by-file downloads.)
//   commit(): one commit with many files through the Git Data API. Text files go inline in the tree;
//     binary files (uploads) become blobs first.
import { Buffer } from "node:buffer";

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

// files: ["backpack.json"]; folders: ["records"] (read two levels deep: records/<folder>/<file>).
// Returns { path: text }. Binary or very large files come back without text and are left out.
export async function texts(env, repo, { files = [], folders = [] }, ref = "HEAD") {
  const [owner, name] = repo.split("/");
  const blob = "... on Blob { text }";
  const level = inner => `... on Tree { entries { name type object { ${inner} } } }`;
  const parts = [
    ...files.map((f, i) => `f${i}: object(expression: ${JSON.stringify(`${ref}:${f}`)}) { ${blob} }`),
    ...folders.map((d, i) => `d${i}: object(expression: ${JSON.stringify(`${ref}:${d}`)}) { ${level(`${blob} ${level(blob)}`)} }`),
  ];
  const query = `query($owner: String!, $name: String!) { repository(owner: $owner, name: $name) { ${parts.join(" ")} } }`;
  const res = await fetch(api(env) + "/graphql", { method: "POST", headers: headers(env, { "Content-Type": "application/json" }), body: JSON.stringify({ query, variables: { owner, name } }) });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.data?.repository) throw new Error(`could not read ${repo}: ${data?.errors?.[0]?.message || res.status}`);
  const repoData = data.data.repository, out = {};
  files.forEach((f, i) => { const t = repoData[`f${i}`]?.text; if (t != null) out[f] = t; });
  const walk = (tree, prefix) => {
    for (const e of tree?.entries || []) {
      if (e.type === "blob" && e.object?.text != null) out[`${prefix}/${e.name}`] = e.object.text;
      else if (e.type === "tree") walk(e.object, `${prefix}/${e.name}`);
    }
  };
  folders.forEach((d, i) => walk(repoData[`d${i}`], d));
  return out;
}

// files: { path: string (text) | Uint8Array (binary) }. Returns the new commit sha, or null if nothing changed.
export async function commit(env, repo, files, message, branch = "main") {
  const ref = await gh(env, "GET", `/repos/${repo}/git/ref/heads/${branch}`);
  const head = await gh(env, "GET", `/repos/${repo}/git/commits/${ref.object.sha}`);
  const tree = [];
  for (const [path, content] of Object.entries(files)) {
    if (typeof content === "string") tree.push({ path, mode: "100644", type: "blob", content });
    else {
      const blob = await gh(env, "POST", `/repos/${repo}/git/blobs`, { content: Buffer.from(content).toString("base64"), encoding: "base64" });
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
