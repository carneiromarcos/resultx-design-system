const fs = require('fs');
const crypto = require('crypto');
const postcss = require('postcss');

const prefix = ':is(.rx-pilot, #rx-pilot-floor)';
const scopedPath = 'adapters/css/pilot.scoped.css';
const sha = (text) => crypto.createHash('sha256').update(text).digest('hex');
const inKeyframes = (node) => { for (let p = node.parent; p; p = p.parent) if (p.type === 'atrule' && /keyframes$/i.test(p.name)) return true; return false; };
function declarations(root, scoped) {
  const result = [];
  root.walkRules((rule) => {
    const selectors = rule.selectors.map((s) => {
      if (!scoped || inKeyframes(rule)) return s.trim();
      expect(s.trim().startsWith(`${prefix} `)).toBe(true);
      return s.trim().slice(prefix.length + 1);
    });
    const contexts = [];
    for (let p = rule.parent; p && p.type !== 'root'; p = p.parent) {
      if (p.type === 'atrule' && p.name !== 'layer') contexts.unshift(`@${p.name} ${p.params}`);
    }
    result.push({ selectors, contexts, declarations: rule.nodes.filter((n) => n.type === 'decl').map((d) => [d.prop, d.value, !!d.important]) });
  });
  return result;
}

test('variante escopada preserva regras, declarações, ordem e SHA', () => {
  const original = postcss.parse(fs.readFileSync('adapters/css/pilot.css', 'utf8'));
  const css = fs.readFileSync(scopedPath, 'utf8');
  const scoped = postcss.parse(css);
  scoped.walkAtRules('layer', () => { throw new Error('A variante não pode conter @layer.'); });
  expect(declarations(scoped, true)).toEqual(declarations(original, false));
  expect(fs.readFileSync(`${scopedPath}.sha256`, 'utf8')).toBe(`${sha(css)}\n`);
});

test('aliases cobrem exatamente os tokens consumidos, referenciam EDS existente e têm SHA válido', () => {
  const parser = require('postcss-value-parser');
  const source = postcss.parse(fs.readFileSync('adapters/css/pilot.css', 'utf8'));
  const consumed = new Set();
  source.walkDecls((d) => parser(d.value).walk((n) => { if (n.type === 'function' && n.value === 'var') consumed.add(n.nodes[0].value); }));
  const eds = new Set();
  postcss.parse(fs.readFileSync('brands/emprega-mais/tokens/eds-root.css', 'utf8')).walkDecls((d) => eds.add(d.prop));
  const path = 'brands/emprega-mais/tokens/pilot-aliases.css';
  const css = fs.readFileSync(path, 'utf8');
  const aliases = postcss.parse(css);
  const declared = new Set();
  const dynamic = { '--accent-primary': ['--eds-pintura', '--eds-indigo-dark'], '--accent-primary-hover': ['--eds-pintura-hover', '--eds-indigo-dark'], '--text-inverse': ['--eds-on-pintura', '--eds-on-brand'] };
  aliases.walkRules((r) => {
    expect(r.selector).toBe(prefix);
    r.walkDecls((d) => {
      expect(declared.has(d.prop)).toBe(false);
      declared.add(d.prop);
      if (dynamic[d.prop]) {
        const [custom, fallback] = dynamic[d.prop];
        expect(d.value).toBe(`var(${custom}, var(${fallback}))`);
        expect(eds.has(fallback)).toBe(true);
      } else {
        parser(d.value).walk((n) => { if (n.type === 'function' && n.value === 'var') expect(eds.has(n.nodes[0].value)).toBe(true); });
      }
    });
  });
  expect([...declared].sort()).toEqual([...consumed].sort());
  expect(css).toContain('--radius-md: var(--eds-radius-btn);');
  expect(fs.readFileSync(`${path}.sha256`, 'utf8')).toBe(`${sha(css)}\n`);
});

test('gerador preserva media e keyframes e aceita outro prefixo', () => {
  const os = require('os');
  const path = require('path');
  const { execFileSync } = require('child_process');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pilot-scoped-'));
  try {
    const input = path.join(dir, 'in.css'), out = path.join(dir, 'out.css'), aliases = path.join(dir, 'aliases.css');
    fs.writeFileSync(input, '@layer components { @media (min-width: 1px) { .rx-a, .rx-b { color: var(--text-primary); } } @keyframes fade { from { opacity: 0 } to { opacity: 1 } } }');
    const env = { ...process.env, RESULTX_PILOT_SCOPE: '.outro', RESULTX_PILOT_SOURCE: input, RESULTX_PILOT_OUTPUT: out, RESULTX_PILOT_ALIASES: aliases };
    execFileSync(process.execPath, ['scripts/build-pilot-scoped.mjs'], { env });
    const css = fs.readFileSync(out, 'utf8');
    expect(css).toContain('.outro .rx-a, .outro .rx-b');
    expect(css).toContain('@media (min-width: 1px)');
    expect(css).toMatch(/@keyframes fade\s*\{\s*from/);
    expect(css).not.toContain('.outro from');
    execFileSync(process.execPath, ['scripts/build-pilot-scoped.mjs'], { env });
    expect(fs.readFileSync(out, 'utf8')).toBe(css);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('contraste dos pares do adaptador passa nos dois temas da marca padrão', () => {
  const { execFileSync } = require('child_process');
  const output = execFileSync(process.execPath, ['scripts/check-pilot-contrast.cjs'], { encoding: 'utf8' });
  expect(output).toContain('light | primário');
  expect(output).toContain('dark | primário');
  expect(output).toContain('light | sucesso');
  expect(output).toContain('dark | foco');
});
