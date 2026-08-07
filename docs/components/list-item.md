# List item

A list row with a face, a name, a "when", a preview and some metadata. It came out of a conversation list, but nothing in it is about messaging — the same row serves notifications, candidates, employees.

## `.layout-list-item` is now a deprecated alias of this component

Two components used to do nearly the same thing. They were consolidated on 07/08: the old names became aliases **inside the same rules**, so there is one implementation and two vocabularies.

**Nothing was removed.** `.layout-list-item` is a public class and FinanceX imports the whole component bundle — removing it would be a breaking change, and breaking changes belong in a major. So the old names keep working, and they inherited the three fixes they never had:

| | `.layout-list-item` before | after consolidation |
|---|---|---|
| Selected state | `.active` with `border-left: 3px` — **shifted content sideways** | inset `box-shadow` — measured **0px** shift |
| `min-width: 0` on the row | no | yes |
| Focus ring | none | 3px, measured |
| Transition | `all` | `background` only |

### Migration

| deprecated | use instead |
|---|---|
| `.layout-list-item` | `.list-item` |
| `.layout-list-item-info` | `.list-item-body` |
| `.layout-list-item-name` | `.list-item-title` |
| `.layout-list-item-meta` | `.list-item-meta` |
| `.layout-list-item.active` | `.list-item[aria-current]` |

The old component carried its divider on each row (`border-bottom`); the new one puts it on `.list-item-group`, where it belongs. A compatibility rule keeps the line for old markup that has no group wrapper.

Every alias is marked `alias depreciado` in the source so they can all come out at once in the next major. `demos/candidatos.html` was migrated and no longer uses the old names — a test asserts that.

## Not the same as `.search-result-item`

`.search-result-item` is the compact single-line row of a command palette: one line, a 28px avatar, no timestamp and no preview. Same family, different job.

## Component Anatomy

```
a.list-item [aria-current] [.list-item-unread] [.list-item-compact]
  .avatar .avatar-md            ← reused from the DS, not redefined here
  .list-item-body
    .list-item-head
      .list-item-title          ← truncates
      .list-item-time           ← never shrinks
      .list-item-count          ← only when there is something to count
    .list-item-preview          ← truncates
    .list-item-meta
```

Wrap rows in `.list-item-group`; the divider lives between siblings, never above the first or below the last.

## Markup

```html
<ul class="list-item-group">
  <li>
    <a class="list-item" href="…" aria-current="true">
      <img class="avatar avatar-md" src="…" alt="">
      <span class="list-item-body">
        <span class="list-item-head">
          <span class="list-item-title">Roberta Moraes</span>
          <time class="list-item-time" datetime="2026-08-07T17:48">1min</time>
        </span>
        <span class="list-item-preview">Você: do celular</span>
        <span class="list-item-meta">WhatsApp · Pessoal</span>
      </span>
    </a>
  </li>
</ul>
```

The avatar is the DS's own `.avatar` family — including `.avatar-status` for the presence dot. This component ships no avatar of its own, and a test asserts it stays that way.

## Classes

| Class | Role |
|-------|------|
| `.list-item-group` | The list. Dividers between siblings |
| `.list-item` | One row |
| `.list-item-body` | The text column |
| `.list-item-head` | Title, time and count on one baseline |
| `.list-item-title` | Truncates with an ellipsis |
| `.list-item-time` | `flex-shrink: 0` and tabular numerals |
| `.list-item-count` | Unread counter. Omit the element when the count is zero |
| `.list-item-preview` | Last message, truncates |
| `.list-item-meta` | Channel, status, whatever the product needs |
| `.list-item-unread` | Bolder title, brighter preview, accent counter |
| `.list-item-compact` | Tighter padding for two-line lists |

## Two decisions worth knowing

**Truncating requires `min-width: 0` at every level of the chain** — row, body, head and title. Miss one and the longest line in the list sets the width of the whole column, which is how a conversation list ends up pushing its own panel open. A test asserts all four.

**The selected rail is an inset `box-shadow`, not a border.** A 3px border shifts the content sideways every time the selection moves — which is exactly what `.layout-list-item` does today. Measured here: content offset between the selected row and its neighbour is **0px**.

## States

| State | Signal |
|-------|--------|
| `:hover` | Surface lifts to `--bg-surface-1` |
| `:focus-visible` | Inset focus ring |
| `[aria-current]` | `--bg-surface-2` plus a 3px accent rail on the left |
| `.list-item-unread` | Title at semibold, preview at full contrast, counter in accent |

The unread state changes **weight**, not only color — a signal resting on hue alone disappears for part of the audience.

## Tokens

| Token | Used for |
|-------|----------|
| `--bg-surface-1` / `-2` / `-3` | Hover, selected, counter |
| `--border-subtle` | Dividers |
| `--text-primary` / `-secondary` / `-muted` | Title, preview, meta |
| `--accent-primary` | Selection rail |
| `--accent-primary-muted` / `--accent-primary-text` | Unread counter |

## Measured

At a 280px column — a realistic conversation list width:

| Check | Result |
|-------|--------|
| Long title | Truncates: 175px shown of 364px real |
| Long preview | Truncates |
| Timestamp | Stays fully visible; it is not squeezed out |
| List overflow | None |
| Selected vs. neighbour content offset | 0px |

## Accessibility

- Mark the current row with `aria-current` — the selected style hangs off that attribute, so the visual state and the announced state cannot drift apart.
- The row is a link or a button, so keyboard and screen reader come for free. Do not put the interaction on a `<div>`.
- Give decorative avatars `alt=""`; the title already names the row.
- If the counter is the only thing announcing unread messages, add a `.sr-only` word beside it — a bare number reads as "2".

## See also

- [segmented.md](segmented.md) · [disclosure.md](disclosure.md) · [split-pane.md](split-pane.md)
- [layout.md](layout.md) — the shell that owns `.layout-list-item`
- `demos/inbox-panel.html`
