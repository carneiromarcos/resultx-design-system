'use strict';

/**
 * Which brand token plays which DS role.
 *
 * This file declares role mappings. Values come from generated brand CSS and
 * generated core CSS; tokens/tokens.json is the source of both.
 * `tests/brand-bridge.test.js` asserts that it hasn't.
 *
 * Roles
 * -----
 *   accent     the brand color used as a FILL (button background, active chip)
 *   hover      the fill in :hover — measured separately, because a lighter
 *              hover can flip which ink is readable
 *   secondary  the supporting brand color (--accent-secondary)
 *   text       the brand color safe to use as TEXT on that theme's surface.
 *              A fill color and a text color are different jobs: gold #c4993b
 *              is a fine fill (7.33 against dark ink) and an illegal text color
 *              on white (2.64). `null` means the brand owns no AA-safe variant
 *              — the bridge then leaves the DS default in place rather than
 *              shipping unreadable text, and says so out loud in the report.
 *
 * Ink (`--text-inverse` / `--text-on-accent`) is NOT declared here. It is
 * computed per brand by contrast measurement in build-brand-bridges.js.
 */

/** Ink candidates, measured against each brand's accent. Highest ratio wins. */
const { opaqueHex, selector } = require('./lib/core-token-values');
const INK_CANDIDATES = [opaqueHex(':root', '--text-on-accent'), opaqueHex(':root', '--text-on-error')];

/**
 * Surfaces used to verify the text roles, read from generated tokens/tokens.css.
 * `all` is --bg-base plus --bg-surface-1..3 — the focus ring must clear 3:1
 * against every one of them (WCAG 1.4.11). tests/contrast-tokens.test.js reads
 * the same surfaces straight from tokens.css, so a drift here fails there.
 */
const SURFACES = Object.fromEntries(['dark', 'light'].map((theme) => {
  const scope = selector(theme);
  const read = (name) => opaqueHex(scope, name);
  const all = ['--bg-base', '--bg-surface-1', '--bg-surface-2', '--bg-surface-3'].map(read);
  return [theme, { base: all[0], surface: theme === 'dark' ? all[2] : all[1], all }];
}));

const BRANDS = [
  {
    id: 'electia',
    label: 'Electia by Emprega+',
    dark: {
      accent: '--purple',
      // NOT --purple-light (#a55eea): as a fill it leaves the white label at
      // 3.90, below AA. --purple-600 is the next step on the brand's own OKLCH
      // ramp and holds at 5.53.
      hover: '--purple-600',
      secondary: '--gold',
      // The brand already owns the "purple readable on dark" role.
      text: '--purple-on-dark',
    },
    light: {
      accent: '--purple',
      // The brand's light scope declares --purple-light as the hover (#7c3aed).
      hover: '--purple-light',
      secondary: '--gold',
      // --purple-on-dark resolves to #6f32b1 inside the brand's light scope.
      text: '--purple-on-dark',
    },
  },
  {
    id: 'emprega-mais',
    label: 'Emprega+',
    dark: {
      // FILL do botão de Ação no IMO é indigo-dark, não o índigo cru
      // (#6366f1 + branco = 4,47:1). Ouro vira secondary (prestígio).
      accent: '--emp-indigo-dark',
      hover: '--emp-indigo-hover',
      secondary: '--emp-gold',
      text: '--emp-indigo-ink',
    },
    light: {
      accent: '--emp-indigo-dark',
      hover: '--emp-indigo-hover',
      secondary: '--emp-gold',
      text: '--emp-indigo-ink',
    },
  },
  {
    id: 'pdv',
    label: 'Profissional de Valor',
    dark: {
      accent: '--gold',
      hover: '--gold-light',
      secondary: null,
      text: '--gold-ink',
    },
    light: {
      accent: '--gold',
      hover: '--gold-light',
      secondary: null,
      text: '--gold-ink',
    },
  },
  {
    id: 'resultx',
    label: 'ResultX',
    dark: {
      accent: '--rx-gold',
      hover: '--rx-gold-light',
      secondary: '--rx-purple',
      text: '--rx-gold-ink',
    },
    light: {
      accent: '--rx-gold',
      hover: '--rx-gold-light',
      secondary: '--rx-purple',
      text: '--rx-gold-ink',
    },
  },
  {
    id: 'xscore',
    label: 'Xscore',
    dark: {
      accent: '--gold',
      hover: '--gold-light',
      secondary: '--intel',
      // The brand that got here first: --gold-ink already existed in both
      // scopes, and the other three now follow the same pattern.
      text: '--gold-ink',
    },
    light: {
      accent: '--gold',
      hover: '--gold-light',
      secondary: '--intel',
      text: '--gold-ink',
    },
  },
];

module.exports = { BRANDS, INK_CANDIDATES, SURFACES };
