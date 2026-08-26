# Xscore — Assets de marca

> O Xscore é **produto do ResultX Labs** e herda o monograma **X** da marca-mãe. O `X` é o
> mesmo símbolo do `resultX`; a wordmark do produto é esse X seguido de **score**.

## Arquivos

| Arquivo | Uso |
|---|---|
| `xscore-monogram.svg` | símbolo isolado — avatar, selo, marca d'água |
| `xscore-favicon.svg` | **o favicon** — mesmo X com traço reforçado, para sobreviver a 16 px |
| `xscore-wordmark-light.svg` | wordmark para **fundo escuro** (score em branco) |
| `xscore-wordmark-dark.svg` | wordmark para **fundo claro** (score em `#12161f`) |
| `xscore-icon-{16,32,180,512}.png` | rasters — aba, atalho iOS (180), loja/OG (512) |

**Sempre use o X como favicon.** Nunca a wordmark inteira: em 16 px ela vira borrão.

## Construção

O X é a **silhueta contornada** (12 vértices, `fill:none` + `stroke`), não uma forma cheia —
foi assim que se mediu no arquivo da marca-mãe: um corte horizontal atravessa 4 bordas nos
braços e 2 no centro. Proporção `948 × 1123` (≈ 0,844), traço 5,8 % da altura, junções e pontas
arredondadas.

O favicon usa traço **9,0** em vez de 7,4 e menos folga: em 16 px o traço fino desaparece, e um
traço grosso demais fecha o vão central e mata o X.

### Gradiente — dois, não um

| Camada | Direção | Stops |
|---|---|---|
| Frio | topo → base | `#26429a` → `#2085d7` → `#00b8f4` |
| Quente (mascarado à direita) | base-esq → topo-dir | `#8d5579` → `#c9762e` → `#cd8724` → `#b5a34d` |

As cores foram **amostradas do arquivo da marca-mãe**, numa grade 6 × 6 sobre o X. A máscara
horizontal (`42 % → 55 %`) faz a passagem do frio para o quente, e é ela que produz o tom vinho
na base — presente no original.

## A palavra "score"

Desenhada em **Archivo Black** (SIL OFL) e **convertida em paths** — o SVG não depende de fonte
instalada.

⚠️ **Archivo Black é aproximação.** A fonte da marca-mãe não foi identificada: o arquivo recebido
(`resultX.svg`) não traz vetor nem fonte embutida — é um PNG dentro de um invólucro SVG. Archivo
Black foi escolhida por comparação visual contra dez candidatas, e é a mais próxima em peso e
largura. **Ao aparecer o arquivo da fonte original, regerar a wordmark.**

## Regerar

O gerador está em `scripts/gerar-marca.js` (Node + `opentype.js`). Ele precisa do TTF da
Archivo Black ao lado, como `f2-Archivo-Black.ttf`:

```bash
npm install opentype.js
curl -sL "$(curl -s 'https://fonts.googleapis.com/css2?family=Archivo+Black' \
  -H 'User-Agent: Mozilla/5.0' | grep -o 'https://[^)]*\.ttf')" -o f2-Archivo-Black.ttf
node scripts/gerar-marca.js
```

Os PNGs saem do SVG por Chrome headless com fundo transparente
(`--headless=new --default-background-color=00000000 --screenshot`).

**Os ids de gradiente levam sufixo por arquivo** (`M` monograma, `F` favicon, `L`/`D`
wordmarks). Sem isso, dois SVGs embutidos no mesmo documento colidem — e a colisão é
silenciosa: o segundo herda o gradiente do primeiro.

## Pendente

- **Lockup** (símbolo + wordmark travados, versão vertical) — é a peça que a assinatura em
  documento vai pedir, inclusive o laudo em PDF do ADR-0009. Ainda não existe.
- **Versão curta** e variantes de cor do monograma (chapado claro, chapado escuro) para
  fundos que o gradiente não sobrevive: bordado, gravação, fax, uma cor só.
- **Brand book** e o design system do brand, prometidos pelo ADR-0011 — esta entrega cobre
  só `assets/logo`.
