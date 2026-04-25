/**
 * Data Layer Tests (v2.1.0)
 *
 * Validates:
 * 1. The 3 new themes exist with correct selectors
 * 2. Token parity across premium-light / sober-dark / vibrant-dark
 * 3. Shared gradient palette is present
 * 4. The 10 data-layer components exist in data-cards.css
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOKENS_PATH = path.join(ROOT, 'tokens', 'tokens.css');
const SHARED_PATH = path.join(ROOT, 'tokens', 'themes', '_data-layer-shared.css');
const PREMIUM_PATH = path.join(ROOT, 'tokens', 'themes', 'premium-light.css');
const SOBER_PATH = path.join(ROOT, 'tokens', 'themes', 'sober-dark.css');
const VIBRANT_PATH = path.join(ROOT, 'tokens', 'themes', 'vibrant-dark.css');
const DATA_CARDS_PATH = path.join(ROOT, 'components', 'data-cards.css');

function extractPropertiesFromBlock(css, selectorPattern) {
  const properties = [];
  const selectorRegex = new RegExp(
    selectorPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{',
    'g'
  );
  let selectorMatch;

  while ((selectorMatch = selectorRegex.exec(css)) !== null) {
    let braceDepth = 1;
    let pos = selectorMatch.index + selectorMatch[0].length;
    while (pos < css.length && braceDepth > 0) {
      if (css[pos] === '{') braceDepth++;
      if (css[pos] === '}') braceDepth--;
      pos++;
    }
    const blockContent = css.slice(selectorMatch.index + selectorMatch[0].length, pos - 1);
    const propRegex = /(--[\w-]+)\s*:/g;
    let propMatch;
    while ((propMatch = propRegex.exec(blockContent)) !== null) {
      properties.push(propMatch[1]);
    }
  }

  return [...new Set(properties)];
}

describe('Data Layer — file presence', () => {
  test('all 4 theme files exist', () => {
    expect(fs.existsSync(SHARED_PATH)).toBe(true);
    expect(fs.existsSync(PREMIUM_PATH)).toBe(true);
    expect(fs.existsSync(SOBER_PATH)).toBe(true);
    expect(fs.existsSync(VIBRANT_PATH)).toBe(true);
  });

  test('data-cards.css exists', () => {
    expect(fs.existsSync(DATA_CARDS_PATH)).toBe(true);
  });

  test('tokens.css imports all 4 theme files', () => {
    const css = fs.readFileSync(TOKENS_PATH, 'utf-8');
    expect(css).toMatch(/@import url\(['"]\.\/themes\/_data-layer-shared\.css['"]\);/);
    expect(css).toMatch(/@import url\(['"]\.\/themes\/premium-light\.css['"]\);/);
    expect(css).toMatch(/@import url\(['"]\.\/themes\/sober-dark\.css['"]\);/);
    expect(css).toMatch(/@import url\(['"]\.\/themes\/vibrant-dark\.css['"]\);/);
  });
});

describe('Data Layer — gradient palette (shared)', () => {
  let shared;
  beforeAll(() => {
    shared = fs.readFileSync(SHARED_PATH, 'utf-8');
  });

  test('exposes 5 brand gradients', () => {
    ['cyan', 'magenta', 'green', 'amber', 'purple'].forEach((name) => {
      expect(shared).toMatch(new RegExp(`--gradient-${name}\\s*:`));
    });
  });

  test('exposes gradient stops (start/end) for all 5 colors', () => {
    ['cyan', 'magenta', 'green', 'amber', 'purple'].forEach((name) => {
      expect(shared).toMatch(new RegExp(`--grad-${name}-start\\s*:`));
      expect(shared).toMatch(new RegExp(`--grad-${name}-end\\s*:`));
    });
  });

  test('defines coin, donut, statcard, heatmap dimension tokens', () => {
    expect(shared).toMatch(/--coin-size-(sm|md|lg)\s*:/);
    expect(shared).toMatch(/--donut-size-(sm|md|lg)\s*:/);
    expect(shared).toMatch(/--statcard-min-height\s*:/);
    expect(shared).toMatch(/--heatmap-dot-size\s*:/);
  });
});

describe('Data Layer — theme parity (premium-light / sober-dark / vibrant-dark)', () => {
  const ESSENTIAL_TOKENS = [
    '--bg-base', '--bg-surface-1', '--bg-surface-2', '--bg-surface-3',
    '--text-primary', '--text-secondary', '--text-muted',
    '--accent-primary', '--accent-primary-hover', '--accent-primary-muted',
    '--color-success', '--color-warning', '--color-error', '--color-info',
    '--delta-positive-fg', '--delta-positive-bg',
    '--delta-negative-fg', '--delta-negative-bg',
    '--delta-neutral-fg', '--delta-neutral-bg',
    '--chart-line', '--chart-grid',
    '--surface-accent-cyan', '--surface-accent-magenta', '--surface-accent-green',
    '--surface-accent-amber', '--surface-accent-purple',
    '--heatmap-dot-0', '--heatmap-dot-1', '--heatmap-dot-2',
    '--heatmap-dot-3', '--heatmap-dot-4',
    '--focus-ring-color',
  ];

  let premiumProps, soberProps, vibrantProps;

  beforeAll(() => {
    const premium = fs.readFileSync(PREMIUM_PATH, 'utf-8');
    const sober = fs.readFileSync(SOBER_PATH, 'utf-8');
    const vibrant = fs.readFileSync(VIBRANT_PATH, 'utf-8');

    premiumProps = extractPropertiesFromBlock(premium, '[data-theme="premium-light"]');
    soberProps = extractPropertiesFromBlock(sober, '[data-theme="sober-dark"]');
    vibrantProps = extractPropertiesFromBlock(vibrant, '[data-theme="vibrant-dark"]');
  });

  test('premium-light defines all essential tokens', () => {
    const missing = ESSENTIAL_TOKENS.filter((t) => !premiumProps.includes(t));
    expect(missing).toEqual([]);
  });

  test('sober-dark defines all essential tokens', () => {
    const missing = ESSENTIAL_TOKENS.filter((t) => !soberProps.includes(t));
    expect(missing).toEqual([]);
  });

  test('vibrant-dark defines all essential tokens', () => {
    const missing = ESSENTIAL_TOKENS.filter((t) => !vibrantProps.includes(t));
    expect(missing).toEqual([]);
  });

  test('all 3 themes have the same essential tokens (parity)', () => {
    const inPremiumNotSober = premiumProps.filter((p) => !soberProps.includes(p));
    const inSoberNotVibrant = soberProps.filter((p) => !vibrantProps.includes(p));
    const inVibrantNotPremium = vibrantProps.filter((p) => !premiumProps.includes(p));

    if (inPremiumNotSober.length || inSoberNotVibrant.length || inVibrantNotPremium.length) {
      throw new Error(
        'Theme parity broken:\n' +
          `  premium → sober missing: ${inPremiumNotSober.join(', ') || '(none)'}\n` +
          `  sober → vibrant missing: ${inSoberNotVibrant.join(', ') || '(none)'}\n` +
          `  vibrant → premium missing: ${inVibrantNotPremium.join(', ') || '(none)'}`
      );
    }
  });
});

describe('Data Layer — components (data-cards.css)', () => {
  let css;
  beforeAll(() => {
    css = fs.readFileSync(DATA_CARDS_PATH, 'utf-8');
  });

  const COMPONENTS = [
    { name: 'StatCard', cls: '.dl-statcard' },
    { name: 'Coin', cls: '.dl-coin' },
    { name: 'Delta', cls: '.dl-delta' },
    { name: 'Chart', cls: '.dl-chart' },
    { name: 'Donut', cls: '.dl-donut' },
    { name: 'Table', cls: '.dl-table' },
    { name: 'Sparkline', cls: '.dl-sparkline' },
    { name: 'AvatarStack', cls: '.dl-avatar-stack' },
    { name: 'StatusPill', cls: '.dl-status' },
    { name: 'TooltipCallout', cls: '.dl-tooltip-callout' },
  ];

  COMPONENTS.forEach(({ name, cls }) => {
    test(`${name} (${cls}) is defined`, () => {
      const escaped = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      expect(css).toMatch(new RegExp(`${escaped}\\s*\\{`));
    });
  });

  test('Coin has 5 gradient color variants', () => {
    ['cyan', 'magenta', 'green', 'amber', 'purple'].forEach((c) => {
      expect(css).toMatch(new RegExp(`\\.dl-coin--${c}\\s*\\{`));
    });
  });

  test('Delta has positive/negative/neutral variants', () => {
    expect(css).toMatch(/\.dl-delta--positive\s*\{/);
    expect(css).toMatch(/\.dl-delta--negative\s*\{/);
    expect(css).toMatch(/\.dl-delta--neutral\s*\{/);
  });

  test('StatusPill has 5 semantic variants', () => {
    ['in-progress', 'done', 'need-review', 'pending', 'blocked'].forEach((v) => {
      expect(css).toMatch(new RegExp(`\\.dl-status--${v}\\s*\\{`));
    });
  });

  test('respects prefers-reduced-motion', () => {
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });
});
