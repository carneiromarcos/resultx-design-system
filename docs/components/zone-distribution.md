# Zone distribution — Bem-Estar por zona

Distribuição **agregada** de um grupo nas zonas de Bem-Estar: **Saudável · Atenção · Alerta**. Tem barra empilhada e legenda com contagem e percentual, e cada zona se lê por cor, forma e padrão.

Lote D, 05/10/2026. Promovido do protótipo do dashboard Electia (#85, candidato C8). CSS em `components/zone-distribution.css` (no bundle `dist/components.min.css`). Demo em `demos/app-shell.html`. O DS não tinha nada de zonas de Bem-Estar; o app Electia tem só as cores (`--viz-zone-*` no `viz-tokens.css`), e o componente as aceita pelos ganchos.

## Regras de produto (não negociáveis)

- **Os nomes são estes três, nesta ordem:** Saudável, Atenção, Alerta. Não há quarta zona, e nenhum outro rótulo substitui "Alerta".
- **Só agregado (ADR-018).** Nunca resultado individual, nunca nome, nunca lista de pessoas por zona.
- **Mínimo de 5 respostas por grupo.** Abaixo disso o grupo é insuficiente: use `.zone-distribution--insufficient` e **não renderize** contagem nem percentual. O CSS ainda esconde barra e números nesse estado, como rede de segurança. Esconder não é anonimizar: o dado não deve chegar ao HTML.

## Markup

```html
<figure class="zone-distribution">
  <figcaption>Distribuição por zona · 86 respostas</figcaption>
  <div class="zone-distribution-bar" aria-hidden="true">
    <span class="zone-distribution-segment zone-saudavel" style="--zone-share: 58"></span>
    <span class="zone-distribution-segment zone-atencao" style="--zone-share: 31"></span>
    <span class="zone-distribution-segment zone-alerta" style="--zone-share: 11"></span>
  </div>
  <ul class="zone-distribution-legend">
    <li class="zone-saudavel">
      <span class="zone-distribution-mark" aria-hidden="true"></span>
      <span class="zone-distribution-label">Saudável</span>
      <span class="zone-distribution-value">50 · 58%</span>
    </li>
    <!-- Atenção, Alerta -->
  </ul>
</figure>
```

- A **barra é decorativa** (`aria-hidden`). A legenda é o conteúdo acessível: lista com nome, contagem e percentual em texto.
- `--zone-share` é um número (a porcentagem sem o `%`). Ele vira `flex-grow`, então as proporções ficam exatas mesmo com o filete de 2 px entre os segmentos. Omita o segmento de uma zona com zero.

Grupo insuficiente:

```html
<figure class="zone-distribution zone-distribution--insufficient">
  <figcaption>Distribuição por zona · grupo insuficiente</figcaption>
  <div class="zone-distribution-bar" aria-hidden="true"></div>
  <ul class="zone-distribution-legend"><!-- só nomes, sem valores --></ul>
  <p class="zone-distribution-note">São necessárias ao menos 5 respostas para mostrar a distribuição deste grupo, para que ninguém seja identificável.</p>
</figure>
```

A barra vira um trilho tracejado neutro.

## Três leituras, nenhuma só por cor

| Zona | Cor padrão | Barra | Legenda |
|---|---|---|---|
| Saudável | `--color-success` | sólida | círculo |
| Atenção | `--color-warning` | listras a 45° | triângulo |
| Alerta | `--color-error` | xadrez cruzado | losango |

A tinta é a cor da zona puxada para o texto do tema, que escurece no claro e clareia no escuro:

```css
--zone-ink: color-mix(in oklab, var(--zone-color) 70%, var(--text-primary));
```

**Ganchos de produto:** `--zone-color-saudavel`, `--zone-color-atencao` e `--zone-color-alerta`. O Electia pode apontá-los para `--viz-zone-*`, desde que a tinta continue passando 3:1.

## Contraste medido

`tests/lote-d.test.js` calcula a tinta das três zonas a partir dos tokens e exige 3:1 (WCAG 1.4.11) contra `--bg-base` e `--bg-surface-1` nos quatro escopos de tema.

Medição no Chrome, com a marca da legenda sobre o cartão, em 05/10/2026:

| | Claro | Escuro |
|---|---|---|
| Saudável (círculo) | 5,64:1 | 10,44:1 |
| Atenção (triângulo) | 5,51:1 | 10,95:1 |
| Alerta (losango) | 7,47:1 | 7,56:1 |
| Texto da legenda (`--text-primary`) | 17,87:1 | 16,35:1 |
| Nota (`--text-secondary`) | 7,56:1 | 6,28:1 |

No estado insuficiente da demo, a página não tem nenhum `.zone-distribution-value` nem segmento renderizado.

Sob `forced-colors: active`, segmentos e marcas saem do ajuste (`forced-color-adjust: none`) e a tinta vira `CanvasText`. Os padrões continuam, então a leitura sem cor se mantém.
