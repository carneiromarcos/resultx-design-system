'use strict';

const { evaluate } = require('../scripts/check-ccor1-contrast.cjs');

test('C-cor-1 mede pares decorativos, perigo forte, marcas e PdV no build', () => {
  const { results, failures } = evaluate();
  expect(results).toHaveLength(68);
  expect(failures).toEqual([]);
  expect(results.every(result => result.ratio >= result.min)).toBe(true);
});

test('a tinta indisponível do PdV permanece distinta do texto normal', () => {
  const fs = require('fs');
  const postcss = require('postcss');
  const root = postcss.parse(fs.readFileSync('brands/pdv/tokens/tokens.css', 'utf8'));
  let vars = {};
  root.walkRules(rule => {
    if (rule.selector === ':root') rule.walkDecls(d => { vars[d.prop] = d.value; });
  });
  expect(vars['--text-unavailable']).not.toBe(vars['--gray-100']);
  expect(vars['--text-unavailable']).toBe('#A9B3C6');
});
