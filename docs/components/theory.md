# Theory

Assessment theory-specific components for displaying personality types, scores, and analysis results. These components are used in candidate profiles and assessment detail views for MBTI, Enneagram, Big Five, DISC, Lesenne, and Jung theories.

## Component Anatomy

### Theory Card

```
.theory-grid
  .theory-card
    .theory-header
      .theory-name
      .badge .badge-{theory}
    .theory-type
    .theory-description
    [theory-specific content]
```

### MBTI Bar

```
.mbti-bar-track
  .mbti-axis-label    (e.g., "E")
  .mbti-bar-bg
    .mbti-bar-fill
  .mbti-bar-pct       (e.g., "72%")
  .mbti-axis-label    (e.g., "I")
```

### Enneagram Mini Cards

```
.enneagram-grid
  .enneagram-mini-card .enneagram-mini-card-fear
    .enneagram-mini-label .enneagram-mini-label-fear
    .enneagram-mini-text
  .enneagram-mini-card .enneagram-mini-card-desire
    .enneagram-mini-label .enneagram-mini-label-desire
    .enneagram-mini-text
```

### DNA Badges

```
.dna-badges
  .badge .badge-{theory}   (repeated)
```

## Components

### `.theory-grid`

Grid container for theory cards.

| Property | Value |
|----------|-------|
| `display` | `grid` |
| `grid-template-columns` | `repeat(3, 1fr)` |
| `gap` | `var(--space-5)` |

Responsive: collapses to `1fr` at `max-width: 1024px`.

### `.theory-card`

Card container for a single theory assessment result.

| Property | Value |
|----------|-------|
| `background` | `var(--bg-base)` |
| `border` | `1px solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `padding` | `var(--space-5)` |
| `box-shadow` | `var(--shadow-sm)` |
| `transition` | `all var(--transition-base)` |

**Hover:** `box-shadow: var(--shadow-md); transform: translateY(-2px)`

### `.theory-header`

Top row with theory name label and badge.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `justify-content` | `space-between` |
| `align-items` | `center` |
| `margin-bottom` | `var(--space-4)` |

### `.theory-name`

Uppercase mono label identifying the theory.

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-mono)` |
| `font-size` | `var(--text-xs)` |
| `letter-spacing` | `var(--tracking-wider)` |
| `text-transform` | `uppercase` |
| `color` | `var(--text-muted)` |

### `.theory-type`

The primary result value (e.g., "INTJ", "Type 5w4", "DC").

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-heading)` |
| `font-size` | `var(--text-2xl)` |
| `font-weight` | `var(--font-bold)` |
| `margin-bottom` | `var(--space-1)` |

### `.theory-description`

Brief text description of the result.

| Property | Value |
|----------|-------|
| `font-size` | `var(--text-sm)` |
| `color` | `var(--text-secondary)` |
| `margin-bottom` | `var(--space-4)` |

---

## MBTI Axis Bars

Horizontal bars showing the position on each MBTI axis (E/I, S/N, T/F, J/P).

### `.mbti-bar-track`

A single axis row.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `align-items` | `center` |
| `gap` | `var(--space-3)` |
| `margin-bottom` | `var(--space-3)` |

### `.mbti-axis-label`

The letter labels on each end of the bar (e.g., "E" and "I").

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-mono)` |
| `font-size` | `var(--text-sm)` |
| `font-weight` | `var(--font-semibold)` |
| `min-width` | `14px` |

### `.mbti-bar-bg`

The background track of the bar.

| Property | Value |
|----------|-------|
| `flex` | `1` |
| `height` | `8px` |
| `background` | `var(--bg-surface-2)` |
| `border-radius` | `var(--radius-full)` |
| `overflow` | `hidden` |

### `.mbti-bar-fill`

The filled portion indicating the dominant trait. Width and background color set inline.

| Property | Value |
|----------|-------|
| `height` | `100%` |
| `border-radius` | `var(--radius-full)` |

### `.mbti-bar-pct`

The percentage value displayed on the right.

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-mono)` |
| `font-size` | `var(--text-xs)` |
| `color` | `var(--text-muted)` |
| `min-width` | `36px` |
| `text-align` | `right` |

---

## Enneagram Mini Cards

Small cards used inside a theory card to display the core fear and desire of an Enneagram type.

### `.enneagram-grid`

| Property | Value |
|----------|-------|
| `display` | `grid` |
| `grid-template-columns` | `1fr 1fr` |
| `gap` | `var(--space-3)` |

### `.enneagram-mini-card`

Base mini card.

| Property | Value |
|----------|-------|
| `padding` | `var(--space-3)` |
| `border` | `1px solid` |
| `border-radius` | `var(--radius-md)` |

### `.enneagram-mini-card-fear`

| Property | Value |
|----------|-------|
| `background` | `var(--color-error-bg)` |
| `border-color` | `rgba(220,38,38,0.15)` |

### `.enneagram-mini-card-desire`

| Property | Value |
|----------|-------|
| `background` | `var(--accent-primary-muted)` |
| `border-color` | `rgba(29,78,216,0.15)` |

### `.enneagram-mini-label`

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-mono)` |
| `font-size` | `10px` |
| `letter-spacing` | `0.1em` |
| `text-transform` | `uppercase` |
| `margin-bottom` | `var(--space-1)` |

- `.enneagram-mini-label-fear`: `color: var(--color-error)`
- `.enneagram-mini-label-desire`: `color: var(--accent-primary)`

### `.enneagram-mini-text`

| Property | Value |
|----------|-------|
| `font-size` | `var(--text-xs)` |
| `color` | `var(--text-secondary)` |

---

## DNA Badges

A centered row of theory badges, typically displayed on a profile page to show which assessments a person has completed.

### `.dna-badges`

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `justify-content` | `center` |
| `gap` | `var(--space-3)` |
| `margin-bottom` | `var(--space-6)` |

---

## Compare Banner

A banner section for comparison views.

### `.compare-banner`

| Property | Value |
|----------|-------|
| `border` | `1px solid var(--border-subtle)` |
| `border-radius` | `var(--radius-xl)` |
| `padding` | `var(--space-6)` |
| `margin-bottom` | `var(--space-8)` |
| `text-align` | `center` |

### `.compare-title`

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-heading)` |
| `font-size` | `var(--text-2xl)` |
| `font-weight` | `var(--font-bold)` |
| `margin-bottom` | `var(--space-2)` |

### `.compare-sub`

| Property | Value |
|----------|-------|
| `color` | `var(--text-secondary)` |
| `font-size` | `var(--text-sm)` |

## HTML Usage

### Theory grid with MBTI card

```html
<div class="theory-grid">
  <div class="theory-card">
    <div class="theory-header">
      <div class="theory-name">MBTI</div>
      <span class="badge badge-mbti">Cognitive</span>
    </div>
    <div class="theory-type">INTJ</div>
    <div class="theory-description">The Architect - Strategic and independent thinker.</div>

    <div class="mbti-bar-track">
      <span class="mbti-axis-label">E</span>
      <div class="mbti-bar-bg">
        <div class="mbti-bar-fill" style="width: 28%; background: var(--theory-mbti);"></div>
      </div>
      <span class="mbti-bar-pct">28%</span>
      <span class="mbti-axis-label">I</span>
    </div>
    <div class="mbti-bar-track">
      <span class="mbti-axis-label">S</span>
      <div class="mbti-bar-bg">
        <div class="mbti-bar-fill" style="width: 35%; background: var(--theory-mbti);"></div>
      </div>
      <span class="mbti-bar-pct">35%</span>
      <span class="mbti-axis-label">N</span>
    </div>
    <div class="mbti-bar-track">
      <span class="mbti-axis-label">T</span>
      <div class="mbti-bar-bg">
        <div class="mbti-bar-fill" style="width: 82%; background: var(--theory-mbti);"></div>
      </div>
      <span class="mbti-bar-pct">82%</span>
      <span class="mbti-axis-label">F</span>
    </div>
    <div class="mbti-bar-track">
      <span class="mbti-axis-label">J</span>
      <div class="mbti-bar-bg">
        <div class="mbti-bar-fill" style="width: 75%; background: var(--theory-mbti);"></div>
      </div>
      <span class="mbti-bar-pct">75%</span>
      <span class="mbti-axis-label">P</span>
    </div>
  </div>
</div>
```

### Enneagram theory card

```html
<div class="theory-card">
  <div class="theory-header">
    <div class="theory-name">Enneagram</div>
    <span class="badge badge-enneagram">Motivational</span>
  </div>
  <div class="theory-type">Type 5w4</div>
  <div class="theory-description">The Iconoclast - Perceptive, cerebral, and provocative.</div>

  <div class="enneagram-grid">
    <div class="enneagram-mini-card enneagram-mini-card-fear">
      <div class="enneagram-mini-label enneagram-mini-label-fear">Core Fear</div>
      <div class="enneagram-mini-text">Being useless, helpless, or overwhelmed</div>
    </div>
    <div class="enneagram-mini-card enneagram-mini-card-desire">
      <div class="enneagram-mini-label enneagram-mini-label-desire">Core Desire</div>
      <div class="enneagram-mini-text">Being capable and competent</div>
    </div>
  </div>
</div>
```

### DISC theory card with progress bars

```html
<div class="theory-card">
  <div class="theory-header">
    <div class="theory-name">DISC</div>
    <span class="badge badge-disc">Behavioral</span>
  </div>
  <div class="theory-type">DC</div>
  <div class="theory-description">Dominant-Compliant - Results-driven with attention to detail.</div>

  <div class="progress-list">
    <div class="progress-item">
      <div class="progress-label progress-label-sm">D</div>
      <div class="progress-track">
        <div class="progress-fill disc-d" style="width: 85%;"></div>
      </div>
      <div class="progress-score progress-score-sm">85</div>
    </div>
    <div class="progress-item">
      <div class="progress-label progress-label-sm">I</div>
      <div class="progress-track">
        <div class="progress-fill disc-i" style="width: 42%;"></div>
      </div>
      <div class="progress-score progress-score-sm">42</div>
    </div>
    <div class="progress-item">
      <div class="progress-label progress-label-sm">S</div>
      <div class="progress-track">
        <div class="progress-fill disc-s" style="width: 38%;"></div>
      </div>
      <div class="progress-score progress-score-sm">38</div>
    </div>
    <div class="progress-item">
      <div class="progress-label progress-label-sm">C</div>
      <div class="progress-track">
        <div class="progress-fill disc-c" style="width: 78%;"></div>
      </div>
      <div class="progress-score progress-score-sm">78</div>
    </div>
  </div>
</div>
```

### DNA badges on profile

```html
<div class="dna-badges">
  <span class="badge badge-mbti">INTJ</span>
  <span class="badge badge-enneagram">5w4</span>
  <span class="badge badge-disc">DC</span>
  <span class="badge badge-bigfive">Big Five</span>
  <span class="badge badge-lesenne">Lesenne</span>
  <span class="badge badge-jung">Jung</span>
</div>
```

### Comparison banner

```html
<div class="compare-banner">
  <div class="compare-title">Team Compatibility Analysis</div>
  <div class="compare-sub">Comparing behavioral profiles across 6 theories</div>
</div>
```

## Tokens Used

- `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-5`, `--space-6`, `--space-8` (spacing)
- `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full` (border-radius)
- `--font-heading`, `--font-mono` (typography)
- `--font-semibold`, `--font-bold` (font weights)
- `--text-xs`, `--text-sm`, `--text-2xl` (font sizes)
- `--tracking-wider` (letter-spacing)
- `--text-primary`, `--text-secondary`, `--text-muted` (text colors)
- `--bg-base`, `--bg-surface-2` (backgrounds)
- `--border-subtle` (borders)
- `--shadow-sm`, `--shadow-md` (shadows)
- `--transition-base` (hover transition)
- `--theory-mbti`, `--theory-enneagram`, `--theory-bigfive`, `--theory-disc`, `--theory-lesenne`, `--theory-jung` (theory colors)
- `--disc-d`, `--disc-i`, `--disc-s`, `--disc-c` (DISC bar colors)
- `--color-error`, `--color-error-bg` (enneagram fear card)
- `--accent-primary`, `--accent-primary-muted` (enneagram desire card)

## Do / Don't

| Do | Don't |
|----|-------|
| Use `.theory-grid` with 3 columns for overview layouts | Don't manually set grid columns -- the responsive breakpoint handles single-column at 1024px |
| Use `.theory-name` for the theory label (MBTI, DISC, etc.) | Don't use `.theory-name` for the result value -- use `.theory-type` for that |
| Use `.mbti-bar-track` for each of the 4 MBTI axes | Don't reuse MBTI bars for DISC -- use `.progress-list` with `.disc-*` classes instead |
| Set `.mbti-bar-fill` width and color inline | Don't hardcode MBTI colors -- use `var(--theory-mbti)` for consistency |
| Use `.enneagram-mini-card-fear` and `.enneagram-mini-card-desire` for the 2-column layout | Don't create more than 2 enneagram mini cards per theory card |
| Use `.dna-badges` as a summary row on profiles | Don't place `.dna-badges` inside theory cards -- it belongs at the profile level |
| Use `.compare-banner` at the top of comparison/team views | Don't use `.compare-banner` inside cards -- it is a standalone section element |
