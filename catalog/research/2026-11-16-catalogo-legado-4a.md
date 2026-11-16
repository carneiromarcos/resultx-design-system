# Catálogo PR 4a — famílias anteriores e navegação

## Divisão e escopo

Base: main 997e2a9, após a PR #136. A divisão foi informada ao Supervisor antes
da implementação, seguindo arquitetura/UX e a seção 3 do levantamento:

- 4a: Button, Card, Field, StatusBadge, EmptyState e ConfirmDialog recebem uma
  seção recolhida de legado; páginas novas de Navigation, Layout, Segmented e
  ListItem. Dez famílias nas dez combinações, 54 subfamílias visuais nomeadas.
- 4b, entrega separada: split-pane, disclosure, menu-drawer, header-float,
  tooltip, toast, progress, icons, cta-dock, cta-panel e composite. Até 100
  capturas: nove famílias nas dez combinações, mais uma por marca para icons
  e progress; todas as combinações continuam sujeitas ao teste de estilo.
- Dados, conversa e domínio ficam na PR 5; URLs antigas e crawler na PR 6.

O legado fica no fim do sucessor, em details fechado, com “Para telas novas,
use o … acima”. O iframe legado tem seu próprio documento e CSS: o bundle
antigo não entra no documento rx-* e não altera os componentes oficiais.
Nenhum JavaScript novo é carregado; os dois scripts anteriormente autorizados
continuam apenas nas páginas oficiais de confirmação e tabela.

As receitas HTML do catálogo têm somente markup, conteúdo fictício e classes
existentes. A aparência vem dos CSS reais copiados no build. Não se introduzem
cores ou valores de tokens. Nenhuma fonte visual é copiada de previews privados.
O índice subfamilies.config.json associa as seções das fichas a amostras nomeadas
ou a uma exclusão fundamentada. Fichas de domínio não viram exemplos globais.

## O que aparece

| Família | Subfamílias |
|---|---|
| Botões anteriores | Variantes, tamanhos, largura, social, reflexo CSS, indisponível/carregando |
| Cartões anteriores | Básico, destaque, conteúdo com status, grade |
| Campos anteriores | Input/ajuda, select, checkbox/link, separador, toggle, textarea, indicação de atalho, composição de login, indisponível |
| Etiquetas anteriores | Status, compacto, contêineres de ícone, categorias e ponto |
| Vazio anterior | Página e área menor |
| Janela anterior | Padrão, pequena e grande com formulário |
| Navegação | Sidebar, rail, overlay, painel, header, tabs, breadcrumb, dropdown |
| Layout | Lista/detalhe, centralizado, autenticação com apresentação, toda a área, posicionamento de menu |
| Segmented | Base, stacked, pequeno, grande, largura, chips e opção indisponível |
| ListItem | Padrão, selecionado, não lido, compacto e alias anterior |

A tipologia de avaliação das etiquetas fica para domínio/eletia. A linha compacta
de busca fica para compostos/4b. Elas não são contadas como exemplos globais.

## Organização da amostra versus produto

Menus e janelas ficam no fluxo da amostra, sem cobrir o catálogo; é alteração de
geometria da vitrine, não da implementação distribuída. Cores, fontes, bordas,
raios e estados vêm do componente original. O body conserva o fundo do bundle.

A grade antiga de cards exige rolagem em coluna estreita: a declaração grid-3
posterior vence sua regra anterior de uma coluna no bundle. A amostra mantém a
grade, em contêiner com overflow auto e acesso por teclado. Isso não comprova
responsividade automática do componente no produto. O aviso permanece na página.
Nenhum CSS de componente foi corrigido nesta entrega.

Os links usam destino local, e formulários não enviam dados. A janela antiga é
apenas visual, sem role modal fictício. O exemplo oficial acima continua sendo o
local para testar abertura, contenção do foco, Esc e confirmação.

## Medição e pendências de contraste

Foram conferidos 370 pares de repouso contra getComputedStyle: cores translúcidas
são compostas sobre o fundo real, incluindo a cor sob a borda. Não é inspeção por
pixel. Os números e as pendências aparecem em “Ver detalhes” nas páginas.

135 pares ficam abaixo do piso adotado: 30 de texto e 105 de limite/borda. O
limite sem borda inclui casos intencionais como ghost; a necessidade de exceção
ou de outra identificação do controle depende de UX, não é dispensada pelo teste.
Nenhum GREEN é apresentado como conformidade integral do legado.

| Marca | Tema | Textos abaixo de 4,5 | Menor texto | Limites abaixo de 3 | Menor limite |
|---|---|---:|---:|---:|---:|
| eletia | claro | 3 | 2,69 | 10 | 1,00 |
| eletia | escuro | 2 | 3,76 | 11 | 1,00 |
| emprega+ | claro | 3 | 2,80 | 10 | 1,00 |
| emprega+ | escuro | 2 | 3,76 | 11 | 1,00 |
| Xscore | claro | 5 | 2,69 | 11 | 1,00 |
| Xscore | escuro | 1 | 4,09 | 10 | 1,00 |
| PdV | claro | 5 | 2,69 | 11 | 1,00 |
| PdV | escuro | 3 | 3,43 | 10 | 1,00 |
| ResultX | claro | 5 | 2,69 | 11 | 1,00 |
| ResultX | escuro | 1 | 4,32 | 10 | 1,00 |

A lista completa dos pares medidos reprovados, seletores, canais compostos, origem CSS e razão está
em [CSV](2026-11-16-catalogo-legado-4a-contraste.csv). Responsável pelo acompanhamento:
Supervisor DS, com UX para hierarquia/exceções. Próximo passo: avaliar correções
com tokens existentes em tarefa separada; se exigir mudança de valor de paleta,
aguardar 10/12 e decisão do Marcos. As duas pendências anteriores do PdV escuro
continuam nas páginas oficiais e não foram reabertas ou corrigidas aqui.

Foco é alcançado por teclado nos controles nativos. Isso não certifica o contraste
de todo anel, hover, animação, estado indisponível ou carregamento; esses estados
continuam com pendência escrita de verificação completa. VoiceOver não testado.

## Comportamentos para decisão única de JS

| Item | O que falta | Fonte existente / situação |
|---|---|---|
| Sidebar sobreposta/painel | Abrir/fechar, Esc, inert, contenção e retorno de foco | dist/sidebar-overlay.js; não carregado |
| Tabs | Trocar painel, aria-selected e teclado de abas | Responsabilidade de comportamento, sem módulo específico nos exports atuais; amostra estática |
| Dropdown | Abrir/fechar e teclado previsível | Sem módulo específico nos exports atuais; amostra aberta estática |
| Janela antiga | Abrir/fechar e foco modal | O script compartilhado atual serve ao dialog nativo oficial, não a esta estrutura antiga |
| Lista/detalhe | Atualizar painel a partir da seleção | Comportamento de aplicação; links de demonstração são nativos |
| SplitPane (4b) | Arraste, setas, limites e valores ARIA | dist/split-pane.js; sem autorização de carregamento |
| MenuDrawer (4b) | Modalidade, Esc, contenção/retorno do foco | dist/menu-drawer.js; alternativa CSS não comprova o comportamento completo |
| HeaderFloat (4b) | Estado observado ao rolar | dist/header-float.js, opcional; estados serão visuais |
| CTADock (4b) | Exibir/ocultar conforme área observada | dist/cta-dock.js; não carregado |
| Toast (4b) | Inserção, dispensar, pausa de temporizador se houver | Sem controlador específico publicado; não simular anúncio dinâmico com CSS |
| Compostos (4b) | View toggle, wizard, autocomplete, kanban e ações de seleção | Dependem dos cenários; não serão prometidos só pelo visual |
| Disclosure (4b), opcional | Animação de fechamento e persistência | dist/disclosure.js; details abre/fecha nativamente sem JS |

Sem necessidade de JS novo para o básico: segmented (rádio nativo), links de
ListItem/breadcrumb, campos nativos, tooltip por hover/focus-within em CSS,
disclosure nativo, ícones, progress estático e links do CTAPanel. O inventário
não autoriza nenhum desses scripts: a decisão permanece com o Marcos.

## Provas e limites da entrega

- RED de manifesto: um teste executado e uma falha esperada na árvore anterior,
  sem os seis blocos de legado e as quatro páginas.
- RED por mutação: retirando variants da receita de botão, o teste de subfamília
  executa e falha. Receita restaurada byte a byte. Cinco casos fora do filtro
  nessa prova dirigida; não são skips do GREEN completo.
- GREEN: 36 suítes Jest, 780 testes; 100 casos novos de legado, mais os 137 casos
  existentes de componentes/fundações/publicação. Zero falhas, skipped ou flaky
  nas execuções completas aprovadas, sem retries.
- Lint principal, lint catalog/*.css e build aprovados. Build determinístico e
  escrita restrita continuam na suíte permanente. npm pack: os mesmos 288
  caminhos da base, sem arquivos novos de catálogo no pacote.
- Pastas protegidas, package.json, lockfile, STATUS e versões sem alteração.
  Nenhum baseline ou PNG versionado. Não houve mudança fora deste repositório.

Evidências locais: /tmp/ds-catalogo-pr4a/capturas/ (100 PNGs em 1440 e 100 JSONs),
manifesto SHA-256 em /tmp/ds-catalogo-pr4a/manifesto.json, logs em provas/.
Todos os exemplos também foram verificados em 390, sem rolagem da página; a
rolagem da grade fica dentro da amostra. Capturas são evidência local, não
referência Linux. CI no SHA final, parecer independente, inspeção humana e
publicação permanecem gates separados. A PR 4b não foi implementada nesta entrega.
