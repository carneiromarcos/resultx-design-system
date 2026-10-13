# AGENTS.md — resultx-design-system

Instruções para agentes de IA (Claude Code, Codex, Cursor e afins) neste repositório.

## Execução de tarefas
- **Tarefas longas (3+ etapas ou várias sessões):** crie `tarefas.md` na raiz com um checklist (`- [ ]`) antes de começar, marque cada item ao concluir e só encerre com todos marcados ou com o motivo de cada pendência registrado no próprio arquivo. Ao retomar, leia `tarefas.md` primeiro.
- **Espelho no Maestri:** o `tarefas.md` tem uma nota própria no Maestri, chamada `tarefas — resultx-design-system`.
  - Ao criar o `tarefas.md`, rode `maestri list`. Se a nota não existir, crie com `maestri note create "$(cat tarefas.md)" --name "tarefas — resultx-design-system"`. O `--name` impede que ela mude de nome.
  - A cada atualização do arquivo, rode na mesma hora `maestri note write "tarefas — resultx-design-system" "$(cat tarefas.md)"`. Só use `write` nessa nota, que é exclusiva do checklist. Nunca use `write` em nota com outro conteúdo.
  - Nunca escreva o checklist entre aspas duplas digitado à mão: crase ou `$()` no texto são executados. Sempre leia o arquivo com `"$(cat tarefas.md)"`.
  - Se o `maestri` não responder, avise o Marcos uma vez e continue só no arquivo.
- **Respostas anteriores estão encerradas:** trate o que já foi respondido na conversa como concluído. Não reanalise nem repita o histórico; responda só ao pedido atual, consultando o passado apenas quando ele pedir ou quando for indispensável.
