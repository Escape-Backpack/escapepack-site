import { test } from "node:test";
import assert from "node:assert/strict";
import { commit } from "../src/github.js";

// commit() against a fake GitHub: text inline in the tree, binaries as blobs, then commit + move the branch.
test("commit builds one commit from text and binary files", async () => {
  const calls = [];
  globalThis.fetch = async (url, opts = {}) => {
    const path = url.replace("https://api.github.com", ""), body = opts.body ? JSON.parse(opts.body) : null;
    calls.push([opts.method, path, body]);
    const reply = {
      "GET /repos/o/r/git/ref/heads/main": { object: { sha: "c1" } },
      "GET /repos/o/r/git/commits/c1": { sha: "c1", tree: { sha: "t1" } },
      "POST /repos/o/r/git/blobs": { sha: "b1" },
      "POST /repos/o/r/git/trees": { sha: "t2" },
      "POST /repos/o/r/git/commits": { sha: "c2" },
      "PATCH /repos/o/r/git/refs/heads/main": {},
    }[`${opts.method} ${path}`];
    return new Response(JSON.stringify(reply), { status: reply ? 200 : 404 });
  };
  const sha = await commit({ GITHUB_TOKEN: "x" }, "o/r", { "records/a.md": "---\nid: A\n---\n", "assets/x.png": new Uint8Array([137, 80, 78, 71]) }, "Studio: A");
  assert.equal(sha, "c2");
  const tree = calls.find(c => c[1].endsWith("/git/trees"))[2];
  assert.equal(tree.base_tree, "t1");
  assert.deepEqual(tree.tree.map(t => [t.path, t.content ? "inline" : t.sha]), [["records/a.md", "inline"], ["assets/x.png", "b1"]]);
  assert.equal(calls.find(c => c[1].endsWith("/git/blobs"))[2].content, btoa(String.fromCharCode(137, 80, 78, 71)));
  assert.deepEqual(calls.find(c => c[1].endsWith("/git/commits") && c[0] === "POST")[2], { message: "Studio: A", tree: "t2", parents: ["c1"] });
  assert.deepEqual(calls.at(-1), ["PATCH", "/repos/o/r/git/refs/heads/main", { sha: "c2" }]);
});
