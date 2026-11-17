# Xscore — assets oficiais da marca

Arte raster aprovada em 17/11/2026, vetorizada pelas máscaras dos próprios PNGs.
As duas partes do X e as cinco letras de `score` foram traçadas; não há fonte
substituta nem imagem raster embutida nos SVGs. A família anterior permanece no
histórico Git; a aproximação por Archivo Black deixou de ser a fonte desta marca.

## Arquivos e convenção

| Arquivo | Uso |
|---|---|
| `xscore-wordmark-dark.svg` | fundo claro, palavra em navy amostrado; vetor aceito SHA-256 `c30a577e5a1aadd474e6b6b1bd45c4e1a3a3e47436a89186304e8303032b2740` |
| `xscore-wordmark-light.svg` | fundo escuro, palavra branca; vetor aceito SHA-256 `30a5c70b5f21697c50cddc158f71082f018f11b8d6e9b35ad6be6c71f8a0762c` |
| `xscore-monogram.svg` | símbolo isolado, fundo transparente |
| `xscore-favicon.svg` | mesmo símbolo sobre fundo branco e contorno navy para abas claras/escuras |
| `xscore-favicon.ico` | entradas PNG 16, 32 e 48 px, em contêiner ICO |
| `xscore-icon-{16,32,180,512}.png` | variantes opacas para aba, atalho e aplicações de marca |
| `source/wordmark-*-background.png` | fontes raster sem metadados auxiliares; pixels preservados |
| `source/provenance.json` | hashes dos originais, fontes sanitizadas, pixels e vetores aceitos |
| `source/tracing.json` | amostras RGB, coordenadas, método e ajustes dos gradientes |
| `asset-manifest.json` | hashes e tamanhos dos arquivos distribuídos |

`light` e `dark` nomeiam a tinta da arte, preservando a convenção anterior: a arte
light vai em fundo escuro. Os nomes `*-background` nas fontes nomeiam o fundo.
Não trocar as versões. Cada arquivo usa IDs próprios de gradiente.

## Construção e reprodução

A fonte tem 400 × 400; a área da marca usa a janela `26 152 358 96`, sem o espaço
vazio do quadro original. O contorno alfa é interpolado em 4× e traçado em 128 com
potrace 1.16. Gradientes lineares por parte usam somente stops RGB encontrados no
raster. `score` usa paths da máscara; navy `rgb(27 42 74)` e branco `rgb(255 255 255)`
são cores dos próprios originais. O fundo/contorno do favicon usa essas mesmas cores.
Nenhum token foi alterado para gerar a arte.

Com as dependências deste repositório e potrace 1.16 disponível:

```sh
node brands/xscore/assets/logo/scripts/gerar-marca.js
npm test -- --runInBand --watchman=false brands/xscore/assets/logo/scripts/logo-source.test.js
```

O gerador confere os dois hashes aceitos antes de gravar os wordmarks; divergência
exige nova aprovação da arte. Não editar os gerados manualmente. Intermediários
PBM/SVG são temporários, removidos ao terminar. PNGs/ICO usam o Chromium do próprio
repositório; não há dependência de aplicação consumidora nem download de fonte.
O teste não depende de histórico Git ou de browser: verifica os bytes aceitos,
fontes sem metadados, formato SVG, opacidade, dimensões e entradas do ICO.

A sanitização retirou metadados auxiliares sem mudar nenhum pixel RGBA; os digests
originais e sanitizados diferem por empacotamento. Os arquivos não guardam caminhos
locais, nomes de pessoas, dados de produto ou capturas de tela.

## Evidência local

O ensaio antes da troca teve quatro falhas e um passe nos cinco critérios novos.
Depois da geração: cinco passes, zero falhas/pulos. A suíte completa da marca e do
DS passou em 842/842, 42 suítes; isso não prova adoção em consumidor.
A prévia é regenerada pelo gerador existente durante `npm test`. Seu manifesto
registra tokens e contratos; continua byte a byte igual nesta troca de arte.
Aprovação independente, CI e publicação continuam separados.

## Contraste do símbolo

A região azul do símbolo conserva a aparência do original sobre superfícies escuras.
A medição em `source/contrast.json` usa pixels totalmente opacos do SVG renderizado
a 180 × 52 sobre `--surface-1` escura (`#161B26`): faixa azul **1,7504–3,1861:1**;
faixa quente **3,0731–7,3945:1**. A região azul fica parcialmente abaixo da referência
de 3:1. É uma limitação conhecida da arte aprovada, mantida sem recolorir. Os números
não são aprovação de todas as combinações de uso nem de pixels de antialias.
