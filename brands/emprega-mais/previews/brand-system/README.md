# Brand System emprega+ — entrada estática

M3/M4: estrutura navegável e fundamentos nas duas aparências. `index.html` abre
no claro; `dark.html` no escuro. A troca é um link e o menu do celular é um
detalhamento nativo. Não há JavaScript de navegador, CDN ou fonte remota.

Da raiz do ResultX DS:

```sh
node brands/emprega-mais/previews/brand-system/build.cjs
npx --no -- jest brands/emprega-mais/previews/brand-system/tests/foundations.test.js --runInBand
npx --no -- stylelint brands/emprega-mais/previews/brand-system/style.css brands/emprega-mais/previews/brand-system/fonts.css brands/emprega-mais/previews/brand-system/samples.css
node brands/emprega-mais/previews/brand-system/tests/verify.mjs
```

O último comando usa Playwright, serve a árvore temporariamente em loopback com
prefixo de URL e encerra servidor/navegador ao terminar. `QA_OUT` escolhe uma pasta
externa para as evidências; o padrão é o diretório temporário do sistema.
`PLAYWRIGHT_CHROMIUM_EXECUTABLE` pode selecionar um navegador local instalado.
Nenhuma captura é baseline e nenhuma PNG entra no repositório.

## Origem e geração

O gerador lê tokens gerados, ponte semântica, DTCG central, fontes locais, ativos,
atributos editoriais e contratos existentes. Reutiliza o leitor de CSS do catálogo
como biblioteca; não altera nem extrai código do núcleo. A tagline e os atributos
de voz vêm do Brand Book; a apresentação corrige a acentuação de “Acessível”. Os
18 assuntos apontam às fontes atuais ou trazem uma pendência explícita.

Gera somente `index.html`, `dark.html`, `fonts.css`, `samples.css` e
`provenance.json`, dentro desta pasta. `style.css` é a moldura editorial: seus
papéis vêm dos tokens existentes. O breakpoint é lido da DTCG; bordas de um pixel,
proporções de grid e multiplicadores de medidas existentes organizam a documentação,
sem publicar escala ou pigmento novo. Cores, fontes, raios, sombras e durações não
são inventados. Os arquivos gerados não se editam à mão.

`fonts.css` reutiliza as faces do preview canônico, ajustando somente caminhos
relativos e serialização de aspas. Fontes e licenças permanecem nos ativos
compartilhados. `provenance.json` registra entradas e hashes relativos, sem data
de geração ou caminho da máquina. O identificador é de conteúdo, não commit.
O build dispensa Git e rede.

## Limites

As oito referências de componente abrem o catálogo compartilhado real na mesma
marca/aparência. Contratos e fichas abrem a fonte pública atual do DS; esses links
de navegação não são requisições da renderização. Não há implementação paralela
dos componentes. A integração da publicação é uma entrega compartilhada separada.

As amostras de texto discreto têm contraste insuficiente nos dois temas; a página
mostra pendência e próximo passo. A moldura usa os papéis de leitura adequados.
Não há certificação AA integral, prova falada de leitor de tela ou inferência de
adoção no produto. Eds-root e aliases permanecem intactos.

Antes de inspecionar ou publicar, execute o gerador. A futura integração ao
publicador deve chamá-lo e disponibilizar os CSS, fontes e logos locais usados.
Atualizações de componente continuam nos contratos/catálogo centrais.
