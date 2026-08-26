# Changelog — ResultX Design System

Todas as mudanças notáveis neste design system são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

## [2.6.0] - 2026-08-26

### Added — a marca do Xscore ganhou arquivo

`brands/xscore/assets/logo/` passa a ter monograma, wordmark em claro e escuro,
favicon e os PNG de 16, 32, 180 e 512. Antes existiam só dois arquivos de token
sob `brands/xscore` — o produto não tinha um arquivo de marca para entregar a
ninguém, e isso segurava um acordo comercial inteiro fora deste repo. O
monograma deriva do X da marca-mãe, não é desenho novo.

### Fixed — o CI voltou a passar: Node 22 e `engines` declarado

O `npm run build` falhava com `TypeError: trustedFunctions.difference is not a
function`, e a causa não era a PR de dependência que tornou a falha visível. O
`cssnano` exige `node ^22.11 || ^24.11 || >=26` — **nas duas versões**, a que
estava instalada e a proposta — e os três workflows rodavam em **Node 20**. O CI
já estava fora do engine suportado havia tempo, emitindo apenas
`npm warn EBADENGINE`; a versão nova passou a usar `Set.prototype.difference`,
ausente no Node 20, e o aviso virou erro.

`ci.yml`, `npm-publish.yml` e `pages.yml` foram para Node 22 — inclusive o de
Pages, que também estava em 20 e publica o site do DS. O `package.json` passou a
declarar `engines.node: ">=22.11"`, que é o que evita a reincidência: a próxima
divergência falha no `install` nomeando a versão exigida, em vez de reaparecer
como erro obscuro dentro do build.

### Changed — `dist/` regenerado com o cssnano 8.0.7

Terceira vez que bumpar dependência de build muda a saída minificada, e a
primeira em que o `CONTRIBUTING.md` §Release já avisava. O `prepare` deste
pacote é apenas `husky`: quem instala por `github:…#tag` recebe o `dist/`
commitado, não um rebuild. `dist/` defasado significa consumidor servindo CSS
que o próprio `npm run build` não reproduz mais.

Equivalência verificada pelo método da receita — mapa
`(contexto @, seletor, propriedade) → último valor` nas duas versões:

| Arquivo | Pares | Sumiram | Surgiram | Valor mudou | Bytes |
|---|---|---|---|---|---|
| `tokens.min.css` | 780 | 0 | 0 | 0 | 24.704 → 23.906 |
| `components.min.css` | 2.667 | 2 | 2 | 0 | 75.144 → 75.035 |

As duas diferenças em `components.min.css` são reescrita de atalho para
propriedade longa, equivalentes porque o `border` anterior já define largura e
estilo dos quatro lados: `border-right:2px solid transparent` virou
`border-right-color:transparent` em `.btn-loading:after`, e o mesmo com
`border-top` em `.tooltip:after`. **Nenhum valor de token mudou.**

O ganho de tamanho vem de uma otimização nova da 8.0.7: extrair declarações
idênticas de seletores irmãos para uma regra compartilhada, como
`[data-theme=sober-dark],[data-theme=vibrant-dark]{…}`.

### Changed — dependências de desenvolvimento

`@commitlint/cli` 21.2.1 → 21.2.2, `@commitlint/config-conventional`
21.2.0 → 21.2.2 e `cssnano` 8.0.4 → 8.0.7. Só devDependencies; nenhuma
dependência de runtime.

### Removed — `commit-and-tag-version` saiu do repo

A ferramenta foi **descartada na v2.3.0** e mesmo assim seguiu instalada por duas
versões, com três scripts vivos (`release`, `release:minor`, `release:major`).
Regra que existe só na cabeça de quem decidiu não é regra: bastava alguém rodar
`npm run release` para o CHANGELOG escrito à mão virar lista seca com links de
issue falsos (`closes #0B0E14`, `#c4993`…).

Removidos: a devDependency, os 3 scripts e o `.versionrc.json`. Aproveitando,
saíram duas entradas mortas do `.npmignore` — `.versionrc.json` e
`docs-viewer.html`, este último renomeado em `2affe96`, o mesmo commit que
derrubou o site por três meses.

🟢 **A receita de release agora está escrita** em `CONTRIBUTING.md` §Release —
antes não existia em lugar nenhum do repo, só em memória. Inclui os 5 passos, o
critério de major × minor × patch e o alerta sobre bump de dependência de build
mudar o `dist/` em silêncio.

Efeito colateral: encerra a PR #48 do Dependabot e todas as futuras para uma
ferramenta que não deve ser usada.

## [2.5.0] - 2026-08-09

Seis PRs (#42 a #47). O tema da versão não foi planejado: **consertar o deploy do
site acendeu a luz sobre defeitos que estavam no escuro havia meses.**

**Minor, não major — tudo aditivo.** Um token novo (`--transition-interactive`),
nenhuma classe removida, nenhum valor existente alterado. As mudanças de
comportamento visíveis são todas correção de defeito.

### Fixed — O site não publicava havia três meses

O workflow **Deploy to GitHub Pages** falhava em *todo* push para `main` desde
`728bee0` (05/08). Último sucesso: **16/05**.

Passou despercebido por um motivo estrutural: **o job de Pages não bloqueia
merge**. O `CI` de lint-and-build fica verde o tempo todo, e é nele que se olha.

Causa: o commit `2affe96` renomeou `pages/` → `demos/` e `docs-viewer.html` →
`docs/viewer.html`, e **dois** arquivos ficaram para trás.

- **`.github/workflows/pages.yml`** (#42) — `cp: cannot stat 'docs-viewer.html'`.
  Ganhou `set -euo pipefail`: sem isso um caminho que suma derruba o job num `cp`
  solto, sem dizer o que faltou.
- **`docs/viewer.html`** (#43) — os cinco links de template ainda apontavam para
  `pages/`. Só ficou visível **depois** de consertar o deploy: a home subiu com a
  navegação inteira em 404, confirmado ao vivo.

A renomeação estava documentada no `CHANGELOG.md` e no `README.md` desde sempre.
**Renomeação de pasta pede varredura por caminho, não só por nome de classe.**

### Added — Os 11 demos alcançáveis, e uma trava (#44)

Cinco demos existiam em disco sem link nenhum: `electia-copiloto`,
`employer-jobs`, `employer-job-applicants`, `inbox-panel`,
`positioning-wheel-demo`. Trabalho publicado que ninguém encontrava.

A navegação passou a separar **Templates** (telas de produto completas) de
**Component Demos** (os que exercitam uma família a fundo) — onze links achatados
escondiam a diferença.

**Três testes** fecham os dois sentidos da deriva: link que aponta para nada, e
demo que existe e ninguém alcança. Validados por teste negativo.

### Security — Dependabot zerado (#45, #46)

`npm audit` de **9 vulnerabilidades (1 low, 1 moderate, 7 high) para 0**, e zero
alertas abertos.

Resolvidas **num lote**, não em nove merges: sete das nove tocavam
`package-lock.json` e conflitariam entre si a cada merge.

⚠️ **Dimensão real:** `dependencies` está vazio — as 15 são devDependencies, e o
pacote é CSS, docs e JS vanilla sem dependência. **Nada daquilo alcançava
consumidor**; o raio era a máquina de build e o CI.

`actions/checkout` e `actions/setup-node` foram de v6 para v7 nos 4 workflows,
com `node-version: 20` ainda pinado.

🔴 **Bumpar a cadeia de minificação muda o `dist/` em silêncio.** Aconteceu duas
vezes: o cssnano novo parou de ordenar declarações alfabeticamente e, depois,
parou de remover o espaço após vírgula em custom properties. **Receita de
verificação que funcionou:** montar `seletor → propriedade → último valor` nas
duas versões e comparar; depois repetir normalizando só espaço em branco.
**691 regras, 0 divergências reais** nas duas vezes.

### Changed — Nenhum `transition: all` (#47)

As 22 ocorrências restantes eliminadas. `all` varre propriedades que ninguém
pretendia animar — foi assim que `visibility` entrou na transição do
`.sidebar-item` na Onda 3 e o foco passou a falhar em silêncio.

**Novo token `--transition-interactive`**, nomeado por papel (ADR-0001):

```css
--transition-interactive: background-color, border-color, color, box-shadow,
  transform, opacity;
```

Fora da lista de propósito: `outline`/`outline-offset` (o anel de foco tem de
aparecer **na hora**), `cursor`/`pointer-events` (não animáveis),
`font-*`/`padding`/`width` (reflow e tremor).

🔴 **Duas exceções que a lista padrão quebraria:** `.toggle-thumb` anima `left`
(2px → 22px) e `.toggle-track` só `background-color`. Aplicar a lista uniforme
aos 22 teria **matado o toggle em silêncio** — a mesma classe de falha que a
mudança existe para eliminar.

Verificado em Chrome: 22/22 com `transition-property` correto, e as transições
animando de fato (valor intermediário capturado a 60ms). **Modo de falha também
medido:** sem o token, a propriedade cai no valor inicial, que é `all` — o
comportamento anterior, não perda de transição.

Custo: **+186 bytes gzipados** no total.

### Números

**225 testes** (9 suítes), sendo 12 de trava contra `transition: all` e 3 contra
a deriva viewer↔demos. Lint limpo, build determinístico, `npm audit` = 0.
Site no ar: https://carneiromarcos.github.io/resultx-design-system/

## [2.4.0] - 2026-08-08

Fecha a **Onda 3** (itens 4, 5 e 6), ratifica o **ADR-0001** e entrega o **modal
de filtros** extraído de tela real. PRs #38, #39, #40 e #41 — todas por merge
commit, `main` em `77a730e`. **210 testes** (9 suítes), lint limpo, build
determinístico.

**Minor, não major — tudo aditivo.** Nenhuma declaração foi removida e nenhum
valor existente mudou. As três mudanças de comportamento são correções de
defeito, não quebras:

1. `.modal-body` passa a **rolar** onde antes **cortava em silêncio**. Nenhum
   consumidor usa a família `.modal-*`, então o raio é zero hoje.
2. `.modal-close` ganha alvo de 44×44 por pseudo-elemento; a caixa visível segue
   32×32 e **nenhum cabeçalho muda de altura**.
3. `.tag` ganha `gap` — visível apenas em tags que adotem o novo `.tag-dot`.

⚠️ **`commit-and-tag-version` segue DESCARTADO**, pelo mesmo motivo da v2.3.0: no
`--dry-run` ele transforma hexadecimais das mensagens de commit em links de issue
falsos, e substituiria estas seções escritas à mão por uma lista seca de assuntos.
Os scripts `release`, `release:minor` e `release:major` continuam no
`package.json` e **não devem ser usados** enquanto houver hex nas mensagens.

### Fixed — O corpo do modal rolava? Não. Cortava. (lote A)

`.modal` tinha `overflow: hidden` e nenhum teto de altura, e `.modal-body` só
tinha `padding`. Conteúdo mais alto que a viewport era **cortado, sem barra e
sem aviso** — a mesma classe de falha silenciosa das armadilhas de `visibility`
da Onda 3. Sobreviveu despercebido porque **nenhum consumidor usa a família
`.modal-*`** e nenhum demo a exercitava.

- **`.modal` virou coluna flex com `max-height: 100%`.** Cabeçalho e rodapé
  ficam parados (`flex-shrink: 0`) e só o corpo rola.
- **`.modal-overlay` ganhou `padding: var(--space-4)`** — é ele que vira o teto:
  o `max-height` do modal resolve contra a caixa de conteúdo do overlay. Modais
  curtos não se movem; a centralização flex os mantém onde estavam.
- **`.modal-body`: `overflow-y: auto` + `min-height: 0` + `overscroll-behavior:
  contain`.** O `min-height: 0` não é enfeite — sem ele o item de flex não
  encolhe abaixo do min-content e o corpo empurra o modal para fora do teto em
  vez de rolar. Mesma lição do `.main` na Onda 1.
- **`.scroll-slim`** — o DS **não tinha estilo de scrollbar nenhum**. Cada
  navegador desenhava a sua, larga e fora da paleta, dentro de superfícies
  escuras. `scrollbar-*` para Firefox e Chromium recente, `::-webkit-scrollbar`
  para Safari e Chromium antigo; onde nenhum vale, a barra nativa aparece e a
  rolagem funciona igual. `.modal-body` já nasce com ela.
- **`.modal-close`: alvo de 44×44, caixa visível ainda 32×32.** O DS fixou 44
  para `.btn-icon` na Onda 2 e este botão ficou fora — 32×32 **passa** na WCAG
  2.2 AA (SC 2.5.8 pede 24×24), mas eram duas réguas para o mesmo gesto. O alvo
  cresce por `::after { inset: -6px }`, então nenhum cabeçalho muda de altura.
- **`.modal-close` deixou de usar `transition: all`.** Restam 22 ocorrências de
  `all` em `components/` — nenhuma convive mais com `visibility`, então é dívida
  de higiene, não falha ativa. Registrada, não corrigida aqui.

### Added — `.form-select` fecha a tríade de campos (lote B)

Havia `.form-input` e `.form-textarea` e nenhum campo de escolha: exatamente a
lacuna que a textarea preencheu na Onda 2, um nível adiante.

- **`.form-select`** — `<select>` **nativo**. O elemento nativo entrega teclado,
  busca por digitação, o seletor do sistema no celular e o anúncio correto no
  leitor de tela; é o mesmo motivo pelo qual o `.segmented` usa rádio nativo em
  vez de imitar um.
- **`.form-select-wrap`** — existe por uma razão só: `<select>` não aceita
  pseudo-elemento, então o chevron precisa de um pai. **Desenhado com bordas,
  não com SVG:** um `data:` URI traria o hex por dentro e mentiria no tema claro.
  `pointer-events: none` para o clique atravessar — sem isso o canto direito do
  campo vira área morta.
- **`.form-label-eyebrow`** — rótulo de **grupo de controles**, onde
  `.form-label` leria como legenda de campo. Compartilha uma regra só com
  `.segmented-legend`: o painel precisa do mesmo rótulo sobre um grupo de rádio
  e sobre um select, mas o elemento certo difere (`<legend>` × `<label>`).
- ⚠️ **Correção a esta própria entrada:** afirmei que a `.form-textarea` "nunca
  havia sido documentada" e acrescentei uma seção para ela. **Era falso** — o
  `forms.md` já tinha uma seção `## Textarea`, mais completa que a minha. Meu
  `grep` de títulos estava truncado e eu concluí de uma visão parcial. A
  duplicata foi removida logo em seguida e os dois valores que ela tinha a mais
  (`padding`, `line-height`) foram dobrados na seção original. Terceira vez que
  a falta de varredura completa gera duplicata no repo, depois de `.btn-icon`
  (Onda 2) e `.layout-list-item` (Onda 3) — desta vez em documentação.

### Added — Chips que quebram linha e o dot da tag (lote C)

- **`.segmented-chips`** — a barra base usa `grid-auto-columns: 1fr`, que dá a
  todas as opções a mesma largura numa linha só. Certo para "Dia / Semana / Mês",
  inviável para rótulos de comprimentos muito diferentes. A variante troca **só a
  caixa e a moldura**: o rádio nativo, os estados por `:has()`, o alvo de 44px e
  o anel de foco continuam sendo os da barra. Um teste garante que existe
  **exatamente um** bloco `:has(input[type="radio"]:checked)` no arquivo — um
  segundo seria a duplicata já paga com `.btn-icon` e `.layout-list-item`.
- **`.tag-dot`** — o comentário no CSS dizia "sem dot" literalmente. A cor vem
  **por dado**, não de paleta: uma lista de etiquetas do usuário guarda a cor por
  registro. O consumidor define `--tag-dot-color` no ponto de uso; o padrão é
  `currentColor`, então sem nada definido o dot acompanha o texto e nunca some.

### Verificado em navegador real

`demos/filtros.html` (novo) exercita o modal aberto. Medido em Chrome a 1280×900
e 390×740, nos quatro escopos de tema (`data-theme` × `prefers-color-scheme`):

| | 1280×900 | 390×740 |
|---|---|---|
| corpo rola | 716 de 720px | 552 de 858px, rolou 306px |
| cabeçalho/rodapé parados | sim | sim |
| overflow horizontal | 0 | 0 |
| alvo do fechar | 44×44 (visível 32×32) | idem |

Zero erro de console. **210 testes** (9 suítes), 21 novos.

⚠️ Uma medição intermediária pareceu mostrar os chips presos no tema escuro sob
`data-theme="light"`. Era artefato da sonda: `.segmented-option` transiciona
`background`, e a leitura pegava o valor de origem da transição. Aos 600ms, e com
o tema aplicado antes do primeiro paint, os tokens resolvem corretos. **Não havia
defeito** — fica registrado para não virar folclore.

### Added — Docs de toast, empty-state e tooltip (Onda 3, item 4)

Três componentes vivos no CSS e sem arquivo de documentação nenhum: existiam só
como uma linha na tabela do `api-reference.md`. Agora têm anatomia, markup,
tokens e acessibilidade, e a tabela mestra passou a linkar para eles.

- **`docs/components/toast.md`** — inclui por que `.toast[hidden]` precisa
  existir (`.toast` define `display: flex`, que vence o `[hidden]` padrão do
  navegador — sem a regra, esconder um toast não faz nada) e o alerta da
  WCAG 2.2 SC 2.2.1 sobre toast que some sozinho.
- **`docs/components/empty-state.md`** — a distinção que importa: o `.empty-state`
  cheio **não cabe** num slot (ícone de 80px + `--space-16` estoura coluna de
  kanban e painel lateral), e é para isso que existe o `-inline`.
- **`docs/components/tooltip.md`** — posições, e por que o tooltip nunca é o
  nome acessível do gatilho.

### Fixed — `.tooltip-wrapper` parou de impor layout (item 5)

- **Deixou de declarar `display: inline-block`.** Ele desmontava o flex de
  qualquer gatilho que já tivesse layout próprio — um item de rail, por exemplo.
  O `demos/electia-copiloto.html` carregava o contorno disso
  (`.sidebar-item.tooltip-wrapper { display: flex }`); saiu. Quem dependia do
  comportamento antigo usa **`.tooltip-wrapper-inline`**.
- 🔴 **O tooltip agora aparece no foco por teclado**, não só no hover. Sem
  `:focus-within` ele nunca aparecia para quem navega por teclado — **o mesmo
  defeito que faz a documentação desaconselhar o atributo `title`**. A
  recomendação do `navigation.md` só passou a ser verdadeira com esta linha.

### Fixed — Tabela larga rola em vez de sumir (item 6)

- **`.table-card`** trocou `overflow: hidden` por `overflow-x: auto` +
  `overflow-y: hidden`. Com `hidden`, as colunas da direita ficavam
  **inalcançáveis** em tela estreita: sem barra e sem gesto de swipe.
  `overflow-y` segue `hidden` para preservar o clip do border-radius.
- **`.table-wrap`**, novo — envolve só a `<table>`, para o cabeçalho ficar parado
  enquanto as colunas rolam. O scroll no `.table-card` é a rede de segurança
  para markup que não usa o wrapper.
- Mesmo raciocínio que a camada `.dl-` já aplicava em `.dl-table-wrap`.

Medido em Chrome: item de rail mantendo `flex` sem o contorno; tooltip indo de
opacidade 0 para 1 no Tab; tabela de 552px dentro de um cartão de 446px a 480px
de viewport, com o conteúdo alcançável. **189 testes.**

⚠️ **Achado não corrigido, fora do escopo destes itens:** `.header-actions`
(`display: flex`, sem `wrap` nem `min-width`) estoura a largura do documento em
viewport de 480px. É **preexistente** — meu diff não toca a classe. Vale um item
próprio.

## [2.3.0] - 2026-08-07

Nove componentes extraídos de telas reais de inbox, a camada de comportamento aberta, os três modos
de navegação completos e a ponte de marca com tinta medida por contraste. PR #36, merge commit
`638b57c`, 173 testes.

**Aditiva — nada foi removido.** `.layout-list-item` continua existindo como alias depreciado, e
`--accent-primary-text` nasce com o mesmo valor de `--accent-primary`: quem não sobrescreve nada vê
o comportamento de antes.

⚠️ **Três mudanças visuais que pedem conferência ao subir:**
1. `.sidebar-item` deixou de transicionar `all` e passou a transicionar só `color` e `background` —
   corrige o foco preso no modo overlay, mas tira a animação de propriedades que ninguém pretendia
   animar.
2. `.layout-list-item` herdou a densidade do `.list-item`: padding menor, alinhamento ao topo, e o
   trilho de selecionado deixou de deslocar o conteúdo.
3. Os 27 usos de `--accent-primary` como cor de texto em `components/` passaram a
   `--accent-primary-text`. Sem override, o valor é idêntico.

### Added — Modo overlay: os 3 modos de navegação, completos

- **`.sidebar-overlay`** — terceiro e último modo. O que o define: **o conteúdo
  não se move.** Rail e panel tomam espaço da página; o overlay passa por cima e
  devolve o espaço ao fechar.
- 🔴 **Corrige um defeito antigo:** abaixo de 1024px o `.sidebar` fazia
  `display: none` **sem substituto** — a navegação inteira sumia da tela pequena.
  Agora a regra é `.sidebar:not(.sidebar-overlay)`.
- **`.sidebar-rail` + `.sidebar-overlay` compõem** o caso que a maioria dos
  produtos quer: rail no desktop, gaveta abaixo de 1024px, **um elemento só**,
  sem duplicar a navegação no HTML.
- **`.sidebar-scrim`** — não é o `.modal-overlay`, que vive em `--z-modal` e
  centraliza o filho. Este só escurece, uma camada abaixo do painel.
- **`dist/sidebar-overlay.js`**, exposto como `resultx-design-system/sidebar-overlay`.
  É painel modal e se comporta como um: foco entra ao abrir e **volta ao gatilho**
  ao fechar, Tab preso dentro, Escape fecha, clique no scrim fecha, rolagem
  travada e **restaurada** (não zerada). O gatilho nasce `hidden` e o script o
  revela — botão que não faz nada é pior que botão nenhum.
  `data-sidebar-media` fecha o painel quando a consulta deixa de casar.

### Fixed — Dois defeitos que o overlay revelou

- 🔴 **`.sidebar-item` transicionava `all`**, o que inclui `visibility` — herdada
  do sidebar. O link reportava `visibility: hidden` no instante exato em que o
  script chamava `.focus()`, e **focar elemento invisível falha em silêncio**:
  o foco ficava preso no botão que abriu o painel. Um item de navegação só
  precisa animar cor e fundo, e agora é o que ele declara.
- 🔴 **`visibility` precisa virar na hora ao abrir e esperar ao fechar.**
  Transicioná-la nos dois sentidos reproduz a mesma falha silenciosa. O padrão é
  `visibility 0s linear var(--transition-slow)` fechado e `visibility 0s` aberto.

Verificado em Chrome: foco entra no painel ao abrir; **12 Tabs e 6 Shift+Tabs,
zero escapes**; Escape devolve o foco ao gatilho e `aria-expanded` acompanha;
clique no scrim fecha; `body.overflow` travado e restaurado ao valor anterior;
a 1440px o rail volta com 64px de largura e 64px de deslocamento; overlay aberto
não sobrevive a janela crescer; zero overflow horizontal em 390/768/1440px; zero
erro de console. **173 testes.**

### Added — Superfície de conversa e segundo modo de navegação

Fecha os nove componentes extraídos das telas de inbox.

- **`.message`** — bolha, marco de dia (`.message-day`) e evento de sistema
  (`.message-event`). **Evento não é mensagem:** não tem autor, não tem recibo e
  não deve ser lido como fala — por isso é `<p>` e a mensagem é `<article>`. A
  bolha para em `min(60ch, 78%)`: medida de leitura, não largura de coluna. O
  recibo difere primeiro na **forma** (um tique × dois) e só depois na cor
- **`.audio-player`** — reprodutor com forma de onda, **partindo de um
  `<audio controls>` nativo**. Sem JavaScript o usuário vê o player do navegador
  e ouve o áudio; um player que exige script para tocar troca uma mensagem de voz
  por nada. A onda é um `slider`: setas ±5s, Home/End, Espaço alterna, e
  `aria-valuetext` anuncia "0:02 de 0:04". Dois áudios não tocam ao mesmo tempo.
  As alturas vêm de `--level` — o DS desenha a onda, não a inventa
- **`.composer`** — barra de composição com campo que cresce. Usa
  `field-sizing: content` onde existe, e `dist/composer.js` só cobre o resto —
  onde o nativo existe, o script não anexa nada. **Enter-para-enviar, `/` e `@`
  ficaram de fora de propósito:** é política de produto, não do sistema visual, e
  um teste reprova se um `keydown` aparecer no script
- **`.sidebar-rail`** — segundo modo de navegação, estendendo o `.sidebar` em vez
  de criar um `.nav-rail` paralelo. Passa a usar `--sidebar-collapsed`, que vivia
  **declarado e órfão**. Largura da navegação e deslocamento do conteúdo
  (`.main-rail`) saem do **mesmo token**. O rótulo (`.sidebar-label`, novo) sai da
  vista **sem sair da árvore de acessibilidade** — `display: none` deixaria o item
  como ícone sem nome
- **`dist/audio-player.js`** e **`dist/composer.js`**, expostos como
  `resultx-design-system/audio-player` e `/composer`. Nenhum dos dois persiste
  nada
- **`docs/components/conversation.md`** e a seção de rail em `navigation.md`;
  `docs/api-reference.md` atualizado — a linha do `.sidebar` dizia "240px" e
  passou a haver dois modos

Verificado em Chrome real: rail de 64px com o conteúdo deslocado exatamente 64px
e o nome acessível preservado (`link "Atendimento"`, rótulo com 1px de largura);
player trocando o `<audio controls>` pela interface própria, com 15 barras de
alturas proporcionais; bolhas a 16px do lado correto de cada tipo; composer de
36px → 75px → 117px (teto) → 36px; zero overflow horizontal em 1500 / 1024 / 768
/ 390px; zero erro de console.

**Um defeito que o próprio demo revelou:** o DS torna `body` um flex container, e
o contêiner improvisado do demo, sem `flex`/`min-width: 0`, encolheu até o
conteúdo — a coluna de conversa ficou em 265px de 1436 disponíveis. É o mesmo
defeito que a Onda 1 corrigiu no `.main`. O demo passou a usar `.main .main-rail`
em vez de improvisar, e a documentação do rail registra o par.

### Added — Segmented control e item de lista

- **`.segmented`** — escolher um valor entre poucos, todos visíveis
  ("Humano / Agente / Observar"). **Sem JavaScript:** um grupo de
  `<input type="radio">` nativo já dá setas do teclado, seleção com Espaço, uma
  única parada de Tab, participação em formulário e o anúncio "Humano, botão de
  opção, 1 de 3, selecionado". Um teste reprova o dia em que aparecer um
  `dist/segmented.js`. Não é `.tabs` (que troca de visão) nem `.toggle` (que é
  binário). Estado lido por `:has()`. Variantes `-stacked`, `-sm`, `-lg`,
  `-block`. `docs/components/segmented.md`
- **`.list-item`** — linha de lista com avatar, título, hora, prévia, meta e
  contador de não lidas. Reaproveita a família `.avatar` do próprio DS.
  Truncamento com `min-width: 0` nos quatro níveis da cadeia; a hora não encolhe
  junto. O trilho de selecionado é `box-shadow` interno, não borda —
  deslocamento medido de **0px** ao trocar de seleção. Não lida sinaliza por
  **peso**, não só por cor. `docs/components/list-item.md`
- **`.sr-only`** — utilitário de texto só para leitor de tela, na seção
  ACCESSIBILITY. O repo não tinha nenhum, e o segmented control precisa de
  rótulo de grupo quando o bloco em volta já mostra um título

Verificado em Chrome real: `←` movendo a seleção `observar → agente → humano`
sem script carregado; o grupo consumindo **uma** parada de Tab e a seguinte
saindo dele; árvore ARIA com `group "Modo de atendimento"` e três `radio`; e o
título truncando em 175 de 364px reais numa coluna de 280px, com a hora inteira
preservada. Zero erro de console.

### Changed — `.layout-list-item` consolidado em `.list-item` (dívida fechada)

Eram dois componentes fazendo quase a mesma coisa. Agora há **uma implementação**
e dois vocabulários: os nomes antigos entraram nas mesmas regras como alias.

- **Nada foi removido.** `.layout-list-item` é classe pública e o FinanceX importa
  o bundle inteiro — remover seria quebra de contrato, e quebra pertence a uma
  major. Verificado: nenhum consumidor externo usa a classe (Electia e labs/site
  nem importam `components`).
- **Os nomes antigos herdaram as três correções que não tinham:** o trilho de
  selecionado deixou de deslocar o conteúdo (`border-left: 3px` → `box-shadow`
  interno, deslocamento medido de **0px**), a linha ganhou `min-width: 0`, e
  passou a existir foco visível (3px, medido).
- O bloco saiu de `components/components.css`; a implementação vive em
  `components/list-item.css`. Cada alias está marcado `alias depreciado` para
  sair de uma vez na próxima major.
- Regra de compatibilidade preserva o divisor para markup antigo, que não tem o
  `.list-item-group` em volta.
- `demos/candidatos.html` migrado para o vocabulário novo — 32 ocorrências, mais
  `.active` → `aria-current`. Um teste reprova se o nome antigo voltar a algum demo.
- `docs/components/layout.md` e `docs/api-reference.md` marcam a depreciação com
  tabela de migração. **160 testes.**

### Added — Camada de comportamento + 2 componentes de painel

Extraídos a partir de telas reais de um inbox de atendimento. O DS era CSS puro;
estes dois exigem JavaScript, e a decisão foi abrir a camada de comportamento em
vez de deixar cada produto reimplementar (item 7 da Onda 3, antecipado).

- **`.disclosure`** — módulo recolhível, o padrão dos blocos de um painel de
  contexto. Construído sobre `<details>`/`<summary>`: papel semântico,
  `aria-expanded`, teclado e revelação ao buscar na página vêm do navegador, não
  de código nosso. Cabeçalho de 44px (WCAG 2.2 SC 2.5.8). Fechado mede 46px —
  44 do cabeçalho + 2 de borda, **zero** vão morto. `docs/components/disclosure.md`
- **`.split-pane`** — painel de contexto redimensionável. **A largura vive numa
  variável só**, `--split-pane-width`, e a grade inteira deriva dela: o painel e o
  espaço que ele tira da coluna principal são o mesmo número, não dois para manter
  em sincronia. É o contrato que torna impossível repetir o vão morto de 192px do
  Electia. `docs/components/split-pane.md`
- **`dist/disclosure.js`** e **`dist/split-pane.js`** — vanilla, sem framework, no
  idioma do `theme-toggle.js` já existente. Arraste com pointer capture, teclado
  (← → ±16px, Shift ±64px, Home/End, Enter restaura), limites lidos do CSS,
  persistência em `localStorage` sob `resultx-*`, todo acesso em `try/catch`.
  Expostos como `resultx-design-system/disclosure` e `/split-pane`
- **`demos/inbox-panel.html`** — os componentes funcionando juntos, com a ponte da Electia
- **`tests/disclosure-split-pane.test.js`** — 20 testes de contrato, incluindo um
  que reprova qualquer segundo `setProperty` de largura no script

Verificado em Chrome real: arraste de 320→440px com a coluna principal devolvendo
exatamente o que o painel tomou; teto em 560 e piso em 260; `aria-valuenow`
acompanhando; largura e módulos abertos restaurados após reload; coluna única em
768px sem overflow horizontal; zero erro de console.

### Added — Tokens de layout

- `--panel-width` (320px), `--panel-width-min` (260px), `--panel-width-max` (560px),
  `--split-handle-width` (12px) e `--disclosure-duration` (220ms), no bloco `:root`
  compartilhado. A duração é lida de volta pelo script, para que o CSS e a espera
  não se separem quando uma marca reajustar o token.

### Changed — Composição do bundle de componentes

- `components/components.css` passa a usar `@import url()` para puxar
  `disclosure.css` e `split-pane.css`. O `postcss-import` inlina no build, então
  `dist/components.min.css` segue sendo um arquivo só para o consumidor.

### Added — Ponte de marca (Onda 3, itens 1 e 2)

- **`brands/<marca>/tokens/ds-bridge.css`** para as 5 marcas — a camada que faltava entre o
  arquivo de marca e os tokens semânticos do DS. Antes disso o brand declarava `--purple` /
  `--gold` e não remapeava nada: quem importasse os dois continuava renderizando teal.
  Sobrescreve os **quatro** escopos de tema, inclusive os dois blocos `prefers-color-scheme` —
  sem eles quem não seta `data-theme` seguia no teal. Documentação em `docs/brand-bridge.md`
- **`--accent-primary-text`** em `tokens/tokens.css` — separa o papel de **texto** do papel de
  **preenchimento**. O mesmo dourado `#c4993b` é bom fundo (7,33:1 contra tinta escura) e texto
  ilegível sobre branco (2,64:1); um token só não dava conta dos dois
- **`scripts/lib/contrast.js`** — luminância relativa e razão de contraste WCAG 2.2. O repo não
  tinha nenhuma verificação de contraste
- **`scripts/build-brand-bridges.js`** + `scripts/brand-bridges.config.js` — geram as pontes a
  partir de `brands/<marca>/tokens/tokens.css`, que segue sendo fonte única. A config declara
  *qual token cumpre qual papel*, nunca um valor. `npm run build:bridges`, encadeado em `build:all`
- **`tests/brand-bridge.test.js`** — contraste, cobertura dos 4 escopos, ausência de teal e
  paridade entre o arquivo commitado e o gerador (esquecer o rebuild reprova a suíte)

### Fixed — Contraste do rótulo sobre o accent

- **`--text-inverse` deixa de ser um valor único do DS e passa a ser medido por marca.** O DS fixa
  `#0B0E14`, correto para o teal (10,38:1) e **ilegal para o roxo da Electia: 2,55:1**. A falha é
  bidirecional — nas 4 marcas douradas quem reprova é o branco (2,64:1). Nenhum valor único serve
  às duas famílias, então a tinta é escolhida por medição e o build falha se nenhuma candidata
  alcançar 4,5:1
- **27 usos de `--accent-primary` como cor de texto** em `components/` migraram para
  `--accent-primary-text`. `border-color`, `background` e `accent-color` não foram tocados
- **Hover da Electia** passa de `--purple-light #a55eea` (3,90:1 com rótulo branco, reprova) para
  `--purple-600 #8842d6` (5,53:1), um passo da rampa OKLCH da própria marca

### Changed

- `package.json` — `brands/*/tokens/*.css` entram em `files[]` e ganham os subpaths
  `./brands/*/bridge` e `./brands/*/tokens` em `exports`. **`brands/` não era publicado**:
  `node_modules/resultx-design-system/` não continha a pasta, e uma ponte sem essa correção não
  chegaria a consumidor nenhum

### Fixed — Tinta dourada das 3 marcas (lacuna fechada)

- **Emprega+, PdV e ResultX** ganharam `--emp-gold-ink`, `--gold-ink` e `--rx-gold-ink`. Antes,
  nenhuma tinha variante do dourado aprovada em AA como texto no tema light, e
  `--accent-primary-text` caía em `var(--text-primary)`.
- **O valor veio do Xscore, não de invenção:** `#866425` já existia lá. Como as quatro marcas
  compartilham o mesmo dourado `#c4993b`, o valor é o mesmo. É a **mínima escurecida que passa nas
  duas superfícies** — 5,44:1 no branco e 4,69:1 sobre o fundo de tag `#f2eee4`. Mantém o matiz
  (39° contra 41°), só baixa a luminosidade de 50% para 34%.
- O caso do PdV era o mais instrutivo: `--gold-muted #8B6B2A` passava no branco com 4,96 e reprovava
  na tag com **4,28**. Passar num fundo e falhar no outro não é aprovação.
- **O token existe nos DOIS temas** — `#c4993b` no `:root`, `#866425` no light. Sem a declaração no
  escuro, `var(--*-gold-ink)` ficaria indefinido e quem precisasse de texto dourado cairia de volta
  no `--gold`, que é o bug que o token veio evitar. Mesmo padrão que o Xscore já documentava.
- PdV e ResultX ganharam um bloco `[data-theme="light"]`, que não tinham.
- **Dois testes travam a correção:** nenhuma ponte pode conter `var(--text-primary)` como tinta de
  texto, e o build não pode reportar lacuna alguma. **156 testes.**
- O comentário de `brands/xscore/tokens/tokens.css` afirma que o fill `#c4993b` leva "texto branco
  por cima". Branco sobre `#c4993b` dá **2,64:1** — reprova. O token está certo, a justificativa não

## [2.2.0] - 2026-08-05

Publicada via PR #34, merge commit `728bee0`. **Primeira vez desde abril que `main`, brand
system e linha de release estão no mesmo lugar** — e a primeira em que as quatro tags
(`v2.1.0`, `v2.1.1`, `v2.1.2`, `v2.2.0`) apontam para commits alcançáveis a partir da `main`.
A `v2.1.2` era órfã: fora cortada de uma branch de correção que não estava em lugar nenhum.

Reconcilia a linha de release com o trabalho real:
`main` estava parada em 26/04 enquanto o brand system evoluía em branch paralela, e a
tag `v2.1.2` havia sido cortada de uma branch de correção que não estava em lugar nenhum.
Esta versão junta tudo numa linha só.

### Added — Brand system multi-marca
- `brands/` com Electia, Emprega+, PdV, ResultX e Xscore — brand books, tokens, previews e templates
- Migração canônica da Electia: teal → roxo `#6f32b1`, navy → grafite `#0B0E14`
- Rampa OKLCH purple / royal-blue / gold com sinergia cross-brand

### Added — Componentes
- **`.btn-icon` completo** — passa de dimensão por padding (34×24, raspando o mínimo da WCAG 2.2)
  para caixa fixa 44×44, com `:disabled` e press effect. Tamanhos `-sm` (36) e `-lg` (52);
  variantes `-subtle`, `-primary` e `-danger`. Definição única em `components/icons.css`
- **`.form-textarea`** — o DS tinha `.form-input` e nenhum campo multilinha
- **`.kbd`** — atalhos de teclado deixam de ser texto solto
- **`.tooltip-right` / `.tooltip-left`** — só havia topo e base, inútil para navegação em rail
- **`.empty-state-inline`** — o estado vazio cheio usa ícone de 80px e padding `--space-16`,
  que estoura coluna de kanban e painel lateral
- **`.toast-action` / `.toast-dismiss` / `.toast[hidden]`** — sem eles o toast só comunica,
  nunca oferece saída nem pode ser dispensado; `display:flex` vencia o `[hidden]` do navegador

### Fixed — Defeitos de base
- **`.main` sem `min-width: 0`.** `body` é flex e `.main` é flex item: sem isso ele nunca encolhe
  abaixo do min-content do conteúdo, e qualquer linha que não quebra (tabs, toolbar, tabela)
  trava a largura acima da viewport, gerando scroll horizontal na página inteira.
  Medido em 390px, antes→depois: triagem 848→390, employer-jobs 1006→390, dashboard 614→390,
  candidatos 571→390
- **`.sidebar-item` sem `text-decoration: none`** — só ficava correto com `<div>`; com `<a>`,
  que é o markup certo para navegação, o link vinha sublinhado
- **`.header` com padding lateral fixo** `--space-8` — não cabe em 320px; passa a reduzir em ≤768px

### Changed — Convenção de nomenclatura
`CONTRIBUTING.md` e `docs/guides/getting-started.md` mandavam usar `.component--modifier` para tudo,
contradizendo o código: a camada base usa sufixo simples (`.btn-primary`, `.card-glass`) e só a
camada `.dl-` usa BEM. A doc passa a descrever as duas camadas — nenhum consumidor foi renomeado.

### Added — Demos
- `demos/electia-copiloto.html` — página-modelo de copiloto conversacional, com cada nó marcado
  como reuso do DS, composição local ou extensão proposta. Inclui a marca animada "Sinapse"
  da Electia AI, construída sobre a linguagem de sinapses da própria marca

### Changed — Reorganização estrutural (24/05)

### Changed — Top-level layout
- `docs-viewer.html` (orfão na raiz) → `docs/viewer.html`
- `render-templates.mjs` (orfão na raiz) → `scripts/render-templates.mjs`
- `pages/` (demos full-page) → `demos/` — nome menos confuso (não são páginas de app)
- `social-media-png/` → `templates/social-media/` — cria estrutura `templates/` semântica

### Changed — Padronização brands
- `brands/{electia,pdv}/email-templates/` → `brands/{electia,pdv}/templates/email/` — paridade com `templates/` raiz
- `brands/electia/previews/` agrupada em 5 categorias:
  - `logos/` (variants.html, purple-v2.5.html, concepts-v2/)
  - `brand-book/` (index.html, aurora-hero.html)
  - `gradients/` (options-2026-05-24.html)
  - `prototypes/` (prototype.html)
  - `visual-language/` (mantido)
- `brands/emprega-mais/previews/_archive/` criado para versões antigas:
  - `design-system-v1.html` (era `design-system.html`)
  - `design-system-v1-preview.html`
  - `design-system-v2-preview.html`
- `brands/emprega-mais/previews/` raiz fica só com canônicos: `brand-guidelines.html` + `mockups-gov.html`

### Updated — Referências
- `README.md`, `DESIGN-SYSTEM.md`, `CHANGELOG.md`, BBs e SOCIAL-MEDIA-GUIDE de todas marcas: refs atualizadas pros paths novos via sed
- `scripts/render-templates.mjs`: outDir aponta pra `templates/social-media/`
- `scripts/render-dashboards.mjs`: inPath aponta pra `demos/`

### Why
Marcos apontou desorganização: templates antigos misturados com novos, orphans na raiz, naming inconsistente entre brands. Aplicado padrão multi-brand DS (Brad Frost · Tokens Studio · W3C DTCG):
- Source vs output separados (`tokens/` `components/` `brands/` source; `dist/` `templates/social-media/` outputs)
- Orphans em pastas semânticas (`docs/`, `scripts/`)
- Brand structure padronizada (todos com `templates/email/`)
- Legacy explícito (`_archive/` em vez de v1/v2 misturados)

### Não alterado
- Tokens (valores, naming) — refactor puro cosmético de folders
- Brand kits content (BRAND-BOOKs, CHANGELOG marcas)
- Apps consumidores externos não dependiam dos paths alterados (validado por grep cross-repo)

---

## [2.1.2] - 2026-07-27

### Fixed
- **`.dl-table-wrap` — tabelas largas voltam a rolar em telas estreitas.** A regra usava `overflow: hidden`, que suprime barra de rolagem *e* gesto de swipe: o conteúdo excedente existia no DOM mas ficava inalcançável para o usuário. Medido no FinanceX (tela de Lançamentos, 7 colunas) a 390px de largura: `clientWidth` 324px contra `scrollWidth` 881px — **63% da tabela inacessível**, incluindo as colunas de status, valor e ações. Agora `overflow-x: auto` + `overflow-y: hidden` (o eixo Y segue clipado para preservar o `border-radius`).
- **`version` no `package.json` ressincronizada.** A tag `v2.1.1` foi publicada carregando `version: 2.1.0` internamente.

### Notas de compatibilidade
- Mudança isolada em `.dl-table-wrap`. Consumidores: **FinanceX** (15 usos) e **Electia** (0 usos — importa `components/data-cards.css` mas não usa a classe).
- ⚠️ A dívida de histórico registrada aqui — `main` fora da linha de release — **foi resolvida na v2.2.0**.

## [2.1.1] - 2026-04-26

Hotfix release com correções de distribution + cleanup de lint, e expansão da documentação para refletir o estado real do DS (5 themes + Data Layer).

### Fixed
- **`package.json` files array** — adicionado `components/data-cards.css` à allowlist. Sem este entry, `npm install github:carneiromarcos/resultx-design-system#v2.1.0` não trazia o data-cards.css aos consumers via git tag.
- **`components/data-cards.css` stylelint** — 7 errors corrigidos:
  - `#FFFFFF` → `var(--text-on-color)`
  - `url(#dl-chart-gradient)` → `url("#dl-chart-gradient")`
  - removida regra inválida `.dl-chart-point--active { r: 6 }` (atributo SVG, não propriedade CSS — set via attribute no markup)
  - `mask: ... #000` → `black` (named color)
  - reordenação de regras avatar-stack para corrigir `no-descending-specificity`
- **Tokens themes** — `#FFFFFF` → `#FFF` em premium-light, sober-dark, vibrant-dark (color-hex-length).

### Added — Documentation
- **`DESIGN-SYSTEM.md`** rebrand completo:
  - Título: "Emprega+ App Design System v1.0" → "ResultX Design System v2.1.1"
  - Filosofia atualizada: princípios v2.1 (Theme-aware, WCAG AA, Backward compatible, Multi-product) substituem antigos (Dark-first, Glassmorphism controlado, etc)
  - Seção "O que mudou da v2.0" com 4 bullets das adições da v2.1
  - Links para docs novas (`data-cards.md`, `gradients.md`, `preview.html`)
- **`docs/components/data-cards.md`** — novo. Documentação completa dos 10 componentes Data Layer (StatCard, Coin, Delta, Chart, Donut, Table, Sparkline, AvatarStack, StatusPill, TooltipCallout) com markup, variants, theme awareness, accessibility, e adoção atual (resultx.app + Electia).
- **`docs/tokens/gradients.md`** — novo. Documentação da gradient palette (5 brand gradients), gradient stops, delta semantics per-theme, surface accents per-theme, heatmap dot scale, dimensões compartilhadas, e guia "quando usar cada gradient".

### Changed
- **Versão local** alinhada com tag remote: `2.1.0` → `2.1.1`.

## [2.1.0] - 2026-04-25

Adiciona **camada Data Layer** ao DS: 3 themes opt-in (premium-light, sober-dark, vibrant-dark) e 10 componentes essenciais para dashboards/visualização de dados, inspirados em TalentaSync, Tivo e AdminDASH.

### Added — Data Layer (v2.1.0)
- **3 themes opt-in via `data-theme="..."`** — backwards compat 100%, `dark` e `light` v2.0 intactos:
  - `premium-light` — green forest #0E2C24 + cream #F2F5F0 (TalentaSync vibe, premium SaaS)
  - `sober-dark` — navy #1A1F2E + violet #8B5CF6 (Tivo vibe, enterprise)
  - `vibrant-dark` — deep navy #1A1F36 + cyan #18C4FF + magenta #FF4789 (AdminDASH vibe, high-tech)
- **Gradient palette compartilhado** — 5 gradients neutros (cyan, magenta, green, amber, purple) reutilizáveis nos 3 themes via `--gradient-*` e stops `--grad-*-start/end`
- **Delta semantics per-theme** — `--delta-positive-fg/bg`, `--delta-negative-fg/bg`, `--delta-neutral-fg/bg` calibrados por contexto
- **Surface accents per-theme** — `--surface-accent-cyan/magenta/green/amber/purple` para variants soft de Coin
- **Heatmap dot scale** — `--heatmap-dot-0..4` para visualização de atividade estilo GitHub contributions
- **Tokens de dimensionamento** — `--coin-size-sm/md/lg`, `--donut-size-sm/md/lg`, `--statcard-min-height`, `--heatmap-dot-size/gap`
- **`components/data-cards.css`** — 10 componentes essenciais (prefix `dl-`):
  1. `.dl-statcard` — bloco de métrica com header/value/footer
  2. `.dl-coin` — ícone arredondado com 5 variants gradient + 5 soft + neutral
  3. `.dl-delta` — pílula direcional positive/negative/neutral
  4. `.dl-chart` — shell para line/area chart (works com SVG inline)
  5. `.dl-donut` — donut conic-gradient com center value + legend categórica
  6. `.dl-table` — compact data table com header semântico
  7. `.dl-sparkline` — micro CSS bar chart inline (variants positive/negative)
  8. `.dl-avatar-stack` — avatares overlapping com `+N` more
  9. `.dl-status` — pílula semântica (in-progress/done/need-review/pending/blocked)
  10. `.dl-tooltip-callout` — tooltip flutuante para data-points em charts
- **`tokens/themes/preview.html`** — preview standalone com 3 dashboards mockup densos (browser frame + sidebar + 3 stats + donut + chart + table) para validação visual
- **`tests/data-layer.test.js`** — 24 testes Jest validando file presence, gradient palette, theme parity (3 themes têm os mesmos 32 tokens essenciais), e presença das 10 classes + variants
- **`./components/data-cards` export** — exposed via `package.json` exports map

### Added — Build infra (introduzido neste ciclo, integrado na release)
- **`scripts/build-tokens.js`** — pipeline de build Node que lê `tokens/tokens.css` + `tokens/base/tokens-base.css` e gera outputs Tailwind v4 + TypeScript sem alterar o source CSS
- **`dist/tokens.theme.css`** — saída Tailwind v4 com bloco `@theme inline` expondo tokens como utility classes (bg-*, text-*, font-*, p-*, rounded-*, shadow-*), preservando runtime theme switching via `[data-theme]`
- **`dist/tokens.ts`** — exports TypeScript (`sharedTokens`, `darkTokens`, `lightTokens`, `TokenName`) para consumo em JS/charts/tests
- **`package.json` exports** — `./tokens/theme` e `./tokens/ts` disponíveis para consumers
- **9 categorias classificadas** no @theme inline: 84 cores, 4 font families, 5 font weights, 12 text sizes, 6 line heights, 6 letter spacings, 14 spacing, 6 radius, 5 shadow (142 tokens expostos)
- **4 novos testes Jest** — validação das saídas geradas (presença do `@theme inline`, parity dark/light, contagem vs. source, exports TS)

### Changed
- `scripts.build:tokens` — agora roda `node scripts/build-tokens.js && postcss` (postcss preservado para compat do `tokens.min.css` atual)
- `files` array — inclui `tokens/base/tokens-base.css` para garantir que consumers via npm recebam o source completo

### Fixed
- `.gitignore` — ignora `templates/social-media/` (artefatos gerados) e `.claude/` (estado local)

### Notes
- **`tokens/tokens.css` continua sendo o source autoritativo** — edite sempre lá, rode `npm run build:tokens`
- **`tokens/tokens.json` continua desatualizado** (formato v1.0, namespace `emprega-app`) — reconstrução fica para fase futura se necessário
- **Zero impacto em consumers atuais**: Editais (Laravel), Sites (React+CSS) continuam usando `dist/tokens.min.css` inalterado. Novos outputs só são consumidos quando explicitamente referenciados.

## [2.0.0] - 2026-04-01

Primeira release do design system como repositório standalone (`carneiromarcos/resultx-design-system`), reposicionado como DS multi-produto (Electia, IMO, Editais).

### Added
- **Repositório próprio** — publicado em `github.com/carneiromarcos/resultx-design-system`, site live em `carneiromarcos.github.io/resultx-design-system`
- **Tema unificado** — `tokens.css` com `[data-theme="dark"]`, `[data-theme="light"]` e auto-detect via `prefers-color-scheme`
- **8 componentes compostos** — View Toggle, Data Table Enhanced (sort/bulk/color cells), Filter Bar, Stepper/Wizard, Pipeline Kanban (5 stages HR), Search Autocomplete, Date Range, Sparkline
- **Apple-level polish** — spring physics curves (`--spring-bounce/smooth/snappy`), elevation system (`--elevation-0..4`), crossfade transition em dark/light toggle, stagger animations
- **Icon system** — `components/icons.css` + docs
- **Print styles** — `@media print` completo
- **Template `triagem.html`** — adicionado aos 4 existentes (login, dashboard, candidatos, 404)
- **Bundle analysis** — `scripts/bundle-analysis.js`
- **Test suite** — Jest com 19 testes (token parity dark/light, fallback parity, build output, hardcoded color detection)
- **Theme toggle runtime** — `dist/theme-toggle.js` (`ResultXTheme.toggle()/set()/get()`, localStorage + system preference)
- **Composite docs** — `docs/components/composite.md` + nav dedicada no docs-viewer
- **CONTRIBUTING.md** — checklists para tokens e componentes
- **CI/CD** — 3 workflows GitHub Actions (CI lint+build+test, Pages deploy, npm publish on release)
- **Versionamento semântico** — `commit-and-tag-version` + `@commitlint/config-conventional`
- **Husky + lint-staged** — formatação e lint automáticos
- **W3C DTCG tokens** — `tokens.json` canonical
- **tokens-base.css** — bundled para builds standalone
- **LICENSE MIT**, exports map em `package.json`
- **Componentes**: 492 regras CSS cobrindo atoms, molecules, organisms + 8 compostos

### Changed
- Todos os templates referenciam `dist/*.min.css` (não source)
- `.tab` com reset de button defaults (background/border/font) para suportar `<button>` semântico
- Touch targets elevados para `min-height: 44px` (48px em mobile)
- Focus states igualados a hover em sidebar, dropdown-item, tab, breadcrumb
- Contraste light mode ajustado: `--text-secondary: #4B5563`, `--text-muted: #6B7280`
- Novos tokens: `--accent-secondary-muted`, `--sidebar-text-label`, `--sidebar-badge-bg`, `--sidebar-badge-active-bg`

### Fixed
- **A11y audit** (WCAG AA) — 9 fixes: focus-visible em 16 componentes, toggle a11y, skip-link, form-error, `prefers-reduced-motion`, hex → tokens migration, `--text-on-*` tokens
- **Disabled states** — `btn`, `form-input`, `dropdown`, `tab`
- **ARIA** — templates login, 404, candidatos corrigidos
- **Responsive** — `layout-split` colapse, btn 48px mobile
- **Loading states** — `.btn-loading`, `.card-loading`
- **Glassmorphism** — `.card-glass` modifier isolado
- **Hardcoded rgba** — header glassmorphism, 7 icon-badges, 6 theory badges, 5 tags, 3 sidebar rgba migrados para tokens
- **Lint fixes** — `#FFFFFF` → `#FFF`, `@import` notation (14 erros eliminados)
- **CI Node 20** — `package-lock.json` regenerado, `npm install` restaurado após sync

### Removed
- `tokens-dark.css`, `tokens-light.css`, `tokens-unified.css` (superseded pelo `tokens.css` unificado)
- 7 HTMLs legacy (`index`, `light`, `dark`, `components-showcase`, `social-media-templates`)

### Metrics
- **Source:** 106 KB (tokens 25.8 + components 80.8)
- **Minified:** 65 KB (39% reduction)
- **Testes:** 19 (build + tokens parity)
- **Docs:** 13 componentes + 8 tokens + api-reference + a11y-audit + roi-report
- **A11y score:** 90/100 (melhorado de 74)

---

> **Nota histórica:** as versões `1.0.0` e `1.0.1` abaixo referem-se ao período em que o design system vivia dentro do monorepo `meus-projetos/` como `app-design-system`. A v2.0.0 marca a primeira release como repositório standalone multi-produto.

## [1.0.1] - 2026-03-26

### Fixed
- `tokens.css` — accent corrigido de BLUE `#93ACFF` para TEAL `#2DD4BF` (alinhado com tokens.json)
- `tokens.css` — `--accent-secondary` corrigido de `#C49A3C` para `#60A5FA`
- `tokens.css` — shadow renomeado de `glow-navy` para `glow-teal`
- `tokens.css` — `pulse-glow` keyframe corrigido para usar rgba teal
- `tokens.css` — `--border-accent` corrigido para rgba teal
- `tokens.css` — adicionados tokens de z-index e breakpoints (antes apenas em comments)
- `components.css` — 9x `#fff` substituidos por `var(--text-primary)`
- `components.css` — icon badges (purple, orange, pink, cyan) migrados para `var(--theory-*)`
- `components.css` — tags (purple, orange, pink) migrados para `var(--theory-*)`
- `components.css` — toggle thumb migrado de `#fff` para `var(--text-primary)`
- `dashboard.html` — `#7C3AED` e `#EA580C` migrados para `var(--theory-enneagram)` e `var(--theory-disc)`

## [1.0.0] - 2026-03-17

### Added
- DESIGN-SYSTEM.md — guia completo (427 linhas)
- `tokens/tokens.json` — W3C DTCG canonical
- `tokens/tokens.css` — CSS custom properties
- `tokens/tokens-dark.css`, `tokens-light.css`, `tokens-unified.css` — variantes de tema
- `components/components.css` — 40+ componentes (buttons, cards, tabs, modals, kanban, etc.)
- `pages/` — 4 templates (login, dashboard, candidatos, 404)
- Theory colors para 6 assessments (MBTI, DISC, Big Five, Eneagrama, Le Senne, Jung)
- Glassmorphism 3 niveis
- 7 HTML showcases
