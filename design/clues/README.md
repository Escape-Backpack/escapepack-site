# Designer Clue Library

Local implementation for review at `/design/clues/` (moved from `/designer/clues/`). Uses its own Cryptic Bureau Archive theme and local font/logo assets. No framework or build step.

## Access: public, noindex

The designer area is public without authentication, as recorded in the site README (Access login deferred). The page includes puzzle examples and spoilers. An unlisted URL and `noindex` do not make it private. The designer requested committing and pushing the updated library on 2026-10-14; this supersedes the earlier local-preview publication hold. No access settings were changed.

## Files

- `index.html`: page structure, process prompts and evidence notes.
- `library.css`: responsive studio layout using shared site colours/fonts.
- `library-data.js`: migrated catalogue from the original `EscapeBackpack/clues.html`.
  This is now the editable catalogue for this new page; the old local page is retained
  as a legacy reference. Do not maintain both as active sources.
- `library.js`: search/filtering, illustrative SVGs, shortlist and idea brief export.
- `library-expansion.js`: 44 new technique/pattern briefs with stable IDs and
  illustrative examples; selected primary references carry review dates.
- `library-envelope.js`: four envelope-oriented briefs, editorial fit/reset/participation profiles and action grouping for the shortlist variety check.
- `library-guidance.js`: family checklists for the imported catalogue and six
  specific briefs for frequently useful existing techniques.

No public navigation link was added. Open `/design/clues/` directly.
The stable technique links use `#technique/<id>`. Explicit IDs are stored in
the two catalogue files; preserve them when renaming techniques.

## Behaviour and content assumptions

- Search terms are combined with all selected filters. Search does not silently
  discard the chosen category.
- Shortlists are local to the browser and origin; there is no account sync.
- Copy operations fall back to selectable text if clipboard access is unavailable.
- All imported examples are unverified unless explicitly identified as generic
  illustrations. No new playtest or implementation evidence is claimed.
- Difficulty is the original five-point estimate, not a measured score. The kit
  uses a different three-point scale, so the exported idea brief leaves it unset.
- Action, material and output tags are editorial starting points derived from
  technique names, categories and materials. They need refinement through use.
- Twelve diagrams demonstrate generic examples. They are not print masters.
- 215 entries across 13 categories: 54 specific briefs and 161 family checklists.
  Coverage is a breadth/depth inventory, not a completeness or playtest claim.
- Selected primary sources were reviewed on 2026-09-28: Puzzled Pint authoring,
  Nicholson's Ask Why, Audacity's Reverse/Change Tempo, Mathigon/Polypad Tangram,
  and Simon Tatham's Loopy/Towers rules (via indexed official text where direct
  retrieval timed out). Other references remain unverified.
- New entries are unrated. Every new build is a proposal requiring a prototype;
  no physical success, reset duration, production cost or difficulty is invented.

Corrections in this pass: the acrostic now has four initials producing MAPS;
Caesar/Atbash no longer assume prior cipher knowledge; the rail-fence example
provides a diagram; the marked-exhibit example explicitly provides reading order.

The exported idea brief now matches the expanded kit body headings. Create the
record with `kit.py new puzzle` first, then replace its whole body with the brief
(pasting it in addition duplicates every heading). Copy the technique link from the
brief's opening comment into the record's `technique:` field; copy it from the hosted
page, not a local preview, so it is not a localhost URL. This does
not assign record IDs, approve decisions or record a test result automatically.

## Initial local verification — 2026-09-28 (before expansion)

JavaScript syntax and whitespace checks passed. The browser loaded all 167
techniques and eight gallery examples without console errors. Checked combined
search/category and action/material filtering, zero results, save/remove,
shortlist persistence across reload, detail dialogs, copying an idea brief,
all eight gallery links and a direct technique URL. Inspected the desktop layout
and a 390px mobile viewport; the page had no horizontal document overflow.
Browser automation pointer clicks did not reliably activate controls; keyboard
activation was used for interaction checks. No physical props, external reference
links, authentication or production deployment were tested.

## Expansion verification — 2026-09-28

Verified 211 unique entries, 13 categories, 50 specific briefs and guidance for
every entry. JavaScript syntax checks passed. Browser checks covered the detail
filter, combined search, specific briefs, copying a kit-compatible idea brief,
the coverage view and all four added gallery links (12 diagrams total). No
console errors were reported. The updated desktop layout was inspected; the
browser's viewport override did not apply to this tab during the expanded mobile
check, so that check remains unverified. The earlier mobile check above applies
to the pre-expansion version only.

The kit regression suite passed eight tests; the existing Space Exploration
project still passes its 31-record structural check. Its generated Flow and
Setup & reset views were checked in the browser. Readiness gaps are intentionally
reported as missing evidence rather than filled with assumed design decisions.

## Envelope edition — 2026-10-14

Added paper sliders, paper weaving, reconstruction from multiple views and a story-timeline variation of constraint ordering. New examples are proposals, not print masters or playtest evidence. Stable existing IDs and browser shortlist storage are unchanged.

Envelope fit, reset and solo/group filters combine with all existing filters and search. Profiles use conservative family defaults plus explicit exceptions; they are editorial starting points, not measured size/cost/durability claims. Read each technique's build/reset details before adapting it. Unknown physical requirements remain “Needs prop prototype” or “Define in build”.

The shortlist compares broad action families across the whole saved set, even when filters hide cards. It excludes structure/combination patterns from action counts and flags repetition for review without assigning a score or assuming a play order. Exported briefs carry envelope guidance and use the current kit's envelope/needs terminology.

Design notes cover varied actions, several discoveries per envelope, quick symbol lookup, reliable confirmation, accidental-opening recovery, reusable materials and solo/parallel play. Corrected the digit-sum examples: 1972 and 1927 both total 19. Updated burst structure, one-digit-per-prop and folding guidance for reusable envelopes; unrelated historical lock examples remain labelled as imported and unverified.

Validation: Node syntax checks and git diff whitespace checks passed. Catalogue checks found 215 unique entries, 54 specific briefs, complete editorial profiles and valid guide technique links; original imported IDs remain. Enumerated the illustrative timeline orders and multiple-view placements: each has one valid arrangement. In-app browser over local HTTP: combined fit/reset/participation/search filters, clear and empty results, new detail dialog, clipboard brief export, shortlist save/remove/persistence and repeated-action warnings passed. The variety panel kept whole-shortlist counts while filtering. Coverage counts and guide links passed. Desktop and 390px mobile layouts inspected; fixed narrow mobile envelope selects. No console warnings/errors observed. Test shortlist entries removed. Physical prototypes, printing and repeated-use durability remain untested. No commit or deployment.

## Bureau Archive styling — 2026-10-14

At the designer's request, the Clue Library now uses the approved Bureau identity: burgundy #542C3B, ivory #F4EBDD and copper #B87650; Cormorant Garamond 600 headings/wordmark and Source Sans 3 400/600 body text. The former green Escape Backpack styling is superseded on this page. The header uses the existing CB-L02-H01 envelope with hidden flap lettering, displayed from an unchanged raster copy through an SVG viewport. Favicon, title, footer, cards, filters, dialogs, guidance panels and SVG illustrations follow the same identity.

`library.css` now owns the page's base styles; it no longer loads `../../site.css` or remote Google Fonts. Shared public site styling is unchanged. Font files and OFL licences are in `assets/`, with provenance in `assets/README.md`. This is a web application of the approved concept, not a replacement vector logo master. Existing technique IDs and shortlist storage keys are preserved.

Checks: existing logo copy verified byte-for-byte, local asset references verified, JS syntax and git whitespace checks passed. Desktop and 390px mobile views visually inspected over local HTTP, including finder, diagrams and technique dialog. No horizontal mobile overflow or console errors observed. No print validation or deployment.

## Dark mode — 2026-10-14

The header's Dark mode toggle remembers a choice in `bureau-clue-theme`. Without a saved choice, the page follows the device colour scheme and responds to changes. `library-theme.js` applies the theme before the stylesheet paints. Blocked storage falls back to an in-session choice. The toggle exposes its state with aria-pressed; native form controls follow the theme. Diagram panels remain light for their fixed illustrative colours; the approved raster logo retains its original colours. Removed the local-preview badge for the requested publication; access remains as documented in the site README.

Dark-mode validation: system default/change, saved overrides, toggle state and blocked storage passed isolated behavior checks. Browser checks passed for light/dark switching and reload persistence; desktop cards/dialogs/diagrams and 390px mobile layout visually inspected with no horizontal overflow or console errors. Prior 215-entry catalogue and envelope checks remain applicable.
