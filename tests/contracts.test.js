const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const source = require('../tokens/tokens.json');

const expected = ['button', 'field', 'choice', 'card', 'stat-card', 'data-table', 'confirm-dialog', 'status-badge', 'empty-state'];
const semantic = new Set();
function visit(node) {
  if (!node || typeof node !== 'object') return;
  for (const [key, value] of Object.entries(node)) {
    if (value && typeof value === 'object' && '$value' in value) semantic.add(`--${key}`);
    else visit(value);
  }
}
visit(source.semantic);
const read = (name) => yaml.load(fs.readFileSync(path.join('contracts', `${name}.yaml`), 'utf8'), { schema: yaml.JSON_SCHEMA });

test('lote piloto contém os contratos registrados', () => {
  expect(fs.readdirSync('contracts').filter((f) => f.endsWith('.yaml')).sort()).toEqual(expected.map((n) => `${n}.yaml`).sort());
});
test.each(expected)('%s declara anatomia, estados, acessibilidade, aceite e testes', (name) => {
  const c = read(name);
  expect(c.versao).toBe(1);
  expect(typeof c.componente).toBe('string');
  for (const key of ['anatomia', 'variantes', 'tokens', 'teclado', 'aria', 'criterios_aceite', 'casos_teste']) {
    expect(Array.isArray(c[key]) && c[key].length > 0).toBe(true);
  }
  for (const [state, description] of Object.entries(c.estados)) expect(typeof description === 'string' && description.trim().length > 0).toBe(true);
  for (const token of c.tokens) expect({ token, existe: semantic.has(token) }).toEqual({ token, existe: true });
  for (const item of c.casos_teste) expect(item).toEqual({ id: expect.stringMatching(/^[a-z][a-z0-9-]+$/), descricao: expect.any(String) });
  const caseIds = new Set(c.casos_teste.map((t) => t.id));
  expect(caseIds.size).toBe(c.casos_teste.length);
  expect(c.conformidade).toMatch(/cada adaptador/i);
  expect(Object.keys(c.cobertura_estados).sort()).toEqual(Object.keys(c.estados).sort());
  for (const [state, id] of Object.entries(c.cobertura_estados)) {
    if (id === null) expect(c.estados[state]).toMatch(/^Não aplicável/i);
    else expect(caseIds.has(id)).toBe(true);
  }
});

test('Field estende o contrato existente com controles nativos e teclados de entrada', () => {
  const field = read('field');
  expect(field.variantes).toEqual(expect.arrayContaining(['select', 'textarea']));
  const cases = new Set(field.casos_teste.map(({ id }) => id));
  for (const id of ['field-select', 'field-textarea', 'field-inputmode-numeric', 'field-inputmode-money']) {
    expect(cases.has(id)).toBe(true);
  }
  expect(field.aria).toEqual(expect.arrayContaining([
    expect.stringMatching(/aria-describedby/i),
    expect.stringMatching(/select2/i),
  ]));
});

test('fichas versionadas são geradas a partir dos contratos', () => {
  const os = require('os');
  const { execFileSync } = require('child_process');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'resultx-cards-'));
  try {
    execFileSync(process.execPath, ['scripts/contracts/generate-cards.js', output]);
    const files = fs.readdirSync(output).sort();
    expect(files).toEqual(expected.map((name) => `${name}.md`).sort());
    for (const file of files) expect(fs.readFileSync(path.join(output, file), 'utf8')).toBe(fs.readFileSync(path.join('generated/component-cards', file), 'utf8'));
  } finally { fs.rmSync(output, { recursive: true, force: true }); }
});
