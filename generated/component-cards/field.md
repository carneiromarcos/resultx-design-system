# Field

## Anatomia

- label associado
- input, select nativo ou textarea
- mensagem de ajuda ou erro associada

## Variantes

- text
- search
- select
- textarea

## Estados

- normal: Controle editável.
- carregando: aria-busy no grupo enquanto processa.
- vazio: Valor vazio permitido quando não obrigatório.
- erro: aria-invalid e aria-describedby apontam para erro.
- desabilitado: disabled nativo.
- foco: Anel visível.

## Tokens

- --bg-surface-1
- --bg-base
- --text-primary
- --text-muted
- --text-sm
- --leading-relaxed
- --font-body
- --text-base
- --focus-ring-width
- --focus-ring-offset
- --accent-primary-text
- --text-secondary
- --space-2
- --space-4
- --space-10
- --radius-md
- --font-semibold
- --color-error

## Teclado

- Tab foca o controle.
- Digitação altera o valor.

## ARIA

- label programático obrigatório.
- Erro de input, select e textarea associado por aria-describedby e aria-invalid.
- Select2 mantém o select nativo de origem com aria-invalid e aria-describedby.

## Critérios de aceite

- Texto ≥ 4,5:1; borda e foco ≥ 3:1.
- Erro é identificável sem depender de cor.

## Casos de teste

- field-label: O controle tem rótulo associado.
- field-error: Input, select e textarea com erro usam aria-invalid e descrição associada.
- field-select: Select nativo tem label, opções e foco visível.
- field-select2-skin: Select2 fechado single e multiple preserva a borda, o fundo e a geometria do campo nos dois temas.
- field-textarea: Textarea preserva o foco e pode ser redimensionado apenas verticalmente.
- field-inputmode-numeric: Campo numérico sugere teclado numeric sem impor validação.
- field-inputmode-money: Campo monetário sugere teclado decimal sem impor formatação.
- field-disabled: Campo desabilitado não aceita interação.
- field-keyboard: Tab foca e digitação altera o valor.
- field-contrast: Texto e bordas do campo mantêm contraste.
- field-loading: Grupo em carregamento indica aria-busy e desabilita controle.
- field-empty: Controle vazio opcional aceita valor vazio.

## Cobertura de estados

- normal: field-label
- carregando: field-loading
- vazio: field-empty
- erro: field-error
- desabilitado: field-disabled
- foco: field-keyboard

## Conformidade

- Cada adaptador deve executar todos estes casos contra sua própria vitrine; exemplos de outro adaptador não comprovam conformidade.
