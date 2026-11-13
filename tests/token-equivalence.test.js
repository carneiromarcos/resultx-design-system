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


test('fonte DTCG gera a camada compartilhada equivalente em diretório isolado', () => {
  const os = require('os');
  const path = require('path');
  const { execFileSync } = require('child_process');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'resultx-dtcg-'));
  try {
    execFileSync(process.execPath, ['scripts/build-data-layer.mjs'], {
      env: { ...process.env, RESULTX_DATA_LAYER_OUTPUT: output },
      stdio: 'pipe',
    });
    const file = 'tokens/themes/_data-layer-shared.css';
    expect(normalizeCss(fs.readFileSync(path.join(output, '_data-layer-shared.css'), 'utf8'), file))
      .toEqual(reference.css[file]);
  } finally {
    fs.rmSync(output, { recursive: true, force: true });
  }
});


test('fontes DTCG geram os três temas opt-in equivalentes em diretório isolado', () => {
  const os = require('os');
  const path = require('path');
  const { execFileSync } = require('child_process');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'resultx-themes-'));
  try {
    execFileSync(process.execPath, ['scripts/build-themes.mjs'], {
      env: { ...process.env, RESULTX_THEMES_OUTPUT: output }, stdio: 'pipe',
    });
    for (const theme of ['premium-light', 'sober-dark', 'vibrant-dark']) {
      const file = `tokens/themes/${theme}.css`;
      expect(normalizeCss(fs.readFileSync(path.join(output, `${theme}.css`), 'utf8'), file)).toEqual(reference.css[file]);
    }
  } finally {
    fs.rmSync(output, { recursive: true, force: true });
  }
});


test('fonte DTCG gera a base equivalente com suas camadas em diretório isolado', () => {
  const os = require('os');
  const path = require('path');
  const { execFileSync } = require('child_process');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'resultx-base-'));
  try {
    execFileSync(process.execPath, ['scripts/build-base.mjs'], {
      env: { ...process.env, RESULTX_BASE_OUTPUT: output }, stdio: 'pipe',
    });
    const file = 'tokens/base/tokens-base.css';
    expect(normalizeCss(fs.readFileSync(path.join(output, 'tokens-base.css'), 'utf8'), file)).toEqual(reference.css[file]);
  } finally {
    fs.rmSync(output, { recursive: true, force: true });
  }
});
