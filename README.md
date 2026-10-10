# escapepack.ca

The public Escape Backpack site. Files live here on GitHub; Cloudflare Pages serves
them (no build step, output directory `/`). The design is Codex's site draft,
promoted from `escape-backpack-games/draft/` on 2026-09-27.

## Planned structure (agreed 2026-09-30, not built yet)

One domain, one Cloudflare Pages project (this repo). No per-backpack subdomains.

| Path | What | Who sees it | Source |
|---|---|---|---|
| `/adventures/<game>/` | Public page for each adventure (story, borrowing, reset) | everyone | hand-made, in this repo |
| `/play/<game>/` | Digital versions of the games | everyone | packaged into this repo (as `play/norse/leif/` today) |
| `/design/<game>/` | Brainstorm boards (Space, Hockey, Canada...) and designer tools (`design/clues/`) | anyone with the link (`noindex`); Access login deferred | built from each backpack repo by `backpack-kit` |
| `/help/<game>/` | Hint pages, the printed QR destination | everyone | hand-made or copied from the backpack build |

How it will work:
1. **Build:** `build.sh` clones `backpack-kit` and each backpack repo listed in
   `backpacks.txt`, runs `kit.py build` for each, and puts the result in `design/<game>/`.
   Each game's generated hint page goes to `help/<game>/`. Pages settings change from
   "no build step" to build command `bash build.sh`.
2. **Protection:** none for now (decided 2026-09-30: low traffic). Pages are `noindex`, so
   search engines skip them, but anyone with the link can open them. If needed later: one
   Cloudflare Access application on `escapepack.ca/design/*`, login by one-time email code,
   allowing the designers' emails. It covers every design board and the Clue Library.
3. **Private backpack repos:** the build reads them with a read-only GitHub token stored as a
   Cloudflare environment variable. `backpack-kit` stays public.
4. **Rebuild on backpack push:** each backpack repo has a small GitHub Action that calls this
   project's Cloudflare deploy hook (URL stored as a repo secret).
5. **Old links:** `hiking.html` etc. redirect to `/adventures/...` in `_redirects`.
   `/help/` paths never move. `/help/space/` stops redirecting to `space-design.escapepack.ca`
   (that subdomain was never set up) and serves the built hint page directly.

Migration checklist:
- [x] `build.sh` + `backpacks.txt`, tested locally (Claude)
- [ ] Move public pages to `/adventures/<game>/` and add redirects (Claude)
- [x] Cloudflare: build command `bash build.sh`, deploy hook (designer). `GITHUB_TOKEN` only needed once a backpack repo is private.
- [ ] (deferred) Cloudflare Access on `/design/*` with both designers' emails (designer)
- [x] Deploy-hook Action in `Space-Exploration` (`rebuild-site.yml`, org secret `SITE_DEPLOY_HOOK`)
- [ ] Turn off Space's old GitHub Pages copy (`pages.yml`)
- [ ] Update `backpack-kit` README and project templates to match (drop `<backpack>-design` subdomains)

## Pages

Designer resource: `design/clues/` contains the Clue Library (search/filters, visual
examples and a browser-local shortlist). It sits under `/design/`, which is public but
`noindex` (an Access login can be added later). It moved from `designer/clues/`
(redirected). See `design/clues/README.md`.

| Path | What |
|---|---|
| `index.html` | Home: all adventures, how it works, player help |
| `play/norse/leif/` | Norse online playtest (The Raven Inheritance): the whole game, 13 locks across four trails and the final route, with original prop artwork, hints, local saves, tablet support, optional shared rooms (“Play together”), sound, an ending with a shareable result and printable certificate, and built-in feedback. |
| `play/hiking/` | Hiking online playtest: all ten locks, laptop first, local saves. **Unlisted**: no homepage link while the physical backpack is lent out (it would give away every answer); `noindex`. |
| `hiking.html` | The Hiking Backpack: story, facts, borrowing, hints and reset links |
| `borrow.html`, `feedback.html` | Forms (Formspree). `forms.js` shows success only after Formspree confirms. |
| `help/` | Player help. `help/<game>/` is the **stable QR destination** for each game. |
| `site.css`, `site-pages.css` | Styles for the pages above |
| `styles.css` | The older stylesheet, still used by the legacy pages below |
| `norse-hints.html`, `hiking-hints.html`, `hiking-reset.html`, `hiking-old.html`, `Harold.html` | Legacy pages, kept so existing links keep working |
| `_redirects` | Cloudflare redirects. QR paths under `/help/` must never be removed once printed. |
| `404.html` | Shown for any unknown address. Cloudflare serves it at that address, so its links are root-relative (`/site.css`). |

## Hiking online playtest

`/play/hiking/` is packaged from the design repository's `Hiking_Trip/Digital/`
(`index.html`, the three stylesheets, `game-data.js`, `clues.js`, `later.js`, `game.js`,
the 3D Lego puzzle modules `lego-*.js` / `lego3d.js` and `assets/`, which holds their
Stud.io `.ldr` exports). Edit those, then run `node tools/build_hiking.cjs` from this repository
(optional argument: another absolute path to that `Digital` folder). The script strips the
design record from `index.html` (it lists every code), links the brand to the homepage,
and checks that every referenced asset and imported module was copied. The 3D puzzles
load Three.js from jsdelivr through the page's import map, so lock 7 needs a connection; the page
fonts (Young Serif, Inter Tight) come from Google Fonts. The look follows the Norse playtest (DG-H24). Answers are checked locally and are
inspectable in JavaScript. The design record is the source page opened with `?design=1`.

## Norse online playtest

`/play/norse/leif/` is packaged from the design repository's
`NorseBackpack/Digital/Leif.html`, `leif.css`, `leif.js`, and `leif-data.js`.
Edit those source files, then run `node tools/build_leif.cjs` from this repository.
An optional argument supplies a different absolute path to the source `Digital`
directory. The default assumes the current sibling checkout arrangement.

The packaging script copies referenced player artwork and the font, rewrites paths
into a self-contained `assets/` directory, and checks references. It does not
publish the brainstorm page, tests, or solution PDFs. The pilot is labelled as a
playtest and remains `noindex`; this is not access control. Lock answers are checked
locally and are inspectable in JavaScript. Saves belong to the browser/origin;
players can move progress using the save-copy controls. The homepage links to it.

### Online-edition extras (October 2026)

- **Source files** now also include `leif-sound.js` (synthesised sound, no audio files),
  `leif-room.js` (Play together client) and `assets/Caveat-Medium.woff2` (Liv's handwriting,
  SIL OFL, licence in `assets/Caveat-OFL.txt`). `tools/build_leif.cjs` packages them.
- **Play together** needs the `escapepack-rooms` Worker (folder next to this repository):
  `npx wrangler deploy` there, then put its `wss://` address in `Leif.html`'s
  `<meta name="rooms-server">` and rebuild. While that is empty the button stays hidden.
  To test on this computer: `npx wrangler dev` in that folder, then open
  `Leif.html?rooms=ws://localhost:8787` from a local server.
- **Feedback** from the game posts to the same Formspree form as `feedback.html`, with
  `game: norse-online` and optional per-lock stats (time, hints, wrong tries, ratings).
- **Analytics**: the game calls `zaraz.track` only if Zaraz is present (`lock_opened`,
  `puzzle_rated`, `game_completed`, `room_joined`, `certificate_printed`, `feedback_submitted`).
- Liv's opening note (quoted from postcard L1) and closing letter live in `STORY` in `leif-data.js`.
  The screen never groups keepsakes by trail: which cards belong together is part of the final riddle.

## Hiking help pages
`help/hiking/hints/` and `help/hiking/reset/` are generated. Don't edit them by hand:

```
python tools/build_help.py
```

It reads `hiking-hints.html` and `hiking-reset.html`, extracts their embedded images
into `help/hiking/media/`, and writes lighter copies (1.4 MB → 42 KB, 4.1 MB → 26 KB).

## Hint-page stats and game codes
The hint pages log each run to Cloudflare D1 (`escapepack-stats`, one database for every backpack)
through the `escapepack-stats` Worker on `escapepack.ca/api/*` (`workers/stats/`, schema in
`db/schema.sql`). Teammates join a run on another phone with its 5-letter game code and share the
timer and hints; the end screen compares the team with earlier teams once 10 runs count. Which runs
count (no tests, every lock solved, 30 min to 4 h, lock 1 not marked in the first minute; a single
lock under 3 min drops only that lock's time) is decided when stats are read, in
`workers/stats/src/rules.js`, so it can change without losing data.

- Page side: `sync.js` (copied from `backpack-kit/viewer/sync.js` by `tools/build_help.py`) for the
  Hiking page; kit-built pages inline it when `backpack.json` has `stats`.
- Deploy the Worker: `cd workers/stats && npx wrangler deploy`. Tests: `node --test` there.
- Look at the data: Cloudflare dashboard → D1 → escapepack-stats → Console, or
  `npx wrangler d1 execute escapepack-stats --remote --command "SELECT * FROM runs"`.
- The old Google Sheet runs were imported with `tools/import_sheet_logs.py` (`source = 'sheet-import'`).
- Local test: `npx wrangler dev` in `workers/stats`, then open a hint page with
  `?api=http://127.0.0.1:8787/api` (Hiking) from a local server on port 8742.

## Norse help page
`help/norse/hints/` is the kit-built hint page from the design repository (`NorseBackpack/`,
`python ../backpack-kit/kit.py build`, then copy `site/hints/index.html` here). Norse is not in
`backpacks.txt` yet because its records live in a subfolder of the design repository. The old
`norse-hints.html` redirects to it. `help/norse/reset/` is the kit-built reset checklist
(`publish_reset` in `backpack.json`; copy `site/reset/index.html` here after a rebuild).

## Space Exploration
`/help/space/` redirects to the kit-generated hint page at
`https://space-design.escapepack.ca/hints/` (see `_redirects`).

## Analytics
Cloudflare Web Analytics counts page views once enabled on the Pages project.
`analytics.js` sends named, non-personal events (`hint_revealed`, `game_completed`,
`borrow_request_submitted`, ...) through `zaraz.track()`, only after Zaraz is set up
on the domain. No names, emails, team names, answers or form text are sent.

## Still to confirm (from Codex's draft notes)
- Borrowing cost or deposit, if any
- How to describe the Ottawa pickup area
- Whether to state the no-shipping policy
- Wording for future-game update emails, and a data-retention/privacy notice
