# Spacing

Spacing tokens for the ResultX App Design System. All spacing values are defined in `tokens-base.css` and shared across every Emprega+ design system. The scale is built on a **4px base unit**.

---

## Spacing Scale

| Token | Value | Px Equivalent | Common Use Case |
|-------|-------|--------------|-----------------|
| `--space-0` | `0` | 0px | Reset, flush alignment |
| `--space-1` | `0.25rem` | 4px | Inline icon gap, tight padding inside badges |
| `--space-1-5` | `0.375rem` | 6px | Small internal padding (chips, tags) |
| `--space-2` | `0.5rem` | 8px | Compact padding, gap between inline elements |
| `--space-3` | `0.75rem` | 12px | Input padding, small card padding |
| `--space-4` | `1rem` | 16px | Standard padding, card padding, form group gap |
| `--space-5` | `1.25rem` | 20px | Grid gap (`--grid-gap`), medium spacing |
| `--space-6` | `1.5rem` | 24px | Section padding, card body spacing |
| `--space-8` | `2rem` | 32px | Large section gaps, between card groups |
| `--space-10` | `2.5rem` | 40px | Section dividers, large vertical spacing |
| `--space-12` | `3rem` | 48px | Page section margins |
| `--space-16` | `4rem` | 64px | Major section breaks, hero padding |
| `--space-20` | `5rem` | 80px | Page-level vertical spacing |
| `--space-24` | `6rem` | 96px | Top-level section padding, footer spacing |

---

## Visual Reference

```
--space-1   ████                         4px
--space-1-5 ██████                       6px
--space-2   ████████                     8px
--space-3   ████████████                12px
--space-4   ████████████████            16px
--space-5   ████████████████████        20px
--space-6   ████████████████████████    24px
--space-8   ████████████████████████████████   32px
--space-10  ████████████████████████████████████████  40px
--space-12  ████████████████████████████████████████████████  48px
```

---

## Common Patterns

### Card Padding

```css
.card {
  padding: var(--space-4);           /* 16px standard */
}
.card--compact {
  padding: var(--space-3);           /* 12px for data-dense views */
}
.card--spacious {
  padding: var(--space-6);           /* 24px for detail views */
}
```

### Stack Spacing (Vertical Rhythm)

```css
.stack > * + * {
  margin-top: var(--space-4);        /* 16px between sibling elements */
}
.stack--tight > * + * {
  margin-top: var(--space-2);        /* 8px for compact lists */
}
```

### Grid Gaps

```css
.grid {
  gap: var(--space-5);               /* 20px = --grid-gap */
}
```

---

## Usage Guidelines

### Do

- Use spacing tokens for all margin, padding, and gap values.
- Stick to the scale. The 4px base ensures consistent vertical rhythm.
- Use `--space-1` and `--space-2` for tight inline spacing (icon + label, badge padding).
- Use `--space-8` through `--space-24` for section-level separation.

### Don't

- Don't invent arbitrary spacing values (e.g., `13px`, `22px`). Use the nearest token.
- Don't use `--space-0` as a lazy reset without intent. If you need zero spacing, make sure the layout calls for it.
- Don't mix `rem` values and tokens in the same component. Tokens already resolve to `rem`.
