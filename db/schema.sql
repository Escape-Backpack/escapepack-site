-- escapepack-stats (Cloudflare D1): one row per team run, for every backpack.
-- Raw data only. Which runs count for comparisons is decided when stats are read
-- (workers/stats/src/rules.js), so the rules can change without losing anything.

CREATE TABLE IF NOT EXISTS runs (
  session_id      TEXT PRIMARY KEY,   -- made by the hint page, e.g. s1790380901649_67c
  code            TEXT UNIQUE,        -- game code other phones join with; NULL for imported runs
  backpack        TEXT NOT NULL,      -- slug: hiking, norse, space...
  version         TEXT NOT NULL,      -- game version; runs of different versions are never compared
  team            TEXT,
  team_size       INTEGER,            -- optional
  started_at      TEXT,               -- ISO 8601 UTC, for reading in the console
  updated_at      TEXT,
  finished_at     TEXT,               -- when the team tapped Done; NULL if they never did
  -- Timer, in server milliseconds (web runs only). Active time = now - started - paused.
  started_ms      INTEGER,
  paused_total_ms INTEGER NOT NULL DEFAULT 0,
  paused_since_ms INTEGER,            -- set while paused
  finished_ms     INTEGER,
  elapsed_s       INTEGER,            -- active seconds: final once finished, else at the last update
  locks_total     INTEGER NOT NULL,
  lock_times      TEXT NOT NULL,      -- JSON array, one per lock: active seconds when marked solved, or null
  hints           TEXT NOT NULL,      -- JSON array, one per lock: levels opened (0 = hint 1 ...; the last level is the solution)
  device          TEXT,
  browser         TEXT,
  is_test         INTEGER NOT NULL DEFAULT 0,
  source          TEXT NOT NULL,      -- web | sheet-import
  rev             INTEGER NOT NULL DEFAULT 0  -- bumped on every write; stops two phones overwriting each other
);

CREATE INDEX IF NOT EXISTS runs_by_game ON runs (backpack, version);
