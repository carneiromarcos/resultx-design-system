# Aviso e StatusBadge — prova local do Core

Estado: **AGUARDANDO VALIDAÇÃO independente / implementação local**. Destino v2.12.0, sem merge antes do corte
da v2.11.0. Nenhuma versão, valor de token, eds-root, pacote ou publicação mudou.

## Escopo e conteúdo

Notice/Aviso é novo: título factual em uma linha, consequência opcional em uma frase,
próximo passo visível e ação obrigatória quando a pessoa pode executá-lo nesta tela.
Ação indevida não aparece. A referência usa ação nativa real que foca o campo do exemplo;
quando a tarefa depende de outra pessoa, fica apenas a orientação humana.

Contêiner comum, heading no nível do consumidor, sem região nomeada por padrão.
A região status vazia preexiste antes do texto, mantém o mesmo nó e não move foco.
Detalhes são nativos e recolhidos; exemplos não mostram código, identificadores ou logs.
Não há JavaScript novo de runtime. O predicado de QA não calcula autorização: verifica
uma escolha de apresentação fornecida pelo consumidor, cuja integração deve ser testada.

StatusBadge ganha warning/info passivos. Os rótulos “Arquivo não recebido” e
“Atualização recebida” identificam o estado; a pendência acompanha próximo passo.
A verificação em escala de cinza usa o protocolo Chromium e mantém os textos legíveis.
Não certifica leitor de tela humano nem toda composição futura.

O catálogo gera as duas aparências das cinco marcas, incluindo os estados aplicáveis
reais e indicação dos não aplicáveis. Não há documento duplicando a ficha gerada.
Componente novo não herda declaração de uso em produto. Versões anteriores continuam
sem adoção automática; a próxima cópia por SHA confere usos de color-warning/color-info.

## Provas executadas

| Prova | Resultado | Falhas / pulos |
|---|---:|---:|
| RED inicial dos novos critérios | 1/6 | 5 / 0 |
| Unitários completos, com stdout e veredito de contraste | 848/848 | 0 / 0 |
| Contratos, cobertura e sete negativos de DOM | 138/138 | 0 / 0 |
| Catálogo na árvore publicada, componentes alterados | 20/20 | 0 / 0 |
| Vitrine pública anterior com runner atual | 110 pass | 0 / **20 novos não verificados** |
| Build e lint | saída 0 | — |

Os conjuntos se sobrepõem; não somar como se fossem casos únicos. Os negativos retiram
a ação local, inserem ação indevida desativada, retiram próximo passo e introduzem texto
técnico, inclusive em detalhe recolhido, ou omitem a declaração de cenário. O predicado e o navegador rejeitam esses defeitos. O RED inicial também detectou
a falta do contrato, CSS, receita, aliases e entrada de catálogo.

A compatibilidade usa a vitrine pública do SHA 64a26656170ae506f3bb4c05647c5f3c63c43177.
Os dez casos novos nos dois temas são pulados somente sem declaração explícita. Esse
resultado **não** certifica os nove contratos atuais. A referência atual declara todas
as obrigações novas e executa os 130 casos sem pulos. A ampliação de badge-variants para
cinco variantes e o caminho de exceção estão no CHANGELOG.

## Contraste e responsividade

A medição usa o catálogo renderizado do próprio repositório, sem dependência de produto.
O medidor aguarda todas as faces locais; a execução final não contém falha de rede.
**Retorno atual: 1**, pelas quatro bordas adicionais conhecidas. Ele é manual e não é
chamado pelo package.json, workflows ou outros scripts; a busca e sua saída estão no
relatório. O veredito agora reprova qualquer falha adicional, inclusive foco e tabela.
A saída 0 registrada antes da correção do major não aprova a medição inteira.
Tentativas anteriores com cancelamento de fonte retornaram 1 e não contam como aprovação.
Há **40 pares padrão** (dois componentes × duas variantes × cinco marcas × dois temas),
sem falha: texto mínimo 12,013:1 e borda mínima 3,043:1. Os dez focos de ação passam,
mínimo 5,192:1. A linha real da rx-table também passa nos dez cenários.

Os títulos e caixas foram conferidos em 390/1440 nas dez combinações, sem quebra do título
ou overflow dos avisos. A validação do catálogo testa carregamento, CSP, fontes locais,
IDs, referências, cores calculadas contra renderizadas e responsividade.

Quatro bordas warning claras sobre surface-2 reprovam o mínimo conservador de 3:1:
eletia, Xscore, PdV e ResultX, **2,858715695:1**. Estão individualizadas em
[color-pending.json](color-pending.json), para PR de cores separada. Nenhum valor foi
alterado para ocultar a falha. O padrão demonstrado usa surface-1; não extrapolar a
aprovação para outras superfícies. A medição inteira está em [contrast.json](contrast.json).

## Imutabilidade e geração

A fixture de fonte registra o SHA de todos os arquivos de token existentes e o eds-root.
Esses bytes permanecem iguais. Ao remover somente as duas linhas novas do arquivo de
aliases, o restante é byte-idêntico à fonte anterior; os alvos EDS já existiam. Scoped CSS,
seus hashes e fichas foram gerados, não editados à mão. Os seletores antigos e o bundle
legado não foram alterados. Não houve diff de tokens, dist, pacote ou marcas protegidas.

A reserva complementar permite somente os três gerados `index.html`, `dark.html` e
`provenance.json` do Brand System Emprega+, regenerados via npm test. O
[diff isolado](brand-generated.diff) e a [prova executável](verify-generated-brand.cjs)
confirmam: os dois HTML ficam byte-idênticos ao remover o artigo do Notice e normalizar
somente o identificador curto de conteúdo. No JSON entram o registro do Notice e suas
duas fontes; somente os hashes de aliases, contrato/ficha StatusBadge e contentId mudam.
Os demais campos são iguais. Gerador, teste, CSS, fontes e logos da marca não mudaram.
O gate de gerados foi reexecutado depois do commit funcional 8708e3f: build e
846 testes retornaram 0, com status vazio nas árvores de artefatos verificadas.
O CI no SHA final continua sendo um gate separado.

A varredura dirigida dos acréscimos e dos arquivos novos encontrou zero ocorrências
de caminho pessoal, fonte privada, rota privada, e-mail ou cliente conhecido.

A [lista das vinte obrigações não verificadas](compatibility-obligations.md) explicita
os dez nomes em claro e escuro e o plano por consumidor. O complemento do processo
aguarda close para ler stdout completo, com RED de JSON truncado e GREEN executados.

O teste de stdout foi corrigido após falha do checkout raso no CI: leitura anterior
e processo filho são sintéticos no teste, sem dependência de histórico ou browser.
RED e GREEN no mesmo clone raso estão no relatório; isso não certifica compatibilidade
real do consumidor. Workflow/fetch-depth e script manual permaneceram iguais.

## Pendências e revisão

- Duas baselines Linux aprovadas pelo Revisor e copiadas byte a byte no commit
  c7f046c; o parecer e os dois SHA-256 estão colados no corpo do commit. O prefixo
  de 3390 px é idêntico; a inserção desloca o restante em 997 px e restam 101/114
  pixels após alinhamento, aceitos explicitamente sem declará-los zero ou ruído.
  Nenhuma baseline foi gerada no Mac. Falta o CI do SHA que contém as cópias.
- Terceira passagem CodeRabbit após correções, CI no SHA final e aceite visual humano.
  O Revisor aprovou a fonte 6c69edad no recorte local e as duas candidatas Linux,
  com aceitação explícita de translação e resíduos; isso não aprova os gates pendentes.
- Rebase depois do corte da v2.11.0 e nova validação antes de merge para v2.12.0.
- DS-NOTICE-DEBT-01: frase disabled do EmptyState/ErrorState, registrada sem alterar
  esse contrato nesta entrega.

As imagens locais usadas para inspeção são diagnósticos, não baselines Linux. Nenhuma
conformidade integral ou integração de produto é declarada. Os comandos e saídas dos gates
ficam em [commands-output.md](commands-output.md).


## Fontes normativas e limites

Os limiares usam [contraste de texto WCAG](https://www.w3.org/TR/WCAG22/#contrast-minimum)
e [contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast).
A região de anúncio segue [mensagens de status](https://www.w3.org/WAI/WCAG21/Understanding/status-messages)
e a preservação de foco do [padrão Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/).
Os testes verificam estrutura, estilo e interação da referência. Veracidade, permissão
e funcionamento de uma tarefa no produto dependem da integração do consumidor.
