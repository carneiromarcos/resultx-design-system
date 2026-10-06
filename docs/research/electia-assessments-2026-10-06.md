# Protótipo Assessments, Testes criados e Ranking — ficha (06/10/2026)

Protótipo: [`brands/electia/previews/prototypes/electia-assessments-2026-10-06.html`](../../brands/electia/previews/prototypes/electia-assessments-2026-10-06.html). O comportamento está em `electia-assessments-2026-10-06.js`, na mesma pasta. Capturas: [`assets/electia-assessments-2026-10-06/`](assets/electia-assessments-2026-10-06/), com cada tela em claro e escuro, a 1440 e a 390 px.

O padrão é o do dashboard da #85. O protótipo é HTML estático e consome `dist/tokens.min.css`, `brands/electia/tokens/ds-bridge.css`, `dist/components.min.css`, `dist/icons.min.css`, `components/data-cards.css` e `dist/sidebar-overlay.js`. O CSS e o JS locais só compõem a página. O que falta no DS ficou marcado `CANDIDATO`. Nada mudou em `components/`, `tokens/` nem `dist/`.

A casca já usa o lote D (#86): `.sidebar-panel` mais a gaveta modal do `sidebar-overlay.js`, a sidebar AA e o `.test-mark`. Com isso, os contornos C1, C2, C11 e C12 do dashboard saíram.

## Pedido do Marcos (06/10)

1. Aperfeiçoar os cards de Assessments.
2. Resolver a mistura de **modelos** com **testes realizados**: os modelos ficam em Assessments, e uma página nova reúne os testes criados.
3. Ranking com abas melhores e "gráficos mais vivos".

## Mapeamento do app (lido sem editar, `emprega-mais/electia/src`)

| Tela | Arquivo | O que existe hoje |
|---|---|---|
| `/tests` (Assessments) | `app/(dashboard)/tests/page.tsx` | Título "Assessments", subtítulo "Envie testes para seus colaboradores e acompanhe os resultados." (L438-440). `TEST_CARDS` (L45-109): 6 comportamentais e o BAT. O BAT só aparece com flag + plano + profissional de saúde (ADR-018, L458-462). Card bloqueado pelo plano: pílula "Starter" e "Liberar com upgrade" (L473-496). "Aplicar" leva a `/tests/behavioral/{theory}/apply`; "Envio rápido" abre um modal com lista de colaboradores e "Gerar Link"; os dois fazem POST em `/api/tests/send`. Logo abaixo vêm **"Testes Situacionais"**, os módulos já criados (L558-625), e **"Forms"** (L627-717). |
| `/situational` | `app/(dashboard)/situational/page.tsx` | "Testes Situacionais · 4 módulos de avaliação organizacional". 4 cards de modelo com **"{n} teste(s) criado(s)"** (L108) e, abaixo, a lista **"Testes Criados"** (L116-168), com "{n} construtos · Respostas: {feitas}/{enviadas} · {status} · {data}". Sem filtro, sem prazo e sem progresso visual. |
| `/ranking` | `app/(dashboard)/ranking/page.tsx` | Toggle "Por fit ao cargo" / "Por desempenho (AD)" (L201-226), filtro só por departamento, KPIs e uma tabela com mini-barra colorida por limiar (L50-87). |

**De onde vem cada número**

- **"2 testes criados"** não está em `/tests`, e sim em `/situational`. É a contagem de linhas de `situational_modules` por `module_type`, com RLS, e conta **todos os status, inclusive arquivado**.
- **Respostas X/Y dos situacionais:** `module_invitations` (status `pending | in_progress | completed | expired`). O prazo é `expires_at = now + deadline_days` (padrão 7), em `api/situational/send/route.ts` L79-80.
- **Envios comportamentais:** `test_sessions`, com o mesmo vocabulário de status. `/tests` busca essa tabela (L222-226), mas **não a mostra**: ela só serve para marcar "Já enviado" no modal.
- **Fit do ranking:** `GET /api/ranking`. Junta `employees` com o último `test_results` e calcula `calculateMatch(...).overall_match` contra `roles.behavioral_profile`. O mesmo cálculo já devolve **`theory_matches` por teoria** (`lib/matching/index.ts` L20), que é o dado do "Fit por teste" do protótipo.
- **AD do ranking:** `GET /api/ranking/by-performance`. Usa a última `performance_reviews` concluída de cada pessoa, nota do gestor de 1 a 4.
- **Textos dos modelos:** `tests/page.tsx` L45-99 e `lib/types/database.ts` L281-299 (N1-N4). O N4 cria com `min_respondents: 5` (`create/page.tsx` L236), o envio com menos de 5 é bloqueado (`send/route.ts` L49-52) e a agregação também (`aggregate/route.ts`, `N_THRESHOLD = 5`).
- **Quantidade de itens:** o app não define um número por modelo situacional. A IA gera 8 itens por padrão e 20 no N4 (`api/situational/generate/route.ts` L102). Por isso o card diz "≈8 itens" / "≈20 itens".

## Decisões

### 1. Assessments vira o catálogo de modelos

- **Três blocos:**
  - **Comportamentais:** 6 modelos.
  - **Situacionais:** N1 a N4.
  - **Formulário próprio:** é o "Forms" do app; uma linha só, com "Criar formulário".
- **Saiu da tela tudo o que é teste realizado.** A lista "Testes Situacionais" (módulos criados) foi para Testes criados.
- **Card comportamental (`.model-card`, C16).** A assinatura é a **forma do teste** (`.test-mark`, 28 px) na **cor do teste** (C15), sobre um fundo levemente tingido. A mesma cor aparece numa faixa de 4 px no topo e na borda do hover. O card mostra:
  - nome, "24 questões · ~8 min" e a descrição do app;
  - uma etiqueta "o que revela" ("4 dimensões", "9 tipos · 3 centros");
  - o **uso** ("2 envios · 13 de 15 respostas"), que é um link para Testes criados já filtrado pelo modelo;
  - as ações **Envio rápido** (ghost) e **Aplicar** (primária), as duas do app.
- **O card não é mais um link inteiro.** Hoje o card inteiro é clicável e tem botões dentro dele. Isso aninha controles interativos e confunde o leitor de tela.
- **Card situacional.** O nível vira uma **escada de 4 barras**, preenchida até N1–N4: é ordinal e usa uma tinta só, o accent. O card traz o código, "≈8 itens" e "3 abordagens de resposta" (N1 e N3). O N4 tem a nota "Mínimo de 5 respondentes. Ninguém vê resposta individual." e um cadeado. A ação é **Criar teste**, porque o situacional é montado antes de ser enviado. O uso mostra "2 testes criados", o mesmo texto do app.
- **Hover:** sobe 2 px, ganha borda na cor do teste e a forma gira −12°, em 320 ms, como a decisão de 30/09. Com reduced-motion, nada se move.
- **Fora do protótipo:** o card bloqueado por plano ("Liberar com upgrade") e o BAT. O BAT continua condicionado como no app.

### 2. Página nova: **Testes criados**

- **Uma lista só para os dois mundos.** Cada linha é um envio comportamental ou um módulo situacional e mostra:
  - forma do teste ou escada do nível, título e "Comportamental · DISC" / "Situacional N4 · Termômetro Organizacional";
  - status (`.dl-status`);
  - respostas "10 de 12" com barra;
  - prazo ("09/10 · em 3 dias", "· venceu");
  - data de criação;
  - "Abrir", ou "Continuar" quando é rascunho.
- **KPIs:** Em andamento, Respostas pendentes, Prazo em até 3 dias (com os nomes dos testes) e Rascunhos.
- **Filtros numa linha acima da lista:** busca, Modelo (select agrupado em Comportamentais e Situacionais) e Status. A contagem "2 de 13 testes" fica numa região `role="status"`. O estado vai para a URL (`#testes-criados?modelo=n1&status=rascunho`) e o link de uso do card abre a página já filtrada. Filtro sem resultado mostra o estado vazio com "Limpar filtros".
- **Status unificado:**

  | Status | De onde vem | Estilo |
  |---|---|---|
  | Rascunho | `draft` | neutro, `.dl-status--draft` local |
  | Em andamento | `published` com convites abertos | `--in-progress` |
  | Encerrado | `closed`, ou envio com todas as respostas | `--done` |
  | Expirado | convites vencidos | `--blocked` |

  "Arquivado" fica fora da lista padrão, como o app já faz em `/tests`.
- **Termômetro (ADR-018 / ADR-014).** A linha mostra só a contagem de respostas. Um traço na trilha marca o mínimo de 5, e o texto diz "Anônimo · relatório abre com 5 (faltam 2)" ou "relatório disponível". Não há nome, resultado nem resposta individual.
- **Abaixo de 960 px,** a tabela vira lista de cartões (C22). O rótulo de cada célula vem de `data-label`.

### 3. Recomendação para o item de menu "Situacional"

**Recomendo que o item "Situacional" vire "Testes criados"**, na mesma posição do menu (logo abaixo de Assessments, rota sugerida `/tests/criados`). `/situational` passaria a redirecionar para `/tests/criados?tipo=situacional`. As alternativas ficaram atrás por estes motivos:

- **Sumir sem substituto:** os testes criados perdem a porta de entrada.
- **Virar filtro dentro de Assessments:** mistura modelo e realização de novo.
- **Manter "Situacional" e criar "Testes criados" ao lado:** deixa dois itens para a mesma coisa.

A criação de situacional (`/situational/create`) continua existindo e é aberta pelo "Criar teste" do card. O nome "Testes criados" vem do próprio app (o título da lista em `/situational`) e da frase do Marcos. **Precisa de confirmação do Marcos.** Alternativa de nome: "Aplicações".

### 4. Ranking

- **Abas:** `.tabs`/`.tab` do DS com o tablist APG do dashboard (C14). O teclado tem ←/→ e Home/End, a ativação é automática e o tabindex é móvel. A aba fica na URL (`#ranking` e `#ranking/desempenho`) e o indicador usa `--accent-primary-text`, sem transição de borda.
- **Por fit ao cargo:**
  - KPIs: Pessoas, Com fit calculado, Fit médio e Sem dados.
  - **Pódio (C18).** Os 3 primeiros aparecem com posição, fit e uma **tira de 6 colunas finas**, uma por teste, na cor do teste e com a forma embaixo. A altura é o fit naquele teste, e "–" marca o teste que a pessoa não fez. Um texto `sr-only` lê os valores.
  - **Fit por teste (C19).** Uma barra horizontal por teste na cor e com a forma do teste, mostrando a média do recorte. Quando há filtro de departamento, um **traço** marca a média da empresa (sem filtro o traço não aparece, porque repetiria a barra). Há legenda, dica no hover e uma tabela "Ver como tabela" (`.disclosure`).
  - **Distribuição do fit (C20).** Histograma de uma série em 4 faixas (Baixo <40, Moderado 40–59, Bom 60–79, Alto ≥80), os mesmos limiares do app, com o valor em cima de cada coluna.
  - **Tabela.** Posição, colaborador e cargo, departamento, **testes feitos** (as formas coloridas mais o nome em `sr-only`) e fit com barra. Quem não tem dado vai para o fim, com o motivo ("Sem teste" ou "Cargo sem perfil-alvo").
  - O **filtro por departamento** fica: fit não é Performance.
- **Por desempenho (AD):** KPIs, distribuição da nota em 4 faixas (<2,0 · 2,0–2,4 · 2,5–3,4 · 3,5–4,0), uma nota "Como ler" e a tabela com a última AD (link) e a nota com barra de 1 a 4. **Sem departamento em nenhum lugar da aba**: o recorte é **por cargo**.
- **Cor:** as barras de uma série só (fit, nota, histograma, progresso) usam **uma cor**, o accent em `--accent-primary-text`. A cor categórica é reservada aos testes, então o filtro nunca repinta uma série. O verde, o âmbar e o vermelho dos limiares do app ficaram de fora: limiar não é status.

### 5. Paleta dos testes (C15)

Os matizes vêm do app (`viz-tokens.css`, `--theory-*`). A luminosidade foi reajustada até passar no validador da skill `dataviz` (faixa de L, croma, separação CVD e 3:1 contra a superfície). A paleta original do app **reprova**: DISC × Tipologia ficam com ΔE 3,2 (deutan) e 14,8 em visão normal, abaixo de 15, e o Eneagrama dá 2,73:1 no claro.

| Teste | Forma | Claro | Escuro |
|---|---|---|---|
| DISC | círculo em 4 | `#0086dd` | `#069ce4` |
| Tipologia Cognitiva | quadrado | `#773ac1` | `#8347cf` |
| Eneagrama | eneágono | `#b97515` | `#c58501` |
| Big Five | pentágono | `#197037` | `#1d7d3e` |
| Temperamentos | triângulo vazado | `#c94363` | `#d8516a` |
| Motivadores | hexágono | `#009c9c` | `#12a7a7` |

O validador deixa um único **WARN**: Temperamentos × Big Five com ΔE 7,5 (protan) no claro e 7,2 no escuro. Esse valor está na faixa de 6 a 8, permitida com codificação secundária. Aqui ela existe sempre: a forma e o nome andam junto com a cor. A cor nunca pinta texto.

**Restrição:** as marcas valem sobre `--bg-base`. Sobre `--bg-surface-3` o roxo escuro cai para 2,82:1, e por isso os gráficos ficam em `.panel` (fundo base).

## Achados (o app expõe; o protótipo não reproduz)

1. **A aba AD do ranking usa departamento.** Ela tem filtro por departamento e coluna "Departamento" (`ranking/page.tsx`). Isso contraria a regra "Performance nunca usa dados de departamento". No protótipo o recorte é por cargo e não há a coluna.
2. **O ranking AD ordena pessoas pela nota do gestor e numera "#".** A ADR-039 (evidência de D1/D6) diz que ranking ligado a nota distorce mais que coaching. Mantive a ordem para não mudar a funcionalidade sem decisão, mas com a nota "não para decidir bônus". **Decisão do Marcos:** manter o ranking numerado, ou trocar por "lista ordenada por nota, sem posição".
3. **Nenhum ranking de clima ou saúde.** O `/ranking` do app não ranqueia Bem-Estar nem o Termômetro. Confirmado no código.
4. **O texto de Temperamentos difere.** O card de `/tests` diz "4 perfis clássicos de temperamento com subtipos…", e o catálogo (`behavioral-catalog.ts` L130, que a página de aplicar usa) diz "…+ 12 misturas — 16 perfis no total". O protótipo usa o do catálogo.
5. **"N testes criados" conta os arquivados,** mas a lista de `/tests` os esconde. No Testes criados proposto, o contador e a lista seguem a mesma regra.
6. **Não há mapa único de status em português** para convites e sessões. Só existe um mapa local em `admin/page.tsx` L927.
7. **Envio comportamental não tem identificador de lote.** `test_sessions` guarda uma sessão por pessoa, e a "linha de envio" do protótipo pressupõe agrupar por teste + remetente + momento do envio. Ver Suposições.

## Candidatos a componente (continuação da numeração do dashboard)

| # | Candidato | Prioridade | Por quê |
|---|---|---|---|
| C15 | Tokens `--test-*` (categóricos por teste, claro e escuro) na ponte do Electia e no app | **Alta** | Hoje são 4 mapas. As `.badge-disc`/`-bigfive` do DS pintam com outra paleta, e a `--theory-*` do app reprova o validador |
| C16 | `.model-card` (assinatura com forma, faixa na cor do teste, ficha, uso e ações) | **Alta** | Catálogo de modelos do Electia; serve também ao IMO (provas) |
| C17 | `.filter-bar` (busca + selects + limpar, uma linha, estado na URL, contagem `role="status"`) | Média | Repete em toda lista do app |
| C18 | `.podium` + `.strip` (top 3 com a contribuição por categoria) | Média | Ranking; pode servir ao Xscore |
| C19 | `.bar-list` (barra horizontal rotulada com marcador de referência) | **Alta** | Testes por tipo do dashboard, Fit por teste e Matching usam o mesmo desenho |
| C20 | `.histogram` (faixas ordenadas, uma série, valor no topo, rótulos de faixa) | Média | Distribuições de fit, AD e notas |
| C21 | `.viz-tip` (dica de gráfico conforme a WCAG 1.4.13: ancorada à marca, aceita o ponteiro, não some por tempo, fecha com Escape sem mover o foco; o dado também fica no texto ou na tabela) | Média | O DS só tem `.dl-tooltip-callout` estático |
| C9b | Região de toasts **dentro** da gaveta (`.toast-region-gaveta`), usada enquanto ela está aberta | **Alta** | Com a gaveta aberta, o `sidebar-overlay.js` deixa inert tudo o que é irmão dela, inclusive a região de toasts do `<body>`. O aviso não era lido nem visto |
| C22 | `.stack-table` (tabela vira cartões abaixo de 960 px, com `data-label`) | **Alta** | Toda tabela do app rola na horizontal no celular |
| — | `.level-mark` (escada N1–N4) | Baixa | Só situacional |
| — | `.dl-status--draft` (neutro) | Baixa | O DS não tem o estado "rascunho" |

## Defeitos do DS encontrados (contornados localmente)

1. **Não há `a:focus-visible` global.** Um link solto (no texto, `.app-brand`, links de tabela) só recebe o anel do navegador (`outline: auto 1px`). Achado via CDP: nenhuma regra do DS casa. O contorno local aplica o anel dos botões e, na sidebar, `--sidebar-focus-ring`.
2. **`.skip-link` é `absolute` e anima `top`.** Quando o Tab dá a volta com a página rolada, o link focado ficava fora da vista (top −377 px). O contorno local usa `position: fixed` sem transição. Animar `top` também contraria a regra de só animar propriedades do compositor.
3. **O anel de foco de `.form-input`/`.form-select` anima** o `box-shadow` de 0 até a cor. Os quadros iniciais medem 1,3–1,4:1 no escuro. O contorno local tira a transição dos campos de filtro.
4. **`.sr-only` dentro de `.dl-table-wrap` vaza a rolagem.** O wrap rola, mas não é bloco de contenção, e o `<th>` com `sr-only` dava +39 px de rolagem horizontal na página a 768 px. O contorno local põe `position: relative` no wrap.
5. **`--accent-primary` como preenchimento de dado dá 2,5:1 no escuro,** abaixo de 3:1. Afeta `.progress-fill` e as barras de série única. O contorno local usa `--accent-primary-text`. Sugestão: um token `--viz-series` por tema.
6. **A troca de tema passa pelas cores do tema anterior.** O rótulo da aba medido em 2,12:1 no escuro durante os 150 ms da transição. O contorno local desliga transições por 2 quadros na troca. O `dist/theme-toggle.js` deveria fazer isso.
7. **O indicador da `.tab.active` em `--accent-primary`** continua com 2,39:1 no escuro (defeito 10 da ficha do dashboard, ainda aberto).
8. **`.badge-disc`, `.badge-bigfive` etc. pintam o teste** com uma paleta própria que difere da do app e da regra (ver C15).
9. **A gaveta modal do DS e a região de toasts não combinam.** O `sidebar-overlay.js` aplica inert em todos os irmãos do painel, exceto o scrim. Uma região `role="status"` no `<body>` fica muda e inerte enquanto a gaveta está aberta. O DS precisa de um padrão: região de avisos dentro do painel, ou uma lista de exceções do inert. Contorno local: C9b.
10. **Um skip-link `href="#conteudo"` colide com o roteador por hash.** O `#conteudo` desconhecido levava à tela padrão. Contorno local: o clique é tratado no script, que foca o h1 da tela atual sem tocar na URL. Vale como diretriz junto da C13: em app com rota por hash, o pulo não pode depender do fragmento.

## Suposições

- **Os dados são fictícios** e batem com o dashboard: 52 envios e 37 respostas comportamentais (DISC 13/15, Tipologia 6/9, Eneagrama 5/8, Big Five 6/8, Temperamentos 3/5, Motivadores 4/7).
- **A linha de envio comportamental agrupa as sessões** de um mesmo teste, remetente e momento. O app precisaria de um `batch_id` (ou equivalente) em `test_sessions` para isso.
- **O prazo do envio comportamental** usa o `expires_at` da sessão, por analogia com `module_invitations`.
- **O fit por pessoa no protótipo** é a média simples dos `theory_matches`. O app pondera as 6 teorias.
- **O texto de "o que revela"** ("4 dimensões", "16 tipos"…) é derivado das descrições do app.
- **O nome "Testes criados" e a rota `/tests/criados`** são propostas a confirmar.

## Rodada 2 — correções pedidas pelo Revisor na PR #88

| # | Achado | Correção |
|---|---|---|
| P2 | O skip-link `#conteudo` trocava a tela: de Ranking, ia para Assessments | O handler do `[data-skip]` faz `preventDefault`, foca o h1 da tela visível e o rola para a vista. A URL, a aba e os filtros não mudam. Sem JS, o `#conteudo` nativo continua valendo |
| P2 | O toast de `data-fora` ficava inerte com a gaveta aberta | Segunda região `role="status"` **dentro** da gaveta (C9b). `avisar()` escreve nela quando `#app-nav[data-open]` existe e na do `<body>` quando não existe. A troca da gaveta limpa as duas |
| P2 | A dica dos gráficos não fechava com Escape, não aceitava o ponteiro e acompanhava o cursor | A dica fica ancorada à marca, sem `pointer-events: none`, e só fecha 300 ms depois que o ponteiro sai da marca e da dica. Não há timeout enquanto o ponteiro está sobre elas. Escape fecha sem mover o foco, e a dica só reabre quando o ponteiro sai e volta. Na rolagem, ela acompanha a marca |
| P3 | ⌘K/Ctrl+K anunciado sem handler | Removi `aria-keyshortcuts` e o `<kbd>`. O Nexus fica fora deste protótipo, e um atalho sem efeito seria uma promessa falsa. O dashboard (#85) tem o painel e o atalho |

Provas novas (`rev.mjs`, **16/16**):
- **Skip-link nas 4 telas** (Assessments, Testes criados com `?modelo=disc`, Ranking por fit e Ranking AD), a 1440 e a 375, com a página rolada. O primeiro Tab cai nele e o link fica visível. Depois do Enter, o hash, a tela, a aba e o filtro são os mesmos, e o foco está no h1 da tela atual, visível abaixo do header.
- **Toast com a gaveta aberta, a 1024 e a 375:**
  - não fica sob `[inert]`, tem `aria-live="polite"` e está dentro da gaveta;
  - fica inteiro na tela e por cima (`elementFromPoint`), com a gaveta ainda aberta e o foco dentro dela;
  - na árvore de acessibilidade (CDP), o texto "fica fora" aparece sob um `status` não ignorado.
- **Toast com a gaveta fechada:** a região do `<body>`, fora de inert.
- **Contraste do texto do toast e da dica:** 17,87:1 no claro e 16,35:1 no escuro.
- **Dica, claro e escuro:**
  - abre no hover e aceita o ponteiro sobre ela;
  - continua visível depois de 3,5 s;
  - Escape fecha, com o foco ainda no `#rk-depto`;
  - não reabre na mesma marca, reabre depois de sair e voltar, e fecha ao sair.
- **Atalho:** zero `aria-keyshortcuts`, zero `<kbd>`, e Ctrl+K não muda nada.
- **Console:** zero erros e avisos.

Captura: `assets/electia-assessments-2026-10-06/gaveta-toast-375-claro.png`.

## Medições (Playwright, Chrome do sistema, `channel: 'chrome'`, `file://`; scripts no scratch)

- **Overflow e contraste (56/56):** 4 telas (Assessments, Testes criados, Ranking fit, Ranking AD) × 7 larguras (320, 375, 390, 768, 1024, 1440, 1920) × 2 temas.
  - Sem overflow horizontal.
  - Todo texto visível ≥ 4,5:1 (≥ 3:1 para texto grande), com as cores resolvidas no canvas, inclusive `color-mix`/oklch.
  - Todas as marcas gráficas ≥ 3:1 contra o fundo real: `.test-mark`, barras, colunas, progresso, escada, traço de referência e mínimo do N4. São até 96 marcas por tela.
- **Teclado e comportamento (35/35):**
  - Abas: → ativa AD, foca e troca painel e URL; → circula; Home/End; Tab entra no painel (filtro); Shift+Tab volta à aba ativa; a aba inativa fica fora da ordem; o clique ativa e foca; recarregar mantém a aba.
  - A aba AD não tem nenhum rótulo ou coluna de departamento.
  - Filtro por departamento: os dados mudam e a cor da série não, e o traço da empresa aparece.
  - Link de uso do card → Testes criados filtrado, com foco no h1.
  - Status filtra e grava na URL; o estado vazio esconde a tabela; "Limpar" volta aos 13 e foca a busca; a busca por texto funciona.
  - N4: as linhas não têm nome e trazem o traço do mínimo de 5.
  - **Foco visível ≥ 3:1 e na vista em toda a ordem de Tab:** 3 telas mais AD, claro e escuro, 1440 e 390. São 18 a 44 paradas por tela.
  - Gaveta a 390: é modal e o foco entra nela; Escape devolve o foco ao gatilho; o item navega, fecha a gaveta e foca o h1.
  - Reduced-motion: sem animação de barras, colunas nem do card.
  - Contraste do rótulo da aba durante a troca: mínimo de 7,22:1 no claro e 5,89:1 no escuro, amostrado a cada 15 ms.
  - Zero erros e zero avisos no console.
- **Repositório** (refeito na rodada 2): `npm test` deu 634/634, `npm run lint` passou limpo e `npm run build` não gerou diff em `dist/`. As 56 combinações (overflow e contraste) e as 35 provas de teclado continuam passando depois das correções.
- **Paleta:** `validate_palette.js` da skill `dataviz` no claro (superfície `#ffffff`) e no escuro (`#0B0E14`). Passa em faixa, croma, visão normal e 3:1, com o único WARN de CVD citado.
