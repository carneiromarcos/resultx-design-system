# Badges

Small label components used to indicate status, category, or theory type. Badges come in two families: **theory badges** (assessment-specific) and **status badges** (semantic states). A separate **icon badge** component provides colored icon containers.

## Component Anatomy

### Theory / Status Badge

```
.badge .badge-{variant}
  ::before    (auto-generated 6px dot)
  Label text
```

### Icon Badge

```
.icon-badge [.icon-badge-sm] .icon-badge-{color}
  icon/emoji
```

### Tag

```
.tag .tag-{color}
  Label text
```

## Badge Base

### `.badge`

| Property | Value |
|----------|-------|
| `display` | `inline-flex` |
| `align-items` | `center` |
| `gap` | `var(--space-2)` |
| `padding` | `var(--space-1) var(--space-3)` |
| `border-radius` | `var(--radius-full)` |
| `font-size` | `var(--text-xs)` |
| `font-weight` | `var(--font-semibold)` |
| `text-transform` | `uppercase` |
| `letter-spacing` | `var(--tracking-wide)` |
| `transition` | `all var(--transition-fast)` |

Every `.badge` automatically generates a `6px` colored dot via `::before`.

## Theory Badge Variants

| Class | Background | Text Color | Border | Token |
|-------|-----------|------------|--------|-------|
| `.badge-mbti` | `rgba(8,145,178,0.15)` | `var(--theory-mbti)` | `1px solid rgba(8,145,178,0.25)` | `--theory-mbti` |
| `.badge-enneagram` | `rgba(124,58,237,0.15)` | `var(--theory-enneagram)` | `1px solid rgba(124,58,237,0.25)` | `--theory-enneagram` |
| `.badge-bigfive` | `rgba(37,99,235,0.15)` | `var(--theory-bigfive)` | `1px solid rgba(37,99,235,0.25)` | `--theory-bigfive` |
| `.badge-disc` | `rgba(234,88,12,0.15)` | `var(--theory-disc)` | `1px solid rgba(234,88,12,0.25)` | `--theory-disc` |
| `.badge-lesenne` | `rgba(219,39,119,0.15)` | `var(--theory-lesenne)` | `1px solid rgba(219,39,119,0.25)` | `--theory-lesenne` |
| `.badge-jung` | `rgba(217,119,6,0.15)` | `var(--theory-jung)` | `1px solid rgba(217,119,6,0.25)` | `--theory-jung` |

The `::before` dot color matches the text color token for each theory.

## Status Badge Variants

| Class | Background | Text Color | Border | Token |
|-------|-----------|------------|--------|-------|
| `.badge-success` | `var(--color-success-bg)` | `var(--color-success)` | `1px solid rgba(22,163,74,0.2)` | `--color-success` |
| `.badge-warning` | `var(--color-warning-bg)` | `var(--color-warning)` | `1px solid rgba(217,119,6,0.2)` | `--color-warning` |
| `.badge-error` | `var(--color-error-bg)` | `var(--color-error)` | `1px solid rgba(220,38,38,0.2)` | `--color-error` |

## Badge Size Variants

| Class | Effect |
|-------|--------|
| `.badge-table` | `font-size: 10px; padding: 2px 8px` -- compact variant for use inside table cells |

## Icon Badges

Colored square containers for icons or emoji.

### `.icon-badge`

| Property | Value |
|----------|-------|
| `width / height` | `44px` |
| `border-radius` | `var(--radius-lg)` |
| `display` | `flex` / `align-items: center` / `justify-content: center` |
| `font-size` | `20px` |

### `.icon-badge-sm`

| Property | Value |
|----------|-------|
| `width / height` | `36px` |
| `border-radius` | `var(--radius-md)` |
| `font-size` | `16px` |

### Icon Badge Color Variants

| Class | Background | Text Color | Token Reference |
|-------|-----------|------------|-----------------|
| `.icon-badge-blue` | `rgba(29,78,216,0.12)` | `var(--accent-primary)` | `--accent-primary` |
| `.icon-badge-purple` | `rgba(124,58,237,0.12)` | `var(--theory-enneagram)` | `--theory-enneagram` |
| `.icon-badge-green` | `rgba(22,163,74,0.12)` | `var(--color-success)` | `--color-success` |
| `.icon-badge-orange` | `rgba(234,88,12,0.12)` | `var(--theory-disc)` | `--theory-disc` |
| `.icon-badge-pink` | `rgba(219,39,119,0.12)` | `var(--theory-lesenne)` | `--theory-lesenne` |
| `.icon-badge-cyan` | `rgba(8,145,178,0.12)` | `var(--theory-mbti)` | `--theory-mbti` |
| `.icon-badge-gold` | `rgba(196,154,60,0.12)` | `var(--accent-secondary)` | `--accent-secondary` |

## Tags

Pill-shaped labels without the `::before` dot. Used for categorization.

### `.tag`

| Property | Value |
|----------|-------|
| `display` | `inline-flex` |
| `align-items` | `center` |
| `padding` | `var(--space-1) var(--space-3)` |
| `border-radius` | `var(--radius-full)` |
| `font-size` | `var(--text-xs)` |
| `font-weight` | `var(--font-semibold)` |

### Tag Color Variants

| Class | Background | Text Color |
|-------|-----------|------------|
| `.tag-blue` | `rgba(29,78,216,0.10)` | `var(--accent-primary)` |
| `.tag-purple` | `rgba(124,58,237,0.10)` | `var(--theory-enneagram)` |
| `.tag-green` | `rgba(22,163,74,0.10)` | `var(--color-success)` |
| `.tag-orange` | `rgba(234,88,12,0.10)` | `var(--theory-disc)` |
| `.tag-pink` | `rgba(219,39,119,0.10)` | `var(--theory-lesenne)` |

## HTML Usage

### Theory badges

```html
<span class="badge badge-mbti">MBTI</span>
<span class="badge badge-enneagram">Enneagram</span>
<span class="badge badge-bigfive">Big Five</span>
<span class="badge badge-disc">DISC</span>
<span class="badge badge-lesenne">Lesenne</span>
<span class="badge badge-jung">Jung</span>
```

### Status badges

```html
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-error">Failed</span>
```

### Compact badge for tables

```html
<span class="badge badge-mbti badge-table">MBTI</span>
```

### Icon badges

```html
<div class="icon-badge icon-badge-blue">&#128202;</div>
<div class="icon-badge icon-badge-purple">&#9733;</div>
<div class="icon-badge-sm icon-badge icon-badge-green">&#10004;</div>
```

### Tags

```html
<span class="tag tag-blue">Technical</span>
<span class="tag tag-purple">Behavioral</span>
<span class="tag tag-green">Completed</span>
```

### Badge row

```html
<div class="flex-row">
  <span class="badge badge-mbti">MBTI</span>
  <span class="badge badge-disc">DISC</span>
  <span class="badge badge-success">Active</span>
</div>
```

## Tokens Used

- `--space-1`, `--space-2`, `--space-3` (spacing)
- `--radius-full`, `--radius-lg`, `--radius-md` (border-radius)
- `--text-xs` (font-size)
- `--font-semibold` (font-weight)
- `--tracking-wide` (letter-spacing)
- `--transition-fast` (transition)
- `--theory-mbti`, `--theory-enneagram`, `--theory-bigfive`, `--theory-disc`, `--theory-lesenne`, `--theory-jung` (theory colors)
- `--color-success`, `--color-success-bg` (success badge)
- `--color-warning`, `--color-warning-bg` (warning badge)
- `--color-error`, `--color-error-bg` (error badge)
- `--accent-primary`, `--accent-secondary` (icon badge colors)

## Do / Don't

| Do | Don't |
|----|-------|
| Use theory badges (`.badge-mbti`, etc.) to label assessment types | Don't create custom badge colors -- use the provided theory/status variants |
| Use `.badge-table` inside `<td>` elements for compact sizing | Don't use full-size badges in tables -- they disrupt row alignment |
| Use `.tag` when you do not need the status dot | Don't mix `.badge` and `.tag` classes on the same element |
| Use `.icon-badge` for stat card icons and visual markers | Don't place text inside `.icon-badge` -- it is designed for icons and emoji only |
| Use status badges (`.badge-success`, etc.) for state indicators | Don't use theory badges for non-assessment status indicators |
| Pair `.icon-badge-sm` with the base `.icon-badge` class | Don't use `.icon-badge-sm` alone -- it requires `.icon-badge` as the base |
