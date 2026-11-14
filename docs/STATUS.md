# ResultX Design System — Painel de status

> **Última atualização verificada:** 14/11/2026, `main` = `6a4e797` (PR #126).
> **Quem mantém:** Supervisor DS, conforme o [protocolo de status e continuidade](governance/status-protocol.md).
> **Regra de leitura:** CONCLUÍDO exige critério atendido e evidência (PR mesclada, CI verde, parecer do Revisor). Documento escrito **não** conta como implementação.

---

## A. Visão executiva

- **Objetivo atual:** consolidar o ResultX DS. A Electia é a referência de experiência, o Emprega+ IMO é a prioridade de alinhamento e o Xscore é a expansão futura. Fontes:
  - [diagnóstico](audits/2026-11-13-ds-auditoria/diagnostico-resultx-ds.md);
  - [governança](audits/2026-11-13-ds-auditoria/governanca-propagacao-conformidade.md).
- **Fase:** depois do piloto (E3) e antes da **v2.11.0**, que sai a partir de 27/11 (regra D7).
- **Estado geral:** das 28 atividades do quadro abaixo:
  - 15 CONCLUÍDO;
  - 3 EM ANDAMENTO;
  - 1 AGUARDANDO VALIDAÇÃO;
  - 3 BLOQUEADO;
  - 6 PENDENTE.
- **Pelo roteiro do diagnóstico:**
  - etapas concluídas pelo critério: 4 de 10 (E0, E1, E2, F3);
  - a E3 está em produção com desvios;
  - o Marcos aceitou o visual do piloto em 14/11; a correção de foco (DS-20) está em produção (IMO #909);
  - a E3 continua com desvios da matriz a verificar (DS-10);
  - E4–E7 não começaram.
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
| Atividades | 15 concluídas / 28; 3 em andamento; 1 aguardando validação; 3 bloqueadas; 6 pendentes | quadro B |
| Etapas do roteiro | 4 de 10 pelo critério; a E3 em produção com desvios não é contada | diagnóstico §10 |
| Matriz Electia × IMO no piloto | 8 de 25 **trabalhadas** (1, 5, 7, 8, 10, 11, 14, 20). **Critério satisfeito comprovado em 0.** 3 comprovadamente não atendem (1, 5, 14); 5 sem verificação (7, 8, 10, 11, 20) | diagnóstico §5 e §10 |
| Camadas da arquitetura | 2 completas (Tokens; Contratos do lote piloto), 2 parciais (Temas, Adaptadores), 2 sem entrega nesta missão (Foundation, Padrões de produto) | completa = artefato versionado + teste no CI + consumido por produto ou pela vitrine |
| Decisões de governança aplicadas | 4 de 7 (D4, D7, D8, D10) | D5 e D6 adiadas; D9 só vale quando a conformidade entrar em modo aviso ([ADR-0005](adr/0005-governance-propagation-decisions.md)) |
| Produtos na versão mais recente do DS | 0 de 3 | Electia e Xscore travados em `#v2.9.0`; o IMO copia 2 arquivos do DS por SHA |
| Testes da `main` `6a4e797` | 3 de 3 verdes | CI, Pages, Visual Linux (16 baselines) |

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
| DS-10 | E3 — piloto IMO (vagas e candidaturas do empregador) | EM ANDAMENTO | linhas 1, 5, 7, 8, 10, 11, 14, 20 da matriz atendidas; capturas; teclado; testes verdes | em produção: IMO #902 (`cfeae3b1`), deploy 43591765046; foco: IMO #909 (`02182668`) | DS-17, DS-19 | botões das telas em `<x-rx-button>`; verificar 7, 8, 10, 11, 20 |
| DS-11 | Avaliação do piloto | CONCLUÍDO | aceite visual do Marcos | IMO `docs/qa/2026-11-13-ds-e3-piloto-avaliacao.md`; aceite do Marcos em 14/11, registrado também no painel do IMO (IMO #903) | — | — |
| DS-12 | Botão primário com preenchimento e teste visual que o protege | CONCLUÍDO | contrato ≥3:1 no limite e ≥4,5:1 no texto; captura que reprova sem preenchimento | #121 (`16cdea4`), #123 (`c71e9b4`) | — | chega ao IMO na DS-17 |
| DS-13 | Painel de status e protocolo de continuidade | CONCLUÍDO | painel no formato do protocolo; AGENTS.md aponta o protocolo; Revisor | #122 (`3e59c57`), #124 (`7f58e77`), #125 (`5b18b15`), Revisor APROVA em cada uma | — | — |
| DS-14 | Versão v2.11.0 | EM ANDAMENTO | inventário até o SHA da tag, impacto por produto, CI verde, Revisor | rascunho do impacto por consumidor no CHANGELOG (`v2.10.0..5b18b15`); cssnano 9.9 (DS-16) sem efeito no `dist` | 27/11 (D7), DS-16 | refazer o inventário até o SHA da tag e cortar a partir de 27/11 |
| DS-15 | Revisão visual do `btn-danger` do FinanceX | CONCLUÍDO | captura real aprovada pelo Revisor | 5 usos em `premium-light`, repouso/hover/foco, v2.9.0 × v2.10.0 × `main`: contraste 3,10–4,14:1 → 4,83:1; Revisor APROVA COM RESSALVA (rodada 2, depois de 1 REPROVA). Capturas locais com dados sintéticos, 1440 px, fora do repositório | — | ressalva de hierarquia vira a DS-27 |
| DS-16 | Dependabot #108 e #110 | EM ANDAMENTO | as duas atualizações numa PR sobre a `main`, 3 checks verdes, Revisor no SHA final | o robô ignorou o rebase; refeitas nesta PR (`c8c597a`): fast-uri 3.1.9, 7 dev-deps, imagem Playwright 1.65.0 por digest; `dist` gerado de novo é idêntico ao da `main`; Jest 747/747; Revisor APROVA COM RESSALVA no `c8c597a` | Visual Linux oficial; Revisor no SHA final | fechar #108 e #110 apontando para esta PR |
| DS-17 | IMO recebe a v2.11.0 | PENDENTE | recópia por SHA; `RxPilotVendoredCopyTest` atualizado; CTA "Ver planos" decidido | — | DS-14; merge do Marcos | PR no IMO depois da tag |
| DS-18 | E4 — escalas no `eds-root` | BLOQUEADO | SHA igual nas 3 cópias | — | 10/12 (recurso do EditalHub) | planejar depois de 10/12 |
| DS-19 | Contraste do white-label (linha 1) | BLOQUEADO | ≥4,5:1 para qualquer cor na grade | IMO `docs/qa/2026-11-13-ds-e3-varredura-white-label.md`: 49 pares abaixo, em 29 de 36 cores | mudança de valor → 10/12 | entra na E4 |
| DS-20 | Foco volta ao fechar os diálogos do piloto (linha 14) — correção do piloto (E3), **antes** da E5 | CONCLUÍDO | foco retorna ao gatilho nos diálogos "Encerrar vaga" e "Perfil" | IMO #909 (`02182668`), deploy 43633112245; teste Livewire falha sem a correção e passa com ela; Revisor APROVA COM RESSALVA; o Marcos aceitou a exceção das 2 falhas de concorrência que já existiam na base | — | consertar as 2 falhas de concorrência do IMO (fora do DS) |
| DS-21 | E5 — ampliação do IMO | BLOQUEADO | catraca do IMO cai a cada lote | — | DS-10 | — |
| DS-22 | E6 — Electia convergindo (inclui adaptador React) | PENDENTE | capturas antes/depois sem diferença não intencional | — | E1/E2 (prontas) | planejar |
| DS-23 | E7 — Xscore | PENDENTE | travas do Xscore verdes; capturas iguais | — | E1 (pronta) | planejar |
| DS-24 | Prova descartável P1 da propagação | PENDENTE | P1 passa sem escrita em produto | desenho §6.5 | DS-14 | depois da v2.11.0 |
| DS-25 | Conformidade G0 (manifesto `.ds/` no IMO e na Electia) | PENDENTE | 2 relatórios coerentes com o desenho §5.5 | desenho §7.1 | — | criar o manifesto |
| DS-26 | D5 — GitHub App da automação | PENDENTE (adiada por decisão) | aceite de risco expresso do Marcos | ADR-0005 | DS-24 | voltar a perguntar depois da P1 |
| DS-27 | Hierarquia do botão de perigo no FinanceX | CONCLUÍDO | decisão registrada antes de o FinanceX subir de versão (ex.: Desativar por linha em variante neutra) | decisão do Marcos em 14/11; FinanceX #45 (`71df56a7`): Desativar neutro, confirmação em Excluir regra e Cancelar plano, ponte provisória do `btn-danger`; CI verde; Revisor APROVA | — | tirar a ponte quando o FinanceX subir para a v2.11.0 |
| DS-28 | Protocolo de status adotado no IMO | AGUARDANDO VALIDAÇÃO | painel versionado no IMO; Revisor; merge do Marcos | IMO #903 mesclada (`c5d2f2bc`); parecer do Revisor sobre a #903 não localizado no registro | confirmação do Revisor | registrar o parecer; o painel do IMO segue com IMO-06 e IMO-26 antigos, atualizar na próxima PR material do IMO |

## C. Registro de progresso

| Data | Referência | O que mudou |
|---|---|---|
| 14/11 | esta PR | DS-16: #108 e #110 refeitas numa PR (Playwright 1.65.0, cssnano 9.9 sem efeito no `dist`); painel após #909, #45 e #903 |
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

- **IMO — mudou:** F3 (#901), piloto E3 (#902) e retorno de foco (#909), em produção. São 43 arquivos: views, CSS, componentes Blade, testes e 4 relatórios em `docs/qa/`, sem regra de negócio. A correção do primário (#121) chega ao IMO depois da v2.11.0.
- **Electia — sem mudança visual relacionada ao DS.** Desde 12/11 entraram duas PRs:
  - #1009: só documentação;
  - #1008: código de leads e e-mail, sem interface nem DS.
  - Continua em `#v2.9.0`.
- **FinanceX — mudou:** #45 (hierarquia do botão de perigo e ponte provisória do `btn-danger`). Continua em `#v2.9.0`. Publicação no site não conferida.
- **Xscore — sem mudança.** Nenhum commit na pasta depois do commit de referência da auditoria (`35921bf5`, 13/11). Continua em `#v2.9.0`.

### Validação

| Verificação | Resultado | Evidência |
|---|---|---|
| CI do DS (lint, build, contraste, sonda) | Passou | `main` `6a4e797`, run 43603948159 |
| Visual Linux do DS (obrigatório, 16 baselines) | Passou | `main` `6a4e797`, run 43603953603 |
| Site de documentação (Pages) | Passou | `main` `6a4e797`, run 43603948203 |
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
| E3 com desvios da matriz | DS-21 | a E5 só começa com a E3 fechada | verificar as linhas 7, 8, 10, 11 e 20 e fechar a DS-10 |

**Decisões aguardando o Marcos**

1. **Atualização dos produtos para a versão mais recente do DS**, uma PR por produto, sem efeito visual. Recomendação: fazer junto com a próxima atualização de cada produto. O merge de cada uma é do Marcos.

D5 só volta a ser pergunta depois da P1 (DS-24).

## E. Continuidade

- **Próxima ação executável:** DS-16 nesta PR: Visual Linux oficial com as 16 baselines, Revisor no SHA final, merge e fechamento de #108 e #110. Registrar o parecer do Revisor na IMO #903 (DS-28).
- **Depois:**
  1. DS-10, verificar as linhas da matriz ainda sem prova;
  2. DS-14, a partir de 27/11, com o inventário refeito até o SHA da tag;
  3. DS-17, a PR no IMO depois da tag.
- **Para retomar, ler nesta ordem:**
  1. `AGENTS.md` e `PAPEIS.md`;
  2. este painel;
  3. o [protocolo](governance/status-protocol.md);
  4. as ADRs [0001](adr/0001-role-named-tokens.md), [0003](adr/0003-token-single-source.md), [0004](adr/0004-contracts-adapters-pilot.md) e [0005](adr/0005-governance-propagation-decisions.md);
  5. `CHANGELOG.md` (seção Unreleased).
- **Estado do repositório no fechamento:**
  - PRs do DS abertas: esta (DS-16) e as #108/#110, que fecham depois do merge;
  - pasta de trabalho do DS: só a desta PR, removida depois do merge.
