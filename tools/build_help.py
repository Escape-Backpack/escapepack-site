"""Build the Hiking help pages (help/hiking/) from the existing public pages.

The original pages are read, never edited. Embedded image bytes are extracted
without recompression so puzzle text and reset photos retain their detail.
"""

from __future__ import annotations

import base64
import hashlib
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HELP = ROOT / "help"
MEDIA = HELP / "hiking" / "media"
DATA_IMAGE = re.compile(r"data:image/(?:png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)")


def extension(data: bytes) -> str:
    if data.startswith(b"\xff\xd8"):
        return "jpg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if data.startswith(b"RIFF") and data[8:12] == b"WEBP":
        return "webp"
    raise ValueError("Unrecognized embedded image")


def build(source: str, destination: Path, kind: str) -> tuple[int, int, int]:
    html = (ROOT / source).read_text(encoding="utf-8")
    original_size = len(html.encode("utf-8"))
    images: set[str] = set()

    def extract(match: re.Match[str]) -> str:
        data = base64.b64decode(match.group(1), validate=True)
        name = f"{hashlib.sha256(data).hexdigest()[:16]}.{extension(data)}"
        target = MEDIA / name
        if not target.exists():
            target.write_bytes(data)
        images.add(name)
        return f"../media/{name}"

    html = DATA_IMAGE.sub(extract, html)
    html = html.replace('width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no', 'width=device-width, initial-scale=1.0')
    html = re.sub(r'href="styles\.css(?:\?v=\d+)?"', 'href="../../legacy.css"', html)
    html = html.replace('href="index.html"', 'href="../../../index.html"')
    for old, new in (
        ("hiking-hints.html", "../hints/"),
        ("hiking-reset.html", "../reset/"),
        ("borrow.html", "../../../borrow.html"),
        ("feedback.html", "../../../feedback.html"),
    ):
        html = html.replace(old, new)

    if kind == "reset":
        # Reset photos are below the heading; load each when it approaches view.
        html = re.sub(r'<img (src="\.\./media/)', r'<img loading="lazy" decoding="async" \1', html)
        html = html.replace(
            '<div class="item" onclick="toggleItem(event,this)">',
            '<div class="item" role="checkbox" tabindex="0" aria-checked="false" '
            'onclick="toggleItem(event,this)" '
            'onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();toggleItem(event,this)}">',
        )
        html = html.replace('<a href="../../../index.html"></a>', '<a href="../../../index.html">Home</a>')
        needle = "document.getElementById('completionMsg').classList.toggle('visible', done===TOTAL);"
        replacement = needle + "\n  if(done===TOTAL && !window.__resetTracked){window.__resetTracked=true;EscapeAnalytics.track('reset_completed',{game:'hiking'});}"
        if needle not in html:
            raise ValueError("Reset completion hook moved")
        html = html.replace(needle, replacement, 1)
        html = html.replace("el.classList.toggle('done');", "el.classList.toggle('done');\n  el.setAttribute('aria-checked', String(el.classList.contains('done')));", 1)
        html = html.replace("document.querySelectorAll('.item').forEach(el => el.classList.remove('done'));", "document.querySelectorAll('.item').forEach(el => {el.classList.remove('done');el.setAttribute('aria-checked','false')});", 1)
        event = "reset_opened"
    else:
        html, logger_count = re.subn(r"const LOGGER_URL\s*=\s*'[^']*';", "const LOGGER_URL = '';", html, count=1)
        if logger_count != 1:
            raise ValueError("Expected one legacy logger URL")
        needle = "st.hintLog[i].push(hi);"
        replacement = needle + "\n          EscapeAnalytics.track('hint_revealed',{game:'hiking',lock:String(i+1),level:String(hi+1)});"
        if needle not in html:
            raise ValueError("Hint reveal hook moved")
        html = html.replace(needle, replacement, 1)
        needle = "clearSt(); show('complete');"
        if needle not in html:
            raise ValueError("Game completion hook moved")
        html = html.replace(needle, "EscapeAnalytics.track('game_completed',{game:'hiking'});\n  " + needle, 1)
        event = "hint_companion_opened"

    html = html.replace("</body>", f'<script src="../../../analytics.js"></script>\n<script>EscapeAnalytics.track("{event}",{{game:"hiking"}});</script>\n</body>', 1)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(html, encoding="utf-8")
    return original_size, len(html.encode("utf-8")), len(images)


def main() -> None:
    MEDIA.mkdir(parents=True, exist_ok=True)
    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    css = css.replace("url('assets/logo.png')", "url('../assets/logo.png')")
    (HELP / "legacy.css").write_text(css, encoding="utf-8")
    for source, destination, kind in (
        ("hiking-hints.html", HELP / "hiking" / "hints" / "index.html", "hints"),
        ("hiking-reset.html", HELP / "hiking" / "reset" / "index.html", "reset"),
    ):
        before, after, count = build(source, destination, kind)
        print(f"{kind}: HTML {before:,} -> {after:,} bytes; {count} external images")


if __name__ == "__main__":
    main()
