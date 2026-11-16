# Catálogo de todas as marcas — levantamento e proposta (etapa 0)

Data: 16/11/2026. Base: origin/main e80d611e80f07bc883a7d3524f382f4716679b0b (#129). Branch feat/ds-catalogo. Somente pesquisa, sem código e sem commit. Não foi usado o checkout principal como fonte dos arquivos. A estrutura abaixo é proposta para decisão de arquitetura e UX, não autorização para implementar.

Escopo fechado por Marcos: **eletia**, **emprega+** (IMO e EditalHub como produtos dessa marca), **Xscore**, **PdV**, **ResultX**. Fora: Catholic Hub e Saúde. Sem nova cor nem mudança de valor de token antes de 10/12; v2.11.0 não antes de 27/11. O rótulo público eletia não exige renomear agora o diretório/export legado `electia`, que é API de consumo.

## 1. O que existe e o que é publicado

- `docs/viewer.html`: catálogo HTML manual com imports de `dist/tokens.min.css` e `dist/components.min.css`, navegação de famílias, demos e link de marca ResultX. Não lê contracts/*.yaml nem gera sua lista a partir dos componentes. Declara fontes via Google Fonts; ainda traz referências antigas de versão.
- `demos/`: 15 páginas HTML, incluindo dashboard, app-shell, employer-jobs, employer-job-applicants, candidatos, filtros, inbox-panel, triagem, login, 404, landing-kit, brand-orb, positioning-wheel e electia-copiloto. São exemplos manuais; não são as aplicações IMO/eletia em execução nem prova de adoção.
- `tokens/themes/preview.html`: demonstra temas premium-light/sober-dark/vibrant-dark e camada `.dl-*`; não é catálogo por marca. Usa sete faces WOFF2 locais em `assets/fonts`. Inclui estilos próprios e valores literais de apresentação.
- `examples/pilot.html`: vitrine dos oito contratos com estados, links, diálogos e scripts de comportamento. É o exemplo mais próximo do catálogo executável; não está publicado pelo workflow atual.
- `.github/workflows/pages.yml`: build, cópia de dist/tokens/components/docs/demos e **somente brands/resultx**. A raiz redireciona a docs/viewer.html. Não copia adapters/, examples/, contracts/, generated/ nem assets/fonts/.
- `scripts/contracts/generate-cards.js`: gera oito fichas Markdown em generated/component-cards a partir dos YAML; não gera o site e não integra o comando build atual. As 30 fichas de docs/components são manuais, totalizando 38 documentos a reconciliar (não 38 componentes únicos).

Verificação HTTP do site publicado em 16/11:

| URL relativa ao GitHub Pages | Resultado |
|---|---|
| docs/viewer.html | 200 |
| tokens/themes/preview.html | 200 |
| brands/resultx/previews/brand-system.html | 200 |
| brands/electia/previews/brand-system/index.html | 404 |
| examples/pilot.html | 404 |
| assets/fonts/inter/Inter-Regular.woff2 | 404 |

Logo, a página de preview pode responder 200 e ainda não carregar as fontes locais. Verificação de HTML/HTTP não equivale à inspeção visual completa. Base pública: https://carneiromarcos.github.io/resultx-design-system/ . Não foram gerados PNGs ou baselines nesta etapa.

## 2. Fonte e inventário de tokens por marca

Fonte do build: `tokens/tokens.json` em DTCG (primitives, semantic e brand) e layouts estruturais em `tokens/dtcg/layouts/`. As folhas `brands/*/tokens/tokens.css` são saídas geradas por `scripts/build-brand-tokens.mjs`. Os tokens.json históricos dentro das marcas NÃO são a fonte do build; o README do DTCG registra a pendência. Xscore não tem esse JSON legado, mas está presente no DTCG central.

As quantidades abaixo contam nomes declarados no bloco :root e overrides explícitos no bloco [data-theme="light"], removendo comentários; não são quantidade de cores únicas nem prova de acessibilidade. Fontes, raios e sombras sem override claro herdam o :root. Todas as marcas são dark-first nessa folha; isso não obriga o produto emprega+ a nascer escuro.

| Marca (diretório) | :root / overrides light | Cores e superfícies | Fontes disponíveis como tokens | Raios | Sombras e claro |
|---|---:|---|---|---|---|
| eletia (`electia`) | 127 / 16 | purple e escalas, superfícies/textos; claro explícito | --font-heading Sora; --font-body Inter; mono pode vir do núcleo JetBrains Mono | --radius-sm/md/lg/xl/2xl/full: 4/8/12/16/24/9999 px | --shadow-sm/md/lg e --glow-brand/lg; light não redefine sombras |
| emprega+ (`emprega-mais`) | 86 / 20 | --emp-indigo*, gold, --emp-bg/surface/text/error/success etc.; claro explícito | --emp-font-heading Sora; --emp-font-sans Inter; --emp-font-mono JetBrains Mono | --emp-radius-sm/md/lg/xl: 10/12/16/20 px | --emp-shadow-sm/md/lg; há overrides claros dos três; glows existentes |
| Xscore (`xscore`) | 87 / 35 | gold de ação, intel de inteligência, superfícies, estados e faixas; claro explícito | --font-heading Sora; --font-body Plus Jakarta Sans; --font-mono Geist Mono com fallback JB Mono | --radius-sm/md/lg/xl/full: 6/10/14/20/999 px | --shadow-sm/md/lg/gold; overrides claros dos quatro |
| PdV (`pdv`) | 89 / 1 | gold, navy e superfícies dark; light só redefine --gold-ink | --font-heading Sora; --font-body Inter; mono pode vir do núcleo | --radius-sm/md/lg/xl/2xl/full: 4/8/12/16/24/9999 px | --shadow-sm/md/lg e glows; sem override claro |
| ResultX (`resultx`) | 87 / 19 | --rx-gold*, purple atmosférico, superfícies/textos; claro explícito | --rx-font-heading Sora; --rx-font-body Inter; --rx-font-mono JB Mono | --rx-radius-sm/md/lg/xl: .25/.5/.75/1 rem | --rx-shadow-sm/md/lg com overrides claros e glows próprios |

Evidência: `brands/{diretório}/tokens/tokens.css`. Os cinco diretórios também têm `ds-bridge.css`. Emprega+ adicionalmente tem `eds-root.css` + SHA e `pilot-aliases.css` + SHA. Estes últimos são específicos do consumo do IMO; não usar uma ponte --eds-* como ponte universal das cinco marcas. Não alterar nenhuma dessas saídas à mão.

### Mapeamentos que faltam

As pontes geradas em `scripts/build-brand-bridges.js` traduzem principalmente accent, texto sobre accent, chart, foco e sidebar (18 papéis nas marcas em geral; PdV não tem o par accent-secondary). **Não traduzem todas as superfícies, fontes, raios e sombras**. Carregar core + brand + bridge não prova que o componente adotou toda a marca: nomes --emp-* e --rx-* não são os --bg-surface-1/--font-body/--radius-md consumidos pelo adaptador. Eletia, Xscore e PdV usam nomes parcialmente coincidentes, sujeitos à especificidade da cascata do núcleo.

É necessário um binding explícito marca/tema, gerado da fonte existente: superfícies/texto/borda, fonte, raio, sombra e movimento. Deve respeitar a cascata e comparar estilos computados. Isso pode ser feito com aliases e seleção de valores já existentes; **não pressupõe inventar valor**.

PdV claro exige decisão de UX: a folha de marca só oferece --gold-ink claro. Proposta mínima: usar as superfícies/textos claros já existentes no núcleo e manter identidade de acento/tipografia, sem alterar o valor de --bg escuro de PdV. Não apresentar essa composição como tema PdV claro já aprovado. Se UX exigir superfícies claras exclusivas inexistentes, esse requisito passa a “falta valor” e fica bloqueado até 10/12.

Assets de fonte: o DS versiona Inter, Sora e JetBrains Mono em assets/fonts, com subconjunto de pesos. Plus Jakarta Sans e Geist Mono do Xscore não estão nessa pasta. São **assets faltantes de valores de fonte já existentes**, não nova cor/token; obter arquivos oficiais fixos/licenças e conferir pesos, se a arquitetura aprovar essa distribuição. Não aceitar fallback silencioso ou rede externa como prova visual.

## 3. Matriz marca × componente/ficha

**Unidade de contagem:** cada arquivo das duas pastas pedidas, 30 fichas manuais + 8 geradas = 38. Há sobreposição entre famílias e contratos; não somar como 38 componentes independentes. Uma ficha agrupada só é pronta se todas as famílias/variantes nela couberem no binding escolhido. As subfamílias são listadas no apêndice, para não esconder os dez data-cards numa contagem de um.

- **P — pronto:** sem binding específico pendente para a marca/tema nas duas aparências.
- **M — falta mapeamento:** valores existentes permitem uma composição candidata; falta binding consistente de papéis e cenários/variantes ao catálogo. Não significa ausência do CSS ou necessidade de novo token.
- **V — falta valor:** requisito não representável com valor existente comprovadamente identificado; bloqueado até 10/12. Não confundir falta de fonte WOFF2, de receita HTML ou de teste com falta de valor.

Resultado conservador do levantamento: **P=0, M=38, V=0 comprovados por marca**. O bloqueio comum é a ausência do binding completo multimarcas; não é uma reprovação de 190 componentes. Não há teste executado de contraste em todas essas combinações, portanto “V=0” não significa que o catálogo inteiro está aprovado ou que não surgirão bloqueios. O caso PdV claro permanece condicional à escolha indicada acima. Sem essa decisão, não declarar pronto.

| Fonte/componente ou família | eletia | emprega+ | Xscore | PdV | ResultX | Dependência específica além do binding comum |
| `docs/components/badges.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/brand-orb.md` | M | M | M | M | M | Manter variantes de marca existentes; ResultX sem agente/orb próprio, exibir como componente do núcleo, não assinatura da marca. |
| `docs/components/buttons.md` | M | M | M | M | M | Distinguir .btn do legado e .rx-button do contrato, incluindo links e novos estados. |
| `docs/components/cards.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/composite.md` | M | M | M | M | M | Padrões compostos; cenários de dados fixos e interações precisam de receita declarada. |
| `docs/components/conversation.md` | M | M | M | M | M | Message, áudio e composer: incluir CSS/JS de origem e estados reais, sem copiar implementação. |
| `docs/components/cta-dock.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/cta-panel.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/data-cards.md` | M | M | M | M | M | 10 componentes .dl-*; carregar CSS separado e mapear tokens de dados/gradientes, não herdar tema opt-in por coincidência. |
| `docs/components/disclosure.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/empty-state.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/forms.md` | M | M | M | M | M | Estados e mensagens; não basta mostrar inputs vazios. |
| `docs/components/header-float.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/icons.md` | M | M | M | M | M | Biblioteca SVG neutra; incluir wrappers, estados e cores semânticas, não apenas currentColor. |
| `docs/components/layout.md` | M | M | M | M | M | Incluir avisos de deprecated e testar overflow por viewport. |
| `docs/components/list-item.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/menu-drawer.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/modals.md` | M | M | M | M | M | Diálogo legado e contrato ConfirmDialog são implementações distintas. |
| `docs/components/navigation.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/progress.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/segmented.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/split-pane.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/stage-chip.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/stats.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/tables.md` | M | M | M | M | M | Não prometer ordenação/seleção apenas pelo CSS; receita com semântica e teclado. |
| `docs/components/test-mark.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/theory.md` | M | M | M | M | M | Famílias de avaliação são domínio opcional; não reinterpretar cores de teoria como pigmentos da marca. |
| `docs/components/toast.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/tooltip.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `docs/components/zone-distribution.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `generated/component-cards/button.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `generated/component-cards/card.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `generated/component-cards/confirm-dialog.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `generated/component-cards/data-table.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `generated/component-cards/empty-state.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `generated/component-cards/field.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `generated/component-cards/stat-card.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |
| `generated/component-cards/status-badge.md` | M | M | M | M | M | Consumir o CSS/contrato correspondente e enumerar seus estados/variantes. |

### Subfamílias das fichas agrupadas (índice de escopo)

- `docs/components/composite.md`: View Toggle; Data Table (Enhanced); Filter Bar; Stepper / Wizard; Pipeline Kanban; Search Autocomplete; Date Range Display; Sparkline; Template Reference.
- `docs/components/conversation.md`: Message; Audio player; Composer; Accessibility across the three; See also.
- `docs/components/data-cards.md`: Índice; 1. StatCard; 2. Coin; 3. Delta pill; 4. Chart shell; 5. Donut; 6. Compact data table; 7. Sparkline; 8. Avatar stack; 9. Status pill; 10. Tooltip callout; Theme awareness; Accessibility; Onde já está em uso.
- `docs/components/layout.md`: Layout Templates Overview; Split Content Layout (List + Detail); Centered Layout; Split Layout (Auth with Hero); Fullwidth Layout; Dropdown (Positioning); HTML Usage; Tokens Used; Do / Don't.
- `docs/components/navigation.md`: Sidebar; Header; Tabs; Breadcrumb; Dropdown; HTML Usage; Tokens Used; Do / Don't.
- `docs/components/progress.md`: Component Anatomy; Progress Components; DISC Progress Fills; Stat Progress (inside Stat Cards); Chart Card Components; HTML Usage; Tokens Used; Do / Don't.
- `docs/components/stats.md`: Component Anatomy; Components; Mini Stat Card; HTML Usage; Tokens Used; Do / Don't.
- `docs/components/theory.md`: Component Anatomy; Components; MBTI Axis Bars; Enneagram Mini Cards; DNA Badges; Compare Banner; HTML Usage; Tokens Used; Do / Don't.

## 4. Conflitos e decisões que precisam de reconciliação

1. **Nomenclatura e documentação de marca:** brands/README.md é datado de 11/05. A árvore descreve Electia roxa, enquanto a regra-chave 3 descreve teal; ambas usam o nome antigo. O CSS gerado atual é purple e o nome público aprovado é **eletia**. README principal ainda contém hierarquia/versões históricas (inclui referência a Poppins/Roboto), enquanto ResultX tokens atuais declaram Sora/Inter/JB Mono. Não usar essas descrições como fonte do render.
2. **Previews têm tokens privados:** amostragem automatizada de declarações custom properties em HTML, comparada com os arquivos CSS em tokens da mesma marca, encontrou:
   - `brands/electia/mockups/bat-card.html:14-18`: --viz-card-padding, --viz-card-radius, --viz-card-border e --viz-card-shadow definidos no HTML, inclusive valores oklch. Não os promover automaticamente à fonte comum.
   - `brands/emprega-mais/design-system-preview.html:10-14`: --navy #1B2A4A, --gold #D4AF37, --gray #8899AA, --gray-lt #F4F6F8; o token file atual usa --emp-* e a identidade de produto índigo. O HTML é referência histórica, não fonte para sobrescrever a marca.
   - `brands/pdv/previews/brand-preview.html:15-16,37,41`: --gold-glow, --gold-glow-strong, --border-gold e --glass-bg-strong próprios do preview. templates sociais também definem --brand-dark local. Mesmo nome/valor no preview não torna o HTML fonte do DTCG.
   - ResultX não apresentou exemplo correspondente nessa busca restrita a cores/dimensões custom properties; isso não prova ausência de qualquer literal ou estilo privado.
   Trata-se de nomes/declarações ausentes nos CSS de tokens da respectiva marca; alguns valores podem já existir sob outro nome no núcleo. Antes de chamar de “falta valor”, buscar equivalência na fonte central e decidir o alias. Um visual exclusivo de HTML com valor sem equivalente não entra no catálogo canônico antes de decisão e da janela de 10/12.
3. **Marcas não são cinco temas opt-in:** premium-light/sober-dark/vibrant-dark são temas do núcleo, não sinônimos de emprega+, Xscore e eletia. Não escolher um desses temas por semelhança de cor e declarar adoção da marca.
4. **PdV claro incompleto como folha autônoma:** só há um override. Usar light do núcleo é uma composição possível, com decisão de UX pendente; copiar o HTML de preview para “completar” criaria outra fonte.
5. **Xscore consumidor e tgz:** o Supervisor informa consumo de `resultx-design-system-finance-2.7.0-dev*.tgz`, enquanto README.md do DS informa consumo por tag v2.9.0 (#271) e somente tokens da marca. A auditoria anterior também encontrou diferenças entre checkout local e origin/main do produto. Nesta etapa, restrita ao DS, nenhum arquivo de outro repo foi aberto/alterado. É necessário confirmar SHA/branch/lockfile do consumidor antes de declarar equivalência. O tgz Finance não tem sua composição garantida pela main e80d611: o catálogo não deve depender de arquivo externo ou de pacote experimental não versionado aqui. Mostrar estado do DS e do produto como evidências separadas.
6. **Cobertura documental não é cobertura executável:** as oito fichas geradas são fonte derivada; as 30 manuais incluem famílias agregadas e itens de domínio. Não raspar títulos e dizer que todos os casos estão cobertos. `.btn` e `.rx-button`, cards comuns e `.dl-*` são superfícies distintas que precisam de nomes claros no catálogo.
7. **Fontes e publicação:** assets/fonts hoje não são copiados ao Pages; a vitrine que usa WOFF2 local falha por recurso ausente. Xscore requer distribuição de duas famílias adicionais ou uma solução oficial reproduzível. Isso é trabalho de assets/testes, sem mudança de valor de token.
8. **Estado sem valor versus dívida de acessibilidade:** a ponte mede alguns pares (ex.: texto/primário/hover/sidebar), mas não certifica cada estado de cada componente em cinco marcas. Casos abaixo do piso devem aparecer como bloqueios/exceções identificados, não ser corrigidos com uma cor criada pelo catálogo. Faltas de valor só se classificam depois desse ensaio; não é válido inventar uma lista de bloqueios com base apenas no nome do token.

## 5. Proposta de estrutura (até uma página)

**Entrada e navegação.** Um site estático gerado pelo build do próprio DS, com URL determinística por marca/tema/componente, menu das cinco marcas e seletor claro/escuro. emprega+ agrupa IMO e EditalHub como contextos de uso, não cria marcas/tokens novos. Nome público eletia; caminho técnico electia continua compatível. Cada exemplo renderiza em documento isolado com apenas uma marca, evitando que cinco folhas :root contaminem a mesma cascata. Mostrar revisão do DS, fonte do componente, estados, teclado e pendências; não rotular como “produto aprovado”.

**Fonte.** Valores exclusivamente de tokens/tokens.json → geradores atuais → CSS da marca/núcleo/ponte. Um manifesto de catálogo descreve bindings por var(), fontes e associação componente–CSS/JS–receita. Pode haver uma receita de markup revisada por componente: CSS e anatomia YAML sozinhos não determinam HTML, interação nem dados. A receita vira a fonte única usada pela vitrine, pelos exemplos e pelos testes; nada de duplicar valores nos HTML gerados. Contratos YAML geram critérios/estados e fichas, sem editar generated/component-cards à mão; Markdown manual mantém explicação e aponta para a receita executável. Faltas e exceções aparecem no manifesto e na página, com motivo.

**Publicação.** `build:catalog` produz uma árvore descartável (por exemplo `_site/catalog/`), após o build atual, copiando somente assets referenciados, inclusive fontes/licenças das cinco marcas, scripts e estilos de componentes. pages.yml publica essa saída e redireciona a entrada; preserva URLs legadas do viewer e demos por links/redirecionamentos planejados. Não usar node_modules/CDN/produto como fonte em runtime.

**Catraca de atualização.** Teste cruza automaticamente as fichas/contratos/arquivos CSS com o manifesto: arquivo novo sem entrada falha; token indefinido ou binding incorreto por tema falha; alterações de fonte têm de refletir na saída regenerada. Build duplo com hashes idênticos e verificação de árvore limpa. Playwright verifica recursos sem 404, document.fonts, estilos computados esperados (inclusive superfícies/raios/fontes), isolamento entre marcas, teclado/ARIA e pares de contraste; casos de contrato existentes reaproveitados. Baselines apenas pelo workflow Visual Linux oficial e aprovação do Revisor, nunca geradas localmente para versionar. Não contar um teste apenas textual como prova visual.

**Divisão sugerida — seis PRs, sem antecipar release:** (1) manifesto/bindings e foundations, com testes de cobertura/isolamento e capturas de swatches/tipografia das cinco marcas; (2) oito contratos do piloto nas dez combinações marca/tema, reutilizando casos e capturas de estados; (3) famílias básicas do legado — botões, campos, cards, badges, stats, ícones, feedback — com testes e recortes; (4) navegação/layout e compostos, com comportamento e capturas mobile/desktop; (5) dados, conversa e domínio, incluindo os dez data-cards e itens de avaliação explicitamente identificados como domínio, com cenários e capturas; (6) publicação/compatibilidade de URLs, crawler de links/assets e teste do artefato Pages publicado. As PRs 3–5 podem ser subdivididas por volume sem alterar o desenho. Cada PR tem teste e evidência visual no Linux; nenhuma delas corta tag 2.11.0 antes de 27/11 ou altera cor/token antes de 10/12.

## 6. Critérios para a decisão dos especialistas e limites desta etapa

Arquitetura: aprovar isolamento por documento, manifesto como índice executável e fronteira dos bindings sem alterar APIs existentes. UX: aprovar a navegação, interpretação de “todos” (incluindo legado/domínio), uso do núcleo light em PdV e tratamento de itens não aplicáveis à identidade (orb na ResultX, teorias fora de eletia). O código só começa após essa decisão.

Matriz acima é triagem estática conservadora de dependências, não ensaio renderizado dos 190 cruzamentos. Não foram rodados build, Jest ou Playwright nem validados todos os contrastes nesta etapa de pesquisa. O inventário de declarações remove comentários e compara os dois blocos de tema; herança não é apresentada como valor claro novo. Recursos publicados foram checados por HTTP; o leitor web falhou no acesso e a checagem foi concluída pelo cliente HTTP local.

Progresso anterior da auditoria está preservado no arquivo temporário `resultx-ds-auditoria-continuidade.md`, fora do repositório; o Supervisor recebe o caminho completo no reporte. Este levantamento alimenta a auditoria, sem declará-la concluída. Nenhum STATUS.md, CHANGELOG ou arquivo de código foi alterado.
