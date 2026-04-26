# Data Layer Components

10 componentes essenciais para dashboards e visualização de dados, introduzidos no DS **v2.1.0**. Prefixo CSS: `.dl-*` (data-layer).

**Source:** [`components/data-cards.css`](../../components/data-cards.css)
**Import:** `import 'resultx-design-system/components/data-cards'`
**Preview ao vivo:** [`tokens/themes/preview.html`](../../tokens/themes/preview.html)

---

## Índice

1. [StatCard](#1-statcard)
2. [Coin](#2-coin)
3. [Delta](#3-delta-pill)
4. [Chart](#4-chart-shell)
5. [Donut](#5-donut)
6. [Table](#6-compact-data-table)
7. [Sparkline](#7-sparkline)
8. [AvatarStack](#8-avatar-stack)
9. [StatusPill](#9-status-pill)
10. [TooltipCallout](#10-tooltip-callout)

---

## 1. StatCard

Bloco de métrica com header, valor grande e footer opcional.

```html
<article class="dl-statcard">
  <header class="dl-statcard-header">
    <span class="dl-statcard-label">Total Profit</span>
    <div class="dl-coin dl-coin--green dl-coin--sm">$</div>
  </header>
  <div class="dl-statcard-value">$8.55M</div>
  <footer class="dl-statcard-footer">
    <span class="dl-delta dl-delta--positive">↑ 79.21%</span>
    <span class="dl-statcard-compare">vs último mês</span>
  </footer>
</article>
```

**Variants:** `.dl-statcard--with-spark` quando integrar Sparkline inline.

---

## 2. Coin

Ícone arredondado com fill gradient ou neutral. 11 variants (5 gradient + 5 soft + neutral).

```html
<div class="dl-coin dl-coin--cyan">
  <svg>...</svg>
</div>
```

**Cores gradient:** `--cyan`, `--magenta`, `--green`, `--amber`, `--purple`
**Cores soft (background tint):** `--soft-cyan`, `--soft-magenta`, `--soft-green`, `--soft-amber`, `--soft-purple`
**Neutral:** `--neutral` (usa accent-primary do theme)
**Tamanhos:** `--sm` (32px), default md (40px), `--lg` (48px)

---

## 3. Delta pill

Pílula direcional pra mudanças percentuais.

```html
<span class="dl-delta dl-delta--positive">↑ 12.4%</span>
<span class="dl-delta dl-delta--negative">↓ 3.2%</span>
<span class="dl-delta dl-delta--neutral">— estável</span>
```

Cores semânticas vêm dos tokens `--delta-positive-fg/bg`, `--delta-negative-fg/bg`, `--delta-neutral-fg/bg` definidos por theme.

---

## 4. Chart shell

Container para line/area chart com SVG inline.

```html
<div class="dl-chart">
  <header class="dl-chart-header">
    <h3 class="dl-chart-title">Overviews</h3>
    <div class="dl-chart-meta">1,121 <span class="dl-delta dl-delta--positive">↑ 30.2%</span></div>
  </header>
  <div class="dl-chart-canvas">
    <svg class="dl-chart-svg" viewBox="0 0 320 140" preserveAspectRatio="none">
      <defs>
        <linearGradient id="dl-chart-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stop-color="var(--chart-line)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--chart-line)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <g class="dl-chart-grid">
        <line x1="0" x2="320" y1="40" y2="40"/>
      </g>
      <path d="M 0 100 L 53 90 ..." fill="url('#dl-chart-gradient')"/>
      <path d="M 0 100 L 53 90 ..." class="dl-chart-line"/>
      <circle cx="213" cy="30" r="6" class="dl-chart-point dl-chart-point--active"/>
    </svg>
    <div class="dl-tooltip-callout" style="left:66.5%; top:21%">
      <span class="dl-tooltip-value">242</span>
      <span class="dl-tooltip-label">Applicant</span>
    </div>
  </div>
</div>
```

**Helpers SVG:** `.dl-chart-line`, `.dl-chart-area`, `.dl-chart-grid line`, `.dl-chart-axis-label`, `.dl-chart-point`, `.dl-chart-point--active`.

---

## 5. Donut

Donut com conic-gradient + valor central + legenda categórica opcional.

```html
<div class="dl-donut" style="
     --donut-seg-1: 47%;
     --donut-seg-2: 67%;
     --donut-seg-3: 80%;">
  <div class="dl-donut-track"></div>
  <div class="dl-donut-inner">
    <div class="dl-donut-value">121</div>
    <div class="dl-donut-label">Total Emp.</div>
  </div>
</div>

<div class="dl-donut-legend">
  <div class="dl-donut-legend-item">
    <span class="dl-donut-legend-dot" style="background:var(--grad-cyan-end)"></span>
    <span class="dl-donut-legend-count">14</span> UI Designer
  </div>
  <div class="dl-donut-legend-item">
    <span class="dl-donut-legend-dot" style="background:var(--grad-purple-end)"></span>
    <span class="dl-donut-legend-count">27</span> Marketing
  </div>
</div>
```

**Tamanhos:** `--sm` (96px), default md (140px), `--lg` (200px)
**Segmentos:** customizáveis via `--donut-seg-1/2/3` inline (cumulativo, em %).

---

## 6. Compact data table

Tabela densa com header semântico.

```html
<div class="dl-table-wrap">
  <table class="dl-table">
    <thead>
      <tr><th>Task Name</th><th>Team</th><th>Status</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="dl-table-primary">Process New Hire Paperwork</div>
          <div class="dl-table-secondary">Assigned by HR Manager</div>
        </td>
        <td><!-- AvatarStack --></td>
        <td><span class="dl-status dl-status--in-progress">In Progress</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 7. Sparkline

Micro CSS bar chart inline.

```html
<div class="dl-sparkline" aria-label="Trend last 7 days">
  <span class="dl-sparkline-bar" style="--h:30%"></span>
  <span class="dl-sparkline-bar" style="--h:60%"></span>
  <span class="dl-sparkline-bar" style="--h:45%"></span>
  <span class="dl-sparkline-bar" style="--h:80%"></span>
  <span class="dl-sparkline-bar dl-sparkline-bar--active" style="--h:95%"></span>
</div>
```

**Variants:** `.dl-sparkline--positive` (verde), `.dl-sparkline--negative` (amber), `.dl-sparkline--lg` (40px height).

---

## 8. Avatar stack

Avatares overlapping com `+N` more.

```html
<div class="dl-avatar-stack">
  <div class="dl-avatar"><img src="..." alt="Lamine"></div>
  <div class="dl-avatar"><img src="..." alt="Nico"></div>
  <div class="dl-avatar dl-avatar--more">+2</div>
</div>

<!-- Com label -->
<div class="dl-avatar-stack">
  <div class="dl-avatar">...</div>
  <span class="dl-avatar-stack-label">& 2 outros</span>
</div>
```

**Tamanhos:** `--sm` (22px), default (28px), `--lg` (36px).

---

## 9. Status pill

Pílula semântica com 5 variants pré-definidas.

```html
<span class="dl-status dl-status--in-progress">Em andamento</span>
<span class="dl-status dl-status--done">Concluído</span>
<span class="dl-status dl-status--need-review">Em revisão</span>
<span class="dl-status dl-status--pending">Pendente</span>
<span class="dl-status dl-status--blocked">Bloqueado</span>
```

Cada variant inclui um dot colorido via `::before`.

---

## 10. Tooltip callout

Tooltip flutuante para data points em charts.

```html
<!-- Posicionado via inline style left/top, geralmente dentro de .dl-chart-canvas -->
<div class="dl-tooltip-callout" style="left:62%; top:30%">
  <span class="dl-tooltip-value">242</span>
  <span class="dl-tooltip-label">Applicant</span>
</div>
```

Setinha (▼) gerada via `::after`.

---

## Theme awareness

Todos os 10 componentes usam tokens semânticos (`--bg-surface-1`, `--text-primary`, `--border-subtle`, `--accent-primary`, etc) e funcionam **automaticamente** nos 5 themes do DS:

- `[data-theme="dark"]` (default)
- `[data-theme="light"]`
- `[data-theme="premium-light"]`
- `[data-theme="sober-dark"]`
- `[data-theme="vibrant-dark"]`

Para ver os componentes em todos os themes side-by-side, abra [`tokens/themes/preview.html`](../../tokens/themes/preview.html).

---

## Accessibility

- Coins decorativos devem ter `aria-hidden="true"` no parent quando o texto adjacente já transmite a informação.
- `<article>` para StatCard reforça semântica de bloco de conteúdo.
- `<table><thead>` em CompactDataTable garante navegação por screen readers.
- `prefers-reduced-motion` é respeitado em transições de hover.
- Cores semânticas (`.dl-delta`, `.dl-status`) usam tokens por theme — todos validados WCAG AA.

---

## Onde já está em uso

- **resultx.app** — seção `Showcase` com `data-theme="vibrant-dark"`, `Hero` com 2 floating Coins
- **Electia** — `/admin` com 9 KPIs (5 primary + 4 secondary), `/dashboard` com 4 KPIs, `/wellbeing` com 4 KPIs
