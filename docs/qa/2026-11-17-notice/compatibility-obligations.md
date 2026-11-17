# Obrigações não verificadas na vitrine anterior

Fonte da vitrine anterior: `64a26656170ae506f3bb4c05647c5f3c63c43177`. Runner atual: `6c69edad8758d3f4bffa22a54e01419d8650a70f`.

110 casos anteriores passaram; estes 20 novos ensaios foram pulados por ausência de declaração real. Isso não certifica o contrato ampliado nem integração de produto. A referência atual declara as capacidades e executou os 130 casos de contratos sem pulos.

| # | Tema | Caso | O que verificar |
|---|---|---|---|
| 1 | light | `notice-content` | As duas variantes mostram fato, consequência e próximo passo em texto visível. |
| 2 | light | `notice-action-policy` | Próximo passo local permitido exige ação; a ação indevida fica ausente e a orientação humana permanece. |
| 3 | light | `notice-semantics` | Contêiner comum tem heading no nível definido pelo consumidor, sem região ou alerta por padrão. |
| 4 | light | `notice-announcement` | Região status vazia preexiste antes da atualização de texto, sem substituir o nó nem mover foco. |
| 5 | light | `notice-loading` | Atividade real mantém contexto, expõe aria-busy e termina sem prometer operação inexistente. |
| 6 | light | `notice-keyboard` | Somente controles válidos recebem Tab; ação e details operam por teclado com foco visível. |
| 7 | light | `notice-contrast` | Textos, borda e foco mantêm contraste nos cinco brands e dois temas. |
| 8 | light | `notice-responsive` | Conteúdo e próximo passo permanecem visíveis em 390 e 1440 sem corte ou overflow causado pelo aviso. |
| 9 | light | `badge-warning-info` | As duas variantes têm rótulo específico, permanecem passivas e são compreensíveis em escala de cinza. |
| 10 | light | `badge-next-step` | Warning de pendência acompanha próximo passo visível em Aviso ou texto adjacente. |
| 11 | dark | `notice-content` | As duas variantes mostram fato, consequência e próximo passo em texto visível. |
| 12 | dark | `notice-action-policy` | Próximo passo local permitido exige ação; a ação indevida fica ausente e a orientação humana permanece. |
| 13 | dark | `notice-semantics` | Contêiner comum tem heading no nível definido pelo consumidor, sem região ou alerta por padrão. |
| 14 | dark | `notice-announcement` | Região status vazia preexiste antes da atualização de texto, sem substituir o nó nem mover foco. |
| 15 | dark | `notice-loading` | Atividade real mantém contexto, expõe aria-busy e termina sem prometer operação inexistente. |
| 16 | dark | `notice-keyboard` | Somente controles válidos recebem Tab; ação e details operam por teclado com foco visível. |
| 17 | dark | `notice-contrast` | Textos, borda e foco mantêm contraste nos cinco brands e dois temas. |
| 18 | dark | `notice-responsive` | Conteúdo e próximo passo permanecem visíveis em 390 e 1440 sem corte ou overflow causado pelo aviso. |
| 19 | dark | `badge-warning-info` | As duas variantes têm rótulo específico, permanecem passivas e são compreensíveis em escala de cinza. |
| 20 | dark | `badge-next-step` | Warning de pendência acompanha próximo passo visível em Aviso ou texto adjacente. |

## Plano curto por consumidor

1. Manter o SHA/contrato anterior fixado enquanto o componente não existir na vitrine própria; registrar os 20 casos como NÃO VERIFICADOS, sem habilitar a declaração apenas para remover pulos.
2. Ao adotar Notice, preparar cenários próprios de ação local permitida, tarefa externa, carregamento e região status preexistente. Declarar `notice` só quando renderizados; executar os oito casos em claro e escuro (16 ensaios), incluindo negativos e teclado.
3. Ao adotar warning/info, renderizar rótulos específicos e próximo passo de pendência. Declarar `status-badge-warning-info`; executar os dois casos novos nos dois temas (quatro ensaios). O caso antigo `badge-variants` deve então exigir cinco variantes: o passe anterior com três não satisfaz a obrigação ampliada.
4. Rodar todos os casos anteriores novamente na própria vitrine, 390/1440, contraste/pixels, cinza e navegação. Conferir também os usos de `color-warning` e `color-info` no piloto na próxima cópia por SHA.
5. Revisar humanamente conteúdo, permissão real e próximo passo; completar leitor de tela, integração do consumidor e CI do SHA de adoção. Só converter cada linha em conforme com evidência própria; o passe da referência do DS não serve como prova do produto.
