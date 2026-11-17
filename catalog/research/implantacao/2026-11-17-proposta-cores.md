# Proposta de cores do ResultX DS: pendências de contraste do catálogo

**Autora:** Uma (@ux-design-expert) · **Data:** 17/11/2026 · **Natureza:** proposta, somente leitura
**Fonte lida:** cópia de leitura do DS no head `0827c21` (`.../scratchpad/ro/ds`). Nada foi editado.
**Para:** Executor (implementa) e Revisor (confere). As decisões visuais ficam com o Marcos (seção 5).

Todos os números foram recalculados com a fórmula WCAG 2.x: luminância relativa com linearização sRGB (limiar 0,04045, expoente 2,4, pesos 0,2126 / 0,7152 / 0,0722) e razão (L1+0,05)/(L2+0,05). Cores translúcidas foram compostas sobre a superfície real antes da conta. O roteiro está em `scratchpad/wcag.py`, e o resolvedor de papéis copia a lógica de `scripts/catalog/lib.cjs:57-81`. Conferência com o catálogo: 3,77 · 3,80 · 1,63 · 17,81 · 4,09 · 2,77 · 2,69 · 3,76 · 3,63 · 3,85 · 1,37. Todos batem com os relatórios.

Piso adotado: texto 4,5:1 (1.4.3). Limite de componente, borda e indicador de estado 3:1 (1.4.11).

---

## 0. Resumo do diagnóstico (três causas raiz)

1. **O mesmo token faz dois trabalhos.** `--color-success`, `--color-warning` e `--color-error` servem de preenchimento (com tinta por cima) e de texto. Nenhum valor único atende os dois. A ponte já resolve isso para o accent com `--accent-primary-text` (`scripts/brand-bridges.config.js:14-19`). Falta o mesmo par para os estados. O Xscore já resolveu na marca (`brands/xscore/tokens/tokens.css:89-92` e `:208-211`), e esse é o precedente usado aqui.
2. **As superfícies navy do PdV escuro não são verificadas.** As tintas do núcleo (`--text-muted`, `--text-secondary`, `--color-error`) foram ajustadas para o grafite. A verificação de papéis da ponte mede só as superfícies do núcleo (`scripts/brand-bridges.config.js:34-41`). Por isso o navy do PdV (`#1c2a4a`/`#243661`, mais claro que o grafite) passou sem teste.
3. **A marca redefine no `:root` um nome do núcleo e não o redefine no claro.** A eletia declara `--glass-strong-bg` escuro no `:root` (`brands/electia/tokens/tokens.css:168`) e o bloco claro (`:198-227`) não o troca. Como a folha da marca vem depois da do núcleo, e `:root` e `[data-theme="light"]` têm a mesma especificidade, o vidro escuro vence no claro. O PdV tem a mesma armadilha (`brands/pdv/tokens/tokens.css:119` e as superfícies `:25-29`), hoje escondida porque o catálogo inverte a ordem só no PdV claro (`scripts/catalog/build.cjs:126`, `scripts/catalog/lib.cjs:61-65`).

**Contagem fechada:** 139 pares (2 dos contratos, 135 do legado 4a, 2 do 4b).
- Por token: 4 grupos, 8 pares de contrato e vidro e 25 de legado.
- Por aplicação no componente: 3 grupos, 44 pares de legado.
- Exceção legítima pela norma: 5 grupos, 66 pares de legado, sendo 5 deles uma exceção em que o contrato do Marcos pede mais que a norma.

Essa soma dá 4 + 25 + 44 + 66 = 139. Os 4 primeiros são os 2 pares do contrato do PdV escuro e os 2 da eletia clara. As 25 medições de texto da página de contratos são clones desses dois pares do PdV.

---

## 1. Pares reprovados agrupados por causa raiz

Legenda: **T** = correção de token · **A** = aplicação no componente (outro papel que já existe) · **E** = exceção legítima.
Abreviações das marcas: ele = eletia, emp = emprega+, xsc = Xscore, pdv = PdV, res = ResultX. C = claro, E = escuro.

### Grupo 1. PdV escuro, contratos: perigo sobre superfície (T, só PdV)

- **Fonte da pendência:** `catalog/research/2026-11-16-catalogo-contratos.md:83-86` e `docs/STATUS.md:148`.
- **Token responsável:** o PdV não declara `--color-error`, então herda o do núcleo, `primitives.core.dark.color-error` (`tokens/tokens.json:4380`), que aponta para `primitives.color.rgb-239-68-68-alpha-1`. Gerado em `tokens/tokens.css:196`.
- **Valor atual:** `#EF4444`, oklch(63,7% 0,208 25).
- **Proposto, só no PdV escuro:** `#FF8A80`, oklch(75,9% 0,144 26). O matiz se mantém (25→26) e só a luminosidade sobe.

| Superfície do PdV escuro | Antes | Depois |
|---|---:|---:|
| `--bg` #1B2A4A | 3,78 | 6,23 |
| `--surface-1` #1c2a4a (par do contrato) | **3,77** | **6,22** |
| `--surface-2` #243661 | 3,14 | 5,18 |
| tinta de erro 12% sobre surface-1 (selo) | 3,43 | 5,65 |
| tinta de erro 12% sobre surface-2 | 2,92 | 4,81 |
| borda de perigo (piso 3:1) sobre surface-1 | 3,77 | 6,22 |
| tinta `#0B0E14` (`--text-inverse` do PdV) sobre o novo vermelho, no `.btn-danger` legado | 5,13 | 8,46 |

- O mínimo absoluto que respeita o matiz seria `#FF8079` (surface-2 4,85; selo sobre surface-2 4,50). O `#FF8A80` foi escolhido pela folga. O `#F87171` (precedente do Xscore) passa na surface-1 (5,13), mas **falha na surface-2 (4,28)**, então não serve ao navy.
- **Onde declarar:** em `brand.pdv.base` **e também** em `brand.pdv.light` (no claro com o valor do núcleo, `#DC2626`), para não repetir a causa 3. Não alterar o primitivo `rgb-239-68-68`: ele é compartilhado por `--disc-d` e `--bigfive-n` (`tokens/tokens.css:216`, `:243`). Criar primitivo novo e apontar o papel do PdV para ele.
- **Fora do escopo, com nota:** o semântico próprio do PdV, `--error: #B83A3A` (`brands/pdv/tokens/tokens.css:46`), mede 2,50 sobre a surface-1. O catálogo não o usa (os estados do PdV ligam em `--color-*`, `catalog/bindings.config.js:95-100`). Se alguém usar esse nome como texto, falha. Recomendo apontá-lo para o mesmo valor numa PR futura do PdV.

### Grupo 2. PdV escuro, contratos e legado: texto indisponível e texto secundário (T, só PdV)

- **Fontes:** `catalogo-contratos.md:86` (indisponível 3,80) e o CSV 4a, linha 59 (segmented não marcado, 3,85).
- **Tokens:** `primitives.core.dark.text-muted` (`tokens.json:4336`, `#8A939D`) e o `--text-secondary` do núcleo escuro (`#8B949E`, `tokens/tokens.css:174`). O PdV herda os dois.
- **Propostos, só no PdV escuro, no matiz navy da marca (oklch h≈265):**
  - `--text-secondary` `#B4BED2`, oklch(80% 0,030 264);
  - `--text-muted` `#A9B3C6`, oklch(76,5% 0,029 263).

| Par | Antes | Depois |
|---|---:|---:|
| indisponível: muted sobre surface-2 #243661 (contrato) | **3,80** | **5,60** |
| muted sobre surface-1 / bg | 4,56 / 4,57 | 6,73 / 6,74 |
| muted sobre a surface-3 própria #2d4378 | 3,08 | 4,55 |
| secundário sobre surface-2 (segmented, CSV 4a:59) | **3,85** | **6,33** |
| secundário sobre surface-1 (borda do contrato usa `--text-secondary`) | 4,61 | 7,60 |

- A hierarquia se mantém sobre a surface-1: primário 12,01 > secundário 7,60 > muted 6,73.
- Alternativa com valor que já existe: `#A3ABC4` (o `--emp-text-secondary` escuro, valor do ecossistema). Mede 5,17 na surface-2, mas **4,20 na surface-3**, o que exigiria a regra "sem texto na surface-3".
- **Honestidade normativa:** o texto de controle **indisponível é isento pela WCAG 1.4.3** ("parte de um componente de interface inativo"). O 4,5:1 é exigência do contrato do Marcos (`catalogo-contratos.md:65-66`: "o texto continua sujeito a 4,5:1"). É o Marcos pedindo mais que a norma, e a proposta atende ao pedido dele. Já o texto secundário (segmented não marcado) **não** é isento: é texto ativo.

### Grupo 3. PdV escuro, borda padrão invisível (T de identidade; a borda em si é decorativa)

- **Token:** `primitives.brand.pdv.base.border` (`tokens.json:9438`), `#26262D`, um cinza neutro de antes do navy (`brands/pdv/tokens/tokens.css:41`).
- **Medido:** 1,06 sobre a surface-1. A borda é **mais escura** que a superfície (CSV 4a, as 4 linhas `pdv dark` de `border-default`).
- **Proposto:** `#36508f`, que já é o `--surface-4` da marca (`:29`), seguindo o padrão eletia/Xscore em que surface-4 = borda. Mede 1,83 sobre a surface-1 (o núcleo escuro tem 1,37).
- **Norma:** a borda de divisão é decorativa, e a 1.4.11 não pede 3:1 para ela. Corrijo por coerência de identidade, não por conformidade. O campo, que precisa de limite, é tratado no Grupo 7.

### Grupo 4. Eletia clara: HeaderFloat e CTADock a 1,63 (T, na marca; ver a seção 3)

- **Fontes:** `catalog/research/2026-11-16-catalogo-legado-4b.md:88-97`, CSV 4b, linhas 17 e 19.
- **Token:** `primitives.brand.electia.base.glass-strong-bg` (`tokens.json:7240`), emitido em `brands/electia/tokens/tokens.css:168` como `rgba(22,27,38,0.85)`. Não existe par em `brand.electia.light`.
- **Proposto:** declarar no claro da eletia os mesmos valores do vidro claro do núcleo (`tokens/tokens.css:392-401`). **Nenhuma cor nova.**
  - `glass-subtle-bg` rgba(255,255,255,0.6) · `glass-bg` rgba(255,255,255,0.75) · `glass-strong-bg` rgba(255,255,255,0.92);
  - `glass-subtle-border` rgba(0,0,0,0.06) · `glass-border` rgba(0,0,0,0.08) · `glass-strong-border` rgba(0,0,0,0.1).

| Par (texto #0F1729) | Antes | Depois |
|---|---:|---:|
| marca do HeaderFloat sobre vidro, página #F8FAFB | **1,63** | **17,81** |
| texto do CTADock, idem | **1,63** | **17,81** |
| pior caso: vidro sobre painel #0B0E14 passando por baixo | — | 15,09 (secundário #4B5563: 6,38) |
| vidro sobre botão roxo #6f32b1 por baixo | — | 15,74 (secundário 6,66) |

### Grupo 5. Selos de estado do legado: texto colorido sobre a própria tinta (T, papel novo no núcleo, + A)

- **Fontes:** `catalog/research/2026-11-16-catalogo-legado-4a.md:74-85`; CSV 4a, linhas 13, 22, 24 e 26. São 20 pares:
  - erro: 10 (todas as marcas, os dois temas);
  - sucesso: 5 (só claro);
  - aviso: 5 (só claro).
- **Componente:** `components/components.css:693-698` (`.badge-*`, com `color: var(--color-*)` sobre `var(--color-*-bg)`).
- **Por que não mudar `--color-*`:** no claro, `--color-success` e `--color-warning` são preenchimentos com tinta escura (`--text-on-success`/`--text-on-warning` #0B0E14, `tokens/tokens.css:82-83`). Escurecer o verde para `#166534` derrubaria essa tinta para cerca de 3:1. O erro escuro também é preenchimento do `.btn-danger`. Então **separo o papel**, como já existe para o accent.
- **Tokens novos no núcleo** (`semantic.core.{dark,light}`, cada um com primitivo próprio): `--color-success-text`, `--color-warning-text`, `--color-error-text`.

| Papel | Claro (antes → proposto) | Escuro (antes → proposto) |
|---|---|---|
| success-text | `#16A34A` → **`#166534`**, oklch(44,8% 0,108 151), mesmo matiz | `#22C55E` → **manter** (já passa) |
| warning-text | `#D97706` → **`#8A4B0B`**, oklch(47,9% 0,110 58), mesmo matiz | `#F59E0B` → **manter** |
| error-text | `#DC2626` → **`#B91C1C`**, oklch(50,5% 0,190 28), mesmo matiz | `#EF4444` → **`#F87171`**, oklch(71,1% 0,166 22); no PdV escuro, `#FF8A80` (Grupo 1) |

Contraste do selo (texto sobre a tinta 12% composta sobre a surface-1 de cada marca), antes → depois:

| Estado/tema | ele | emp | xsc | pdv | res |
|---|---|---|---|---|---|
| erro C | 3,84→5,14 | 4,01→5,37 | 3,84→5,14 | 3,84→5,14 | 3,84→5,14 |
| erro E | 4,09→5,56 | 4,06→5,52 | 4,09→5,56 | 3,43→5,65 | 4,32→5,87 |
| sucesso C | 2,77→5,98 | 2,88→6,24 | 2,77→5,98 | 2,77→5,98 | 2,77→5,98 |
| aviso C | 2,69→5,73 | 2,80→5,98 | 2,69→5,73 | 2,69→5,73 | 2,69→5,73 |

- Pior caso de cada valor claro, considerando fundo, surface-1, surface-2 e tinta sobre surface-2 de todas as marcas:
  - success-text 5,65;
  - warning-text 5,10;
  - error-text 4,85.
- Pior caso do error-text escuro sem o PdV: 5,04, na tinta sobre a surface-2 da emp.
- Os valores de sucesso e erro claros são os mesmos do Xscore, já aprovados ali. O de aviso preserva o matiz. O `#92400E` do Xscore mede 5,32, mas puxa o matiz de 58 para 46: fica como alternativa se o Marcos preferir unificar com o Xscore.
- **Aplicação:** `.badge-*` passa a `color: var(--color-*-text, var(--color-*))`. O fallback é necessário porque os temas `premium-light`/`sober-dark`/`vibrant-dark` (`tokens/themes/*.css:30-35`) têm bloco próprio e não receberiam o papel novo. O ponto `::before` continua em `--color-*`: é indicador e não precisa de 4,5.

### Grupo 6. `.btn-danger` legado: tinta errada sobre o vermelho (A + T de tema)

- **Fonte:** CSV 4a, linha 5. São 5 pares:
  - ele E e emp E: 3,76 (branco sobre `#EF4444`);
  - pdv C, res C e xsc C: 4,00 (`#0B0E14` sobre `#DC2626`).
- **Causa:** `components/components.css:474-479` usa `--text-inverse`, que é a "tinta sobre o accent" e muda por marca na ponte (branco nos accents roxo e índigo, escuro nos dourados). O papel certo já existe: `--text-on-error` (`tokens/tokens.css:84`, `#FFF`, só no `:root`).
- **Aplicação:** `.btn-danger` e `.btn-danger:hover` passam a `color: var(--text-on-error)`.
- **Token (tema):** acrescentar `--text-on-error: #0B0E14` em `[data-theme="dark"]` e no bloco `prefers-color-scheme: dark`. O valor já existe no núcleo. **Manter `#FFF` no `:root`**: `scripts/brand-bridges.config.js:28` lê o `:root` como candidata de tinta, e trocar ali mudaria o cálculo das pontes.

| Marca/tema | Antes | Depois |
|---|---:|---:|
| C (todas: branco sobre #DC2626) | 4,00 (pdv/res/xsc) · 4,83 (ele/emp) | 4,83 em todas |
| E (ele/emp/xsc/res: #0B0E14 sobre #EF4444) | 3,76 (ele/emp) · 5,13 (demais) | 5,13 em todas |
| E (pdv: #0B0E14 sobre #FF8A80) | 5,13 | 8,46 |

- Há precedente: tinta escura sobre vermelho claro no escuro já é o padrão do Xscore (`--on-danger: #1A0A0A`, `brands/xscore/tokens/tokens.css:90-92`).
- A borda decorativa `rgba(220,38,38,0.2)` (`:477`) fica como está (ver Grupo 11).

### Grupo 7. Campos do legado sem limite visível (A)

- **Fonte:** CSV 4a, linha 7 e mais 19. São 20 pares (`#legacy-email` e `#legacy-select` × 10), de 1,06 a 1,44.
- **Componente:** `.form-input` (`components/components.css:796-800`) e `.form-select` (`:845-849`), com `border: 1px solid var(--border-default)`.
- **Norma:** **não é isento.** Um campo de texto sem limite ou outro indicador não é identificável, e a 1.4.11 exige 3:1.
- **Aplicação:** usar o mesmo papel do contrato Field, `--text-secondary` (`adapters/css/pilot.css:17-19`), já aceito pelo Marcos no piloto. Nenhuma cor nova.

| Borda do campo sobre surface-1 | ele C | ele E | emp C | emp E | xsc C | xsc E | pdv C | pdv E | res C | res E |
|---|---|---|---|---|---|---|---|---|---|---|
| antes (`--border-default`) | 1,36 | 1,37 | 1,19 | 1,31 | 1,36 | 1,37 | 1,36 | 1,06 | 1,36 | 1,44 |
| depois (`--text-secondary`) | 7,22 | 5,60 | 4,83 | 7,47 | 7,22 | 5,60 | 7,22 | 7,60* | 7,22 | 5,89 |

\* Com o `--text-secondary` novo do PdV (Grupo 2). Com o valor atual seria 4,61.

- Opção futura, se o Marcos achar a borda pesada: um papel `--border-control` com cerca de 3,2:1 (cor nova). Não recomendo agora, para não divergir do contrato.

### Grupo 8. Segmented marcado: indicador de estado e texto (A)

- **Fontes:** CSV 4a, linhas 10 e 61.
- **Borda de estado:** 10 pares, `--border-accent` sobre surface-2, de 1,21 a 1,78.
- **Texto:** 4 pares, `--accent-primary-text` sobre `--accent-primary-muted`:
  - pdv E: 3,63;
  - pdv C, xsc C e res C: 4,44.
- **Componente:** `components/segmented.css:168-173`.
- **Aplicação** (os papéis já existem):
  - `border-color: var(--accent-primary-text)`. Vira o indicador de estado com 3:1 garantido, porque esse papel já é medido como texto.
  - `color: var(--text-primary)`. O peso semibold continua diferenciando, e a tinta mais a borda carregam a cor da marca.
- **Por que não escurecer o `--gold-ink` claro (`#866425`):** ele é o texto dourado do Xscore em produção (o Xscore importa `brands/xscore/tokens`). Mexer muda a identidade de um produto vivo para corrigir um componente.

| | ele C | ele E | emp C | emp E | xsc C | xsc E | pdv C | pdv E | res C | res E |
|---|---|---|---|---|---|---|---|---|---|---|
| borda de estado, antes | 1,50 | 1,12 | 1,47 | 1,16 | 1,22 | 1,40 | 1,22 | 1,33 | 1,22 | 1,40 |
| borda de estado, depois | 6,81 | 5,94 | 9,85 | 8,50 | 4,88 | 5,96 | 4,88 | 4,49 | 4,88 | 6,54 |
| texto marcado, antes | 5,65 | 5,49 | 8,24 | 7,63 | **4,44** | 4,67 | **4,44** | **3,63** | **4,44** | 5,15 |
| texto marcado, depois | 13,30 | 12,27 | 12,53 | 11,65 | 14,60 | 10,42 | 14,60 | 8,11 | 14,60 | 11,48 |

### Grupo 9. Botão primário do legado: preenchimento abaixo de 3:1 contra a superfície (E pela norma; o contrato pede mais)

- **Fonte:** CSV 4a, linha 2. São 5 pares:
  - ele E 2,27 e emp E 2,72;
  - pdv C, xsc C e res C 2,52 (dourado #c4993b sobre #F8FAFB).
- **Componente:** `components/components.css:455-459`.
- **Norma, com honestidade:** a **1.4.11 não exige** limite de 3:1 quando o rótulo identifica o botão. O preenchimento não é "informação necessária". O texto do botão passa.
- **O que o Marcos quer é mais:** o contrato DS-12 exige limite ≥3:1 (`docs/STATUS.md:64`), resolvido no piloto com borda neutra `--text-secondary` (5,60 a 7,47 contra a superfície, os mesmos números do Grupo 7).
- **Recomendação:** registrar no legado como **exceção com fundamento** e levar a exigência pela migração para o contrato Button. Pôr a borda no `.btn-primary` legado mudaria o visual do **ResultX Site**, que usa `.btn-primary` no escuro (CHANGELOG, tabela de consumidores) e lá já passa com 6,87. Se o Marcos quiser o legado no mesmo nível do contrato, a aplicação é `border: 1px solid var(--text-secondary)`, com aprovação visual (seção 5).

### Grupo 10. Bordas que a norma não exige (E)

| Pares | O quê | Por que é exceção legítima |
|---|---|---|
| 20 | `.btn-secondary` e `.btn-social` com `--border-default` (`components.css:466-470`, `:1959`) | o botão se identifica pelo rótulo; a 1.4.11 não exige limite |
| 10 | `.btn-ghost` transparente (`:472`), CSV 4a:4 | ghost é botão de texto por definição; o rótulo passa (`--text-secondary`) |
| 10 | segmented não marcado com borda transparente (`segmented.css:70`) | a opção se identifica pelo texto; quem precisa de 3:1 é o estado marcado (Grupo 8) |

Total: 40. Na página, trocar "pendente" por "exceção: o rótulo identifica o controle (WCAG 1.4.11)". Não é cor, é texto do catálogo.

### Grupo 11. Bordas decorativas dos selos (E)

- **Fonte:** CSV 4a:11 e seguintes. São 30 pares, `rgba(...,0.2)` sobre surface-1, de 1,24 a 1,63 (`components.css:693-697`).
- **Norma:** o selo **não é componente de interface**, e a borda não carrega informação. O texto (Grupo 5) e o ponto colorido carregam. Exceção legítima, sem mudança de cor. Opcional: retirar a borda, que não ajuda ninguém. É decisão de estilo, não de conformidade.

---

## 2. Efeito colateral: onde cada token é usado e se muda a identidade

Mapa de consumo (README "Consumidores conhecidos" e CHANGELOG "Impacto por consumidor"):

- **Electia:** `tokens` + `bridge` + `data-cards`. Conferido no `origin/main` `2ea388fd`, `src/app/globals.css:14,22,23`. **Não** importa `brands/electia/tokens` nem `components`.
- **Xscore:** só `brands/xscore/tokens`.
- **FinanceX:** `tokens` + `components` + `data-cards`, tema `premium-light`.
- **ResultX Site:** `tokens` + marca/ponte `resultx` + `components` (usa só `.btn-primary`/`.btn-secondary`).
- **IMO:** cópias por SHA de `pilot.scoped.css` e `pilot-aliases.css`, com `--color-error`/`--color-success` religados ao `eds-*` (`brands/emprega-mais/tokens/pilot-aliases.css`).
- **EditalHub:** só `eds-root.css`.
- **PdV:** não consome o pacote. O site PdV usa ou não estes arquivos? **Não verificado.**

| Mudança | eletia (app) | emprega+ IMO | emprega+ EditalHub | Xscore | FinanceX | ResultX Site | PdV | Identidade |
|---|---|---|---|---|---|---|---|---|
| G1/G2/G3: tintas e borda do PdV escuro | — | — | — | — | — | — | muda o PdV escuro (catálogo, arquivos da marca) | **sim, leve**: texto cinza puxado para o navy da marca; vermelho de erro mais claro; borda navy. Mantém navy, ouro e Sora/Inter |
| G4: vidro claro da eletia | nenhum (o app não carrega a folha da marca) | — | — | — | — | — | — | não: o vidro claro volta ao que os protótipos já mostram (17,81) |
| G5: papéis `*-text` novos + `.badge-*` | nenhum (não importa `components`) | nenhum (`eds`) | nenhum | nenhum | `.badge-*` só se usar; com o fallback, `premium-light` fica igual até definir o papel no tema. **Não verificado** se usa | nenhum (não usa selo) | catálogo | **leve**: o texto do selo escurece no claro (verde, âmbar e vermelho mais profundos, mesmo matiz). Preenchimentos e gráficos não mudam |
| G6: `.btn-danger` com `--text-on-error`; `--text-on-error` escuro | nenhum | nenhum | nenhum | nenhum | **nenhum** (`premium-light`: era #FFF e continua #FFF) | não usa | catálogo | no escuro, o botão de perigo cheio passa a ter texto escuro (padrão do Xscore) |
| G7: borda de `.form-input`/`.form-select` | nenhum | nenhum | nenhum | nenhum | **sim, ao subir de versão**: as bordas dos campos escurecem | não usa | catálogo | sim nos campos legados: borda mais marcada, igual ao contrato |
| G8: segmented marcado | nenhum | nenhum | nenhum | nenhum | só se usar (não verificado) | não usa | catálogo | leve: o texto marcado fica neutro; a borda ganha a cor da marca |

- **`eds-root.css` e `pilot-aliases.css` não são tocados por nenhuma proposta.** A janela do EditalHub (`docs/STATUS.md:147`) não entra em jogo, e `npm run check:eds-root` tem de continuar idêntico. As cópias do IMO também não mudam: o adaptador do piloto não é alterado. O PdV escuro se resolve na marca, sem tocar `pilot.css:34`.
- **Primitivos compartilhados:** nunca editar `primitives.color.rgb-*` (o nome codifica o valor e outros papéis apontam para ele). Criar primitivo novo e reapontar o papel semântico.
- **`dist/`:** a fonte é `tokens/tokens.json` (ADR-0003). Regerar `tokens/tokens.css`, `brands/*/tokens/tokens.css`, as pontes e `dist/*.min.css` pelo build, nunca editar os gerados. O `dist` é versionado (`CHANGELOG.md:795`).

---

## 3. Eletia clara a 1,63: token de vidro da marca ou ligação do componente?

**Resposta: é no token de vidro da marca, não na ligação do componente.**

Evidências:

1. **O componente usa o nome certo do núcleo.** `components/header-float.css:71` e `components/cta-dock.css:37` declaram `background: var(--glass-strong-bg)`. O comentário em `header-float.css:22` documenta "0,92 no claro", que é exatamente o `--glass-strong-bg` claro do núcleo (`tokens/tokens.css:400`).
2. **O núcleo sozinho dá certo.** Com núcleo + ponte + componentes, o vidro resolve como `rgba(255,255,255,0.92)` e mede 17,81 (`catalogo-legado-4b.md:163-165`). Recalculei: 17,81.
3. **Basta incluir a folha completa da marca para quebrar.** Mede 1,63 mesmo sem nenhuma folha do catálogo (`catalogo-legado-4b.md:166-167`). Logo, a ligação do catálogo e a vitrine estão descartadas.
4. **A origem é a marca.** `brands/electia/tokens/tokens.css:168` (fonte `tokens/tokens.json:7240`) redefine `--glass-strong-bg` escuro no `:root`. O bloco claro (`:198-227`; fonte `tokens.json:7447-7507`) não traz nenhum `glass-*`. Pela cascata (mesma especificidade, a folha da marca depois), o escuro vence.
5. **Esse valor no `:root` é redundante no escuro.** `rgba(22,27,38,0.85)` é idêntico ao vidro escuro do núcleo (`tokens/tokens.css:261`). O único efeito real dele é estragar o claro.

**Correção mínima:** declarar os seis `glass-*` claros em `brand.electia.light`, com os valores do núcleo (Grupo 4). Mudar o componente seria tratar o sintoma.

**Correção sistêmica, recomendada na mesma PR:** um teste que falhe quando um nome que existe no núcleo for redefinido no `:root` de uma marca sem ser redefinido também no `[data-theme="light"]` dela. Ele pegaria a eletia (`glass-subtle-bg`, `glass-strong-bg`, `glass-*-border`) e o PdV (`glass-*`, e também `--text-*`/`--color-error` quando o Grupo 1/2 entrar).

**Impacto em produção:** nenhum hoje. O app eletia não carrega `brands/electia/tokens` (globals.css acima) nem usa HeaderFloat ou CTADock do DS. Mas `./brands/*/tokens` é export público do pacote (`package.json`, `exports`), e qualquer consumidor que o importe com tema claro herdaria o 1,63. `demos/electia-copiloto.html:29` carrega essa folha, hoje só no escuro.

---

## 4. PdV claro: superfícies próprias ou composição?

**Hoje** a folha do PdV só redefine `--gold-ink` no claro (`brands/pdv/tokens/tokens.css:147-151`). Por isso as superfícies `--bg`/`--surface-*` continuam **navy** no claro para quem usar os nomes próprios do PdV. O catálogo só parece certo porque:

- inverte a ordem de carga (`scripts/catalog/build.cjs:126`);
- inverte o merge (`scripts/catalog/lib.cjs:61-65`);
- não liga nenhuma superfície no claro (`catalog/bindings.config.js:88-94`, `common: {}`).

Prova do risco: se a ordem fosse núcleo → marca, o vidro do PdV no claro daria **1,99** (texto #0F1729 sobre `rgba(28,42,74,0.85)` composto em #F8FAFB).

**Opções:**

| | A. Manter a composição como está | B. Declarar no PdV claro os valores neutros do núcleo | C. Superfícies claras próprias (quentes, puxadas para o ouro) |
|---|---|---|---|
| Visual | igual | **igual** (mesmos valores) | muda: marca nova no claro |
| Contraste | passa (4,61 mínimo nos contratos) | passa igual | precisa revalidar tudo (o `--gold-ink` #866425 tem 4,69 na tinta de tag, margem curta) |
| Risco de ordem de carga | **existe** | eliminado | eliminado |
| Exceções no catálogo | duas regras especiais para o PdV | removíveis | removíveis |
| Decisão do Marcos | aprovar "como está" | aprovação visual rápida (nada muda) | decisão de marca: paleta, referências, Canva "KPI light" |

**Recomendação: B agora, C só se o Marcos quiser um PdV claro com cara própria.**

B é declarar em `brand.pdv.light`, com os valores claros do núcleo:

- `bg` #FFFFFF, `surface-1` #F8FAFB, `surface-2` #F0F3F5, `surface-3` #E8ECF0, `surface-4`/`border` #D1D9E0;
- `text-primary` #0F1729, `text-secondary` #4B5563 (7,22 sobre surface-1), `text-muted` #5F6672 (5,53);
- `color-error` #DC2626;
- os seis `glass-*` claros.

Depois:

- ligar as superfícies do PdV também no claro em `catalog/bindings.config.js`;
- ligar o `--bg-surface-3` → `--surface-3` no escuro, que hoje falta e faz o PdV escuro herdar a surface-3 **grafite** `#1C2333` do núcleo no hover do piloto;
- remover os dois casos especiais em `lib.cjs`/`build.cjs`.

Isso transforma "composição por acaso de ordem" em "tema declarado". A faixa "a marca ainda não aprovou" sai quando o Marcos aprovar a tela. Para a opção C não há valor proposto aqui: seria inventar identidade sem referência da marca (Artigo IV).

---

## 5. Ordem de PRs sugerida (uma PR de cores por grupo coerente)

1. **PR-C1: vidro claro da marca (Grupo 4) e trava de cascata.**
   - Conteúdo: `brand.electia.light` com os `glass-*` claros, mais o teste "nome do núcleo no `:root` da marca exige par no claro". O teste vai falhar no PdV, e isso leva à C2.
   - Efeito em produto: nenhum. Cor nova: nenhuma.
   - Visual: só o catálogo da eletia clara. Pode seguir pela autorização "A" do DS (CI + Revisor).
2. **PR-C2: PdV declarado nos dois temas (Grupos 1, 2, 3 e a recomendação B da seção 4).**
   - Escuro: `color-error` #FF8A80, `text-secondary` #B4BED2, `text-muted` #A9B3C6, `border` #36508f.
   - Claro: espelho neutro do núcleo e `glass-*` claros.
   - Catálogo: ligações de surface-3 e do claro; fim dos casos especiais.
   - **Precisa de aprovação visual do Marcos** (identidade do PdV escuro). Fecha a pendência D do PdV escuro (`docs/STATUS.md:148`) e o aviso do PdV claro.
3. **PR-C3: papéis de texto dos estados (Grupo 5).**
   - Conteúdo: `--color-{success,warning,error}-text` no núcleo (primitivos novos), `.badge-*` com fallback e a versão do PdV escuro do `error-text`.
   - **Aprovação visual do Marcos**: tom dos selos no claro. Decidir também o aviso (`#8A4B0B`, mesmo matiz, recomendado; ou `#92400E`, igual ao Xscore).
4. **PR-C4: correções de aplicação no legado (Grupos 6, 7 e 8).**
   - Conteúdo: `.btn-danger` → `--text-on-error`, mais `--text-on-error` escuro #0B0E14; bordas de campo → `--text-secondary`; segmented marcado → borda `--accent-primary-text` e texto `--text-primary`.
   - Mexe em `components.css` distribuído: entra na tabela de impacto do CHANGELOG. O FinanceX muda as bordas de campo ao subir de versão.
   - **Aprovação visual do Marcos**: botão de perigo escuro com texto escuro e campos com borda mais marcada.
5. **PR-C5: exceções registradas (Grupos 9, 10 e 11). Sem cor.**
   - O catálogo troca "pendente" por "exceção com fundamento" nos 75 pares (40 + 30 + 5).
   - **Decisão do Marcos só no Grupo 9:** aceitar o primário do legado como exceção pela norma (recomendado) ou exigir a borda do contrato também no legado, o que muda o ResultX Site.

**Calendário:** a v2.11.0 corta a partir de 27/11 (DS-14). C1 e C2 não afetam consumidores e podem entrar antes. C3 e C4 mudam `components.css`: se entrarem antes do corte, o inventário de impacto da v2.11 tem de incluí-las. Se não, ficam para a seguinte.

**Gates por PR:**
- regerar a partir de `tokens.json`;
- `check:eds-root` idêntico;
- contraste do catálogo recalculado (o CSV do 4a e do 4b sem as linhas resolvidas);
- Visual Linux;
- Revisor.

**O que precisa de aprovação visual do Marcos:** C2 (PdV escuro e PdV claro declarado), C3 (tom dos selos e escolha do aviso), C4 (perigo escuro e borda de campo) e a decisão do Grupo 9 na C5. C1 não precisa: devolve o comportamento já visto nos protótipos.

---

## 6. Limites desta proposta

- Medição por estilo calculado e composição alfa, não por pixel. Não cobre hover, foco, animação ou o vidro sobre conteúdo em movimento. É a mesma ressalva dos relatórios do catálogo.
- Não verifiquei se FinanceX, o site do PdV ou outros consumidores usam `.badge-*`, `.form-input` ou o segmented. Tudo marcado "não verificado" acima.
- Os números "depois" assumem que as superfícies de cada marca não mudam. Se a C2 for feita depois da C3, os pares do PdV escuro já foram calculados com os valores novos.
