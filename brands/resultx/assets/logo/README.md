# ResultX — Assets de marca

> Os arquivos desta pasta vêm **dos arquivos reais do site** (`resultx-site`:
> `public/images/logo-resultx.svg` e `logo-icon.svg`, em produção em resultx.app).
> Nada foi redesenhado: só recorte, troca de cor do "result" para fundo claro e a
> conversão do X do ícone de texto para curva. Status: v2.0 (09/10/2026).

## Arquivos

| Arquivo | Uso |
|---|---|
| `resultx-logo-on-dark.svg` | **logomarca padrão**, para fundo escuro (grafite `#0B0E14`). "result" branco, X em gradiente |
| `resultx-logo-on-light.svg` | logomarca para fundo claro (propostas, documentos). "result" em `#0B0E14`, X idêntico |
| `resultx-logo-on-dark-1200.png`, `resultx-logo-on-light-1200.png` | os mesmos, rasterizados em 1200 px de largura, fundo transparente (e-mail, Canva, slides) |
| `resultx-favicon.svg` | **o favicon** e o ícone do app: X sobre tile arredondado |
| `resultx-icon-{16,32,180,512}.png` | rasters do ícone — aba (16/32), atalho iOS (180), loja/OG (512) |
| `scripts/gerar-marca.js` | gera tudo acima a partir dos arquivos do site |

Para fundo claro **nunca** use o `on-dark` (o "result" branco some), e vice-versa.

## Como a marca é construída (observado nos arquivos)

- **Logomarca**: a palavra `result` em minúsculas, grotesca de peso extra-negrito, seguida de um
  `X` maiúsculo **contornado** (silhueta vazada, traço arredondado) com gradiente de ponta a
  ponta. Proporção da caixa visível: `257,8 × 77,25` (≈ 3,34 : 1); a altura da marca é a
  altura do X.
- **Gradiente do X**: azul-escuro `#2040A0` → ciano `#00AFEF` → roxo `#8040A0` → âmbar `#C08020`
  → dourado `#B29442` (valores do `logo-icon.svg`). É o gradiente **do logotipo**; a interface
  da ResultX usa a ponte ouro → roxo (`--rx-gradient-bridge`). Os dois não se misturam: não
  pinte o X com a ponte, nem use o gradiente do logo em botão, título ou fundo.
- **Origem do arquivo**: `logo-resultx.svg` é uma imagem PNG dentro de um SVG (a forma é uma
  máscara de alfa, a cor é uma segunda imagem). Não há texto nem fonte embutidos, então a
  família tipográfica do "result" **não está identificada**. Enquanto não houver o vetor
  original, não tente reproduzir a palavra com uma fonte.
- **Ícone**: tile `32 × 32`, raio 8, preenchimento `#192744` (azul-marinho do arquivo
  original — não é o grafite da interface), com um `X` em Poppins ExtraBold (24, base em y=25)
  e o mesmo gradiente. O `resultx-favicon.svg` é esse arquivo com a letra convertida em curva,
  para não depender de a Poppins estar instalada.

## Tamanho e respiro

- **Altura mínima observada no site**: 20 px na gaveta móvel (≈ 67 px de largura); 25 px no
  header de desktop; 22 px no rodapé. Abaixo de 20 px não foi validado: use o ícone.
- **Área de respiro**: a altura do `X` em todas as direções (regra herdada do Brand Book v1.0 e
  mantida). Nenhum elemento, texto ou borda entra nessa zona.
- **Favicon**: use sempre o ícone, nunca a logomarca (em 16 px a palavra vira borrão).

## Fundos permitidos

| Fundo | Arquivo |
|---|---|
| Grafite `#0B0E14` e superfícies escuras do DS (`#111620`, `#161B26`, `#1C2333`) | `on-dark` |
| Branco e superfícies claras (`#F8FAFB`, `#F0F3F5`) | `on-light` |
| Foto ou arte de ambiência | só com overlay escuro que mantenha o fundo próximo ao grafite; `on-dark` |
| Fundo colorido, dourado ou roxo chapado | não validado — não usar |

## Como usar

```html
<link rel="icon" type="image/svg+xml" href="/images/resultx-favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/images/resultx-icon-32.png">
<link rel="apple-touch-icon" href="/images/resultx-icon-180.png">
```

O site (`resultx-site`) recorta a logomarca por CSS (`.rx-logo`) a partir do arquivo quadrado
original; os arquivos desta pasta já vêm recortados (`viewBox` na caixa visível), então
podem ser usados direto em `<img>` com `height` ou `width`.

## Regerar

```bash
cd brands/resultx/assets/logo
npm install --no-save opentype.js          # fora do pacote do DS
curl -sL "$(curl -s 'https://fonts.googleapis.com/css2?family=Poppins:wght@800' \
  -H 'User-Agent: Mozilla/5.0' | grep -o 'https://[^)]*\.ttf' | head -1)" -o Poppins-ExtraBold.ttf
node scripts/gerar-marca.js <logo-resultx.svg> <logo-icon.svg> Poppins-ExtraBold.ttf
```

O `playwright` (devDependency do DS) faz os PNGs, com fundo transparente. Apague o `.ttf` e o
`node_modules` ao terminar: não fazem parte do pacote.

## Pendente (decisão do Marcos)

- **Logo vetorial original**: com o vetor (ou a fonte do "result") seria possível um lockup
  X + palavra em vetor puro, versão monocromática e variante para fundo colorido.
- **Gradiente do logo × ponte da interface**: o X do logo ainda usa o gradiente antigo de cinco
  cores; o Brand Book v1.0 previa migrá-lo para ouro → roxo. O site novo manteve o logo antigo.
  Esta pasta documenta o que está em produção; trocar o X é decisão de marca.
- **Banner LinkedIn** e **OG** (`og-resultx.png` existe no site, não aqui).
