# Catálogo de marcas

Fundações locais das cinco marcas, em claro e escuro, sem JavaScript no navegador.
As fundações são publicadas pelo workflow Pages após o build e a montagem compartilhada. O site permanece em construção; a API e os valores do DS não mudam.

```sh
npm ci
npm run build
npm run build:catalog
npm run lint
npm test -- --runInBand
node scripts/catalog/verify-pr1-scope.cjs --base e80d611
npx playwright test tests/visual/catalog-foundations.spec.js --workers=1
```

O site é gerado exclusivamente em `_site/catalog/`. Para inspecionar, sirva `_site`
em loopback e abra `/catalog/eletia/dark/fundacoes/`, ou troque a marca/tema nos
links. Cada quadro é um documento isolado com exatamente uma folha de marca.
`CATALOG_CHROME` pode apontar para o executável local do Chrome; sem essa variável,
os testes usam o Chromium do Playwright. `CATALOG_EVIDENCE_DIR` habilita capturas
locais de evidência e JSON das medições. Nenhuma comparação de baseline nova é
feita aqui: referências aprovadas só nascem no Visual Linux oficial.

## Fontes e valores

`bindings.config.js` contém somente nomes de papéis existentes. As ligações saem
como `var()` sob `:root[data-rx-catalog][data-theme]`. Templates e CSS da moldura
ficam aqui; tipografia e cores das marcas vêm da saída DTCG. A moldura usa Inter.
O gerador escolhe, entre tintas já existentes, a de maior contraste sobre cada
cor semântica. Não inventa valores e informa o par medido em “Ver detalhes”.
A voz é extraída dos brand books em cada geração. Xscore permanece com pendência
escrita; PdV claro leva o texto de composição ainda não aprovada por Marcos.

As fontes oficiais de Plus Jakarta Sans e Geist Mono estão em `assets/fonts`,
com OFL, revisão e SHA-256. Os arquivos são variáveis, completos e sem alteração.
Os logos vêm de assets existentes, com a variante adequada ao fundo. Alguns SVGs
históricos usam texto e carregamento externo em sua origem: como imagens eles
não buscam esses recursos externos; os testes verificam zero requisições externas.
Não se declara que o arquivo SVG original foi corrigido nesta PR.

## Travas

O manifesto registra os 8 contratos, as 30 fichas e os 16 imports com exclusão
motivada nesta etapa de fundações. O teste recebe uma raiz de fixture e rejeita
novos arquivos sem entrada, referências ausentes, receitas com estilos ou scripts,
nomes de origem inexistentes e ciclos de variáveis. Os imports precisam existir.
Geração dupla verifica hashes iguais. A verificação **pontual da PR 1**, fora da suíte e do CI, extrai `git archive`
da base fornecida explicitamente e compara os caminhos de
`npm pack --dry-run --ignore-scripts`. Executar somente durante a revisão desta
entrega; não é gate para mudanças posteriores. Build e build:all não mudam.
O CI não precisa de histórico completo para os testes permanentes do catálogo.

O levantamento da etapa 0 não integra esta PR de implementação: fica preservado
fora da árvore de entrega, junto às evidências. O arquivo docs/research/.npmignore
foi removido, pois existia apenas para impedir que esse novo relatório entrasse
no pacote. Nenhuma regra especial de publicação foi mantida para esse documento.

## Provas locais (16/11)

- RED a: retirando a ligação, raio esperado 12px recebeu 8px.
- RED b: sem as faces do Xscore, não há FontFace carregada, mesmo que check de
  família inexistente isoladamente possa retornar true.
- RED c: sem o tema explícito, a asserção encontra data-theme ausente.
- RED d: desativando a trava, a fixture com contrato novo deixa de lançar erro.
- Mutação do critério 3: gravação de ligação em brands é rejeitada; bytes restaurados.

Logs e capturas ficam fora do repositório em `/tmp/ds-catalogo-pr1/`. As referências
não são PNGs versionados. Leitura humana e parecer independente continuam pendentes.

### Resultado do Executor

- Build principal passou; ligação e saída apenas em `_site/catalog`.
- Geração dupla determinística no teste Jest.
- Playwright: 23 casos aprovados, zero falhas/pulados, incluindo 20 combinações
  de marca/tema/viewport (390 e 1440). Sem rolagem horizontal, sem requisições
  externas ou 404; nomes públicos corretos, CSP, foco e moldura Inter conferidos.
- Menores contrastes de texto dos estados semânticos medidos no DOM:
  eletia 4,83:1; emprega+ 5,17:1; Xscore 6,47:1; PdV 4,83:1; ResultX 4,83:1.
  Isso certifica somente os pares de estado medidos, não todos os componentes.
- `npm pack`: 288 caminhos na base, 288 atuais, zero adições/remoções.
- `git diff --exit-code e80d611 -- dist brands tokens adapters contracts generated`:
  saída vazia, código zero; guarda também rejeita arquivos novos nessas pastas.
- RED a/b/c: uma falha esperada em cada seleção. RED d: uma falha esperada,
  com quatro casos fora da seleção nessa rodada. Nenhum skip no GREEN completo.
- Capturas e JSONs de cores em `/tmp/ds-catalogo-pr1/capturas`, com manifesto
  SHA-256; logs em `/tmp/ds-catalogo-pr1/provas`. Não são baselines versionadas.

A publicação em pages.yml permanece para a PR 2. Os 54 itens de manifesto
(8 contratos, 30 fichas e 16 imports) estão excluídos com motivo até as próximas
etapas; não são apresentados como componentes já prontos. Fora desta PR:
aprovação visual de Marcos e do Revisor, baselines Linux de referência,
publicação, URLs antigas e componentes das PRs 3–6.

O lint das folhas novas (`npx --no -- stylelint 'catalog/*.css'`) também roda
no CI; o script lint original do pacote foi preservado. A única alteração no
package.json é o comando build:catalog aprovado pela arquitetura.

## Correção após REPROVA do Revisor em 287852f

O gate de escopo e a comparação de pacote foram retirados da suíte Jest permanente.
Continuam disponíveis somente no comando pontual `verify-pr1-scope.cjs --base <SHA>`.
Também foi retirado o fetch completo do CI, que só existia para esse gate.
Nenhum teste permanente congela package.json, lista de pacote ou pastas do DS na
base desta PR. Permanecem cobertura do manifesto, referências, receitas, valores
resolvidos, ciclos, hashes de fontes, determinismo e as provas de navegador.
As 761 aprovações acima registram a rodada anterior; os dois gates pontuais não fazem mais parte da suíte atual. Foram acrescentadas
provas de escrita restrita ao estado atual e de evolução de contrato registrado.

A verificação permanente de escrita calcula os hashes atuais das pastas protegidas
antes e depois do gerador. Assim detecta alterações causadas pelo catálogo sem
impedir evoluções legítimas anteriores de tokens, contratos ou artefatos do DS.

Também saiu a contagem fixa de 54 itens do teste de cobertura: o inventário é lido
do código atual. Uma fixture com contrato novo e exclusão motivada passa, enquanto
um contrato sem registro continua falhando. A quantidade histórica permanece
somente como evidência desta entrega na documentação.

## Correção da execução em container (PR #134)

O build não chama Git. A revisão pode ser fornecida por
`node scripts/catalog/build.cjs --revision <SHA completo>`; sem argumento, usa
`GITHUB_SHA` quando presente. Sem ambos, mostra “geração local” com uma assinatura
determinística das entradas, sem fingir conhecer um commit. Nesse caso o link do
guia aponta explicitamente para a main, não para um SHA inventado. Revisões
inválidas são recusadas antes de remover a saída anterior.

Os testes reconstruem o catálogo no beforeAll, mesmo que `_site/catalog` já exista:
uma pasta pode ser sobra de geração abortada. O teste exige HTTP 200 e valores
não vazios. O encerramento também é seguro se o build falhar antes de abrir o
servidor. A checagem de fontes permanece exigindo tanto `document.fonts.check`
quanto uma FontFace real carregada; não foi substituída por tolerância ou timeout.

No run 43926480710, o git recusou o proprietário do checkout. O build interrompido
já havia criado a pasta, mas ainda não havia escrito os documentos. Na repetição,
a fixture confundia essa pasta com build válido: o caso a comparava valores vazios;
o caso b abria uma resposta sem faces, com check=true e loaded=false. Essa é uma
falha de inicialização/saída parcial, não evidência de incompatibilidade dos WOFF2.
Os ensaios no container oficial são reportados separadamente da prova local.

Provas da correção: 766 testes Jest aprovados (também com o paralelismo padrão),
23 testes do catálogo no Chrome local sem retries, zero falhas/pulados/flaky.
Os cinco novos testes cobrem revisão por ambiente/argumento, validação/fallback,
build sem Git e com saída parcial e encerramento sem servidor ou já encerrado.

Tentativa equivalente Linux: imagem oficial v1.65.0-noble por digest do workflow,
linux/amd64 em host arm64, um worker e zero retries. As duas tentativas encerraram
o worker com SIGKILL: uma falha de infraestrutura, 22 casos não executados; não
contam como aprovação Linux. Foram usados somente containers próprios, com limite
de 768 MiB, sem mudar configurações da VM ou containers de outros projetos.
Não há prova suficiente para atribuir o SIGKILL a um defeito funcional do catálogo
nem confirmação de OOM; a validação completa no runner Linux nativo está pendente.
O teste de fontes conserva as duas exigências e não troca carregamento real por
um simples check de família. Nenhuma fonte ou workflow foi alterado.

## PR 2 — publicação do catálogo

O workflow executa `npm run build`, `npm run build:catalog` e
`node scripts/prepare-pages.cjs`, nessa ordem. O último comando e os testes usam
uma única lista de arquivos, sem manter uma segunda lista de cópias no YAML.
O gerador cria também `/catalog/index.html`, com as cinco marcas e a cobertura
escrita em palavras. O viewer antigo ganhou o link “Catálogo de marcas”. A raiz
continua redirecionando para o viewer, preservando a entrada anterior.

O montador prepara uma árvore temporária e só substitui `_site` depois de copiar
as entradas: `catalog/`, `assets/fonts/` e todos os caminhos anteriores. Falta de
catálogo ou falha na cópia para a área temporária preserva a publicação anterior.
Após começar a substituição de `_site`, não há garantia de recuperação caso a
cópia final falhe; essa operação não é uma troca atômica. Não há dependência de
Git no montador. A marca e o tema continuam isolados e a navegação usa somente
links. Todas as páginas novas trazem o aviso do que já existe, do que falta e do
próximo passo, além de CSP `default-src 'self'`.

### Provas locais

- RED: montando a árvore anterior, o teste encontrou HTTP 404 para
  `/catalog/eletia/light/fundacoes/` e `/assets/fonts/inter/Inter-Regular.woff2`.
- GREEN: 14 casos de publicação, mais 23 das fundações: 37 aprovados, zero falhas,
  pulados e flaky, sem retries.
- Os testes montam a publicação real em pasta temporária e servem sob
  `/resultx-design-system/`, como no GitHub Pages. Verificam as dez combinações,
  os quadros internos e o índice, com zero 404/requisição externa e carregamento
  real de Inter, Sora, JetBrains Mono e, no Xscore, Plus Jakarta Sans e Geist Mono.
- URLs anteriores: root, viewer, todos os 15 HTMLs de demos, preview e vitrine
  ResultX continuam HTTP 200. O preview é aberto no navegador e suas três famílias
  locais são carregadas. As páginas legadas mantêm seu código; suas dependências
  externas anteriores não foram reescritas nesta PR. A prova de zero rede externa
  é do catálogo novo, não uma certificação de todos os demos antigos.
- Jest: 35 suítes, 770 testes aprovados; lint principal e das folhas do catálogo
  aprovados. Nenhum valor novo, JavaScript de navegador ou baseline foi criado.

```sh
npm run build
npm run build:catalog
node scripts/prepare-pages.cjs
npm test -- --runInBand
npx playwright test tests/visual/catalog-publication.spec.js tests/visual/catalog-foundations.spec.js --workers=1 --retries=0
```

Logs: `/tmp/ds-catalogo-pr2/`. O RED usa a lista antiga de publicação (sem catálogo
nem fontes); o GREEN usa a mesma função chamada pelo workflow. Capturas de
referência, inspeção humana, execução do CI e conferência do site depois da
publicação continuam sob os respectivos gates. Componentes das etapas seguintes
não são apresentados como concluídos.
