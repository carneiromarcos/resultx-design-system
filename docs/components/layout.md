# Layout

Page-level layout templates for structuring entire views. Includes split layouts (login with hero), centered layouts (standalone forms), list-detail panels, fullwidth layouts, and dropdown positioning.

## Layout Templates Overview

| Template | Use Case | Key Classes |
|----------|----------|-------------|
| Sidebar + Content | Default app layout | `.sidebar` + `.main` |
| Split Content | List + detail panels | `.layout-split-content` |
| Centered | Login, signup, 404 pages | `.layout-centered` |
| Split (Auth) | Login with side hero | `.layout-split` |
| Fullwidth | No-sidebar pages | `.layout-fullwidth` |

---

## Split Content Layout (List + Detail)

A two-panel layout with a scrollable list on the left and a detail view on the right, used for master-detail interfaces (e.g., candidate list + profile).

### Component Anatomy

```
.layout-split-content
  .layout-list
    .layout-list-header
    .layout-list-item [.active]
      avatar
      .layout-list-item-info
        .layout-list-item-name
        .layout-list-item-meta
  .layout-detail
```

### Components

#### `.layout-split-content`

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `gap` | `0` |
| `height` | `calc(100vh - var(--header-height))` |
| `overflow` | `hidden` |

#### `.layout-list`

| Property | Value |
|----------|-------|
| `width` | `400px` |
| `border-right` | `1px solid var(--border-subtle)` |
| `overflow-y` | `auto` |
| `flex-shrink` | `0` |
| `background` | `var(--bg-base)` |

#### `.layout-list-header`

| Property | Value |
|----------|-------|
| `padding` | `var(--space-4) var(--space-5)` |
| `border-bottom` | `1px solid var(--border-subtle)` |
| `position` | `sticky` |
| `top` | `0` |
| `background` | `var(--bg-base)` |
| `z-index` | `5` |

#### `.layout-list-item`

| Property | Value |
|----------|-------|
| `display` | `flex` / `align-items: center` / `gap: var(--space-3)` |
| `padding` | `var(--space-4) var(--space-5)` |
| `border-bottom` | `1px solid var(--border-subtle)` |
| `cursor` | `pointer` |
| `transition` | `all var(--transition-fast)` |

**Hover:** `background: var(--bg-surface-1)`

**Active (`.active`):** `background: var(--accent-primary-muted); border-left: 3px solid var(--accent-primary)`

#### `.layout-list-item-info`

| Property | Value |
|----------|-------|
| `flex` | `1` |
| `min-width` | `0` |

#### `.layout-list-item-name`

| Property | Value |
|----------|-------|
| `font-size` | `var(--text-sm)` |
| `font-weight` | `var(--font-medium)` |
| `color` | `var(--text-primary)` |
| `white-space` | `nowrap` |
| `overflow` | `hidden` |
| `text-overflow` | `ellipsis` |

#### `.layout-list-item-meta`

| Property | Value |
|----------|-------|
| `font-size` | `var(--text-xs)` |
| `color` | `var(--text-muted)` |
| `margin-top` | `2px` |

#### `.layout-detail`

| Property | Value |
|----------|-------|
| `flex` | `1` |
| `overflow-y` | `auto` |
| `padding` | `var(--space-6)` |

---

## Centered Layout

A full-viewport centered card layout for standalone pages (login, signup, error pages).

### Component Anatomy

```
.layout-centered
  .layout-centered-card
    .layout-centered-logo
    .layout-centered-title
    .layout-centered-subtitle
    [form content]
    .layout-centered-footer
```

### Components

#### `.layout-centered`

| Property | Value |
|----------|-------|
| `min-height` | `100vh` |
| `display` | `flex` |
| `align-items` | `center` |
| `justify-content` | `center` |
| `background` | `var(--bg-surface-1)` |
| `padding` | `var(--space-8)` |

#### `.layout-centered-card`

| Property | Value |
|----------|-------|
| `width` | `100%` |
| `max-width` | `440px` |
| `background` | `var(--bg-base)` |
| `border` | `1px solid var(--border-subtle)` |
| `border-radius` | `var(--radius-xl)` |
| `box-shadow` | `var(--shadow-lg)` |
| `padding` | `var(--space-8)` |

#### `.layout-centered-logo`

| Property | Value |
|----------|-------|
| `display` | `flex` / `align-items: center` / `justify-content: center` |
| `gap` | `var(--space-3)` |
| `margin-bottom` | `var(--space-8)` |

#### `.layout-centered-title`

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-heading)` |
| `font-size` | `var(--text-2xl)` |
| `font-weight` | `var(--font-bold)` |
| `text-align` | `center` |
| `margin-bottom` | `var(--space-2)` |

#### `.layout-centered-subtitle`

| Property | Value |
|----------|-------|
| `font-size` | `var(--text-sm)` |
| `color` | `var(--text-secondary)` |
| `text-align` | `center` |
| `margin-bottom` | `var(--space-6)` |

#### `.layout-centered-footer`

| Property | Value |
|----------|-------|
| `text-align` | `center` |
| `margin-top` | `var(--space-6)` |
| `padding-top` | `var(--space-4)` |
| `border-top` | `1px solid var(--border-subtle)` |
| `font-size` | `var(--text-sm)` |
| `color` | `var(--text-muted)` |

Footer links (`a`): `color: var(--accent-primary); text-decoration: none; font-weight: var(--font-medium)`. Hover: `text-decoration: underline`.

---

## Split Layout (Auth with Hero)

A 50/50 two-column layout with a form on the left and a hero/illustration area on the right. Commonly used for login or registration pages with branding.

### Component Anatomy

```
.layout-split
  .layout-split-left
    .layout-split-form
      [form content]
  .layout-split-right
    .layout-split-hero
      .layout-split-hero-title
      .layout-split-hero-text
```

### Components

#### `.layout-split`

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `min-height` | `100vh` |

#### `.layout-split-left`

| Property | Value |
|----------|-------|
| `flex` | `1` |
| `display` | `flex` / `align-items: center` / `justify-content: center` |
| `padding` | `var(--space-8)` |
| `background` | `var(--bg-surface-1)` |

#### `.layout-split-right`

| Property | Value |
|----------|-------|
| `flex` | `1` |
| `display` | `flex` / `align-items: center` / `justify-content: center` |
| `padding` | `var(--space-8)` |
| `background` | `linear-gradient(135deg, var(--bg-surface-2), var(--bg-surface-1))` |
| `position` | `relative` |
| `overflow` | `hidden` |

The `::before` pseudo-element creates a radial glow:

| Property | Value |
|----------|-------|
| `width / height` | `600px` |
| `background` | `radial-gradient(ellipse, var(--accent-primary-muted) 0%, transparent 70%)` |
| `position` | `absolute` / centered with `translate(-50%, -50%)` |

#### `.layout-split-form`

| Property | Value |
|----------|-------|
| `width` | `100%` |
| `max-width` | `400px` |

#### `.layout-split-hero`

| Property | Value |
|----------|-------|
| `text-align` | `center` |
| `position` | `relative` |
| `z-index` | `1` |

#### `.layout-split-hero-title`

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-heading)` |
| `font-size` | `var(--text-4xl)` |
| `font-weight` | `var(--font-bold)` |
| `letter-spacing` | `var(--tracking-tight)` |
| `margin-bottom` | `var(--space-4)` |
| `color` | `var(--text-primary)` |

#### `.layout-split-hero-text`

| Property | Value |
|----------|-------|
| `font-size` | `var(--text-base)` |
| `color` | `var(--text-secondary)` |
| `max-width` | `360px` |
| `margin` | `0 auto` |

---

## Fullwidth Layout

A no-sidebar layout with a top header and centered content area.

### Component Anatomy

```
.layout-fullwidth
  .layout-fullwidth-header
  .layout-fullwidth-content
```

### Components

#### `.layout-fullwidth`

| Property | Value |
|----------|-------|
| `min-height` | `100vh` |
| `background` | `var(--bg-surface-1)` |

#### `.layout-fullwidth-header`

| Property | Value |
|----------|-------|
| `background` | `var(--bg-base)` |
| `border-bottom` | `1px solid var(--border-subtle)` |
| `padding` | `0 var(--space-8)` |
| `height` | `var(--header-height)` |
| `display` | `flex` / `align-items: center` / `justify-content: space-between` |

#### `.layout-fullwidth-content`

| Property | Value |
|----------|-------|
| `max-width` | `var(--content-max-width)` |
| `margin` | `0 auto` |
| `padding` | `var(--space-8)` |

---

## Dropdown (Positioning)

See the [Navigation](./navigation.md) documentation for full dropdown component details. Layout-relevant properties:

| Class | Key Properties |
|-------|---------------|
| `.dropdown` | `position: relative; display: inline-block` |
| `.dropdown-menu` | `position: absolute; top: calc(100% + 4px); z-index: var(--z-dropdown)` |

---

## HTML Usage

### Centered login page

```html
<div class="layout-centered">
  <div class="layout-centered-card">
    <div class="layout-centered-logo">
      <div class="sidebar-logo">E+</div>
      <div class="sidebar-brand-text">Emprega<span>+</span></div>
    </div>
    <div class="layout-centered-title">Welcome Back</div>
    <div class="layout-centered-subtitle">Sign in to your account</div>
    <form>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input" placeholder="you@example.com">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" class="form-input" placeholder="Password">
      </div>
      <button class="btn btn-primary btn-block">Sign In</button>
    </form>
    <div class="layout-centered-footer">
      Don't have an account? <a href="#">Sign up</a>
    </div>
  </div>
</div>
```

### Split auth layout

```html
<div class="layout-split">
  <div class="layout-split-left">
    <div class="layout-split-form">
      <div class="layout-centered-title">Create Account</div>
      <div class="layout-centered-subtitle">Get started with your free account</div>
      <form>
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-input" placeholder="Your name">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" placeholder="Create a password">
        </div>
        <button class="btn btn-primary btn-block">Create Account</button>
        <div class="form-divider">or</div>
        <button type="button" class="btn-social">Continue with Google</button>
      </form>
    </div>
  </div>
  <div class="layout-split-right">
    <div class="layout-split-hero">
      <div class="layout-split-hero-title">Discover Your Potential</div>
      <div class="layout-split-hero-text">
        Behavioral assessments powered by science. Understand your team like never before.
      </div>
    </div>
  </div>
</div>
```

### List-detail layout

```html
<div class="layout-split-content">
  <div class="layout-list">
    <div class="layout-list-header">
      <input type="text" class="form-input" placeholder="Search candidates...">
    </div>
    <div class="layout-list-item active">
      <div class="avatar avatar-sm" style="background: linear-gradient(135deg, #6366F1, #8B5CF6);">MS</div>
      <div class="layout-list-item-info">
        <div class="layout-list-item-name">Maria Silva</div>
        <div class="layout-list-item-meta">MBTI: INTJ - Score: 87</div>
      </div>
    </div>
    <div class="layout-list-item">
      <div class="avatar avatar-sm" style="background: linear-gradient(135deg, #F59E0B, #EF4444);">JO</div>
      <div class="layout-list-item-info">
        <div class="layout-list-item-name">Joao Oliveira</div>
        <div class="layout-list-item-meta">DISC: DC - Score: 72</div>
      </div>
    </div>
  </div>
  <div class="layout-detail">
    <!-- Detail content here -->
  </div>
</div>
```

## Tokens Used

- `--space-2`, `--space-3`, `--space-4`, `--space-5`, `--space-6`, `--space-8` (spacing)
- `--radius-xl`, `--radius-lg` (border-radius)
- `--font-heading` (typography)
- `--font-medium`, `--font-bold` (font weights)
- `--text-xs`, `--text-sm`, `--text-base`, `--text-2xl`, `--text-4xl` (font sizes)
- `--tracking-tight` (letter-spacing)
- `--text-primary`, `--text-secondary`, `--text-muted` (text colors)
- `--accent-primary`, `--accent-primary-muted` (accent colors)
- `--bg-base`, `--bg-surface-1`, `--bg-surface-2` (backgrounds)
- `--border-subtle` (borders)
- `--shadow-lg` (centered card shadow)
- `--header-height`, `--content-max-width` (layout dimensions)
- `--transition-fast` (list item transitions)
- `--z-dropdown` (dropdown z-index)

## Do / Don't

| Do | Don't |
|----|-------|
| Use `.layout-centered` for standalone pages (login, 404) | Don't use `.layout-centered` inside `.main` -- it is a full-viewport layout |
| Use `.layout-split` for auth pages with branding | Don't use `.layout-split` for app pages -- it replaces the sidebar layout |
| Use `.layout-split-content` inside `.main` for master-detail views | Don't use `.layout-split-content` as a top-level layout -- it belongs inside the main content area |
| Use `.layout-fullwidth` for pages that don't need a sidebar | Don't mix `.layout-fullwidth` with `.sidebar` -- they are mutually exclusive |
| Set `.active` on the selected `.layout-list-item` via JavaScript | Don't apply `.active` to multiple list items at once |
| Keep `.layout-split-form` max-width at `400px` | Don't override the max-width -- forms wider than 400px reduce readability |
