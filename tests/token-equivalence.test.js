/** Contrato de saída da E1 contra v2.10.0, com ordem e escopo de cascata. */
const fs = require('fs');
const reference = require('./fixtures/tokens-v2.10.0.json');
const { CSS_FILES, normalizeCss } = require('./lib/token-equivalence');

test.each(CSS_FILES)('%s preserva declarações e cascata da v2.10.0', (file) => {
  expect(normalizeCss(fs.readFileSync(file, 'utf8'), file)).toEqual(reference.css[file]);
});

test('dist/tokens.ts preserva a API e os valores da v2.10.0', () => {
  expect(fs.readFileSync('dist/tokens.ts', 'utf8')).toBe(reference.ts);
});


test('normalização preserva cascata, duplicatas e espaços dentro de strings', () => {
  const source = ':root { --a: 1; --a: 2; content: "A  B" } @media (prefers-color-scheme: dark) { :root { --a: 3 } }';
  const initial = normalizeCss(source, 'amostra.css');
  expect(normalizeCss(source.replace('--a: 1; --a: 2;', '--a: 2; --a: 1;'), 'amostra.css')).not.toEqual(initial);
  expect(normalizeCss(source.replace('A  B', 'A B'), 'amostra.css')).not.toEqual(initial);
  expect(normalizeCss(source.replace('prefers-color-scheme: dark', 'prefers-color-scheme: light'), 'amostra.css')).not.toEqual(initial);
});

test('eds-root permanece byte a byte na versão de referência', () => {
  const crypto = require('crypto');
  const css = fs.readFileSync('brands/emprega-mais/tokens/eds-root.css');
  expect(crypto.createHash('sha256').update(css).digest('hex')).toBe(reference.edsRootSha256);
  expect(fs.readFileSync('brands/emprega-mais/tokens/eds-root.sha256', 'utf8').trim()).toBe(reference.edsRootSha256);
});
