'use strict';

/**
 * WCAG 2.2 contrast utilities.
 *
 * Used by scripts/build-brand-bridges.js to CHOOSE ink colors by measurement
 * instead of by guess, and by tests/brand-bridge.test.js to guard the result.
 *
 * Reference: WCAG 2.2 SC 1.4.3 (Contrast Minimum) and the sRGB relative
 * luminance definition from WCAG 2.x.
 */

/** WCAG AA threshold for normal-size text. */
const AA_NORMAL = 4.5;
/** WCAG AA threshold for large text (>=24px, or >=18.66px bold) and UI components. */
const AA_LARGE = 3;

/** Expand `#abc` to `aabbcc` and strip the leading `#`. */
function normalizeHex(hex) {
  const raw = String(hex).trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(raw)) {
    throw new Error(`Hexadecimal invalido: "${hex}"`);
  }
  return raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw.toLowerCase();
}

/** `#6f32b1` -> `[111, 50, 177]` */
function toRgb(hex) {
  const full = normalizeHex(hex);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

/** `#6f32b1` -> `"111, 50, 177"` — ready to interpolate into `rgba(...)`. */
function toRgbTriplet(hex) {
  return toRgb(hex).join(', ');
}

/** sRGB channel (0..1) to linear-light value. */
function srgbToLinear(channel) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
function relativeLuminance(hex) {
  const [r, g, b] = toRgb(hex).map((v) => srgbToLinear(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two opaque colors, 1 to 21. Order-independent. */
function contrastRatio(a, b) {
  const [la, lb] = [relativeLuminance(a), relativeLuminance(b)];
  const [lighter, darker] = la > lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}

/** Round to 2 decimals — enough precision to compare against 4.5 / 3. */
function ratio(a, b) {
  return Math.round(contrastRatio(a, b) * 100) / 100;
}

/**
 * Pick the ink (foreground) with the highest contrast against `background`.
 *
 * This is the whole point of the bridge: a light accent (teal #2DD4BF) needs
 * dark ink, a dark accent (purple #6f32b1) needs white. Hardcoding either one
 * in the DS breaks half the brands.
 *
 * @returns {{ value: string, ratio: number, passesAA: boolean }}
 */
function pickInk(background, candidates) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error('pickInk exige ao menos um candidato de tinta');
  }
  const best = candidates
    .map((value) => ({ value, ratio: ratio(value, background) }))
    .reduce((a, b) => (b.ratio > a.ratio ? b : a));
  return { ...best, passesAA: best.ratio >= AA_NORMAL };
}

/**
 * Blend `foreground` over `opaqueBackground` at `alpha` and return the
 * flattened hex. Lets us measure text contrast against translucent surfaces
 * such as `--accent-primary-muted`, which is `rgba(accent, 0.15)` over a
 * surface color.
 */
function flatten(foreground, opaqueBackground, alpha) {
  const fg = toRgb(foreground);
  const bg = toRgb(opaqueBackground);
  const hex = fg
    .map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)).toString(16).padStart(2, '0'))
    .join('');
  return `#${hex}`;
}

module.exports = {
  AA_NORMAL,
  AA_LARGE,
  normalizeHex,
  toRgb,
  toRgbTriplet,
  relativeLuminance,
  contrastRatio,
  ratio,
  pickInk,
  flatten,
};
