# Designer Clue Library

Local implementation for review at `/designer/clues/`. Uses the public site's
`site.css` colour and typography tokens. No framework or build step.

## Access: not configured

This folder contains game examples and spoilers. It has no authentication yet.
Do not push/publish it until the intended access policy and repository visibility
have been checked. The existing site deploys static files from its repository root.
An unlisted URL or `noindex` does not make the files private; neither would a
password check implemented only in browser JavaScript.

The intended next hosting step is server-enforced access for the designer area,
including its scripts/data and any alternate deployment domains. If this
repository is public, keep sensitive source/data in a private repository as well.
Cloudflare settings and repository visibility were not verified in this pass.
Remove the local-preview label only once access has been configured and tested.

## Files

- `index.html`: page structure, process prompts and evidence notes.
- `library.css`: responsive studio layout using shared site colours/fonts.
- `library-data.js`: migrated catalogue from the original `EscapeBackpack/clues.html`.
  This is now the editable catalogue for this new page; the old local page is retained
  as a legacy reference. Do not maintain both as active sources.
- `library.js`: search/filtering, illustrative SVGs, shortlist and idea brief export.
- `library-expansion.js`: 44 new technique/pattern briefs with stable IDs and
  illustrative examples; selected primary references carry review dates.
- `library-guidance.js`: family checklists for the imported catalogue and six
  specific briefs for frequently useful existing techniques.

No public navigation link was added. Open this page directly for local review.
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
- 211 entries across 13 categories: 50 specific briefs and 161 family checklists.
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
