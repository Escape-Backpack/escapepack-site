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

boards=""
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
  boards="$boards<li><a href=\"$slug/\">$name</a></li>"
done < backpacks.txt

cat > design/index.html <<EOF
<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Design boards</title>
<body style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem">
<h1>Design boards</h1>
<ul>$boards</ul>
EOF

rm -rf "$WORK"
echo "Done."
