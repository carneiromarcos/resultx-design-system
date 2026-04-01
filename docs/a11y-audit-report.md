# Accessibility Audit Report — WCAG 2.1 AA

> ResultX Design System v2.0.0
> Date: 2026-03-27
> Scope: tokens.css, components.css, pages/ templates (login, dashboard, candidatos, 404)
> Themes tested: Dark + Light

---

## Executive Summary

| Category | CRITICAL | HIGH | MEDIUM | LOW | Total |
|----------|----------|------|--------|-----|-------|
| Contrast (tokens) | 8 | 13 | 0 | 0 | 21 |
| ARIA & Semantic (templates) | 6 | 5 | 2 | 1 | 14 |
| Focus States (CSS) | 3 | 1 | 1 | 0 | 5 |
| Keyboard Navigation | 2 | 2 | 1 | 0 | 5 |
| Color Independence | 0 | 2 | 2 | 1 | 5 |
| Stylelint (hardcoded hex) | 0 | 0 | 6 | 0 | 6 |
| **Total** | **19** | **23** | **12** | **2** | **56** |

**Verdict: FAIL** — 19 CRITICAL findings require remediation.

---

## Part 1: Contrast Audit

### CRITICAL Failures (ratio < 3.0:1 — fails ALL WCAG AA)

| # | Pairing | Theme | Ratio | Remediation |
|---|---------|-------|-------|-------------|
| C1 | White on `--accent-primary` (#2DD4BF) | Dark | 2.03:1 | Use dark text (#0B0E14) on teal — gives ~9.1:1 |
| C2 | White on `--color-success` (#22C55E) | Dark | 2.44:1 | Use dark text on green — gives ~7.7:1 |
| C3 | White on `--color-warning` (#F59E0B) | Dark | 2.31:1 | Use dark text on yellow — gives ~8.2:1 |
| C4 | `--border-default` on `--bg-base` | Dark | 1.61:1 | Lighten to ~#4A5568 for functional borders |
| C5 | `--border-strong` on `--bg-base` | Dark | 2.05:1 | Lighten to ~#5A6A7C |
| C6 | `--text-muted` on `--bg-surface-2` | Light | 2.82:1 | Darken to ~#6B7280 in light theme |
| C7 | `--border-default` on `--bg-base` | Light | 1.43:1 | Darken to ~#9AA5B4 |
| C8 | `--border-strong` on `--bg-base` | Light | 1.97:1 | Darken to ~#8A96A8 |

### Normal Text Failures (3.0–4.49:1 — fails normal text, passes large text)

| # | Pairing | Theme | Ratio | Notes |
|---|---------|-------|-------|-------|
| C9 | `--text-muted` on `--bg-base` | Dark | 4.01:1 | OK for large text / labels |
| C10 | `--text-muted` on `--bg-surface-1` | Dark | 3.69:1 | OK for large text / labels |
| C11 | `--text-muted` on `--bg-surface-2` | Dark | 3.49:1 | OK for large text / labels |
| C12 | White on `--color-error` | Dark | 3.98:1 | OK for button labels >= 14pt bold |
| C13 | White on `--color-info` | Dark | 3.81:1 | OK for button labels >= 14pt bold |
| C14 | `--text-muted` on `--bg-base` | Light | 3.14:1 | Darken to ~#6B7785 for normal text |
| C15 | `--text-muted` on `--bg-surface-1` | Light | 3.00:1 | Darken to ~#6B7785 for normal text |
| C16 | White on `--color-success` | Light | 3.29:1 | Darken to ~#15803D for normal text |
| C17 | White on `--color-warning` | Light | 3.35:1 | Darken to ~#B45309 for normal text |
| C18 | `--theory-mbti` on `--bg-surface-2` | Light | 3.30:1 | Use darker shade for labels |
| C19 | `--theory-disc` on `--bg-surface-2` | Light | 3.19:1 | Use darker shade for labels |
| C20 | `--theory-lesenne` on `--bg-surface-2` | Light | 4.16:1 | Borderline — OK for large text |
| C21 | `--theory-jung` on `--bg-surface-2` | Light | 3.01:1 | Use darker shade for labels |

### All Passing (highlights)

- Text-primary on all backgrounds: **12.3–17.9:1** (excellent in both themes)
- Text-secondary on all backgrounds: **5.1–6.4:1** (solid pass)
- Accent-primary on backgrounds (dark): **7.9–9.1:1** (excellent)
- Accent-primary on backgrounds (light): **6.0–6.7:1** (solid pass)
- All 6 theory colors on dark backgrounds: **5.8–9.6:1** (all pass)
- Light theme error/info white-on-color: **4.8–5.2:1** (pass)

---

## Part 2: ARIA & Semantic HTML

### CRITICAL

| # | Finding | Pages | Fix |
|---|---------|-------|-----|
| A1 | No landmark roles (`<main>`, `<nav>`, etc.) | login.html, 404.html | Add `<main>`, `<aside>` |
| A4 | Sidebar items are `<div>` — not focusable, no role | dashboard, candidatos | Convert to `<a>` or `<button>` |
| A5 | Tabs are `<div>` — no `role="tablist"`/`role="tab"` | candidatos | Implement WAI-ARIA tabs pattern |
| A9 | Zero ARIA attributes in all templates | All 4 pages | Add aria-label, aria-expanded, etc. |
| A13 | Form labels missing `for=`/`id` association | login.html | Link `<label>` to `<input>` via for/id |
| A14 | Search input has no label/aria-label | candidatos.html | Add `aria-label="Buscar candidato"` |

### HIGH

| # | Finding | Fix |
|---|---------|-----|
| A6 | List items clickable but no role/tabindex | Add `role="button"` + `tabindex="0"`, or use `<a>` |
| A7 | Chart period buttons lack `role="group"` | Add `role="group"` + `aria-label` |
| A10 | Dropdown missing aria-expanded/haspopup | Implement WAI-ARIA menu pattern |
| A11 | Badge-count lacks context for screen readers | Add `aria-label="3 notificações"` |
| A16 | Modal CSS exists but no ARIA in templates | When implemented: role="dialog", aria-modal, focus trap |
| A17 | No aria-live regions for dynamic content | Add `aria-live="polite"` to stat/activity areas |
| A22 | No skip link | Add skip-to-content link as first focusable element |

---

## Part 3: Focus States (CSS)

### CRITICAL

| # | Finding | Impact | Fix |
|---|---------|--------|-----|
| F18 | Only `.form-input:focus` defined — no other components | 12+ interactive components unfocusable visually | Add `:focus-visible` to all interactive components |
| F19 | `:focus-visible` not used anywhere | Keyboard users can't see where focus is | Replace `:focus` with `:focus-visible` pattern |
| F27 | Toggle input uses `display: none` (removed from tab order) | Toggle switch completely inaccessible | Use `opacity: 0; position: absolute` instead |

### HIGH

| # | Finding | Fix |
|---|---------|-----|
| F22 | No skip link in any page | Add `.skip-link` component to DS |

---

## Part 4: Keyboard Navigation

### CRITICAL

| # | Finding | Fix |
|---|---------|-----|
| K23 | Tabs not keyboard navigable | Implement arrow key navigation with tabindex management |
| K27 | Toggle switch removed from tab order | Fix display:none on toggle input |

### HIGH

| # | Finding | Fix |
|---|---------|-----|
| K24 | Modal focus trap not implemented | Add focus trap JS + Escape to close |
| K25 | Dropdown keyboard nav missing | Arrow keys + Escape + focus management |

---

## Part 5: Color Independence

### HIGH

| # | Finding | Fix |
|---|---------|-----|
| D29 | No form error state defined in DS | Create `.form-input-error`, `.form-error-message` |
| D32 | Activity dots use color-only differentiation | Add icons or text labels alongside dots |

### MEDIUM

| # | Finding | Notes |
|---|---------|-------|
| D28 | Stat variations have icons (good!) but no +/- prefix | Add "+" and "-" before percentage text |
| D31 | Score badges use color-only quality indicator | Add icon or label for status |

---

## Part 6: Hardcoded Hex in Components (Stylelint)

| Line | Hex | Context | Fix |
|------|-----|---------|-----|
| 112 | `#6366F1`, `#8B5CF6` | Sidebar avatar gradient | Create `--avatar-gradient-start/end` tokens |
| 486 | `#f87171` | DISC-D bar gradient end | Create `--disc-d-light` token |
| 487 | `#fbbf24` | DISC-I bar gradient end | Create `--disc-i-light` token |
| 488 | `#4ade80` | DISC-S bar gradient end | Create `--disc-s-light` token |
| 489 | `#60a5fa` | DISC-C bar gradient end | Create `--disc-c-light` token |

---

## Remediation Plan (Priority Order)

### P1 — CSS Fixes (components.css) — can fix now

1. **Add `:focus-visible` styles to all interactive components** using `--focus-ring-*` tokens
2. **Fix toggle `display: none`** → `opacity: 0; position: absolute`
3. **Add `.form-input-error` and `.form-error-message`** component styles
4. **Add `.skip-link` component** (visually hidden, appears on focus)
5. **Add `@media (prefers-reduced-motion: reduce)`** to disable animations
6. **Replace 6 hardcoded hex values** with tokens

### P2 — Token Fixes (tokens.css)

7. **Add `--text-on-accent: #0B0E14`** (dark text for teal/green/yellow backgrounds)
8. **Add `--text-on-success`, `--text-on-warning`** per-theme tokens
9. **Add DISC gradient end tokens** (`--disc-d-light`, etc.)
10. **Add avatar gradient tokens**

### P3 — Template Fixes (pages/*.html) — next session

11. Add landmark roles to login.html and 404.html
12. Convert sidebar items to `<a>` elements
13. Implement WAI-ARIA tabs pattern
14. Add for/id to form labels
15. Add aria-label to search inputs
16. Add skip-to-content links
17. Add aria-expanded to dropdowns
18. Add aria-live to dynamic content areas

---

## Positive Findings

- Text-primary achieves **12–18:1** contrast in both themes (excellent)
- Text-secondary passes in all contexts (**5.1–6.4:1**)
- All theory colors pass on dark backgrounds (**5.8–9.6:1**)
- Stat variations have directional icons (not color-only)
- Status badges have text labels
- `<html lang="pt-BR">` present on all pages
- `<button>` correctly used for actions in headers
- Breadcrumb uses `<nav>` semantic element
- No `tabindex > 0` (natural tab order preserved)
- Focus ring tokens (`--focus-ring-*`) already defined — just need consumption
- `--text-on-color` token exists — needs per-semantic-color variants
