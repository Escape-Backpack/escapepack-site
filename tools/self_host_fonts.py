"""Replace Google Fonts links on the generated public hint pages with the site's own fonts.

build.sh creates help/<slug>/hints/index.html from backpack-kit, whose template loads fonts from Google
(which sends each visitor's address to Google). This removes those links and links /fonts-local.css
instead (Young Serif, Inter Tight, JetBrains Mono, Orbitron, Quantico, Share Tech Mono; latin only).
Safe to run again. build.sh runs it after the pages are built:
    python tools/self_host_fonts.py
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LINK = '<link rel="stylesheet" href="/fonts-local.css">'
# Norse and Hiking are committed here and handled by tools/apply_bureau_skin.py (it self-hosts their fonts too).
SKIP = {"norse", "hiking"}


def fix(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    new = re.sub(r'<link[^>]*href="https://fonts\.(?:googleapis|gstatic)\.com[^>]*>\s*', "", html)
    if LINK not in new and "</head>" in new:
        new = new.replace("</head>", LINK + "\n</head>", 1)
    if new == html:
        return False
    path.write_text(new, encoding="utf-8", newline="")
    return True


def main() -> None:
    for page in sorted(ROOT.glob("help/*/hints/index.html")):
        if page.parent.parent.name in SKIP:
            continue
        print(("fixed: " if fix(page) else "unchanged: ") + str(page.relative_to(ROOT)))


if __name__ == "__main__":
    main()
