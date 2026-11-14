# Protocolo de status e continuidade dos agentes

> Diretriz permanente da ResultX (14/11/2026). Vale para este repositório e é o **modelo reutilizável** para os demais projetos (Electia, Emprega+ IMO, Xscore, Hermes OS), que a adotam por PR própria, sem propagação automática.
> **Princípio:** o trabalho deve ser observável, verificável e retomável, mesmo depois de interrupções ou trocas de sessão e de agente.
> **Regra final:** nenhuma atividade é concluída sem evidência, e nenhuma sessão relevante termina sem deixar um caminho claro para continuar.

## 1. Fonte de verdade

- Cada projeto tem **um** painel persistente. Neste repositório é [`docs/STATUS.md`](../STATUS.md). Nos demais, use o documento equivalente que já existir; se não houver, crie `docs/governance/STATUS.md`.
- O painel acompanha o trabalho. Ele **não** duplica ADRs, auditorias nem relatórios técnicos: aponta para eles.
- Hierarquia: AGENTS.md e PAPEIS.md (regras e papéis) → ADRs (decisões) → painel (estado). Em conflito entre o painel e o Git/CI, vale o Git/CI, e o painel é corrigido.

## 2. Conteúdo obrigatório do painel

| Seção | O que contém |
|---|---|
| A. Visão executiva | objetivo atual, fase, estado geral, principais resultados, próximo marco |
| B. Quadro de atividades | por atividade: ID único, descrição, estado, critério de conclusão, evidência, dependências, próxima ação |
| C. Registro de progresso | histórico cronológico curto das mudanças relevantes |
| D. Bloqueios e decisões | impedimentos e decisões pendentes, com contexto suficiente para resolver |
| E. Continuidade | próxima ação executável e arquivos necessários para retomar |

## 3. Estados padronizados

| Estado | Quando usar |
|---|---|
| PENDENTE | identificada, ainda não iniciada |
| EM ANDAMENTO | iniciada, com trabalho restante |
| AGUARDANDO VALIDAÇÃO | produzida, aguardando teste, Revisor ou aprovação humana |
| CONCLUÍDO | critério de aceite atendido **e** evidência registrada |
| BLOQUEADO | impedida por dependência, erro ou decisão externa |
| NÃO VERIFICADO | há indício de execução, sem evidência suficiente |
| CANCELADO | encerrada por decisão explícita, com justificativa |

Código escrito não é atividade concluída.

## 4. Início de sessão

1. Ler o painel e as regras aplicáveis (AGENTS.md, PAPEIS.md, ADRs citadas).
2. Identificar a missão ativa e a próxima atividade executável.
3. Verificar o estado real: `git status`, alterações não commitadas, PRs abertas, CI.
4. Se o painel estiver desatualizado, reconciliá-lo com as evidências antes de continuar.
5. Seguir do último ponto validado. Não refazer o que está concluído e não auditar o projeto inteiro a cada sessão.

## 5. Durante a execução

Atualizar o painel só em evento relevante:
- atividade concluída;
- mudança de fase;
- bloqueio novo;
- falha relevante de teste;
- decisão de arquitetura;
- mudança de escopo;
- risco novo;
- interrupção que exija retomada.

Não atualizar a cada operação pequena nem parar o trabalho para produzir relatórios repetidos.

## 6. Encerramento de sessão

No ponto seguro de parada, se houve mudança material, registrar no painel (seção C e E):
- **REALIZADO**;
- **VALIDADO** (testes e resultados);
- **PENDENTE**;
- **BLOQUEIOS**;
- **PRÓXIMA AÇÃO** (uma só, concreta);
- **EVIDÊNCIAS** (arquivos, commits, PRs, runs).

Sem mudança material, não gerar relatório.

## 7. Relatório ao gestor

Quando o status for pedido, a ordem é:
1. **STATUS DO PROJETO:** projeto, fase, estado geral, última atualização verificada.
2. **PROGRESSO:** atividade, estado, evidência, próxima ação.
3. **ENTREGAS RECENTES.**
4. **RISCOS E BLOQUEIOS.**
5. **DECISÕES NECESSÁRIAS.**
6. **PRÓXIMOS PASSOS:** até cinco.

O relatório deve ser legível sem abrir o código.

## 8. Indicadores

- Medir por entregáveis e critérios verificáveis: concluídas/total, aguardando validação, bloqueadas, entregáveis aceitos/planejados, testes aprovados/executados.
- Sem base confiável, mostrar o estado por atividade. Nada de percentual inventado.

## 9. Autonomia

- O agente executa sozinho o trabalho técnico dentro do escopo aprovado.
- Pede aprovação para:
  - mudança significativa de arquitetura, escopo ou requisito;
  - exclusão de dados ou componentes relevantes;
  - operação destrutiva;
  - impacto em produção;
  - dependência ou custo relevante;
  - decisão de produto fora da missão.
- Bloqueado numa frente, segue em outra atividade independente e autorizada antes de parar tudo.
- As autorizações específicas de cada repositório (quem faz push, PR, merge e deploy) continuam valendo e prevalecem sobre este texto.

## 10. Git, CI e publicação

- Ligar cada entrega a ramo, commit, PR, run de CI e ADR quando houver.
- Distinguir sempre quatro estados de uma mudança: **local**, **commitada**, **enviada ao remoto** (PR) e **implantada/mesclada**. Nunca chamar de publicado o que está só local.
- Não abrir commit, push ou PR só para atualizar o painel se as regras do repositório não permitirem. Nesse caso, a atualização vai junto com a próxima PR material.

## 11. Troca de agente

O sucessor lê, nesta ordem:
1. as instruções do projeto;
2. o painel;
3. as ADRs aplicáveis;
4. as evidências das últimas entregas;
5. a próxima ação registrada.

Antes de executar, ele valida o estado do repositório para não duplicar trabalho nem sobrescrever alterações.

## 12. Critério de que o protocolo está funcionando

- O status persiste entre sessões e é lido ao retomar.
- Entregas relevantes têm evidência.
- Pendências, bloqueios e a próxima ação estão registrados.
- O gestor pede um resumo e recebe sem uma nova investigação completa.
- O acompanhamento não interrompe a execução além do necessário.
