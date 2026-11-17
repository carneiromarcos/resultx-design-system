const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { PNG } = require('pngjs');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const approved = {
  'xscore-wordmark-dark.svg': 'c30a577e5a1aadd474e6b6b1bd45c4e1a3a3e47436a89186304e8303032b2740',
  'xscore-wordmark-light.svg': '30a5c70b5f21697c50cddc158f71082f018f11b8d6e9b35ad6be6c71f8a0762c',
};

test('wordmarks são os bytes vetoriais aceitos, sem raster ou substituição por fonte', () => {
  for (const [file, digest] of Object.entries(approved)) {
    const bytes = read(file), svg = bytes.toString();
    expect(sha(bytes)).toBe(digest);
    expect(svg).not.toMatch(/<(?:image|text|script|foreignObject)\b|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);
    expect(svg.match(/<path\b/g)).toHaveLength(3);
    expect(svg).toMatch(/viewBox="26 152 358 96"/);
  }
});
test('fontes raster são pixels originais com metadados auxiliares removidos', () => {
  const provenance = JSON.parse(read('source/provenance.json'));
  for (const item of provenance.rasterSources) {
    const bytes = read(item.file), png = PNG.sync.read(bytes), chunks = [];
    for (let at = 8; at < bytes.length;) { const size = bytes.readUInt32BE(at); chunks.push(bytes.toString('ascii', at + 4, at + 8)); at += size + 12; }
    expect(chunks.every(type => ['IHDR', 'IDAT', 'IEND'].includes(type))).toBe(true);
    expect([png.width, png.height]).toEqual([400, 400]);
    expect(sha(png.data)).toBe(item.originalRgbaSha256);
  }
});
test('monograma e favicon preservam duas formas vetoriais sem conteúdo executável', () => {
  for (const file of ['xscore-monogram.svg', 'xscore-favicon.svg']) {
    const svg = read(file).toString();
    expect(svg).not.toMatch(/<(?:image|text|script|foreignObject)\b/i);
    expect(svg.match(/<path\b/g)).toHaveLength(2);
    expect(svg).toMatch(/aria-label="Xscore"/);
  }
});
test('ícones têm tamanhos declarados e fundo opaco para a aba e o atalho', () => {
  for (const size of [16, 32, 180, 512]) {
    const png = PNG.sync.read(read(`xscore-icon-${size}.png`));
    expect([png.width, png.height]).toEqual([size, size]);
    expect(png.data.every((v, i) => i % 4 !== 3 || v === 255)).toBe(true);
  }
});
test('ICO contém PNGs válidos de 16, 32 e 48 sem depender de ferramenta externa', () => {
  const bytes = read('xscore-favicon.ico');
  expect([bytes.readUInt16LE(0), bytes.readUInt16LE(2), bytes.readUInt16LE(4)]).toEqual([0, 1, 3]);
  for (const [i, size] of [16, 32, 48].entries()) {
    const at = 6 + i * 16, length = bytes.readUInt32LE(at + 8), start = bytes.readUInt32LE(at + 12);
    expect([bytes[at], bytes[at + 1], bytes.readUInt16LE(at + 6)]).toEqual([size, size, 32]);
    const png = PNG.sync.read(bytes.subarray(start, start + length));
    expect([png.width, png.height]).toEqual([size, size]);
  }
});
