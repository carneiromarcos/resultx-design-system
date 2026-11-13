# Fonte DTCG dos tokens

`tokens/tokens.json` é a fonte da base tipográfica e escalas, gerada por
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

`eds-root.css` e seu SHA são gerados com trava de igualdade byte a byte;
a saída não é escrita se o hash congelado divergir. Os JSONs históricos em
`brands/*/tokens/` não são fonte do build e ainda precisam ser reconciliados.

`tokens/legacy-aliases.css` é uma saída opt-in: os cinco aliases e o export
adicional `./tokens/legacy` estão listados no teste de equivalência; o CSS
padrão não recebe os novos nomes.

A lista de propriedades da transição interativa é uma extensão específica de
CSS. Os breakpoints seguem comentados na folha base: o gerador antigo os lê
mesmo assim e os expõe em `dist`; o formato preserva essa compatibilidade até
uma correção específica do parser e da API.

A varredura automatizada cobre declarações, parâmetros de at-rules e fallbacks de `var()`. As exceções são restritas: `opacity` 0 ou 1 em keyframes e regras de revelação; `transform` com translação zero ou escala 1 no estado final de keyframes; `width` 0% e fallback 0% somente no keyframe `progress-fill`; percentuais de seletores de keyframe entre 0 e 100; multiplicadores 1–3 em `animation-delay` das respectivas regras `.rx-reveal`; uma iteração para movimento reduzido; e `-webkit-text-fill-color: transparent` apenas junto das duas declarações de recorte de fundo. As medidas e sombras visuais são tokens tipados em `component.layout`.
