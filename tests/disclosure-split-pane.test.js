/**
 * Disclosure + Split pane — contract tests
 *
 * O comportamento em si foi verificado em Chrome real (arraste, teclado,
 * limites, persistência, empilhamento em 768px). Estes testes guardam o
 * contrato que faz aquele comportamento continuar valendo:
 *
 * 1. Os arquivos entram no bundle — um componente que não é publicado não existe
 * 2. O split pane deriva tudo de uma variável só (a regra que ele existe para impor)
 * 3. O disclosure fica sobre <details>, de onde vêm papel, teclado e ARIA
 * 4. Os scripts seguem a convenção de armazenamento e de namespace do DS
 * 5. Nenhum dos dois traz cor literal — tudo por token
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf-8');

const disclosureCss = read('components', 'disclosure.css');
const splitPaneCss = read('components', 'split-pane.css');
const componentsCss = read('components', 'components.css');
const disclosureJs = read('dist', 'disclosure.js');
const splitPaneJs = read('dist', 'split-pane.js');
const tokensCss = read('tokens', 'tokens.css');
const pkg = JSON.parse(read('package.json'));

describe('Entrega — os componentes chegam ao consumidor', () => {
  test('components.css importa os dois com a notacao url()', () => {
    // url() nao e preferencia: o stylelint do repo reprova a forma nua.
    expect(componentsCss).toContain("@import url('./disclosure.css')");
    expect(componentsCss).toContain("@import url('./split-pane.css')");
  });

  test('o bundle construido contem as classes dos dois', () => {
    const bundle = read('dist', 'components.min.css');
    for (const cls of [
      '.disclosure-summary',
      '.disclosure-panel',
      '.split-pane-handle',
      '.split-pane-side',
    ]) {
      expect(bundle).toContain(cls);
    }
  });

  test('os scripts sao alcancaveis pelo mapa de exports', () => {
    expect(pkg.exports['./disclosure']).toBe('./dist/disclosure.js');
    expect(pkg.exports['./split-pane']).toBe('./dist/split-pane.js');
  });

  test('dist/ esta em files[], entao os scripts sao publicados', () => {
    expect(pkg.files).toContain('dist/');
  });
});

describe('Split pane — uma largura, nunca duas', () => {
  test('toda coluna da grade deriva de --split-pane-width', () => {
    const grades = (splitPaneCss.match(/grid-template-columns:[^;]+;/g) || []).filter((g) =>
      g.includes('var(')
    );
    expect(grades.length).toBeGreaterThan(0);
    for (const linha of grades) {
      expect(linha).toContain('--split-pane-width');
    }
  });

  test('o script escreve apenas --split-pane-width, nunca uma largura solta', () => {
    // Um segundo numero de largura e como nasce a divergencia — foi
    // exatamente o vao morto de 192px do Electia.
    expect(splitPaneJs).toContain("var WIDTH_VAR = '--split-pane-width'");
    const escritas = (splitPaneJs.match(/setProperty\([^)]*\)/g) || []).filter((s) =>
      /width/i.test(s)
    );
    expect(escritas).toEqual(["setProperty(WIDTH_VAR, next + 'px')"]);
  });

  test('os limites vem do CSS, nao de constantes no script', () => {
    expect(splitPaneJs).toContain("'--split-pane-min'");
    expect(splitPaneJs).toContain("'--split-pane-max'");
    expect(splitPaneCss).toContain('--split-pane-min:');
    expect(splitPaneCss).toContain('--split-pane-max:');
  });

  test('a alca e um separador operavel por teclado', () => {
    expect(splitPaneJs).toContain("setAttribute('role', 'separator')");
    expect(splitPaneJs).toContain("setAttribute('aria-orientation', 'vertical')");
    expect(splitPaneJs).toContain("'tabindex'");
    expect(splitPaneJs).toContain('aria-valuenow');
    for (const tecla of ['ArrowLeft', 'ArrowRight', 'Home', 'End']) {
      expect(splitPaneJs).toContain(tecla);
    }
  });

  test('em tela estreita empilha em vez de esconder o painel', () => {
    // Esconder sem substituto leva junto as acoes da conversa.
    const corte = splitPaneCss.indexOf('@media (max-width: 1024px)');
    expect(corte).toBeGreaterThan(-1);
    const estreito = splitPaneCss.slice(corte);
    expect(estreito).toContain('.split-pane-handle { display: none; }');
    expect(estreito).not.toMatch(/\.split-pane-side\s*\{[^}]*display:\s*none/);
  });

  test('touch-action: none — sem isso o navegador rola em vez de arrastar', () => {
    expect(splitPaneCss).toContain('touch-action: none');
  });
});

describe('Disclosure — sobre <details>, nao sobre <div>', () => {
  test('o CSS mira o elemento nativo', () => {
    expect(disclosureCss).toContain('.disclosure[open]');
    expect(disclosureCss).toContain('::-webkit-details-marker');
    expect(disclosureCss).toContain('.disclosure-summary::marker');
  });

  test('sem JS ainda abre — o estado nativo basta', () => {
    expect(disclosureCss).toContain(
      '.disclosure[open] .disclosure-panel { grid-template-rows: 1fr; }'
    );
  });

  test('a transicao so entra depois que o script assume', () => {
    // Antes disso, animar seria animar algo que o navegador ja escondeu.
    expect(disclosureCss).toContain('.disclosure[data-disclosure-ready] .disclosure-panel');
  });

  test('o script le a duracao do token em vez de repetir o numero', () => {
    expect(disclosureJs).toContain("getPropertyValue('--disclosure-duration')");
    expect(tokensCss).toContain('--disclosure-duration:');
  });

  test('o alvo de toque do cabecalho respeita a WCAG 2.2', () => {
    expect(disclosureCss).toContain('min-height: 44px');
  });

  test('respeita prefers-reduced-motion no CSS e no script', () => {
    expect(disclosureCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(disclosureJs).toContain('prefers-reduced-motion: reduce');
  });
});

describe('Convencoes do DS', () => {
  test('as chaves de armazenamento seguem o prefixo resultx-', () => {
    expect(disclosureJs).toContain("'resultx-disclosure:'");
    expect(splitPaneJs).toContain("'resultx-split-pane:'");
  });

  test('o acesso ao localStorage e protegido — modo privado nao derruba nada', () => {
    for (const js of [disclosureJs, splitPaneJs]) {
      const acessos = (js.match(/localStorage\.(setItem|getItem|removeItem)/g) || []).length;
      const protecoes = (js.match(/try \{/g) || []).length;
      expect(acessos).toBeGreaterThan(0);
      expect(protecoes).toBeGreaterThanOrEqual(2);
    }
  });

  test('expoem um namespace global, como o theme-toggle', () => {
    expect(disclosureJs).toContain('window.ResultXDisclosure');
    expect(splitPaneJs).toContain('window.ResultXSplitPane');
  });

  test('nenhuma cor literal — tudo por token', () => {
    for (const css of [disclosureCss, splitPaneCss]) {
      expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(css).not.toMatch(/\brgba?\(/);
    }
  });
});
