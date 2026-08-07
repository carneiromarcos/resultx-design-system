'use strict';

/**
 * Which brand token plays which DS role.
 *
 * This file declares NAMES, never values. Every value is resolved from
 * `brands/<id>/tokens/tokens.css` at build time, so the brand file stays the
 * single source of truth and the bridge cannot silently drift from it.
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
const INK_CANDIDATES = ['#0B0E14', '#FFFFFF'];

/** Surfaces used to verify the text roles. Mirrors tokens/tokens.css. */
const SURFACES = {
  dark: { base: '#0B0E14', surface: '#161B26' },
  light: { base: '#FFFFFF', surface: '#F8FAFB' },
};

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
      accent: '--emp-gold',
      hover: '--emp-gold-light',
      secondary: '--emp-purple',
      // One token across both themes: the brand file resolves it to #c4993b in
      // dark and #866425 in light. The interface uses one name, not two.
      text: '--emp-gold-ink',
    },
    light: {
      accent: '--emp-gold',
      hover: '--emp-gold-light',
      secondary: '--emp-purple',
      text: '--emp-gold-ink',
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
