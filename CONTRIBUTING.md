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
3. Follow the naming convention **of the layer you are editing** — the two
   layers differ, and mixing them is what creates drift:

   | Layer | File | Element | Variant | Example |
   |-------|------|---------|---------|---------|
   | Base | `components.css`, `icons.css` | `.component-element` | `.component-variant` | `.btn-primary`, `.card-glass`, `.btn-icon-sm` |
   | Data | `data-cards.css` | `.dl-component-element` | `.dl-component--variant` | `.dl-status--done`, `.dl-coin--sm` |

   Base uses a single dash for both elements and variants; the `.dl-` layer uses
   BEM modifiers. Do not "fix" one layer to match the other — renaming breaks
   consumers, and the DS promises backward-compatible class names.
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

## Release — feito à mão, de propósito

Não existe script de release neste repo, e isso é decisão, não esquecimento.

O `commit-and-tag-version` **foi removido em 10/08/2026**. Foi testado em
`--dry-run` na v2.3.0 e reprovado por dois motivos concretos:

1. **Transformava hexadecimal de mensagem de commit em link de issue falso** —
   `closes #0B0E14`, `#c4993`, `#866425`… onze links quebrados numa release só.
   Este é um design system: mensagem de commit cita cor em hex o tempo todo.
2. **Substituiria o CHANGELOG escrito à mão** — que explica *por que* cada
   mudança existe — por uma lista seca de assuntos de commit.

Ficou instalado e proibido por duas versões, com três scripts que qualquer um
podia rodar sem saber da decisão. Removido para que o pé não tenha onde tropeçar.

### A receita

```bash
# 1. Escreva a seção da versão no CHANGELOG.md, à mão.
#    Converta o cabeçalho [Unreleased] em [X.Y.Z] - AAAA-MM-DD
#    e abra um [Unreleased] vazio acima.

# 2. Alinhe package.json E package-lock.json de uma vez.
#    (o lockfile já ficou defasado sozinho uma vez — não editar à mão)
npm version minor --no-git-tag-version   # ou patch / major

# 3. Reconstrua e verifique ANTES de taguear.
npm run build:all && npm run lint && npm test

# 4. Commit, tag anotada, push com a tag junto.
git commit -am "chore(release): X.Y.Z"
git tag -a vX.Y.Z -m "vX.Y.Z — <resumo de uma linha>"
git push origin main --follow-tags

# 5. Confirme que a tag é alcançável a partir da main remota.
git merge-base --is-ancestor vX.Y.Z origin/main && echo ok
```

O passo 5 não é zelo excessivo: em 05/08 uma tag foi criada sobre uma branch que
não estava na `main` e ficou **órfã** — a v2.1.2 apontava para lugar nenhum.

### Major × minor × patch

**Tudo aditivo é minor.** Classe nova, token novo, variante nova — mesmo que mude
pixel, desde que nada existente seja removido nem tenha valor alterado.

**Só é major se remover ou renomear algo público.** Foi por isso que
`.layout-list-item` virou alias em vez de sumir: remover classe pública pertence
a uma major, e não havia razão para gastar uma.

### Ao bumpar dependência de build, confira o `dist/`

Trocar cssnano, postcss ou autoprefixer **muda a saída minificada em silêncio** —
aconteceu duas vezes na v2.5.0. Não compare tamanho de arquivo: compare o
resultado efetivo, montando `seletor → propriedade → último valor` nas duas
versões. Se divergir, repita normalizando só espaço em branco antes de concluir
que houve mudança real.

## File Structure

```
tokens/tokens.css       ← Token definitions (dark + light)
tokens/tokens.json      ← W3C DTCG format
components/components.css ← All component styles
dist/                   ← Build output (committed)
docs/                   ← Documentation
pages/                  ← Template pages
```
