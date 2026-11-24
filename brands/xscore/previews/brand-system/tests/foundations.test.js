'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const here = path.resolve(__dirname, '..');
const brand = path.resolve(here, '../..');
const read = name => fs.readFileSync(path.join(here, name), 'utf8');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const outputs = ['index.html', 'light.html', 'provenance.json'];
const tokenFile = path.join(brand, 'tokens/tokens.css');
const tokenBaseline = hash(tokenFile);

beforeAll(() => {
  execFileSync(process.execPath, [path.join(here, 'build.cjs')]);
  expect(hash(tokenFile)).toBe(tokenBaseline);
});
test('two themes have the shared CSP, no inline styles and no browser scripts', () => {
  for (const [file, theme] of [['index.html', 'dark'], ['light.html', 'light']]) {
    const html = read(file);
    expect(html).toContain(`data-theme="${theme}"`);
    expect(html).toContain('<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">');
    expect(html).not.toMatch(/<script\b|\bstyle\s*=|\bonclick\s*=/i);
    expect(html).toContain('href="../../tokens/tokens.css"');
    expect(html).toContain(theme === 'dark' ? 'href="light.html"' : 'href="index.html"');
  }
});
test('every internal anchor resolves and all eighteen chapters are present', () => {
  for (const file of outputs.slice(0, 2)) {
    const html = read(file);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const link of html.matchAll(/href="#([^"]+)"/g)) expect(ids).toContain(link[1]);
    for (let i = 0; i < 18; i++) expect(ids).toContain(`bb-${i}`);
  }
});
test('all local linked assets exist; official examples stay in the shared catalog', () => {
  for (const file of outputs.slice(0, 2)) {
    const html = read(file);
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (match[1].startsWith('#') || /^https:/.test(match[1])) continue;
      expect(fs.existsSync(path.resolve(here, match[1]))).toBe(true);
    }
    const links = [...html.matchAll(/https:\/\/carneiromarcos\.github\.io\/resultx-design-system\/catalog\/xscore\/(?:dark|light)\/([\w-]+)\//g)].map(m => m[1]);
    for (const id of JSON.parse(read('provenance.json')).components) expect(links).toContain(id);
    const revision = JSON.parse(read('provenance.json')).contractRevision;
    expect(revision).toMatch(/^[a-f0-9]{40}$/);
    expect(revision).toBe('9da663fff3641f4021e94e1ef5f1deba85441c69');
    expect(JSON.parse(read('provenance.json')).components).toHaveLength(9);
    expect(JSON.parse(read('provenance.json')).components).toContain('choice');
    for (const id of JSON.parse(read('provenance.json')).components) {
      expect(html).toContain(`https://github.com/carneiromarcos/resultx-design-system/blob/${revision}/contracts/${id}.yaml`);
      expect(html).toContain(`https://github.com/carneiromarcos/resultx-design-system/blob/${revision}/generated/component-cards/${id}.md`);
    }
    expect(html).not.toMatch(/href="\.\.\/\.\.\/\.\.\/\.\.\/(?:contracts|generated)\//);
  }
});
test('the credit-pattern summary distinguishes existing contracts from planned compositions', () => {
  const html = read('index.html');
  for (const pattern of ['Tabela financeira', 'Indicadores', 'Filtros avançados', 'Status', 'Fluxo de aprovação', 'Estado vazio', 'Estado de erro', 'Carregamento']) {
    expect(html).toContain(pattern);
  }
  expect(html).toContain('Planejado · Field e Choice existentes');
  expect(html).toContain('Planejado · Button e ConfirmDialog existentes');
});
test('the analysis summary documents the adopted pattern in both themes and marks the abolished model', () => {
  for (const file of ['index.html', 'light.html']) {
    const html = read(file);
    expect(html).toContain('<section id="ds-credit-summary"');
    expect(html).toContain('href="#ds-credit-summary"');
    expect(html).toContain('Adotado no Xscore · sem contrato próprio');
    for (const label of ['Sem apontamento:', 'Atenção:', 'Sem dado:', 'Informação:']) expect(html).toContain(`<span class="sr-only">${label} </span>`);
    for (const state of ['ok', 'attention', 'missing', 'info']) expect(html).toContain(`class="state-icon state-${state}" aria-hidden="true"`);
    expect(html).toContain('nenhum registro');
    expect(html).toContain('o birô não informou');
    expect(html).toContain('Não foi possível montar o resumo do laudo agora.');
    expect(html).toContain('Não usar');
    expect(html).toContain('D-0001');
    // The live pattern carries no fused score, band ruler or policy seal; only the "Não usar" block names them.
    const live = html.slice(html.indexOf('<section id="ds-credit-summary"'), html.indexOf('<div class="dont">'));
    expect(live).not.toMatch(/Dentro da política|Score Xscore|de 1000|Negar|mín\./);
  }
  expect(JSON.parse(read('provenance.json')).sections).toContain('ds-credit-summary');
});
test('the original model stays a non-published reference marked do-not-use', () => {
  const { PUBLIC_PATHS, BRAND_SYSTEM_FILES } = require('../../../../../scripts/prepare-pages.cjs');
  const reference = 'brands/xscore/reference/do-not-use-policy-summary-model-2026-11-23';
  const dir = path.resolve(brand, '../..', reference);
  for (const file of ['README.md', 'Main.dc.html', 'Claro.dc.html']) expect(fs.existsSync(path.join(dir, file))).toBe(true);
  expect(fs.readFileSync(path.join(dir, 'README.md'), 'utf8')).toMatch(/NÃO USAR — nota única abolida \(D-0001\)/);
  const notice = 'Dados fictícios — exemplo de layout. Notas de birô, nomes e CNPJs não são reais; citar birôs não indica parceria. Não usar (nota única abolida, D-0001)';
  const escaped = notice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const htmlFiles = fs.readdirSync(dir).filter(file => file.endsWith('.html'));
  expect(htmlFiles).toEqual(expect.arrayContaining(['Claro.dc.html', 'Main.dc.html']));
  expect(fs.readFileSync(path.join(dir, 'README.md'), 'utf8')).toContain('Dados fictícios — exemplo de layout.');
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(dir, file), 'utf8');
    // Comment before any content, and a visible notice as the first element of the body.
    expect(html.indexOf(`<!-- ${notice} -->`)).toBeGreaterThanOrEqual(0);
    expect(html.indexOf(`<!-- ${notice} -->`)).toBeLessThan(html.indexOf('<html'));
    expect(html).toMatch(new RegExp(`<body>\\s*<p role="note"><strong>${escaped}</strong></p>`));
    // Names that could match real companies or people stay replaced by clearly fictitious ones.
    expect(html).not.toMatch(/Andrade|Sol Nascente|Ana Lima/);
  }
  for (const entry of [...PUBLIC_PATHS, ...BRAND_SYSTEM_FILES]) expect(reference.startsWith(entry) || entry.startsWith(reference)).toBe(false);
  for (const file of ['index.html', 'light.html']) expect(read(file)).not.toContain('reference/do-not-use');
});
test('regeneration is deterministic and does not mutate the official token sheet', () => {
  const before = outputs.map(file => hash(path.join(here, file)));
  expect(hash(tokenFile)).toBe(tokenBaseline);
  execFileSync(process.execPath, [path.join(here, 'build.cjs')]);
  expect(outputs.map(file => hash(path.join(here, file)))).toEqual(before);
  expect(hash(tokenFile)).toBe(tokenBaseline);
  expect(JSON.parse(read('provenance.json')).tokensSha256).toBe(tokenBaseline);
});
test('spacing remains a stated dependency and observed radii and weights come from the brand', () => {
  const html = read('index.html');
  expect(html).toContain('A marca ainda não publica uma escala semântica');
  const css = fs.readFileSync(path.join(brand, 'tokens/tokens.css'), 'utf8');
  for (const role of ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-full', '--weight-regular', '--weight-medium', '--weight-semibold', '--weight-bold']) {
    const value = css.match(new RegExp(`${role}:\\s*([^;]+)`))[1].trim();
    expect(html).toContain(value);
  }
});
