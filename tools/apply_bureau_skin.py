"""Put the Cryptic Bureau skin on the generated hint and reset pages.

Links /bureau-skin.css after the page's own styles and adds a thin bar linking home and
the help hub. Safe to run again: it replaces its own marked block each time.

Run after copying a kit-built Norse page into help/norse/ or after tools/build_help.py
(which calls this itself):
    python tools/apply_bureau_skin.py
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    ROOT / "help" / "norse" / "hints" / "index.html",
    ROOT / "help" / "norse" / "reset" / "index.html",
    ROOT / "help" / "hiking" / "hints" / "index.html",
    ROOT / "help" / "hiking" / "reset" / "index.html",
]
VERSION = "1"
# The theme line applies the visitor's saved light/dark choice (kit pages already do; Hiking's don't).
HEAD = (f'<!--bureau-skin--><link rel="stylesheet" href="/bureau-skin.css?v={VERSION}">'
        '<link rel="icon" type="image/png" href="/assets/bureau/favicon-64.png">'
        '<script>try{var t=localStorage.getItem("ebp-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}</script>'
        '<!--/bureau-skin-->')
BAR = ('<!--bureau-bar--><div class="bureau-bar"><a class="bb-brand" href="/">The Cryptic Bureau</a>'
       '<a href="/help/">All hints &amp; help</a></div><!--/bureau-bar-->')


def apply(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    before = html
    # Remove an earlier run's blocks, with the newline each one added.
    html = re.sub(r"<!--bureau-skin-->.*?<!--/bureau-skin-->\n?", "", html, flags=re.S)
    html = re.sub(r"\n?<!--bureau-bar-->.*?<!--/bureau-bar-->", "", html, flags=re.S)
    if "</head>" not in html or not re.search(r"<body[^>]*>", html):
        raise ValueError(f"{path}: no </head> or <body> to attach to")
    # Last thing in <head>, so it wins over the page's own <style> blocks.
    html = html.replace("</head>", HEAD + "\n</head>", 1)
    html = re.sub(r"(<body[^>]*>)", lambda m: m.group(1) + "\n" + BAR, html, count=1)
    if html != before:
        path.write_text(html, encoding="utf-8", newline="")
        return True
    return False


def main() -> None:
    for page in PAGES:
        if not page.exists():
            print(f"skip (missing): {page.relative_to(ROOT)}")
            continue
        changed = apply(page)
        print(f"{'skinned' if changed else 'unchanged'}: {page.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
