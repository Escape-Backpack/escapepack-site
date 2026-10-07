/* Package the Hiking online playtest's player files only. No tests or design record.
   Run: node tools/build_hiking.cjs [path/to/EscapeBackpack/Hiking_Trip/Digital] */
const fs = require('node:fs');
const path = require('node:path');
const source = path.resolve(process.argv[2] || path.join(__dirname, '../../EscapeBackpack/Hiking_Trip/Digital'));
const target = path.resolve(__dirname, '../play/hiking');
const files = ['index.html', 'styles.css', 'clues.css', 'later.css', 'game-data.js', 'clues.js', 'later.js', 'game.js',
  // Lock 7's 3D Lego puzzles, loaded on first use (Three.js itself comes from jsdelivr via the page's import map).
  'lego-flat.js', 'lego-square.js', 'lego-puzzle.js', 'lego-sim.js', 'lego3d.js',
  // The 3D satellite (locks 4–5): real part shapes from a pack made by tools/pack-lego.mjs.
  'lego-model.js', 'lego-satellite.js',
  // The 3D minifigs on lock 8's workbench (same packs).
  'lego-minifigs.js', 'lego-minifigs-data.js',
  // The four Lego numbers in 3D.
  'lego-numbers.js'];
fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(path.join(target, 'assets'), { recursive: true });
for (const name of fs.readdirSync(path.join(source, 'assets'))) {
  const stat = fs.statSync(path.join(source, 'assets', name));
  if (stat.size > 25 * 1024 * 1024) throw new Error(`Asset exceeds hosting limit: ${name}`);
  fs.copyFileSync(path.join(source, 'assets', name), path.join(target, 'assets', name));
}
for (const filename of files) {
  let text = fs.readFileSync(path.join(source, filename), 'utf8');
  if (filename === 'index.html') {
    // The design record lists every code and source file; players don't need it.
    const notes = /\s*<!-- Durable design record[\s\S]*?<\/div><\/dialog>/;
    if (!notes.test(text)) throw new Error('index.html: design record not found; update build_hiking.cjs');
    text = text.replace(notes, '');
    const brand = '<div class="brand"><img src="assets/hiking.svg" alt=""><span class="brand-kicker">Escape Backpack</span><span class="brand-title">The Hiking Backpack</span></div>';
    if (!text.includes(brand)) throw new Error('index.html: brand line not found; update the home link in build_hiking.cjs');
    text = text.replace(brand, brand.replace('<div class="brand">', '<a class="brand" href="/" style="color:inherit;text-decoration:none">').replace(/<\/div>$/, '</a>'));
    if (!text.includes('name="robots" content="noindex"')) throw new Error('index.html: noindex missing');
  }
  fs.writeFileSync(path.join(target, filename), text);
}
// Every assets/ reference must exist (instruction pages are built as sat-01 … sat-11).
const referenced = new Set();
for (const filename of files) for (const [, name] of fs.readFileSync(path.join(target, filename), 'utf8').matchAll(/assets\/([\w.-]+\.(?:jpg|png|svg))/g)) referenced.add(name);
for (let page = 1; page <= 11; page++) referenced.add(`sat-${String(page).padStart(2, '0')}.jpg`);
for (const name of referenced) if (!fs.existsSync(path.join(target, 'assets', name))) throw new Error(`Missing packaged asset: ${name}`);
// Every module a packaged script imports (import('./x.js') or from './x.js') must be packaged too.
for (const filename of files.filter(f => f.endsWith('.js'))) for (const [, name] of fs.readFileSync(path.join(target, filename), 'utf8').matchAll(/(?:import\(|from )'\.\/([\w.-]+\.js)'/g)) {
  if (!files.includes(name)) throw new Error(`${filename} imports ${name}; add it to the file list in build_hiking.cjs`);
}
console.log(`Packaged Hiking online with ${fs.readdirSync(path.join(target, 'assets')).length} assets at ${target}`);
