# Ponte de marca (`ds-bridge.css`)

> Onda 3, itens 1 e 2. Gerado por `npm run build:bridges`.

## O problema

`tokens/tokens.css` entrega **um** accent: teal `#2DD4BF` no tema dark, azul `#1D4ED8` no light.
Um arquivo de marca ao lado declara `--purple` ou `--gold` e **não remapeia nada**. O resultado é
que um produto que importa os dois continua renderizando teal — foi por isso que a Electia
reimplementou o shell em Tailwind e redeclarou 57 tokens à mão.

A ponte é a camada de tradução que faltava: valor de marca entra, token semântico do DS sai.

## O defeito de acessibilidade que estava escondido

`--text-inverse` é a tinta impressa **sobre** o accent — é o que dá cor ao rótulo de
`.btn-primary`, `.pagination-btn.active`, `.stepper-step.completed` e ao spinner do botão. O DS
fixa `#0B0E14`, e esse valor só é correto porque o accent do DS é claro.

| fundo | tinta `#0B0E14` | tinta `#FFFFFF` |
|---|---:|---:|
| teal `#2DD4BF` (accent do DS, dark) | **10,38:1** ✅ | 1,86:1 ❌ |
| azul `#1D4ED8` (accent do DS, light) | 2,88:1 ❌ | **6,70:1** ✅ |
| roxo `#6f32b1` (Electia) | **2,55:1** ❌ | **7,59:1** ✅ |
| dourado `#c4993b` (Emprega+, PdV, ResultX, Xscore) | **7,33:1** ✅ | 2,64:1 ❌ |

A falha é **bidirecional**: nenhum valor único serve às duas famílias. Por isso a tinta não é
configurada em lugar nenhum — ela é **medida** por marca em `scripts/lib/contrast.js`, e o build
falha se nenhuma candidata alcançar 4,5:1.

> Correção de um número que circulava antes: o rótulo do botão primário da Electia estava em
> **2,55:1**, não em ~2,9:1. O 2,88 era o azul do tema light do DS contra a mesma tinta.

## Preenchimento e texto são papéis diferentes

O mesmo dourado `#c4993b` é um preenchimento excelente (7,33:1 contra tinta escura) e uma cor de
texto ilegível sobre branco (2,64:1). O DS confundia os dois papéis num token só, e usava
`--accent-primary` como cor de texto em **27 lugares**.

A ponte introduz a separação — que é exatamente a gramática "nomear por papel" já decidida:

| token | papel |
|---|---|
| `--accent-primary` | a marca como **preenchimento** (fundo de botão, chip ativo) |
| `--accent-primary-text` | a marca como **texto** sobre a superfície daquele tema |
| `--text-inverse` / `--text-on-accent` | a **tinta** impressa sobre o preenchimento |

Os 27 usos de texto em `components/` migraram para `--accent-primary-text`. `border-color`,
`background` e `accent-color` **não** foram tocados — continuam no preenchimento, que é o papel
certo. O DS declara `--accent-primary-text` nos quatro escopos, então uma marca sem ponte se
comporta exatamente como antes.

## Os quatro escopos

O DS define tema em quatro lugares, e a ponte sobrescreve os quatro:

```
[data-theme="dark"]
[data-theme="light"]
@media (prefers-color-scheme: dark)   :root:not([data-theme])
@media (prefers-color-scheme: light)  :root:not([data-theme])
```

Os dois últimos não são opcionais: sem eles, quem **não** seta `data-theme` — que é o caminho de
auto-detecção suportado — continua vendo teal. `tests/brand-bridge.test.js` reprova a ponte que
esquecer qualquer um.

## Uso

Importar **depois** dos tokens do DS, para vencer na cascata:

```css
@import "resultx-design-system/tokens";
@import "resultx-design-system/brands/electia/bridge";
```

O subpath `./brands/*/bridge` foi adicionado a `exports`, e os CSS de marca a `files[]` — antes
disso `brands/` **não era publicado**, e `node_modules/resultx-design-system/` não continha a pasta.
Uma ponte escrita sem essa correção não chegaria a consumidor nenhum.

## Estado medido por marca

Saída de `npm run build:bridges`:

| marca | tema | accent | tinta | razão | accent como texto |
|---|---|---|---|---:|---|
| electia | dark | `#6f32b1` | `#FFFFFF` | 7,59:1 | `#c084fc` (7,31:1) |
| electia | light | `#6f32b1` | `#FFFFFF` | 7,59:1 | `#6f32b1` (7,59:1) |
| emprega-mais | dark | `#c4993b` | `#0B0E14` | 7,33:1 | `#c4993b` (7,33:1) |
| emprega-mais | light | `#c4993b` | `#0B0E14` | 7,33:1 | `#866425` (5,44:1) |
| pdv | dark | `#c4993b` | `#0B0E14` | 7,33:1 | `#c4993b` (7,33:1) |
| pdv | light | `#c4993b` | `#0B0E14` | 7,33:1 | `#866425` (5,44:1) |
| resultx | dark | `#c4993b` | `#0B0E14` | 7,33:1 | `#c4993b` (7,33:1) |
| resultx | light | `#c4993b` | `#0B0E14` | 7,33:1 | `#866425` (5,44:1) |
| xscore | dark | `#c4993b` | `#0B0E14` | 7,33:1 | `#c4993b` (7,33:1) |
| xscore | light | `#c4993b` | `#0B0E14` | 7,33:1 | `#866425` (5,44:1) |

### Duas decisões que a medição forçou

**O hover da Electia mudou de token.** A marca declara `--purple-light #a55eea` como hover. Como
preenchimento com rótulo branco isso dá **3,90:1** — reprova em AA para texto normal. A ponte usa
`--purple-600 #8842d6`, um passo da rampa OKLCH da própria marca, que sustenta **5,53:1**. O build
reprova qualquer marca cujo accent e hover peçam tintas diferentes, porque `--text-inverse` é um
valor só e o rótulo ficaria ilegível justamente no estado de interação.

**O `--gold-muted` do PdV não foi promovido.** Ele alcança 4,96:1 sobre branco puro, mas cai para
**4,28:1** sobre a superfície com 12% de tinta do accent, que é o fundo de tag e badge. Passar num
fundo e falhar no outro não é aprovação.

## 🟢 A tinta dourada — lacuna fechada em 07/08

Até aqui, **Emprega+, PdV e ResultX não tinham** variante do dourado aprovada em AA como texto no
tema light, e `--accent-primary-text` caía em `var(--text-primary)`: perdia-se a cor de marca, não
a legibilidade.

O mais escuro que cada uma declarava, e por que nenhum servia:

| marca | token mais escuro | sobre branco | sobre a tag `#f2eee4` |
|---|---|---:|---:|
| Emprega+ | `--emp-gold-dark #a07b2a` | 3,92:1 ❌ | 3,38:1 ❌ |
| ResultX | `--rx-gold-dark #a07b2a` | 3,92:1 ❌ | 3,38:1 ❌ |
| PdV | `--gold-muted #8B6B2A` | 4,96:1 ✅ | **4,28:1** ❌ |

O caso do PdV é o mais instrutivo: passava no branco puro e reprovava sobre a superfície com 12% de
tinta do accent, que é o fundo de tag e badge. **Passar num fundo e falhar no outro não é aprovação.**

**A solução veio do Xscore, não de invenção.** Ele já declarava `--gold-ink: #866425`, e as três
marcas passaram a declarar o equivalente com o próprio prefixo — `--emp-gold-ink`, `--gold-ink`,
`--rx-gold-ink`. Como as quatro compartilham o mesmo dourado `#c4993b`, o valor é o mesmo.

`#866425` é a **mínima escurecida que passa nas duas superfícies** — 5,44:1 no branco e 4,69:1 na
tag. Mantém o matiz da marca (39° contra 41° do `#c4993b`), só baixa a luminosidade de 50% para 34%.
Candidatos mais escuros passariam com folga, e por isso mesmo se afastariam mais do dourado.

### O token existe nos DOIS temas, e isso é deliberado

```css
:root                 { --emp-gold-ink: #c4993b; }  /* no escuro, o próprio dourado lê bem */
[data-theme="light"]  { --emp-gold-ink: #866425; }
```

O comentário do Xscore explica por quê, e vale para as quatro: sem a declaração no escuro,
`var(--gold-ink)` ficaria indefinido e quem precisasse de texto dourado cairia de volta no
`--gold` — **exatamente o bug que o token veio evitar** (19 ocorrências no Xscore em 01/08). Um
papel, um nome, resolvido por tema.

Efeito colateral bem-vindo: PdV e ResultX ganharam um bloco `[data-theme="light"]`, que não tinham.
Dois testes travam a correção — um verifica que nenhuma ponte contém `var(--text-primary)` como
tinta de texto, outro que o build não reporta lacuna alguma.

> Achado colateral: o comentário do `brands/xscore/tokens/tokens.css` afirma que o `#c4993b`
> "permanece só como FILL de botão, **com texto branco por cima**". Branco sobre `#c4993b` dá
> **2,64:1** — reprova. A tinta correta ali é escura (7,33:1), e é o que a ponte emite. O token
> `--gold-ink` está certo; a justificativa escrita ao lado dele, não.

## Manutenção

Os valores vivem em `brands/<marca>/tokens/tokens.css` — **fonte única**. A ponte só os lê;
`scripts/brand-bridges.config.js` declara *qual token cumpre qual papel*, nunca um valor.

Depois de editar qualquer `tokens.css` de marca, rode `npm run build:bridges` (já encadeado em
`npm run build:all`). O teste compara o arquivo commitado com o que o gerador produz agora, então
esquecer o rebuild reprova a suíte em vez de passar despercebido.

Os `ds-bridge.css` são gerados e não entram nos scripts de lint: contêm hexadecimal de propósito,
como `tokens/`.

## A gramática que a ponte pressupõe

A ponte só funciona porque os dois lados falam línguas diferentes de propósito: `brands/` nomeia
**pigmento** (`--purple-600`), o DS nomeia **papel** (`--accent-primary`), e a ponte é a tradução.

Quando um consumidor cria o próprio apelido com nome de cor, ele fura essa separação — e o nome
apodrece calado. O caso medido em 07/08: o Electia mantém `--accent-teal`, que hoje guarda **roxo**,
em 296 lugares. Ver [adr/0001-role-named-tokens.md](adr/0001-role-named-tokens.md).
