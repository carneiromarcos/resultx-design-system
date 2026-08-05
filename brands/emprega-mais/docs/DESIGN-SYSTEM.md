# Emprega+ Design System

**Versao:** 1.0 | **Data:** 2026-05-27 | **Status:** Canonico

Documento canonico de referencia para desenvolvimento frontend do ecossistema Emprega+. Todos os tokens, componentes e padroes documentados aqui sao a fonte de verdade para IMO, Editais, site institucional e qualquer novo produto sob a marca-mae.

Fonte de tokens: `../tokens/tokens.json` + `../tokens/tokens.css` (prefixo `--emp-*`).
Referencia visual: `../previews/brand-guidelines.html`.
Identidade de marca: `BRAND-BOOK.md`.

---

## 0. Tokens canonicos

Os design tokens vivem em `../tokens/tokens.css` (CSS custom properties) e `../tokens/tokens.json` (formato DTCG). O prefixo canonico e `--emp-*`.

### Color

#### Gold (accent de marca)

| Token | Hex | Uso |
|-------|-----|-----|
| `--emp-gold` | `#c4993b` | Primary — CTAs, links, eyebrows, accents |
| `--emp-gold-light` | `#d4ae54` | Hover states, highlights |
| `--emp-gold-warm` | `#c49a3c` | Variante quente para contraste em fundo claro |
| `--emp-gold-dark` | `#a07b2a` | Outline buttons, borders, gradient end |

Gradient de marca: `linear-gradient(135deg, #c4993b 0%, #d4ae54 100%)`

#### Electia (sub-brand accent)

| Token | Hex | Uso |
|-------|-----|-----|
| `--emp-purple-dark` | `#5B2E91` | Fundo escuro / base de produto |
| `--emp-purple` | `#8A3FF0` | Accent principal Electia |
| `--emp-purple-light` | `#B36CFF` | Hover, highlights e gradientes |

Gradient de produto: `linear-gradient(135deg, #5B2E91 0%, #8A3FF0 100%)`

#### Navy (backgrounds dark)

| Token | Hex | Uso |
|-------|-----|-----|
| `--emp-bg` | `#1B2A4A` | Page background (theme-color oficial) |
| `--emp-surface-1` | `#1c2a4a` | Cards, surfaces elevadas em tema escuro |
| `--emp-surface-deep` | `#0f1117` | Backgrounds profundos pontuais |

#### Light surfaces

| Token | Hex | Uso |
|-------|-----|-----|
| `--emp-light-bg` | `#FFFFFF` | Background principal tema claro |
| `--emp-light-subtle` | `#f5f7f9` | Secoes alternadas, rows pares em tabelas |
| `--emp-light-muted` | `#f0f4f8` | Cards em superficies claras |
| `--emp-light-border` | `#e0e6eb` | Bordas em superficies claras |

#### Glass

| Token | Valor | Uso |
|-------|-------|-----|
| `--emp-glass-bg` | `rgba(255,255,255,0.7)` | Background translucido |
| `--emp-glass-border` | `rgba(28,42,74,0.08)` | Borda glass (navy 8%) |
| `--emp-glass-border-hover` | `rgba(28,42,74,0.15)` | Borda glass hover (navy 15%) |

#### Text

| Token | Hex | Uso |
|-------|-----|-----|
| `--emp-text` | `#FFFFFF` | Texto principal em fundo dark |
| `--emp-text-secondary` | `#bfd0ec` | Corpo em fundo dark |
| `--emp-text-muted` | `#5a6b7c` | Metadata, placeholders, captions |
| `--emp-text-subtle` | `#71717a` | Timestamps, labels sutis |
| `--emp-text-inverse` | `#1B2A4A` | Texto em superficies claras |

#### Semantic

| Token | Hex | Uso |
|-------|-----|-----|
| `--emp-success` | `#16a34a` | Confirmacao, badges Gov |
| `--emp-success-dark` | `#0d7a30` | Gradient end success |
| `--emp-error` | `#ef4343` | Erro, acoes destructive |
| `--emp-error-dark` | `#b91c1c` | Gradient end error |
| `--emp-warning` | `#d97706` | Avisos (distinto do gold de marca) |

### Typography

| Token | Valor | Uso |
|-------|-------|-----|
| `--emp-font-heading` | `'Sora', system-ui, sans-serif` | Display, headings |
| `--emp-font-sans` | `'Inter', system-ui, sans-serif` | Body, UI elements |
| `--emp-font-mono` | `'JetBrains Mono', monospace` | Code, tokens, valores tecnicos |

Pesos disponiveis:

| Token | Valor |
|-------|-------|
| `--emp-weight-regular` | 400 |
| `--emp-weight-medium` | 500 |
| `--emp-weight-semibold` | 600 |
| `--emp-weight-bold` | 700 |
| `--emp-weight-extrabold` | 800 |

### Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--emp-radius-sm` | `0.25rem` (4px) | Badges, chips |
| `--emp-radius-md` | `0.5rem` (8px) | Inputs, botoes |
| `--emp-radius-lg` | `0.75rem` (12px) | Cards internos |
| `--emp-radius-xl` | `1rem` (16px) | Cards principais, modais, surfaces grandes |

---

## 1. Componentes base

Inventario dos componentes reutilizaveis do ecossistema. Referencia visual: `../previews/brand-guidelines.html`.

### Buttons

Todos os botoes usam `--emp-radius-md` (8px), `font-family: var(--emp-font-heading)`, `font-weight: 600`, `font-size: 0.875rem`.

| Variante | Background | Texto | Borda | Quando usar |
|----------|------------|-------|-------|-------------|
| **Primary** | `linear-gradient(135deg, #c4993b, #d4ae54)` | `#FFFFFF` | nenhuma | CTA principal, acoes primarias |
| **Secondary** | transparente | `--emp-gold` | `1px solid --emp-gold` | Acoes secundarias, cancelar com destaque |
| **Ghost** | transparente | `--emp-gold` | nenhuma | Acoes terciarias, links estilizados |
| **Destructive** | `--emp-error` (`#ef4343`) | `#FFFFFF` | nenhuma | Deletar, remover, acoes irreversiveis |

Estados de botao:
- **Hover (Primary):** `box-shadow: 0 0 20px rgba(196,153,59,0.20)` (glow brand)
- **Active:** `transform: scale(0.98)`
- **Disabled:** `opacity: 0.5; cursor: not-allowed;` sem hover

### Cards

| Variante | Background | Borda | Radius | Quando usar |
|----------|------------|-------|--------|-------------|
| **Standard** | `--emp-light-bg` (white) | `1px solid --emp-light-border` | `--emp-radius-xl` (16px) | Conteudo geral, listagens, produtos |
| **Glass** | `--emp-glass-bg` | `1px solid --emp-glass-border` | `--emp-radius-xl` (16px) | Superficies flutuantes sobre fundos com contexto visual |

Card hover padrao:
```css
.card:hover {
  border-color: hsl(41 54% 50% / 0.3);
  box-shadow: 0 4px 12px hsl(0 0% 0% / 0.08);
  transform: translateY(-2px);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
```

Cards devem conter `padding: 2rem` no body (`.cbody`). Icones de card usam 3rem x 3rem com background `hsl(41 54% 50% / 0.1)` e cor `--emp-gold`.

### Inputs

| Elemento | Borda | Radius | Focus |
|----------|-------|--------|-------|
| **Text input** | `1px solid --emp-light-border` | `--emp-radius-md` (8px) | `border-color: --emp-gold; outline: 2px solid --emp-gold; outline-offset: 2px` |
| **Select** | identico ao text input | `--emp-radius-md` (8px) | identico |
| **Textarea** | identico ao text input | `--emp-radius-md` (8px) | identico |

Font: `var(--emp-font-sans)`, `font-size: 1rem`, `padding: 0.625rem 0.75rem`.
Placeholder: `color: --emp-text-muted`.

### Badges

| Variante | Background | Texto | Uso |
|----------|------------|-------|-----|
| **Brand** | `--emp-gold` | `#FFFFFF` | Labels de produto, tags principais |
| **Success** | `#16a34a` | `#FFFFFF` | Status ativo, aprovado, Gov |
| **Error** | `#ef4343` | `#FFFFFF` | Status erro, rejeitado |
| **Warning** | `#d97706` | `#FFFFFF` | Pendente, atencao |
| **Gov** | `#16a34a → #0d7a30` gradient | `#FFFFFF` | Produto Gov/IMO B2G |
| **Editais** | `#0891b2 → #0e7490` gradient | `#FFFFFF` | Produto Editais C&S |
| **Electia** | `#5B2E91 → #8A3FF0` gradient | `#FFFFFF` | Produto Electia B2B |
| **PdV** | `#c49a3c → #a07b2a` gradient | `#FFFFFF` | Marca-mae / Profissional de Valor |

Badges: `border-radius: --emp-radius-md`, `padding: 0.125rem 0.625rem`, `font-size: 0.625rem`, `font-weight: 600`.

### Navbar

Barra de navegacao sticky com efeito glass forte:

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: hsl(0 0% 100% / 0.92);   /* glass-strong */
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--emp-light-border);
  height: 64px;
}
```

- Logo: `font-family: Sora`, `font-weight: 800`, `font-size: 1.5rem`. O `+` recebe `color: --emp-gold`.
- Links: `font-size: 0.8125rem`, `font-weight: 500`, `color: --emp-text-muted`. Hover: `color: --emp-text-inverse`.
- Max-width do container interno: `1280px`.

### Tables

| Propriedade | Valor |
|-------------|-------|
| Header background | `--emp-light-subtle` (`#f5f7f9`) |
| Row alternada | `--emp-light-subtle` em linhas pares |
| Borda | `1px solid --emp-light-border` |
| Hover de row | `background: --emp-light-muted` |
| Font header | `font-weight: 600`, `font-size: 0.8125rem`, uppercase, `letter-spacing: 0.05em` |
| Font body | `font-size: 0.875rem` |
| Padding celula | `0.75rem 1rem` |

---

## 2. Color zones

O ecossistema Emprega+ opera em dois temas complementares. A escolha do tema depende do produto e do publico.

### Dark theme (app padrao)

| Propriedade | Valor |
|-------------|-------|
| Background | `--emp-bg` (`#1B2A4A`) |
| Surface | `--emp-surface-1` (`#1c2a4a`) |
| Texto primario | `--emp-text` (`#FFFFFF`) |
| Texto secundario | `--emp-text-secondary` (`#bfd0ec`) |
| Accent | `--emp-gold` (`#c4993b`) |

**Onde usar:** dashboard principal, area do empregador, perfil do candidato, back-office IMO.

### Light theme (Gov / Editais / institucional)

| Propriedade | Valor |
|-------------|-------|
| Background | `--emp-light-bg` (`#FFFFFF`) |
| Surface alternada | `--emp-light-subtle` (`#f5f7f9`) |
| Texto primario | `--emp-text-inverse` (`#1B2A4A`) |
| Texto secundario | `#5a6b7c` |
| Accent | `--emp-gold` (`#c4993b`) |
| Efeito glass | `.emp-glass` com `backdrop-filter: blur(12px)` |

**Onde usar:** paginas publicas, portal governamental, site institucional, landing pages, brand guidelines.

### Adaptive (jobs-v2 frontend)

O frontend Next.js do Jobs V2 suporta ambos os temas via CSS custom properties. A alternancia e feita re-declarando os tokens em um seletor de tema:

```css
[data-theme="light"] {
  --emp-bg: var(--emp-light-bg);
  --emp-text: var(--emp-text-inverse);
  /* ... demais overrides */
}
```

Respeitar `prefers-color-scheme` do sistema como default quando o usuario nao tiver preferencia salva.

---

## 3. Tipografia (escala)

Escala tipografica completa. Fonte de referencia: `previews/brand-guidelines.html` secao "Fontes e Escala Tipografica".

| Token | Font | Size | Weight | Line-height | Uso |
|-------|------|------|--------|-------------|-----|
| `--emp-text-display` | Sora | `clamp(2.5rem, 6vw, 4.5rem)` | 800 | 1.1 | Hero headings, titulos de pagina de destino |
| `--emp-text-h1` | Sora | `2.5rem` (40px) | 700 | 1.2 | Titulos de pagina |
| `--emp-text-h2` | Sora | `2rem` (32px) | 700 | 1.2 | Headings de secao |
| `--emp-text-h3` | Sora | `1.25rem` (20px) | 700 | 1.3 | Headings de card, sub-secoes |
| `--emp-text-eyebrow` | Sora | `0.75rem` (12px) | 600 | — | Labels uppercase, tracking `0.15em`, cor gold |
| `--emp-text-body-lg` | Inter | `1.25rem` (20px) | 400 | 1.7 | Texto introdutorio, leads |
| `--emp-text-body` | Inter | `1rem` (16px) | 400 | 1.7 | Corpo padrao |
| `--emp-text-small` | Inter | `0.875rem` (14px) | 400 | 1.6 | Labels, metadata, texto auxiliar |
| `--emp-text-code` | JetBrains Mono | `0.8125rem` (13px) | 400 | — | Code blocks, tokens, hex values |

### Regras de uso

- **Headings (display, h1, h2, h3):** sempre `font-family: var(--emp-font-heading)` (Sora).
- **Eyebrow:** `text-transform: uppercase`, `letter-spacing: 0.15em`, `color: var(--emp-gold)`. Usado acima de headings de secao (ex.: "01 / Identidade").
- **Body (body-lg, body, small):** sempre `font-family: var(--emp-font-sans)` (Inter).
- **Code:** `font-family: var(--emp-font-mono)` (JetBrains Mono). Usado em swatches de cor, exemplos de tokens e snippets.

### Carregamento de fontes

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- `font-display: swap` (garantido pelo Google Fonts).
- Preload apenas para a pagina hero: Sora 800 e Inter 400.
- Maximo 3 familias. Nao adicionar fontes extras sem justificativa.

---

## 4. Motion

### Tokens de animacao

| Token | Valor | Uso |
|-------|-------|-----|
| `--emp-duration-fast` | `150ms` | Hover, focus, micro-interacoes |
| `--emp-duration-normal` | `300ms` | Reveals de elementos, transicoes de estado |
| `--emp-duration-slow` | `500ms` | Transicoes de pagina, modais |
| `--emp-ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Easing padrao (spring-out) |

### Animacoes canonicas

**Fade-in-up (reveal padrao):**
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

.anim-up {
  animation: fade-in-up 700ms var(--emp-ease-out-expo) forwards;
}
```

Stagger com delays: `.d1 { animation-delay: 0.1s; }`, `.d2 { animation-delay: 0.2s; }`, `.d3 { animation-delay: 0.3s; }`.

**Card hover:**
```css
.card {
  transition: all 250ms var(--emp-ease-out-expo);
}
.card:hover {
  transform: translateY(-2px);
  border-color: hsl(41 54% 50% / 0.3);
  box-shadow: 0 4px 12px hsl(0 0% 0% / 0.08);
}
```

**Glow pulse (decorativo, hero only):**
```css
@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.05); }
}
```

### Principios de motion

1. **Compositor-friendly only:** animar apenas `transform` e `opacity`. Nunca animar `width`, `height`, `top`, `left`, `margin`, `padding`, `border`, `font-size`.
2. **`will-change` com disciplina:** aplicar apenas durante a animacao, remover ao finalizar.
3. **Respeitar `prefers-reduced-motion`:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```
4. **Intencionalidade:** motion deve clarificar o fluxo (direcionar atencao, confirmar acao), nunca distrair.

---

## 5. Surface + elevation

Sistema de 3 niveis de elevacao.

### Light theme

| Nivel | Token | Background | Shadow | Uso |
|-------|-------|------------|--------|-----|
| **Base** | `--emp-light-bg` | `#FFFFFF` | nenhuma | Background de pagina |
| **Elevated** | `--emp-light-subtle` | `#f5f7f9` | `0 1px 3px rgba(0,0,0,0.05)` | Cards, secoes alternadas, sidebars |
| **Floating** | glass ou modal | `--emp-glass-bg` | `0 4px 12px rgba(0,0,0,0.08)` | Dropdowns, modais, tooltips, navbar |

### Dark theme

| Nivel | Token | Background | Shadow | Uso |
|-------|-------|------------|--------|-----|
| **Base** | `--emp-bg` | `#1B2A4A` | nenhuma | Background de pagina |
| **Elevated** | `--emp-surface-1` | `#1c2a4a` | `0 1px 3px rgba(0,0,0,0.15)` | Cards, surfaces elevadas |
| **Floating** | overlay | `rgba(0,0,0,0.5)` backdrop | `0 4px 12px rgba(0,0,0,0.25)` | Modais, drawers |

### Glass layer (Light Glass oficial)

```css
.emp-glass {
  background: var(--emp-glass-bg);           /* rgba(255,255,255,0.7) */
  border: 1px solid var(--emp-glass-border); /* rgba(28,42,74,0.08) */
  backdrop-filter: blur(12px);
}
.emp-glass:hover {
  border-color: var(--emp-glass-border-hover); /* rgba(28,42,74,0.15) */
}
```

**Glass strong (navbar):** `background: hsl(0 0% 100% / 0.92)`, `backdrop-filter: blur(24px)`. Usado exclusivamente na navbar sticky.

**Glow brand (CTAs primary):** `box-shadow: 0 0 20px hsl(41 54% 50% / 0.20)`. Variante large para hero: `0 0 40px hsl(41 54% 50% / 0.25), 0 0 80px hsl(41 54% 50% / 0.10)`.

---

## 6. Estados (hover, focus, active, disabled)

### Hover

| Elemento | Comportamento |
|----------|--------------|
| **Cards** | `translateY(-2px)` + `border-color: hsl(41 54% 50% / 0.3)` + shadow increase |
| **Botoes Primary** | glow brand `0 0 20px rgba(196,153,59,0.20)` |
| **Botoes Secondary** | `background: hsl(41 54% 50% / 0.08)` (fill sutil) |
| **Links** | `color: --emp-gold-dark` (escurece) |
| **Icones** | `opacity: 0.8 → 1` |
| **Nav links** | `color: --emp-text-inverse` (de muted para primario) |
| **Glass border** | `--emp-glass-border` → `--emp-glass-border-hover` |
| **Table rows** | `background: --emp-light-muted` |

Transicao padrao: `transition: all var(--emp-duration-fast) var(--emp-ease-out-expo)` (150ms).

### Focus

Indicador de focus visivel para navegacao por teclado:

```css
:focus-visible {
  outline: 2px solid var(--emp-gold);
  outline-offset: 2px;
}
```

- Cor do ring: `--emp-gold` (`#c4993b`).
- Espessura: `2px`.
- Offset: `2px`.
- Aplicar em todos os elementos interativos: botoes, inputs, links, selects.
- Usar `:focus-visible` (nao `:focus`) para nao mostrar ring em cliques de mouse.

### Active

| Elemento | Comportamento |
|----------|--------------|
| **Botoes** | `transform: scale(0.98)` |
| **Links** | `color: --emp-gold-dark` |

### Disabled

```css
[disabled],
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

Nenhum efeito hover, focus ou active em elementos desabilitados.

---

## 7. Acessibilidade

**Meta:** WCAG 2.1 nivel AA.

### Contraste de cores

| Combinacao | Ratio | Veredicto |
|------------|-------|-----------|
| Navy `#1B2A4A` sobre branco `#FFFFFF` | ~11:1 | Excelente — usar como texto primario em superficies claras |
| Branco `#FFFFFF` sobre navy `#1B2A4A` | ~11:1 | Excelente — headings e body em tema escuro |
| Gold `#c4993b` sobre branco `#FFFFFF` | ~3.3:1 | Decorativo only — aceito para texto grande (>=18px bold) e icones, NAO para body text |
| Gold `#c4993b` sobre navy `#1B2A4A` | ~3.8:1 | Aceito para texto grande, botoes com peso 700+ e min 18px |
| Branco `#FFFFFF` sobre gold gradient | ~3.1:1 | Aceito para CTAs com peso 700+ e min 18px (botoes Primary) |

### Regras praticas

1. **Texto small (< 18px):** usar navy sobre branco ou branco sobre navy. Nunca usar gold como cor de texto small.
2. **CTAs gold:** texto branco, `font-weight: 700`, `font-size >= 1rem` (16px). O gradient melhora levemente o contraste medio.
3. **Eyebrows gold:** `font-weight: 600`, `font-size: 0.75rem` (12px) — tecnicamente abaixo de AA para texto normal, mas aceito por ser label decorativo com tracking expandido. Considerar usar navy em contextos criticos.
4. **Semantic colors (success, error, warning):** sobre branco, todos passam AA para texto grande. Para texto small, usar variantes dark (`--emp-success-dark`, `--emp-error-dark`).

### Preferencias de usuario

```css
/* Desabilitar motion para usuarios que preferem reducao */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Respeitar preferencia de tema do sistema */
@media (prefers-color-scheme: dark) {
  :root { /* aplicar tokens dark como default */ }
}
```

### Checklist de acessibilidade

- [ ] Focus ring visivel (gold, 2px) em todos os interativos
- [ ] Todos os elementos interativos acessiveis por teclado (tab order logica)
- [ ] Imagens com `alt` descritivo (ou `alt=""` para decorativas)
- [ ] Landmark roles semanticos: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`
- [ ] `aria-label` em navegacoes (`<nav aria-label="Navegacao principal">`)
- [ ] `prefers-reduced-motion` respeitado — conteudo visivel imediatamente
- [ ] `prefers-color-scheme` respeitado como default do tema
- [ ] Contraste minimo 4.5:1 para texto normal, 3:1 para texto grande
- [ ] Touch targets minimo 44x44px em mobile

---

## 8. Stack recomendada

| Plataforma | Stack | Tema | Notas |
|------------|-------|------|-------|
| **Site institucional** (`empregamais.me`) | React 19 + Vite 7 + TypeScript + Tailwind v4 | Light | Paginas publicas, landing pages |
| **App Editais** (`app.empregamais.me`) | Laravel 8 + PHP 8 + Livewire 2 + MySQL 8 | Dark (back-office) | Sistema legado, manutencao |
| **Jobs V2 frontend** (`jobs-v2.empregamais.me`) | Next.js + TypeScript + Tailwind | Adaptive (dark / light) | Empregabilidade completa |
| **Jobs V2 backend** | Laravel 10 + MySQL | — | API backend |
| **PdV — comunidade** (`profissional.empregamais.me`) | React 19 + Vite 7 + TypeScript + Brevo | Light (premium) | Brand pessoal separada |

### Dependencias de design compartilhadas

- **Icones:** Lucide Icons (outline/stroke). Cor de destaque: `--emp-gold`. Cor neutra: `--emp-text-muted`.
- **Fontes:** Google Fonts (Sora + Inter + JetBrains Mono). Carregar via `<link>` com `font-display: swap`.
- **Tokens:** importar `tokens.css` ou replicar custom properties no projeto. O arquivo JSON serve como source-of-truth para tooling (Figma tokens, Style Dictionary, etc.).

### Integracoes entre produtos

- IMO e Editais herdam o visual Emprega+ diretamente (sem brand kit proprio).
- Electia usa identidade propria (roxo + JetBrains Mono) com endosso "by Emprega+" — consultar `brands/electia/docs/DESIGN-SYSTEM.md`.
- PdV e brand pessoal separada — consultar `brands/pdv/` se existir.
- Gradientes por produto para badges e CTAs contextuais estao definidos na secao de Badges (SS1).
