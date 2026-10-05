/**
 * Brand orb — contrato da assinatura visual dos agentes de IA
 *
 * Decisão de 05/10/2026: a orb animada identifica os agentes Nexus e Copilot
 * (Electia), IMO (Emprega+) e Xscore. Um componente só; o movimento é igual em
 * todos, a cor muda por marca. Estes testes guardam três promessas:
 *   1. a classe chega ao bundle e é importada pelo agregador;
 *   2. cada marca resolve um conjunto de cores próprio, e esse conjunto é o
 *      mesmo pigmento declarado no arquivo de tokens da marca (sem deriva);
 *   3. o movimento só mexe em transform, opacity e propriedades registradas,
 *      e para por completo sob prefers-reduced-motion;
 *   4. WCAG 2.2.2 (decisão de 05/10/2026): em repouso nada anima; a entrada
 *      dura no máximo 5 s com iterações finitas; loop só em data-state="active".
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf-8');
const semComentarios = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Corpo de um bloco `{ … }` a partir do índice da chave de abertura. */
const corpoDoBloco = (css, abre) => {
  let profundidade = 1;
  let pos = abre + 1;
  while (pos < css.length && profundidade > 0) {
    if (css[pos] === '{') profundidade++;
    if (css[pos] === '}') profundidade--;
    pos++;
  }
  return css.slice(abre + 1, pos - 1);
};

/** Corpo da primeira regra cujo seletor é exatamente `seletor`. */
const regra = (css, seletor) => {
  const escapado = seletor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const achado = new RegExp(`(^|[}\\s,])${escapado}\\s*\\{`, 'm').exec(css);
  if (!achado) return '';
  return corpoDoBloco(css, css.indexOf('{', achado.index + achado[1].length));
};

/** Valor de `--prop` dentro de um corpo de regra. */
const valor = (corpo, prop) => {
  const m = new RegExp(`${prop}\\s*:\\s*([^;]+);`).exec(corpo);
  return m ? m[1].trim() : null;
};

const ORB_PATH = path.join(ROOT, 'components', 'brand-orb.css');
const orbCss = fs.existsSync(ORB_PATH) ? semComentarios(fs.readFileSync(ORB_PATH, 'utf-8')) : '';
const tokensCss = semComentarios(read('tokens', 'tokens.css'));
const rootTokens = regra(tokensCss, ':root');

/** Resolve `var(--x)` contra o :root compartilhado de tokens/tokens.css. */
const resolver = (expr) => {
  const m = /^var\((--[\w-]+)\)$/.exec(expr || '');
  if (!m) return null;
  const v = valor(rootTokens, m[1]);
  return v ? v.toLowerCase() : null;
};

const MARCAS = {
  electia: ['brands', 'electia', 'tokens', 'tokens.css'],
  emprega: ['brands', 'emprega-mais', 'tokens', 'tokens.css'],
  xscore: ['brands', 'xscore', 'tokens', 'tokens.css'],
};
const PAPEIS = ['--orb-core', '--orb-glow', '--orb-shade'];

const coresDa = (marca) => {
  const corpo = regra(orbCss, `.brand-orb-${marca}`);
  return PAPEIS.map((papel) => resolver(valor(corpo, papel)));
};

describe('Entrega', () => {
  test('components.css importa brand-orb.css com a notação url()', () => {
    expect(read('components', 'components.css')).toContain("@import url('./brand-orb.css')");
  });

  test('as classes e os registros @property chegam ao bundle construído', () => {
    const bundle = read('dist', 'components.min.css');
    for (const trecho of [
      '.brand-orb',
      '.brand-orb-sm',
      '.brand-orb-md',
      '.brand-orb-lg',
      '.brand-orb-electia',
      '.brand-orb-emprega',
      '.brand-orb-xscore',
      '.brand-orb-lockup',
      '@property --orb-ax',
    ]) {
      expect(bundle).toContain(trecho);
    }
  });

  test('o arquivo respeita o teto de 400 linhas', () => {
    expect(read('components', 'brand-orb.css').split('\n').length).toBeLessThanOrEqual(400);
  });
});

describe('Cor por marca', () => {
  test.each(Object.keys(MARCAS))('%s resolve os três papéis para hex em tokens.css', (marca) => {
    for (const cor of coresDa(marca)) {
      expect(cor).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  test('Electia, Emprega+ e Xscore resolvem conjuntos de cor diferentes', () => {
    const assinaturas = Object.keys(MARCAS).map((m) => coresDa(m).join(' '));
    expect(new Set(assinaturas).size).toBe(assinaturas.length);
  });

  test('o núcleo da Emprega+ não é o roxo da Electia', () => {
    expect(coresDa('emprega')[0]).not.toBe(coresDa('electia')[0]);
  });

  test('a orb sem modificador de marca é a da Electia (roxo canônico do ecossistema)', () => {
    const base = regra(orbCss, '.brand-orb');
    expect(PAPEIS.map((p) => resolver(valor(base, p)))).toEqual(coresDa('electia'));
  });

  // O pigmento do DS é cópia do valor da marca. Se a marca mudar o hex e o DS
  // não acompanhar, a orb passa a mentir sobre a identidade — este teste pega.
  test.each([
    ['electia', '--orb-core', '--purple'],
    ['electia', '--orb-glow', '--purple-on-dark'],
    ['electia', '--orb-shade', '--purple-950'],
    ['emprega', '--orb-core', '--emp-indigo-dark'],
    ['emprega', '--orb-glow', '--emp-indigo-ink'],
    ['emprega', '--orb-shade', '--emp-navy'],
    ['xscore', '--orb-core', '--intel'],
    ['xscore', '--orb-glow', '--gold'],
    ['xscore', '--orb-shade', '--bg'],
  ])('%s %s = %s do arquivo da marca', (marca, papel, tokenDaMarca) => {
    const marcaCss = semComentarios(read(...MARCAS[marca]));
    const daMarca = valor(regra(marcaCss, ':root'), tokenDaMarca);
    const corpo = regra(orbCss, `.brand-orb-${marca}`);
    expect(resolver(valor(corpo, papel))).toBe(daMarca.toLowerCase());
  });

  test('nenhum hex cravado no componente', () => {
    expect(orbCss).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });
});

describe('Movimento', () => {
  const keyframes = [...orbCss.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)].map((m) => ({
    nome: m[1],
    corpo: corpoDoBloco(orbCss, orbCss.indexOf('{', m.index)),
  }));

  test('existem as quatro animações (forma, deriva, giro, brilho)', () => {
    expect(keyframes.map((k) => k.nome).sort()).toEqual(
      ['orb-drift', 'orb-glint', 'orb-shape', 'orb-spin'].sort(),
    );
  });

  test('keyframes só mexem em transform, opacity ou propriedades registradas', () => {
    const registradas = [...orbCss.matchAll(/@property\s+(--[\w-]+)/g)].map((m) => m[1]);
    for (const { corpo } of keyframes) {
      const props = [...corpo.matchAll(/(--[\w-]+|[a-z-]+)\s*:/g)].map((m) => m[1]);
      for (const prop of props) {
        const permitido =
          prop === 'transform' || prop === 'opacity' || registradas.includes(prop);
        expect({ prop, permitido }).toEqual({ prop, permitido: true });
      }
    }
  });

  test('toda propriedade registrada é inherits: false e tem initial-value', () => {
    const registros = [...orbCss.matchAll(/@property\s+(--[\w-]+)\s*\{/g)];
    expect(registros.length).toBeGreaterThan(0);
    for (const r of registros) {
      const corpo = corpoDoBloco(orbCss, orbCss.indexOf('{', r.index));
      expect(corpo).toMatch(/inherits:\s*false/);
      expect(corpo).toMatch(/initial-value:/);
    }
  });

  test('as animações de propriedade registrada só ligam onde @property existe', () => {
    // Sem @property, a interpolação de --orb-* vira salto a cada keyframe.
    // O gate é uma feature lançada depois de @property em todos os motores.
    const gate = /@supports\s*\(transition-behavior:\s*allow-discrete\)\s*\{/.exec(orbCss);
    expect(gate).not.toBeNull();
    const dentro = corpoDoBloco(orbCss, orbCss.indexOf('{', gate.index));
    expect(dentro).toMatch(/orb-shape/);
    expect(dentro).toMatch(/orb-drift/);
    const fora = orbCss.replace(dentro, '');
    expect(fora).not.toMatch(/animation[^;{]*orb-(shape|drift)/);
  });

  test('sob reduced-motion a orb, o brilho e o reflexo ficam com animation: none', () => {
    const m = /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/.exec(orbCss);
    expect(m).not.toBeNull();
    const bloco = corpoDoBloco(orbCss, orbCss.indexOf('{', m.index));
    for (const seletor of ['.brand-orb', '.brand-orb::before', '.brand-orb::after']) {
      const escapado = seletor.replace(/[.:]/g, '\\$&');
      expect(bloco).toMatch(new RegExp(`${escapado}[^{]*\\{[^}]*animation:\\s*none`));
    }
  });
});

/** Todas as regras folha (sem blocos aninhados), com a pilha de at-rules. */
const regras = (css, contexto = []) => {
  const lista = [];
  let pos = 0;
  while (pos < css.length) {
    const abre = css.indexOf('{', pos);
    if (abre === -1) break;
    const cabeca = css.slice(pos, abre).trim();
    const corpo = corpoDoBloco(css, abre);
    if (cabeca.startsWith('@')) {
      if (!cabeca.startsWith('@keyframes') && !cabeca.startsWith('@property')) {
        lista.push(...regras(corpo, [...contexto, cabeca]));
      }
    } else {
      for (const seletor of cabeca.split(',')) {
        lista.push({ seletor: seletor.trim(), corpo, contexto });
      }
    }
    pos = abre + corpo.length + 2;
  }
  return lista;
};

/** `animation` → [{ nome, duracao, atraso, iteracoes }] (s; Infinity = infinite). */
const animacoes = (corpo) => {
  const v = valor(corpo, 'animation');
  if (!v || v === 'none') return [];
  return v.split(',').map((item) => {
    const partes = item.trim().split(/\s+/);
    const tempos = partes
      .filter((p) => /^-?[\d.]+m?s$/.test(p))
      .map((p) => (p.endsWith('ms') ? parseFloat(p) / 1000 : parseFloat(p)));
    const iter = partes.find((p) => p === 'infinite' || /^[\d.]+$/.test(p));
    return {
      nome: partes.find((p) => /^orb-/.test(p)),
      duracao: tempos[0] || 0,
      atraso: tempos[1] || 0,
      iteracoes: iter === 'infinite' ? Infinity : parseFloat(iter || '1'),
    };
  });
};

describe('Estados — WCAG 2.2.2 (decisão de 05/10/2026)', () => {
  const todas = regras(orbCss);
  const reduz = (r) => r.contexto.some((c) => /prefers-reduced-motion:\s*reduce/.test(c));
  const ATIVO = '[data-state="active"]';
  const BASE = ['.brand-orb', '.brand-orb::before', '.brand-orb::after'];

  test('loop infinito só existe sob data-state="active"', () => {
    const comLoop = todas.filter((r) => /\binfinite\b/.test(valor(r.corpo, 'animation') || ''));
    expect(comLoop.length).toBeGreaterThan(0);
    for (const r of comLoop) expect(r.seletor).toContain(ATIVO);
  });

  test.each(BASE)('entrada de %s: iterações finitas e no máximo 5 s', (seletor) => {
    const comAnimacao = todas.filter(
      (r) => r.seletor === seletor && !reduz(r) && valor(r.corpo, 'animation'),
    );
    expect(comAnimacao.length).toBeGreaterThan(0);
    for (const r of comAnimacao) {
      for (const a of animacoes(r.corpo)) {
        expect(Number.isFinite(a.iteracoes)).toBe(true);
        expect(a.atraso + a.duracao * a.iteracoes).toBeLessThanOrEqual(5);
      }
    }
  });

  test('cada keyframe começa e termina no quadro de repouso (a entrada para nele)', () => {
    // Repouso = initial-value dos registros e valores-base das camadas.
    const repouso = {
      '--orb-ax': '32%', '--orb-ay': '28%', '--orb-bx': '74%', '--orb-by': '78%',
      '--orb-ra': '50%', '--orb-rb': '50%', '--orb-rc': '50%', '--orb-rd': '50%',
      opacity: '0.85',
    };
    for (const nome of ['orb-shape', 'orb-drift', 'orb-glint']) {
      const m = new RegExp(`@keyframes\\s+${nome}\\s*\\{`).exec(orbCss);
      const corpo = corpoDoBloco(orbCss, orbCss.indexOf('{', m.index));
      const extremo = /0%\s*,\s*100%\s*\{([^}]*)\}/.exec(corpo);
      expect(extremo).not.toBeNull();
      for (const [prop, v] of [...extremo[1].matchAll(/(--[\w-]+|opacity)\s*:\s*([^;]+);/g)].map(
        (x) => [x[1], x[2].trim()],
      )) {
        expect({ nome, prop, v }).toEqual({ nome, prop, v: repouso[prop] });
      }
    }
    expect(valor(regra(orbCss, '.brand-orb::after'), 'opacity')).toBe(repouso.opacity);
  });

  test.each([
    ['.brand-orb[data-state="active"]', ['orb-shape', 'orb-drift']],
    ['.brand-orb[data-state="active"]::before', ['orb-spin']],
    ['.brand-orb[data-state="active"]::after', ['orb-glint']],
  ])('%s anima em loop', (seletor, nomes) => {
    const r = todas.find((x) => x.seletor === seletor && !reduz(x));
    expect(r).toBeDefined();
    const lista = animacoes(r.corpo);
    expect(lista.map((a) => a.nome).sort()).toEqual([...nomes].sort());
    for (const a of lista) expect(a.iteracoes).toBe(Infinity);
  });

  test('o estado ativo do corpo também respeita o gate de @property', () => {
    const r = todas.find((x) => x.seletor === '.brand-orb[data-state="active"]' && !reduz(x));
    expect(r.contexto.some((c) => /transition-behavior:\s*allow-discrete/.test(c))).toBe(true);
  });

  test.each([...BASE, '.brand-orb[data-state="active"]', '.brand-orb[data-state="active"]::before', '.brand-orb[data-state="active"]::after'])(
    'reduced-motion zera %s',
    (seletor) => {
      const r = todas.find((x) => x.seletor === seletor && reduz(x));
      expect(r).toBeDefined();
      expect(valor(r.corpo, 'animation')).toBe('none');
    },
  );
});
