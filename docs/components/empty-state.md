# Empty state

What fills a space that has no content yet. Two sizes — and picking the wrong one breaks the layout around it.

## Two variants, two jobs

| | `.empty-state` | `.empty-state-inline` |
|---|---|---|
| For | A **page** or a full panel | A **slot**: kanban column, side panel, dashboard card |
| Icon | 80px circle | hidden |
| Padding | `--space-16` / `--space-8` | `--space-6` / `--space-4` |
| Frame | none | dashed border |
| Title size | `--text-xl` | `--text-base` |

**The full version does not fit in a slot.** An 80px icon plus `--space-16` of padding overflows a kanban column, a side panel or a dashboard card — which is exactly why the inline variant exists. Its dashed border is not decoration either: it reads as *an area that receives content*, the right signal for a drop target.

## Component Anatomy

```
.empty-state [.empty-state-inline]
  .empty-state-icon      (hidden in the inline variant)
  .empty-state-title
  .empty-state-text
  action                 (a .btn, optional)
```

## Markup

```html
<div class="empty-state">
  <div class="empty-state-icon" aria-hidden="true">
    <svg class="icon icon-2xl">…</svg>
  </div>
  <h2 class="empty-state-title">Nenhum candidato ainda</h2>
  <p class="empty-state-text">
    Quando alguém se inscrever nesta vaga, aparece aqui.
  </p>
  <button class="btn btn-primary" type="button">Convidar candidato</button>
</div>
```

Inline, in a kanban column:

```html
<div class="empty-state empty-state-inline">
  <div class="empty-state-title">Nada em triagem</div>
  <p class="empty-state-text">Arraste um card para cá.</p>
</div>
```

## Classes

| Class | Role |
|-------|------|
| `.empty-state` | Column flex, centred, generous padding |
| `.empty-state-icon` | 80px circle on `--bg-surface-2` |
| `.empty-state-title` | Heading face, `--text-xl` |
| `.empty-state-text` | `max-width: 360px` — keeps the explanation to a readable measure |
| `.empty-state-inline` | Compact variant: hides the icon, shrinks the title, drops the trailing margin, adds the dashed frame |

## Writing the copy

The empty state is the one screen a user reads carefully, because there is nothing else to look at.

- **Say what would be here**, not that something is absent. "Nenhum candidato ainda" beats "Sem resultados".
- **Say what to do next**, and make that the action button. An empty state with no way out is a dead end.
- Distinguish *empty* from *filtered to nothing*. "Nenhum candidato ainda" and "Nenhum candidato com este filtro" call for different buttons — the second should offer to clear the filter.

## Accessibility

- Mark `.empty-state-icon` as `aria-hidden="true"`. It is decorative, and the title already says what is happening.
- Use a real heading (`<h2>`, `<h3>`) when the empty state owns a page region, so it lands in the document outline. In a slot, a `<div>` is fine — an extra heading level there is noise.
- If the state appears **after** an action — a filter returning nothing — announce it in a live region. A silent change leaves a screen-reader user waiting for a result that already arrived.

## Tokens

| Token | Used for |
|-------|----------|
| `--bg-surface-2` | Icon circle |
| `--border-default` | Dashed frame of the inline variant |
| `--text-secondary` / `--text-muted` | Body text |
| `--space-16` / `--space-8` / `--space-6` / `--space-4` | The two padding scales |

## See also

- [toast.md](toast.md) · [tooltip.md](tooltip.md)
- [cards.md](cards.md) — the surfaces an inline empty state usually sits in
