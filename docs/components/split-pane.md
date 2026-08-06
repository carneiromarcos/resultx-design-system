# Split pane

Two columns separated by a handle the user drags: main content on one side, a context panel on the other.

## The rule this component exists to enforce

The width lives in **one** variable — `--split-pane-width`, declared on the `.split-pane` element — and the whole grid is derived from it. The panel and the space it takes away from the main column are not two numbers somebody has to remember to keep in sync. They are the same number.

That is not a style preference. Electia's 192px dead gap came from exactly two numbers drifting apart: the width in React state and the offset hand-written on the content. A component whose contract makes that impossible is worth more than one that merely looks right the day it ships.

## Component Anatomy

```
.split-pane [data-split-pane] [data-split-id]     ← owns --split-pane-width
  .split-pane-main                                 ← min-width: 0, scrolls
  .split-pane-handle                               ← role="separator", focusable
  .split-pane-side                                 ← the context panel
```

`.split-pane-start` mirrors the grid, putting the panel on the left — for a master list such as an inbox's conversation column.

## Markup

```html
<div class="split-pane" data-split-pane data-split-id="inbox">
  <main class="split-pane-main">…</main>
  <div class="split-pane-handle"></div>
  <aside class="split-pane-side">…</aside>
</div>
```

`role`, `aria-orientation`, `tabindex` and the `aria-value*` set are applied by the script. Write them yourself only if you need different values.

## Classes

| Class | Role |
|-------|------|
| `.split-pane` | The grid. Declares `--split-pane-width`, `-min` and `-max` |
| `.split-pane-main` | Main column. `min-width: 0` so it can shrink below its min-content |
| `.split-pane-side` | The context panel. Surface and dividing border |
| `.split-pane-handle` | 12px drag area with a 2px visible line |
| `.split-pane-start` | Mirrors the grid — panel on the left |

`min-width: 0` is the whole reason a long unbreakable line does not lock the column open and push the page into horizontal scroll. Same fix applied to `.main` in Onda 1.

## Behavior

`dist/split-pane.js` is what makes the handle draggable. Without it the layout is still correct at the default width — the handle simply does nothing.

```html
<script src="…/resultx-design-system/dist/split-pane.js"></script>
```

Or via the package subpath: `import "resultx-design-system/split-pane"`.

| API | Effect |
|-----|--------|
| `ResultXSplitPane.init(root)` | Enhance every `[data-split-pane]` under `root`. Returns the count |
| `ResultXSplitPane.setWidth(el, px)` | Set the width, clamped to the limits |
| `ResultXSplitPane.getWidth(el)` | Current width in px |
| `ResultXSplitPane.reset(el)` | Back to the token default, and forget the stored value |

Dispatches `splitpaneresize` with `detail: { width }`, bubbling.

### Input

| Gesture | Result |
|---------|--------|
| Drag the handle | Resize. Uses pointer capture, so mouse, touch and pen behave alike and leaving the handle mid-drag does not drop it |
| `←` / `→` on the focused handle | ±16px |
| `Shift` + `←` / `→` | ±64px |
| `Home` / `End` | Jump to the minimum / maximum |
| `Enter`, `Space`, or double-click | Restore the default |

The drag direction flips automatically for `.split-pane-start` — otherwise the panel would shrink when pulled outward.

### Persistence

Give the element a `data-split-id` and the width persists in `localStorage` under `resultx-split-pane:<id>`. Omit it and nothing is stored. A non-numeric stored value is discarded and the default applies. All access is wrapped in `try/catch`.

## Tokens

| Token | Default | Used for |
|-------|---------|----------|
| `--panel-width` | `320px` | Default panel width |
| `--panel-width-min` | `260px` | Lower clamp |
| `--panel-width-max` | `560px` | Upper clamp |
| `--split-handle-width` | `12px` | Drag area |

The limits are read from the CSS at runtime rather than hardcoded in the script, so a product can override `--split-pane-min` / `--split-pane-max` on the element and both the drag and the keyboard respect the new bounds.

## Narrow screens

Below 1024px the grid collapses to a single column, the handle is hidden, and the panel **stacks below** the main content. It is not hidden: a context panel that disappears without a substitute takes the conversation's actions with it.

## Accessibility

- The handle is a `separator` with `aria-orientation="vertical"`, focusable, and its `aria-valuenow` / `valuemin` / `valuemax` stay in sync with every change — drag and keyboard alike.
- `aria-label` defaults to "Redimensionar painel"; override it when a page has more than one.
- The component is fully operable from the keyboard, so dragging is never the only path.
- `touch-action: none` on the handle — without it the browser scrolls instead of letting the drag through.
- While dragging, `user-select: none` is set on the container: otherwise dragging across a conversation selects the whole thread.

## Measured

In Chrome at 1440px, with the Electia bridge loaded:

| Check | Result |
|-------|--------|
| Default | `--split-pane-width: 320px`, panel 320px, main 1108px |
| Drag 120px | Panel 440px, main 988px — the main column gave back exactly what the panel took |
| Drag far past the limit | Stops at 560px |
| `Home` | 260px |
| Reload | Width restored |
| 768px | Single column, no horizontal overflow |

## See also

- [disclosure.md](disclosure.md) — the collapsible modules that usually fill the panel
- `demos/inbox-panel.html` — both components working together
