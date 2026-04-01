# Transitions

Transition tokens and keyframe animations for the ResultX App Design System. Transition durations and easings are defined in `tokens-base.css` (shared). Keyframe animations are defined in `tokens.css` (App DS specific).

---

## Transition Tokens

| Token | Value | Duration | Easing | Usage |
|-------|-------|----------|--------|-------|
| `--transition-fast` | `150ms ease` | 150ms | ease | Hover states, color changes, opacity toggles |
| `--transition-base` | `200ms ease` | 200ms | ease | Default for most UI interactions |
| `--transition-slow` | `300ms ease-out` | 300ms | ease-out | Panel expansions, sidebar toggles, larger layout shifts |
| `--transition-spring` | `500ms cubic-bezier(0.34, 1.56, 0.64, 1)` | 500ms | spring overshoot | Playful micro-interactions, pop-in effects, scale animations |

### Common Patterns

```css
/* Button hover */
.button {
  transition: background var(--transition-fast),
              box-shadow var(--transition-fast);
}

/* Card hover lift */
.card {
  transition: transform var(--transition-base),
              box-shadow var(--transition-base);
}

/* Sidebar expand/collapse */
.sidebar {
  transition: width var(--transition-slow);
}

/* Notification pop-in */
.toast {
  animation: scale-in var(--transition-spring);
}
```

---

## Keyframe Animations

### fade-in

Simple opacity fade from 0 to 1.

```css
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

**Usage:** Page transitions, lazy-loaded content appearance, skeleton-to-content swap.

---

### fade-in-up

Fade in while sliding up 16px.

```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Usage:** Card entrance, list item stagger, section reveal on scroll.

---

### slide-in-right

Fade in while sliding left from 24px offset.

```css
@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

**Usage:** Sidebar panel entrance, drawer opening, notification slide-in.

---

### scale-in

Fade in while scaling from 95% to 100%.

```css
@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
```

**Usage:** Modal entrance, tooltip appearance, dropdown open.

---

### pulse-glow

Continuous pulsing teal glow effect.

```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(45, 212, 191, 0.2); }
  50%      { box-shadow: 0 0 20px rgba(45, 212, 191, 0.4); }
}
```

**Usage:** Active/recording indicators, loading states, attention-drawing elements. Best used sparingly.

---

### progress-fill

Animates width from 0% to a custom property value.

```css
@keyframes progress-fill {
  from { width: 0%; }
  to   { width: var(--progress-value, 0%); }
}
```

**Usage:** Progress bars, skill meters, assessment completion indicators. Set `--progress-value` on the element to control the target width.

```css
.progress-bar {
  --progress-value: 75%;
  animation: progress-fill 800ms ease-out forwards;
}
```

---

## Usage Guidelines

### Do

- Use `--transition-fast` for micro-interactions that should feel instant (hover, focus).
- Use `--transition-base` as the default for most interactive transitions.
- Use `--transition-spring` for delightful moments like toast pop-ins or checkbox confirmations.
- Combine `fade-in-up` with stagger delays for list items to create a cascading reveal.
- Always specify which properties to transition (e.g., `transition: opacity var(--transition-fast)`) instead of `transition: all`.

### Don't

- Don't use `--transition-slow` for hover states. 300ms feels sluggish for direct interactions.
- Don't use `pulse-glow` on more than one element at a time. It draws too much attention.
- Don't animate `width`, `height`, or `top`/`left` properties. Use `transform` and `opacity` for 60fps performance.
- Don't forget to add `prefers-reduced-motion` overrides for accessibility:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
