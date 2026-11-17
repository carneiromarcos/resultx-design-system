# Brand System emprega+ — M3/M4, provas locais

Data: 17/11/2026. Estado: AGUARDANDO VALIDAÇÃO. Entrada estática clara/escura;
publicação e aceite humano pendentes. Esta entrega não altera integração de produto.

## Resultado

Arquivos novos em `previews/brand-system/`: gerador, moldura, duas páginas,
fontes referenciadas, amostras por papel, proveniência, testes e instruções.
A tagline e os atributos da voz são lidos da fonte editorial; os fundamentos são
lidos das folhas atuais. As 18 entradas de marca apontam à fonte ou registram
pendência. O arquétipo segue sem classificação formal inventada.

Os componentes abrem o catálogo oficial com marca e tema selecionados. A marca
não copia a implementação dos oito contratos. O texto distingue fundação,
referência visual, integração e aprovação; não declara AA integral nem implantação.

## RED e GREEN

- Antes da implementação: **7 testes, 7 falhas**, porque entrada/gerador/arquivos
  ainda não existiam. O teste não se autopulou.
- Depois: **7 testes dirigidos aprovados**, zero falhas/pulos. Incluem CSP,
  ausência de código de navegador, âncoras, recursos locais, ligações existentes,
  fontes, hashes, determinismo e mutação em fixture.
- A mutação remove um papel de raio na cópia temporária e o build falha. Uma
  mudança para outro raio já existente chega ao valor exibido. A fonte oficial
  não é modificada pelo ensaio.
- Primeiro ensaio de navegador detectou largura 529 em viewport 390: a imagem
  oficial da assinatura estava limitada por uma largura maior que o contêiner.
  O limite agora combina 100% do contêiner e a medida existente. Não se ocultou
  o transbordamento da página por CSS.

Build principal do DS aprovado, sem diff de áreas protegidas. Stylelint dos
três CSS desta entrada passou. Jest completo: **41 suítes, 832 testes aprovados**,
zero falhas/pulos. São provas locais; CI oficial no SHA final ainda é necessário.

## Navegador

Quatro cenários: claro/escuro × 390/1440, prefixo de URL, dados fictícios.
**4 aprovados, 0 falhas, 0 pulos, 0 retentativas**. Nenhuma instabilidade observada
nesta execução única por cenário. Oito capturas externas (página e foco), sem
baseline versionada. O verificador grava manifesto com hashes no local escolhido
por QA_OUT e encerra os recursos temporários.

- cinco combinações de família/peso usadas verificadas com load, check e ready;
- logos carregados, CSP `default-src 'self'`, zero script na página;
- zero requisição externa de renderização e zero resposta 404;
- página sem rolagem horizontal em 390 e 1440;
- Tab até o link de tema, contorno inteiro na viewport, Enter troca a aparência;
- no celular, Enter/Espaço abrem e fecham o menu nativo;
- preferência por redução de movimento aplicada; amostras estáticas.

## Contraste real resolvido

Foreground/background são cores obtidas no DOM, considerando o ancestral opaco
adjacente. As razões coincidem com a leitura das fontes; não são amostras de pixel.

| Amostra | Claro | Escuro | Piso | Resultado |
|---|---:|---:|---:|---|
| Texto principal | 15,49 | 14,24 | 4,5 | atende no recorte |
| Apoio na camada tonal | 4,67 | 6,81 | 4,5 | atende no recorte |
| Discreto na camada tonal | **2,45** | **3,53** | 4,5 | pendente nos dois |
| Link da moldura | 10,19 | 9,33 | 4,5 | atende no recorte |
| Texto sobre ação | 6,29 | 6,29 | 4,5 | atende no recorte |
| Contorno do link de tema | 15,49 | 14,24 | 3 | atende no recorte |

Par pendente claro: rgb(154,163,181) sobre rgb(250,251,254). Escuro:
rgb(111,119,150) sobre rgb(30,35,53). Papéis: `--emp-text-muted` sobre
`--emp-surface-tonal`. Responsáveis pelo próximo passo: Supervisor DS e UX na
revisão de contraste da marca. A pendência e a ação seguinte aparecem nas duas
páginas; nenhum valor foi corrigido nesta entrega.

Divisões decorativas e amostras de pigmento não são prova do limite de um controle.
Não foram certificados todos os estados, composição de gradientes, pixels de
borda/foco ou leitor de tela. VoiceOver: NÃO TESTADO nesta entrega.

## Integridade e governança

Somente arquivos novos de `brands/emprega-mais`. Os três documentos de M1/M2
permanecem idênticos. Nenhuma alteração em tokens, eds-root/SHA, aliases/SHA,
contratos, adaptadores, componentes, dist, scripts centrais, workflows, package,
lock, STATUS geral, eletia ou Xscore. O build local não modifica essas entradas.

A fonte dos valores é a DTCG/CSS gerado; esta documentação não publica um conjunto
de tokens. Novos componentes ou papéis compartilhados vão à coordenação do núcleo.
O publicador ainda não incorpora esta entrada: o Supervisor integrará as marcas
na entrega compartilhada própria. M5–M9 continuam com seus gates e dependências.
