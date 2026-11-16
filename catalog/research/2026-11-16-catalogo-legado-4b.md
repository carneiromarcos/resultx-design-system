# Catálogo PR 4b — famílias e comportamentos publicados

## Escopo e origem

Continuação da 4a (#137), agora mesclada em d2c6973. A preparação partiu de
1930719, com autorização do Supervisor para reconciliar a base após o merge.
As decisões de arquitetura e UX continuam em vigor; o GO de Marcos de 16/11
permite somente os seis módulos já publicados, cada um na página própria.

São doze páginas nas dez combinações de marca e aparência, com 25 subfamílias
nomeadas. Não há valor de token, cor, versão ou componente distribuído alterado.
As receitas têm markup e dados fictícios; a apresentação vem do CSS atual do DS.
As ligações de marca da PR 1 permanecem iguais. Não é reconstrução dos produtos.

| Página | O que mostra | Comportamento |
|---|---|---|
| Navegação sobre a página | Painel lateral sobreposto | sidebar-overlay.js |
| Menu que desliza | Painel e véu, abrir/fechar | menu-drawer.js |
| Conteúdo e painel | Painel final e inicial, divisor | split-pane.js |
| Cabeçalho flutuante | Cabeçalho preso e sombra ao rolar | header-float.js |
| Abrir mais informações | Padrão e sem moldura | disclosure.js |
| Ação no rodapé do celular | Convite observado entre início e fim | cta-dock.js |
| Dica complementar | Quatro posições | CSS hover/focus-within, sem script |
| Mensagem breve | Sucesso, aviso, erro, informação e hidden | Estático, com pendência |
| Andamento | Lista, compacto, dentro de indicador | Estático, 0 e 100 fictícios |
| Ícones | Tamanhos, cores, fundos, botões, significado e movimento | SVG/CSS, sem biblioteca |
| Convite de encerramento | Painel de fechamento escuro | Links nativos, sem script |
| Padrões compostos | Visualização, filtro, passos, busca e período | Estático, com pendência |

A sidebar tem documento próprio: Navigation continua sem script e aponta para
essa demonstração. Não se carrega um módulo em toda a família de navegação.
Abas, dropdown, janela antiga, lista/detalhe, toast e compostos não recebem JS.
Os scripts de confirmação e tabela já aprovados nas PRs anteriores ficam iguais.

## Isolamento, cópia e segurança

O manifesto declara os arquivos permitidos; script-policy.cjs restringe a lista
por página. Molduras e documentos de legado não carregam código. A guarda rejeita
um módulo em Button ou em página de outro componente. O teste de geração compara
byte a byte os arquivos copiados com os originais de dist, sem transformar código.
Nenhuma dependência ou módulo de comportamento novo foi criado.

Todos os documentos mantêm CSP default-src self. Os módulos auto-inicializam;
não há script inline, CDN, unsafe-inline ou controlador paralelo. Template head/tail
é extraído durante o build: não é manipulação do DOM no navegador. Isso permite
que painel e véu sejam irmãos do conteúdo e que o dock seja o último elemento
antes dos scripts, conforme a implementação publicada.

A folha extended.css organiza somente a vitrine. A exceção de apresentação é a
largura fictícia completa do progresso e sua ligação ao accent existente, pois
progress-fill não tem preenchimento padrão no DS. Não se copia valor de cor.
O CTA panel conserva data-theme dark próprio; seu fundo em camadas e o título
em degradê não recebem uma aprovação de contraste por simplificação matemática.

## Teclado e responsividade

Nas dez combinações, os testes exercitam:

- Sidebar e drawer: abrir por teclado, limites de Tab/Shift+Tab, Esc, fechar e
  devolução ao gatilho. No drawer também se confere inert fechado.
- Split pane: Tab no divisor, seta, Home, End e restauração por Enter, com valores
  ARIA. Em 390 o divisor some e o conteúdo continua empilhado.
- Disclosure: Enter/Espaço, link interno, foco no summary, persistência após
  reload e fechamento com movimento reduzido.
- Header float: foco em link por Tab, PageDown muda a sombra, voltar ao topo
  remove o estado e conserva o foco. O menu mobile leva à página do drawer;
  não abre um segundo componente dentro do mesmo documento.
- Dock: PageDown revela, Enter segue o destino nativo e a barra some no destino.
  O teste prepara o foco no link e faz Shift+Tab/Tab antes do Enter; não demonstra
  uma ordem completa de Tab desde o início da página. O módulo não gerencia foco.
  Em 1440 o dock fica escondido conforme seu próprio CSS.

Todas as páginas são verificadas em 390 e 1440 sem rolagem horizontal da página,
com fontes realmente carregadas e recursos da mesma origem sem erros. Isso não
substitui teste em dispositivo real nem certifica leitor de tela. VoiceOver não
foi testado. Anéis, pixels de vidro sobre conteúdo em movimento e todos os estados
continuam pendentes de avaliação; não se apresenta o GREEN como AA integral.

## Contraste: amostra e pendências reais

140 pares de estilo computado em repouso são comparados com o relatório gerado,
com composição alfa sobre as superfícies reais. São 130 amostras de texto e dez de ícone; não são
medições por pixel ou cobertura de todos os descendentes, bordas, foco e estados.
Em menus fechados e no dock desktop, as propriedades computadas ainda resolvem;
a prova de visibilidade/interação é separada. O número não certifica esse estado.

Dois pares ficam abaixo de 4,5:1, ambos em eletia claro:

| Página / alvo | Texto RGB | Fundo composto RGB | Razão |
|---|---|---|---:|
| Header float / marca | 15,23,41 | 55,90;60,45;69,95 | 1,63:1 |
| CTA dock / texto | 15,23,41 | 55,90;60,45;69,95 | 1,63:1 |

A origem é text-primary claro sobre glass-strong-bg resolvido como
rgba(22,27,38,0.85), composto sobre rgb(248,250,251). Os avisos ficam nas duas
páginas, com consequência e próximo passo. Nenhum valor foi corrigido. CSV com
todos os pares: 2026-11-16-catalogo-legado-4b-contraste.csv.
Responsável: Supervisor DS com UX. Próximo passo: avaliar ligação com valores
já existentes em tarefa própria; se exigir valor novo, aguardar 10/12 e Marcos.

CTA panel está explicitamente sem medição de seus fundos em camadas e degradê.
As dívidas da 4a e do PdV escuro nos contratos não foram apagadas ou corrigidas.

## O que permanece fora

- Troca de abas e de visualização, dropdown, lista/detalhe, wizard, autocomplete,
  seleção/remoção de filtro e toast dinâmico: sem implementação nova autorizada.
- Gráficos, tabela legada ampliada, seleção/barra de lote e sparkline: PR 5 de dados.
- Pipeline específico, barras de avaliação e orb: PR 5/domínio, com aplicabilidade
  por marca. Não aparecem como ferramentas universais só por existir uma classe.
- URLs históricas e crawler completo: PR 6. Os testes desta PR verificam os
  documentos novos e a regressão do catálogo, não todos os sites consumidores.
- Capturas locais não são baselines. CI Linux final, parecer do Revisor, inspeção
  humana e publicação continuam gates separados do trabalho local.

## Provas da entrega

- RED de páginas: um teste executado, uma falha antes dos doze registros.
- RED da autorização: seis positivos recusados pela política anterior; seis
  negativos já recusados. GREEN da política: 18 casos.
- RED dos módulos por interceptação no teste: uma falha por cada um dos seis
  arquivos omitidos; a ausência da inicialização é detectada. Nenhum dist foi
  editado. Logs red-modulo-*.log fora do repositório.
- Jest: 38 suítes, 803 aprovados. Lint principal, CSS do catálogo e build verdes.
  A suíte permanente confere geração dupla determinística e cópia idêntica.
- Playwright: 357 aprovados (237 anteriores e 120 novos), mais nova execução dos
  120 novos após ajustes de conteúdo/captura. Zero falhas, pulados ou flaky nos
  GREEN, com retries zero. Após corrigir a classificação do par de ícone
  para elemento não textual (mínimo 3:1), os dez casos de ícone foram reexecutados
  e aprovados. Execuções RED não são gates aprovados.
- npm pack: 288 caminhos idênticos à base 1930719. A comparação é prova desta PR,
  não uma trava histórica permanente no CI. Nenhum arquivo do catálogo no pacote.
- Diff vazio em dist, brands, tokens, adapters, contracts, generated, package/lock,
  workflows e STATUS. eds-root e pilot-aliases conservam os SHA-256 originais.
- Nenhum PNG ou baseline versionado. Sem push, PR, release ou alteração de produto.

Reprodução: npm ci; npm run lint; npm run build; npm test -- --runInBand;
npx stylelint 'catalog/*.css'; npx playwright test 'catalog-.*.spec.js' --workers=1.
O navegador padrão é o Chromium do Playwright; CATALOG_CHROME permite indicar
um Chrome instalado para a prova local. CATALOG_EXTENDED_EVIDENCE_DIR define
uma pasta externa de evidências. Para o RED de um módulo, CATALOG_OMIT_MODULE
recebe seu id e o filtro do Playwright escolhe somente esse caso. Essa variável
é consumida pelo teste, não pelo código do catálogo.

Evidências locais: /tmp/ds-catalogo-pr4b/provas/ e capturas/, manifesto SHA-256 em
/tmp/ds-catalogo-pr4b/manifesto.json. São 100 PNGs: seis páginas interativas nas
dez combinações (60), seis estáticas por marca no claro (30), e dez capturas
adicionais de sidebar em 390. O dock é capturado em 390 por ser mobile; os demais
exemplos principais em 1440. Todas as 120 combinações têm JSON e verificação em
ambas as larguras. As estáticas no escuro têm teste de estilo, não PNG adicional.
CI Linux final e aprovação humana continuam pendentes.
