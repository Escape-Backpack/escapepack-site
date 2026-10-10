// Which runs count when teams are compared. Applied when stats are read, never when stored,
// so changing a number here re-judges every past run.
export const RULES = {
  minTotal: 30 * 60,      // whole runs under 30 min are left out
  maxTotal: 4 * 60 * 60,  // over 4 h: a pause was probably forgotten
  continuedFirst: 60,     // lock 1 marked solved in the first minute: the team carried on a game started elsewhere
  minLock: 3 * 60,        // a lock under 3 min (often several marked at once) leaves out that lock's time only
  maxLock: 90 * 60,
  minRuns: 10,            // fewer valid runs than this: no comparison shown
};

const TEST_NAME = /\btest/i;

export function parse(row) {
  return { ...row, lock_times: JSON.parse(row.lock_times || "[]"), hints: JSON.parse(row.hints || "[]") };
}

// One run: does its total count, and which per-lock times count.
export function judge(run) {
  const times = run.lock_times;
  const test = !!run.is_test || TEST_NAME.test(run.team || "");
  const solved = times.filter(t => t != null);
  const finished = times.length > 0 && solved.length === times.length;
  const total = run.finished_at || run.finished_ms ? run.elapsed_s : finished ? Math.max(...solved) : null;

  let reason = null;
  if (test) reason = "test";
  else if (!finished) reason = "unfinished";
  else if (times[0] < RULES.continuedFirst) reason = "continued";
  else if (total < RULES.minTotal) reason = "short";
  else if (total > RULES.maxTotal) reason = "long";

  // Each lock's time is the gap since the previous lock was marked, in the order they were marked.
  const order = times.map((t, i) => [t, i]).filter(([t]) => t != null).sort((a, b) => a[0] - b[0]);
  const splits = times.map(() => null);
  let prev = 0;
  for (const [t, i] of order) {
    const d = t - prev;
    prev = t;
    if (!test && d >= RULES.minLock && d <= RULES.maxLock) splits[i] = d;
  }
  return { counts: reason === null, reason, total, splits };
}

const median = xs => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b), m = s.length >> 1;
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};
const fasterThan = (mine, others) => others.length ? Math.round(100 * others.filter(t => t > mine).length / others.length) : null;

// Stats for one backpack version. `you` (a session_id) is left out of the comparison set
// and gets its own placing.
export function summarise(runs, you = null) {
  const judged = runs.map(r => ({ id: r.session_id, ...judge(r), locks: r.lock_times.length }));
  const others = judged.filter(j => j.id !== you);
  const totals = others.filter(j => j.counts).map(j => j.total).sort((a, b) => a - b);
  const nLocks = Math.max(0, ...judged.map(j => j.locks));
  const locks = Array.from({ length: nLocks }, (_, i) => {
    const xs = others.map(j => j.splits[i]).filter(x => x != null).sort((a, b) => a - b);
    return { count: xs.length, median: median(xs), times: xs };
  });
  const out = { rules: RULES, count: totals.length, median: median(totals), fastest: totals[0] ?? null, totals, locks };
  const mine = judged.find(j => j.id === you);
  if (mine) {
    out.you = {
      counts: mine.counts, reason: mine.reason, total: mine.total,
      faster_than: mine.counts && totals.length >= RULES.minRuns ? fasterThan(mine.total, totals) : null,
      locks: mine.splits.map((s, i) => s != null && locks[i] && locks[i].count >= RULES.minRuns ? fasterThan(s, locks[i].times) : null),
    };
  }
  return out;
}
