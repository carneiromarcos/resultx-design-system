# Header float — navbar flutuante de landing

Uma pílula sticky, afastada do topo e das bordas, em vidro forte. Para landing e site institucional. O app continua com `.header`, que ocupa a largura toda.

Promovido do protótipo da landing do Electia (#80) no lote P, em 05/10/2026. CSS em `components/header-float.css`; comportamento opcional em `dist/header-float.js`; demo em `demos/landing-kit.html`.

## Anatomia

```
.header-float-sentinel                faixa invisível no topo do <body>
header.header-float[data-header-float]  recuo + sticky
  .header-float-bar                   a pílula: grid marca · links · ações
    a.header-float-brand              marca (+ .header-float-brand-tag)
    nav.header-float-links            links centrais (somem abaixo de 1024 px)
    .header-float-actions
      .header-float-icon              botão redondo só com ícone (tema)
      .btn.btn-sm …                   CTAs (somem abaixo de 1024 px)
      .header-float-icon.header-float-menu   abre a .menu-drawer
```

## Markup

```html
<div class="header-float-sentinel" data-header-float-sentinel aria-hidden="true"></div>

<header class="header-float" data-header-float>
  <div class="header-float-bar">
    <a class="header-float-brand" href="#inicio" aria-label="electia by emprega+, início">
      <span class="brand-orb brand-orb-electia brand-orb-sm" aria-hidden="true"></span>
      <strong>electia</strong><span class="header-float-brand-tag">by emprega+</span>
    </a>
    <nav class="header-float-links" aria-label="Navegação principal">
      <a href="#plataforma">Plataforma</a>
      <a href="#duvidas">Dúvidas</a>
    </nav>
    <div class="header-float-actions">
      <a class="btn btn-ghost btn-sm" href="#login">Login</a>
      <a class="btn btn-primary btn-sm btn-sheen" href="#cta">Conheça</a>
      <a class="header-float-icon header-float-menu" id="menu-abrir" href="#menu"
         data-menu-drawer-toggle="menu" aria-label="Abrir menu"><span aria-hidden="true">☰</span></a>
    </div>
  </div>
</header>
<!-- a .menu-drawer vem aqui, IRMÃ do header (ver menu-drawer.md) -->

<script src="dist/header-float.js" defer></script>
```

A gaveta não pode ficar dentro do header: o `backdrop-filter` da pílula vira o bloco de contenção de um `position: fixed` descendente, e a gaveta ficaria presa na pílula.

A tipografia do nome (o wordmark) é da marca e fica na página. O DS cuida do layout, do selo e dos estados.

## Decisões de 05/10/2026

| Decisão | Como ficou |
|---|---|
| Vidro | `--glass-strong-bg` (0,92 no claro), não valor cru. Com o painel escuro do CTA passando por baixo, o vidro padrão (0,75) deixava o link a 4,27:1 |
| Sombra ao rolar | Sombra leve (`--elevation-1`) sempre. A de destaque (`--elevation-3`) mora num `::after` que só anima `opacity` e acende com `[data-scrolled]` |
| Sem scroll handler | `dist/header-float.js` observa a sentinela com `IntersectionObserver`. Se ela não existir, o script cria uma no início do `<body>` |
| 320 px | Abaixo de 360 px a pílula alarga (sobra lateral de `--space-2`), o respiro encolhe e o selo sai da vista. O nome acessível do link da marca (`aria-label`) continua com ele |

## Propriedades ajustáveis

| Propriedade | Padrão | Uso |
|---|---|---|
| `--header-float-top` | `--space-4` (`--space-3` abaixo de 1024 px) | distância do topo, sticky e inicial |
| `--header-float-gutter` | `--space-4` (`--space-2` abaixo de 360 px) | sobra lateral que define a largura |
| `--header-float-max` | `1400px` | largura máxima da pílula |

## Estados

| Peça | Hover | Foco | Pressão |
|---|---|---|---|
| Link central | fundo `--accent-primary-muted`, texto primário | anel do DS | fundo do accent a 22 % |
| Marca | opacidade 0,8 | anel do DS | opacidade 0,65 |
| `.header-float-icon` | borda e ícone no accent | anel do DS | `scale(0.94)` |

`aria-current` num link central o deixa em `--text-primary`.

## Responsivo

| Faixa | O que muda |
|---|---|
| ≥ 1024 px | grid de três colunas: marca, links, ações |
| < 1024 px | links e CTAs somem; aparece o botão de menu; ícones com 44 × 44 px |
| < 360 px | pílula mais larga, respiro menor, sem o selo |

Medido no Chrome em 05/10/2026 (demo e protótipo, claro e escuro): `scrollWidth` igual à largura em 320, 375, 768 e 1440. A pílula mede 302 px de 320 (sem estouro interno).

## Movimento

Só `opacity` (sombra e marca), `transform` (pressão do ícone) e cor. Sob `prefers-reduced-motion: reduce`, nenhuma transição.

## Contraste medido

| Par | Claro | Escuro |
|---|---|---|
| Link central sobre o vidro | 7,53:1 | 5,65:1 |
| Selo da marca | 7,53:1 | 5,65:1 |
