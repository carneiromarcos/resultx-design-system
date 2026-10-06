# Test mark — a forma identifica o teste

Marca pequena que identifica o instrumento de avaliação pela **forma**. A cor fica livre para o resultado.

Lote D, 05/10/2026. Promovido do protótipo do dashboard Electia (#85, candidato C7). CSS em `components/test-mark.css` (no bundle `dist/components.min.css`). Demo em `demos/app-shell.html`.

## Por que forma, e não cor

Regra de produto do Electia: o teste se reconhece pela forma e a cor fica para o resultado. As `.badge-disc` e `.badge-bigfive` do DS fazem o contrário, porque pintam o teste. Por isso este componente **não usa nenhum token de teoria** (`--theory-*`, `--disc-*`, `--bigfive-*`); um teste trava isso.

| Teste | Classe | Forma |
|---|---|---|
| DISC | `.test-mark-disc` | círculo em quatro quadrantes |
| Tipologia Cognitiva | `.test-mark-tipologia` | quadrado |
| Eneagrama | `.test-mark-eneagrama` | eneágono (9 lados) |
| Big Five | `.test-mark-bigfive` | pentágono |
| Temperamentos | `.test-mark-temperamentos` | triângulo vazado |
| Motivadores | `.test-mark-motivadores` | hexágono |

O nome exibido é "Tipologia Cognitiva", nunca "MBTI".

As formas são `clip-path` (polígonos regulares) e, no DISC, uma `mask` cônica que abre a cruz entre os quadrantes. Nenhuma fonte de ícone nem glifo.

## Cor

```css
background: var(--test-mark-color, var(--text-secondary));
```

A paleta de resultado (o `viz-tokens.css` do app Electia) **não está no DS**. O padrão é neutro, e quem consome pinta pelo gancho:

```html
<span class="test-mark test-mark-disc" style="--test-mark-color: var(--viz-disc-i)" aria-hidden="true"></span>
```

Sob `forced-colors: active` a marca vira `CanvasText`. Sem isso o fundo forçado a apagaria.

## Tamanho

`--test-mark-size` define o lado. O padrão é `1em`, que acompanha o texto ao lado. A demo usa 24 px na fileira de marcas soltas.

## Acessibilidade

- **Com texto ao lado** (o caso comum), a marca é decorativa e leva `aria-hidden="true"`.
- **Sozinha**, precisa de nome: `role="img" aria-label="DISC"`.
- **Não texto, 3:1 (WCAG 1.4.11):** a cor padrão `--text-secondary` passa em toda superfície dos dois temas, e um teste mede isso a partir dos tokens. No Chrome, sobre o cartão, deu 7,56:1 no claro e 6,28:1 no escuro. Uma cor de resultado posta pelo gancho também precisa passar.

```html
<li>
  <span class="test-mark test-mark-eneagrama" aria-hidden="true"></span>
  <span>Eneagrama</span>
  <output>5 de 8</output>
</li>
```
