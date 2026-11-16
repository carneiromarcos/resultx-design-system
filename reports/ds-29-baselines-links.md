# DS-29 — análise das baselines de links

Fonte: artefato `resultx-ds-visual-falha-45d72ced035f3f87b4e9bc7bd545715bb68b11c5-43860327706-1` do [run Visual Linux 43860327706](https://github.com/carneiromarcos/resultx-design-system/actions/runs/43860327706). Os PNGs versionados são as imagens `actual` desse run; os três ensaios de cada captura têm o mesmo SHA-256. Os PNGs `expected` coincidem com as baselines anteriores do checkout.

As páginas inteiras anteriores medem 1440 × 4076 e as novas, 1440 × 4198. Os primeiros 4076 px de altura são idênticos pixel a pixel; a seção nova de links acrescenta 122 px. Nas seis capturas de diálogo, o modal permanece na mesma posição e seu retângulo é idêntico pixel a pixel, inclusive textos, cores e bordas. Ao abrir o diálogo, o navegador deixa visível a parte inferior de uma página 122 px mais alta: o conteúdo de fundo aparece deslocado 122 px para cima e a seção de links surge ao fundo, sob o backdrop. Após compensar esse deslocamento e excluir os retângulos do diálogo nas duas posições, os pixels comuns de fundo são idênticos. Não se identificou outra mudança visual nos pares comparados.

| Baseline | Causa da diferença | SHA-256 do PNG `actual` versionado |
|---|---|---|
| pilot-light | Página 122 px mais alta pela seção de links | `e4c2aab50a4f51321461165dc24f245c4fc5a1ac215e1e5bcb450661cc1b3c01` |
| pilot-dark | Página 122 px mais alta pela seção de links | `6398dd8cd54450da23cb79a607fc2ff4060a4886e253c76ee5fe7eb141ce55f5` |
| pilot-dialog-light | Fundo deslocado 122 px; modal inalterado | `be492aa60d39cfcc8717c2faf367f24e27b94ef7376217bbf6310aab5487e4ad` |
| pilot-dialog-dark | Fundo deslocado 122 px; modal inalterado | `aae143c49a2861f1c091f64f549dde2566b1d49a303a5a4482c3cf40239daadc` |
| pilot-dialog-loading-light | Fundo deslocado 122 px; modal de carregamento inalterado | `00dcab50875d6e5c064f0b20a74b8ac5655284ef37e9ab2401a74fd4ef7f827f` |
| pilot-dialog-loading-dark | Fundo deslocado 122 px; modal de carregamento inalterado | `42c5aced6dbbf24f5acaca125fc39d2fb1e775fa860eecccf9507aa683842d21` |
| pilot-dialog-error-light | Fundo deslocado 122 px; modal de erro inalterado | `e940e4b4a90b4bbc55a9551ac0dd0f51675879f8878543057cf3110a67ad062f` |
| pilot-dialog-error-dark | Fundo deslocado 122 px; modal de erro inalterado | `4790d988cbc7c80cc3835bd4715634f8863b3d2acd9e440aa8e9492825eb8f22` |

A revisão visual independente e a comparação verde no CI para o SHA final continuam obrigatórias.
