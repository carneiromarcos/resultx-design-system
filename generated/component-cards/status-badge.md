# StatusBadge

## Anatomia

- texto de status
- ícone opcional decorativo

## Variantes

- neutral
- success
- error

## Estados

- normal: Status textual visível.
- carregando: Texto informa atualização e aria-busy.
- vazio: Texto informa ausência de status.
- erro: Texto identifica erro sem depender de cor.
- desabilitado: Não aplicável a texto informativo.
- foco: Não recebe foco quando não interativo.

## Tokens

- --bg-surface-1
- --text-primary
- --font-body
- --text-base
- --text-secondary
- --focus-ring-width
- --radius-md
- --space-2
- --text-on-success
- --color-success
- --color-error

## Teclado

- Não inclui parada de Tab quando informativo.

## ARIA

- Texto comunica estado; ícone decorativo usa aria-hidden.

## Critérios de aceite

- Cada variante tem contraste de texto ≥ 4,5:1.

## Casos de teste

- badge-semantics: Status textual é visível e não interativo.
- badge-variants: Cada variante apresenta seu status em texto.
- badge-contrast: Cada variante mantém contraste de texto.
