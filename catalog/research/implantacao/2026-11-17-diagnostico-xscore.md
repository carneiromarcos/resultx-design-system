# Diagnóstico — adoção do ResultX DS em todas as telas do Xscore

- **Data:** 17/11/2026 · **Autora:** Uma (@ux-design-expert), somente leitura
- **Fontes:** Xscore `7cbb2ce` (PR #331), cópia em `.../scratchpad/ro/ws/meus-projetos/resultx/labs/xscore` · DS `0827c21`, cópia em `.../scratchpad/ro/ds` · memórias `feedback_xscore_etiquetas_e_excesso_de_texto.md` e `xscore-frontend-ds-audit-2026-10-14.md`
- **Caminhos:** os do Xscore partem de `resultx/labs/xscore/`; os do DS são marcados com `DS:`.
- **Nenhum arquivo de repositório foi alterado.**

---

## 0. Resposta curta

1. **Os tokens do DS chegam a 100% das telas, mas nenhuma tela usa componente do DS.**
   - O único ponto de entrada é `apps/web/app/globals.css:18`: `@import "resultx-design-system/brands/xscore/tokens"`. Ele vale para o app inteiro por `apps/web/app/layout.tsx:4`.
   - O DS **não tem adaptador React** (`DS:adapters/` só tem `css/`).
   - A ADR-0004 decide que, no Xscore, os `ui/*` locais "passam a seguir o contrato e os tokens semânticos, verificados pelos casos de teste" (`DS:docs/adr/0004-contracts-adapters-pilot.md:18`).
   - Por isso, no Xscore, "migrar para o DS" significa **deixar os 19 primitives de `apps/web/components/ui/` conformes aos 8 contratos e fazer as telas usarem só esses primitives**. Importar CSS de componente do DS não é o caminho: o gate do repo proíbe `components.min.css` (`scripts/abolished-terms.txt`, linha `components.min.css|traz 37 classes de domínio alheio`).
2. **A versão consumida é a v2.9.0, não o tgz 2.7.0-dev.** A divergência citada no pedido está parcialmente errada:
   - **Na `origin/main` (`7cbb2ce`)**, `apps/web/package.json:26` aponta para `github:carneiromarcos/resultx-design-system#v2.9.0`, e `package-lock.json:6133-6135` resolve `2.9.0` em `405b3351…`. Pelo GitHub, esse é exatamente o commit da tag `v2.9.0`. Não existe `vendor/` nem `.tgz` nessa árvore.
   - **O tgz `resultx-design-system-finance-2.7.0-dev.23.tgz` está só na árvore local `/Users/marcos/meus-projetos/resultx/labs/xscore`.** Ela está em `main` local `bc55c15c` ("update local main to validated Finance testing tree"), que **não é ancestral** de `7cbb2ce` (conferido com `git merge-base --is-ancestor`). A árvore local tem 14 tgz versionados em `vendor/`, e lá `apps/web/package.json:27` aponta para `file:../../vendor/…-2.7.0-dev.23.tgz`. É a main local divergente que a memória manda **nunca** usar como base nem empurrar.
   - **O DS está em `2.10.0`** (`DS:package.json:3`). O painel do DS confirma: "Electia e Xscore travados em `#v2.9.0`" (`DS:docs/STATUS.md`, tabela de indicadores).
3. **Subir para a v2.10.0 não muda nenhuma cor nem medida.**
   - O arquivo `brands/xscore/tokens/tokens.css` tem o **mesmo blob** nas tags v2.9.0 e v2.10.0 (`823ef219…`, consultado pela API do GitHub).
   - Na `main` do DS o blob é outro (`f1522e1c…`, gerado pela E1). Normalizei as 122 declarações nos dois lados e o diff deu **zero**.
4. **Contagem por estado** (35 telas reais, fora 2 redirecionamentos):

| Estado | Definição técnica | Telas |
|---|---|---|
| **Componente do DS** | importa componente ou CSS de componente do pacote | **0** |
| **A — conforme à base atual** | tokens do DS + primitives `ui/`, sem camada própria de tela | **1** (`/styleguide`, a vitrine) |
| **B — parcial** | tokens do DS + primitives `ui/` + camada própria: CSS Module "Finance" que sobrescreve o primitive, controle cru, `px` fixo, etiqueta e texto fora do critério do Marcos | **32** |
| **C — própria** | composição própria domina (marketing ou demo) | **2** (`/` anônimo, `/styleguide/finance`) |
| Redirecionamento | sem tela | 2 (`/admin/empresas`, `/settings/roles-permissions`) |

Mesmo a tela A não está "pronta pelo DS": os primitives em que ela se apoia ainda divergem dos contratos (§2.1).

---

## 1. Inventário de rotas

### 1.1 Como o DS entra hoje (evidência)

| Camada | Evidência | Leitura |
|---|---|---|
| Pacote | `apps/web/package.json:26` `#v2.9.0`; `package-lock.json:6133-6135` | travado em v2.9.0 |
| Tokens | `apps/web/app/globals.css:18` importa só `brands/xscore/tokens`, sem os tokens base e sem a ponte (`globals.css:5-6`) | cores, raios, sombras, tipos e movimento do DS; **não há escala de espaçamento** (`--space-*` não existe no brand: `DS:brands/xscore/tokens/tokens.css`, grupos contados) |
| Ponte para o Tailwind | `globals.css:21-62` (`@theme inline`) | as telas usam a forma arbitrária: 1.031 ocorrências de `[var(--…)]` em `.tsx`; 0 hex; 0 cor da paleta padrão do Tailwind |
| CSS Modules "Finance" | 11 arquivos `components/finance/*.module.css`, `components/monitoring/dashboard.module.css` e `components/shell/shell.module.css`: 0 hex e 0 `rgb()`, mas **549 valores em `px`** | token de cor sim; espaçamento e tamanhos cravados (o brand não oferece escala) |
| Componentes | 19 primitives locais em `apps/web/components/ui/` (`docs/design-system.md` §5) | não vêm do DS; seguem os tokens do DS |
| Logo | `apps/web/public/finance/xscore-official.svg`, usado em `components/shell/sidebar.tsx:62` e `components/finance/access-frame.tsx:12` | **não é** asset do DS: SHA diferente dos 4 SVG de `DS:brands/xscore/assets/logo/` |
| Fontes | `next/font/google` em `app/layout.tsx:2` | Plus Jakarta e Geist Mono **não estão** em `DS:assets/fonts` (`DS:catalog/research/2026-11-16-levantamento-marcas.md:53`) |

A apresentação "Finance" de 28/10 (`governance/xscore-finance-redesign-plan-20261028.md`) foi **portada como CSS local** sobre os tokens da v2.9.0 ("No new dependency, no vendored `.tgz`", linha 13). É daí que vem a camada B.

### 1.2 Telas

Legenda de público: **Anônimo** · **Autenticado** (qualquer usuário logado) · papéis do tenant (`admin`, `director`, `analyst`, `approver`, `seller`, `viewer`) · **Operador** (`platform_operators`).

| # | Rota | Arquivo | Público / papel (evidência) | Estado | Evidência do estado |
|---|---|---|---|---|---|
| 1 | `/` | `app/page.tsx` | Anônimo → `LandingPage` (`page.tsx:133`); logado com empresa → redireciona ao painel do papel (`page.tsx:80-88`); sem empresa → cartões | **C** | `components/landing/landing-page.tsx` com 93 `className`, composição própria; `workspace.module.css` |
| 2 | `/login` | `app/(auth)/login/page.tsx` | Anônimo | B | `AccessCard` (wrapper de `Card` + `access.module.css`), `Button`, `Field`/`Input` (`login/page.tsx:9-12`) |
| 3 | `/register` | `app/(auth)/register/page.tsx` | Anônimo, se o autocadastro estiver aberto (`register/page.tsx:3`) | B | `AccessCard` |
| 4 | `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | Anônimo | B | `AccessCard`, `Field` |
| 5 | `/reset-password` | `app/(auth)/reset-password/page.tsx` | Link de e-mail | B | idem |
| 6 | `/auth/implicit` | `app/auth/implicit/page.tsx` | Retorno do login | B | `AccessFrame` |
| 7 | `/convite/aceitar` | `app/convite/aceitar/page.tsx` | Autenticado com convite (`page.tsx:28`) | B | `AccessFrame`, `Button`, `CardContent` |
| 8 | `/account` | `app/account/page.tsx` | Autenticado (`requireTenant`, `:22`) | B | `workspace.module.css`, `MonitoringCard`, `Stat` |
| 9 | `/admin` | `app/admin/page.tsx` + `app/admin/layout.tsx` | Operador (`requireOperatorPage`, `:20`) | B | `platform.module.css`; cabeçalho próprio no layout, sem `AppShell` |
| 10 | `/admin/convites` | `app/admin/convites/page.tsx` | Operador (`:16`) | B | `platform.module.css`, `Badge`, `Card`, `EmptyState` |
| 11 | `/admin/empresas/nova` | `app/admin/empresas/nova/page.tsx` | Operador (`:9`) | B | `platform.module.css`; formulário em `nova-empresa-form.tsx` (não aberto, **não confirmado**) |
| — | `/admin/empresas` | `app/admin/empresas/page.tsx:7` | redireciona a `/admin` | — | — |
| 12 | `/approvals` | `app/approvals/page.tsx` | Fila: `requireApprovalQueue` (`:37`); consulta ao birô por `bureau.consult` (`:106`) | B | `FinanceRequests` (`requests.module.css`, 56 linhas), `Skeleton` |
| 13 | `/solicitacoes/[id]` | `app/solicitacoes/[id]/page.tsx` + `painel-aprovacao.tsx` (484 linhas) | Fila (`:51`) | B | `FinanceRequestDetail` (`request-detail.module.css`), `Badge`, ícone de `shell/icons` |
| 14 | `/customers` | `app/customers/page.tsx` | admin, director, analyst, seller (`:21`) | B | `monitoring.module.css`, `Stat`, `CustomerRegistry` |
| 15 | `/customers/[id]` | `app/customers/[id]/page.tsx` | admin, director, analyst, approver (`:46`) | B | `monitoring.module.css`, `MonitoringCard`, `Badge`, `EmptyState` |
| 16 | `/history` | `app/history/page.tsx` | admin, analyst, approver, director (`:47`) | B | idem + linha do tempo própria (`monitoring.module.css:28-31`) |
| 17 | `/integrations` | `app/integrations/page.tsx` | `integrations.view` (`:18`) | B | `workspace.module.css`, `Skeleton` |
| 18 | `/integrations/[id]` | `app/integrations/[id]/page.tsx` (251 linhas) | `integrations.view` (`:43`); edita com `settings.general` (`:129`) | B (alto) | **`<table>` cru** (`:199`); 43 `className`; jargão "Frescor agora" (`:158`) |
| 19 | `/monitoring` | `app/monitoring/page.tsx` | `portfolio.monitor` (`:18`) | B (alto) | `OverviewView`/`portfolio-dashboard.tsx` com busca e filtro crus (`:99-100`); `ProvenanceBar`; erro mostrado como `EmptyState` (`:43-46`) |
| 20 | `/monitoring/carteira` | `app/monitoring/carteira/page.tsx` → `components/monitoring/carteira-view.tsx` | `portfolio.monitor` (`:25`) | B (alto, criticada pelo Marcos) | tela com mais primitives (`Table`, `FilterTabs`, `FilterBar`, `Meter`, `Badge`), mas o cabeçalho tem as etiquetas que o Marcos reprovou (`carteira-view.tsx:150-158`) |
| 21 | `/monitoring/biro` | `app/monitoring/biro/page.tsx` | `portfolio.monitor` (`:21`) | B | `SourceTag`, `MonitoringCard` |
| 22 | `/proposal` | `app/proposal/page.tsx` | Autenticado; cria link com `proposal.create` (`:24`) | B | `PublicProposalLinkCard`, `workspace.module.css` |
| 23 | `/p/[token]` | `app/p/[token]/page.tsx` + `proposal-form.tsx` | **Anônimo** (prefixo `/p` em `lib/proxy-public-routes.ts`) | B (alto) | `FinancePublicFrame`, `public-form.module.css`, `Field`/`Input`/`MoneyInput`/`Select`/`Textarea`; **PDF** em `Input type="file"` (`proposal-form.tsx:105-110`); honeypot cru (`docs/design-system.md` §5) |
| 24 | `/settings` | `app/settings/page.tsx` | Autenticado (`:28`), índice filtrado por capacidade | B | `settings.module.css` (`.catalogCard`) |
| 25 | `/settings/approval` | `app/settings/approval/page.tsx` + `fluxo-designer.tsx` | Autenticado; edita com `policy.edit` (`:16`) | B (alto) | **`<input>` e `<select>` crus** (`fluxo-designer.tsx:202`, `:224`) |
| 26 | `/settings/audit` | `app/settings/audit/page.tsx` | admin, director (`:68`) | B | `settings.module.css`, `Badge`, `Card`, `Stat` |
| 27 | `/settings/company` | `app/settings/company/page.tsx` + `content.tsx` | Autenticado; 12 abas por capacidade (`lib/settings/company-tabs.ts:11-22`) | B | **navegação de abas própria** (`company/page.tsx`, `<nav … className={styles.companyNav}>`), apesar de existir `ui/tab-nav.tsx`. As abas Birô (`app/settings/bureau/bureau-manager.tsx`) e Motivos (`app/settings/motivos/motivos-manager.tsx`) só existem aqui |
| 28 | `/settings/general` | `app/settings/general/page.tsx` | admin (`:15`) | B | `settings.module.css` |
| 29 | `/settings/notifications` | `app/settings/notifications/page.tsx` | admin, director (`:79`) | B (alto) | **abas manuais** com `role="tab"` e sem setas (`notifications-manager.tsx:167-169`); **checkbox e números crus** (`stalled-settings.tsx:23-25`) |
| 30 | `/settings/onboarding` | `app/settings/onboarding/page.tsx` | admin, director (`:48`) | B | `settings-operations.module.css` |
| 31 | `/settings/public-form` | `app/settings/public-form/page.tsx` | admin (`:7`) | B | `public-field-builder.tsx` |
| 32 | `/settings/sellers` | `app/settings/sellers/page.tsx` | admin (`:19`) | B | `settings-operations.module.css` |
| 33 | `/settings/users` | `app/settings/users/page.tsx` | admin (`:21`) | B | idem |
| — | `/settings/roles-permissions` | `app/settings/roles-permissions/page.tsx:4` | redireciona à aba da Empresa | — | — |
| 34 | `/styleguide` | `app/styleguide/page.tsx` (534 linhas) | **Anônimo** de propósito (`proxy.ts:21`) | **A** | vitrine dos 19 primitives; 13 imports de `ui/` |
| 35 | `/styleguide/finance` | `app/styleguide/finance/page.tsx` | Anônimo | **C** | demonstração com cabeçalho em classes arbitrárias (`:15`) e dados fictícios |

Estados de sistema (não são rotas):
- `app/not-found.tsx` e `app/error.tsx` usam `FallbackPage` + `Button`, o que equivale a A.
- `app/global-error.tsx` tem `<button>` cru (`:41`), justificável porque roda sem o layout.
- `app/p/[token]/error.tsx` e `not-found.tsx` não foram abertos (**não confirmado**).

---

## 2. Telas não migradas: o que serve no DS, o que falta e o risco

### 2.1 Divergências dos primitives em relação aos contratos (afetam todas as telas)

| Contrato DS | Primitive Xscore | Divergência medida |
|---|---|---|
| `card.yaml`: "Sem sombra em repouso" | `components/ui/card.tsx:24` `shadow-[var(--shadow-sm)]`; os módulos repetem a sombra (`monitoring.module.css:5`, `settings.module.css:7,20`, `access.module.css:12`, `platform.module.css:28`) | diverge |
| `status-badge.yaml` (neutral/success/error; texto comunica o estado) | `components/ui/badge.tsx` com 7 tons, `whitespace-nowrap` (`:63`), `px-2.5 py-1 text-[12px]` (`:37`) | a fileira não quebra; etiqueta de origem e de problema têm o mesmo peso (critério do Marcos) |
| `empty-state.yaml` (empty **e error**; "toda variante comunica conteúdo e próximo passo") | `components/ui/data-display.tsx:105` sem variante de erro | erro vira "vazio": `app/monitoring/page.tsx:43-46` |
| `data-table.yaml` | `components/ui/table.tsx` (228 linhas, mais rico que o contrato) | os módulos sobrescrevem as células por fora (`monitoring.module.css:18-21`: `padding: 14px 16px`) |
| `button.yaml` (primary/secondary/danger) | `components/ui/button.tsx` (+ `ghost`) | `ghost` fora do contrato; os módulos forçam `min-height` em todo `button` (`monitoring.module.css:33`) |
| `field.yaml` (text/search; "erro identificável sem cor") | `components/ui/field.tsx` (Input, MoneyInput, Select, Textarea) | Select, MoneyInput e arquivo estão fora do contrato; conformidade **não confirmada** (casos de teste não rodados) |
| `confirm-dialog.yaml` | `components/ui/modal.tsx` (`ConfirmDialog`) + `components/ui/confirm.tsx` (assinatura inline) | a assinatura de crédito **não pode** virar modal (D-M14-4, `docs/design-system.md` §5) |
| `stat-card.yaml` | `Stat` em `data-display.tsx`; os módulos redefinem `.metric` (`monitoring.module.css:26-27`) | camada dupla |

### 2.2 Textos e etiquetas contra o critério do Marcos (16/11)

| Critério | Evidência no código |
|---|---|
| Etiqueta só para estado, com cor de sentido | `components/monitoring/source-tag.tsx:8` usa etiqueta para **origem** ("Interno · Gescor" em neutro). `lib/integrations/freshness-view.ts:62` mostra "Posição da origem não informada" com tom `neutral`, mas o problema trava a cobrança. Resultado: mesmo cinza para metadado e para problema |
| Problema = o quê + consequência + próximo passo | a consequência ("a cobrança fica travada") só aparece no `title` (dica ao passar o mouse, invisível no toque) em `carteira-view.tsx:158` |
| Nada repetido | `components/monitoring/provenance-bar.tsx:24-25`: o mesmo `freshness.detail` sai no `title` e de novo em texto; GESCOR aparece na etiqueta e em "Fonte:" (`carteira-view.tsx:154-156`) |
| Sem jargão para o usuário final | "Frescor", "Posição da origem", "carga" (`freshness-view.ts:59-74`, `integrations/[id]/page.tsx:158`) |
| Uma família de fonte no texto corrido | `.numeric` (mono) no meio da frase (`provenance-bar.tsx:21`, `carteira-view.tsx:156`) |
| Cor sem redundância decorativa | emoji 🟢⚪🟡🔴 dentro da etiqueta que já tem tom de cor (`freshness-view.ts:68-74`) |

### 2.3 Por grupo de telas

| Grupo (rotas) | Componentes que já servem (contratos DS → primitive local) | Lacunas no DS | Risco |
|---|---|---|---|
| **Acesso** (2–7) | Card, Field, Button, EmptyState/ErrorState para recusas | sem contrato de "moldura de acesso" e sem asset de logo consumível em React | **Médio.** Não mudar handlers, redirecionamentos, códigos de recusa, limite de tentativas nem checagem de convite (S2 do Finance) |
| **Monitoramento** (19–21) | StatCard, DataTable, StatusBadge, EmptyState (erro) | **sem contrato de Aviso/Alert** com próximo passo; sem FilterTabs, FilterBar, Meter, Pagination nem "ver detalhes" (disclosure existe só como JS do DS); StatusBadge sem `warning`/`info` | **Baixo nas regras** (telas de leitura). **Alto na percepção**: é onde o Marcos já reprovou. Não mudar números, filtros na URL, `Money` com `—` para `null` nem o rótulo "Limite" do ERP |
| **Clientes e histórico** (14–16) | DataTable, Card, StatusBadge, EmptyState | sem contrato de Timeline (eventos com `<time>`) | Baixo. Não mudar ordem nem texto dos eventos (`lib/approval/eventos`) |
| **Integrações** (17–18) | DataTable, StatusBadge, Card | DataTable sem atributo por linha (`aria-current`, motivo do `<table>` cru: `docs/design-system.md` §5); sem TabNav no DS | Médio: tela de operação, e a frequência altera quando a cobrança pausa |
| **Configurações** (24–33) | Field, Button, Card, DataTable, ConfirmDialog | sem contrato de Tabs, Checkbox, Toggle/chip, Select nem Segmented | **Médio-alto em `/settings/approval`**: define quem decide crédito (alçada validada no banco, ADR-0024). Médio em notificações: destinatário por tenant (M12). Baixo nos demais |
| **Admin** (9–11) | Card, StatusBadge, Button, EmptyState | — | Médio: guardas de operador e escrita byte-idênticas (S6) |
| **Formulário público** (22–23, 31) | Field, Button, Card, EmptyState/ErrorState | **sem contrato de campo de arquivo/PDF**; sem MoneyInput no DS | **Alto**: anônimo, upload de PDF de até 10 MB, honeypot, link que expira em 30 dias (P1-06), ordem dos campos recém-mudada (#331) |
| **Fila e decisão** (12–13) | DataTable, StatusBadge, Card, Button | sem contrato de confirmação inline (assinatura append-only), de Segmented (verbo da decisão) nem de TierBadge | **Máximo**: decisão de crédito assinada, quórum, pré-requisitos (`lib/approval/decisao-humana`), dinheiro como string decimal. A "decisão simplificada" acabou de entrar (#331) |
| **Pública de marketing** (1, 35) | Button | o DS não tem padrão de página de marketing para o Xscore | Baixo técnico; depende de direção visual do Marcos |

---

## 3. Ondas propostas (9)

Regras comuns a toda onda:
- **Critério de pronto verificável:**
  - `npm run verify` verde (typecheck, testes, **build**) e `npm run lint -w web`;
  - `BASE_REF=origin/main bash scripts/check-abolished-terms.sh` verde e `grep skipped` = 0;
  - testes de `apps/web/lib/brand/*` verdes (contraste, hex, token indefinido, movimento, forma dos primitives);
  - capturas antes e depois em **320/768/1024/1440 × claro/escuro** anexadas na PR (o e2e é local, fora do CI: `docs/design-system.md` §9);
  - prova de fronteira `git diff --quiet origin/main HEAD -- apps/web/lib supabase packages workers` (só testes novos e textos autorizados podem escapar, listados na PR);
  - Revisor APROVA; aceite visual do Marcos; merge do Marcos.
- **O que nunca muda:**
  - regras de negócio, guardas, `can()`, server actions, loaders, migrations;
  - rotas e parâmetros de URL (`nav-items.ts` continua a fonte única);
  - dinheiro como string decimal; ausência ≠ zero;
  - termos abolidos do gate (`scripts/abolished-terms.txt`: `decision_tier`, `risk_tier`, `recommended_action`, `credit_facilit*` fora do espelho, `workflow_`, `tenant_roles`, `components.min.css`, `brands/electia|emprega-mais|pdv`…);
  - nenhum token redeclarado no app; nenhum valor de token novo antes de 10/12.

| Onda | Escopo | Por que nesta posição | Pronto quando (além do comum) | Não pode mudar |
|---|---|---|---|---|
| **O1 — Fundação (sem mudança visual)** | Bump `#v2.9.0 → #v2.10.0` (package e lock); `/styleguide` passa a rodar os casos de teste dos 8 contratos contra os primitives; baseline de capturas das telas-chave | risco zero (mesmo blob de tokens) e destrava medir conformidade | capturas antes = depois, pixel a pixel, nas telas-chave; lista "contrato × caso × passa/falha" publicada | nenhum visual |
| **O2 — Primitives conformes** | `Badge`: quebra de linha, espaço interno e só estado; `EmptyState` com variante `error`; `Card` sem sombra em repouso; registro em `docs/design-system.md` | uma PR corrige todas as telas de uma vez; sem regra de negócio | casos `badge-*`, `empty-*`, `card-*` passam; telas de erro usam `error` (ex.: `monitoring/page.tsx:43-46`) | API dos primitives compatível; `TierBadge` sempre com número |
| **O3 — Monitoramento** (19–21) | proveniência em texto simples; um aviso (o quê + consequência + próximo passo); detalhe em "ver detalhes"; sem emoji, sem repetição, sem mono no meio da frase | maior impacto visível, telas de leitura, crítica direta do Marcos | os 6 critérios de §2.2 conferidos por captura; "posição não informada" vira aviso de atenção | cálculos, filtros, colunas, `Money`, ordenação, link "Explorar carteira" |
| **O4 — Acesso e erros** (2–7 + fallback) | `AccessFrame`/`AccessCard` no contrato Card; logo do DS (se o Marcos aprovar, §4); recusas com ErrorState | primeira impressão de todo usuário; regras simples | fluxos de login, convite e senha com os mesmos testes; teclado (Tab/Enter) | handlers, redirecionamentos, códigos de recusa, limite de tentativas |
| **O5 — Cadastros e leitura** (8, 14–16, 22, 24, 26–28, 30, 32–33) | remover sobrescritas de primitive dos módulos; aba da Empresa com `TabNav`; linha do tempo única | muitas telas, risco baixo | 0 seletor de módulo que alcance o interior de primitive (`.x button`, `.x th`) nessas telas | managers byte-idênticos; permissões de link (`proposal.create`) |
| **O6 — Configurações com controle cru** (18, 25, 29) | notificações: `Tabs` e `Field`/`Checkbox`; fluxo: `Select` e chip; integração: `Table` com atributo por linha | mexe em formulários que gravam configuração; precisa da O2 pronta | 0 controle cru fora da lista de exceções; setas e Home/End nas abas; mesmos testes de ação | pesos, quórum, publicação, defeito conhecido da faixa 1 (registrado, não corrigido aqui), regras de notificação M12 |
| **O7 — Formulário público** (23, 31) | moldura pública; campo de PDF com estado, erro e nome do arquivo; textos curtos | público anônimo e com arquivo: risco alto, depois de O2 e O6 | envio real ensaiado em preview; erro de PDF > 10 MB e de tipo errado anunciado sem cor; honeypot intacto | `actions.ts`, ordem dos campos (#331), `accept`, expiração do link |
| **O8 — Fila e decisão de crédito** (12–13) | alinhamento visual de `requests` e `request-detail`; `painel-aprovacao` só na casca | risco máximo, por último | assinatura inline continua inline (D-M14-4); decisão de teste ponta a ponta em preview; captura de cada estado da rodada | quem assina, pré-requisitos, append-only, quórum, motivos, valores |
| **O9 — Marketing e demo** (1, 35) | `LandingPage` e `/styleguide/finance` | depende de direção do Marcos; não bloqueia produto | direção aprovada antes do código; política anti-template | nenhum dado real; redirecionamento por papel em `page.tsx:80-88` |

O admin (9–11) entra na O5 com prova byte-idêntica de guardas e escritas, como na S6.

**Sequência recomendada:** O1 → O2 → O3 → O4 → O5 → O6 → O7 → O8 → O9. Cada onda é uma PR. O1 e O2 podem ir juntas se o Marcos preferir menos merges (regra "1 PR por lote").

---

## 4. Bloqueios e decisões

| Item | Fato | Efeito | Saída recomendada |
|---|---|---|---|
| **Versão do pacote** | v2.9.0 → v2.10.0 sem efeito visual (blob idêntico). Os `contracts/*.yaml` **só entram no pacote na v2.11.0** (`DS:CHANGELOG.md`, seção Unreleased: "arquivos novos no pacote: … `contracts/`"), e a v2.11.0 não sai antes de 27/11 (D7, `DS:docs/STATUS.md` DS-14) | até lá, os testes de conformidade da O1 precisam codificar os casos à mão, citando o contrato pelo SHA do DS | O1 com v2.10.0 agora; segunda subida para v2.11.0 quando sair, trocando os casos manuais pela leitura do YAML |
| **Árvore local divergente** | `vendor/*.tgz` e `bc55c15c` só no disco local | quem trabalhar na pasta principal cria PR com tgz e histórico errado | trabalhar sempre em worktree de `origin/main` (`emprega-mais/_worktrees/…` pela regra de worktrees) |
| **Tokens só do brand** | os contratos citam nomes do núcleo (`--bg-surface-1`, `--color-success`, `--space-2`, `--focus-ring-width`, `--text-base`), ausentes no Xscore (conferido: 0 ocorrências em `brands/xscore/tokens/tokens.css` e `ds-bridge.css`). A ponte não traduz todas as superfícies, fontes e raios (`DS:catalog/research/2026-11-16-levantamento-marcas.md:47`) | o adaptador CSS do DS não serve ao Xscore sem núcleo + ponte, e isso traria cascata e colisões | manter brand-only + `ui/` locais conforme a ADR-0004:18; o mapeamento de nomes do contrato para tokens Xscore fica num teste. **Decisão do @architect** (recomendação: manter) |
| **Escala de espaçamento** | o brand Xscore não tem `--space-*`; os módulos têm 549 `px` | "intenção no espaçamento" fica sem token | não criar token antes de 10/12 (DS-18/19); por ora, padronizar `px` nos primitives; token de espaçamento entra no DS depois de 10/12 |
| **Gate do repo** | `components.min.css` proibido; termos abolidos com baseline que **tem de ficar igual** (`scripts/check-abolished-terms.sh`, cabeçalho) | nenhuma onda pode importar CSS de componente do DS; texto de tela não pode reintroduzir termo | rodar o gate em cada PR |
| **CI** | `.github/workflows/xscore-ci.yml`: typecheck, lint, termos abolidos (busca `origin/main`), testes, build, pgTAP. **Sem e2e nem teste visual** | prova visual é manual (PNG na PR) | manter PNG na PR; e2e visual no CI vira tarefa separada (decisão D-M14-3 vigente) |
| **Deploy** | produção só por `workflow_dispatch` depois de "go deploy" (`CLAUDE.md`, seção Comandos) | cada onda mesclada só chega à produção com ordem do Marcos | incluir no cartão de cada onda |
| **Painel do DS** | E7 Xscore = DS-23 **PENDENTE** ("travas do Xscore verdes; capturas iguais") | o trabalho do Xscore precisa aparecer no painel do DS | registrar as ondas como DS-23 no painel do DS (Supervisor DS) |

**Decisões que só o Marcos toma** (com recomendação):
1. Aprovar ondas e ordem. *(Recomendo O1 → O9 como acima.)*
2. Card sem sombra em repouso, como o contrato manda, em todas as telas. *(Recomendo seguir o contrato; é o que deixa a hierarquia por superfície.)*
3. Logo: asset do DS (`brands/xscore/assets/logo/`, com versão clara e escura) no lugar de `public/finance/xscore-official.svg`. *(Recomendo o asset do DS; não confirmei que é a mesma arte.)*
4. Direção visual da página pública `/` (O9). *(Recomendo deixar por último.)*
5. Manter `/styleguide` e `/styleguide/finance` públicos em produção. *(Recomendo deixar a vitrine pública só em preview; hoje é pública por decisão escrita em `proxy.ts:21`.)*
6. Aceite visual e "merge N" por onda; "go deploy" quando quiser em produção.

A "posição da origem não informada" virar aviso **não precisa de decisão**: o critério do Marcos de 16/11 já cobre.

---

## 5. Não confirmado

- Renderização real: **nenhuma captura foi feita** neste diagnóstico. A classificação vem de leitura estática; semelhança visual não foi usada como prova.
- Onde exatamente a "fileira de etiquetas cortada na borda" acontece. O cabeçalho da Carteira usa `flex-wrap`, mas o `Badge` é `nowrap`; a causa provável fica sem medição.
- Conformidade de cada primitive aos casos de teste dos contratos (não rodados).
- Conteúdo de `nova-empresa-form.tsx`, de vários `*-manager.tsx`, de `p/[token]/error.tsx` e de `not-found.tsx` (lidos só pelos imports ou pelas contagens).
- Que a produção (Lightsail) roda o mesmo `7cbb2ce`.
- Que o `npm ci` do CI e do `Dockerfile` resolve a tag v2.10.0 sem ajuste. O repo do DS é público (`private: false` pela API), o que torna isso provável.
- Equivalência da arte de `xscore-official.svg` com os SVG do DS.
- `tarefas.md` do Xscore: não existe na árvore copiada (`find` vazio).
- Firefox, Safari, leitor de tela e Lighthouse: não realizados.
- A normalização que mostrou 0 diferença entre os tokens da v2.10.0 e da `main` do DS é minha (122 declarações). Não substitui a prova byte a byte do DS.
