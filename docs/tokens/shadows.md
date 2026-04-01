# Shadows

Shadow and glassmorphism tokens for the ResultX App Design System. All shadow values are theme-aware: dark theme uses heavier opacities with teal glows, light theme uses softer opacities with blue glows.

---

## Shadow Levels

Standard elevation shadows for cards, dropdowns, and modals.

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.3)` | `0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)` | Subtle elevation: buttons, inputs, flat cards |
| `--shadow-md` | `0 4px 12px rgba(0, 0, 0, 0.4)` | `0 4px 12px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.06)` | Medium elevation: cards, dropdowns, popovers |
| `--shadow-lg` | `0 8px 24px rgba(0, 0, 0, 0.5)` | `0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)` | High elevation: modals, dialogs, floating panels |

> **Note:** Light theme shadows use dual-layer values (ambient + direct) for a more natural appearance. Dark theme uses a single, heavier shadow since the dark background already provides depth.

---

## Glow Effects

Accent-colored glows for interactive highlights and emphasis.

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--shadow-glow` | `0 0 20px rgba(45, 212, 191, 0.15)` | `0 0 20px rgba(29, 78, 216, 0.18)` | Subtle glow: hover states, active cards |
| `--shadow-glow-lg` | `0 0 40px rgba(45, 212, 191, 0.2), 0 0 80px rgba(45, 212, 191, 0.08)` | `0 0 40px rgba(29, 78, 216, 0.20), 0 0 80px rgba(29, 78, 216, 0.08)` | Strong glow: hero elements, featured cards, focused state emphasis |

- **Dark theme:** Teal glow (`rgba(45, 212, 191, ...)`)
- **Light theme:** Blue glow (`rgba(29, 78, 216, ...)`)

---

## Glassmorphism

Three levels of glassmorphism, each defined by a background color, blur radius, and border. These tokens work together and should be applied as a group.

### Subtle Glass

| Token | Dark Value | Light Value |
|-------|-----------|-------------|
| `--glass-subtle-bg` | `rgba(22, 27, 38, 0.4)` | `rgba(255, 255, 255, 0.6)` |
| `--glass-subtle-blur` | `12px` | `12px` |
| `--glass-subtle-border` | `rgba(255, 255, 255, 0.04)` | `rgba(0, 0, 0, 0.06)` |

**Usage:** Background overlays, navigation bars, subtle card backgrounds where content behind should partially show through.

### Standard Glass

| Token | Dark Value | Light Value |
|-------|-----------|-------------|
| `--glass-standard-bg` | `rgba(22, 27, 38, 0.6)` | `rgba(255, 255, 255, 0.75)` |
| `--glass-standard-blur` | `16px` | `16px` |
| `--glass-standard-border` | `rgba(255, 255, 255, 0.06)` | `rgba(0, 0, 0, 0.08)` |

**Usage:** Sidebars, card overlays, floating toolbars. The most commonly used glassmorphism level.

### Strong Glass

| Token | Dark Value | Light Value |
|-------|-----------|-------------|
| `--glass-strong-bg` | `rgba(22, 27, 38, 0.85)` | `rgba(255, 255, 255, 0.92)` |
| `--glass-strong-blur` | `24px` | `24px` |
| `--glass-strong-border` | `rgba(255, 255, 255, 0.08)` | `rgba(0, 0, 0, 0.1)` |

**Usage:** Modals, dialogs, command palettes. Content behind is barely visible but the frosted effect remains.

### Utility Classes

Pre-built utility classes are available for each glass level:

```css
.glass-subtle   { /* applies --glass-subtle-bg, blur, and border */ }
.glass-standard { /* applies --glass-standard-bg, blur, and border */ }
.glass-strong   { /* applies --glass-strong-bg, blur, and border */ }
```

Each class applies:
- `background` from the `-bg` token
- `backdrop-filter: blur()` and `-webkit-backdrop-filter: blur()` from the `-blur` token
- `border: 1px solid` from the `-border` token

---

## Usage Guidelines

### Do

- Use `--shadow-sm` for flat interactive elements that need subtle depth (buttons, inputs).
- Use `--shadow-md` for floating elements at medium elevation (cards, dropdowns).
- Use `--shadow-lg` sparingly for the highest-level floating elements (modals, command palettes).
- Combine `--shadow-glow` with hover states for an interactive accent highlight.
- Use the `.glass-*` utility classes instead of manually combining the three glass tokens.

### Don't

- Don't stack multiple shadow levels on the same element.
- Don't use `--shadow-glow-lg` on many elements at once. It is designed for a single focal point.
- Don't apply glassmorphism without `backdrop-filter` support. Provide a solid fallback color for older browsers.
- Don't use glass effects on text-heavy content areas where blur could impair readability.
