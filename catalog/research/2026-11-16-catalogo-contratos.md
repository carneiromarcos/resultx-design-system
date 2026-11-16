# Catálogo — PR 3, oito contratos

## Escopo e decisão

Base: main 764866b, depois da publicação do catálogo (#135).
Páginas: Button, Field, Card, StatCard, DataTable, StatusBadge, EmptyState/ErrorState
 e ConfirmDialog, para eletia, emprega+, Xscore, PdV e ResultX, em claro e escuro.
São 80 documentos de componente e 80 molduras; as fundações continuam disponíveis.
Não houve mudança em valores, contratos, adaptadores de produto ou versão.

Em 16/11, o Supervisor transmitiu o OK do Marcos para extrair o JS inline
existente. Confirmação e ordenação usam arquivos locais compartilhados com o
piloto, sem dependência, CDN, unsafe-inline ou inclusão no pacote. Só essas
páginas carregam seus respectivos arquivos. A seleção de tema continua por URL
no piloto e por links/documentos estáticos no catálogo.

A extração mantém o corpo das instruções originais, normalizando somente
indentação e separação entre arquivos. O tema do piloto conserva seu script
original, agora externo. A comprovação funcional permanece nos 111 casos já
existentes e nos 20 ensaios novos de diálogo e tabela (dois por marca/tema).

## Fonte e apresentação

O manifesto liga cada página ao contrato, à ficha gerada, ao adaptador
e ao exemplo canônico. As fichas legadas permanecem excluídas com motivo: suas
demais famílias só entram nas PRs 4 e 5. Não se declara cobertura integral delas. Receitas não contêm estilo inline, scripts inline,
cores ou medidas. O build deriva as ilustrações de mouse/foco/pressionado das
regras CSS atuais. IDs de clones são únicos, com rótulos e descrições religados.
Os exemplos de navegação apontam para um destino no mesmo documento.

As ações sem envio são explicitamente apresentadas como demonstração. O diálogo
simula carregamento e erro antes de confirmar, como o piloto. A tabela ordena
linhas fictícias por Enter e Espaço. O menu de componentes usa details nativo.

## Provas

- RED de cobertura: um teste executado, uma falha esperada. O manifesto da base
  não contém as páginas de componente. Arquivo de prova: red-paginas.log.
- RED de escopo JS: removida temporariamente a guarda, a fixture com script
  em Button deixa de ser recusada. Uma falha esperada; 15 testes fora do filtro
  nessa execução dirigida. Guarda restaurada antes do GREEN.
- RED de diálogo: esvaziado temporariamente seu arquivo, o teste real executa
  e falha porque o diálogo não abre. Arquivo restaurado byte a byte.
- RED de tabela: esvaziado temporariamente seu arquivo, o teste real executa
  e falha porque aria-sort não muda. Arquivo restaurado byte a byte.
- GREEN local: 35 suítes Jest, 773 testes; 100 casos do catálogo de componentes;
  37 casos de fundações/publicação; 111 casos existentes do piloto selecionados
  sem baselines. Zero falhas, pulados ou flaky nas execuções completas aprovadas.
- Lint principal e catalog/*.css aprovados. Build principal e catálogo aprovados.
  O teste permanente de determinismo compara hashes de duas gerações.
- npm pack --dry-run --ignore-scripts: 288 caminhos na base e no ramo, idênticos;
  nenhum dos três JS novos é publicado. Pastas protegidas, package.json,
  package-lock.json e STATUS sem diff contra a base.

Os comandos estão no README do catálogo. Para Chrome local, CATALOG_CHROME
aponta para um executável disponível. A prova do piloto usou uma configuração
externa que altera somente o executável do navegador, sem alterar o repositório.
A execução oficial no CI usa o Chromium da imagem Linux fixada no workflow.

## Contraste

O build resolve as declarações reais do adaptador e os papéis da marca. O teste
compara texto, preenchimento, borda e foco com getComputedStyle e recalcula WCAG.
Medições de borda/foco usam a superfície adjacente do exemplo; não se declara
prova por pixel, de overlay ou com leitor de tela. A borda de Button indisponível
é dispensada conforme o contrato; o texto continua sujeito a 4,5:1.

| Marca | Tema | Menor texto | Menor borda ativa | Menor foco |
|---|---|---:|---:|---:|
| eletia | claro | 4,61 | 4,61 | 7,25 |
| eletia | escuro | 4,58 | 4,58 | 6,52 |
| emprega+ | claro | 4,83 | 4,83 | 10,19 |
| emprega+ | escuro | 4,54 | 4,54 | 9,33 |
| Xscore | claro | 4,61 | 4,61 | 5,19 |
| Xscore | escuro | 4,58 | 4,58 | 6,54 |
| PdV | claro | 4,61 | 4,61 | 5,19 |
| PdV | escuro | 3,77 | 3,77 | 5,38 |
| ResultX | claro | 4,61 | 4,61 | 5,19 |
| ResultX | escuro | 4,81 | 4,81 | 6,87 |

Combinações abaixo do mínimo, somente PdV escuro:

| Par | Texto | Fundo | Contraste | Páginas afetadas |
|---|---|---|---:|---|
| Perigo/erro sobre superfície | --color-error, #EF4444 | --bg-surface-1, #1c2a4a | 3,77:1 | Button, DataTable, StatusBadge, ConfirmDialog |
| Ação indisponível | --text-muted, #8A939D | --bg-surface-2, #243661 | 3,80:1 | Button, Card, ConfirmDialog |

Os dois pares aparecem em 25 medições de texto, contando os clones de estado.
A borda de perigo 3,77:1 passa o mínimo não textual de 3:1. As páginas afetadas
mostram consequência e próximo passo; nenhuma cor foi criada ou corrigida.
O claro do PdV mantém o aviso de composição ainda não aprovada pela marca.

## Evidências e pendências

Evidências externas: /tmp/ds-catalogo-pr3/; logs em provas/, imagens e medições
em capturas/, com manifesto SHA-256. São 100 PNGs novos: 80 em 1440, mais 20
em 390 para botão/tabela. Todos os documentos foram inspecionados automaticamente
em 390 e 1440, sem rolagem horizontal. Não há baselines novas versionadas.

Pendentes: CI Linux no SHA final, parecer do Revisor, inspeção humana e publicação
pelo Supervisor. Contraste dos pares apontados exige decisão posterior à trava
até 10/12. VoiceOver, comparação por pixel e conformidade de produtos consumidores
não foram testados nesta etapa. Não se afirma que o catálogo prova esses itens.
