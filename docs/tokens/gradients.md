# Gradient Palette & Delta Semantics

Tokens de gradient e delta introduzidos em **v2.1.0** como camada compartilhada entre os 5 themes. Definidos em [`tokens/themes/_data-layer-shared.css`](../../tokens/themes/_data-layer-shared.css) (gradients + dimensões) e em cada arquivo de theme (delta semantics).

---

## Brand gradients (5 cores)

Gradients neutros à brand, reutilizáveis em qualquer theme. Stops fixos — não flipam por `data-theme`.

| Token | Stops | Uso típico |
|---|---|---|
| `--gradient-cyan` | `linear-gradient(135deg, #18C4FF 0%, #4A6CF7 100%)` | Primary action, cyan accents, info |
| `--gradient-magenta` | `linear-gradient(135deg, #FF4789 0%, #E91E63 100%)` | Energy, secondary CTAs, alerta atenção |
| `--gradient-green` | `linear-gradient(135deg, #28C76F 0%, #1FCB8B 100%)` | Success, positive ROI, completed |
| `--gradient-amber` | `linear-gradient(135deg, #FF9F43 0%, #F08C2D 100%)` | Warning, in-progress, caution |
| `--gradient-purple` | `linear-gradient(135deg, #A55EEA 0%, #7367F0 100%)` | Premium, purple accents, especial |

```css
.coin-money {
  background: var(--gradient-green);
  /* funciona em qualquer theme */
}
```

---

## Gradient stops (singles)

Quando você precisa de UMA cor (não o gradient inteiro) — ex: dot na legenda, stroke em SVG.

| Token | Hex | Token | Hex |
|---|---|---|---|
| `--grad-cyan-start` | `#18C4FF` | `--grad-cyan-end` | `#4A6CF7` |
| `--grad-magenta-start` | `#FF4789` | `--grad-magenta-end` | `#E91E63` |
| `--grad-green-start` | `#28C76F` | `--grad-green-end` | `#1FCB8B` |
| `--grad-amber-start` | `#FF9F43` | `--grad-amber-end` | `#F08C2D` |
| `--grad-purple-start` | `#A55EEA` | `--grad-purple-end` | `#7367F0` |

**Convention:** use `-end` quando precisa de UMA cor (mais saturada e melhor contraste em fundo claro).

```html
<span class="dl-donut-legend-dot" style="background: var(--grad-cyan-end);"></span>
```

---

## Delta semantics (per-theme)

Cores para feedback direcional (positive/negative/neutral) calibradas por theme.

| Token | Premium-light | Sober-dark | Vibrant-dark |
|---|---|---|---|
| `--delta-positive-fg` | `#1A8754` | `#34D399` | `#28C76F` |
| `--delta-positive-bg` | rgba green 0.12 | rgba green 0.16 | rgba green 0.18 |
| `--delta-negative-fg` | `#B45309` | `#FBBF24` | `#FF9F43` |
| `--delta-negative-bg` | amber 0.20 | amber 0.16 | amber 0.18 |
| `--delta-neutral-fg` | `#3F5A52` | `#94A3B8` | `#B4B7C9` |
| `--delta-neutral-bg` | gray 0.10 | gray 0.12 | gray 0.12 |

**Decisão de design:** `negative` é amber (não vermelho) — vermelho é reservado para `--color-error`. Isso evita "alerta visual" em variações negativas que são esperadas (queda sazonal, ajustes).

```html
<span class="dl-delta dl-delta--positive">↑ 12.4%</span>
<span class="dl-delta dl-delta--negative">↓ 3.2%</span>
<span class="dl-delta dl-delta--neutral">— estável</span>
```

---

## Surface accents (per-theme)

Tints sutis para coin variants `--soft-*` e StatCard headers coloridos.

| Token | Premium-light | Sober-dark | Vibrant-dark |
|---|---|---|---|
| `--surface-accent-cyan` | rgba(24,196,255,0.08) | 0.10 | 0.16 |
| `--surface-accent-magenta` | 0.08 | 0.10 | 0.16 |
| `--surface-accent-green` | 0.10 | 0.12 | 0.18 |
| `--surface-accent-amber` | 0.10 | 0.12 | 0.18 |
| `--surface-accent-purple` | 0.08 | 0.14 | 0.18 |

```css
.dl-coin--soft-cyan {
  background: var(--surface-accent-cyan);
  color: var(--grad-cyan-end);
}
```

---

## Heatmap dot scale

Visualização de atividade estilo GitHub contributions. 5 tons por theme.

| Token | Uso |
|---|---|
| `--heatmap-dot-0` | Sem atividade (background) |
| `--heatmap-dot-1` | Atividade baixa |
| `--heatmap-dot-2` | Atividade média |
| `--heatmap-dot-3` | Atividade alta |
| `--heatmap-dot-4` | Pico |

```html
<div class="grid grid-cols-20 gap-[3px]">
  <div class="dot dot-0"></div>
  <div class="dot dot-2"></div>
  <div class="dot dot-4"></div>
  <!-- ... -->
</div>
```

```css
.dot { width: var(--heatmap-dot-size); aspect-ratio: 1; border-radius: 2px; }
.dot-0 { background: var(--heatmap-dot-0); }
.dot-1 { background: var(--heatmap-dot-1); }
.dot-2 { background: var(--heatmap-dot-2); }
.dot-3 { background: var(--heatmap-dot-3); }
.dot-4 { background: var(--heatmap-dot-4); }
```

**Convention:** cada theme calibra o scale para sua identidade — premium-light vai de gray claro → green forest, sober-dark vai de navy → violet, vibrant-dark vai de navy → cyan.

---

## Dimensões compartilhadas

| Token | Valor | Uso |
|---|---|---|
| `--coin-size-sm` | `32px` | Coin pequeno (KPIs secundários) |
| `--coin-size-md` | `40px` | Coin padrão |
| `--coin-size-lg` | `48px` | Coin destaque (Hero, decorativos) |
| `--donut-size-sm` | `96px` | Donut pequeno |
| `--donut-size-md` | `140px` | Donut padrão |
| `--donut-size-lg` | `200px` | Donut destaque |
| `--statcard-min-height` | `112px` | Altura mínima do StatCard |
| `--heatmap-dot-size` | `10px` | Tamanho do dot na heatmap |
| `--heatmap-dot-gap` | `3px` | Espaçamento entre dots |

---

## Quando usar cada gradient

| Caso | Gradient sugerido |
|---|---|
| MRR / Revenue / Profit | `--gradient-green` |
| Alerts / Risk / Churn | `--gradient-magenta` |
| Users / Connections / Active | `--gradient-cyan` |
| Speed / Conversion / Engagement | `--gradient-purple` |
| Pending / Warning / In progress | `--gradient-amber` |

**Princípio:** consistência semântica > preferência estética. Verde sempre = positivo. Magenta sempre = atenção/risco.

---

## Onde estão definidos

- **Gradients e stops:** [`tokens/themes/_data-layer-shared.css`](../../tokens/themes/_data-layer-shared.css)
- **Delta semantics:** cada arquivo de theme em `tokens/themes/*.css`
- **Surface accents:** cada arquivo de theme
- **Heatmap dot scale:** cada arquivo de theme
- **Dimensões:** [`tokens/themes/_data-layer-shared.css`](../../tokens/themes/_data-layer-shared.css)

---

## Preview

[`tokens/themes/preview.html`](../../tokens/themes/preview.html) renderiza os 5 gradients + delta pills + heatmap em todos os 5 themes side-by-side.
