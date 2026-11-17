# Paridade estrutural — Xscore × referência Electia

Status: descoberta e primeira base navegável, 17/11/2026. Critério: **mesma maturidade, identidade própria**. Este documento público descreve apenas o sistema de design. Evidências internas de consumo, inventário de telas e testes ficam no repositório privado do produto.

Fontes públicas: `electia-reference-inventory.md`, `electia-reference-outline.json`, tokens e assets desta marca, oito contratos em `contracts/` no DS `48fe3ce1e9f081a1ad01584c9cf60263fcfb5085`.

Legenda: **conforme** = artefato aplicável existe e foi conferido; **parcial** = existe parte; **ausente** = não encontrado; **específico** = exige tradução de domínio/identidade; **dependente do Core** = depende de contrato ou token compartilhado. Conformidade documental não é conformidade de implementação.

| Categoria da referência | Xscore nesta inspeção | Classificação | Caminho de paridade |
|---|---|---|---|
| Hub Brand Book / DS / Screens / References | Hub próprio estático, com dois temas | parcial | Fundamentos e Brand Book presentes; aplicações e adoção seguem separadas |
| Essência, posicionamento e linguagem | Diretrizes visuais consolidadas, narrativa comercial explícita como pendente | parcial | Consolidar definições de marca sem inventar promessas |
| Arquitetura e relação com marca-mãe | Herança ResultX Labs documentada nos assets | parcial | Explicitar compartilhado e específico |
| Wordmark e favicon | Assets oficiais, variantes para claro/escuro e instruções | conforme | Mostrar proteção, mínimo e usos incorretos; validar aplicação separadamente |
| Superfícies e bordas | Tokens de marca claros/escuros | parcial | Amostras navegáveis presentes; manter medição por uso |
| Accent e texto | Ação dourada e tinta própria para o claro | parcial | Preenchimento e tinta documentados; manter limites de uso |
| Semânticas | Tokens de sucesso, atenção, erro e informação | parcial | Amostras textuais disponíveis; exemplos completos referenciados no catálogo |
| Gradientes | Gradiente de ação próprio | específico | Apresentar receitas reais e restrições de uso |
| Cores do domínio de avaliação | Não aplicáveis ao crédito | específico | Não transferir teorias nem classificações de outro produto |
| Tipografia | Famílias da marca declaradas nos tokens | parcial | Hierarquia, pesos, numerais e fontes locais demonstrados |
| Ícones e elementos visuais | Sem guia público consolidado | ausente | Documentar convenções verificadas sem criar biblioteca fictícia |
| Botões | Contrato compartilhado disponível | dependente do Core | Mostrar variantes e todos os estados; adoção verificada no produto privado |
| Campos | Contrato básico disponível; extensões em coordenação | dependente do Core | Label, descrição, erro, foco, indisponível; extensões só após contrato |
| Cards | Contrato disponível | parcial | Tamanhos, título, estados e ausência de sombra em repouso |
| StatusBadge | Contrato disponível; semântica da marca própria | parcial | Texto, cores com sentido e quebra de linha; domínio separado |
| Indicadores | Contrato StatCard disponível | parcial | Normal, ausência, carregamento, erro e ação opcional |
| Tabelas | Contrato DataTable disponível | parcial | Cabeçalhos, ordenação, teclado e estados externos |
| Vazio e erro | Contrato EmptyState/ErrorState disponível | parcial | O quê, próximo passo e ação; erro dinâmico anunciado |
| Confirmação | Contrato ConfirmDialog disponível | parcial | Nome, descrição, foco, cancelamento e carregamento |
| Outros padrões de navegação, filtros e dados | Necessidades específicas identificadas | específico | Separar componentes existentes, novos e planejados; nenhum status fictício |
| Exemplos de telas | Sem evidência pública portável nesta marca | ausente | Exemplos somente com dados fictícios, sem expor o produto privado |
| Tom e voz / nomenclatura | Sem guia público consolidado | ausente | Frases claras e curtas; exemplos próprios, sem copiar copy da referência |
| Origem, arquétipos, história | Não definidos nesta auditoria de DS | específico | Não preencher com narrativa inventada |
| Fotografia e imagem | Sem direção pública consolidada | ausente | Direção própria quando aprovada; não copiar hero da referência |
| Social / moodboard / formatos | Sem kit nesta marca | ausente | Distinguir demonstração de template aprovado |
| Aplicações e-mail / PDF / social | Sem guia público da marca | ausente | Regras de identidade e exemplos fictícios, sem detalhes operacionais |
| Checklists e atualização | Pacote próprio com fonte, hash e comandos | parcial | Validar publicação e sincronização na entrega compartilhada |
| Ferramentas da referência | Tema por link nativo, swatches, índices e navegação implementados | parcial | Sem scripts; aplicações de campanha permanecem planejadas |
| Espaçamento semântico | Escala não publicada nos tokens da marca | dependente do Core | Proposta coordenada; não redefinir o Core nesta frente |

## Escopo do catálogo planejado

Fundamentos → componentes compartilhados aplicáveis → composições especializadas com dados fictícios → aplicações de marca → consumo e governança. Cada entrada indicará **existente**, **novo nesta entrega** ou **planejado**, com fonte e limite da prova. Paridade não exige copiar capítulos sem definição de marca: estes ficam explicitamente pendentes.

## O que esta matriz não aprova

Não atesta produção, integração completa nem acessibilidade integral. A evidência de consumo e as divergências dos componentes reais são mantidas no pacote de auditoria privado. M1 e a matriz estrutural são base de trabalho para o catálogo; a missão M1–M9 permanece aberta.

## Primeira base navegável

Entrada em `brands/xscore/previews/brand-system/`: duas aparências, dezesseis entradas de navegação, dezoito capítulos e referências aos oito contratos. `BRAND-BOOK.md` e `DESIGN-SYSTEM.md` consolidam os fundamentos existentes. Os valores da marca não foram alterados. Espaçamento continua dependente do Core; nenhuma diferença de cor foi corrigida nesta frente.

Esta entrega avança M3/M4 em estrutura e fundamentos. Não fecha aplicações planejadas, narrativa comercial, integração de produto ou certificação integral de acessibilidade. Publicação do novo diretório depende de coordenação na lista compartilhada do Pages.
