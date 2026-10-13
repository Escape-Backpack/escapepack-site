import { test } from "node:test";
import assert from "node:assert/strict";
import { parse, serialize, format } from "../src/markdown.js";

const FILE = `---
id: PZ-001
title: Galileo's sky map
type: puzzle
# idea | candidate | decided | built | parked
status: candidate
props: [PP-005, PP-006]
needs:
  - PZ-002
difficulty: 2
answer: "8247"
links: []
---

## How it works
Line one.
`;

test("parse reads fields, lists and numbers like the kit", () => {
  const { data, body } = parse(FILE);
  assert.equal(data.title, "Galileo's sky map");
  assert.deepEqual(data.props, ["PP-005", "PP-006"]);
  assert.deepEqual(data.needs, ["PZ-002"]);
  assert.equal(data.difficulty, 2);
  assert.equal(data.answer, "8247");
  assert.deepEqual(data.links, []);
  assert.equal(body, "## How it works\nLine one.");
});

test("serialize keeps comments and order, rewrites changed values, drops removed keys, appends new ones", () => {
  const { data, body, front } = parse(FILE);
  data.status = "decided";
  data.needs = ["PZ-002", "PZ-003"];
  delete data.links;
  data.turn = "Simon";
  const out = serialize(data, body, front);
  assert.match(out, /# idea \| candidate \| decided \| built \| parked\nstatus: decided\n/);
  assert.match(out, /needs: \[PZ-002, PZ-003\]\ndifficulty: 2/);
  assert.doesNotMatch(out, /links:/);
  assert.match(out, /turn: Simon\n---\n\n## How it works\nLine one.\n$/);
  assert.deepEqual(parse(out).data, data);
});

test("round trip without changes is stable", () => {
  const { data, body, front } = parse(FILE);
  const once = serialize(data, body, front);
  const p = parse(once);
  assert.equal(serialize(p.data, p.body, p.front), once);
});

test("format quotes text the kit would misread", () => {
  assert.equal(format("a # b"), '"a # b"');
  assert.equal(format("[not a list"), '"[not a list"');
  assert.equal(format("plain: text"), "plain: text");
  assert.equal(format(null), "");
  assert.equal(format(["A", "B"]), "[A, B]");
});
