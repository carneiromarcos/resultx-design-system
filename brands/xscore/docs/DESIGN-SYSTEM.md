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

Button, Field, Card, StatusBadge, StatCard, DataTable, ConfirmDialog e EmptyState/ErrorState seguem os contratos públicos do DS. A vitrine liga aos exemplos oficiais do catálogo na combinação Xscore × tema. O comportamento e as variantes não são duplicados dentro da documentação de marca.

Existência de contrato, exemplo no catálogo e adoção no produto são fatos diferentes. Esta base documenta os dois primeiros. A conformidade de cada implementação exige executar seus próprios casos, estados e testes de consumo.

## Composições e aplicações

A seção de dados apresenta valores fictícios, alinhamento tabular, unidade explícita, ausência e estado textual. É uma demonstração de linguagem visual; não publica regras ou fluxos de produto.

Fotografia, moodboard e templates de campanha, e-mail e relatório permanecem planejados, com direção de marca ainda pendente. As proporções listadas não são peças aprovadas. Origem, arquétipos e narrativa comercial não são preenchidos por suposição.

## Segurança da documentação

CSP `default-src 'self'`, igual ao catálogo compartilhado. Nenhum script de navegador, estilo inline, CDN, fonte remota ou requisição externa é necessário para renderizar o Brand System. Tema e seções usam navegação nativa; informações complementares usam `details`.

## Governança e reprodução

O gerador lê os tokens de marca, produz duas aparências, o Brand Book e a proveniência. A verificação comprova geração determinística e conservação dos bytes da folha oficial. Alterações de cor devem ser coordenadas na fonte compartilhada, com medição e PR própria.

Consulte o [guia de reprodução](../previews/brand-system/README.md) e as [evidências locais](qa/brand-system-foundations.md). A publicação deste novo diretório depende da inclusão coordenada na lista compartilhada do Pages; criar arquivos não comprova sua publicação.
