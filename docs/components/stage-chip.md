# Stage chip — etapa do funil de seleção

Um chip por etapa do funil, com o nome, uma forma própria e uma cor própria. Serve de rótulo na linha de vaga, de cabeçalho de coluna no kanban e de filtro clicável.

Lote P, 05/10/2026. CSS em `components/stage-chip.css`; demo em `demos/landing-kit.html`.

## Três leituras, nenhuma depende só da cor

A referência (Talio) mostrou o erro a evitar: duas etapas vizinhas com a mesma cor e nada além da cor para separá-las.

| Etapa | Classe | Cor | Forma | Leitura |
|---|---|---|---|---|
| Triagem | `.stage-chip-triagem` | `--text-secondary` (neutro) | anel vazio | ainda não avaliado |
| Entrevista | `.stage-chip-entrevista` | `--color-info` | círculo meio cheio | em andamento |
| Oferta | `.stage-chip-oferta` | `--color-warning` | losango | decisão pendente |
| Contratado | `.stage-chip-contratado` | `--color-success` | visto | fim positivo |
| Rejeitado | `.stage-chip-rejeitado` | `--color-error` | X | fim negativo |

As cinco cores são diferentes em todos os temas e marcas. O **accent fica de fora** de propósito: no tema claro do DS ele é azul, como `--color-info`, e no Electia o roxo é de "selecionado/ativo". As formas são `clip-path` e borda sobre o `::before`, sem fonte de ícone nem glifo, e ficam fora da leitura.

## Cor da tinta

```css
--stage-ink: color-mix(in oklab, var(--stage-color) 60%, var(--text-primary));
```

A cor da etapa é puxada para a cor de texto do tema: escurece no claro e clareia no escuro. Com uma fórmula só, a tinta passa AA nos dois temas. O fundo é a cor da etapa a 12 %, e a borda, a 35 %.

**Contraste medido no Chrome** (texto sobre o fundo tonal composto em `--bg-base`, 05/10/2026):

| Etapa | Claro | Escuro |
|---|---|---|
| Triagem | 9,36:1 | 8,19:1 |
| Entrevista | 7,61:1 | 7,63:1 |
| Oferta | 5,80:1 | 9,79:1 |
| Contratado | 6,00:1 | 9,46:1 |
| Rejeitado | 7,15:1 | 7,71:1 |

O marcador é desenhado na mesma tinta, então também passa dos 3:1 exigidos de elemento não textual.

## Markup

Como rótulo:

```html
<span class="stage-chip stage-chip-entrevista">Entrevista <span class="stage-chip-count">12</span></span>
```

Como filtro (alvo de toque e foco):

```html
<div role="group" aria-label="Filtrar por etapa">
  <button class="stage-chip stage-chip-oferta" type="button" aria-pressed="false">Oferta</button>
</div>
```

`.stage-chip-count` é a contagem opcional, em `--font-mono` com algarismos tabulares, separada por um filete.

## Estados (só em `<a>` e `<button>`)

| Estado | Visual |
|---|---|
| Hover | fundo da etapa a 20 % |
| Foco | anel do DS |
| Pressão | `scale(0.96)` (desligada em reduced-motion) |
| `aria-pressed="true"` ou `aria-current` | borda na tinta e fundo a 20 % |

## Relação com o kanban

Os pontos de `.pipeline-stage-*` (kanban em `components.css`) ainda usam o mapa antigo: Triagem `--color-info`, Entrevista `--color-warning`, Oferta `--color-success`, Contratado `--accent-primary`. No tema claro, Triagem e Contratado ficam quase iguais. Vale migrar o cabeçalho de coluna para o `.stage-chip` em PR própria (pendência do lote P).
