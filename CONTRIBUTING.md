# Contributing to ResultX Design System

## Quick Start

```bash
npm install
npm run build
npm run lint
npm test
```

## Adding Tokens

1. Define in `tokens/tokens.css` under the correct category
2. Add to **both** `[data-theme="dark"]` and `[data-theme="light"]` blocks
3. Add to **both** `@media (prefers-color-scheme)` fallback blocks
4. Update `tokens/tokens.json` (W3C DTCG format)
5. Run `npm run lint:tokens` to validate
6. Run `npm test` to verify theme parity

### Token naming

```
--{category}-{name}[-{variant}]
```

Examples: `--bg-surface-1`, `--text-muted`, `--theory-mbti-bg`, `--color-success`

### Rules

- Never use hardcoded hex/rgb in `components/components.css` — always reference tokens via `var(--token-name)`
- Hex values are only allowed inside token definitions (`tokens/`)
- Stylelint enforces this via `color-no-hex: true` on components

## Adding Components

1. Add styles to `components/components.css` under the appropriate section
2. Use only token variables for colors, spacing, typography, shadows
3. Follow BEM naming: `.component`, `.component-element`, `.component--modifier`
4. Add `:focus-visible` styles for all interactive elements
5. Run `npm run lint` before committing

### Component checklist

- [ ] Uses only CSS custom properties (no hardcoded colors)
- [ ] Has `:focus-visible` outline using `--focus-ring-*` tokens
- [ ] Responsive at 768px and 1024px breakpoints
- [ ] Works in both dark and light themes
- [ ] Respects `prefers-reduced-motion: reduce`

## Building

```bash
npm run build           # Build tokens + components → dist/
npm run build:tokens    # Only tokens
npm run build:components # Only components
```

Output goes to `dist/tokens.min.css` and `dist/components.min.css`.

## Linting

```bash
npm run lint            # Lint components (errors + warnings)
npm run lint:fix        # Auto-fix component issues
npm run lint:tokens     # Lint token files
```

## Testing

```bash
npm test                # Run all tests
```

Tests validate:
- Token parity between dark/light themes
- Build output integrity
- No hardcoded colors in components

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add kanban column resize
fix: correct badge contrast on light theme
docs: update token documentation
chore: update dependencies
```

## File Structure

```
tokens/tokens.css       ← Token definitions (dark + light)
tokens/tokens.json      ← W3C DTCG format
components/components.css ← All component styles
dist/                   ← Build output (committed)
docs/                   ← Documentation
pages/                  ← Template pages
```
