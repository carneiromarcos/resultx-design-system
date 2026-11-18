const fs = require('fs');
const postcss = require('postcss');
const parser = require('postcss-value-parser');
const source = require('../tokens/tokens.json');
const yaml = require('js-yaml');
const names = new Set();
(function walk(o) { for (const [k, v] of Object.entries(o)) { if (v && typeof v === 'object' && '$value' in v) names.add(`--${k}`); else if (v && typeof v === 'object') walk(v); } })(source.semantic);

test('CSS isolado usa somente valores de token ou palavras estruturais', () => {
  const root = postcss.parse(fs.readFileSync('adapters/css/pilot.css', 'utf8'));
  const consumed = new Set();
  root.walkRules((rule) => {
    expect(rule.parent.type).toBe('atrule');
    expect(rule.parent.name).toBe('layer');
    expect(rule.parent.params).toBe('components');
    for (const selector of rule.selectors) expect(selector.trim()).toMatch(/^\.rx-/);
  });
  const structural = new Set(['solid', 'dashed', 'progress', 'grid', 'inline-block', 'border-box', 'normal', 'none', 'collapse', 'left', 'not-allowed', 'pointer', 'tabular-nums', 'relative', 'block', 'absolute', 'in', 'srgb', '45%', 'transparent', '50%', '100%', '-70%', '45deg', '2px', '3', '2', '0', '*', '+', 'vertical']);
  root.walkDecls((decl) => {
    parser(decl.value).walk((node) => {
      if (node.type === 'function') {
        if (node.value === 'var') {
          expect(node.nodes).toHaveLength(1);
          const token = node.nodes[0].value;
          expect(names.has(token)).toBe(true);
          consumed.add(token);
          return false;
        }
        expect(['calc', 'color-mix', 'translateY', 'rotate']).toContain(node.value);
        return undefined;
      }
      if (node.type === 'word') expect(structural.has(node.value)).toBe(true);
      return undefined;
    });
  });
  const declared = new Set(fs.readdirSync('contracts').filter((f) => f.endsWith('.yaml')).flatMap((f) => yaml.load(fs.readFileSync(`contracts/${f}`, 'utf8')).tokens));
  expect([...consumed].filter((token) => !declared.has(token))).toEqual([]);
});

test('Select2 acompanha o controle fechado, foco e erro com papéis existentes', () => {
  const root = postcss.parse(fs.readFileSync('adapters/css/pilot.css', 'utf8'));
  const selectors = [];
  root.walkRules((rule) => selectors.push(...rule.selectors));
  expect(selectors.some((selector) => selector.includes('.select2-container--focus .select2-selection'))).toBe(true);
  expect(selectors.some((selector) => selector.includes('.select2-container--open .select2-selection'))).toBe(true);
  expect(selectors.some((selector) => selector.includes("select[aria-invalid='true'] + .select2-container .select2-selection"))).toBe(true);
  expect(selectors.some((selector) => selector.includes('.select2-selection__arrow b'))).toBe(true);
  expect(selectors.some((selector) => selector.includes('.select2-results'))).toBe(false);
  const css = fs.readFileSync('adapters/css/pilot.css', 'utf8');
  expect(css).toContain('min-height: calc(var(--text-sm) * var(--leading-relaxed) + 2 * var(--space-2) + 2px)');
  expect(css).toContain('border-color: var(--text-muted) transparent transparent');
  expect(css).toContain('color-mix(in srgb, var(--color-error) 45%, transparent)');
  let normal;
  root.walkRules((rule) => { if (rule.selectors.includes('.rx-field .select2-container .select2-selection')) normal = rule; });
  expect(normal).toBeDefined();
  const declarations = Object.fromEntries(normal.nodes.filter((node) => node.type === 'decl').map(({ prop, value }) => [prop, value]));
  expect(declarations).toMatchObject({
    background: 'var(--bg-surface-1)',
    border: 'var(--focus-ring-width) solid var(--text-muted)',
    'border-radius': 'var(--radius-md)',
    padding: 'var(--space-2) var(--space-10) var(--space-2) var(--space-4)',
  });
  const shared = postcss.parse(fs.readFileSync('components/components.css', 'utf8'));
  let sharedNormal;
  shared.walkRules((rule) => { if (rule.selectors.includes('.form-select-wrap .select2-container .select2-selection')) sharedNormal = rule; });
  expect(sharedNormal).toBeDefined();
  const sharedDeclarations = Object.fromEntries(sharedNormal.nodes.filter((node) => node.type === 'decl').map(({ prop, value }) => [prop, value]));
  expect(sharedDeclarations).toMatchObject({
    background: 'var(--bg-base)',
    border: '1px solid var(--text-muted)',
    'border-radius': 'var(--radius-md)',
    padding: 'var(--space-2) var(--space-10) var(--space-2) var(--space-4)',
  });
});

test('campos compartilhados mantêm borda acessível e foco de erro sem alterar tokens', () => {
  const shared = postcss.parse(fs.readFileSync('components/components.css', 'utf8'));
  const selectors = new Set();
  const declarations = new Map();
  shared.walkRules((rule) => {
    for (const selector of rule.selectors) {
      selectors.add(selector);
      const current = declarations.get(selector) || {};
      rule.walkDecls((decl) => { current[decl.prop] = decl.value; });
      declarations.set(selector, current);
    }
  });
  for (const selector of ['.form-input', '.form-select']) {
    expect(declarations.get(selector).border).toBe('1px solid var(--text-muted)');
  }
  expect(declarations.get('.form-textarea').border).toBe('1px solid var(--text-muted)');
  for (const selector of [
    ".form-input[aria-invalid='true']:focus-visible",
    ".form-select[aria-invalid='true']:focus-visible",
    ".form-textarea[aria-invalid='true']:focus-visible"
  ]) expect(selectors.has(selector)).toBe(true);
  expect(shared.toString()).toContain('color-mix(in srgb, var(--color-error) 45%, transparent)');
  expect(shared.toString()).not.toContain('rgba(239, 68, 68, 0.3)');
  expect(shared.toString()).toContain('calc(3 * var(--text-sm) * var(--leading-relaxed) + 2 * var(--space-3) + 2px)');
});
