# Menu drawer — gaveta de menu

A gaveta lateral que leva a navegação de uma landing para o celular: seções rotuladas, links de 48 px e os CTAs em largura total no pé.

Lote P, 05/10/2026. CSS em `components/menu-drawer.css`; comportamento em `dist/menu-drawer.js`; demo em `demos/landing-kit.html`.

**Decisão do Marcos: componente próprio, não uma variação de `.sidebar-overlay`.** Aquele é a navegação do app (rail, painel, grupos). Esta é o menu de uma página, abre por um botão do `.header-float` e fecha quando a pessoa escolhe um destino.

## Anatomia

```
section.menu-drawer#id[data-menu-drawer]   o painel (irmão do header)
  .menu-drawer-head                       cabeçalho fixo: rótulo + Fechar
    .menu-drawer-label
    .menu-drawer-close[data-menu-drawer-close]
  .menu-drawer-body                       a única parte que rola
    nav.menu-drawer-nav                   links (alvo de 48 px)
    .menu-drawer-actions                  rótulo + CTAs em largura total
.menu-drawer-scrim[data-menu-drawer-scrim]  o véu, logo depois do painel
```

## Markup

```html
<!-- no header: o botão é um LINK para a gaveta -->
<a class="header-float-icon header-float-menu" id="menu-abrir" href="#menu"
   data-menu-drawer-toggle="menu" aria-label="Abrir menu"><span aria-hidden="true">☰</span></a>

<!-- depois do header -->
<section class="menu-drawer" id="menu" aria-label="Menu" data-menu-drawer
         data-menu-drawer-media="(max-width: 1023.98px)">
  <div class="menu-drawer-head">
    <span class="menu-drawer-label">Navegue</span>
    <a class="menu-drawer-close" href="#menu-abrir" data-menu-drawer-close
       aria-label="Fechar menu"><span aria-hidden="true">✕</span></a>
  </div>
  <div class="menu-drawer-body">
    <nav class="menu-drawer-nav" aria-label="Navegação principal (móvel)">
      <a href="#plataforma">Plataforma</a>
      <a href="#duvidas">Dúvidas</a>
    </nav>
    <div class="menu-drawer-actions">
      <span class="menu-drawer-label">Conta</span>
      <a class="btn btn-ghost" href="#login">Login</a>
      <a class="btn btn-primary" href="#cta">Conheça</a>
    </div>
  </div>
</section>
<div class="menu-drawer-scrim" data-menu-drawer-scrim></div>

<script src="dist/menu-drawer.js" defer></script>
```

## Com o script

| Comportamento | Detalhe |
|---|---|
| Papel | a gaveta vira `role="dialog"` com `aria-modal="true"`; o nome vem do `aria-label` da `<section>` |
| Botão | o link vira `<button type="button">` (id, classes, `aria-label` e filhos vão junto) com `aria-controls` e `aria-expanded` |
| Abrir | foco no primeiro item, no mesmo quadro. O CSS vira a visibilidade na hora ao abrir para isso |
| Foco preso | Tab e Shift+Tab circulam só dentro da gaveta |
| Fechar | Escape, o botão Fechar ou o véu. O foco volta ao **gatilho que abriu** (`event.currentTarget` do clique), não a `document.activeElement`: no Safari o clique não foca o botão, e com dois gatilhos o foco voltaria ao errado (achado do Revisor na #83). Pela API, `open(el, invocador)` aceita o invocador; sem ele, volta a quem tinha o foco (se fora da gaveta) ou ao primeiro gatilho |
| Escolher um link | fecha sem puxar o foco de volta ao gatilho; a navegação leva o ponto de partida do Tab até a âncora |
| Inerte | fechada, a gaveta tem `[inert]`, posto **no início** do fechamento. O CSS a mantém visível durante a saída de 280 ms; o `inert` a tira da ordem do Tab e da árvore de acessibilidade nesse intervalo. Sai ao abrir, antes de o foco entrar. Só o script põe o atributo, então o `:target` sem JS não é afetado |
| Fundo | a rolagem do `<html>` trava enquanto a gaveta está aberta e volta ao valor anterior, não a vazio |
| Janela cresce | com `data-menu-drawer-media`, a gaveta fecha quando a consulta deixa de valer |
| Evento | `menudrawertoggle` com `detail.open` |
| API | `ResultXMenuDrawer.init(root)`, `.open(el[, invocador])`, `.close(el)`, `.toggle(el[, invocador])` |

## Sem o script

O botão é um link real para `#menu`, e `.menu-drawer:target` abre a gaveta. O Fechar é um link de volta para o botão, e qualquer link da gaveta troca o alvo e a fecha. Não há foco preso nem trava de rolagem, mas a navegação continua alcançável. Quando o script assume, ele marca `[data-menu-drawer-ready]` e o `:target` deixa de valer, inclusive se a página carregou com `#menu` no endereço.

Medido no Chrome com JavaScript desligado (375 px): abrir pelo botão deixa a gaveta `visible`, e o Fechar a devolve a `hidden`.

## Corpo rolável

Só `.menu-drawer-body` rola (`overflow-y: auto`, `overscroll-behavior: contain`). O cabeçalho fica parado, então o Fechar continua à vista. A gaveta respeita `env(safe-area-inset-top)` e `env(safe-area-inset-bottom)` e nunca passa de `100dvh`.

Medido no Chrome em 05/10/2026, claro e escuro:

| Viewport | Corpo (rolagem / visível) | Fechar visível | Último CTA alcançável | Foco preso (25 Tab + 25 Shift+Tab) | Escape devolve o foco |
|---|---|---|---|---|---|
| 667 × 375 | 398 / 299 px (demo), 446 / 299 px (Electia) | sim | sim | sim | sim |
| 320 × 320 | 398 / 244 px (demo), 446 / 244 px (Electia) | sim | sim | sim | sim |

## Estados

| Peça | Hover | Foco | Pressão |
|---|---|---|---|
| `.menu-drawer-close` | borda e ícone no accent | anel do DS | `scale(0.94)` |
| Link de navegação | texto no accent | anel do DS | desliza `--space-1` |

`aria-current` num link o deixa na tinta do accent. Os rótulos usam `--text-secondary` (7,56:1 no claro, 6,28:1 no escuro). O `--text-muted` escuro não passa AA para texto deste tamanho.

## Movimento

A gaveta desliza com `transform` (280 ms, `--spring-smooth`), e o véu muda só `opacity`. Sob `prefers-reduced-motion: reduce` nada transiciona, nem os descendentes. A regra global de reduced-motion do DS põe 0,01 ms em tudo, e um descendente com `transition-property: all` (o padrão) passaria a transicionar a visibilidade herdada. No quadro de abertura o Fechar ainda estaria `hidden` e o foco falharia em silêncio, defeito encontrado e corrigido nesta validação. O script também tenta de novo no quadro seguinte, para páginas com uma regra global parecida.

## Propriedades ajustáveis

| Propriedade | Padrão |
|---|---|
| `--menu-drawer-width` | `320px` (no máximo 86vw) |
| `--menu-drawer-duration` | `280ms` |
