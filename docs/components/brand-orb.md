# Brand orb — a orb dos agentes de IA

Uma esfera viva que identifica **quem está falando quando quem fala é uma IA**. Decisão de 05/10/2026: a mesma orb é a assinatura de quatro agentes — **Nexus** e **Copilot Electia** (Electia), **IMO** (Emprega+) e **Xscore**. Um componente só: o movimento é idêntico em todos, muda a cor por marca e o tamanho por uso.

Só CSS. Sem canvas, SVG, vídeo, imagem nem JavaScript.

## Quando usar

- Avatar do assistente numa conversa, ao lado do nome do agente.
- Lockup do agente: orb + nome, em cabeçalho de painel, menu ou rodapé.
- Hero ou estado vazio do copiloto ("Pergunte ao Nexus…").
- Marcador de que um bloco foi produzido pelo agente (resposta, resumo, explicação de score).

## Quando NÃO usar

- **Não é spinner de carregamento.** A orb se mexe o tempo todo, inclusive quando nada está acontecendo. Usá-la como "carregando" ensina ao usuário que o agente está sempre ocupado. Para espera, use `.spinner` / `.skeleton`.
- **Não é decoração genérica.** Fora do contexto de IA ela dilui a assinatura. Nada de orb em card de marketing, cabeçalho de seção ou fundo de página.
- **Não é logotipo de produto.** Os logos ficam em `brands/*/assets`. A orb representa o agente, não a marca.
- **Não é botão.** Se a orb abre o copiloto, o alvo clicável é um `<button>` com nome acessível que a contém. A orb não ganha estados de hover e foco por conta própria.

## Anatomia

```
span.brand-orb [.brand-orb-{electia|emprega|xscore}] [.brand-orb-{sm|md|lg}]
  ::before   lâmina cônica que gira por cima, em mix-blend-mode: screen
  ::after    ponto de luz especular, alto à esquerda, que pulsa
```

O corpo empilha três `radial-gradient`:

| Camada | Cor | Papel |
|---|---|---|
| Núcleo | `--orb-core` | o foco principal da cor de IA da marca, que deriva pelo alto à esquerda |
| Reflexo | `--orb-glow` | o segundo foco, embaixo à direita: dá a cor da luz rebatida |
| Volume | mistura de `--orb-core` com `--orb-shade` → `--orb-shade` | o corpo escuro que faz parecer esfera |

Sombras: um filete interno de 1 px na cor do reflexo, uma sombra interna embaixo, a queda e um halo na cor do núcleo. Todas escalam com `--orb-size`.

## Markup

**Decorativa** (o caso comum): a orb é sempre `aria-hidden="true"`, e o nome do agente está em texto ao lado.

```html
<span class="brand-orb-lockup">
  <span class="brand-orb brand-orb-electia brand-orb-sm" aria-hidden="true"></span>
  Nexus
</span>
```

**Avatar numa mensagem**: o nome do agente fica no texto da mensagem, não na orb.

```html
<div class="message">
  <span class="brand-orb brand-orb-xscore brand-orb-md" aria-hidden="true"></span>
  <p><strong>Xscore</strong> O limite subiu porque o atraso médio caiu.</p>
</div>
```

**Sem texto visível ao lado** (ex.: botão que abre o copiloto): o nome vai no contêiner interativo.

```html
<button class="btn-icon" type="button" aria-label="Abrir o Copilot Electia">
  <span class="brand-orb brand-orb-electia brand-orb-sm" aria-hidden="true"></span>
</button>
```

Nunca coloque `role="img"` com `aria-label` na própria orb dentro de um lockup que já mostra o nome: o leitor de tela anunciaria o agente duas vezes.

## Classes

| Classe | Papel |
|---|---|
| `.brand-orb` | O componente. Sem modificador, 40 px e cor Electia |
| `.brand-orb-sm` | 28 px — logo, lockup, rótulo inline |
| `.brand-orb-md` | 40 px — avatar do assistente (igual ao padrão) |
| `.brand-orb-lg` | 96 px — hero, estado vazio |
| `.brand-orb-electia` | Nexus e Copilot Electia |
| `.brand-orb-emprega` | IMO |
| `.brand-orb-xscore` | Xscore |
| `.brand-orb-lockup` | Orb + nome do agente em linha, `gap: var(--space-2)`, fonte de título |

Fora dos três tamanhos, defina a variável direto: `style="--orb-size: 112px"` (a faixa decidida para hero é 64–112 px). Sombras, halo, lâmina e brilho acompanham a escala.

## Cor por marca

| Agente | Classe | `--orb-core` | `--orb-glow` | `--orb-shade` |
|---|---|---|---|---|
| Nexus | `.brand-orb-electia` | `#6f32b1` electia `--purple` | `#c084fc` electia `--purple-on-dark` | `#291145` electia `--purple-950` |
| Copilot Electia | `.brand-orb-electia` | idem | idem | idem |
| IMO | `.brand-orb-emprega` | `#4f46e5` emprega-mais `--emp-indigo-dark` | `#b9baf9` emprega-mais `--emp-indigo-ink` | `#1c2444` emprega-mais `--emp-navy` |
| Xscore | `.brand-orb-xscore` | `#6f32b1` xscore `--intel` | `#c4993b` xscore `--gold` | `#0b0e14` xscore `--bg` |

Os valores moram no `:root` de `tokens/tokens.css` como `--ai-{marca}-{core|glow|shade}`, cópias dos tokens das marcas. `tests/brand-orb.test.js` reprova o build se uma marca mudar o hex e a cópia não acompanhar. Eles não ficam na ponte (`ds-bridge.css`) porque uma página pode mostrar agentes de mais de uma marca ao mesmo tempo (esta demo, um painel de integrações), e a ponte é um por página.

Por que cada escolha:

- **Electia (Nexus e Copilot Electia)**: o roxo canônico do ecossistema, com o reflexo `--purple-on-dark`. É o mesmo par do gradiente de marca `#6f32b1 → #a55eea`. **Decidido por Marcos em 05/10/2026: os dois agentes Electia usam a mesma orb.** Eles se distinguem pelo nome e pelo contexto, nunca por uma segunda cor.
- **IMO / Emprega+**: a marca **não tem token de IA**. O índigo `#4f46e5` é o preenchimento de ação do IMO, e `ADR-0002` o define como identidade de produto. O navy institucional `#1c2444` dá o volume. O violeta `--emp-violet` (`#8b5cf6`) foi descartado porque fica a um passo do roxo Electia e as duas orbs se confundiriam lado a lado.
- **Xscore**: o token diz "PURPLE = INTELIGÊNCIA (score, explicabilidade, IA)", então o **corpo é roxo**. O ouro é a cor de ação e entra só como reflexo, embaixo à direita. Uma orb dourada leria como botão. A base é o grafite da marca. Sem o reflexo dourado, a orb Xscore seria idêntica à Electia, porque a marca herdou o roxo dela.

**Claro e escuro:** a orb é um objeto com luz própria, não uma superfície, então usa os mesmos valores nos dois temas. Ela foi verificada sobre `--bg-surface-1` dos dois temas (ver PNGs abaixo). Com movimento reduzido, os quadros dos dois temas saem iguais.

## Movimento

| Animação | Onde | Duração | O que muda |
|---|---|---|---|
| `orb-shape` | corpo | 6,5 s ease-in-out | forma orgânica: `--orb-ra…rd` (raios da borda) entre 44 % e 57 % |
| `orb-drift` | corpo | 11 s ease-in-out | os focos de cor (`--orb-ax/ay/bx/by`) andam ~10 pontos |
| `orb-spin` | `::before` | 7,5 s linear | `transform: rotate(1turn)` da lâmina cônica |
| `orb-glint` | `::after` | 4,2 s ease-in-out | `opacity` 0,7 ↔ 1 do ponto de luz |

As quatro durações não se alinham, então a combinação demora a se repetir e a orb parece viva sem um loop visível.

**Nada anima layout.** Os keyframes só tocam `transform`, `opacity` e propriedades registradas com `@property` (`<percentage>`, `inherits: false`). O registro é o que permite ao navegador interpolar a posição de um gradiente e o raio da borda. Um teste reprova qualquer outra propriedade num keyframe. O desfoque da lâmina é estático; só o giro anima.

**`prefers-reduced-motion: reduce`**: corpo, lâmina e brilho ficam com `animation: none`. Sobra o quadro inicial: esfera redonda, núcleo no alto à esquerda, ponto de luz aceso. Continua tridimensional.

**Sem suporte a `@property`**: variável não registrada não interpola, ela salta a cada keyframe. Por isso `orb-shape` e `orb-drift` só ligam dentro de `@supports (transition-behavior: allow-discrete)`, recurso lançado depois de `@property` nos três motores (Chrome 117, Safari 17.4, Firefox 129). Fora dele a orb fica parada no quadro de repouso. Todo `var(--orb-*)` traz o valor de repouso como fallback, então o gradiente e a forma redonda nunca quebram. A lâmina e o brilho (transform e opacity) continuam girando e pulsando.

## Acessibilidade

- Decorativa: `aria-hidden="true"` sempre. O nome do agente é **texto real** ao lado (`.brand-orb-lockup`, cabeçalho da mensagem) ou o `aria-label` do contêiner interativo.
- Sem texto dentro, não há contraste de texto a medir. A identidade nunca depende só da cor: o nome do agente está sempre presente.
- WCAG 2.2.2 (pausar, parar, ocultar): um elemento de 28–40 px que não transmite informação fica fora do critério. Em hero de 96 px ou mais perto de texto longo, prefira um só exemplar por tela. O reduced-motion do sistema para tudo.
- Não use a orb como indicador de estado ("pensando", "erro"). Estado é texto e `aria-live`, não movimento.

## Tokens

| Token | Uso |
|---|---|
| `--ai-electia-core/glow/shade` | Pigmentos da orb Electia |
| `--ai-emprega-core/glow/shade` | Pigmentos da orb IMO |
| `--ai-xscore-core/glow/shade` | Pigmentos da orb Xscore |
| `--text-on-color` | Ponto de luz especular |
| `--space-2`, `--font-heading`, `--font-semibold`, `--text-primary` | `.brand-orb-lockup` |

Variáveis locais do componente (podem ser sobrescritas no elemento): `--orb-core`, `--orb-glow`, `--orb-shade`, `--orb-size`.

## Decisões

**Decidido (05/10/2026, Marcos):** Nexus e Copilot Electia usam a **mesma** orb, `.brand-orb-electia`. Não há segunda cor Electia. Se um dia a marca quiser distinguir os dois por cor, o token nasce primeiro em `brands/electia/tokens/`, e só então ganha uma cópia aqui.

**Abertas:**

1. **Cor de IA da Emprega+.** O IMO usa o índigo de ação porque a marca não tem token de IA. Se a Emprega+ criar um, `--ai-emprega-*` passa a copiá-lo.
2. **Reflexo dourado no Xscore.** É a única forma de separar Xscore e Electia sem sair da paleta das marcas, já que as duas usam o mesmo roxo. A alternativa é Xscore com orb idêntica à Electia, separada só pelo nome. Quem decide é a marca Xscore.

## Ver também

- `demos/brand-orb.html` — as quatro identidades × três tamanhos, claro e escuro
- `docs/research/assets/brand-orb-2026-10-05/` — capturas em 375 e 1440
- `docs/research/talio-componentes-2026-10-05.md` §2 — referência de padrão (mecanismo medido; nada copiado)
- [conversation.md](conversation.md) — onde a orb vira avatar de mensagem
