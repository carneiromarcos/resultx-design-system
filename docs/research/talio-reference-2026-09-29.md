# Talio — extração de design system para referência

**Captura:** 29/09/2026 · **Fonte:** [talio.work](https://talio.work/) · **Estado:** referência externa, sem adoção no DS canônico.

## Proveniência e limite

O hub não tinha um arquivo Talio em `brands/`, `tokens/`, `components/` ou `docs/` antes desta extração. Havia uma análise de 17/09 em memória de projeto e um artefato externo voltados à landing da Electia. Esta ficha versiona a observação atual no hub. A Talio não é uma marca ResultX; seus valores são evidência para estudar papéis visuais, não uma paleta a importar para Electia.

| Evidência | Revisão em 29/09 | Uso |
|---|---|---|
| HTML público | `https://talio.work/` | Entrada da landing e nomes dos assets |
| CSS | `/assets/index-BdfkPj_c.css` · SHA-256 `d3cbff7966b561a8f12dc583d08f7b3017cdb60f681ba5286690e89e03451d51` | Variáveis, estilos e estados |
| JS | `/assets/index-BZliwA0B.js` · SHA-256 `dbbe39251b3ed9ee6c80afd00fd88eb5a79869aea4e25682bfdf2b2dacc63e7e` | Estrutura e presença de animações de entrada |
| Browser | Chromium, 375 e 1440 px CSS | Medidas computadas, ordem de seções, overflow |

Os valores de cor convertidos para hexadecimal e os principais tamanhos estão em [talio-reference-2026-09-29.tokens.json](talio-reference-2026-09-29.tokens.json). O JSON é um **snapshot de referência** e não integra o build nem os exports do pacote.

## Gramática visual observada

| Papel | Talio em 29/09 | Leitura para Electia |
|---|---|---|
| Tema da landing | Claro quente: canvas `#F7F6F3`, superfície branca, tinta `#2E2E2E`, borda `#DBD7D1`; acento azul `#0F38B3` | Usar a separação canvas/superfície/tinta. Manter o roxo `#6f32b1` e o grafite `#0B0E14` definidos no Brand Book Electia. |
| Tema escuro | A demo embutida usa `#141824`, tinta `#E7EBEF`, card `#1A1F2D`, borda `#2D3449` | É um contraste de produto dentro da página clara, não prova de uma landing inteira em dark. |
| Tipografia | General Sans para UI e títulos; JetBrains Mono declarado para uso mono. H1 medido 84/84 px em 1440 e 36,8/38,64 px em 375, peso 700. H2 principal 48/48 px desktop e 29,6 px móvel. | Reaproveitar a escala e hierarquia como hipótese de teste; Electia mantém Sora + Inter e JetBrains Mono de sua identidade. |
| Microtexto | Eyebrow 12 px desktop / 11 px móvel, peso 500, caixa alta, tracking amplo; pill com raio total e padding 4 × 12 px | Útil como papel de seção, desde que contraste seja verificado com o roxo Electia. |
| CTA principal | 44 px de altura desktop, 48 px móvel e largura total no móvel; raio 8 px, texto 14 px/600, sombra interna de filete claro e transição de 180 ms | O filete e a hierarquia do CTA podem virar protótipo; cor e gradiente ficam próprios da Electia. |
| Cartões | Cards brancos com borda fina, sombra em duas camadas e raio de 8 a 16 px conforme papel; cartões de plano medidos com 12 px | Testar uma escala por papel. Não igualar todos os raios só porque a referência mistura três tamanhos. |
| Composição | Hero centralizado com largura máxima de 1152 px no H1 desktop; conteúdo de texto limitado a 672 px. Seções alternam fundo liso e superfície levemente tonal. | A proporção e o ritmo são mais transferíveis que a cor. |

O documento antigo descrevia H1 de 96 px, landing escura e canvas WebGL. **Esses pontos não descrevem a página servida em 29/09:** o H1 computado foi 84 px em 1440; a landing abre clara; `document.querySelectorAll('canvas')` retornou zero. O JS atual contém chamadas `whileInView`, mas a contagem textual no bundle não demonstra quantos componentes as usam. Não transportar a receita antiga de shader como requisito atual.

## Biblioteca de padrões extraída

1. **Navegação:** barra horizontal contida, 56 px de altura em 375 e 1440; menu compacto no móvel e CTA principal à direita no desktop.
2. **Hero:** eyebrow em pill, título em duas linhas com segunda linha acentuada, texto curto, CTA primário e secundário, mini demonstração de busca e prova numérica logo abaixo. A área entrega a promessa antes de pedir rolagem.
3. **Capacidades:** grade de seis cards, cada um com pequena UI ilustrativa do próprio produto, título e explicação curta. O mini mockup mostra o resultado da capacidade.
4. **Demo de produto:** moldura de aplicativo escura dentro da landing clara, com opção de tour guiada e exploração. É um padrão de prova interativa distinto do CTA de cadastro.
5. **Fluxo e prova:** alternância de passos numerados, métricas, visão de ecossistema e dois caminhos de entrada. Os blocos usam o mesmo vocabulário de card, borda e sombra.
6. **Planos:** três cartões comparáveis e seletor mensal/anual acima; a escolha de período não muda a gramática visual do card.
7. **Fechamento:** segmentos, FAQ e CTA final em painel escuro para marcar a última ação.

### Movimento e acessibilidade observáveis

- O CSS declara `--ease-smooth: cubic-bezier(.22, .61, .36, 1)` em escopos de tema e botões com duração de 180 ms; cartões usam transição em torno de 300 ms. Há entradas ao rolar via `whileInView` no bundle.
- Estados `focus-visible`, `disabled` e `aria-disabled` aparecem na classe do CTA principal. O CSS inclui regras `prefers-reduced-motion` para efeitos; qualquer protótipo Electia precisa verificar a experiência reduzida em execução, não apenas a presença da regra.
- `documentElement.scrollWidth` foi 375/1440 px nos respectivos viewports, sem overflow horizontal na amostra. As capturas iniciais de página inteira não renderizaram todas as seções porque a entrada depende da rolagem; o inventário foi conferido após percorrer a página.

## Adaptação proposta, ainda sem implementação

**Caminho recomendado:** prototipar no Electia apenas a gramática de landing: hero central, prova curta, cards com mini UI, demo, passos e CTA final. Aplicar os tokens Electia existentes; medir 375/1440 em claro/escuro e contraste antes de alterar a página real. Não copiar texto, imagem, logo, CSS minificado nem o código de animação da Talio.

**Alternativas:** (a) usar só o ritmo editorial e a hierarquia, com menor mudança; (b) levar também card, CTA e motion como componentes próprios da Electia, com mais custo de implementação e revisão. Fundo animado de página inteira não é uma exigência observada na versão atual.

**Decisões abertas do Marcos:** alcance só da home ou também `/rh` e `/lideres`; extensão da composição para além do hero; aceitação da escala tipográfica maior mantendo Sora + Inter. A referência não altera `brands/electia/`, `tokens/`, `components/`, `dist/` nem a arquitetura de marcas.
