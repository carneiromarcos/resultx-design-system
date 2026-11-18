const fs = require('fs');
const yaml = require('js-yaml');
test('5a registra dados e os dois legados nos sucessores', () => {
  const m = yaml.load(fs.readFileSync('catalog/manifest.yaml', 'utf8'));
  const data = m.pages.find(p => p.id === 'data-cards');
  expect(data).toBeDefined();
  expect(data.css).toContain('components/data-cards.css');
  expect(data.css).toContain('tokens/themes/_data-layer-shared.css');
  expect(data.js).toEqual([]);
  for (const [id, doc] of [['stat-card', 'stats'], ['data-table', 'tables']]) {
    const entry = m.pages.find(p => p.id === id);
    expect(entry.legacy).toBeDefined();
    expect(entry.legacy.sources).toContain(`docs/components/${doc}.md`);
  }
});
const path = require('path'),
  os = require('os'),
  postcss = require('postcss');
const {
  brands,
  dataRoles
} = require('../catalog/bindings.config');
const {
  bindings,
  resolve,
  coverage
} = require('../scripts/catalog/lib.cjs');
const {
  definitions,
  renderData,
  color,
  resolveExpression,
  sampleData,
  sampleStyles
} = require('../scripts/catalog/data.cjs');
test.each(brands.flatMap(b => ['light', 'dark'].map(t => [b, t])))('oito ligações var existentes em %s / %s', (brand, theme) => {
  expect(Object.keys(dataRoles)).toHaveLength(8);
  const r = bindings(process.cwd(), brand, theme);
  for (const [alias, target] of Object.entries(dataRoles)) {
    expect(r.aliases[alias]).toBe(target);
    expect(r.values[target]).toBeTruthy();
    expect(resolve(r.values, alias)).toBe(resolve(r.values, target));
  }
  expect(resolve(r.values, '--text-secondary')).toBeTruthy();
  expect(resolve(r.values, '--bg-surface-2')).toBeTruthy();
});
test('nome inexistente no destino obrigatório faz o gerador barrar a ligação', () => {
  const brand = JSON.parse(JSON.stringify(brands[0]));
  brand.common['--delta-neutral-fg'] = '--papel-inexistente';
  expect(() => bindings(process.cwd(), brand, 'light')).toThrow('Ligação inválida: --delta-neutral-fg');
});
test('amostras decorativas pendentes agora têm fundo e tinta próprios, sempre com rótulo', () => {
  const html = renderData(process.cwd(), definitions[0], bindings(process.cwd(), brands[0], 'light').values, {
    label: 'teste'
  }).replacements.SAMPLES;
  for (const color of ['cyan', 'magenta', 'purple']) {
    expect(html).toContain('class="dl-coin dl-coin--soft-' + color + '"');
    expect(html).toContain({ cyan: 'Ciano suave', magenta: 'Magenta suave', purple: 'Roxo suave' }[color]);
  }
  expect(html).not.toContain('amostra incompleta');
  expect(html).not.toContain('data-pending-role=');
});
test('dez famílias de dados aparecem separadas, sem código inline ou classe de componente inventada', () => {
  const names = new Set();
  for (const f of fs.readdirSync('components').filter(f => f.endsWith('.css'))) postcss.parse(fs.readFileSync('components/' + f, 'utf8')).walkRules(r => {
    for (const m of r.selector.matchAll(/\.([a-z][\w-]*)/gi)) names.add(m[1]);
  });
  const values = bindings(process.cwd(), brands[0], 'light').values;
  expect(definitions[0].families).toHaveLength(10);
  for (const d of definitions) {
    const html = renderData(process.cwd(), d, values, {
      label: 'teste'
    }).replacements.SAMPLES;
    for (const family of d.families) expect(html).toContain('data-family="' + family + '"');
    expect(html).not.toMatch(/<script\b|\bon\w+=|\bstyle=|\{\{\w+\}\}|MBTI|\b[EI][NS][TF][JP]\b/);
    for (const m of html.matchAll(/class="([^"]+)"/g)) for (const cls of m[1].split(/\s+/)) if (cls && !cls.startsWith('catalog-')) expect(names.has(cls)).toBe(true);
  }
});
test('donut deriva os percentuais do CSS; alturas e pontos são dados da mesma fonte', () => {
  const d = sampleData(process.cwd());
  expect(d.shares.reduce((a, b) => a + b, 0)).toBe(100);
  const html = renderData(process.cwd(), definitions[0], bindings(process.cwd(), brands[0], 'light').values, {
    label: 'teste'
  }).replacements.SAMPLES;
  for (const h of d.series) {
    expect(sampleStyles(process.cwd())).toContain('--h: ' + h + '%');
    expect(html).toContain('catalog-data-h-' + h);
  }
  for (const n of d.shares) expect(html).toContain(n + '%');
});
test('fallback de var aninhado e mistura de cor são resolvidos; papel vazio não passa', () => {
  expect(resolveExpression('var(--a, var(--b))', {
    '--b': '#abcdef'
  })).toBe('#abcdef');
  expect(() => resolveExpression('var(--ausente)', {})).toThrow('Papel vazio');
  expect(color('color-mix(in srgb, #000000 12%, transparent)', {})).toEqual([0, 0, 0, .12]);
  const mixed = color('color-mix(in oklab, #000000 60%, #ffffff)', {});
  expect(mixed[0]).toBeCloseTo(mixed[1], 3);
  expect(mixed[1]).toBeCloseTo(mixed[2], 3);
  expect(mixed[3]).toBe(1);
});
test('catraca recusa retirar uma família do manifesto em uma raiz de fixture', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-data-'));
  try {
    for (const dir of ['catalog', 'contracts', 'docs/components', 'components', 'adapters', 'examples', 'generated', 'dist', 'tokens']) fs.cpSync(dir, path.join(tmp, dir), {
      recursive: true
    });
    const file = path.join(tmp, 'catalog/manifest.yaml'),
      m = yaml.load(fs.readFileSync(file, 'utf8'));
    m.pages = m.pages.filter(p => p.id !== 'data-cards');
    fs.writeFileSync(file, yaml.dump(m));
    expect(() => coverage(tmp)).toThrow('Sem entrada no manifesto: docs/components/data-cards.md');
  } finally {
    fs.rmSync(tmp, {
      recursive: true,
      force: true
    });
  }
});
