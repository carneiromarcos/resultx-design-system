# Composite Components

Higher-level patterns built from atomic components. These represent real product screens and workflows.

## View Toggle

Segmented control to switch between table, kanban, and grid views.

```html
<div class="view-toggle">
  <button class="view-toggle-btn active" aria-pressed="true">
    <svg class="icon icon-sm" aria-hidden="true">...</svg> Tabela
  </button>
  <button class="view-toggle-btn" aria-pressed="false">
    <svg class="icon icon-sm" aria-hidden="true">...</svg> Kanban
  </button>
  <button class="view-toggle-btn" aria-pressed="false">
    <svg class="icon icon-sm" aria-hidden="true">...</svg> Grid
  </button>
</div>
```

## Data Table (Enhanced)

Extends the base table with sorting, selection, and row actions.

### Sortable headers

```html
<th class="th-sortable desc">Score</th>    <!-- sorted descending -->
<th class="th-sortable">Nome</th>          <!-- unsorted -->
<th class="th-sortable asc">Data</th>      <!-- sorted ascending -->
```

### Selection

```html
<tr class="tr-selected">
  <td class="td-checkbox"><input type="checkbox" checked></td>
  <td>...</td>
</tr>
```

### Color-coded cells

```html
<td class="td-success">92</td>   <!-- green background -->
<td class="td-warning">75</td>   <!-- yellow background -->
<td class="td-error">45</td>     <!-- red background -->
```

### Bulk toolbar

Appears when rows are selected. Fixed to bottom of viewport.

```html
<div class="bulk-toolbar">
  <span class="bulk-toolbar-count">3 selecionados</span>
  <button class="btn btn-primary btn-sm">Mover para Entrevista</button>
  <button class="btn btn-danger btn-sm">Rejeitar</button>
</div>
```

## Filter Bar

Active filter pills with remove buttons.

```html
<div class="filter-bar">
  <div class="filter-pill">
    <span class="filter-pill-label">Cargo:</span>
    <span class="filter-pill-value">Backend Dev</span>
    <button class="filter-pill-remove" aria-label="Remover filtro Cargo">&times;</button>
  </div>
  <div class="filter-pill">
    <span class="filter-pill-label">DISC:</span>
    <span class="filter-pill-value">CS</span>
    <button class="filter-pill-remove" aria-label="Remover filtro DISC">&times;</button>
  </div>
  <button class="filter-bar-clear">Limpar filtros</button>
</div>
```

## Stepper / Wizard

Multi-step progress indicator for forms or pipeline stages.

```html
<div class="stepper">
  <div class="stepper-step completed">
    <div class="stepper-step-number">✓</div>
    <div class="stepper-step-label">Triagem</div>
  </div>
  <div class="stepper-connector completed"></div>
  <div class="stepper-step active">
    <div class="stepper-step-number">2</div>
    <div class="stepper-step-label">Entrevista</div>
  </div>
  <div class="stepper-connector"></div>
  <div class="stepper-step">
    <div class="stepper-step-number">3</div>
    <div class="stepper-step-label">Oferta</div>
  </div>
</div>
```

## Pipeline Kanban

HR-specific kanban with stage colors. Extends the base `.kanban` component.

```html
<div class="kanban pipeline">
  <div class="kanban-column pipeline-stage-triagem">
    <div class="kanban-column-header">
      <div class="kanban-column-title">
        <span class="kanban-column-dot"></span> Triagem
      </div>
      <span class="kanban-column-count">8</span>
    </div>
    <div class="kanban-column-body">
      <div class="kanban-card">
        <div class="kanban-card-title">João Pereira</div>
        <div class="kanban-card-meta">
          <span class="badge badge-disc badge-table">CS</span>
          <span class="pipeline-card-score">78</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Stage colors

| Stage | Class | Dot color |
|-------|-------|-----------|
| Triagem | `.pipeline-stage-triagem` | Info blue |
| Entrevista | `.pipeline-stage-entrevista` | Warning yellow |
| Oferta | `.pipeline-stage-oferta` | Success green |
| Contratado | `.pipeline-stage-contratado` | Accent teal |
| Rejeitado | `.pipeline-stage-rejeitado` | Error red |

## Search Autocomplete

Search input with dropdown results.

```html
<div class="search-container">
  <input type="text" class="form-input" aria-label="Buscar" placeholder="Buscar candidato...">
  <div class="search-results">
    <div class="search-result-item">
      <div class="search-result-avatar avatar avatar-sm">JP</div>
      <div>
        <div class="search-result-name">João Pereira</div>
        <div class="search-result-meta">Backend Dev · INTJ</div>
      </div>
    </div>
    <div class="search-result-empty">Nenhum resultado encontrado</div>
  </div>
</div>
```

## Date Range Display

Visual display of selected date range.

```html
<div class="date-range">
  <span class="date-range-icon">📅</span>
  <span class="date-range-input">01/03/2026</span>
  <span class="date-range-separator">→</span>
  <span class="date-range-input">31/03/2026</span>
</div>
```

## Sparkline

Compact inline chart for stat cards. Uses inline SVG.

```html
<svg class="sparkline sparkline-up" viewBox="0 0 80 24">
  <path class="sparkline-area" d="M0,20 L10,18 L20,15 L30,16 L40,12 L50,8 L60,10 L70,5 L80,3 L80,24 L0,24 Z"/>
  <path class="sparkline-line" d="M0,20 L10,18 L20,15 L30,16 L40,12 L50,8 L60,10 L70,5 L80,3"/>
</svg>
```

## Template Reference

See `pages/triagem.html` for a complete example combining view toggle, enhanced table, filter bar, pipeline kanban, and stepper in a real candidate screening workflow.
