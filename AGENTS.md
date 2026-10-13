# AGENTS.md — resultx-design-system

Instruções para agentes de IA (Claude Code, Codex, Cursor e afins) neste repositório.

## Execução de tarefas
- **Tarefas longas (3+ etapas ou várias sessões):** crie `tarefas.md` na raiz com um checklist (`- [ ]`) antes de começar, marque cada item ao concluir e só encerre com todos marcados ou com o motivo de cada pendência registrado no próprio arquivo. Ao retomar, leia `tarefas.md` primeiro.
- **Espelho no Maestri:** o `tarefas.md` é espelhado na nota do Maestri conectada ao terminal (uma nota por terminal; skill `maestri`). Toda vez que criar ou atualizar `tarefas.md`, atualize a nota na mesma hora com o conteúdo completo do checklist. Envie o texto via heredoc, nunca entre aspas duplas com crase ou `$()`. Se não houver nota conectada, avise o Marcos uma vez e continue só no arquivo.
- **Respostas anteriores estão encerradas:** trate o que já foi respondido na conversa como concluído. Não reanalise nem repita o histórico; responda só ao pedido atual, consultando o passado apenas quando ele pedir ou quando for indispensável.
