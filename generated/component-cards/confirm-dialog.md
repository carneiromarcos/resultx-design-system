# ConfirmDialog

## Anatomia

- dialog modal
- título
- descrição
- ações cancelar e confirmar

## Variantes

- default
- danger

## Estados

- normal: Fechado até ação explícita.
- carregando: aria-busy e confirmação desabilitada.
- vazio: Não aplicável: título e descrição são obrigatórios.
- erro: Erro comunicado dentro do diálogo.
- desabilitado: Ação indisponível usa disabled.
- foco: Foco entra, permanece no modal e retorna ao acionador.

## Tokens

- --bg-surface-1
- --text-primary
- --font-body
- --text-base
- --focus-ring-width
- --focus-ring-offset
- --accent-primary-text
- --text-secondary
- --space-4
- --radius-md
- --color-error

## Teclado

- Tab permanece no modal.
- Escape cancela e devolve foco.

## ARIA

- dialog com nome e descrição associados.
- Modalidade nativa showModal ou aria-modal equivalente.

## Critérios de aceite

- Esc fecha sem confirmar.
- Texto ≥ 4,5:1 e foco ≥ 3:1.

## Casos de teste

- dialog-semantics: Diálogo tem nome, descrição e modalidade.
- dialog-keyboard: Foco entra no modal, Escape fecha e retorna ao acionador.
- dialog-contrast: Texto do diálogo mantém contraste.
- dialog-closed: Diálogo começa fechado.
- dialog-loading-error: Carregamento bloqueia confirmação e erro é anunciado.

## Cobertura de estados

- normal: dialog-closed
- carregando: dialog-loading-error
- vazio: não aplicável
- erro: dialog-loading-error
- desabilitado: dialog-loading-error
- foco: dialog-keyboard

## Conformidade

- Cada adaptador deve executar todos estes casos contra sua própria vitrine; exemplos de outro adaptador não comprovam conformidade.
