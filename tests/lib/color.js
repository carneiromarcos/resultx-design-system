/**
 * Cores para os testes de contrato (lote D em diante).
 *
 * Resolve o que o navegador faz com `color-mix(in oklab, A p%, B)` e com uma
 * cor translúcida pintada sobre uma superfície, para que o gate de contraste
 * rode no Jest com os valores dos tokens, sem navegador. As fórmulas de OKLab
 * são as de Björn Ottosson (as mesmas do CSS Color 4).
 *
 * Não casa com o testMatch do Jest (não termina em .test.js).
 */

const { contrastRatio, flatten } = require('../../scripts/lib/contrast');

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** `#abc` | `#aabbcc` | `rgb[a](r, g, b[, a])` -> `{ hex, alpha }` */
function parseColor(value) {
  const v = String(value).trim();
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    return { hex: `#${v.slice(1).split('').map((c) => c + c).join('')}`, alpha: 1 };
  }
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return { hex: v, alpha: 1 };
  const m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (!m) throw new Error(`Cor não suportada: "${value}"`);
  const hex = `#${[m[1], m[2], m[3]].map((c) => Number(c).toString(16).padStart(2, '0')).join('')}`;
  return { hex, alpha: m[4] === undefined ? 1 : Number(m[4]) };
}

const hexToRgb01 = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

function toOklab(hex) {
  const [r, g, b] = hexToRgb01(hex).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, A, B]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return `#${rgb
    .map((c) => Math.round(Math.min(1, Math.max(0, toGamma(c))) * 255).toString(16).padStart(2, '0'))
    .join('')}`;
}

/** `color-mix(in oklab, a p%, b)` com as duas cores opacas. */
function mixOklab(a, p, b) {
  const [x, y] = [toOklab(parseColor(a).hex), toOklab(parseColor(b).hex)];
  const t = p / 100;
  return fromOklab(x.map((v, i) => v * t + y[i] * (1 - t)));
}

/** Cor (talvez translúcida) pintada sobre uma superfície opaca. */
function paint(value, surfaceHex) {
  const { hex, alpha } = parseColor(value);
  return alpha >= 1 ? hex : flatten(hex, parseColor(surfaceHex).hex, alpha);
}

/** Contraste SEM arredondar de `fg` (talvez translúcida) sobre `bg` opaco. */
const contrastOn = (fg, bgHex) => contrastRatio(paint(fg, bgHex), parseColor(bgHex).hex);

module.exports = { parseColor, mixOklab, paint, contrastOn };
