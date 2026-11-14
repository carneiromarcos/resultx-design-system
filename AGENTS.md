# AGENTS.md — resultx-design-system

Instruções para agentes de IA (Claude Code, Codex, Cursor e afins) neste repositório.

## Execução de tarefas
- **Painel de status:** ao iniciar uma sessão no DS, leia `docs/STATUS.md`. Ao mudar o estado de forma material (PR mesclada, etapa concluída ou travada, versão, decisão do Marcos), o Supervisor DS atualiza o painel com evidência, testes, pendências e próxima etapa.
- **Tarefas longas (3+ etapas ou várias sessões):** crie `tarefas.md` na raiz com um checklist (`- [ ]`) antes de começar, marque cada item ao concluir e só encerre com todos marcados ou com o motivo de cada pendência registrado no próprio arquivo. Ao retomar, leia `tarefas.md` primeiro.
- **Espelho no Maestri:** o `tarefas.md` tem uma nota própria no Maestri, chamada `tarefas — resultx-design-system`.
  - Ao criar o `tarefas.md`, rode `maestri list`. Se a nota não existir, crie com `maestri note create "$(cat tarefas.md)" --name "tarefas — resultx-design-system"`. O `--name` impede que ela mude de nome.
  - A cada atualização do arquivo, rode na mesma hora `maestri note write "tarefas — resultx-design-system" "$(cat tarefas.md)"`. Só use `write` nessa nota, que é exclusiva do checklist. Nunca use `write` em nota com outro conteúdo.
  - Nunca escreva o checklist entre aspas duplas digitado à mão: crase ou `$()` no texto são executados. Sempre leia o arquivo com `"$(cat tarefas.md)"`.
  - Se o `maestri` não responder, avise o Marcos uma vez e continue só no arquivo.
- **Respostas anteriores estão encerradas:** trate o que já foi respondido na conversa como concluído. Não reanalise nem repita o histórico; responda só ao pedido atual, consultando o passado apenas quando ele pedir ou quando for indispensável.

## Interface — regras do ResultX DS (ADR-0001, 0003, 0004)
Valem para este repo e são o modelo do bloco que cada produto consumidor copia no próprio AGENTS.md.
1. **Antes de criar ou alterar tela, token ou componente**, leia o contrato do componente (`contracts/`, quando existir; até lá, `docs/components/`) e as ADRs 0001, 0003 e 0004.
2. **Use componente e token existentes.** Não crie cor, espaçamento, fonte, ícone, sombra ou animação fora dos tokens. Nomes de token dizem o papel, nunca a aparência (ADR-0001).
3. **Artefato gerado não se edita à mão** (ADR-0003). Mude a fonte e rode o build.
4. **Componente ou variante nova** exige justificativa no PR (por que nenhum existente serve), contrato com casos de teste e captura nos dois temas.
5. **Não copie código entre stacks** (JSX ↔ Blade). Compartilhe contrato e token, não markup.
6. **Particularidade de uma marca não vira regra do núcleo** sem decisão registrada (tema escuro da Electia, cores de teoria, ouro do Xscore etc.).
7. **Antes do PR**, rode `npm run lint`, `npm run build` e `npm test`; registre exceção no PR, com motivo e prazo.
8. **Mudança que altera valor em `brands/emprega-mais/tokens/eds-root.css`** só com ordem do Supervisor: ela se propaga por SHA para IMO e EditalHub.
