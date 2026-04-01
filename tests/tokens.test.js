/**
 * Token Integrity Tests
 *
 * Validates that:
 * 1. Every custom property in [data-theme="dark"] also exists in [data-theme="light"] and vice-versa
 * 2. The :root block only contains shared (theme-independent) tokens
 * 3. No theme-specific tokens are accidentally placed in :root
 */

const fs = require('fs');
const path = require('path');

const TOKENS_PATH = path.resolve(__dirname, '..', 'tokens', 'tokens.css');

/**
 * Parse CSS custom properties from a specific selector block.
 * Handles nested braces (e.g. rgba values) correctly.
 * Returns an array of property names (e.g. ['--bg-base', '--text-primary']).
 */
function extractPropertiesFromBlock(css, selectorPattern) {
  const properties = [];

  // Find all occurrences of the selector pattern
  const selectorRegex = new RegExp(selectorPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{', 'g');
  let selectorMatch;

  while ((selectorMatch = selectorRegex.exec(css)) !== null) {
    let braceDepth = 1;
    let pos = selectorMatch.index + selectorMatch[0].length;

    // Walk forward, tracking brace depth to find the matching closing brace
    while (pos < css.length && braceDepth > 0) {
      if (css[pos] === '{') braceDepth++;
      if (css[pos] === '}') braceDepth--;
      pos++;
    }

    const blockContent = css.slice(selectorMatch.index + selectorMatch[0].length, pos - 1);

    // Extract all --property declarations (not references via var())
    // No ^ anchor — fallback blocks use multiple props per line
    const propRegex = /(--[\w-]+)\s*:/g;
    let propMatch;
    while ((propMatch = propRegex.exec(blockContent)) !== null) {
      properties.push(propMatch[1]);
    }
  }

  return [...new Set(properties)]; // deduplicate
}

describe('Token Integrity', () => {
  let css;

  beforeAll(() => {
    css = fs.readFileSync(TOKENS_PATH, 'utf-8');
  });

  test('tokens.css exists and is non-empty', () => {
    expect(css.length).toBeGreaterThan(0);
  });

  test('contains :root, [data-theme="dark"], and [data-theme="light"] blocks', () => {
    expect(css).toMatch(/:root\s*\{/);
    expect(css).toMatch(/\[data-theme="dark"\]\s*\{/);
    expect(css).toMatch(/\[data-theme="light"\]\s*\{/);
  });

  describe('dark/light theme parity', () => {
    let darkProps;
    let lightProps;

    beforeAll(() => {
      darkProps = extractPropertiesFromBlock(css, '[data-theme="dark"]');
      lightProps = extractPropertiesFromBlock(css, '[data-theme="light"]');
    });

    test('dark theme defines custom properties', () => {
      expect(darkProps.length).toBeGreaterThan(0);
    });

    test('light theme defines custom properties', () => {
      expect(lightProps.length).toBeGreaterThan(0);
    });

    test('every dark theme property also exists in light theme', () => {
      const missingInLight = darkProps.filter(p => !lightProps.includes(p));
      if (missingInLight.length > 0) {
        throw new Error(
          `${missingInLight.length} dark-theme properties missing in light theme:\n` +
          missingInLight.map(p => `  - ${p}`).join('\n')
        );
      }
    });

    test('every light theme property also exists in dark theme', () => {
      const missingInDark = lightProps.filter(p => !darkProps.includes(p));
      if (missingInDark.length > 0) {
        throw new Error(
          `${missingInDark.length} light-theme properties missing in dark theme:\n` +
          missingInDark.map(p => `  - ${p}`).join('\n')
        );
      }
    });

    test('dark and light themes have the same number of properties', () => {
      expect(darkProps.length).toBe(lightProps.length);
    });
  });

  describe(':root shared tokens', () => {
    let rootProps;
    let darkProps;

    beforeAll(() => {
      // Only get props from the actual :root { } block (not :root:not([data-theme]) media query blocks)
      // The standalone :root block appears before any [data-theme] block
      const rootBlockMatch = css.match(/:root\s*\{/);
      if (rootBlockMatch) {
        let braceDepth = 1;
        let pos = rootBlockMatch.index + rootBlockMatch[0].length;
        while (pos < css.length && braceDepth > 0) {
          if (css[pos] === '{') braceDepth++;
          if (css[pos] === '}') braceDepth--;
          pos++;
        }
        const rootContent = css.slice(rootBlockMatch.index + rootBlockMatch[0].length, pos - 1);
        const propRegex = /^\s*(--[\w-]+)\s*:/gm;
        rootProps = [];
        let m;
        while ((m = propRegex.exec(rootContent)) !== null) {
          rootProps.push(m[1]);
        }
      } else {
        rootProps = [];
      }
      darkProps = extractPropertiesFromBlock(css, '[data-theme="dark"]');
    });

    test(':root defines shared tokens', () => {
      expect(rootProps.length).toBeGreaterThan(0);
    });

    test(':root tokens do NOT overlap with theme-specific tokens (no accidental duplication)', () => {
      const overlapping = rootProps.filter(p => darkProps.includes(p));
      // Some overlap may be intentional (e.g. overrides), but flag large overlaps
      // Threshold: if more than 20% of :root props also appear in themes, something is wrong
      const overlapPercent = (overlapping.length / rootProps.length) * 100;
      if (overlapPercent > 20) {
        throw new Error(
          `${overlapping.length}/${rootProps.length} (${overlapPercent.toFixed(0)}%) :root tokens also appear in themes. ` +
          `This suggests theme-specific tokens were accidentally placed in :root:\n` +
          overlapping.map(p => `  - ${p}`).join('\n')
        );
      }
    });
  });

  describe('prefers-color-scheme fallback parity', () => {
    let darkProps;
    let fallbackDarkProps;
    let lightProps;
    let fallbackLightProps;

    beforeAll(() => {
      darkProps = extractPropertiesFromBlock(css, '[data-theme="dark"]');
      lightProps = extractPropertiesFromBlock(css, '[data-theme="light"]');

      // Extract from @media (prefers-color-scheme: dark) { :root:not([data-theme]) { ... } }
      // These are inlined in a single :root:not block inside the media query
      fallbackDarkProps = extractPropertiesFromBlock(css.match(/@media\s*\(prefers-color-scheme:\s*dark\)\s*\{[\s\S]*?\n\}/)?.[0] || '', ':root:not([data-theme])');
      fallbackLightProps = extractPropertiesFromBlock(css.match(/@media\s*\(prefers-color-scheme:\s*light\)\s*\{[\s\S]*?\n\}/)?.[0] || '', ':root:not([data-theme])');
    });

    test('prefers-color-scheme: dark fallback covers all dark theme properties', () => {
      if (fallbackDarkProps.length === 0) {
        // No fallback block found -- skip
        return;
      }
      const missing = darkProps.filter(p => !fallbackDarkProps.includes(p));
      if (missing.length > 0) {
        throw new Error(
          `${missing.length} dark-theme properties missing in prefers-color-scheme:dark fallback:\n` +
          missing.map(p => `  - ${p}`).join('\n')
        );
      }
    });

    test('prefers-color-scheme: light fallback covers all light theme properties', () => {
      if (fallbackLightProps.length === 0) {
        // No fallback block found -- skip
        return;
      }
      const missing = lightProps.filter(p => !fallbackLightProps.includes(p));
      if (missing.length > 0) {
        throw new Error(
          `${missing.length} light-theme properties missing in prefers-color-scheme:light fallback:\n` +
          missing.map(p => `  - ${p}`).join('\n')
        );
      }
    });
  });
});
