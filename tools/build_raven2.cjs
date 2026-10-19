/* Package the Norse online game V2 (box, envelopes and cypher wheel): player files only.
   Run: node tools/build_raven2.cjs [path/to/EscapeBackpack/NorseBackpack/Digital]
   Writes play/norse/v2/. V1 (tools/build_leif.cjs, play/norse/leif/) is untouched. */
const fs = require('node:fs');
const path = require('node:path');
const source = path.resolve(process.argv[2] || path.join(__dirname, '../../EscapeBackpack/NorseBackpack/Digital'));
const target = path.resolve(__dirname, '../play/norse/v2');
const game = require(path.join(source, 'raven2-data.js'));
const assetPaths = new Set(Object.values(game.items).flatMap(item => item.faces || []));
assetPaths.add('../../Fonts/Cinzel/Cinzel-VariableFont_wght.ttf');
assetPaths.add('./assets/Caveat-Medium.woff2'); // Liv's handwriting font (SIL OFL); its licence is shipped with it
assetPaths.add('./assets/Caveat-OFL.txt');
assetPaths.add('./assets/Raven_Postmark.png'); // the opening letter's postmark
const names = new Map();
for (const asset of assetPaths) {
  const name = path.basename(asset);
  if (names.has(name)) throw new Error(`Duplicate asset filename: ${name}`);
  names.set(name, asset);
  if (fs.statSync(path.resolve(source, asset)).size > 25 * 1024 * 1024) throw new Error(`Asset exceeds hosting limit: ${asset}`);
}
fs.rmSync(path.join(target, 'assets'), { recursive: true, force: true });
fs.mkdirSync(path.join(target, 'assets'), { recursive: true });
for (const [name, asset] of names) fs.copyFileSync(path.resolve(source, asset), path.join(target, 'assets', name));
const rebase = text => text
  .replaceAll('../Web/Postcards/', './assets/')
  .replaceAll('./assets/v2/', './assets/')
  .replaceAll('../../Fonts/Cinzel/', './assets/');
for (const filename of ['Raven_V2.html', 'leif.css', 'raven2.css', 'raven2.js', 'raven2-data.js', 'raven2-sizes.js', 'table-layout2.js', 'leif-sound.js', 'leif-room.js']) {
  let text = rebase(fs.readFileSync(path.join(source, filename), 'utf8'));
  if (filename === 'Raven_V2.html') {
    const home = '<span class="brand-kicker">Escape Backpack</span>';
    if (!text.includes(home)) throw new Error('Raven_V2.html: brand line not found; update the home link in build_raven2.cjs');
    text = text.replace(home, '<a class="brand-kicker" href="/">Escape Backpack</a>');
  }
  fs.writeFileSync(path.join(target, filename === 'Raven_V2.html' ? 'index.html' : filename), text);
}
const packaged = require(path.join(target, 'raven2-data.js'));
for (const item of Object.values(packaged.items)) for (const face of item.faces || []) {
  if (!fs.existsSync(path.resolve(target, face))) throw new Error(`Missing packaged image: ${face}`);
}
console.log(`Packaged Norse V2 with ${assetPaths.size} assets at ${target}`);
