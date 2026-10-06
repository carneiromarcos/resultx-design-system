/**
 * Lote D (05/10/2026) — defeitos do DS achados no protótipo do dashboard
 * Electia (#85) e os candidatos promovidos dele.
 *
 * Defeitos
 *   1. Rodapé da sidebar: nome, papel e iniciais sobre a sidebar navy. A
 *      sidebar é escura nos dois temas, então tudo nela usa os tokens
 *      --sidebar-*, nunca --text-primary (escuro no tema claro).
 *   2. --sidebar-focus-ring: anel >= 3:1 contra o fundo da sidebar e o fundo
 *      do item focado, nos dois temas, no DS e em cada ponte de marca.
 *   3. .dl-status--*: texto >= 4.5:1 nos dois temas (a fórmula de tinta do
 *      .stage-chip).
 *   4. .icon sem dist/icons.min.css sai com 300 px: tamanho padrão seguro no
 *      bundle, com especificidade zero para não brigar com icons.css.
 *      data-cards.css continua fora do bundle (camada própria, export próprio).
 *
 * Candidatos
 *   C1 .sidebar-overlay.sidebar-panel — painel fixo >= 1025 px, gaveta abaixo.
 *   C7 .test-mark — a forma identifica o teste; a cor fica livre.
 *   C8 .zone-distribution — Saudável · Atenção · Alerta, cor + forma + padrão,
 *      estado de grupo insuficiente (N < 5, ADR-018).
 *   C6 .composer-chip — sugestão que preenche o campo sem enviar.
 */

const fs = require('fs');
const path = require('path');

const { css, regra, regras, valor, texto, ROOT, emReduzido } = require('./lib/css');
const { mixOklab, paint, contrastOn, parseColor } = require('./lib/color');
const { contrastRatio } = require('../scripts/lib/contrast');
const { extractBlock, parseDeclarations } = require('../scripts/build-brand-bridges');
const { BRANDS } = require('../scripts/brand-bridges.config');
const { AA_NORMAL, AA_LARGE } = require('../scripts/lib/contrast');

const componentes = css('components', 'components.css');
const dataCards = css('components', 'data-cards.css');
const testMark = css('components', 'test-mark.css');
const zonas = css('components', 'zone-distribution.css');
const composer = css('components', 'composer.css');
const stageChip = css('components', 'stage-chip.css');
const agregadorBruto = texto('components', 'components.css');
const pkg = JSON.parse(texto('package.json'));

/** Os quatro escopos de tema de um arquivo de tokens. */
function escopos(fonte) {
  const media = (esquema) => {
    const bloco = extractBlock(fonte, `@media (prefers-color-scheme: ${esquema})`);
    return bloco && extractBlock(bloco, ':root:not([data-theme])');
  };
  return [
    { nome: '[data-theme="dark"]', tema: 'dark', d: parseDeclarations(extractBlock(fonte, '[data-theme="dark"]')) },
    { nome: '[data-theme="light"]', tema: 'light', d: parseDeclarations(extractBlock(fonte, '[data-theme="light"]')) },
    { nome: '@media dark', tema: 'dark', d: parseDeclarations(media('dark')) },
    { nome: '@media light', tema: 'light', d: parseDeclarations(media('light')) },
  ];
}

const tokensDs = texto('tokens', 'tokens.css');
const ds = escopos(tokensDs);
/** Valor de um token no escopo, caindo no bloco [data-theme] do mesmo tema (os blocos de @media escuro são parciais). */
const tok = (escopo, nome) => {
  if (escopo.d[nome] !== undefined) return escopo.d[nome];
  const base = ds.find((e) => e.tema === escopo.tema && e.nome.startsWith('[data-theme'));
  return base.d[nome];
};

/** Lista legível dos pares que reprovam, para o diff apontar o culpado. */
const reprovados = (pares, minimo) =>
  pares
    .map(([rotulo, fg, bg]) => ({ rotulo, fg, bg, r: contrastOn(fg, paint(bg, '#ffffff')) }))
    .filter(({ r }) => r < minimo)
    .map(({ rotulo, fg, bg, r }) => `${rotulo}: ${fg} sobre ${bg} = ${r.toFixed(3)}:1 (< ${minimo})`);

// ─────────────────────────────────────────────────────────────────────────────
// Defeito 1 — rodapé e marca da sidebar
// ─────────────────────────────────────────────────────────────────────────────

describe('Defeito 1 — texto sobre a sidebar usa tokens da sidebar', () => {
  test('nenhuma regra .sidebar* pinta texto com --text-primary', () => {
    const culpadas = regras(componentes)
      .filter((r) => /^\.sidebar/.test(r.seletor))
      .filter((r) => valor(r.corpo, 'color') === 'var(--text-primary)')
      .map((r) => r.seletor);
    expect(culpadas).toEqual([]);
  });

  test('nome do usuário em --sidebar-text-bright', () => {
    expect(valor(regra(componentes, '.sidebar-user-name'), 'color')).toBe('var(--sidebar-text-bright)');
  });

  test('papel do usuário: --sidebar-text, --text-xs, sem opacidade', () => {
    const r = regra(componentes, '.sidebar-user-role');
    expect(valor(r, 'color')).toBe('var(--sidebar-text)');
    expect(valor(r, 'font-size')).toBe('var(--text-xs)');
    expect(valor(r, 'opacity')).toBeNull();
  });

  test('iniciais do avatar: tinta medida sobre o accent (a mesma do .btn-primary)', () => {
    const r = regra(componentes, '.sidebar-user-avatar');
    expect(valor(r, 'background')).toBe('var(--accent-primary)');
    expect(valor(r, 'color')).toBe('var(--text-inverse)');
  });

  test('logo e nome da marca: tinta do accent e --sidebar-text-bright', () => {
    expect(valor(regra(componentes, '.sidebar-logo'), 'color')).toBe('var(--text-inverse)');
    expect(valor(regra(componentes, '.sidebar-brand-text'), 'color')).toBe('var(--sidebar-text-bright)');
  });

  test('DS: nome, papel e iniciais >= 4.5:1 nos quatro escopos', () => {
    const pares = ds.flatMap((e) => {
      const sb = tok(e, '--sidebar-bg');
      return [
        [`${e.nome} nome`, tok(e, '--sidebar-text-bright'), sb],
        [`${e.nome} papel`, tok(e, '--sidebar-text'), sb],
        [`${e.nome} iniciais`, tok(e, '--text-inverse'), tok(e, '--accent-primary')],
      ];
    });
    expect(reprovados(pares, AA_NORMAL)).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Revisor da #85 (a) — todos os estados do item da sidebar, >= 4.5:1
// ─────────────────────────────────────────────────────────────────────────────

/** Estado -> [seletor, token da tinta, token do fundo do item]. */
const ESTADOS = {
  repouso: ['.sidebar-item', '--sidebar-text', null],
  hover: ['.sidebar-item:hover', '--sidebar-text-bright', '--sidebar-bg-hover'],
  active: ['.sidebar-item.active', '--sidebar-text-active', '--sidebar-active-bg'],
  current: ['.sidebar-item[aria-current="page"]', '--sidebar-text-active', '--sidebar-active-bg'],
  'focus-visible': ['.sidebar-item:focus-visible', '--sidebar-text-bright', '--sidebar-bg-hover'],
};

describe('Revisor (a) — estados do .sidebar-item com tinta da sidebar', () => {
  test.each(Object.entries(ESTADOS))('%s: a regra usa os tokens da sidebar', (_, [sel, tinta, fundo]) => {
    const r = regra(componentes, sel);
    expect(valor(r, 'color')).toBe(`var(${tinta})`);
    if (fundo) expect(valor(r, 'background')).toBe(`var(${fundo})`);
  });

  /** Pares de cada estado, num conjunto de escopos (DS ou ponte sobre o DS). */
  const paresDosEstados = (rotulo, escoposDe, valorDe) =>
    escoposDe.flatMap((e) => {
      const sb = valorDe(e, '--sidebar-bg');
      return Object.entries(ESTADOS).map(([estado, [, tinta, fundo]]) => {
        const bg = fundo ? paint(valorDe(e, fundo), sb) : sb;
        return [`${rotulo} ${e.nome} ${estado}`, valorDe(e, tinta), bg];
      });
    });

  test('DS: >= 4.5:1 em todo estado, nos quatro escopos', () => {
    expect(reprovados(paresDosEstados('DS', ds, tok), AA_NORMAL)).toEqual([]);
  });

  test.each(BRANDS.map((b) => b.id))('ponte %s: >= 4.5:1 em todo estado, nos quatro escopos', (id) => {
    const ponte = escopos(texto('brands', id, 'tokens', 'ds-bridge.css'));
    const valorDe = (e, nome) => {
      const daPonte = ponte.find((x) => x.nome === e.nome).d[nome];
      return daPonte !== undefined ? daPonte : tok(e, nome);
    };
    expect(reprovados(paresDosEstados(id, ds, valorDe), AA_NORMAL)).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Revisor da #86 (P2-1) — AA em TODOS os quadros das transições da sidebar
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Com ponte de fundo claro (PdV, ResultX, Xscore), o item atual é tinta escura
 * sobre dourado e o foco/hover é tinta branca sobre navy. Com color + background
 * interpolando juntos, os quadros do meio caíam a ~2:1. Este teste lê do CSS
 * quais propriedades transicionam e amostra 11 quadros entre as pontas de cada
 * par de estados (nos dois sentidos), em cada escopo do DS e em cada ponte. O
 * que não transiciona troca na hora: só as pontas existem.
 *
 * Inclui a troca de tema: o fundo da .sidebar transiciona, e o texto em
 * repouso (que troca na hora) é medido contra cada quadro desse fundo.
 */
const rgbaDe = (valorCor) => {
  const { hex, alpha } = parseColor(valorCor);
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).concat(alpha);
};
const hexDe = (rgb) => `#${rgb.slice(0, 3).map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;
const sobre = (cor, bgRgb) => [0, 1, 2].map((i) => cor[i] * cor[3] + bgRgb[i] * (1 - cor[3])).concat(1);
/** Interpolação pré-multiplicada (como o navegador interpola cores com alfa). */
const lerpCor = (a, b, t) => {
  const alfa = a[3] + (b[3] - a[3]) * t;
  if (alfa === 0) return [0, 0, 0, 0];
  return [0, 1, 2].map((i) => (a[i] * a[3] + (b[i] * b[3] - a[i] * a[3]) * t) / alfa).concat(alfa);
};
const QUADROS = Array.from({ length: 11 }, (_, i) => i / 10);

/** Propriedades que a regra transiciona (nomes da shorthand `transition`). */
const transicionadas = (seletor) => {
  const t = valor(regra(componentes, seletor), 'transition') || '';
  return t
    .split(',')
    .map((p) => p.trim().split(/\s+/)[0])
    .filter(Boolean);
};
const anima = (props, nome) => props.some((p) => p === 'all' || p === nome || p.startsWith(`${nome}-`));

const ESTADOS_ITEM = {
  repouso: ['--sidebar-text', null],
  hover: ['--sidebar-text-bright', '--sidebar-bg-hover'],
  atual: ['--sidebar-text-active', '--sidebar-active-bg'],
  foco: ['--sidebar-text-bright', '--sidebar-bg-hover'],
};

/** Pontas pintadas de um estado: [tinta rgba, fundo rgb opaco]. */
const pontas = (valorDe, e, [tinta, fundo]) => {
  const sb = rgbaDe(valorDe(e, '--sidebar-bg'));
  const bg = fundo ? sobre(rgbaDe(valorDe(e, fundo)), sb) : sb;
  return [rgbaDe(valorDe(e, tinta)), bg];
};

function quadrosReprovados(rotulo, valorDe) {
  const props = transicionadas('.sidebar-item');
  const corAnima = anima(props, 'color');
  const fundoAnima = anima(props, 'background');
  const nomes = Object.keys(ESTADOS_ITEM);
  const falhas = [];
  for (const e of ds) {
    for (const de of nomes) {
      for (const para of nomes) {
        if (de === para) continue;
        const [tA, bA] = pontas(valorDe, e, ESTADOS_ITEM[de]);
        const [tB, bB] = pontas(valorDe, e, ESTADOS_ITEM[para]);
        for (const t of QUADROS) {
          // O que não transiciona já está na ponta de chegada no 1º quadro.
          const tinta = corAnima ? lerpCor(tA, tB, t) : t === 0 ? tA : tB;
          const fundo = fundoAnima ? lerpCor(bA, bB, t) : t === 0 ? bA : bB;
          const r = contrastRatio(hexDe(sobre(tinta, fundo)), hexDe(fundo));
          if (r < AA_NORMAL) falhas.push(`${rotulo} ${e.nome} ${de}→${para} t=${t}: ${r.toFixed(2)}:1`);
        }
      }
    }
  }
  return falhas;
}

describe('Revisor #86 (P2-1) — quadros das transições da sidebar', () => {
  test('o item não transiciona color nem background (a polaridade inverte entre estados)', () => {
    const props = transicionadas('.sidebar-item');
    expect(anima(props, 'color')).toBe(false);
    expect(anima(props, 'background')).toBe(false);
  });

  test('nenhum estado do item reintroduz transição de cor ou fundo', () => {
    const culpadas = regras(componentes)
      .filter((r) => r.seletor.startsWith('.sidebar-item'))
      .filter((r) => /(^|[\s,:])(color|background|all)\b/.test(valor(r.corpo, 'transition') || ''))
      .map((r) => r.seletor);
    expect(culpadas).toEqual([]);
  });

  test('DS: todo quadro de todo par de estados >= 4,5:1, nos quatro escopos', () => {
    expect(quadrosReprovados('DS', tok)).toEqual([]);
  });

  test.each(BRANDS.map((b) => b.id))('ponte %s: todo quadro de todo par de estados >= 4,5:1', (id) => {
    const ponte = escopos(texto('brands', id, 'tokens', 'ds-bridge.css'));
    const valorDe = (e, nome) => {
      const daPonte = ponte.find((x) => x.nome === e.nome).d[nome];
      return daPonte !== undefined ? daPonte : tok(e, nome);
    };
    expect(quadrosReprovados(id, valorDe)).toEqual([]);
  });

  test('troca de tema: o fundo da .sidebar interpola e o texto em repouso passa em cada quadro', () => {
    const props = transicionadas('.sidebar');
    const fundoAnima = anima(props, 'background');
    const [escuro, claro] = [ds[0], ds[1]];
    const falhas = [];
    for (const [de, para] of [[escuro, claro], [claro, escuro]]) {
      const bA = rgbaDe(tok(de, '--sidebar-bg'));
      const bB = rgbaDe(tok(para, '--sidebar-bg'));
      for (const tinta of ['--sidebar-text', '--sidebar-text-bright']) {
        const cor = rgbaDe(tok(para, tinta)); // texto troca na hora
        for (const t of QUADROS) {
          const fundo = fundoAnima ? lerpCor(bA, bB, t) : bB;
          const r = contrastRatio(hexDe(sobre(cor, fundo)), hexDe(fundo));
          if (r < AA_NORMAL) falhas.push(`${de.nome}→${para.nome} ${tinta} t=${t}: ${r.toFixed(2)}`);
        }
      }
    }
    expect(falhas).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Defeito 2 — --sidebar-focus-ring
// ─────────────────────────────────────────────────────────────────────────────

describe('Defeito 2 — anel de foco sobre a sidebar (WCAG 1.4.11, >= 3:1)', () => {
  test('a .sidebar troca o anel do tema pelo da sidebar, para todo focável dentro dela', () => {
    expect(valor(regra(componentes, '.sidebar'), '--focus-ring-color')).toBe(
      'var(--sidebar-focus-ring, var(--sidebar-text-bright))',
    );
  });

  test('o foco do item usa a variável, não uma cor fixa', () => {
    expect(valor(regra(componentes, '.sidebar-item:focus-visible'), 'outline')).toContain(
      'var(--focus-ring-color)',
    );
  });

  test('DS: --sidebar-focus-ring nos quatro escopos contra o fundo e o hover da sidebar', () => {
    const pares = ds.flatMap((e) => {
      const anel = e.d['--sidebar-focus-ring'];
      expect(`${e.nome}: ${anel === undefined ? 'ausente' : 'ok'}`).toBe(`${e.nome}: ok`);
      return [
        [`${e.nome} sobre --sidebar-bg`, anel, tok(e, '--sidebar-bg')],
        [`${e.nome} sobre --sidebar-bg-hover`, anel, tok(e, '--sidebar-bg-hover')],
      ];
    });
    expect(reprovados(pares, AA_LARGE)).toEqual([]);
  });

  test.each(BRANDS.map((b) => b.id))('ponte %s: --sidebar-focus-ring nos quatro escopos', (id) => {
    const ponte = escopos(texto('brands', id, 'tokens', 'ds-bridge.css'));
    const pares = ponte.flatMap((e) => {
      const anel = e.d['--sidebar-focus-ring'];
      expect(`${id} ${e.nome}: ${anel === undefined ? 'ausente' : 'ok'}`).toBe(`${id} ${e.nome}: ok`);
      const doDs = ds.find((x) => x.nome === e.nome);
      return [
        [`${id} ${e.nome} sobre --sidebar-bg`, anel, tok(doDs, '--sidebar-bg')],
        [`${id} ${e.nome} sobre --sidebar-bg-hover`, anel, tok(doDs, '--sidebar-bg-hover')],
      ];
    });
    expect(reprovados(pares, AA_LARGE)).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Defeito 3 — .dl-status
// ─────────────────────────────────────────────────────────────────────────────

const STATUS = {
  'in-progress': { cor: '--color-warning', fundo: '--color-warning-bg' },
  done: { cor: '--color-success', fundo: '--color-success-bg' },
  'need-review': { cor: '--theory-lesenne', fundo: null }, // sem a camada de dados, cai no rosa do DS
  pending: { cor: '--color-info', fundo: '--color-info-bg' },
  blocked: { cor: '--color-error', fundo: '--color-error-bg' },
};

describe('Defeito 3 — .dl-status com texto AA nos dois temas', () => {
  const base = regra(dataCards, '.dl-status');
  const tinta = valor(base, 'color') || '';
  const m = /^color-mix\(in oklab, var\(--status-color\) (\d+)%, var\(--text-primary\)\)$/.exec(tinta);

  test('a tinta é a cor do status puxada para --text-primary (fórmula do .stage-chip)', () => {
    expect(m).not.toBeNull();
  });

  test.each(Object.keys(STATUS))('.dl-status--%s declara --status-color e não pinta color direto', (v) => {
    const r = regra(dataCards, `.dl-status--${v}`);
    expect(valor(r, '--status-color')).toMatch(/^var\(--/);
    expect(valor(r, 'color')).toBeNull();
  });

  test('nenhuma cor crua nas variantes de status', () => {
    const cruas = regras(dataCards)
      .filter((r) => r.seletor.startsWith('.dl-status'))
      .filter((r) => /#[0-9a-f]{3,8}\b|rgba?\(/i.test(r.corpo))
      .map((r) => r.seletor);
    expect(cruas).toEqual([]);
  });

  test('DS: todas as variantes >= 4.5:1 sobre o fundo e a surface-1, nos quatro escopos', () => {
    expect(m).not.toBeNull();
    const p = Number(m[1]);
    const pares = ds.flatMap((e) =>
      Object.entries(STATUS).flatMap(([v, { cor, fundo }]) => {
        const c = tok(e, cor);
        const ink = mixOklab(c, p, tok(e, '--text-primary'));
        const fundoDoStatus = fundo ? tok(e, fundo) : null;
        return ['--bg-base', '--bg-surface-1'].map((s) => {
          const sup = tok(e, s);
          const bg = fundoDoStatus ? paint(fundoDoStatus, sup) : mixSrgbAlpha(c, 0.12, sup);
          return [`${e.nome} ${v} sobre ${s}`, ink, bg];
        });
      }),
    );
    expect(reprovados(pares, AA_NORMAL)).toEqual([]);
  });
});

/** color-mix(in srgb, c 12%, transparent) pintado sobre a superfície. */
function mixSrgbAlpha(c, alpha, sup) {
  const h = paint(c, '#ffffff');
  const rgb = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  return paint(`rgba(${rgb.join(', ')}, ${alpha})`, sup);
}

// ─────────────────────────────────────────────────────────────────────────────
// Defeito 4 — ícones e data-cards fora do bundle
// ─────────────────────────────────────────────────────────────────────────────

describe('Defeito 4 — bundle principal', () => {
  test('.icon tem tamanho padrão de 1em no bundle, com especificidade zero', () => {
    const r = regra(componentes, ':where(svg.icon)');
    expect(valor(r, 'width')).toBe('1em');
    expect(valor(r, 'height')).toBe('1em');
    expect(valor(r, 'flex-shrink')).toBe('0');
  });

  test('o padrão chega ao dist/components.min.css', () => {
    expect(texto('dist', 'components.min.css')).toMatch(/:where\(svg\.icon\)\{[^}]*width:1em/);
  });

  test('data-cards.css continua camada à parte, com export próprio e documentada', () => {
    expect(agregadorBruto).not.toMatch(/@import[^;]*data-cards/);
    expect(pkg.exports['./components/data-cards']).toBe('./components/data-cards.css');
    const doc = texto('docs', 'components', 'data-cards.md');
    expect(doc).toMatch(/fora do `?dist\/components\.min\.css`?/);
  });

  test('a doc de ícones diz o que o bundle principal já garante', () => {
    expect(texto('docs', 'components', 'icons.md')).toMatch(/:where\(svg\.icon\)/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C1 — painel no desktop
// ─────────────────────────────────────────────────────────────────────────────

describe('C1 — .sidebar-overlay.sidebar-panel', () => {
  const ctx = { contexto: 'min-width: 1025px' };

  test('acima de 1024 px o painel para de flutuar e fica visível', () => {
    const r = regra(componentes, '.sidebar-overlay.sidebar-panel', ctx);
    expect(valor(r, 'visibility')).toBe('visible');
    expect(valor(r, 'transform')).toBe('none');
    expect(valor(r, 'z-index')).toBe('var(--z-sidebar)');
  });

  test('abaixo do corte nada muda: continua sendo a gaveta do overlay', () => {
    expect(regra(componentes, '.sidebar-overlay.sidebar-panel')).toBe('');
  });

  test('o gatilho marcado some acima do corte', () => {
    const r = regra(componentes, '.sidebar-panel-toggle[data-sidebar-toggle]', ctx);
    expect(valor(r, 'display')).toBe('none');
  });

  test('o script de sempre serve: o painel não exige JS novo', () => {
    expect(texto('dist', 'sidebar-overlay.js')).toContain('data-sidebar-media');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C7 — .test-mark
// ─────────────────────────────────────────────────────────────────────────────

const TESTES = ['disc', 'tipologia', 'eneagrama', 'bigfive', 'temperamentos', 'motivadores'];

describe('C7 — .test-mark: a forma identifica o teste', () => {
  test('a cor é um gancho, com padrão neutro', () => {
    expect(valor(regra(testMark, '.test-mark'), 'background')).toBe(
      'var(--test-mark-color, var(--text-secondary))',
    );
  });

  test('cada teste tem uma forma diferente', () => {
    const formas = TESTES.map((t) => regra(testMark, `.test-mark-${t}`).replace(/\s+/g, ' ').trim());
    for (const f of formas) expect(f.length).toBeGreaterThan(0);
    expect(new Set(formas).size).toBe(TESTES.length);
  });

  test.each([
    ['eneagrama', 9],
    ['bigfive', 5],
    ['motivadores', 6],
  ])('%s é um polígono de %i lados', (t, lados) => {
    const clip = valor(regra(testMark, `.test-mark-${t}`), 'clip-path') || '';
    expect((clip.match(/%\s+[\d.]+%/g) || []).length).toBe(lados);
  });

  test('nenhuma cor de teste no componente (a paleta de resultado não mora no DS)', () => {
    expect(testMark).not.toMatch(/--theory-|--disc-|--bigfive-|--mbti-|#[0-9a-f]{3,8}\b/i);
  });

  test('alto contraste: a marca não some no modo de cores forçadas', () => {
    expect(regra(testMark, '.test-mark', { contexto: 'forced-colors: active' })).toMatch(/CanvasText/);
  });

  test('a cor padrão passa 3:1 contra toda superfície, nos quatro escopos', () => {
    const pares = ds.flatMap((e) =>
      ['--bg-base', '--bg-surface-1', '--bg-surface-2', '--bg-surface-3'].map((s) => [
        `${e.nome} sobre ${s}`,
        tok(e, '--text-secondary'),
        tok(e, s),
      ]),
    );
    expect(reprovados(pares, AA_LARGE)).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C8 — .zone-distribution
// ─────────────────────────────────────────────────────────────────────────────

const ZONAS = { saudavel: '--color-success', atencao: '--color-warning', alerta: '--color-error' };

describe('C8 — .zone-distribution (Saudável · Atenção · Alerta)', () => {
  test('nenhuma zona se chama "risco"', () => {
    expect(zonas).not.toMatch(/risco/i);
  });

  test.each(Object.entries(ZONAS))('.zone-%s tem cor semântica com gancho de produto', (z, cor) => {
    expect(valor(regra(zonas, `.zone-distribution .zone-${z}`), '--zone-color')).toBe(
      `var(--zone-color-${z}, var(${cor}))`,
    );
  });

  test('cada zona tem um padrão próprio na barra (não só cor)', () => {
    const padroes = Object.keys(ZONAS).map((z) =>
      valor(regra(zonas, `.zone-distribution-segment.zone-${z}`), 'background'),
    );
    for (const p of padroes) expect(p).toBeTruthy();
    expect(new Set(padroes).size).toBe(3);
  });

  test('cada zona tem uma forma própria na legenda', () => {
    const formas = Object.keys(ZONAS).map((z) =>
      regra(zonas, `.zone-${z} .zone-distribution-mark`).replace(/\s+/g, ' ').trim(),
    );
    for (const f of formas) expect(f.length).toBeGreaterThan(0);
    expect(new Set(formas).size).toBe(3);
  });

  test('marca e barra usam a tinta da zona (cor puxada para --text-primary)', () => {
    const r = regras(zonas).find((x) => /--zone-ink\s*:/.test(x.corpo));
    expect(valor(r.corpo, '--zone-ink')).toMatch(
      /^color-mix\(in oklab, var\(--zone-color\) \d+%, var\(--text-primary\)\)$/,
    );
  });

  test('DS: a tinta das zonas passa 3:1 contra o fundo e a surface-1, nos quatro escopos', () => {
    const r = regras(zonas).find((x) => /--zone-ink\s*:/.test(x.corpo));
    const p = Number(/(\d+)%/.exec(valor(r.corpo, '--zone-ink'))[1]);
    const pares = ds.flatMap((e) =>
      Object.entries(ZONAS).flatMap(([z, cor]) =>
        ['--bg-base', '--bg-surface-1'].map((s) => [
          `${e.nome} ${z} sobre ${s}`,
          mixOklab(tok(e, cor), p, tok(e, '--text-primary')),
          tok(e, s),
        ]),
      ),
    );
    expect(reprovados(pares, AA_LARGE)).toEqual([]);
  });

  test('grupo insuficiente esconde barra e números', () => {
    const esconde = regras(zonas)
      .filter((x) => x.seletor.startsWith('.zone-distribution--insufficient'))
      .filter((x) => valor(x.corpo, 'display') === 'none')
      .map((x) => x.seletor);
    expect(esconde).toEqual(
      expect.arrayContaining([
        '.zone-distribution--insufficient .zone-distribution-segment',
        '.zone-distribution--insufficient .zone-distribution-value',
      ]),
    );
  });

  test('a doc registra N >= 5, ADR-018 e os nomes exatos', () => {
    const doc = texto('docs', 'components', 'zone-distribution.md');
    expect(doc).toMatch(/ADR-018/);
    expect(doc).toMatch(/5 respostas/);
    expect(doc).toMatch(/Saudável · Atenção · Alerta/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C6 — .composer-chip
// ─────────────────────────────────────────────────────────────────────────────

describe('C6 — .composer-chip', () => {
  test('alvo de pelo menos 24 px e foco do DS', () => {
    const r = regra(composer, '.composer-chip');
    expect(valor(r, 'min-block-size')).toBe('var(--space-8)');
    expect(valor(regra(composer, '.composer-chip:focus-visible'), 'outline')).toContain(
      'var(--focus-ring-color)',
    );
  });

  test('transição desligada em reduced-motion', () => {
    const reduzido = regras(composer).filter(emReduzido).map((x) => x.seletor);
    expect(reduzido).toContain('.composer-chip');
  });

  test('o script preenche sem enviar: sem submit, sem requestSubmit', () => {
    const js = texto('dist', 'composer.js');
    expect(js).toContain('data-composer-fill');
    expect(js).toMatch(/fill:\s*fill/);
    expect(js).not.toMatch(/requestSubmit|\.submit\(/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Re-revisão da #85 — .stage-chip pressionado: AA em todos os quadros
// ─────────────────────────────────────────────────────────────────────────────

/**
 * O que este bloco garante, só para o .stage-chip puro do DS: o estado
 * pressionado transiciona o fundo entre 12 % e 20 % da cor da etapa, e a
 * tinta não muda nessa troca. Aqui: color e opacity não entram na transição,
 * o DS não altera tinta nem opacidade do chip desmarcado, e cada quadro
 * intermediário (11 amostras entre as pontas) passa 4,5:1 nos quatro escopos.
 *
 * Não cobre o caso visto na re-revisão da #85 (snapshot 1db1f9b, 4,09:1 no
 * escuro a 13–29 ms): lá a tinta do protótipo trocava na hora para
 * --text-secondary enquanto o fundo interpolava. Isso é composição local do
 * protótipo e não foi resolvido nesta PR.
 */
const ETAPA_COR = {
  triagem: '--text-secondary',
  entrevista: '--color-info',
  oferta: '--color-warning',
  contratado: '--color-success',
  rejeitado: '--color-error',
};

describe('Re-revisão #85 — .stage-chip pressionado/desmarcado', () => {
  const pct = (sel) =>
    Number(/var\(--stage-color\) (\d+)%, transparent/.exec(valor(regra(stageChip, sel), 'background'))[1]);

  test('a transição não inclui color nem opacity (só fundo e transform)', () => {
    const t = valor(regra(stageChip, '.stage-chip:is(a, button)'), 'transition');
    expect(t).not.toMatch(/(^|[ ,])(color|opacity|all)\b/);
  });

  test('o DS não esmaece nem risca o chip desmarcado', () => {
    const desmarcado = regras(stageChip).filter((r) => /aria-pressed=['"]false/.test(r.seletor));
    for (const r of desmarcado) {
      expect(valor(r.corpo, 'opacity')).toBeNull();
      expect(valor(r.corpo, 'color')).toBeNull();
    }
  });

  test('todo quadro entre repouso e pressionado passa 4,5:1, nos quatro escopos', () => {
    const repouso = pct('.stage-chip');
    const pressionado = pct(".stage-chip:is(a, button)[aria-pressed='true']");
    const tinta = /(\d+)%/.exec(valor(regra(stageChip, '.stage-chip'), '--stage-ink'))[1];
    const pares = ds.flatMap((e) =>
      Object.entries(ETAPA_COR).flatMap(([etapa, cor]) => {
        const c = tok(e, cor);
        const ink = mixOklab(c, Number(tinta), tok(e, '--text-primary'));
        return Array.from({ length: 11 }, (_, i) => {
          const alfa = (repouso + ((pressionado - repouso) * i) / 10) / 100;
          return [`${e.nome} ${etapa} quadro ${i}/10`, ink, mixSrgbAlpha(c, alfa, tok(e, '--bg-base'))];
        });
      }),
    );
    expect(reprovados(pares, AA_NORMAL)).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Empacotamento e registro
// ─────────────────────────────────────────────────────────────────────────────

describe('Empacotamento do lote D', () => {
  test.each(['test-mark.css', 'zone-distribution.css'])('%s é importado e publicado', (f) => {
    expect(agregadorBruto).toContain(`@import url('./${f}');`);
    expect(pkg.files).toContain(`components/${f}`);
  });

  test.each(['test-mark.md', 'zone-distribution.md'])('docs/components/%s existe', (f) => {
    expect(fs.existsSync(path.join(ROOT, 'docs', 'components', f))).toBe(true);
  });

  test('o CHANGELOG registra o lote D', () => {
    expect(texto('CHANGELOG.md')).toMatch(/lote D/);
  });
});
