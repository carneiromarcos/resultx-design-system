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

## Telas e componentes

| Tela / região | Componentes do DS | Local (CANDIDATO) |
|---|---|---|
| Casca: navegação | `.sidebar.sidebar-overlay` + `dist/sidebar-overlay.js`, `.sidebar-item` com `aria-current`, `.sidebar-divider`, `.sidebar-footer`/`.sidebar-user`, `.icon` | C1 painel no desktop, C2 anel de foco sobre a sidebar escura |
| Casca: topo | `.header` (sticky, vidro), `.btn-icon`, `.brand-orb-sm` | C3 pílula do agente (Nexus, ⌘K) |
| Início: cabeçalho | `.btn-primary`, `.btn-secondary` | — |
| Início: KPIs | `.dl-statcard.dl-statcard--compact` como `<a>` | — |
| Início: Vagas ativas | `.list-item-group` / `.list-item`, `.stage-chip` + `.stage-chip-count` | C4 linha de chips no list-item |
| Início: Testes por tipo | `.progress-track` / `.progress-fill` | C7 marca de teste por forma |
| Início: Nexus | `.brand-orb-electia` (md no cabeçalho, sm na resposta, `data-state="active"` só ao responder), `.composer` + `dist/composer.js`, `.message-stream` / `.message` / `.message-out`, `.brand-orb-lockup`, `.sr-only` com `aria-live` | C6 chips de sugestão |
| Início: Precisa de atenção | `.list-item.list-item-compact` | C5 marcador de atenção |
| Início: Bem-Estar | `.tag` | C8 distribuição por zona (barra e legenda com forma) |
| Início: Seus indicadores | `.tag` ("Meu" / "Do cargo · compartilhado") | — |
| Vaga aberta | `.breadcrumb`, `.dl-status--done`, `.tabs`/`.tab` como navegação com `aria-current`, `.stage-chip` como filtro (`aria-pressed`) e como cabeçalho de coluna, `.kanban.pipeline`, `.kanban-card`, `.avatar-sm`, `.empty-state-inline`, `.btn-sm` | — |
| Avisos | `.toast.toast-info` | C9 região fixa de toasts |

### Gaveta abaixo de 1024 px: escolhi `.sidebar-overlay`

A doc do `.menu-drawer` registra uma decisão do Marcos: a gaveta é o menu de uma página aberto pelo `.header-float`, e `.sidebar-overlay` é a navegação do app. Usando `.sidebar-overlay`, um único `<aside>` serve de painel no desktop e de gaveta no móvel, sem duplicar a navegação. O script já entrega foco preso, Escape, devolução do foco e trava de rolagem.

O corte segue o DS: a gaveta vale até 1024 px, inclusive, porque o DS usa `max-width: 1024px` e `.main` perde a margem nesse mesmo ponto. O pedido dizia "abaixo de 1024"; mantive a regra do DS.

## Candidatos a componente

| # | Candidato | Prioridade | Por quê |
|---|---|---|---|
| C1 | `.sidebar-overlay` com modo **painel** no desktop (hoje só existe rail + overlay) | **Alta** | Todo app com sidebar de rótulos (Electia, IMO) precisa disso. São 4 linhas de CSS |
| C2 | Token `--sidebar-focus-ring` (e revisão de `.sidebar-user-name` / `-role` / `-avatar`) | **Alta** | Defeitos do DS, detalhados abaixo. Hoje a sidebar escura usa o anel do tema claro (roxo #6f32b1 sobre navy) |
| C7 | `.test-mark` (forma por teste: DISC círculo em 4, Tipologia quadrado, Eneagrama eneágono, Big Five pentágono, Temperamentos triângulo, Motivadores hexágono) | **Alta** | Regra de produto do Electia. As `.badge-disc` e `.badge-bigfive` do DS pintam o teste pela cor, o contrário da regra |
| C8 | `.zone-distribution` (Saudável · Atenção · Alerta) | **Alta** | Linguagem de Saúde Mental pedida em 30/09. O app tem `wellbeing-zones` (PR #640); o DS ainda não |
| C6 | `.composer-chip` (chips de sugestão) | Média | Já estava previsto na ficha Talio §4 (`.composer--assistant`) |
| C3 | `.agent-pill` (abre o agente, atalho ⌘K) | Média | É o NexusPill do app; serve também a IMO e Xscore |
| C4 | `.list-item-chips` | Média | Linha de vaga com etapas (Talio §5). É um gancho pequeno no `.list-item` |
| C5 | `.attention-mark` / `.attention-list` | Baixa | Prevista na ficha Talio §5 |
| C9 | `.toast-region` (posição fixa, `role="status"`) | Baixa | O `.toast` do DS não se posiciona sozinho |

## Medições

As medições foram feitas com Playwright no Chrome do sistema (`channel: 'chrome'`), em 05/10/2026. Os scripts ficaram no scratch, fora do repo.

**Sem overflow horizontal** nas duas telas, nos dois temas, em 320, 375, 768, 1024 e 1440 px (20 combinações).

**Alvos de toque:** nenhum interativo visível fica abaixo de 24 px em nenhuma largura. Os links de texto "Ver todas" e o breadcrumb ganharam `min-block-size: 24px`.

**Contraste de texto:** o mínimo é 4,62:1 no claro (placeholder e breadcrumb) e 5,36:1 no escuro (itens da sidebar). Em pontos de interesse:

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

**Não texto:**

| Item | Claro | Escuro |
|---|---|---|
| Anel de foco da sidebar | 6,58 | 7,45 |
| Anel de foco no conteúdo | 7,59 | 7,31 |
| Marcador de atenção | 5,51 | 10,95 |
| Marca de teste | 7,56 | 6,28 |

**Comportamento:** 26 de 26 verificações passaram.

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

**Capturas:**

- `inicio-1440-{claro,escuro}.png` e `inicio-375-{claro,escuro}.png`
- `vaga-kanban-1440-{claro,escuro}.png` e `vaga-kanban-375-{claro,escuro}.png`
- `gaveta-375-aberta-{claro,escuro}.png`
- `nexus-respondendo-1440-claro.png`

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

## Suposições

- **Usuário de exemplo:** papel **RH** (rótulo do app), "Marina Couto", empresa "Clínica Horizonte".
  - O menu é o desse papel: sem Assinatura, Integrações e Super Admin; com Empresa.
  - "Colaborador" não é papel do app.
- **Início:** junta a `/inicio` do app (Nexus como entrada, ADR-055) com os KPIs e cards pedidos. O título é uma saudação ("Boa tarde, Marina"), e não "Por onde você quer começar?".
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

- Levar C1, C2, C7 e C8 para `components/` em PR própria, com testes. Corrigir os defeitos 1 a 4 no DS.
- Migrar `.pipeline-stage-*` / `.kanban-column-dot` para `.stage-chip` no DS. Este protótipo já usa o chip no cabeçalho e não usa o ponto. É pendência do lote P.
- O Marcos decide o vocabulário das etapas: DS (5) ou app (9 status). Também decide se o kanban entra no produto.
- Revisar contra a paleta de resultado do app (`viz-tokens.css`) quando ela vier ao DS. Quando C7 existir, colorir a marca DISC pelo resultado.
- O `--text-muted` está em ajuste em outra PR. Aqui os textos auxiliares pequenos usam `--text-secondary`; só `.list-item-meta` e o placeholder seguem no muted do DS, e passam (4,83 e 4,62 no claro).
- Falta o parecer do Revisor; não houve auto-revisão.
