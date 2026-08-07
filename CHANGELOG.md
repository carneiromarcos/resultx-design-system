# Changelog — ResultX Design System

Todas as mudanças notáveis neste design system são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added — Segmented control e item de lista

- **`.segmented`** — escolher um valor entre poucos, todos visíveis
  ("Humano / Agente / Observar"). **Sem JavaScript:** um grupo de
  `<input type="radio">` nativo já dá setas do teclado, seleção com Espaço, uma
  única parada de Tab, participação em formulário e o anúncio "Humano, botão de
  opção, 1 de 3, selecionado". Um teste reprova o dia em que aparecer um
  `dist/segmented.js`. Não é `.tabs` (que troca de visão) nem `.toggle` (que é
  binário). Estado lido por `:has()`. Variantes `-stacked`, `-sm`, `-lg`,
  `-block`. `docs/components/segmented.md`
- **`.list-item`** — linha de lista com avatar, título, hora, prévia, meta e
  contador de não lidas. Reaproveita a família `.avatar` do próprio DS.
  Truncamento com `min-width: 0` nos quatro níveis da cadeia; a hora não encolhe
  junto. O trilho de selecionado é `box-shadow` interno, não borda —
  deslocamento medido de **0px** ao trocar de seleção. Não lida sinaliza por
  **peso**, não só por cor. `docs/components/list-item.md`
- **`.sr-only`** — utilitário de texto só para leitor de tela, na seção
  ACCESSIBILITY. O repo não tinha nenhum, e o segmented control precisa de
  rótulo de grupo quando o bloco em volta já mostra um título

Verificado em Chrome real: `←` movendo a seleção `observar → agente → humano`
sem script carregado; o grupo consumindo **uma** parada de Tab e a seguinte
saindo dele; árvore ARIA com `group "Modo de atendimento"` e três `radio`; e o
título truncando em 175 de 364px reais numa coluna de 280px, com a hora inteira
preservada. Zero erro de console.

### ⚠️ Dívida registrada — `.layout-list-item`

`.layout-list-item` já existia, é documentado em `docs/components/layout.md` e
tem consumidor vivo em `demos/candidatos.html`. Faz quase a mesma coisa numa
versão de duas linhas: sem hora, prévia nem contador, sem `min-width: 0` na
linha, sem foco visível, e com `border-left: 3px` no ativo — que **desloca o
conteúdo** a cada troca de seleção. **Nada nele foi alterado:** fundir os dois é
uma decisão, não um efeito colateral. A sobreposição está registrada em
`docs/components/list-item.md` e fixada por três testes.

### Added — Camada de comportamento + 2 componentes de painel

Extraídos a partir de telas reais de um inbox de atendimento. O DS era CSS puro;
estes dois exigem JavaScript, e a decisão foi abrir a camada de comportamento em
vez de deixar cada produto reimplementar (item 7 da Onda 3, antecipado).

- **`.disclosure`** — módulo recolhível, o padrão dos blocos de um painel de
  contexto. Construído sobre `<details>`/`<summary>`: papel semântico,
  `aria-expanded`, teclado e revelação ao buscar na página vêm do navegador, não
  de código nosso. Cabeçalho de 44px (WCAG 2.2 SC 2.5.8). Fechado mede 46px —
  44 do cabeçalho + 2 de borda, **zero** vão morto. `docs/components/disclosure.md`
- **`.split-pane`** — painel de contexto redimensionável. **A largura vive numa
  variável só**, `--split-pane-width`, e a grade inteira deriva dela: o painel e o
  espaço que ele tira da coluna principal são o mesmo número, não dois para manter
  em sincronia. É o contrato que torna impossível repetir o vão morto de 192px do
  Electia. `docs/components/split-pane.md`
- **`dist/disclosure.js`** e **`dist/split-pane.js`** — vanilla, sem framework, no
  idioma do `theme-toggle.js` já existente. Arraste com pointer capture, teclado
  (← → ±16px, Shift ±64px, Home/End, Enter restaura), limites lidos do CSS,
  persistência em `localStorage` sob `resultx-*`, todo acesso em `try/catch`.
  Expostos como `resultx-design-system/disclosure` e `/split-pane`
- **`demos/inbox-panel.html`** — os dois funcionando juntos, com a ponte da Electia
- **`tests/disclosure-split-pane.test.js`** — 20 testes de contrato, incluindo um
  que reprova qualquer segundo `setProperty` de largura no script

Verificado em Chrome real: arraste de 320→440px com a coluna principal devolvendo
exatamente o que o painel tomou; teto em 560 e piso em 260; `aria-valuenow`
acompanhando; largura e módulos abertos restaurados após reload; coluna única em
768px sem overflow horizontal; zero erro de console.

### Added — Tokens de layout

- `--panel-width` (320px), `--panel-width-min` (260px), `--panel-width-max` (560px),
  `--split-handle-width` (12px) e `--disclosure-duration` (220ms), no bloco `:root`
  compartilhado. A duração é lida de volta pelo script, para que o CSS e a espera
  não se separem quando uma marca reajustar o token.

### Changed — Composição do bundle de componentes

- `components/components.css` passa a usar `@import url()` para puxar
  `disclosure.css` e `split-pane.css`. O `postcss-import` inlina no build, então
  `dist/components.min.css` segue sendo um arquivo só para o consumidor.

### Added — Ponte de marca (Onda 3, itens 1 e 2)

- **`brands/<marca>/tokens/ds-bridge.css`** para as 5 marcas — a camada que faltava entre o
  arquivo de marca e os tokens semânticos do DS. Antes disso o brand declarava `--purple` /
  `--gold` e não remapeava nada: quem importasse os dois continuava renderizando teal.
  Sobrescreve os **quatro** escopos de tema, inclusive os dois blocos `prefers-color-scheme` —
  sem eles quem não seta `data-theme` seguia no teal. Documentação em `docs/brand-bridge.md`
- **`--accent-primary-text`** em `tokens/tokens.css` — separa o papel de **texto** do papel de
  **preenchimento**. O mesmo dourado `#c4993b` é bom fundo (7,33:1 contra tinta escura) e texto
  ilegível sobre branco (2,64:1); um token só não dava conta dos dois
- **`scripts/lib/contrast.js`** — luminância relativa e razão de contraste WCAG 2.2. O repo não
  tinha nenhuma verificação de contraste
- **`scripts/build-brand-bridges.js`** + `scripts/brand-bridges.config.js` — geram as pontes a
  partir de `brands/<marca>/tokens/tokens.css`, que segue sendo fonte única. A config declara
  *qual token cumpre qual papel*, nunca um valor. `npm run build:bridges`, encadeado em `build:all`
- **`tests/brand-bridge.test.js`** — contraste, cobertura dos 4 escopos, ausência de teal e
  paridade entre o arquivo commitado e o gerador (esquecer o rebuild reprova a suíte)

### Fixed — Contraste do rótulo sobre o accent

- **`--text-inverse` deixa de ser um valor único do DS e passa a ser medido por marca.** O DS fixa
  `#0B0E14`, correto para o teal (10,38:1) e **ilegal para o roxo da Electia: 2,55:1**. A falha é
  bidirecional — nas 4 marcas douradas quem reprova é o branco (2,64:1). Nenhum valor único serve
  às duas famílias, então a tinta é escolhida por medição e o build falha se nenhuma candidata
  alcançar 4,5:1
- **27 usos de `--accent-primary` como cor de texto** em `components/` migraram para
  `--accent-primary-text`. `border-color`, `background` e `accent-color` não foram tocados
- **Hover da Electia** passa de `--purple-light #a55eea` (3,90:1 com rótulo branco, reprova) para
  `--purple-600 #8842d6` (5,53:1), um passo da rampa OKLCH da própria marca

### Changed

- `package.json` — `brands/*/tokens/*.css` entram em `files[]` e ganham os subpaths
  `./brands/*/bridge` e `./brands/*/tokens` em `exports`. **`brands/` não era publicado**:
  `node_modules/resultx-design-system/` não continha a pasta, e uma ponte sem essa correção não
  chegaria a consumidor nenhum

### Lacunas abertas — decisão de marca, não de código

- **Emprega+, PdV e ResultX** não têm, em tema light, variante do dourado aprovada em AA como
  texto (`#a07b2a` = 3,92:1; o `--gold-muted` do PdV passa no branco com 4,96:1 mas cai a 4,28:1
  sobre a superfície tingida de tag). Enquanto isso, `--accent-primary-text` cai em
  `var(--text-primary)`: perde-se a cor, não a legibilidade. **Xscore é o modelo** — já declara
  `--gold-ink #866425` (5,44:1)
- O comentário de `brands/xscore/tokens/tokens.css` afirma que o fill `#c4993b` leva "texto branco
  por cima". Branco sobre `#c4993b` dá **2,64:1** — reprova. O token está certo, a justificativa não

## [2.2.0] - 2026-08-05

Publicada via PR #34, merge commit `728bee0`. **Primeira vez desde abril que `main`, brand
system e linha de release estão no mesmo lugar** — e a primeira em que as quatro tags
(`v2.1.0`, `v2.1.1`, `v2.1.2`, `v2.2.0`) apontam para commits alcançáveis a partir da `main`.
A `v2.1.2` era órfã: fora cortada de uma branch de correção que não estava em lugar nenhum.

Reconcilia a linha de release com o trabalho real:
`main` estava parada em 26/04 enquanto o brand system evoluía em branch paralela, e a
tag `v2.1.2` havia sido cortada de uma branch de correção que não estava em lugar nenhum.
Esta versão junta tudo numa linha só.

### Added — Brand system multi-marca
- `brands/` com Electia, Emprega+, PdV, ResultX e Xscore — brand books, tokens, previews e templates
- Migração canônica da Electia: teal → roxo `#6f32b1`, navy → grafite `#0B0E14`
- Rampa OKLCH purple / royal-blue / gold com sinergia cross-brand

### Added — Componentes
- **`.btn-icon` completo** — passa de dimensão por padding (34×24, raspando o mínimo da WCAG 2.2)
  para caixa fixa 44×44, com `:disabled` e press effect. Tamanhos `-sm` (36) e `-lg` (52);
  variantes `-subtle`, `-primary` e `-danger`. Definição única em `components/icons.css`
- **`.form-textarea`** — o DS tinha `.form-input` e nenhum campo multilinha
- **`.kbd`** — atalhos de teclado deixam de ser texto solto
- **`.tooltip-right` / `.tooltip-left`** — só havia topo e base, inútil para navegação em rail
- **`.empty-state-inline`** — o estado vazio cheio usa ícone de 80px e padding `--space-16`,
  que estoura coluna de kanban e painel lateral
- **`.toast-action` / `.toast-dismiss` / `.toast[hidden]`** — sem eles o toast só comunica,
  nunca oferece saída nem pode ser dispensado; `display:flex` vencia o `[hidden]` do navegador

### Fixed — Defeitos de base
- **`.main` sem `min-width: 0`.** `body` é flex e `.main` é flex item: sem isso ele nunca encolhe
  abaixo do min-content do conteúdo, e qualquer linha que não quebra (tabs, toolbar, tabela)
  trava a largura acima da viewport, gerando scroll horizontal na página inteira.
  Medido em 390px, antes→depois: triagem 848→390, employer-jobs 1006→390, dashboard 614→390,
  candidatos 571→390
- **`.sidebar-item` sem `text-decoration: none`** — só ficava correto com `<div>`; com `<a>`,
  que é o markup certo para navegação, o link vinha sublinhado
- **`.header` com padding lateral fixo** `--space-8` — não cabe em 320px; passa a reduzir em ≤768px

### Changed — Convenção de nomenclatura
`CONTRIBUTING.md` e `docs/guides/getting-started.md` mandavam usar `.component--modifier` para tudo,
contradizendo o código: a camada base usa sufixo simples (`.btn-primary`, `.card-glass`) e só a
camada `.dl-` usa BEM. A doc passa a descrever as duas camadas — nenhum consumidor foi renomeado.

### Added — Demos
- `demos/electia-copiloto.html` — página-modelo de copiloto conversacional, com cada nó marcado
  como reuso do DS, composição local ou extensão proposta. Inclui a marca animada "Sinapse"
  da Electia AI, construída sobre a linguagem de sinapses da própria marca

### Changed — Reorganização estrutural (24/05)

### Changed — Top-level layout
- `docs-viewer.html` (orfão na raiz) → `docs/viewer.html`
- `render-templates.mjs` (orfão na raiz) → `scripts/render-templates.mjs`
- `pages/` (demos full-page) → `demos/` — nome menos confuso (não são páginas de app)
- `social-media-png/` → `templates/social-media/` — cria estrutura `templates/` semântica

### Changed — Padronização brands
- `brands/{electia,pdv}/email-templates/` → `brands/{electia,pdv}/templates/email/` — paridade com `templates/` raiz
- `brands/electia/previews/` agrupada em 5 categorias:
  - `logos/` (variants.html, purple-v2.5.html, concepts-v2/)
  - `brand-book/` (index.html, aurora-hero.html)
  - `gradients/` (options-2026-05-24.html)
  - `prototypes/` (prototype.html)
  - `visual-language/` (mantido)
- `brands/emprega-mais/previews/_archive/` criado para versões antigas:
  - `design-system-v1.html` (era `design-system.html`)
  - `design-system-v1-preview.html`
  - `design-system-v2-preview.html`
- `brands/emprega-mais/previews/` raiz fica só com canônicos: `brand-guidelines.html` + `mockups-gov.html`

### Updated — Referências
- `README.md`, `DESIGN-SYSTEM.md`, `CHANGELOG.md`, BBs e SOCIAL-MEDIA-GUIDE de todas marcas: refs atualizadas pros paths novos via sed
- `scripts/render-templates.mjs`: outDir aponta pra `templates/social-media/`
- `scripts/render-dashboards.mjs`: inPath aponta pra `demos/`

### Why
Marcos apontou desorganização: templates antigos misturados com novos, orphans na raiz, naming inconsistente entre brands. Aplicado padrão multi-brand DS (Brad Frost · Tokens Studio · W3C DTCG):
- Source vs output separados (`tokens/` `components/` `brands/` source; `dist/` `templates/social-media/` outputs)
- Orphans em pastas semânticas (`docs/`, `scripts/`)
- Brand structure padronizada (todos com `templates/email/`)
- Legacy explícito (`_archive/` em vez de v1/v2 misturados)

### Não alterado
- Tokens (valores, naming) — refactor puro cosmético de folders
- Brand kits content (BRAND-BOOKs, CHANGELOG marcas)
- Apps consumidores externos não dependiam dos paths alterados (validado por grep cross-repo)

---

## [2.1.2] - 2026-07-27

### Fixed
- **`.dl-table-wrap` — tabelas largas voltam a rolar em telas estreitas.** A regra usava `overflow: hidden`, que suprime barra de rolagem *e* gesto de swipe: o conteúdo excedente existia no DOM mas ficava inalcançável para o usuário. Medido no FinanceX (tela de Lançamentos, 7 colunas) a 390px de largura: `clientWidth` 324px contra `scrollWidth` 881px — **63% da tabela inacessível**, incluindo as colunas de status, valor e ações. Agora `overflow-x: auto` + `overflow-y: hidden` (o eixo Y segue clipado para preservar o `border-radius`).
- **`version` no `package.json` ressincronizada.** A tag `v2.1.1` foi publicada carregando `version: 2.1.0` internamente.

### Notas de compatibilidade
- Mudança isolada em `.dl-table-wrap`. Consumidores: **FinanceX** (15 usos) e **Electia** (0 usos — importa `components/data-cards.css` mas não usa a classe).
- ⚠️ A dívida de histórico registrada aqui — `main` fora da linha de release — **foi resolvida na v2.2.0**.

## [2.1.1] - 2026-04-26

Hotfix release com correções de distribution + cleanup de lint, e expansão da documentação para refletir o estado real do DS (5 themes + Data Layer).

### Fixed
- **`package.json` files array** — adicionado `components/data-cards.css` à allowlist. Sem este entry, `npm install github:carneiromarcos/resultx-design-system#v2.1.0` não trazia o data-cards.css aos consumers via git tag.
- **`components/data-cards.css` stylelint** — 7 errors corrigidos:
  - `#FFFFFF` → `var(--text-on-color)`
  - `url(#dl-chart-gradient)` → `url("#dl-chart-gradient")`
  - removida regra inválida `.dl-chart-point--active { r: 6 }` (atributo SVG, não propriedade CSS — set via attribute no markup)
  - `mask: ... #000` → `black` (named color)
  - reordenação de regras avatar-stack para corrigir `no-descending-specificity`
- **Tokens themes** — `#FFFFFF` → `#FFF` em premium-light, sober-dark, vibrant-dark (color-hex-length).

### Added — Documentation
- **`DESIGN-SYSTEM.md`** rebrand completo:
  - Título: "Emprega+ App Design System v1.0" → "ResultX Design System v2.1.1"
  - Filosofia atualizada: princípios v2.1 (Theme-aware, WCAG AA, Backward compatible, Multi-product) substituem antigos (Dark-first, Glassmorphism controlado, etc)
  - Seção "O que mudou da v2.0" com 4 bullets das adições da v2.1
  - Links para docs novas (`data-cards.md`, `gradients.md`, `preview.html`)
- **`docs/components/data-cards.md`** — novo. Documentação completa dos 10 componentes Data Layer (StatCard, Coin, Delta, Chart, Donut, Table, Sparkline, AvatarStack, StatusPill, TooltipCallout) com markup, variants, theme awareness, accessibility, e adoção atual (resultx.app + Electia).
- **`docs/tokens/gradients.md`** — novo. Documentação da gradient palette (5 brand gradients), gradient stops, delta semantics per-theme, surface accents per-theme, heatmap dot scale, dimensões compartilhadas, e guia "quando usar cada gradient".

### Changed
- **Versão local** alinhada com tag remote: `2.1.0` → `2.1.1`.

## [2.1.0] - 2026-04-25

Adiciona **camada Data Layer** ao DS: 3 themes opt-in (premium-light, sober-dark, vibrant-dark) e 10 componentes essenciais para dashboards/visualização de dados, inspirados em TalentaSync, Tivo e AdminDASH.

### Added — Data Layer (v2.1.0)
- **3 themes opt-in via `data-theme="..."`** — backwards compat 100%, `dark` e `light` v2.0 intactos:
  - `premium-light` — green forest #0E2C24 + cream #F2F5F0 (TalentaSync vibe, premium SaaS)
  - `sober-dark` — navy #1A1F2E + violet #8B5CF6 (Tivo vibe, enterprise)
  - `vibrant-dark` — deep navy #1A1F36 + cyan #18C4FF + magenta #FF4789 (AdminDASH vibe, high-tech)
- **Gradient palette compartilhado** — 5 gradients neutros (cyan, magenta, green, amber, purple) reutilizáveis nos 3 themes via `--gradient-*` e stops `--grad-*-start/end`
- **Delta semantics per-theme** — `--delta-positive-fg/bg`, `--delta-negative-fg/bg`, `--delta-neutral-fg/bg` calibrados por contexto
- **Surface accents per-theme** — `--surface-accent-cyan/magenta/green/amber/purple` para variants soft de Coin
- **Heatmap dot scale** — `--heatmap-dot-0..4` para visualização de atividade estilo GitHub contributions
- **Tokens de dimensionamento** — `--coin-size-sm/md/lg`, `--donut-size-sm/md/lg`, `--statcard-min-height`, `--heatmap-dot-size/gap`
- **`components/data-cards.css`** — 10 componentes essenciais (prefix `dl-`):
  1. `.dl-statcard` — bloco de métrica com header/value/footer
  2. `.dl-coin` — ícone arredondado com 5 variants gradient + 5 soft + neutral
  3. `.dl-delta` — pílula direcional positive/negative/neutral
  4. `.dl-chart` — shell para line/area chart (works com SVG inline)
  5. `.dl-donut` — donut conic-gradient com center value + legend categórica
  6. `.dl-table` — compact data table com header semântico
  7. `.dl-sparkline` — micro CSS bar chart inline (variants positive/negative)
  8. `.dl-avatar-stack` — avatares overlapping com `+N` more
  9. `.dl-status` — pílula semântica (in-progress/done/need-review/pending/blocked)
  10. `.dl-tooltip-callout` — tooltip flutuante para data-points em charts
- **`tokens/themes/preview.html`** — preview standalone com 3 dashboards mockup densos (browser frame + sidebar + 3 stats + donut + chart + table) para validação visual
- **`tests/data-layer.test.js`** — 24 testes Jest validando file presence, gradient palette, theme parity (3 themes têm os mesmos 32 tokens essenciais), e presença das 10 classes + variants
- **`./components/data-cards` export** — exposed via `package.json` exports map

### Added — Build infra (introduzido neste ciclo, integrado na release)
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
- `.gitignore` — ignora `templates/social-media/` (artefatos gerados) e `.claude/` (estado local)

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
