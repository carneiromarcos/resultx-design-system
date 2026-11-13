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
  const structural = new Set(['solid', 'grid', 'inline-block', 'collapse', 'left', 'not-allowed', 'pointer', 'tabular-nums']);
  root.walkDecls((decl) => {
    parser(decl.value).walk((node) => {
      if (node.type === 'function') {
        expect(node.value).toBe('var');
        expect(node.nodes).toHaveLength(1);
        const token = node.nodes[0].value;
        expect(names.has(token)).toBe(true);
        consumed.add(token);
        return false;
      }
      if (node.type === 'word') expect(structural.has(node.value)).toBe(true);
      return undefined;
    });
  });
  const declared = new Set(fs.readdirSync('contracts').filter((f) => f.endsWith('.yaml')).flatMap((f) => yaml.load(fs.readFileSync(`contracts/${f}`, 'utf8')).tokens));
  expect([...consumed].filter((token) => !declared.has(token))).toEqual([]);
});
