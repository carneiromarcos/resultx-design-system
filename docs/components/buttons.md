# Buttons

Interactive elements used for actions, form submissions, and navigation triggers. All buttons use a pill shape (`border-radius: var(--radius-full)`) as the default v2 style.

## Component Anatomy

A button is built with a base `.btn` class combined with a variant class for color/style and an optional size modifier.

```
.btn + .btn-{variant} + [.btn-{size}] + [.btn-block]
```

## Base Class

### `.btn`

The foundation class that provides shared layout, typography, and transition properties.

| Property | Value |
|----------|-------|
| `display` | `inline-flex` |
| `align-items` | `center` |
| `gap` | `var(--space-2)` |
| `padding` | `var(--space-2) var(--space-5)` |
| `border-radius` | `var(--radius-full)` |
| `font-family` | `var(--font-body)` |
| `font-size` | `var(--text-sm)` |
| `font-weight` | `var(--font-medium)` |
| `line-height` | `1.5` |
| `cursor` | `pointer` |
| `border` | `none` |
| `transition` | `all var(--transition-fast)` |

## Variants

| Class | Background | Text Color | Border | Hover Effect |
|-------|-----------|------------|--------|--------------|
| `.btn-primary` | `var(--accent-primary)` | `var(--text-inverse)` | none | `var(--accent-primary-hover)` bg + `var(--shadow-glow)` + `translateY(-1px)` |
| `.btn-secondary` | `var(--bg-base)` | `var(--text-primary)` | `1px solid var(--border-default)` | border and text become `var(--accent-primary)` |
| `.btn-ghost` | `transparent` | `var(--text-secondary)` | none | `var(--bg-surface-2)` bg + `var(--text-primary)` text |
| `.btn-danger` | `var(--color-error-bg)` | `var(--color-error)` | `1px solid rgba(220,38,38,0.2)` | bg becomes `var(--color-error)`, text becomes `var(--text-primary)` |
| `.btn-success` | `var(--color-success)` | `var(--text-primary)` | none | `brightness(1.1)` + `translateY(-1px)` |
| `.btn-social` | `var(--bg-base)` | `var(--text-primary)` | `1px solid var(--border-default)` | border becomes `var(--accent-primary)`, bg becomes `var(--bg-surface-1)` |

## Size Modifiers

| Class | Padding | Font Size |
|-------|---------|-----------|
| `.btn-sm` | `var(--space-1) var(--space-3)` | `var(--text-xs)` |
| (default) | `var(--space-2) var(--space-5)` | `var(--text-sm)` |
| `.btn-lg` | `var(--space-3) var(--space-8)` | `var(--text-base)` |

## Layout Modifiers

| Class | Effect |
|-------|--------|
| `.btn-block` | `width: 100%; justify-content: center;` |

## `.btn-social`

A full-width button variant designed for social login (Google, GitHub, etc.). Always renders at full width with centered content and a bottom margin for stacking.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `width` | `100%` |
| `justify-content` | `center` |
| `padding` | `var(--space-2) var(--space-4)` |
| `border-radius` | `var(--radius-full)` |
| `font-size` | `var(--text-sm)` |
| `font-weight` | `var(--font-medium)` |
| `border` | `1px solid var(--border-default)` |
| `background` | `var(--bg-base)` |
| `margin-bottom` | `var(--space-3)` |

## HTML Usage

### Primary button

```html
<button class="btn btn-primary">Save Changes</button>
```

### Secondary button with icon

```html
<button class="btn btn-secondary">
  <span class="icon">+</span> Add Item
</button>
```

### Ghost button (small)

```html
<button class="btn btn-ghost btn-sm">Cancel</button>
```

### Danger button (large)

```html
<button class="btn btn-danger btn-lg">Delete Account</button>
```

### Success button

```html
<button class="btn btn-success">Approve</button>
```

### Full-width primary button

```html
<button class="btn btn-primary btn-block">Sign In</button>
```

### Social login button

```html
<button class="btn-social">
  <img src="google-icon.svg" width="18" height="18" alt="">
  Continue with Google
</button>
```

### Button row

```html
<div class="flex-row">
  <button class="btn btn-primary">Confirm</button>
  <button class="btn btn-secondary">Cancel</button>
  <button class="btn btn-ghost btn-sm">Reset</button>
</div>
```

## Tokens Used

- `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-5`, `--space-8` (spacing)
- `--radius-full` (border-radius)
- `--font-body` (font-family)
- `--font-medium` (font-weight)
- `--text-xs`, `--text-sm`, `--text-base` (font-size)
- `--transition-fast` (transition)
- `--accent-primary`, `--accent-primary-hover` (primary colors)
- `--text-primary`, `--text-secondary`, `--text-inverse` (text colors)
- `--bg-base`, `--bg-surface-1`, `--bg-surface-2` (backgrounds)
- `--border-default` (border color)
- `--color-error`, `--color-error-bg` (danger variant)
- `--color-success` (success variant)
- `--shadow-glow` (primary hover glow)

## Do / Don't

| Do | Don't |
|----|-------|
| Always combine `.btn` with a variant class (e.g., `.btn .btn-primary`) | Don't use `.btn` alone without a variant -- it has no background or color |
| Use `.btn-block` for full-width form submit buttons | Don't add manual `width: 100%` -- use `.btn-block` instead |
| Use `.btn-social` for third-party login buttons | Don't use `.btn-secondary` for social login -- `.btn-social` has proper full-width stacking |
| Use `.btn-sm` inside tables or compact areas | Don't nest buttons inside other buttons |
| Use `.btn-danger` for destructive actions (delete, remove) | Don't use `.btn-primary` for destructive actions |
| Use `.btn-ghost` for tertiary/cancel actions | Don't use `.btn-ghost` as a primary action -- it lacks visual prominence |
