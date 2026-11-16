# Catálogo de marcas — PR 1

Fundações locais das cinco marcas, em claro e escuro, sem JavaScript no navegador.
Esta etapa não publica o site. Não muda a API ou os valores do DS.

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
