/* Package the Hiking online playtest's player files only. No tests or design record.
   Run: node tools/build_hiking.cjs [path/to/EscapeBackpack/Hiking_Trip/Digital] */
const fs = require('node:fs');
const path = require('node:path');
const source = path.resolve(process.argv[2] || path.join(__dirname, '../../EscapeBackpack/Hiking_Trip/Digital'));
const target = path.resolve(__dirname, '../play/hiking');
const files = ['index.html', 'styles.css', 'clues.css', 'later.css', 'game-data.js', 'clues.js', 'later.js', 'game.js'];
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
    const brand = '<div class="brand"><img src="assets/hiking.svg" alt=""><span>ESCAPE BACKPACK<small>THE HIKING ADVENTURE</small></span></div>';
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
console.log(`Packaged Hiking online with ${fs.readdirSync(path.join(target, 'assets')).length} assets at ${target}`);
