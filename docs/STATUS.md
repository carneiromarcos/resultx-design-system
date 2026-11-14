# ResultX Design System — Painel de status

> **Última atualização:** 14/11/2026, referência `main` = `16cdea4` (PR #121).
> **Quem mantém:** Supervisor DS. Atualizar a cada mudança material de estado (ver §11).
> **Regra de leitura:** "Concluído" exige evidência (PR mesclada, CI verde, parecer do Revisor). Documento escrito **não** conta como implementação.

---

## 1. Resumo executivo

- **Estado geral:** a missão está na metade do roteiro. Das 10 etapas do roteiro (E0–E7, mais F3 e a avaliação do piloto), **5 estão concluídas** (E0, E1, E2, F3, E3), **1 aguarda o Marcos** (avaliação do piloto) e **4 não começaram** (E4–E7).
- **Entregue:**
  - auditoria completa;
  - governança dos agentes;
  - tokens com fonte única;
  - 8 contratos de componente com adaptador CSS;
  - piloto **em produção no IMO**, nas telas de vagas e candidaturas do empregador (#902).
- **Ainda não pronto:**
  - a sincronização automática DS → produtos (só desenhada);
  - o adaptador React (Electia/Xscore);
  - o manifesto de conformidade por produto;
  - a ampliação do IMO além do piloto.
- **Bloqueios:**
  - escalas no `eds-root` (E4) só depois de **10/12** (janela de recurso do EditalHub);
  - a ampliação do IMO (E5) depende do **aceite visual do Marcos** no piloto.
- **Próximo marco:** versão **v2.11.0**, não antes de **27/11** (regra D7: no máximo uma versão a cada 2 semanas).

## 2. Objetivo e escopo

- **Missão original (13/11):** auditar e consolidar o ResultX DS. A Electia é a referência de experiência, o Emprega+ IMO é a prioridade de alinhamento e o Xscore é a expansão futura. São 10 entregáveis, em [`audits/2026-11-13-ds-auditoria/diagnostico-resultx-ds.md`](audits/2026-11-13-ds-auditoria/diagnostico-resultx-ds.md).
- **Missão complementar (13/11):** governança, propagação de mudanças e conformidade. São 8 entregáveis, em [`audits/2026-11-13-ds-auditoria/governanca-propagacao-conformidade.md`](audits/2026-11-13-ds-auditoria/governanca-propagacao-conformidade.md).
- **Decisões do Marcos que valem:**
  - D1, D2 e D3: vocabulário único, fonte única de tokens e tela piloto;
  - D4, D7, D8 e D10 ([ADR-0005](adr/0005-governance-propagation-decisions.md));
  - D5 e D6 foram adiadas por decisão.
- **Fora do escopo agora:** EditalHub (congelado até 10/12), FinanceX e ResultX Site. Esses dois só passam por conferência de impacto antes de cada versão.

## 3. Estado geral

| Indicador | Valor | Como foi medido |
|---|---|---|
| Etapas do roteiro concluídas | 5 de 10 (50%) | roteiro do diagnóstico §10; concluída = PR mesclada com CI verde e Revisor |
| Entregáveis da missão original documentados | 10 de 10 | diagnóstico §1–§10, versionado em #111 |
| Entregáveis da governança documentados | 8 de 8 | desenho de governança, versionado em #113 |
| Decisões de governança aplicadas | 4 de 7 (D4, D7, D8, D10) | D5 e D6 adiadas; D9 só vale quando a conformidade entrar em modo aviso |
| Contratos de componente | 8 de 8 do lote piloto | `contracts/*.yaml` (#117) |
| Linhas da matriz Electia × IMO cobertas pelo piloto | 8 de 25 (linhas 1, 5, 7, 8, 10, 11, 14, 20) | diagnóstico §5 e §10 (critério da E3) |
| Produtos na versão mais recente do DS | 0 de 3 | Electia e Xscore travados em `#v2.9.0`; o IMO copia arquivos por SHA |
| Versão publicada mais recente | `v2.10.0` (`52d6b4e`, 13/11) | tags do GitHub |

## 4. Quadro de entregáveis

Status: **Concluído**, **Em andamento**, **Pendente**, **Bloqueado** ou **Não verificado**.

| Etapa | Status | Progresso (critério) | Evidência | Próxima ação |
|---|---|---|---|---|
| Auditoria Electia | Concluído (documento) | 1/1 relatório, com parecer do Revisor | diagnóstico §1 + anexo B; #111 (`c86f1e6`) | revisitar só na E6 |
| Auditoria ResultX DS | Concluído (documento) | 1/1 | diagnóstico §2 + anexo A; #111 | — |
| Auditoria IMO | Concluído (documento) | 1/1 | diagnóstico §3 + anexo C; #111 | — |
| Inventário de tokens | Concluído | documento §4.1 + fonte única implementada (E1) | #116 (`c7aaeec`): `tokens/tokens.json` gera `eds-root` idêntico | `brands/*/tokens/tokens.json` ainda são manuais |
| Inventário de componentes | Concluído (documento) | 1/1 | diagnóstico §4.2 | atualizar quando a E5 começar |
| Matriz Electia × IMO | Concluído (documento); aplicação Em andamento | matriz 25/25 escrita; 8/25 aplicadas, só nas telas do piloto | diagnóstico §5; IMO #902 | ampliar na E5 |
| Arquitetura compartilhada | Em andamento | 3 de 6 camadas implementadas (Tokens, Contratos, Adaptadores); Foundation, Temas e Padrões de produto só documentados | [ADR-0001](adr/0001-role-named-tokens.md), [0003](adr/0003-token-single-source.md), [0004](adr/0004-contracts-adapters-pilot.md); #116, #117, #119 | camada de padrões de produto na E5 |
| Temas por marca | Em andamento | temas gerados da fonte única; white-label do IMO com 49 pares abaixo do mínimo, em 29 de 36 cores | `tokens/dtcg/layouts/brand-*.css.tmpl` (#116); IMO `docs/qa/2026-11-13-ds-e3-varredura-white-label.md` | correção do white-label exige mudança de valor → depois de 10/12 |
| Adaptadores por stack | Em andamento | 2 de 3 stacks: CSS (`pilot.css` em `@layer` + `pilot.scoped.css`) e Blade (8 `<x-rx-*>` no IMO); React não começou | #117, #119, #120, #121; IMO #902 | React na E6 (Electia) / E7 (Xscore) |
| Governança dos agentes | Concluído (escopo E0) | regra de interface no AGENTS.md dos 4 repos; CODEOWNERS; proteção da `main` do DS com 3 checks obrigatórios; PAPEIS.md | #111, #113, #115; Electia #1009; IMO #900; Xscore já tinha | manter |
| Sincronização DS → produtos | Pendente (só desenho) | 0 de 3 peças: prova P1 da automação, `consumers.yaml` e manifesto `.ds/` em cada produto | desenho §1, §5 e §6; D5 adiada | prova descartável P1 depois da v2.11.0 |
| Testes e conformidade | Em andamento | DS: lint/build, contraste, visual Linux obrigatório e sonda com autoteste. Produtos: testes do IMO para o piloto. Fases G0–G3 não começaram | runs na `main` `16cdea4`: CI 43594117301, Pages 43594116982, Visual 43594124917 (verdes) | G0: criar manifesto no IMO e na Electia |
| Plano de migração IMO | Em andamento | F1, F3 e E3 em produção; E4 bloqueada até 10/12; E5 aguarda aceite do piloto | IMO #891 (F1, 12/11), #901 (F3), #902 (E3); deploy 43591765046 | aceite visual do Marcos no piloto |
| Avaliação do piloto | Não verificado | aceite visual do Marcos não registrado; Revisor aprovou com ressalvas | IMO `docs/qa/2026-11-13-ds-e3-piloto-avaliacao.md` | Marcos olha as duas telas em produção |

## 5. Últimas alterações verificadas (13–14/11)

| Data | PR | O que mudou |
|---|---|---|
| 14/11 | DS #121 | Botão primário do adaptador volta a ter preenchimento de marca, com borda neutra; contrato exige limite ≥3:1 e texto ≥4,5:1; varredura de 288 medições, todas ≥5,89:1 |
| 14/11 | IMO #902 | Piloto E3 em produção: 8 componentes Blade e 5 folhas `rx-pilot*` copiadas por SHA, nas telas de vagas e candidaturas do empregador |
| 13/11 | DS #120 | Legenda da tabela e sonda que lê `color(srgb)` |
| 13/11 | DS #119 | Variante escopada do adaptador e aliases Emprega+ para stacks sem `@layer` |
| 13/11 | DS #118 | 10 baselines Linux da vitrine do adaptador |
| 13/11 | DS #117 | E2: 8 contratos YAML e adaptador CSS opcional |
| 13/11 | DS #116 | E1: fonte única DTCG com saída igual à da v2.10.0 |
| 13/11 | DS #115 | 17 combinações de botão abaixo de AA corrigidas; PAPEIS.md versionado |
| 13/11 | DS #114 | Versão v2.10.0 |
| 13/11 | DS #113 | Decisões D4–D10, ADR-0005; visual Linux em toda PR |
| 13/11 | DS #112 | Teste visual Linux no CI |
| 13/11 | DS #111 | E0: governança, ADRs 0001/0003/0004, auditoria versionada |
| 13/11 | IMO #901 | F3: marca do portal no Bootstrap e plugins |
| 13/11 | IMO #900 / Electia #1009 | Regra de interface do DS no AGENTS.md |

## 6. O que mudou em cada produto

- **IMO — mudou.**
  - F3 (#901): cores do portal aplicadas ao Bootstrap e aos plugins.
  - E3 (#902): 43 arquivos, só views, CSS, componentes Blade e testes, sem regra de negócio, nas telas **Minhas vagas** e **Candidaturas da vaga** do empregador. Em produção desde 14/11.
  - O botão primário do piloto em produção ainda usa a cópia de `bd1457a`: a correção #121 chega ao IMO depois da v2.11.0, por recópia com SHA.
- **Electia — sem mudança visual ou de código.** Só documentação de regra para agentes (#1009). Continua em `#v2.9.0`.
- **Xscore — sem mudança.** Nenhum commit desde 12/11. A regra de interface já existia. Continua em `#v2.9.0`.

## 7. Validação

| Verificação | Resultado | Evidência |
|---|---|---|
| CI do DS (lint, build, contraste, sonda) | Passou | `main` `16cdea4`, run 43594117301 |
| Visual Linux do DS (obrigatório) | Passou | run 43594124917 |
| Site de documentação (Pages) | Passou | run 43594116982 |
| Revisor independente | Aprovou cada PR do DS desta missão; várias passaram por reprovação e correção | pareceres registrados nas PRs |
| Testes do IMO para o piloto (MySQL, smoke, cópia por SHA) | Passaram no CI | IMO #902, head `55fb9d65` |
| Smoke em produção do IMO | Passou: folhas `rx-pilot*` respondem 200; SHA de `rx-pilot.css` igual ao da `bd1457a` | deploy 43591765046 |
| Capturas 320/768/1024/1440 nos produtos | Feitas localmente pelo Executor durante a E3; **não versionadas nem automáticas** | IMO `docs/qa/` |
| Navegadores além do Chromium (Firefox, Safari) | **Não realizado** | — |
| Lighthouse / desempenho | **Não realizado** | — |
| Aceite visual humano do piloto | **Não registrado** | — |

## 8. Pendências e bloqueios

| Lacuna | Por que falta | Depende de | Risco de seguir sem resolver | Próxima ação |
|---|---|---|---|---|
| Baselines de página inteira `pilot-light`/`pilot-dark` desatualizadas | a tolerância 0,005 esconde a mudança do botão | Supervisor (PR própria) | o teste visual não pega uma regressão pequena no botão | calibrar ou recortar a área de ações; regenerar pelo workflow; antes da v2.11.0 |
| CHANGELOG diz "nos estados do botão" | redação genérica; a varredura cobre só repouso e hover | mesma PR acima | leitor supor cobertura de `active` | corrigir a frase |
| Revisão visual dos 3 `btn-danger` do FinanceX | ressalva do Revisor na #115 | captura real no FinanceX | botão de perigo mudar sem ninguém ver | fazer antes de cortar a v2.11.0 |
| White-label do IMO: 49 pares abaixo do mínimo | correção exige mudança de valor de token | 10/12 (E4) | empresas com cor clara (ex.: amarelo) com link/CTA ilegível | plano na E4 |
| Diálogos "Encerrar vaga" e "Perfil" não devolvem o foco | precisa de JavaScript; o piloto foi feito sem JS | decisão do Marcos | usuário de teclado perde a posição | decidir se libera JS mínimo |
| Vermelho do SweetAlert (exclusão) a 3,94:1 | preexistente, fora do piloto | F4 do IMO | texto de confirmação abaixo de AA | F4 |
| Sincronização automática | só desenho; D5 adiada de propósito | prova P1 + aceite de risco do Marcos | cópias manuais divergirem entre produtos | prova P1 depois da v2.11.0 |
| Adaptador React | etapa E6/E7 ainda não começou | E1/E2 (prontas) | Electia e Xscore seguem fora dos contratos | planejar a E6 |
| Manifesto `.ds/` e fases G0–G3 | ainda não começou | nenhuma técnica | conformidade continua manual | G0 no IMO e na Electia |
| PRs do Dependabot #108 e #110 abertas | não tratadas | Supervisor | dependências de desenvolvimento desatualizadas | revisar no ciclo da v2.11.0 |

## 9. Decisões aguardando o Marcos

1. **Aceite visual do piloto em produção.** Sem ele, a E5 não começa. Recomendação: olhar as duas telas no claro e no escuro.
2. **JavaScript mínimo para devolver o foco nos diálogos do piloto.** Recomendação: liberar, como primeira fatia da E5.
3. **Merge das PRs de atualização de versão nos produtos**, quando forem abertas (uma por produto, sem efeito visual na v2.10.0).

D5 (credencial da automação) só volta a ser pergunta depois da prova P1.

## 10. Próximas cinco ações (em ordem)

1. **Marcos:** aceite visual do piloto do IMO.
2. **Supervisor:** PR das baselines de página inteira + frase do CHANGELOG.
3. **Supervisor + Executor:** revisão visual do `btn-danger` no FinanceX e inventário de impacto nos produtos.
4. **Supervisor:** cortar a **v2.11.0** (a partir de 27/11), com CI verde e Revisor.
5. **Executor (PR no IMO, merge do Marcos):** recopiar `rx-pilot.css` da v2.11.0 por SHA e decidir se o CTA "Ver planos" usa `rx-button--primary`.

## 11. Como manter este painel

- Ao **iniciar** uma sessão de trabalho no DS, ler este arquivo antes de continuar.
- Atualizar quando o estado mudar de forma material: PR mesclada, etapa concluída ou travada, versão publicada ou decisão do Marcos.
- Em cada atualização, registrar: o que foi feito, a evidência (PR/SHA/run), os testes rodados, as pendências e a próxima etapa.
- Não marcar como concluído só porque o código foi escrito. Valem o critério de aceite e a validação.
- O checklist operacional continua em `tarefas.md` (quando existir) e na nota do Maestri. Este painel é a visão gerencial.
