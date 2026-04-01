# Icons

The ResultX Design System uses **inline SVGs** for icons. Any icon library that produces `<svg>` elements works out of the box — we recommend [Lucide](https://lucide.dev/) for its consistency and MIT license.

## Quick Start

```html
<!-- Basic icon -->
<svg class="icon icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
</svg>

<!-- Icon with color -->
<svg class="icon icon-lg icon-accent">...</svg>

<!-- Icon in a wrapper -->
<span class="icon-wrapper icon-wrapper-lg icon-wrapper-accent">
  <svg class="icon icon-lg">...</svg>
</span>
```

## Sizes

| Class | Size | Use case |
|-------|------|----------|
| `.icon-xs` | 12px | Inline indicators, badge dots |
| `.icon-sm` | 16px | Sidebar items, table cells |
| `.icon-md` | 20px | Buttons, form inputs |
| `.icon-lg` | 24px | Headers, cards |
| `.icon-xl` | 32px | Empty states, hero sections |
| `.icon-2xl` | 40px | Feature highlights |

## Colors

Icons inherit `currentColor` by default. Use color classes to override:

| Class | Token |
|-------|-------|
| `.icon-primary` | `--text-primary` |
| `.icon-secondary` | `--text-secondary` |
| `.icon-muted` | `--text-muted` |
| `.icon-accent` | `--accent-primary` |
| `.icon-success` | `--color-success` |
| `.icon-warning` | `--color-warning` |
| `.icon-error` | `--color-error` |
| `.icon-info` | `--color-info` |

## Icon Wrappers

Rounded background containers for icons. Commonly used in stat cards and feature lists.

```html
<span class="icon-wrapper icon-wrapper-lg icon-wrapper-accent">
  <svg class="icon icon-lg">...</svg>
</span>
```

### Wrapper sizes

| Class | Size |
|-------|------|
| `.icon-wrapper-sm` | 28px |
| `.icon-wrapper-md` | 36px |
| `.icon-wrapper-lg` | 44px |
| `.icon-wrapper-xl` | 56px |

### Wrapper variants

| Class | Background | Use case |
|-------|-----------|----------|
| `.icon-wrapper-accent` | Accent muted | Primary actions |
| `.icon-wrapper-success` | Success bg | Positive indicators |
| `.icon-wrapper-warning` | Warning bg | Caution indicators |
| `.icon-wrapper-error` | Error bg | Error/danger indicators |
| `.icon-wrapper-info` | Info bg | Informational |
| `.icon-wrapper-surface` | Surface-2 | Neutral/decorative |

Add `.icon-wrapper-round` for circular wrappers.

## Icon Buttons

Standalone icon-only buttons (no text):

```html
<button class="btn-icon" aria-label="Settings">
  <svg class="icon icon-md">...</svg>
</button>
```

## Icons in Buttons

Icons inside text buttons:

```html
<button class="btn btn-primary">
  <svg class="icon icon-md">...</svg>
  Save
</button>
```

## Animated Icons

```html
<svg class="icon icon-md icon-spin">...</svg>
```

## Recommended Icon Library

We recommend [Lucide](https://lucide.dev/) icons:

```bash
npm install lucide-static   # SVG files only (no JS)
```

Copy the SVGs you need into your project, or use them inline. All Lucide icons are 24x24 viewBox with 2px stroke — matching our `.icon` base class exactly.

## Accessibility

- Always add `aria-label` to icon-only buttons
- Decorative icons should have `aria-hidden="true"`
- Meaningful icons need `role="img"` and a `<title>` element

```html
<!-- Decorative -->
<svg class="icon" aria-hidden="true">...</svg>

<!-- Meaningful -->
<svg class="icon" role="img">
  <title>Warning</title>
  ...
</svg>

<!-- Icon button -->
<button class="btn-icon" aria-label="Delete item">
  <svg class="icon icon-md" aria-hidden="true">...</svg>
</button>
```
