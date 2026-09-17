/**
 * Guarda a paridade CSS × JSON da marca Emprega+ (ADR-0002 decisão 1).
 * O parecer do Revisor (17/09) pegou JSON com superfícies e pesos velhos
 * enquanto o tokens.css já descrevia o IMO.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(ROOT, 'brands/emprega-mais/tokens/tokens.css'), 'utf8');
const json = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'brands/emprega-mais/tokens/tokens.json'), 'utf8')
)['emprega-mais'];

function decl(token) {
  const m = css.match(new RegExp(`${token}:\\s*([^;]+);`));
  return m ? m[1].trim() : null;
}

describe('Emprega+ tokens.css × tokens.json', () => {
  test('superfícies escuras batem com o IMO', () => {
    expect(json.color.bg['surface-1'].$value).toBe('#1e2335');
    expect(json.color.bg['surface-deep'].$value).toBe('#0f1320');
    expect(decl('--emp-surface-1')).toBe('#1e2335');
    expect(decl('--emp-surface-deep')).toBe('#0f1320');
  });

  test('teto de peso é 600 nas duas representações', () => {
    expect(json.typography.weight.bold.$value).toBe('600');
    expect(json.typography.weight.extrabold.$value).toBe('600');
    expect(decl('--emp-weight-bold')).toBe('600');
    expect(decl('--emp-weight-extrabold')).toBe('600');
  });

  test('accent de produto no JSON é o fill do IMO', () => {
    expect(json.color.indigo.dark.$value).toBe('#4f46e5');
    expect(decl('--emp-indigo-dark')).toBe('#4f46e5');
  });
});
