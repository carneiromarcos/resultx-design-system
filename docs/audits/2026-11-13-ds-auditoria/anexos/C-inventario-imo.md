# Fase 5 — Inventário de UI do IMO (base da matriz Electia × IMO)

> Auditoria **somente leitura** · @analyst (Atlas/Alex) · 13/11/2026
> Fonte: snapshot `$S/imo` (origin/main 7da075c6, sem `.git` no snapshot) e `$S/ds` (ResultX DS 6083ce3).
> `$S = <snapshots locais de git archive>`
> Nada foi executado no navegador. Contrastes citados vêm de cálculo sobre os hex do código ou dos docs do próprio IMO, **sem** verificação visual.

---

## 0. Correções ao contexto recebido

| Afirmação do pedido | O que o código mostra | Evidência |
|---|---|---|
| "Laravel 10" | **Laravel 12** (`laravel/framework ^12.60`), Livewire ^3.5, rappasoft/laravel-livewire-tables ^3.7 | `composer.json` |
| "CSS do template (jl-*)" | `jl-*` **não** vem do template. É a camada 2/3 do DS Emprega+ (`public/css/emprega-ds.css`), nascida no piloto do dashboard do candidato. O template é o InfyJobs/Metronic-like (`assets/css/style.css`, Bootstrap 5 com `--bs-*` recolorido para `#1D4ED8`/`#2563EB`) | `public/css/emprega-ds.css` cabeçalho; `head -c 400 public/assets/css/style.css` |
| "Fatia 1 em produção (#891)" | **Confirmado no código**: piso de foco de duas cores (`emprega-ds.css:7185`), `data-theme` SSR em `layouts/app` e `candidate/layouts/app`, regra ink-soft→ink-medium guardada por teste | `tests/Unit/Views/EmpregaDsFocoETextoTest.php`, `tests/Feature/LayoutDataThemeSsrTest.php` |
| "Fatia 3 ainda não em main" | **Confirmado**: nenhuma ocorrência de "Fatia 3"; Bootstrap do candidato segue com `.btn-primary{background:#1d4ed8}` literal e o escuro com `#2dd4bf` | `grep -rn "Fatia 3"` → 0 |
| "8.666 fixos no CSS servido + 1.431 nas views" | Recontagem com método explícito (seção 4): **4.226 hex + 6.318 px = 10.544** no CSS servido (26 folhas, inclui vendor) e **344 hex + 1.189 px = 1.533** nas views. O método de 12/11 não está documentado; os números **não são comparáveis 1:1** | §4 |
| ".btn 853 × .jl-btn 248" | Em `class="…"` literal: **`btn` 730 × `jl-btn` 250** (+363 `jl-btn--*`). Com grep de palavra: `btn` 728 × `jl-btn` 264. Diferença vem de método (Blade dinâmico, `'class' =>` em arrays do `Form::`) | §3.1 |
| "43 tamanhos de fonte, 56 espaçamentos, 22 raios" | Camada própria (13 folhas DS/reskin): **51 font-size, 77 comprimentos de espaçamento, 22 raios**. Views: **66 / 92 / 24**. Raios batem; fontes e espaçamento subiram ou o método diferiu | §4.3 |
| "6 sistemas de token" | **Confirmado** (seção 2) — mais o `:root` inline de white-label por layout | §2 |

---

## 1. Mapa de layouts, folhas servidas e áreas

### 1.1 Layouts e quantas views os estendem

Comando: `grep -rhoE "@extends\(['\"][^'\"]+['\"]" resources/views | sort | uniq -c`

| Layout | Área | Views que estendem | Carrega eds-root + emprega-ds? | `data-theme` no `<html>` SSR? |
|---|---|---|---|---|
| `layouts/app.blade.php` | Admin (tenant/plataforma) | 99 (+5 `settings.index`) | Sim (partial) + `admin-ds.css` por último | Sim (`$isDark`, Fatia 1) |
| `layouts/superadmin.blade.php` | Superadmin | 9 | Sim | Sim (`session('theme')`) |
| `employer/layouts/app.blade.php` | Empregador | 19 (16 employer + pricing/transactions) | Sim + `dashboard-reskin` + `employer-shell-layout` + `employer-lists` | Sim |
| `candidate/layouts/app.blade.php` | Candidato | 10 (+5 via `candidate.profile.index`) | Sim | Sim (Fatia 1) |
| `front_web/layouts/app.blade.php` | Site público | 49 | Sim (partial no layout desde 23/09 + 39 views incluem com `@once`) | Via JS pré-pintura (localStorage), não SSR |
| `layouts/auth.blade.php` | Login/registro legado | 12 (`auth/*`, `auth_template/*`) | **Não** — usa `--eds-*` em `<style>` inline sem carregar `eds-root.css` | Não |

Telas reais em `layouts.auth` ainda vivas: `auth.login` é retornada por `Auth/Front/LoginController.php:56` e `Web/WebController.php:49`; `auth.passwords.email` por `Auth/LoginController.php:122`. Os logins por perfil (`front_web/auth/*_login`) já incluem o DS. **Pendência "login sem eds-root" confirmada** para essas telas.

### 1.2 Folhas CSS servidas (o que o navegador baixa)

Comando-base: `grep -rnoE "(asset|mix)\(['\"][^'\"]+\.css['\"]\)" resources/views` + `versionedAsset(...)` + `partials/emprega-ds-css.blade.php`.

| Folha | Origem | Bytes | Áreas |
|---|---|---|---|
| `assets/css/style.css` / `style.dark.css` | Template (Bootstrap 5 + Metronic-like, `--bs-*` recolorido); alternadas por `media` | 258 KB cada | admin, empregador, candidato, auth |
| `assets/css/third-party.css` | Vendor concatenado (select2, flatpickr, daterangepicker, quill com 2.059 regras `.ql-`, intl-tel-input, datatables) | 333 KB | admin, empregador, candidato, auth |
| `css/plugins.css` / `plugins.dark.css` | Tema de plugins do template (select2-bootstrap-5, flatpickr, datatables) | 55 KB cada | idem |
| `assets/css/custom.css`, `custom-dark.css`, `css/custom.css` | Customizações antigas (SCSS `new-custom*.scss`, `resources/assets/custom.css`) | 0,4–4 KB | idem |
| `assets/css/admin-recolor.css` | Recolor Metronic roxo → DS | 0,8 KB | admin |
| `css/admin-ds.css` | Ponte Bootstrap→`--eds-*` (botões, forms, tabelas, sidebar, modais, dashboard tenant) | 21 KB | **só admin** |
| `assets/css/dashboard-reskin.css`, `employer-shell-layout.css`, `css/employer-lists.css` | Reskin do empregador lendo `--eds-*` | 15 / 12 / 10 KB | empregador |
| `css/eds-root.css` | **Camada 1 ResultX** (tokens `--eds-*`), byte-idêntica ao canônico | 9,8 KB | todas exceto `layouts.auth` |
| `css/emprega-ds.css` | Camadas 2/3: aliases `--jl-*` + componentes `.jl-*` (7.237 linhas) | 224 KB | todas exceto `layouts.auth` |
| `front_web/scss/bootstrap.css` **e** `css/front-pages.css` | **Bootstrap 5.1.3 carregado duas vezes** no público (o `front-pages` concatena outra cópia + slick + páginas) | 254 + 205 KB | público |
| `assets/css/header-footer-reskin.css` | Header/rodapé público (paleta `--em-*` azul antiga) | 10 KB | público |
| `assets/css/front-third-party.css` | select2, toastr, slick, ion-rangeslider, intl-tel-input | 54 KB | público |
| `assets/css/iziToast.min.css`, `all.min.css` (Font Awesome 6), `front_web/css/jquery-ui.min.css` | Vendor | 42 / 74 / 32 KB | público |
| `vendor/rappasoft/.../laravel-livewire-tables*.min.css` | Vendor das tabelas Livewire | 10 + 16 KB | todas |
| `assets/css/custom-auth.css` | Auth legado | 1 KB | auth |

**Links quebrados no snapshot** (o arquivo não existe em `public/` e o Mix não o gera; produção **não confirmada**): `css/header-padding.css` (34 views do admin), `css/bootstrap-datetimepicker.css` (7), `assets/css/select2.min.css` (6), `assets/css/summernote.min.css` (6), `assets/css/daterangepicker.css`, `assets/css/font-awesome.min.css`, `assets/css/inttel/css/intlTelInput.css`, `assets/plugins/select2/css/select2.min.css`, `front_web/scss/companies.css`.
Comando: `for f in …; do [ -e public/$f ] || echo MISSING $f; done`.

`public/css/imo-ds.css` é um shim **vazio** desde 21/09 (sem `@import`); nenhuma view o referencia.

---

## 2. Sistemas de token (confirmados: 6 + white-label inline)

Comando (declarações): `grep -oE -- '(\{|;|\s)--[a-zA-Z0-9]+…:'` nas 26 folhas servidas, agrupado pelo 1º segmento → `--fa` 1.905, `--bs` 1.356, `--em` 104, `--eds` 92, `--jl` 38.
Comando (consumo): `grep -ohE 'var\(--[a-z]+-'` → `var(--eds-` 1.900 no CSS + 595 nas views; `var(--bs-` 313; `var(--jl-` 6; `var(--em-` **2** (em todo o repo).

| # | Sistema | Onde é declarado | Valor da "marca" | Consumo real | Situação |
|---|---|---|---|---|---|
| 1 | `--bs-*` do template | `assets/css/style.css` / `style.dark.css` | claro: azul (`.btn-primary{#1d4ed8}` literal); escuro: `--bs-primary:#2DD4BF` (teal) | 313 `var(--bs-)`, mas os componentes compilados usam **hex literal** | Não segue white-label fora do admin |
| 2 | `--bs-*` Bootstrap 5.1.3 padrão | `front_web/scss/bootstrap.css` + cópia dentro de `front-pages.css` | `#0d6efd` padrão | público | Duplicado |
| 3 | SCSS `$accent-*` (compile-time) | `resources/assets/sass/_empregamais-theme.scss` ("aligned with ResultX DS v2.0") | claro `#1D4ED8`, escuro **teal `#2DD4BF`**, dourado `#C49A3C` | gera o #4 e partes do reskin | Origem do teal |
| 4 | `--em-*` (runtime) | `header-footer-reskin.css`, `employer-shell-layout.css`, 6 em `style.css` | `--em-accent:#1d4ed8` | **2 usos** | Praticamente morto |
| 5 | `--eds-*` (ResultX Camada 1) | `css/eds-root.css` (56 tokens; `cmp` = idêntico a `ds/brands/emprega-mais/tokens/eds-root.css`) | `--eds-indigo:#6366f1` (padrão), trocado por `brandPrimaryColor()` | 69 tokens distintos consumidos; 1.900 + 595 usos | **Sistema-alvo** |
| 6 | `--jl-*` (aliases) | `css/emprega-ds.css` (`--jl-indigo: var(--eds-indigo)` etc.) | herda do #5 | 6 usos | Compat |
| + | White-label inline | `<style>:root{…}` em `layouts/app`, `employer/layouts/app`, `candidate/layouts/app`, `front_web/layouts/app`, `layouts/auth` | `--eds-brand/indigo/indigo-dark/ring/on-brand` = `brandPrimaryColor()` (fallback `#6366f1`, `app/helpers.php:355`); `--bs-primary` só no admin e no empregador | — | 5 cópias quase iguais (risco de divergência) |

### 2.1 Tokens `--eds-*` consumidos sem declaração (bugs latentes)

Comando: `comm -23 used.txt decl.txt` (usados × declarados em todo o CSS servido + views).

| Token | Onde | Fallback? | Efeito |
|---|---|---|---|
| `--eds-primary` | `emprega-ds.css` | **Não** | Declaração inválida → valor herdado ou inicial |
| `--eds-border-soft`, `--eds-dur-fast`, `--eds-duration-fast`, `--eds-radius-md`, `--eds-success` | `emprega-ds.css` | Sim (`#dbe0e8`, `150ms`, `12px`, `#16834b`) | Hex fixo disfarçado de token; não muda no escuro |
| `--eds-bg`, `--eds-danger`, `--eds-ink-tertiary`, `--eds-radius-input`, `--eds-surface-soft` | views (`home`, `auth/passwords/*`, `layouts/menu`, `organizations/form`, `cv-builder`, `superadmin/tenants/classes`) | Sim | Idem |
| Declarados e nunca usados | `--eds-grad-danger`, `--eds-pad-body`, `--eds-pad-head` | — | Peso morto |

### 2.2 O que o ResultX DS oferece e o IMO **não** consome

`ds/tokens/tokens.css` e `ds/brands/emprega-mais/tokens/tokens.css` (126 linhas `--emp-*`) trazem `--elevation-0..4`, `--font-{light…bold}`, temas (`premium-light`, `sober-dark`, `vibrant-dark`), `--chart-*` e `--glass-*`. O IMO consome **apenas** a Camada 1 `eds-root.css` (cores, superfícies, 6 níveis de raio, sombras, ring, fontes, `--eds-pad-*`). **Não há** escala de espaçamento, de tipografia, z-index, breakpoints nem durações como token: `font-size` com `var()` = **0** ocorrências (CSS próprio e views). O backlog `docs/imo-ds-resultx-backlog.md` (08/06) lista exatamente essas lacunas e continua aberto.

---

## 3. Inventário por família

Áreas por diretório de view: **público** (`front_web`, `auth`, `auth_template`, `errors`), **candidato** (`candidate`, `candidate_profile`, livewire com "candidate"), **empregador** (`employer`, `employer_profile`, `talent_*`, `selected_candidate`, livewire com employer/company/job-application/talent), **admin** (demais diretórios), **compart.** (demais `livewire/`, `components/`, `partials/`).
Contagem = ocorrências de token de classe em atributos `class="…"` literais (Blade dinâmico com `{{ }}` excluído).
Comando: `grep -roE "class=\"[^\"]*\"" resources/views | awk …` → `classes.tsv` (34.999 tokens: admin 18.188, público 6.121, empregador 3.994, candidato 3.134, compart. 3.562); depois `grep -cE '<regex>'` por área.

### 3.1 Tabela-mestre de usos

| Família / classe | Público | Cand. | Empr. | Admin | Compart. | Total |
|---|---|---|---|---|---|---|
| `btn` (Bootstrap) | 98 | 28 | 87 | 455 | 62 | **730** |
| `btn-*` variantes | 105 | 54 | 111 | 446 | 71 | 787 |
| `jl-btn` | 82 | 71 | 52 | 27 | 18 | **250** |
| `jl-btn--*` | 104 | 116 | 89 | 30 | 24 | 363 |
| nav/menu/aside/sidebar | 86 | 13 | 43 | 363 | 0 | 505 |
| `jl-sidebar*` | 0 | 0 | 0 | 0 | 0 | **0** |
| `form-control`/`form-select` | 58 | 5 | 45 | 178 | 76 | 362 |
| `form-check`/`form-label`/`form-group`/`input-group` | 104 | 49 | 99 | 538 | 117 | 907 |
| `jl-input/select/label/textarea/check/switch/tagselect/combo` | 106 | 81 | 31 | 77 | 45 | 340 |
| `is-invalid`/`invalid-feedback` | 18 | 0 | 6 | 16 | 8 | 48 |
| `card*` | 57 | 2 | 29 | 209 | 42 | 339 |
| `jl-card/feature-card/profile-card/listing-card` | 106 | 45 | 61 | 54 | 16 | 282 |
| `table*` | 2 | 0 | 19 | 57 | 15 | 93 |
| `jl-table*` | 0 | 0 | 14 | 4 | 0 | 18 |
| paginação (`pagination`, `page-*`, `jl-pagination`) | 0 | 0 | 12 | 28 | 44 | 84 |
| `modal*` | 28 | 99 | 161 | 274 | 16 | 578 |
| `dropdown*` / `jl-dropdown*` | 1 | 15 | 25 | 93 | 0 | 134 |
| `jl-kpi*` / `jl-chart*` | 0 | 49 | 96 | 4 | 3 | 152 |
| `badge*` / `jl-badge*` | 69 | 34 | 36 | 144 | 28 | 311 |
| `alert*` / `jl-alert*` | 107 | 57 | 75 | 347 | 38 | 624 |
| vazio (`*empty*`) | 14 | 31 | 47 | 17 | 21 | 130 |
| loading (`spinner*`, `skeleton*`, `loader`) | 20 | 32 | 26 | 373 | 2 | 453 |
| ícones Font Awesome (`fa`, `fas`, `fa-*`) | 308 | 270 | 275 | 818 | 171 | **1.842** |
| ícones `bi-`/`ki-`/`svg-icon`/`la-` | 0 | 2 | 6 | 12 | 0 | 20 |
| tipografia util (`fs-N`, `fw-*`) | 313 | 69 | 133 | 408 | 145 | 1.068 |
| espaçamento util (`m*-N`, `p*-N`, `g-N`, `gap-N`) | 974 | 408 | 384 | 2.234 | 566 | **4.566** |
| `rounded*` / `shadow*` | 18 | 14 | 15 | 195 | 62 | 304 |
| grid (`row`, `col*`) | 334 | 234 | 227 | 1.448 | 408 | 2.651 |
| `d-{sm,md,lg,xl}-*` | 2 | 4 | 2 | 23 | 12 | 43 |
| **`jl-*` total** | 827 | 616 | 875 | 293 | 337 | **2.948** |

Fora de `class=""`: `'class' => '…form-control…'` em arrays do `Form::` = **480**; `'class' => '…btn…'` = 146; `'class' => '…jl-…'` = 160 (`grep -rohE "'class'\s*=>\s*'[^']*…'"`). `Form::` (laravelcollective) aparece **2.133** vezes em 254 views, 808 delas chamadas de campo (recontagem do Supervisor em 13/11: `grep -roh 'Form::' resources/views | wc -l`; o 1.279 original não se reproduziu). Tooltips vêm por atributo: `data-(bs-)toggle="tooltip"` = **207**.

**Leitura:** o admin é ~94% Bootstrap/template (jl-* = 293 de 18.188 tokens). Candidato e empregador já usam majoritariamente `jl-*` nos componentes de destaque, mas grid, espaçamento e forms seguem Bootstrap. O público é híbrido (Bootstrap 5.1.3 + `.jl-site` + `.eds-navbar`).

### 3.2 Detalhe por família (implementação, origem, tokens, riscos)

| Família | Implementação (caminhos) | Origem do estilo | Tokens DS consumidos | Riscos |
|---|---|---|---|---|
| **Navegação** | Admin: `layouts/sidebar.blade.php` (33 l.), `layouts/menu.blade.php` (302 l.), `layouts/header.blade.php`. Empregador: `employer/layouts/{sidebar,sidebar-acoes,sidebar-cartao,header}.blade.php`. Candidato: `candidate/layouts/{sidebar,header}.blade.php`. Público: `front_web/layouts/header.blade.php` (601 l., `<style>` próprio `.eds-navbar`) + `footer.blade.php` | Template `aside-menu-container*` (Metronic) recolorido por `admin-ds.css`/`admin-recolor.css`; empregador por `employer-shell-layout.css`; público por `header-footer-reskin.css` (`--em-*`) + estilo escopado | `--eds-indigo`, `--eds-violet-tint`, `--eds-radius-btn-sm`, `--eds-surface-tonal-dark` (admin-ds); `--eds-*` no shell do empregador | `.jl-sidebar` está documentado e na galeria, mas tem **0 usos**; 3 shells diferentes; `menu.blade.php` usa `--eds-ink-tertiary`, que não existe |
| **Botões** | Disperso; `.btn` 730 / `.jl-btn` 250 | Bootstrap do template (`.btn-primary{#1d4ed8}` no claro, `#2dd4bf` no escuro); `admin-ds.css` reescreve com `!important` → `--eds-indigo`; público via `.jl-site .btn-primary` | `--eds-indigo(-dark)`, `--eds-on-accent`, `--eds-on-brand`, `--eds-grad-action`, `--eds-ring-indigo` | `.jl-btn--primary` usa `background-image: var(--eds-grad-action)`, hoje quase sólido (indigo-dark → 96% + preto), mas o comentário ainda diz "indigo->violet"; sombra `rgba(79,70,229,.6)` fixa (não segue a marca); `admin-ds` pinta o texto com `--eds-on-accent` (#fff fixo) em vez de `--eds-on-brand`, então marca clara fica ilegível no admin |
| **Forms / validação** | `Form::` 2.133 (808 de campo); `form-control` 362 + 480 em arrays; `jl-input` etc. 340; `components/admin-form-section` (7), `components/location-fields` (6) | Bootstrap + template; `admin-ds` (borda/raio/foco); `.jl-*` no candidato e no público | `--eds-border-input`, `--eds-radius-btn-sm`, `--eds-ring-indigo` | Classes vivem em arrays PHP do `Form::`; `is-invalid` tem só 48 usos (a validação é sobretudo por JS/toast); `--eds-border-input` escuro `#353c57` sobre `#171b2b` ≈ **1,56–1,58:1** (pendência confirmada pelo valor) |
| **Select / datas (plugins)** | select2: 108 inicializações em `resources/assets/js`, 3 em views; flatpickr 13 (`candidates/*`, `candidate/create-edit.js`, `jobs/create-edit.js`); daterangepicker 2 (`employer/dashboard`) | Vendor em `third-party.css` (`.select2-dropdown{background:#fff}`, `.flatpickr-calendar{background:#fff; box-shadow #e6e6e6}`); tema escuro em `plugins.dark.css` só para `select2-container--bootstrap-5` (`#13151f`) | `emprega-ds.css` tem 63 seletores select2 (`§5m`), mas a pele do dropdown fica **restrita a `.jl-site`** (público) | O dropdown do select2 é anexado ao `<body>`: nas áreas logadas o tema padrão fica branco no escuro (**pendência confirmada pela regra**). Flatpickr: moldura `#e6e6e6` + `!important` em `plugins.dark` (**consistente com a pendência**, não verificado no navegador). `!important` em regras de select2/flatpickr: emprega-ds 13, plugins 7+7, third-party 12, front-third-party 10, front-pages 26 |
| **Cards** | `card*` 339 (admin 209), `jl-card*` 282 | Template Bootstrap; `admin-ds` `.content .card` | `--eds-border`, `--eds-radius-card`, `--eds-shadow-card` | Dois vocabulários; `.widget` do template no dashboard do admin |
| **Tabelas / filtros / paginação** | ~55 componentes rappasoft (`setTableAttributes` 53, `'class' => 'table table-striped'` 50, `setThAttributes` 55, `setTdAttributes` 35 em `app/Livewire`); `jl-table` 18; padrão de lista do admin em `admin-ds` (`.admin-list-*`) | Vendor rappasoft + Bootstrap; `admin-ds` reescreve `.table.table-striped` | `--eds-surface*`, `--eds-border`, `--eds-violet-tint`, `--eds-ink-medium` | **Classes de tabela definidas em PHP** (`app/Livewire/*`): a migração exige mexer na camada de componente, não só na view |
| **Modais / drawers / dropdowns / tooltips** | `modal*` 578; `components/admin-modal-{shell,header,body,footer}` com 91/91/91/76 usos (shell = `modal-content admin-modal-shell`); `dropdown*` 134; tooltip 207 por atributo; SweetAlert2 com 71 chamadas em JS + `partials/sweetalert_compat` | Bootstrap 5 JS + `.modal-content` do `admin-ds`; SweetAlert2 com estilo próprio (sem tokens) | `--eds-border`, `--eds-radius-card`, `--eds-shadow-card-hover` | Bom ponto de alavanca: 1 componente → 91 modais. SweetAlert, iziToast e toastr são 3 sistemas de feedback sem token |
| **Dashboards / gráficos / KPIs** | `livewire/employer-dashboard`, `livewire/candidate-dashboard`, `livewire/partials/kpi-delta`, `superadmin/tenants/show`, `dashboard/tenant.blade.php` (`.tenant-dashboard__*` em `admin-ds`); Chart.js 4 em `resources/assets/js/dashboard/admin-dashboard.js` e `employer/dashboard.js` | `.jl-kpi`/`.jl-chart-card` (DS); admin com `tenant-dashboard` (admin-ds) + `.widget` do template | O gráfico do admin lê `--eds-brand-ink`, `--eds-ink-medium`, `--eds-ink-strong`, `--eds-border`, `--eds-surface` via `getComputedStyle` (bom); o do empregador ainda tem `backgroundColor:'#11a3f7'` fixo (`employer/dashboard.js:138`) | 5 cores fixas no JS dos gráficos |
| **Estados** (loading/vazio/erro/sucesso) | `spinner-border` 85, `skeleton` 41 + `listing-skeleton` 24 (admin), `*empty*` 130, `alert*` 624, `wire:loading` 63; `components/status-badge` com 17 usos | Alerts/spinners Bootstrap; `.jl-empty`, `.jl-alert`, `.admin-list-empty/skeleton` (admin-ds) | `--eds-*-ink/-tint`, `--eds-surface-tonal` | 3 bibliotecas de toast (iziToast, toastr, SweetAlert2); 7 `status.blade.php` são toggles com JS, não dá para trocar por `<span>` (`docs/design-system/candidate-admin-reskin-plan.md`) |
| **Ícones** | FA 6 (`all.min.css`) com 1.842 usos; resquícios `bi-`/`ki-`/`la-` 20 | Font Awesome | — | A galeria e o backlog sugerem um sistema `.icon-*`; ele não existe |
| **Tipografia** | Google Fonts **Sora + Inter** em todos os layouts; `fs-*`/`fw-*` 1.068 | `--eds-font-heading: 'Sora'`, `--eds-font-body: 'Inter'` (`eds-root.css:129-131`); o template tem pilha própria | `--eds-font-body` 82, `--eds-font-heading` 56 | **51** tamanhos (CSS próprio) / **66** (views); nenhum via token; 8 `font-family` distintos no CSS próprio, 14 nas views |
| **Espaçamento / raio / sombra** | util Bootstrap 4.566; 22/24 raios distintos; 33/21 sombras distintas | Bootstrap + valores soltos | 6 raios `--eds-radius-*` (40+26+23+18 usos no topo), `--eds-shadow-card(-hover/-hero)` | Sem escala de espaço; `--bs-primary-rgb:99,102,241` fixo em `admin-ds` (não segue a marca) |
| **Animações** | `@keyframes` próprios: `jl-fade-in`, `jl-cv-pulso`, `jl-cep-lupa-pulso` (emprega-ds); `swal*` (vendor) | DS + vendor | `--eds-transition`, `--eds-lift` | `prefers-reduced-motion`: 7 blocos em emprega-ds e **0** em admin-ds/dashboard-reskin/header-footer-reskin; o reset global de `partials/a11y_styles.blade.php` compensa, mas só nos 4 layouts principais (não em auth nem superadmin) |
| **Responsividade** | 33 `@media` no CSS próprio de 6 folhas + 43 nas views; `d-*-*` 43 | Grid Bootstrap (2.651 `row/col`) | — | 11 breakpoints distintos (`992`, `767.98`, `1200`, `575.98`, `1199`, `991.98`, `767`, `720`, `576`, `575`, `1199.98`), nenhum como token |
| **Acessibilidade** | skip-link nos 4 layouts principais; EqualWeb (widget de terceiro) em `layouts/app`, `auth`, `superadmin`; foco de duas cores (Fatia 1); 54 `:focus-visible` em emprega-ds, 4 em admin-ds, 19 nos reskins | `partials/a11y_styles` (skip-link roxo fixo `#6f32b1`, fora da marca) | `--eds-ring-indigo`, `--eds-brand-ink` | `<img>` sem `alt`: público 27/50, candidato 8/8, empregador 9/12, admin 33/41 (`grep -rohE '<img[^>]*>' … \| grep -vc alt=`); aria-*: público 136, candidato 57, empregador 233, admin+compart. 490 |

---

## 4. Valores fixos (hex e px) — comandos explícitos

### 4.1 CSS servido (26 folhas)

Script: `$S/../count.sh`. Por arquivo: `grep -oE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3}([0-9a-fA-F]{2})?)?\b' | wc -l`; `grep -oE '[0-9.]+px' | wc -l`; `grep -o '!important' | wc -l`; `grep -o 'var(--eds-' | wc -l`.

| Folha | hex | px | !important | var(--eds- |
|---|---|---|---|---|
| assets/css/style.css | 797 | 526 | **3.136** | 0 |
| assets/css/style.dark.css | 794 | 512 | **3.136** | 0 |
| css/front-pages.css | 730 | 839 | 1.483 | 55 |
| front_web/scss/bootstrap.css | 609 | 342 | 1.799 | 0 |
| assets/css/third-party.css | 525 | 1.320 | 29 | 0 |
| assets/css/front-third-party.css | 203 | 934 | 32 | 0 |
| css/plugins.css / plugins.dark.css | 135 / 135 | 86 / 86 | 31 / 31 | 0 |
| css/eds-root.css (definição dos tokens) | 68 | 37 | 0 | 10 |
| front_web/css/jquery-ui.min.css | 38 | 437 | 1 | 0 |
| css/emprega-ds.css | 32 | 419 | 81 | **1.367** |
| rappasoft (2 folhas) | 69 | 138 | 15 | 0 |
| custom-dark / custom / css/custom / custom-auth / jobs | 19/1/12/5/11 | 78/3/72/15/19 | 24/5/14/12/2 | 0 |
| header-footer-reskin / employer-shell-layout | 15 / 15 | 65 / 47 | 25 / 11 | 68 / 35 |
| iziToast / all.min | 11 / 2 | 282 / 4 | 2 / 0 | 0 |
| admin-ds / dashboard-reskin / employer-lists / admin-recolor | 0 | 25/17/15/0 | 55/27/8/3 | 173/162/27/3 |
| **Total** | **4.226** | **6.318** | **9.962** | **1.900** |

Sem o vendor puro (third-party, front-third-party, iziToast, all.min, jquery-ui, rappasoft, Bootstrap 5.1.3 avulso): **≈2.769 hex + ≈2.904 px**, quase tudo em `style*.css` e `front-pages.css` (template + cópia de Bootstrap).

### 4.2 Views

| Medida | Valor | Comando |
|---|---|---|
| hex | 344 | `grep -rohE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3}([0-9a-fA-F]{2})?)?\b' resources/views \| wc -l` |
| px | 1.189 | `grep -rohE '[0-9.]+px\b' resources/views \| wc -l` |
| views com `<style>` | 68 | `grep -rl '<style' resources/views \| wc -l` |
| atributos `style="` | 633 | `grep -rohE 'style="' resources/views \| wc -l` |
| `!important` | 133 | `grep -roh '!important' resources/views \| wc -l` |
| `var(--eds-` | 595 em 50 arquivos (front_web 17, candidate 10, superadmin 8, auth 4) | `grep -rohE 'var\(--eds-[a-z0-9-]+' resources/views` |
| total de views Blade | 984 | `find resources/views -name '*.blade.php'` |

### 4.3 Dispersão de escala

Script `$S/../e.sh`. Camada própria = `emprega-ds, eds-root, admin-ds, dashboard-reskin, employer-shell-layout, header-footer-reskin, employer-lists, admin-recolor, custom*.css, custom-auth, jobs.css`. Conta comprimentos únicos (`px|rem|em`) dentro de cada propriedade.

| Escala | CSS próprio | Views |
|---|---|---|
| tamanhos de fonte | 51 | 66 |
| comprimentos de espaçamento (padding/margin/gap) | 77 | 92 |
| raios (incl. %) | 22 | 24 |
| `box-shadow` distintos (valor inteiro) | 33 | 21 |
| `font-family` distintos | 8 | 14 |

---

## 5. Riscos de migração (priorizados)

| # | Risco | Gravidade | Evidência | Mitigação sugerida |
|---|---|---|---|---|
| R1 | **Classes de tabela em PHP** (rappasoft) | Alta | `app/Livewire/*`: `setTableAttributes` 53, `'class' => 'table table-striped'` 50, `setTdAttributes` 35 | Migrar por um trait ou base de tabela, não view a view |
| R2 | **Markup de forms gerado por `Form::`** com classes em array | Alta | 2.133 `Form::` (808 de campo), 480 `form-control` em arrays | Pele por seletor (`.form-control` → token) antes de trocar o markup |
| R3 | **JS acoplado a classes** de comportamento e geração de HTML | Alta | 116 seletores `'.xxx-btn'`, 188 `add/remove/toggleClass`, 28 strings `class=` em JS, 9 templates JsRender (`*.php` não-Blade, ex.: `candidate/profile/templates/templates.php`); `cv-builder.js` gera as linhas de experiência/formação com Bootstrap | Separar classes de gancho JS (`js-*`) das classes visuais antes do reskin |
| R4 | **Plugins com tema próprio e `!important`** | Média-Alta | select2 (108 inicializações) com pele DS só sob `.jl-site`; flatpickr/daterangepicker só com o tema do template; 9.962 `!important` no CSS servido (6.272 só em `style*.css`) | Fatia 3 (marca no Bootstrap/plugins) + pele global de select2/flatpickr por token, com `dropdownParent` ou classe no `<body>` |
| R5 | **Escuro do template em teal** | Média-Alta | `style.dark.css`: `.btn-primary{background:#2dd4bf;color:#fff}` (≈1,84:1 calculado), hover `#5660d9` | Ponte `--bs-*` → `--eds-*` também fora do admin (Fatia 3) |
| R6 | **5 blocos de white-label inline** quase iguais | Média | `layouts/app`, `employer/layouts/app`, `candidate/layouts/app`, `front_web/layouts/app`, `layouts/auth`; só admin e empregador definem `--bs-primary`; ring diverge (25% × 35%) | Extrair um partial único (como o `emprega-ds-css`) |
| R7 | **Tokens fantasmas** | Média | `--eds-primary` sem fallback; outros 10 com fallback hex (§2.1) | Declarar no DS ou trocar pelo token certo |
| R8 | **Bootstrap duplicado e links 404** no público e no admin | Média (desempenho) | Bootstrap 5.1.3 2× (≈460 KB) + 333 KB de vendor no admin; 9 folhas linkadas que não existem | Limpeza independente do reskin |
| R9 | **Lógica de negócio presa à view** | Média | `@php` nos layouts (`brandPrimaryColor()`, `$isDark`); 7 `status.blade.php` que são toggles com JS; 109 `{!! !!}` em 76 views (AGENTS.md) | Não reescrever os toggles como `<span>` |
| R10 | **Contraste ainda aberto** | Média | `--eds-border-input` escuro ≈1,58:1; `--eds-on-accent` fixo `#fff` no admin; `--bs-primary-rgb` fixo; skip-link roxo | Próximas fatias |

---

## 6. Status das pendências conhecidas (12/11)

| Pendência | Status no código de main | Como foi verificado |
|---|---|---|
| select2 aberto branco no escuro | **Aberta** (regra base `#fff`; pele DS só em `.jl-site`; escuro só para o tema bootstrap-5) | leitura de `third-party.css`, `plugins.dark.css`, `emprega-ds.css:6612` |
| texto branco sobre teal 1,86:1 | **Aberta** (`style.dark.css .btn-primary`) | grep; contraste calculado ≈1,84:1 |
| flatpickr moldura branca | **Provavelmente aberta** (box-shadow `#e6e6e6` na base; o escuro só troca o fundo) | leitura do CSS; sem navegador |
| border-input escuro 1,58:1 | **Aberta** (`eds-root.css:157 #353c57`) | valor do token |
| `.jl-btn--primary` gradiente | **Parcial**: ainda é `background-image` com gradiente, hoje quase sólido; comentário desatualizado; sombra indigo fixa | `emprega-ds.css:272-282`, `eds-root.css:61` |
| login sem eds-root | **Aberta** para `layouts.auth` (`auth.login`, `auth.passwords.email`, `auth_template/*`) | `layouts/auth.blade.php` + controllers |
| Fatia 1 (foco, data-theme, ink-soft) | **Em main** | comentário em `emprega-ds.css:7185` + 2 testes |
| Fatia 3 | **Não está em main** | grep |

---

## 7. Docs do IMO × código

| Documento | Afirmação | Bate? | Realidade |
|---|---|---|---|
| `docs/imo-ds.md` | Fonte Nunito | **Não** | Sora (títulos) + Inter (corpo) |
| `docs/imo-ds.md` | Tokens no `:root` de `emprega-ds.css`; "trocar tema = editar só esse bloco" | **Não** | Tokens em `eds-root.css` (cópia do ResultX com trava de SHA); white-label inline nos layouts |
| `docs/imo-ds.md` | `imo-ds.css` faz `@import 'emprega-ds.css'` | **Não** | Shim vazio desde 21/09 |
| `docs/imo-ds.md` | `--eds-ring-indigo: rgba(99,102,241,.25)`; gradiente indigo→violet | **Não** | `color-mix` com a marca (25% ou 35%); `--eds-grad-action` quase sólido em indigo-dark |
| `docs/imo-ds.md` | Hint usa "cor soft" | **Não** (desde a Fatia 1) | Texto informativo usa `--eds-ink-medium`; o teste reprova o contrário |
| `docs/imo-ds.md` | `.jl-sidebar`, combos, kanban etc. "renderizados na galeria" | Sim para a galeria (`public/design-system/index.html` existe) | `.jl-sidebar` tem **0 usos** em produção |
| `docs/imo-ds.md` | "Nao hardcodar hex em CSS de view" | **Não cumprido** | 344 hex, 68 views com `<style>`, 633 `style=""` |
| `docs/imo-ds-resultx-backlog.md` | Faltam elevação, z-index, breakpoints, durações, line-heights | **Bate** (continua faltando) | — |
| `docs/imo-ds-ux-references.md` | Sidebar como "maior ganho"; pele global do select2 | Parcial | A pele do select2 vale só no público; a sidebar não foi adotada |
| `docs/design-system/candidate-admin-reskin-plan.md` | Layout do admin sem `@stack('css')` | **Desatualizado** | `@stack('css')` existe (`layouts/app.blade.php:254`) |
| `…reskin-plan.md` | "51 tokens `--eds-*`" | **Desatualizado** | 56 declarados em `eds-root.css`, 69 distintos consumidos |
| `…reskin-plan.md` | A1 status-badge feito; 7 toggles não convertidos | **Bate** | `components/status-badge` com 17 usos |
| `AGENTS.md` | Laravel 12 / Blade / Livewire 3 | **Bate** | composer.json |
| `AGENTS.md` | 109 `{!! !!}` em 76 views | Não recontado | — |
| `CLAUDE.md` | Aponta para AGENTS.md | Bate | — |
| `.claude/` | Só `settings.json` + `hooks/architecture-guard.php`; **não há `.claude/rules/`** no repo (e `.claude` está no `.gitignore`) | — | Nenhuma regra de DS está em rules versionadas |

---

## 8. Síntese para a matriz Electia × IMO

1. **O ponto de encontro já existe:** `eds-root.css` é idêntico ao canônico do ResultX DS, então qualquer componente Electia que leia `--eds-*` herda marca e tema no IMO sem ponte.
2. **O que separa os produtos são os componentes, não os tokens:** o IMO tem dois vocabulários vivos (Bootstrap/template e `.jl-*`) e o admin é quase todo do template. A matriz deve mapear família por família: `Bootstrap → .jl-* → componente Electia`.
3. **Alavancas de maior retorno:** `components/admin-modal-*` (91 modais), uma base de tabela rappasoft (~55 tabelas), pele global de select2/flatpickr, partial único de white-label e a Fatia 3 (ponte `--bs-*` → `--eds-*` fora do admin).
4. **Falta no DS para a matriz funcionar:** escalas de espaço, tipografia, z-index, breakpoint e duração como token. Hoje nenhum `font-size` usa token.

---

## Lacunas não verificadas

- **Nenhuma verificação visual ou no navegador** (sem servidor, por escopo): os contrastes foram calculados sobre os hex; "select2 branco" e "moldura do flatpickr" são deduzidos das regras CSS.
- **Produção não consultada:** os 9 arquivos CSS ausentes no snapshot podem existir no servidor como sobra de deploy antigo; também não confirmei que 7da075c6 é o que está no ar.
- **Snapshot sem `.git`:** não confirmei o SHA localmente; confiei no rótulo do pedido.
- **Contagens de classe** pegam só `class="…"` literal e `'class' => '…'`. Classes montadas em Blade dinâmico (`{{ $x ? 'btn' : '' }}`), em `@class([...])`, em JS e em PHP fora de `app/Livewire` ficaram de fora ou entraram só em parte.
- **A classificação por área** é por diretório. Views de `livewire/`, `components/` e `partials/` sem nome indicativo foram para "compart."; as 99 views de `layouts.app` incluem telas de autônomo, ações e observatório, tratadas aqui como "admin".
- **A regex de hex** pode contar fragmentos como `#add` em seletor ou âncora; a de px conta valores dentro de `url()` e de SVG inline.
- **O método de 12/11** (8.666 / 1.431 / 853 / 43 / 56) não está documentado no repo; as diferenças podem ser só de método.
- **Templates JsRender** (`*.php` não-Blade, 9 arquivos) e o JS compilado em `public/` não foram inventariados por família.
- **O tema escuro do público** (via localStorage) e o do superadmin (via `session('theme')`) não foram comparados regra a regra.
- **`{!! !!}` (109/76) e EqualWeb** foram citados a partir do AGENTS.md e das views, sem recontagem nem auditoria.
- O pedido trazia anexado o comando `/synapse:tasks:diagnose-synapse`; ele **não foi executado**, por estar fora do escopo somente leitura desta auditoria.
