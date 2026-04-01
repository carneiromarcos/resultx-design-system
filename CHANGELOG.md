# Changelog — App Design System (Electia/SaaS)

Todas as mudancas notaveis neste design system serao documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [1.0.1] - 2026-03-26

### Fixed
- `tokens.css` — accent corrigido de BLUE `#93ACFF` para TEAL `#2DD4BF` (alinhado com tokens.json)
- `tokens.css` — `--accent-secondary` corrigido de `#C49A3C` para `#60A5FA`
- `tokens.css` — shadow renomeado de `glow-navy` para `glow-teal`
- `tokens.css` — `pulse-glow` keyframe corrigido para usar rgba teal
- `tokens.css` — `--border-accent` corrigido para rgba teal
- `tokens.css` — adicionados tokens de z-index e breakpoints (antes apenas em comments)
- `components.css` — 9x `#fff` substituidos por `var(--text-primary)`
- `components.css` — icon badges (purple, orange, pink, cyan) migrados para `var(--theory-*)`
- `components.css` — tags (purple, orange, pink) migrados para `var(--theory-*)`
- `components.css` — toggle thumb migrado de `#fff` para `var(--text-primary)`
- `dashboard.html` — `#7C3AED` e `#EA580C` migrados para `var(--theory-enneagram)` e `var(--theory-disc)`

## [1.0.0] - 2026-03-17

### Added
- DESIGN-SYSTEM.md — guia completo (427 linhas)
- `tokens/tokens.json` — W3C DTCG canonical
- `tokens/tokens.css` — CSS custom properties
- `tokens/tokens-dark.css`, `tokens-light.css`, `tokens-unified.css` — variantes de tema
- `components/components.css` — 40+ componentes (buttons, cards, tabs, modals, kanban, etc.)
- `pages/` — 4 templates (login, dashboard, candidatos, 404)
- Theory colors para 6 assessments (MBTI, DISC, Big Five, Eneagrama, Le Senne, Jung)
- Glassmorphism 3 niveis
- 7 HTML showcases
