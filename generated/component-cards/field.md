# Field

## Anatomia

- label associado
- input
- mensagem de ajuda ou erro associada

## Variantes

- text
- search

## Estados

- normal: Controle editável.
- carregando: aria-busy no grupo enquanto processa.
- vazio: Valor vazio permitido quando não obrigatório.
- erro: aria-invalid e aria-describedby apontam para erro.
- desabilitado: disabled nativo.
- foco: Anel visível.

## Tokens

- --bg-surface-1
- --text-primary
- --font-body
- --text-base
- --focus-ring-width
- --focus-ring-offset
- --accent-primary-text
- --text-secondary
- --space-2
- --space-4
- --radius-md
- --font-semibold
- --color-error

## Teclado

- Tab foca o controle.
- Digitação altera o valor.

## ARIA

- label programático obrigatório.
- Erro associado por aria-describedby e aria-invalid.

## Critérios de aceite

- Texto ≥ 4,5:1; borda e foco ≥ 3:1.
- Erro é identificável sem depender de cor.

## Casos de teste

- field-label: O controle tem rótulo associado.
- field-error: Erro usa aria-invalid e descrição associada.
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
