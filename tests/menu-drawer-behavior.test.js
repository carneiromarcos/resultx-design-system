/**
 * dist/menu-drawer.js — comportamento, num DOM mínimo (tests/lib/mini-dom.js)
 *
 * Achado do Revisor na #83: o foco de volta ia para document.activeElement
 * ou para o PRIMEIRO gatilho. Com dois gatilhos, clicar no segundo sem focá-lo
 * (Safari) e apertar Escape devolvia o foco ao primeiro. O invocador agora é
 * o event.currentTarget do clique; a API sem invocador tem um fallback
 * separado (quem tinha o foco, se estiver fora da gaveta; senão, o primeiro
 * gatilho).
 */

const { criarDocumento } = require('./lib/mini-dom');

function montar() {
  const dom = criarDocumento();
  const { doc, el } = dom;
  /* Dois gatilhos, ambos links de fallback (o script os troca por <button>),
     um botão qualquer fora da gaveta e a gaveta com Fechar e dois links. */
  doc.body.appendChild(el('a', { href: '#m', id: 'abrir-1', 'data-menu-drawer-toggle': 'm' }));
  doc.body.appendChild(el('button', { id: 'outro' }));
  doc.body.appendChild(
    el(
      'section',
      { id: 'm', 'aria-label': 'Menu', 'data-menu-drawer': '' },
      el('a', { href: '#abrir-1', id: 'fechar', 'data-menu-drawer-close': '' }),
      el('a', { href: '#a', id: 'link-a' }),
      el('a', { href: '#b', id: 'link-b' }),
    ),
  );
  doc.body.appendChild(el('a', { href: '#m', id: 'abrir-2', 'data-menu-drawer-toggle': 'm' }));
  const janela = dom.carregar('dist', 'menu-drawer.js');
  const q = (id) => doc.querySelector(`[id="${id}"]`);
  return { ...dom, api: janela.ResultXMenuDrawer, q, gaveta: q('m') };
}

describe('Gatilhos', () => {
  test('os dois links viram <button> com aria-controls e aria-expanded', () => {
    const { q } = montar();
    for (const id of ['abrir-1', 'abrir-2']) {
      expect(q(id).tagName).toBe('BUTTON');
      expect(q(id).hasAttribute('href')).toBe(false);
      expect(q(id).getAttribute('aria-controls')).toBe('m');
      expect(q(id).getAttribute('aria-expanded')).toBe('false');
    }
  });

  test('a gaveta vira diálogo modal', () => {
    const { gaveta } = montar();
    expect(gaveta.getAttribute('role')).toBe('dialog');
    expect(gaveta.getAttribute('aria-modal')).toBe('true');
  });
});

describe('Foco de volta vai para o gatilho que abriu', () => {
  test('clique no SEGUNDO sem foco (Safari) + Escape → foco no segundo', () => {
    const { doc, q, gaveta, tecla } = montar();
    expect(doc.activeElement).toBe(doc.body);
    q('abrir-2').click();
    expect(gaveta.hasAttribute('data-open')).toBe(true);
    expect(gaveta.contains(doc.activeElement)).toBe(true);
    expect(q('abrir-1').getAttribute('aria-expanded')).toBe('true');
    expect(q('abrir-2').getAttribute('aria-expanded')).toBe('true');

    tecla('Escape');
    expect(gaveta.hasAttribute('data-open')).toBe(false);
    expect(doc.activeElement).toBe(q('abrir-2'));
    expect(q('abrir-2').getAttribute('aria-expanded')).toBe('false');
  });

  test('clique no PRIMEIRO sem foco + Escape → foco no primeiro', () => {
    const { doc, q, tecla } = montar();
    q('abrir-1').click();
    tecla('Escape');
    expect(doc.activeElement).toBe(q('abrir-1'));
  });

  test('teclado: foco no segundo, ativa, Escape → volta ao segundo', () => {
    const { doc, q, tecla } = montar();
    q('abrir-2').focus();
    q('abrir-2').click(); /* Enter/Espaço num <button> = click */
    tecla('Escape');
    expect(doc.activeElement).toBe(q('abrir-2'));
  });

  test('o botão Fechar também devolve ao invocador', () => {
    const { doc, q } = montar();
    q('abrir-2').click();
    q('fechar').click();
    expect(doc.activeElement).toBe(q('abrir-2'));
  });

  test('escolher um link da gaveta fecha sem puxar o foco de volta ao gatilho', () => {
    // A gaveta fica inerte, então o foco sai do link (cai no <body>, como no
    // navegador) e a navegação até a âncora leva o ponto de partida do Tab.
    const { doc, q, gaveta } = montar();
    q('abrir-2').click();
    q('link-b').focus();
    q('link-b').click();
    expect(gaveta.hasAttribute('data-open')).toBe(false);
    expect(doc.activeElement).not.toBe(q('abrir-2'));
    expect(gaveta.contains(doc.activeElement)).toBe(false);
  });
});

describe('API programática (sem invocador)', () => {
  test('volta para quem tinha o foco, se ele estiver fora da gaveta', () => {
    const { doc, q, api, gaveta } = montar();
    q('outro').focus();
    api.open(gaveta);
    api.close(gaveta);
    expect(doc.activeElement).toBe(q('outro'));
  });

  test('sem foco útil (body), volta para o primeiro gatilho', () => {
    const { doc, q, api, gaveta } = montar();
    api.open(gaveta);
    api.close(gaveta);
    expect(doc.activeElement).toBe(q('abrir-1'));
  });

  test('invocador explícito na API é respeitado', () => {
    const { doc, q, api, gaveta } = montar();
    api.open(gaveta, q('abrir-2'));
    api.close(gaveta);
    expect(doc.activeElement).toBe(q('abrir-2'));
  });
});

describe('Foco preso e trava de rolagem', () => {
  test('Tab no último volta ao primeiro; Shift+Tab no primeiro vai ao último', () => {
    const { doc, q, tecla } = montar();
    q('abrir-2').click();
    expect(doc.activeElement).toBe(q('fechar'));
    q('link-b').focus();
    tecla('Tab');
    expect(doc.activeElement).toBe(q('fechar'));
    tecla('Tab', { shiftKey: true });
    expect(doc.activeElement).toBe(q('link-b'));
  });

  test('o overflow do <html> trava ao abrir e volta ao valor anterior', () => {
    const { doc, q, tecla } = montar();
    doc.documentElement.style.overflow = 'clip';
    q('abrir-1').click();
    expect(doc.documentElement.style.overflow).toBe('hidden');
    tecla('Escape');
    expect(doc.documentElement.style.overflow).toBe('clip');
  });
});

describe('Inerte enquanto fechada (inclusive durante a saída de 280 ms)', () => {
  test('nasce inerte quando o script assume a gaveta fechada', () => {
    const { gaveta } = montar();
    expect(gaveta.hasAttribute('inert')).toBe(true);
  });

  test('abrir tira o inert ANTES de focar: o foco entra', () => {
    const { doc, q, gaveta } = montar();
    q('abrir-1').click();
    expect(gaveta.hasAttribute('inert')).toBe(false);
    expect(doc.activeElement).toBe(q('fechar'));
  });

  test('Escape põe inert na hora: nada dentro recebe foco logo depois', () => {
    const { doc, q, gaveta, tecla } = montar();
    q('abrir-2').click();
    tecla('Escape');
    expect(gaveta.hasAttribute('inert')).toBe(true);
    expect(doc.activeElement).toBe(q('abrir-2'));
    for (const id of ['fechar', 'link-a', 'link-b']) {
      q(id).focus();
      expect(doc.activeElement).toBe(q('abrir-2'));
    }
  });

  test('fechar pelo botão, pelo véu e pela API também deixa inerte', () => {
    const { doc, q, gaveta, api } = montar();
    q('abrir-1').click();
    q('fechar').click();
    expect(gaveta.hasAttribute('inert')).toBe(true);
    q('abrir-1').click();
    gaveta.nextElementSibling.click(); /* o véu criado pelo script */
    expect(gaveta.hasAttribute('inert')).toBe(true);
    api.open(gaveta);
    api.close(gaveta);
    expect(gaveta.hasAttribute('inert')).toBe(true);
    expect(gaveta.contains(doc.activeElement)).toBe(false);
  });

  test('reabrir depois de fechar funciona (inert sai de novo)', () => {
    const { doc, q, gaveta, tecla } = montar();
    q('abrir-1').click();
    tecla('Escape');
    q('abrir-1').click();
    expect(gaveta.hasAttribute('inert')).toBe(false);
    expect(gaveta.contains(doc.activeElement)).toBe(true);
  });
});
