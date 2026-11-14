function parseCssColor(s) {
  const numeric = '[+-]?(?:\\d*\\.)?\\d+(?:e[+-]?\\d+)?';
  const srgb = new RegExp(`^color\\(srgb\\s+(${numeric})\\s+(${numeric})\\s+(${numeric})(?:\\s*\\/\\s*(${numeric})(%?))?\\s*\\)$`, 'i').exec(s);
  if (srgb) {
    const color = srgb.slice(1, 4).map((channel) => Number(channel) * 255);
    if (srgb[4] !== undefined) color.push(Number(srgb[4]) / (srgb[5] ? 100 : 1));
    return color;
  }
  if (!/^rgba?\(/i.test(s)) throw new Error(`Cor não suportada: ${s}`);
  return s.match(/[\d.]+/g).map(Number);
}
module.exports = { parseCssColor };
