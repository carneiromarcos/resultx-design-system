// Gera fichas a partir dos contratos fora de docs/; não é necessário no build.
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const output = process.argv[2] || 'generated/component-cards';
if (path.resolve(output) === path.resolve('docs') || path.resolve(output).startsWith(`${path.resolve('docs')}${path.sep}`)) throw new Error('O destino docs/ é reservado ao Supervisor.');
fs.mkdirSync(output, { recursive: true });
for (const file of fs.readdirSync('contracts').filter((f) => f.endsWith('.yaml')).sort()) {
  const c = yaml.load(fs.readFileSync(path.join('contracts', file), 'utf8'));
  const sections = [['Anatomia', c.anatomia], ['Variantes', c.variantes], ['Estados', Object.entries(c.estados).map(([k, v]) => `${k}: ${v}`)], ['Tokens', c.tokens], ['Teclado', c.teclado], ['ARIA', c.aria], ['Critérios de aceite', c.criterios_aceite], ['Casos de teste', c.casos_teste.map((t) => `${t.id}: ${t.descricao}`)]];
  const text = [`# ${c.componente}`, '', ...sections.flatMap(([title, items]) => [`## ${title}`, '', ...items.map((v) => `- ${v}`), ''])].join('\n');
  fs.writeFileSync(path.join(output, file.replace(/\.yaml$/, '.md')), text);
}
