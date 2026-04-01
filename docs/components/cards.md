# Cards

Container components used to group related content with a subtle border, shadow, and hover interaction. Cards serve as the primary content container across dashboards, profiles, and detail views.

## Component Anatomy

```
.card [.card-accent]
  .card-eyebrow   (optional)
  .card-title      (optional)
  .card-text       (optional)
  [any content]
```

## Base Class

### `.card`

| Property | Value |
|----------|-------|
| `background` | `var(--bg-base)` |
| `border` | `1px solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `padding` | `var(--space-5) var(--space-6)` |
| `box-shadow` | `var(--shadow-sm)` |
| `transition` | `all var(--transition-base)` |

### Hover State

On hover, the card elevates and shifts upward:

| Property | Value |
|----------|-------|
| `box-shadow` | `var(--shadow-md)` |
| `transform` | `translateY(-2px)` |
| `border-color` | `var(--border-default)` |

## Variants

| Class | Effect |
|-------|--------|
| `.card-accent` | Sets `border-color: var(--border-accent)` to highlight the card with the accent color |

### `.card-accent` Hover

When `.card-accent` is hovered:

| Property | Value |
|----------|-------|
| `box-shadow` | `var(--shadow-glow)` |
| `border-color` | `rgba(29,78,216,0.35)` |

This produces a blue glow effect, drawing attention to the card as a primary interactive element.

## Sub-components

### `.card-eyebrow`

A small uppercase label displayed above the title, typically used for categories or types.

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-mono)` |
| `font-size` | `var(--text-xs)` |
| `letter-spacing` | `var(--tracking-wider)` |
| `text-transform` | `uppercase` |
| `color` | `var(--text-muted)` |
| `margin-bottom` | `var(--space-3)` |

### `.card-title`

The primary heading inside a card.

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-heading)` |
| `font-size` | `var(--text-xl)` |
| `font-weight` | `var(--font-semibold)` |
| `margin-bottom` | `var(--space-2)` |

### `.card-text`

Body text inside a card.

| Property | Value |
|----------|-------|
| `color` | `var(--text-secondary)` |
| `font-size` | `var(--text-sm)` |
| `line-height` | `var(--leading-relaxed)` |

## HTML Usage

### Basic card

```html
<div class="card">
  <div class="card-eyebrow">Assessment</div>
  <div class="card-title">Big Five Personality</div>
  <div class="card-text">
    Measures five broad dimensions of personality traits.
  </div>
</div>
```

### Accent card with glow effect

```html
<div class="card card-accent">
  <div class="card-eyebrow">Featured</div>
  <div class="card-title">MBTI Analysis</div>
  <div class="card-text">
    Cognitive function analysis with 16 personality types.
  </div>
</div>
```

### Card with custom content

```html
<div class="card">
  <div class="card-eyebrow">Stats</div>
  <div class="card-title">Team Overview</div>
  <div class="flex-row mb-4">
    <span class="badge badge-success">Active</span>
    <span class="badge badge-mbti">MBTI</span>
  </div>
  <div class="card-text">12 members assessed this month.</div>
</div>
```

### Cards in a grid

```html
<div class="grid-3">
  <div class="card"><!-- ... --></div>
  <div class="card card-accent"><!-- ... --></div>
  <div class="card"><!-- ... --></div>
</div>
```

## Tokens Used

- `--bg-base` (background)
- `--border-subtle`, `--border-default`, `--border-accent` (borders)
- `--radius-lg` (border-radius)
- `--space-2`, `--space-3`, `--space-5`, `--space-6` (spacing)
- `--shadow-sm`, `--shadow-md`, `--shadow-glow` (shadows)
- `--transition-base` (animation)
- `--font-heading`, `--font-mono` (typography)
- `--font-semibold` (font-weight)
- `--text-xs`, `--text-sm`, `--text-xl` (font-size)
- `--tracking-wider` (letter-spacing)
- `--leading-relaxed` (line-height)
- `--text-primary`, `--text-secondary`, `--text-muted` (text colors)

## Do / Don't

| Do | Don't |
|----|-------|
| Use `.card-accent` for primary or featured content | Don't apply `.card-accent` to every card -- it loses its emphasis |
| Use `.card-eyebrow` for category labels or metadata | Don't place long text in `.card-eyebrow` -- keep it short (1-3 words) |
| Combine cards with `.grid-2` or `.grid-3` for layouts | Don't nest `.card` inside another `.card` |
| Let the built-in hover animation work (shadow + lift) | Don't override `transform` on `.card` -- it conflicts with the hover effect |
| Use `.card-text` for descriptive body content | Don't use `.card-title` for body paragraphs -- it has heading styles |
