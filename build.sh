#!/usr/bin/env bash
# Cloudflare Pages build for escapepack.ca.
# Pages settings: build command `bash build.sh`, output directory `/` (unchanged).
#
# For each backpack in backpacks.txt, builds its design board with backpack-kit into
#   design/<slug>/         brainstorm board (protected by Cloudflare Access on /design/*)
#   help/<slug>/hints/     public hint page (printed QR codes point at /help/<slug>/)
# Both are generated and git-ignored. Everything else in this repo is served as-is.
#
# Private backpack repos need GITHUB_TOKEN (read-only) set as a Cloudflare environment variable.
set -euo pipefail
cd "$(dirname "$0")"

PY=$(command -v python3 || command -v python)
WORK=.build
rm -rf "$WORK"
mkdir -p "$WORK"

repo_url() {
  if [ -n "${GITHUB_TOKEN:-}" ]; then
    echo "https://x-access-token:${GITHUB_TOKEN}@github.com/$1.git"
  else
    echo "https://github.com/$1.git"
  fi
}

git clone --depth 1 --quiet https://github.com/Escape-Backpack/backpack-kit "$WORK/backpack-kit"

boards=""   # design/clues/ is committed here, not built: never use "clues" as a slug
while read -r slug repo _; do
  case "$slug" in ''|\#*) continue ;; esac
  echo "== $slug ($repo)"
  # Full history: the board's "last touched" dates come from git.
  git clone --quiet "$(repo_url "$repo")" "$WORK/$slug"
  "$PY" "$WORK/backpack-kit/kit.py" --project "$WORK/$slug" build
  name=$("$PY" -c 'import json,sys; print(json.load(open(sys.argv[1], encoding="utf-8"))["name"])' "$WORK/$slug/backpack.json")

  rm -rf "design/$slug" "help/$slug/hints"
  mkdir -p design "help/$slug"
  mv "$WORK/$slug/site/hints" "help/$slug/hints"
  mv "$WORK/$slug/site" "design/$slug"
  boards="$boards$slug	$name
"
done < backpacks.txt

# design/index.html: the committed template with one card per backpack.
printf '%s' "$boards" | "$PY" -c '
import html, sys
cards = "".join(
    f"<a href=\"{html.escape(slug)}/\"><span class=\"eyebrow\">Design board</span>"
    f"<strong>{html.escape(name)} ↗</strong><span>Brainstorm board and play-test.</span></a>"
    for slug, name in (line.split("\t", 1) for line in sys.stdin.read().splitlines() if line))
page = open("design/index.template.html", encoding="utf-8").read()
open("design/index.html", "w", encoding="utf-8").write(page.replace("<!-- BOARDS -->", cards))
'

rm -rf "$WORK"
echo "Done."
