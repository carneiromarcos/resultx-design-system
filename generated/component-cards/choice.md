# Escolha

## Anatomia

- fieldset para agrupar opções relacionadas
- legend com o nome do grupo
- checkbox, radio ou switch nativo com label associado
- mensagem de erro textual ligada ao controle

## Variantes

- checkbox
- radio
- switch

## Estados

- normal: Controle disponível e não marcado.
- selecionado: Estado indicado por preenchimento, contorno persistente e marca visível.
- indeterminado: Estado nativo permitido somente em checkbox, indicado por barra horizontal.
- erro: aria-invalid e aria-describedby associam o controle à mensagem de erro textual.
- desabilitado: disabled nativo; a marca selecionada continua visível sem depender de opacidade.
- foco: Anel visível igual ao contrato Field.

## Tokens

- --bg-surface-1
- --bg-surface-2
- --bg-base
- --text-primary
- --text-muted
- --text-inverse
- --text-on-accent
- --accent-primary
- --accent-primary-text
- --color-error
- --focus-ring-width
- --focus-ring-offset
- --radius-sm
- --space-2
- --space-3
- --space-4
- --font-body
- --text-base
- --leading-relaxed

## Teclado

- Tab move o foco entre controles.
- Espaço alterna checkbox e switch.
- Setas movem a seleção entre opções do grupo radio nativo.

## ARIA

- Cada controle tem label programático.
- Checkbox e radio relacionados ficam agrupados por fieldset e legend.
- Switch usa input type="checkbox" com role="switch"; seu label nomeia somente a preferência controlada.
- Erro tem texto visível e aria-describedby associado ao controle com aria-invalid="true".

## Critérios de aceite

- Checkbox e radio têm marca de 20 px; switch tem trilha de 44 × 24 px e toque pela label de pelo menos 44 px.
- A borda --text-muted permanece visível em normal e selecionado, com contraste mínimo de 3:1 contra o fundo adjacente; o estado não depende somente da cor.
- A tinta da marca usa --text-inverse; somente em sober-dark usa --text-on-accent. Ambas mantêm pelo menos 4,5:1 contra --accent-primary.
- Switch nomeia a preferência (por exemplo, “Receber avisos por e-mail”), sem texto Ligado/Desligado redundante.
- Estado indeterminado é nativo e exclusivo de checkbox; radio e switch nunca o recebem.
- Estado desabilitado usa disabled nativo e não reduz a visibilidade da marca somente por opacidade.
- Checkbox marcado desabilitado conserva o visto sem preenchimento do glyph; o visto e a barra indeterminada desabilitados usam --text-muted sobre --bg-surface-2.
- Mensagem de erro permanece ligada por aria-describedby e próxima do controle sem reduzir o alvo clicável de 44 px.
- Rótulo multilinha mantém o controle alinhado ao topo e centralizado na primeira linha; RTL usa propriedades lógicas e inverte o deslocamento do knob.
- Foco tem anel visível igual ao Field; cores forçadas mantêm borda e marca perceptíveis.
- Erro informa o problema em texto, não somente por cor.

## Casos de teste

- choice-group: Checkbox e radio pertencem a fieldsets com legend e labels associados.
- choice-checked: Checkbox, radio e switch nativos comunicam seleção por contorno, marca ou posição além do preenchimento.
- choice-switch: Switch usa checkbox nativo com role switch e label que nomeia somente a preferência.
- choice-indeterminate: Somente checkbox recebe estado nativo indeterminado e mostra uma barra horizontal.
- choice-disabled: Disabled nativo impede interação e preserva marca visível sem opacidade como único sinal.
- choice-error: Erro visível tem texto e fica associado com aria-invalid e aria-describedby.
- choice-keyboard: Espaço alterna checkbox e switch; teclado nativo opera o grupo radio.
- choice-focus: Foco visível segue o padrão do contrato Field.
- choice-contrast: Texto, contorno, foco e tinta da marca mantêm seus mínimos em temas claro e escuro.
- choice-multiline-rtl: Controle se alinha à primeira linha e o knob inverte em RTL com propriedades lógicas.
- choice-forced-colors: Cores forçadas no Windows preservam o contorno e a marca selecionada.

## Cobertura de estados

- normal: choice-group
- selecionado: choice-checked
- indeterminado: choice-indeterminate
- erro: choice-error
- desabilitado: choice-disabled
- foco: choice-focus

## Conformidade

- Cada adaptador deve executar todos estes casos contra sua própria vitrine; exemplos de outro adaptador não comprovam conformidade.
