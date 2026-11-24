const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { PNG } = require('pngjs');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file));
const json = file => JSON.parse(read(file));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
// Second key: the generator checks provenance.json; this test pins the same accepted bytes.
const approved = {
  'xscore-wordmark-dark.svg': 'eb89bbd1944626e82b9ef60a450a40bb02b77bc89dfa93dc940e1421594fbe5e',
  'xscore-wordmark-light.svg': '149b4efb6d5a8bd6986d46eb943699a0c2faefe9288abd95883b9c8730897071',
};

test('wordmarks são os bytes vetoriais aceitos, sem raster ou substituição por fonte', () => {
  const provenance = json('source/provenance.json');
  for (const [file, digest] of Object.entries(approved)) {
    const bytes = read(file), svg = bytes.toString();
    expect(sha(bytes)).toBe(digest);
    expect(provenance.approvedSvgSha256[file]).toBe(digest);
    expect(svg).not.toMatch(/<(?:image|text|script|foreignObject)\b|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);
    expect(svg.match(/<path\b/g)).toHaveLength(3);
    expect(svg).toMatch(/viewBox="22 172 354 82"/);
  }
});
test('fontes raster são pixels originais com metadados auxiliares removidos', () => {
  const provenance = json('source/provenance.json');
  expect(provenance.approvedOn).toBe('2026-11-24');
  expect(provenance.rasterSources.map(item => item.file)).toEqual([
    'source/wordmark-light-background.png', 'source/wordmark-dark-background.png', 'source/symbol-transparent-background.png',
  ]);
  for (const item of provenance.rasterSources) {
    const bytes = read(item.file), png = PNG.sync.read(bytes), chunks = [];
    for (let at = 8; at < bytes.length;) { const size = bytes.readUInt32BE(at); chunks.push(bytes.toString('ascii', at + 4, at + 8)); at += size + 12; }
    expect(chunks.every(type => ['IHDR', 'IDAT', 'IEND'].includes(type))).toBe(true);
    expect([png.width, png.height]).toEqual([400, 400]);
    expect(sha(bytes)).toBe(item.sanitizedPngSha256);
    expect(sha(png.data)).toBe(item.originalRgbaSha256);
  }
});
test('vetores reproduzem as máscaras dos PNGs dentro da tolerância medida', () => {
  const { fidelity } = json('source/tracing.json');
  expect(fidelity.map(item => item.asset)).toEqual(['xscore-wordmark-dark.svg', 'xscore-wordmark-light.svg', 'xscore-monogram.svg']);
  for (const item of fidelity) {
    const monogram = item.asset === 'xscore-monogram.svg';
    expect(item.alphaIoU128).toBeGreaterThanOrEqual(monogram ? 0.98 : 0.95);
    expect(item.symbolAlphaIoU128).toBeGreaterThanOrEqual(monogram ? 0.98 : 0.93);
    expect(item.meanAbsAlpha).toBeLessThanOrEqual(0.02);
    expect(item.opaqueColorRmse).toBeLessThanOrEqual(30);
  }
});
test('"score" passa 4,5:1 em todas as superfícies do tema em que cada versão é usada', () => {
  const { score } = json('source/contrast.json');
  expect(score.map(item => item.asset)).toEqual(['xscore-wordmark-dark.svg', 'xscore-wordmark-light.svg']);
  for (const item of score) {
    expect(item.surfaces).toHaveLength(5);
    for (const surface of item.surfaces) expect(surface.ratio).toBeGreaterThanOrEqual(4.5);
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
    const entry = bytes.subarray(start, start + length);
    expect(entry[25]).toBe(6); // Next's ICO decoder requires PNG RGBA, even for opaque artwork.
    const png = PNG.sync.read(entry);
    expect([png.width, png.height]).toEqual([size, size]);
  }
});
