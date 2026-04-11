# Changelog — ResultX Design System

Todas as mudanças notáveis neste design system são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added
- **`scripts/build-tokens.js`** — pipeline de build Node que lê `tokens/tokens.css` + `tokens/base/tokens-base.css` e gera outputs Tailwind v4 + TypeScript sem alterar o source CSS
- **`dist/tokens.theme.css`** — saída Tailwind v4 com bloco `@theme inline` expondo tokens como utility classes (bg-*, text-*, font-*, p-*, rounded-*, shadow-*), preservando runtime theme switching via `[data-theme]`
- **`dist/tokens.ts`** — exports TypeScript (`sharedTokens`, `darkTokens`, `lightTokens`, `TokenName`) para consumo em JS/charts/tests
- **`package.json` exports** — `./tokens/theme` e `./tokens/ts` disponíveis para consumers
- **9 categorias classificadas** no @theme inline: 84 cores, 4 font families, 5 font weights, 12 text sizes, 6 line heights, 6 letter spacings, 14 spacing, 6 radius, 5 shadow (142 tokens expostos)
- **4 novos testes Jest** — validação das saídas geradas (presença do `@theme inline`, parity dark/light, contagem vs. source, exports TS)

### Changed
- `scripts.build:tokens` — agora roda `node scripts/build-tokens.js && postcss` (postcss preservado para compat do `tokens.min.css` atual)
- `files` array — inclui `tokens/base/tokens-base.css` para garantir que consumers via npm recebam o source completo

### Fixed
- `.gitignore` — ignora `social-media-png/` (artefatos gerados) e `.claude/` (estado local)

### Notes
- **`tokens/tokens.css` continua sendo o source autoritativo** — edite sempre lá, rode `npm run build:tokens`
- **`tokens/tokens.json` continua desatualizado** (formato v1.0, namespace `emprega-app`) — reconstrução fica para fase futura se necessário
- **Zero impacto em consumers atuais**: Editais (Laravel), Sites (React+CSS) continuam usando `dist/tokens.min.css` inalterado. Novos outputs só são consumidos quando explicitamente referenciados.

## [2.0.0] - 2026-04-01

Primeira release do design system como repositório standalone (`carneiromarcos/resultx-design-system`), reposicionado como DS multi-produto (Electia, IMO, Editais).

### Added
- **Repositório próprio** — publicado em `github.com/carneiromarcos/resultx-design-system`, site live em `carneiromarcos.github.io/resultx-design-system`
- **Tema unificado** — `tokens.css` com `[data-theme="dark"]`, `[data-theme="light"]` e auto-detect via `prefers-color-scheme`
- **8 componentes compostos** — View Toggle, Data Table Enhanced (sort/bulk/color cells), Filter Bar, Stepper/Wizard, Pipeline Kanban (5 stages HR), Search Autocomplete, Date Range, Sparkline
- **Apple-level polish** — spring physics curves (`--spring-bounce/smooth/snappy`), elevation system (`--elevation-0..4`), crossfade transition em dark/light toggle, stagger animations
- **Icon system** — `components/icons.css` + docs
- **Print styles** — `@media print` completo
- **Template `triagem.html`** — adicionado aos 4 existentes (login, dashboard, candidatos, 404)
- **Bundle analysis** — `scripts/bundle-analysis.js`
- **Test suite** — Jest com 19 testes (token parity dark/light, fallback parity, build output, hardcoded color detection)
- **Theme toggle runtime** — `dist/theme-toggle.js` (`ResultXTheme.toggle()/set()/get()`, localStorage + system preference)
- **Composite docs** — `docs/components/composite.md` + nav dedicada no docs-viewer
- **CONTRIBUTING.md** — checklists para tokens e componentes
- **CI/CD** — 3 workflows GitHub Actions (CI lint+build+test, Pages deploy, npm publish on release)
- **Versionamento semântico** — `commit-and-tag-version` + `@commitlint/config-conventional`
- **Husky + lint-staged** — formatação e lint automáticos
- **W3C DTCG tokens** — `tokens.json` canonical
- **tokens-base.css** — bundled para builds standalone
- **LICENSE MIT**, exports map em `package.json`
- **Componentes**: 492 regras CSS cobrindo atoms, molecules, organisms + 8 compostos

### Changed
- Todos os templates referenciam `dist/*.min.css` (não source)
- `.tab` com reset de button defaults (background/border/font) para suportar `<button>` semântico
- Touch targets elevados para `min-height: 44px` (48px em mobile)
- Focus states igualados a hover em sidebar, dropdown-item, tab, breadcrumb
- Contraste light mode ajustado: `--text-secondary: #4B5563`, `--text-muted: #6B7280`
- Novos tokens: `--accent-secondary-muted`, `--sidebar-text-label`, `--sidebar-badge-bg`, `--sidebar-badge-active-bg`

### Fixed
- **A11y audit** (WCAG AA) — 9 fixes: focus-visible em 16 componentes, toggle a11y, skip-link, form-error, `prefers-reduced-motion`, hex → tokens migration, `--text-on-*` tokens
- **Disabled states** — `btn`, `form-input`, `dropdown`, `tab`
- **ARIA** — templates login, 404, candidatos corrigidos
- **Responsive** — `layout-split` colapse, btn 48px mobile
- **Loading states** — `.btn-loading`, `.card-loading`
- **Glassmorphism** — `.card-glass` modifier isolado
- **Hardcoded rgba** — header glassmorphism, 7 icon-badges, 6 theory badges, 5 tags, 3 sidebar rgba migrados para tokens
- **Lint fixes** — `#FFFFFF` → `#FFF`, `@import` notation (14 erros eliminados)
- **CI Node 20** — `package-lock.json` regenerado, `npm install` restaurado após sync

### Removed
- `tokens-dark.css`, `tokens-light.css`, `tokens-unified.css` (superseded pelo `tokens.css` unificado)
- 7 HTMLs legacy (`index`, `light`, `dark`, `components-showcase`, `social-media-templates`)

### Metrics
- **Source:** 106 KB (tokens 25.8 + components 80.8)
- **Minified:** 65 KB (39% reduction)
- **Testes:** 19 (build + tokens parity)
- **Docs:** 13 componentes + 8 tokens + api-reference + a11y-audit + roi-report
- **A11y score:** 90/100 (melhorado de 74)

---

> **Nota histórica:** as versões `1.0.0` e `1.0.1` abaixo referem-se ao período em que o design system vivia dentro do monorepo `meus-projetos/` como `app-design-system`. A v2.0.0 marca a primeira release como repositório standalone multi-produto.

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
