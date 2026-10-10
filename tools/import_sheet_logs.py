"""Turn the Hiking hint page's Google Sheet export (one tab per event type) into runs for D1.

    python -I tools/import_sheet_logs.py <workbook.xlsx> <out.sql>

Writes INSERT OR IGNORE statements for db/schema.sql's runs table, so running the import again
after a newer export only adds new sessions. Load with:

    npx wrangler d1 execute escapepack-stats --remote --file=<out.sql>

Lock times in the Sheet are already active time (the page's timer leaves pauses out).
Sheet timestamps are in the spreadsheet's local time; started_at comes from the session ID,
which holds the start time in UTC milliseconds.
"""
import collections, datetime, json, re, sys

import openpyxl

BACKPACK, VERSION, LOCKS = "hiking", "hiking-v1", 10
LEVELS = {"💡 Hint #1": 0, "💡 Hint #2": 1, "💡 Hint #3": 2, "✅ Solution": 3}
TEST_NAME = re.compile(r"\btest", re.I)


def tabs(path):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    return {ws.title: [r for r in list(ws.iter_rows(values_only=True))[1:] if r and r[1]] for ws in wb.worksheets}


def utc_from_session(sid):
    ms = int(re.match(r"s(\d+)_", sid).group(1))
    return datetime.datetime.fromtimestamp(ms / 1000, datetime.timezone.utc)


def iso(dt):
    return dt.astimezone(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ") if dt else None


def runs(t):
    # The Sheet's local-time offset, from a start row against its session ID (same moment).
    first = t["start"][0]
    offset = round((first[0] - utc_from_session(first[1]).replace(tzinfo=None)).total_seconds() / 3600)
    local = datetime.timezone(datetime.timedelta(hours=offset))

    out = collections.OrderedDict()
    def run(sid, team=None):
        r = out.setdefault(sid, {"team": None, "last": None, "locks": [None] * LOCKS,
                                 "hints": [[] for _ in range(LOCKS)], "done": None, "elapsed": 0,
                                 "device": None, "browser": None})
        if team and not r["team"]:
            r["team"] = str(team).strip()
        return r
    def seen(r, ts, elapsed=None):
        ts = ts.replace(tzinfo=local)
        r["last"] = max(r["last"], ts) if r["last"] else ts
        if elapsed is not None:
            r["elapsed"] = max(r["elapsed"], int(elapsed))

    for ts, sid, team, *_ in t.get("start", []):
        seen(run(sid, team), ts)
    for ts, sid, team, _bp, idx, _name, el, *_ in t.get("lock_solved", []):
        r = run(sid, team); seen(r, ts, el)
        r["locks"][int(idx) - 1] = int(el)
    for ts, sid, team, _bp, idx, _name, level, el, *_ in t.get("hint_opened", []):
        r = run(sid, team); seen(r, ts, el)
        lv = LEVELS.get(level)
        if lv is not None and lv not in r["hints"][int(idx) - 1]:
            r["hints"][int(idx) - 1].append(lv)
    for tab in ("pause", "resume"):
        for ts, sid, el, *_ in t.get(tab, []):
            seen(run(sid), ts, el)
    for row in t.get("complete", []):
        ts, sid, team, _bp, el = row[:5]
        r = run(sid, team); seen(r, ts, el)
        r["done"] = ts.replace(tzinfo=local)
        r["elapsed"] = int(el)
        r["device"], r["browser"] = row[19], row[20]
    return out


def sql_value(v):
    if v is None:
        return "NULL"
    if isinstance(v, int):
        return str(v)
    return "'" + str(v).replace("'", "''") + "'"


def main(src, dest):
    rows = []
    for sid, r in runs(tabs(src)).items():
        values = [sid, BACKPACK, VERSION, r["team"], None, iso(utc_from_session(sid)), iso(r["last"]),
                  iso(r["done"]), r["elapsed"], LOCKS, json.dumps(r["locks"]), json.dumps(r["hints"]),
                  r["device"], r["browser"], int(bool(TEST_NAME.search(r["team"] or ""))), "sheet-import"]
        rows.append("INSERT OR IGNORE INTO runs (session_id, backpack, version, team, team_size, started_at, "
                    "updated_at, finished_at, elapsed_s, locks_total, lock_times, hints, device, browser, "
                    "is_test, source) VALUES (" + ", ".join(map(sql_value, values)) + ");")
    with open(dest, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(rows) + "\n")
    print(f"{len(rows)} runs -> {dest}")


if __name__ == "__main__":
    main(*sys.argv[1:3])
