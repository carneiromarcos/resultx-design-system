# Border Radius

Border radius tokens for the ResultX App Design System. Defined in `tokens-base.css` and shared across all Emprega+ design systems.

---

## Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `4px` | Badges, tags, small chips, inline code |
| `--radius-md` | `8px` | Buttons, inputs, dropdowns, tooltips |
| `--radius-lg` | `12px` | Cards, panels, modals |
| `--radius-xl` | `16px` | Large cards, dialog containers, popovers |
| `--radius-2xl` | `24px` | Hero sections, feature cards, onboarding containers |
| `--radius-full` | `9999px` | Avatars, circular indicators, pill-shaped buttons/tags |

---

## Common Patterns

### Cards and Containers

```css
.card {
  border-radius: var(--radius-lg);     /* 12px */
}
.modal {
  border-radius: var(--radius-xl);     /* 16px */
}
```

### Interactive Elements

```css
.button {
  border-radius: var(--radius-md);     /* 8px */
}
.input {
  border-radius: var(--radius-md);     /* 8px */
}
.tag {
  border-radius: var(--radius-sm);     /* 4px */
}
.pill {
  border-radius: var(--radius-full);   /* 9999px */
}
```

### Avatars

```css
.avatar {
  border-radius: var(--radius-full);   /* 9999px — always circular */
}
```

---

## Usage Guidelines

### Do

- Use `--radius-md` as the default for most interactive elements (buttons, inputs, dropdowns).
- Use `--radius-lg` for card-level containers.
- Use `--radius-full` only for intentionally circular or pill-shaped elements.
- Keep radius consistent within a component group (all buttons share the same radius).

### Don't

- Don't mix radius values within a single card (e.g., different corners with different radii).
- Don't use `--radius-2xl` on small elements like badges. The large radius will distort them.
- Don't hardcode pixel values. Always reference the token.
- Don't use `--radius-full` on elements with unequal width and height unless you want a pill shape.
