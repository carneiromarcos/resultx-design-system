# ResultX Design System (marca)

**Versão:** 2.0 | **Data:** 2026-10-09 | **Status:** canônico, alinhado a resultx.app (DS v2.8.1)

Referência de implementação da marca ResultX. A marca **não reinventa componentes**: ela usa o DS (tokens e componentes core) e acrescenta (1) os tokens `--rx-*`, (2) a **ponte** `ds-bridge.css`, que troca o accent do DS para o ouro, e (3) as regras de uso abaixo.

- Tokens: [`../tokens/tokens.json`](../tokens/tokens.json) (fonte) e [`../tokens/tokens.css`](../tokens/tokens.css).
- Ponte (gerada, não editar): [`../tokens/ds-bridge.css`](../tokens/ds-bridge.css) via `npm run build:bridges`.
- Identidade: [`BRAND-BOOK.md`](BRAND-BOOK.md) · Movimento: [`MOTION-GUIDE.md`](MOTION-GUIDE.md) · Vitrine: [`../previews/brand-system.html`](../previews/brand-system.html).

## 1. Como consumir

Ordem de importação (a mesma do site e das outras marcas):

```css
@import 'resultx-design-system/tokens';                 /* tokens do DS */
@import 'resultx-design-system/brands/resultx/tokens';  /* --rx-* */
@import 'resultx-design-system/brands/resultx/bridge';  /* accent ouro */
@import 'resultx-design-system/components';
@import 'resultx-design-system/icons';
```

```html
<html lang="pt-BR" data-theme="dark">
```

O tema padrão é **grafite** (`data-theme="dark"`). O claro é opt-in (`data-theme="light"`), para propostas e documentos.

## 2. Tokens

### Cor (grafite)

| Token | Valor | Uso |
|---|---|---|
| `--rx-bg` / `--rx-surface-1/2/3` | `#0B0E14` / `#111620` / `#161B26` / `#1C2333` | página, faixa, card, hover |
| `--rx-border-subtle` / `--rx-border` / `--rx-border-strong` | `#1E2736` / `#2A3444` / `#3D4A5C` | bordas |
| `--rx-text` / `-secondary` / `-muted` | `#E6EDF3` / `#8B949E` / `#8A939D` | texto (≥ 5,0:1 em todas as superfícies) |
| `--rx-text-inverse` | `#0B0E14` | tinta sobre o ouro e sobre superfícies claras |
| `--rx-gold` / `-light` / `-dark` | `#c4993b` / `#d4ae54` / `#a07b2a` | preenchimento de ação / hover / contorno |
| `--rx-gold-ink` | `#c4993b` (escuro), `#866425` (claro) | ouro como texto |
| `--rx-purple` / `-light` / `-dark` | `#6f32b1` / `#a55eea` / `#5a2890` | atmosfera, reflexo |
| `--rx-gradient-bridge` | `linear-gradient(135deg, #c4993b, #6f32b1)` | assinatura |
| `--rx-success/-warning/-error/-info` | `#22c55e` / `#f59e0b` / `#ef4444` / `#3b82f6` | estado |

**Regra:** ouro = ação e estado ativo; roxo = atmosfera e ponta da ponte (nunca texto, nunca botão); semânticas só para estado.

### Tipografia

`--rx-font-heading` Sora · `--rx-font-body` Inter · `--rx-font-mono` JetBrains Mono. Pesos 400/500/600/700. Escala: `--rx-text-display`, `--rx-text-h1` (fluida), `--rx-text-h2` (fluida), `--rx-text-h3` 1,25 rem, `--rx-text-body-lg` 1,25 rem, `--rx-text-body` 1 rem, `--rx-text-small` 0,875 rem, `--rx-text-eyebrow` 0,75 rem com `--rx-tracking-eyebrow` 0,16em.

### Espaço, raio, sombra, layout

- Espaço: `--rx-space-xs…3xl` (4 px a 80 px); `--rx-space-section` = `clamp(4rem, 2.8rem + 4.5vw, 7rem)`.
- Raio: `--rx-radius-sm/md/lg/xl` = 4 / 8 / 12 / 16 px. O site usa os raios do DS (`--radius-*`).
- Sombra: `--rx-shadow-sm/md/lg` (escuro = sombras do DS), `--rx-glow-gold/-purple/-bridge`.
- Layout: `--rx-container-max` 1200 px, `--rx-gutter` 1 rem. Header: `--rx-header-logo-h` 25 px, `--rx-header-logo-h-compact` 20 px, `--rx-header-link` 1 rem, `--rx-header-bar-min` 76 px.
- Movimento: ver `MOTION-GUIDE.md` §7.

## 3. A ponte (`ds-bridge.css`)

Gerada de `tokens.css` por `scripts/build-brand-bridges.js`. Reescreve os semânticos do DS (`--accent-primary`, `--accent-primary-hover`, `--accent-secondary`, `--accent-primary-text`, `--border-accent`, `--focus-ring-color`, `--text-inverse` etc.) com os valores da marca nos quatro escopos de tema do DS. A tinta do botão primário é **medida**, não escolhida: `#0B0E14` sobre o ouro, 7,33:1. O build falha se nenhuma tinta alcançar 4,5:1.

## 4. Componentes do DS usados no site

| Componente | Uso na ResultX |
|---|---|
| `.header-float` + `.menu-drawer` | header em pílula de vidro; logomarca 25 px, links 16 px, barra 76 px; gaveta abaixo de 1024 px |
| `.btn` `.btn-primary` `.btn-secondary` `.btn-sheen` | CTAs; um reflexo por passada |
| `.card` | áreas, serviços, produtos; `+ .card-lift` (profundidade, ver motion) |
| `.form-input` `.form-textarea` | formulário de diagnóstico |
| `.icon` (Lucide) | ícones decorativos |

Decisões só da página (largura, escala dos títulos, eyebrow, faixas `.band-tint`, `.icon-chip`, `.screen-frame`) ficam no CSS do site e na vitrine, em cima de tokens. **Nenhum hex em CSS de página.**

## 5. Estados

- **Foco:** anel sólido `--focus-ring-color` (ouro, ≥ 5,96:1 em todas as superfícies do grafite), 2 px, com `outline-offset`. Nunca só mudança de cor.
- **Hover:** botão ganha `--accent-primary-hover`; card levanta e acende o fio da ponte; link ganha `text-decoration-thickness: 2px`.
- **Desativado:** opacidade reduzida do DS, sem hover.
- Alvos de toque ≥ 44 px (links do header, do rodapé e dos contatos).

## 6. Acessibilidade

- Texto ≥ 4,5:1: `--rx-text` 13,3 a 16,3:1, secundário e muted ≥ 5,0:1 nas quatro superfícies. Ouro como texto 5,96 a 7,33:1.
- Roxo `#6f32b1` sobre o grafite dá 2,55:1: **não usar como texto**.
- Erro `#ef4444` dá 4,17:1 sobre `--rx-surface-3`: use em ícone, borda e texto grande, ou sobre `--rx-bg`/`surface-1` (≥ 4,81:1).
- Tema claro: ouro como texto `#866425` (5,44:1 sobre branco).
- `prefers-reduced-motion`: nada se desloca. Marcos de página (`<header>`, `<main>`, `<section aria-labelledby>`, `<footer>`) e `skip-link`.

## 7. Layout de página (site)

`.wrap` (largura `min(1200px, 100% − 2×1rem)`) · `.section` (`--page-section`) · `.band-tint` (faixa `--bg-surface-1`) · `.section-head` (eyebrow, H2, parágrafo, máx. 760 px). Grades: 3 colunas (áreas), 2 (serviços), 4 (método), colapsando para 2 abaixo de 1024 px e 1 abaixo de 640 px.

## 8. Superado em 09/10/2026

Navy `#1B2A4A` como chão, zonas "light/dark/adaptive", Poppins + Roboto (`--rx-font-*-legacy`), peso 800 e gradiente de cinco cores como assinatura de UI. Ver `CHANGELOG.md` para o mapa antes → depois dos tokens.
