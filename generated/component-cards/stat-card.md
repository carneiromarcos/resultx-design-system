# StatCard

## Anatomia

- rótulo
- valor
- ação opcional

## Variantes

- default
- link

## Estados

- normal: Valor disponível.
- carregando: aria-busy verdadeiro.
- vazio: Valor ausente exibido como travessão.
- erro: Mensagem de erro e ação quando recuperável.
- desabilitado: Não aplicável ao contêiner.
- foco: Link interno recebe foco visível.

## Tokens

- --bg-surface-1
- --text-primary
- --font-body
- --text-base
- --focus-ring-width
- --focus-ring-offset
- --accent-primary-text
- --space-4
- --radius-md
- --font-bold

## Teclado

- Tab e Enter operam o link.

## ARIA

- Rótulo e valor acessíveis.
- Carregamento usa aria-busy.

## Critérios de aceite

- Valor usa tabular-nums.
- Texto ≥ 4,5:1.

## Casos de teste

- stat-value: Valor usa algarismos tabulares.
- stat-empty: Ausência de valor mostra travessão.
- stat-loading: Carregamento expõe aria-busy.
- stat-contrast: Texto mantém contraste na superfície.
