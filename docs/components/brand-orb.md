# Brand orb — a orb dos agentes de IA

Uma esfera que identifica **quem está falando quando quem fala é uma IA**, e que só ganha vida quando o agente age. Decisão de 05/10/2026: a mesma orb é a assinatura de quatro agentes — **Nexus** e **Copilot Electia** (Electia), **IMO** (Emprega+) e **Xscore**. Um componente só: o movimento é idêntico em todos, muda a cor por marca e o tamanho por uso.

Só CSS. Sem canvas, SVG, vídeo, imagem nem JavaScript.

## Quando usar

- Avatar do assistente numa conversa, ao lado do nome do agente.
- Lockup do agente: orb + nome, em cabeçalho de painel, menu ou rodapé.
- Hero ou estado vazio do copiloto ("Pergunte ao Nexus…").
- Marcador de que um bloco foi produzido pelo agente (resposta, resumo, explicação de score).

## Quando NÃO usar

- **Não é spinner genérico.** O estado ativo indica *o agente* pensando ou respondendo. Upload, carregamento de página ou consulta que não é do agente usam `.spinner` / `.skeleton`.
- **Não é decoração genérica.** Fora do contexto de IA ela dilui a assinatura. Nada de orb em card de marketing, cabeçalho de seção ou fundo de página.
- **Não é logotipo de produto.** Os logos ficam em `brands/*/assets`. A orb representa o agente, não a marca.
- **Não é botão.** Se a orb abre o copiloto, o alvo clicável é um `<button>` com nome acessível que a contém. A orb não ganha estados de hover e foco por conta própria.

## Anatomia

```
span.brand-orb [.brand-orb-{electia|emprega|xscore}] [.brand-orb-{sm|md|lg}] [data-state="active"]
  ::before   lâmina cônica que gira por cima, em mix-blend-mode: screen
  ::after    ponto de luz especular, alto à esquerda, que pulsa
```

### Estados

Decisão do Marcos (05/10/2026): **a orb fica viva só quando o agente age.**

| Estado | Como se liga | O que acontece |
|---|---|---|
| **Repouso** (padrão) | nada | Parada no quadro de repouso: esfera redonda, núcleo no alto à esquerda, reflexo embaixo à direita, ponto de luz aceso. Nenhuma animação. |
| **Entrada** | automática, ao aparecer | Mexe-se por **4,8 s** (iterações finitas) e para sozinha no quadro de repouso. Sem JavaScript. |
| **Ativo** | `data-state="active"` na `.brand-orb` | Anima em loop enquanto o agente pensa ou responde. Quem consome **tira o atributo** quando a resposta termina. |

`data-state="active"` é o **único** jeito canônico (segue o padrão de `data-state` do `.disclosure`); não há classe equivalente. Qualquer outro valor, ou a ausência do atributo, é repouso.

Como a entrada termina no repouso: os keyframes `orb-shape`, `orb-drift` e `orb-glint` começam e terminam exatamente no quadro de repouso (os `initial-value` dos registros e a opacidade 0,85 do ponto de luz); `orb-spin` termina em `1turn`, que é a mesma orientação de `0`. O `animation-fill-mode: both` segura esse último quadro, então não há salto quando a entrada acaba. Ao sair do ativo, a orb volta ao quadro de repouso; se ela apareceu já ativa (ex.: a resposta que surge com o avatar), conclui o que resta da entrada e para no máximo 4,8 s depois de ter aparecido.

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

**Agente respondendo** (estado ativo): a orb continua `aria-hidden`, então o status **tem de existir em texto**. O contêiner da conversa marca `aria-busy` e uma região `aria-live` diz o que está acontecendo. Ao terminar, quem consome remove `data-state`, desliga `aria-busy` e troca o texto do status.

```html
<section class="conversation" aria-label="Conversa com o Nexus" aria-busy="true">
  <div class="message">
    <span class="brand-orb brand-orb-electia brand-orb-md" data-state="active" aria-hidden="true"></span>
    <p><strong>Nexus</strong> …</p>
  </div>
  <p class="sr-only" role="status" aria-live="polite">Nexus está respondendo…</p>
</section>
```

```js
// fim da resposta
orb.removeAttribute('data-state');
conversa.setAttribute('aria-busy', 'false');
status.textContent = 'Nexus respondeu.';
```

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

**Claro e escuro:** a orb é um objeto com luz própria, não uma superfície, então usa os mesmos valores nos dois temas. Ela foi verificada sobre `--bg-surface-1` dos dois temas (ver PNGs abaixo). Em repouso, os quadros dos dois temas saem iguais.

## Movimento

| Animação | Onde | Entrada | Ativo | O que muda |
|---|---|---|---|---|
| `orb-shape` | corpo | 2,4 s × 2 | 6,5 s em loop | forma orgânica: `--orb-ra…rd` (raios da borda) entre 44 % e 57 % |
| `orb-drift` | corpo | 4,8 s × 1 | 11 s em loop | os focos de cor (`--orb-ax/ay/bx/by`) andam ~10 pontos |
| `orb-spin` | `::before` | 4,8 s × 1 | 7,5 s em loop, linear | `transform: rotate(1turn)` da lâmina cônica |
| `orb-glint` | `::after` | 2,4 s × 2 | 4,2 s em loop | `opacity` 0,85 → 0,6 → 1 → 0,85 do ponto de luz |

Na entrada tudo termina junto, aos 4,8 s (abaixo dos 5 s). No ativo as quatro durações não se alinham, então a combinação demora a se repetir.

**Nada anima layout.** Os keyframes só tocam `transform`, `opacity` e propriedades registradas com `@property` (`<percentage>`, `inherits: false`). O registro é o que permite ao navegador interpolar a posição de um gradiente e o raio da borda. Um teste reprova qualquer outra propriedade num keyframe. O desfoque da lâmina é estático; só o giro anima.

**`prefers-reduced-motion: reduce`**: nada anima, nem a entrada nem o ativo. Corpo, lâmina e brilho ficam com `animation: none`, inclusive com `data-state="active"`. Sobra o quadro de repouso, ainda tridimensional; o status do agente continua no texto da região `aria-live`.

**Sem suporte a `@property`**: variável não registrada não interpola, ela salta a cada keyframe. Por isso `orb-shape` e `orb-drift` só ligam dentro de `@supports (transition-behavior: allow-discrete)`, recurso lançado depois de `@property` nos três motores (Chrome 117, Safari 17.4, Firefox 129). Fora dele o corpo fica parado no quadro de repouso. Todo `var(--orb-*)` traz o valor de repouso como fallback, então o gradiente e a forma redonda nunca quebram. A lâmina e o brilho (transform e opacity) seguem os mesmos estados: entrada finita, loop só no ativo.

## Acessibilidade

- Decorativa: `aria-hidden="true"` sempre. O nome do agente é **texto real** ao lado (`.brand-orb-lockup`, cabeçalho da mensagem) ou o `aria-label` do contêiner interativo.
- Sem texto dentro, não há contraste de texto a medir. A identidade nunca depende só da cor: o nome do agente está sempre presente.
- **WCAG 2.2.2 (pausar, parar, ocultar)** — [Understanding 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). Ser decorativa, pequena ou `aria-hidden` não dispensa o critério. Como a orb atende, por estado:
  - **Repouso:** não há movimento, o critério não se aplica.
  - **Entrada:** o movimento começa sozinho mas dura 4,8 s e para. O critério só exige mecanismo para movimento que dura **mais de 5 s**.
  - **Ativo:** o movimento é um indicador de status de um processo em andamento — o agente pensando ou respondendo a uma pergunta que o próprio usuário fez — e termina sozinho quando a resposta termina. Não é um loop decorativo: o loop infinito sem dono, que o Revisor reprovou, **deixou de existir**. Isto **não** é uma dispensa automática. O Understanding só considera essencial a animação de pré-carregamento quando "interaction cannot occur during that phase" e a falta de indicação de progresso confundiria o usuário; aqui o status também está em texto, então não alegamos essencialidade. A leitura honesta é: o movimento acompanha o processo e acaba com ele; se uma resposta puder passar de 5 s, a tela deve oferecer um controle para interromper a geração (que encerra o processo e, com ele, o movimento), e o estado nunca pode ficar ligado depois do fim, do erro ou do cancelamento.
  - **Movimento reduzido:** nada anima em estado nenhum.
- **O status é texto, não movimento.** A orb ativa reforça visualmente, mas quem anuncia é o contêiner: `aria-busy` na conversa e uma região `aria-live` ("Nexus está respondendo…"). Erro também é texto. Quem consome é responsável por tirar `data-state="active"` quando a resposta termina, inclusive em erro ou cancelamento.

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

**Decidido (05/10/2026, Marcos):** o IMO usa o **índigo de ação** como cor de IA, porque a Emprega+ não tem token de IA. Se a marca criar um, `--ai-emprega-*` passa a copiá-lo.

**Decidido (05/10/2026, Marcos):** o Xscore mantém o **reflexo dourado** sobre o corpo roxo. É o que separa Xscore e Electia sem sair da paleta das marcas, já que as duas usam o mesmo roxo.

**Decidido (05/10/2026, Marcos), após o Revisor reprovar o loop infinito por WCAG 2.2.2:** "a orb fica viva só quando o agente age". Repouso parado por padrão; entrada de no máximo 5 s que para sozinha; loop só com `data-state="active"`, enquanto o agente pensa ou responde; nada anima sob `prefers-reduced-motion`. Ver Estados e Acessibilidade.

## Ver também

- `demos/brand-orb.html` — as quatro identidades × três tamanhos, claro e escuro, e uma conversa com "Simular resposta" (estado ativo + `aria-live`)
- `docs/research/assets/brand-orb-2026-10-05/` — capturas do repouso em 375 e 1440 e do estado ativo (`brand-orb-ativo-1440.png`)
- `docs/research/talio-componentes-2026-10-05.md` §2 — referência de padrão (mecanismo medido; nada copiado)
- [conversation.md](conversation.md) — onde a orb vira avatar de mensagem
