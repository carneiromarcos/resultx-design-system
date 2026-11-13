# EmptyState/ErrorState

## Anatomia

- título
- descrição do próximo passo
- ação quando possível

## Variantes

- empty
- error

## Estados

- normal: Não aplicável: componente apresenta vazio ou erro.
- carregando: aria-busy enquanto atualiza.
- vazio: O quê, próximo passo e ação quando possível.
- erro: Mensagem clara e ação para tentar novamente.
- desabilitado: Ação indisponível usa disabled.
- foco: Ação recebe foco visível.

## Tokens

- --bg-surface-1
- --text-primary
- --font-body
- --text-base
- --focus-ring-width
- --focus-ring-offset
- --accent-primary-text
- --space-2
- --space-4
- --radius-md

## Teclado

- Tab alcança ação; Enter e Espaço a acionam.

## ARIA

- Erro dinâmico usa role alert; vazio usa texto semântico.

## Critérios de aceite

- Toda variante comunica conteúdo e próximo passo.
- Texto ≥ 4,5:1; foco ≥ 3:1.

## Casos de teste

- empty-content: Estado vazio mostra o quê, próximo passo e ação.
- error-content: Erro tem alerta e ação de tentar novamente.
- empty-keyboard: Ação é alcançável e foco é visível.
- empty-contrast: Textos dos estados vazio e erro mantêm contraste.
