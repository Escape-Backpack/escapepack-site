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
  .replaceAll('../../Fonts/Cinzel/', './assets/');
for (const filename of ['Leif.html', 'leif.css', 'leif.js', 'leif-data.js']) {
  let text = rebase(fs.readFileSync(path.join(source, filename), 'utf8'));
  if (filename === 'Leif.html') {
    text = text.replace('<div class="brand">ESCAPE BACKPACK', '<div class="brand"><a href="/" style="color:inherit;text-decoration:none">ESCAPE BACKPACK</a>');
  }
  fs.writeFileSync(path.join(target, filename === 'Leif.html' ? 'index.html' : filename), text);
}
const packaged = require(path.join(target, 'leif-data.js'));
for (const item of Object.values(packaged.items)) for (const face of item.faces || []) {
  if (!fs.existsSync(path.resolve(target, face))) throw new Error(`Missing packaged image: ${face}`);
}
console.log(`Packaged Leif pilot with ${assetPaths.size} assets at ${target}`);
