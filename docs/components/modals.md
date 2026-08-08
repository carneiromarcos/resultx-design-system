# Modals

Dialog overlays used for confirmations, forms, and focused tasks that require the user's attention. Modals use a backdrop overlay with centered content and entry animations.

## Component Anatomy

```
.modal-overlay
  .modal [.modal-sm | .modal-lg]
    .modal-header
      .modal-title
      button.modal-close
    .modal-body
    .modal-footer
```

## Components

### `.modal-overlay`

The full-screen backdrop behind the modal.

| Property | Value |
|----------|-------|
| `position` | `fixed` |
| `top / left / right / bottom` | `0` |
| `background` | `var(--bg-overlay)` |
| `display` | `flex` |
| `align-items` | `center` |
| `justify-content` | `center` |
| `z-index` | `var(--z-modal)` |
| `animation` | `fade-in 0.2s ease` |

### `.modal`

The modal container itself.

| Property | Value |
|----------|-------|
| `background` | `var(--bg-base)` |
| `border` | `1px solid var(--border-subtle)` |
| `border-radius` | `var(--radius-xl)` |
| `box-shadow` | `var(--shadow-lg)` |
| `width` | `100%` |
| `max-width` | `520px` |
| `animation` | `scale-in 0.25s ease` |
| `overflow` | `hidden` |
| `display` | `flex` / `flex-direction: column` |
| `max-height` | `100%` |

**Why it is a flex column.** Header and footer stay put and only the body scrolls. Before this, `.modal` had `overflow: hidden` and no height ceiling, so a tall modal was **clipped with no scrollbar and no warning** — the content below the fold was simply unreachable.

The ceiling comes from `.modal-overlay`'s `padding: var(--space-4)`: `max-height: 100%` resolves against the overlay's content box, so that padding is the guaranteed gap to the viewport edge. Short modals do not move — flex centering keeps them where they were.

### `.modal-header`

Top section with title and close button.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `align-items` | `center` |
| `justify-content` | `space-between` |
| `padding` | `var(--space-5) var(--space-6)` |
| `border-bottom` | `1px solid var(--border-subtle)` |

### `.modal-title`

The heading inside the modal header.

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-heading)` |
| `font-size` | `var(--text-lg)` |
| `font-weight` | `var(--font-semibold)` |

### `.modal-close`

The close/dismiss button in the top-right corner.

| Property | Value |
|----------|-------|
| `width / height` | `32px` |
| `border-radius` | `var(--radius-md)` |
| `border` | `none` |
| `background` | `transparent` |
| `color` | `var(--text-muted)` |
| `font-size` | `var(--text-lg)` |
| `cursor` | `pointer` |
| `display` | `flex` / `align-items: center` / `justify-content: center` |
| `transition` | `background-color`, `color` — **never `all`** |
| `position` | `relative` (anchors the enlarged target below) |

On hover: `background: var(--bg-surface-2); color: var(--text-primary)`.

**Pointer target is 44×44; the visible box stays 32×32.** `.modal-close::after` spreads `inset: -6px`, so 32 + 6 + 6 = 44. The DS settled on 44×44 for `.btn-icon` in Wave 2 and this button was left behind — 32×32 does pass WCAG 2.2 AA (SC 2.5.8 asks for 24×24), but two rules for the same gesture is incoherent. Growing the target instead of the box means **no header changes height**.

`transition` is explicit rather than `all`: `all` sweeps properties nobody meant to animate, and in Wave 3 that dragged `visibility` along and made focus fail silently.

### `.modal-body`

The main content area — and the only part that scrolls.

| Property | Value |
|----------|-------|
| `padding` | `var(--space-6)` |
| `min-height` | `0` |
| `overflow-y` | `auto` |
| `overscroll-behavior` | `contain` |

**`min-height: 0` is not optional.** A flex item will not shrink below its content's min-content size without it, so the body would push the modal past its ceiling instead of scrolling. Same lesson as `.main` in Wave 1.

`overscroll-behavior: contain` stops the scroll at the modal instead of chaining to the page behind it.

### `.scroll-slim`

Slim, tokenised scrollbar. `.modal-body` already carries it; apply the class to any other scroll container that needs the same treatment.

| Property | Value |
|----------|-------|
| `scrollbar-width` | `thin` |
| `scrollbar-color` | `var(--border-default) transparent` |
| thumb (`::-webkit-scrollbar-thumb`) | `var(--border-default)`, `var(--radius-full)`, 8px |
| thumb on hover | `var(--text-muted)` |

The DS had **no scrollbar styling at all** before this: every browser drew its own, wide and off-palette, inside dark surfaces. `scrollbar-*` is the standard property (Firefox, recent Chromium); the `::-webkit-scrollbar` block covers Safari and older Chromium. Where neither applies the native bar shows and scrolling still works — degradation without loss of function.

### `.modal-footer`

Bottom action bar for buttons.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `justify-content` | `flex-end` |
| `gap` | `var(--space-3)` |
| `padding` | `var(--space-4) var(--space-6)` |
| `border-top` | `1px solid var(--border-subtle)` |
| `background` | `var(--bg-surface-1)` |

## Size Variants

| Class | `max-width` |
|-------|-------------|
| `.modal-sm` | `400px` |
| (default) | `520px` |
| `.modal-lg` | `720px` |

## Animations

The modal system uses two keyframe animations:

- **`fade-in`** (overlay): `opacity: 0` to `opacity: 1` over `0.2s`
- **`scale-in`** (modal): `opacity: 0; transform: scale(0.95)` to `opacity: 1; transform: scale(1)` over `0.25s`

## HTML Usage

### Default modal

```html
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">Confirm Action</div>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to proceed? This action cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Small modal

```html
<div class="modal-overlay">
  <div class="modal modal-sm">
    <div class="modal-header">
      <div class="modal-title">Delete Item</div>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p>This will permanently delete the selected item.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-danger">Delete</button>
    </div>
  </div>
</div>
```

### Large modal with form

```html
<div class="modal-overlay">
  <div class="modal modal-lg">
    <div class="modal-header">
      <div class="modal-title">Edit Profile</div>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Name</label>
        <input type="text" class="form-input" placeholder="Full name">
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input" placeholder="you@example.com">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost">Cancel</button>
      <button class="btn btn-primary">Save Changes</button>
    </div>
  </div>
</div>
```

## Tokens Used

- `--space-3`, `--space-4`, `--space-5`, `--space-6` (spacing)
- `--radius-md`, `--radius-xl` (border-radius)
- `--font-heading` (title font)
- `--font-semibold` (title weight)
- `--text-lg`, `--text-muted` (typography)
- `--transition-fast` (close button transition)
- `--bg-base`, `--bg-surface-1`, `--bg-surface-2`, `--bg-overlay` (backgrounds)
- `--border-subtle` (borders)
- `--shadow-lg` (modal shadow)
- `--z-modal` (z-index)
- `--text-primary`, `--text-muted` (text colors)

## Do / Don't

| Do | Don't |
|----|-------|
| Always include `.modal-overlay` as the outermost wrapper | Don't render `.modal` without `.modal-overlay` -- it needs the backdrop for focus trapping |
| Include a `.modal-close` button for dismissal | Don't rely only on overlay click to close -- provide an explicit close button |
| Use `.modal-sm` for simple confirmations | Don't use `.modal-sm` for forms -- the width is too narrow |
| Use `.modal-lg` for complex content (forms, tables) | Don't exceed `.modal-lg` -- content should scroll inside `.modal-body` instead |
| Place action buttons in `.modal-footer` | Don't put buttons in `.modal-body` -- use the footer for consistent action placement |
| Use `btn-danger` in the footer for destructive actions | Don't use `btn-primary` for delete confirmations -- the color should signal danger |
