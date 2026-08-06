# Disclosure

A block of content the user opens and closes. It is the pattern behind the modules of a context panel — "Modo de atendimento", "Atendimento", "Enriquecimento".

Built on `<details>`/`<summary>`. That is not a shortcut: the native element already carries the semantic role, `aria-expanded`, keyboard support (Enter and Space), correct screen-reader announcement, and automatic reveal when the user searches the page. Rebuilding it on `<div>` is exactly how those get lost.

## Component Anatomy

```
details.disclosure [data-disclosure-id] [open]
  summary.disclosure-summary
    .disclosure-label        (text, truncates)
    .disclosure-badge        (optional count)
    svg.disclosure-chevron   (rotates 180° when open)
  .disclosure-panel          (grid — animates 0fr → 1fr)
    .disclosure-content      (overflow: hidden, min-height: 0)
```

## Markup

```html
<details class="disclosure" data-disclosure-id="enriquecimento" open>
  <summary class="disclosure-summary">
    <span class="disclosure-label">Enriquecimento</span>
    <span class="disclosure-badge">3</span>
    <svg class="disclosure-chevron" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  </summary>
  <div class="disclosure-panel">
    <div class="disclosure-content">…</div>
  </div>
</details>
```

Wrap siblings in `.disclosure-group` so the spacing belongs to the group, not to each item.

## Classes

| Class | Role |
|-------|------|
| `.disclosure` | The card: surface, border, radius, clipping |
| `.disclosure-group` | Vertical stack of sibling modules, `gap: var(--space-3)` |
| `.disclosure-summary` | The clickable header. `min-height: 44px` |
| `.disclosure-label` | Title. Truncates with ellipsis instead of wrapping |
| `.disclosure-badge` | Optional count of what the module hides when closed |
| `.disclosure-chevron` | 16×16 icon, rotates on open |
| `.disclosure-panel` | The animated grid row. Do not style it |
| `.disclosure-content` | Where your content goes |
| `.disclosure-flush` | Variant with no card chrome, for nesting inside an existing card |

## Behavior

`dist/disclosure.js` is optional. Without it the module still opens and closes — that is the native element doing its job — it just does so instantly.

```html
<script src="…/resultx-design-system/dist/disclosure.js"></script>
```

Or via the package subpath: `import "resultx-design-system/disclosure"`.

| API | Effect |
|-----|--------|
| `ResultXDisclosure.init(root)` | Enhance every `.disclosure` under `root` (defaults to `document`). Returns the count |
| `ResultXDisclosure.open(el)` | Open one, animated |
| `ResultXDisclosure.close(el)` | Close one, animated |
| `ResultXDisclosure.toggle(el)` | Flip it |

The script dispatches `disclosuretoggle` with `detail: { open }`, bubbling — useful for products that would rather persist state server-side.

### Why the script exists at all

Two things the CSS cannot do alone:

**Animating the close.** `<details>` drops its content out of the flow the moment it loses `[open]`, so an exit transition never gets to run. The script holds the attribute until the animation finishes, then removes it.

**Remembering the choice.** Give the element a `data-disclosure-id` and the open/closed state persists in `localStorage` under `resultx-disclosure:<id>`. Omit the attribute and nothing is stored. Access is wrapped in `try/catch`: private mode costs you the memory, never the component.

The wait is read back from `--disclosure-duration`, so a brand that retunes the token cannot leave the script waiting the wrong amount of time.

## Tokens

| Token | Default | Used for |
|-------|---------|----------|
| `--disclosure-duration` | `220ms` | Open/close timing, read by both the CSS and the script |
| `--space-3` / `--space-4` | — | Header and content padding |
| `--bg-surface-1` / `--bg-surface-2` | — | Card surface, header hover |
| `--border-subtle` | — | Card border |
| `--accent-primary-muted` / `--accent-primary-text` | — | Badge |

## Accessibility

- Role, `aria-expanded` and keyboard come from `<details>`/`<summary>`. Verified in Chrome's accessibility tree: closed reads `group: Enriquecimento`; open exposes the content as children. This satisfies the `aria-expanded` line in [../patterns/a11y-checklist.md](../patterns/a11y-checklist.md) by construction rather than by discipline.
- The header is 44px tall. WCAG 2.2 SC 2.5.8 (Target Size, Minimum) asks for 24px, so this clears it with room.
- The focus ring is inset (negative `outline-offset`) because the card's rounded corner would clip an outset one.
- `prefers-reduced-motion: reduce` removes the height transition, and the script stops waiting for it.
- The chevron is decorative — mark it `aria-hidden="true"`. The state is already announced.

## Measured

Closed, a module is **46px** tall: 44px of header plus the card's 1px top and bottom border. There is **zero** dead space below the title — the collapsed panel contributes nothing to layout.

## See also

- [split-pane.md](split-pane.md) — the resizable column these modules usually live in
- `demos/inbox-panel.html` — both components working together
