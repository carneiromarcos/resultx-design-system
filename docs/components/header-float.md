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
| Link central | texto de `--header-float-ink-muted` para `--text-primary`, fundo `--accent-primary-muted` | anel do DS | texto `--text-primary`, fundo do accent a 22 % |
| Marca | sublinhado de 2 px na tinta do accent | anel do DS | desce 1 px (`translateY`) |
| `.header-float-icon` | borda no accent, ícone em `--accent-primary-text` | anel do DS | `scale(0.94)` |

`aria-current` num link central o deixa em `--text-primary`.

Duas garantias diferentes, cada uma com seu teste:

- **A marca não muda a cor nem a opacidade do texto em estado nenhum** (repouso, hover, active, focus-visible). O feedback é o sublinhado e o deslocamento. O protótipo usava opacidade 0,8 e 0,65 na marca, e o selo de 12 px caía a 3,15:1 sobre o vidro escuro (achado do Revisor na #83). Trava: `tests/header-float.test.js`, que verifica, por estado da marca, a ausência de `opacity` e de troca de `color`, o sublinhado no hover e o `translateY` no active.
- **Nenhum elemento com texto fica translúcido**, em todos os componentes do lote P. Os links centrais **mudam de cor** de propósito (vão para `--text-primary` no hover, no active e com `aria-current`), mas nunca de opacidade. Trava: `tests/lote-p.test.js`, que só aceita `opacity: 1`, ou `0` junto de `visibility: hidden`, fora de pseudo-elementos decorativos. Esse teste trava opacidade, não cor.

A cor de cada estado é garantida por medição, não por teste: ver "Contraste medido" abaixo.

## Responsivo

| Faixa | O que muda |
|---|---|
| ≥ 1024 px | grid de três colunas: marca, links, ações |
| < 1024 px | links e CTAs somem; aparece o botão de menu; ícones com 44 × 44 px |
| < 360 px | pílula mais larga, respiro menor, sem o selo |

Medido no Chrome em 05/10/2026 (demo e protótipo, claro e escuro): `scrollWidth` igual à largura em 320, 375, 768 e 1440. A pílula mede 302 px de 320 (sem estouro interno).

## Movimento

| Peça | O que se move | Como |
|---|---|---|
| Sombra de destaque (`::after`) | `opacity` | 0 → 1 com `[data-scrolled]` |
| Marca | sublinhado no hover; desce 1 px no active | transição de `text-decoration-color` e `transform: translateY(1px)` |
| Link central | cor e fundo | transição de `color` e `background-color` |
| `.header-float-icon` | cor, borda e pressão | transição de `color` e `border-color`; `transform: scale(0.94)` no active |

Nada anima layout. Sob `prefers-reduced-motion: reduce` nenhuma transição roda, e as duas pressões (`translateY` da marca e `scale` do ícone) ficam em `transform: none`. O sublinhado do hover continua: é um estado, não um movimento.

## Contraste medido

O vidro é translúcido, então o fundo do texto depende do que passa por baixo. A medição compõe o vidro (e o fundo do próprio link no hover e na pressão) sobre **cada cor de fundo opaca da página** e guarda o pior caso. O texto secundário da pílula usa `--header-float-ink-muted`, que é `--text-secondary` puxado 30 % para `--text-primary`. Com `--text-secondary` puro, o selo de 12 px caía a 4,14:1 no escuro com o botão teal do DS sob a pílula.

Pior caso medido no Chrome (05/10, revisão da #83), em repouso, hover, active e focus-visible:

| Texto | Claro | Escuro |
|---|---|---|
| Selo da marca (12 px), demo / Electia | 8,71:1 / 8,71:1 | 5,67:1 / 7,05:1 |
| Link central, repouso e foco | 8,71:1 | 5,67:1 (demo), 7,05:1 (Electia) |
| Link central, hover | 12,55:1 ou mais | 7,83:1 ou mais |
| Link central, pressão | 10,71:1 ou mais | 6,71:1 ou mais |

Sobre o fundo da página (sem nada passando por baixo), link e selo dão 10,24:1 no claro e 7,72:1 no escuro.
