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
| `/design/<game>/` | Brainstorm boards (Space, Hockey, Canada...) and designer tools (`design/clues/`) | only people allowed by Cloudflare Access | built from each backpack repo by `backpack-kit` |
| `/help/<game>/` | Hint pages, the printed QR destination | everyone | hand-made or copied from the backpack build |

How it will work:
1. **Build:** `build.sh` clones `backpack-kit` and each backpack repo listed in
   `backpacks.txt`, runs `kit.py build` for each, and puts the result in `design/<game>/`.
   Each game's generated hint page goes to `help/<game>/`. Pages settings change from
   "no build step" to build command `bash build.sh`.
2. **Protection:** one Cloudflare Access application on `escapepack.ca/design/*`, login by
   one-time email code, allowing the designers' emails. It covers every future design board.
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
- [ ] Cloudflare: build command, `GITHUB_TOKEN` variable, deploy hook (designer, in the dashboard)
- [ ] Cloudflare Access on `/design/*` with both designers' emails (designer)
- [ ] Deploy-hook Action in `Space-Exploration`; then make it private and turn off its GitHub Pages
- [ ] Update `backpack-kit` README and project templates to match (drop `<backpack>-design` subdomains)

## Pages

Local designer-resource draft: `designer/clues/` contains the migrated Clue Library,
search/filters, visual examples and a browser-local shortlist. **Access is not
configured: do not publish this draft before resolving protection and source
visibility.** See `designer/clues/README.md`.

| Path | What |
|---|---|
| `index.html` | Home: all adventures, how it works, player help |
| `play/norse/leif/` | Solo Norse opening-chapter playtest: three locks, original prop artwork, hints and local saves |
| `hiking.html` | The Hiking Backpack: story, facts, borrowing, hints and reset links |
| `borrow.html`, `feedback.html` | Forms (Formspree). `forms.js` shows success only after Formspree confirms. |
| `help/` | Player help. `help/<game>/` is the **stable QR destination** for each game. |
| `site.css`, `site-pages.css` | Styles for the pages above |
| `styles.css` | The older stylesheet, still used by the legacy pages below |
| `norse-hints.html`, `hiking-hints.html`, `hiking-reset.html`, `hiking-old.html`, `Harold.html` | Legacy pages, kept so existing links keep working |
| `_redirects` | Cloudflare redirects. QR paths under `/help/` must never be removed once printed. |

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

## Hiking help pages
`help/hiking/hints/` and `help/hiking/reset/` are generated. Don't edit them by hand:

```
python tools/build_help.py
```

It reads `hiking-hints.html` and `hiking-reset.html`, extracts their embedded images
into `help/hiking/media/`, and writes lighter copies (1.4 MB → 42 KB, 4.1 MB → 26 KB).

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
