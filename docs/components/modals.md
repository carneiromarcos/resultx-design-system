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
| `transition` | `all var(--transition-fast)` |

On hover: `background: var(--bg-surface-2); color: var(--text-primary)`.

### `.modal-body`

The main content area.

| Property | Value |
|----------|-------|
| `padding` | `var(--space-6)` |

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
