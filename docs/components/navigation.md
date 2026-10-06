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

### Rail mode — `.sidebar-rail`

The second navigation mode. Until this landed the DS supported exactly one — the 240px panel — and `--sidebar-collapsed: 64px` sat declared and unused.

```html
<aside class="sidebar sidebar-rail" aria-label="Navegação principal">
  <a class="sidebar-item active" href="…" aria-current="page">
    <svg class="icon icon-md" aria-hidden="true">…</svg>
    <span class="sidebar-label">Atendimento</span>
  </a>
</aside>

<main class="main main-rail">…</main>
```

| Class | Role |
|-------|------|
| `.sidebar-rail` | Narrows the sidebar to `var(--sidebar-collapsed)` and centres its items |
| `.sidebar-label` | The item's text. New — the family had no hook for it |
| `.main-rail` | The content offset, from the **same** token |

**The width and the offset come from one token.** Two numbers here is exactly how Electia's 192px dead gap was born; see [split-pane.md](split-pane.md) for the same principle applied to a resizable column.

**The label is not hidden with `display: none`.** It stays in the accessibility tree, just out of sight — otherwise the item becomes a nameless icon and a screen reader announces "link" and nothing more. Verified in Chrome: the label box measures 1px wide, and the accessible name still reads `link "Atendimento"`.

Because the label leaves the viewport, rail items need a tooltip. Use `.tooltip-right` from the DS rather than a `title` attribute — `title` does not appear on keyboard focus.

Measured: rail 64px, content offset 64px, no horizontal overflow at 1500 / 1024 / 768 / 390px.

### Overlay mode — `.sidebar-overlay`

The third and last mode. What defines it: **the content does not move.** Rail and panel take space from the page; the overlay floats above it and gives the space back when it closes.

It is also what was missing below 1024px, where `.sidebar` simply vanished with no substitute — the whole navigation disappeared on small screens.

```html
<button data-sidebar-toggle="nav" aria-expanded="false" hidden>Menu</button>

<aside class="sidebar sidebar-rail sidebar-overlay" id="nav"
       data-sidebar-overlay data-sidebar-media="(max-width: 1024px)">…</aside>
```

Combining it with `.sidebar-rail` gives the case most products actually want — **rail on the desktop, drawer below 1024px, one element**, no duplicated navigation in the HTML. Above the cut a media query hands control back to the rail: it stops floating and takes space again.

| Class | Role |
|-------|------|
| `.sidebar-overlay` | Floats above the content instead of taking space |
| `.sidebar-scrim` | The backdrop. Created by the script when the page has none |

Load `resultx-design-system/sidebar-overlay`.

| API | Effect |
|-----|--------|
| `ResultXSidebarOverlay.init(root)` | Enhance every `[data-sidebar-overlay]` |
| `.open(el)` / `.close(el)` / `.toggle(el)` | Transport |

Dispatches `sidebartoggle` with `detail: { open }`.

#### Accessibility — this is a modal panel, and it behaves like one

- **Focus moves into the panel on open and returns to the trigger on close.** Verified: 12 Tabs and 6 Shift+Tabs, zero escapes.
- **Only targets that accept focus count (Revisor of #86).** Initial focus and the Tab cycle skip anything inside an `[inert]` ancestor, hidden (`display: none` or `visibility: hidden`), disabled, or `tabindex="-1"`. Before, such an element could be chosen as the first target: `.focus()` failed silently, focus stayed on `<body>`, and Tab did not wrap from last to first. With no valid target, the panel itself (`tabindex="-1"`) takes focus. Focus returns to the trigger that was **clicked** (`event.currentTarget`), even when the click did not focus it (Safari, `button.click()`).
- **No colour or background transition on `.sidebar-item` (Revisor of #86).** Polarity flips between states: with a light-fill bridge (PdV, ResultX, Xscore), the current item is dark ink on gold and the focused/hovered item is white on navy. Interpolating both over 150 ms dropped mid-frames to about 2:1. State changes are now instant, so only the endpoints exist, and all of them are at 4.5:1 or above. `tests/lote-d.test.js` samples 11 frames for every state pair, in every scope and bridge, plus the theme switch of the `.sidebar` background.
- **Escape closes it.** Clicking the scrim closes it.
- Page scroll is locked while open, and the previous value is **restored**, not zeroed.
- The trigger ships `hidden` and the script reveals it. Without JavaScript the panel cannot open, and a button that does nothing is worse than no button.
- `data-sidebar-media` closes the panel when the query stops matching — a stuck overlay would outlive its reason to exist and leave the scroll lock behind.
- **While open it is a modal dialog for real (lote D, 05/10/2026, from the Revisor's review of #85).** The panel gets `role="dialog"` + `aria-modal="true"`. Every sibling on the path from the panel up to `<body>` gets `[inert]`, except the scrim, because inert would also block the click that closes. Before this, `<main>` and the header stayed exposed: a page shortcut such as Ctrl+K pulled focus behind the drawer, and screen readers kept reading the page. Everything is undone on close, whether by Escape, the scrim, the API, or the close that `data-sidebar-media` triggers when the window grows into panel/rail mode. Elements that were already inert stay inert, and a `role` and an `aria-modal` the consumer had put on the panel come back, with presence and value. Closed, the `<aside>` is the same navigation landmark as before, so current consumers see no change until the drawer opens. Covered by `tests/sidebar-overlay-behavior.test.js` (mini-dom) and verified in Chrome at 375 and 1024 px, in both themes: Ctrl+K kept focus inside, 20 Tab + 20 Shift+Tab never escaped, Escape returned focus to the trigger, and resizing to 1440 px closed the drawer, removed inert and released the scroll lock.

> The scrim is **not** `.modal-overlay`: that one lives at `--z-modal` and centers its child, so it is coupled to the modal. This one sits at `--z-overlay` and only dims.

#### Two defects this mode surfaced

**`.sidebar-item` was transitioning `all`** — which includes `visibility`, which the item inherits from the sidebar. The link reported `visibility: hidden` at the exact moment the script called `.focus()`, and focusing an invisible element fails silently, leaving focus trapped on the button. A nav item only ever needed to animate colour and background; it now says so.

**`visibility` must flip instantly on open, and wait on close.** Transitioning it in both directions reproduces the same silent failure. The pattern is `visibility 0s linear var(--transition-slow)` when closed and `visibility 0s` when open.


### Panel mode on the desktop — `.sidebar-panel` (lote D, 05/10/2026)

The pairing that was missing: the **240 px panel with labels above 1024 px, and the drawer up to 1024 px, from a single `<aside>`**. This is what Electia and IMO use, since the rail only shows icons. Promoted from the Electia dashboard prototype (#85, C1).

```html
<button class="btn-icon sidebar-panel-toggle" type="button" data-sidebar-toggle="nav"
        aria-expanded="false" aria-label="Abrir navegação" hidden>…</button>

<aside class="sidebar sidebar-overlay sidebar-panel" id="nav" aria-label="Navegação"
       data-sidebar-overlay data-sidebar-media="(max-width: 1024px)">…</aside>
<div class="main">…</div>
```

| Class | Role |
|-------|------|
| `.sidebar-panel` | With `.sidebar-overlay`: from 1025 px up it stops floating (`visibility: visible`, `transform: none`, `z-index: var(--z-sidebar)`) and takes the space `.main` already reserves |
| `.sidebar-panel-toggle` | On the trigger: hidden from 1025 px up, where it would have nothing to open |

The same `dist/sidebar-overlay.js` is used, with no new script. Up to 1024 px nothing changes: it is the overlay drawer. Verified in Chrome (`demos/app-shell.html`, DS and Electia, light and dark): at 1440 px the panel is fixed, the trigger is hidden and `.main` keeps its 240 px offset. At 1024, 768, 375 and 320 px the drawer is closed with the trigger visible. There is no horizontal overflow at any of these widths.

### Ink and focus on the dark sidebar (lote D, 05/10/2026)

The sidebar is dark in **both** themes, so nothing inside it may use `--text-primary`, which is dark in the light theme. A test now fails if any `.sidebar*` rule paints text with it.

| Element | Before | Now | Light before → after | Dark before → after |
|---|---|---|---|---|
| `.sidebar-user-name` | `--text-primary` | `--sidebar-text-bright` | 1,03 → 17,39 | 16,66 → 19,68 |
| `.sidebar-user-role` | 10 px, `opacity: .5` | `--text-xs`, `--sidebar-text` | 2,94 → 7,91 | 2,16 → 5,36 |
| `.sidebar-user-avatar` initials | gradient #6366F1 → #8B5CF6 + `--text-primary` | `--accent-primary` + `--text-inverse` (ink measured per brand) | 4,00–4,22 → 6,70 | 3,58–3,78 → 10,38 |
| `.sidebar-brand-text` | `--text-primary` | `--sidebar-text-bright` | 1,03 → 17,39 | 16,66 → 19,68 |
| `.sidebar-logo` | `--text-primary` on the accent | `--text-inverse` | 2,67 → 6,70 | 1,58 → 10,38 |
| `.sidebar-item:hover` | `--text-primary` | `--sidebar-text-bright` | 1,14 → 15,71 | 15,57 → 18,40 |
| `.sidebar-item:focus-visible` | `--text-primary` | `--sidebar-text-bright` | 1,14 → 15,71 | 15,57 → 18,40 |

Measured in Chrome for the DS without a bridge. Electia's light theme gives the same values, with initials at 7,59. `.sidebar-item[aria-current="page"]` now paints like `.active`. `tests/lote-d.test.js` checks every item state (rest, hover, active, current, focus-visible) at 4.5:1 or above in the four DS scopes and in each brand bridge.

**Focus ring.** `.sidebar` redefines `--focus-ring-color: var(--sidebar-focus-ring, var(--sidebar-text-bright))`, so every focusable element inside it (item, footer link, button) gets a ring made for the dark background. The DS light ring was 2,60:1 on the navy; it is now 6,84 against the sidebar and 6,18 against the focused item. Values per brand are in [brand-bridge.md](../brand-bridge.md). The white fallback covers the alternative themes in `tokens/themes/`, which do not declare the token.

**Still pending (not changed here):** `.sidebar-section-label` uses `--sidebar-text-label` (white at 30 %) at 10 px, which is 2,71:1 light and 2,62:1 dark. It needs a token decision.

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
