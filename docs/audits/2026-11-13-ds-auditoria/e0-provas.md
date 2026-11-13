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
