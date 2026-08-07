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
/**
 * Corpo da primeira regra cuja LISTA de seletores contem `selector`.
 * Precisa lidar com lista porque a consolidacao de 07/08 fez os nomes antigos
 * virarem alias na mesma regra: `.list-item,\n.layout-list-item { … }`.
 */
const rule = (css, selector) => {
  // As chamadas passam o seletor com ` {` no fim; aqui ele atrapalha.
  const limpo = selector.replace(/\s*\{\s*$/, '');
  const escapado = limpo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const encontrado = new RegExp(`(^|,)\\s*${escapado}\\s*(,|\\{)`, 'm').exec(css);
  if (!encontrado) return '';
  const abre = css.indexOf('{', encontrado.index);
  return css.slice(abre + 1, css.indexOf('}', abre));
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

describe('Consolidacao — .layout-list-item virou alias', () => {
  // Ate 07/08 eram dois componentes fazendo quase a mesma coisa. Foram fundidos
  // numa implementacao so, com os nomes antigos como alias depreciado. Nada foi
  // removido: financex importa o bundle inteiro, e uma classe publica nao some
  // sem major.
  test('existe UMA implementacao — o bloco antigo saiu de components.css', () => {
    expect(componentsCss).not.toMatch(/^\.layout-list-item\s*\{/m);
    expect(componentsCss).not.toMatch(/^\.layout-list-item-info\s*\{/m);
    expect(componentsCss).not.toMatch(/^\.layout-list-item\.active\s*\{/m);
  });

  test('as classes antigas continuam existindo, como alias', () => {
    for (const antiga of [
      '.layout-list-item',
      '.layout-list-item-info',
      '.layout-list-item-name',
      '.layout-list-item-meta',
      '.layout-list-item.active',
    ]) {
      expect(`${antiga}: ${listItemCss.includes(antiga)}`).toBe(`${antiga}: true`);
    }
  });

  test('e chegam ao bundle publicado', () => {
    const bundle = read('dist', 'components.min.css');
    expect(bundle).toContain('.layout-list-item');
    expect(bundle).toContain('.layout-list-item-info');
  });

  test('o nome antigo herdou as 3 correcoes que nao tinha', () => {
    // 1. o trilho de selecao nao desloca mais o conteudo
    const ativo = rule(listItemCss, '.list-item[aria-current]');
    expect(ativo).toContain('box-shadow: inset 3px');
    expect(ativo).not.toContain('border-left');
    // 2. min-width: 0 na linha
    expect(rule(listItemCss, '.list-item')).toContain('min-width: 0');
    // 3. foco visivel
    expect(listItemCss).toContain('.layout-list-item:focus-visible');
  });

  test('o divisor do markup antigo foi preservado', () => {
    // O componente antigo trazia border-bottom em cada item; o novo poe no
    // grupo. Markup antigo nao tem o grupo em volta.
    expect(listItemCss).toContain('.layout-list-item + .layout-list-item');
  });

  test('nenhum demo do repo usa mais o nome antigo', () => {
    const demo = read('demos', 'candidatos.html');
    expect(demo).not.toContain('layout-list-item');
    expect(demo).toContain('list-item-group');
  });

  test('a consolidacao esta registrada na documentacao', () => {
    const doc = read('docs', 'components', 'list-item.md');
    expect(doc).toContain('.layout-list-item');
    expect(doc).toMatch(/deprec/i);
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
