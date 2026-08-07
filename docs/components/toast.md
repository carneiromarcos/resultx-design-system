# Toast

A short message about something that just happened. It reports; it does not ask.

## Component Anatomy

```
.toast-container
  .toast .toast-{success|warning|error|info} [hidden]
    icon / text
    .toast-action      (optional — "Desfazer", "Ver detalhes")
    .toast-dismiss     (optional — close button)
```

## Markup

```html
<div class="toast-container" role="status" aria-live="polite">
  <div class="toast toast-success">
    <svg class="icon icon-sm" aria-hidden="true">…</svg>
    <span>Vaga publicada.</span>
    <button class="btn btn-ghost btn-sm toast-action" type="button">Desfazer</button>
    <button class="btn-icon btn-icon-sm btn-icon-subtle toast-dismiss"
            type="button" aria-label="Dispensar">…</button>
  </div>
</div>
```

## Classes

| Class | Role |
|-------|------|
| `.toast-container` | Holds the stack. `max-width: 500px` |
| `.toast` | The base. Flex row, `gap: var(--space-3)` |
| `.toast-success` / `-warning` / `-error` / `-info` | Semantic variant: tinted background plus a 3px left border in the semantic colour |
| `.toast-action` | Optional escape hatch. Pushed right with `margin-left: auto` |
| `.toast-dismiss` | Optional close. Also `margin-left: auto` when alone |

`.toast-action` and `.toast-dismiss` carry **position only** — the button styling comes from `.btn` / `.btn-icon`. Alone, the dismiss sits flush right; with an action present, the action takes the right edge and the dismiss follows it with `var(--space-1)` between them.

## Why `.toast[hidden]` exists

`.toast` sets `display: flex`, and a class-level `display` **beats the browser's default `[hidden]` rule**. Without the explicit `.toast[hidden] { display: none }`, marking a toast hidden would do nothing and the message would stay on screen. With it, toggling the `hidden` attribute works as expected.

## Accessibility

- Put `role="status"` and `aria-live="polite"` on the **container**, not on each toast — the live region has to exist *before* the message arrives, or screen readers announce nothing.
- Reserve `aria-live="assertive"` for errors that interrupt a task. Polite is right for everything else.
- Give `.toast-dismiss` an `aria-label`; an X with no name reads as "button".
- **A toast that vanishes on a timer is a trap for anyone reading slowly.** WCAG 2.2 SC 2.2.1 asks for a way to extend or dismiss it. If the product auto-hides, pause the timer on hover and on focus, and always ship the dismiss button.
- Colour is not the message. The variant tints the background, but the text has to say what happened on its own.

## Tokens

| Token | Used for |
|-------|----------|
| `--color-success-bg` / `--color-success` | Success tint and left border |
| `--color-warning-bg` / `--color-warning` | Warning |
| `--color-error-bg` / `--color-error` | Error |
| `--color-info-bg` / `--color-info` | Info |
| `--space-3` / `--space-4` | Padding and gap |
| `--radius-md` | Corners |

## See also

- [empty-state.md](empty-state.md) · [tooltip.md](tooltip.md)
- [modals.md](modals.md) — for when the message needs an answer, not a notice
