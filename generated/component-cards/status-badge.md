# StatusBadge

## Anatomia

- texto de status
- ícone opcional decorativo

## Variantes

- neutral
- success
- error
- warning
- info

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
- --color-warning
- --color-info

## Teclado

- Não inclui parada de Tab quando informativo.

## ARIA

- Texto comunica estado; ícone decorativo usa aria-hidden.

## Critérios de aceite

- Cada variante tem contraste de texto ≥ 4,5:1.
- Warning e info têm rótulo específico que identifica o estado sem cor; Atenção e Info genéricos não bastam.
- Warning que comunica pendência acompanha Aviso ou texto adjacente com o próximo passo.
- StatusBadge permanece passivo, sem ação ou parada de Tab.

## Casos de teste

- badge-semantics: Status textual é visível e não interativo.
- badge-variants: Cada variante apresenta seu status em texto.
- badge-contrast: Cada variante mantém contraste de texto.
- badge-loading: Status em atualização expõe aria-busy e texto.
- badge-empty: Status ausente é informado em texto.
- badge-warning-info: As duas variantes têm rótulo específico, permanecem passivas e são compreensíveis em escala de cinza.
- badge-next-step: Warning de pendência acompanha próximo passo visível em Aviso ou texto adjacente.

## Cobertura de estados

- normal: badge-semantics
- carregando: badge-loading
- vazio: badge-empty
- erro: badge-variants
- desabilitado: não aplicável
- foco: badge-semantics

## Conformidade

- Cada adaptador deve executar todos estes casos contra sua própria vitrine; exemplos de outro adaptador não comprovam conformidade. Warning/info são obrigação nova; adaptador sem declaração status-badge-warning-info mantém exceção explícita, sem certificar as cinco variantes.
