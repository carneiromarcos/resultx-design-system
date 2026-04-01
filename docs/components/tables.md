# Tables

Data tables for displaying structured, tabular information inside card containers. Tables include header rows, hover states, and specialized cell formatting for names, avatars, and scores.

## Component Anatomy

```
.table-card
  .table-header
    .table-header-title
    [actions, e.g., buttons or dropdowns]
  table
    thead
      tr > th
    tbody
      tr > td [.td-name | .td-score | .td-avatar]
```

## Components

### `.table-card`

The outer wrapper that provides card styling around the table.

| Property | Value |
|----------|-------|
| `background` | `var(--bg-base)` |
| `border` | `1px solid var(--border-subtle)` |
| `border-radius` | `var(--radius-lg)` |
| `box-shadow` | `var(--shadow-sm)` |
| `overflow` | `hidden` |

### `.table-header`

A bar above the table for the title and optional action buttons.

| Property | Value |
|----------|-------|
| `display` | `flex` |
| `justify-content` | `space-between` |
| `align-items` | `center` |
| `padding` | `var(--space-4) var(--space-6)` |
| `border-bottom` | `1px solid var(--border-subtle)` |

### `.table-header-title`

The heading text inside the table header.

| Property | Value |
|----------|-------|
| `font-family` | `var(--font-heading)` |
| `font-weight` | `var(--font-semibold)` |

### `table`

The native HTML table element (unstyled except width).

| Property | Value |
|----------|-------|
| `width` | `100%` |
| `border-collapse` | `collapse` |

### `th`

Table header cells.

| Property | Value |
|----------|-------|
| `text-align` | `left` |
| `padding` | `var(--space-3) var(--space-6)` |
| `font-size` | `var(--text-xs)` |
| `font-weight` | `var(--font-semibold)` |
| `text-transform` | `uppercase` |
| `letter-spacing` | `var(--tracking-wide)` |
| `color` | `var(--text-muted)` |
| `background` | `var(--bg-surface-1)` |
| `border-bottom` | `1px solid var(--border-subtle)` |

### `td`

Table body cells.

| Property | Value |
|----------|-------|
| `padding` | `var(--space-3) var(--space-6)` |
| `font-size` | `var(--text-sm)` |
| `border-bottom` | `1px solid var(--border-subtle)` |
| `color` | `var(--text-secondary)` |

The last row's `td` has no bottom border (`tr:last-child td { border-bottom: none; }`).

### Row Hover

| Property | Value |
|----------|-------|
| `tr:hover td` | `background: var(--bg-surface-1)` |

## Cell Variants

| Class | Effect |
|-------|--------|
| `.td-name` | `color: var(--text-primary); font-weight: var(--font-medium)` |
| `.td-avatar` | `28px` circle with centered initials, `font-size: 10px`, `font-weight: var(--font-bold)`, `margin-right: var(--space-2)` |
| `.td-score` | `font-family: var(--font-mono); font-weight: var(--font-bold); color: var(--accent-primary)` |
| `.td-score-total` | `font-size: var(--text-xs); color: var(--text-muted)` |

## HTML Usage

### Basic table

```html
<div class="table-card">
  <div class="table-header">
    <div class="table-header-title">Candidates</div>
    <button class="btn btn-sm btn-secondary">Export</button>
  </div>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Score</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <span class="td-avatar" style="background: linear-gradient(135deg, #6366F1, #8B5CF6);">MS</span>
          <span class="td-name">Maria Silva</span>
        </td>
        <td>maria@example.com</td>
        <td>
          <span class="td-score">87</span>
          <span class="td-score-total">/100</span>
        </td>
        <td><span class="badge badge-success">Approved</span></td>
      </tr>
      <tr>
        <td>
          <span class="td-avatar" style="background: linear-gradient(135deg, #F59E0B, #EF4444);">JO</span>
          <span class="td-name">Joao Oliveira</span>
        </td>
        <td>joao@example.com</td>
        <td>
          <span class="td-score">62</span>
          <span class="td-score-total">/100</span>
        </td>
        <td><span class="badge badge-warning">Pending</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

### Table with badge-table size

```html
<td><span class="badge badge-mbti badge-table">MBTI</span></td>
```

## Tokens Used

- `--space-2`, `--space-3`, `--space-4`, `--space-6` (spacing)
- `--radius-lg`, `--radius-full` (border-radius)
- `--font-heading`, `--font-mono` (typography families)
- `--font-medium`, `--font-semibold`, `--font-bold` (font weights)
- `--text-xs`, `--text-sm` (font sizes)
- `--tracking-wide` (letter-spacing)
- `--text-primary`, `--text-secondary`, `--text-muted` (text colors)
- `--accent-primary` (score color)
- `--bg-base`, `--bg-surface-1` (backgrounds)
- `--border-subtle` (borders)
- `--shadow-sm` (card shadow)

## Do / Don't

| Do | Don't |
|----|-------|
| Wrap tables in `.table-card` for consistent card styling | Don't use a bare `<table>` without `.table-card` -- it lacks border-radius and shadow |
| Use `.table-header` for a title and action buttons above the table | Don't place the title inside `<thead>` -- use the dedicated `.table-header` bar |
| Use `.td-name` for the primary identifier column | Don't apply `.td-name` to every column -- only the name/title column |
| Use `.td-avatar` for user initials next to names | Don't set avatar background inline without a gradient -- match the design system pattern |
| Combine `.badge-table` with theory badges for compact badges in cells | Don't use full-size badges inside table cells -- they disrupt row height |
| Use `th` for column headers with uppercase styling | Don't manually style `<th>` -- the base styles handle text transform and spacing |
