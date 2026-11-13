# Fonte DTCG — migração em andamento

`tokens.json` é a fonte da base tipográfica e escalas, gerada por
`scripts/build-base.mjs`, e da camada compartilhada de dados: cores
primitivas, papéis semânticos para gráficos, dimensões de componente e aliases
para os nomes CSS existentes. `npm run build:tokens` gera
`tokens/themes/_data-layer-shared.css` usando Style Dictionary; não edite esse CSS.

A mesma fonte contém os temas opt-in premium-light, sober-dark e
vibrant-dark, gerados por `scripts/build-themes.mjs`. Não edite seus CSS.

O núcleo dark/light vem da mesma fonte e de `layouts/core.css.tmpl`, gerado
por `scripts/build-core.mjs`. O layout fixa seletores, escopos, comentários e
regras CSS estruturais; os valores dos tokens vivem no JSON.

As folhas CSS das cinco marcas são geradas pela mesma fonte e pelos layouts
estruturais `layouts/brand-*.css.tmpl`, antes do cálculo de contraste das pontes.
Valores CSS sem tipo DTCG padronizado, como `clamp()`, usam extensões específicas
na própria fonte.

A migração ainda não abrange eds-root. Esses arquivos
continuam manuais nesta etapa; `tokens/tokens.json` ainda é o legado. Não considere
a E1 concluída até que os demais artefatos sejam migrados e verificados.

A lista de propriedades da transição interativa é uma extensão específica de
CSS. Os breakpoints seguem comentados na folha base: o gerador antigo os lê
mesmo assim e os expõe em `dist`; o formato preserva essa compatibilidade até
uma correção específica do parser e da API.
