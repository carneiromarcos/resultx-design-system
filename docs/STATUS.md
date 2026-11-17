# ResultX Design System — Painel de status

> **Última atualização verificada:** 17/11/2026, `main` = `48fe3ce` (PR #139).
> **Quem mantém:** Supervisor DS, conforme o [protocolo de status e continuidade](governance/status-protocol.md).
> **Regra de leitura:** CONCLUÍDO exige critério atendido e evidência (PR mesclada, CI verde, parecer do Revisor). Documento escrito **não** conta como implementação.

---

## A. Visão executiva

- **Objetivo atual:** consolidar o ResultX DS. A Electia é a referência de experiência, o Emprega+ IMO é a prioridade de alinhamento e o Xscore é a expansão futura. Fontes:
  - [diagnóstico](audits/2026-11-13-ds-auditoria/diagnostico-resultx-ds.md);
  - [governança](audits/2026-11-13-ds-auditoria/governanca-propagacao-conformidade.md).
- **Fase:** depois do piloto (E3) e antes da **v2.11.0**, que sai a partir de 27/11 (regra D7).
- **Estado geral:** das 30 atividades do quadro abaixo:
  - 18 CONCLUÍDO;
  - 3 EM ANDAMENTO;
  - 0 AGUARDANDO VALIDAÇÃO;
  - 3 BLOQUEADO;
  - 6 PENDENTE.
- **Pelo roteiro do diagnóstico:**
  - etapas concluídas pelo critério: 4 de 10 (E0, E1, E2, F3);
  - a E3 está em produção com desvios;
  - o Marcos aceitou o visual do piloto em 14/11; a correção de foco (DS-20) está em produção (IMO #909);
  - a E3 continua com desvios da matriz a verificar (DS-10); no IMO entraram o fechamento do piloto (#911), o aviso de falha (#917), o foco e anúncio para leitor de tela (#919) os botões secundários no componente oficial (#926) e os erros da janela de Perfil ligados aos campos (#931);
  - E4–E7 não começaram;
  - o catálogo de todas as marcas (DS-30), pedido pelo Marcos em 16/11, começou pelas fundações.
- **Principais resultados:**
  - auditoria completa;
  - governança dos agentes;
  - tokens com fonte única;
  - 8 contratos de componente com adaptador CSS;
  - botão primário com preenchimento e teste visual que detecta regressão;
  - piloto **em produção no IMO** (#902), com desvios do critério abertos.
- **Próximo marco:** v2.11.0, a partir de 27/11.

### Indicadores

| Indicador | Valor | Como foi medido |
|---|---|---|
| Atividades | 18 concluídas / 30; 3 em andamento; 0 aguardando validação; 3 bloqueadas; 6 pendentes | quadro B |
| Etapas do roteiro | 4 de 10 pelo critério; a E3 em produção com desvios não é contada | diagnóstico §10 |
| Matriz Electia × IMO no piloto | 8 de 25 **trabalhadas** (1, 5, 7, 8, 10, 11, 14, 20). **Critério satisfeito comprovado em 0.** 3 comprovadamente não atendem (1, 5, 14); 5 sem verificação (7, 8, 10, 11, 20) | diagnóstico §5 e §10 |
| Camadas da arquitetura | 2 completas (Tokens; Contratos do lote piloto), 2 parciais (Temas, Adaptadores), 2 sem entrega nesta missão (Foundation, Padrões de produto) | completa = artefato versionado + teste no CI + consumido por produto ou pela vitrine |
| Decisões de governança aplicadas | 4 de 7 (D4, D7, D8, D10) | D5 e D6 adiadas; D9 só vale quando a conformidade entrar em modo aviso ([ADR-0005](adr/0005-governance-propagation-decisions.md)) |
| Produtos na versão mais recente do DS | 0 de 3 | Electia e Xscore travados em `#v2.9.0`; o IMO copia 2 arquivos do DS por SHA |
| Testes da `main` `c3bb8a0` | CI e Pages verdes; o Visual Linux não rodou nesse commit (só textos de marca) e passou por último em `a70e2be` (16 baselines) | runs 43727276279, 43727276195, 43635296376 |

## B. Quadro de atividades

| ID | Atividade | Estado | Critério de conclusão | Evidência | Depende de | Próxima ação |
|---|---|---|---|---|---|---|
| DS-01 | Auditorias Electia, DS e IMO | CONCLUÍDO | 3 relatórios com parecer do Revisor | diagnóstico §1–§3, anexos A–C; #111 | — | revisitar na E6 |
| DS-02 | Inventário de tokens | CONCLUÍDO | documento + fonte única com saída igual | diagnóstico §4.1; #116 | — | `brands/*/tokens/tokens.json` ainda são manuais |
| DS-03 | Inventário de componentes | CONCLUÍDO | documento revisado | diagnóstico §4.2 | — | atualizar na E5 |
| DS-04 | Matriz Electia × IMO (documento) | CONCLUÍDO | 25 linhas com critério | diagnóstico §5 | — | — |
| DS-05 | Desenho de governança, propagação e conformidade | CONCLUÍDO | 8 entregáveis revisados | desenho + anexo D; #113 | — | — |
| DS-06 | E0 — fundação de governança | CONCLUÍDO | regra no AGENTS.md de 4 repos; CI do DS falha com defeito e passa com correção | #111, #112, #113, #115; Electia #1009; IMO #900; `audits/.../e0-provas.md` | — | — |
| DS-07 | E1 — tokens com fonte única (mesclada; ainda não publicada em versão) | CONCLUÍDO | artefatos gerados equivalentes aos da `v2.10.0`, que é a referência da comparação: `eds-root` idêntico byte a byte, demais artefatos pertinentes equivalentes após normalização | #116 (`c7aaeec`), mesclada depois da tag `v2.10.0` (`52d6b4e`) | — | publicação prevista na v2.11.0 (DS-14) |
| DS-08 | E2 — 8 contratos e adaptador CSS | CONCLUÍDO | contrato com casos de teste e capturas nos 2 temas | #117, #118, #119, #120 | — | — |
| DS-09 | F3 — marca do portal IMO no Bootstrap | CONCLUÍDO | gate MySQL + merge do Marcos | IMO #901 (`3e59ad8f`), deploy | — | — |
| DS-10 | E3 — piloto IMO (vagas e candidaturas do empregador) | EM ANDAMENTO | linhas 1, 5, 7, 8, 10, 11, 14, 20 da matriz atendidas; capturas; teclado; testes verdes | em produção: IMO #902 (`cfeae3b1`), deploy 43591765046; foco: IMO #909 (`02182668`); fechamento IMO #911 (`d3880dcf`); aviso de falha IMO #917 (`bfb87262`); foco e anúncio IMO #919 (`119d1c9d`, VoiceOver real no tema claro); botões secundários e de perigo IMO #926 (`1de80984`); erros do Perfil ligados aos campos IMO #931 (`341ab686`, deploy 43920051603; VoiceOver não testado) | DS-17, DS-19 | primários e links das telas em `<x-rx.button>` na IMO-30b, depois da DS-17 e da DS-29; verificar 7, 8, 10, 11, 20 |
| DS-11 | Avaliação do piloto | CONCLUÍDO | aceite visual do Marcos | IMO `docs/qa/2026-11-13-ds-e3-piloto-avaliacao.md`; aceite do Marcos em 14/11, registrado também no painel do IMO (IMO #903) | — | — |
| DS-12 | Botão primário com preenchimento e teste visual que o protege | CONCLUÍDO | contrato ≥3:1 no limite e ≥4,5:1 no texto; captura que reprova sem preenchimento | #121 (`16cdea4`), #123 (`c71e9b4`) | — | chega ao IMO na DS-17 |
| DS-13 | Painel de status e protocolo de continuidade | CONCLUÍDO | painel no formato do protocolo; AGENTS.md aponta o protocolo; Revisor | #122 (`3e59c57`), #124 (`7f58e77`), #125 (`5b18b15`), Revisor APROVA em cada uma | — | — |
| DS-14 | Versão v2.11.0 | EM ANDAMENTO | inventário até o SHA da tag, impacto por produto, CI verde, Revisor | rascunho do impacto por consumidor no CHANGELOG (`v2.10.0..5b18b15`); cssnano 9.9 (DS-16) sem efeito no `dist` | 27/11 (D7), DS-16 | refazer o inventário até o SHA da tag e cortar a partir de 27/11 |
| DS-15 | Revisão visual do `btn-danger` do FinanceX | CONCLUÍDO | captura real aprovada pelo Revisor | 5 usos em `premium-light`, repouso/hover/foco, v2.9.0 × v2.10.0 × `main`: contraste 3,10–4,14:1 → 4,83:1; Revisor APROVA COM RESSALVA (rodada 2, depois de 1 REPROVA). Capturas locais com dados sintéticos, 1440 px, fora do repositório | — | ressalva de hierarquia vira a DS-27 |
| DS-16 | Dependabot #108 e #110 | CONCLUÍDO | as duas atualizações numa PR sobre a `main`, 3 checks verdes, Revisor no SHA final | #127 (`a70e2be`): fast-uri 3.1.9, 7 dev-deps, imagem Playwright 1.65.0 por digest; `dist` idêntico ao da `main`; Visual Linux 43635296376 verde; #108 e #110 fechadas | — | — |
| DS-17 | IMO recebe a v2.11.0 | PENDENTE | recópia por SHA; `RxPilotVendoredCopyTest` atualizado; CTA "Ver planos" decidido | — | DS-14; merge do Marcos | PR no IMO depois da tag |
| DS-18 | E4 — escalas no `eds-root` | BLOQUEADO | SHA igual nas 3 cópias | — | 10/12 (recurso do EditalHub) | planejar depois de 10/12 |
| DS-19 | Contraste do white-label (linha 1) | BLOQUEADO | ≥4,5:1 para qualquer cor na grade | IMO `docs/qa/2026-11-13-ds-e3-varredura-white-label.md`: 49 pares abaixo, em 29 de 36 cores | mudança de valor → 10/12 | entra na E4 |
| DS-20 | Foco volta ao fechar os diálogos do piloto (linha 14) — correção do piloto (E3), **antes** da E5 | CONCLUÍDO | foco retorna ao gatilho nos diálogos "Encerrar vaga" e "Perfil" | IMO #909 (`02182668`), deploy 43633112245; teste Livewire falha sem a correção e passa com ela; Revisor APROVA COM RESSALVA; smoke MySQL completo com 2 falhas de concorrência (porta 2 e "workers não iniciaram"), com intermitência da porta 2 vista na base e no ramo em rodadas alternadas; o Marcos aceitou a exceção ao gate | — | investigar e consertar as falhas intermitentes de concorrência do IMO (fora do DS) |
| DS-21 | E5 — ampliação do IMO | BLOQUEADO | catraca do IMO cai a cada lote | — | DS-10 | — |
| DS-22 | E6 — Electia convergindo (inclui adaptador React) | PENDENTE | capturas antes/depois sem diferença não intencional | — | E1/E2 (prontas) | planejar |
| DS-23 | E7 — Xscore | PENDENTE | travas do Xscore verdes; capturas iguais | — | E1 (pronta) | planejar |
| DS-24 | Prova descartável P1 da propagação | PENDENTE | P1 passa sem escrita em produto | desenho §6.5 | DS-14 | depois da v2.11.0 |
| DS-25 | Conformidade G0 (manifesto `.ds/` no IMO e na Electia) | PENDENTE | 2 relatórios coerentes com o desenho §5.5 | desenho §7.1 | — | criar o manifesto |
| DS-26 | D5 — GitHub App da automação | PENDENTE (adiada por decisão) | aceite de risco expresso do Marcos | ADR-0005 | DS-24 | voltar a perguntar depois da P1 |
| DS-27 | Hierarquia do botão de perigo no FinanceX | CONCLUÍDO | decisão registrada antes de o FinanceX subir de versão (ex.: Desativar por linha em variante neutra) | decisão do Marcos em 14/11; FinanceX #45 (`71df56a7`): Desativar neutro, confirmação em Excluir regra e Cancelar plano, ponte provisória do `btn-danger`; CI verde; Revisor APROVA | — | tirar a ponte quando o FinanceX subir para a v2.11.0 |
| DS-28 | Protocolo de status adotado no IMO | CONCLUÍDO | painel versionado no IMO; Revisor; merge do Marcos | IMO #903 mesclada (`c5d2f2bc`) com o merge do Marcos; Revisor APROVA no head `1ba0674a` (revisão conjunta DS #126 / IMO #903) | — | o painel do IMO segue com IMO-06 e IMO-26 antigos, atualizar na próxima PR material do IMO |
| DS-29 | Contrato de link com aparência de botão (pré-requisito da IMO-30b) | CONCLUÍDO | contrato com anatomia `<a href>`, só Enter aciona, indisponível com `aria-disabled` e sem `href`; casos de teste executados na vitrine do adaptador CSS; teste que falha sem a mudança; Visual Linux; Revisor; antes da tag v2.11.0 | decisão do @architect em 16/11 (`contracts/button.yaml` cobre só botão nativo); GO do Marcos em 16/11; #129 (`e80d611`) mesclada com Revisor APROVA | — | chega ao IMO na IMO-30b, depois da v2.11.0 |
| DS-30 | Catálogo de todas as marcas (eletia, emprega+ com IMO e EditalHub, Xscore, PdV, ResultX), gerado do código do DS | EM ANDAMENTO | cada marca × componentes × claro/escuro, em documento isolado; toda ligação de marca é `var()` para nome existente; as PRs do catálogo não criam nem mudam valor de cor (correções de cor vão em PRs de cores próprias, ver D); nada gravado em `dist`, `brands`, `tokens`, `adapters`, `contracts`, `generated`; publicado no Pages; Visual Linux; Revisor; aceite visual do Marcos | pedido e escolhas do Marcos em 16/11 (site de catálogo; 5 marcas; Catholic Hub e Saúde fora); levantamento `catalog/research/2026-11-16-levantamento-marcas.md` (fora do pacote npm); decisões @architect e @ux em 16/11 (6 PRs; publicação na 2ª), guardadas em `catalog/research/2026-11-16-decisao-arquitetura.md` e `catalog/research/2026-11-16-decisao-ux.md`; PR 1 mesclada (#134, `efa9f9f`; Revisor APROVA; visual Linux 178 aprovados); PR 2 mesclada (#135, `764866b`; Revisor APROVA; `/catalog/` no ar, 120 endereços sem erro); PR 3 mesclada (#136, `997e2a9`; JS só em ConfirmDialog e DataTable, autorizado pelo Marcos em 16/11; 1.890 endereços publicados sem erro); PdV escuro com 2 pares abaixo de 4,5:1 (ver D); PR 4a mesclada (#137, `d2c6973`; 135 de 370 pares do legado abaixo do piso, ver D; 3.250 endereços publicados sem erro); PR 4b mesclada (#138, `0827c21`; só os 6 scripts já publicados em `dist`, cada um na página do seu componente, decisão do Marcos em 16/11; 9.620 endereços publicados sem erro); eletia claro com 2 pares em 1,63:1 (ver D); PR 5a mesclada (#139, `48fe3ce`; famílias de dados, 270 páginas): 23 de 340 pares abaixo de 4,5:1 e 3 amostras decorativas sem papel (ver D) | — | aceite visual do Marcos; PR 5b (conversa e domínio); PR 6 (URLs antigas e crawler); PRs de cores (cor nova liberada pelo Marcos em 17/11) |

## C. Registro de progresso

| Data | Referência | O que mudou |
|---|---|---|
| 17/11 | esta PR | Painel da implantação nos produtos (seção F, metas M1–M9) e evidências de partida em `catalog/research/implantacao/` |
| 17/11 | #139 | DS-30, PR 5a do catálogo: famílias de dados; 8 ligações por var a papéis existentes decididas pelo UX; soft-cyan, soft-magenta e soft-purple pendentes de papel próprio |
| 16/11 | #138 | DS-30, PR 4b do catálogo: famílias interativas e compostas; scripts já publicados do DS carregados só na página do seu componente; tabs, dropdown, toast e compostos só visuais |
| 16/11 | #137 | DS-30, PR 4a do catálogo: famílias anteriores recolhidas no fim do sucessor; Navigation, Layout, Segmented e ListItem; contraste do legado medido e publicado como pendência |
| 16/11 | #136 | DS-30, PR 3 do catálogo: os 8 contratos nas 10 combinações; JS local só nas páginas de ConfirmDialog e DataTable, extraído do piloto; contraste medido por página |
| 16/11 | #135 | DS-30, PR 2 do catálogo: publicação de `/catalog/` no Pages com faixa "em construção"; fontes locais publicadas; decisões dos especialistas guardadas em `catalog/research/` |
| 16/11 | #134 | DS-30, PR 1 do catálogo: ligação de marca, manifesto, trava e fundações das 5 marcas; fontes Plus Jakarta Sans e Geist Mono (OFL); painel após #129 e IMO #931 |
| 16/11 | IMO #931 | Erros da janela de Perfil ligados aos campos nas telas do piloto (IMO-31) |
| 16/11 | #129 | DS-29: contrato de link com aparência de botão |
| 16/11 | IMO #926 | Botões secundários e de perigo do piloto em `<x-rx.button>` (IMO-30a); primários e links ficam para a IMO-30b |
| 16/11 | IMO #919 | Foco e anúncio de carregamento nas listas do piloto; VoiceOver real pelo Marcos no tema claro |
| 15/11 | DS #128 | Nome visível electia → eletia em `brands/electia` |
| 15/11 | IMO #917 / #911 | Aviso de falha ao atualizar a lista; fechamento do piloto (vazios com ação, aviso de carregamento, bordas) |
| 14/11 | DS #127 | DS-16: #108 e #110 refeitas (Playwright 1.65.0, cssnano 9.9 sem efeito no `dist`) |
| 14/11 | DS #127 (painel) | Painel após #909, #45 e #903 |
| 14/11 | IMO #909 | Foco volta ao gatilho nos diálogos do piloto; em produção (DS-20) |
| 14/11 | FinanceX #45 | Hierarquia do botão de perigo (DS-27) |
| 14/11 | DS #126 | Rascunho do impacto da v2.11.0 por consumidor; revisão do `btn-danger` no FinanceX concluída (DS-15); aceite do piloto e liberação do JS registrados |
| 14/11 | IMO #903 | Painel de status e protocolo adotados no IMO (só documentação; mesclada com o merge do Marcos) |
| 14/11 | DS #125 | Protocolo de status e continuidade; painel reestruturado em A–E |
| 14/11 | DS #124 | Painel atualizado depois da #123 |
| 14/11 | DS #123 | Captura recortada da área de ações (o botão primário sem preenchimento dá 7,6% de diferença e reprova); baselines de página inteira atualizadas pelo CI; 16 baselines Linux |
| 14/11 | DS #122 | Painel de status criado; o Revisor reprovou 2 versões antes de aprovar |
| 14/11 | DS #121 | Botão primário com preenchimento de marca e borda neutra; varredura de 288 medições (repouso e hover), todas ≥5,89:1 |
| 14/11 | IMO #902 | Piloto E3 em produção. 2 folhas copiadas do DS por SHA (`rx-pilot.css`, `rx-pilot-aliases.css`) e 3 locais (`rx-pilot-bridge.css`, `-dialogs.css`, `-tables.css`). Os 8 componentes Blade ficaram só na vitrine de teste |
| 13/11 | DS #120 / #119 / #118 / #117 | Legenda da tabela e sonda `color(srgb)`; variante escopada e aliases Emprega+; 10 baselines da vitrine; 8 contratos e adaptador CSS |
| 13/11 | DS #116 / #115 / #114 | E1 fonte única; 17 combinações de botão corrigidas e PAPEIS.md; versão v2.10.0 |
| 13/11 | DS #113 / #112 / #111 | Decisões D4–D10 e ADR-0005; visual Linux no CI; E0 e auditoria versionada |
| 13/11 | IMO #901 / #900; Electia #1009 | F3 em produção; regra de interface do DS no AGENTS.md |

### O que mudou nos produtos

- **IMO — mudou:** F3 (#901), piloto E3 (#902), retorno de foco (#909), fechamento do piloto (#911), aviso de falha (#917), foco e anúncio (#919) e botões secundários (#926), em produção. Só a #902 mudou 43 arquivos (views, CSS, componentes Blade, testes e relatórios em `docs/qa/`, sem regra de negócio; contagem do GitHub); as demais PRs não foram somadas nesta contagem. A correção do primário (#121) chega ao IMO depois da v2.11.0.
- **Electia — sem mudança visual relacionada ao DS.** Desde 12/11 entraram duas PRs:
  - #1009: só documentação;
  - #1008: código de leads e e-mail, sem interface nem DS.
  - Continua em `#v2.9.0`.
- **FinanceX — mudou:** #45 (hierarquia do botão de perigo e ponte provisória do `btn-danger`). Continua em `#v2.9.0`. Publicação no site não conferida.
- **Xscore — sem mudança.** Nenhum commit na pasta depois do commit de referência da auditoria (`35921bf5`, 13/11). Continua em `#v2.9.0`.

### Validação

| Verificação | Resultado | Evidência |
|---|---|---|
| CI do DS (lint, build, contraste, sonda) | Passou | `main` `c3bb8a0`, run 43727276279 |
| Visual Linux do DS (obrigatório, 16 baselines) | Passou | `a70e2be`, run 43635296376 (não rodou em `c3bb8a0`) |
| Site de documentação (Pages) | Passou | `main` `c3bb8a0`, run 43727276195 |
| Revisor independente | Aprovou cada PR do DS desta missão, várias depois de reprovar e corrigir | pareceres nas PRs |
| Testes do IMO para o piloto | Passaram no CI | IMO #902, head `55fb9d65` |
| Smoke em produção do IMO | Passou; SHA de `rx-pilot.css` igual ao da `bd1457a` | deploy 43591765046 |
| Capturas 320/768/1024/1440 nos produtos | Feitas localmente na E3; **não versionadas nem automáticas** | IMO `docs/qa/` |
| Firefox e Safari | **Não realizado** | — |
| Lighthouse / desempenho | **Não realizado** | — |
| Aceite visual humano do piloto | Dado pelo Marcos em 14/11 | DS-11 |

## D. Bloqueios e decisões

**Bloqueios**

| Bloqueio | Atividades | Por que | O que destrava |
|---|---|---|---|
| Janela de recurso do EditalHub | DS-18, DS-19 | mudança de valor no `eds-root` proibida até 10/12 | a data |
| Contraste do PdV escuro no catálogo | DS-30 | texto de perigo sobre superfície 3,77:1 e texto indisponível sobre segunda superfície 3,80:1 (mínimo 4,5:1), em Button, Card, DataTable, StatusBadge e ConfirmDialog; corrigir exige mudar valor; as páginas mostram a pendência e não há declaração de conformidade integral | 10/12 e decisão do Marcos sobre a paleta do PdV; responsável: Supervisor DS |
| Contraste das famílias anteriores (legado) | DS-30 | 135 de 370 pares em repouso abaixo do piso (30 de texto, menor 2,69:1; 105 de limite/borda, parte intencional como ghost); lista em `catalog/research/2026-11-16-catalogo-legado-4a-contraste.csv`; produtos ainda usam essas famílias | PRs de cores C3–C5 (cor nova liberada pelo Marcos em 17/11, alcance abaixo), com aceite visual dele; responsável: Supervisor DS, com UX para exceções |
| Contraste de HeaderFloat e CTADock na eletia clara | DS-30 | texto do cabeçalho flutuante e do dock em 1,63:1 com os tokens completos da marca (vidro escuro); com núcleo + ponte, como nos protótipos, mede 17,81:1; não comprova defeito em produção; lista em `catalog/research/2026-11-16-catalogo-legado-4b-contraste.csv` | PR de cores C1 (vidro claro do núcleo no tema claro da eletia, sem valor novo); conferir o uso real nos produtos; responsável: Supervisor DS, com UX |
| Contraste e papéis das famílias de dados | DS-30 | 23 de 340 pares abaixo de 4,5:1 (variações claras nas cinco marcas, aviso/erro da tabela clara emprega+ e 6 no PdV escuro); soft-cyan, soft-magenta e soft-purple sem papel decorativo nos temas das marcas; lista em `catalog/research/2026-11-17-catalogo-dados-5a-contraste.csv` | PRs de cores (cor nova liberada pelo Marcos em 17/11), com UX; responsável: Supervisor DS |
| E3 com desvios da matriz | DS-21 | a E5 só começa com a E3 fechada | verificar as linhas 7, 8, 10, 11 e 20 e fechar a DS-10 |

**Decisão do Marcos em 17/11: cor nova liberada (alcance)**

- Liberado agora: criar papéis de cor novos e mudar valores de cor nos tokens das marcas e do núcleo do DS, em PRs de cores próprias, com UX, Revisor e aceite visual do Marcos quando a aparência de uma marca muda.
- Continua valendo: (1) o `eds-root` não muda de valor até 10/12, por causa da janela de recurso do EditalHub (DS-18, DS-19 e o bloqueio "Janela de recurso do EditalHub" acima); (2) o EditalHub segue com a cópia atual por SHA até 10/12; (3) a v2.11.0 não leva mudança de valor (ADR-0003), então valores mudados entram depois do corte; (4) produtos só recebem cor nova por PR, com "merge N" do Marcos.

**Decisões aguardando o Marcos**

1. **Atualização dos produtos para a versão mais recente do DS**, uma PR por produto. O impacto é por consumidor e exige avaliação antes de cada PR: o FinanceX muda no `btn-danger` (ponte provisória da #45) e o IMO recebe o primário preenchido. Ver o impacto por consumidor no CHANGELOG. Recomendação: fazer junto com a próxima atualização de cada produto. O merge de cada uma é do Marcos.

D5 só volta a ser pergunta depois da P1 (DS-24).

## F. Implantação nos produtos — IMO e XScore (M1–M9)

> Mandato do Marcos em 17/11: implantar o DS no Emprega+ IMO e no XScore até o fim, com Brand System de cada produto na mesma maturidade estrutural do Brand System da Electia (`brands/electia/previews/brand-system/`), sem exigir a mesma cara. Executores: **Codex** (só IMO) e **executor-xscore** (só XScore); Revisor: **Codex #2**; Supervisor DS coordena, faz push, PR e este painel. Produtos: PR com "merge N" do Marcos, em lote; deploy do XScore só com "go deploy". Escopo de escrita: cada Executor só no seu produto e na sua pasta `brands/` do DS; o núcleo compartilhado muda só por decisão consolidada do Supervisor, com um único Executor designado.
>
> Evidência de partida (17/11): `catalog/research/implantacao/` — diagnóstico do IMO (219 telas, 2 no piloto do DS), diagnóstico do XScore (35 telas, só tokens), decisão de arquitetura do roteiro único e proposta de cores (139 pares em 3 causas).

| Meta | IMO | XScore | Evidência | Bloqueio |
|---|---|---|---|---|
| M1 — Descoberta | EM ANDAMENTO | EM ANDAMENTO | inventário dos dois produtos em `catalog/research/implantacao/`; falta o inventário da referência Electia | — |
| M2 — Paridade | PENDENTE | PENDENTE | matriz produto × Electia ainda não existe | M1 |
| M3 — Estrutura | PENDENTE | PENDENTE | `brands/emprega-mais/previews/` tem só `brand-guidelines.html`; `brands/xscore/previews/` não existe | M2 |
| M4 — Identidade | NÃO VERIFICADO | NÃO VERIFICADO | tokens existem em `brands/emprega-mais` e `brands/xscore`; paridade com a Electia não medida | M2 |
| M5 — Componentes | EM ANDAMENTO | EM ANDAMENTO | catálogo DS-30 (#134–#139) mostra os contratos nas duas marcas; faltam contratos (seleção, marcação, texto longo, janela de formulário, arquivo, abas, aviso) | contratos novos no DS |
| M6 — Integração | EM ANDAMENTO | PENDENTE | IMO: piloto em 2 telas (IMO-31, #931); Onda 0 em execução local. XScore: só `@import` de tokens, nenhum componente | IMO: DS-10; XScore: O1 |
| M7 — Qualidade | EM ANDAMENTO | PENDENTE | IMO: script de captura e comparação da Onda 0 em execução local | — |
| M8 — Governança | EM ANDAMENTO | EM ANDAMENTO | IMO consome cópia por SHA (`RxPilotVendoredCopyTest`); XScore consome a tag v2.9.0; registro do mandato na governança do XScore pendente | emenda da D7 sem resposta do Marcos |
| M9 — Conclusão | PENDENTE | PENDENTE | — | M1–M8 |

Estados permitidos: PENDENTE, EM ANDAMENTO, AGUARDANDO VALIDAÇÃO, CONCLUÍDO, BLOQUEADO, NÃO VERIFICADO. CONCLUÍDO só com PR mesclada, CI verde e parecer do Revisor. Sem percentuais.

---

## E. Continuidade

- **Próxima ação executável:** esta PR (painel da implantação, só documentação): CI, Revisor e merge sob a autorização "A". Em paralelo: Executor IMO fecha a Onda 0 + provas da DS-10 e depois o M1/M2 do Brand System IMO; Executor XScore faz o M1/M2 do Brand System XScore e a onda O1. Catálogo PR 5b fica depois.
- **Depois:**
  1. DS-10, verificar as linhas da matriz ainda sem prova; IMO-30b depois da DS-17;
  2. DS-14, a partir de 27/11, com o inventário refeito até o SHA da tag;
  3. DS-17, a PR no IMO depois da tag.
- **Para retomar, ler nesta ordem:**
  1. `AGENTS.md` e `PAPEIS.md`;
  2. este painel;
  3. o [protocolo](governance/status-protocol.md);
  4. as ADRs [0001](adr/0001-role-named-tokens.md), [0003](adr/0003-token-single-source.md), [0004](adr/0004-contracts-adapters-pilot.md) e [0005](adr/0005-governance-propagation-decisions.md);
  5. `CHANGELOG.md` (seção Unreleased).
- **Estado do repositório no fechamento:**
  - PRs do DS abertas: esta (painel da implantação) e 4 do Dependabot (#130–#133), ainda não avaliadas;
  - pasta de trabalho do DS: só a desta PR, removida depois do merge.
