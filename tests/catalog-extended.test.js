const fs = require('fs');
const yaml = require('js-yaml');
const ids = ['sidebar-overlay', 'disclosure', 'split-pane', 'menu-drawer', 'header-float', 'tooltip', 'toast', 'progress', 'icons', 'cta-dock', 'cta-panel', 'composite'];
test('PR 4b registra as doze famílias com os scripts publicados exatos', () => {
  const manifest = yaml.load(fs.readFileSync('catalog/manifest.yaml', 'utf8'));
  const interactive = ['sidebar-overlay', 'disclosure', 'split-pane', 'menu-drawer', 'header-float', 'cta-dock'];
  for (const id of ids) {
    const entry = manifest.pages.find(p => p.id === id);
    expect(entry).toBeDefined();
    expect(entry.js).toEqual(interactive.includes(id) ? [`dist/${id}.js`] : []);
  }
});
const postcss = require('postcss');
const definitions = require('../catalog/extended.config.cjs');
test('cada família tem receita sem código, cor literal ou classe de componente inventada', () => {
  const names = new Set();
  for (const file of fs.readdirSync('components').filter(f => f.endsWith('.css'))) postcss.parse(fs.readFileSync('components/' + file, 'utf8')).walkRules(r => {
    for (const m of r.selector.matchAll(/\.([a-z][\w-]*)/gi)) names.add(m[1]);
  });
  for (const d of definitions) {
    const html = fs.readFileSync(d.recipe, 'utf8');
    expect(html).not.toMatch(/<script\b|\bstyle=|\bon\w+=|#[\da-f]{3,8}\b|MBTI/i);
    for (const family of d.families) expect(html).toContain(`data-family="${family}"`);
    for (const m of html.matchAll(/class="([^"]+)"/g)) for (const c of m[1].split(/\s+/)) if (!c.startsWith('catalog-')) expect(names.has(c)).toBe(true);
  }
});
test('receitas usam exclusivamente os módulos existentes e não código de inicialização paralelo', () => {
  const policy = require('../catalog/script-policy.cjs');
  const m = yaml.load(fs.readFileSync('catalog/manifest.yaml', 'utf8'));
  for (const d of definitions) {
    const p = m.pages.find(p => p.id === d.id);
    expect(p.js).toEqual(policy.allowedScripts(d.id));
    for (const f of p.js) {
      expect(f).toBe(`dist/${d.id}.js`);
      expect(fs.readFileSync(f, 'utf8')).toContain('ResultX');
    }
  }
});
test('todas as combinações podem ser renderizadas sem valor visual duplicado', () => {
  const {
    brands
  } = require('../catalog/bindings.config');
  const {
    bindings
  } = require('../scripts/catalog/lib.cjs');
  const {
    renderExtended
  } = require('../scripts/catalog/extended.cjs');
  for (const b of brands) for (const theme of ['light', 'dark']) for (const d of definitions) {
    const r = renderExtended(process.cwd(), d, bindings(process.cwd(), b, theme).values, {
      label: 'teste'
    }, b, theme);
    expect(r.replacements.SAMPLES + r.bodyHead + r.bodyTail).not.toMatch(/\{\{\w+\}\}/);
    expect(r.replacements.CONTRAST).toContain('Ver detalhes');
    expect(r.replacements.PENDING).toContain('Próximo passo');
  }
});
