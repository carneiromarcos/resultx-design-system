const fs = require('fs');
const crypto = require('crypto');
const yaml = require('js-yaml');
const postcss = require('postcss');
const baseline = require('./fixtures/notice-source.json');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const contract = () => yaml.load(fs.readFileSync('contracts/notice.yaml', 'utf8'));

test('Aviso distingue próximo passo obrigatório e ação local obrigatória quando permitida', () => {
  const c = contract();
  expect(c.versao).toBe(1);
  expect(c.variantes).toEqual(['info', 'warning']);
  expect(c.criterios_aceite.join(' ')).toMatch(/ação.*obrigatória.*nesta tela/i);
  expect(c.criterios_aceite.join(' ')).toMatch(/indevida.*(?:ausente|não aparece|não.*renderizada)/i);
  expect(c.aria.join(' ')).toMatch(/(?:preexiste|antes).*texto/i);
  expect(c.aria.join(' ')).toMatch(/nível.*consumidor/i);
});
test('Aviso e novos status usam superfície e texto existentes, apenas duas tintas semânticas novas no adaptador', () => {
  const styles = {};
  postcss.parse(fs.readFileSync('adapters/css/pilot.css', 'utf8')).walkRules(rule => {
    for (const selector of rule.selectors) { styles[selector] = {}; rule.walkDecls(d => { styles[selector][d.prop] = d.value; }); }
  });
  for (const variant of ['warning', 'info']) {
    expect(styles[`.rx-badge--${variant}`]).toEqual(expect.objectContaining({ 'border-color': `var(--color-${variant})` }));
    expect(styles[`.rx-notice--${variant}`]).toEqual(expect.objectContaining({ 'border-color': `var(--color-${variant})` }));
  }
  expect(styles['.rx-notice']).toEqual(expect.objectContaining({ color: 'var(--text-primary)', background: 'var(--bg-surface-1)' }));
});
test('receitas reais mostram Aviso com ação, sem ação indevida e status específicos', () => {
  const { elementById } = require('../scripts/catalog/components.cjs');
  const html = fs.readFileSync('examples/pilot.html', 'utf8');
  const local = elementById(html, 'notice-warning-action');
  expect(local).toMatch(/href="#notice-destination"/);
  const external = elementById(html, 'notice-warning-external');
  expect(external).not.toMatch(/<(button|a)\b/);
  for (const id of ['badge-warning', 'badge-info']) expect(elementById(html,id)).not.toMatch(/>\s*(Atenção|Info|Informação)\s*</i);
});
test('aliases anteriores são byte-idênticos ao remover apenas as duas linhas novas e eds-root mantém SHA', () => {
  const css = fs.readFileSync('brands/emprega-mais/tokens/pilot-aliases.css', 'utf8');
  const additions = ['  --color-info: var(--eds-info-ink);', '  --color-warning: var(--eds-warning-ink);'];
  for (const line of additions) expect(css.split('\n').filter(s => s === line)).toHaveLength(1);
  expect(css.split('\n').filter(line => !additions.includes(line)).join('\n')).toBe(baseline.aliasesBefore);
  expect(hash(fs.readFileSync('brands/emprega-mais/tokens/eds-root.css'))).toBe(baseline.edsRootSha256);
});
test('nenhum arquivo de token existente muda, fora dos dois aliases gerados autorizados', () => {
  for (const [file, sha] of Object.entries(baseline.immutable)) expect({ file, sha: hash(fs.readFileSync(file)) }).toEqual({ file, sha });
});
test('catálogo registra Aviso sem JavaScript e usa a ficha gerada, sem documento duplicado', () => {
  const entry = yaml.load(fs.readFileSync('catalog/manifest.yaml', 'utf8')).pages.find(e => e.id === 'notice');
  expect(entry).toEqual(expect.objectContaining({ contract: 'contracts/notice.yaml', js: [] }));
  expect(entry.sources).toContain('generated/component-cards/notice.md');
  expect(fs.existsSync('docs/components/notice.md')).toBe(false);
});

test('ação local ausente e ação indevida presente são negativos reais do predicado usado pelo browser', () => {
  const { validateNotice } = require('./visual/lib/notice-cases');
  const valid = { title:'Nome não informado', nextStep:'Preencha seu nome.', location:'here', permitted:true, technicalNodes:0, actions:[{tag:'a',name:'Preencher nome',href:'#nome'}] };
  expect(() => validateNotice(valid)).not.toThrow();
  expect(() => validateNotice({...valid,actions:[]})).toThrow('Ação local permitida é obrigatória');
  expect(() => validateNotice({...valid,permitted:false})).toThrow('Ação indevida deve estar ausente');
  expect(() => validateNotice({...valid,nextStep:''})).toThrow('Fato e próximo passo');
  expect(() => validateNotice({...valid,location:undefined})).toThrow('Cenário da vitrine');
  expect(() => validateNotice({...valid,detail:'HTTP 500'})).toThrow('Texto humano');
});
test('obrigações novas só são habilitadas por declaração explícita e separada', () => {
  const { tokens, enabled } = require('./visual/lib/contract-capabilities');
  expect(enabled('badge-variants',tokens(''))).toBe(true);
  for (const id of ['notice-content','badge-warning-info','badge-next-step']) expect(enabled(id,tokens(''))).toBe(false);
  expect(enabled('notice-content',tokens('notice'))).toBe(true);
  expect(enabled('badge-warning-info',tokens('notice'))).toBe(false);
  expect(enabled('badge-warning-info',tokens('status-badge-warning-info'))).toBe(true);
});
