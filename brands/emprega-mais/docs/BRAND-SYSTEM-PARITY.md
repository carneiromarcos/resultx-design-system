# Brand System emprega+ — matriz de paridade M2

Data: 17/11/2026. Estado: AGUARDANDO VALIDAÇÃO.
A paridade é de **estrutura, fundamentos e componentes de DS**. Não significa
copiar a aparência da eletia nem declarar implantação no produto.

Legenda:
- **E** — já existe e está conforme no recorte estrutural indicado;
- **A** — existe, mas precisa de adaptação;
- **I** — não existe e precisa ser implementado;
- **N** — específico da eletia, não se aplica;
- **C** — depende de mudança no núcleo compartilhado.

“E” identifica apenas uma evidência estreita de estrutura ou fonte canônica.
Não certifica AA, estados, comportamento, publicação ou uso em produção.

| Elemento da referência | Situação | Evidência de DS | Ação necessária |
|---|---|---|---|
| Fonte de tokens compartilhada | E | [DTCG central](../../../tokens/tokens.json) | Reutilizar a fonte vigente |
| Paleta de marca | A | [tokens](../tokens/tokens.css) e [ponte](../tokens/ds-bridge.css) | Reconciliar o texto histórico, sem mudar valor |
| Claro e escuro | A | Escopos existentes dos tokens | Exibir as duas composições e seus limites |
| Tipografia | A | Famílias/pesos e papéis dos tokens | Demonstrar fonte carregada, escala e fallback |
| Espaçamento | A | Escala da marca e do núcleo | Explicitar qual escala cada componente consome |
| Raios | A | Papéis já definidos | Relacionar raio ao componente oficial |
| Sombras/elevação | A | Papéis já definidos | Exibir apenas elevações existentes e contexto de uso |
| Motion | A | [guia](MOTION-GUIDE.md) e durações/easing | Exemplos com redução de movimento, sem efeito novo |
| Ícones | A | BRAND-BOOK e linguagem visual | Mostrar significado e nome acessível, sem impor biblioteca |
| Logos canônicos | E | [ativos por fundo](../assets/logo/) | Reutilizar arquivos; não redesenhar |
| Voz da marca | A | [BRAND-BOOK](BRAND-BOOK.md) | Exemplos claros de informação, erro e próximo passo |
| Hub com quatro entradas | I | Estrutura observada em M1 | Criar navegação própria sem dependências externas |
| Leitura integrada do Brand Book | I | Documento existe; hub integrado ausente | Apresentar o conteúdo atual sem duplicá-lo |
| Button e link de navegação | A | [contrato](../../../contracts/button.yaml) | Demonstrar três variantes e estados do contrato atual |
| Field | A | [contrato](../../../contracts/field.yaml) | Demonstrar rótulo, ajuda, erro e carregamento |
| Card | A | [contrato](../../../contracts/card.yaml) | Exibir tamanhos e estados aplicáveis |
| StatCard | A | [contrato](../../../contracts/stat-card.yaml) | Exemplo fictício, valor tabular e estados aplicáveis |
| DataTable | A | [contrato](../../../contracts/data-table.yaml) | Exemplo oficial com teclado e estados; não confundir amostra com integração |
| ConfirmDialog | A | [contrato](../../../contracts/confirm-dialog.yaml) | Foco preso, saída e retorno; script oficial se necessário |
| StatusBadge | A | [contrato](../../../contracts/status-badge.yaml) | Demonstrar somente variantes existentes |
| EmptyState/ErrorState | A | [contrato](../../../contracts/empty-state.yaml) | O que ocorreu, próximo passo e ação quando cabível |
| Escolha, seleção e texto longo | C | Lacunas já registradas no roteiro compartilhado | Propor extensão de contrato; não duplicar na marca |
| Janela de formulário e arquivo | C | Lote de contratos futuros do núcleo | Consolidar proposta com Supervisor antes de implementar |
| Abas/paginação e aviso | C | Padrões usados, sem conjunto de contratos completo | Seguir fila compartilhada, preservar comportamento |
| Layout/navegação | A | Famílias e exemplos do DS | Composições coerentes com a marca, testes de responsividade |
| Tipologia Cognitiva e resultados de avaliação | N | Domínio da referência | Não incorporar ao catálogo da marca-mãe |
| Indicador especializado de avaliação | N | Domínio da referência | Não transformar em KPI genérico |
| Social, formatos e fotografia | A | Guias existentes | Integrar as entradas; não criar acervo sem autorização |
| Arquétipo formal | I | Não localizado nos guias da marca | Validar a necessidade editorial com gestão/UX |
| Governança do catálogo e versões | A | Contratos, fonte DTCG e catálogo central | Vínculo de origem, geração determinística e registro de limites |

São **30 elementos**: 2 E, 20 A, 3 I, 2 N e 3 C.
Contagem das linhas acima, não percentual de conformidade.

## Menor caminho de implementação

1. Estruturar `previews/brand-system/` em arquivos novos da marca, sem alterar
   a referência ou o núcleo. Ler conteúdo existente em vez de mantê-lo em paralelo.
2. Demonstrar fundamentos com os tokens atuais e os logos canônicos, claro/escuro.
3. Compor os oito componentes a partir do código e contratos oficiais. Detalhes
   da integração do produto ficam em acompanhamento privado; exemplo não prova adoção.
4. Separar as lacunas do núcleo para o Supervisor consolidar com os demais
   consumidores; nenhum componente paralelo é autorizado por esta matriz.
5. Validar em 390/1440 e claro/escuro, teclado e estados. Falhas de contraste
   recebem pendência escrita; não declarar conformidade com base em guia antigo.
6. Encaminhar integração da publicação ao responsável pelo núcleo; a marca não
   modifica sozinha o montador compartilhado do site.

Mudanças de valores, ampliação de contratos e publicação não foram realizadas
por M1/M2. Situação das metas: [progresso](BRAND-SYSTEM-PROGRESS.md).
