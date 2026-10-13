-- escapepack-studio (Cloudflare D1): the live copy of every adventure's design.
-- Records mirror the Markdown files in each adventure's GitHub repo (records/<folder>/<ID>-<slug>.md);
-- the Worker snapshots changed records back to GitHub. Every write adds an event; its seq orders changes
-- so pages can ask "what changed since seq N?".
-- Apply: npx wrangler d1 execute escapepack-studio --remote --file=../../db/studio.sql

CREATE TABLE IF NOT EXISTS adventures (
  bp            TEXT PRIMARY KEY,   -- slug, as in backpacks.txt: space, norse...
  repo          TEXT NOT NULL,      -- GitHub owner/repo
  config        TEXT NOT NULL,      -- backpack.json
  kit           TEXT NOT NULL,      -- {"ciphers": {...}, "templates": {"puzzle": "---\n..."}} from backpack-kit
  imported_at   TEXT,
  exported_seq  INTEGER NOT NULL DEFAULT 0,  -- every change up to this seq is in GitHub
  exported_at   TEXT,
  last_commit   TEXT
);

CREATE TABLE IF NOT EXISTS records (
  bp          TEXT NOT NULL,
  id          TEXT NOT NULL,        -- PZ-001
  type        TEXT NOT NULL,        -- premise | beat | puzzle | prop | question | asset
  rev         INTEGER NOT NULL DEFAULT 1,
  data        TEXT NOT NULL,        -- frontmatter fields as JSON (id, title, type, status...)
  body        TEXT NOT NULL DEFAULT '',
  front       TEXT NOT NULL,        -- original frontmatter lines, so comments survive the round trip
  path        TEXT NOT NULL,        -- records/puzzles/PZ-001-galileo-s-sky-map.md
  updated_at  TEXT NOT NULL,
  updated_by  TEXT NOT NULL,
  seq         INTEGER NOT NULL,
  PRIMARY KEY (bp, id)
);
CREATE INDEX IF NOT EXISTS records_by_seq ON records (bp, seq);

-- Every saved version, for undo, "who changed this" and merging edits made from an older copy.
CREATE TABLE IF NOT EXISTS history (
  bp TEXT NOT NULL, id TEXT NOT NULL, rev INTEGER NOT NULL,
  data TEXT NOT NULL, body TEXT NOT NULL, by_name TEXT NOT NULL, at TEXT NOT NULL,
  PRIMARY KEY (bp, id, rev)
);

-- Plain comments. Questions are question records (about: [ID]) shown in the same thread.
CREATE TABLE IF NOT EXISTS comments (
  cid        INTEGER PRIMARY KEY AUTOINCREMENT,
  bp         TEXT NOT NULL,
  record_id  TEXT NOT NULL,
  by_name    TEXT NOT NULL,
  text       TEXT NOT NULL,
  at         TEXT NOT NULL,
  deleted    INTEGER NOT NULL DEFAULT 0,
  seq        INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS comments_by_seq ON comments (bp, seq);

-- The activity feed, and the change counter (seq) for everything above.
CREATE TABLE IF NOT EXISTS events (
  seq        INTEGER PRIMARY KEY AUTOINCREMENT,
  bp         TEXT NOT NULL,
  record_id  TEXT,
  by_name    TEXT NOT NULL,
  action     TEXT NOT NULL,         -- "marked decided", "commented on"...
  at         TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS events_by_bp ON events (bp, seq);

-- Uploaded files live in R2 under <bp>/<path>; an asset record points at them. exported = in GitHub.
CREATE TABLE IF NOT EXISTS files (
  bp TEXT NOT NULL, path TEXT NOT NULL, type TEXT, size INTEGER, by_name TEXT, at TEXT,
  exported INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bp, path)
);

CREATE TABLE IF NOT EXISTS people (
  email TEXT PRIMARY KEY,
  name  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS presence (
  bp TEXT NOT NULL, name TEXT NOT NULL, viewing TEXT, at INTEGER NOT NULL,
  PRIMARY KEY (bp, name)
);
