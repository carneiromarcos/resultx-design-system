/**
 * Modal de filtros — lotes A, B e C
 *
 *   A. o corpo do modal nao rolava: `.modal` tinha `overflow: hidden` e
 *      `.modal-body` so tinha padding, entao conteudo alto era CORTADO sem
 *      barra e sem aviso. Somado a isso, o DS nao tinha estilo de scrollbar
 *      nenhum e o `.modal-close` ficara fora do alvo de 44px da Onda 2.
 *   B. faltava a terceira ponta da triade de campos: havia `.form-input` e
 *      `.form-textarea`, nenhum `.form-select`.
 *   C. o `.segmented` so existia como barra unida de colunas iguais, e a `.tag`
 *      nao tinha dot — o comentario no CSS dizia "sem dot" literalmente.
 *
 * As medidas foram tiradas depois de `npm run build:all`: medir contra um
 * dist/ velho ja produziu um falso positivo na Onda 3.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf-8');

const componentsCss = read('components', 'components.css');
const segmentedCss = read('components', 'segmented.css');
const bundle = read('dist', 'components.min.css');

/**
 * Corpo da primeira regra cuja lista de seletores contem `selector`, SEM
 * comentarios — os comentarios deste commit citam o codigo antigo ao explicar a
 * mudanca ("`overflow: hidden` acima CORTAVA o excedente"), e uma assercao de
 * ausencia casaria com a propria explicacao.
 */
const rule = (css, selector) => {
  const limpo = selector.replace(/\s*\{\s*$/, '');
  const escapado = limpo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const achou = new RegExp(`(^|,)\\s*${escapado}\\s*(,|\\{)`, 'm').exec(css);
  if (!achou) return '';
  const abre = css.indexOf('{', achou.index);
  return css.slice(abre + 1, css.indexOf('}', abre)).replace(/\/\*[\s\S]*?\*\//g, '');
};

describe('Lote A — o modal passa a rolar em vez de cortar', () => {
  test('.modal e coluna flex com teto, senao nao ha o que rolar', () => {
    const r = rule(componentsCss, '.modal');
    expect(r).toMatch(/display:\s*flex/);
    expect(r).toMatch(/flex-direction:\s*column/);
    expect(r).toMatch(/max-height:\s*100%/);
  });

  test('.modal-body rola E tem min-height: 0', () => {
    const r = rule(componentsCss, '.modal-body');
    expect(r).toMatch(/overflow-y:\s*auto/);
    // Sem min-height:0 o item de flex nao encolhe abaixo do min-content e o
    // corpo empurra o modal para alem do teto em vez de rolar. Licao do .main
    // na Onda 1 — e a razao de este teste existir separado do de cima.
    expect(r).toMatch(/min-height:\s*0/);
  });

  test('a rolagem nao vaza para a pagina atras do modal', () => {
    expect(rule(componentsCss, '.modal-body')).toMatch(/overscroll-behavior:\s*contain/);
  });

  test('cabecalho e rodape nao encolhem — quem cede espaco e o corpo', () => {
    expect(rule(componentsCss, '.modal-header')).toMatch(/flex-shrink:\s*0/);
    expect(rule(componentsCss, '.modal-footer')).toMatch(/flex-shrink:\s*0/);
  });

  test('o overlay tem folga: e ela que vira o teto do modal', () => {
    expect(rule(componentsCss, '.modal-overlay')).toMatch(/padding:\s*var\(--space-4\)/);
  });

  test('.modal-close nao usa `transition: all`', () => {
    // `all` varre propriedades que ninguem pretendia animar. Na Onda 3 isso
    // arrastou `visibility` e o foco falhou calado.
    expect(rule(componentsCss, '.modal-close')).not.toMatch(/transition:\s*all/);
  });

  test('.modal-close tem alvo de 44px sem mudar a caixa visivel', () => {
    expect(rule(componentsCss, '.modal-close')).toMatch(/width:\s*32px/);
    const alvo = rule(componentsCss, '.modal-close::after');
    expect(alvo).toMatch(/position:\s*absolute/);
    // 32 + 6 + 6 = 44
    expect(alvo).toMatch(/inset:\s*-6px/);
  });

  test('a barra de rolagem e uma regra so, com duas portas de entrada', () => {
    expect(componentsCss).toMatch(/\.scroll-slim,\s*\n\.modal-body\s*\{/);
    expect(componentsCss).toMatch(/scrollbar-color:\s*var\(--border-default\)/);
    // Safari e Chromium antigo nao leem `scrollbar-*`.
    expect(componentsCss).toMatch(/::-webkit-scrollbar-thumb/);
  });

  test('o lote A chegou ao bundle', () => {
    expect(bundle).toMatch(/overscroll-behavior/);
    expect(bundle).toMatch(/scrollbar-width/);
  });
});

describe('Lote B — a triade de campos fica completa', () => {
  test('.form-select existe ao lado de .form-input e .form-textarea', () => {
    for (const campo of ['.form-input', '.form-textarea', '.form-select']) {
      expect(rule(componentsCss, campo)).toMatch(/border-radius:\s*var\(--radius-md\)/);
    }
  });

  test('a seta do sistema sai para nao ficarem duas', () => {
    expect(rule(componentsCss, '.form-select')).toMatch(/appearance:\s*none/);
  });

  test('o campo mantem foco visivel e estado desabilitado, como os irmaos', () => {
    expect(rule(componentsCss, '.form-select:focus-visible')).toMatch(/box-shadow/);
    expect(rule(componentsCss, '.form-select:disabled')).toMatch(/cursor:\s*not-allowed/);
  });

  test('o chevron e desenhado com borda, nao com hex cravado num SVG', () => {
    const chevron = rule(componentsCss, '.form-select-wrap::after');
    expect(chevron).toMatch(/border-right:.*var\(--text-muted\)/);
    // Um data URI traria a cor por dentro e mentiria no tema claro.
    expect(chevron).not.toMatch(/data:image/);
    // Sem isto o canto direito do campo vira area morta.
    expect(chevron).toMatch(/pointer-events:\s*none/);
  });

  test('.form-select nao usa `transition: all`', () => {
    expect(rule(componentsCss, '.form-select')).not.toMatch(/transition:\s*all/);
  });

  test('o rotulo de grupo e compartilhado, nao copiado', () => {
    // Duas portas — <legend> no fieldset, <label> no select — uma definicao so.
    expect(segmentedCss).toMatch(/\.segmented-legend,\s*\n\.form-label-eyebrow\s*\{/);
    const r = rule(segmentedCss, '.segmented-legend');
    expect(r).toMatch(/text-transform:\s*uppercase/);
    expect(r).toMatch(/letter-spacing:\s*var\(--tracking-wider\)/);
  });
});

describe('Lote C — chips que quebram linha e o dot da tag', () => {
  test('.segmented-chips troca a grade de colunas iguais por flex que quebra', () => {
    const r = rule(segmentedCss, '.segmented-chips');
    expect(r).toMatch(/display:\s*flex/);
    expect(r).toMatch(/flex-wrap:\s*wrap/);
    // O contorno sai do grupo e passa para cada chip.
    expect(r).toMatch(/border:\s*none/);
  });

  test('o chip fica em pilula, com moldura propria', () => {
    const r = rule(segmentedCss, '.segmented-chips > .segmented-option');
    expect(r).toMatch(/border-radius:\s*var\(--radius-full\)/);
    expect(r).toMatch(/background:\s*var\(--bg-surface-2\)/);
  });

  test('a variante NAO reimplementa o componente: reaproveita radio e estados', () => {
    // Um segundo bloco de :has() para os chips seria a duplicata que a Onda 2 e
    // a Onda 3 ja pagaram duas vezes (.btn-icon, .layout-list-item).
    const blocosHas = segmentedCss.match(/:has\(input\[type="radio"\]:checked\)/g) || [];
    expect(blocosHas).toHaveLength(1);
    // E o alvo de toque continua sendo o da barra.
    expect(rule(segmentedCss, '.segmented-option')).toMatch(/min-height:\s*44px/);
  });

  test('.tag-dot recebe a cor por dado, com fallback que nunca some', () => {
    const r = rule(componentsCss, '.tag-dot');
    expect(r).toMatch(/background:\s*var\(--tag-dot-color,\s*currentColor\)/);
    // Encolher o dot num rotulo longo o transformaria em risco.
    expect(r).toMatch(/flex-shrink:\s*0/);
  });

  test('.tag ganhou o vao para o dot', () => {
    expect(rule(componentsCss, '.tag')).toMatch(/gap:\s*var\(--space-1-5\)/);
  });

  test('os lotes B e C chegaram ao bundle', () => {
    expect(bundle).toMatch(/\.form-select/);
    expect(bundle).toMatch(/\.segmented-chips/);
    expect(bundle).toMatch(/--tag-dot-color/);
  });
});
