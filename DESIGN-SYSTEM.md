# ResultX Design System v2.1.1

> Design System multi-produto e multi-theme para o ecossistema **ResultX**.
> Em produção: **resultx.app** (site comercial), **Electia** (assessments SaaS), **IMO** (B2G), **Editais**.

## Filosofia

Este DS atende **dois universos** com a mesma fundação de tokens:
- **Aplicações de produto** — dashboards, CRUDs, perfis, formulários, testes, charts
- **Surfaces comerciais** — landing sections com mockups dashboard, showcases visuais

**Princípios v2.1:**
1. **Theme-aware** — 5 identidades opt-in via `data-theme` (`dark`, `light`, `premium-light`, `sober-dark`, `vibrant-dark`); zero refactor pra trocar visual
2. **Token-driven** — zero valores hardcoded; cores, espaços, tipografia, sombras, motion tudo via custom properties
3. **Data-dense** — UI otimizada para exibir muitos dados sem sobrecarregar (data-cards layer com 10 componentes)
4. **WCAG AA** — todo theme novo é validado em contraste antes de produção
5. **Backward compatible** — token names preservados entre versões; consumidores não precisam refactor para upgrade
6. **Multi-product** — uma fonte de verdade para visual cross-projetos

**O que mudou da v2.0:**
- 3 themes adicionais (premium-light, sober-dark, vibrant-dark) opt-in
- Layer Data Layer (`.dl-*`) com 10 componentes para dashboards/visualização
- Gradient palette compartilhada (5 brand gradients) + delta semantics
- Heatmap dot scale para visualização de atividade

**Documentação detalhada:**
- `docs/components/data-cards.md` — os 10 componentes Data Layer
- `docs/tokens/gradients.md` — gradient palette + delta tokens
- `tokens/themes/preview.html` — preview standalone dos 5 themes side-by-side

---

## 1. Color Tokens

### 1.1 Backgrounds

| Token | Hex | Uso |
|-------|-----|-----|
| `--bg-base` | `#0B0E14` | Background principal (mais escuro que Electia, alinhado com Mentes Sintéticas) |
| `--bg-surface-1` | `#111620` | Seções, áreas alternadas |
| `--bg-surface-2` | `#161B26` | Cards, containers |
| `--bg-surface-3` | `#1C2333` | Hover states, elementos elevados |
| `--bg-overlay` | `rgba(11, 14, 20, 0.85)` | Modais, overlays |

### 1.2 Borders

| Token | Hex | Uso |
|-------|-----|-----|
| `--border-subtle` | `#1E2736` | Bordas padrão (low contrast) |
| `--border-default` | `#2A3444` | Bordas visíveis |
| `--border-strong` | `#3D4A5C` | Bordas de destaque, focus |
| `--border-accent` | `rgba(45, 212, 191, 0.2)` | Bordas com glow teal |

### 1.3 Text

| Token | Hex | Uso |
|-------|-----|-----|
| `--text-primary` | `#E6EDF3` | Headings, texto principal |
| `--text-secondary` | `#8B949E` | Texto de suporte, descrições |
| `--text-muted` | `#6E7681` | Metadata, timestamps, placeholders |
| `--text-inverse` | `#0B0E14` | Texto sobre accent colors |

### 1.4 Accent Colors

| Token | Hex | Uso |
|-------|-----|-----|
| `--accent-primary` | `#2DD4BF` | CTA primário, links, estados ativos |
| `--accent-primary-hover` | `#5EEAD4` | Hover do accent |
| `--accent-primary-muted` | `rgba(45, 212, 191, 0.15)` | Backgrounds suaves de accent |
| `--accent-secondary` | `#60A5FA` | Ações secundárias |

### 1.5 Semantic Colors

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-success` | `#22C55E` | Sucesso, positivo, aprovado |
| `--color-warning` | `#F59E0B` | Alerta, atenção |
| `--color-error` | `#EF4444` | Erro, destrutivo |
| `--color-info` | `#3B82F6` | Informativo |

### 1.6 Theory Colors (Assessment-Specific)

Cores exclusivas para identificar cada teoria comportamental — usadas em badges, barras, charts e cards.

| Token | Hex | Teoria | Label |
|-------|-----|--------|-------|
| `--theory-mbti` | `#22D3EE` | MBTI | Cyan |
| `--theory-enneagram` | `#A78BFA` | Eneagrama | Purple |
| `--theory-bigfive` | `#60A5FA` | Big Five (OCEAN) | Blue |
| `--theory-disc` | `#FB923C` | DISC | Orange |
| `--theory-lesenne` | `#F472B6` | Le Senne | Pink |
| `--theory-jung` | `#FBBF24` | Arquétipos de Jung | Amber/Gold |

### 1.7 DISC Dimension Colors

| Token | Hex | Dimensão |
|-------|-----|----------|
| `--disc-d` | `#EF4444` | Dominância (vermelho) |
| `--disc-i` | `#F59E0B` | Influência (amarelo) |
| `--disc-s` | `#22C55E` | Estabilidade (verde) |
| `--disc-c` | `#3B82F6` | Conformidade (azul) |

### 1.8 MBTI Axis Colors

| Token | Hex | Eixo |
|-------|-----|------|
| `--mbti-ei` | `#F59E0B` | Extroversão / Introversão |
| `--mbti-sn` | `#6366F1` | Sensação / Intuição |
| `--mbti-tf` | `#0EA5E9` | Pensamento / Sentimento |
| `--mbti-jp` | `#10B981` | Julgamento / Percepção |

### 1.9 Big Five Dimension Colors

| Token | Hex | Dimensão |
|-------|-----|----------|
| `--bigfive-o` | `#6366F1` | Abertura (Openness) |
| `--bigfive-c` | `#0EA5E9` | Conscienciosidade |
| `--bigfive-e` | `#F59E0B` | Extroversão |
| `--bigfive-a` | `#10B981` | Amabilidade |
| `--bigfive-n` | `#EF4444` | Neuroticismo |

---

## 2. Typography

### 2.1 Font Families

| Token | Value | Uso |
|-------|-------|-----|
| `--font-heading` | `'Sora', sans-serif` | Headings, títulos de card, nomes |
| `--font-body` | `'Inter', sans-serif` | Body text, labels, UI elements |
| `--font-mono` | `'JetBrains Mono', monospace` | Código, IDs, scores numéricos |

### 2.2 Font Sizes (Escala)

| Token | Size | Line Height | Uso |
|-------|------|-------------|-----|
| `--text-xs` | 11px | 1.4 | Micro-labels, badges |
| `--text-sm` | 13px | 1.5 | Metadata, timestamps |
| `--text-base` | 15px | 1.6 | Body text padrão |
| `--text-lg` | 17px | 1.5 | Labels de seção |
| `--text-xl` | 20px | 1.4 | Títulos de card |
| `--text-2xl` | 24px | 1.3 | Headings de seção |
| `--text-3xl` | 30px | 1.2 | Page headings |
| `--text-4xl` | 36px | 1.1 | Hero numbers, scores grandes |
| `--text-display` | 48px | 1.0 | Display numbers (como "8.5", "2.4X") |

### 2.3 Font Weights

| Token | Value | Uso |
|-------|-------|-----|
| `--font-light` | 300 | Textos longos, descrições |
| `--font-regular` | 400 | Body padrão |
| `--font-medium` | 500 | Labels, UI elements |
| `--font-semibold` | 600 | Headings, emphasis |
| `--font-bold` | 700 | Títulos fortes, scores |

### 2.4 Letter Spacing

| Token | Value | Uso |
|-------|-------|-----|
| `--tracking-tight` | -0.02em | Headings grandes |
| `--tracking-normal` | 0 | Body text |
| `--tracking-wide` | 0.05em | Labels uppercase |
| `--tracking-wider` | 0.1em | Eyebrows, section labels ("SOBRE A MENTE") |

---

## 3. Spacing

Escala baseada em 4px.

| Token | Value | Uso |
|-------|-------|-----|
| `--space-1` | 4px | Micro gaps |
| `--space-2` | 8px | Inner padding tight |
| `--space-3` | 12px | Gaps entre elementos inline |
| `--space-4` | 16px | Padding padrão de cards |
| `--space-5` | 20px | Gap entre cards |
| `--space-6` | 24px | Seções internas |
| `--space-8` | 32px | Gap entre seções |
| `--space-10` | 40px | Seções maiores |
| `--space-12` | 48px | Page-level spacing |
| `--space-16` | 64px | Hero spacing |

---

## 4. Border Radius

| Token | Value | Uso |
|-------|-------|-----|
| `--radius-sm` | 4px | Badges, tags |
| `--radius-md` | 8px | Inputs, small buttons |
| `--radius-lg` | 12px | Cards, containers |
| `--radius-xl` | 16px | Modals, large cards |
| `--radius-2xl` | 24px | Pill buttons, avatars |
| `--radius-full` | 9999px | Avatares circulares, dots |

---

## 5. Shadows & Elevation

| Token | Value | Uso |
|-------|-------|-----|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Elementos sutis |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.4)` | Cards padrão |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.5)` | Modais, popovers |
| `--shadow-glow-teal` | `0 0 20px rgba(45,212,191,0.15)` | Glow accent sutil |
| `--shadow-glow-teal-lg` | `0 0 40px rgba(45,212,191,0.2), 0 0 80px rgba(45,212,191,0.08)` | Glow forte (focus, hover) |
| `--shadow-glow-theory` | Variável por teoria | Glow usando a cor da teoria |

---

## 6. Glassmorphism

3 níveis de glassmorphism para hierarquia visual.

| Level | Token | Background | Blur | Border | Uso |
|-------|-------|-----------|------|--------|-----|
| **Subtle** | `--glass-subtle` | `rgba(22,27,38,0.4)` | 12px | `rgba(255,255,255,0.04)` | Fundo de seções |
| **Standard** | `--glass-standard` | `rgba(22,27,38,0.6)` | 16px | `rgba(255,255,255,0.06)` | Cards, containers |
| **Strong** | `--glass-strong` | `rgba(22,27,38,0.85)` | 24px | `rgba(255,255,255,0.08)` | Navbar, modais, sidebars |

---

## 7. Transitions & Animations

| Token | Value | Uso |
|-------|-------|-----|
| `--transition-fast` | `150ms ease` | Hover color changes |
| `--transition-base` | `200ms ease` | Hover transforms |
| `--transition-slow` | `300ms ease-out` | Modal enter/exit |
| `--transition-spring` | `500ms cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy interactions |

### Keyframe Animations

| Name | Uso |
|------|-----|
| `fade-in` | Elementos entrando na tela |
| `fade-in-up` | Cards carregando (translateY 16px → 0) |
| `slide-in-right` | Sidebar, painéis laterais |
| `scale-in` | Modais, popovers |
| `pulse-glow` | Status indicators, loading |
| `progress-fill` | Barras de progresso animando para o valor |

---

## 8. Component Patterns

### 8.1 Cards

```
┌─────────────────────────────────────┐
│ SECTION LABEL          tracking-wider│  ← eyebrow uppercase
│                                      │
│ Content area                         │  ← --text-base, --text-secondary
│                                      │
│ ████████████████░░░░  85            │  ← progress bar + score
│ ██████████████░░░░░░  72            │
└─────────────────────────────────────┘
  bg: --glass-standard
  border: --border-subtle (ou --border-accent para card ativo)
  radius: --radius-lg
  padding: --space-5 --space-6
```

### 8.2 Theory Badge

```
┌──────────────┐
│ ● MBTI       │  ← dot com --theory-mbti, text uppercase --tracking-wide
└──────────────┘
  bg: rgba(theory-color, 0.1)
  border: rgba(theory-color, 0.3)
  radius: --radius-sm
  font: --text-xs --font-medium
```

### 8.3 Progress Bar

```
Label                    Score/100
████████████████░░░░░░░░░  75

  track-bg: --bg-surface-1
  fill: linear-gradient(90deg, teoria-color, teoria-color-lighter)
  height: 6px (sm) | 8px (md) | 12px (lg)
  radius: --radius-full
  animation: progress-fill 800ms ease-out
```

### 8.4 Tabs (com ícones)

```
[🔲 Geral] [📊 DNA] [💬 Comunicação] [📜 História] [📦 Artefatos]
   ↑ active
   border-bottom: 2px --accent-primary
   color: --accent-primary

   inactive:
   color: --text-muted
   border-bottom: 2px transparent
```

### 8.5 Score Display (Hero Numbers)

```
┌─────────────────┐
│  APEX SCORE      │  ← eyebrow --text-xs --tracking-wider --text-muted
│  8.5 /100        │  ← --text-display --font-bold + --text-sm --text-muted
│  ████             │  ← mini progress bar
└─────────────────┘
  bg: --glass-standard
  border: --border-subtle
```

### 8.6 Sidebar Navigation

```
┌──────────────────┐
│  Logo + Brand     │
│──────────────────│
│  ▸ Dashboard      │  ← inactive: --text-secondary
│  ▸ Cargos         │
│  ▸ Candidatos     │  ← active: --accent-primary, bg: --bg-surface-3
│  ▸ Colaboradores  │     border-right: 2px --accent-primary
│  ▸ Testes         │
│  ▸ Conversas      │
│──────────────────│
│  ⚙ Config        │
└──────────────────┘
  bg: --glass-strong
  width: 240px (expanded) | 64px (collapsed)
```

### 8.7 Radar Chart (Big Five / OCEAN)

```
        O (72)
       /    \
  N (65)    C (93)
       \    /
   A (35)─E (65)

  line-color: rgba(255,255,255,0.8)
  fill: rgba(accent-primary, 0.15)
  grid: rgba(255,255,255,0.05)
  labels: --text-sm --font-mono --text-secondary
  bg: --bg-surface-2
```

### 8.8 Profile Header

```
┌──────────────────────────────────────────────────┐
│ [Avatar]  NOME COMPLETO                          │
│           Skill Principal                        │
│           ◇ SUBTÍTULO/ESPECIALIDADE              │
│                                                  │
│  ┌─SCORE──┐  ┌─DATA──┐  ┌─TOP SKILL────────┐   │
│  │  8.5   │  │  9    │  │ Business Strategy│   │
│  │  /100  │  │  files│  │ ●●●● LVL 5      │   │
│  └────────┘  └───────┘  └──────────────────┘   │
│                                                  │
│ [Geral] [DNA] [Comunicação] [História] [...]     │
└──────────────────────────────────────────────────┘
```

---

## 9. Layout Tokens

| Token | Value | Uso |
|-------|-------|-----|
| `--sidebar-width` | 240px | Sidebar expanded |
| `--sidebar-collapsed` | 64px | Sidebar collapsed |
| `--header-height` | 56px | Top header |
| `--content-max-width` | 1280px | Max width da área de conteúdo |
| `--grid-gap` | 20px | Gap padrão do grid |
| `--card-min-width` | 300px | Largura mínima de cards em grid |

### Grid Patterns

| Pattern | Colunas | Uso |
|---------|---------|-----|
| **Dashboard** | `repeat(auto-fit, minmax(300px, 1fr))` | Cards de métricas |
| **Profile** | `2fr 1fr` | Conteúdo principal + sidebar |
| **Theory Cards** | `repeat(3, 1fr)` | Cards MBTI + Eneagrama + DISC |
| **Full Width** | `1fr` | Tabelas, listas |

---

## 10. Breakpoints

| Token | Value | Uso |
|-------|-------|-----|
| `--bp-sm` | 640px | Mobile landscape |
| `--bp-md` | 768px | Tablet |
| `--bp-lg` | 1024px | Desktop (sidebar collapses below) |
| `--bp-xl` | 1280px | Wide desktop |
| `--bp-2xl` | 1536px | Ultra-wide |

---

## 11. Z-Index Scale

| Token | Value | Uso |
|-------|-------|-----|
| `--z-base` | 0 | Conteúdo normal |
| `--z-dropdown` | 10 | Dropdowns, popovers |
| `--z-sticky` | 20 | Headers sticky, tabs |
| `--z-sidebar` | 30 | Sidebar navigation |
| `--z-overlay` | 40 | Overlay backgrounds |
| `--z-modal` | 50 | Modais |
| `--z-toast` | 60 | Toasts, notificações |
| `--z-tooltip` | 70 | Tooltips |

---

## 12. Relação com Outros DSs

| DS | Escopo | Relação |
|----|--------|---------|
| **Sites Emprega+** | Site institucional (light) | Compartilha fontes (Sora + Inter) e brand identity |
| **PDV** | Comunidade B2C (dark + gold) | Compartilha dark theme e glassmorphism |
| **App (este)** | Sistemas e aplicações | Dark + teal, otimizado para data-dense UIs |

**Pontos de convergência:**
- Tipografia: Sora (headings) + Inter (body) — **compartilhado entre os 3**
- Glassmorphism: presente nos 3, com intensidades diferentes
- Brand colors: gold (Sites/PDV) vs teal (App) — diferenciados por contexto

---

## 13. Referências Visuais

- **Mentes Sintéticas / Cognitive Core** — Inspiração principal para layout de perfis, cards de teorias, progress bars, radar charts
- **Protótipo Electia** (`emprega-mais-saas/prototype/index.html`) — Base original dos tokens
- GitHub Dark Theme — Palette de backgrounds e text colors

---

## 14. Social Media Templates (Sistema Separado)

O arquivo `social-media-templates.html` e o diretório `social-media-png/` **não fazem parte deste Design System**. Eles compõem um sistema independente de geração de criativos para redes sociais usando theme light (navy `#1B2A4A` + gold `#C49A3C`), alinhado com a identidade da marca Emprega+ institucional — não com o App DS (dark + teal).

- **Renderer:** `render-templates.mjs` (Playwright → PNG)
- **Formatos:** feed 1080x1080, banners, stories, thumbnails, WhatsApp cards
- **Tokens:** próprios (inline no HTML), não consomem `tokens.css`
