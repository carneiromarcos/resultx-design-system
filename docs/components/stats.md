# Stats

Stat card components for displaying key metrics, KPIs, and summary numbers. Available in standard and mini variants, with support for trend indicators and embedded progress bars.

## Component Anatomy

### Standard Stat Card

```
.stat-grid
  .stat-card
    .stat-header
      .stat-label
      .stat-icon-bubble
    .stat-number
    .stat-variation [.up | .down]
      arrow icon
      percentage text
      span.vs   (optional comparison label)
    .stat-progress           (optional)
      .stat-progress-fill
```

### Mini Stat Card

```
.stat-card .stat-card-mini
  .stat-card-mini-value
  .stat-card-mini-label
```

## Components

### `.stat-grid`

Grid container for stat cards. Displays 4 columns by default with responsive breakpoints.

| Property | Value |
|----------|-------|
| `display` | `grid` |
| `grid-template-columns` | `repeat(4, 1fr)` |
| `gap` | `var(--space-5)` |

**Responsive breakpoints:**
- `max-width: 1280px`: 2 columns
- `max-width: 768px`: 1 column

### `.stat-card`

The card container for a single metric.

| Property | Value |
|----------|-------|
| `background` | `var(--bg-base)` |
| `border` | `1px solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `padding` | `var(--space-5)` |
| `box-shadow` | `var(--shadow-sm)` |
| `transition` | `all var(--transition-base)` |

**Hover:** `box-shadow: var(--shadow-md); transform: translateY(-2px)`

### `.stat-header`

Top row with label and icon.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `justify-content` | `space-between` |
| `align-items` | `flex-start` |
| `margin-bottom` | `var(--space-3)` |

### `.stat-label`

The metric name.

| Property | Value |
|----------|-------|
| `font-size` | `var(--text-sm)` |
| `color` | `var(--text-secondary)` |
| `font-weight` | `var(--font-medium)` |

### `.stat-icon-bubble`

Colored icon container in the top-right corner.

| Property | Value |
|----------|-------|
| `width / height` | `36px` |
| `border-radius` | `var(--radius-md)` |
| `display` | `flex` / `align-items: center` / `justify-content: center` |
| `font-size` | `16px` |

Background and color are set inline or via utility classes.

### `.stat-number`

The primary metric value.

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-heading)` |
| `font-size` | `var(--text-3xl)` |
| `font-weight` | `var(--font-bold)` |
| `letter-spacing` | `var(--tracking-tight)` |
| `line-height` | `1` |
| `margin-bottom` | `var(--space-2)` |

### `.stat-variation`

Trend indicator showing percentage change.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `align-items` | `center` |
| `gap` | `var(--space-1)` |
| `font-family` | `var(--font-mono)` |
| `font-size` | `var(--text-xs)` |
| `font-weight` | `var(--font-medium)` |

#### Directional Modifiers

| Class | Color |
|-------|-------|
| `.up` | `var(--color-success)` |
| `.down` | `var(--color-error)` |

#### `.stat-variation .vs`

Comparison label (e.g., "vs last month").

| Property | Value |
|----------|-------|
| `color` | `var(--text-muted)` |
| `font-family` | `var(--font-body)` |
| `font-weight` | `var(--font-regular)` |
| `margin-left` | `var(--space-1)` |

### `.stat-progress`

Thin progress bar at the bottom of a stat card.

| Property | Value |
|----------|-------|
| `height` | `4px` |
| `background` | `var(--bg-surface-2)` |
| `border-radius` | `var(--radius-full)` |
| `margin-top` | `var(--space-3)` |
| `overflow` | `hidden` |

### `.stat-progress-fill`

The filled portion of the stat progress bar.

| Property | Value |
|----------|-------|
| `height` | `100%` |
| `border-radius` | `var(--radius-full)` |
| `transition` | `width 1s ease-out` |

## Mini Stat Card

A compact variant for secondary metrics.

### `.stat-card-mini`

Applied alongside `.stat-card` to override padding and alignment.

| Property | Value |
|----------|-------|
| `padding` | `var(--space-3) var(--space-5)` |
| `text-align` | `center` |

### `.stat-card-mini-label`

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-mono)` |
| `font-size` | `9px` |
| `color` | `var(--text-muted)` |
| `letter-spacing` | `0.1em` |
| `text-transform` | `uppercase` |

### `.stat-card-mini-value`

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-heading)` |
| `font-size` | `var(--text-2xl)` |
| `font-weight` | `var(--font-bold)` |

## HTML Usage

### Stat grid with standard cards

```html
<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-header">
      <div class="stat-label">Total Candidates</div>
      <div class="stat-icon-bubble icon-badge-blue">&#128100;</div>
    </div>
    <div class="stat-number">2,847</div>
    <div class="stat-variation up">
      &#8593; +12.5% <span class="vs">vs last month</span>
    </div>
  </div>

  <div class="stat-card">
    <div class="stat-header">
      <div class="stat-label">Assessments Done</div>
      <div class="stat-icon-bubble icon-badge-green">&#9989;</div>
    </div>
    <div class="stat-number">1,234</div>
    <div class="stat-variation down">
      &#8595; -3.2% <span class="vs">vs last month</span>
    </div>
  </div>

  <div class="stat-card">
    <div class="stat-header">
      <div class="stat-label">Avg Score</div>
      <div class="stat-icon-bubble icon-badge-purple">&#9733;</div>
    </div>
    <div class="stat-number">78.3</div>
    <div class="stat-variation up">
      &#8593; +5.1% <span class="vs">vs last month</span>
    </div>
    <div class="stat-progress">
      <div class="stat-progress-fill" style="width: 78%; background: var(--accent-primary);"></div>
    </div>
  </div>

  <div class="stat-card">
    <div class="stat-header">
      <div class="stat-label">Completion Rate</div>
      <div class="stat-icon-bubble icon-badge-orange">&#128200;</div>
    </div>
    <div class="stat-number">94%</div>
    <div class="stat-variation up">
      &#8593; +1.8% <span class="vs">vs last month</span>
    </div>
  </div>
</div>
```

### Mini stat cards in a row

```html
<div class="grid-3">
  <div class="stat-card stat-card-mini">
    <div class="stat-card-mini-value">INTJ</div>
    <div class="stat-card-mini-label">MBTI Type</div>
  </div>
  <div class="stat-card stat-card-mini">
    <div class="stat-card-mini-value">5w4</div>
    <div class="stat-card-mini-label">Enneagram</div>
  </div>
  <div class="stat-card stat-card-mini">
    <div class="stat-card-mini-value">DC</div>
    <div class="stat-card-mini-label">DISC Style</div>
  </div>
</div>
```

### Stat card with progress bar

```html
<div class="stat-card">
  <div class="stat-header">
    <div class="stat-label">Goal Progress</div>
    <div class="stat-icon-bubble icon-badge-gold">&#127942;</div>
  </div>
  <div class="stat-number">67%</div>
  <div class="stat-progress">
    <div class="stat-progress-fill" style="width: 67%; background: var(--accent-secondary);"></div>
  </div>
</div>
```

## Tokens Used

- `--space-1`, `--space-2`, `--space-3`, `--space-5` (spacing)
- `--radius-lg`, `--radius-md`, `--radius-full` (border-radius)
- `--font-heading`, `--font-mono`, `--font-body` (typography)
- `--font-regular`, `--font-medium`, `--font-bold`, `--font-semibold` (font weights)
- `--text-xs`, `--text-sm`, `--text-2xl`, `--text-3xl` (font sizes)
- `--tracking-tight` (letter-spacing)
- `--text-primary`, `--text-secondary`, `--text-muted` (text colors)
- `--color-success`, `--color-error` (trend colors)
- `--bg-base`, `--bg-surface-2` (backgrounds)
- `--border-subtle` (borders)
- `--shadow-sm`, `--shadow-md` (shadows)
- `--transition-base` (hover transition)
- `--accent-primary`, `--accent-secondary` (accent colors)

## Do / Don't

| Do | Don't |
|----|-------|
| Use `.stat-grid` for the 4-column layout | Don't manually set grid columns -- `.stat-grid` handles responsive breakpoints |
| Use `.stat-variation.up` for positive trends and `.down` for negative | Don't color trends manually -- the `.up`/`.down` classes set the right semantic colors |
| Use `.stat-card-mini` for secondary/supporting metrics | Don't use `.stat-card-mini` in the main `.stat-grid` -- it is designed for compact layouts |
| Set `.stat-progress-fill` width inline with `style="width: XX%"` | Don't forget to set a background color on `.stat-progress-fill` -- there is no default |
| Use `.stat-icon-bubble` with icon-badge color classes for the corner icon | Don't place large icons in `.stat-icon-bubble` -- keep to 16px font-size |
| Include the `.vs` span for comparison context | Don't omit trend context -- a percentage without comparison is ambiguous |
