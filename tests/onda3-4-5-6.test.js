/**
 * Onda 3 — itens 4, 5 e 6
 *
 *   4. toast, empty-state e tooltip nao tinham arquivo de doc nenhum
 *   5. .tooltip-wrapper impunha display:inline-block e desmontava o flex do pai
 *   6. a camada base cortava tabela larga em vez de rolar
 *
 * O comportamento foi verificado em Chrome: o item do rail manteve `flex` sem o
 * contorno local, o tooltip foi de opacidade 0 para 1 no Tab, e a tabela de
 * 552px dentro de um cartao de 446px passou a ser alcancavel.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf-8');

const componentsCss = read('components', 'components.css');
const bundle = read('dist', 'components.min.css');

/**
 * Corpo da primeira regra cuja lista de seletores contem `selector`,
 * SEM comentarios — os comentarios deste repo citam o codigo antigo ao explicar
 * a mudanca ("overflow-x: auto (era `overflow: hidden`)"), e uma assercao de
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

describe('Item 4 — os tres componentes ganharam doc', () => {
  test.each(['toast', 'empty-state', 'tooltip'])('docs/components/%s.md existe', (nome) => {
    expect(fs.existsSync(path.join(ROOT, 'docs', 'components', `${nome}.md`))).toBe(true);
  });

  test('cada doc cobre as classes que o CSS realmente tem', () => {
    const familias = {
      toast: ['.toast-container', '.toast-success', '.toast-action', '.toast-dismiss'],
      'empty-state': ['.empty-state-icon', '.empty-state-title', '.empty-state-inline'],
      tooltip: ['.tooltip-wrapper', '.tooltip-right', '.tooltip-bottom'],
    };
    for (const [nome, classes] of Object.entries(familias)) {
      const doc = read('docs', 'components', `${nome}.md`);
      for (const cls of classes) {
        expect(`${nome}.md <- ${cls}: ${doc.includes(cls)}`).toBe(`${nome}.md <- ${cls}: true`);
      }
    }
  });

  test('a tabela mestra deixou de listar as tres familias sem doc', () => {
    const api = read('docs', 'api-reference.md');
    for (const alvo of [
      '[toast.md](components/toast.md)',
      '[tooltip.md](components/tooltip.md)',
      '[empty-state.md](components/empty-state.md)',
    ]) {
      expect(`${alvo}: ${api.includes(alvo)}`).toBe(`${alvo}: true`);
    }
  });

  test('nenhum link relativo dos docs novos aponta para o vazio', () => {
    for (const nome of ['toast', 'empty-state', 'tooltip']) {
      const doc = read('docs', 'components', `${nome}.md`);
      const links = doc.match(/\]\(([a-z-]+\.md)\)/g) || [];
      for (const l of links) {
        const alvo = l.slice(2, -1);
        const existe = fs.existsSync(path.join(ROOT, 'docs', 'components', alvo));
        expect(`${nome}.md -> ${alvo}: ${existe}`).toBe(`${nome}.md -> ${alvo}: true`);
      }
    }
  });
});

describe('Item 5 — o .tooltip-wrapper parou de impor layout', () => {
  test('so posiciona: nao declara display', () => {
    // `display` aqui desmontava o flex do item de rail e de qualquer gatilho
    // que ja tivesse layout proprio.
    const regra = rule(componentsCss, '.tooltip-wrapper {');
    expect(regra).toContain('position: relative');
    expect(regra).not.toMatch(/display:/);
  });

  test('quem precisava do inline-block tem para onde ir', () => {
    expect(rule(componentsCss, '.tooltip-wrapper-inline')).toContain('display: inline-block');
  });

  test('aparece tambem no foco por teclado, nao so no hover', () => {
    // Sem :focus-within o tooltip nunca aparece para quem navega por teclado —
    // o mesmo defeito do atributo `title`, que a doc manda evitar POR ISSO.
    expect(componentsCss).toContain('.tooltip-wrapper:focus-within .tooltip');
    expect(componentsCss).toContain('.tooltip-wrapper:hover .tooltip');
  });

  test('o demo nao precisa mais do contorno local', () => {
    const demo = read('demos', 'electia-copiloto.html');
    expect(demo).not.toContain('.sidebar-item.tooltip-wrapper { display: flex; }');
  });

  test('a recomendacao do navigation.md virou verdadeira', () => {
    // Ela manda preferir este componente ao `title` porque `title` nao aparece
    // no foco. So passa a valer com a regra de :focus-within no lugar.
    const nav = read('docs', 'components', 'navigation.md');
    expect(nav).toContain('does not appear on keyboard focus');
    expect(componentsCss).toContain(':focus-within .tooltip');
  });
});

describe('Item 6 — tabela larga rola em vez de sumir', () => {
  test('.table-card deixou de cortar o conteudo', () => {
    const regra = rule(componentsCss, '.table-card {');
    expect(regra).toContain('overflow-x: auto');
    expect(regra).toContain('overflow-y: hidden');
    expect(regra).not.toMatch(/overflow:\s*hidden/);
  });

  test('existe o wrapper que mantem o cabecalho parado', () => {
    expect(rule(componentsCss, '.table-wrap')).toContain('overflow-x: auto');
  });

  test('segue o mesmo padrao que a camada .dl- ja usava', () => {
    const dataCards = read('components', 'data-cards.css');
    expect(rule(dataCards, '.dl-table-wrap')).toContain('overflow-x: auto');
  });
});

describe('Entrega', () => {
  test('as classes novas chegam ao bundle construido', () => {
    for (const cls of ['.tooltip-wrapper-inline', '.table-wrap', ':focus-within']) {
      expect(`${cls}: ${bundle.includes(cls)}`).toBe(`${cls}: true`);
    }
  });

  test('o bundle nao carrega mais o display no .tooltip-wrapper', () => {
    const m = bundle.match(/\.tooltip-wrapper\{[^}]*\}/);
    expect(m && m[0]).toBe('.tooltip-wrapper{position:relative}');
  });
});
