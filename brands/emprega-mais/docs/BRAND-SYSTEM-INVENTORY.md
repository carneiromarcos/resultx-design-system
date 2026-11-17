# Brand System emprega+ — inventário estrutural M1

Data: 17/11/2026. Estado: AGUARDANDO VALIDAÇÃO. Entrega documental; não é
implantação, publicação nem certificação de acessibilidade.

## Referência e método

Referência de organização: [Brand System eletia](../../electia/previews/brand-system/index.html).
Foram navegadas 31 âncoras: abertura/hub, 11 áreas de conteúdo e 18 capítulos do
Brand Book renderizado. As seis demonstrações relacionadas foram abertas. A
inspeção abrangeu claro/escuro e amostras em 390 e 1440; não certifica todas as
páginas ou todos os estados de cada demonstração.

A referência reúne quatro portas de entrada: **marca, sistema visual, exemplos
de composição e referências editoriais**. Seu índice lateral é recolhido no
celular. Há alternador de tema e leitura do Brand Book. A referência contém
estilos locais e dependências externas; sua organização é referência de
maturidade, não autorização para duplicar estilos ou dependências.

Fonte conferida no ResultX DS: `bacddd9`. O identificador editorial da página,
a versão do Brand Book e a versão do pacote são registros diferentes. Textos
como “AA” ou “validado” na amostra não substituem evidência executável.

## Navegação visual encontrada

| Área | Conteúdo observado | Aplicação à emprega+ |
|---|---|---|
| Abertura e hub | Identidade, apresentação e quatro entradas | Manter estrutura com identidade própria |
| Superfícies e bordas | Amostras claras/escuras e nomes dos papéis | Ler tokens oficiais, não copiar amostras locais |
| Ação e texto | Ação principal, hover e tinta | Separar ação de produto e acento institucional |
| Cores de estado | Sucesso, atenção e erro | Preservar significado e medir os pares usados |
| Gradientes | Amostras e aplicações | Usar somente os já definidos e apropriados ao contexto |
| Cores de avaliações | Identificação de teorias comportamentais | Específico da eletia; não incorporar à marca-mãe |
| Tipografia | Sora, Inter e amostra de dados monoespaçados | Usar papéis oficiais e pesos disponíveis |
| Botões | Principal, secundário, perigo, discreto e desativado | Contrato atual prevalece sobre a amostra histórica |
| Componentes | Campos, cards, progresso e indicador numérico | Reutilizar contratos e implementação oficiais |
| Composições | Entrada, painel, listas e detalhe | Exemplos fictícios, sem reproduzir operação privada |
| Referências editoriais | Fotografia, voz e composições | Orientação própria da emprega+ |
| Formatos | Peças e banners por canal | Aplicável à comunicação; separado da interface |
| Brand Book | 18 capítulos navegáveis | Ver correspondência abaixo |

## Correspondência dos 18 capítulos

| Capítulo da referência | Fonte já existente na emprega+ | Lacuna estrutural |
|---|---|---|
| 1. Essência | [BRAND-BOOK](BRAND-BOOK.md), essência e propósito | Apresentação navegável |
| 2. Arquitetura de marca | BRAND-BOOK, arquitetura e produtos | Separar marca-mãe das aplicações |
| 3. Wordmark | BRAND-BOOK, logo e assinaturas; ativos canônicos | Demonstrar uso por fundo sem redesenhar |
| 4. Paleta | Tokens gerados e ponte semântica | Reconciliar descrições históricas |
| 5. Tipografia | Tokens de fonte; guia editorial | Exibir escalas e pesos realmente disponíveis |
| 6. Tom e voz | BRAND-BOOK, tom e voz | Exemplos curtos por contexto |
| 7. Iconografia | BRAND-BOOK e guia de sistema | Distinguir linguagem visual de biblioteca de implementação |
| 8. Aplicações | BRAND-BOOK, aplicações | Composições fictícias ligadas ao código oficial |
| 9. Nomenclatura | BRAND-BOOK, arquitetura e grafia | Reunir regras existentes, sem criar produto novo |
| 10. Coexistência | BRAND-BOOK, assinaturas e endosso | Exemplos de convivência sem misturar identidades |
| 11. Origem | BRAND-BOOK, origem | Síntese institucional; não copiar história de outra marca |
| 12. Posicionamento | Essência, públicos e promessa existentes | Seção explícita, com validação editorial |
| 13. Arquétipo | Não localizado como seção formal | Decisão editorial; não inventar classificação |
| 14. Fotografia | [IMAGE-PROMPTS](IMAGE-PROMPTS.md) e BRAND-BOOK | Galeria apropriada com origem e uso autorizados |
| 15. Checklist | BRAND-BOOK, checklist canônico | Checklist da interface com evidências |
| 16. Aplicação em páginas | [DESIGN-SYSTEM](DESIGN-SYSTEM.md) e exemplos históricos | Distinguir exemplo de adoção real |
| 17. Diretrizes visuais | DESIGN-SYSTEM, superfície, estados e acessibilidade | Alinhar texto à fonte gerada atual |
| 18. Social | [SOCIAL-MEDIA-GUIDE](SOCIAL-MEDIA-GUIDE.md) | Entrada integrada, sem duplicar o guia |

## Fundamentos e ferramentas disponíveis

- Fonte compartilhada: [DTCG](../../../tokens/tokens.json), níveis primitivo,
  semântico, componente e marca. JSON histórico da marca não é fonte do build.
- [Tokens da marca](../tokens/tokens.css): 86 nomes únicos declarados, incluindo
  cores, famílias/pesos, espaçamento, raio, sombra e duração/easing.
- [Ponte semântica](../tokens/ds-bridge.css): 18 nomes declarados.
- [Fundação de compatibilidade](../tokens/eds-root.css): 56 nomes declarados;
  claro/escuro, famílias, raios, sombras, tintas, superfícies e bordas. Não cobre
  por si só toda a escala do núcleo. Valores permanecem congelados até 10/12.
- [Aliases do piloto](../tokens/pilot-aliases.css): 26 nomes declarados e
  [SHA](../tokens/pilot-aliases.css.sha256). A geração e o consumo são etapas distintas.
- [Contratos](../../../contracts/), [fichas geradas](../../../generated/component-cards/)
  e [catálogo compartilhado](../../../catalog/README.md) já existem: não criar
  uma segunda implementação dos oito componentes no Brand System.
- [MOTION-GUIDE](MOTION-GUIDE.md): princípios, duração, easing, hover e redução
  de movimento documentados. Existência de guia não comprova adoção universal.
- Logos claros/escuros já existem em [assets](../assets/logo/). A futura vitrine
  deve carregar os arquivos canônicos, sem reconstruí-los por texto ou CSS.

Contagens são nomes únicos encontrados em declarações CSS, não quantidade de
papéis independentes nem medida de conformidade. Não foram somadas entre arquivos.

## Estados, responsividade e acessibilidade

A amostra histórica demonstra repouso, hover, foco e desativado; não apresenta
uma grade completa e verificável de erro/carregamento/vazio em cada componente.
O botão discreto é amostra histórica, não variante nova autorizada do contrato.
Os contratos atuais acrescentam essa obrigação quando aplicável. O novo Brand
System deve mostrar o que cada estado significa, seu próximo passo e a origem
da implementação; não prometer comportamento quando houver apenas composição.

A referência recolhe seu índice em largura menor, reduz a composição em 640 e
respeita redução de movimento. Foram observadas amostras sem rolagem horizontal
em 390; isso não certifica todos os exemplos. Navegação por teclado, nomes,
associações de erro, contraste por estado e leitura falada exigem provas próprias.
Não houve nova execução com leitor de tela nesta descoberta.

## Conflitos a reconciliar sem alterar valores

1. Guias editoriais antigos ainda descrevem ouro como ação geral; os tokens
   gerados distinguem pigmento institucional e ação da interface.
2. O guia antigo declara JSON local como fonte; a fonte vigente é a DTCG central.
3. Escalas/pesos e tema padrão em exemplos históricos não são prova da configuração
   atual. A futura página deve ler os arquivos atuais e explicar seus escopos.
4. O diretório navegável `previews/brand-system/` ainda não existe nesta marca.
5. A classificação editorial de arquétipo não foi encontrada; precisa de decisão
   de conteúdo, não de um token ou componente novo.

Matriz e próxima ação: [M2](BRAND-SYSTEM-PARITY.md).
