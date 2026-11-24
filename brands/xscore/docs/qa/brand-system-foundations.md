# Xscore — evidências da base navegável

17/11/2026 · entrega de estrutura e fundamentos M3/M4. Não é encerramento da missão nem declaração de integração de produto.

## Escopo comprovado

Duas aparências estáticas, dezesseis entradas de navegação e dezoito capítulos. Superfícies, acentos, semânticas, gradientes, tipografia, pesos, raios e sombras são lidos dos tokens existentes. Logo, monograma e favicon vêm dos assets oficiais, com variante adequada ao fundo. Os oito componentes usam referências ao catálogo compartilhado, sem duplicar suas implementações.

Nenhum valor de token, contrato, outra marca ou arquivo do núcleo foi alterado. A escala de espaçamento permanece uma dependência explícita. Direção fotográfica, campanha e templates permanecem planejados. Todos os valores das composições são fictícios.

## Verificações locais

| Verificação | Resultado |
|---|---|
| Jest do DS | 40 suítes, 825 testes aprovados; zero falha e zero pulado |
| Cinco testes novos desta base | 5 aprovados, zero falha/pulado |
| RED de CSP | Nome da meta de CSP alterado em ensaio controlado: 1 falha e 4 aprovações, exit 1; fonte e artefatos restaurados; GREEN 5/5 |
| Lint compartilhado e CSS desta moldura | Aprovados, sem desabilitar regras |
| Geração | Dupla geração determinística; hash da folha oficial preservado |
| Links internos e assets | Todos os alvos de âncora e arquivos relativos conferidos |
| Catálogo oficial | Oito destinos de navegação consultados: HTTP 200 |
| Browser | 4 cenários: 390/1440 × claro/escuro; zero erro JS, 404, requisição externa ou violação CSP |
| Responsividade | Sem overflow horizontal nos quatro cenários; navegação móvel por disclosure nativo |
| Fontes | FontFace de Sora, Plus Jakarta Sans e Geist Mono carregadas localmente |
| Teclado | Skip link, foco visível e troca de tema por link nativo conferidos |
| Contraste de texto | 1.506 amostras acumuladas nos quatro cenários, nenhuma abaixo do piso aplicável; sem certificar todos os estados ou pares |

Os oito PNG adjacentes mostram abertura e logos nos quatro cenários. `brand-system-browser.json` guarda as medições. O hash exato dos tokens está em `previews/brand-system/provenance.json`.

## Limites e pendências

- A medição de texto resolve fundos sólidos e composição de transparência. Gradientes, imagens e contraste de bordas não integram essa medição.
- As amostras de sombras mostram os valores disponíveis; o contrato específico continua governando cada componente.
- Leitor de tela real, outros navegadores e aceite visual humano permanecem separados.
- As referências de componentes são do DS. O consumo e a conformidade de produtos são validados em seus ambientes privados.
- Publicação do novo diretório no Pages depende da alteração coordenada da lista compartilhada. Nenhuma alegação de publicação é feita por criar os arquivos.
- O parecer independente e o CI do SHA final continuam como gates antes de entrega pública.

## Varredura de conteúdo público

O diff novo foi examinado por caminhos locais, arquivos privados, rotas de produto, dados de clientes e endereços de e-mail: zero ocorrência nos padrões dirigidos. Os exemplos e imagens desta entrega são exclusivamente do sistema de design, com dados fictícios.

## Complemento de revisão

O CodeRabbit apontou um achado menor: a captura do hash começava após a primeira geração. A prova agora captura o hash antes de qualquer build e o compara após ambas as gerações.

A ressalva do Revisor sobre recursos fora do Pages foi tratada sem alterar o núcleo: contratos e fichas apontam para a fonte pública no SHA `48fe3ce1e9f081a1ad01584c9cf60263fcfb5085`. Os dezesseis destinos responderam HTTP 200. Reintroduzir os antigos links relativos produz RED de 1 falha/4 aprovações; restaurar a fonte volta a GREEN 5/5. A suíte completa permanece 825/825 e os quatro cenários de navegador foram novamente aprovados. A publicação da pasta de marca continua como gate separado.

## Complemento de 24/11/2026 — Resumo da análise

Seção 06 nova nas duas aparências: exemplo fictício nos quatro estados de item, aviso de falha, regras e o bloco "Não usar". As seções seguintes foram renumeradas; agora são dezessete entradas de navegação.

| Verificação | Resultado |
|---|---|
| Jest do DS | 43 suítes, 861 testes aprovados; zero falha e zero pulado |
| Testes da vitrine Xscore | 8 aprovados (2 novos: padrão nos dois temas, e referência fora da publicação) |
| RED | Texto "Dentro da política" no cartão vivo: 1 falha / 7 aprovações. Sem a pasta de referência: 1 falha / 7 aprovações. Fonte restaurada e conferida com `cmp`; GREEN 8/8 |
| Browser | 4 cenários (390/1440 × claro/escuro): zero erro JS, 404, requisição externa, violação CSP ou overflow; contraste de texto sem amostra abaixo do piso (462–463 amostras por cenário) |
| Publicação | Os testes de publicação do Xscore passaram (5/5) localmente; a pasta `reference/` não está na lista do Pages |

`resumo-analise-*.png` mostra a seção nos quatro cenários, capturada da página inteira para que o cabeçalho fixo não a cubra. As capturas de abertura e logo foram regeneradas no mesmo ensaio. Leitor de tela real e aceite visual humano seguem separados.
