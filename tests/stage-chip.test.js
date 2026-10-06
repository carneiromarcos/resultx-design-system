/**
 * .stage-chip e .dl-statcard--compact (lote P, 05/10/2026)
 *
 * .stage-chip: etapa do funil — Triagem, Entrevista, Oferta, Contratado,
 *   Rejeitado. A Talio mostrou o erro a evitar: duas etapas com a mesma cor e
 *   nada além da cor para separá-las. Aqui:
 *     - cada etapa tem uma cor diferente, da escala semântica (o accent fica
 *       de fora: no tema claro ele é azul como --color-info);
 *     - cada etapa tem uma forma própria no marcador, então dá para ler sem cor;
 *     - a tinta do texto é a cor da etapa puxada para --text-primary, o que
 *       escurece no claro e clareia no escuro — AA medido nos dois temas.
 * .dl-statcard--compact: KPI denso, padding --space-3, valor em mono --text-xl,
 *   sem elevação.
 */

const { css, regra, regras, valor } = require('./lib/css');

const fonte = css('components', 'stage-chip.css');
const cards = css('components', 'data-cards.css');

const ETAPAS = ['triagem', 'entrevista', 'oferta', 'contratado', 'rejeitado'];

describe('.stage-chip — cor', () => {
  test('a tinta é a cor da etapa puxada para --text-primary', () => {
    const r = regra(fonte, '.stage-chip');
    expect(valor(r, '--stage-ink')).toMatch(
      /^color-mix\(in oklab, var\(--stage-color\) \d+%, var\(--text-primary\)\)$/,
    );
    expect(valor(r, 'color')).toBe('var(--stage-ink)');
  });

  test('o fundo é tonal, de 10 a 12 % da cor da etapa', () => {
    const fundo = valor(regra(fonte, '.stage-chip'), 'background');
    const m = /color-mix\(in srgb, var\(--stage-color\) (\d+)%, transparent\)/.exec(fundo || '');
    expect(m).not.toBeNull();
    expect(Number(m[1])).toBeGreaterThanOrEqual(10);
    expect(Number(m[1])).toBeLessThanOrEqual(12);
  });

  test('cada etapa tem uma cor própria, nenhuma repetida', () => {
    const cores = ETAPAS.map((e) => valor(regra(fonte, `.stage-chip-${e}`), '--stage-color'));
    for (const cor of cores) expect(cor).toMatch(/^var\(--/);
    expect(new Set(cores).size).toBe(ETAPAS.length);
  });

  test('o accent não entra: no tema claro ele colide com --color-info', () => {
    expect(fonte).not.toContain('var(--accent-primary)');
  });
});

describe('.stage-chip — forma além da cor', () => {
  test('o marcador é um ::before decorativo, do tamanho do texto', () => {
    const r = regra(fonte, '.stage-chip::before');
    expect(valor(r, 'content')).toBe("''");
    expect(valor(r, 'background')).toBe('currentcolor');
  });

  test('cada etapa desenha uma forma diferente', () => {
    const formas = ETAPAS.map((e) => regra(fonte, `.stage-chip-${e}::before`).replace(/\s+/g, ' ').trim());
    for (const forma of formas) expect(forma.length).toBeGreaterThan(0);
    expect(new Set(formas).size).toBe(ETAPAS.length);
  });

  test('a contagem é mono com algarismos tabulares', () => {
    const r = regra(fonte, '.stage-chip-count');
    expect(valor(r, 'font-family')).toBe('var(--font-mono)');
    expect(valor(r, 'font-variant-numeric')).toBe('tabular-nums');
  });
});

describe('.stage-chip — quando é alvo', () => {
  const seletores = regras(fonte).map((r) => r.seletor);

  test.each([':hover', ':focus-visible', ':active'])('chip clicável tem %s', (estado) => {
    expect(seletores.some((s) => s.startsWith('.stage-chip:is(a, button)') && s.endsWith(estado))).toBe(true);
  });

  test('o foco usa o anel do DS', () => {
    const r = regra(fonte, '.stage-chip:is(a, button):focus-visible');
    expect(valor(r, 'outline')).toContain('var(--focus-ring-color)');
  });
});

describe('.dl-statcard--compact', () => {
  test('padding --space-3, sem altura mínima e sem elevação', () => {
    const r = regra(cards, '.dl-statcard--compact');
    expect(valor(r, 'padding')).toBe('var(--space-3)');
    expect(valor(r, 'min-height')).toBe('0');
    expect(valor(r, 'box-shadow')).toBe('none');
  });

  test('o hover não devolve a elevação', () => {
    expect(valor(regra(cards, '.dl-statcard--compact:hover'), 'box-shadow')).toBe('none');
  });

  test('valor em mono, --text-xl, algarismos tabulares', () => {
    const r = regra(cards, '.dl-statcard--compact .dl-statcard-value');
    expect(valor(r, 'font-family')).toBe('var(--font-mono)');
    expect(valor(r, 'font-size')).toBe('var(--text-xl)');
    expect(valor(r, 'font-variant-numeric')).toBe('tabular-nums');
  });

  test('rótulo e comparação em --text-secondary (leitura do número, não metadado)', () => {
    expect(valor(regra(cards, '.dl-statcard--compact .dl-statcard-label'), 'color')).toBe(
      'var(--text-secondary)',
    );
    expect(valor(regra(cards, '.dl-statcard--compact .dl-statcard-compare'), 'color')).toBe(
      'var(--text-secondary)',
    );
  });

  test('quando é link ou botão, ganha estado de pressão', () => {
    expect(regras(cards).map((r) => r.seletor)).toContain('.dl-statcard--compact:is(a, button):active');
  });
});
