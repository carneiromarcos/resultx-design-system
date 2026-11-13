# E0 — provas locais de governança

## Commit inválido

`git commit --allow-empty -m 'mensagem invalida'` foi recusado com código 1; nenhum commit foi criado. Os ganchos executaram lint e 681 testes antes do commit-msg:

```text
✖ subject may not be empty [subject-empty]
✖ type may not be empty [type-empty]
husky - commit-msg script failed (code 1)
```

## Catraca de contraste

Com o CSS original, `npm test -- --runInBand tests/button-contrast.test.js` reprovou apenas os dois pares deliberadamente fora da lista de dívidas:

```text
dark/success: 1.92841:1 (#E6EDF3 sobre #22C55E)
dark/success:hover: 1.86832:1 (#FDFFFF sobre #25D967)
```

Após a correção com `--text-on-success`, o mesmo comando passou: 1 suíte, 1 teste. O par dark normal passou a 8.47738:1 (#0B0E14 sobre #22C55E); o hover, após brilho, a 10.22289:1 (#0C0F16 sobre #25D967). A lista de dívidas e os valores de referência estão no teste. A variante warning não existe e não foi criada. Fundos translúcidos são compostos sobre `--bg-base`, e o filtro de brilho é aplicado ao texto e ao fundo.

## Visual Linux — pendente

Imagem oficial `mcr.microsoft.com/playwright:v1.64.1-noble` amd64 baixada no Colima arm64. A execução das quatro capturas falhou antes de gerar baselines: o kernel registrou `global_oom` e encerrou `chrome-headless`. Uma segunda tentativa com processo único falhou na emulação QEMU (`rcu_read_unlock` / SIGABRT). O CI visual não foi habilitado sem baselines verificadas. É necessário executar em Linux amd64 com memória suficiente e comparar as quatro capturas antes de versioná-las.

## Limites do gate de contraste (parecer do Revisor, 13/11)

- O teste cobre 4 variantes de botão (primary, secondary, success, danger) e seus hovers, em 5 temas: 40 pares modelados. Ghost e social ficam de fora.
- Fundos translúcidos são compostos só sobre `--bg-base`. Um botão dentro de card (`--bg-surface-*`) pode ter contraste diferente sem reprovar o teste.
- Portanto, as 18 dívidas são o inventário dos 40 pares modelados, não de todo uso real.
- Próximo passo: ampliar o gate por superfície e por variante, junto dos contratos da etapa E2 (responsável: Executor; parecer: Revisor).
- Tema claro aninhado dentro de ancestral escuro pode herdar a regra de `[data-theme="dark"] .btn-success` por seletor descendente. Temas aninhados não são suportados hoje; decidir na E2.

## Ganchos locais

`.husky/pre-commit` roda lint e a suíte completa. Medição do Supervisor em 13/11: cerca de 1 s para os 683 testes e menos de 1 s para o lint. Fica como está. Se passar a atrapalhar, a suíte completa vai só para o CI e fica um subconjunto local. Os ganchos são locais e podem ser contornados; não substituem CI nem proteção de branch.

## Situação da E0 — não concluída

O roteiro (diagnóstico §10) pede quatro itens. Situação em 13/11:

| Item | Situação | Responsável | Próximo passo |
|---|---|---|---|
| ADR-0001 aceita, ADR-0003/0004, CODEOWNERS, regras no AGENTS.md do DS | feito, local | Supervisor | PR única com "push N" do Marcos |
| Ganchos e gate de contraste (pega o `.btn-success` e passa após a correção) | feito, local | Executor | idem |
| Teste visual no CI | pendente | Executor | gerar a baseline no CI do GitHub (Linux amd64) como artefato; o Revisor confere as 4 imagens; só depois versionar e ativar a comparação. Baseline gerada não é aceita automaticamente |
| Regra de interface no AGENTS.md da electia e do IMO | pendente | Supervisor | PR em cada repo com "push N" (o Xscore já tem a regra) |
| Proteção de branch no DS | pendente | Marcos | OK explícito para mudar a configuração do GitHub |
