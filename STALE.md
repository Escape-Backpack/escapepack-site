# Stale files log

Log a file here the moment it stops being the current version, instead of deleting it on the spot.
At the end of the project, review the table once: archive or delete everything marked `pending`.

**Rule for humans and agents:** when you replace, supersede or stop using a file, add one row.
When you create a throwaway file (preview, export, test output), log it too, status `temp`.

**Status values:** `pending` (not reviewed) · `keep` (reviewed, still needed) · `archived` (moved to `_archive/`) · `deleted` · `temp` (throwaway, delete at cleanup)

| Date | File or folder | Why it is stale | Replaced by | Status |
|------|----------------|-----------------|-------------|--------|
