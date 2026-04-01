# API Reference

> Complete index of all CSS classes in the ResultX Design System.

## Tokens (Custom Properties)

See [tokens/](tokens/) for detailed documentation per category.

| Category | Token Prefix | Count | Docs |
|----------|-------------|-------|------|
| Backgrounds | `--bg-*` | 5 | [colors.md](tokens/colors.md) |
| Sidebar | `--sidebar-*` | 7 | [colors.md](tokens/colors.md) |
| Borders | `--border-*` | 4 | [colors.md](tokens/colors.md) |
| Text | `--text-primary/secondary/muted/inverse` | 4 | [colors.md](tokens/colors.md) |
| Accent | `--accent-*` | 4 | [colors.md](tokens/colors.md) |
| Semantic | `--color-success/warning/error/info` | 8 | [colors.md](tokens/colors.md) |
| Theory | `--theory-*` | 12 | [colors.md](tokens/colors.md) |
| DISC | `--disc-*` | 4 | [colors.md](tokens/colors.md) |
| MBTI | `--mbti-*` | 4 | [colors.md](tokens/colors.md) |
| Big Five | `--bigfive-*` | 5 | [colors.md](tokens/colors.md) |
| Chart | `--chart-*` | 4 | [colors.md](tokens/colors.md) |
| Typography Sizes | `--text-2xs` to `--text-display` | 10 | [typography.md](tokens/typography.md) |
| Typography Families | `--font-heading/body/mono` | 3 | [typography.md](tokens/typography.md) |
| Typography Weights | `--font-light` to `--font-bold` | 5 | [typography.md](tokens/typography.md) |
| Line Heights | `--leading-*` | 6 | [typography.md](tokens/typography.md) |
| Letter Spacing | `--tracking-*` | 6 | [typography.md](tokens/typography.md) |
| Spacing | `--space-*` | 14 | [spacing.md](tokens/spacing.md) |
| Radius | `--radius-*` | 6 | [radius.md](tokens/radius.md) |
| Shadows | `--shadow-*` | 5 | [shadows.md](tokens/shadows.md) |
| Glass | `--glass-*` | 9 | [shadows.md](tokens/shadows.md) |
| Transitions | `--transition-*` | 4 | [transitions.md](tokens/transitions.md) |
| Layout | `--sidebar-width`, `--header-height`, etc. | 6 | [layout.md](tokens/layout.md) |
| Z-Index | `--z-*` | 8 | [layout.md](tokens/layout.md) |
| Accessibility | `--focus-ring-*`, `--text-on-color` | 4 | [accessibility.md](tokens/accessibility.md) |

---

## Components (CSS Classes)

### Reset & Base

| Class | Description |
|-------|-------------|
| `body` | Base styles: bg-surface-1, text-primary, font-body, flex layout |

### Sidebar

| Class | Description | Docs |
|-------|-------------|------|
| `.sidebar` | Fixed sidebar container (240px) | [navigation.md](components/navigation.md) |
| `.sidebar-brand` | Brand logo area | |
| `.sidebar-logo` | Logo icon (32px, accent bg) | |
| `.sidebar-brand-text` | Brand name text | |
| `.sidebar-section-label` | Section divider label | |
| `.sidebar-item` | Navigation item | |
| `.sidebar-item.active` | Active state (accent highlight) | |
| `.sidebar-divider` | Horizontal divider | |
| `.sidebar-footer` | Footer area | |
| `.sidebar-user` | User info block | |
| `.sidebar-user-avatar` | User avatar (36px) | |
| `.sidebar-user-name` | User name | |
| `.sidebar-user-role` | User role text | |
| `.badge-count` | Notification count badge | |

### Header

| Class | Description | Docs |
|-------|-------------|------|
| `.header` | Sticky header bar | [navigation.md](components/navigation.md) |
| `.header-title` | Page title (heading font) | |
| `.header-actions` | Action buttons container | |

### Buttons

| Class | Description | Docs |
|-------|-------------|------|
| `.btn` | Base button | [buttons.md](components/buttons.md) |
| `.btn-primary` | Primary (accent color) | |
| `.btn-secondary` | Secondary (accent-secondary) | |
| `.btn-ghost` | Ghost (transparent bg) | |
| `.btn-danger` | Danger (error color) | |
| `.btn-success` | Success (success color) | |
| `.btn-sm` | Small size | |
| `.btn-lg` | Large size | |
| `.btn-block` | Full width | |
| `.btn-social` | OAuth/social login | |

### Cards

| Class | Description | Docs |
|-------|-------------|------|
| `.card` | Base card (surface-2, rounded) | [cards.md](components/cards.md) |
| `.card-accent` | Accent border card | |
| `.card-eyebrow` | Eyebrow label (uppercase) | |
| `.card-title` | Card title | |
| `.card-text` | Card body text | |

### Forms

| Class | Description | Docs |
|-------|-------------|------|
| `.form-group` | Form field wrapper | [forms.md](components/forms.md) |
| `.form-label` | Field label | |
| `.form-input` | Text input / select | |
| `.form-hint` | Helper text below input | |
| `.form-checkbox-row` | Checkbox row container | |
| `.form-checkbox-label` | Checkbox label | |
| `.form-divider` | OR divider | |
| `.form-link` | Inline form link | |
| `.toggle` | Toggle switch container | |
| `.toggle-track` | Toggle track background | |
| `.toggle-thumb` | Toggle thumb knob | |

### Modals

| Class | Description | Docs |
|-------|-------------|------|
| `.modal-overlay` | Backdrop overlay | [modals.md](components/modals.md) |
| `.modal` | Modal container (default 560px) | |
| `.modal-sm` | Small modal (400px) | |
| `.modal-lg` | Large modal (720px) | |
| `.modal-header` | Modal header | |
| `.modal-title` | Modal title | |
| `.modal-close` | Close button | |
| `.modal-body` | Modal content area | |
| `.modal-footer` | Modal footer (actions) | |

### Tables

| Class | Description | Docs |
|-------|-------------|------|
| `.table-card` | Table wrapper card | [tables.md](components/tables.md) |
| `.table-header` | Table header bar | |
| `.table-header-title` | Table title | |
| `.td-avatar` | Avatar cell | |
| `.td-name` | Name cell (primary weight) | |
| `.td-score` | Score badge cell | |
| `.td-score-total` | Total score cell | |

### Tabs

| Class | Description | Docs |
|-------|-------------|------|
| `.tabs` | Tab bar container | [navigation.md](components/navigation.md) |
| `.tab` | Individual tab | |
| `.tab.active` | Active tab (accent border) | |

### Breadcrumbs

| Class | Description | Docs |
|-------|-------------|------|
| `.breadcrumb` | Breadcrumb container | [navigation.md](components/navigation.md) |
| `.breadcrumb-item` | Breadcrumb link | |
| `.breadcrumb-item.active` | Current page (no link) | |
| `.breadcrumb-sep` | Separator | |

### Badges & Tags

| Class | Description | Docs |
|-------|-------------|------|
| `.badge` | Base badge | [badges.md](components/badges.md) |
| `.badge-mbti` | MBTI theory badge | |
| `.badge-disc` | DISC theory badge | |
| `.badge-bigfive` | Big Five theory badge | |
| `.badge-enneagram` | Enneagram theory badge | |
| `.badge-lesenne` | Le Senne theory badge | |
| `.badge-jung` | Jung theory badge | |
| `.badge-success` | Success status badge | |
| `.badge-warning` | Warning status badge | |
| `.badge-error` | Error status badge | |
| `.badge-table` | Table inline badge | |
| `.icon-badge` | Icon container (36px) | |
| `.icon-badge-blue` | Blue variant | |
| `.icon-badge-purple` | Purple variant | |
| `.icon-badge-green` | Green variant | |
| `.icon-badge-orange` | Orange variant | |
| `.icon-badge-pink` | Pink variant | |
| `.icon-badge-cyan` | Cyan variant | |
| `.icon-badge-gold` | Gold variant | |
| `.icon-badge-sm` | Small icon badge (28px) | |
| `.tag` | Tag label | |
| `.tag-blue` | Blue tag | |
| `.tag-green` | Green tag | |
| `.tag-orange` | Orange tag | |
| `.tag-purple` | Purple tag | |
| `.tag-pink` | Pink tag | |

### Stats

| Class | Description | Docs |
|-------|-------------|------|
| `.stat-grid` | Stats grid (auto-fill 300px) | [stats.md](components/stats.md) |
| `.stat-card` | Stat card container | |
| `.stat-header` | Stat card header | |
| `.stat-icon-bubble` | Icon bubble (40px) | |
| `.stat-label` | Stat label text | |
| `.stat-number` | Large stat number | |
| `.stat-variation` | Variation indicator (up/down) | |
| `.stat-variation.up` | Positive (green) | |
| `.stat-variation.down` | Negative (red) | |
| `.stat-progress` | Mini progress bar | |
| `.stat-progress-fill` | Progress bar fill | |
| `.stat-card-mini` | Compact stat card | |
| `.stat-card-mini-label` | Compact stat label | |
| `.stat-card-mini-value` | Compact stat value | |

### Progress & Charts

| Class | Description | Docs |
|-------|-------------|------|
| `.progress-list` | Progress items container | [progress.md](components/progress.md) |
| `.progress-item` | Single progress row | |
| `.progress-track` | Track background | |
| `.progress-fill` | Fill bar (animated) | |
| `.progress-fill.disc-d` | DISC D fill (red) | |
| `.progress-fill.disc-i` | DISC I fill (amber) | |
| `.progress-fill.disc-s` | DISC S fill (green) | |
| `.progress-fill.disc-c` | DISC C fill (blue) | |
| `.progress-label` | Label text | |
| `.progress-label-sm` | Small label | |
| `.progress-score` | Score value (mono) | |
| `.progress-score-sm` | Small score | |
| `.chart-card` | Chart container | |
| `.chart-header` | Chart title area | |
| `.chart-title` | Chart title | |
| `.chart-period` | Period selector | |
| `.chart-period-btn` | Period button | |
| `.chart-svg` | SVG chart area | |
| `.chart-months` | Month labels | |

### Theory Components

| Class | Description | Docs |
|-------|-------------|------|
| `.theory-grid` | Theory cards grid | [theory.md](components/theory.md) |
| `.theory-card` | Theory card container | |
| `.theory-header` | Theory card header | |
| `.theory-name` | Theory identifier (mono) | |
| `.theory-type` | Theory type name | |
| `.theory-description` | Theory description | |
| `.mbti-bar-track` | MBTI bar track | |
| `.mbti-bar-fill` | MBTI bar fill | |
| `.mbti-bar-bg` | MBTI bar background | |
| `.mbti-bar-pct` | MBTI percentage label | |
| `.mbti-axis-label` | MBTI axis label (mono) | |
| `.enneagram-grid` | Enneagram mini cards grid | |
| `.enneagram-mini-card` | Enneagram mini card | |
| `.dna-badges` | DNA badge row | |
| `.compare-banner` | Comparison banner | |
| `.compare-title` | Comparison title | |
| `.compare-sub` | Comparison subtitle | |

### Layout Patterns

| Class | Description | Docs |
|-------|-------------|------|
| `.main` | Main content area (margin-left sidebar) | [layout.md](components/layout.md) |
| `.content` | Content wrapper (max-width) | |
| `.section` | Page section | |
| `.section-label` | Section label (uppercase) | |
| `.layout-split` | Two-column auth layout | |
| `.layout-split-left` | Form column | |
| `.layout-split-right` | Hero column | |
| `.layout-split-form` | Form container | |
| `.layout-split-hero` | Hero container | |
| `.layout-split-hero-title` | Hero title | |
| `.layout-split-hero-text` | Hero text | |
| `.layout-split-content` | Content split layout | |
| `.layout-centered` | Centered container | |
| `.layout-centered-card` | Centered card | |
| `.layout-centered-logo` | Centered logo | |
| `.layout-centered-title` | Centered title | |
| `.layout-centered-subtitle` | Centered subtitle | |
| `.layout-centered-footer` | Centered footer | |
| `.layout-fullwidth` | Full width layout | |
| `.layout-fullwidth-header` | Full width header | |
| `.layout-fullwidth-content` | Full width content | |
| `.layout-detail` | Detail page layout | |
| `.layout-list` | List layout | |
| `.layout-list-header` | List header | |
| `.layout-list-item` | List item | |

### Avatars

| Class | Description |
|-------|-------------|
| `.avatar-group` | Overlapping avatar row |
| `.avatar-xs` | Extra small (24px) |
| `.avatar-sm` | Small (28px) |
| `.avatar-md` | Medium (36px) |
| `.avatar-lg` | Large (48px) |
| `.avatar-xl` | Extra large (64px) |
| `.avatar-square` | Square avatar |
| `.avatar-status` | Status dot indicator |
| `.avatar-status.busy` | Busy (red) |
| `.avatar-status.offline` | Offline (gray) |

### Dropdowns

| Class | Description |
|-------|-------------|
| `.dropdown` | Dropdown container |
| `.dropdown-trigger` | Trigger element |
| `.dropdown-menu` | Menu panel |
| `.dropdown-item` | Menu item |
| `.dropdown-item.active` | Active item |
| `.dropdown-divider` | Menu divider |
| `.dropdown-label` | Menu section label |

### Utility Classes

| Class | Description |
|-------|-------------|
| `.glass-subtle` | Light glassmorphism |
| `.glass-standard` | Medium glassmorphism |
| `.glass-strong` | Heavy glassmorphism |
| `.flex-row` | Flex row |
| `.flex-between` | Flex space-between |
| `.grid-2` | 2-column grid |
| `.grid-3` | 3-column grid |
| `.mb-4` | Margin bottom space-4 |
| `.mb-6` | Margin bottom space-6 |
| `.mb-8` | Margin bottom space-8 |
| `.mt-6` | Margin top space-6 |

### Feedback

| Class | Description |
|-------|-------------|
| `.toast-container` | Toast notification area |
| `.toast` | Base toast |
| `.toast-success` | Success toast |
| `.toast-error` | Error toast |
| `.toast-warning` | Warning toast |
| `.toast-info` | Info toast |
| `.tooltip-wrapper` | Tooltip container |
| `.tooltip` | Tooltip text |
| `.tooltip-bottom` | Bottom-positioned tooltip |
| `.empty-state` | Empty state container |
| `.empty-state-icon` | Empty state icon |
| `.empty-state-title` | Empty state title |
| `.empty-state-text` | Empty state text |
| `.spinner` | Loading spinner |
| `.spinner-lg` | Large spinner |
| `.skeleton` | Skeleton loading |
| `.skeleton-avatar` | Skeleton avatar |
| `.skeleton-title` | Skeleton title |
| `.skeleton-text` | Skeleton text |
| `.skeleton-btn` | Skeleton button |
| `.skeleton-bar` | Skeleton bar |
| `.skeleton-card` | Skeleton card |

### Kanban

| Class | Description |
|-------|-------------|
| `.kanban` | Kanban board container |
| `.kanban-column` | Column |
| `.kanban-column-header` | Column header |
| `.kanban-column-title` | Column title |
| `.kanban-column-count` | Item count badge |
| `.kanban-column-dot` | Color dot indicator |
| `.kanban-column-body` | Column body |
| `.kanban-card` | Kanban card |
| `.kanban-card-title` | Card title |
| `.kanban-card-meta` | Card metadata |
| `.kanban-add` | Add card button |

### Profile

| Class | Description |
|-------|-------------|
| `.profile-header` | Profile header area |
| `.profile-avatar` | Profile avatar (80px) |
| `.profile-info` | Profile info block |
| `.profile-name` | Name |
| `.profile-role` | Role/title |
| `.profile-tag` | Profile tag |
| `.profile-scores` | Scores grid |

### Settings

| Class | Description |
|-------|-------------|
| `.settings-card` | Settings card |
| `.settings-item-label` | Settings item label |

### Pagination

| Class | Description |
|-------|-------------|
| `.pagination` | Pagination container |
| `.pagination-btn` | Page button |
| `.pagination-ellipsis` | Ellipsis indicator |
| `.pagination-info` | Page info text |

### Footer

| Class | Description |
|-------|-------------|
| `.ds-footer` | Design system footer |
| `.ds-footer-title` | Footer title |
| `.ds-footer-sub` | Footer subtitle |

---

## Total: 249 CSS classes | 140+ design tokens | 2 themes
