# Brand System Xscore

Duas aparências estáticas, fundamentos lidos dos tokens existentes e referências ao catálogo compartilhado. Sem JavaScript de navegador.

Da raiz do ResultX DS:

```sh
node brands/xscore/previews/brand-system/build.cjs
npx jest brands/xscore/previews/brand-system/tests/foundations.test.js --runInBand
npx stylelint brands/xscore/previews/brand-system/style.css
node brands/xscore/previews/brand-system/tests/verify.mjs
```

O último comando serve a árvore temporariamente em loopback, valida os documentos em 390/1440 e grava somente evidências fictícias em `brands/xscore/docs/qa/`. Requer o Chromium da instalação Playwright do DS (`npx playwright install chromium`). O servidor temporário é encerrado no fim.

Para inspecionar manualmente, sirva a raiz do repositório em loopback e abra `brands/xscore/previews/brand-system/index.html` ou `light.html`. O caminho relativo das fontes e assets depende dessa raiz.

O gerador lê a folha oficial da marca; não escreve nela. Gera `index.html`, `light.html`, `provenance.json` e `docs/BRAND-BOOK.md`. `style.css` contém apenas a moldura editorial e referências `var()` aos papéis existentes. Medidas da moldura não são publicadas como tokens de marca.

As páginas compartilham a CSP do catálogo: `default-src 'self'`. Oito referências externas de navegação apontam ao catálogo público oficial; a renderização da página não busca esses destinos. A publicação no Pages é uma entrega compartilhada separada, coordenada pelo Supervisor.

Contratos e fichas usam URLs públicas fixadas no SHA registrado em `provenance.json`; não dependem de diretórios ausentes da publicação Pages. O teste rejeita a reintrodução de links relativos para esses recursos.
