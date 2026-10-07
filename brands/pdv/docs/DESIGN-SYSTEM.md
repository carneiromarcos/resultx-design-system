# PDV Design System — Dark Premium (navy + ouro)

Single source of truth: `client/src/index.css` no site (`empregamais/emprega-mais-pdv`) — hex vivem só em `:root` (`--pdv-*`) e os componentes usam as utilidades (`bg-background`, `text-brand-dark`…). Os valores espelham os tokens da marca em `brands/pdv/tokens/` (v2.5).

> **Atualizado em 2026-10-07:** paleta da v2.5 aplicada no site (PR #25 do `emprega-mais-pdv`). Fundo navy `#1B2A4A` (canônico), ouro `#c4993b` como ÚNICA cor de destaque, vermelho só para erro. `theme-color`/manifest = `#1B2A4A`. A paleta quase preta anterior (v2.2) está aposentada.

## Brand Colors (v2.5 — Gold)

| Token (site) | Token (marca) | Value | Usage |
|--------------|---------------|-------|-------|
| `brand-dark` | `--gold` / `--pdv-gold` | `#c4993b` | Primary — CTAs, links, accents |
| `brand-light` | `--gold-light` / `--pdv-gold-light` | `#d4ae54` | Secondary — gradients, highlights |
| `brand-soft` | `--surface-1` / `--pdv-surface-1` | `#1c2a4a` | Soft background for elevated areas |
| `primary-border` | `--gold-dark` / `--pdv-gold-dark` | `#a07b2a` | Primary button border |
| `destructive` | `--error` / `--pdv-error` | `#B83A3A` | Só erro / destructive. Nunca urgência ou escassez |

## Background Scale (progressive ladder)

| Token (site) | Token (marca) | Hex | Usage |
|--------------|---------------|-----|-------|
| `background` | `--bg` / `--pdv-bg` | `#1B2A4A` | Page background (navy do ecossistema Emprega+) |
| `surface-1` | `--surface-1` / `--pdv-surface-1` | `#1c2a4a` | Sections, alternating BG |
| `surface-2` / `card` | `--surface-2` / `--pdv-surface-2` | `#243661` | Cards |
| `surface-3` / `muted` / `border` | `--surface-3` / `--pdv-surface-3` | `#2d4378` | Hover states, borders |
| — / `border-hover` | `--surface-4` / `--pdv-surface-4` | `#36508f` | Active borders, inputs |

## Border Tokens

| Token | Usage |
|-------|-------|
| `border` | Default borders (hsl 220 10% 18%) |
| `border-hover` | Hover state borders |
| `primary-border` | Primary button border |
| `secondary-border` | Secondary button border |
| `destructive-border` | Destructive button border |
| `button-outline` | Outline button border |

## Glassmorphism

### CSS Variables
- `--glass-bg`: `rgb(36 54 97 / 0.6)` (surface-2 a 60%)
- `--glass-border`: `rgb(255 255 255 / 0.1)`
- `--glass-border-hover`: `rgb(255 255 255 / 0.18)`
- `--glass-blur`: `16px`

### Utility Classes
| Class | Effect |
|-------|--------|
| `.glass` | Base glass — bg + border + blur |
| `.glass-hover` | Border lightens on hover |
| `.glass-strong` | Stronger glass (0.85 opacity, 24px blur) — navbar |

## Glow Effects

| Class / Variable | Value |
|-----------------|-------|
| `.glow-brand` / `--glow-brand` | `0 0 20px brand-dark/25%` |
| `.glow-brand-lg` / `--glow-brand-lg` | `0 0 40px/35% + 0 0 80px/15%` |
| `--glow-cyan` | `0 0 20px brand-light/25%` |

## Gradients

| Variable | Value |
|----------|-------|
| `--gradient-brand` | `135deg brand-dark → brand-light` |
| `--gradient-brand-subtle` | Same at 15% opacity |
| `--gradient-radial-glow` | Radial ellipse brand-dark/15% → transparent |

## Typography

| Role | Font | Weight |
|------|------|--------|
| Headings | Sora | 600-700 |
| Body | Inter | 400-500 |

## Utility Classes

| Class | Effect |
|-------|--------|
| `.text-gradient-brand` | Gradient text (brand-dark → brand-light) |
| `.hover-elevate` | translateY(-1px) on hover |
| `.active-elevate-2` | translateY(0) on active |

## Component Variants

### Button (`button.tsx`)
- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- Sizes: `default`, `sm`, `lg`, `xl` (min-h-14), `icon`

### Card (`card.tsx`)
- Variants: `default` (bg-card + border), `glass`, `elevated` (bg-surface-2 + shadow-lg), `ghost`

### Section (`section.tsx`)
- Width: `narrow` (2xl), `default` (4xl), `wide` (6xl), `full` (7xl)
- `flush` prop removes padding

### PrimaryCTA (`primary-cta.tsx`)
- Base: Button `size="xl"` (min-h-14) + `px-8 py-3.5 text-lg`
- Gradient background, glow-brand, hover:glow-brand-lg
- Scale: hover 1.03, active 0.98
- Props: `href`, `onClick`, `fullWidth`

## Section Components (`components/sections/`)

| Component | Variants | Usage |
|-----------|----------|-------|
| `HeroSection` | `centered` / `split` | All pages |
| `ContextSection` | bg: `default` / `surface` | Text blocks |
| `FeatureGrid` | columns: 2/3, cardVariant: `default`/`glass` | Feature cards |
| `AudienceSection` | `checklist` / `for-not-for` | Target audience |
| `TestimonialSection` | `chat-bubbles` / `cards` | Social proof — avatar de iniciais (`InitialsAvatar`), nunca foto de banco nem rosto de IA |
| `PricingSection` | Glass card + gradient bar | Pricing |
| `BonusGrid` | columns: 2/3/4 | Bonus items |
| `GuaranteeSection` | — | Garantia de 7 dias (MAPA PdV) |
| `AuthoritySection` | — | Photo + bio layout |
| `CtaSection` | — | Final CTA with glow |

## Email Marketing Templates (`design-system/templates/email/`)

Templates HTML compatíveis com Brevo, Gmail, Apple Mail, Outlook. Dark-first, 600px max-width, inline styles, VML fallback para Outlook.

### Templates disponíveis

| Template | Arquivo | Uso |
|----------|---------|-----|
| **Base** | `pdv-email-base.html` | Carta pessoal (welcome, nurturing, storytelling) |
| **Newsletter** | `pdv-email-newsletter.html` | Newsletter semanal (edition badge + topic cards) |
| **Product CTA** | `pdv-email-product-cta.html` | Oferta de produto (story → product card + benefits) |

### Email Color Tokens

> **Migração pendente:** os templates HTML em `brands/pdv/email-templates/` e `brands/pdv/templates/email/` ainda usam a paleta anterior à v2.5 (fundo quase preto e ouro `#C49A3C`). A tabela abaixo é o alvo, alinhado aos tokens v2.5; migrar os templates é tarefa separada (a confirmar com o Marcos). Até lá, vale a regra: e-mail novo usa os valores desta tabela.

| Token | Token (marca) | Hex | Uso |
|-------|---------------|-----|-----|
| Background | `--bg` | `#1B2A4A` | Body e outer wrapper |
| Surface 1 | `--surface-1` | `#1c2a4a` | Cards de topico, highlight blocks |
| Surface 2 | `--surface-2` | `#243661` | Product card, glass card |
| Border | `--border` | `#26262D` | Divisores, bordas de cards |
| Gold Primary | `--gold` | `#c4993b` | CTA button, links, labels, accents |
| Gold Light | `--gold-light` | `#d4ae54` | Hover state, gradient accent bar |
| Text Primary | `--white` | `#FFFFFF` | Body copy, headings |
| Text Muted | `--gray-300` | `#A0A0AC` | Subtitles, descriptions, footer links |
| Text Subtle | `--gray-400` | `#7E7E8A` | Legal text, copyright (escolha do tom a confirmar com o Marcos) |

*Contraste dos tons de texto sobre `#1B2A4A` a validar (WCAG AA) ao migrar os templates.*

### Email Typography

| Elemento | Font | Size | Weight | Color |
|----------|------|------|--------|-------|
| H1 | Sora | 28px / 36px lh | 700 | `#FFFFFF` |
| H2 | Sora | 20px / 28px lh | 700 | `#FFFFFF` |
| Body | Inter | 16px / 26px lh | 400 | `#FFFFFF` |
| Label | Sora | 11px | 600 | `#c4993b` uppercase |
| Subtitle | Inter | 15px / 24px lh | 400 | `#A0A0AC` |
| Footer | Inter | 11px / 18px lh | 400 | `#7E7E8A` |
| Signature name | Sora | 16px | 700 | `#FFFFFF` |
| Signature role | Inter | 13px | 400 | `#A0A0AC` |
| Signature tagline | Inter | 13px | 400 italic | `#c4993b` |

### Email Components

| Componente | Estilo |
|------------|--------|
| **CTA Primary** | bg `#c4993b`, text `#1B2A4A`, bold 16px, padding 14px 32px, radius 8px |
| **CTA Secondary** | border `#c4993b`, text `#c4993b`, bold 14px, padding 12px 28px |
| **Highlight Block** | bg `#1c2a4a`, border-left 3px `#c4993b`, padding 20px 24px |
| **Glass Card** | bg `#243661`, border 1px `#26262D`, radius 12px, padding 24px |
| **Product Card** | Glass Card + gold gradient top bar (4px height) |
| **Topic Card** | bg `#1c2a4a`, border 1px `#26262D`, radius 12px + gold label |
| **Edition Badge** | bg `#243661`, border `#26262D`, radius 20px, 11px uppercase |
| **Divider** | border-top 1px `#26262D`, margin 32px |
| **Gold Accent Line** | 60px x 2px `#c4993b` centered (header) |

### Estrutura padrão

```
Header:   Logo horizontal (220px) + gold accent line
Body:     Greeting → Content → CTA → Signature
Footer:   Social links | Legal | Unsubscribe + Mirror
```

### Signature padrão

```
Marcos Carneiro          (Sora 16px bold, white)
Fundador, Profissional de Valor  (Inter 13px, muted)
Forjando Vencedores.     (Inter 13px italic, gold)
```

### Variáveis Brevo

- `{{contact.PRIMEIRO_NOME}}` — Nome do contato
- `{{ unsubscribe }}` — Link de descadastro (Brevo auto)
- `{{ mirror }}` — Link "ver no navegador" (Brevo auto)

### Regras de uso

1. **Tom:** Carta pessoal do Marcos. Provocador, metódico, verdade. Estrutura PAID.
2. **Dark-first (navy):** Nunca usar fundo branco. Manter hierarquia `background → surface-1 → surface-2`.
3. **Ouro com parcimônia:** CTA, labels, accent line, tagline. Nunca em body text.
4. **600px max:** Container fixo, responsivo para mobile (padding reduz de 40px para 20px).
5. **Inline styles:** Obrigatório para compatibilidade. Classes apenas como fallback.
6. **VML:** Buttons com VML roundrect para Outlook.
7. **Verdade e fé (07/10/2026):** sem escassez artificial nem número sem fonte; Mentoria retirada (não ofertar); Workshop às quintas, 8h30 (horário de Brasília); identidade católica sóbria, citações de documentos da Igreja literais e com §. Detalhes no `BRAND-BOOK.md`.

## Animations (`lib/animations.ts`)

| Export | Description |
|--------|-------------|
| `fadeInUp` | opacity 0→1, y 30→0 |
| `fadeIn` | opacity only |
| `scaleIn` | opacity + scale 0.95→1 |
| `staggerContainer` | staggerChildren: 0.12 |
| `slideInLeft` | opacity + x -30→0 |
| `slideInRight` | opacity + x 30→0 |
