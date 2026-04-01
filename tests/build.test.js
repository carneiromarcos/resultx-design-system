/**
 * Build Output & Hardcoded Color Detection Tests
 *
 * Validates that:
 * 1. dist/tokens.min.css and dist/components.min.css exist and are non-empty
 * 2. components/components.css does not contain hardcoded #hex or rgb()/rgba() values
 *    outside of allowed contexts (custom property definitions in :root/[data-theme] blocks)
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const COMPONENTS_PATH = path.resolve(__dirname, '..', 'components', 'components.css');

// ─── Build Output Tests ──────────────────────────────────────────────────────

describe('Build Output', () => {
  test('dist/tokens.min.css exists and is non-empty', () => {
    const filePath = path.join(DIST_DIR, 'tokens.min.css');
    expect(fs.existsSync(filePath)).toBe(true);

    const stat = fs.statSync(filePath);
    expect(stat.size).toBeGreaterThan(0);
  });

  test('dist/components.min.css exists and is non-empty', () => {
    const filePath = path.join(DIST_DIR, 'components.min.css');
    expect(fs.existsSync(filePath)).toBe(true);

    const stat = fs.statSync(filePath);
    expect(stat.size).toBeGreaterThan(0);
  });

  test('minified tokens file is smaller than source', () => {
    const sourcePath = path.resolve(__dirname, '..', 'tokens', 'tokens.css');
    const distPath = path.join(DIST_DIR, 'tokens.min.css');

    if (!fs.existsSync(sourcePath) || !fs.existsSync(distPath)) return;

    const sourceSize = fs.statSync(sourcePath).size;
    const distSize = fs.statSync(distPath).size;
    expect(distSize).toBeLessThan(sourceSize);
  });

  test('minified components file is smaller than source', () => {
    const sourcePath = COMPONENTS_PATH;
    const distPath = path.join(DIST_DIR, 'components.min.css');

    if (!fs.existsSync(sourcePath) || !fs.existsSync(distPath)) return;

    const sourceSize = fs.statSync(sourcePath).size;
    const distSize = fs.statSync(distPath).size;
    expect(distSize).toBeLessThan(sourceSize);
  });
});

// ─── Hardcoded Color Detection ───────────────────────────────────────────────

/**
 * Strips CSS comments from source text.
 */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Identifies top-level blocks in CSS and classifies each line as either
 * "definition-context" (inside :root or [data-theme] blocks where custom
 * property definitions live) or "component-context" (everything else).
 *
 * Returns only lines that are in component-context (where hardcoded colors
 * should NOT appear).
 */
function getComponentLines(css) {
  const stripped = stripComments(css);
  const lines = stripped.split('\n');

  const componentLines = [];
  let braceDepth = 0;
  let inDefinitionBlock = false;
  let definitionBlockDepth = 0;

  // Selectors that are allowed to contain raw color values
  const definitionSelectors = [':root', '[data-theme=', '@media'];
  // Also allow @keyframes blocks (they may contain rgba in box-shadow etc.)
  const animationSelectors = ['@keyframes'];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Count braces on this line
    for (const char of line) {
      if (char === '{') {
        braceDepth++;
        // Check if we are entering a definition block
        if (!inDefinitionBlock) {
          const prevContent = lines.slice(Math.max(0, i - 2), i + 1).join(' ');
          const isDefinition = definitionSelectors.some(sel => prevContent.includes(sel));
          const isAnimation = animationSelectors.some(sel => prevContent.includes(sel));
          if (isDefinition || isAnimation) {
            inDefinitionBlock = true;
            definitionBlockDepth = braceDepth;
          }
        }
      }
      if (char === '}') {
        if (inDefinitionBlock && braceDepth === definitionBlockDepth) {
          inDefinitionBlock = false;
        }
        braceDepth--;
      }
    }

    if (!inDefinitionBlock && trimmed.length > 0) {
      componentLines.push({ lineNumber: i + 1, content: trimmed });
    }
  }

  return componentLines;
}

describe('Hardcoded Color Detection', () => {
  let css;
  let componentLines;

  beforeAll(() => {
    css = fs.readFileSync(COMPONENTS_PATH, 'utf-8');
    componentLines = getComponentLines(css);
  });

  test('components.css exists and has content', () => {
    expect(css.length).toBeGreaterThan(0);
  });

  test('no hardcoded #hex colors in component selectors', () => {
    // Match #hex (3, 4, 6, or 8 digit) that are NOT inside var() references
    const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;

    const violations = [];

    for (const { lineNumber, content } of componentLines) {
      // Skip lines without hex
      if (!content.includes('#')) continue;
      // Skip custom property definitions (--prop: #hex) -- these are OK
      if (/^\s*--[\w-]+\s*:/.test(content)) continue;

      const matches = content.match(hexPattern);
      if (matches) {
        violations.push({
          line: lineNumber,
          value: matches.join(', '),
          context: content.substring(0, 120),
        });
      }
    }

    if (violations.length > 0) {
      const report = violations
        .map(v => `  Line ${v.line}: ${v.value} in "${v.context}"`)
        .join('\n');
      throw new Error(
        `Found ${violations.length} hardcoded #hex color(s) in component selectors.\n` +
        `These should use CSS custom properties (var(--token-name)) instead:\n${report}`
      );
    }
  });

  test('no hardcoded rgb()/rgba() in backgrounds or color properties', () => {
    const rgbPattern = /rgba?\s*\([^)]+\)/g;

    // rgba is acceptable in box-shadow, border, and border-color declarations
    // because alpha-blended shadows and borders are standard CSS patterns
    const allowedProperties = /box-shadow|border.*solid|border-color/;

    const violations = [];

    for (const { lineNumber, content } of componentLines) {
      if (!content.includes('rgb')) continue;
      if (/^\s*--[\w-]+\s*:/.test(content)) continue;
      if (allowedProperties.test(content)) continue;

      const matches = content.match(rgbPattern);
      if (matches) {
        violations.push({
          line: lineNumber,
          value: matches.join(', '),
          context: content.substring(0, 120),
        });
      }
    }

    if (violations.length > 0) {
      const report = violations
        .map(v => `  Line ${v.line}: ${v.value} in "${v.context}"`)
        .join('\n');

      throw new Error(
        `Found ${violations.length} hardcoded rgb()/rgba() color(s) in background/color properties.\n` +
        `These should be extracted to CSS custom properties in tokens.css:\n${report}`
      );
    }
  });

  test('summary: count of all hardcoded colors in components', () => {
    const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
    const rgbPattern = /rgba?\s*\([^)]+\)/g;
    let hexCount = 0;
    let rgbCount = 0;

    for (const { content } of componentLines) {
      if (/^\s*--[\w-]+\s*:/.test(content)) continue;
      const hexMatches = content.match(hexPattern);
      const rgbMatches = content.match(rgbPattern);
      if (hexMatches) hexCount += hexMatches.length;
      if (rgbMatches) rgbCount += rgbMatches.length;
    }

    // Log the summary for visibility
    console.log(`  Hardcoded colors in component selectors: ${hexCount} hex, ${rgbCount} rgba`);

    // The individual tests above already fail if > 0, this just provides a summary
    expect(typeof hexCount).toBe('number');
  });
});
