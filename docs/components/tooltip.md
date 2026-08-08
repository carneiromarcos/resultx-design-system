# Tooltip

A short label that appears beside a control on hover or focus. Supplementary — never the only place the information exists.

## Component Anatomy

```
.tooltip-wrapper [.tooltip-wrapper-inline]
  the trigger (button, link, icon…)
  .tooltip [.tooltip-bottom | .tooltip-left | .tooltip-right]
```

## Markup

```html
<button class="btn-icon tooltip-wrapper" type="button" aria-label="Arquivar">
  <svg class="icon" aria-hidden="true">…</svg>
  <span class="tooltip" role="tooltip">Arquivar</span>
</button>
```

On a rail item, where the label is out of sight:

```html
<a class="sidebar-item tooltip-wrapper" href="/atendimento">
  <svg class="icon icon-md" aria-hidden="true">…</svg>
  <span class="sidebar-label">Atendimento</span>
  <span class="tooltip tooltip-right" role="tooltip">Atendimento</span>
</a>
```

## `.tooltip-wrapper` sets position, not display

The wrapper carries **only** `position: relative` — the anchor the tooltip needs. It deliberately does **not** set `display`.

It used to force `display: inline-block`, and that quietly dismantled whatever layout the trigger already had. A rail item is a flex row; an inline-block wrapper collapsed it, and `demos/electia-copiloto.html` carried a local workaround (`.sidebar-item.tooltip-wrapper { display: flex }`) to undo the damage. That workaround is gone.

If your trigger is a bare `<span>` that genuinely wants the old behaviour, add `.tooltip-wrapper-inline`.

## Position variants

| Class | Where the tooltip sits |
|-------|------------------------|
| *(none)* | Above, centred — the default |
| `.tooltip-bottom` | Below |
| `.tooltip-right` | To the right, vertically centred |
| `.tooltip-left` | To the left, vertically centred |

Each variant repositions the arrow (`::after`) to match. `.tooltip-right` is the one a navigation rail wants: the panel sits at the screen edge, so above and below get clipped.

## It appears on hover **and** on keyboard focus

```css
.tooltip-wrapper:hover .tooltip,
.tooltip-wrapper:focus-within .tooltip { opacity: 1; }
```

`:focus-within` is not a nicety. Without it the tooltip never appears for anyone navigating by keyboard — the exact defect that makes the `title` attribute unsuitable, and the reason [navigation.md](navigation.md) tells rail items to use this component instead of `title`. That recommendation is only true because of this line.

`:focus-within` also matches when a focusable **child** takes focus, so it works either way.

## Accessibility

- **The tooltip is not an accessible name.** It is hidden with `opacity: 0`, which leaves it in the accessibility tree at all times — a screen reader may read it regardless of hover. Give the trigger a real `aria-label` (or visible text) and treat the tooltip as visual redundancy for sighted pointer and keyboard users.
- Use `role="tooltip"` on the bubble.
- **Never put the only copy of an instruction in a tooltip.** Touch users have no hover, and hover-only content is invisible to them.
- Do not put interactive content inside. A link or button in a tooltip cannot be reached — the tooltip disappears as focus moves toward it. That is a popover, not a tooltip.
- The trigger must be focusable for `:focus-within` to fire. A `<div>` with no `tabindex` never receives focus, so the tooltip never shows on keyboard.

## Tokens

| Token | Used for |
|-------|----------|
| `--text-primary` | Bubble background — deliberately inverted against the page |
| `--bg-base` | Bubble text |
| `--text-xs` / `--font-medium` | Type |
| `--radius-md` | Corners |
| `--transition-fast` | Fade |

## See also

- [toast.md](toast.md) · [empty-state.md](empty-state.md)
- [navigation.md](navigation.md) — the rail that depends on this component
