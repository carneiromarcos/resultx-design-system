# Talio — componentes reutilizáveis para o DS

**Captura:** 05/10/2026 · **Fonte:** [talio.work](https://talio.work/) · **Estado:** referência externa, nada adotado no DS canônico · **Complementa:** [talio-reference-2026-09-29.md](talio-reference-2026-09-29.md)

## Proveniência e limite

A ficha de 29/09 já mede paleta, tipografia geral e ordem das seções, e esses dados não se repetem aqui. Esta ficha desce ao nível de **componente**: navbar, orb da marca, painel de CTA, composer do assistente e moldura da demo. A Talio é marca de terceiro. Daqui saem padrões e valores. Logo, textos, imagens, CSS minificado e código de animação não são copiados. Nas propostas, os nomes de classe e os tokens são os nossos.

| Evidência | Revisão em 05/10 | Uso |
|---|---|---|
| HTML público | `https://talio.work/` | Entrada e nomes dos assets |
| CSS | `/assets/index-D-bWN8Ja.css` · 181 179 B · SHA-256 `2ba2311da186e3a57c5952bb64c70f42673715847e465193befcd5509e6d6e33` | Keyframes, regras de reduced-motion, variáveis de tema |
| JS | `/assets/index-CUp17HPN.js` · 1 035 353 B · SHA-256 `98ef769e363a208941485316387d0fe4ac5e427d78be5936edf08ee9bf16c2f1` | Presença de `whileInView` e do efeito de digitação |
| Browser | Chromium headless (Playwright), 1440×900 e 375×812 (isMobile, DPR 2) e um contexto 1440 com `reducedMotion: 'reduce'` | `getComputedStyle`, estados hover e foco, rolagem, recortes |

**Os dois assets mudaram desde 29/09.** Naquela data o CSS era `index-BdfkPj_c.css` (`d3cbff79…`) e o JS `index-BZliwA0B.js` (`dbbe3925…`). As variáveis de cor batem com o snapshot `.tokens.json` (canvas `#F7F6F3`, acento `#67727E`, azul `#0F38B3`, demo `#141824`). Isso indica uma nova build, não uma troca de paleta.

**Como medi.** Antes de medir, percorri a página inteira para disparar as entradas `whileInView`. O contraste foi calculado compondo os `background-color` translúcidos dos ancestrais até chegar a um fundo opaco. Esse cálculo ignora `background-image`: onde o fundo é gradiente, informo os extremos. Nas tabelas, **[medido]** é valor computado ou amostrado em execução. **[inferido]** é leitura minha a partir do CSS ou do recorte.

**Interferência na coleta.** Ao rolar até cerca de 4 000 px em 1440, abre sozinho um modal de captação de lead ("Fale com o time comercial…"), que fecha com Esc. Ele foi dispensado em todas as medições e está fora do escopo desta ficha.

Recortes em [`assets/talio-componentes-2026-10-05/`](assets/talio-componentes-2026-10-05/).

---

## 1. Navbar flutuante fixa

Recortes: `navbar-1440-topo.png`, `navbar-1440-rolada.png`, `navbar-1440-foco.png`, `navbar-375.png`, `navbar-375-menu-aberto.png`, `barra-inferior-cta-375.png`.

### Anatomia

`nav` sticky (camada externa, só faz o recuo) → **pílula** (`container`, grid de 3 colunas `1fr auto 1fr` no desktop) → [marca: texto + orb 22 px] · [5 links centrais] · [Login (ghost) · Agendar demonstração (secundário com ícone de calendário 14 px) · Testar grátis → (primário escuro)]. Abaixo de 1024 px os links e os CTAs somem, e um botão de menu de 36 px abre uma gaveta lateral.

### Medidas [medido]

| Parte | 1440 | 375 |
|---|---|---|
| Recuo do topo | `position: sticky; top: 16px` + `margin-top: 16px` | `top: 12px` |
| Pílula | 1400 × 56 px, `max-width` 1400, padding 0 20 px | 351 × 56 px, padding 0 16 px |
| Raio | 16 px | 16 px |
| Fundo | `rgba(247,246,243,.70)` (canvas a 70 %) | idem |
| Desfoque | `backdrop-filter: blur(24px)` | idem |
| Borda | 1 px `rgba(219,215,209,.6)` | idem |
| Sombra | `0 20px 60px -20px hsl(225 20% 15%/.35), 0 8px 24px -12px hsl(212 14% 40%/.18)` (a "sombra luxe" do tema) | idem |
| Links centrais | 14 px/400, `#515767`, gap 28 px; hover → `#67727E` em 150 ms | — |
| Botões | 36 px de altura, raio 6 px, padding 0 12 px, 12 px/500 | menu 36 × 36 px |
| Marca | texto 24 px/600, tracking −0,24 px, **`color: #fff` + `mix-blend-mode: exclusion`**, orb 22 px | idem |

**Truque da marca [inferido do computado + recorte]:** o texto é branco e se mistura por *exclusion*. Sobre fundo claro ele aparece quase preto, sobre fundo escuro aparece claro. Com um único elemento, a marca se adapta ao que estiver por trás, sem precisar de duas versões do logotipo.

### Comportamento ao rolar [medido]

Amostrei a pílula com `scrollY` em 0, 80, 400, 1500 e 6000. **Nada muda**: a classe, a altura (56), o fundo, o blur e a sombra ficam iguais e não há encolhimento. A navbar não reage à rolagem; o efeito de "vidro" vem só do blur sobre o conteúdo que passa por baixo (compare `navbar-1440-topo.png` com `navbar-1440-rolada.png`).

### Estados dos botões [medido]

| Botão | Repouso | Hover |
|---|---|---|
| Login (ghost) | transparente, `#515767` | texto `#1C2130`, fundo `primary/8` |
| Agendar (secundário) | fundo `rgba(28,33,48,.04)`, borda 1 px `#67727E/.4`, texto `#67727E`, filete interno (3 sombras inset + 0 1px 2px) | fundo `#67727E/.10`; aparece um anel de 1 px no azul da marca/.4 e um brilho `0 8px 26px -8px` azul/.6; uma faixa de reflexo atravessa o botão uma vez (720 ms) |
| Testar grátis (primário) | `#1C2130`, texto `#F4F2EC`, filete interno; brilho radial azul no `::before` à deriva em loop de 6 s | sobe 1 px (`translateY(-1px)`), ganha o mesmo anel e brilho e uma passada de reflexo |

A transição computada é de **150 ms** com `cubic-bezier(.22,.61,.36,1)`, embora a classe declare `duration-[180ms]`: alguma regra posterior sobrescreve. Ao clicar, `active:scale(.97)`.

### Mobile [medido]

- Com o menu aberto, uma gaveta entra pela direita (279 px a partir de x = 96) sobre um overlay `bg-black/80`. Ela traz cabeçalho com a marca e um botão "Fechar menu" de 36 px, seções rotuladas em caixa alta ("Navegue", "Conta"), itens com ícone e, no rodapé, "Comece agora" com os dois CTAs em largura total, cada um com 40 px de altura.
- O botão de menu **não tem `aria-expanded` nem `aria-controls`**: os dois atributos voltaram `null`.
- **Barra de CTA inferior fixa (só abaixo de `lg`).** É uma pílula de 351 × 58 px, raio 16, fundo `canvas/.85`, blur 24 e a mesma sombra luxe, com texto de 12 px à esquerda e o botão primário de 40 px à direita. Ela respeita `env(safe-area-inset-bottom)`. **Só aparece depois de 900 px de rolagem**: amostrada a cada 100 px, ficou ausente de 0 a 800 e presente de 900 em diante. É um componente que a ficha de 29/09 não registrou.

### Movimento e reduced-motion

A navbar em si não anima; só os botões e o orb da marca se mexem. Sob `reduce`, uma regra global do site zera todas as animações e transições (`animation-duration: .001ms !important`, uma única iteração; `transition-duration: .001ms`) **[medido]**.

### Mapa contra o DS

| Pergunta | Resposta |
|---|---|
| Existe? | **Parcial.** O nosso `.header` (components.css) é sticky com `top: 0`, ocupa a largura toda, usa `--glass-standard-*` e `border-bottom`. Altura igual (`--header-height: 56px`), mas não flutua, não tem raio nem sombra |
| Proposta | Modificador `.header.header-float` (ou classe própria `.navbar-float`, se o Marcos preferir separar landing de app): `top: var(--space-4)`, `margin-inline: var(--space-4)`, `border-radius: var(--radius-xl)` (16 px), `border: 1px solid var(--glass-standard-border)`, `box-shadow: var(--elevation-3)`, `background: var(--glass-standard-bg)` (0,75 claro / 0,6 escuro, próximo dos 0,70 da Talio), `backdrop-filter: blur(var(--glass-strong-blur))` (24 px) |
| Botões | `.btn-ghost.btn-sm`, `.btn-secondary.btn-sm`, `.btn-primary.btn-sm` (`min-height: 36px`, igual ao medido) |
| Gaveta mobile | Reaproveitar o comportamento de `.sidebar-overlay` + `[data-sidebar-toggle]` (navigation.md), que já entrega `aria-expanded` e é exatamente o que falta na Talio |
| Barra inferior | Novo `.cta-dock` (opcional), que aparece por `IntersectionObserver` quando o CTA do hero sai da tela, não por limiar fixo de pixels |
| Variantes | Electia: canvas grafite `#0B0E14` com vidro escuro e primário roxo `#6f32b1`. Xscore: primário de ação ouro, foco `--border-focus`. A pílula só muda tokens, não estrutura |

### Acessibilidade

| Par | Contraste | Veredito |
|---|---|---|
| Links `#515767` / canvas `#F7F6F3` | 6,68:1 | AA |
| Link em hover `#67727E` / canvas | 4,53:1 | AA no limite |
| Login `#515767` / canvas | 6,68:1 | AA |
| **Agendar `#67727E` / fundo composto `#EEEDEB`** (12 px/500) | **4,20:1** | **Falha AA** para texto pequeno |
| Testar grátis `#F4F2EC` / `#1C2130` | 14,32:1 | AAA |
| Barra inferior: texto `#515767` / `canvas/.85` | 6,68:1 | AA |

- **Foco [medido]:** os links recebem `outline: 2px solid #67727E`. Os botões recebem um anel duplo (`0 0 0 2px` na cor do canvas + `0 0 0 4px #67727E`), visível em `navbar-1440-foco.png`. O anel contra o canvas mede cerca de 4,5:1, acima dos 3:1 que se exigem de elemento não textual.
- **Alvos de toque:** menu e fechar com 36 × 36 px. Passa o AA 2.5.8 (24 px), mas fica abaixo do nosso padrão de 44 px usado em `.composer-send`. Os CTAs da gaveta e da barra inferior têm 40 px.
- Na proposta, o secundário com texto de 12 px precisa de pelo menos 4,5:1: no Electia, `#6f32b1` sobre branco dá 7,59:1.

---

## 2. Logomarca animada — o orb

Recortes: `logo-lockup-1440.png`, `orb-112-quadro1.png`, `orb-112-quadro2.png`, `orb-112-quadro3.png` (o mesmo orb de 112 px em três instantes, com cerca de 1,4 s entre eles).

### Como é feito [medido]

**Só CSS.** A página não tem canvas, vídeo, SVG nem imagem no orb (`canvas: 0`, `video: 0`). É um `<span>` com `aria-hidden="true"` em todas as 9 instâncias, montado em três camadas:

| Camada | Construção |
|---|---|
| Corpo | 3 `radial-gradient` empilhados: um foco azul da marca a 65 % (posição variável), um foco prata/acento a 70 % (posição variável) e uma base escura `#121621 → #05060a`. `overflow: hidden`, `isolation: isolate` |
| Sombra | 4 camadas: filete interno de 1 px `rgba(206,224,243,.14)`, queda `0 2px 10px -2px rgba(0,0,0,.6)` e dois halos coloridos (acento .4 com 16 px; azul .35 com 20 px) |
| `::before` | `conic-gradient` azul → transparente → prata → transparente, 25 % maior que o orb (`inset: -25%`), `mix-blend-mode: screen`, opacidade .6, **girando** |
| `::after` | Ponto de brilho especular: elipse de 30 × 22 % em (20 %, 14 %), radial branco .6 com `blur(.5px)`, **pulsando em opacidade** |

As posições dos focos de cor são **propriedades customizadas registradas com `@property`** (`<percentage>`, `inherits: false`). Por isso o navegador consegue interpolar a posição de um `radial-gradient`, algo impossível com variável comum.

### Movimento [medido]

| Animação | Alvo | Duração / easing | O que faz |
|---|---|---|---|
| Forma ("blob") | corpo | 5,5 s `ease-in-out` infinito | `border-radius` passa por 6 formas orgânicas (por exemplo `42% 58% 61% 39% / 52% 42% 58% 48%`) e volta a círculo. Amostra real: `40,3% 59,7% 62,7% 37,3% / …` |
| Deriva de cor | corpo | 9 s `ease-in-out` infinito | os focos azul e prata trocam de lugar cerca de 10 pontos percentuais (azul 30 % → 40 % em x). Amostra de `--orb-blue-x`: 34,2 %–39,9 % |
| Giro | `::before` | 6 s `linear` infinito | rotação de 360° do brilho cônico |
| Brilho | `::after` | 4,5 s `ease-in-out` infinito | opacidade .72 ↔ 1 |
| Respiração | wrapper `.sphere-breathe` (só nos orbs de 112 e 36 px) | 6 s `ease-in-out` infinito | `scale(1) ↔ scale(1.035)` |
| Hover (variante interativa) | corpo | transição de 300 ms com o easing da marca | `scale(1.08)`, halos mais fortes, giro acelera para 2,4 s e opacidade .85 |

As durações são primas entre si (5,5 / 6 / 9 / 4,5 s), então a combinação demora muito a se repetir. Daí a sensação de "vivo" sem um loop visível **[inferido]**.

**Reduced-motion [medido]:** forma, deriva, giro e brilho ficam com `animation: none`, a respiração também, e o hover não escala. Fica um orb estático, ainda tridimensional.

### Onde aparece [medido]

| Tamanho | Lugar | Interativo |
|---|---|---|
| 22 px | logotipo na navbar e no rodapé | sim (navbar) |
| 14 px | dentro do eyebrow em pílula do hero | não |
| 28 px | **avatar do assistente** no composer do hero | sim |
| 40 px | avatar em outros mockups de assistente (seção "O que vem junto") | sim |
| 16 px | rótulo inline | não |
| 112 px | núcleo do diagrama de ecossistema, com marca tipográfica dentro | não, + respiração |
| 36 px | topo do painel de CTA final | não, + respiração |

Não encontrei hero escuro com orb na versão de hoje: o hero é claro e o orb ali é o de 14 px no eyebrow.

### Mapa contra o DS

| Pergunta | Resposta |
|---|---|
| Existe? | **Não.** Não há orb, esfera nem avatar de IA animado em `components/` ou nos tokens de marca |
| Proposta | `.brand-orb` com tamanhos `--xs` (14) `--sm` (22) `--md` (28) `--lg` (40) `--xl` (112), modificadores `.brand-orb--interactive` e `.brand-orb--breathe`. Cores em variáveis locais (`--orb-a`, `--orb-b`, `--orb-base`), alimentadas pelos tokens da marca |
| Electia | `--orb-a: var(--purple)` `#6f32b1`, `--orb-b: var(--purple-on-dark)` `#c084fc`, base grafite `#0B0E14`. Fica coerente com o gradiente de marca `#6f32b1 → #a55eea` |
| Xscore | Roxo também: nos tokens do Xscore, roxo = "inteligência, score, explicação, IA" e ouro = ação. Um orb dourado confundiria IA com botão |
| Papel | Avatar do assistente e marcador de "IA" — **não** um logotipo novo. Logotipos ficam em `brands/*/assets` |
| Motion | Movimento contínuo (forma, deriva, giro e brilho) só no orb, com `@media (prefers-reduced-motion: reduce)` zerando tudo e um fallback estático para navegador sem `@property` (o gradiente fica parado na posição inicial) |

### Acessibilidade

Decorativo e `aria-hidden` em todos os lugares **[medido]**; o nome acessível fica no link da marca (`aria-label="Talio — início"`). Sem texto dentro, não há contraste a medir. Animação contínua em loop infinito pede o reduced-motion acima. O critério WCAG 2.2.2 (pausar, parar, ocultar) não se aplica a um elemento de 22 a 40 px que não transmite informação, mas um orb de 112 px em loop perto de texto longo merece revisão.

---

## 3. Seção CTA de contraste

Recortes: `cta-painel-1440.png`, `cta-painel-375.png`, `cta-botoes-hover-1440.png`.

### Anatomia

`section` clara → container com escopo `.dark` → **painel** (raio 16, `overflow: hidden`) com quatro camadas de fundo: cor base, gradiente radial, dois "washes" radiais coloridos e grão de ruído. Por cima vêm o orb de 36 px (respirando), o H2 com a segunda parte em gradiente, o parágrafo de apoio, dois botões e os selos de confiança. Na borda de baixo, um **filete metálico de 4 px**.

### Medidas [medido]

| Parte | 1440 | 375 |
|---|---|---|
| Painel | 1300 × 460 px, padding 80/48 px | 326 × 427 px, padding 48/20 px |
| Fundo | `#141824` + `radial-gradient(100% 70% at 50% 0%, #232839, #131620 70%)` | idem |
| Washes | `radial at 100% 0%` acento/.18 e `radial at 0% 100%` azul/.22 | idem |
| Grão | `::before` com ruído SVG, opacidade .1, `mix-blend-mode: overlay` | idem |
| Filete inferior | 4 px, `linear-gradient(90deg, #6E7A87, #B1BCC9, #6E7A87)` + sombra inset 1 px | idem |
| Sombra | `0 24px 70px -24px rgba(0,0,0,.7), 0 2px 12px -4px rgba(122,139,159,.14)` | idem |
| H2 | 60/60 px, 600, tracking −0,6 px, `text-wrap: balance`, máx. 768 px, `#E7EBEF` | 32 px |
| Meio-tom | segunda parte em 700 com `background-clip: text`, gradiente **vertical** `#D3DBE4 → #929DAA` | idem |
| Apoio | 16 px, `#E7EBEF` a 75 % (≈ `#B2B6BC`) | 14 px |
| Botões | 44 px de altura, raio 8, padding 0 28 px, 14 px/600, gap 12 | largura total (288 px), `h-12` declarado; caixa medida em 45,6 px durante a entrada |
| Selos | 11 px, `#E7EBEF` a 68 %, ícone de 12 px, gap 16 | idem |

### Movimento dos botões [medido]

**Primário ("claro-lavanda")**

- Superfície: `#758CD1` + `linear-gradient(135deg, #9FAEDB, #758CD1 52%, #758CD1/.82)` + textura de ruído em `overlay` (o grão aparece no recorte). Texto `#132353`. O filete interno é o mesmo da navbar.
- **Em repouso, loop infinito:** o `::before` é um radial azul, com `blur(16px)` e `mix-blend-mode: color`, que **deriva** em 6 s `ease-in-out`: vai de `translate(-16%,-12%) scale(.9)` com opacidade .55 até `translate(14%,16%) scale(1.2)` com opacidade .92. Amostras a cada 1,2 s: escala 0,91 → 1,20 e opacidade 0,56 → 0,91. Visualmente, uma mancha de luz passeia dentro do botão.
- **Hover:** sobe 1 px em 150 ms. Entra a sombra de anel (azul/.4 com 1 px) e um brilho de queda (`0 8px 26px -8px` azul/.6 + `0 6px 20px -10px`). Uma **faixa de reflexo** inclinada −18°, com 45 % da largura e branco .28, atravessa o botão **uma vez** em 720 ms (`cubic-bezier(.22,.61,.36,1)`): começa em −140 %, fica opaca aos 12 % e sai a +360 % já transparente. As amostras de `transform` do `::after` em 60, 200 e 400 ms confirmam a passagem.
- **Detalhe de implementação [inferido do computado + recorte]:** o botão leva duas classes que disputam o mesmo `::before`. Uma desenha um halo externo desfocado (`inset: -10px`, `z-index: -1`); a outra, a mancha de deriva com `overflow: hidden`. O computado mistura as duas (inset −40 % com blur 16 px e animação de deriva), e o halo externo previsto acaba recortado. Não aparece halo fora do botão em `cta-botoes-hover-1440.png`. Para nós, a lição é **um efeito por pseudo-elemento**.

**Secundário ("borda luminosa")**

- Fundo azul `#7696F4` a .11 com realce radial no canto superior esquerdo (`90% 130% at 28% -30%`, .3). Borda 1 px no mesmo azul a .6. Texto `#7696F4`.
- **Em repouso, loop infinito:** a mesma deriva de 6 s no `::before`, com `mix-blend-mode: screen` e opacidade .4.
- **Hover:** fundo de .11 → .19, borda de .6 → .85, deriva de .4 → .6, sobe 1 px, mesmo anel e brilho de queda, mesma passada de reflexo.
- **Não existe borda com gradiente girando nem `conic-gradient` animado no contorno.** O "luminoso" vem da borda translúcida, do realce interno, da mancha de luz em deriva e do filete. Há uma classe de contorno em gradiente no CSS, mas ela é usada no composer do hero, não aqui.

**Reduced-motion [medido]:** a deriva fica em `none`, com opacidade fixa (.65 no primário, .4 no secundário). A passada de reflexo some porque a regra global zera as durações. O orb do topo para.

### Mapa contra o DS

| Pergunta | Resposta |
|---|---|
| Existe? | **Não como seção.** Temos `.card`, `.card-glass` e temas escuros, mas nenhum painel de fechamento com fundo em camadas |
| Proposta | `.cta-panel` (+ `.cta-panel-title`, `.cta-panel-lead`, `.cta-panel-actions`, `.cta-panel-proof`). Aplica o escopo do tema escuro dentro da página clara, como a Talio faz com `.dark`. O filete inferior entra como `--gradient-purple-line` no Electia, que já existe nos tokens |
| Botões | Dois modificadores pequenos sobre `.btn`: `.btn-sheen` (reflexo de uma passada no hover, sem loop) e `.btn-glow` (halo externo). Recomendo **não** importar a deriva infinita em repouso: dois CTAs pulsando lado a lado competem com o H2. Decisão em aberto abaixo |
| Tokens | Superfície `--bg-base` do tema escuro da marca; título `--text-primary`; apoio `--text-secondary`; raio `--radius-xl`; sombra `--elevation-4`; ritmo de transição `--transition-fast` (150 ms) |
| Electia | Painel `#0B0E14` com washes roxos; meio-tom do H2 com gradiente vertical de `#E6EDF3` para `#c084fc` ou roxo claro; primário roxo sólido com texto branco; secundário com contorno roxo-claro |
| Xscore | Painel grafite; primário ouro (ação) com texto grafite, 7,33:1; washes roxos (IA), só se o CTA for do assistente |

### Acessibilidade

| Par | Contraste | Veredito |
|---|---|---|
| H2 `#E7EBEF` / `#141824` | 14,78:1 | AAA |
| Meio-tom: extremo claro `#D3DBE4` / topo do painel `#232839` | 10,48:1 | AAA |
| Meio-tom: extremo escuro `#929DAA` / `#232839` – `#131620` | 5,32 – 6,55:1 | AA (texto grande exige 3:1; passa folgado) |
| Apoio (≈ `#B2B6BC`) / `#141824` | 8,72:1 | AAA |
| Primário: texto `#132353` / `#758CD1` (sem o realce do gradiente) | 4,61:1 | AA no limite; o canto claro do gradiente melhora, mas a mancha de deriva varia a cor sob o texto |
| Secundário `#7696F4` / fundo composto `#1F263B` | 5,33:1 | AA |
| Selos (11 px) ≈ `#A3A7AE` / `#141824` | 7,37:1 | AAA |

Se o texto do primário passar sobre uma área animada, o contraste muda com o tempo e uma medição estática não garante o pior caso. Na nossa versão, o texto fica sobre cor sólida. No Electia, branco sobre `#6f32b1` dá 7,59:1. Os botões são `<a>` com foco no anel duplo da página. No mobile, as caixas de toque ficam entre 46 e 48 px, acima de 44.

---

## 4. Composer de assistente ("abrir vaga por chat")

Recortes: `composer-1440.png`, `composer-375.png`.

### Anatomia [medido]

**O composer inteiro é um único `<a>`** (`aria-label="Abrir minha vaga por chat — testar grátis"`, levando ao cadastro). Não há campo de texto, e os chips e o "Enviar" são `<span>` com `tabindex=-1`. É uma **maquete de marketing**, não um composer funcional.

`a.card` (vidro + contorno em gradiente + brilho de vidro) → **barra de título** (semáforo de 3 pontos · título · ícone de globo) → **corpo** (orb de 28 px · frase sendo digitada · cursor) → **rodapé** (4 chips com ícone em círculo · "Enviar" com ícone de avião de papel).

### Medidas [medido]

| Parte | Valor |
|---|---|
| Cartão | 672 × 166 px (1440) / 343 × 250 px (375); raio 16; fundo `#FFF`; `backdrop-filter: blur(16px) saturate(1.5)`; borda 1 px `#DBD7D1` |
| Contorno | máscara com `mask-composite: exclude` desenha uma borda de 1 px em gradiente 135° (azul .85 → transparente → acento .9) |
| Sombra | sombra luxe + filete interno + **dois halos coloridos** `0 0 50px -16px` (azul .4 e acento .35) |
| Brilho de vidro | `::after` com faixa diagonal branca (.05–.09) em `background-size: 260%`, varrendo em 8 s `ease-in-out` infinito |
| Grão | `::before` com ruído, opacidade .13, `multiply` |
| Barra de título | 41 px de altura, padding 12/20, fundo branco .6, borda inferior `#DBD7D1/.6` |
| Semáforo | 3 pontos de 10 px: vermelho `rgba(189,40,40,.7)`, âmbar `rgba(245,170,20,.7)`, verde `rgba(45,118,84,.7)` |
| Título | 12 px, `#515767` |
| Corpo | padding 20, `min-height: 56px`, gap 12; frase 16/24 px, `#2E2E2E` a 90 % |
| Cursor | 2 × 16 px, cor do acento, `pulse` em 2 s `cubic-bezier(.4,0,.6,1)` infinito |
| Chips | 30 px de altura, pílula, padding 4/10/4/4, 11 px, borda `#DBD7D1/.6`, fundo branco .6; ícone em círculo de 20 px com acento a 15 % |
| Enviar | pílula de 79 × 28 px, padding 6/12, 12 px/600, fundo `#67727E`, texto `#1C2130`, sombra luxe, opacidade 1 |
| Hover do cartão | `translateY(-2px)` em 150 ms |
| Mobile | chips em 3 linhas (2 + 1 + 1), Enviar à direita da segunda linha |

### Movimento — efeito de digitação [medido em 24 amostras a cada 350 ms]

- Movido por JS, não por CSS: o texto do `<p>` muda de fato.
- **Digita** a cerca de 28 caracteres/s (≈ 35 ms por caractere; 60 caracteres em 2,1 s).
- **Segura** a frase completa por pelo menos 1,4 s.
- **Apaga** mais rápido, cerca de 60 caracteres em 1,0 a 1,4 s.
- Pausa curta, abaixo de 350 ms, com o campo vazio, e passa para a frase seguinte. Observei 4 frases de pedido de vaga em rotação.

**Reduced-motion [medido]:** o cursor faz um único pulso e para, e o brilho de vidro para. **A digitação continua:** em 8 amostras sob `reduce` o texto seguiu sendo digitado. É a única animação da página que ignora a preferência do usuário.

### O que falta no nosso `.composer` para cobrir esse uso

O nosso `components/composer.css` é um **composer funcional** (textarea que cresce, `:focus-within`, ferramentas só com ícone de 36 px, envio redondo de 44 px). A peça da Talio é uma **vitrine**. Para atender os dois usos:

| Peça | Nosso composer hoje | O que propor |
|---|---|---|
| Barra de título de janela com semáforo | não tem | `.composer-titlebar` (pontos decorativos `aria-hidden`, título, ação à direita). Pode reaproveitar a barra de `.app-frame` (seção 5) |
| Avatar do assistente | não tem | slot `.composer-avatar` que recebe `.brand-orb--md` |
| Chips de sugestão com rótulo | só `.composer-tool` com ícone | `.composer-chips` + `.composer-chip` como `<button>` de verdade, com rótulo e ícone em círculo, altura mínima de 32 px (até 44 em `pointer: coarse`), rolando na horizontal como `.composer-tools` |
| Envio com rótulo | só ícone de 44 px | `.composer-send--label` (pílula com texto + ícone); o estado desabilitado continua sendo `:disabled` real |
| Superfície de vidro + contorno + halo | borda simples `--border-subtle` | modificador `.composer--assistant` com `--glass-standard-*`, contorno em gradiente e `--shadow-glow` |
| Texto digitado de demonstração | não tem (e não deve ter no produto) | `.composer-typewriter`, só para landing, desligado por `prefers-reduced-motion` (mostrar a primeira frase inteira, parada) e com `aria-hidden` no texto animado + um `.sr-only` estático |

A política de "Enter envia" segue fora do DS, como já diz `conversation.md`.

### Mapa contra o DS

**Parcial.** A estrutura básica existe, mas faltam titlebar, avatar, chips rotulados, envio com rótulo e a pele "assistant". Nome proposto: `.composer.composer--assistant`. No Electia: avatar com orb roxo, chips com ícone em `--purple` a 15 % e envio roxo. No Xscore: avatar roxo (IA) e envio ouro (ação).

### Acessibilidade

| Par | Contraste | Veredito |
|---|---|---|
| Título `#515767` / `#FFF` | 7,22:1 | AAA |
| Frase (≈ `#434343`) / `#FFF` | 9,91:1 | AAA |
| Chips `#515767` / branco | 7,22:1 | AAA |
| **"Enviar" `#1C2130` / `#67727E`** (12 px/600) | **3,27:1** | **Falha AA** |

- O "Enviar" **não é um botão desabilitado**: é um `<span>` sem `disabled` nem `aria-disabled`, com opacidade 1. Ele parece ativo e falha em contraste. Na nossa versão, `:disabled` mantém `opacity: .5` e o rótulo precisa de 4,5:1 no estado ativo. Desabilitado fica isento, mas deve continuar legível.
- Os chips não são alvos (`tabindex=-1`); todo o cartão é um único link com foco de 2 px no acento **[medido]**. Isso é aceitável para uma maquete, mas não para um composer real.
- Texto que muda sozinho sem pausa conflita com WCAG 2.2.2 se durar mais de 5 s e estiver ao lado de conteúdo: na Talio ele roda indefinidamente e ignora `reduce`.

---

## 5. Moldura de demo de produto (app escuro embutido)

Recortes: `demo-moldura-1440.png`, `demo-barra-janela-1440.png`, `demo-sidebar-1440.png`, `demo-kpi-tiles-1440.png`, `demo-card-vaga-chips-1440.png`, `demo-card-assistente-1440.png`, `demo-precisa-atencao-1440.png`, `demo-tela-vaga-1440.png` (uma tela adicional: a vaga aberta em kanban).

### Anatomia

**Moldura** (escopo `.dark` dentro da página clara) → **barra de janela** (3 pontos · pílula de URL em mono · chip "Tour guiada") → **corpo** em duas colunas: **sidebar** (rótulo de seção + 9 itens com ícone) e **área principal** (eyebrow, saudação, data → 4 KPI tiles → card "Minhas Vagas" com 3 linhas de vaga e chips de etapa → coluna com card do Assistente e lista "Precisa de atenção").

Abaixo de 768 px a moldura **some** e no lugar entra um card claro ("Demonstração completa da plataforma", 343 × 170 px) com botão "Abrir demonstração em tela cheia" **[medido]**.

### Medidas [medido, 1440]

| Parte | Valor |
|---|---|
| Moldura | 1152 × 564 px, raio 16, borda 1 px `#2D3449/.7`, fundo `#141824`, sombra escura `0 24px 70px -24px rgba(0,0,0,.7)` |
| Barra de janela | 43,5 px, padding 8/12, fundo `#141824/.6`, borda inferior; pontos de 10 px **apagados** (vermelho .4, acento .5, verde .5) |
| Pílula de URL | JetBrains Mono 11 px, padding 4/12, raio 6, fundo `#1A1F2D/.6`, borda `#2D3449/.5`, texto `#A0A5B1` |
| Tour guiada | pílula de 99 × 26,5 px, 11 px/600, acento/.1 + borda acento/.4, ícone de play |
| Sidebar | 208 px, fundo `#141824/.4`, borda direita; rótulo "EMPRESA" 10,5 px, caixa alta, tracking 0,24 em (2,52 px); itens 11 px/500, 33 px de altura, raio 6 |
| Item ativo | texto acento `#758CD1` + `ring 1px` acento/.3. O fundo declarado (acento/12) **resolve transparente** |
| KPI tile | 221,5 × 87 px, raio 8, borda `#2D3449/.7`, fundo `#1A1F2D/.7`, padding 12; rótulo 11 px caixa alta (tracking .33 px); número em **JetBrains Mono 20/28 px 600**; legenda com cerca de 10 px. Grade de 4 colunas (≥ lg) e 2 abaixo, gap 8 |
| Linha de vaga | `<button>` de 498 × 80 px, raio 6, fundo `#141824/.4`, padding 8/12; título 12 px/500; meta "Comercial · Remoto · PJ · Aberta" 10 px; contagem em mono 11 px no acento + seta ↗ |
| Chip de etapa | 21,8 px de altura, raio 4, padding 2/6, 10,5 px; rótulo + **contagem em mono semibold** |
| Card do Assistente | borda acento/.3, fundo acento/.07, raio 8, padding 12; ícone de mensagem 14 px; título 12/600; texto 11 px; link "Abrir Assistente" 11 px no acento |
| Precisa de atenção | card com rótulo em caixa alta; `<ul>` de 3 itens, cada um com triângulo de alerta 14 px em `#F6AF23` + frase + nome da vaga |

### Chips de etapa do funil [medido]

| Etapa | Texto | Borda | Fundo | Contraste |
|---|---|---|---|---|
| Selecionados | `#A0A5B1` | `#2D3449` | `#222839` (preenchido) | 5,95:1 |
| Em contato | `#758CD1` | `#758CD1/.3` | transparente | 5,28:1 |
| Entrevista | `#758CD1` | `#758CD1/.3` | transparente | 5,28:1 |
| Proposta | `#F6AF23` | `#F6AF23/.3` | transparente | 9,10:1 |
| Contratado | `#4ABF89` | `#4ABF89/.3` | transparente | 7,48:1 |

**Dois problemas de sistema [medido]:**

1. **"Em contato" e "Entrevista" ficam com a mesma cor** no escuro, porque no tema `.dark` as variáveis `--primary` e `--accent` valem ambas `225 50% 64%`. Duas etapas vizinhas do funil ficam indistinguíveis, a não ser pelo texto.
2. O fundo tonal declarado (`bg-*/12`) **resolve transparente** em 4 dos 5 chips e no item ativo da sidebar: só "Selecionados" tem preenchimento. O chip vira um contorno colorido, e a intenção de fundo tonal se perde.

### Tela adicional — vaga aberta [medido]

Ao clicar numa vaga, surgem componentes novos: botão de voltar compacto, título com ícone e badge de status "ABERTA" (9 px, caixa alta, sucesso/.1), uma **barra de 7 abas com ícone** (Pipeline Kanban, Detalhes, Candidatos, Adicionar, Divulgação, Descartados, Etapas) e uma ação "Mineração de candidatos" com tag "Beta". Em seguida vem um **kanban de 5 colunas** (mínimo de 144 px, rolagem horizontal com `min-width: 740px`), em que cada cabeçalho repete o chip de etapa e a contagem em mono; os cards são raio 6 com borda que acende no hover, e uma coluna vazia mostra "vazio" com borda tracejada.

### Mapa contra o DS

| Peça | Existe? | Proposta |
|---|---|---|
| Moldura + barra de janela + URL | **Não** | `.app-frame` com `.app-frame-bar` (`.app-frame-dots` `aria-hidden`, `.app-frame-url` em `--font-mono`, slot de ação) e `.app-frame-body`. Serve também de titlebar para o composer (seção 4) |
| Sidebar interna | **Parcial**: `.sidebar` e `.sidebar-section-label` existem, mas fixas em `100vh` | `.app-frame .sidebar` como variante embutida (`position: static`, `height: auto`). Item ativo com fundo tonal **real** + `aria-current="page"` |
| Layout duas colunas | **Parcial**: `.split-pane` cobre, mas traz alça de redimensionamento | usar o grid de `.split-pane` sem a alça, ou um grid simples dentro de `.app-frame-body` |
| KPI tile | **Parcial**: `.dl-statcard` tem rótulo em caixa alta, valor e rodapé, mas com `--text-3xl`, `min-height` e elevação | modificador `.dl-statcard--compact`: padding `--space-3`, valor em `--font-mono` e `--text-xl`, sem elevação. Prefiro isso a criar `.kpi-tile` |
| Chip de etapa | **Parcial**: `.pipeline-stage-*` já define a cor por etapa (só no ponto da coluna do kanban); `.tag` e `.dl-status` são pílulas | `.stage-chip` + `.stage-chip-count` (mono), com cores vindas das mesmas variáveis de `.pipeline-stage-*`: **uma cor por etapa, nenhuma repetida**, fundo tonal de 10 a 12 % e forma ou ícone além da cor |
| Linha de vaga | **Parcial**: `.list-item` (título, meta, contagem) | `.list-item` + uma linha de `.stage-chip` no rodapé |
| Card do Assistente | **Parcial**: `.card-accent` | `.card-accent` + `.brand-orb--sm` no lugar do ícone |
| Lista "Precisa de atenção" | **Não** como padrão | `.attention-list` (ícone de status + frase + contexto), usando `--color-warning` |
| Kanban da vaga | **Sim**: `.kanban.pipeline` (composite.md) | reaproveitar e trocar o ponto da coluna pelo `.stage-chip` |

**Electia:** moldura grafite `#0B0E14`, ativo roxo. As etapas usam a escala semântica (info / warning / success / error), o roxo fica para "selecionado/ativo", e o cinza só para o neutro. Atenção a `--text-muted` `#6E7681` sobre `#0B0E14`: dá 4,20:1, abaixo de AA para os rótulos de 10 a 11 px desta moldura. Use `--text-secondary` `#8B949E` (6,28:1). **Xscore:** idem, com o ativo em ouro.

### Acessibilidade

| Par | Contraste | Veredito |
|---|---|---|
| URL `#A0A5B1` / `#181C29` | 6,87:1 | AA |
| Tour guiada `#E7EBEF` / `#1E2435` | 12,95:1 | AAA |
| Rótulo de seção `#A0A5B1` / `#141824` | 7,18:1 | AAA |
| Item ativo `#758CD1` / `#141824` | 5,42:1 | AA |
| KPI rótulo e legenda `#A0A5B1` / `#181D2A` | 6,82:1 | AA |
| KPI número `#E7EBEF` / `#181D2A` | 14,04:1 | AAA |
| Card do Assistente: texto `#A0A5B1` / `#1B2030` | 6,56:1 | AA |
| Card do Assistente: link `#758CD1` / `#1B2030` | 4,96:1 | AA |
| Atenção: frase `#E7EBEF` / `#181C29` | 14,15:1 | AAA |
| Chips de etapa | 5,28 a 9,10:1 (tabela acima) | AA, mas em 10,5 px |

- Foco no demo: `outline: 2px solid #758CD1` nos itens e no tour **[medido]**.
- Item ativo **sem `aria-current`** **[medido]**: o estado é só visual.
- Alvos: os itens da sidebar (33 px), o tour (26,5 px) e o link do Assistente (17 px de altura) ficam abaixo de 44, e o link fica abaixo até dos 24 px do AA 2.5.8. É aceitável numa demo; não deve ser herdado pelo produto.
- Etapas diferenciadas só por cor e texto, com duas cores iguais: na nossa versão, a etapa precisa ser distinguível sem a cor (ícone ou forma) e nenhuma cor pode se repetir.

---

## Divergências frente à ficha de 29/09

| Ponto | 29/09 | 05/10 |
|---|---|---|
| Assets | `index-BdfkPj_c.css` / `index-BZliwA0B.js` | `index-D-bWN8Ja.css` / `index-CUp17HPN.js`, ambos com hashes novos (tabela de proveniência) |
| Navegação | "barra horizontal contida, 56 px" | pílula **flutuante** sticky, recuada 16 px (12 no móvel), raio 16, blur 24, sombra luxe. A altura de 56 px confere. Não dá para saber se a forma mudou ou se não foi descrita antes |
| Duração do CTA | 180 ms | a classe ainda declara 180 ms, mas o **computado é 150 ms** nos botões da navbar e do CTA final |
| Raio do CTA | 8 px | 8 px no CTA final; **6 px** nos botões da navbar (36 px de altura) |
| Canvas | zero | continua zero: o orb é CSS puro com `@property`, não WebGL |
| Componentes não registrados | — | barra de CTA inferior móvel (a partir de 900 px de rolagem), modal de lead disparado por rolagem e gaveta mobile com seções |

Paleta, tipografia e ordem de seções não foram remedidas; as variáveis de cor do CSS novo continuam iguais às do snapshot.

---

## Priorização

| # | Componente | Veredito | Esforço | Por quê |
|---|---|---|---|---|
| 1 | `.stage-chip` + `.stage-chip-count` | parcial (cores de `.pipeline-stage-*` já existem) | **P** | Uso direto em IMO e Electia (funil de vagas). A Talio mostra o erro a evitar: etapas com a mesma cor |
| 2 | `.header-float` / `.navbar-float` | parcial (`.header`) | **P** | Só tokens e posição. Na gaveta mobile, reaproveitar `.sidebar-overlay` para ganhar `aria-expanded` |
| 3 | `.dl-statcard--compact` | parcial | **P** | Modificador; serve à moldura e a dashboards densos |
| 4 | `.brand-orb` | novo | **M** | Assinatura de "IA" que atravessa Electia e Xscore; depende da decisão de marca abaixo |
| 5 | `.composer--assistant` (titlebar, avatar, chips, envio com rótulo) | parcial | **M** | Estende o composer real; a vitrine com digitação entra como `.composer-typewriter`, só para landing |
| 6 | `.cta-panel` + `.btn-sheen` | novo | **M** | Fechamento de landing; o reflexo de uma passada é barato e não cansa |
| 7 | `.app-frame` (+ `.attention-list`) | novo | **M** | Moldura de demo para landing. Kanban e list-item já existem; o trabalho é a casca |
| — | `.cta-dock` (barra inferior móvel) | novo | **P** | Opcional; só se o Marcos quiser CTA persistente no móvel |

Ordem sugerida: 1 → 2 → 3 numa leva só (as três são P e não pedem decisão de marca). Depois 4, que destrava 5 e 6, e por último 7.

## Decisões abertas do Marcos

1. **Orb como assinatura de IA.** Ele vira o avatar padrão do assistente em todas as marcas? A cor proposta é roxa no Electia e roxa (IA, não ouro) no Xscore. Ou cada produto escolhe a sua?
2. **Movimento contínuo em botões.** Aceitar a deriva de luz em loop infinito nos CTAs (Talio) ou limitar a hover + reflexo de uma passada? A recomendação é limitar e deixar o loop só no orb.
3. **Navbar ao rolar.** Manter estática como a Talio, ou ganhar elevação ou opacidade maior depois do primeiro scroll (`[data-scrolled]`)?
4. **Barra de CTA fixa no móvel.** Adotar? Se sim, aparecer quando o CTA do hero sair da tela, não em pixel fixo.
5. **Composer com digitação automática** só em landing e sempre parado sob reduced-motion: confirma que isso nunca entra no produto?
6. **Nomes das etapas do funil.** Manter os do DS (Triagem, Entrevista, Oferta, Contratado, Rejeitado) ou alinhar a outro vocabulário de produto? Isso define quantas cores o `.stage-chip` precisa.
7. **Escopo de destino.** Esses componentes vão para `components/` como base comum, ou primeiro para um protótipo de landing Electia (como sugeriu a ficha de 29/09)?

A ficha não altera `components/`, `tokens/`, `brands/`, `dist/` nem `package.json`.
