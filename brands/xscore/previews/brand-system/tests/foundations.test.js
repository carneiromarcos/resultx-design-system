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

beforeAll(() => execFileSync(process.execPath, [path.join(here, 'build.cjs')]));
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
  }
});
test('regeneration is deterministic and does not mutate the official token sheet', () => {
  const token = path.join(brand, 'tokens/tokens.css');
  const before = outputs.map(file => hash(path.join(here, file)));
  const tokenBefore = hash(token);
  execFileSync(process.execPath, [path.join(here, 'build.cjs')]);
  expect(outputs.map(file => hash(path.join(here, file)))).toEqual(before);
  expect(hash(token)).toBe(tokenBefore);
  expect(JSON.parse(read('provenance.json')).tokensSha256).toBe(tokenBefore);
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
