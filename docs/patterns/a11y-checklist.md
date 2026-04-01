# Accessibility Checklist — WCAG 2.1 AA

> Reusable checklist for auditing ResultX Design System components and pages.

## Color & Contrast

- [ ] **Text contrast** — Normal text has 4.5:1 ratio against background
- [ ] **Large text contrast** — Large text (>=18pt / >=14pt bold) has 3:1 ratio
- [ ] **UI component contrast** — Borders, icons, form controls have 3:1 ratio against adjacent colors
- [ ] **Focus indicator contrast** — Focus ring has 3:1 ratio against both the background and the component
- [ ] **No color-only information** — Color is never the sole means of conveying information (use icons, text, patterns)
- [ ] **Both themes pass** — All checks above verified in BOTH dark and light themes

## Keyboard Navigation

- [ ] **Tab order is logical** — Focus moves in a meaningful sequence (no tabindex > 0)
- [ ] **All interactive elements reachable** — Buttons, links, inputs, toggles reachable via Tab
- [ ] **Focus visible** — All interactive elements show visible focus indicator (:focus-visible)
- [ ] **No focus trap** — Users can Tab in and out of any component (except modals)
- [ ] **Modal focus trap** — Modal traps focus inside when open, releases on close
- [ ] **Escape closes overlays** — Modals, dropdowns, tooltips close on Escape key
- [ ] **Skip link** — "Skip to content" link available as first focusable element
- [ ] **Arrow key navigation** — Tabs, dropdowns use arrow keys per WAI-ARIA patterns

## Semantic HTML & ARIA

- [ ] **Landmark roles** — Page has `<nav>`, `<main>`, `<header>`, `<footer>`, `<aside>`
- [ ] **Headings hierarchy** — h1 → h2 → h3 in logical order (no skipping levels)
- [ ] **Button vs link** — `<button>` for actions, `<a>` for navigation (never `<div onclick>`)
- [ ] **Form labels** — Every input has visible `<label>` with `for=` or wrapping, or `aria-label`
- [ ] **aria-expanded** — Dropdowns and collapsible sections use `aria-expanded="true/false"`
- [ ] **aria-hidden** — Decorative icons/images have `aria-hidden="true"`
- [ ] **aria-modal** — Modals use `role="dialog"` and `aria-modal="true"`
- [ ] **aria-live** — Dynamic content updates (toasts, status) use `aria-live="polite"` or `"assertive"`
- [ ] **alt text** — All informational images have descriptive alt; decorative have `alt=""`

## Components

### Buttons
- [ ] Use `<button>` element (not `<div>` or `<span>`)
- [ ] Icon-only buttons have `aria-label`
- [ ] Disabled buttons have `disabled` attribute (not just styling)

### Forms
- [ ] Required fields have `aria-required="true"` or `required`
- [ ] Error messages linked via `aria-describedby`
- [ ] Error state has text indicator (not just red border)
- [ ] Toggles have associated label and `role="switch"` with `aria-checked`

### Modals
- [ ] `role="dialog"` and `aria-modal="true"`
- [ ] `aria-labelledby` pointing to modal title
- [ ] Focus moves to modal on open
- [ ] Focus returns to trigger on close
- [ ] Escape key closes modal

### Tabs
- [ ] `role="tablist"`, `role="tab"`, `role="tabpanel"`
- [ ] `aria-selected="true"` on active tab
- [ ] Arrow keys navigate between tabs
- [ ] Tab panels linked via `aria-controls` / `aria-labelledby`

### Dropdowns
- [ ] Trigger has `aria-expanded` and `aria-haspopup`
- [ ] Menu items have `role="menuitem"`
- [ ] Arrow keys navigate menu items
- [ ] Escape closes menu and returns focus to trigger

### Tables
- [ ] Use `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`
- [ ] `<th>` has `scope="col"` or `scope="row"`
- [ ] Table has `<caption>` or `aria-label`

### Toast / Notifications
- [ ] Container has `aria-live="polite"` (or `"assertive"` for errors)
- [ ] `role="status"` or `role="alert"`
- [ ] Auto-dismiss respects user timing preferences

### Progress Bars
- [ ] `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- [ ] `aria-label` describing what is being measured

## Motion & Animation

- [ ] **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables animations
- [ ] **No auto-play** — No animations auto-play for > 5 seconds without pause control
- [ ] **No flashing** — No content flashes more than 3 times per second

## Text & Readability

- [ ] **Text resizable** — Content readable at 200% zoom
- [ ] **No text in images** — Text is real HTML, not embedded in images
- [ ] **Line height** — Body text line-height >= 1.5
- [ ] **Language** — `<html lang="pt-BR">` set on document

---

## Verdict

| Status | Criteria |
|--------|---------|
| **PASS** | Zero CRITICAL, zero HIGH findings |
| **PASS with observations** | Zero CRITICAL, minor HIGH documented |
| **FAIL** | Any CRITICAL finding, or 3+ HIGH findings |

**Date:** _______________
**Auditor:** _______________
**Theme tested:** [ ] Dark [ ] Light [ ] Both
