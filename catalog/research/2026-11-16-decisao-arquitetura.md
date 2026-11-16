# Decisão de arquitetura: catálogo de todas as marcas do ResultX DS

@architect (Aria), 16/11/2026. Base: origin/main e80d611 (worktree ds-catalogo), lida sem alterar nada. Tratei o levantamento como hipótese e conferi nos arquivos cada ponto usado aqui. Também conferi a decisão de UX (decisao-catalogo-ux.md) e as duas são compatíveis.

## 1. Isolamento: um documento por marca e tema. Confirmado.

**Por quê:** o núcleo e as marcas usam os mesmos nomes de variável no `:root`. Exemplos: `--font-body` e `--radius-md` aparecem no núcleo (tokens/base/tokens-base.css:4 e 49) e nos moldes de eletia, PdV e Xscore (brand-electia.css.tmpl:100 e 146; brand-pdv.css.tmpl:51 e 97; brand-xscore.css.tmpl:116 e 143). Os dois lados têm a mesma especificidade, então vence quem carrega por último. Duas marcas na mesma página se contaminam.

**Alternativas descartadas:**
- **Shadow DOM:** `@font-face` não funciona dentro da sombra e o `:root` não chega até ela.
- **Reescrever o `:root` como classe:** o catálogo passaria a testar um CSS diferente do que os produtos carregam.

**Como fica:** a unidade é um documento HTML gerado por combinação de marca, tema e página, seguindo a URL da UX (`/catalog/{marca}/{tema}/{página}`). Cada documento:
- carrega uma única folha `brands/<dir>/tokens/tokens.css`;
- declara `data-theme` explicitamente;
- entra na moldura neutra (Inter) por iframe com `loading="lazy"`.

São cerca de 300 arquivos estáticos. Gerar isso é barato. O que precisa de teto é o número de capturas de tela (ver item 5).

## 2. Camada de ligação da marca (binding)

**Onde fica:**
- O mapa de papéis vai em `catalog/bindings.config.js`. Segue o padrão de scripts/brand-bridges.config.js:41-80, que declara papéis e não valores.
- O gerador fica em `scripts/catalog/`.
- A saída vai só para `_site/catalog/assets/bindings/<marca>.css` e não é versionada. É preciso acrescentar `_site/` ao .gitignore, que hoje não o ignora.

**Só valores que já existem:**
- Toda declaração gerada tem a forma `--papel: var(--nome-existente)`. O nome precisa estar declarado na folha da marca ou no núcleo. O gerador recusa literais e nomes inexistentes.
- Exemplo emprega+: `--radius-md: var(--emp-radius-md)`. Isso dá 12px (brands/emprega-mais/tokens/tokens.css:132) em vez dos 8px do núcleo.
- Exemplo ResultX: `--bg-surface-1: var(--rx-surface-1)` (brands/resultx/tokens/tokens.css:47 e 174).
- PdV claro não liga superfícies: herda as claras do núcleo e leva o rótulo de composição que a UX definiu. Se pedirem uma superfície exclusiva, isso vira "falta valor" e fica bloqueado até 10/12.

**Fora da API dos produtos:**
- O seletor é `:root[data-rx-catalog][data-theme="…"]`, com especificidade 0,3,0. Vence núcleo e marca sem depender da ordem de carga. Nenhum produto usa `data-rx-catalog`, então nos produtos ele não faz nada.
- Nada é gravado em `dist/`, `brands/`, `tokens/`, `adapters/` ou `contracts/`. Todos esses caminhos são publicados no pacote (package.json:9-72; `contracts/` está na linha 72).
- O `eds-root.css` e o `pilot-aliases.css` continuam presos pelos SHA que já existem (tests/eds-root.test.js:62; tests/pilot-scoped.test.js:32 e 63).
- O `build:catalog` roda depois de `npm run build` e não entra no `build:all` (package.json:100).

## 3. Manifesto e receitas como fonte única. Aprovado, com regras.

- O manifesto `catalog/manifest.yaml` liga cada página ao seu CSS/JS, à receita (`catalog/recipes/*.html`) e ao contrato correspondente. A biblioteca js-yaml já está no projeto (package.json:134).
- Receitas não podem ter `style=`, `<style>` nem valor literal de cor ou de medida. Um teste de lint garante isso.
- O HTML é montado no build. Não há `innerHTML` rodando no navegador.

**Trava contra catálogo desatualizado (ratchet).** O teste falha quando:
- um `contracts/*.yaml`, um `docs/components/*.md` ou um `@import` de `components/components.css` não tem entrada no manifesto, nem um `excluded:` com motivo;
- uma referência do manifesto aponta para arquivo que não existe;
- algum papel resolve vazio em alguma marca e tema (isso também pega `var()` em ciclo);
- dois builds seguidos geram arquivos com hash diferente.

A pasta de origem é parâmetro do teste, para dar para provar a falha com fixtures.

## 4. Fontes

**Decisão:** guardar no repositório os arquivos oficiais, sem modificação e sem recorte de caracteres, com licença e SHA-256 no README. É o padrão de assets/fonts/inter/README.md.

**Licenças:**
- Geist Mono: OFL 1.1, em vercel/geist-font (arquivo LICENSE.txt). O CTAN informa que não há nome de fonte reservado.
- Plus Jakarta Sans: OFL 1.1, em tokotype/PlusJakartaSans.
- **Não verificado:** o texto literal das duas licenças e se a Plus Jakarta tem nome reservado. Por isso, nada de recorte. O Executor confere antes do merge.

**Fonte substituta:** só aparece como estado de erro visível, nunca como prova de que a marca está certa.

**Publicação:** o pages.yml precisa passar a copiar `assets/fonts` (hoje não copia, .github/workflows/pages.yml:59-66). Isso tem um efeito colateral desejado: conserta as fontes de tokens/themes/preview.html, que hoje dão 404. O catálogo não usa Google Fonts, ao contrário do docs/viewer.html:9-11, que continua como está.

## 5. Divisão em PRs, reordenada

1. Ligação de marca + manifesto + trava + fundações nas 10 combinações + fontes do Xscore. Sem tocar no pages.yml.
2. Publicação de `/catalog/` com a faixa "em construção", cópia das fontes e checagem de 404 no artefato. Na proposta original isso era parte da PR 6. **Motivo da mudança:** a falha que já acontece hoje é de publicação (pilot.html e fontes dão 404).
3. Os 8 contratos, reaproveitando tests/visual/pilot-contracts.spec.js.
4. e 5. Legado, navegação e compostos, depois dados, conversa e domínio. Podem ser subdivididas.
6. URLs antigas continuando a funcionar + crawler completo.

**Capturas de tela:**
- Teto de cerca de 100 capturas novas por PR.
- Fundações e contratos ganham captura em cada marca e tema.
- O resto é coberto por teste de estilo computado, mais uma captura por página e marca.
- As capturas de referência são geradas só pelo visual-baseline-linux.yml e só valem com aprovação do Revisor.

**Critérios de aceite da PR 1:**
1. `npm run build:catalog` gera 10 documentos de fundações. Cada um carrega uma única folha de marca e tem `data-theme` explícito.
2. Todo valor da ligação de marca é `var(--x)`, com `x` declarado.
3. Depois de `npm run build && npm run build:catalog`, `git diff --exit-code -- dist brands tokens adapters contracts generated package.json` sai vazio, e `npm pack --dry-run` lista exatamente o mesmo que em e80d611.
4. Zero requisições fora da origem local e zero 404.
5. O manifesto cobre 100% dos 8 contratos, das 30 fichas e dos imports, ou registra exclusão com motivo.
6. O build é determinístico.
7. Nada muda em `version`, no CHANGELOG de release nem nos valores de tokens/tokens.json.

**Testes que precisam falhar sem a mudança (RED):**
- **(a) Estilo computado:** no emprega+ escuro, `--radius-md` precisa resolver igual a `--emp-radius-md` e `--font-body` igual a `--emp-font-sans`. No ResultX claro, `--bg-surface-1` precisa resolver igual a `--rx-surface-1`. Sem a ligação de marca, o resultado é 8px e o valor do núcleo, e o teste falha.
- **(b) Fontes:** no documento do Xscore, depois de `document.fonts.ready`, `document.fonts.check('16px "Plus Jakarta Sans"')` e a mesma checagem para "Geist Mono" precisam dar verdadeiro.
- **(c) Isolamento:** com o `colorScheme` do navegador emulado ao contrário, `--bg-base` não pode mudar. Cada documento tem exatamente uma folha de marca.
- **(d) Trava:** uma fixture com contrato sem entrada no manifesto precisa fazer o teste falhar.

O critério 3 é uma guarda e passa mesmo sem a mudança. A prova dele é por mutação: gravar a ligação de marca dentro de `brands/` tem de fazê-lo falhar.

## 6. O que quebraria as restrições fixas

**O que a proposta quebraria se fosse feita de forma ingênua:**
- gerar a saída em `dist/`, que vai para o pacote;
- editar `contracts/*.yaml` para atender o catálogo, o que também muda o pacote;
- "completar" o PdV claro ou trazer valores dos previews (por exemplo brands/emprega-mais/design-system-preview.html:10-14), o que cria valor novo antes de 10/12;
- subir a versão junto com a publicação;
- usar CDN de fontes.

Os critérios 2, 3 e 7 bloqueiam todos esses casos.

**Segurança:**
- Site estático, sem script de terceiros e sem `innerHTML` em execução.
- O GitHub Pages não permite cabeçalho de CSP. Por isso, cada documento gerado leva `<meta http-equiv="Content-Security-Policy" content="default-src 'self'">`.
- As fontes são conferidas por SHA-256.

**Não verificado:**
- se o visual-baseline-linux.yml está funcionando hoje;
- como os produtos consomem o DS de fato (está fora deste repositório);
- o contraste de todos os estados nas 10 combinações.

## Correção 16/11 (substitui o critério 3 da PR 1)
Opção A: exceção restrita no package.json. Única diferença permitida, comparando como JSON contra e80d611: scripts["build:catalog"] = "node scripts/catalog/build.cjs". build e build:all não mudam. npm pack --dry-run com a mesma lista de e80d611. git diff --exit-code continua valendo para dist, brands, tokens, adapters, contracts e generated. Motivo: o pages.yml da PR 2 chama npm run build:catalog, e o comando fica num lugar só.
