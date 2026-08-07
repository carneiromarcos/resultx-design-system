/**
 * Segmented control + List item — contract tests
 *
 * O comportamento foi verificado em Chrome real: a seta do teclado percorrendo
 * as opções sem uma linha de JavaScript, o grupo consumindo uma única parada
 * de Tab, e o título truncando a 280px sem espremer a hora. Estes testes
 * guardam o que faz aquilo continuar valendo.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf-8');
/** Corpo da primeira regra cujo seletor comeca com `selector`. */
const rule = (css, selector) => {
  const start = css.indexOf(selector);
  if (start === -1) return '';
  const bloco = css.slice(start);
  return bloco.slice(0, bloco.indexOf('}'));
};

const segmentedCss = read('components', 'segmented.css');
const listItemCss = read('components', 'list-item.css');
const componentsCss = read('components', 'components.css');

describe('Entrega', () => {
  test('components.css importa os dois com a notacao url()', () => {
    expect(componentsCss).toContain("@import url('./segmented.css')");
    expect(componentsCss).toContain("@import url('./list-item.css')");
  });

  test('as classes chegam ao bundle construido', () => {
    const bundle = read('dist', 'components.min.css');
    for (const cls of [
      '.segmented-option',
      '.segmented-stacked',
      '.list-item-title',
      '.list-item-count',
      '.sr-only',
    ]) {
      expect(bundle).toContain(cls);
    }
  });
});

describe('Segmented control — sobre <input type="radio">', () => {
  test('nao existe script: o radio nativo ja faz o trabalho', () => {
    // Se um dia aparecer um dist/segmented.js, e sinal de que alguem
    // reimplementou em JS o que o navegador entrega de graca.
    expect(fs.existsSync(path.join(ROOT, 'dist', 'segmented.js'))).toBe(false);
  });

  test('o estado vem do radio, lido por :has()', () => {
    expect(segmentedCss).toContain(':has(input[type="radio"]:checked)');
    expect(segmentedCss).toContain(':has(input[type="radio"]:focus-visible)');
    expect(segmentedCss).toContain(':has(input[type="radio"]:disabled)');
  });

  test('o radio some da vista sem sair da arvore de acessibilidade', () => {
    // display:none ou visibility:hidden o tirariam do teclado e do leitor de tela.
    const regra = rule(segmentedCss, '.segmented-option input[type="radio"]');
    expect(regra).toContain('clip-path: inset(50%)');
    expect(regra).not.toMatch(/display:\s*none/);
    expect(regra).not.toMatch(/visibility:\s*hidden/);
  });

  test('o <fieldset> tem os padroes do navegador neutralizados', () => {
    // Sem min-width: 0 o fieldset nunca encolhe abaixo do proprio min-content.
    const regra = rule(segmentedCss, '.segmented {');
    expect(regra).toContain('min-width: 0');
    expect(regra).toContain('margin: 0');
  });

  test('todas as opcoes tem a mesma largura', () => {
    expect(segmentedCss).toContain('grid-auto-columns: 1fr');
  });

  test('o alvo de toque respeita a WCAG 2.2', () => {
    expect(segmentedCss).toContain('min-height: 44px');
  });

  test('as variantes vem antes dos estados na cascata', () => {
    // Os estados usam :has() e sao mais especificos; invertido, a variante
    // venceria e a opcao selecionada deixaria de se destacar.
    expect(segmentedCss.indexOf('.segmented-stacked')).toBeLessThan(
      segmentedCss.indexOf(':has(input[type="radio"]:checked)')
    );
  });
});

describe('List item — truncar, nao alargar', () => {
  test('min-width: 0 em cada nivel da cadeia', () => {
    // Um unico nivel sem isso e a linha mais longa passa a definir a largura
    // da coluna inteira.
    for (const cls of [
      '.list-item {',
      '.list-item-body {',
      '.list-item-head {',
      '.list-item-title {',
    ]) {
      expect(rule(listItemCss, cls)).toContain('min-width: 0');
    }
  });

  test('titulo e previa truncam com reticencias', () => {
    for (const cls of ['.list-item-title {', '.list-item-preview {']) {
      const regra = rule(listItemCss, cls);
      expect(regra).toContain('text-overflow: ellipsis');
      expect(regra).toContain('white-space: nowrap');
      expect(regra).toContain('overflow: hidden');
    }
  });

  test('a hora nao encolhe junto', () => {
    expect(rule(listItemCss, '.list-item-time {')).toContain('flex-shrink: 0');
  });

  test('numeros alinham em coluna', () => {
    expect(listItemCss).toContain('font-variant-numeric: tabular-nums');
  });

  test('o trilho de selecao e box-shadow, nao borda', () => {
    // Borda empurraria o conteudo 3px a cada troca de selecao.
    const regra = rule(listItemCss, '.list-item[aria-current] {');
    expect(regra).toContain('box-shadow: inset 3px');
    expect(regra).not.toMatch(/border-left:\s*3px/);
  });

  test('nao-lida sinaliza por peso, nao so por cor', () => {
    // Cor sozinha desaparece para quem nao a distingue.
    expect(rule(listItemCss, '.list-item-unread .list-item-title')).toContain(
      'font-weight: var(--font-semibold)'
    );
  });

  test('reaproveita .avatar do DS em vez de criar outro', () => {
    expect(listItemCss).not.toMatch(/^\.list-item-avatar/m);
    expect(listItemCss).toContain('.avatar');
  });

  test('o divisor fica entre irmaos, nunca nas pontas', () => {
    expect(listItemCss).toContain('.list-item-group > * + *');
  });
});

describe('Divida de consolidacao — .layout-list-item', () => {
  // .layout-list-item ja existia e faz quase a mesma coisa. Nao foi alterado:
  // tem consumidor vivo (demos/candidatos.html) e documentacao propria, entao
  // fundir os dois e uma decisao, nao um efeito colateral. Estes testes
  // impedem a divida de sumir de vista.
  test('o componente antigo continua existindo, intocado', () => {
    expect(componentsCss).toContain('.layout-list-item {');
    expect(componentsCss).toContain('.layout-list-item.active');
  });

  test('a sobreposicao esta registrada na documentacao', () => {
    const doc = read('docs', 'components', 'list-item.md');
    expect(doc).toContain('.layout-list-item');
    expect(doc).toMatch(/consolida/i);
  });

  test('o novo nao repete o deslocamento de layout do antigo', () => {
    // .layout-list-item.active usa border-left: 3px, que empurra o conteudo.
    expect(rule(componentsCss, '.layout-list-item.active')).toContain('border-left: 3px');
    expect(rule(listItemCss, '.list-item[aria-current] {')).not.toContain('border-left');
  });
});

describe('Convencoes do DS', () => {
  test('existe utilitario de texto so para leitor de tela', () => {
    const regra = rule(componentsCss, '.sr-only {');
    expect(regra).toContain('clip-path: inset(50%)');
    expect(regra).not.toMatch(/display:\s*none/);
  });

  test('nenhuma cor literal — tudo por token', () => {
    for (const css of [segmentedCss, listItemCss]) {
      expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(css).not.toMatch(/\brgba?\(/);
    }
  });

  test('os dois respeitam prefers-reduced-motion', () => {
    for (const css of [segmentedCss, listItemCss]) {
      expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    }
  });
});
