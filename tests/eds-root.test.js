/**
 * Contrato Laravel da marca Emprega+ (ADR-0002 decisão 3 / passo 4a).
 * eds-root.css é Camada 1 (--eds-*), com color-mix. Não entra na ponte.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const eds = fs.readFileSync(
  path.join(ROOT, 'brands/emprega-mais/tokens/eds-root.css'),
  'utf8'
);
const emp = fs.readFileSync(
  path.join(ROOT, 'brands/emprega-mais/tokens/tokens.css'),
  'utf8'
);

function decl(css, token) {
  const m = css.match(new RegExp(`${token}:\\s*([^;]+);`));
  return m ? m[1].trim() : null;
}

describe('eds-root.css — contrato Laravel', () => {
  test('declara o :root e o tema escuro do IMO', () => {
    expect(eds).toMatch(/:root\s*\{/);
    expect(eds).toMatch(/\[data-theme="dark"\]\s*\{/);
    expect(decl(eds, '--eds-navy')).toBe('#1c2444');
    expect(decl(eds, '--eds-indigo-dark')).toBe('#4f46e5');
    expect(decl(eds, '--eds-on-brand')).toBe('var(--eds-on-accent)');
  });

  test('brand-ink e grad-action usam color-mix, não violeta fixo', () => {
    expect(decl(eds, '--eds-brand-ink')).toMatch(/color-mix/);
    const grad = decl(eds, '--eds-grad-action');
    expect(grad).toMatch(/--eds-indigo-dark/);
    expect(grad).toMatch(/color-mix\(in srgb, var\(--eds-indigo-dark\) 96%, #000\)/);
    expect(grad).not.toMatch(/--eds-violet-dark/);
  });

  test('não declara aliases --jl-* nem pigmento --emp-*', () => {
    expect(eds).not.toMatch(/--jl-navy:/);
    expect(eds).not.toMatch(/--emp-navy:/);
  });

  test('pigmento sólido bate com tokens.css', () => {
    expect(decl(eds, '--eds-navy')).toBe(decl(emp, '--emp-navy'));
    expect(decl(eds, '--eds-indigo')).toBe(decl(emp, '--emp-indigo'));
    expect(decl(eds, '--eds-indigo-dark')).toBe(decl(emp, '--emp-indigo-dark'));
  });
});
