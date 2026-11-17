# Inventário verificado da referência Electia

Status: evidência de descoberta M1 · 17/11/2026. Identidade visível atual: **eletia**; caminho histórico `brands/electia` preservado. Somente leitura.

Fonte: `brands/electia/previews/brand-system/index.html` no DS `48fe3ce1e9f081a1ad01584c9cf60263fcfb5085`. Servidor obrigatório respondeu HTTP 200 e serviu **os mesmos bytes** da worktree. SHA-256 do HTML: `9be771d7a7abddd3c06678169c1e32718b53b2b3fafb135ea33ca45869277d34`.

Navegação real em `http://127.0.0.1:19140/ds/brands/electia/previews/brand-system/index.html#bb-0`: o Brand Book foi carregado, os capítulos apareceram no DOM, o seletor mudou escuro → claro, zero erro JS. Viewports 1440×1000 e 390×844 inspecionados; sem overflow horizontal no estado mobile claro observado. Isso verifica a referência, não certifica acessibilidade nem todos os links externos.

## Estrutura de navegação e conteúdo

Topo fixo: wordmark, assinatura `by emprega+`, versão visual `v2.7` e alternância persistida em `electia-theme`. Essa versão é o texto do catálogo, **não** a versão do pacote DS. Hero apresenta identidade, cor, tipografia e alegação AA. Hub com quatro portas: Brand Book, Design System, Screens, References. Índice lateral, links ativos por `IntersectionObserver`, âncoras diretas e rodapé.

| Âncora | Conteúdo efetivamente presente |
|---|---|
| `hub` | Quatro portas e botões de navegação |
| `ds-surfaces` | Canvas, card, hover, bordas padrão/foco; swatches gerados por JS |
| `ds-accent` | Accent, hover, tinta no escuro; exemplos de texto primário/secundário/muted |
| `ds-semantic` | Success, warning, danger; intenção de estado |
| `ds-gradients` | Vibrant/default, Premium/raro, Purple, Deep; contexto de uso |
| `ds-theory` | Cores específicas de avaliações; badges textuais. **Domínio alheio ao Xscore** |
| `ds-type` | Sora display/headline, Inter corpo/UI, JetBrains Mono dados/IDs |
| `ds-buttons` | Primary, secondary, danger, ghost e disabled |
| `ds-components` | Cards, inputs, foco, barras com valores, score e links para telas |
| `social-moodboard` | Composições fotográficas, dessaturação, luz, palavra-âncora, wordmark; roxo/azul/ouro; copy explicitamente provisória |
| `formats` | Story/Reels 1080×1920, feed 1080×1080, OG 1200×630, LinkedIn 1584×396, e-mail 600×200 e web 728×180 |
| `brand-book` / `bb-0`…`bb-17` | Markdown canônico carregado por fetch; capítulos abaixo |

## Os 18 capítulos do Brand Book

1. Essência: propósito, missão, visão, promessa e valores.
2. Arquitetura: hierarquia, assinaturas e grafia oficial.
3. Wordmark: variantes, favicon/avatar, medidas, cores, proteção e proibições.
4. Paleta: primárias, fundos, texto, bordas, semânticas e cores do domínio.
5. Tipografia: famílias, hierarquia e regras.
6. Tom e voz: personalidade, exemplos e escrita.
7. Iconografia e elementos: ícones, contêineres, cards e botões.
8. Aplicações: LP, app, e-mail, social e PDF/relatórios.
9. Nomenclatura do produto.
10. Coexistência com a marca-mãe: compartilhado, diferente, hierarquia legal/canais.
11. Origem e visão do fundador.
12. Posicionamento: declaração, ICP, dor, alternativas, atributos, momento e categoria.
13. Arquétipo e limites éticos.
14. Fotografia/imagens: hero, filosofia, categorias, tratamento e proibições.
15. Checklist de validação.
16. Aplicação LP/plataforma: consumidores, fontes, tokens, wordmark, hero, e-mail, checklist, mapa de arquivos e atualização.
17. Diretrizes visuais: usos de cor/gradiente/fonte/logo, proteção, mínimo, combinações e checklist.
18. Identidade social: referências, princípios, texto/foto/paleta, layouts, consistência e quatro templates.

O outline completo, incluindo subtítulos, está em `electia-reference-outline.json`; a evidência bruta de navegação fica no pacote privado de validação.

## Variantes, estados e ferramentas

- Dois temas por atributo; persistência em localStorage. As cores e estilos desta vitrine estão declarados no próprio HTML: não presumir que demonstrem consumo do pacote.
- Botões mostram quatro variantes e disabled. Inputs mostram placeholder e foco CSS. Cards mostram conteúdo normal; barras trazem número junto da cor. Não há ensaio de erro, vazio, carregamento ou todos os teclados nessa página. **Os oito contratos no Core têm cobertura mais ampla que a referência.**
- Screens: login, dashboard, candidatos, triagem, vagas e candidatos na vaga. Há links relativos para `demos/` e absolutos legados na porta 8766. A existência de link não prova que o produto renderiza igual.
- Ferramentas visíveis: swatches por token, amostras de cor nos códigos do Markdown, renderer `marked@12.0.2` por CDN, Google Fonts, Unsplash, menu de capítulos automático e observador de seção ativa. Não foram encontrados exportador de tokens, playground de props ou executor de testes nesta página.
- Documentos adjacentes: `BRAND-BOOK.md`, `DESIGN-SYSTEM.md`, `CHANGELOG.md`, `MOTION-GUIDE.md`, `IMAGE-PROMPTS.md`, `SOCIAL-MEDIA-GUIDE.md`, `CANVA-BRAND-GUIDELINES.md`, `CANVA-SETUP.md` e seis specs de domínio. São referências de estrutura; as specs de avaliação não se transferem ao crédito.

## Critério de transferência

Copiar a maturidade: fonte, navegação, exemplos, regras, proveniência e manutenção. Preservar a marca Xscore e seu domínio. Não copiar estilos inline, cores, teorias, slogans, arquétipos ou promessas de outro produto. Estados não demonstrados na referência entram pela exigência dos contratos e do produto, explicitamente rastreados.
