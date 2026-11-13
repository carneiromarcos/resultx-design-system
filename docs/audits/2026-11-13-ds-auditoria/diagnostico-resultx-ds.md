# ResultX Design System — Auditoria, arquitetura-alvo e plano para o IMO

**Data:** 13/11/2026 · **Coordenação:** Orion (Supervisor DS · ResultX) · **Modo:** somente leitura (nenhum repositório, banco ou deploy alterado)
**Versões auditadas (origin/main após fetch em 13/11):** ResultX DS `6083ce3` (pacote v2.9.0) · Electia `ef41e5d6` · Emprega+ IMO `7da075c6` · Xscore (workspace) `35921bf5`
**Anexos com evidência linha a linha:** `anexos/A-stacks-e-consumo-do-ds.md` (@architect) · `anexos/B-inventario-electia.md` (@ux-design-expert) · `anexos/C-inventario-imo.md` (@analyst)

Convenção: **[C]** confirmado no código ou no site no ar (arquivo:linha ou comando no anexo) · **[H]** hipótese não verificada.

---

## 0. Resumo para decisão (2 minutos)

1. **O problema não é falta de componentes, é falta de um idioma comum.** O DS tem tokens bons e uma ponte de marca que mede contraste, mas **nenhum produto usa a camada principal de componentes do DS** (`components.css`; a Electia importa só os cartões de dados `data-cards`) [C], e cada produto chama a mesma coisa por um nome diferente ("fundo de card" tem 4 nomes nos 4 lugares) [C]. Sem idioma comum, cada agente reinventa localmente.
2. **Electia é a melhor referência de experiência, mas não é modelo de código.** Copiar a *gramática* (escala de texto 11/13/15/17/24, base 4px, raios 8/12/16/pílula, superfícies planas, controles 32/40px, Modal acessível). Não copiar nomes que mentem (`--accent-teal` é roxo, 436 usos), 9 abas diferentes, 5 diálogos, 49 tabelas soltas e 738 cores da paleta Tailwind que causam as reprovações de contraste [C].
3. **O IMO já está ligado ao DS pelo lado certo, só pela metade.** O arquivo de tokens `eds-root.css` é idêntico ao do DS [C]. Mas os componentes são três camadas sobrepostas (Bootstrap do template, `.jl-*` do Emprega+, admin ~94% Bootstrap/Metronic) [C]. Os maiores riscos de migração estão fora das views: ~55 tabelas Livewire com classes em PHP, 2.133 chamadas `Form::` em 254 views (808 delas de campo; `grep -roh 'Form::' resources/views | wc -l`) e 116 seletores JS presos a classes visuais [C].
4. **Arquitetura proposta reaproveita o que existe:** tokens numa fonte única estruturada que gera os arquivos de cada stack; vocabulário semântico único (aceitar a ADR-0001, parada); temas por marca como camada fina; contratos de componente testáveis; adaptadores finos (React para Electia/Xscore, componentes Blade para o IMO). Nada é reconstruído do zero.
5. **Plano:** piloto numa única família de telas do IMO (lista de vagas e candidatos do empregador — reúne tabela, filtro, KPI, modal, estado vazio e o risco das tabelas Livewire). Só depois do piloto aprovado, ampliar. Respeita as travas já combinadas: F3 aguarda o gate MySQL; F2/`eds-root` só depois da janela de recurso de 10/12 do EditalHub.
6. **Decisões D1, D2 e D3 aprovadas pelo Marcos em 13/11** (§11): vocabulário único (ADR-0001), fonte única estruturada de tokens e tela piloto. Parecer do Revisor (13/11): APROVA COM RESSALVA; ressalvas incorporadas nesta versão (§12).

---

## 1. Relatório de auditoria da Electia (entregável 1)

Detalhe completo: anexo B. Síntese e correções ao que se sabia:

### 1.1 Stack
Next 16.4.3, React 19.3.1, Tailwind v4, lucide-react, clsx+tailwind-merge; sem shadcn/Radix. Consome o ResultX DS por tag git `#v2.9.0`, mas **só tokens + ponte da marca + `data-cards`** [C].

### 1.2 O que vira padrão compartilhado
| Família | Veredito | Por quê |
|---|---|---|
| Escala de texto 11/13/15/17/20/24 | PADRÃO (em token) | Escala de UI densa, consistente em ~3.100 usos |
| Base 4px; ritmo 8/12/16/24 | PADRÃO | `gap-2` 703, `gap-3` 416 |
| Raios 8/12/16/pílula; superfícies planas em 3 níveis + borda 1px | PADRÃO | Card sem sombra; sombra só em overlays |
| `Modal` (foco preso, Esc, devolução de foco, trava de rolagem) | PADRÃO | Componente mais maduro do app |
| `PageMessages` (status/alert com live region), `StatusBadge` (tons com contraste por tema) | PADRÃO | Já ajustados para AA |
| Anel de foco global `focus-visible` | PADRÃO | Unificar com o do DS (2px × 3px) |
| Movimento só transform/opacity + `prefers-reduced-motion` global; tabela `sr-only` por trás de gráficos | PADRÃO | Boa prática rara |
| Barra de filtros com estado na URL; paginação por cursor | PADRÃO | Vira `FilterBar` e `CursorPager` |
| Ícones: uma biblioteca por produto, tamanhos em escala e `aria-hidden` | PADRÃO (contrato neutro) | O contrato não escolhe biblioteca. Lucide é a escolha da Electia; o IMO mantém Font Awesome (§5 linha 21) |
| Button, campos, Card, KPI, Sidebar, tabela do recrutamento | PADRÃO COM AJUSTE | Ajustes listados no anexo B §18(a) |

### 1.3 Específico da Electia (não universalizar)
Tema escuro por padrão; degradê roxo→azul e brilho no CTA; Sora no H1 e Mono nos números; cores de teoria (DISC, Big Five, Eneagrama…) e zonas NR-1; tons `progress`/`human` da Exa; orbe da Nexus; navegação por jornada de RH. Entram no **tema da marca Electia** ou no **domínio Electia**, nunca no núcleo.

### 1.4 Dívidas da Electia que não devem ser copiadas (top 10)
1. Nomes que mentem e três vocabulários convivendo (`--accent-teal` roxo, crescendo: 296 → 436 desde agosto; 765 `border-border` estilo shadcn) [C].
2. **Tamanhos dependem da ordem do CSS:** os tokens do DS entram sem `@layer` e passam por cima do Tailwind — `rounded-lg` = 12px, `text-sm` = 13px. **Confirmado no CSS que está no ar** [C]. Copiar classes da Electia para outro app muda todos os tamanhos; o contrato precisa ser escrito em tokens.
3. 738 classes da paleta crua do Tailwind e 62 sombras arbitrárias → reprovações: selo "em breve" 1,38:1 no claro, Bem-estar ativo 4,27:1, botão danger 4,29:1 [C, cálculo].
4. 128 tamanhos de fonte arbitrários, alguns de 8–9,5px [C].
5. 5 implementações de diálogo; 2 sem `role`, sem Esc e sem foco preso [C].
6. 9 implementações de abas; 4 cópias da barra de filtros [C].
7. 49 tabelas soltas com 6 receitas de cabeçalho [C].
8. Campos sem `aria-invalid`/`aria-describedby`; `id` derivado do rótulo (colide); `error=` usado em 2 de 155 Inputs [C].
9. Animação ilusória: `animate-in` sem plugin — o modal não anima [C].
10. Três vitrines locais de design system (uma com nome errado `desing-system`) e duas paletas de teoria paralelas (hex+emoji × OKLCH) [C].

### 1.5 Correções ao que se sabia
| Afirmação anterior | Hoje |
|---|---|
| "Electia tem accent teal" | **Não tem.** Acento é roxo `#6f32b1`; o nome `accent-teal` é herança [C] |
| "Botão de login 2,49:1" | Não reproduz: hoje 7,59:1. Caso próximo é texto roxo sobre fundo escuro (2,55:1) [C] |
| "~290 hex fixos" | Depende do recorte. A métrica oficial deve ser a **catraca da própria Electia: 491 cores cruas, 83 hex, 113 textos com tamanho arbitrário em 79 arquivos** [C]. Contagens soltas por grep variam de 47 a 1.042 conforme incluam testes/API/e-mail/PDF |
| "Fonte provavelmente na fonte do sistema" (hipótese levantada hoje) | **Descartada.** O CSS no ar registra `@font-face` com os nomes literais "Inter" e "Sora", que o `font-sans` alcança [C, CSS de produção baixado em 13/11] |

---

## 2. Diagnóstico do ResultX DS atual (entregável 2)

Fase 3 completa no anexo A §5. Causas, por impacto:

| # | Causa | Evidência | Status |
|---|---|---|---|
| C1 | **Camada principal de componentes sem consumidor** (`components.css`: 2.658 linhas + 18 arquivos + 9 JS; nenhum produto importa — a única exceção é a Electia, que importa só `components/data-cards`) | Electia `globals.css:14,22,23`; Xscore `globals.css:18`; IMO nem instala o pacote | [C] |
| C2 | **Quatro dialetos de token para o mesmo papel** — fundo de card: `--bg-surface-2` (DS) · `--bg-card` (Electia, 656 refs) · `--surface-1` (marcas Electia/Xscore dentro do DS) · `--eds-surface`/`--bs-*` (IMO) | anexo A §5 C2 | [C] |
| C3 | **Tokens do DS sobrescritos**: Electia redefine 12 nomes do núcleo depois do import; IMO regrava `--eds-indigo` com a cor do cliente; Xscore tem 26 colisões latentes com valores diferentes | anexo A §2.3, §3.3, §4.3 | [C] |
| C4 | **Nomes que mentem; ADR-0001 parada em "Proposed"** (`--accent-teal` roxo; `--eds-indigo` = qualquer cor) | `docs/adr/0001…:3` | [C] |
| C5 | **Componentes repetidos em cada produto sem contrato comum** (Button existe 2× em React e 2× em Blade/Bootstrap, cada um com anatomia, estados e foco próprios) | anexo A §5 C5 | [C] |
| C6 | **Componentes do DS são classes globais sem prefixo** (`.btn`, `.card`, `.modal`): colidem com Bootstrap e não entram em React+Tailwind | `components.css`; IMO 678 `btn-*` | [C] acoplamento · [H] que isso explique a não adoção |
| C7 | **Documentação ≠ código**: README diz que o JSON é a fonte, o build trata o CSS como fonte; JSON com 85 entradas legadas × 199 variáveis no CSS; `DESIGN-SYSTEM.md` em v2.1.1 com tokens inexistentes; `docs/imo-ds.md` descreve a arquitetura anterior a 21/09 | anexo A §1.3, §1.5, §3.6 | [C] |
| C8 | **Sem contrato executável nem teste visual de componente**: o único teste visual cobre a página de preview, não roda no CI e só tem capturas de Mac; `.btn-success` escuro = 1,93:1 sem teste que acuse | `tests/visual/preview.spec.js`; `components.css:479-481` | [C] |
| C9 | **Agentes não recebem a regra onde mais programam**: AGENTS.md da Electia (405 linhas) e do IMO não citam o DS; só o Xscore aponta o doc | greps anexo A | [C] ausência · [H] causalidade dos artefatos paralelos |
| C10 | **Governança permite mudar sem revisão**: sem CODEOWNERS; release-gate só avisa; pasta `.husky/` inexistente (hooks locais nunca rodam); produtos travam tag sem aviso de nova versão; `npm-publish.yml` contradiz a decisão "tag git, não npm" | anexo A §1.5, C10 | [C] · [H] proteção de branch (não consultada) |
| C11 | **Duas fontes para a mesma marca Emprega+ dentro do DS** (`--emp-*` para a ponte, `--eds-*` para Laravel); paridade testada só para 3 cores | `tests/eds-root.test.js:52-55` | [C] |
| C12 | **Breakpoints e escalas sem token**: `--bp-*` comentado; produtos com grades diferentes (992×1024; 1200×1280); IMO sem token de espaço, fonte, z-index, duração | `tokens-base.css:114-118`; anexo C §2.2 | [C] |

**O que já funciona e deve ser preservado:** tokens em CSS custom properties (independentes de framework); ponte de marca declarativa com contraste medido no build (falha abaixo de 4,5:1); trava por SHA da cópia do `eds-root`; catraca da Electia; travas do Xscore (`hardcoded-color`, `undefined-token`, `contrast`). O Xscore é o único produto limpo (2 hex) — por disciplina local, não por contrato do DS.

---

## 3. Diagnóstico das divergências do IMO (entregável 3)

Detalhe: anexo C.

### 3.1 Estrutura atual
| Camada | O que é | Onde vale |
|---|---|---|
| Tokens `--eds-*` | Cópia byte-idêntica do DS (Camada 1: cores, superfícies, 6 raios, sombras, anel, fontes) | todas as áreas, exceto `layouts.auth` |
| Componentes `.jl-*` | DS Emprega+ local, 7.237 linhas em `emprega-ds.css` | candidato, empregador, público (2.948 usos); admin só 293 |
| Bootstrap/template | `style.css` estilo Metronic recolorido; 9.962 `!important` no CSS servido | admin (~94%), grid e formulários de todas as áreas |
| Bootstrap 5.1.3 público | Carregado **duas vezes** no site público | público |
| White-label | Bloco `<style>:root` colado em 5 layouts quase iguais (`brandPrimaryColor()`) | todas |

IMO roda **Laravel 12** (não 10). `jl-*` é o DS Emprega+, não o template.

### 3.2 Divergências principais em relação à gramática Electia
| Tema | IMO hoje | Gramática Electia/DS |
|---|---|---|
| Tamanhos de fonte | 51 (CSS próprio) / 66 (views), **nenhum via token** | 6–7 tamanhos em token |
| Espaçamentos | 77 / 92 valores distintos | base 4px |
| Raios | 22 / 24 | 4 (8/12/16/pílula) |
| Botões | `btn` 730 × `jl-btn` 250 (dois idiomas) | 1 componente, 4 variantes × 3 tamanhos |
| Modais | Bootstrap; componente `admin-modal-*` cobre 91 modais (boa alavanca) | Modal acessível único |
| Tabelas | ~55 tabelas Livewire (rappasoft) com classes em PHP | base única de tabela |
| Feedback | 3 bibliotecas de toast (SweetAlert2, iziToast, toastr), sem token | `PageMessages`/`Alert` por tom |
| Ícones | Font Awesome 6 (1.842 usos) | Lucide — **trocar não é prioridade**; contrato pede tamanho e semântica, não a biblioteca |
| Tema escuro | admin troca folhas inteiras; público usa `data-theme`; escuro do template ainda é teal | tokens por tema |
| Breakpoints | 11 valores diferentes | 4, em token |

### 3.3 Defeitos objetivos em main (independentes de estética)
- Ainda abertos da lista de 12/11: select2 branco no escuro (pele do DS só vale no site público); botão primário teal com texto branco ≈1,84:1 no escuro do template; borda de input escura 1,58:1; `layouts.auth` (`auth.login`, `passwords.email`) sem `eds-root` [C].
- `var(--eds-primary)` usado sem declaração nem reserva; outros 10 tokens inexistentes com hex de reserva [C].
- Admin: texto do botão usa `--eds-on-accent` (#fff fixo) → marca clara de cliente fica ilegível [C].
- 9 folhas CSS linkadas que não existem no código (ex.: `header-padding.css` em 34 views) [C no código · H em produção].
- Fatia 1 está em main com testes; Fatia 3 não [C].

---

## 4. Inventário de tokens e componentes (entregável 4)

### 4.1 Tokens — quem define o quê
| Papel | DS núcleo | Ponte de marca | Electia (app) | Xscore | IMO |
|---|---|---|---|---|---|
| Fundo página | `--bg-base` | — | `--bg-primary` | `--bg` | `--eds-canvas`/`--bs-body-bg` |
| Fundo card | `--bg-surface-2` | — | `--bg-card` | `--surface-1` | `--eds-surface` |
| Acento/ação | `--accent-primary` | `--accent-primary` por marca | `--accent-teal` (roxo) | `--gold` | `--eds-indigo` (cor do cliente) |
| Texto sobre acento | `--accent-primary-text` | medido ≥4,5 | branco implícito | escuro | `--eds-on-brand` / `--eds-on-accent` (fixo) |
| Borda de controle | `--border-control` (v2.7) | — | `--border-default` (1,37:1) | próprio | `--eds-border-input` (1,58:1 escuro) |
| Foco | `--focus-ring-*` 3px | — | 2px `#a55eea` | próprio | F1: duas cores |
| Escala de texto | `--text-xs..3xl` | — | herda do DS (efeito cascata) | 13px próprio | **nenhuma** |
| Espaço | `--space-*` | — | utilitários 4px | utilitários | **nenhum** |
| Raio | `--radius-sm..2xl` | — | herda do DS | 10/14 (colide) | `--eds-radius-*` (6) |
| Duração/easing | `--duration-*`, `--ease-*`, `--spring-*` | — | escritos por extenso | — | **nenhum** |
| Breakpoint | comentado | — | Tailwind | Tailwind | Bootstrap (11 valores) |
| Fontes | Sora/Inter/JetBrains Mono | por marca | Sora/Inter/JB Mono | Plus Jakarta/Sora/Geist Mono | Sora/Inter |

**Faltam no DS para servir aos três:** `--control-height-sm/md/lg`, `--icon-sm/md/lg`, `--header-height` (56 × 60), escala de z-index, breakpoints ativos, anel de foco único, `--duration-fast/normal/slow` usados de fato.

### 4.2 Componentes — onde existe cada um
| Componente | DS (CSS) | Electia | Xscore | IMO |
|---|---|---|---|---|
| Button / IconButton | `.btn` (pílula 44px) | `ui/button` (495 usos) · IconButton à mão | `ui/` | `.jl-btn` + Bootstrap `.btn` |
| Field/Input/Select/Textarea | `.form-*` | `ui/input`, `ui/select`, `ui/textarea` | `ui/` | `.jl-input`… + `form-control` via `Form::` |
| Checkbox/Radio/Switch | parcial | `ui/checkbox` + 42 crus | — | `.jl-check`/`.jl-switch` + `form-check` |
| Card | `.card` | `ui/card` (324) | `ui/` | `.jl-card` + `card` Bootstrap |
| StatCard/KPI | `.dl-statcard` | 3 implementações | receitas Finance | `.jl-kpi` |
| DataTable | `.table` | nenhum (49 soltas) | `ui/Table` | rappasoft (~55) + `.jl-table` |
| FilterBar / CursorPager | — | 4 cópias / cursor | — | filtros rappasoft / paginação numerada |
| Modal / ConfirmDialog | `.modal` | `ui/modal` + 4 paralelos | `ui/Modal` | `admin-modal-*` (91) + Bootstrap + SweetAlert2 |
| Drawer | `menu-drawer.js` | gaveta da sidebar | — | — |
| Menu/Popover/Tooltip | parcial | painéis sem ARIA / `title=` 249 | — | Bootstrap dropdown / tooltip 207 |
| Tabs | `.tabs` | 9 implementações | `ui/Tabs` | Bootstrap nav-tabs |
| SidebarNav / AppShell | `.sidebar` | `layout/sidebar` | shell próprio | 3 shells (admin, empregador, candidato); `.jl-sidebar` 0 usos |
| Alert / PageMessages / Toast | `.alert` | `PageMessages` | `ui/Toast` | `.jl-alert` + 3 libs de toast |
| StatusBadge | `.badge` | `ui/status-badge` | `TierBadge` | `components/status-badge` + `badge` |
| Empty/Error/Spinner/Skeleton | parcial | parcial | parcial | `.jl-empty`, `spinner-border`, skeleton admin |

---

## 5. Matriz de pareamento Electia × IMO (entregável 5)

Esforço: **P** ≤2 dias-pessoa · **M** 3–5 · **G** >5 (estimativa de ordem de grandeza, não compromisso). Prioridade: **P0** piloto/defeito · **P1** logo após o piloto · **P2** depois.
Classificação: Compatível · Compatível c/ ajustes · Divergente · Inexistente · Específico do produto.

| # | Elemento | Referência Electia | IMO atual | ResultX DS hoje | Diferença visual/comportamental | Classificação | Reuso direto? | Adaptador? | Esforço | Prior. | Critério objetivo de aceite |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Tokens de cor/marca | ponte Electia + `globals.css` | `eds-root` idêntico + white-label inline (5 cópias) | `eds-root`, ponte Emprega+ | Mesma Camada 1; IMO sem token semântico de "texto sobre a marca" no admin | Compatível c/ ajustes | Sim (tokens) | Não | P | P0 | 1 partial de white-label; texto sobre a marca escolhido por cálculo que garante ≥4,5:1 (ou ajusta o tom da marca) para qualquer cor; teste de varredura sobre uma grade de cores (matiz × luminosidade), não amostra de 5 |
| 2 | Escala tipográfica | 11/13/15/17/20/24 em token | 51/66 tamanhos, 0 em token | `--text-*` existe | IMO sem escala | Divergente | Sim (token) | Não | M | P1 (F2) | ≤8 tamanhos distintos no CSS próprio; 100% dos novos via `var(--text-*)` |
| 3 | Espaço e raio | 4px; 8/12/16/pílula | 77 espaços, 22 raios | `--space-*`, `--radius-*` | idem | Divergente | Sim | Não | M | P1 (F2) | Raios ≤5 valores no CSS próprio; novos espaços só via token |
| 4 | Anel de foco | `focus-visible` 2px | F1 duas cores **em prod** | `--focus-ring-*` 3px | Dois contratos (2 × 3px) | Compatível c/ ajustes | Sim | Não | P | P1 | Um contrato no DS; ≥3:1 nas 4 superfícies × 2 temas |
| 5 | Button | `ui/button` (4 variantes × 3 tamanhos) | `.jl-btn` + `.btn` | `.btn` pílula 44px | IMO em dois idiomas; DS pílula × Electia retangular | Divergente | Não (stacks diferentes) | **Sim — Blade `<x-rx-button>`** | M | P0 | No piloto, 100% dos botões pelo componente; estados default/hover/active/focus/disabled/loading com captura aprovada nos 2 temas |
| 6 | IconButton | à mão | à mão | — | Sem `aria-label` garantido | Inexistente | — | Sim | P | P1 | `label` obrigatório gera `aria-label` (teste falha sem ele) |
| 7 | Field/Input/Select | `ui/input` (40px) | `.jl-input` + `form-control` via `Form::` | `.form-*` | IMO sem `aria-invalid` sistemático; borda 1,58:1 no escuro | Compatível c/ ajustes | Pele por seletor | Sim (Blade `<x-rx-field>`) | M | P0 | Borda ≥3:1 nos 2 temas; erro ligado por `aria-describedby`; zero mudança nos arrays `Form::` no piloto (pele por seletor) |
| 8 | select2 / flatpickr | `<select>` nativo | plugins com `!important`, branco no escuro | parcial (`.jl-site`) | Fora do tema nas áreas logadas | Divergente | Não | Sim (pele global) | P | P0 | No piloto: dropdown e calendário legíveis no escuro nas telas do piloto, com a pele restrita a elas. Pele global só depois do piloto aprovado, com captura antes/depois das demais telas que usam os plugins |
| 9 | Card | `ui/card` r16 p24 | `.jl-card` + `card` | `.card` | Dois vocabulários | Compatível c/ ajustes | Sim (CSS `.rx-card` prefixado) | Blade opcional | P | P1 | `padding` sm/md/lg; sem sombra em repouso; título com nível configurável |
| 10 | StatCard/KPI | 3 implementações | `.jl-kpi` | `.dl-statcard` | Ambos maduros, diferentes | Compatível c/ ajustes | Sim (contrato `dl-statcard`) | Blade | P | P0 | Estados normal/vazio("—")/carregando/link; número com `tabular-nums` |
| 11 | DataTable | `candidate-table` (`aria-sort`, grupo) | rappasoft ~55, classes em PHP | `.table` | Classes presas em PHP | Divergente | Não | **Sim — tema/trait base rappasoft** | G | P0 (1 tabela) → P1 | No piloto, tabela herda tema base sem editar a view; carregando/vazio/erro; leitor de tela lê cabeçalho |
| 12 | FilterBar | `candidate-filters` (URL) | filtros rappasoft | — | — | Compatível c/ ajustes | Não | Sim | M | P1 | `role="search"`; estado na URL; "limpar" visível quando filtrado |
| 13 | Paginação | cursor "Mais antigos →" | numerada (rappasoft) | — | Modelos diferentes por natureza | Específico do produto | — | — | — | — | Manter numerada no IMO; padronizar só visual (token) |
| 14 | Modal/ConfirmDialog | `ui/modal` | `admin-modal-*` (91) + Bootstrap JS + SweetAlert2 | `.modal` | IMO sem `ConfirmDialog` único | Compatível c/ ajustes | Comportamento Bootstrap fica | Sim (pele do `admin-modal-*`) | M | P0 | No piloto: só os modais das telas do piloto recebem a pele (escopo por classe); foco/Esc/devolução por teclado; confirmação destrutiva com tom `danger`. Extensão aos 91 modais do `admin-modal-*` só após o piloto, com captura antes/depois por amostra de cada área |
| 15 | Feedback (toast/alert) | `PageMessages` (status/alert) | 3 libs + `.jl-alert` | `.alert` | 3 sistemas sem token | Divergente | Não | Sim (tema único por token na lib mantida) | M | P1 | Uma lib de toast mantida (outras viram compat); tons por token; live region |
| 16 | StatusBadge | 7 tons AA | `status-badge` (17) + `badge` | `.badge` | Tons sem prova de contraste | Compatível c/ ajustes | Sim (tons) | Blade | P | P1 | Cada tom ≥4,5:1 nos 2 temas (teste) |
| 17 | Tabs | 9 implementações (dívida) | Bootstrap nav-tabs | `.tabs` | — | Compatível c/ ajustes | — | Sim | P | P2 | Variantes link/panel; setas no modo panel |
| 18 | Menu/Tooltip | sem ARIA (dívida) | Bootstrap (ARIA nativo) | parcial | **IMO está melhor** aqui | Compatível | Sim (manter Bootstrap, aplicar pele) | Não | P | P2 | `aria-expanded`; Esc; tooltip também no foco |
| 19 | AppShell/Sidebar | sidebar trilho/peek/gaveta | 3 shells; `.jl-sidebar` 0 usos | `.sidebar` | Estruturas diferentes | Divergente | Não | Sim (Blade `<x-rx-shell>`) | G | P2 | Um shell para candidato e empregador; `aria-current`; gaveta com Esc/foco |
| 20 | Estados vazio/erro/carregando | parcial (`locked-feature`, `error.tsx`) | `.jl-empty`, `spinner-border`, skeleton admin | parcial | Ambos incompletos | Compatível c/ ajustes | Sim (contrato) | Blade | P | P0 | Todo estado vazio tem o quê + próximo passo + ação (regra de UX do Marcos) |
| 21 | Ícones | Lucide | Font Awesome 6 | utilitário neutro | Bibliotecas diferentes | Específico do produto | — | — | — | — | Manter FA no IMO; padronizar só tamanhos (`--icon-*`) e `aria-hidden` |
| 22 | Gráficos | SVG próprio + `viz-tokens` | Chart.js lendo `--eds-*` (empregador ainda com hex) | `--chart-*` | — | Compatível c/ ajustes | Tokens sim | Não | P | P1 | Zero hex no JS dos gráficos; cores lidas de token |
| 23 | Tema escuro | escuro padrão | claro padrão (decisão 12/11); escuro do template teal | temas | **Diferença intencional** | Específico do produto | — | — | — | — | Claro padrão mantido; escuro sem teal e sem plugin branco |
| 24 | Login (`layouts.auth`) | auth com componentes próprios | sem `eds-root` | — | Fora do sistema | Divergente | Sim | Não | P | P1 | `auth.login` e `passwords.email` carregam o mesmo partial de DS |
| 25 | Cores de teoria, Exa, Nexus | domínio | — | `viz` Electia | — | Específico do produto | — | — | — | — | Fora do escopo do IMO |

---

## 6. Arquitetura proposta do ResultX DS (entregável 6)

Princípio: **uma fonte, muitos artefatos; contrato antes de código; marca como camada fina.** Reaproveita o DS atual em vez de reconstruir.

```
┌────────────────────────────────────────────────────────────┐
│ 1. FOUNDATION   princípios · a11y · composição · voz       │  docs (existentes, revisados)
├────────────────────────────────────────────────────────────┤
│ 2. TOKENS       primitivos → semânticos → de componente    │  fonte única estruturada (DTCG JSON)
│                 ↓ gerador (Style Dictionary)               │
│   tokens.css · eds-root.css · @theme Tailwind · tokens.ts  │  artefatos gerados, nunca à mão
├────────────────────────────────────────────────────────────┤
│ 3. BRAND THEMES  electia · emprega-mais · xscore · resultx │  sobrescrevem só semânticos
├────────────────────────────────────────────────────────────┤
│ 4. CONTRACTS    1 arquivo por componente (anatomia, props, │  contracts/*.yaml + casos de teste
│                 variantes, estados, a11y, tokens, aceite)  │
├────────────────────────────────────────────────────────────┤
│ 5. ADAPTERS     CSS .rx-* (@layer)  │ React (Electia,Xscore)│
│                 Blade <x-rx-*> (IMO, EditalHub)             │
├────────────────────────────────────────────────────────────┤
│ 6. PATTERNS     shell · lista+filtro · formulário · KPI ·   │  receitas por stack, com tela de referência
│                 estados · confirmação                        │
└────────────────────────────────────────────────────────────┘
```

### 6.1 Foundation
Revisar o que existe (`DESIGN-SYSTEM.md` v2.1.1 → atual, guias de motion e acessibilidade), sem reescrever. Fixar regras de composição já validadas pelo Marcos: ação indevida não aparece; pendência mostra o quê + próximo passo + o que fazer; "emprega+" e "electia" sempre minúsculas. Acessibilidade: AA como piso medido por teste, sem declarar certificação WCAG integral.

### 6.2 Tokens
- **Fonte única em JSON no padrão DTCG**, em três níveis: primitivos (`color.purple.600`) → semânticos por papel (`surface.card`, `action.primary.bg`, `action.primary.fg`, `border.control`, `text.muted`) → de componente só quando necessário (`button.height.md`).
- **Gerador (Style Dictionary)** produz os arquivos de hoje **com saída equivalente** (`tokens.css`, `eds-root.css`, `@theme` Tailwind, `tokens.ts`). Primeiro passo é provar por teste que a saída gerada é igual à atual — consumidores não sentem a troca. Resolve de uma vez a fonte de verdade ambígua (C7), o JSON legado e as duas fontes da Emprega+ (C11).
- **Vocabulário semântico único (aceitar ADR-0001).** Os nomes atuais de cada produto viram **aliases gerados** com aviso de deprecated (`--bg-card` → `var(--surface-card)`, `--accent-teal` → `var(--action-primary-bg)`). Nada é renomeado à mão de uma vez; o alias some aos poucos, com catraca.
- Tokens faltantes: alturas de controle, ícones, header, z-index, breakpoints, foco único (§4.1).
- Tokens passam a entrar dentro de `@layer` deliberado, para que a ordem do CSS não decida tamanhos (dívida 2 da Electia). **Exige migração planejada na Electia**, porque ela hoje depende do efeito contrário.

### 6.3 Brand Themes
- Cada marca define **só** identidade: pigmentos de acento; fontes (título, corpo, números); tema padrão (Electia escuro, IMO claro); intensidade de raio (Xscore 10/14 é legítimo); assinaturas (degradê, brilho, orbe). Tudo o resto vem do núcleo. A ponte atual (`brand-bridges`) já faz isso e vira o mecanismo oficial.
- **White-label por cliente (IMO/EditalHub):** o cliente troca **um** token semântico (`--brand-accent`); o texto sobre ele é calculado no servidor (`PinturaDeMarca::tokens()`, já existente na F3) com contraste ≥4,5:1. Substitui as 5 cópias inline e o uso de `--eds-indigo` como cor de cliente.
- **Domínio** (teorias Electia, Finance Xscore) fica em pacotes opcionais por produto, fora do núcleo — como já é hoje no catálogo Electia/Finance.

### 6.4 Component Contracts
- Um arquivo por componente (`contracts/<componente>.yaml`): anatomia, props/variantes, estados (incluindo loading/vazio/erro), tokens consumidos, teclado e ARIA, critérios de aceite mensuráveis (alvos de contraste, alturas, comportamento de foco) e **casos de teste** que todo adaptador precisa passar.
- Ponto de partida: os 22 candidatos do anexo B §18(a). Primeiro lote = o necessário ao piloto: Button, Field, Card, StatCard, DataTable, Modal/ConfirmDialog, StatusBadge, EmptyState/ErrorState.
- As 30 fichas Markdown atuais viram documentação **gerada** a partir do contrato (deixam de divergir).

### 6.5 Framework Adapters
| Adaptador | Para quem | Como |
|---|---|---|
| **CSS `.rx-*` dentro de `@layer components`** | todos | Os componentes CSS atuais renomeados com prefixo (`.btn` → `.rx-btn`), mantendo aliases por um ciclo. Resolve colisão com Bootstrap (C6) |
| **React** | Electia, Xscore | **Não criar biblioteca nova agora.** Cada app mantém seus `ui/*`, mas eles passam a seguir o contrato e os tokens semânticos, verificados pelos casos de teste do contrato. Um pacote React compartilhado só se, após 2 produtos convergidos, a duplicação for real (YAGNI) |
| **Blade `<x-rx-*>`** | IMO (e depois EditalHub) | Componentes Blade finos que emitem `.rx-*`/`.jl-*` com ARIA correta. Plugins (select2, flatpickr, rappasoft, SweetAlert2) recebem **pele por token**, sem trocar biblioteca |
| **Proibido** | todos | Copiar código entre stacks (JSX → Blade). Compartilha-se contrato e token, nunca markup |

### 6.6 Product Patterns
Receitas com tela de referência por stack: **AppShell** (sidebar + header + área); **Lista operacional** (FilterBar + DataTable + paginação + ação em massa); **Formulário em seções** (Field + validação + rodapé de ações + confirmação); **Painel de KPIs** (KpiRow + gráficos com tabela `sr-only`); **Estados de página** (carregando, vazio com próximo passo, erro com retry, sem permissão); **Confirmação destrutiva**. IMO e Electia compartilham a receita; cada um implementa no seu adaptador.

### 6.7 Reaproveitamento do DS existente
| Hoje | Destino |
|---|---|
| `tokens.css`, temas, ponte, `eds-root` com SHA | **Mantidos**; passam a ser gerados (saída igual na primeira fase) |
| `components/*.css` (2.658 linhas) | **Mantidos**, com prefixo `.rx-*` e `@layer`; viram a referência visual dos contratos |
| JS vanilla (disclosure, drawer, theme-toggle…) | Mantidos para Blade/HTML; apps React usam o próprio estado |
| 30 fichas `docs/components/*.md` | Insumo dos contratos; depois geradas |
| Catálogo (Core/Electia/Finance) | Vira a vitrine oficial; as 4 vitrines locais dos produtos são aposentadas |
| `tests/` jest + contraste | Mantidos e ampliados para pares de componente (pegaria `.btn-success`) |

---

## 7. Estratégia de temas por marca (entregável 7)

1. **Núcleo obrigatório em todas as marcas:** nomes semânticos; escala de texto, espaço, raio, alturas de controle, z-index; anel de foco; pisos de contraste; durações e regra de movimento reduzido; estados dos componentes.
2. **Liberdade da marca:** pigmentos, fontes (Xscore com Plus Jakarta/Geist Mono é legítimo), tema padrão, multiplicador de raio, assinaturas visuais, tons de domínio.
3. **Proibido na marca:** mexer em pisos de contraste, comportamento de teclado/foco, anatomia e estados dos componentes, escala de espaço.
4. **Validação no build:** cada tema passa pelo teste de contraste da ponte (já existe) ampliado para pares de componente; tema que reprova não é publicado.
5. **Marcas por produto:** Electia (escuro, roxo, Sora/Inter/JB Mono) · Emprega+ IMO (claro, indigo da marca → white-label do cliente, Sora/Inter) · Xscore (escuro, ouro, Plus Jakarta/Sora/Geist Mono). Iguais na gramática, diferentes na identidade.

---

## 8. Estratégia de adaptação por stack (entregável 8)

| Stack | Produto | Entra por | Primeiros passos | O que **não** fazer |
|---|---|---|---|---|
| Next + Tailwind v4 | Electia | tag git do DS; `@theme` gerado no lugar do escrito à mão | 1) aliases gerados para os nomes atuais; 2) catraca passa a medir também nomes legados; 3) unificar Abas, Diálogos e Tabela pelo contrato; 4) `@layer` planejado com captura antes/depois | Não renomear 436 `accent-teal` de uma vez; não trocar escala 32/40px sem decisão de design |
| Next + Tailwind v4 | Xscore | idem; importar núcleo + ponte quando o alias resolver as 26 colisões | Resolver colisões no tema Xscore **antes** de importar o núcleo | Não recolorir para roxo; não copiar componentes da Electia |
| Laravel 12 + Blade + Livewire 3 + Bootstrap 5 | IMO | cópia gerada de `eds-root` (SHA) + `.rx-*`; componentes `<x-rx-*>` | 1) partial único de white-label; 2) pele global de plugins (F3); 3) tema base rappasoft; 4) pele do `admin-modal-*`; 5) componentes Blade do piloto | Não trocar Bootstrap, Font Awesome nem select2 neste ciclo; não reescrever os 7 toggles de status como `<span>`; separar classes de gancho JS (`js-*`) antes de mexer em classe visual |
| Laravel (EditalHub) | EditalHub | mesma cópia de `eds-root` | só depois da janela de recurso de 10/12 | Não promover com janela de recurso aberta |

---

## 9. Regras de governança para agentes (entregável 9)

### 9.1 Regra escrita — bloco único no AGENTS.md de cada repo (hoje só o Xscore tem)
> **Interface — ResultX DS.** 1) Antes de criar ou alterar tela, leia `docs/design-system.md` deste repo e o contrato do componente no ResultX DS. 2) Use componente e token existentes; não crie cor, espaçamento, fonte, ícone, sombra ou animação fora dos tokens. 3) Componente ou variante nova exige justificativa no PR (por que nenhum existente serve) e proposta ao DS central quando for reutilizável. 4) Não copie código de outra stack; compartilhe contrato e token, não markup. 5) Rode as verificações de DS antes do PR; registre exceção em `docs/ds-exceptions.md` com motivo e prazo.

### 9.2 Enforcement automático (do mais barato ao mais caro)
| Mecanismo | Electia | Xscore | IMO | DS |
|---|---|---|---|---|
| Catraca de cor/tamanho crus | já existe; ampliar para nomes legados e paleta crua | `hardcoded-color` já existe | **criar** (teste PHP que conta hex/px/`style=""` em views e CSS próprio e não deixa subir) | `color-no-hex` existe |
| Token inexistente | criar (copiar a ideia do `undefined-token` do Xscore) | já existe | **criar** (pegaria `--eds-primary`) | criar |
| Contraste | `ds-contrast` existe | `contrast` existe | criar para white-label (5 cores de amostra) | ampliar para pares de componente |
| Casos de teste do contrato | por componente | por componente | por componente Blade | definição dos casos |
| Regressão visual no CI | Playwright Linux, baseline gerada no CI | idem | idem nas telas do piloto | consertar: rodar no CI com baseline Linux |
| CODEOWNERS + proteção de branch | — | — | — | **criar** (repo público permite no plano grátis) |
| Aviso de nova versão do DS | Dependabot/Renovate para a tag | idem | verificação de SHA já existe | release-gate passa a bloquear |
| Hooks locais | — | — | — | consertar `.husky/` (hoje não roda) |

### 9.3 Fluxo humano
Mudança no DS central = PR com fonte/decisão/demo/contrato + revisão do Supervisor DS + Revisor independente. Exceção num produto = registro com prazo. Uma vez por mês: relatório de catracas (o que caiu, o que subiu).

---

## 10. Roadmap (entregável 10)

Etapas em ordem; cada uma só começa com ordem do Marcos (GO; "push N"/"merge N" quando houver PR).

| Etapa | O que | Repos | Esforço | Risco | Critério de aceite | Depende de |
|---|---|---|---|---|---|---|
| **E0 — Fundação de governança** | Bloco AGENTS.md nos 4 repos; CODEOWNERS e proteção de branch no DS; consertar `.husky/` e teste visual no CI; ADR-0001 aceita | DS + 3 produtos (só docs/CI) | P–M | baixo | 4 AGENTS.md com a regra; CI do DS falha com o `.btn-success` atual (prova de que o gate pega) e passa após correção | decisão D1 |
| **E1 — Tokens com fonte única** | DTCG JSON + gerador com **saída igual** à atual; tokens faltantes; aliases legados gerados | DS | M | médio (regressão invisível) | diff zero entre artefatos gerados e atuais (exceto tokens novos); v2.10.0 por tag | D2 |
| **E2 — Contratos do lote piloto** | 8 contratos (Button, Field, Card, StatCard, DataTable, Modal/Confirm, StatusBadge, Empty/Error) + CSS `.rx-*` em `@layer` | DS | M | baixo | cada contrato com casos de teste e captura nos 2 temas; catálogo atualizado | E1 |
| **F3 IMO (já pronta localmente)** | Marca do portal no Bootstrap/plugins | IMO | — | — | gate MySQL do Revisor + "push N" | liberar porta 33061 |
| **E3 — Piloto IMO** | Lista de vagas e candidatos do empregador: componentes Blade do lote, tema rappasoft aplicado a **uma** tabela, pele de modal e de select2/flatpickr **restrita às telas do piloto** (escopo por classe), partial de white-label (troca de mecanismo sem mudança de valor, provada por captura das demais áreas) | IMO | M–G | **médio-alto** (tabelas em PHP, JS preso a classe) | §5 linhas 1,5,7,8,10,11,14,20; capturas 320/768/1024/1440 × 2 temas; teclado; testes do IMO verdes; nenhuma regra de negócio alterada (diff só em view/CSS/componente) | E2 + F3 |
| **Avaliação do piloto** | Marcos olha a tela no ar; Revisor dá parecer; medir catraca antes/depois | — | P | — | aprovado pelo Marcos | E3 |
| **E4 — F2 (escalas no `eds-root`)** | Escalas de texto/espaço/raio/foco + borda ≥3:1 **no DS**; propagar cópia a IMO e EditalHub | DS, IMO, EditalHub | M | médio (3 cópias) | SHA igual nas 3 cópias; EditalHub só após o recurso de 10/12 | após 10/12 |
| **E5 — Ampliação IMO** | candidato → empregador → admin, família por família pela matriz | IMO | G | médio | catraca do IMO cai a cada lote; `.jl-*`/`.rx-*` substituem Bootstrap nos componentes | piloto aprovado |
| **E6 — Electia convergindo** | aliases → unificação Abas/Diálogos/Tabela → `@layer` | Electia | M–G | médio (Electia depende da ordem atual do CSS) | captura antes/depois sem diferença não intencional; `accent-teal` cai pela catraca | E1/E2 |
| **E7 — Xscore** | resolver 26 colisões e importar núcleo + ponte | Xscore | M | baixo | travas do Xscore verdes; capturas iguais | E1 |

**Riscos principais e mitigação**
1. Tabelas Livewire com classes em PHP → mexer por tema/trait base, nunca view a view; testado no piloto com 1 tabela.
2. JS preso a classes visuais → separar classes `js-*` antes de mudar classe visual; inventário no anexo C R3.
3. Três cópias do `eds-root` → mudança só na E4, com SHA, respeitando a janela do EditalHub.
4. Electia depende da ordem atual do CSS → `@layer` só com captura antes/depois de cada tela-chave.
5. Agentes paralelos sobrescrevendo (já aconteceu na F1) → uma pasta de trabalho por fatia, dono único, regra no AGENTS.md.

**Não verificado nesta auditoria (fazer antes de aprovar layouts):** nada foi visto renderizado com login; teclado nos menus e gaveta; tema claro da Electia em telas reais; se os 9 CSS inexistentes do IMO existem no servidor; proteção de branch dos repos; EditalHub fora do escopo.

---

## 11. Decisões do Marcos (aprovadas em 13/11: "GO D1 D2 D3")

| # | Decisão | Recomendação |
|---|---|---|
| D1 | Aceitar a **ADR-0001**: todos os produtos passam a falar o mesmo idioma de tokens; nomes antigos viram apelidos que somem aos poucos | **Aceitar** — sem isso, cada produto continua no seu dialeto |
| D2 | Tokens numa **fonte única estruturada** que gera os arquivos de cada stack, começando com saída igual à de hoje | **Aprovar** — elimina a dúvida "qual arquivo vale" sem mudar nada visível |
| D3 | **Tela piloto do IMO:** lista de vagas e candidatos do empregador | **Aprovar** — testa tabela, filtro, KPI, modal e estados de uma vez, e expõe cedo o maior risco técnico (tabelas Livewire) |

Decisões que os especialistas resolvem sem o Marcos: tamanhos 32/40 vs 36/44 do botão (@ux-design-expert + @architect), escolha da biblioteca de toast mantida no IMO, nomes exatos dos tokens semânticos.

Com o GO, o primeiro passo é E0 (só documentação e CI), seguido de E1.

---

## 12. Parecer do Revisor (13/11) e o que mudou

Veredito: **APROVA COM RESSALVA**; nenhum achado derruba D1–D3. Amostra confirmou imports Electia/Xscore, dialetos, override do IMO, SHA do `eds-root`, preview/CI, cores do `btn-success`, fontes no CSS de produção, 436 `accent-teal` e ~54 arquivos com `setThAttributes`. `@layer` e fontes conferidos no CSS de produção, sem prova em navegador.

| Ressalva | Correção nesta versão |
|---|---|
| "Nenhum produto usa componentes" contradiz o import de `data-cards` pela Electia | Restrito à camada principal `components.css`, com a exceção citada (§0, §2 C1) |
| `Form::` 1.279 sem método reproduzível (`rg` dá 2.133) | Recontado: 2.133 ocorrências em 254 views, 808 de campo, com comando (§0) |
| E3 aplicava tema e pele globais (91 modais) antes de aprovar o piloto | Efeito limitado a uma tabela e às telas do piloto; global só depois, com captura antes/depois (§5 linhas 8 e 14, §10 E3) |
| Lucide universalizado apesar de o IMO manter Font Awesome | Contrato de ícone neutro; biblioteca é escolha do produto (§1.2) |
| D1–D3 apresentadas como pendentes | Marcadas como aprovadas (§0, §11) |
| Cinco cores não provam contraste para toda cor | Critério trocado por cálculo garantido + teste de varredura (§5 linha 1) |
