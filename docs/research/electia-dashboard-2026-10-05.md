# Protótipo do dashboard Electia — ficha (05/10/2026)

Protótipo: [`brands/electia/previews/prototypes/electia-dashboard-2026-10-05.html`](../../brands/electia/previews/prototypes/electia-dashboard-2026-10-05.html). Capturas: [`assets/electia-dashboard-2026-10-05/`](assets/electia-dashboard-2026-10-05/).

O protótipo segue o padrão da landing da #80. É HTML estático e consome o DS por `dist/tokens.min.css`, `brands/electia/tokens/ds-bridge.css`, `dist/components.min.css`, `dist/icons.min.css`, `components/data-cards.css`, `dist/sidebar-overlay.js` e `dist/composer.js`. O CSS e o JS inline servem só para compor a página. O que falta no DS foi implementado localmente com o comentário `CANDIDATO`. Nada mudou em `components/`, `tokens/` nem `dist/`.

## Fontes

- **DS:** os docs de `data-cards` (`--compact`), `stage-chip`, `list-item`, `brand-orb`, `menu-drawer`, `navigation` (rail e overlay), `composite` (kanban `.pipeline`), `segmented`, `conversation` e `stats`, mais o CSS correspondente em `components/`. Demos: `landing-kit.html` e `dashboard.html`.
- **Electia no DS:** a ponte de tokens e o protótipo de landing `electia-landing-talio-2026-10-05.html`.
- **Pesquisa:** `talio-componentes-2026-10-05.md` §5 e os recortes `demo-moldura-1440.png` e `demo-tela-vaga-1440.png`. Foram usados só como referência de padrão; nenhum texto, marca ou código da Talio foi copiado.
- **App real**, lido sem editar, em `emprega-mais/electia/src`:
  - `app/(dashboard)/layout.tsx`
  - `components/layout/sidebar.tsx`: itens, ordem e papéis.
  - `components/nexus/nexus-pill.tsx`: textos "Pergunte ou peça algo..." e "Pergunte sobre perfis, cargos ou desenvolvimento de equipe.".
  - `app/(dashboard)/inicio` e `lib/onboarding/suggestions.ts`: sugestões do Nexus.
  - `app/(dashboard)/dashboard`: KPIs e "Testes por Tipo".
  - `app/(dashboard)/recruitment`: "Vagas ativas", "Limite do plano: N simultâneas", "Cadastrar candidato", "Card de divulgação" e status "Ativa".
  - `lib/constants.ts`: nome "Tipologia Cognitiva", nunca "MBTI".
  - ADR-018, que restringe a Saúde Mental ao agregado com N ≥ 5.
  - ADR-039 D6: indicador sem nota.
  - ADR-054: o Nexus não lê desempenho, metas nem anotações.

## Decisão do Marcos (06/10/2026): duas abas

> "A tela dashboard Electia deve ter 2 abas: 1. Gestão de pessoas, 2. Recrutamento e seleção. A tela principal é Gestão de pessoas."

Referência: o dashboard real (`app/(dashboard)/dashboard/page.tsx`). Título "Dashboard", subtítulo "Visão geral da sua organização", ações "Adicionar Colaborador" e "Criar Teste", KPIs (Total colaboradores, Testes realizados, Matching médio, Índice Bem-Estar), Atividade recente, Ações rápidas e Testes por tipo.

A tela inicial do protótipo deixou de misturar tudo e foi dividida assim:

- **Cabeçalho:** a saudação e a data ficam no eyebrow ("Boa tarde, Marina · Segunda-feira, 5 de outubro"). O h1 é **"Dashboard"**, e o subtítulo é "Clínica Horizonte · 124 colaboradores ativos". O título do topo diz "Dashboard", e o `<title>` segue a aba ("Gestão de pessoas · Dashboard · electia").
- **As ações seguem a aba.** Gestão: "Adicionar colaborador" e "Enviar teste". R&S: "Ver candidatos" e "Nova vaga". São dois `div.page-actions` com `role="group"` e nome próprio ("Ações de Gestão de pessoas" e "Ações de Recrutamento e seleção"). O grupo inativo fica `hidden`, fora da tela, da ordem de Tab e da árvore de acessibilidade. Ficam no cabeçalho, e não entre as abas e o painel, para que o Tab saia da aba direto para o painel (APG).
- **Aba Gestão de pessoas** (padrão):
  - KPIs: Colaboradores (124 · 8 sem nenhum teste), Testes concluídos (37 de 52), Matching médio (estado sem dado: "—" + "Defina o perfil-alvo de um cargo", como o "--" do app) e Índice Bem-Estar (58% na zona Saudável · 86 respostas; agregado, n ≥ 5).
  - Testes por tipo, com a forma de cada teste.
  - Bem-Estar da empresa (ADR-018).
  - Nexus.
  - Precisa de atenção (só pessoas): 15 convites sem resposta e 8 colaboradores sem nenhum teste.
  - Seus indicadores.
- **Aba Recrutamento e seleção:**
  - KPIs: Vagas ativas (limite do plano), Candidatos em andamento (5 novos na semana), Em oferta e Contratados. Os quatro são contados dos dados das vagas e se atualizam quando um candidato avança no kanban.
  - Vagas ativas, com os chips de etapa.
  - Precisa de atenção de R&S (as duas vagas).
  - Clicar numa vaga abre o kanban. O "Voltar", o breadcrumb "Recrutamento e seleção" e o Voltar do navegador retornam à aba R&S, com o foco na linha da vaga que estava aberta.
- **Atividade recente e Ações rápidas ficaram de fora.** As ações rápidas do app (Adicionar colaborador, Criar teste, Gerenciar cargos) repetiriam o cabeçalho. A atividade recente exigiria eventos que o protótipo não tem; o próprio app mostra "Atividade recente aparecerá aqui." Ver Suposições.

### Abas: `.tabs`/`.tab` do DS + comportamento local (C14)

O DS já tem `.tabs`/`.tab` em `components.css` (doc em `navigation.md`). O `segmented` é outra coisa: a doc dele diz que aba troca a **vista**, e segmented escolhe um **valor**. Usei `.tabs`/`.tab`. O DS só desenha o estado (`.tab.active`). Não há script, papéis ARIA nem teclado, por isso o comportamento ficou local:

- `role="tablist"` com nome ("Áreas do dashboard"); cada aba é um `<button role="tab">` com `aria-selected` e `aria-controls`; cada painel é `role="tabpanel"` com `aria-labelledby`.
- Tabindex móvel: só a aba selecionada fica na ordem de Tab, e o Tab seguinte entra no painel.
- `←`/`→` circulam, `Home`/`End` vão às pontas, com **ativação automática** (a seta já troca o painel).
- `.active` acompanha `aria-selected`, para que o visual continue sendo o do DS.
- **URL:** Gestão = `#inicio`, R&S = `#inicio/recrutamento`. A aba atualiza a URL com `history.replaceState`, que **não** dispara `hashchange`: o foco fica na aba e a página não rola nem pula para o h1. Recarregar, o deep link e o Voltar do navegador mantêm a aba. Nenhuma rota casa com um id (abas `#aba-*`, painéis `#painel-*`), para não reintroduzir o bug das rajadas (ver "Estresse de rotas"). As rotas antigas continuam: `#vagas` abre R&S com foco no painel de vagas, e `#nexus` (e ⌘K/Ctrl+K, de qualquer aba) abre Gestão com foco no campo do Nexus.
- **Sidebar:** "Início" leva a Gestão e fica com `aria-current` nessa aba. "Recrutamento & Seleção" leva à aba R&S e fica `aria-current` nela e na vaga aberta.
- **Indicador da aba ativa (defeito 10 do DS):** o DS pinta a borda com `--accent-primary`, que no escuro dá 2,39:1 sobre o fundo. O protótipo usa `--accent-primary-text` (6,85:1 no escuro, 7,25:1 no claro). Além disso, a borda não transiciona: o DS anima a cor da borda de transparente até o accent, e os primeiros quadros mediam 1,16:1. Só a tinta do rótulo anima. Vale também para a `.vaga-nav`.
- Em telas de até 479 px, as duas abas dividem a largura, os ícones somem e o rótulo pode quebrar em 2 linhas (a aba fica com 58 px de altura em 320 px).

## Telas e componentes

| Tela / região | Componentes do DS | Local (CANDIDATO) |
|---|---|---|
| Casca: navegação | `.sidebar.sidebar-overlay` + `dist/sidebar-overlay.js`, `.sidebar-item` com `aria-current`, `.sidebar-divider`, `.sidebar-footer`/`.sidebar-user`, `.icon` | C1 painel no desktop, C2 anel de foco sobre a sidebar escura |
| Casca: topo | `.header` (sticky, vidro), `.btn-icon`, `.brand-orb-sm` | C3 pílula do agente (Nexus, ⌘K) |
| Dashboard: cabeçalho | `.btn-primary`, `.btn-secondary` (um grupo por aba) | — |
| Dashboard: abas | `.tabs`/`.tab` (`.active`), `.icon` | C14 tablist APG (papéis, teclado, tabindex móvel, URL) |
| Dashboard: KPIs (das duas abas) | `.dl-statcard.dl-statcard--compact` como `<a>` | — |
| R&S: Vagas ativas | `.list-item-group` / `.list-item`, `.stage-chip` + `.stage-chip-count` | C4 linha de chips no list-item |
| Gestão: Testes por tipo | `.progress-track` / `.progress-fill` | C7 marca de teste por forma |
| Gestão: Nexus | `.brand-orb-electia` (md no cabeçalho, sm na resposta, `data-state="active"` só ao responder), `.composer` + `dist/composer.js`, `.message-stream` / `.message` / `.message-out`, `.brand-orb-lockup`, `.sr-only` com `aria-live` | C6 chips de sugestão |
| Gestão e R&S: Precisa de atenção (um painel por aba) | `.list-item.list-item-compact` | C5 marcador de atenção |
| Gestão: Bem-Estar | `.tag` | C8 distribuição por zona (barra e legenda com forma) |
| Gestão: Seus indicadores | `.tag` ("Meu" / "Do cargo · compartilhado") | — |
| Vaga aberta | `.breadcrumb`, `.dl-status--done`, `.tabs`/`.tab` como navegação com `aria-current`, `.stage-chip` como filtro (`aria-pressed`) e como cabeçalho de coluna, `.kanban.pipeline`, `.kanban-card`, `.avatar-sm`, `.empty-state-inline`, `.btn-sm` | — |
| Avisos | `.toast.toast-info` | C9 região fixa de toasts |

### Gaveta abaixo de 1024 px: escolhi `.sidebar-overlay`

A doc do `.menu-drawer` registra uma decisão do Marcos: a gaveta é o menu de uma página aberto pelo `.header-float`, e `.sidebar-overlay` é a navegação do app. Usando `.sidebar-overlay`, um único `<aside>` serve de painel no desktop e de gaveta no móvel, sem duplicar a navegação. O script já entrega foco preso, Escape, devolução do foco e trava de rolagem.

O corte segue o DS: a gaveta vale até 1024 px, inclusive, porque o DS usa `max-width: 1024px` e `.main` perde a margem nesse mesmo ponto. O pedido dizia "abaixo de 1024"; mantive a regra do DS.

## Candidatos a componente

| # | Candidato | Prioridade | Por quê |
|---|---|---|---|
| C1 | `.sidebar-overlay` com modo **painel** no desktop (hoje só existe rail + overlay) | **Alta** | Todo app com sidebar de rótulos (Electia, IMO) precisa disso. São 4 linhas de CSS |
| C2 | Token `--sidebar-focus-ring` (e revisão de `.sidebar-item:hover`, `.sidebar-user-name` / `-role` / `-avatar`); override temporário até o lote D | **Alta** | Defeitos do DS, detalhados abaixo. Hoje a sidebar escura usa o anel do tema claro (roxo #6f32b1 sobre navy) |
| C7 | `.test-mark` (forma por teste: DISC círculo em 4, Tipologia quadrado, Eneagrama eneágono, Big Five pentágono, Temperamentos triângulo, Motivadores hexágono) | **Alta** | Regra de produto do Electia. As `.badge-disc` e `.badge-bigfive` do DS pintam o teste pela cor, o contrário da regra |
| C8 | `.zone-distribution` (Saudável · Atenção · Alerta) | **Alta** | Linguagem de Saúde Mental pedida em 30/09. O app tem `wellbeing-zones` (PR #640); o DS ainda não |
| C6 | `.composer-chip` (chips de sugestão) | Média | Já estava previsto na ficha Talio §4 (`.composer--assistant`) |
| C3 | `.agent-pill` (abre o agente, atalho ⌘K) | Média | É o NexusPill do app; serve também a IMO e Xscore |
| C4 | `.list-item-chips` | Média | Linha de vaga com etapas (Talio §5). É um gancho pequeno no `.list-item` |
| C5 | `.attention-mark` / `.attention-list` | Baixa | Prevista na ficha Talio §5 |
| C9 | `.toast-region` (posição fixa, `role="status"`) | Baixa | O `.toast` do DS não se posiciona sozinho |
| C10 | Estado **desmarcado** do `.stage-chip` filtro (`aria-pressed="false"`) | **Alta** | O DS só desenha o marcado. Opacidade reprova contraste (2,46–3,97:1, achado do Revisor na #85). Proposta: contorno tracejado em `currentcolor`, fundo da página, tinta `--text-secondary`, marcador vazado e nome riscado. **Sem transição de `background-color` na troca:** o DS (`stage-chip.css`, `:is(a, button)`) interpola o fundo por 150 ms enquanto a tinta troca na hora, e no escuro os quadros intermediários de Oferta medem 4,08:1. No filtro, fundo e tinta trocam no mesmo quadro; só `transform` anima |
| C13 | Diretriz: em app com rota por hash, nenhuma rota casa com um id e o `scroll-behavior: smooth` global do DS fica desligado (ou o DS o restringe a landings) | Média | A rolagem suave da âncora nativa e a do foco por Tab terminavam depois da troca de tela e levavam o foco para fora da vista (P3 da #85). Rolagem suave global também atrasa o foco do teclado em qualquer app |
| C12 | Invocador da gaveta = o gatilho, não o `document.activeElement` (temporário; a PR #86 corrige no DS) | **Alta** | No Safari, ou com `button.click()`, o botão não ganha foco ao ser clicado. O script guardava o elemento focado antes (ex.: `#nexus-input`), que fica inert com a gaveta aberta, e no Escape o foco caía no `body`. O protótipo foca o gatilho num listener de `click` em captura, antes do handler do script. Se mesmo assim o foco terminar no `body` ao fechar, ele vai para o gatilho |
| C14 | Comportamento de **tabs** para `.tabs`/`.tab`: estilo por `[aria-selected="true"]` além de `.active`, e um `dist/tabs.js` (APG: papéis, `←`/`→`/`Home`/`End`, tabindex móvel, ativação automática, evento de troca para a URL). Junto, o indicador da aba ativa em `--accent-primary-text` e sem transição de `border-color` (defeito 10) | **Alta** | O DS desenha a aba mas não entrega o padrão de teclado nem os papéis. Todo app com abas reescreveria isso, e a doc do `segmented` já aponta `.tabs` como "o componente de vista" |
| C11 | `dist/sidebar-overlay.js` modal de verdade | **Alta** | Hoje o script prende o Tab, mas não dá `role="dialog"`/`aria-modal` nem isola o fundo. O protótipo faz isso no evento `sidebartoggle`. No DS o `inert` precisa sair **antes** de o script devolver o foco ao gatilho; por isso, aqui, o gatilho fica fora do inert. O atalho do agente (⌘K) fecha a gaveta antes de focar |

## Medições

### Abas (06/10/2026)

As provas foram feitas com Playwright no Chrome do sistema (`channel: 'chrome'`), arquivo aberto via `file://`, com os scripts no scratch. Resultado: **96 de 96**.

- **Sem overflow horizontal** em 320, 768, 1024 e 1440 px, claro e escuro, nas abas Gestão e R&S e na vaga (24 combinações).
- **Abas:** alvo de 44 px em 390, 768 e 1440 px e de 58 px em 320 px (2 linhas), sem rótulo cortado.
- **Teclado:**
  - `→` ativa R&S, mantém o foco na aba e a rolagem em 0, e troca o painel, as ações, o `aria-current` da sidebar, o título e a URL (`#inicio/recrutamento`);
  - `→` e `←` circulam; `Home` e `End` funcionam;
  - o Tab a partir da aba ativa entra no painel (primeiro KPI), nas duas abas;
  - o Shift+Tab volta à aba ativa, e o próximo Shift+Tab cai nas ações da aba, nunca na aba inativa;
  - o clique ativa a aba e a foca;
  - um único painel e um único grupo de ações ficam renderizados.
- **Árvore de acessibilidade** (CDP `Accessibility.getFullAXTree`): tablist "Áreas do dashboard" com 2 tabs, "Recrutamento e seleção" selecionada, e só um tabpanel exposto, com o nome da aba.
- **Deep link:** `#inicio/recrutamento` e `#vagas` abrem R&S; `#inicio`, vazio, `#nexus` e `#inicio/gestao` abrem Gestão. Recarregar mantém a aba.
- **Vaga a partir da aba R&S** (1440×900, 375×812 e 667×375):
  - a vaga abre com foco no h1;
  - o "Voltar", o breadcrumb e o Voltar do navegador retornam à aba R&S;
  - nos dois primeiros, o foco volta à linha da vaga, visível abaixo do header (o hit-test no centro acerta o link);
  - "Precisa de atenção" de R&S também abre a vaga;
  - avançar Giovana de Oferta para Contratado muda os KPIs de 2/1 para 1/2.
- **⌘K/Ctrl+K** na aba R&S leva a Gestão e foca o campo do Nexus. O pior caso (hash já `#nexus` com R&S visível) também passa.
- **Rajada de hashes nova** (`vaga/analista-dp, inicio/recrutamento, vagas, vaga/recepcionista, nexus, inicio/recrutamento, inicio`) em 667×375, saindo do fim da página: 5 de 5 terminam em Gestão, com o h1 focado em y = 100.
- **Gaveta em 1024 px:** continua `dialog` com fundo inert. O Escape devolve o foco ao gatilho, e "Início" dentro da gaveta leva a Gestão e fecha a gaveta.
- **Reduced-motion:** nenhuma orb anima.
- **Console:** zero erros.

| Contraste (abas) | Claro | Escuro |
|---|---|---|
| Textos novos (eyebrow, h1, subtítulo, ações, KPIs, atenção, chips; mínimo) | 4,83 (`.list-item-meta`) | 5,74 (`.list-item-meta`) |
| Aba ativa / inativa / inativa em hover | 7,25 / 7,22 / 7,22 | 6,85 / 5,89 / 5,89 |
| Indicador da aba ativa (não texto) | 7,25 | 6,85 (era 2,39 com o DS) |
| Anel de foco na aba | 7,25 | 6,85 |
| Troca de aba, quadro a quadro (~26 quadros, 400 ms): mínimo do texto / do indicador | 7,22 / 7,25 | 5,89 / 6,85 (o indicador era 1,16 com a transição do DS) |

### Medições de 05/10 (antes das abas)

As medições foram feitas com Playwright no Chrome do sistema (`channel: 'chrome'`), em 05/10/2026. Os scripts ficaram no scratch, fora do repo.

**Sem overflow horizontal** nas duas telas, nos dois temas, em 320, 375, 768, 1024 e 1440 px (20 combinações).

**Alvos de toque:** nenhum interativo visível fica abaixo de 24 px em nenhuma largura. Os links de texto "Ver todas" e o breadcrumb ganharam `min-block-size: 24px`.

**Contraste de texto:** o mínimo é 4,62:1 no claro (placeholder e breadcrumb) e 5,36:1 no escuro (itens da sidebar), já contando os estados de hover, foco, atual, pressionado, filtros marcados e desmarcados e a mensagem enviada ao Nexus. Em pontos de interesse:

| Par | Claro | Escuro |
|---|---|---|
| Rótulo do KPI (`--text-secondary`) | 7,22 | 5,89 |
| Notas e metadados do kanban (`--text-secondary`) | 7,56 | 6,28 |
| `.list-item-meta` (`--text-muted` do DS) | 4,83 | 5,74 |
| Chips de etapa nas vagas (mínimo) | 5,80 | 7,63 |
| Cabeçalho do kanban (chip, mínimo) | 5,56 | 7,03 |
| Status "Ativa" (com a correção local) | 5,76 | 8,68 |
| Item da sidebar / ativo | 7,91 / 7,59 | 5,36 / 6,93 |
| Iniciais do avatar (correção local) | 7,59 | 7,59 |
| Mensagem enviada ao Nexus (`.message-text` na bolha roxa; era 2,36 no claro) | 7,59 | 7,59 |
| Resposta do Nexus | 16,04 | 14,58 |
| Sidebar: repouso / hover / foco / pressionado | 7,91 / 15,71 / 15,71 / 15,71 | 5,36 / 18,40 / 18,40 / 18,40 |
| Sidebar: atual / atual + hover | 7,59 / 7,59 | 6,93 / 6,93 |
| Filtro de etapa marcado (mínimo das 5) | 5,13 | 6,29 |
| Filtro de etapa desmarcado (as 5; era 2,46–3,97) | 7,56 | 6,28 |

**Não texto:**

| Item | Claro | Escuro |
|---|---|---|
| Anel de foco da sidebar | 6,58 | 7,45 |
| Anel de foco no conteúdo | 7,59 | 7,31 |
| Marcador de atenção | 5,51 | 10,95 |
| Marca de teste | 7,56 | 6,28 |
| Contorno do filtro desmarcado | 7,22 | 5,89 |

**Comportamento:** 26 de 26 verificações na matriz geral, 34 de 34 nas provas da 1ª revisão da #85 e 18 de 18 nas da 2ª revisão.

**Contraste em transição (2ª revisão da #85):** medi o contraste em cada quadro (`requestAnimationFrame`, 400 ms após o clique, cerca de 26 quadros) ao desmarcar e ao marcar as cinco etapas, nos dois temas.

| Etapa | Claro: desmarcar / marcar | Escuro: desmarcar / marcar |
|---|---|---|
| Triagem | 7,56 / 7,95 | 6,28 / 6,56 |
| Entrevista | 7,56 / 6,53 | 6,28 / 6,29 |
| Oferta | 7,56 / 5,13 | 6,28 / 7,56 |
| Contratado | 7,56 / 5,28 | 6,28 / 7,42 |
| Rejeitado | 7,56 / 6,05 | 6,28 / 6,46 |

Os valores são o mínimo entre os quadros. Controle negativo: devolvendo a transição do DS, o mesmo medidor acusa 4,08:1 nos primeiros 64 ms de Oferta no escuro, o achado do Revisor.

- Gaveta em 375 px:
  - o foco entra ao abrir, com `aria-expanded="true"`;
  - 20 Tab e 20 Shift+Tab não escapam;
  - Escape fecha e devolve o foco ao gatilho;
  - escolher um link fecha a gaveta.
- Em 1024 px vale o modo gaveta; em 1440 px a sidebar fica fixa e o gatilho some.
- Teclado: o primeiro Tab vai para o "Pular para o conteúdo"; a ordem segue marca, módulos, Nexus, notificações, tema e conteúdo. Ctrl/⌘+K leva ao campo do Nexus.
- Nexus:
  - o chip preenche o campo sem enviar;
  - enquanto responde, a orb da resposta fica com `data-state="active"`, a região de mensagens fica com `aria-busy="true"` e o status "Nexus está respondendo…" fica fora da região busy;
  - depois de 2,2 s a orb volta ao repouso e o status passa a "Nexus respondeu.";
  - nenhuma outra orb ganha `data-state`.
- Vaga:
  - ao abrir, o foco vai para o h1 e "Recrutamento & Seleção" recebe `aria-current`;
  - as 5 colunas cabem sem rolagem em 1440 px;
  - "Avançar para…" move o card, foca o card movido, atualiza as contagens (kanban e Início) e avisa no toast;
  - o filtro de etapa oculta a coluna e marca `aria-pressed`.
- Com `prefers-reduced-motion: reduce`, nenhuma orb anima.
- **Gaveta modal (revisão da #85):**
  - aberta, o `<aside>` tem `role="dialog"` + `aria-modal="true"`;
  - o skip link, `#conteudo`, a pílula do Nexus e as ações do topo ficam `inert`;
  - na árvore de acessibilidade do Chrome (CDP `Accessibility.getFullAXTree`) aparece o diálogo "Navegação do electia" e nada do fundo;
  - Ctrl+K e ⌘K com a gaveta aberta fecham a gaveta, limpam inert e role e focam `#nexus-input`, visível abaixo do header; o Tab seguinte fica no conteúdo;
  - Escape limpa tudo e devolve o foco ao gatilho;
  - redimensionar de 900 para 1200 px com a gaveta aberta fecha, limpa inert e role, destrava a rolagem e mantém o foco num item visível do painel;
  - no desktop, o painel não tem `role`.
  - **Gatilho sem foco (2ª revisão):** nos três casos o foco termina no gatilho:
    - `button.click()` a partir do `#nexus-input` + Escape;
    - ponteiro com `mousedown.preventDefault()`, que simula o Safari, + Escape;
    - `button.click()` + clique no véu.
- **Foco após trocar de tela:** `#vaga/analista-dp`, `#inicio`, `#vagas`, `#vaga/recepcionista` e `#nexus`, partindo do fim da página, em 667×375, 320×568, 375×812 e 1440×900:
  - o hit-test no centro do elemento focado acerta o próprio elemento, nunca o header;
  - o topo fica entre 100 e 144 px, com o header terminando em 56 px.
  - Como garante: `scroll-padding`/`scroll-margin` = `--header-height` + `--space-4`, com rolagem instantânea (ver "Estresse de rotas" abaixo).
- **Estresse de rotas (vigente desde a re-revisão final da #85):** viewport de 667×375, documento novo a cada execução, medição 1 s depois.
  - **Hipótese superada (2ª revisão):** o reposicionamento repetido no quadro seguinte, com rolagem `instant`, cancelaria qualquer rolagem suave pendente, inclusive a da âncora nativa `#vagas`. As provas da época (Tab×n + Enter com n de 1 a 30, 4 rajadas de 13 Tab + Enter, 6 trocas de hash na mesma tarefa, uma execução de cada) passaram. Na re-revisão, porém, a rajada do Revisor falhou em 3 de 3 execuções, e as rajadas de Tab falharam às vezes. Uma rolagem instantânea para a posição em que a página **já está** é um no-op e não interrompe a suave em curso. A explicação não se sustenta.
  - **Causa medida (vigente):** o scrollY foi registrado quadro a quadro durante a rajada `vaga/analista-dp, inicio, vagas, vaga/recepcionista, nexus, inicio`.
    - Duas rotas casavam com ids de painel (`#vagas`, `#nexus`). Ao atribuir `location.hash`, a navegação de fragmento nativa já começava a rolar até o painel.
    - Com o `scroll-behavior: smooth` que o DS liga no `html`, essa rolagem durava cerca de 550 ms (de 0 a 1136 px).
    - Os seis `hashchange` chegam juntos com scrollY = 0, então a rolagem instantânea do roteador não a cancelava, e o título de Início terminava em y = −1036. Com `scroll-behavior: auto`, a mesma rajada termina em y = 100.
    - Uma segunda origem eram as rolagens suaves do foco por Tab no meio das rajadas de teclado.
  - **Correção (vigente):**
    1. Os painéis viraram `#painel-vagas` e `#painel-nexus`; nenhuma rota casa com um id.
    2. `html { scroll-behavior: auto }` no protótipo: toda rolagem é instantânea.
    3. Reserva inferior para o toast fixo (C9), com `scroll-padding-block-end` = altura real do toast + recuo + 8 px de margem. Medi clicando em cada um dos 18 itens que caem no aviso "fora do protótipo" (Início e vaga) e no aviso mais longo do kanban:
       - a partir de 480 px de largura, a faixa é de 60,8 px, em 1 linha (reserva de 68,8 px);
       - abaixo disso, é de 81,6 px, em 2 linhas (reserva de 89,6 px).

       A primeira medição (81,6 e 102,4 px, reservas de 90 e 110,4 px) usava os avisos antigos, que colavam o texto inteiro dos cards. Com os rótulos curtos (ver Observação), a reserva diminuiu.
    4. A mesma reserva vale na gaveta (`.app-nav`), que rola por conta própria.
  - **Sobreposição do toast:** o Revisor observou que, em 3 rajadas, o toast cobria cerca de 3,4 px de um link de 40 px. Reproduzi: era um item da gaveta aberta, focado por Tab no pé dela. Isso é sobreposição parcial e não ocultação total, então já atendia o 2.4.11 (AA). Mesmo assim fiz a folga, com a correção 4: a sobreposição máxima medida caiu de 3,4 px (em 3 a 5 execuções por rodada) para **0 px**.
  - **Provas vigentes** (repetidas com a reserva menor): 3 rodadas de 10 execuções independentes por cenário, todas 10/10 (180 de 180), com sobreposição máxima do toast de 0 px:
    - a rajada de hashes do Revisor;
    - 4 × (13 Tab + Enter) sem pausa;
    - trocas isoladas para `#vaga/analista-dp`, `#vagas`, `#nexus` e `#inicio` (vindo da vaga já rolada).

    Também passam a matriz de foco por troca de tela (cinco destinos em 667×375, 320×568, 375×812 e 1440×900, hit-test no centro) e as provas das revisões anteriores.
  - **Rótulo do aviso "fora do protótipo" (corrigido):** antes, o aviso usava o `textContent` do link inteiro e colava o conteúdo dos cards (ex.: "Testes concluídos37de 52…"). Agora a ordem é:
    1. `data-label` explícito;
    2. o nome do botão;
    3. o título do item (`.list-item-title`, `.dl-statcard-label`, `.sidebar-label`);
    4. `aria-label`;
    5. o texto do link.

    Os espaços são normalizados. Conferi os 18 avisos, todos curtos e limpos, por exemplo "“Testes concluídos” fica fora deste protótipo." e "“15 convites de teste sem resposta” fica fora deste protótipo.".

**Capturas:**

- Abas (06/10): `dashboard-gestao-{1440,390}-{claro,escuro}.png` e `dashboard-recrutamento-{1440,390}-{claro,escuro}.png`. Substituem as antigas `inicio-*`. Refeitas com o cabeçalho novo: `vaga-kanban-*`, `gaveta-375-aberta-*` e `vaga-foco-667x375-claro.png`. As de Nexus e do filtro são recortes do painel e não mudaram.
- `vaga-kanban-1440-{claro,escuro}.png` e `vaga-kanban-375-{claro,escuro}.png`
- `gaveta-375-aberta-{claro,escuro}.png`
- `nexus-respondendo-1440-claro.png` e `nexus-mensagem-1440-{claro,escuro}.png` (mensagem enviada e resposta)
- `filtro-etapas-misto-1440-{claro,escuro}.png` (Triagem e Contratado desmarcados)
- `vaga-foco-667x375-claro.png` (título focado abaixo do header)

Nas capturas de página inteira, a sidebar (`position: fixed`) aparece com a altura da viewport. É um artefato da captura, não do layout.

## Defeitos do DS encontrados (corrigidos só no protótipo)

1. `.sidebar-user-name` usa `--text-primary`. No tema claro o nome fica escuro sobre a sidebar navy e não aparece.
2. `.sidebar-user-role` tem 10 px com `opacity: .5`, abaixo de AA. Iniciais de `.sidebar-user-avatar`:
   - no claro, `--text-primary` sobre o gradiente não aparece;
   - em branco sobre o gradiente #6366f1 → #8b5cf6 dá 4,23–4,47:1, abaixo de AA.
3. Na sidebar, que é escura nos dois temas, `--focus-ring-color` do tema claro da ponte Electia (#6f32b1) quase some sobre o navy. Daí o C2.
4. `.dl-status--done` pinta o texto com `--color-success` puro: **2,77:1** no claro. A correção local usa a fórmula de tinta do `.stage-chip`.
5. `components/data-cards.css` **não entra** em `dist/components.min.css`, então os consumidores precisam importá-lo à parte (a landing-kit também faz isso). `.icon` também está fora do bundle de componentes (`dist/icons.min.css`); sem ele, cada SVG sai com 300 px e gera 246 px de overflow.
6. `.kanban-card` tem `cursor: grab`, mas não há arraste no DS. Usei movimento por botão.
7. `.message-text` fixa `color: var(--text-primary)` e vence a tinta posta na `.message-bubble`. Sobre um fundo de accent, como a mensagem enviada, o texto dá 2,36:1 no claro. No protótipo, a tinta vai no próprio `.message-text`.
8. `.sidebar-item:hover` usa `--text-primary`: 1,14:1 sobre o navy no claro. No protótipo usei `--sidebar-text-bright`. O override é temporário: o lote D corrige no DS.
9. `.sidebar-overlay` não isola o fundo nem anuncia um diálogo (ver C11).
10. `.tab.active` pinta o indicador com `--accent-primary`: **2,39:1** sobre o fundo no escuro, abaixo dos 3:1 de não texto. A borda também transiciona de transparente até o accent (1,16:1 nos primeiros quadros). `.tab` não tem estilo por `[aria-selected]`, e o DS não tem script de abas (ver C14).

## Suposições

- **Usuário de exemplo:** papel **RH** (rótulo do app), "Marina Couto", empresa "Clínica Horizonte".
  - O menu é o desse papel: sem Assinatura, Integrações e Super Admin; com Empresa.
  - "Colaborador" não é papel do app.
- **Dashboard (decisão de 06/10):** o item "Início" da sidebar (rótulo do app) abre o Dashboard na aba Gestão de pessoas, a tela principal. O Nexus (ADR-055) continua dentro de Gestão. O h1 passou a ser "Dashboard", e a saudação foi para o eyebrow.
- **Rotas:** `#inicio` = Gestão e `#inicio/recrutamento` = R&S. Mantive o prefixo `inicio` para não quebrar os links existentes (sidebar, breadcrumb, `#vagas`, `#nexus`).
- **Matching médio:** o protótipo não tem dado de aderência de colaboradores (só de candidatos), então o KPI mostra o estado sem dado, como o "--" do app, sem inventar número.
- **Índice Bem-Estar:** é o percentual na zona Saudável (58%), tirado da distribuição que o protótipo já mostrava (86 respostas, n ≥ 5). Não é um índice novo. Se o produto tiver outra fórmula de índice, troca-se só o número.
- **Em oferta / Contratados:** os KPIs novos de R&S são contados dos candidatos fictícios, sem número novo.
- **Atividade recente e Ações rápidas:** ficaram de fora (ver a decisão de 06/10). Se o Marcos quiser a atividade, o caminho é um feed com eventos reais (testes concluídos, candidatos que avançaram), não números inventados.
- **Seus indicadores:** continuam em Gestão, como foi pedido. Os dois indicadores do exemplo são do trabalho de RH da Marina (tempo para fechar vaga, entrevistas); são da Performance dela, não do funil.
- **Etapas:** Triagem, Entrevista, Oferta, Contratado e Rejeitado (decisão do DS). O app usa outro vocabulário: Recebido, Triagem, Áudio, Testes, Em análise, Aprovado, Reprovado, Expirado e Contratado.
- **Kanban:** o app não tem kanban (a lista de candidatos é uma lista), então a tela da vaga é uma **proposta**.
- **Avanço de etapa:** Triagem → Entrevista → Oferta → Contratado. Rejeitado e Contratado não avançam. Reprovar ficou fora do escopo.
- **Bem-Estar:** a distribuição por zona é da empresa, com 86 respostas, e a regra N ≥ 5 vale por grupo. Nenhum nome ou resultado individual aparece. Não copiei a tabela "Indicadores por Colaborador" nem o "Aplicar CBI" da tela atual, que contrariam o ADR-018.
- **Cores das zonas:** sucesso, aviso e erro, com forma própria na legenda (círculo, triângulo e losango). A zona é uma leitura de status.
- **Cores de resultado:** os kanban cards mostram a leitura DISC só com forma e texto, sem cor de resultado. A paleta aprovada mora em `viz-tokens.css` do app, que não está no DS. As cores DISC do DS (`--disc-s` verde) violariam a regra "verde é só status".
- **Performance:** dois indicadores, um "Do cargo · compartilhado" e um "Meu". O número fica sem nota e sem escala comum (ADR-039 D6).
- **Nexus:** as respostas são roteiros fixos de até 2,2 s, abaixo de 5 s, por isso não há botão de interromper.
  - Enter envia (política do produto, fora do DS).
  - As sugestões vêm do app, mais uma ação da página ("Resumir as vagas paradas").
- **Itens fora do escopo:** menu, abas, "Adicionar colaborador" e outros avisam por toast e não navegam.
- **Sem JavaScript:** as vagas e o kanban são gerados por JS a partir de dados fictícios inline, para manter as contagens coerentes entre as telas. Sem JS, aparece um aviso no lugar.

## Pendências

- Levar C1, C2, C7, C8, C10, C11 e C14 (com o defeito 10) para `components/`/`dist/` em PR própria, com testes. Quando a #86 entrar, tirar o contorno C12 do protótipo. Corrigir os defeitos 1 a 4 e 7 no DS. O 8 está com o lote D, e o override deste protótipo sai quando ele entrar.
- Migrar `.pipeline-stage-*` / `.kanban-column-dot` para `.stage-chip` no DS. Este protótipo já usa o chip no cabeçalho e não usa o ponto. É pendência do lote P.
- O Marcos decide o vocabulário das etapas: DS (5) ou app (9 status). Também decide se o kanban entra no produto.
- Revisar contra a paleta de resultado do app (`viz-tokens.css`) quando ela vier ao DS. Quando C7 existir, colorir a marca DISC pelo resultado.
- O `--text-muted` está em ajuste em outra PR. Aqui os textos auxiliares pequenos usam `--text-secondary`; só `.list-item-meta` e o placeholder seguem no muted do DS, e passam (4,83 e 4,62 no claro).
- Falta o parecer do Revisor; não houve auto-revisão.
