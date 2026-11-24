# Xscore — fundamentos e componentes

Status: base documental navegável, com valores existentes. A integração e os testes dos produtos são acompanhados separadamente em seus repositórios privados.

## Fonte e entrada

- [Brand System escuro](../previews/brand-system/index.html) e [claro](../previews/brand-system/light.html).
- [Tokens oficiais](../tokens/tokens.css): folha gerada a partir da fonte compartilhada do ResultX DS. Não editar valores gerados à mão.
- [Brand Book](BRAND-BOOK.md): dezoito capítulos de identidade visual, com lacunas explícitas.
- [Paridade estrutural](parity-matrix.md): referência Electia, situação e dependências.

## Fundamentos disponíveis

| Fundamento | Papéis existentes | Diretriz |
|---|---|---|
| Superfícies | `bg`, `surface-1` a `surface-4` | Organizar camadas, separações e densidade |
| Ação | `gold`, `gold-light`, `gold-ink`, `on-gold` | Separar preenchimento, tinta e texto sobre preenchimento |
| Inteligência | `intel`, `intel-on-dark` | Destaque de informação especializada |
| Estado | `success`, `warning`, `danger`, `info` | Texto com significado; cor complementar |
| Tipografia | `font-heading`, `font-body`, `font-mono`, `text-*`, `weight-*` | Sora, Plus Jakarta Sans e Geist Mono; numerais tabulares |
| Forma | `radius-sm`, `radius-md`, `radius-lg`, `radius-xl`, `radius-full` | Exemplos gerados dos valores existentes |
| Elevação | `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-gold` | Usar conforme contexto e contrato; Card sem sombra em repouso |
| Movimento | `duration-fast`, `duration-normal`, `duration-slow`, `ease-out` | Respeitar preferência por movimento reduzido |
| Identidade | Wordmarks claro/escuro, monograma e favicon | Arquivos oficiais, proporção preservada |
| Espaçamento | Escala semântica ainda ausente na marca | Dependência do Core; nenhuma escala inventada nesta entrega |

## Componentes compartilhados

Button, Field, Card, StatusBadge, StatCard, DataTable, ConfirmDialog, EmptyState/ErrorState e Choice seguem os nove contratos públicos do DS na revisão `9da663fff3641f4021e94e1ef5f1deba85441c69`. A vitrine liga aos contratos e exemplos oficiais do catálogo na combinação Xscore × tema. O comportamento e as variantes não são duplicados dentro da documentação de marca.

Existência de contrato, exemplo no catálogo e adoção no produto são fatos diferentes. Esta base documenta os dois primeiros. A conformidade de cada implementação exige executar seus próprios casos, estados e testes de consumo.

## Composições e aplicações

A seção de dados apresenta valores fictícios, alinhamento tabular, unidade explícita, ausência e estado textual. É uma demonstração de linguagem visual; não publica regras ou fluxos de produto.

### Padrões para produtos de crédito

| Padrão | Situação | Componentes existentes que o compõem | Limite documentado |
|---|---|---|---|
| Tabela financeira | EXISTE | DataTable | Composição tabular; sem formatação financeira especializada no contrato |
| Indicadores | EXISTE | StatCard | Valor, unidade, ausência e estados aplicáveis |
| Filtros avançados | PLANEJADO | Field, Choice, Button | Componentes existem; composição de filtros não |
| Status | EXISTE | StatusBadge | Estado textual sem catálogo especializado de operações |
| Fluxo de aprovação | PLANEJADO | Button, ConfirmDialog | Ação e confirmação existem; fluxo composto não |
| Estado vazio | EXISTE | EmptyState | Mensagem contextual e próximo passo |
| Estado de erro | EXISTE | ErrorState | Mensagem e ação conforme aplicabilidade |
| Carregamento | EXISTE | DataTable, StatCard, EmptyState | Estado ocupado pertence à região em atualização |
| Resumo da análise | ADOTADO NO XSCORE (#360, 24/11) · sem contrato próprio no DS | Card, StatusBadge, Button (link); aviso de falha é composição própria, não ErrorState | Registra a composição como está no produto; conformidade dos componentes do produto aos contratos não verificada aqui |

As composições e rótulos de demonstração usam conteúdo fictício. A presença de um contrato não cria uma variante de domínio nem comprova uso em produto.

EXISTE e PLANEJADO falam de contratos do DS. ADOTADO NO XSCORE fala de uso no produto: o padrão está em uso, mas o DS não tem contrato para ele.

### Resumo da análise

Decisão do Marcos em 24/11/2026: registrar o padrão **como está no ar** no Xscore (#360). Exemplo fictício nos dois temas na seção 06 do Brand System ([escuro](../previews/brand-system/index.html#ds-credit-summary), [claro](../previews/brand-system/light.html#ds-credit-summary)).

**Propósito.** Mostrar, no topo da ficha, o que o laudo do birô informou, antes da leitura completa. O cartão só lê o laudo gravado; não recalcula nem julga crédito.

**Estrutura.**

1. Cabeçalho: "Resumo da análise · laudo {fonte} de {data}" e o nome da empresa. O selo de decisão aparece só depois de uma decisão humana fechada (Aprovada, Aprovada com outro valor ou Reprovada), com quem decidiu e quando. Antes disso, não há selo.
2. "O que o laudo mostra", nesta ordem: score do birô, protestos, pendências financeiras, tempo de empresa, situação cadastral, e falência, ações e cheques num item só.
3. Rodapé: "Limite sugerido pelo birô" (só quando o laudo traz), "É uma recomendação. Quem decide é a alçada." e o link "Ver laudo completo".

**Estados de item.** Quatro estados, cada um com ícone de forma própria e texto para leitor de tela:

| Estado | Ícone | Quando |
|---|---|---|
| Sem apontamento | círculo com visto | O birô consultou e não trouxe ocorrência; situação cadastral ativa |
| Atenção | triângulo | Ocorrência constatada; situação cadastral inativa, suspensa ou baixada |
| Sem dado | círculo tracejado | O birô não informou, o dado veio ilegível ou a data é inválida |
| Informação | "i" | Score e tempo de empresa: mostrados, nunca julgados |

**Estados do cartão.** Pronto (cartão completo). Oculto, para quem não pode ler o laudo ou quando não há laudo estruturado. Falha de leitura: aviso "Não foi possível montar o resumo do laudo agora." com o caminho para o laudo completo, nunca um cartão vazio ou com zeros.

**Regras de exibição.**

- "Nenhum registro" só quando o birô declarou ter consultado a categoria e não trouxe ocorrência. Sem essa declaração, ou com lista ilegível, o item diz "o birô não informou". Desconhecido nunca vira limpo.
- No item agrupado, as ocorrências e as categorias que o birô não cobriu aparecem juntas, e uma não esconde a outra. Exemplo: "ação judicial 1 · o birô não informou: falência, cheque sem fundo".
- A quantidade vem do campo estruturado da fonte, nunca da contagem de linhas. Sem esse campo, o item diz "com registro", sem número.
- Dinheiro chega como string decimal e soma em centavos inteiros. Valor que faltou não entra como zero: o total diz "valor parcial" ou "valor não informado".
- O score aparece por fonte, cada um na sua escala, lado a lado, sem comparação entre fontes e sem mínimo. Escala não confirmada é dita em texto. O tempo de empresa é informativo, com mês e ano de fundação. Nenhum mínimo está configurado; inventar um seria regra de crédito na tela.

**Acessibilidade.** Cartão rotulado pelo nome da empresa. Ícones decorativos (`aria-hidden`), com o estado em texto para leitor de tela ("Atenção:", "Sem dado:"…). A cor reforça e não informa sozinha. No celular, título e detalhe se empilham. O aviso de falha usa `role="status"`. O que foi medido na vitrine está em [evidências](qa/brand-system-foundations.md); leitor de tela real não foi ensaiado.

**Não usar.** O modelo original de 23/11 trazia nota de 0 a 1000, régua Negar/Revisão/Restrição/Aprovar, selo "Dentro da política", mínimos por critério e "limite sugerido pela política". **O Xscore não tem nota única nem fundida (decisão D-0001)**, e a política vigente não tem faixas nem mínimos. Também ficam fora, por falta de fonte: nome e versão da política, atraso na carteira, legenda dos selos e versão curta para listas. O modelo está guardado só como [referência histórica, marcada "não usar"](../reference/do-not-use-policy-summary-model-2026-11-23/README.md), fora da vitrine publicada.

### Iconografia

O DS fornece utilitários CSS para SVG inline compatíveis com desenhos Lucide, Phosphor e Heroicons; não distribui uma coleção própria de desenhos. Os tamanhos disponíveis são 12, 16, 20, 24, 32 e 40 px; contêineres de ícone usam 28, 36, 44 ou 56 px. O traço herda `currentColor`, com papéis de texto e de estado existentes. Ao lado de texto, o ícone é complementar. Ícone isolado exige nome acessível; ícone decorativo não entra na árvore acessível. Cor não deve ser o único meio de comunicar estado.

Fotografia, moodboard e templates de campanha, e-mail e relatório permanecem planejados, com direção de marca ainda pendente. As proporções listadas não são peças aprovadas. Origem, arquétipos e narrativa comercial não são preenchidos por suposição.

## Segurança da documentação

CSP `default-src 'self'`, igual ao catálogo compartilhado. Nenhum script de navegador, estilo inline, CDN, fonte remota ou requisição externa é necessário para renderizar o Brand System. Tema e seções usam navegação nativa; informações complementares usam `details`.

## Governança e reprodução

O gerador lê os tokens de marca, produz duas aparências, o Brand Book e a proveniência. A verificação comprova geração determinística e conservação dos bytes da folha oficial. Alterações de cor devem ser coordenadas na fonte compartilhada, com medição e PR própria.

Consulte o [guia de reprodução](../previews/brand-system/README.md) e as [evidências locais](qa/brand-system-foundations.md). A publicação deste novo diretório depende da inclusão coordenada na lista compartilhada do Pages; criar arquivos não comprova sua publicação.
