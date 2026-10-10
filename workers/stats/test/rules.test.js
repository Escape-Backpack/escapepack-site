import { test } from "node:test";
import assert from "node:assert/strict";
import { judge, summarise } from "../src/rules.js";

// Lock times (cumulative active seconds) taken from the Hiking Google Sheet.
const run = (id, team, lock_times, extra = {}) => ({ session_id: id, team, is_test: 0, lock_times, hints: [], ...extra });
const TITI = run("titi", "Titi", [867, 1233, 1526, 2394, 4168, 4169, 4591, 5271, 5925, 6474], { finished_at: "x", elapsed_s: 6486 });
const FUKWITZ = run("fuk", "Fukwitz", [3, 5, 6, 939, 1670, 2271, 2522, 3046, 3500, 3618], { finished_at: "x", elapsed_s: 3627 });
const PICKERZ = run("pick", "Team lock pickerz", [766, 766, 774, 1985, 1985, 1985, 1985, 1985, 1985, 1985], { finished_at: "x", elapsed_s: 1985 });
const AUDREY = run("aud", "Audrey", [6, 6, 6, 6, 6, 6, 6, 133, 942, 2004]);

test("a full, normal run counts; one batch-marked lock drops only that lock", () => {
  const j = judge(TITI);
  assert.equal(j.counts, true);
  assert.equal(j.total, 6486);
  assert.equal(j.splits[5], null); // lock 6 marked 1 s after lock 5
  assert.equal(j.splits[4], 4168 - 2394);
});

test("lock 1 marked in the first minute: a continued game, total left out", () => {
  assert.equal(judge(FUKWITZ).reason, "continued");
  const a = judge(AUDREY);
  assert.equal(a.reason, "continued");
  assert.equal(a.total, 2004); // no Done tap, but every lock solved
  assert.equal(a.splits[8], 942 - 133); // its own later locks still count
});

test("tests, unfinished and short runs are left out", () => {
  assert.equal(judge(run("t", "Test1", [44, 140, 187, 189, 190, 191, 191, 192, 193, 194], { finished_at: "x", elapsed_s: 200 })).reason, "test");
  assert.equal(judge(run("k", "Kelvinists", [14, 16, 18, 1472, 1476, 1486, null, 1545, 1600, null])).reason, "unfinished");
  assert.equal(judge(run("s", "Quick", [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], { finished_at: "x", elapsed_s: 1000 })).reason, "short");
  assert.equal(judge(PICKERZ).counts, true); // 33 min passes; its batch-marked locks drop out
  assert.deepEqual(judge(PICKERZ).splits.filter(x => x != null), [766, 1985 - 774]);
});

test("summary leaves your own run out and places it", () => {
  const many = Array.from({ length: 10 }, (_, i) => run("r" + i, "T" + i, [600, 1200, 1800, 2400, 3000, 3600, 4200, 4800, 5400, 4000 + 1500 + i * 300].sort((a, b) => a - b), { finished_at: "x", elapsed_s: 5500 + i * 300 }));
  const s = summarise([...many, TITI, FUKWITZ], "titi");
  assert.equal(s.count, 10); // Fukwitz out, Titi is "you"
  assert.equal(s.you.counts, true);
  assert.equal(s.you.faster_than, 60); // 6486 s beats 6 of 10 (6700 ... 8200)
  assert.equal(summarise([TITI, PICKERZ], "titi").you.faster_than, null); // too few runs to compare
});
