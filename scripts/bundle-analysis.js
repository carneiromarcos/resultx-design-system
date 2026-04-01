/**
 * ResultX Design System — Bundle Analysis
 *
 * Parses components.css into sections (delimited by double-line ══════ headers),
 * counts selectors/rules per section, and prints a formatted report comparing
 * source vs. minified sizes.
 *
 * Usage:  node scripts/bundle-analysis.js
 */

const fs = require('fs');
const path = require('path');

// ── Paths ──────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_SRC = path.join(ROOT, 'components', 'components.css');
const TOKENS_SRC = path.join(ROOT, 'tokens', 'tokens.css');
const TOKENS_MIN = path.join(ROOT, 'dist', 'tokens.min.css');
const COMPONENTS_MIN = path.join(ROOT, 'dist', 'components.min.css');

// ── Helpers ────────────────────────────────────────────────────────

/** Format bytes as human-readable KB string (e.g. "12.4 KB"). */
function fmtKB(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

/** Right-pad a string to `len` characters. */
function pad(str, len) {
  return String(str).padEnd(len);
}

/** Left-pad a string to `len` characters. */
function lpad(str, len) {
  return String(str).padStart(len);
}

/** Format a number with comma thousands separators. */
function fmtNum(n) {
  return n.toLocaleString('en-US');
}

/**
 * Count CSS rule blocks (selectors followed by `{`) in a chunk of CSS text.
 * This is a simple heuristic: count occurrences of `{` that are NOT inside
 * a comment.
 */
function countRules(css) {
  // Strip comments first
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const matches = stripped.match(/\{/g);
  return matches ? matches.length : 0;
}

/**
 * Read a file and return its size in bytes, or null if missing.
 */
function fileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return null;
  }
}

/**
 * Read a file and return its content, or null if missing.
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// ── Section parser ─────────────────────────────────────────────────

/**
 * Parse components.css into sections.
 *
 * Section headers follow this pattern (3 lines):
 *   /* ══════════════════════════════════════════════════════════════════
 *      SECTION NAME
 *      ══════════════════════════════════════════════════════════════════ *​/
 *
 * Everything between two consecutive headers (or from the last header to EOF)
 * belongs to that section.
 */
function parseSections(css) {
  const lines = css.split('\n');
  const sections = [];
  let i = 0;

  // Skip anything before the first section header (the file-level comment block)
  // Look for section header pattern
  const SEPARATOR = /══════/;

  while (i < lines.length) {
    // Detect start of a section header: line with ══════
    if (SEPARATOR.test(lines[i])) {
      // Next line should be the section name
      const nameLine = (lines[i + 1] || '').trim();
      // Skip closing separator line (i + 2) which ends with */
      // The section name is nameLine (strip leading/trailing whitespace and comment chars)
      const name = nameLine.replace(/^\s*\/?\*?\s*/, '').replace(/\s*\*\/?\s*$/, '').trim();

      // Find where section content starts (after the 3-line header)
      const contentStart = i + 3;

      // Find where the next section header starts
      let contentEnd = lines.length;
      for (let j = contentStart; j < lines.length; j++) {
        if (SEPARATOR.test(lines[j])) {
          contentEnd = j;
          break;
        }
      }

      const sectionLines = lines.slice(contentStart, contentEnd);
      const sectionText = sectionLines.join('\n');
      const sectionBytes = Buffer.byteLength(sectionText, 'utf-8');

      // Also include the header itself for accurate byte totals
      const fullSectionLines = lines.slice(i, contentEnd);
      const fullSectionText = fullSectionLines.join('\n');
      const fullBytes = Buffer.byteLength(fullSectionText, 'utf-8');

      sections.push({
        name: name || '(unnamed)',
        rules: countRules(sectionText),
        bytes: fullBytes,
        lineStart: i + 1,  // 1-based
        lineEnd: contentEnd,
      });

      i = contentEnd;
    } else {
      i++;
    }
  }

  return sections;
}

// ── Main ───────────────────────────────────────────────────────────

function main() {
  // 1. Read source files
  const componentsSrc = readFile(COMPONENTS_SRC);
  if (!componentsSrc) {
    console.error('Error: components/components.css not found.');
    process.exit(1);
  }

  const tokensSrcSize = fileSize(TOKENS_SRC);
  const componentsSrcSize = fileSize(COMPONENTS_SRC);
  const tokensMinSize = fileSize(TOKENS_MIN);
  const componentsMinSize = fileSize(COMPONENTS_MIN);

  // 2. Parse sections
  const sections = parseSections(componentsSrc);
  const totalRules = sections.reduce((sum, s) => sum + s.rules, 0);
  const totalSectionBytes = sections.reduce((sum, s) => sum + s.bytes, 0);

  // 3. Output report
  console.log('');
  console.log('ResultX Design System \u2014 Bundle Analysis');
  console.log('\u2550'.repeat(42));
  console.log('');

  // Source files
  console.log('Source files:');
  if (tokensSrcSize !== null) {
    console.log('  ' + pad('tokens.css', 22) + lpad(fmtKB(tokensSrcSize), 8));
  }
  console.log('  ' + pad('components.css', 22) + lpad(fmtKB(componentsSrcSize), 8));
  console.log('  ' + '\u2500'.repeat(30));

  const totalSrc = (tokensSrcSize || 0) + componentsSrcSize;
  console.log('  ' + pad('Total source', 22) + lpad(fmtKB(totalSrc), 8));
  console.log('');

  // Minified files
  if (tokensMinSize !== null || componentsMinSize !== null) {
    console.log('Minified (dist/):');
    if (tokensMinSize !== null) {
      console.log('  ' + pad('tokens.min.css', 22) + lpad(fmtKB(tokensMinSize), 8));
    }
    if (componentsMinSize !== null) {
      console.log('  ' + pad('components.min.css', 22) + lpad(fmtKB(componentsMinSize), 8));
    }
    console.log('  ' + '\u2500'.repeat(30));

    const totalMin = (tokensMinSize || 0) + (componentsMinSize || 0);
    const reduction = totalSrc > 0 ? Math.round((1 - totalMin / totalSrc) * 100) : 0;
    console.log('  ' + pad('Total minified', 22) + lpad(fmtKB(totalMin), 8) + '  (' + reduction + '% reduction)');
    console.log('');
  }

  // Component breakdown
  console.log('Component breakdown (components.css):');

  const colSection = 24;
  const colRules = 7;
  const colBytes = 9;
  const colPct = 7;
  const headerLine = '  '
    + pad('Section', colSection)
    + lpad('Rules', colRules)
    + lpad('Bytes', colBytes)
    + lpad('%', colPct);
  const divider = '  ' + '\u2500'.repeat(colSection + colRules + colBytes + colPct);

  console.log(headerLine);
  console.log(divider);

  for (const section of sections) {
    const pct = totalSectionBytes > 0
      ? ((section.bytes / totalSectionBytes) * 100).toFixed(1)
      : '0.0';

    console.log('  '
      + pad(section.name, colSection)
      + lpad(String(section.rules), colRules)
      + lpad(fmtNum(section.bytes), colBytes)
      + lpad(pct + '%', colPct));
  }

  console.log(divider);
  console.log('  '
    + pad('Total', colSection)
    + lpad(String(totalRules), colRules)
    + lpad(fmtNum(componentsSrcSize), colBytes)
    + lpad('100%', colPct));

  console.log('');
}

main();
