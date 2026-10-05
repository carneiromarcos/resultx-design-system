# CTA dock — barra de CTA do celular

Uma pílula presa ao pé da tela no celular, com uma frase curta e o CTA primário. Aparece quando o CTA do hero sai da tela por cima e some quando o CTA final está à vista. No desktop não existe.

Lote P, 05/10/2026. CSS em `components/cta-dock.css`; comportamento em `dist/cta-dock.js`; demo em `demos/landing-kit.html`.

## Markup

```html
  …
  <footer>…</footer>

  <!-- ÚLTIMO filho do <body> (ou do contêiner que rola) -->
  <aside class="cta-dock" aria-label="Atalho para demonstração"
         data-cta-dock
         data-cta-dock-after="[data-hero-cta]"
         data-cta-dock-until="[data-cta-final]">
    <span class="cta-dock-text">Veja o electia com a sua equipe</span>
    <a class="btn btn-primary" href="#cta-final">Agendar demonstração</a>
  </aside>
  <script src="dist/cta-dock.js" defer></script>
</body>
```

| Atributo | Papel |
|---|---|
| `data-cta-dock-after` | seletor do marco de entrada (o grupo de CTAs do hero). A barra aparece quando ele sai **por cima** da tela. Carregar a página no meio, com o marco abaixo, não conta |
| `data-cta-dock-until` | opcional. Seletor do CTA final: enquanto ele está na tela, a barra some |

Sem `IntersectionObserver`, sem o marco de entrada ou sem o script, a barra fica escondida. A página perde um atalho e nada mais.

## Não cobre o fim da página

A barra é `position: sticky` com `inset-block-end` e mora no fim do fluxo. Enquanto a página rola, ela gruda no pé da tela. No fim, para no próprio lugar, que já está reservado. Não há espaçador mágico no rodapé. O mesmo `--cta-dock-offset` (`--space-3` + `env(safe-area-inset-bottom)`) faz o recuo do pé e a margem que reserva o lugar.

Medido no Chrome a 375 px, rolando até o fim: o topo da barra fica em y = 621,5 e o rodapé termina em y = 621,5 (Electia). Na demo são 634 e 544 px. Nos dois casos, nada é coberto.

## Escondida e visível

| Estado | Visual | Acessibilidade |
|---|---|---|
| Escondida | `opacity: 0`, desce o próprio recuo (`translateY(var(--cta-dock-offset))`), `visibility: hidden` (com atraso na saída) | fora da ordem de foco e da árvore |
| `[data-visible]` | no lugar, opaca, `visibility` na hora | o link é alcançável |

Medido a 375 px (demo e Electia): no topo, escondida; logo depois do hero, visível; com o CTA final no centro, escondida; a 1440 px, `display: none`.

Por que só o recuo: a barra mora no fluxo, e uma transformação que a empurre além do fim do documento estica a área de rolagem. O protótipo descia `100 % + 24 px`, e no celular sobravam ~90 px de vazio sob o rodapé. Descendo só `--cta-dock-offset`, a borda de baixo encosta no fim do documento.

## Visual

Vidro forte (`--glass-strong-bg`, desfoque `--glass-strong-blur`), borda `--glass-standard-border`, raio `--radius-xl`, `--elevation-3`. A frase usa `--text-primary` (17,81:1 no claro, 14,70:1 no escuro).

## Movimento

Só `transform` e `opacity` (260 ms, `--spring-smooth`). Sob `prefers-reduced-motion: reduce`, sem transição: a barra aparece e some no lugar.
