# DataTable

## Anatomia

- table com caption
- thead com th scope
- tbody com linhas
- estados e paginação externos

## Variantes

- default
- sortable

## Estados

- normal: Linhas e cabeçalhos presentes.
- carregando: aria-busy verdadeiro.
- vazio: EmptyState informa próximo passo.
- erro: ErrorState informa como tentar novamente.
- desabilitado: Ações de linha podem ser disabled.
- foco: Cabeçalhos ordenáveis têm foco visível.

## Tokens

- --bg-surface-1
- --text-primary
- --font-body
- --text-base
- --focus-ring-width
- --focus-ring-offset
- --accent-primary-text
- --text-secondary
- --space-3

## Teclado

- Tab alcança controles.
- Enter ou Espaço aciona ordenação.

## ARIA

- caption nomeia tabela.
- th usa scope; aria-sort identifica coluna ordenada.

## Critérios de aceite

- Todos os dados têm cabeçalho associado.
- Texto ≥ 4,5:1; foco ≥ 3:1.

## Casos de teste

- table-semantics: Tabela tem caption e cabeçalho com scope.
- table-sorting: Enter altera aria-sort da coluna.
- table-loading: Carregamento expõe aria-busy.
- table-contrast: Tabela mantém contraste do texto.
