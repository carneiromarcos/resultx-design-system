# Accessibility

Accessibility tokens for the ResultX App Design System. These tokens ensure consistent focus indicators and text legibility across both themes.

---

## Focus Ring

| Token | Value | Theme | Usage |
|-------|-------|-------|-------|
| `--focus-ring-width` | `3px` | Both | Width of the focus outline ring |
| `--focus-ring-offset` | `2px` | Both | Gap between the element and the focus ring |
| `--focus-ring-color` | `rgba(45, 212, 191, 0.5)` | Dark | Teal focus ring color |
| `--focus-ring-color` | `rgba(29, 78, 216, 0.5)` | Light | Blue focus ring color |

The focus ring color matches each theme's accent:
- **Dark theme:** Teal (`rgba(45, 212, 191, 0.5)`) -- consistent with `--accent-primary: #2DD4BF`
- **Light theme:** Blue (`rgba(29, 78, 216, 0.5)`) -- consistent with `--accent-primary: #1D4ED8`

### Pattern

```css
:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```

---

## Text on Colored Backgrounds

| Token | Value | Theme | Usage |
|-------|-------|-------|-------|
| `--text-on-color` | `#FFFFFF` | Both | White text for any colored (non-surface) background |

This token is theme-independent and always resolves to white. Use it for text placed on accent, semantic, or theory-colored backgrounds where the background color provides sufficient contrast.

### Pattern

```css
.badge--success {
  background: var(--color-success);
  color: var(--text-on-color);
}

.button--primary {
  background: var(--accent-primary);
  color: var(--text-on-color);
}
```

---

## Inverse Text

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--text-inverse` | `#0B0E14` | `#FFFFFF` | Text that inverts relative to the theme background |

Use `--text-inverse` when you need text that contrasts against the opposite theme's base color (e.g., a dark badge on a light page, or vice versa).

---

## WCAG Contrast Notes

### Dark Theme

| Pair | Contrast Ratio | WCAG Level |
|------|---------------|------------|
| `--text-primary` (#E6EDF3) on `--bg-base` (#0B0E14) | ~15.5:1 | AAA |
| `--text-secondary` (#8B949E) on `--bg-base` (#0B0E14) | ~7.5:1 | AAA |
| `--text-muted` (#6E7681) on `--bg-base` (#0B0E14) | ~4.8:1 | AA |
| `--accent-primary` (#2DD4BF) on `--bg-base` (#0B0E14) | ~11.5:1 | AAA |
| `--text-on-color` (#FFFFFF) on `--accent-primary` (#2DD4BF) | ~3.2:1 | AA Large |

### Light Theme

| Pair | Contrast Ratio | WCAG Level |
|------|---------------|------------|
| `--text-primary` (#0F1729) on `--bg-base` (#FFFFFF) | ~17.5:1 | AAA |
| `--text-secondary` (#586069) on `--bg-base` (#FFFFFF) | ~5.9:1 | AA |
| `--text-muted` (#8B949E) on `--bg-base` (#FFFFFF) | ~3.5:1 | AA Large |
| `--accent-primary` (#1D4ED8) on `--bg-base` (#FFFFFF) | ~6.0:1 | AA |
| `--text-on-color` (#FFFFFF) on `--accent-primary` (#1D4ED8) | ~6.0:1 | AA |

> **Note:** The contrast ratios above are approximate. Always verify with a contrast checker when combining tokens on non-standard surfaces (e.g., `--text-secondary` on `--bg-surface-2`).

---

## Reduced Motion

The design system does not include a `prefers-reduced-motion` token, but all animations and transitions should respect the user's OS preference. Add this global override to your entry CSS:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Usage Guidelines

### Do

- Always use `:focus-visible` (not `:focus`) to avoid showing focus rings on mouse clicks.
- Use `--text-on-color` for all text on colored backgrounds (buttons, badges, alerts).
- Test every new color combination against WCAG AA (4.5:1 for normal text, 3:1 for large text).
- Provide `prefers-reduced-motion` overrides for all animated components.
- Use sufficient `--focus-ring-offset` to visually separate the ring from the element border.

### Don't

- Don't remove focus indicators. If the default ring doesn't fit a component's design, customize it but never hide it.
- Don't rely solely on color to convey meaning. Pair color with icons, labels, or patterns (e.g., error = red + icon + message text).
- Don't use `--text-muted` for essential information. It passes AA Large but fails AA Normal on base backgrounds.
- Don't override `--focus-ring-color` per component unless there is a specific accessibility reason.
- Don't assume `--text-on-color` works on every colored background. Verify contrast for lighter colors like `--color-warning` and `--theory-jung`.
