# ResultX Design System

**Versao:** 1.0 | **Data:** 2026-05-27 | **Status:** Canonico

Documento canonico de referencia para desenvolvimento frontend da marca ResultX — o guarda-chuva de inovacao que conecta Emprega+ (empregabilidade, confianca, ouro) a Electia (assessments comportamentais, tecnologia, roxo). ResultX e a **ponte visual** entre ambos: herda o ouro institucional do Emprega+ e o roxo tecnologico da Electia, combinando-os num gradient unico que representa sinergia.

Fonte de tokens: `../tokens/tokens.json` + `../tokens/tokens.css` (prefixo `--rx-*`).
Identidade de marca: `BRAND-BOOK.md`.

---

## 0. Tokens canonicos

Os design tokens vivem em `../tokens/tokens.css` (CSS custom properties) e `../tokens/tokens.json` (formato W3C DTCG). O prefixo canonico e `--rx-*`.

### Color

#### Gold (heranca Emprega+)

| Token | Hex | Uso |
|-------|-----|-----|
| `--rx-gold-light` | `#d4ae54` | Hover CTAs de confianca, highlights |
| `--rx-gold` | `#c4993b` | Primary trust — CTAs institucionais, accents de credibilidade |
| `--rx-gold-dark` | `#a07b2a` | Outline buttons, borders, gradient end |

Gradient gold: `linear-gradient(135deg, #c4993b 0%, #d4ae54 100%)`

#### Purple (heranca Electia)

| Token | Hex | Uso |
|-------|-----|-----|
| `--rx-purple-light` | `#a55eea` | Hover CTAs de tecnologia, highlights |
| `--rx-purple` | `#6f32b1` | Primary tech — CTAs de produto, inovacao |
| `--rx-purple-dark` | `#5a2890` | Outline buttons, borders, gradient end |

Gradient purple: `linear-gradient(135deg, #6f32b1 0%, #a55eea 100%)`

#### Bridge gradient (assinatura ResultX)

| Token | Valor | Uso |
|-------|-------|-----|
| `--rx-gradient-bridge` | `linear-gradient(135deg, #c4993b 0%, #6f32b1 100%)` | Assinatura de marca — hero, headings, dividers. Ouro-para-roxo = confianca-para-inovacao |
| `--rx-gradient-bridge-subtle` | `linear-gradient(135deg, rgba(196,153,59,0.12) 0%, rgba(111,50,177,0.12) 100%)` | Background de cards featured, hover sutil |
| `--rx-gradient-gold` | `linear-gradient(135deg, #c4993b 0%, #d4ae54 100%)` | CTAs de confianca (propostas, consultoria) |
| `--rx-gradient-purple` | `linear-gradient(135deg, #6f32b1 0%, #a55eea 100%)` | CTAs de produto (demos, trials) |

O gradient bridge e o DNA visual da ResultX: ouro (Emprega+) fluindo para roxo (Electia), representando a transicao de confianca institucional para inovacao tecnologica.

#### Navy (ecossistema compartilhado)

| Token | Hex | Uso |
|-------|-----|-----|
| `--rx-bg` | `#1B2A4A` | Page background dark — navy canonico do ecossistema |
| `--rx-surface-1` | `#1c2a4a` | Cards e surfaces elevadas em dark |
| `--rx-surface-2` | `#243661` | Cards elevados secundarios |
| `--rx-surface-3` | `#2d4378` | Hover, estados interativos |

#### Light surfaces

| Token | Hex | Uso |
|-------|-----|-----|
| `--rx-light-bg` | `#FFFFFF` | Background principal tema claro |
| `--rx-light-subtle` | `#f5f7f9` | Secoes alternadas, rows pares |
| `--rx-light-muted` | `#f0f4f8` | Cards em superficies claras |
| `--rx-light-border` | `#e0e6eb` | Bordas em superficies claras |

#### Text

| Token | Hex | Uso |
|-------|-----|-----|
| `--rx-text` | `#FFFFFF` | Texto principal em fundo dark |
| `--rx-text-secondary` | `#bfd0ec` | Corpo em fundo dark |
| `--rx-text-muted` | `#5a6b7c` | Metadata, placeholders, captions |
| `--rx-text-inverse` | `#1B2A4A` | Texto em superficies claras |

#### Glass

| Token | Valor | Uso |
|-------|-------|-----|
| `--rx-glass-light-bg` | `rgba(255,255,255,0.7)` | Light Glass — heranca Emprega+ |
| `--rx-glass-light-border` | `rgba(28,42,74,0.08)` | Borda glass light (navy 8%) |
| `--rx-glass-light-blur` | `12px` | Blur do glass claro |
| `--rx-glass-dark-bg` | `rgba(28,42,74,0.6)` | Dark Glass — heranca Electia |
| `--rx-glass-dark-border` | `rgba(255,255,255,0.06)` | Borda glass dark (branco 6%) |
| `--rx-glass-dark-blur` | `16px` | Blur do glass escuro |

#### Semantic

| Token | Hex | Uso |
|-------|-----|-----|
| `--rx-success` | `#16a34a` | Confirmacao, badges positivos |
| `--rx-error` | `#ef4343` | Erro, acoes destructive |
| `--rx-warning` | `#d97706` | Avisos (distinto do gold de marca) |

### Typography

| Token | Valor | Uso |
|-------|-------|-----|
| `--rx-font-heading` | `'Sora', system-ui, sans-serif` | Display, headings |
| `--rx-font-body` | `'Inter', system-ui, sans-serif` | Body, UI elements |
| `--rx-font-mono` | `'JetBrains Mono', monospace` | Code, tokens, valores tecnicos |

**Nota de migracao:** o site live `resultx.app` usa Poppins + Roboto (legado). A migracao para Sora + Inter esta planejada para alinhar ao ecossistema. Ambas as familias estao registradas nos tokens para referencia durante a transicao (`--rx-font-heading-legacy`, `--rx-font-body-legacy`).

Pesos disponiveis:

| Token | Valor |
|-------|-------|
| `--rx-weight-regular` | 400 |
| `--rx-weight-medium` | 500 |
| `--rx-weight-semibold` | 600 |
| `--rx-weight-bold` | 700 |
| `--rx-weight-extrabold` | 800 |

### Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--rx-radius-sm` | `0.25rem` (4px) | Badges, chips |
| `--rx-radius-md` | `0.5rem` (8px) | Inputs, botoes |
| `--rx-radius-lg` | `0.75rem` (12px) | Cards internos |
| `--rx-radius-xl` | `1rem` (16px) | Cards principais, modais, surfaces grandes |

---

## 1. Componentes base

Inventario dos componentes reutilizaveis da marca ResultX. A ponte visual se manifesta nos componentes: gold para acoes de **confianca** (contratar, comprar, aprovar), purple para acoes de **tecnologia** (testar, explorar, inovar).

### Buttons

Todos os botoes usam `--rx-radius-md` (8px), `font-family: var(--rx-font-heading)`, `font-weight: 600`, `font-size: 0.875rem`.

| Variante | Background | Texto | Borda | Quando usar |
|----------|------------|-------|-------|-------------|
| **Primary (gold)** | `var(--rx-gradient-gold)` | `#FFFFFF` | nenhuma | CTAs de confianca — contratar, enviar proposta, confirmar |
| **Secondary (purple)** | `var(--rx-purple)` | `#FFFFFF` | nenhuma | CTAs de tecnologia — acessar demo, explorar produto, iniciar trial |
| **Ghost (bridge)** | transparente | gradient text ouro→roxo | `1px solid` gradient bridge | Acoes terciarias, links com destaque, CTAs experimentais |
| **Outline gold** | transparente | `var(--rx-gold)` | `1px solid var(--rx-gold)` | Acoes secundarias em contexto institucional |
| **Outline purple** | transparente | `var(--rx-purple)` | `1px solid var(--rx-purple)` | Acoes secundarias em contexto de produto |
| **Destructive** | `var(--rx-error)` | `#FFFFFF` | nenhuma | Deletar, remover, acoes irreversiveis |

Estados de botao:
- **Hover (Primary gold):** `box-shadow: var(--rx-glow-gold)` — glow dourado
- **Hover (Secondary purple):** `box-shadow: var(--rx-glow-purple)` — glow roxo
- **Hover (Ghost bridge):** `box-shadow: var(--rx-glow-bridge)` — glow duplo
- **Active:** `transform: scale(0.98)`
- **Disabled:** `opacity: 0.5; cursor: not-allowed;` sem hover

### Cards

| Variante | Background | Borda | Shadow | Quando usar |
|----------|------------|-------|--------|-------------|
| **Standard light** | `var(--rx-light-bg)` | `1px solid var(--rx-light-border)` | `var(--rx-shadow-sm)` | Conteudo geral em tema claro (site, propostas) |
| **Subtle light** | `var(--rx-light-subtle)` | `1px solid var(--rx-light-border)` | nenhuma | Secoes alternadas, listagens em tema claro |
| **Dark elevated** | `var(--rx-surface-2)` | `1px solid rgba(255,255,255,0.06)` | `var(--rx-shadow-md)` | Cards em dashboards dark, showcases |
| **Glass light** | `var(--rx-glass-light-bg)` | `1px solid var(--rx-glass-light-border)` | nenhuma | Superficies flutuantes sobre fundo claro (heranca Emprega+) |
| **Glass dark** | `var(--rx-glass-dark-bg)` | `1px solid var(--rx-glass-dark-border)` | nenhuma | Superficies flutuantes sobre fundo dark (heranca Electia) |
| **Featured (bridge)** | `var(--rx-gradient-bridge-subtle)` | `1px solid` gradient bridge a 20% | `var(--rx-glow-bridge)` | Destaque maximo — plano recomendado, produto principal |

Card hover padrao (light):
```css
.rx-card:hover {
  border-color: rgba(196, 153, 59, 0.3);
  box-shadow: var(--rx-shadow-md);
  transform: translateY(-2px);
  transition: all var(--rx-duration-fast) var(--rx-ease-out-expo);
}
```

Card hover padrao (dark):
```css
.rx-card-dark:hover {
  border-color: rgba(111, 50, 177, 0.3);
  box-shadow: var(--rx-shadow-md);
  transform: translateY(-2px);
  transition: all var(--rx-duration-fast) var(--rx-ease-out-expo);
}
```

Cards: `padding: 2rem`, `border-radius: var(--rx-radius-xl)`.

### Inputs

| Elemento | Borda | Radius | Focus |
|----------|-------|--------|-------|
| **Text input** | `1px solid var(--rx-light-border)` | `--rx-radius-md` (8px) | `border-color: var(--rx-purple); outline: 2px solid var(--rx-purple); outline-offset: 2px` |
| **Select** | identico ao text input | `--rx-radius-md` (8px) | identico |
| **Textarea** | identico ao text input | `--rx-radius-md` (8px) | identico |

Font: `var(--rx-font-body)`, `font-size: 1rem`, `padding: 0.625rem 0.75rem`.
Placeholder: `color: var(--rx-text-muted)`.

**Nota:** focus ring usa purple (nao gold) porque inputs sao interacao de produto, nao de confianca institucional.

### Badges

| Variante | Background | Texto | Uso |
|----------|------------|-------|-----|
| **Gold** | `var(--rx-gold)` | `#FFFFFF` | Labels institucionais, consultoria |
| **Purple** | `var(--rx-purple)` | `#FFFFFF` | Labels de produto, tecnologia |
| **Bridge** | `var(--rx-gradient-bridge)` | `#FFFFFF` | Destaques cross-marca, novidades |
| **Success** | `var(--rx-success)` | `#FFFFFF` | Status ativo, aprovado |
| **Error** | `var(--rx-error)` | `#FFFFFF` | Status erro, rejeitado |
| **Warning** | `var(--rx-warning)` | `#FFFFFF` | Pendente, atencao |
| **Emprega+** | `#c4993b → #d4ae54` gradient | `#FFFFFF` | Referencia a marca Emprega+ |
| **Electia** | `#6f32b1 → #a55eea` gradient | `#FFFFFF` | Referencia a marca Electia |

Badges: `border-radius: var(--rx-radius-md)`, `padding: 0.125rem 0.625rem`, `font-size: 0.625rem`, `font-weight: 600`.

### Navbar

Barra de navegacao sticky com efeito glass. O tema da navbar muda conforme a color zone da pagina:

**Light navbar (default — site, propostas):**
```css
.rx-navbar-light {
  position: sticky;
  top: 0;
  z-index: 50;
  background: hsl(0 0% 100% / 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--rx-light-border);
  height: 64px;
}
```

**Dark navbar (dashboards, showcases):**
```css
.rx-navbar-dark {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(28, 42, 74, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  height: 64px;
}
```

- Logo: `font-family: Sora`, `font-weight: 800`, `font-size: 1.5rem`. O "X" recebe gradient bridge ou cor contextual.
- Links: `font-size: 0.8125rem`, `font-weight: 500`. Cor muda conforme o tema.
- Max-width do container interno: `var(--rx-container-max)` (1200px).

### Tables

| Propriedade | Valor |
|-------------|-------|
| Header background | `var(--rx-light-subtle)` ou `var(--rx-surface-2)` conforme tema |
| Row alternada | `var(--rx-light-subtle)` (light) ou `var(--rx-surface-1)` (dark) |
| Borda | `1px solid var(--rx-light-border)` (light) ou `1px solid rgba(255,255,255,0.06)` (dark) |
| Hover de row | `var(--rx-light-muted)` (light) ou `var(--rx-surface-3)` (dark) |
| Font header | `font-weight: 600`, `font-size: 0.8125rem`, uppercase, `letter-spacing: 0.05em` |
| Font body | `font-size: 0.875rem` |
| Padding celula | `0.75rem 1rem` |

---

## 2. Color zones

ResultX opera em tres modos visuais, alternando entre a heranca clara do Emprega+ e a heranca escura da Electia. A capacidade de transitar entre ambos e o diferencial visual da marca.

### Light zone (default — site, propostas, materiais de consultoria)

| Propriedade | Valor |
|-------------|-------|
| Background | `var(--rx-light-bg)` (`#FFFFFF`) |
| Surface alternada | `var(--rx-light-subtle)` (`#f5f7f9`) |
| Texto primario | `var(--rx-text-inverse)` (`#1B2A4A`) |
| Texto secundario | `var(--rx-text-muted)` (`#5a6b7c`) |
| Accent primario | `var(--rx-gold)` (`#c4993b`) — confianca |
| Accent secundario | `var(--rx-purple)` (`#6f32b1`) — inovacao |
| Glass | `.rx-glass-light` com `backdrop-filter: blur(12px)` |

**Onde usar:** site institucional, landing pages, propostas comerciais, brand guidelines, materiais de consultoria.

### Dark zone (dashboards, showcases, apresentacoes)

| Propriedade | Valor |
|-------------|-------|
| Background | `var(--rx-bg)` (`#1B2A4A`) |
| Surface | `var(--rx-surface-1)` → `--rx-surface-2` → `--rx-surface-3` |
| Texto primario | `var(--rx-text)` (`#FFFFFF`) |
| Texto secundario | `var(--rx-text-secondary)` (`#bfd0ec`) |
| Accent primario | `var(--rx-purple)` (`#6f32b1`) — tecnologia em destaque |
| Accent secundario | `var(--rx-gold)` (`#c4993b`) — credibilidade sutil |
| Glass | `.rx-glass-dark` com `backdrop-filter: blur(16px)` |

**Onde usar:** dashboards de produto, showcases, decks de apresentacao, secoes de portfolio.

### Adaptive zone (paginas mistas)

Paginas como a home e o portfolio alternam secoes light e dark, criando ritmo visual que reflete a ponte Emprega+/Electia:

```
[LIGHT] Hero + proposta de valor (ouro)
[DARK]  Showcase de produtos (roxo)
[LIGHT] Cases e depoimentos (ouro)
[DARK]  Metricas e resultados (roxo)
[LIGHT] Pricing e CTA final (bridge gradient)
```

A transicao entre zonas usa o gradient bridge como divider visual ou uma mudanca suave de background.

---

## 3. Tipografia (escala)

Escala tipografica alinhada ao ecossistema. Mesma estrutura do Emprega+ DS para consistencia cross-marca.

| Token | Font | Size | Weight | Line-height | Uso |
|-------|------|------|--------|-------------|-----|
| `--rx-text-display` | Sora | `clamp(2.5rem, 6vw, 4.5rem)` | 800 | 1.1 | Hero headings, titulos de pagina de destino |
| `--rx-text-h1` | Sora | `2.5rem` (40px) | 700 | 1.2 | Titulos de pagina |
| `--rx-text-h2` | Sora | `2rem` (32px) | 700 | 1.2 | Headings de secao |
| `--rx-text-h3` | Sora | `1.25rem` (20px) | 700 | 1.3 | Headings de card, sub-secoes |
| `--rx-text-eyebrow` | Sora | `0.75rem` (12px) | 600 | — | Labels uppercase, tracking `0.15em`, cor gold ou purple conforme contexto |
| `--rx-text-body-lg` | Inter | `1.25rem` (20px) | 400 | 1.7 | Texto introdutorio, leads |
| `--rx-text-body` | Inter | `1rem` (16px) | 400 | 1.7 | Corpo padrao |
| `--rx-text-small` | Inter | `0.875rem` (14px) | 400 | 1.6 | Labels, metadata, texto auxiliar |
| `--rx-text-code` | JetBrains Mono | `0.8125rem` (13px) | 400 | — | Code blocks, tokens, hex values |

### Regras de uso

- **Headings (display, h1, h2, h3):** sempre `font-family: var(--rx-font-heading)` (Sora).
- **Eyebrow:** `text-transform: uppercase`, `letter-spacing: 0.15em`. Cor: `var(--rx-gold)` em contexto institucional, `var(--rx-purple)` em contexto de produto.
- **Body (body-lg, body, small):** sempre `font-family: var(--rx-font-body)` (Inter).
- **Code:** `font-family: var(--rx-font-mono)` (JetBrains Mono).
- **Gradient text (destaque ResultX):** headings de destaque podem usar a classe `.rx-text-gradient-bridge` para aplicar o gradient ouro-para-roxo em texto.

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
| `--rx-duration-fast` | `150ms` | Hover, focus, micro-interacoes |
| `--rx-duration-normal` | `300ms` | Reveals de elementos, transicoes de estado |
| `--rx-duration-slow` | `500ms` | Transicoes de pagina, modais |
| `--rx-ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Easing padrao (spring-out) |

### Animacoes canonicas

**Fade-in-up (reveal padrao):**
```css
@keyframes rx-fade-in-up {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

.rx-reveal {
  animation: rx-fade-in-up 700ms var(--rx-ease-out-expo) forwards;
}
```

Stagger com delays: `.d1 { animation-delay: 0.1s; }`, `.d2 { animation-delay: 0.2s; }`, `.d3 { animation-delay: 0.3s; }`.

**Card hover (light — glow gold):**
```css
.rx-card-light:hover {
  transform: translateY(-2px);
  border-color: rgba(196, 153, 59, 0.3);
  box-shadow: var(--rx-glow-gold);
  transition: all 250ms var(--rx-ease-out-expo);
}
```

**Card hover (dark — glow purple):**
```css
.rx-card-dark:hover {
  transform: translateY(-2px);
  border-color: rgba(111, 50, 177, 0.3);
  box-shadow: var(--rx-glow-purple);
  transition: all 250ms var(--rx-ease-out-expo);
}
```

**Bridge shimmer (decorativo, hero only — gradient que se move):**
```css
@keyframes rx-bridge-shimmer {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.rx-bridge-shimmer {
  background: linear-gradient(135deg, #c4993b, #6f32b1, #c4993b);
  background-size: 200% 200%;
  animation: rx-bridge-shimmer 4s ease infinite;
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

Sistema de 3 niveis de elevacao, com variantes para ambos os temas. ResultX herda o sistema Light Glass do Emprega+ e o Dark Glass da Electia.

### Light theme

| Nivel | Token | Background | Shadow | Uso |
|-------|-------|------------|--------|-----|
| **Base** | `--rx-light-bg` | `#FFFFFF` | nenhuma | Background de pagina |
| **Elevated** | `--rx-light-subtle` | `#f5f7f9` | `var(--rx-shadow-sm)` | Cards, secoes alternadas, sidebars |
| **Floating** | glass light | `var(--rx-glass-light-bg)` | `var(--rx-shadow-md)` | Dropdowns, modais, tooltips, navbar |

### Dark theme

| Nivel | Token | Background | Shadow | Uso |
|-------|-------|------------|--------|-----|
| **Base** | `--rx-bg` | `#1B2A4A` | nenhuma | Background de pagina |
| **Elevated** | `--rx-surface-2` | `#243661` | `var(--rx-shadow-sm)` | Cards, surfaces elevadas |
| **Floating** | glass dark | `var(--rx-glass-dark-bg)` | `var(--rx-shadow-md)` | Modais, drawers, popovers |

### Light Glass (heranca Emprega+)

```css
.rx-glass-light {
  background: var(--rx-glass-light-bg);
  border: 1px solid var(--rx-glass-light-border);
  backdrop-filter: blur(var(--rx-glass-light-blur));
}
```

Usado em superficies light: navbar, cards flutuantes, overlays sobre hero sections claras.

### Dark Glass (heranca Electia)

```css
.rx-glass-dark {
  background: var(--rx-glass-dark-bg);
  border: 1px solid var(--rx-glass-dark-border);
  backdrop-filter: blur(var(--rx-glass-dark-blur));
}
```

Usado em superficies dark: cards de dashboard, navbar escura, overlays sobre hero sections escuras.

### Glow system

| Token | Valor | Uso |
|-------|-------|-----|
| `--rx-glow-gold` | `0 0 20px rgba(196,153,59,0.20)` | Hover botoes gold, cards institucionais |
| `--rx-glow-purple` | `0 0 20px rgba(111,50,177,0.20)` | Hover botoes purple, cards de produto |
| `--rx-glow-bridge` | `0 0 20px rgba(196,153,59,0.15), 0 0 20px rgba(111,50,177,0.15)` | Destaque bridge — featured cards, ghost buttons |

---

## 6. Estados (hover, focus, active, disabled)

A dual-accent do ResultX se reflete nos estados: gold para acoes de confianca, purple para acoes de tecnologia.

### Hover

| Elemento | Comportamento |
|----------|--------------|
| **Cards (light)** | `translateY(-2px)` + `border-color: rgba(196,153,59,0.3)` + glow gold |
| **Cards (dark)** | `translateY(-2px)` + `border-color: rgba(111,50,177,0.3)` + glow purple |
| **Botoes Primary (gold)** | `box-shadow: var(--rx-glow-gold)` |
| **Botoes Secondary (purple)** | `box-shadow: var(--rx-glow-purple)` |
| **Botoes Ghost (bridge)** | `box-shadow: var(--rx-glow-bridge)` |
| **Links (light)** | `color: var(--rx-gold-dark)` |
| **Links (dark)** | `color: var(--rx-purple-light)` |
| **Nav links** | de muted para primario |
| **Table rows** | `background: var(--rx-light-muted)` (light) ou `var(--rx-surface-3)` (dark) |

Transicao padrao: `transition: all var(--rx-duration-fast) var(--rx-ease-out-expo)` (150ms).

### Focus

Indicador de focus visivel para navegacao por teclado:

```css
:focus-visible {
  outline: 2px solid var(--rx-purple);
  outline-offset: 2px;
}
```

- Cor do ring: `var(--rx-purple)` (`#6f32b1`).
- Espessura: `2px`.
- Offset: `2px`.
- Aplicar em todos os elementos interativos.
- Usar `:focus-visible` (nao `:focus`) para nao mostrar ring em cliques de mouse.

**Nota:** focus ring e purple (nao gold) porque foco e uma interacao de produto/tecnologia, nao institucional.

### Active

| Elemento | Comportamento |
|----------|--------------|
| **Botoes** | `transform: scale(0.98)` |
| **Links** | `color: var(--rx-gold-dark)` (light) ou `var(--rx-purple-dark)` (dark) |

### Disabled

```css
[disabled],
.rx-disabled {
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
| Navy `#1B2A4A` sobre branco `#FFFFFF` | ~11:1 | Excelente — texto primario em superficies claras |
| Branco `#FFFFFF` sobre navy `#1B2A4A` | ~11:1 | Excelente — headings e body em tema escuro |
| Gold `#c4993b` sobre branco `#FFFFFF` | ~3.3:1 | Decorativo only — texto grande (>=18px bold) e icones, NAO body text |
| Gold `#c4993b` sobre navy `#1B2A4A` | ~3.8:1 | Texto grande, botoes com peso 700+ e min 18px |
| Purple `#6f32b1` sobre branco `#FFFFFF` | ~5.2:1 | Passa AA — texto de qualquer tamanho. Mais versatil que gold |
| Branco `#FFFFFF` sobre purple `#6f32b1` | ~5.2:1 | Passa AA — botoes e badges purple com texto branco |
| Purple `#6f32b1` sobre navy `#1B2A4A` | ~2.2:1 | Falha — NAO usar purple como texto sobre navy |
| Branco `#FFFFFF` sobre gold gradient | ~3.1:1 | CTAs com peso 700+ e min 18px (botoes Primary) |

### Regras praticas

1. **Texto small (< 18px) em light:** usar navy (`--rx-text-inverse`) como cor de texto. Gold como texto decorativo only. Purple passa AA e pode ser usado em links e labels.
2. **Texto small (< 18px) em dark:** usar branco (`--rx-text`) como cor de texto. Purple NAO funciona como texto sobre navy — usar apenas em borders, icones, badges com fundo solido.
3. **CTAs gold:** texto branco, `font-weight: 700`, `font-size >= 1rem` (16px).
4. **CTAs purple:** texto branco — ratio melhor que gold, seguro em qualquer tamanho.
5. **Eyebrows:** `font-weight: 600`, `font-size: 0.75rem`. Gold aceito como decorativo com tracking expandido. Purple mais seguro.
6. **Semantic colors (success, error, warning):** sobre branco, todos passam AA para texto grande.

### Preferencias de usuario

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@media (prefers-color-scheme: dark) {
  :root { /* aplicar tokens dark como default */ }
}
```

### Checklist de acessibilidade

- [ ] Focus ring visivel (purple, 2px) em todos os interativos
- [ ] Todos os elementos interativos acessiveis por teclado (tab order logica)
- [ ] Imagens com `alt` descritivo (ou `alt=""` para decorativas)
- [ ] Landmark roles semanticos: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`
- [ ] `aria-label` em navegacoes (`<nav aria-label="Navegacao principal">`)
- [ ] `prefers-reduced-motion` respeitado
- [ ] `prefers-color-scheme` respeitado como default do tema
- [ ] Contraste minimo 4.5:1 para texto normal, 3:1 para texto grande
- [ ] Touch targets minimo 44x44px em mobile
- [ ] Gold nunca como cor de body text (< 18px) sobre branco
- [ ] Purple nunca como cor de texto sobre navy

---

## 8. Stack recomendada

| Plataforma | Stack | Tema default | Notas |
|------------|-------|--------------|-------|
| **Site institucional** (`resultx.app`) | React 19 + Vite 7 + TypeScript + Tailwind v4 | Light (adaptive) | Mesmo stack de emprega-mais-sites |
| **Propostas e materiais** | HTML/CSS estatico ou React | Light | Exportado em PDF quando necessario |
| **Dashboards internos** | React + Tailwind | Dark | Visualizacao de metricas e portfolio |
| **Apresentacoes/slides** | Canva ou HTML | Adaptive | Alternar light/dark por slide |

### Dependencias de design compartilhadas

- **Icones:** Lucide Icons (outline/stroke). Cor de destaque: gold (institucional) ou purple (produto). Cor neutra: `--rx-text-muted`.
- **Fontes:** Google Fonts (Sora + Inter + JetBrains Mono). Carregar via `<link>` com `font-display: swap`.
- **Tokens:** importar `tokens.css` ou replicar custom properties no projeto. O arquivo JSON serve como source-of-truth para tooling (Figma tokens, Style Dictionary, etc.).

### Relacao com marcas-filhas

| Marca | Heranca de ResultX | Tokens proprios |
|-------|-------------------|-----------------|
| **Emprega+** | Navy background, spacing, motion, typography stack | Gold accent, Light Glass, semantic colors |
| **Electia** | Navy background, spacing, motion, typography stack | Purple accent, Dark Glass, theory colors |
| **PdV** | Typography stack, motion | Gold warm, paleta propria |

ResultX nao sobrescreve os tokens das marcas-filhas. Os tokens `--rx-*` coexistem com `--emp-*` e `--electia-*` no ecossistema. O bridge gradient e exclusivo da ResultX.
