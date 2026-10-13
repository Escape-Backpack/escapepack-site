# Escape Studio

The live, shared design board at **escapepack.ca/studio/**. You and your teammates edit an
adventure's story, puzzles and props together; changes show on everyone's screen within
about 2 seconds.

- **Real copy:** Cloudflare D1 (`escapepack-studio`). Uploaded files: R2 (`escapepack-studio-files`).
- **GitHub:** every 10 minutes (cron) or with **Save to GitHub now**, changed records are committed
  to the adventure's repo as the same Markdown files `backpack-kit` reads, so the design board,
  hint page and print page keep building as before. Comments go to `studio/comments.json`.
- **Login:** Cloudflare Access (one-time email code). The page asks each person's display name once.
- **Questions** stay `question` records (`about: [ID]`) and show as a thread on that record.
- **Same-time edits:** different fields merge; the same field changed by two people is refused for
  the second person, who sees the other version.
- **Claude / scripts:** `kit.py studio pull` writes the live records into `records/`, and
  `kit.py studio push` sends edits back (with an Access service token, see below).
- **Edits made directly in GitHub:** `POST /studio/api/a/<slug>/pull-github` takes them for records
  the Studio hasn't changed since its last snapshot and lists the rest as conflicts.

## Files
| File | What |
|---|---|
| `src/index.js` | API, cron snapshot, uploads |
| `src/github.js` | reading record files (one GraphQL request) and commits (Git Data API) |
| `src/markdown.js` | record files <-> JSON, keeping frontmatter comments |
| `src/auth.js` | Cloudflare Access check |
| `public/studio/index.html` | the page |
| `../../db/studio.sql` | schema |

## One-time setup
1. `npx wrangler d1 create escapepack-studio`, then paste its `database_id` into `wrangler.toml`.
2. `npx wrangler r2 bucket create escapepack-studio-files`
3. `npx wrangler d1 execute escapepack-studio --remote --file=../../db/studio.sql`
4. GitHub: a fine-grained token with **Contents: read and write** on the adventure repos, then
   `npx wrangler secret put GITHUB_TOKEN`.
5. Cloudflare dashboard → Zero Trust → Access → Applications → **Self-hosted**, domain
   `escapepack.ca`, path `studio`. Policy: **Allow**, emails of the designers. Copy the
   **Application Audience (AUD) tag** and your team name (`<team>.cloudflareaccess.com`) into
   `ACCESS_AUD` and `ACCESS_TEAM` in `wrangler.toml`.
6. For Claude: Access → Service credentials → **Service tokens** → create one; add a second policy
   to the application, action **Service Auth**, including that token. Claude sessions need
   `STUDIO_CLIENT_ID` and `STUDIO_CLIENT_SECRET` set to it.
7. `npx wrangler deploy`
8. Open escapepack.ca/studio/, add the adventure (short name + repo), and add
   `"studio": {"slug": "<short name>"}` to its `backpack.json`.

## Local test
```
npx wrangler d1 execute escapepack-studio --local --file=../../db/studio.sql
npx wrangler dev --local --port 8790 --var DEV_USER:you@example.com
```
Then open http://localhost:8790/studio/. Send `X-Dev-User: other@example.com` to act as a second
person, or `X-Dev-User: claude` as Claude. `kit.py studio pull|push` talks to it with
`STUDIO_URL=http://localhost:8790/studio`. Snapshots go to the real repo unless you also pass
`--var GITHUB_API:<fake GitHub URL>`. Tests: `node --test`.
