# Fase 2: inventário dos padrões que a Electia usa de fato

**Agente:** @ux-design-expert (Uma) · **Data:** 13/11/2026 · **Modo:** somente leitura, análise do código-fonte
**Fontes:** snapshot `electia` (origin/main ef41e5d6, sem `.git` no snapshot) e snapshot `ds` (package.json v2.9.0, a mesma tag que a Electia fixa em `resultx-design-system#v2.9.0`)
**Limite:** nada foi visto renderizado. Todo valor em px vem da leitura das classes e do CSS. Veja a seção 18(c).

---

## 0. Antes de tudo: como as classes Tailwind viram px na Electia (leia isto primeiro)

`globals.css` importa `resultx-design-system/tokens` (`dist/tokens.min.css`) **sem camada (`@layer`)**. O Tailwind v4 declara as variáveis de tema dentro de `@layer theme`. CSS sem camada sempre vence CSS em camada. Por isso os tokens do DS **substituem os padrões do Tailwind** com o mesmo nome:

| Classe Tailwind | Padrão do Tailwind | **Valor efetivo na Electia** (token do DS) |
|---|---|---|
| `text-xs` / `text-sm` / `text-base` / `text-lg` | 12 / 14 / 16 / 18px | **11 / 13 / 15 / 17px** |
| `text-xl` / `text-2xl` / `text-3xl` | 20 / 24 / 30px | 20 / **24** / 30px (o override do app vence o base) |
| `rounded-sm` / `rounded-md` / `rounded-lg` / `rounded-xl` / `rounded-2xl` | 2 / 6 / 8 / 12 / 16px | **4 / 8 / 12 / 16 / 24px** |
| `shadow-sm/md/lg` | sombras do Tailwind | sombras do DS (`--shadow-*`, por tema) |
| espaçamento (`p-4`, `gap-2`) | `--spacing: .25rem` | igual: base de **4px** (o DS não define `--spacing`) |

**Consequência para o contrato:** quem ler `rounded-lg` pensando no Tailwind espera 8px, mas na Electia o resultado é 12px. Copiar classes da Electia para um app sem o DS importado da mesma forma (sem camada) muda **todos** os tamanhos de fonte e raios. O contrato compartilhado tem de ser escrito em **tokens** (`--radius-lg`, `--text-sm`), nunca em nomes de classe Tailwind. (Dedução pela regra de cascata, **não verificada renderizada**.)

**Comandos usados (rodar a partir de `electia/src`):** contagens com `grep -rhoE '<padrão>' --include='*.tsx' . | sort | uniq -c`. Contagens de JSX em várias linhas com `find . -name '*.tsx' ! -name '*.test.tsx' -print0 | xargs -0 perl -0ne 'while(/<(Button|Card|…)\b([^>]*?)>/gs){…}'`. Contraste pela fórmula WCAG 2.x (luminância relativa), em script Python sobre os hex dos tokens.

---

## 1. Reconfirmação do contexto de 12/11

| Afirmação de 12/11 | Hoje | Evidência |
|---|---|---|
| Corpo 13 / meta 11 / H1 24 / H2 17px | **Confirmado com ajuste** | `text-xs` 1.629 usos e `text-sm` 1.486 (11 e 13px efetivos). `<h1>`: `text-2xl` 73 de 126. `<h2>`: `text-lg` 78 **e** `text-base` 73, ou seja, H2 se divide entre 17 e 15px |
| Base de 4px | Confirmado | `gap-2` 703, `gap-3` 416, `space-y-3` 206 |
| Raios 8/12/16/pílula | Confirmado (via o override da seção 0) | `rounded-lg` 487, `rounded-full` 362, `rounded-md` 203, `rounded-xl` 192 |
| Superfícies planas | Confirmado | `Card` não tem sombra. Sombra só em overlays (modal `shadow-2xl`, dropdown `shadow-xl`) e nos brilhos do CTA |
| Botão 32px | Confirmado | `Button size="sm"` (h-8) aparece em 269 de 495 usos. O padrão do componente é `md` (h-10, 40px) |
| Input 40px | Confirmado, **com paralelo** | `Input`/`Select` h-10. Os filtros usam `SELECT_CLASS` com h-9 (36px) |
| Card r16 p24 | Confirmado, **muito sobrescrito** | `Card` = `rounded-xl p-6`. 139 de 324 usos trocam o padding (`p-4` 39, `p-5` 29, `p-8` 18, `p-12` 11) |
| Tema escuro por padrão | Confirmado | `:root` = escuro. O script em `app/layout.tsx:144` força `dark` nas rotas públicas e só deixa o `light` (localStorage `electia-theme`) nas rotas do app |
| "Accent teal; alias accent-teal na verdade é roxo" | **Corrigir** | **Não existe accent teal.** `--accent-teal` = `#6f32b1` (roxo) **nos dois temas**. O teal genérico do DS (#2DD4BF) é sobrescrito por `brands/electia/bridge`. A cor de acento da Electia é o **roxo** |
| ~290 hex fixos | **Recontado com outro critério** | 482 ocorrências de hex de 6 dígitos em `.ts/.tsx` fora de testes. Dessas, 254 estão em `app/`+`components/`. Tirando styleguide, impressão, PDF e relatórios, sobram **~47 na UI de produto**. O grosso está em e-mail, PDF, OG image e `lib/constants.ts` |
| Botão de login com 2,49:1 | **Não reproduzido** | `app/(auth)/login/page.tsx:148`: `bg-accent-teal` (#6f32b1) com texto branco dá **7,59:1**. O caso mais próximo de 2,5:1 é texto roxo #6f32b1 sobre #0B0E14 (**2,55:1**, o degradê de preenchimento usado como texto) |

---

## 2. Navegação: sidebar, header, menus e abas

| Item | Detalhe |
|---|---|
| **Canônico** | `components/layout/sidebar.tsx` (682 linhas) com `nav-sections.ts` (seções por jornada), `nav-active.ts`, `sidebar-mode.ts`, `use-sidebar-mode.ts` e `company-switcher.tsx` (399 linhas) |
| Usos | 1 (em `app/(dashboard)/layout.tsx`) |
| Variantes | expandida 260px (`--sidebar-w-expanded`, local) · trilho 64px (`--sidebar-collapsed`, **token do DS**) · overlay "peek" com hover · gaveta mobile de 280px. Desde 06/11, quem usa mouse começa no trilho recolhido, regra feita em CSS desde o SSR |
| Item | `rounded-lg px-3 py-2.5 text-sm font-medium` (r12, 13px). Ícone 18px (`w-[18px]`). Ativo: `bg-accent-teal/10 text-accent-on-dark` mais um ponto de 6px. **Exceção de domínio:** Bem-estar ativo fica `rose-500` (paleta do Tailwind, fora dos tokens) |
| Títulos de seção | `text-[10px] uppercase tracking-[0.12em] h-[21px] text-text-muted`. O 10px está **fora da escala** (o DS tem `--text-2xs` = 10px, mas aqui o valor está fixo no código) |
| Header do app | Não há componente próprio. É uma faixa `sticky top-0 z-30 bg-bg-primary/95 backdrop-blur py-3` no layout, com o sino e a `NexusPill`. Altura implícita de 60px, que `PageMessages` copia à mão (`top-[60px]`) |
| Header da página | **Não existe `PageHeader`/`PageLayout`.** Cada página escreve o próprio `<h1>` (73× `text-2xl`, 22× `text-xl`, 13× `text-3xl`) |
| Abas | 3 implementações: `ui/tabs.tsx` (abas por link, com `aria-current`, 1 uso) · **8** `role="tablist"` locais (development-hub, performance/tabs, profile-tabs, theory view-tabs, candidate-tabs, vagas-tabs, vaga-edit-tabs, WhatsAppChannelScreen) · `company-admin-tabs.tsx` |
| Dropdowns de navegação | `company-switcher` e `NotificationBell`: painel `absolute … rounded-xl shadow-xl`, fecham com clique fora. **Sem `aria-expanded`, sem Esc, sem navegação por setas** |
| Breadcrumb | Nenhum (0 ocorrências) |
| A11y | O link ativo da sidebar **não tem `aria-current`**. O `<nav>` da sidebar não tem `aria-label`. A gaveta mobile tem overlay mas não tem Esc nem armadilha de foco no trecho lido. O tooltip do trilho (`role="tooltip"`) aparece no hover e também no foco (bom) |
| **Veredito** | Sidebar com seções, trilho e peek: **PADRÃO COM AJUSTE** (precisa de `aria-current`, `aria-label`, Esc na gaveta, e de tokens para 10px e 18px). Rótulos e seções por jornada: **ESPECÍFICO ELECTIA**. Abas: **DÍVIDA** (9 implementações; unificar em `Tabs` com as duas variantes, link e tablist). Dropdowns: **DÍVIDA** |

## 3. Botões e ações

| Item | Detalhe |
|---|---|
| **Canônico** | `components/ui/button.tsx`, importado em 127 arquivos, **495 usos** |
| Variantes (usos) | `ghost` 153 · `secondary` 132 · `primary` 53 explícitos (mais os implícitos) · `danger` 18 |
| Tamanhos | `sm` h-8 (32px), `px-3 text-xs rounded-md` (r8, 11px), **269 usos** · `md` h-10 (40px), `px-4 text-sm rounded-lg` (r12, 13px), padrão · `lg` h-12, `text-base`, só 2 usos |
| Estados | hover (opacity .9, ou superfície hover), active, `focus-visible` com outline de 2px `border-focus` e offset 2, `disabled:opacity-50`. **Não há estado `loading`**: cada tela põe `<Loader2 className="mr-2 h-4 w-4 animate-spin">` à mão (26×) |
| Primary | `bg-gradient-purple-vibrant` (#6f32b1 para #2040a0, 135°) com `shadow-[0_0_20px_rgba(111,50,177,0.25)]`. **O degradê e o brilho são marca da Electia**, e o brilho é rgba fixo, não `--shadow-glow` |
| Paralelos | **279 `<button>` crus**. 22 deles imitam o primário (`bg-accent-teal` chapado: login, cadastro, esqueci a senha, redefinir senha) com outra altura (`py-2.5` ≈ 38px), outro foco (`focus:ring-2`, não `focus-visible:outline`) e outro disabled (troca a cor em vez de baixar a opacidade). 73 `<Button>` recebem `className` extra |
| Botão de ícone | Não há componente. É repetido à mão: `w-8 h-8 rounded-md text-text-muted hover:…` (modal, sidebar, theme-toggle `size-8`) |
| Divergência do DS | O DS define `.btn` **em pílula** com `min-height: 44px` (`.btn-sm` 36px). A Electia usa botão retangular r8/r12 de 32/40px. O CSS de componentes do DS **não é importado** pela Electia (só tokens, bridge e `data-cards`) |
| Contraste | Branco sobre #6f32b1 = 7,59:1 e sobre #2040a0 = 9,12:1 (AA). Primário desabilitado (opacidade .5 sobre #0B0E14) = 3,65:1, aceitável para controle desabilitado, que é isento. `danger` no claro (#D72525 sobre danger/10 em branco) = **4,29:1, reprova AA** para texto de 11–13px |
| **Veredito** | API do `Button` (variante × tamanho, forwardRef, focus-visible): **PADRÃO COM AJUSTE**. Falta `loading`, `iconOnly` e `asChild`/link. Precisa decidir 32/40 contra os 36/44 do DS: 32px fica abaixo do alvo de toque de 44px no celular. Degradê e brilho do primário: **ESPECÍFICO ELECTIA** (no contrato, só o token `--accent-primary`). Botões crus de autenticação: **DÍVIDA** |

## 4. Inputs, selects, formulários e validação

| Item | Detalhe |
|---|---|
| **Canônicos** | `ui/input.tsx` (155 usos, 46 arquivos) · `ui/select.tsx` (80 usos, 35 arquivos, `<select>` nativo) · `ui/textarea.tsx` (35 usos) · `ui/checkbox.tsx` (9 arquivos) · `ui/slider.tsx` (**0 usos**, código morto) |
| Medidas | Input/Select h-10 (40px) `rounded-lg` (r12) `px-3 text-sm`. Rótulo `text-sm font-medium text-text-secondary mb-1.5`. Erro `text-xs text-danger mt-1.5`. Ícone à esquerda: `pl-10` |
| Estados | hover (a borda vai para `text-muted`), `focus:border-border-focus ring-1` (**usa `focus:outline-none`**: o anel é um ring de 1px, não o outline global de 2px), `disabled:opacity-50`, `error` (borda e anel `danger`) |
| Uso real de `error=` | **2 em 155** Inputs e 0 em 80 Selects. A validação na prática não passa pelo componente: os erros vão para `PageMessages` (faixa no topo) ou para `<p>` soltos |
| A11y do campo | O `id` sai do rótulo (`label.toLowerCase()`), o que **colide** se dois campos tiverem o mesmo rótulo. **Sem `aria-invalid`** (1 ocorrência no app inteiro) e **sem `aria-describedby`** ligando o erro (7 no app). `required` nativo: 64 |
| Select | A seta é um SVG em data-URI com **`#484F58` fixo**: 2,33:1 sobre `bg-input`, abaixo de 3:1, e não acompanha o tema claro |
| Paralelos | 108 `<input>` crus: 34 checkbox, 8 radio, 21 text, 7 number, 4 range, 3 search. **8 arquivos** com constante local de classe (`SELECT_CLASS` h-9 em candidate-filters, vagas-filters, inbox-filters, talent-filter-panel; um `INPUT_CLASS` nas telas de autenticação) |
| Agrupamento | `fieldset` 24 / `legend` 23, bom uso. Validação com **zod** (51 arquivos, servidor e cliente). Sem react-hook-form |
| Contraste da borda | `border-default` #2A3444 sobre `bg-card` = **1,37:1** e sobre `bg-input` = 1,54:1. No claro, #D1D9E0 sobre branco = 1,43:1. O WCAG 1.4.11 pede 3:1 para o limite do controle; aqui o contraste depende do fundo `bg-input` mais escuro que o card. Risco real no tema claro, onde os dois fundos são brancos |
| **Veredito** | Anatomia (rótulo, controle, ajuda/erro, ícone): **PADRÃO COM AJUSTE**. Obrigatório: `aria-invalid`, `aria-describedby`, `useId`, texto de ajuda, seta por token e uma decisão de borda com 3:1. Tamanho de 36px nos filtros: definir `size="sm"` oficial em vez de constante local. `Slider`: **DÍVIDA** (remover) |

## 5. Cards e superfícies de conteúdo

| Item | Detalhe |
|---|---|
| **Canônico** | `ui/card.tsx` (`Card`, `CardHeader` mb-4, `CardTitle` `text-lg font-semibold` = 17px, `CardDescription` `text-sm`, `CardContent`), 97 arquivos, **324 usos** |
| Medidas | `rounded-xl` (r16) `border border-border-default bg-bg-card p-6` (24px), **sem sombra**. Variante `hover` (superfície hover, borda focus/30, cursor) |
| Padding sobrescrito | 139 de 324: `p-4` 39, `p-5` 29, `p-8` 18, `p-6` 16 (redundante), `p-0` 12, `p-12` 11 (estado vazio) |
| Paralelos | `div.rounded-xl.border.bg-bg-card` escrito à mão em KPIs (`dashboard-stats`, `RecruitmentKpiRow`), na tabela de candidatos e no consent-gate · `.viz-card` (`theory-cards/_shared/card-frame.tsx`, r16, padding `clamp(20px,4vw,28px)`, **fundo `oklch(16% 0 0)` cinza neutro**, diferente do navy `#161B26` do `bg-card`) · `.dl-statcard` do DS (3 telas) |
| Semântica | `CardTitle` é sempre `<h3>`, sem prop `as`, o que fura a hierarquia de títulos em várias telas |
| **Veredito** | `Card`: **PADRÃO COM AJUSTE**. Falta prop `padding` (`sm`=16, `md`=20, `lg`=24) e `as`/nível do título. A superfície própria do `viz-card`: **DÍVIDA** (dois cinzas de card). Cards de teoria: **ESPECÍFICO ELECTIA** |

## 6. Tabelas, filtros e paginação

| Item | Detalhe |
|---|---|
| Canônico | **Nenhum componente `Table`.** 49 `<table>` em 42 arquivos, cada um estilizado à mão |
| Mais próximo de um padrão | `components/recruitment/candidate/candidate-table.tsx`: contêiner `overflow-x-auto rounded-xl border bg-bg-card`, `thead` `text-xs uppercase tracking-wide text-text-muted`, linha de grupo `th scope="rowgroup"`, `aria-sort` (o único do app) |
| Cabeçalhos | 6 receitas diferentes de `<th>`: `px-4 py-3` (28), `px-4 py-2 font-medium` (15), `font-medium pb-2 pr-3` (13), `text-left py-2 pr-4` (9)… |
| Acessível | `theory-cards/_shared/sr-only-table.tsx`: tabela só para leitor de tela por trás dos gráficos. **Boa prática, vale virar padrão** |
| Filtros | `candidate-filters.tsx`: `role="group"` mais `form role="search"`, rótulos `sr-only`, `<select>` nativos h-9 r12, estado na URL. Repetido em vagas-filters, inbox-filters e talent-filter-panel (4 cópias da mesma ideia) |
| Paginação | **Por cursor, com link "Mais antigos →"** (`recruitment/candidatos`, `banco-de-talentos`) e estado na URL (`depois=`). Não existe paginação numerada nem componente `Pagination` |
| Ordenação | Só ranking fixo (`aria-sort` na pontuação). Sem ordenação interativa por coluna |
| **Veredito** | Contêiner e cabeçalho do `candidate-table` com `sr-only-table`: **PADRÃO COM AJUSTE**, como base do `DataTable`. Barra de filtros com estado na URL: **PADRÃO** (vira `FilterBar`). Paginação por cursor: **PADRÃO** (como `LoadMore`/`CursorPager`). Hoje as 49 tabelas soltas são **DÍVIDA** |

## 7. Modais, drawers, dropdowns e tooltips

| Item | Detalhe |
|---|---|
| **Canônico** | `ui/modal.tsx`, 21 arquivos, **33 usos** |
| Medidas | overlay `bg-black/60 backdrop-blur-sm z-[60]` · painel `max-w-md` (448px) `rounded-xl` (r16) `p-6 shadow-2xl` · título `text-lg` (17px) · fechar 32px · conteúdo `max-h-[calc(80vh-4rem)]` com rolagem |
| Estados e a11y | `role="dialog"`, `aria-modal`, `aria-labelledby` (ou a prop `labelledBy`), foco no primeiro elemento focável, **armadilha de Tab**, Esc, devolve o foco a quem abriu, trava a rolagem do body, `onClose` guardado em ref (correção da #565). **É o componente mais maduro do app** |
| Animação | `animate-in fade-in zoom-in-95 duration-200` **não faz nada**: nem `tailwindcss-animate` nem `tw-animate-css` estão nas dependências. O modal aparece sem transição |
| Paralelos | `admin/page.tsx` com 2 modais à mão (`rounded-2xl` = 24px, `max-w-sm` e `max-w-2xl`, bottom-sheet em `sm:`, **sem role, sem Esc, sem armadilha de foco**) · `consent-gate.tsx` (`bg-black/80`, `max-w-lg`, **sem `role="dialog"`**) · `roles/[id]/page.tsx` (tem `aria-modal`) · painel da `NexusPill` (Esc e `aria-modal`). São **5 implementações** de diálogo |
| Drawer | Só a gaveta mobile da sidebar. Não existe drawer lateral de detalhe |
| Dropdown/menu | 0 `role="menu"`. Os dropdowns são painéis `absolute` (ver §2). `<details>`: 15 usos como disclosure |
| Tooltip | **O `title=` nativo domina (249)**. `role="tooltip"` só no trilho da sidebar e no `disc-wheel`. Não existe componente `Tooltip` |
| **Veredito** | `Modal`: **PADRÃO** (contrato quase pronto; falta `size`, `footer`/ações, `ConfirmDialog` e a animação de fato). Modais à mão e consent-gate: **DÍVIDA**. Tooltip e menu: **lacuna**. Criar `Tooltip` e `Menu` acessíveis antes de copiar qualquer coisa |

## 8. Dashboards, gráficos e KPIs

| Item | Detalhe |
|---|---|
| KPIs | **3 implementações**: `dashboard/dashboard-stats.tsx` (link-card r16 p-5, rótulo `text-xs uppercase`, valor `font-mono text-3xl`, ícone em quadrado de 36px) · `recruitment/painel/RecruitmentKpiRow.tsx`/`CandidateKpiRow` (r16 p-4, rótulo `tracking-[0.12em]`, variante `muted` tracejada) · `.dl-statcard` do DS (`admin`, `admin/lead-capture`, `legacy-dashboard`) |
| Gráficos | **Sem biblioteca de gráfico.** SVG e divs à mão: `charts/disc-wheel.tsx` (526 linhas, 12 hex), `match-gauge.tsx`, `theory-match-bars.tsx`, `painel/ActivityChart.tsx` (barras em `h-[180px]`, cores em `SERIES[k].color` inline), `StageFunnel.tsx`. `@xyflow/react` e `d3-hierarchy` só no organograma |
| Tokens de visualização | `app/tokens/viz-tokens.css` (199 linhas, local, OKLCH, escuro e claro): `--theory-*` (8 teorias), `--viz-match-on/near/off/empty`, `--viz-zone-healthy/attention/risk`, `--viz-card-*` |
| Duplicação de paleta | `lib/constants.ts` dá a cada teoria **outro** hex (DISC `#6f32b1` roxo, Big Five `#3B82F6`) e um emoji como ícone. Já `--theory-disc` é `oklch(72% .18 240)`, um azul. **São duas paletas de teoria em paralelo** |
| Movimento dos gráficos | `.viz-seg` (hover/foco desloca o segmento, 320ms `cubic-bezier(.22,.61,.36,1)` = `--ease-sheen` do DS, mas escrito por extenso) · `.viz-pulse` 2,4s · `.viz-grow` 0,9s · `.match-link:has(...)` destaca sem JS. Tudo com `prefers-reduced-motion` |
| A11y | `figure`, legenda `aria-hidden` mais `sr-only-table`, `<title>` no SVG, `tabular-nums` (91 usos) |
| **Veredito** | `StatCard`/KPI: **PADRÃO COM AJUSTE** (juntar as 3 em uma, de preferência o `.dl-statcard` do DS com as props da `KpiRow`). Vocabulário de movimento e a11y dos gráficos (`viz-seg`, `sr-only-table`, `:has()`): **PADRÃO**. Cores de teoria DISC/Big Five/Eneagrama, roda DISC e gauge de matching: **ESPECÍFICO ELECTIA**. `lib/constants.ts` com hex e emoji: **DÍVIDA** |

## 9. Estados: carregando, vazio, erro e sucesso

| Estado | O que existe | Veredito |
|---|---|---|
| Carregando | `Loader2 animate-spin`: **128 arquivos, 257 ocorrências**, em 6+ tamanhos (`w-4` 105, `mr-2 h-4` 26, `w-6 text-accent-on-dark` 18…). Skeleton quase ausente: `animate-pulse` 11× em 4 arquivos, só **1** `loading.tsx` (perfil). `aria-busy` 3× | **DÍVIDA** de consistência. Criar `Spinner` (tamanhos e rótulo `sr-only`) e `Skeleton` |
| Vazio | Não existe `EmptyState`. Os vazios são `<Card className="p-12 text-center"><p className="text-text-secondary">Nenhum…`, com ~88 arquivos de textos "Nenhum/Nenhuma". `locked-feature.tsx` (ícone em círculo de 48px, título e CTA de plano) é o melhor modelo | Criar **`EmptyState`** a partir de `locked-feature`: **PADRÃO COM AJUSTE** |
| Erro de página | `app/(dashboard)/error.tsx` (círculo de 64px `bg-danger/10`, `AlertTriangle`, "Algo deu errado" e ações) mais `global-error.tsx`. Não existe `not-found.tsx` | **PADRÃO** (vira `ErrorState`) |
| Mensagens | `ui/page-messages.tsx` (26 usos): faixa `sticky top-[60px] z-20 rounded-lg`, sucesso com `role="status"` polite, erro com `role="alert"` assertive e botão de fechar. Bem documentada. Paralelos: caixas inline à mão (`rounded-lg border-danger/30 bg-danger/10 px-4 py-3`) no login e em outras telas. `role="alert"` 76×, `role="status"` 37× | `PageMessages` → **PADRÃO COM AJUSTE** (generalizar para `Alert`/`InlineMessage` com tons; o `top-[60px]` precisa virar token de altura do header) |
| Toast | Inexistente (1 arquivo cita "toast") | Lacuna: decidir se `PageMessages` substitui o toast |
| Aviso de leitura | `ui/read-only-notice.tsx` (4 usos) | **ESPECÍFICO ELECTIA** (permissões por papel), mas o padrão "Notice" entra no `Alert` |
| Badge de status | `ui/status-badge.tsx` (29 usos): 7 tons (`neutral, accent, success, warning, danger, progress, human`), pílula `px-2.5 py-1 text-xs`, `dot`. Textos com tokens próprios por tema (`--badge-*-text`), já ajustados para AA | **PADRÃO**. Os tons `progress`/`human` (conversa da Exa) são domínio, então ficam como extensão da marca |

## 10. Ícones

| Item | Detalhe |
|---|---|
| Biblioteca | `lucide-react` ^1.66: **236 arquivos** importam, **≥148 ícones diferentes** (contagem por import de uma linha; imports em várias linhas podem somar mais) |
| Mapa de ícones | **Não existe** (`icon-map.ts` não existe neste repo). Cada tela escolhe o seu ícone |
| Tamanhos | `w-4/h-4` (16px) ~800 · `w-3.5` (14px) ~215 · `w-5` (20px) ~147 · `w-8` 129 (geralmente o contêiner) · `w-3` 127 · 18px fixo na sidebar. Sem token de tamanho de ícone |
| Outros | 33 `<svg>` inline em 27 arquivos (marca, gráficos) · **emojis como ícone** em `lib/constants.ts` (🎯🧠🔷📊🌡️) · o DS exporta `./icons` (CSS), que a Electia não usa |
| A11y | `aria-hidden` 460×. Os ícones em botões de ícone têm `aria-label` no botão (modal, sidebar). Há o `Lock` com `aria-label` direto no SVG (sidebar), que funciona mas é frágil |
| **Veredito** | Lucide como biblioteca única: **PADRÃO**. Escala 14/16/20 como token `--icon-sm/md/lg`: **PADRÃO COM AJUSTE**. Mapa semântico de ícones: **lacuna a criar**. Emojis em dados: **DÍVIDA** |

## 11. Tipografia

| Item | Detalhe |
|---|---|
| Famílias | Inter (corpo) · **Sora 700/800** (H1 global e `font-heading`, 11 usos) · JetBrains Mono 500–700 (`font-mono`, 160 usos: valores de KPI, marca `electia`), todas via `next/font` |
| **Risco de fonte não aplicada** | O `next/font` cria `--font-inter`, mas **nada consome `--font-inter`**. O `body` usa `var(--font-sans)` = `"Inter", …` (nome literal), e o `next/font` registra a família com nome gerado (hash). O H1 global usa `var(--font-heading)`, que o DS sem camada define como `"Sora", sans-serif` (literal), passando por cima do `var(--font-sora)` da Electia. **É provável que corpo e H1 estejam saindo na fonte do sistema** (exceto onde se usa a classe `font-heading`). **Não verificado renderizado**: é o primeiro item a conferir no navegador |
| Escala efetiva | 11 (`xs`, 1.629) · 13 (`sm`, 1.486) · 15 (`base`, 189) · 17 (`lg`, 183) · 20 (`xl`, 57) · 24 (`2xl`, 157) · 30/36/48 (landing) |
| Fora da escala | **128 tamanhos arbitrários**: `text-[10px]` 65, `[11px]` 27 (igual a `xs`, redundante), `[9px]` 10, `[12px]` 5, `[10.5px]` 5, `[9.5px]`, `[8px]`, `[8.5px]`, `[12.5px]`, `[11.5px]`… Texto de 8–9,5px em interface é ilegível |
| Pesos | semibold 756 · medium 638 · bold 292 · extrabold 39. Tracking: `wider` 181, `wide` 52, mais 5 valores `[0.12–0.2em]` para rótulos em caixa alta (273 `uppercase`) |
| Hierarquia | H1 24 / H2 17 ou 15 / H3 15 ou 13 (`text-base` 46, `text-sm` 40). O H2 não tem tamanho único |
| **Veredito** | Escala 11/13/15/17/20/24 como **tokens**: **PADRÃO** (é a escala do DS para UI densa). Sora no H1 e Mono nos números: **ESPECÍFICO ELECTIA** (marca). Tamanhos arbitrários < 11px: **DÍVIDA**. A ligação da fonte (`--font-inter`/`--font-heading`): **DÍVIDA a confirmar** |

## 12. Espaçamento

| Item | Detalhe |
|---|---|
| Base | 4px (padrão do Tailwind, que bate com `--space-1` do DS). **O app não usa `var(--space-*)`**, só utilitários |
| Mais usados | `gap-2` 703, `gap-3` 416, `gap-1` 194, `gap-4` 170, `gap-1.5` 169 · `space-y-3` 206, `space-y-2` 195, `space-y-4` 165, `space-y-6` 102 · `p-3`/`p-4` 142 cada, `p-5` 103, `p-6` 77 |
| Layout de página | `max-w-7xl px-4 sm:px-6 lg:px-8`, `pb-6`. Página larga com `data-page-width=full` |
| Arbitrários | 134 medidas `-[Npx]` (espaço e tamanho), entre elas `top-[60px]`, `h-[21px]`, `w-[360px]`, `h-[180px]` |
| **Veredito** | Escala de 4px com ritmo 8/12/16/24: **PADRÃO**. Medidas fixas de layout (altura do header, largura de dropdown): **DÍVIDA**, viram tokens (`--header-height` já existe no DS com 56px; a Electia usa 60px implícito) |

## 13. Raios, sombras e superfícies

| Item | Detalhe |
|---|---|
| Superfícies (escuro) | `bg-primary` #0B0E14 · `bg-card` #161B26 · `bg-card-hover` #1C2333 · `bg-input` #0B0E14 · borda #2A3444. Os comentários dizem que equivalem a `--bg-base`/`--bg-surface-2/3` do DS, mas os valores estão **redeclarados localmente** com nomes próprios |
| Superfícies (claro) | #FFFFFF / #F8FAFB / #F0F3F5, borda #D1D9E0 |
| Impressão | `@media print` força as cores claras (relatório NR-1). Boa prática |
| Raios efetivos | r12 (`rounded-lg`, 487) é o mais comum (botão md, input, item de nav) · pílula (362) · r8 (`rounded-md`, 203, botão sm) · r16 (`rounded-xl`, 192, card/modal) · r4 (`rounded`, 156) · r24 (`rounded-2xl`, 72, modais à mão) |
| Sombras | Raras: `shadow-lg` 20, `shadow-2xl` 8, `shadow-xl` 7. **62 sombras arbitrárias**, quase todas brilho roxo (`0_0_20px_rgba(111,50,177,.2)` 10×, `rgba(168,85,247,.35)`…) em vez de `--shadow-glow` (que o bridge já pinta de roxo) |
| Degradês | `bg-gradient-purple-vibrant` 60 usos (CTA, selos). `premium` (roxo e ouro) 3 usos. `.text-gradient-purple-premium` reprova contraste (documentado, só no styleguide) |
| Nomes de token | 3 vocabulários convivendo: Electia (`bg-bg-card`, `accent-teal`, `accent-on-dark` 831 usos), apelidos estilo shadcn (**`border-border` 765**, `text-muted-foreground` 64, `bg-surface-2` 23, `bg-bg-base` 16, `bg-bg-elevated` 15) e o DS (`--accent-primary`, `--bg-surface-*`, só nos `.dl-*`) |
| **Veredito** | Superfícies planas com 3 níveis e borda de 1px: **PADRÃO**. Raios 8/12/16/pílula: **PADRÃO** (como tokens). Brilho roxo e degradês: **ESPECÍFICO ELECTIA**. `accent-teal` (que é roxo) e os apelidos shadcn: **DÍVIDA de nomenclatura** (não copiar nomes, mapear para `--accent-primary`/`--border-default`) |

## 14. Microinterações, transições e animações

| Item | Detalhe |
|---|---|
| Transições | `transition-colors` 382 (padrão de hover) · `transition-all` **70** (anima propriedades de layout sem querer, como a largura da sidebar sem hover e o `main`) · `transition-transform` 23 · `transition-opacity` 19 |
| Durações | `150ms` nos componentes `ui/` · `200ms` (32 usos: sidebar, modal) · `300ms` (21) · 500/700 raros. CSS: 250/300/320ms nos gráficos, 0,6s no `fade-in-up`, 0,9s no `viz-grow` |
| Easing | `ease-out` 6, `ease-in-out` 1. O resto usa o padrão do Tailwind. CSS: `cubic-bezier(.22,.61,.36,1)` repetido 8× por extenso (é o `--ease-sheen` do DS). As molas do DS (`--spring-*`) não são usadas |
| Sidebar | Abre e fecha só com `transform` (`SLIDE` = `transition-transform duration-200 ease-out motion-reduce:transition-none`). Correto |
| Assinaturas | Orbe da Nexus (respira 6s, 1,6s enquanto "pensa", deriva e giro só com transform) · borda viva da Nexus (`@property` com conic-gradient de 8s) · landing: `float-*`, `glow-pulse`, `aurora-hero` |
| Movimento reduzido | `@media (prefers-reduced-motion)` em `globals.css` (float, pulse, ping, bounce, fade, spin, orbe, borda, viz), mais `motion-reduce:` 16× e `useReducedMotion` em 6 arquivos. **Lacuna:** `animate-spin` do `Loader2` também para, e um spinner parado deixa de comunicar "carregando" (precisa de rótulo de texto) |
| Mortas | `animate-in fade-in zoom-in-95` (modal) não tem plugin; `@keyframes scan` não tem consumidor visível |
| **Veredito** | Durações 150/200/300 e easing `--ease-sheen`: **PADRÃO COM AJUSTE** (virar `--duration-fast/normal/slow` e usar `var(--ease-*)`). "Só transform/opacity" mais reduced-motion global: **PADRÃO**. Orbe e borda viva: já estão no DS como orbe de IA por marca, então **ESPECÍFICO** por pigmento. `transition-all` e as classes de animação mortas: **DÍVIDA** |

## 15. Responsividade

| Item | Detalhe |
|---|---|
| Breakpoints | `sm:` 489 · `lg:` 168 · `md:` 85 · `xl:` 10 · `max-lg:` 5 (sidebar) · `print:` 25. **Sem container queries** (0) |
| Padrões | Mobile-first. Sidebar vira gaveta abaixo de `lg` com botão hambúrguer fixo de 40px. Modal do admin vira bottom-sheet abaixo de `sm`. Grades de KPI `2 → 3 → 6` e `1 → 2 → 4`. Tabelas com `overflow-x-auto`. Abas com rolagem horizontal (`w-max min-w-full`) |
| Alvo de toque | O botão `sm` (32px), o fechar de 32px, o checkbox de 16px e os itens de 36px ficam **abaixo de 44px** no celular. O WCAG 2.5.8 (AA) pede 24px, então passa, mas fica abaixo do botão de 44px do DS |
| Modo de ponteiro | Sidebar diferenciada por `(hover: hover) and (pointer: fine)`. Boa prática |
| **Veredito** | **PADRÃO COM AJUSTE**: adotar os mesmos breakpoints e declarar a regra de toque (`size="sm"` só com ponteiro fino, ou uma área de toque estendida) |

## 16. Acessibilidade (foco, ARIA, contraste)

**Foco:** existe um anel global, `*:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 2px }` (WCAG 2.4.11/2.4.13). No escuro, `border-focus` #a55eea dá 4,96:1 sobre `bg-primary` mas **4,42:1 sobre `bg-card`** (passa os 3:1 de não-texto). Porém 48 `focus:outline-none` (Input, Select, Textarea, login) trocam o anel por `ring-1`, que é mais fino e não é igual ao do resto do app. O DS pede `--focus-ring-width: 3px` com `--focus-ring-color` #c084fc; a Electia usa 2px e #a55eea. São dois contratos.

**ARIA:** `aria-label` 305, `sr-only` 75, `aria-hidden` 460, `role="alert"` 76, `role="status"` 37. Faltam `aria-current` na sidebar, `aria-expanded` nos dropdowns, `aria-invalid`/`aria-describedby` nos campos e `role="dialog"` no consent-gate e nos 2 modais do admin. 5 `div onClick`.

**Contraste calculado a partir dos tokens (WCAG 2.x):**

| Par | Razão | Resultado |
|---|---|---|
| `text-muted` #8A939D / `bg-card` #161B26 (escuro) | 5,53 | AA |
| `text-muted` / `bg-card-hover` #1C2333 | 5,04 | AA |
| `text-secondary` #8B949E / `bg-card` | 5,60 | AA |
| `accent-on-dark` #c084fc / `bg-card` | 6,52 | AA |
| `accent-teal-hover` #a55eea / `bg-card` | **4,42** | Reprova AA para texto (o próprio token avisa) |
| Branco / #6f32b1 (primário, login) | 7,59 | AA |
| Branco / #2040a0 (fim do degradê) | 9,12 | AA |
| `danger` #F05252 / `bg-card` · `success` · `warning` | 4,95 · 7,56 · 8,02 | AA |
| Claro: `text-muted` #696F7D / #F8FAFB | 4,81 | AA (por pouco) |
| Claro: danger / success / warning sobre `bg-card` | 4,80 cada | AA (por pouco) |
| Claro: `Button danger` #D72525 sobre danger/10 em branco | **4,29** | **Reprova** |
| Sidebar Bem-estar ativa: `rose-500` sobre rose/10 em `bg-card` | **4,27** | **Reprova** (13px medium) |
| Selo "em breve": `amber-400` sobre amber/20, **tema claro** | **1,38** | **Reprova grave** (9px, paleta fora dos tokens) |
| Seta do Select #484F58 / `bg-input` | 2,33 | Reprova 3:1 (não-texto) |
| Borda de controle #2A3444 / `bg-card` · claro #D1D9E0 / branco | 1,37 · 1,43 | Abaixo de 3:1 (1.4.11, depende de leitura) |
| Texto roxo #6f32b1 / #0B0E14 (degradê de preenchimento usado como texto) | 2,55 | Reprova. Corrigido em `.text-gradient-purple`, mas o `premium` continua |

**Veredito:** anel global de foco, `PageMessages` com live regions, `Modal` e `sr-only-table`: **PADRÃO**. Os tons em paleta do Tailwind (`rose`, `amber`, `emerald`… **738 classes de paleta fora dos tokens**) são a principal fonte de reprovação: **DÍVIDA**.

---

## 17. Mapa resumido de vereditos

| Família | Veredito | Observação curta |
|---|---|---|
| Sidebar e trilho | PADRÃO COM AJUSTE | a11y e tokens de medida |
| Seções e rótulos de nav | ESPECÍFICO ELECTIA | jornada de RH |
| Abas | DÍVIDA, depois PADRÃO | 9 implementações, unificar |
| Dropdown/menu/tooltip | DÍVIDA / lacuna | sem ARIA nem teclado |
| Button | PADRÃO COM AJUSTE | loading, iconOnly, decisão de 32/40 contra 36/44 |
| Input/Select/Textarea/Checkbox | PADRÃO COM AJUSTE | aria-invalid, describedby, useId |
| Card | PADRÃO COM AJUSTE | prop de padding |
| Tabela, filtros, cursor | PADRÃO COM AJUSTE | extrair do candidate-table |
| Modal | PADRÃO | o mais maduro |
| KPI/StatCard | PADRÃO COM AJUSTE | 3 em 1 |
| Gráficos de teoria | ESPECÍFICO ELECTIA | domínio psicométrico |
| Movimento e a11y de gráficos | PADRÃO | viz-seg, sr-only-table |
| Estados (Spinner/Skeleton/Empty/Error) | PADRÃO COM AJUSTE | quase tudo por criar |
| PageMessages / StatusBadge | PADRÃO | tons por token |
| Ícones lucide | PADRÃO | falta mapa e escala |
| Escala tipográfica 11–24 | PADRÃO | como token |
| Sora, Mono, degradê, brilho roxo, tema escuro por padrão | ESPECÍFICO ELECTIA | marca |
| Espaçamento de 4px | PADRÃO | |
| Raios 8/12/16/pílula, superfícies planas | PADRÃO | escrever em tokens |
| Breakpoints e regra de ponteiro | PADRÃO COM AJUSTE | alvo de toque |

---

## 18. Fechamento

### (a) Candidatos a Component Contract (22)

| # | Componente | Origem na Electia | Props/variantes mínimas | Estados mínimos |
|---|---|---|---|---|
| 1 | `Button` | `ui/button.tsx` | `variant: primary\|secondary\|ghost\|danger` · `size: sm(32)\|md(40)\|lg(48)` (decidir contra os 36/44 do DS) · `loading` · `iconLeft/iconRight` · `asChild`/`href` · `fullWidth` | default, hover, active, focus-visible, disabled, loading (`aria-busy`, rótulo mantido) |
| 2 | `IconButton` | repetido à mão (fechar, sidebar) | `icon`, `label` (obrigatório → `aria-label`), `size`, `variant: ghost\|danger` | iguais ao Button, com tooltip opcional |
| 3 | `Field` (wrapper) | rótulo e erro de `Input/Select` | `label`, `hint`, `error`, `required`, `id` (via `useId`) | normal, erro (`aria-invalid` + `aria-describedby`), desabilitado, somente leitura |
| 4 | `Input` | `ui/input.tsx` | `size: sm(36)\|md(40)`, `iconLeft`, `type` | hover, focus, erro, disabled |
| 5 | `Select` (nativo) | `ui/select.tsx` mais `SELECT_CLASS` | `options`, `placeholder`, `size`, seta por token | iguais ao Input |
| 6 | `Textarea` | `ui/textarea.tsx` | `rows`, `autoResize?`, contador opcional | iguais ao Input |
| 7 | `Checkbox` / `Radio` / `Switch` | `ui/checkbox.tsx`, 34+8 crus | `label`, `description`, `indeterminate` (checkbox) | checked, unchecked, indeterminate, focus, disabled. `Switch` com `role="switch"` (não existe hoje) |
| 8 | `Card` | `ui/card.tsx` | `padding: sm\|md\|lg`, `interactive`, `as`, `CardTitle level` | default, hover (se interativo), focus (se link) |
| 9 | `StatCard` / `KpiRow` | `dashboard-stats`, `RecruitmentKpiRow`, `.dl-statcard` | `label`, `value`, `detail`, `icon`, `trend/compare`, `href`, `muted` | normal, vazio ("—"), carregando (skeleton), link com foco |
| 10 | `DataTable` | `candidate-table.tsx` | `columns` (`id, header, align, width`), `rows`, `groupBy`, `sort` (`aria-sort`), `density` | carregando, vazio, erro, linha selecionada/hover |
| 11 | `FilterBar` | `candidate-filters.tsx` (+3 cópias) | `search` (`role="search"`), `filters[]`, estado na URL, `onClear` | sem filtro, filtrado (contagem), sem resultado |
| 12 | `CursorPager` / `LoadMore` | `recruitment/candidatos` | `nextHref`/`onLoadMore`, `label` | tem mais, fim, carregando |
| 13 | `Modal` / `Dialog` | `ui/modal.tsx` | `open`, `onClose`, `title`/`labelledBy`, `size: sm\|md\|lg`, `footer`, `dismissible` | aberto/fechado com animação real, armadilha de foco, Esc, devolução de foco |
| 14 | `ConfirmDialog` | admin, ações destrutivas | `tone: default\|danger`, `confirmLabel`, `onConfirm` (async) | carregando no confirmar, erro inline |
| 15 | `Drawer` / `Sheet` | gaveta da sidebar, bottom-sheet do admin | `side: left\|right\|bottom`, `open`, `onClose` | iguais ao Modal |
| 16 | `Menu` / `Popover` | company-switcher, NotificationBell | `trigger`, `items`, `align` | `aria-expanded`, setas, Esc, clique fora |
| 17 | `Tooltip` | trilho da sidebar, `title=` ×249 | `content`, `side`, abre no hover **e** no foco | aberto, fechado, com atraso |
| 18 | `Tabs` | `ui/tabs.tsx` mais 8 tablists | `variant: link\|panel`, `items`, `value` | ativo (`aria-current` ou `aria-selected`), foco, setas (no modo panel) |
| 19 | `SidebarNav` | `layout/sidebar.tsx` | `sections[]` (`label` opcional), `items` (`icon, label, href, badge, locked, comingSoon`), `mode: expanded\|rail\|peek\|drawer` | ativo (`aria-current`), bloqueado (motivo acessível), recolhido com tooltip |
| 20 | `Alert` / `PageMessages` | `ui/page-messages.tsx`, `read-only-notice` | `tone: info\|success\|warning\|danger\|neutral`, `sticky`, `dismissible`, `title` | live region por tom (status/alert) |
| 21 | `StatusBadge` | `ui/status-badge.tsx` | `tone` (5 base mais extensões de marca), `dot`, `size` | contraste AA por tom e por tema |
| 22 | `EmptyState` / `ErrorState` / `Spinner` / `Skeleton` | `locked-feature`, `error.tsx`, `Loader2` | Empty: `icon, title, description, action`. Error: `retry`. Spinner: `size, label`. Skeleton: `shape` | reduced-motion (spinner com texto) |

**Tokens que o contrato precisa (além dos que o DS já tem):** `--control-height-sm/md/lg`, `--icon-sm/md/lg`, `--duration-fast/normal/slow` (150/200/300), `--header-height` (resolver a diferença entre 56 e 60), `--focus-ring-*` (resolver 2px #a55eea contra 3px #c084fc), uma escala de z-index (hoje 20/30/40/50/60 soltos).

### (b) Top 10 dívidas da Electia que NÃO devem ser copiadas

1. **Nomes de token enganosos e em 3 vocabulários:** `accent-teal` é roxo, mais 765 `border-border` e outros apelidos shadcn, mais nomes próprios para valores do DS. O contrato usa só os nomes semânticos do DS.
2. **Depender de o DS sobrescrever os padrões do Tailwind** (`rounded-lg` = 12px, `text-sm` = 13px) por ordem de cascata. O contrato tem de ser escrito em tokens explícitos.
3. **Fonte provavelmente não aplicada:** `--font-inter` é gerada mas nunca consumida, e o `"Sora"` literal do DS passa por cima de `var(--font-sora)`. Conferir antes de declarar a tipografia como "validada".
4. **738 classes da paleta Tailwind** (`rose-500`, `amber-400`, `emerald`…) e **62 sombras rgba arbitrárias**, que produzem as reprovações de contraste (selo "em breve" a 1,38:1 no claro, Bem-estar a 4,27:1).
5. **128 tamanhos de fonte arbitrários**, incluindo 8, 8,5, 9 e 9,5px.
6. **5 implementações de diálogo**, 2 delas sem `role`, sem Esc e sem armadilha de foco (`admin/page.tsx`, `consent-gate.tsx`).
7. **9 implementações de abas** e 4 cópias de barra de filtros com constante de classe local (`SELECT_CLASS`).
8. **49 tabelas soltas** com 6 receitas de cabeçalho. Sem componente.
9. **Campos sem `aria-invalid`/`aria-describedby`** e `id` gerado a partir do rótulo (colide). `error=` usado 2 vezes em 155 Inputs.
10. **Código morto e ilusório:** `animate-in` sem plugin (o modal não anima), `ui/slider.tsx` sem uso, 3 rotas de styleguide (`/design-system`, `/desing-system` com erro de grafia, `/styleguide`), paleta de teoria duplicada (`lib/constants.ts` em hex com emoji contra `--theory-*` em OKLCH).

Fora do top 10: `transition-all` (70), `title=` como tooltip (249), dropdowns sem ARIA, header com altura copiada à mão (`top-[60px]`), `viz-card` com cinza neutro diferente do navy do `bg-card`.

**Não universalizar (são particularidades legítimas da Electia):** tema escuro como padrão e escuro forçado nas rotas públicas · degradê roxo para royal blue e brilho roxo no CTA · Sora em H1 e Mono nos números · cores de teoria (DISC, Tipologia Cognitiva, Big Five, Eneagrama, Temperamentos, Motivadores, BAT/CBI) e zonas de risco NR-1 · tons `progress/human` da conversa da Exa · orbe e borda viva da Nexus · seções de navegação por jornada de RH e o vocabulário de recrutamento ("vagas", "triagem", "banco de talentos").

### (c) Lacunas não verificadas

| Lacuna | Por que importa | Como fechar |
|---|---|---|
| **Nada foi visto renderizado** (sem servidor, navegador nem login) | Todos os px saem da leitura do CSS. O override da seção 0 e o risco de fonte são deduções | Playwright nos breakpoints 320/768/1024/1440, nos dois temas, com `getComputedStyle` em botão, input, card, h1 e body |
| Família de fonte efetiva | Pode invalidar a decisão tipográfica | Ver `font-family` computado do `body` e do `h1` |
| Ordem de cascata real do build Turbopack | Confirma se o DS sem camada vence `@layer theme` | Inspecionar o CSS gerado em `.next` |
| Contraste em degradês, imagens e overlays | Só calculei pares de cor sólida | axe/Lighthouse renderizado |
| Teclado na gaveta mobile, no switcher e no sino | Li o código, não testei | Teste manual e Playwright com teclado |
| Tema claro em telas reais | Os tokens existem, mas 738 classes de paleta podem falhar no claro | Captura de tela no claro |
| Contagens por grep | Imports e JSX em várias linhas podem escapar. Usei perl multilinha para os componentes principais e grep de linha única para classes | Uma passada com AST (ts-morph) se precisar de exatidão |
| Origem do "2,49:1" de 12/11 | Não reproduzido no código atual | Ver o histórico do login ou a métrica original |
| `prototype/`, `docs/`, `product/` da Electia | Fora do escopo (código ≠ docs) | — |
| Snapshot sem `.git` | Não confirmei o SHA ef41e5d6 dentro do snapshot | Conferir com o Supervisor |
