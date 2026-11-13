# Card

## Anatomia

- contêiner
- título com nível contextual
- conteúdo

## Variantes

- sm
- md
- lg

## Estados

- normal: Conteúdo disponível.
- carregando: aria-busy comunica atualização.
- vazio: Conteúdo substituído por EmptyState.
- erro: Conteúdo substituído por ErrorState.
- desabilitado: Não aplicável ao contêiner; ações internas podem ser disabled.
- foco: Ações internas recebem foco.

## Tokens

- --bg-surface-1
- --text-primary
- --font-body
- --text-base
- --space-2
- --space-4
- --radius-md
- --space-6

## Teclado

- Tab percorre ações internas.

## ARIA

- Título usa nível coerente com a página.
- aria-busy durante carregamento.

## Critérios de aceite

- Texto ≥ 4,5:1.
- Sem sombra em repouso.

## Casos de teste

- card-heading: Título expõe nível e nome acessíveis.
- card-loading: Carregamento do cartão expõe aria-busy.
- card-contrast: Texto mantém contraste na superfície.
- card-sizes: Os três tamanhos usam espaçamentos crescentes.
- card-shadow: Cartão não tem sombra em repouso.
- card-empty-error: Cartão vazio e cartão com erro informam próximo passo.
- card-keyboard: Ação interna recebe foco pelo teclado.
- card-disabled: Ação interna indisponível permanece desabilitada.

## Cobertura de estados

- normal: card-heading
- carregando: card-loading
- vazio: card-empty-error
- erro: card-empty-error
- desabilitado: card-disabled
- foco: card-keyboard

## Conformidade

- Cada adaptador deve executar todos estes casos contra sua própria vitrine; exemplos de outro adaptador não comprovam conformidade.
