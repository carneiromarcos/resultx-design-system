/**
 * .btn-sheen — reflexo de uma passada (lote P, 05/10/2026)
 *
 * Decisões do Marcos:
 *   - UMA passada, só em :hover e :focus-visible; nunca em loop;
 *   - pico de ~8 % de --text-on-color, ~700 ms;
 *   - texto do botão com 4,5:1 em todo o percurso (medido no Playwright);
 *   - desligado em prefers-reduced-motion.
 * O reflexo mora no ::before: o ::after de .btn já é do spinner de
 * .btn-loading, e um efeito por pseudo-elemento é a lição da Talio.
 */

const { css, regra, regras, valor, emReduzido, keyframes } = require('./lib/css');

const fonte = css('components', 'btn-sheen.css');
const tokens = css('tokens', 'tokens.css');

describe('Reflexo', () => {
  test('o botão recorta o reflexo e isola a pilha', () => {
    const r = regra(fonte, '.btn-sheen');
    expect(valor(r, 'position')).toBe('relative');
    expect(valor(r, 'overflow')).toBe('hidden');
    expect(valor(r, 'isolation')).toBe('isolate');
  });

  test('o reflexo é o ::before, atrás do rótulo e fora do clique', () => {
    const r = regra(fonte, '.btn-sheen::before');
    expect(valor(r, 'z-index')).toBe('-1');
    expect(valor(r, 'pointer-events')).toBe('none');
    expect(valor(r, 'opacity')).toBe('0');
    expect(fonte).not.toMatch(/\.btn-sheen[^{]*::after/);
  });

  test('pico de 8 % de --text-on-color, sem cor cravada', () => {
    const fundo = valor(regra(fonte, '.btn-sheen::before'), 'background');
    expect(fundo).toContain('color-mix(in srgb, var(--text-on-color) 8%, transparent)');
  });
});

describe('Uma passada, nunca em loop', () => {
  const todas = regras(fonte).filter((r) => !emReduzido(r));
  const comAnimacao = todas.filter((r) => valor(r.corpo, 'animation'));

  test('só :hover e :focus-visible disparam a passada', () => {
    expect(comAnimacao.map((r) => r.seletor).sort()).toEqual(
      ['.btn-sheen:focus-visible::before', '.btn-sheen:hover::before'].sort(),
    );
  });

  test('700 ms, uma iteração, curva --ease-sheen', () => {
    for (const r of comAnimacao) {
      const a = valor(r.corpo, 'animation');
      expect(a).toMatch(/\b700ms\b/);
      expect(a).toContain('var(--ease-sheen)');
      expect(a).toMatch(/\s1\s/);
      expect(a).not.toMatch(/infinite/);
    }
  });

  test('nada de infinite em lugar nenhum do arquivo', () => {
    expect(fonte).not.toMatch(/infinite/);
  });

  test('o keyframe atravessa o botão e termina transparente', () => {
    const k = keyframes(fonte).find((x) => x.nome === 'btn-sheen-pass');
    expect(k).toBeDefined();
    expect(k.corpo).toMatch(/100%\s*\{[^}]*opacity:\s*0/);
    expect(k.corpo).toMatch(/translateX\(-\d+%\)/);
  });
});

describe('Reduced motion', () => {
  test('sob reduce o reflexo não existe', () => {
    const r = regras(fonte).find((x) => x.seletor === '.btn-sheen::before' && emReduzido(x));
    expect(r).toBeDefined();
    expect(valor(r.corpo, 'display')).toBe('none');
    expect(valor(r.corpo, 'animation')).toBe('none');
  });
});

describe('Token --ease-sheen', () => {
  test('vive no :root compartilhado de tokens/tokens.css, ao lado das curvas', () => {
    const raiz = regra(tokens, ':root');
    expect(valor(raiz, '--ease-sheen')).toMatch(/^cubic-bezier\(/);
  });

  test('não é a curva de mola: o spring gastava a passada nos primeiros ms', () => {
    const raiz = regra(tokens, ':root');
    expect(valor(raiz, '--ease-sheen')).not.toBe(valor(raiz, '--spring-smooth'));
  });
});
