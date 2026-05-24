# PDV Design System — Dark Fintech Premium

Single source of truth: `client/src/index.css` (@theme inline)

## Brand Colors (v2.2 — Gold)

| Token | Value | Usage |
|-------|-------|-------|
| `brand-dark` | `#C49A3C` (hsl 41 54% 50%) | Primary — CTAs, links, accents |
| `brand-light` | `#D4AD55` (hsl 42 60% 58%) | Secondary — gradients, highlights |
| `brand-soft` | hsl(240 8% 5%) | Soft background for elevated areas |

## Background Scale (progressive ladder)

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `background` | 240 11% 4% | `#08080A` | Deepest — page background |
| `surface-1` | 240 10% 6% | `#0E0E11` | Sections, alternating BG |
| `surface-2` | 240 7% 8% | `#131316` | Cards (= `card`) |
| `surface-3` | 240 8% 12% | `#1C1C21` | Hover states |

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
- `--glass-bg`: `hsl(220 20% 10% / 0.6)`
- `--glass-border`: `hsl(0 0% 100% / 0.08)`
- `--glass-border-hover`: `hsl(0 0% 100% / 0.15)`
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
| `TestimonialSection` | `chat-bubbles` / `cards` | Social proof |
| `PricingSection` | Glass card + gradient bar | Pricing |
| `BonusGrid` | columns: 2/3/4 | Bonus items |
| `GuaranteeSection` | — | 7-day guarantee |
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

| Token | Hex | Uso |
|-------|-----|-----|
| Background | `#08080A` | Body e outer wrapper |
| Surface 1 | `#0E0E11` | Cards de topico, highlight blocks |
| Surface 2 | `#131316` | Product card, glass card |
| Border | `#26262D` | Divisores, bordas de cards |
| Gold Primary | `#C49A3C` | CTA button, links, labels, accents |
| Gold Light | `#D4AD55` | Hover state, gradient accent bar |
| Text Primary | `#FFFFFF` | Body copy, headings |
| Text Muted | `#8A8A96` | Subtitles, descriptions, footer links |
| Text Subtle | `#505058` | Legal text, copyright |

### Email Typography

| Elemento | Font | Size | Weight | Color |
|----------|------|------|--------|-------|
| H1 | Sora | 28px / 36px lh | 700 | `#FFFFFF` |
| H2 | Sora | 20px / 28px lh | 700 | `#FFFFFF` |
| Body | Inter | 16px / 26px lh | 400 | `#FFFFFF` |
| Label | Sora | 11px | 600 | `#C49A3C` uppercase |
| Subtitle | Inter | 15px / 24px lh | 400 | `#8A8A96` |
| Footer | Inter | 11px / 18px lh | 400 | `#505058` |
| Signature name | Sora | 16px | 700 | `#FFFFFF` |
| Signature role | Inter | 13px | 400 | `#8A8A96` |
| Signature tagline | Inter | 13px | 400 italic | `#C49A3C` |

### Email Components

| Componente | Estilo |
|------------|--------|
| **CTA Primary** | bg `#C49A3C`, text `#08080A`, bold 16px, padding 14px 32px, radius 8px |
| **CTA Secondary** | border `#C49A3C`, text `#C49A3C`, bold 14px, padding 12px 28px |
| **Highlight Block** | bg `#0E0E11`, border-left 3px `#C49A3C`, padding 20px 24px |
| **Glass Card** | bg `#131316`, border 1px `#26262D`, radius 12px, padding 24px |
| **Product Card** | Glass Card + gold gradient top bar (4px height) |
| **Topic Card** | bg `#0E0E11`, border 1px `#26262D`, radius 12px + gold label |
| **Edition Badge** | bg `#131316`, border `#26262D`, radius 20px, 11px uppercase |
| **Divider** | border-top 1px `#26262D`, margin 32px |
| **Gold Accent Line** | 60px x 2px `#C49A3C` centered (header) |

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
2. **Dark-first:** Nunca usar fundo branco. Manter hierarquia `background → surface-1 → surface-2`.
3. **Ouro com parcimônia:** CTA, labels, accent line, tagline. Nunca em body text.
4. **600px max:** Container fixo, responsivo para mobile (padding reduz de 40px para 20px).
5. **Inline styles:** Obrigatório para compatibilidade. Classes apenas como fallback.
6. **VML:** Buttons com VML roundrect para Outlook.

## Animations (`lib/animations.ts`)

| Export | Description |
|--------|-------------|
| `fadeInUp` | opacity 0→1, y 30→0 |
| `fadeIn` | opacity only |
| `scaleIn` | opacity + scale 0.95→1 |
| `staggerContainer` | staggerChildren: 0.12 |
| `slideInLeft` | opacity + x -30→0 |
| `slideInRight` | opacity + x 30→0 |
