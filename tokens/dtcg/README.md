# Fonte DTCG — migração em andamento

`data-layer.tokens.json` é a fonte da camada compartilhada de dados: cores
primitivas, papéis semânticos para gráficos, dimensões de componente e aliases
para os nomes CSS existentes. `npm run build:tokens` gera
`tokens/themes/_data-layer-shared.css` usando Style Dictionary; não edite esse CSS.

A migração ainda não abrange o núcleo, temas, marcas ou eds-root. Esses arquivos
continuam manuais nesta etapa; `tokens/tokens.json` ainda é o legado. Não considere
a E1 concluída até que os demais artefatos sejam migrados e verificados.
