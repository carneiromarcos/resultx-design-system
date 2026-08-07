/**
 * Message + Audio player + Composer + Sidebar rail — contract tests
 *
 * Verificado em Chrome real antes destes testes: rail de 64px com o conteúdo
 * deslocado exatamente 64px e o rótulo fora da vista mas ainda presente no nome
 * acessível ("link Atendimento"); player trocando o <audio controls> pela
 * interface própria; bolhas a 16px de cada lado correto; composer indo de 36px
 * a 117px e voltando. Estes testes guardam o que sustenta aquilo.
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

const messageCss = read('components', 'message.css');
const audioCss = read('components', 'audio-player.css');
const composerCss = read('components', 'composer.css');
const componentsCss = read('components', 'components.css');
const audioJs = read('dist', 'audio-player.js');
const composerJs = read('dist', 'composer.js');
const pkg = JSON.parse(read('package.json'));

describe('Entrega', () => {
  test('components.css importa os tres arquivos novos', () => {
    for (const nome of ['message', 'audio-player', 'composer']) {
      expect(componentsCss).toContain(`@import url('./${nome}.css')`);
    }
  });

  test('as classes chegam ao bundle construido', () => {
    const bundle = read('dist', 'components.min.css');
    for (const cls of [
      '.message-bubble',
      '.message-event',
      '.audio-wave',
      '.composer-input',
      '.sidebar-rail',
      '.main-rail',
    ]) {
      expect(bundle).toContain(cls);
    }
  });

  test('os scripts sao alcancaveis pelo mapa de exports', () => {
    expect(pkg.exports['./audio-player']).toBe('./dist/audio-player.js');
    expect(pkg.exports['./composer']).toBe('./dist/composer.js');
  });
});

describe('Message — fala, evento e marco sao coisas diferentes', () => {
  test('a bolha tem medida de leitura, nao a largura da coluna', () => {
    expect(rule(messageCss, '.message-bubble {')).toContain('max-width: min(60ch, 78%)');
  });

  test('texto longo sem espacos nao estoura a bolha', () => {
    expect(rule(messageCss, '.message-text {')).toContain('overflow-wrap: anywhere');
  });

  test('o evento de sistema tem as duas linhas laterais', () => {
    expect(messageCss).toContain('.message-event::before');
    expect(messageCss).toContain('.message-event::after');
  });

  test('a saida inverte o lado sem duplicar a bolha', () => {
    expect(rule(messageCss, '.message-out {')).toContain('align-items: flex-end');
  });

  test('a hora usa numeros de largura fixa', () => {
    expect(rule(messageCss, '.message-time {')).toContain('font-variant-numeric: tabular-nums');
  });
});

describe('Audio player — o som toca mesmo sem o script', () => {
  test('a interface propria so aparece depois de o script assumir', () => {
    expect(audioCss).toContain('.audio-player:not([data-audio-ready]) > .audio-play');
    expect(audioCss).toContain('.audio-player[data-audio-ready] > .audio-native');
  });

  test('a troca de interface vem DEPOIS das definicoes base na cascata', () => {
    // Invertido, o seletor mais especifico perderia e o player nativo ficaria
    // visivel junto com o customizado.
    expect(audioCss.indexOf('.audio-play {')).toBeLessThan(
      audioCss.indexOf('.audio-player:not([data-audio-ready])')
    );
  });

  test('o script tira o controls do nativo em vez de esconde-lo por CSS', () => {
    expect(audioJs).toContain("removeAttribute('controls')");
  });

  test('a onda e um slider operavel por teclado', () => {
    expect(audioJs).toContain("setAttribute('role', 'slider')");
    expect(audioJs).toContain('aria-valuetext');
    for (const tecla of ['ArrowLeft', 'ArrowRight', 'Home', 'End']) {
      expect(audioJs).toContain(tecla);
    }
  });

  test('dois audios nao tocam ao mesmo tempo', () => {
    expect(audioJs).toContain("querySelectorAll('[data-audio-player]')");
  });

  test('a altura da barra vem de --level, com piso', () => {
    const regra = rule(audioCss, '.audio-bar {');
    expect(regra).toContain('var(--level');
    expect(regra).toContain('12%');
  });

  test('o botao respeita o alvo de toque da WCAG 2.2', () => {
    expect(rule(audioCss, '.audio-play {')).toContain('width: 44px');
  });
});

describe('Composer — cresce, e nada alem disso', () => {
  test('usa field-sizing quando o navegador tem', () => {
    expect(rule(composerCss, '.composer-input {')).toContain('field-sizing: content');
  });

  test('o script sai do caminho quando o nativo existe', () => {
    expect(composerJs).toContain("CSS.supports('field-sizing', 'content')");
    expect(composerJs).toContain('if (supportsNative) return;');
  });

  test('zera a altura antes de medir — senao o campo so cresce', () => {
    expect(composerJs).toContain("input.style.height = 'auto'");
  });

  test('o teto e em linhas, nao em pixels', () => {
    expect(rule(composerCss, '.composer-input {')).toContain(
      'max-height: calc(var(--leading-normal) * 6em)'
    );
  });

  test('o anel de foco e da barra inteira, nao do campo nu', () => {
    expect(composerCss).toContain('.composer:focus-within');
  });

  test('nao decide politica de produto: sem Enter-para-enviar no script', () => {
    // Enter, "/" e "@" sao regra do produto. Se aparecerem aqui, o DS passou a
    // decidir o que nao e dele.
    expect(composerJs).not.toContain('keydown');
  });
});

describe('Sidebar rail — segundo modo de navegacao', () => {
  test('usa o token --sidebar-collapsed, que ate agora era orfao', () => {
    expect(rule(componentsCss, '.sidebar-rail {')).toContain('var(--sidebar-collapsed)');
  });

  test('largura da navegacao e deslocamento do conteudo saem do MESMO token', () => {
    // Dois numeros diferentes aqui sao como nasceu o vao morto de 192px.
    expect(rule(componentsCss, '.main-rail {')).toContain('var(--sidebar-collapsed)');
  });

  test('o rotulo sai da vista sem sair da arvore de acessibilidade', () => {
    // display: none apagaria o nome do item, e o leitor de tela anunciaria
    // "link" e nada mais.
    const regra = rule(componentsCss, '.sidebar-rail .sidebar-label');
    expect(regra).toContain('clip-path: inset(50%)');
    expect(regra).not.toMatch(/display:\s*none/);
  });

  test('reaproveita .sidebar-item em vez de criar um item paralelo', () => {
    expect(componentsCss).toContain('.sidebar-rail .sidebar-item');
    expect(componentsCss).not.toMatch(/^\.nav-rail/m);
  });
});

describe('Convencoes do DS', () => {
  test('nenhuma cor literal nos tres arquivos novos', () => {
    for (const css of [messageCss, audioCss, composerCss]) {
      expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(css).not.toMatch(/\brgba?\(/);
    }
  });

  test('os dois com movimento respeitam prefers-reduced-motion', () => {
    for (const css of [audioCss, composerCss]) {
      expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    }
  });

  test('os scripts expoem namespace global, como o theme-toggle', () => {
    expect(audioJs).toContain('window.ResultXAudioPlayer');
    expect(composerJs).toContain('window.ResultXComposer');
  });

  test('nenhum dos dois persiste nada — nao ha o que lembrar', () => {
    expect(audioJs).not.toContain('localStorage');
    expect(composerJs).not.toContain('localStorage');
  });
});
