/**
 * Contrato Laravel da marca Emprega+ (ADR-0002 decisão 3 / passo 4a).
 * eds-root.css é Camada 1 (--eds-*), com color-mix. Não entra na ponte.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const eds = fs.readFileSync(
  path.join(ROOT, 'brands/emprega-mais/tokens/eds-root.css'),
  'utf8'
);
const emp = fs.readFileSync(
  path.join(ROOT, 'brands/emprega-mais/tokens/tokens.css'),
  'utf8'
);
const edsBytes = fs.readFileSync(
  path.join(ROOT, 'brands/emprega-mais/tokens/eds-root.css')
);
const recordedSha = fs
  .readFileSync(path.join(ROOT, 'brands/emprega-mais/tokens/eds-root.sha256'), 'utf8')
  .trim();

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

  // Passo 4c do ADR-0002. O arquivo é vendored em dois produtos; cada um
  // trava a própria cópia com este mesmo hash. Mudou o CSS sem regravar o
  // .sha256, o CI falha aqui e nomeia o hash novo — que é o que os dois
  // produtos precisam receber junto com a cópia nova.
  test('o SHA-256 registrado em eds-root.sha256 é o do arquivo', () => {
    const actual = crypto.createHash('sha256').update(edsBytes).digest('hex');
    expect(recordedSha).toMatch(/^[0-9a-f]{64}$/);
    expect(actual).toBe(recordedSha);
  });
});
