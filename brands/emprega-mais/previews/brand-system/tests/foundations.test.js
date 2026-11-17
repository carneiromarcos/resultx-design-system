'use strict';
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
const here = path.resolve(__dirname, '..');
const root = path.resolve(here, '../../../..');
const outputs = ['index.html', 'dark.html', 'fonts.css', 'samples.css', 'provenance.json'];
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => fs.readFileSync(path.join(here, file), 'utf8');
const builder = () => require('../build.cjs');
beforeAll(() => { if (fs.existsSync(path.join(here, 'build.cjs'))) builder().build(); });

test('gerador cria as duas aparências com CSP e sem código de navegador', () => {
  expect(fs.existsSync(path.join(here, 'build.cjs'))).toBe(true);
  for (const [file, theme] of [['index.html', 'light'], ['dark.html', 'dark']]) {
    const html = read(file);
    expect(html).toContain(`data-theme="${theme}"`);
    expect(html).toContain('content="default-src \'self\'"');
    expect(html).not.toMatch(/<script\b|<style\b|\bstyle\s*=|\bon\w+\s*=/i);
    expect(html).toContain('alt="emprega+"');
    expect(html).not.toContain(os.homedir());
    expect(html).not.toMatch(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
  }
});

test('âncoras resolvem, temas trocam por link e capítulos têm fonte ou pendência', () => {
  for (const file of outputs.slice(0, 2)) {
    const html = read(file);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const m of html.matchAll(/href="#([^"]+)"/g)) expect(ids).toContain(m[1]);
    expect(html).toContain(file === 'index.html' ? 'href="dark.html"' : 'href="index.html"');
    for (let i = 0; i < 18; i++) expect(ids).toContain(`bb-${i}`);
    expect(html).toContain('Próximo passo');
  }
});

test('recursos da página são locais e componentes apontam ao catálogo real', () => {
  const components = fs.readdirSync(path.join(root, 'contracts')).filter(f => f.endsWith('.yaml')).map(f => f.slice(0, -5));
  for (const [file, theme] of [['index.html', 'light'], ['dark.html', 'dark']]) {
    const html = read(file);
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^#|^https:/.test(m[1])) continue;
      expect(fs.existsSync(path.resolve(here, m[1]))).toBe(true);
    }
    for (const resource of html.matchAll(/<(?:link|img|iframe|source)\b[^>]+>/g)) expect(resource[0]).not.toMatch(/(?:href|src)=["'](?:https?:|data:|\/\/)/i);
    for (const id of components) expect(html).toContain(`/catalog/emprega/${theme}/${id}/`);
  }
});

test('valores visíveis e todas as ligações CSS têm origem existente', () => {
  for (const theme of ['light', 'dark']) {
    const model = builder().model(root, theme);
    const html = read(theme === 'light' ? 'index.html' : 'dark.html');
    for (const name of ['--emp-radius-md', '--emp-font-heading', '--emp-duration-fast']) {
      expect(html).toContain(builder().escape(model.values[name]));
    }
    const css = read('style.css') + read('samples.css');
    for (const m of css.matchAll(/var\((--[\w-]+)\)/g)) expect(model.values[m[1]]).toBeDefined();
    expect(css).not.toMatch(/#[\da-f]{3,8}\b|\brgba?\(|\bhsla?\(/i);
    expect(css).not.toMatch(/text-transform\s*:/);
    expect(css + read('fonts.css')).not.toMatch(/(?:url\(|@import)\s*["']?(?:https?:|data:|\/\/)/i);
  }
});

test('fontes usam as faces oficiais existentes e o manifesto só registra caminhos relativos', () => {
  const css = read('fonts.css');
  expect(css).toMatch(/font-family:\s*Inter;/);
  expect(css).toMatch(/font-family:\s*Sora;/);
  expect(css).toContain("font-family: 'JetBrains Mono'");
  for (const m of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) expect(fs.existsSync(path.resolve(here, m[1]))).toBe(true);
  const provenance = JSON.parse(read('provenance.json'));
  expect(provenance.inputs.map(input => input.file)).toContain('scripts/catalog/lib.cjs');
  for (const input of provenance.inputs) {
    expect(path.isAbsolute(input.file)).toBe(false);
    expect(hash(path.join(root, input.file))).toBe(input.sha256);
  }
});

test('geração é determinística e preserva os arquivos de entrada', () => {
  const provenance = JSON.parse(read('provenance.json'));
  const before = outputs.map(file => hash(path.join(here, file)));
  const inputs = provenance.inputs.map(input => hash(path.join(root, input.file)));
  builder().build();
  expect(outputs.map(file => hash(path.join(here, file)))).toEqual(before);
  expect(provenance.inputs.map(input => hash(path.join(root, input.file)))).toEqual(inputs);
});

test('token removido em fixture falha e mudança da fonte existente chega à documentação', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'emprega-preview-'));
  const sources = ['scripts/catalog/lib.cjs', 'tokens', 'contracts', 'generated/component-cards', 'brands/emprega-mais', 'assets/fonts/inter', 'assets/fonts/sora', 'assets/fonts/jetbrains-mono'];
  try {
    for (const file of sources) fs.cpSync(path.join(root, file), path.join(fixture, file), {recursive: true});
    const token = path.join(fixture, 'brands/emprega-mais/tokens/tokens.css');
    const original = fs.readFileSync(token, 'utf8');
    fs.writeFileSync(token, original.replace(/--emp-radius-md:\s*[^;]+;/g, ''));
    expect(() => builder().build({root: fixture})).toThrow(/emp-radius-md/);
    // A mutação só existe na fixture e usa um valor que já está na fonte original.
    const replacement = original.match(/--emp-radius-lg:\s*([^;]+);/)[1];
    fs.writeFileSync(token, original.replace(/--emp-radius-md:\s*[^;]+;/, `--emp-radius-md: ${replacement};`));
    builder().build({root: fixture});
    const html = fs.readFileSync(path.join(fixture, 'brands/emprega-mais/previews/brand-system/index.html'), 'utf8');
    expect(html).toContain(`data-token="--emp-radius-md">${replacement}`);
  } finally { fs.rmSync(fixture, {recursive: true, force: true}); }
});

test('execução de QA que falha invalida o manifesto de sucesso anterior', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'emprega-qa-failure-'));
  const manifest = path.join(out, 'manifest.json');
  try {
    fs.writeFileSync(manifest, JSON.stringify({passed: 4, failed: 0}));
    const result = spawnSync(process.execPath, [path.join(__dirname, 'verify.mjs')], {
      env: {...process.env, QA_OUT: out, PLAYWRIGHT_CHROMIUM_EXECUTABLE: path.join(out, 'missing-browser')},
      encoding: 'utf8'
    });
    expect(result.error).toBeUndefined();
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/executable doesn't exist|does not exist/);
    expect(fs.existsSync(manifest)).toBe(false);
  } finally { fs.rmSync(out, {recursive: true, force: true}); }
});
