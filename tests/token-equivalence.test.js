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


test('fonte DTCG gera o núcleo equivalente com escopos e cascata em diretório isolado', () => {
  const os = require('os');
  const path = require('path');
  const { execFileSync } = require('child_process');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'resultx-core-'));
  try {
    execFileSync(process.execPath, ['scripts/build-core.mjs'], {
      env: { ...process.env, RESULTX_CORE_OUTPUT: output }, stdio: 'pipe',
    });
    const file = 'tokens/tokens.css';
    expect(normalizeCss(fs.readFileSync(path.join(output, 'tokens.css'), 'utf8'), file)).toEqual(reference.css[file]);
  } finally {
    fs.rmSync(output, { recursive: true, force: true });
  }
});


test('fonte DTCG gera os CSS das marcas com escopos equivalentes', () => {
  const os = require('os');
  const path = require('path');
  const { execFileSync } = require('child_process');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'resultx-brands-'));
  try {
    execFileSync(process.execPath, ['scripts/build-brand-tokens.mjs'], {
      env: { ...process.env, RESULTX_BRANDS_OUTPUT: output }, stdio: 'pipe',
    });
    for (const brand of ['electia', 'emprega-mais', 'pdv', 'resultx', 'xscore']) {
      const file = `brands/${brand}/tokens/tokens.css`;
      expect(normalizeCss(fs.readFileSync(path.join(output, brand, 'tokens/tokens.css'), 'utf8'), file)).toEqual(reference.css[file]);
    }
  } finally {
    fs.rmSync(output, { recursive: true, force: true });
  }
});


// Tokens novos explicitamente listados: não entram no CSS padrão da v2.10.0.
const NEW_OPT_IN_ALIASES = {
  file: 'tokens/legacy-aliases.css',
  export: './tokens/legacy',
  tokens: {
    'bg-card': 'bg-surface-2',
    'accent-teal': 'accent-primary',
    'accent-teal-hover': 'accent-primary-hover',
    'accent-teal-muted': 'accent-primary-muted',
    'accent-on-dark': 'accent-primary-text',
  },
};
test('aliases legados opt-in gerados são os únicos tokens novos listados', () => {
  const os = require('os');
  const path = require('path');
  const { execFileSync } = require('child_process');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'resultx-aliases-'));
  try {
    execFileSync(process.execPath, ['scripts/build-aliases.mjs'], {
      env: { ...process.env, RESULTX_ALIASES_OUTPUT: output }, stdio: 'pipe',
    });
    const expected = Object.entries(NEW_OPT_IN_ALIASES.tokens).map(([name, target]) =>
      ['decl', [['selector', ':root, [data-theme]']], `--${name}`, `var(--${target})`, false]);
    const fresh = normalizeCss(fs.readFileSync(path.join(output, 'legacy-aliases.css'), 'utf8'), NEW_OPT_IN_ALIASES.file);
    expect(fresh).toEqual(expected);
    expect(normalizeCss(fs.readFileSync(NEW_OPT_IN_ALIASES.file, 'utf8'), NEW_OPT_IN_ALIASES.file)).toEqual(expected);
    expect(require('../package.json').exports[NEW_OPT_IN_ALIASES.export]).toBe(`./${NEW_OPT_IN_ALIASES.file}`);
  } finally {
    fs.rmSync(output, { recursive: true, force: true });
  }
});


test('fonte DTCG gera eds-root e SHA congelados byte a byte', () => {
  const os = require('os');
  const path = require('path');
  const { execFileSync } = require('child_process');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'resultx-eds-'));
  try {
    execFileSync(process.execPath, ['scripts/build-eds-root.mjs'], {
      env: { ...process.env, RESULTX_EDS_OUTPUT: output }, stdio: 'pipe',
    });
    expect(fs.readFileSync(path.join(output, 'eds-root.css'))).toEqual(fs.readFileSync('brands/emprega-mais/tokens/eds-root.css'));
    expect(fs.readFileSync(path.join(output, 'eds-root.sha256'))).toEqual(fs.readFileSync('brands/emprega-mais/tokens/eds-root.sha256'));
  } finally { fs.rmSync(output, { recursive: true, force: true }); }
});

test.each(['dimensão EDS', 'cor vinculada da marca'])('trava EDS rejeita mudança na %s antes de escrever', (kind) => {
  const os = require('os');
  const path = require('path');
  const { spawnSync } = require('child_process');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'resultx-eds-locked-'));
  try {
    const source = JSON.parse(fs.readFileSync('tokens/tokens.json', 'utf8'));
    if (kind === 'dimensão EDS') source.primitives.eds.base['eds-radius-chip'].$value.value += 1;
    else source.primitives.brand['emprega-mais'].base['emp-indigo-dark'].$value = '{primitives.brand.emprega-mais.color.rgb-99-102-241-alpha-1}';
    const sourceFile = path.join(output, 'mutated.json');
    fs.writeFileSync(sourceFile, JSON.stringify(source));
    const result = spawnSync(process.execPath, ['scripts/build-eds-root.mjs'], {
      env: { ...process.env, RESULTX_EDS_SOURCE: sourceFile, RESULTX_EDS_OUTPUT: output }, encoding: 'utf8',
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('EDS congelado');
    expect(fs.existsSync(path.join(output, 'eds-root.css'))).toBe(false);
    expect(fs.existsSync(path.join(output, 'eds-root.sha256'))).toBe(false);
  } finally { fs.rmSync(output, { recursive: true, force: true }); }
});


test('exports existentes permanecem idênticos e os novos exports são explícitos', () => {
  const current = require('../package.json').exports;
  for (const [name, destination] of Object.entries(reference.exports)) expect(current[name]).toBe(destination);
  expect(Object.keys(current).filter((name) => !(name in reference.exports))).toEqual([NEW_OPT_IN_ALIASES.export, './adapters/css/pilot', './adapters/css/pilot/scoped']);
  expect(current['./adapters/css/pilot']).toBe('./adapters/css/pilot.css');
  expect(current['./adapters/css/pilot/scoped']).toBe('./adapters/css/pilot.scoped.css');
});

test('build completo verifica EDS congelado antes de escrever qualquer artefato', () => {
  const os = require('os');
  const path = require('path');
  const { spawnSync } = require('child_process');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'resultx-eds-preflight-'));
  try {
    const source = JSON.parse(fs.readFileSync('tokens/tokens.json', 'utf8'));
    source.primitives.eds.base['eds-radius-chip'].$value.value += 1;
    const mutated = path.join(output, 'mutated.json');
    fs.writeFileSync(mutated, JSON.stringify(source));
    const files = [...CSS_FILES, 'dist/tokens.ts', 'dist/components.min.css', 'dist/icons.min.css', 'brands/emprega-mais/tokens/eds-root.css', 'brands/emprega-mais/tokens/eds-root.sha256'];
    const before = files.map((file) => fs.statSync(file, { bigint: true }).mtimeNs);
    const result = spawnSync('npm', ['run', 'build'], {
      env: { ...process.env, RESULTX_EDS_SOURCE: mutated }, encoding: 'utf8',
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('EDS congelado');
    expect(files.map((file) => fs.statSync(file, { bigint: true }).mtimeNs)).toEqual(before);
  } finally { fs.rmSync(output, { recursive: true, force: true }); }
});
