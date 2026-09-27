# escapepack.ca

The public Escape Backpack site. Files live here on GitHub; Cloudflare Pages serves
them (no build step, output directory `/`). The design is Codex's site draft,
promoted from `escape-backpack-games/draft/` on 2026-09-27.

## Pages
| Path | What |
|---|---|
| `index.html` | Home: all adventures, how it works, player help |
| `hiking.html` | The Hiking Backpack: story, facts, borrowing, hints and reset links |
| `borrow.html`, `feedback.html` | Forms (Formspree). `forms.js` shows success only after Formspree confirms. |
| `help/` | Player help. `help/<game>/` is the **stable QR destination** for each game. |
| `site.css`, `site-pages.css` | Styles for the pages above |
| `styles.css` | The older stylesheet, still used by the legacy pages below |
| `norse-hints.html`, `hiking-hints.html`, `hiking-reset.html`, `hiking-old.html`, `Harold.html` | Legacy pages, kept so existing links keep working |
| `_redirects` | Cloudflare redirects. QR paths under `/help/` must never be removed once printed. |

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
