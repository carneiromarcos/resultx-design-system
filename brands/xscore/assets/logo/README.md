# Xscore — assets oficiais da marca

Arte raster aprovada em 24/11/2026, vetorizada pelas máscaras dos próprios PNGs.
As duas partes do X e as cinco letras de `score` foram traçadas. Não há fonte
substituta nem imagem raster embutida nos SVGs. A arte de 17/11/2026 continua no
histórico Git. A troca mudou o desenho de `score`, que ficou mais pesado, mais
alto e mais próximo do X. As cores do X e do `score` medidas na arte nova são as
mesmas da anterior, com diferença de poucos níveis RGB por stop.

## Arquivos e convenção

| Arquivo | Uso |
|---|---|
| `xscore-wordmark-dark.svg` | fundo claro, palavra em navy amostrado; vetor aceito SHA-256 `eb89bbd1944626e82b9ef60a450a40bb02b77bc89dfa93dc940e1421594fbe5e` |
| `xscore-wordmark-light.svg` | fundo escuro, palavra branca; vetor aceito SHA-256 `149b4efb6d5a8bd6986d46eb943699a0c2faefe9288abd95883b9c8730897071` |
| `xscore-monogram.svg` | símbolo isolado, fundo transparente, traçado da fonte de 400 px |
| `xscore-favicon.svg` | mesmo símbolo sobre fundo branco e contorno navy para abas claras/escuras |
| `xscore-favicon.ico` | entradas PNG 16, 32 e 48 px, em contêiner ICO |
| `xscore-icon-{16,32,180,512}.png` | variantes opacas para aba, atalho e aplicações de marca |
| `source/wordmark-*-background.png` | fontes raster do wordmark sem metadados auxiliares; pixels preservados |
| `source/symbol-transparent-background.png` | fonte raster do X isolado, 400 × 400; pixels preservados |
| `source/provenance.json` | hashes dos originais, fontes sanitizadas, pixels e vetores aceitos |
| `source/tracing.json` | componentes, amostras RGB, gradientes e fidelidade medida |
| `source/contrast.json` | contraste do símbolo e do `score` nas superfícies do tema |
| `asset-manifest.json` | hashes e tamanhos dos arquivos distribuídos |

`light` e `dark` nomeiam a tinta da arte, preservando a convenção anterior: a arte
light vai em fundo escuro. Os nomes `*-background` nas fontes nomeiam o fundo.
Não trocar as versões. Cada arquivo usa IDs próprios de gradiente. O favicon usa
sempre o X, nunca a palavra.

## Construção e reprodução

As fontes têm 400 × 400. As duas versões do wordmark têm a mesma máscara alfa e o
mesmo X; muda só a cor de `score`. A janela do wordmark é a extensão alfa com 2 px
de respiro: `22 172 354 82` (antes `26 152 358 96`). O contorno alfa é
interpolado em 4× e traçado em 128 com potrace 1.16. O monograma, o favicon e os
ícones vêm da fonte do X isolado, interpolada em 2×, numa janela quadrada
`9 5 390 390`. Gradientes lineares por parte usam somente stops RGB encontrados no
raster. `score` usa paths da máscara; navy `rgb(27 42 74)` e branco
`rgb(255 255 255)` são cores dos próprios originais. O fundo/contorno do favicon
usa essas mesmas cores. Nenhum token foi alterado para gerar a arte.

Com as dependências deste repositório e potrace 1.16 disponível:

```sh
node brands/xscore/assets/logo/scripts/gerar-marca.js
npm test -- --runInBand --watchman=false brands/xscore/assets/logo/scripts/logo-source.test.js
```

O gerador confere os dois hashes aceitos antes de gravar os wordmarks; divergência
exige nova aprovação da arte. Não editar os gerados manualmente. Intermediários
PBM/SVG são temporários, removidos ao terminar. PNGs/ICO usam o Chromium do próprio
repositório; não há dependência de aplicação consumidora nem download de fonte.
Duas execuções seguidas produziram os mesmos bytes em todos os arquivos.

A sanitização retirou os blocos auxiliares (`eXIf`, `pHYs` e `iTXt` com XMP) e
copiou `IHDR`, `IDAT` e `IEND` sem recodificar; os pixels RGBA são idênticos por
construção. Os arquivos não guardam caminhos locais, nomes de pessoas, dados de
produto ou capturas de tela.

## Fidelidade do traçado

Cada vetor é renderizado na grade de 400 × 400 da fonte e comparado pixel a pixel
(`source/tracing.json`, campo `fidelity`):

| Vetor | IoU da máscara (alfa ≥ 128) | IoU só do X | Δ alfa médio | RMSE de cor opaca |
|---|---|---|---|---|
| wordmark (as duas versões) | 0,9779 | 0,9755 | 0,0015 | 1,69 / 1,16 |
| monograma | 0,9953 | 0,9953 | 0,0020 | 2,45 |

As folhas `../../docs/qa/logo-fidelity-wordmark.png` e `logo-fidelity-monogram.png`
mostram fonte, vetor e diferença (cinza nos dois, vermelho só na fonte, azul só no
vetor). As divergências ficam na borda de antialias. O teste exige IoU ≥ 0,95 no
wordmark e ≥ 0,98 no monograma.

## Contraste

`source/contrast.json` mede o `score` contra as cinco superfícies (`--bg`,
`--surface-1` a `--surface-4`) do tema em que cada versão é usada. Navy no tema
claro: **9,96–14,22:1**. Branco no tema escuro: **12,55–19,32:1**. Mínimo exigido
pelo teste: 4,5:1.

O símbolo foi renderizado a 180 px de largura sobre `--surface-1` escura
(`#161B26`), contando só os pixels totalmente opacos. Faixa fria
**1,7504–3,2334:1**; faixa quente **3,2195–7,2261:1**. A faixa fria fica em parte
abaixo da referência de 3:1, como na arte anterior. É uma limitação conhecida da
arte aprovada, mantida sem recolorir. Os números não aprovam todas as combinações
de uso nem os pixels de antialias.

## Legibilidade do favicon

Medido no interior do tile (sem a borda), contando pixels com contraste ≥ 3:1
contra o branco. 16 px: 12 pixels, máximo 5,40:1. 32 px: 59 pixels, máximo
9,94:1. A arte anterior media 12 pixels (máximo 5,33:1) e 59 pixels (máximo
9,74:1). A leitura em 16 px é a mesma de antes: o X aparece, mas com traço fino.
Não existe variante com traço reforçado; criar uma seria decisão de marca.
