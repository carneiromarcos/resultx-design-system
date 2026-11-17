# Catálogo PR 5a — dados

Data: 17/11/2026. Base: origin/main 0827c21 (PR 4b).

## Escopo e decisões

A divisão foi aprovada pelo Supervisor/UX: 5a cobre dados; 5b fica para conversa e
domínio. Esta entrega não implementa a 5b. Não altera consumidores, valores de
tokens, versões, exports, scripts de navegador ou baselines. As amostras usam o
CSS real, isolado por documento e por marca/tema, sem importar os temas opt-in de
dados para tentar substituir a identidade da marca.

São duas páginas novas nas dez combinações de eletia, emprega+, Xscore, PdV e
ResultX, claro/escuro:

| Página | Subfamílias |
|---|---|
| Dados visuais | indicador, ícone com fundo, variação, gráfico, anel, tabela compacta, tendência em barras, avatares, estado e destaque fixo |
| Composições de dados | tabela com estados visuais, ações em lote, gráfico com período e tendência em linha |

Os indicadores e as tabelas antigos entram recolhidos no fim dos sucessores
StatCard e DataTable, com a orientação de usar o sucessor em telas novas. São mais
20 documentos legados, sem trocar a captura ou o comportamento dos contratos.
Os links nas páginas de compostos e progresso apontam para as novas amostras.
O catálogo passa de 250 para 270 páginas navegáveis de marca/tema; documentos
isolados de amostra e de legado não são contados como novas entradas de menu.

## Ligações aprovadas pela UX

A decisão recebida do Supervisor em 17/11 autoriza somente estas oito ligações,
por var() de nomes já existentes, em catalog/bindings.config.js:

| Papel consumido | Destino existente |
|---|---|
| delta-positive-fg | color-success |
| delta-positive-bg | color-success-bg |
| delta-negative-fg | color-warning |
| delta-negative-bg | color-warning-bg |
| delta-neutral-fg | text-secondary |
| delta-neutral-bg | bg-surface-2 |
| surface-accent-green | color-success-bg |
| surface-accent-amber | color-warning-bg |

Todos os destinos, inclusive text-secondary e bg-surface-2, existem e resolvem
nas dez combinações. O gerador recusa destino inexistente. Vermelho não é usado
para a queda; a convenção de aviso é a existente no DS.

Ciano, magenta e roxo suaves continuam **sem ligação**. Cada amostra diz que está
incompleta, identifica o fundo decorativo que falta e indica a PR de cores com UX
como próximo passo. Não há substituição por info, erro ou destaque da marca.
Responsáveis pelo acompanhamento: Supervisor DS e UX. A autorização de cor nova
em 17/11 não inclui escolher valores nesta PR; os avisos gerados foram atualizados
para indicar essa PR própria, em vez da antiga espera automática por 10/12.

## Dados, fontes e limites da vitrine

catalog/data-samples.json fornece a série sintética aos gráficos e ao texto
alternativo. Percentuais de altura são dados da API --h do componente, não novos
tokens de desenho. São emitidos numa folha local, sem style inline. Os segmentos
do anel vêm dos defaults do CSS original, não de uma paleta copiada para HTML.
As dimensões dos ícones e anéis são as classes publicadas, sem reescrever valores.

Ordenação, seleção em lote, escolha de período e destaque por mouse são apenas
visuais e têm aviso explícito. Não há JS nestas páginas. O indicador compacto
preserva navegação nativa; tabelas têm caption, scope e área com rolagem interna.
Os números, letras e grupos são fictícios e não representam pessoas.

A fórmula OKLab já usada nos testes foi promovida de tests/lib/color.js para
scripts/lib/color.js, mantendo a exportação antiga por compatibilidade. O build
não depende de um helper exclusivo de teste. As fórmulas anteriores e os testes
existentes foram preservados. A confrontação com o navegador aceita diferença de
conversão menor que 0,1 em canais de 0 a 255 e 0,001 na razão; exige também que o
lado do piso WCAG coincida **sem arredondar**. Os mínimos de 4,5 e 3 não mudaram.

## Contraste medido e pendências reais

São 340 pares de texto em repouso: 270 das duas páginas novas e 70 dos dois
legados. O CSV adjacente registra cada seletor, fontes de cor, cores compostas,
razão e piso. A composição calculada é confrontada com getComputedStyle no
Chrome. Os JSONs externos preservam os valores CSS reais e as camadas de fundo.

| Marca | Aparência | Pares | Abaixo de 4,5 | Menor razão |
|---|---|---:|---:|---:|
| eletia | clara | 34 | 3 | 2,69 |
| eletia | escura | 34 | 0 | 4,55 |
| emprega+ | clara | 34 | 5 | 2,80 |
| emprega+ | escura | 34 | 0 | 4,54 |
| Xscore | clara | 34 | 3 | 2,69 |
| Xscore | escura | 34 | 0 | 4,55 |
| PdV | clara | 34 | 3 | 2,69 |
| PdV | escura | 34 | 6 | 3,78 |
| ResultX | clara | 34 | 3 | 2,69 |
| ResultX | escura | 34 | 0 | 5,04 |

Os **23 pares abaixo do mínimo não estão corrigidos**. São: variações positiva e
negativa claras nas cinco marcas (10); variação positiva do indicador antigo
claro nas cinco (5); texto de aviso/erro da tabela clara emprega+ (2); e, no PdV
escuro, variação neutra, cabeçalho da tabela compacta, aviso/erro da tabela,
período não selecionado e variação negativa do indicador antigo (6). As páginas
mostram o alerta e os detalhes. A suíte confirma a correspondência das medições
e dos avisos; verde na suíte não declara AA nesses pares.

Gradientes, segmentos, bordas, anéis de foco, demais estados e VoiceOver não foram
certificados. Não há prova por pixel. Há teste de alcance por teclado do link e
dos controles estáticos, fontes, rede local e ausência de rolagem horizontal da
página em 390/1440. A inspeção das evidências não substitui aprovação visual humana.
As pendências anteriores das PRs 3/4a/4b permanecem abertas.

## Provas e reprodução

Use a raiz desta worktree. CATALOG_CHROME, quando necessário, é o caminho do
executável Chrome local; sem ela, o Playwright usa seu Chromium instalado.
A pasta QA abaixo é saída descartável externa ao repositório.

```sh
export QA=/tmp/ds-catalogo-pr5
npm ci
npm run lint
npx stylelint catalog/data.css catalog/legacy.css
npm run build
npm test -- --runInBand
CATALOG_DATA_EVIDENCE_DIR="$QA/capturas" npx playwright test 'catalog-.*.spec.js' --workers=1 --retries=0
CATALOG_LEGACY_EVIDENCE_DIR="$QA/capturas" npx playwright test tests/visual/catalog-legacy.spec.js --workers=1 --retries=0 --grep 'stat-card:|data-table:'
node -e "console.log(require('./scripts/catalog/verify-pr1-scope.cjs').checkPack(process.cwd(), '0827c21'))"
git diff --exit-code 0827c21 -- dist brands tokens adapters contracts generated package.json package-lock.json docs/STATUS.md .github/workflows
```

O RED inicial, antes de registrar as páginas, teve **1 teste falho**: entrada
data-cards ausente no manifesto (toBeDefined). Log externo:
/tmp/ds-catalogo-pr5/provas/red-registro.log. O teste final da mesma suíte exige
as duas páginas e os legados. A guarda permanente também é exercitada em fixture
retirando data-cards: ela rejeita a ficha sem entrada no manifesto. Outra prova
negativa fornece destino inexistente e exige recusa da ligação, sem aceitar vazio.

Resultados finais e prova por mutação do gerador são registrados no fechamento
abaixo. Testes de captura não usam toHaveScreenshot e não criam baselines.

## Evidências e gates de entrega

Evidências locais em /tmp/ds-catalogo-pr5/capturas/, com manifesto SHA-256 externo:
90 PNGs e 40 JSONs. As 90 imagens são: 50 recortes de famílias claras (10 por
marca), 10 famílias ResultX escuras, cinco composições claras, cinco tabelas em
390 e 20 legados nos dois temas. Os testes exercitam todas as dez combinações em
390 e 1440; o conjunto de fotos é amostral, dentro do limite aprovado, não uma
foto de cada família em cada largura/tema.

Pendentes: parecer independente do Revisor no SHA final, inspeção humana,
CI Linux oficial, publicação e conferência após publicação. Nenhum destes gates
é substituído por passes no Chrome local. Baselines só pelo workflow Linux com
aprovação. A PR 5b não está implementada.

## Fechamento local

Código: 243c98d. Lint do repositório e das folhas do catálogo: verdes. Build do DS:
verde, sem diff nas pastas protegidas. Jest completo: **39 suítes / 820 testes
aprovados**, zero falhos e zero pulados. Suíte nova isolada: **17/17**. Playwright
do catálogo completo: **397/397**, zero falhos, pulados ou flaky, retries=0.
Recaptura dirigida dos dois legados: **20/20**, também com retries=0. Logs em
/tmp/ds-catalogo-pr5/provas/.

A mutação em memória da configuração, sem editar tokens ou deixar alteração de
fonte, mudou delta-neutral-fg para um nome inexistente. O build real saiu com
código **1**, “Ligação inválida: --delta-neutral-fg”. Sem a mutação, o gerador
passou duas vezes, com **1058 arquivos idênticos por caminho/SHA-256**. Logs:
red-ligacao-gerador.log e green-gerador-deterministico.log.

O npm pack --dry-run --ignore-scripts manteve **288 caminhos idênticos à base**.
O diff contra 0827c21 é vazio em dist, brands, tokens, adapters, contracts,
generated, package/lock, STATUS e workflows. eds-root e pilot-aliases continuam
com os hashes congelados. Não há PNG ou dependência nova no pacote.

Uma tentativa local de hook e recaptura foi iniciada incorretamente em paralelo:
os dois reconstruíram _site/catalog, gerando saída incompleta, dois testes Jest
falhos e uma captura falha (15 não executadas). Essa tentativa não conta como
aprovação. A repetição serial do hook (820/820) e da recaptura (20/20) passou; o
log final é o arquivo com sufixo -final. A execução completa de 397 casos citada
acima terminou sem outra geração concorrente.

Manifestos externos: /tmp/ds-catalogo-pr5/manifesto.json e manifesto.sha256,
com 130 arquivos de evidência. Nenhum PNG é referência de regressão versionada.
A análise automatizada CodeRabbit não trouxe apontamentos nos 28 arquivos de
código/teste; isso não substitui o Revisor independente nem os gates pendentes.

Na 5b, os itens de domínio, inclusive a roda de posicionamento existente no CSS
de dados, precisam de página restrita à marca dona. Áudio/composer não entram
na autorização anterior de seis módulos: qualquer ativação de comportamento
precisa de decisão, não é autorizada implicitamente por esta 5a.
