# Paridade estrutural — Xscore × referência Electia

Status: revisão documental em 18/11/2026. Critério: mesma maturidade estrutural, identidade própria. A revisão considera os artefatos públicos da marca e a revisão atual do ResultX DS `9da663fff3641f4021e94e1ef5f1deba85441c69`. Os nove contratos atuais são Button, Field, Card, StatusBadge, StatCard, DataTable, ConfirmDialog, EmptyState/ErrorState e Choice. A vitrine liga cada contrato e sua referência no catálogo ao mesmo SHA.

Legenda: **TEM** = estrutura e evidência pública presentes; **PARCIAL** = há estrutura, mas falta uma parte ou prova; **FALTA** = não há artefato correspondente. A tabela mede paridade de estrutura e documentação, não identidade visual nem conformidade do produto.

| Eixo | Estado | Evidência pública e limite |
|---|---|---|
| Navegação do catálogo | TEM | Duas aparências estáticas, índice interno navegável, sumário do Brand Book e links de tema. |
| Fundamentos | TEM | Brand Book documenta essência visual, arquitetura, aplicações, linguagem e lacunas sem inventar conteúdo. |
| Tokens | TEM | Amostras e proveniência vêm dos tokens atuais da marca; nenhum valor é redefinido na documentação. |
| Tipografia e ícones | TEM | Famílias e hierarquia tipográfica estão demonstradas; guia registra utilitários, escala, cor e acessibilidade da iconografia compartilhada. |
| Cores e temas | TEM | Temas claro e escuro, superfícies, ação, semânticas e gradientes aparecem em páginas separadas. |
| Componentes e variantes | TEM | Nove contratos atuais ligados por SHA fixo; documentação diferencia contrato compartilhado de composição de domínio. |
| Estados interativos | TEM | Estados e aplicabilidade são referenciados nos contratos oficiais, incluindo foco, carregamento, vazio e erro quando previstos. |
| Motion | PARCIAL | Tokens de duração e curva são mostrados; não há biblioteca de transições ou catálogo visual de movimento nesta marca. |
| Responsividade | TEM | A verificação registrada cobre 390 e 1440 px em ambas as aparências, com evidências de captura. |
| Acessibilidade | PARCIAL | CSP sem scripts, navegação nativa, textos além da cor e limites declarados; não há certificação completa por leitor de tela. |
| Exemplos de composição | TEM | Composições financeiras com valores fictícios mostram contratos existentes e identificam o que permanece planejado. |
| Documentação técnica | TEM | Fundamentos, nove contratos, proveniência, reprodução, segurança e paridade estão documentados. |
| Integração com o produto | PARCIAL | O DS oferece tokens e contratos oficiais; a documentação pública não prova adoção de cada componente nem conformidade em telas. |
| Governança | TEM | SHA de origem, proveniência, geração determinística, testes da marca e limites de publicação estão registrados. |

## Padrões de crédito documentados

Os estados descrevem composições suportadas pelos contratos atuais, não componentes especializados de crédito.

| Padrão | Estado | Componentes existentes | Evidência e limite |
|---|---|---|---|
| Tabela financeira | EXISTE | DataTable | Cabeçalhos, ordenação e estados; apresentação financeira é composição. |
| Indicadores | EXISTE | StatCard | Valor, unidade e estados aplicáveis. |
| Filtros avançados | PLANEJADO | Field, Choice, Button | Peças existem; padrão composto de filtros não existe. |
| Status | EXISTE | StatusBadge | Rótulo e variante semântica; sem vocabulário especializado de operações. |
| Fluxo de aprovação | PLANEJADO | Button, ConfirmDialog | Ação e confirmação existem; sequência especializada não existe. |
| Vazio | EXISTE | EmptyState | Conteúdo contextual e próximo passo. |
| Erro | EXISTE | ErrorState | Mensagem e ação conforme aplicabilidade do contrato. |
| Carregamento | EXISTE | DataTable, StatCard, EmptyState | Região em atualização comunica estado ocupado. |
| Resumo da análise | ADOTADO NO XSCORE | Card, StatusBadge, Button (link) | Composição em uso no produto (#360), sem contrato próprio no DS; conformidade do produto não verificada aqui. |

## Referência e critérios

A fonte de comparação é o inventário e o outline públicos da referência Electia, registrados nesta marca. A comparação é de estrutura: fundamentos, navegação, documentação, exemplos e governança. Não se copiam identidade, textos, tokens ou composições visuais.

Não se presume que a existência de um contrato, exemplo ou token prove integração de produto. Capturas e verificações demonstram apenas os documentos estáticos e os tamanhos ensaiados. Integração autenticada, leitores de tela, uso real de componentes e publicação compartilhada são gates separados.
