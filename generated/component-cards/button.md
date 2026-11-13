# Button

## Anatomia

- botão nativo com nome acessível
- ícone opcional decorativo com aria-hidden

## Variantes

- primary
- secondary
- danger

## Estados

- normal: Ação disponível.
- hover: Ação sob ponteiro.
- ativo: Ação pressionada.
- carregando: aria-busy verdadeiro e ativação impedida.
- vazio: Não aplicável: o nome acessível é obrigatório.
- erro: Não aplicável: falha da ação é comunicada externamente.
- desabilitado: disabled nativo impede ativação.
- foco: Foco visível por teclado.

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
- --bg-surface-2
- --bg-surface-3
- --font-bold
- --font-regular
- --color-error

## Teclado

- Tab move o foco.
- Enter e Espaço acionam uma vez.

## ARIA

- Nome acessível obrigatório.
- Ícone decorativo usa aria-hidden.
- Carregando usa aria-busy e disabled.

## Critérios de aceite

- Texto ≥ 4,5:1; borda e foco ≥ 3:1 no fundo adjacente.
- disabled impede clique e foco.

## Casos de teste

- button-accessible: O botão tem nome acessível e fica visível.
- button-disabled: O botão desabilitado impede a ativação.
- button-loading: Carregamento informa aria-busy e impede ativação.
- button-keyboard: Tab mostra foco; Enter e Espaço acionam uma vez.
- button-contrast: Texto, borda e foco mantêm contraste nos estados.
