# CTA panel — seção de fechamento em contraste

O último convite de uma landing: um painel escuro dentro da página clara, com título em meio-tom, apoio, dois botões e selos curtos de confiança.

Lote P, 05/10/2026. CSS em `components/cta-panel.css`; demo em `demos/landing-kit.html`.

## O escuro vem do atributo, não do componente

O elemento leva **`data-theme="dark"`**. Os tokens do DS, e a ponte da marca quando existir, resolvem no escopo escuro só ali dentro. Por isso o arquivo não tem cor nenhuma, só tokens, e o mesmo painel serve Electia (roxo), Emprega+ e Xscore sem variação. O botão de tema da página não mexe nele.

```html
<section aria-labelledby="cta-title">
  <div class="cta-panel" data-theme="dark">
    <span class="brand-orb brand-orb-electia brand-orb-lg" aria-hidden="true"></span>
    <h2 class="cta-panel-title" id="cta-title">
      O problema pode não ser a pessoa.
      <span class="cta-panel-title-tone">Pode ser o lugar onde ela está.</span>
    </h2>
    <p class="cta-panel-lead">Veja, com a sua equipe em mente, como o electia funciona.</p>
    <div class="cta-panel-actions">
      <a class="btn btn-primary btn-sheen" href="#agendar">Agendar demonstração</a>
      <a class="btn btn-secondary btn-sheen" href="#plataforma">Explore a plataforma</a>
    </div>
    <ul class="cta-panel-proof" aria-label="Princípios do electia">
      <li>6 perspectivas comportamentais</li>
      <li>Não substitui o olhar de quem lidera</li>
    </ul>
  </div>
</section>
```

A orb é opcional e só entra quando o convite é do agente de IA (ver `brand-orb.md`).

## Anatomia

| Parte | O que é |
|---|---|
| `.cta-panel` | `--bg-base` do tema escuro + dois washes do accent (22 % e 16 %), raio `--radius-xl`, `--elevation-4`, filete da marca no pé (`::after`) |
| `.cta-panel-title` | título em `--font-heading`, no máximo 24ch, `text-wrap: balance` |
| `.cta-panel-title-tone` | segunda parte em gradiente vertical, de `--text-primary` a `--accent-primary-text` (as duas pontas são tintas de texto, AA sobre o fundo) |
| `.cta-panel-lead` | apoio em `--text-secondary` |
| `.cta-panel-actions` | botões de 48 px; abaixo de 640 px empilham em largura total |
| `.cta-panel-proof` | selos de 12 px com um visto decorativo (`content: '✓' / ''`, fora da leitura) |

## Tamanho do título

`--cta-panel-title-size` ajusta o título de fora. Defina-o em qualquer ancestral, como o `:root`, para casar com a escala da página:

```css
:root { --cta-panel-title-size: var(--landing-h2); }
```

Sem ele, vale `clamp(var(--text-3xl), 1.3rem + 2.6vw, var(--text-display))`.

## Botão secundário no painel

O `.btn-secondary` do DS é `--bg-base` com borda neutra e some no fundo escuro. Dentro do painel ele ganha um véu do accent (14 %) e borda na tinta do accent (55 %).

| Estado | Visual |
|---|---|
| Hover | borda cheia na tinta do accent |
| Foco | anel na tinta do accent |
| Pressão | véu do accent a 24 % (mais a pressão de `.btn`) |

## Contraste medido (Chrome, 05/10/2026)

| Par | DS padrão | Electia |
|---|---|---|
| Título | 16,35:1 | — |
| Apoio e selos | 6,28:1 | 6,28:1 |
| Primário | 10,38:1 | 7,59:1 |
| Secundário | 12,79:1 | 15,19:1 |

Os valores são os mesmos com a página clara ou escura, porque o painel é sempre escuro.

## Movimento

O painel não anima. Os botões trazem `.btn-sheen` (uma passada no hover e no foco; ver `buttons.md`), que some sob reduced-motion.
