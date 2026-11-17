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
