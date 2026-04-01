# Getting Started

> ResultX Design System — unified dark/light theme for all products.

## Quick Start

### 1. Import the CSS

```html
<!-- Tokens (required) -->
<link rel="stylesheet" href="dist/tokens.min.css">

<!-- Components (optional — use what you need) -->
<link rel="stylesheet" href="dist/components.min.css">

<!-- Google Fonts (required) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 2. Set a Theme

```html
<!-- Dark theme (default for Electia, internal tools) -->
<html data-theme="dark">

<!-- Light theme (default for IMO, Editais — B2G products) -->
<html data-theme="light">

<!-- Auto-detect: respects user's system preference -->
<html>
```

### 3. Use Tokens

```css
.my-component {
  background: var(--bg-surface-1);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  font-weight: var(--font-medium);
  transition: all var(--transition-base);
}
```

### 4. Use Components

```html
<button class="btn btn-primary">Confirmar</button>

<div class="card">
  <span class="card-eyebrow">Assessment</span>
  <h3 class="card-title">DISC Profile</h3>
  <p class="card-text">Behavioral assessment results</p>
</div>
```

---

## Theme Toggle (JS)

### Basic Toggle

```js
function toggleTheme() {
  const html = document.documentElement;
  const current = html.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  localStorage.setItem('resultx-theme', next);
}
```

### Load Saved Preference

```js
// Run on page load (before DOM renders to avoid flash)
(function() {
  const saved = localStorage.getItem('resultx-theme');
  if (saved) {
    document.documentElement.dataset.theme = saved;
  }
  // If no saved preference, auto-detect kicks in via CSS
})();
```

### Respect System + Allow Override

```js
function initTheme() {
  const saved = localStorage.getItem('resultx-theme');
  if (saved) {
    document.documentElement.dataset.theme = saved;
    return;
  }
  // No manual choice — let CSS prefers-color-scheme handle it
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('resultx-theme', theme);
}

function resetToSystemDefault() {
  document.documentElement.removeAttribute('data-theme');
  localStorage.removeItem('resultx-theme');
}
```

---

## Architecture

```
tokens-base.css (shared)        ResultX foundation: typography, spacing, radius, transitions
       │
       ▼
tokens.css (App DS)             Colors (dark + light), shadows, glass, layout, overrides
       │
       ▼
components.css                  40+ components — theme-agnostic, uses var() tokens
```

### Token Layers

| Layer | Source | What It Contains |
|-------|--------|-----------------|
| **Base** | `tokens-base.css` | Font families, sizes, weights, spacing, radius, transitions, z-index |
| **Theme** | `tokens.css` `:root` | App-specific overrides (data-dense text sizes, layout, a11y) |
| **Dark** | `[data-theme="dark"]` | Dark color palette, shadows, glassmorphism |
| **Light** | `[data-theme="light"]` | Light color palette, shadows, glassmorphism |

### What Changes Between Themes

| Changes | Stays the Same |
|---------|---------------|
| Background colors | Typography (families, sizes, weights) |
| Text colors | Spacing scale |
| Border colors | Border radius |
| Accent colors | Transitions & animations |
| Shadows (opacity) | Layout tokens |
| Glassmorphism (direction) | Z-index scale |
| Chart colors | Component structure |
| Focus ring color | |

---

## Product Defaults

| Product | Segment | Default Theme | Accent |
|---------|---------|---------------|--------|
| **Electia** | B2B2C | Dark | Teal `#2DD4BF` |
| **IMO** | B2G | Light | Blue `#1D4ED8` |
| **Editais** | B2G | Light | Blue `#1D4ED8` |
| Internal Tools | — | Dark | Teal `#2DD4BF` |

All products should offer theme toggle to the user.

---

## Build from Source

```bash
# Install dependencies
npm install

# Build minified CSS
npm run build          # builds tokens + components

# Individual builds
npm run build:tokens      # → dist/tokens.min.css
npm run build:components  # → dist/components.min.css
```

### Build Pipeline

```
tokens/tokens.css ──→ postcss-import (inlines tokens-base.css)
                   ──→ autoprefixer (vendor prefixes)
                   ──→ cssnano (minification)
                   ──→ dist/tokens.min.css
```

---

## Extending the DS

### Adding Custom Tokens

```css
/* your-product/tokens-custom.css */
:root {
  --my-product-accent: #FF6B35;
}

[data-theme="dark"] {
  --my-product-surface: #1A1A2E;
}

[data-theme="light"] {
  --my-product-surface: #F5F5F5;
}
```

### Creating New Components

Follow the existing naming pattern:
- Use BEM-lite: `.component`, `.component-element`, `.component--modifier`
- Always use `var()` for colors, spacing, radius — never hardcode
- Support both themes — never reference dark/light colors directly

```css
/* Do */
.my-card {
  background: var(--bg-surface-2);
  color: var(--text-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

/* Don't */
.my-card {
  background: #161B26;
  color: white;
  border-radius: 12px;
  padding: 16px;
}
```

---

## Conventions

| Convention | Rule |
|-----------|------|
| **Colors** | Always use tokens. Never hardcode hex values. |
| **Spacing** | Use `--space-*` tokens. Base unit = 4px. |
| **Typography** | Use `--text-*` for sizes, `--font-*` for weights. |
| **Radius** | Use `--radius-*`. Don't use arbitrary px values. |
| **Shadows** | Use `--shadow-*`. They adapt per theme automatically. |
| **Transitions** | Use `--transition-*` for consistent motion. |
| **Z-Index** | Use `--z-*` scale. Never use arbitrary z-index numbers. |
| **Naming** | CSS classes: kebab-case. Files: kebab-case. |

---

## File Structure

```
emprega-mais-design-system/
├── tokens/
│   ├── tokens.css          ← Main: unified dark + light + auto-detect
│   ├── tokens.json         ← W3C DTCG format (for tooling)
│   ├── tokens-dark.css     ← Standalone dark (legacy)
│   ├── tokens-light.css    ← Standalone light (legacy)
│   └── tokens-unified.css  ← Previous unified (superseded by tokens.css)
├── components/
│   └── components.css      ← All 40+ component styles
├── dist/
│   ├── tokens.min.css      ← Built: tokens-base + themes (12KB)
│   └── components.min.css  ← Built: all components (35KB)
├── docs/
│   ├── tokens/             ← Token documentation (per category)
│   ├── components/         ← Component documentation (per group)
│   ├── guides/             ← This file and other guides
│   └── patterns/           ← Common UI patterns
├── pages/                  ← Template pages (login, dashboard, etc.)
├── DESIGN-SYSTEM.md        ← Design philosophy and overview
├── CHANGELOG.md            ← Version history
├── postcss.config.js       ← Build configuration
└── package.json            ← Dependencies and scripts
```
