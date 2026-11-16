const fs = require('fs');
const yaml = require('js-yaml');
test('PR 4a registra seis legados e quatro famílias sem JavaScript novo', () => {
  const manifest = yaml.load(fs.readFileSync('catalog/manifest.yaml', 'utf8'));
  for (const id of ['button', 'card', 'field', 'status-badge', 'empty-state', 'confirm-dialog']) {
    const entry = manifest.pages.find(p => p.id === id);
    expect(entry.legacy).toBeDefined();
    expect(entry.legacy.js).toEqual([]);
    expect(fs.existsSync(entry.legacy.recipe)).toBe(true);
  }
  for (const id of ['navigation', 'layout', 'segmented', 'list-item']) {
    const entry = manifest.pages.find(p => p.id === id);
    expect(entry).toBeDefined();
    expect(entry.js).toEqual([]);
  }
});
const path = require('path');
const postcss = require('postcss');
const defs = require('../catalog/legacy.config.cjs');
const index = require('../catalog/subfamilies.config.json');
test('cada seção das fichas tem amostra nomeada ou exclusão explícita', () => {
  for (const d of defs) {
    const headings = [...fs.readFileSync(`docs/components/${d.doc}.md`, 'utf8').matchAll(/^## (.+)$/gm)].map(m => m[1]);
    expect(index[d.doc].map(e => e.heading)).toEqual(headings);
    for (const e of index[d.doc]) {
      expect(e.families.length > 0 || !!e.reason?.trim()).toBe(true);
      for (const id of e.families) expect(d.families).toContain(id);
    }
  }
});
test('receitas só usam classes que existem nos seletores atuais do DS', () => {
  const names = new Set();
  for (const file of fs.readdirSync('components').filter(f => f.endsWith('.css'))) postcss.parse(fs.readFileSync('components/' + file, 'utf8')).walkRules(r => {
    for (const m of r.selector.matchAll(/\.([a-z][\w-]*)/gi)) names.add(m[1]);
  });
  for (const d of defs) {
    const html = fs.readFileSync(d.recipe, 'utf8');
    for (const m of html.matchAll(/class="([^"]+)"/g)) for (const c of m[1].split(/\s+/)) if (!c.startsWith('catalog-')) expect(names.has(c)).toBe(true);
  }
});
test('pares transparentes são compostos antes de calcular WCAG', () => {
  const {
    rgba,
    over,
    contrast
  } = require('../scripts/catalog/legacy.cjs');
  expect(over(rgba('rgba(0,0,0,0.5)'), rgba('#ffffff'))).toEqual([127.5, 127.5, 127.5, 1]);
  expect(contrast(rgba('#000000'), rgba('#ffffff'))).toBe(21);
});
test('cada subfamília declarada é exibida pela receita e os exemplos não têm código inline', () => {
  const {
    renderLegacy
  } = require('../scripts/catalog/legacy.cjs');
  const {
    bindings
  } = require('../scripts/catalog/lib.cjs');
  const {
    brands
  } = require('../catalog/bindings.config');
  const values = bindings(process.cwd(), brands[0], 'light').values;
  for (const d of defs) {
    const html = renderLegacy(process.cwd(), d, values, {
      label: 'teste'
    }).replacements.SAMPLES;
    for (const id of d.families) expect(html).toContain(`data-family="${id}"`);
    expect(html).not.toMatch(/<script\b|\bstyle=|\bon\w+=|MBTI/i);
  }
});
test('um script inserido no legado também é recusado pela guarda permanente', () => {
  const os = require('os'),
    {
      coverage
    } = require('../scripts/catalog/lib.cjs'),
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-legacy-js-'));
  try {
    for (const dir of ['catalog', 'contracts', 'docs/components', 'components', 'adapters', 'examples', 'generated', 'dist']) fs.cpSync(dir, path.join(tmp, dir), {
      recursive: true
    });
    const file = path.join(tmp, 'catalog/manifest.yaml'),
      manifest = yaml.load(fs.readFileSync(file, 'utf8'));
    manifest.pages.find(p => p.id === 'button').legacy.js = ['catalog/behaviors/data-table.js'];
    fs.writeFileSync(file, yaml.dump(manifest));
    expect(() => coverage(tmp)).toThrow('JavaScript fora da autorização do catálogo');
  } finally {
    fs.rmSync(tmp, {
      recursive: true,
      force: true
    });
  }
});
