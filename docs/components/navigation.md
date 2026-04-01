# Navigation

Navigation components including the sidebar, tabs, breadcrumbs, header bar, and dropdown menus. These provide the primary wayfinding structure across the application.

## Sidebar

The fixed left-side navigation panel. Uses a dark background that contrasts with the main content area.

### Component Anatomy

```
.sidebar
  .sidebar-brand
    .sidebar-logo
    .sidebar-brand-text
      <span>    (accent-colored text)
  .sidebar-section-label
  .sidebar-item [.active]
    .icon
    Label text
    .badge-count  (optional)
  .sidebar-divider
  .sidebar-footer
    .sidebar-user
      .sidebar-user-avatar
      div
        .sidebar-user-name
        .sidebar-user-role
```

### Components

#### `.sidebar`

| Property | Value |
|----------|-------|
| `width` | `var(--sidebar-width)` |
| `background` | `var(--sidebar-bg)` |
| `height` | `100vh` |
| `position` | `fixed` |
| `top / left` | `0` |
| `display` | `flex` / `flex-direction: column` |
| `padding` | `var(--space-5) 0` |
| `z-index` | `30` |
| `overflow-y` | `auto` |

Responsive: sidebar is hidden (`display: none`) at `max-width: 1024px`. The `.main` container removes its left margin at the same breakpoint.

#### `.sidebar-brand`

| Property | Value |
|----------|-------|
| `padding` | `0 var(--space-5)` |
| `margin-bottom` | `var(--space-8)` |
| `display` | `flex` / `align-items: center` / `gap: var(--space-3)` |

#### `.sidebar-logo`

| Property | Value |
|----------|-------|
| `width / height` | `32px` |
| `background` | `var(--accent-primary)` |
| `border-radius` | `var(--radius-md)` |
| `font-family` | `var(--font-heading)` |
| `font-weight` | `var(--font-bold)` |
| `font-size` | `var(--text-sm)` |
| `color` | `var(--text-primary)` |

#### `.sidebar-brand-text`

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-heading)` |
| `font-weight` | `var(--font-bold)` |
| `font-size` | `var(--text-lg)` |
| `color` | `var(--text-primary)` |

The inner `<span>` uses `color: var(--accent-secondary)` for accent text (e.g., the "+" in "Emprega+").

#### `.sidebar-section-label`

Uppercase section divider label.

| Property | Value |
|----------|-------|
| `padding` | `var(--space-4) var(--space-5) var(--space-2)` |
| `font-family` | `var(--font-mono)` |
| `font-size` | `10px` |
| `font-weight` | `var(--font-medium)` |
| `letter-spacing` | `var(--tracking-wider)` |
| `text-transform` | `uppercase` |
| `color` | `rgba(255,255,255,0.3)` |

#### `.sidebar-item`

| Property | Value |
|----------|-------|
| `display` | `flex` / `align-items: center` / `gap: var(--space-3)` |
| `padding` | `var(--space-2) var(--space-4)` |
| `margin` | `1px var(--space-3)` |
| `font-size` | `var(--text-sm)` |
| `font-weight` | `var(--font-medium)` |
| `color` | `var(--sidebar-text)` |
| `cursor` | `pointer` |
| `transition` | `all var(--transition-fast)` |
| `border-radius` | `var(--radius-md)` |

**Hover:** `color: var(--text-primary); background: var(--sidebar-bg-hover)`

**Active (`.active`):** `color: var(--sidebar-text-active); background: var(--sidebar-active-bg)`

#### `.sidebar-item .icon`

| Property | Value |
|----------|-------|
| `width` | `18px` |
| `text-align` | `center` |
| `font-size` | `14px` |

#### `.sidebar-item .badge-count`

| Property | Value |
|----------|-------|
| `margin-left` | `auto` |
| `background` | `rgba(255,255,255,0.15)` |
| `padding` | `1px 8px` |
| `border-radius` | `var(--radius-full)` |
| `font-family` | `var(--font-mono)` |
| `font-size` | `10px` |

When parent is `.active`: `background: rgba(255,255,255,0.25)`.

#### `.sidebar-divider`

| Property | Value |
|----------|-------|
| `border-top` | `1px solid var(--sidebar-divider)` |
| `margin` | `var(--space-3) var(--space-5)` |

#### `.sidebar-footer`

| Property | Value |
|----------|-------|
| `margin-top` | `auto` |
| `padding` | `var(--space-4) var(--space-5)` |
| `border-top` | `1px solid var(--sidebar-divider)` |

#### `.sidebar-user`

| Property | Value |
|----------|-------|
| `display` | `flex` / `align-items: center` / `gap: var(--space-3)` |
| `color` | `var(--sidebar-text)` |
| `font-size` | `var(--text-sm)` |

- `.sidebar-user-avatar`: `32px` circle, gradient background, centered initials
- `.sidebar-user-name`: `color: var(--text-primary); font-weight: var(--font-medium)`
- `.sidebar-user-role`: `font-size: 10px; opacity: 0.5`

---

## Header

The sticky top navigation bar inside the main content area.

### Components

#### `.header`

| Property | Value |
|----------|-------|
| `background` | `rgba(255,255,255,0.85)` |
| `backdrop-filter` | `blur(16px)` |
| `border-bottom` | `1px solid var(--border-subtle)` |
| `padding` | `0 var(--space-8)` |
| `height` | `var(--header-height)` |
| `display` | `flex` / `align-items: center` / `justify-content: space-between` |
| `position` | `sticky` / `top: 0` |
| `z-index` | `20` |

#### `.header-title`

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-heading)` |
| `font-size` | `var(--text-2xl)` |
| `font-weight` | `var(--font-bold)` |
| `letter-spacing` | `var(--tracking-tight)` |

#### `.header-actions`

| Property | Value |
|----------|-------|
| `display` | `flex` / `align-items: center` / `gap: var(--space-3)` |

---

## Tabs

Horizontal tab bar for switching between views within a page.

### Component Anatomy

```
.tabs
  .tab [.active]
    .icon  (optional)
    Label text
```

#### `.tabs`

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `gap` | `var(--space-1)` |
| `border-bottom` | `1px solid var(--border-subtle)` |
| `margin-bottom` | `var(--space-6)` |

#### `.tab`

| Property | Value |
|----------|-------|
| `display` | `flex` / `align-items: center` / `gap: var(--space-2)` |
| `padding` | `var(--space-3) var(--space-4)` |
| `font-size` | `var(--text-sm)` |
| `font-weight` | `var(--font-medium)` |
| `color` | `var(--text-muted)` |
| `border-bottom` | `2px solid transparent` |
| `cursor` | `pointer` |
| `transition` | `all var(--transition-fast)` |

**Hover:** `color: var(--text-secondary)`

**Active (`.active`):** `color: var(--accent-primary); border-bottom-color: var(--accent-primary)`

---

## Breadcrumb

A trail showing the user's location in the navigation hierarchy.

### Component Anatomy

```
.breadcrumb
  .breadcrumb-item
  .breadcrumb-sep
  .breadcrumb-item
  .breadcrumb-sep
  .breadcrumb-item.active
```

#### `.breadcrumb`

| Property | Value |
|----------|-------|
| `display` | `flex` / `align-items: center` / `gap: var(--space-2)` |
| `font-size` | `var(--text-sm)` |
| `margin-bottom` | `var(--space-4)` |

#### `.breadcrumb-item`

| Property | Value |
|----------|-------|
| `color` | `var(--text-muted)` |
| `cursor` | `pointer` |
| `transition` | `color var(--transition-fast)` |

**Hover:** `color: var(--accent-primary)`

**Active (`.active`):** `color: var(--text-primary); font-weight: var(--font-medium); cursor: default`

#### `.breadcrumb-sep`

| Property | Value |
|----------|-------|
| `color` | `var(--text-muted)` |
| `font-size` | `var(--text-xs)` |

---

## Dropdown

A toggleable dropdown menu, used for actions, filters, or selections.

### Component Anatomy

```
.dropdown [.open]
  .dropdown-trigger
    Label text
    span.arrow
  .dropdown-menu
    .dropdown-label    (optional section label)
    .dropdown-item [.active]
    .dropdown-divider  (optional separator)
    .dropdown-item
```

#### `.dropdown`

| Property | Value |
|----------|-------|
| `position` | `relative` |
| `display` | `inline-block` |

#### `.dropdown-trigger`

| Property | Value |
|----------|-------|
| `display` | `inline-flex` / `align-items: center` / `gap: var(--space-2)` |
| `padding` | `var(--space-2) var(--space-4)` |
| `background` | `var(--bg-base)` |
| `border` | `1px solid var(--border-default)` |
| `border-radius` | `var(--radius-md)` |
| `font-family` | `var(--font-body)` |
| `font-size` | `var(--text-sm)` |
| `color` | `var(--text-primary)` |
| `cursor` | `pointer` |

**Hover:** `border-color: var(--accent-primary)`

The `.arrow` inside rotates 180 degrees when `.dropdown.open`.

#### `.dropdown-menu`

| Property | Value |
|----------|-------|
| `position` | `absolute` |
| `top` | `calc(100% + 4px)` |
| `left` | `0` |
| `min-width` | `200px` |
| `max-height` | `280px` |
| `background` | `var(--bg-base)` |
| `border` | `1px solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `box-shadow` | `var(--shadow-lg)` |
| `padding` | `var(--space-1)` |
| `z-index` | `var(--z-dropdown)` |
| `animation` | `fade-in-up 0.15s ease` |
| `overflow-y` | `auto` |
| `display` | `none` (shown when parent is `.open`) |

#### `.dropdown-item`

| Property | Value |
|----------|-------|
| `display` | `flex` / `align-items: center` / `gap: var(--space-2)` |
| `padding` | `var(--space-2) var(--space-3)` |
| `border-radius` | `var(--radius-md)` |
| `font-size` | `var(--text-sm)` |
| `color` | `var(--text-secondary)` |
| `cursor` | `pointer` |

**Hover:** `background: var(--bg-surface-2); color: var(--text-primary)`

**Active (`.active`):** `background: var(--accent-primary-muted); color: var(--accent-primary); font-weight: var(--font-medium)`

#### `.dropdown-divider`

| Property | Value |
|----------|-------|
| `border-top` | `1px solid var(--border-subtle)` |
| `margin` | `var(--space-1) 0` |

#### `.dropdown-label`

| Property | Value |
|----------|-------|
| `padding` | `var(--space-2) var(--space-3) var(--space-1)` |
| `font-size` | `var(--text-xs)` |
| `font-weight` | `var(--font-semibold)` |
| `color` | `var(--text-muted)` |
| `text-transform` | `uppercase` |
| `letter-spacing` | `var(--tracking-wide)` |

## HTML Usage

### Sidebar

```html
<aside class="sidebar">
  <div class="sidebar-brand">
    <div class="sidebar-logo">E+</div>
    <div class="sidebar-brand-text">Emprega<span>+</span></div>
  </div>

  <div class="sidebar-section-label">Main</div>
  <div class="sidebar-item active">
    <span class="icon">&#9776;</span> Dashboard
  </div>
  <div class="sidebar-item">
    <span class="icon">&#128100;</span> Candidates
    <span class="badge-count">24</span>
  </div>

  <hr class="sidebar-divider">

  <div class="sidebar-section-label">Settings</div>
  <div class="sidebar-item">
    <span class="icon">&#9881;</span> Preferences
  </div>

  <div class="sidebar-footer">
    <div class="sidebar-user">
      <div class="sidebar-user-avatar">MS</div>
      <div>
        <div class="sidebar-user-name">Maria Silva</div>
        <div class="sidebar-user-role">Admin</div>
      </div>
    </div>
  </div>
</aside>
```

### Tabs

```html
<div class="tabs">
  <div class="tab active">Overview</div>
  <div class="tab">Assessments</div>
  <div class="tab">History</div>
</div>
```

### Breadcrumb

```html
<div class="breadcrumb">
  <span class="breadcrumb-item">Home</span>
  <span class="breadcrumb-sep">/</span>
  <span class="breadcrumb-item">Candidates</span>
  <span class="breadcrumb-sep">/</span>
  <span class="breadcrumb-item active">Maria Silva</span>
</div>
```

### Dropdown

```html
<div class="dropdown open">
  <button class="dropdown-trigger">
    Filter by <span class="arrow">&#9660;</span>
  </button>
  <div class="dropdown-menu">
    <div class="dropdown-label">Theory</div>
    <div class="dropdown-item active">All</div>
    <div class="dropdown-item">MBTI</div>
    <div class="dropdown-item">DISC</div>
    <hr class="dropdown-divider">
    <div class="dropdown-label">Status</div>
    <div class="dropdown-item">Active</div>
    <div class="dropdown-item">Archived</div>
  </div>
</div>
```

## Tokens Used

- `--sidebar-width`, `--sidebar-bg`, `--sidebar-bg-hover`, `--sidebar-active-bg` (sidebar layout)
- `--sidebar-text`, `--sidebar-text-active`, `--sidebar-divider` (sidebar colors)
- `--header-height` (header)
- `--accent-primary`, `--accent-secondary`, `--accent-primary-muted` (accent colors)
- `--text-primary`, `--text-secondary`, `--text-muted` (text colors)
- `--bg-base`, `--bg-surface-1`, `--bg-surface-2` (backgrounds)
- `--border-subtle`, `--border-default` (borders)
- `--shadow-lg` (dropdown shadow)
- `--radius-md`, `--radius-lg`, `--radius-full` (border-radius)
- `--font-heading`, `--font-body`, `--font-mono` (typography)
- `--font-medium`, `--font-semibold`, `--font-bold` (font weights)
- `--text-xs`, `--text-sm`, `--text-lg`, `--text-2xl` (font sizes)
- `--tracking-tight`, `--tracking-wide`, `--tracking-wider` (letter-spacing)
- `--transition-fast` (animations)
- `--z-modal`, `--z-dropdown` (z-index)
- `--space-1` through `--space-8` (spacing)

## Do / Don't

| Do | Don't |
|----|-------|
| Use `.sidebar-section-label` to group related navigation items | Don't omit section labels when you have more than 5 items |
| Mark the current page with `.active` on the `.sidebar-item` | Don't apply `.active` to multiple sidebar items simultaneously |
| Use `.badge-count` to show notification counts | Don't place long text in `.badge-count` -- numbers only |
| Use `.tabs` for same-page content switching | Don't use `.tabs` for primary navigation -- use the sidebar instead |
| Mark the current breadcrumb with `.active` (last item) | Don't make the `.active` breadcrumb item clickable |
| Toggle `.open` on `.dropdown` via JavaScript | Don't set `.dropdown-menu` to `display: block` directly -- use the `.open` class |
