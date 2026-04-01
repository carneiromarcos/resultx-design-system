# Forms

Form components for user input, including text fields, checkboxes, toggles, and helper text. Designed for login pages, settings screens, and data entry workflows.

## Component Anatomy

```
.form-group
  .form-label
  .form-input
  .form-hint         (optional)

.form-checkbox-row
  .form-checkbox-label
    input[type="checkbox"]
    Label text
  .form-link          (optional)

.form-divider         (standalone separator)
```

## Components

### `.form-group`

Wrapper that provides vertical spacing between form fields.

| Property | Value |
|----------|-------|
| `margin-bottom` | `var(--space-4)` |

### `.form-label`

The label element displayed above an input.

| Property | Value |
|----------|-------|
| `display` | `block` |
| `font-size` | `var(--text-sm)` |
| `font-weight` | `var(--font-medium)` |
| `color` | `var(--text-primary)` |
| `margin-bottom` | `var(--space-2)` |

### `.form-input`

Text input, email, password, and other text-like fields.

| Property | Value |
|----------|-------|
| `width` | `100%` |
| `padding` | `var(--space-2) var(--space-4)` |
| `background` | `var(--bg-base)` |
| `border` | `1px solid var(--border-default)` |
| `border-radius` | `var(--radius-md)` |
| `color` | `var(--text-primary)` |
| `font-family` | `var(--font-body)` |
| `font-size` | `var(--text-sm)` |
| `transition` | `all var(--transition-fast)` |
| `outline` | `none` |

#### Placeholder

| Property | Value |
|----------|-------|
| `color` | `var(--text-muted)` |

#### Focus State

When the input receives focus:

| Property | Value |
|----------|-------|
| `border-color` | `var(--accent-primary)` |
| `box-shadow` | `0 0 0 3px var(--accent-primary-muted)` |

### `.form-hint`

Helper text displayed below an input.

| Property | Value |
|----------|-------|
| `font-size` | `var(--text-xs)` |
| `color` | `var(--text-muted)` |
| `margin-top` | `var(--space-1)` |

### `.form-checkbox-row`

A horizontal row that places a checkbox label on the left and a link (e.g., "Forgot password?") on the right.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `align-items` | `center` |
| `justify-content` | `space-between` |
| `margin-bottom` | `var(--space-5)` |
| `font-size` | `var(--text-sm)` |

### `.form-checkbox-label`

A clickable label wrapping a checkbox input and its text.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `align-items` | `center` |
| `gap` | `var(--space-2)` |
| `color` | `var(--text-secondary)` |
| `cursor` | `pointer` |

The inner `input[type="checkbox"]` is styled at `16px x 16px` with `accent-color: var(--accent-primary)`.

### `.form-link`

An inline link used inside form contexts (e.g., "Forgot password?", "Sign up").

| Property | Value |
|----------|-------|
| `color` | `var(--accent-primary)` |
| `text-decoration` | `none` |
| `font-size` | `var(--text-sm)` |
| `font-weight` | `var(--font-medium)` |

On hover: `text-decoration: underline`.

### `.form-divider`

A horizontal separator with optional centered text (e.g., "or"). Uses `::before` and `::after` pseudo-elements to draw lines on each side.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `align-items` | `center` |
| `gap` | `var(--space-3)` |
| `margin` | `var(--space-5) 0` |
| `color` | `var(--text-muted)` |
| `font-size` | `var(--text-xs)` |

Each pseudo-element (`::before`, `::after`):

| Property | Value |
|----------|-------|
| `flex` | `1` |
| `height` | `1px` |
| `background` | `var(--border-subtle)` |

## Toggle

A custom toggle switch component.

```
label.toggle
  input[type="checkbox"]
  span.toggle-track
  span.toggle-thumb
```

| Class | Property | Value |
|-------|----------|-------|
| `.toggle` | `width` | `44px` |
| `.toggle` | `height` | `24px` |
| `.toggle-track` | `background` | `var(--border-default)` |
| `.toggle-track` (checked) | `background` | `var(--accent-primary)` |
| `.toggle-thumb` | `width / height` | `20px` |
| `.toggle-thumb` | `background` | `var(--text-primary)` |
| `.toggle-thumb` (checked) | `left` | `22px` |

## HTML Usage

### Standard form group

```html
<div class="form-group">
  <label class="form-label">Email</label>
  <input type="email" class="form-input" placeholder="you@example.com">
  <div class="form-hint">We'll never share your email.</div>
</div>
```

### Password field

```html
<div class="form-group">
  <label class="form-label">Password</label>
  <input type="password" class="form-input" placeholder="Enter your password">
</div>
```

### Checkbox row with link

```html
<div class="form-checkbox-row">
  <label class="form-checkbox-label">
    <input type="checkbox"> Remember me
  </label>
  <a href="#" class="form-link">Forgot password?</a>
</div>
```

### Form divider

```html
<div class="form-divider">or continue with</div>
```

### Toggle switch

```html
<label class="toggle">
  <input type="checkbox">
  <span class="toggle-track"></span>
  <span class="toggle-thumb"></span>
</label>
```

### Complete login form

```html
<form>
  <div class="form-group">
    <label class="form-label">Email</label>
    <input type="email" class="form-input" placeholder="you@example.com">
  </div>
  <div class="form-group">
    <label class="form-label">Password</label>
    <input type="password" class="form-input" placeholder="Enter your password">
  </div>
  <div class="form-checkbox-row">
    <label class="form-checkbox-label">
      <input type="checkbox"> Remember me
    </label>
    <a href="#" class="form-link">Forgot password?</a>
  </div>
  <button class="btn btn-primary btn-block">Sign In</button>
  <div class="form-divider">or</div>
  <button type="button" class="btn-social">
    Continue with Google
  </button>
</form>
```

## Tokens Used

- `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-5` (spacing)
- `--radius-md`, `--radius-full` (border-radius)
- `--font-body` (font-family)
- `--font-medium` (font-weight)
- `--text-xs`, `--text-sm` (font-size)
- `--transition-fast` (transition)
- `--accent-primary`, `--accent-primary-muted` (focus ring, links, checkbox accent)
- `--text-primary`, `--text-secondary`, `--text-muted` (text colors)
- `--bg-base` (input background)
- `--border-default`, `--border-subtle` (borders)
- `--shadow-sm` (toggle thumb)

## Do / Don't

| Do | Don't |
|----|-------|
| Wrap every label + input pair in `.form-group` | Don't place inputs outside of `.form-group` -- it breaks spacing consistency |
| Use `.form-hint` for helper text below inputs | Don't use `.form-hint` for error messages -- create a dedicated error state |
| Use `.form-divider` between primary and social login sections | Don't stack multiple `.form-divider` elements without content between them |
| Use `.form-checkbox-row` for "remember me" patterns | Don't use `.form-checkbox-row` for a list of checkboxes -- it is designed for single-line layouts |
| Place `.form-link` inside `.form-checkbox-row` for "forgot password" links | Don't use `.form-link` as a standalone button replacement |
| Always provide a `placeholder` on `.form-input` elements | Don't omit `.form-label` -- inputs need visible labels for accessibility |
