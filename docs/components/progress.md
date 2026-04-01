# Progress

Progress bar components for displaying scores, completion rates, and assessment dimensions. Includes a chart card container for data visualizations.

## Component Anatomy

### Progress List

```
.progress-list
  .progress-item
    .progress-label [.progress-label-sm]
    .progress-track
      .progress-fill [.disc-d | .disc-i | .disc-s | .disc-c]
    .progress-score [.progress-score-sm]
```

### Chart Card

```
.chart-card
  .chart-header
    .chart-title
    .chart-period
      .chart-period-btn [.active]
  .chart-svg
  .chart-months
```

## Progress Components

### `.progress-list`

Vertical stack container for multiple progress items.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `flex-direction` | `column` |
| `gap` | `var(--space-4)` |

### `.progress-item`

A single progress bar row with label, track, and score.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `align-items` | `center` |
| `gap` | `var(--space-3)` |

### `.progress-label`

Text label on the left side of the progress bar.

| Property | Value |
|----------|-------|
| `font-size` | `var(--text-sm)` |
| `color` | `var(--text-secondary)` |
| `min-width` | `140px` |
| `text-align` | `right` |

### `.progress-label-sm`

Compact label variant.

| Property | Value |
|----------|-------|
| `min-width` | `100px` |
| `font-size` | `var(--text-xs)` |

### `.progress-track`

The background rail for the progress bar.

| Property | Value |
|----------|-------|
| `flex` | `1` |
| `height` | `8px` |
| `background` | `var(--bg-surface-2)` |
| `border-radius` | `var(--radius-full)` |
| `overflow` | `hidden` |

### `.progress-fill`

The filled portion of the progress bar. Width is set inline via `style="width: XX%"`.

| Property | Value |
|----------|-------|
| `height` | `100%` |
| `border-radius` | `var(--radius-full)` |

The fill color is set via inline style or a DISC-specific class. No default color is defined -- you must provide one.

### `.progress-score`

The numeric score displayed to the right of the progress bar.

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-mono)` |
| `font-size` | `var(--text-sm)` |
| `font-weight` | `var(--font-semibold)` |
| `min-width` | `32px` |

### `.progress-score-sm`

Compact score variant.

| Property | Value |
|----------|-------|
| `font-size` | `var(--text-xs)` |

## DISC Progress Fills

Pre-defined gradient fills for DISC personality dimensions.

| Class | Gradient |
|-------|----------|
| `.disc-d` | `linear-gradient(90deg, var(--disc-d), #f87171)` |
| `.disc-i` | `linear-gradient(90deg, var(--disc-i), #fbbf24)` |
| `.disc-s` | `linear-gradient(90deg, var(--disc-s), #4ade80)` |
| `.disc-c` | `linear-gradient(90deg, var(--disc-c), #60a5fa)` |

## Stat Progress (inside Stat Cards)

A thin 4px progress bar used within stat cards.

| Class | Property | Value |
|-------|----------|-------|
| `.stat-progress` | `height` | `4px` |
| `.stat-progress` | `background` | `var(--bg-surface-2)` |
| `.stat-progress` | `border-radius` | `var(--radius-full)` |
| `.stat-progress` | `margin-top` | `var(--space-3)` |
| `.stat-progress-fill` | `height` | `100%` |
| `.stat-progress-fill` | `border-radius` | `var(--radius-full)` |
| `.stat-progress-fill` | `transition` | `width 1s ease-out` |

## Chart Card Components

### `.chart-card`

Card container for chart visualizations.

| Property | Value |
|----------|-------|
| `background` | `var(--bg-base)` |
| `border` | `1px solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `padding` | `var(--space-6)` |
| `box-shadow` | `var(--shadow-sm)` |

### `.chart-header`

Header bar with title and period selector.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `justify-content` | `space-between` |
| `align-items` | `center` |
| `margin-bottom` | `var(--space-5)` |

### `.chart-title`

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-heading)` |
| `font-size` | `var(--text-lg)` |
| `font-weight` | `var(--font-semibold)` |

### `.chart-period`

Segmented control for time period selection.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `gap` | `2px` |
| `background` | `var(--bg-surface-2)` |
| `border-radius` | `var(--radius-md)` |
| `padding` | `2px` |

### `.chart-period-btn`

| Property | Value |
|----------|-------|
| `padding` | `var(--space-1) var(--space-3)` |
| `font-size` | `var(--text-xs)` |
| `font-weight` | `var(--font-medium)` |
| `border` | `none` |
| `background` | `transparent` |
| `color` | `var(--text-muted)` |
| `border-radius` | `var(--radius-sm)` |
| `cursor` | `pointer` |

**Active (`.active`):** `background: var(--bg-base); color: var(--accent-primary); box-shadow: var(--shadow-sm)`

### `.chart-svg`

| Property | Value |
|----------|-------|
| `width` | `100%` |
| `height` | `200px` |

### `.chart-months`

Bottom axis labels.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `justify-content` | `space-between` |
| `margin-top` | `var(--space-2)` |
| `font-family` | `var(--font-mono)` |
| `font-size` | `10px` |
| `color` | `var(--text-muted)` |

## HTML Usage

### Basic progress list

```html
<div class="progress-list">
  <div class="progress-item">
    <div class="progress-label">Openness</div>
    <div class="progress-track">
      <div class="progress-fill" style="width: 85%; background: var(--accent-primary);"></div>
    </div>
    <div class="progress-score">85</div>
  </div>
  <div class="progress-item">
    <div class="progress-label">Conscientiousness</div>
    <div class="progress-track">
      <div class="progress-fill" style="width: 72%; background: var(--color-success);"></div>
    </div>
    <div class="progress-score">72</div>
  </div>
</div>
```

### DISC progress bars

```html
<div class="progress-list">
  <div class="progress-item">
    <div class="progress-label">Dominance</div>
    <div class="progress-track">
      <div class="progress-fill disc-d" style="width: 78%;"></div>
    </div>
    <div class="progress-score">78</div>
  </div>
  <div class="progress-item">
    <div class="progress-label">Influence</div>
    <div class="progress-track">
      <div class="progress-fill disc-i" style="width: 92%;"></div>
    </div>
    <div class="progress-score">92</div>
  </div>
  <div class="progress-item">
    <div class="progress-label">Steadiness</div>
    <div class="progress-track">
      <div class="progress-fill disc-s" style="width: 65%;"></div>
    </div>
    <div class="progress-score">65</div>
  </div>
  <div class="progress-item">
    <div class="progress-label">Compliance</div>
    <div class="progress-track">
      <div class="progress-fill disc-c" style="width: 58%;"></div>
    </div>
    <div class="progress-score">58</div>
  </div>
</div>
```

### Compact progress (small labels and scores)

```html
<div class="progress-item">
  <div class="progress-label progress-label-sm">Score</div>
  <div class="progress-track">
    <div class="progress-fill" style="width: 60%; background: var(--theory-mbti);"></div>
  </div>
  <div class="progress-score progress-score-sm">60</div>
</div>
```

### Chart card

```html
<div class="chart-card">
  <div class="chart-header">
    <div class="chart-title">Assessments Over Time</div>
    <div class="chart-period">
      <button class="chart-period-btn">7D</button>
      <button class="chart-period-btn active">30D</button>
      <button class="chart-period-btn">90D</button>
    </div>
  </div>
  <svg class="chart-svg">
    <!-- Chart content (SVG paths, areas, etc.) -->
  </svg>
  <div class="chart-months">
    <span>Jan</span><span>Feb</span><span>Mar</span>
    <span>Apr</span><span>May</span><span>Jun</span>
  </div>
</div>
```

## Tokens Used

- `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-5`, `--space-6` (spacing)
- `--radius-full`, `--radius-sm`, `--radius-md`, `--radius-lg` (border-radius)
- `--font-mono`, `--font-heading` (typography)
- `--font-medium`, `--font-semibold` (font weights)
- `--text-xs`, `--text-sm`, `--text-lg` (font sizes)
- `--text-secondary`, `--text-muted` (text colors)
- `--bg-base`, `--bg-surface-2` (backgrounds)
- `--border-subtle` (borders)
- `--shadow-sm` (shadow)
- `--accent-primary` (chart period active, progress fill)
- `--disc-d`, `--disc-i`, `--disc-s`, `--disc-c` (DISC theory colors)
- `--transition-fast` (chart button transition)

## Do / Don't

| Do | Don't |
|----|-------|
| Set progress width via inline `style="width: XX%"` | Don't animate width with CSS classes -- use inline styles for dynamic values |
| Use DISC classes (`.disc-d`, etc.) for DISC assessment bars | Don't manually set DISC colors inline -- the gradient classes handle it |
| Use `.progress-label-sm` and `.progress-score-sm` together for compact rows | Don't mix normal and small sizes within the same progress list |
| Provide a fill color via inline style or a DISC class | Don't leave `.progress-fill` without a background -- no default color is set |
| Use `.chart-period` for time-range toggles | Don't use tabs (`.tabs`) inside chart cards -- use `.chart-period` for chart controls |
| Wrap chart visualizations in `.chart-card` | Don't use `.card` for charts -- `.chart-card` has dedicated padding and header layout |
