# Button

## Anatomia

- botão nativo com nome acessível
- link a com href para navegação e nome acessível; nunca aninhar controles interativos
- ícone opcional decorativo com aria-hidden

## Variantes

- primary
- secondary
- danger

## Estados

- normal: Ação disponível.
- hover: Ação sob ponteiro.
- ativo: Ação pressionada.
- carregando: aria-busy verdadeiro e ativação impedida; link fica sem href e fora do Tab.
- vazio: Não aplicável: o nome acessível é obrigatório.
- erro: Não aplicável: falha da ação é comunicada externamente.
- desabilitado: Prefira ocultar a ação. Mostre-a somente quando puder ficar disponível, com texto ao lado que explique o motivo e o próximo passo; botão usa disabled, link usa aria-disabled sem href e fora do Tab.
- foco: Foco visível por teclado.

## Tokens

- --bg-surface-1
- --text-primary
- --text-muted
- --border-default
- --font-body
- --text-base
- --focus-ring-width
- --focus-ring-offset
- --accent-primary-text
- --accent-primary
- --accent-primary-hover
- --text-inverse
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
- Em botão, Enter e Espaço acionam uma vez.
- Em link, somente Enter navega; Espaço não aciona.

## ARIA

- Nome acessível obrigatório.
- Ícone decorativo usa aria-hidden.
- Link indisponível usa aria-disabled=true, sem href e com tabindex=-1.
- Carregando usa aria-busy; botão usa disabled e link usa aria-disabled, sem href e fora do Tab.

## Critérios de aceite

- Todo botão ou link ativo (primary, secondary e danger) tem texto ≥ 4,5:1 em repouso, hover e active.
- Limite do controle ≥ 3:1 contra fundo adjacente em todos os estados ativos; limite é o pixel pintado mais externo da borda, se houver, ou do preenchimento. Foco ≥ 3:1.
- disabled impede clique e foco; link indisponível não tem href nem recebe Tab.
- Link com aparência de botão preserva navegação nativa, nome acessível e foco; não aninha interativos.
- Indisponível e carregando diferem do disponível da mesma variante em pelo menos duas propriedades calculadas; ambos têm texto ≥ 4,5:1. Indisponível usa borda tracejada; carregando usa borda sólida ≥ 3:1 e difere de indisponível.
- Carregando exibe texto visível no gerúndio.
- Primary se distingue por preenchimento de ação, com fundo calculado diferente do secondary e do entorno; texto sobre o preenchimento ≥ 4,5:1.

## Casos de teste

- button-unavailable-visual: Botões e links indisponíveis das três variantes são neutros, distintos e contrastantes.
- button-loading-visual: Botões e links carregando nas três variantes têm texto, borda e visual próprios.
- button-link-keyboard: Link disponível recebe Tab e só Enter navega, sem interativos aninhados.
- button-link-unavailable: Link indisponível tem aria-disabled, não tem href e fica fora do Tab.
- button-link-contrast: Links nas três variantes atendem contraste e hierarquia nos estados ativos e foco.
- button-accessible: O botão tem nome acessível e fica visível.
- button-disabled: O botão desabilitado impede a ativação.
- button-loading: Carregamento informa aria-busy e impede ativação.
- button-keyboard: Tab mostra foco; Enter e Espaço acionam uma vez.
- button-contrast: Texto, borda e foco mantêm contraste nos estados.
- button-variant-hierarchy: Primary tem preenchimento diferente do secondary e do entorno, com texto contrastante.

## Cobertura de estados

- normal: button-accessible
- hover: button-contrast
- ativo: button-contrast
- carregando: button-loading-visual
- vazio: não aplicável
- erro: não aplicável
- desabilitado: button-unavailable-visual
- foco: button-keyboard

## Conformidade

- Cada adaptador deve executar todos estes casos contra sua própria vitrine; exemplos de outro adaptador não comprovam conformidade.
