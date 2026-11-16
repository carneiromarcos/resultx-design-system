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

## Rodada 2 — estados indisponível e carregando

Fonte: artefato `resultx-ds-visual-falha-078e64b9cb354106c07cb89c328db4c4e287f387-43862695078-1` do [run Visual Linux 43862695078](https://github.com/carneiromarcos/resultx-design-system/actions/runs/43862695078). A coluna SHA-256 identifica o `actual` copiado. Os `expected` coincidem com as baselines anteriores; as três tentativas de cada caso geraram PNGs `actual` idênticos.

As imagens de página passam de 1440 × 4198 para 1440 × 4433. No trecho comum, as diferenças ficam nas faixas dos botões indisponíveis e carregando, nos rótulos e motivos adicionados e na seção de links; o acréscimo de 235 px contém a ampliação da vitrine. Nos recortes de ações, a largura cresce de 514 para 767 px devido ao texto de motivo e ao posicionamento do botão de carregamento. Em foco, a área capturada continua 1410 × 213: as diferenças estão apenas na faixa das ações acima do campo, onde aparecem o novo estado, rótulo e motivo; campo e anel permanecem idênticos.

Nos diálogos, a página mais alta muda a posição do fundo visível ao abrir o modal. As caixas dos modais normal e de erro são idênticas pixel a pixel. No modal carregando, o botão Excluir é desabilitado pelo exemplo e muda para o novo visual neutro tracejado; o `aria-busy` está no diálogo, e não no botão. A diferença dentro do modal limita-se ao retângulo desse botão. O texto de carregamento do exemplo e os demais elementos do modal permanecem iguais.

| Baseline | Causa da diferença | SHA-256 do `actual` versionado |
|---|---|---|
| pilot-light | Estados, rótulos e motivos; vitrine 235 px mais alta | `77f75c2fc122750d594f8e684e1392b2de77798709f8db64d511cb44c8001893` |
| pilot-dark | Estados, rótulos e motivos; vitrine 235 px mais alta | `17db202504cada7e0ec4b59dc88977ef2cec955bf96ce118cf71e6df40f972fc` |
| pilot-actions-light | Indisponível e carregando, motivo e recorte mais largo | `d5d151321c61d70ee54e11288ea9f0c6b18387db456aea7c5bc909b16bf80454` |
| pilot-actions-dark | Indisponível e carregando, motivo e recorte mais largo | `277239aaa9d48c9f6556582c62408a7a6aee662c53bc8372d20a674cb42fa182` |
| pilot-focus-light | Mudanças nas ações acima do campo; anel inalterado | `5af8c11a2af1566b2bbc2505360aff9d9fbd8f593dc32cb37748980a3aa15c0f` |
| pilot-focus-dark | Mudanças nas ações acima do campo; anel inalterado | `8eb0c927e874dd769e6488d4a4d20ae83a6aabc1101e8b9de4f4aef326b932ec` |
| pilot-dialog-light | Fundo reposicionado pela altura e novos estados; modal inalterado | `43ce1d2e7c744dc41916b21432bb18af2e4d3b5192bff9f437ed8d50deff0bcc` |
| pilot-dialog-dark | Fundo reposicionado pela altura e novos estados; modal inalterado | `871f8d4dd8bb50b9038f36d350319c560ecab4b2361ed00795e7c23d025c1744` |
| pilot-dialog-loading-light | Fundo reposicionado; Excluir desabilitado assume estado neutro | `0f9a9739bf8acfe51d615f576b94bcbe4f5e5cfdab6abb73eac64b4d11c7f080` |
| pilot-dialog-loading-dark | Fundo reposicionado; Excluir desabilitado assume estado neutro | `f93ef3770da0986ddb34f4961f519a85dfc72deb56f13d3ca9b0b31a4cefd51c` |
| pilot-dialog-error-light | Fundo reposicionado pela altura e novos estados; modal inalterado | `8858c02aedc00c3fd13d57c3dc73619fb99b49503210a4628236d59632d086a0` |
| pilot-dialog-error-dark | Fundo reposicionado pela altura e novos estados; modal inalterado | `4d6ac0b4c032df6a14c75a3b3d238ee05f10e70e32cd1c37c1018cb1a672a7b3` |

A decisão visual sobre estas candidatas cabe ao Revisor; o parecer anterior sobre as imagens da rodada 1 não é aprovação destas. O CI precisa comparar o SHA final depois do envio.
