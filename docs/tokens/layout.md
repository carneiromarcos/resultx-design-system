# Layout

Layout tokens for the ResultX App Design System. Sidebar, header, content, and grid tokens are defined in `tokens.css` (App DS specific). Z-index and breakpoint scales are defined in `tokens-base.css` (shared).

---

## Sidebar

| Token | Value | Usage |
|-------|-------|-------|
| `--sidebar-width` | `240px` | Sidebar expanded width |
| `--sidebar-collapsed` | `64px` | Sidebar collapsed/icon-only width |

### Pattern

```css
.sidebar {
  width: var(--sidebar-width);         /* 240px expanded */
  transition: width var(--transition-slow);
}
.sidebar--collapsed {
  width: var(--sidebar-collapsed);     /* 64px icon-only */
}
.main-content {
  margin-left: var(--sidebar-width);   /* offset for expanded sidebar */
}
```

---

## Header

| Token | Value | Usage |
|-------|-------|-------|
| `--header-height` | `56px` | Top navigation bar height |

### Pattern

```css
.header {
  height: var(--header-height);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}
.page-content {
  padding-top: var(--header-height);   /* offset for fixed/sticky header */
}
```

---

## Content

| Token | Value | Usage |
|-------|-------|-------|
| `--content-max-width` | `1280px` | Maximum width for main content area |

### Pattern

```css
.content-wrapper {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
}
```

---

## Grid

| Token | Value | Usage |
|-------|-------|-------|
| `--grid-gap` | `20px` | Default gap between grid items |
| `--card-min-width` | `300px` | Minimum width for auto-fit grid cards |

### Pattern

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--card-min-width), 1fr));
  gap: var(--grid-gap);
}
```

---

## Z-Index Scale

Defined in `tokens-base.css`. Provides a predictable stacking order for all UI layers.

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | `0` | Default stacking context, flow content |
| `--z-dropdown` | `10` | Dropdown menus, select popups |
| `--z-sticky` | `20` | Sticky headers, table headers |
| `--z-sidebar` | `30` | Navigation sidebar |
| `--z-overlay` | `40` | Backdrop overlays, dimming layers |
| `--z-modal` | `50` | Modal dialogs, command palettes |
| `--z-toast` | `60` | Toast notifications, snackbars |
| `--z-tooltip` | `70` | Tooltips (always on top) |

### Stacking Order Visualization

```
z-tooltip   ████████████████████████████████  70  Tooltips
z-toast     ██████████████████████████████    60  Toasts
z-modal     ████████████████████████████      50  Modals
z-overlay   ██████████████████████████        40  Overlays
z-sidebar   ████████████████████████          30  Sidebar
z-sticky    ██████████████████████            20  Sticky headers
z-dropdown  ████████████████████              10  Dropdowns
z-base      ██████████████████                 0  Default
```

---

## Breakpoints

Defined as comments in `tokens-base.css` (CSS custom properties cannot be used in `@media` queries). Use these values directly in media queries.

| Reference | Value | Usage |
|-----------|-------|-------|
| `--bp-sm` | `640px` | Mobile landscape, small tablets |
| `--bp-md` | `768px` | Tablets, sidebar collapse threshold |
| `--bp-lg` | `1024px` | Small laptops, sidebar expand threshold |
| `--bp-xl` | `1280px` | Standard desktops |
| `--bp-2xl` | `1536px` | Large desktops, ultra-wide monitors |

### Pattern

```css
/* Sidebar collapses below lg */
@media (max-width: 1023px) {
  .sidebar {
    width: var(--sidebar-collapsed);
  }
}

/* Full-width cards on mobile */
@media (max-width: 767px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Usage Guidelines

### Do

- Use `--z-*` tokens for all z-index values. The scale prevents stacking conflicts.
- Use `--content-max-width` to constrain content width on large screens.
- Use `--grid-gap` and `--card-min-width` for responsive card grids.
- Reference breakpoint values directly in media queries since CSS custom properties do not work in `@media`.

### Don't

- Don't invent z-index values outside the scale (e.g., `z-index: 9999`). If you need a new layer, it likely fits one of the existing tiers.
- Don't hardcode sidebar or header dimensions. Use the tokens so the layout adjusts if values change.
- Don't set `max-width` on the content area to anything other than `--content-max-width` without design approval.
- Don't use `--grid-gap` as a general spacing token. Use `--space-*` tokens for padding and margins.
