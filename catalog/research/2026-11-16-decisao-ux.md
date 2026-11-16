# Decisão de UX: catálogo de todas as marcas (@ux-design-expert, Uma, 16/11/2026)

Base: levantamento do Executor de 16/11 (main e80d611e), mais a leitura de `docs/viewer.html`, `examples/pilot.html`, `tokens/themes/preview.html`, `brands/*/tokens/tokens.css`, `docs/components/*.md` e `brands/*/assets` no worktree ds-catalogo. Nada foi renderizado nesta etapa. Contraste, carregamento de fontes e aparência real estão **não verificados**.

## 1. Navegação e arquitetura de informação

**Quem lê e o que precisa:**
- **Marcos:** ver cada marca e aprovar. Precisa de imagem, de frases simples e de saber o que falta.
- **Agentes que constroem telas:** saber qual componente usar, qual classe e quais estados existem, sem ambiguidade entre o legado e o contrato.
- **CTO:** de onde vem cada valor, contraste medido e revisão do DS.

O texto da página serve ao Marcos. O detalhe técnico (classe, token, arquivo de origem, receita HTML, números de contraste) fica em "ver detalhes", que agentes e CTO abrem.

**Estrutura:**
- **Barra fixa no topo** com as cinco marcas: eletia, emprega+, Xscore, PdV e ResultX. O nome é sempre o público, com eletia e emprega+ em minúsculas e sem `text-transform`. Ao lado fica o seletor Claro | Escuro, um segmented de duas opções. O tema escolhido continua valendo quando a pessoa troca de marca.
- **URL fixa** no formato `/catalog/{marca}/{tema}/{página}`, para dar para mandar link de uma tela exata. O caminho técnico `electia` continua funcionando e redireciona para o novo.
- **Entrada do site:** um índice curto com as cinco marcas, cada uma com logo, uma frase de quem é e o link. Logo abaixo vem a tabela "o que existe em cada marca", escrita em palavras e não em letras P/M/V.
- **Primeira página de cada marca é a visão da marca**, nesta ordem:
  1. logo no tema atual;
  2. cores por função (ação, superfície, texto, estados), sem lista crua de tokens;
  3. tipografia: título e texto corrido com o nome da família;
  4. raio e sombra num cartão de exemplo;
  5. voz, em duas ou três frases tiradas do BRAND-BOOK, com link para ele.

  Sobre a voz: o Xscore não tem pasta `docs`, então a voz dele aparece como pendência, com o que falta e o próximo passo. O conteúdo de voz das outras marcas está **não verificado**.
- **emprega+:** IMO e EditalHub aparecem como texto "usado em", nunca como marcas no seletor.
- **Componentes agrupados por tarefa, e não por arquivo:**
  - Ações: botões e links de ação.
  - Formulários.
  - Conteúdo e dados: cards, stats, tabelas, badges, list item e data-cards.
  - Navegação e layout: navegação, menu-drawer, split-pane, segmented, disclosure e layout.
  - Avisos e retorno: toast, empty-state, diálogo, progress e tooltip.
  - Conversa e IA: conversation e brand-orb.
  - Site e landing: header-float, cta-dock e cta-panel.
  - Domínio: o grupo só aparece nas marcas a que se aplica (ver item 2).
- **Moldura do catálogo:** usa uma família só (Inter) e fica neutra. A fonte e a cor da marca aparecem só dentro do quadro de exemplo, que é um documento isolado por marca, como o levantamento propõe. Assim a moldura não compete com a marca e a regra de uma família no texto corrido é respeitada.

## 2. O que "todos os componentes" significa

- **Uma página por componente, e não por arquivo.** As 38 fichas viram cerca de 30 páginas. Os 8 contratos (`rx-*`) são a versão principal de botão, campo, card, stat, tabela, badge de status, estado vazio e ConfirmDialog.
- **Legado na mesma página do sucessor.** `.btn` e o diálogo antigo não ganham página própria, porque isso duplicaria o conteúdo. Ficam no fim da página, recolhidos em "Versão anterior, ainda usada em produtos", com uma linha: "Para telas novas, use o Botão acima." Isso evita que um agente escolha o legado por engano.
- **Fichas agrupadas viram páginas com seções.** As subfamílias (navegação, compostos, os 10 data-cards) aparecem uma a uma, para nenhuma se esconder dentro da contagem de outra.
- **Itens de domínio aparecem só onde se aplicam:**

| Família | Marcas | Motivo (evidência) |
|---|---|---|
| theory, test-mark, zone-distribution | eletia | Promovidos do dashboard Electia (fichas de 05/10) |
| stage-chip | eletia e emprega+ | Funil de seleção (recrutamento) |
| brand-orb | eletia, emprega+ e Xscore | A ficha só define variantes electia/emprega/xscore. Não aparece em PdV nem em ResultX |
| data-cards (.dl-*) | todas, depois que o binding existir | É família de dados do núcleo; hoje está em uso em resultx.app e Electia |
| landing (header-float, cta-dock, cta-panel) | todas | Servem a qualquer site institucional |

- **Item que não se aplica:** dentro da marca, não aparece no menu, seguindo a regra de que ação indevida não aparece. Na tabela de cobertura da entrada aparece o texto simples "não usado nesta marca", sem etiqueta.
- **Item que se aplica mas ainda não está pronto:** é um aviso com o que falta e o próximo passo, por exemplo: "O Botão ainda não usa as superfícies do Xscore. Próximo passo: ligar as cores da marca ao componente (PR 3)." Nunca fica "pronto" sem o ensaio renderizado e o contraste medido. Nada de etiqueta "M/V" para o leitor.
- **Cuidado jurídico (público no GitHub Pages):** a ficha theory cita "MBTI Axis Bars". O nome exibido deve ser **Tipologia Cognitiva**, sem códigos de 4 letras, conforme a decisão de marca registrada. Os dados de exemplo são sempre fictícios.

## 3. PdV no tema claro: decisão

**Recomendo mostrar a composição, com rótulo.** O PdV claro usa as superfícies e os textos claros que já existem no núcleo, mais o dourado e a tipografia do PdV.

**Por quê:**
- O próprio arquivo da marca já projeta o claro: `--gold-ink: #866425` traz medições de 5,44:1 sobre branco e 4,69:1 sobre a superfície da etiqueta. Ou seja, quem fez a marca planejou o dourado sobre fundo branco.
- Não cria cor nem muda nenhum valor.
- Esconder o tema claro deixaria o catálogo menos completo, e o seletor sumiria só no PdV.

**Como aparece:** uma linha de texto, sem etiqueta, no topo do PdV claro:

> "Tema claro do PdV montado com as superfícies claras comuns do DS; a marca ainda não aprovou. Próximo passo: Marcos aprova ou pede superfícies próprias (só depois de 10/12)."

**O que fica fora:** essas telas não entram como referência aprovada. Se o contraste falhar em algum par, aparece como aviso nomeado, sem corrigir com cor nova. Se o produto PdV hoje é só escuro: **não verificado**.

## 4. Como cada página de componente mostra estados, teclado e contraste

1. **Topo:** nome, uma frase de para que serve e quando não usar.
2. **Quadro de estados**, numa grade que quebra linha em vez de cortar, cada estado com legenda em texto simples:
   - padrão, foco e desativado;
   - carregando, erro e vazio;
   - passar o mouse.

   O passar o mouse é estático, com classe de demonstração, mais um exemplo vivo. Reaproveitar os casos do `examples/pilot.html`.
3. **Desativado:** a página orienta "prefira esconder a ação; mostre desativado só com a razão ao lado", como já faz o piloto ("Conclua o cadastro para publicar.").
4. **Teclado:** uma lista curta em linguagem comum, por exemplo "Tab chega ao botão; Enter ou Espaço aciona; Esc fecha o diálogo e o foco volta ao botão que o abriu". Cada componente tem um quadro vivo onde dá para testar.
5. **Contraste:** uma frase por marca e tema, "Leitura: aprovada nos pares medidos". Quando falha: "O texto do botão desativado fica abaixo do mínimo no Xscore claro. Consequência: difícil de ler. Próximo passo: …". Os números, o par de cores e o piso WCAG ficam em "ver detalhes". Sem medição, a frase é "contraste ainda não medido", nunca aprovado.
6. **"Ver detalhes"** reúne a classe, o HTML da receita, os tokens usados, o arquivo de origem, a revisão do DS e as versões legadas. Esse é o conteúdo para agentes e CTO.

## 5. Aceite mínimo da primeira PR visível (foundations)

1. **As cinco marcas, cada uma nos dois temas** (10 combinações), com nome público correto. O PdV claro leva a linha de composição do item 3.
2. **Por marca:**
   - logo no tema;
   - amostras de cor por função, com nome legível e valor em "ver detalhes";
   - estados semânticos (sucesso, aviso, erro, informação), cada um com texto em cima e o contraste medido;
   - tipografia: amostra de título e de texto corrido, com escala e pesos;
   - raio e sombra num cartão;
   - voz, ou a pendência dela no caso do Xscore.
3. **Fontes carregadas de verdade:** `document.fonts` confirma Sora, Inter e JetBrains Mono, sem 404. No Xscore, Plus Jakarta Sans e Geist Mono não estão em `assets/fonts`. Ou entram com licença, ou a página mostra o aviso "fonte do Xscore ainda não publicada; o texto aparece na fonte reserva. Próximo passo: …". Fonte reserva silenciosa não é aceita.
4. **Capturas** em 390 e 1440 px, nos dois temas, para as cinco marcas: 20 imagens no mínimo, geradas pelo workflow Visual Linux oficial. Conferir que nada fica cortado e que não há rolagem horizontal em 390.
5. **Navegação por teclado completa:** seletor de marca e de tema, foco visível e um `h1` por página. A troca de marca não deixa a cascata de uma marca contaminar a outra (isolamento testado).
6. **Nenhum valor de token alterado e nenhuma cor nova.** Uma verificação compara os arquivos de token com a main.
7. **Sem jargão no texto principal:** nada de "binding", "token" ou "M/V" fora de "ver detalhes". Uma família na moldura. Nenhuma etiqueta além de estado com cor de sentido.

Parecer do Revisor e checagem visual humana pelo Marcos ficam pendentes. Esta decisão não aprova nenhuma PR.
