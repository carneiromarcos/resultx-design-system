# ResultX DS — Fase 1 (descoberta técnica) e Fase 3 (por que não há consistência)

@architect (Aria) · 13/11/2026 · auditoria **somente leitura** sobre snapshots `git archive` de `origin/main`.
`S=<snapshots locais de git archive>` · DS `6083ce3` · Electia `ef41e5d6` · IMO `7da075c6` · Xscore (workspace) `35921bf5`.
Os caminhos abaixo são relativos a cada snapshot. Os snapshots não trazem `.git`, então nenhuma conclusão vem do histórico.

Convenção de contagem de variáveis:
- `defs()` = `grep -hoE '(^|[;{[:space:]])--[a-zA-Z0-9_-]+[[:space:]]*:' <arquivos> | grep -oE -e '--[a-zA-Z0-9_-]+' | sort -u`;
- colisões medidas com `comm -12`;
- "DS core" = `tokens/tokens.css` + `tokens/base/*.css` + `tokens/themes/*.css`, com **250 nomes únicos**.

---

## 0. Resumo em uma tela

| | ResultX DS | Electia | IMO | Xscore |
|---|---|---|---|---|
| Stack | CSS puro + PostCSS + JS vanilla | Next 16.4.3, React 19.3.1, Tailwind v4 | Laravel ^12.60 (não 10), Livewire ^3.5, Blade, Bootstrap 5.3.8, laravel-mix 6, Sass | Next ^16.3.8, React 19.2.4, Tailwind v4, monorepo npm |
| Como consome o DS | é a fonte | tag git `#v2.9.0` → commit `405b335`: tokens core + bridge Electia + `data-cards` | **não instala.** Copia `eds-root.css` byte-idêntica (sha256 `c2366a51…`) | tag git `#v2.9.0` → `405b335`: **só** `brands/xscore/tokens` |
| Usa componentes do DS? | — | só `.dl-*` (data-cards), 100 usos | não; tem os próprios `.jl-*` (7.237 linhas) | não; tem 19 componentes React locais |
| Usa tokens core do DS? | — | indiretamente (bridge + dl-*); 0 `var(--bg-surface*/--accent-primary*)` no código | 0 colisões e 0 usos: outro namespace (`--eds-*`) | não importa o core |
| Vocabulário de fundo | `--bg-base`, `--bg-surface-1..3` | `--bg-primary`, `--bg-card` (656 refs) | `--eds-surface*`, `--bs-*`, `--jl-*`, `--em-*` | `--bg`, `--surface-1..4` |
| Cor fixa no código | 5 hex em `components/*.css` | 1.042 hex em ts/tsx; 284 em tsx de tela; 153 `[#hex]` | 4.362 hex em 28 CSS próprios servidos (10.006 com vendor) | 2 hex em ts/tsx; 1 `[#hex]` |
| Trava anti-regressão | stylelint `color-no-hex` | `ds-ratchet` + `ds-contrast` | teste de SHA + testes de view | `hardcoded-color` + `undefined-token` + `contrast` |
| Regra para agentes cita o DS? | não (AGENTS.md só trata de processo) | **não** (AGENTS.md: 405 linhas, 0 menções) | **não** (AGENTS.md: 0 menções) | sim (`CLAUDE.md:106` → `docs/design-system.md`) |

Em uma frase: o DS publica **tokens bem construídos e uma ponte de marca com contraste medido**. Só que nenhum produto consome a **camada de componentes**. Cada produto fala um **dialeto próprio de tokens** e mantém **componentes e vitrines paralelos**. Também não existe contrato executável que obrigue a convergência.

---

## 1. ResultX DS (`$S/ds`, v2.9.0)

### 1.1 Stack e estrutura
- **`package.json`:**
  - `name: resultx-design-system`, `version: 2.9.0`, `type: commonjs`, node `>=22.22.3`;
  - só devDependencies: postcss 8.5 + postcss-import + autoprefixer + cssnano 9, stylelint 17 (`stylelint-config-standard`), jest 30, playwright 1.64, husky 9, lint-staged 17, commitlint 21.
- **Sem framework de UI.**
  - Componentes = classes CSS globais: `components/components.css` (2.658 linhas) importa outros 18 arquivos (`@import` nas linhas 8–23).
  - Comportamentos = JS vanilla em `dist/*.js`: theme-toggle, disclosure, split-pane, audio-player, composer, sidebar-overlay, header-float, menu-drawer, cta-dock.

| Pasta | Conteúdo |
|---|---|
| `tokens/` | `tokens.css` (597 linhas, fonte); `base/tokens-base.css` (144 linhas: fontes, escala, espaçamento); `themes/` (premium-light, sober-dark, vibrant-dark, `_data-layer-shared`); `tokens.json` (128 linhas) |
| `components/` | 19 CSS. Famílias mais frequentes: `.sidebar` 35, `.btn` 30, `.form` 29, `.layout` 24, `.badge` 21, `.modal` 17 |
| `brands/` | electia, emprega-mais, pdv, resultx, xscore. Cada uma tem `tokens/tokens.css` e um `ds-bridge.css` gerado. Emprega+ também tem `eds-root.css` + `.sha256`. Xscore **não tem** `tokens.json` |
| `dist/` | `tokens.min.css`, `tokens.theme.css` (Tailwind v4 `@theme inline`, gerado), `tokens.ts` (591 linhas), `components.min.css`, `icons.min.css`, JS |
| `docs/` | 30 fichas em `docs/components/*.md`, 9 em `docs/tokens/`, 2 ADRs, `viewer.html` |
| `tests/` | 23 testes jest + 1 spec Playwright visual |

### 1.2 O que é agnóstico de framework e o que é acoplado
- **Agnóstico (ponto forte):** tokens em CSS custom properties, componentes como classes globais, JS vanilla e ponte de marca. Serve tanto a Blade quanto a React.
- **Acoplamentos:**
  - `dist/tokens.theme.css` é específico do Tailwind v4, e **nenhum consumidor o usa**. Electia e Xscore escrevem o próprio `@theme inline` à mão (`electia/src/app/globals.css:170`, `xscore/apps/web/app/globals.css:20`).
  - `.btn`, `.card`, `.badge`, `.modal` e `.sidebar` são nomes globais sem prefixo. Colidem com o Bootstrap (o IMO usa `btn-primary/...` 678× nas views) e com nomes de componentes React. Sem prefixo, a camada de componentes não entra com segurança em nenhum dos três produtos.
  - Não há pacote de componentes React nem headless. Para os dois produtos React, o DS entrega só tokens. [CONFIRMADO: `components/` só contém `.css`; `.design-sync/conventions.md:3` diz "Não há componentes React empacotados".]

### 1.3 Tokens: origem e fonte de verdade
- **O build trata o CSS como fonte.** `scripts/build-tokens.js:9-11` diz "tokens.css remains the authoritative source. This script NEVER writes back". O build lê o CSS e gera `tokens.theme.css` e `tokens.ts`. **Não há Style Dictionary** nem gerador a partir do JSON.
- **O JSON é mantido à mão, em paralelo:**
  - `CONTRIBUTING.md:13-16`, passo 4: "Update `tokens/tokens.json`".
  - O `tokens/tokens.json` da raiz tem **85 folhas** sob o namespace legado `emprega-app.*`. O `tokens/tokens.css` tem **199 variáveis únicas**. Comandos: `node -e` contando nós `$value`; `grep -oE '^\s*--[a-z0-9-]+:' tokens/tokens.css | sort -u | wc -l`.
  - Nenhum teste compara o JSON da raiz com o CSS: `grep -l "tokens/tokens.json" tests/*.js` não retorna nada. Só as marcas Emprega+ e ResultX têm teste JSON×CSS (`tests/emprega-mais-tokens.test.js`, `tests/resultx-brand.test.js`).
- **Docs contradizem o build.** `README.md:123` chama o `tokens.json` das marcas de "source-of-truth dos valores", e `README.md:166` apresenta `tokens/tokens.json` como "tokens compartilhados". A ambiguidade apontada em 02/10 **continua**.
- **Ponte de marca** (`scripts/brand-bridges.config.js` → `build-brand-bridges.js`):
  - declara só *nomes*; os valores vêm de `brands/<id>/tokens/tokens.css`;
  - a tinta sobre o accent é **medida**: o build falha abaixo de 4,5:1;
  - cobre os 4 escopos de tema, inclusive os blocos `prefers-color-scheme`;
  - é o ponto mais maduro do DS.
- **Emprega+ tem duas fontes dentro do próprio DS:**
  - `brands/emprega-mais/tokens/tokens.css`: 112 tokens `--emp-*`, que alimentam a ponte;
  - `eds-root.css`: tokens `--eds-*` com color-mix, para Laravel; o cabeçalho diz "NÃO alimentar build-brand-bridges.js";
  - a paridade é testada só para 3 pigmentos: navy, indigo e indigo-dark (`tests/eds-root.test.js:52-55`).
- **ADRs:**
  - ADR-0001 (tokens nomeados por papel) continua **Proposed** (`docs/adr/0001-role-named-tokens.md:3`);
  - ADR-0002 (convergência Emprega+) está Accepted.

### 1.4 Fontes, ícones, tema e breakpoints
- **Fontes:** `tokens/base/tokens-base.css:13-16` define Sora (títulos), Inter (corpo/sans) e JetBrains Mono. O DS não carrega fonte; cada produto carrega a sua.
- **Ícones:** `components/icons.css` traz utilitários para SVG inline, "compatível com Lucide, Phosphor, Heroicons". Nenhuma biblioteca vem embarcada.
- **Tema:**
  - `[data-theme="dark"|"light"]` (`tokens.css:140`, `:285`);
  - fallback `@media (prefers-color-scheme)` com `:root:not([data-theme])` (`tokens.css:426`);
  - mais 3 temas opcionais de "data layer".
- **Breakpoints:** não há tokens; os `--bp-*` estão **comentados** (`tokens-base.css:114-118`).
  - Componentes do DS: `max-width` 768, 1024 e 1280; `min-width` 1025.
  - IMO: padrão Bootstrap (575.98, 767.98, 992, 1200).
  - Electia e Xscore: padrão Tailwind (640, 768, 1024, 1280).
  - [CONFIRMADO: `grep -n "@media" components/components.css`; no IMO, `grep @media public/css/emprega-ds.css`.]

### 1.5 Qualidade, CI, versionamento e governança

| Item | Estado | Evidência |
|---|---|---|
| Lint | stylelint com `color-no-hex: true` em components; restam 5 hex em `components/*.css` | `.stylelintrc.json:4`; `grep -oE "#[0-9a-fA-F]{3,8}\b" components/*.css \| wc -l` = 5 |
| Testes unitários | 23 arquivos jest: contraste, ponte, pacote, eds-root, comportamento dos JS | `ls tests/*.test.js` |
| Teste visual | 1 spec com 4 capturas, **só** de `tokens/themes/preview.html` (3 temas de dashboard). Nenhum componente coberto | `tests/visual/preview.spec.js` (45 linhas) |
| Teste visual no CI | **Não roda.** `ci.yml` faz lint → build → `npm test`, e o jest ignora `/tests/visual/`. As capturas são `*-chromium-darwin.png` e falhariam em ubuntu | `grep playwright .github/workflows/*.yml` não retorna nada; `jest.testPathIgnorePatterns` no `package.json` |
| Doc diz o contrário | `playwright.config.js:7-9` promete que "shows up as a failing test in CI" | — |
| Gate de artefato | O CI falha se `npm run build` alterar `dist/` ou `brands/` (bom) | `ci.yml`, passo "Assert build outputs" |
| Release gate | Só emite `::warning`; não bloqueia | `release-gate.yml:3-6, 43, 52, 67` |
| CODEOWNERS | **Não existe** | `ls .github/CODEOWNERS CODEOWNERS` → No such file |
| Hooks locais | `"prepare": "husky"`, mas **não há `.husky/`** no snapshot (e nenhum `.gitattributes` com export-ignore que explique a ausência). commitlint e lint-staged nunca disparam | `ls -a ds` |
| Versionamento | SemVer manual com CHANGELOG à mão (Keep a Changelog). O `[Unreleased]` atual é só documentação | `CONTRIBUTING.md:100-140`; `CHANGELOG.md` |
| Distribuição | Decisão de 11/10: **tag git, não npm** (`README.md:28-34`). Mesmo assim, `npm-publish.yml` publica no npm a cada GitHub Release | `.github/workflows/npm-publish.yml` |
| Contratos de componente | 30 fichas em Markdown (`docs/components/`), só prosa. Sem tipos, schema, story ou teste por componente | `ls docs/components` |
| AGENTS.md / CLAUDE.md | 12 linhas, só processo (`tarefas.md`, Maestri). **Nenhuma regra de design ou de token** | `grep -n -i "token\|hex" AGENTS.md` não retorna nada |

**Doc ≠ código dentro do próprio DS:**
- `DESIGN-SYSTEM.md:1` diz "v2.1.1"; o pacote está na 2.9.0.
- `DESIGN-SYSTEM.md:208-209` documenta `--shadow-glow-teal` e `--shadow-glow-teal-lg`, que **não existem** (`grep -c -e "--shadow-glow-teal" tokens/*.css tokens/base/*.css` = 0).
- `README.md:17-18` aponta `templates/social-media/` e `render-templates.mjs` na raiz; nenhum dos dois existe ali (o script está em `scripts/`).
- `README.md` descreve Emprega+ como "gold+navy". Já `eds-root.css` e a ponte usam navy + **indigo** como cor de ação, com o ouro como secundário (`brand-bridges.config.js:69-73`).

**Contraste ainda falho.** `.btn-success` (`components/components.css:479-481`) usa fundo `--color-success` e texto `--text-primary`. No tema escuro dá `#22C55E` sobre `#E6EDF3` = **1,93:1** (cálculo WCAG local via `node`). A suíte de contraste não cobre esse par.

**Pacote npm.** O problema de 02/10 (7 CSS omitidos) **foi resolvido**: o `files` lista os 19 CSS de `components/`, e existe `tests/package-files.test.js`.

---

## 2. Electia (`$S/electia`, Next)

1. **Stack** (`package.json`):
   - next 16.4.3, react/react-dom 19.3.1, tailwindcss ^4 + `@tailwindcss/postcss`;
   - clsx + tailwind-merge (`cn`), lucide-react ^1.66 (importado em 135 arquivos), typescript ^6, vitest ^5;
   - sem shadcn e sem Radix.
2. **Consumo do DS:**
   - dependência: `"resultx-design-system": "github:carneiromarcos/resultx-design-system#v2.9.0"`; o lock resolve para `git+ssh://…#405b33517ffc…` (`package-lock.json:8458-8460`);
   - imports em `src/app/globals.css:14, :22, :23`, nesta ordem: `resultx-design-system/tokens` → `…/brands/electia/bridge` → `…/components/data-cards`; depois vêm `./tokens/viz-tokens.css` (local) e os blocos locais;
   - **não** importa `components` nem `tokens/theme`;
   - comentários desatualizados: "ResultX DS v2.1.1 — Foundation (Onda 1)" (`:3`) e "aligned to ResultX Design System v2.0.0" (`:29`).
3. **Tokens:**
   - **Camada local completa sobre o DS:** blocos `:root,[data-theme="dark"]` e `[data-theme="light"]` em `globals.css:63-160`, além do `@theme inline` escrito à mão (`:170`).
   - **157 variáveis locais** (`defs` nos 4 CSS de `src`). **12 colidem com o DS core:** `--border-default --color-success --color-warning --font-heading --font-sans --gradient-purple --text-muted --text-primary --text-secondary --theory-disc --theory-enneagram --theory-mbti`. Outras 2 colidem com `components/*.css` do DS. Como o local vem depois, **vence o local**.
   - **Dialeto próprio:**
     - `--bg-primary`/`--bg-card` somam 656 referências;
     - os nomes do DS core (`--bg-surface-*`, `--accent-primary*`) têm **0** referências `var()`;
     - o brand Electia dentro do DS usa um terceiro dialeto (`--bg`/`--surface-1`, `ds/brands/electia/tokens/tokens.css:68-69`), também com 0 usos no app.
   - **O alias enganoso continua:** `--accent-teal: #6f32b1` é roxo (`globals.css:73`, `:116`).
     - Hoje: **436 ocorrências em 153 arquivos** (`grep -rEo accent-teal src | wc -l`; `grep -rl … | wc -l`).
     - Em 07/08: 296 em 97. O uso **cresceu**.
   - **Cor fixa:**
     - 1.042 hex em `*.ts/*.tsx`, em 31 arquivos. Inclui PDF, e-mail e a vitrine `design-system/page.tsx` (81 sozinha).
     - **284** em `.tsx` fora de caminhos test/pdf/email, o que confirma o "~290" de rodadas anteriores. Comando: `grep -rEo "#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b" src --include='*.tsx' | grep -viE "test|pdf|email|\.spec" | wc -l`.
     - 114 hex em CSS e 153 classes arbitrárias `[#hex]`.
   - **Catraca:** `src/lib/__tests__/ds-ratchet-baseline.json` cobre 79 arquivos, com **rawPalette 491, hex 83, arbitraryText 113** (soma via `node`). Ela impede piorar, mas não reduz a dívida (ADR-127, linha 11).
4. **Fontes e ícones:** `next/font/google` com Inter, Sora e JetBrains_Mono (`src/app/layout.tsx:2`), alinhado ao DS. Ícones: lucide-react.
5. **Tema e breakpoints:**
   - escuro no `:root`; claro via `[data-theme="light"]`, gravado pelo script `theme-init` (`layout.tsx:135`) a partir do localStorage, só nas rotas de app;
   - o DS tem fallback `prefers-color-scheme` em `:root:not([data-theme])`, e o Electia não replica esse fallback. Com o SO em tema claro e sem o atributo, os tokens do DS (dl-*, bridge) ficariam claros e os locais, escuros. [HIPÓTESE: depende de o script sempre gravar o atributo; não executei.]
   - breakpoints Tailwind padrão; ocorrências: sm 493, md 91, lg 176, xl 11, 2xl 1.
6. **Regras para agentes:**
   - `AGENTS.md` (405 linhas) **não menciona o DS**. `grep -n -i "design system\|resultx-design\|token\|hex\|accent-teal" AGENTS.md` só encontra "token" no sentido de autenticação. `CLAUDE.md` apenas importa o AGENTS.
   - A regra existe em `docs/design-system.md` e no ADR-127, mas o agente só a encontra se procurar.
   - `docs/design-system.md` bate com o código: declara `globals.css` como fonte, admite que `--accent-teal` é roxo e proíbe hex.
   - **Componentes paralelos:** `src/components/ui/` tem 13 (Button, Card, Input, Modal, Select, Tabs, StatusBadge…). O `Button` primary usa `bg-gradient-purple-vibrant` com sombra fixa `rgba(111,50,177,.25)` (`button.tsx:14`) e não tem relação com o `.btn-primary` do DS.
   - **Três vitrines locais**, mais um HTML:
     - `src/app/design-system/page.tsx` (635 linhas);
     - `src/app/desing-system/page.tsx` (*typo* no nome, 5 linhas);
     - `src/app/styleguide/page.tsx` (230 linhas);
     - `docs/design-system.html`.

---

## 3. Emprega+ IMO (`$S/imo`, Laravel)

1. **Stack:**
   - `composer.json`: php ^8.2, **laravel/framework ^12.60** (o briefing dizia 10), livewire ^3.5, rappasoft/laravel-livewire-tables ^3.7;
   - `package.json`: laravel-mix ^6, sass, **bootstrap ^5.3.8**, jquery 3, select2, datatables, flatpickr, quill, sweetalert2, izitoast, toastr, chart.js, **@fortawesome/fontawesome-free ^6**;
   - sem Tailwind.
2. **Consumo do DS:**
   - **Não instala o pacote.** Copia `public/css/eds-root.css`, **byte-idêntico** ao canônico: `shasum -a 256` dá `c2366a517a96…ce86` nos dois arquivos, igual ao registrado em `ds/brands/emprega-mais/tokens/eds-root.sha256`.
   - Trava: `tests/Unit/EdsRootVendoredCopyTest.php`.
   - Carregamento: `resources/views/partials/emprega-ds-css.blade.php` inclui `eds-root.css` e depois `emprega-ds.css`, com `versionedAsset`.
   - O DS fornece **só os tokens da Camada 1**. Todos os componentes (`.jl-*`, 7.237 linhas em `public/css/emprega-ds.css`) **existem só no IMO**: `find ds -name "emprega-ds*"` e `grep -rl jl-btn ds` não retornam nada.
3. **Tokens: sistemas que convivem.** Prefixos definidos no CSS servido próprio. Comando: `find public -name '*.css' -not -path '*/vendor/*' -not -name '*.min.css' | xargs grep -ohE … | sort -u | sed 's/^--\([a-z0-9]*\).*/\1/' | uniq -c`.

| Sistema | Nomes únicos | Onde nasce |
|---|---:|---|
| `--bs-*` (Bootstrap / tema Metronic com "ResultX DS v2.0 Light") | 75 | `resources/theme/css/style.css` → `public/assets/css/style*.css`; `admin-ds.css` (16); `front-pages.css` (244 ocorrências) |
| `--eds-*` (Emprega DS, vindo do ResultX DS) | 64, mais `--eds-shell-*` locais | `public/css/eds-root.css`; `employer-shell-layout.scss:264-270` deriva outros |
| `--jl-*` (aliases legados) | 34 | `public/css/emprega-ds.css`; também `front_web/company/company_details.blade.php` |
| `--em-*` | 27 | `resources/assets/sass/_empregamais-theme.scss` → `style*.css`, `header-footer-reskin.css`, `employer-shell-layout.css` |
| Variáveis Sass `$…` | 155 únicas (131 em `_empregamais-theme.scss`) | `resources/assets/sass/*.scss` |
| `<style>` inline em Blade | 68 views com `<style>`, 28 delas definem `--*` | `resources/views/**` |
| Bibliotecas (`--fc-*`, `--tag*`, `--fa-*`) | ~25 | vendor |

   - **6 sistemas de token** (bs, eds, jl, em, Sass e inline), o que confirma o número de 12/11.
   - **252 variáveis próprias e 0 colisões de nome com o DS core.** O IMO nunca usa o vocabulário core (`--accent-primary` etc.); para ele, o DS core é irrelevante.
   - **O white-label sobrescreve tokens da cópia travada.** `front_web/layouts/app.blade.php:146-150` regrava `--eds-indigo` e `--eds-indigo-dark` em runtime com a cor do tenant.
     - O SHA protege o arquivo, não o valor que de fato vale na página.
     - O nome "indigo" passa a carregar qualquer cor: o mesmo antipadrão do `--accent-teal` (ADR-0001).
   - **Cor fixa no CSS servido:**
     - **10.006** hex em todo `public/**/*.css`, incluindo 6 cópias do Bootstrap com 609 hex cada;
     - **4.362** em 28 CSS próprios, excluindo vendor, `front_web/bootstrap`, `front_web/scss`, `*third*party*`, `plugins*` e `*.min.css`;
     - maiores concentrações: `dark-main.css` 898, `style.css` 797, `style.dark.css` 794, `main.css` 794, `front-pages.css` 730;
     - mais 344 hex nas views Blade;
     - o "~8.666" de 12/11 não se reproduz em nenhum dos dois recortes. A diferença é de método, não uma melhora comprovada.
   - **Botões:** `.jl-btn*` aparece 662× nas views; as classes Bootstrap `btn-(primary|secondary|success|danger|light|outline-*)` aparecem 678×. O conflito `btn` × `jl-btn` de 12/11 está **confirmado**.
4. **Fontes e ícones:**
   - Sora + Inter via Google Fonts (`<link>`) nos dois layouts (`layouts/app.blade.php:17`, `front_web/layouts/app.blade.php:36`), sem JetBrains Mono;
   - Font Awesome 6 (1.570 classes `fa-*` nas views), mais alguns Line Awesome (`la`).
5. **Tema e breakpoints:** há **dois mecanismos de tema**, um por tipo de layout.
   - **Admin/painel** (`layouts/app.blade.php:22-27`): troca **folhas inteiras** com `media="all|not all"`, conforme `$isDark`.
   - **Site público:** `[data-theme="dark"]` (7 ocorrências em `emprega-ds.css`, 4 em `eds-root.css`).
   - O **admin não carrega `eds-root.css` nem `emprega-ds.css`**: o parcial não está em `layouts/app.blade.php`, que carrega `style.css` (com `--bs-*`), `admin-recolor.css` e `admin-ds.css`. O **admin está em Bootstrap/Metronic**, como apontado em 12/11.
   - Breakpoints Bootstrap: 575.98, 767.98, 992, 1200.
6. **Regras para agentes:**
   - `AGENTS.md` (93 linhas) **não menciona DS, eds, jl, tokens nem Bootstrap** (grep vazio). Não há `.claude/rules/`.
   - A regra vive em `docs/imo-ds.md`, que **contradiz o código**:

     | `docs/imo-ds.md` diz (linhas 3–5 e 13) | O código mostra |
     |---|---|
     | O arquivo canônico é `emprega-ds.css`, com os tokens `--eds-*` | Os tokens ficam em `eds-root.css`, canônico no DS e travado por SHA |
     | Trocar o tema = trocar só o bloco `:root` de `emprega-ds.css` | O `:root` dos tokens está em `eds-root.css` |
     | `imo-ds.css` faz `@import 'emprega-ds.css'` | `imo-ds.css` é um shim **vazio** desde 21/09 (`public/css/imo-ds.css`) |

   - Vitrine própria: `public/design-system/index.html`.

---

## 4. Xscore (`$S/xscore/.../apps/web`, Next 16)

1. **Stack:** next ^16.3.8, react 19.2.4, tailwindcss ^4, clsx + tailwind-merge, @playwright/test (e2e). Sem biblioteca de ícones (só 2 `<svg>` em `components/`) e sem shadcn/Radix.
2. **Consumo do DS:**
   - `apps/web/package.json` aponta para `#v2.9.0`; o lock resolve para `405b335` (`package-lock.json:6133-6135`);
   - um único import: `@import "resultx-design-system/brands/xscore/tokens"` (`app/globals.css:18`) — **sem core, sem bridge, sem componentes**;
   - o próprio DS registra que "a migração completa (base + bridge) segue aberta" (`ds/README.md:48`).
3. **Tokens:**
   - fonte única: `ds/brands/xscore/tokens/tokens.css`, com 87 nomes e **sem `tokens.json`**;
   - o app define só 30 variáveis locais; a única que repete o brand é `--font-mono`;
   - **Colisão latente:** **26 dos 87 nomes do brand Xscore são iguais a nomes do DS core, com valores diferentes**. Exemplos: `--radius-md` 10px × 8px, `--radius-lg` 14px × 12px, `--text-sm` 13px × 0.8125rem, `--shadow-md`, `--font-body` Plus Jakarta × Inter. Medido com `comm -12` e comparação de valores via `grep -m1`.
   - No dia em que o Xscore importar core + bridge (o plano declarado), a ordem dos imports decide a forma do produto.
   - O vocabulário é um **terceiro dialeto**: `--bg`, `--surface-1..4`, `--gold`, `--intel`.
4. **Cor fixa:**
   - 2 hex em ts/tsx de produção, 1 `[#hex]`, 0 em `*.module.css`, 0 classes de paleta crua: o app está limpo;
   - travas: `lib/brand/hardcoded-color.test.ts`, `undefined-token.test.ts`, `contrast.test.ts`.
5. **Fontes:** `next/font/google` com Plus_Jakarta_Sans, Sora e Geist_Mono (`app/layout.tsx:2`). **Diverge do DS** (Inter/JetBrains Mono) por decisão de brand.
6. **Tema:** escuro no `:root`; claro é opcional, via `[data-theme="light"]` gravado pelo `THEME_BOOTSTRAP` (`layout.tsx:40`). Breakpoints: padrão Tailwind.
7. **Regras para agentes:**
   - `CLAUDE.md:106-109` manda ler `docs/design-system.md` "antes de mexer em QUALQUER tela". O doc (333 linhas, verificado em 12/10) descreve corretamente a cadeia DS → globals.
   - Desvio pequeno: o `CLAUDE.md` fala em "os 8 componentes de `ui/`", e hoje são **19** arquivos (`ls apps/web/components/ui | wc -l`).
   - Componentes próprios (Button, Card, Badge, Table, Modal, Tabs, Toast…), nenhum reaproveitado do DS.

---

## 5. Fase 3 — por que o DS compartilhado não produz consistência

Causas ordenadas pelo impacto estimado.

### C1. A camada de componentes do DS não tem consumidor
O DS investe 2.658 linhas, mais 18 arquivos de componentes e 9 JS, mas nenhum dos 3 produtos importa `components`. O Electia importa só `data-cards`; Xscore e IMO, nada.
- [CONFIRMADO] `electia/src/app/globals.css:14,22,23`; `xscore/apps/web/app/globals.css:18`; o IMO nem instala o pacote (`imo/package.json`).
- Consequência: a consistência entre produtos só poderia vir dos **tokens**, e eles são usados em dialetos diferentes (C2).

### C2. Três ou quatro dialetos de token para o mesmo papel
"Fundo de card" se escreve de quatro jeitos:

| Onde | Nome |
|---|---|
| DS core | `--bg-surface-2` |
| Electia (app) | `--bg-card` |
| Brands Electia e Xscore (no DS) | `--surface-1` |
| IMO | `--eds-surface`, `--bs-*`, `--em-*` |

- [CONFIRMADO] `ds/tokens/tokens.css`; `electia/src/app/globals.css:63-80` (656 refs a `--bg-primary|--bg-card`, 0 a `--bg-surface*`); `ds/brands/electia/tokens/tokens.css:68-69`; `ds/brands/xscore/tokens/tokens.css`; tabela de prefixos do IMO (§3).
- O DS não impõe um vocabulário semântico único nem às próprias marcas: o brand Electia do DS não usa os nomes do core.

### C3. Tokens do DS sobrescritos localmente
- Electia redefine 12 nomes do core depois do import, e o local vence. [CONFIRMADO] `comm -12` (§2.3)
- IMO regrava `--eds-indigo*` em runtime, por tenant. [CONFIRMADO] `front_web/layouts/app.blade.php:146-150`
- Xscore tem 26 nomes em colisão latente, com valores diferentes. [CONFIRMADO] §4.3

### C4. Nomes que mentem (ADR-0001 parado em "Proposed")
- `--accent-teal` é roxo, e o uso cresceu de 296 ocorrências/97 arquivos (07/08) para **436/153** (13/11). [CONFIRMADO] `electia/src/app/globals.css:73`; `grep -rEo accent-teal src | wc -l`; `docs/adr/0001-role-named-tokens.md:3`
- `--eds-indigo` carrega a cor do tenant. [CONFIRMADO] mesma evidência de C3.
- Sem a decisão aceita, nenhum produto é obrigado a renomear.

### C5. Componentes locais que deveriam ser compartilhados
- Button, Card, Modal, Tabs, Badge e Input existem **duas vezes em React** (Electia, 13 em `components/ui`; Xscore, 19) e uma vez em Blade (`.jl-*`), além do Bootstrap no admin do IMO. [CONFIRMADO] `ls`
- O Button primário diverge em cada produto:
  - Electia: gradiente roxo com sombra fixa (`electia/src/components/ui/button.tsx:14`);
  - Xscore: ouro com texto escuro;
  - IMO: `.jl-btn--primary` indigo.
- Parte disso é **intencional**, porque as marcas são diferentes. O problema é não haver um contrato comum de anatomia, estados, tamanhos e foco do qual cada marca derive.

### C6. A camada de componentes do DS é acoplada a CSS global sem prefixo
- `.btn`, `.card`, `.modal` e `.sidebar` colidiriam com o Bootstrap no IMO (678 usos de `btn-*`) e não entram em React+Tailwind sem wrapper. Não existe pacote React/headless. [CONFIRMADO] famílias de classe em `components.css`; contagem de `btn-*` no IMO.
- [HIPÓTESE] Esse acoplamento explica por que os times reimplementaram em vez de adotar. É coerente com o "Onda 1 = no visual change" do Electia (`globals.css:11-12`).

### C7. Doc ≠ implementação, no DS e nos produtos
[CONFIRMADO]:
- **DS:**
  - `README.md:123,166` chama o JSON de fonte de verdade, contra `scripts/build-tokens.js:9-11`;
  - o JSON da raiz tem 85 folhas legadas contra 199 variáveis no CSS, sem teste;
  - `DESIGN-SYSTEM.md` está em v2.1.1, centrado no teal, e documenta `--shadow-glow-teal`, que não existe;
  - `README.md:17-18` aponta caminhos inexistentes;
  - `playwright.config.js:7-9` promete um teste visual no CI que não roda;
  - a decisão "não npm" (`README.md:28-34`) contradiz o `npm-publish.yml`.
- **IMO:** `docs/imo-ds.md:3-5,13` descreve a arquitetura de tokens de antes de 21/09.
- **Electia:** os comentários de `globals.css:3,29` citam DS v2.1.1/v2.0.0.
- **Xscore:** `CLAUDE.md:106` fala em "8 componentes", e são 19.

### C8. Falta contrato executável e teste visual de componentes
- O único teste visual cobre a página de preview dos 3 temas de dashboard, não roda no CI e só tem capturas darwin. [CONFIRMADO] `tests/visual/preview.spec.js`, `ci.yml`, arquivos `*-chromium-darwin.png`
- Os contratos de componente são Markdown (`docs/components/*.md`). [CONFIRMADO]
- `.btn-success` reprova AA no tema escuro (1,93:1) sem que nenhum teste acuse. [CONFIRMADO] `components/components.css:479-481`, `tokens/tokens.css:172,191`
- As travas dos produtos são **locais e divergentes**:
  - Electia: catraca;
  - IMO: SHA + testes de view;
  - Xscore: hardcoded-color, undefined-token e contrast.

  Cada uma protege o dialeto do próprio produto, não a convergência com o DS.

### C9. Agentes sem instrução de usar o DS justamente onde mais se programa
- O AGENTS.md do Electia (405 linhas) e o do IMO (93) não citam o DS. O AGENTS.md do DS não tem regra de design. Só o Xscore aponta o agente para o doc do DS. [CONFIRMADO] greps de §1.5, §2.6, §3.6 e §4.7.
- Efeito observável:
  - três vitrines no Electia, uma delas com o typo `desing-system`;
  - vitrine própria no IMO;
  - 1.042 hex no Electia;
  - Button divergente.

  [CONFIRMADO, quanto aos artefatos]
- [HIPÓTESE] Que esses artefatos tenham sido criados sobretudo por agentes que não consultaram o DS. Sem `.git` no snapshot, não dá para atribuir autoria.

### C10. A governança permite mudar sem revisão e sem avisar o consumidor
- Não há CODEOWNERS; o release-gate só avisa; não há `.husky/`, então commitlint e lint-staged nunca rodam. [CONFIRMADO] §1.5
- [HIPÓTESE] Branch protection não é verificável no snapshot. O repo do DS é público, então o plano grátis permitiria proteger a `main`. Conferir com `gh api repos/carneiromarcos/resultx-design-system/branches/main/protection`.
- [CONFIRMADO] Os consumidores travam uma **tag git fixa** (`#v2.9.0`), sem automação de atualização: o Dependabot do DS só cuida das dependências do próprio DS. Uma mudança no DS não chega aos produtos sozinha e não gera alerta.
- [CONFIRMADO] O IMO fica fora da tag e depende de cópia + SHA atualizados à mão em 3 repos (`scripts/check-eds-root-copies.js:16-19`, que exige `gh auth`).

### C11. Duas fontes de token para Emprega+ dentro do próprio DS
- `--emp-*` (`tokens.css`, alimenta a ponte) × `--eds-*` (`eds-root.css`, Laravel, color-mix). A paridade é testada só para 3 pigmentos. [CONFIRMADO] `tests/eds-root.test.js:52-55`; cabeçalho de `eds-root.css`
- Risco: para a mesma marca, um consumidor via bridge e o IMO podem ver cores diferentes.

### C12. Breakpoints e fontes sem token
- `--bp-*` está comentado. Os produtos usam Bootstrap ou o padrão Tailwind, com grades diferentes (992 × 1024; 1200 × 1280). [CONFIRMADO] `tokens-base.css:114-118`
- A fonte do Xscore diverge por decisão de brand (Plus Jakarta/Geist Mono). [CONFIRMADO] `xscore/apps/web/app/layout.tsx:2`
- A escolha de fonte é legítima, mas não está modelada como token de marca consumido pelo core.

### Leitura arquitetural (trade-off)
- **Acertos do DS:** ser agnóstico de framework e ter uma ponte de marca com contraste medido.
- **Erros do DS:** entregar **componentes como CSS global sem prefixo**, que nenhum produto real consegue adotar, e deixar o **vocabulário semântico opcional**.
- Quem convergiu (Xscore) convergiu por disciplina local, não por um contrato do DS.

O caminho de maior alavancagem não é criar mais componentes. É, nesta ordem:
1. aceitar o ADR-0001 e fixar um vocabulário semântico único;
2. gerar a partir dele os aliases de cada produto;
3. criar contratos testáveis por componente (visual + contraste) que rodem no CI;
4. pôr a regra no AGENTS.md de cada produto.

O detalhamento fica para a fase de recomendação.

---

## Lacunas não verificadas

- **Comportamento em runtime:** nada foi renderizado. São inferências de leitura:
  - o efeito real de C3 (ordem da cascata);
  - o tema misto do Electia com o SO em tema claro e sem `data-theme`;
  - o contraste efetivo por tenant no IMO.
- **Histórico e autoria:** os snapshots não têm `.git`. Não foi possível:
  - atribuir arquivos a agentes (C9);
  - datar o crescimento do `--accent-teal` além dos dois pontos citados;
  - comparar `v2.9.0` (`405b335`) com `main` (`6083ce3`) por diff. O `[Unreleased]` do CHANGELOG diz que só há documentação, mas isso não foi conferido byte a byte.
- **GitHub dos 4 repos:** branch protection, required checks e permissões de push não foram consultados (exigem `gh api`).
- **Fora do escopo:** EditalHub (terceira cópia do `eds-root.css`), FinanceX e ResultX Site. A igualdade das cópias remotas não foi checada: `npm run check:eds-root` exige `gh auth` e rede.
- **Número ~8.666 do IMO (12/11):** não reproduzido. Os dois recortes medidos (10.006 e 4.362) estão documentados acima; o recorte original é desconhecido.
- **Hex no Electia:**
  - a regex de 3 dígitos pode contar falsos positivos (ex.: `#123` em comentário de PR);
  - os 284 "de tela" excluem arquivos só pelo caminho (`test|pdf|email`), não pelo uso.
- **Testes não executados:** jest, vitest, phpunit, node --test e Playwright, tanto no DS quanto nos produtos. Tudo o que está aqui é o que o código declara, não o que passa.
- **Contraste:** só `.btn-success` foi recalculado. Os demais pares de componente do DS não foram auditados nesta fase.
- **Bundle e performance:** não medidos. Inclui o peso de `third_party.css` e quais das 6 cópias do Bootstrap do IMO são de fato referenciadas.
