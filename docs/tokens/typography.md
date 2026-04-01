# Typography

Typography tokens for the ResultX App Design System. Font families, line heights, letter spacing, and weights are inherited from `tokens-base.css` (shared across all Emprega+ design systems). Font sizes are overridden in the App DS for data-dense UI requirements.

---

## Font Families

Defined in `tokens-base.css`. Shared across all design systems.

| Token | Value | Usage |
|-------|-------|-------|
| `--font-heading` | `'Sora', sans-serif` | All headings (h1-h6) |
| `--font-body` | `'Inter', sans-serif` | Body text, UI elements |
| `--font-sans` | `'Inter', sans-serif` | Alias for Tailwind compatibility (Sites DS) |
| `--font-mono` | `'JetBrains Mono', monospace` | Code blocks, technical data, `<code>`, `<kbd>`, `<pre>` |

### Base Layer Defaults

The `@layer emprega-base` sets these automatically:

| Element | Family | Weight | Letter Spacing | Line Height |
|---------|--------|--------|---------------|-------------|
| `h1`-`h6` | `--font-heading` | `--weight-semibold` (600) | `--tracking-tight` (-0.02em) | `--leading-snug` (1.2) |
| `body` | `--font-body` | `--weight-regular` (400) | (default) | `--leading-normal` (1.5) |
| `code`, `kbd`, `pre`, `samp` | `--font-mono` | (default) | (default) | (default) |

---

## Font Sizes

The App DS overrides several base sizes for its data-dense dashboard UI. The table below shows both the App DS value and the base value for comparison.

| Token | App DS Value | Base Value | Px (App DS) | Usage |
|-------|-------------|-----------|-------------|-------|
| `--text-2xs` | `0.625rem` | -- | 10px | Micro labels (App DS exclusive) |
| `--text-xs` | -- | `0.6875rem` | 11px | Micro labels, badges |
| `--text-sm` | -- | `0.8125rem` | 13px | Metadata, captions |
| `--text-base` | `0.9375rem` | `1rem` | 15px (vs 16px) | Body text |
| `--text-lg` | `1.0625rem` | `1.25rem` | 17px (vs 20px) | Body large, card titles |
| `--text-xl` | `1.25rem` | `1.5rem` | 20px (vs 24px) | Section headings |
| `--text-2xl` | `1.5rem` | `1.75rem` | 24px (vs 28px) | H2 mobile |
| `--text-3xl` | `1.875rem` | `2.25rem` | 30px (vs 36px) | H1 mobile / H2 desktop |
| `--text-4xl` | `2.25rem` | `2.75rem` | 36px (vs 44px) | H2 desktop |
| `--text-5xl` | -- | `3rem` | 48px | Display numbers |
| `--text-display` | `3rem` | -- | 48px | Dashboard display (App DS exclusive) |
| `--text-hero` | -- | `4.75rem` | 76px | Hero heading (PdV only) |

> **Why the overrides?** The App DS serves data-dense dashboards and assessment UIs where space is at a premium. Each size step is smaller than the base to fit more content without sacrificing readability.

---

## Font Weights

The base system defines weight tokens (`--weight-*`). The App DS provides backward-compatible aliases (`--font-*`) because 50+ existing component references use the `--font-` prefix.

### Base Weights (from `tokens-base.css`)

| Token | Value | Usage |
|-------|-------|-------|
| `--weight-regular` | `400` | Body text, paragraphs |
| `--weight-medium` | `500` | Labels, navigation items |
| `--weight-semibold` | `600` | Headings, emphasized text |
| `--weight-bold` | `700` | Strong emphasis, CTAs |
| `--weight-extrabold` | `800` | Hero headings, display text |

### App DS Aliases (from `tokens.css`)

| Alias Token | Resolves To | Value |
|-------------|------------|-------|
| `--font-light` | (direct) | `300` |
| `--font-regular` | `var(--weight-regular)` | `400` |
| `--font-medium` | `var(--weight-medium)` | `500` |
| `--font-semibold` | `var(--weight-semibold)` | `600` |
| `--font-bold` | `var(--weight-bold)` | `700` |

> **Note:** `--font-light` (300) is exclusive to the App DS and not present in the base weight scale. Use it sparingly for subtle de-emphasis in dense UIs.

---

## Line Heights

Defined in `tokens-base.css`. Shared across all design systems.

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-none` | `1` | Icons, single-line badges |
| `--leading-tight` | `1.1` | Large display headings |
| `--leading-snug` | `1.2` | Standard headings (h1-h6 default) |
| `--leading-normal` | `1.5` | Body text (default) |
| `--leading-relaxed` | `1.6` | Long-form content, descriptions |
| `--leading-loose` | `1.7` | Dark mode body text (improves readability on dark surfaces) |

---

## Letter Spacing

Defined in `tokens-base.css`. Shared across all design systems.

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tighter` | `-0.03em` | Hero display headings |
| `--tracking-tight` | `-0.02em` | Standard headings (h1-h6 default) |
| `--tracking-normal` | `0` | Body text (default) |
| `--tracking-wide` | `0.05em` | Labels, badges, small caps |
| `--tracking-wider` | `0.1em` | Eyebrow text, overline labels |
| `--tracking-widest` | `0.15em` | PdV-style eyebrows, uppercase labels |

---

## Usage Guidelines

### Do

- Use `--font-heading` for all headings and `--font-body` for all body text.
- Use the `--font-*` aliases in App DS components for consistency with existing code.
- Use `--leading-loose` for body text in dark theme to improve legibility.
- Use `--tracking-wide` or `--tracking-wider` for uppercase labels and badges.

### Don't

- Don't use `--text-hero` or `--text-5xl` in the App DS. These sizes are designed for marketing pages (PdV/Sites), not dashboards.
- Don't mix `--weight-*` and `--font-*` naming in the same component. Pick one convention.
- Don't use `--font-light` (300) for body text. It was designed for subtle de-emphasis only and may fail WCAG contrast requirements on certain backgrounds.
- Don't override font families at the component level. All typography must flow from the token system.
