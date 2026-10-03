/* Package the Leif pilot's player files only. No design pages or solution PDFs.
   Run: node tools/build_leif.cjs [path/to/EscapeBackpack/NorseBackpack/Digital] */
const fs = require('node:fs');
const path = require('node:path');
const source = path.resolve(process.argv[2] || path.join(__dirname, '../../EscapeBackpack/NorseBackpack/Digital'));
const target = path.resolve(__dirname, '../play/norse/leif');
const game = require(path.join(source, 'leif-data.js'));
const assetPaths = new Set(Object.values(game.items).flatMap(item => item.faces || []));
assetPaths.add('../Props/_Renders/Luggage_Tag_Inserts_Sheet.png');
assetPaths.add('../../Fonts/Cinzel/Cinzel-VariableFont_wght.ttf');
assetPaths.add('./assets/Caveat-Medium.woff2'); // Liv's handwriting font (SIL OFL); its licence is shipped with it
assetPaths.add('./assets/Caveat-OFL.txt');
assetPaths.add('./assets/Raven_Postmark.png'); // the opening letter's postmark
const names = new Map();
for (const asset of assetPaths) {
  const name = path.basename(asset);
  if (names.has(name)) throw new Error(`Duplicate asset filename: ${name}`);
  names.set(name, asset);
  const stat = fs.statSync(path.resolve(source, asset));
  if (stat.size > 25 * 1024 * 1024) throw new Error(`Asset exceeds hosting limit: ${asset}`);
}
fs.mkdirSync(path.join(target, 'assets'), { recursive: true });
for (const [name, asset] of names) fs.copyFileSync(path.resolve(source, asset), path.join(target, 'assets', name));
const rebase = text => text
  .replaceAll('../Web/Postcards/', './assets/')
  .replaceAll('../Postcards/', './assets/')
  .replaceAll('../Props/_Renders/', './assets/')
  .replaceAll('../Props/RouenTicket/', './assets/')
  .replaceAll('../Props/RavenFlights/', './assets/')
  .replaceAll('../../Fonts/Cinzel/', './assets/');
for (const filename of ['Leif.html', 'leif.css', 'leif.js', 'leif-data.js', 'leif-sound.js', 'leif-room.js', 'table-layout.js']) {
  let text = rebase(fs.readFileSync(path.join(source, filename), 'utf8'));
  if (filename === 'Leif.html') {
    const home = '<span class="brand-kicker">Escape Backpack</span>';
    if (!text.includes(home)) throw new Error('Leif.html: brand line not found; update the home link in build_leif.cjs');
    text = text.replace(home, '<a class="brand-kicker" href="/">Escape Backpack</a>');
  }
  fs.writeFileSync(path.join(target, filename === 'Leif.html' ? 'index.html' : filename), text);
}
const packaged = require(path.join(target, 'leif-data.js'));
for (const item of Object.values(packaged.items)) for (const face of item.faces || []) {
  if (!fs.existsSync(path.resolve(target, face))) throw new Error(`Missing packaged image: ${face}`);
}
console.log(`Packaged Leif pilot with ${assetPaths.size} assets at ${target}`);
