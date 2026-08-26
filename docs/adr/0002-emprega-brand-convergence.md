# ADR-0002 — A marca Emprega+ do sistema descreve um produto que não existe

- **Status:** Proposed
- **Date:** 2026-08-26
- **Related:** [ADR-0001](0001-role-named-tokens.md) — a gramática dos tokens · [brand-bridge.md](../brand-bridge.md) — o mecanismo que traduz marca em papel

> Escrito em pt-BR, como o `CHANGELOG.md` e o `CONTRIBUTING.md` deste repo. O ADR-0001 está em inglês; a divergência é dele, não deste.

## O que este ADR corrige na própria premissa

As notas de portfólio carregam este assunto como *"4 DSs paralelos, decidir a convergência"*. Medido, não são quatro pares em disputa. É **um sistema com cinco marcas, e dois produtos carregando a mesma paleta duplicada que não pertence a nenhuma delas** — nem à marca que eles nominalmente vestem.

A marca `brands/emprega-mais` deste repositório é consumida por **zero produtos**. O pacote é consumido por três (FinanceX, ResultX Site, Electia), e nenhum deles é Emprega+.

## Contexto — medido em 26/08/2026

> **Correção de medição (mesma data).** A primeira versão deste ADR mediu o `editais-ds.css` na árvore de trabalho `editalhub/app/`, parada na branch morta `docs/edital-hub-transition` — 532 linhas. O arquivo vivo, em `origin/dev`, tem **672 linhas e cinco commits à frente**, um deles alterando as próprias cores deste mapa (`style(ds): escurece gradiente de ação um shade`). Todos os números abaixo foram remedidos no arquivo certo. O erro foi pego pelo Executor, que bloqueou o mandato antes de tocar em qualquer arquivo. Vale como lembrete do guard-rail: **árvore de trabalho não é fonte de verdade — a branch remota é.**


Os três lugares onde a identidade Emprega+ está escrita hoje:

| | `brands/emprega-mais` (este repo) | IMO | EditalHub |
|---|---|---|---|
| Arquivo | `tokens/tokens.css` + `ds-bridge.css` | `public/css/emprega-ds.css` | `public/site/css/editais-ds.css` |
| Linhas | 159 + 128 | **3.571** | 672 |
| Tokens | 32 cores | 51 (`--eds-*`) | **0** |
| Cor de ação | `#c4993b` ouro | `#4f46e5` índigo | `#4f46e5` índigo, literal |
| Fundo | `#1B2A4A` navy escuro | `#ffffff` branco | branco, literal |
| Tema escuro | via sistema | próprio, reconstruído | não tem |
| Como carrega | pacote npm | `<link>` direto, sem build | `<link>` **opt-in**, não está em layout nenhum |
| Consumido por | **nenhum produto** | IMO em produção | telas de `/concursos/*` |

### Achado 1 — a marca do sistema e os produtos não têm uma cor em comum

Ouro sobre navy escuro contra índigo sobre branco. Nem o navy coincide: `#1B2A4A` no sistema, `#1c2444` no produto. Não é deriva de tom — são identidades diferentes, e a que está publicada como oficial é a que ninguém entrega.

### Achado 2 — o EditalHub é o IMO escrito à mão

Cruzando os hexadecimais do `editais-ds.css` contra **todos os valores** dos tokens `--eds-*` do IMO, normalizando forma curta (`#fff` = `#ffffff`) e olhando dentro dos gradientes:

| | |
|---|---:|
| Cores distintas no EditalHub | 33 |
| Que já são valor de um token do IMO | **25** |
| Exclusivas do EditalHub | 8 |
| Ocorrências totais | 157 |
| Ocorrências cobertas por token existente | **148** |

As 8 exclusivas são `#f1f3fb`, `#e9ecfb`, `#f6f7fb`, `#eef0f8`, `#eef2ff` (quase-brancos de fundo), `#a5b4fc` (índigo claro), `#f0c4c4` (rosa) e `#0e7490` (teal) — **9 ocorrências no total**.

Ou seja: **94% da tinta do EditalHub é a paleta do IMO, digitada de novo.** O cabeçalho do próprio IMO admite a origem — *"identidade navy + indigo, herdada do editais-ds"*. A herança aconteceu por cópia, e o IMO tokenizou; o EditalHub ficou literal.

### Achado 3 — o custo já é mensurável

Trocar o índigo da marca hoje exige: editar 51 tokens no IMO (1 ponto, é o que token resolve) **e** 12 ocorrências manuais só desse tom no EditalHub, sem garantia de que os dois terminem iguais. O EditalHub não tem tema escuro; o IMO construiu um por conta própria, fora do sistema que já resolve tema.

## Decisão

**1. A marca `emprega-mais` deste repositório é reescrita a partir da produção, não o contrário.**
O índigo sobre branco atende usuários reais em dois produtos; o ouro sobre navy não atende nenhum. Um design system que publica uma marca que ninguém veste está descrevendo uma intenção, não um sistema. A correção vai no sistema.

**2. O EditalHub ganha camada de token antes de qualquer mudança visual.**
Substituir os 141 usos por `var(--eds-*)` com os mesmos valores é mudança de **zero efeito visual** — os valores são idênticos. É o passo que torna todos os outros baratos, e é reversível.

**3. Os dois Laravel passam a ler um único arquivo de token.**
Hoje o bloco `:root` canônico está enterrado nas 3.571 linhas do IMO. Ele sai de lá, vira `brands/emprega-mais/tokens/` neste repo, e os dois produtos passam a carregar o mesmo arquivo.

**4. O alinhamento com o Electia é feito por escala e gramática, não por código compartilhado.**
Electia é React, os outros dois são Blade. Componente não atravessa essa fronteira — mas token, escala tipográfica, raio, sombra e espaçamento atravessam, porque são CSS. O alvo é parecerem a mesma família, não compartilharem implementação.

## Consequências

**Ganha-se**

- O sistema deixa de publicar uma marca fictícia — `brands/emprega-mais` passa a descrever o que existe
- Trocar a cor de ação do Emprega+ passa a custar uma linha, nos dois produtos ao mesmo tempo
- O EditalHub herda tema escuro sem construí-lo
- O `ds-bridge.css` passa a valer para os dois, e componente novo nasce servindo aos dois

**Paga-se**

- Uma versão minor do DS com mudança de valores na marca Emprega+ — nenhum consumidor atual do pacote é afetado, porque nenhum consome essa marca
- Uma passada mecânica de 141 substituições no EditalHub, revisável em diff
- Decisão pendente sobre 8 cores órfãs (9 ocorrências)

**Risco**

- O `emprega-ds.css` do IMO tem 3.571 linhas e aliases `--jl-*` de um piloto anterior. Extrair o bloco `:root` sem quebrar a camada de alias exige comparar seletor a seletor — é exatamente o guard-rail do `PAPEIS.md` sobre espelho de tokens.

## Alternativas rejeitadas

**A. Levar os dois produtos ao ouro sobre navy do sistema.**
Rejeitada: repinta dois produtos em produção para honrar uma decisão de token que nenhum deles participou. Custo alto, benefício nenhum além de coerência com um documento.

**B. Deixar como está e documentar a divergência.**
Rejeitada: a duplicação não é hipótese, é 148 ocorrências medidas. Documentar não para o relógio.

**C. Fazer os Laravel consumirem os componentes do Electia.**
Rejeitada: não é possível — componente React não renderiza em Blade — e não é necessário para o objetivo, que é semelhança visual.

## Não decidido — fica com o Marcos

1. **As 8 cores órfãs do EditalHub** (9 ocorrências): viram token novo na marca, ou são absorvidas por token existente?
2. **A fonte.** Os três produtos usam três famílias diferentes hoje. É a mudança de maior impacto visual por unidade de trabalho, e é decisão de marca.
3. **Até onde ir na direção do Electia** — igualar só a paleta e a escala, ou também a estrutura de página (barra lateral em vez de menu no topo).
