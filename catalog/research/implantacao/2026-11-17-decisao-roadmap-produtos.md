# Decisão de arquitetura — roteiro único DS + IMO + Xscore (17/11/2026)

- **Autora:** Aria (@architect), somente leitura. Nenhum arquivo de repositório foi alterado.
- **Mandato do Marcos (17/11):**
  - avançar em loop no DS, no IMO e no Xscore, até o fim, refazendo o visual de todas as páginas;
  - no DS, o Supervisor mescla com CI verde e Revisor (autorização A);
  - no IMO e no Xscore, o Supervisor abre a PR e o Marcos mescla ("merge N");
  - **cor nova liberada agora**; a propagação ao EditalHub continua presa à janela de recurso dele;
  - um Executor, um Revisor independente.
- **Fontes lidas:** DS `0827c21`, IMO `341ab68`, Xscore `7cbb2ce`, os dois diagnósticos de 17/11.
- **Prefixos de caminho:**
  - `DS:` = `scratchpad/ro/ds`;
  - `IMO:` = `scratchpad/ro/imo`;
  - `XS:` = `scratchpad/ro/ws/meus-projetos/resultx/labs/xscore`;
  - `diag-imo` e `diag-xscore` = os diagnósticos em `scratchpad/`.

---

## 0. Três fatos que mudam o plano

1. **O IMO já consome o DS fora de versão.**
   - O piloto copia `rx-pilot.css` e os aliases da `main` do DS, fixados por SHA. A cópia em produção bate com `bd1457a`, um commit sem tag (`DS:docs/STATUS.md:135`).
   - Os contratos e o adaptador (#117–#120) entraram **depois** da tag v2.10.0 (`DS:docs/STATUS.md:59-60`).
   - Esse mecanismo foi aprovado no adendo da ADR-0004 (`DS:docs/adr/0004-contracts-adapters-pilot.md:43-52`).
   - **Conclusão:** contrato novo chega ao IMO sem esperar release. Só o Xscore, que consome por tag (`XS:apps/web/package.json:26`; `diag-xscore:18`), depende do ritmo D7.
2. **O Xscore não precisa de contrato dentro do pacote para trabalhar.**
   - Os `ui/*` locais seguem o contrato (`DS:docs/adr/0004-contracts-adapters-pilot.md:18`).
   - Até a v2.11.0 colocar `contracts/` no pacote (`DS:CHANGELOG.md:42`), os casos de teste citam o contrato pelo SHA do DS (`diag-xscore:186`).
   - Do pacote, o Xscore só precisa dos **valores de token** da marca dele.
3. **A ADR-0003 exige que a v2.11.0 saia sem mudança de valor** em relação à v2.10.0 (`DS:docs/adr/0003-token-single-source.md:47`; emenda em `:55`). Tokens **novos** são permitidos, desde que listados (`:26`). Por isso a PR de cores vai em duas partes:
   - **C-cor-1, aditiva:** só nomes novos. Entra antes de 27/11 e sai na v2.11.0.
   - **C-cor-2, valor:** muda token existente. Entra logo depois do corte da v2.11.0.

   Assim a liberação de cor do Marcos é cumprida sem violar uma ADR aceita.

---

## 1. Roteiro único e sequencial (um Executor)

### 1.1 Regras de encadeamento

- **O Executor nunca espera.**
  - Enquanto a PR N está com o Revisor ou aguarda "merge N", ele começa a N+1 **em arquivos independentes**.
  - Cada entrega usa worktree próprio de `origin/main`, sem PR empilhada (memórias `feedback_branch_base_commits_locais` e `feedback_stacked_pr_delete_branch`).
- **Prioridade quando duas entregas estão livres:**
  1. a que destrava mais telas;
  2. depois, o que o Marcos já criticou (monitoramento do Xscore);
  3. depois, o que pode entrar na v2.11.0.
- **Capacidade do Executor (limite semanal em ~25%):**
  - cada entrega traz um tamanho P/M/G;
  - se o uso semanal passar de ~80%, o Supervisor congela as ondas do Xscore (35 telas) e mantém o caminho crítico do IMO (219 telas) e do DS.
- **Datas fixas interrompem a fila:**
  - **27/11 (sexta):** corte da v2.11.0, pela D7;
  - **10/12:** liberação do EditalHub.

### 1.2 As próximas 10 entregas, em ordem

| # | Repo | Escopo | Tam. | Critério de pronto | Depende de |
|---|---|---|---|---|---|
| **1** | DS | **Catálogo PR 5a** (famílias de dados, até ~90 capturas), já em execução. Liga tudo só por `var()`, sem valor novo. `soft-cyan`, `soft-magenta` e `soft-purple` aparecem como pendência, a resolver na PR de cores (decisão de UX em `scratchpad/exec-dscat-pr5-map.txt`) | M | Pastas protegidas sem diff (`DS:catalog/research/2026-11-16-decisao-arquitetura.md:83-87`; correção em `:119`); trava do manifesto verde (`:93`); Visual Linux; Revisor APROVA; merge sob A; Pages no ar sem 404 | — |
| **2** | IMO | **Onda 0 completa + provas da DS-10.** Sem nenhuma mudança visual (`diag-imo:371`). Partes: (a) separar o escopo `rx-pilot` dos comportamentos do piloto (`IMO:resources/views/employer/layouts/app.blade.php:77-79,132-137`); (b) adaptador inerte nos layouts de candidato, site, admin e auth (`diag-imo:19`); (c) script de captura versionado (390/1440, claro e escuro); (d) catraca de convergência por área. **No mesmo lote:** `docs/qa/…-ds10-matriz.md` com as provas das linhas 7, 8, 10, 11, 14 e 20, feitas com o script da parte (c), e painel atualizado (IMO-31 mesclada, `IMO:docs/governance/STATUS.md:79`) | M | Teste novo prova que só as 2 telas do piloto carregam `piloto-*.js`; nenhum `body` fora do piloto recebe `rx-pilot`; capturas de 1 tela por layout idênticas antes e depois; catraca com a linha de base gravada; CI e smoke MySQL verdes; Revisor; "merge N" | — (corre em paralelo com a DS-10, §4) |
| **3** | Xscore | **O1 + O2 numa PR, em 2 commits.** O1: subir de `#v2.9.0` para `#v2.10.0` (mesmo blob de token, `diag-xscore:21-23`), casos dos 8 contratos na `/styleguide` citando o contrato pelo SHA do DS, capturas de base. O2: `Badge` quebra linha e só mostra estado; `EmptyState` ganha a variante `error`; `Card` sem sombra em repouso, como manda o contrato (`diag-xscore:111-113`) | M | Commit O1: capturas idênticas pixel a pixel. Commit O2: diferenças listadas por tela. `npm run verify`, lint, gate de termos abolidos com `grep skipped` = 0, fronteira `git diff --quiet origin/main HEAD -- apps/web/lib supabase packages workers` (`diag-xscore:150-156`); Revisor; "merge N" | — |
| **4** | DS | **Contratos, lote A (C-A): Aviso + StatusBadge `warning`/`info`.** Criar `contracts/notice.yaml`: o quê + consequência + próximo passo, papel `status`/`alert`, sem emoji redundante. Em `status-badge.yaml`, acrescentar 2 variantes (hoje há só `neutral`/`success`/`error`, `DS:contracts/status-badge.yaml:6-9`). Junto: adaptador CSS, variante escopada gerada, vitrine e entrada no manifesto do catálogo | P–M | Casos executados na vitrine; teste que falha sem a mudança; contraste ≥4,5:1 só com tokens existentes (o Xscore já tem `--warning`/`--info`, `DS:brands/xscore/tokens/tokens.css:85-88`); manifesto verde; Visual Linux; Revisor; merge sob A | 1 (evita conflito no manifesto) |
| **5** | DS | **Catálogo PR 5b** (conversa e domínio; fichas só na marca dona) | M | Os mesmos da entrega 1 | 1 |
| **6** | DS | **PR de cores, parte aditiva (C-cor-1), com @ux.** Só nomes novos, **nenhum valor existente muda**: (a) papéis decorativos `soft-*`; (b) texto sobre a marca escolhido por cálculo, preto ou branco (para qualquer fundo, um dos dois dá ≥4,5:1); (c) perigo forte ≥4,5:1 para o "Sim, encerrar", hoje em 3,94:1 (`IMO:docs/governance/STATUS.md:80`); (d) os 2 pares do PdV escuro (`DS:docs/STATUS.md:148`) | M | Lista de tokens novos no CHANGELOG (`DS:docs/adr/0003-token-single-source.md:26`); contraste medido no build; o catálogo mostra as amostras antes pendentes; equivalência da E1 continua verde nos nomes antigos; Revisor; merge sob A **antes de 27/11** | 5 |
| **7** | IMO | **Onda 1a, empresa:** `/employer/candidates`, `/employer/etapas` e `/employer/job-templates`. Secundários e perigo passam para `<x-rx.button>`; o primário fica como está. `EscopoDoPilotoDsTest.php:67` muda **de propósito** (`diag-imo:372`) | M | Testes existentes da onda verdes; teste de view por tela; capturas antes e depois nos 2 temas, com o script da entrega 2; uma rota fora da onda sem diferença; catraca cai; Revisor; "merge N" | 2 mesclada; DS-10 fechada (§4) |
| **8** | Xscore | **O3, Monitoramento** (`/monitoring`, `/carteira`, `/biro`): proveniência em texto simples; um Aviso (contrato da entrega 4); "ver detalhes"; sem emoji, sem repetição, sem fonte mono no meio da frase (`diag-xscore:120-129,168`) | M | Os 6 critérios de `diag-xscore:122-129` conferidos por captura em 320/768/1024/1440, claro e escuro; números, filtros e `Money` intactos; Revisor; aceite visual e "merge N" | 3 mesclada; 4 mesclada (citada pelo SHA) |
| **9** | DS | **Contratos, lote B (C-B): Field ampliado + Escolha.** `field.yaml` ganha `textarea`, `select` (nativo, com a regra de pele do select2) e `inputmode` numérico ou de dinheiro. Novo `choice.yaml`: checkbox, rádio e switch com `fieldset`/`legend`. Destrava 79, 59 e 58 telas do IMO (`diag-imo:334-336`) e a O6 do Xscore | G | Casos por variante; borda ≥3:1 com token existente ou aditivo; erro ligado por `aria-describedby`, no padrão da IMO-31; vitrine; manifesto; Visual Linux; Revisor; merge sob A, **se possível antes de 27/11** | 4 |
| **10** | DS | **Tag v2.11.0 (DS-14), data fixa 27/11.** Inventário até o SHA da tag; impacto por consumidor; declaração de que nenhum valor existente mudou (só aditivos listados) | P–M | `DS:docs/STATUS.md:66`; ADR-0003:47 cumprida; CI; Revisor; tag sob A | a data; entra o que estiver mesclado |

### 1.3 Depois da 10, para o Supervisor não perder o fio

- **11. IMO Onda 2**, numa PR só, como pede a regra "1 PR de DS por produto por versão" da D7 (`DS:docs/adr/0005-governance-propagation-decisions.md:20`):
  - DS-17/IMO-10: recópia por SHA da v2.11.0;
  - IMO-30b: primários e links;
  - `/employer/dashboard`.
- **12. DS, PR de cores parte 2 (C-cor-2), mudança de valor:**
  - borda de campo ≥3:1 e escalas no `eds-root` (DS-18, `DS:docs/STATUS.md:70`);
  - correções do legado: 135 pares (`DS:docs/STATUS.md:149`);
  - o IMO recebe em seguida, por SHA; o **EditalHub fica com o SHA atual até 10/12**.
- **13. Xscore sobe para `#v2.11.0`:** os casos manuais saem e passam a ler o YAML do pacote.
- **14. IMO Onda 1b:** `followers`, `equipe` e `jobs/{job}`.
- **15. DS contratos, lote C:** Diálogo genérico (o ConfirmDialog vira variante) e Upload.
- **16. Xscore O4:** acesso e erros.
- **17. IMO Onda 3:** candidato, listas e leitura.
- **18. DS contratos, lote D:** Abas, Paginação, Disclosure, Data e Linha do tempo.
- **19. IMO Onda 4** (site público) e **Xscore O5**.
- **20 em diante:**
  - DS lote E: pele do editor rico, Passos e casca de navegação;
  - IMO: Ondas 5 → 6 → 7 → 8;
  - Xscore: O6 → O7 → O8 → O9.

---

## 2. Contratos novos do DS

### 2.1 Quais, em que ordem e em quantas PRs

**5 PRs de contrato.** Cada uma traz:
- o YAML;
- o adaptador CSS e a variante escopada gerada, com `.sha256`;
- a vitrine com os casos;
- capturas de base geradas pelo `visual-baseline-linux.yml`;
- a entrada no manifesto do catálogo.

A trava do catálogo **falha** se um contrato não estiver no manifesto (`DS:catalog/research/2026-11-16-decisao-arquitetura.md:93`). Por isso cada PR de contrato entra depois da PR de catálogo que estiver aberta. O teto é de ~100 capturas por PR (`:75`).

| PR | Contratos | Telas que destrava | Por que nesta ordem |
|---|---|---|---|
| **C-A** | Aviso (`notice`); StatusBadge `warning`/`info` | Xscore O3, crítica direta do Marcos (`diag-xscore:136`); estados de falha do IMO | Pequena, rápida, só tokens existentes |
| **C-B** | Field ampliado (`textarea`, `select`, `inputmode` numérico); Escolha (`choice`: checkbox, rádio e switch) | IMO: 79, 59 e 58 telas (`diag-imo:334-336`); Xscore O6 | É a que mais destrava; base de todo formulário |
| **C-C** | Diálogo genérico (formulário em diálogo; o ConfirmDialog vira variante sem quebrar o contrato atual); Upload (estado, erro sem cor, nome, limite) | IMO: 57 e 34 telas (`diag-imo:337-338`); Xscore O7 (PDF anônimo) | O admin do IMO cria e edita por diálogo; a captação depende do Upload |
| **C-D** | Abas (setas, Home/End); Paginação numerada fora da tabela; Disclosure ("ver detalhes"); Data (nativo, com regra de pele do flatpickr); Linha do tempo (`<time>`) | IMO: 12, 15 e 13 telas; Xscore O5 e O6 (`diag-xscore:137-139`) | Padrões menores, agrupados |
| **C-E** | Pele do editor rico (barra de ferramentas e foco, sem amarrar a biblioteca, `DS:docs/adr/0004-contracts-adapters-pilot.md:20`); Passos; casca de navegação (sidebar, header, rodapé) | IMO: 32 telas, mais 3, mais todos os layouts (`diag-imo:339-344`) | Maior risco; depende das outras peças |

**Ficam fora do DS (são do produto):**
- `TierBadge`, a assinatura de crédito na própria tela (D-M14-4) e o `Segmented` do verbo de decisão são domínio do Xscore (`diag-xscore:142`);
- `FilterBar` e `Meter` do Xscore só viram contrato se o IMO também precisar (regra de dois consumidores, ADR-0004:18).

### 2.2 Como entram nos produtos

| | IMO (cópia por SHA) | Xscore (tag git) |
|---|---|---|
| **Mecanismo** | Copia a variante escopada e os aliases da `main` do DS, fixados por SHA, e atualiza o teste de cópia. Escreve o `<x-rx.*>` fino conforme o contrato (`IMO:AGENTS.md:96`). Aplica pele por token no plugin, com escopo por classe (`:99`) | Ajusta o primitive local em `apps/web/components/ui/` ao contrato. Os testes citam o contrato pelo SHA do DS e, a partir da v2.11.0, leem o YAML do pacote. **Nunca importa CSS de componente do DS** (gate `components.min.css`, `diag-xscore:16`) |
| **Exige release?** | **Não.** Basta o merge no DS | **Não** para contrato. **Sim** para valor de token novo ou alterado na marca Xscore |
| **Quando chega** | Na onda do IMO que usa o componente, logo depois do merge no DS | Contrato: na onda. Token: na tag seguinte (v2.11.0 ≥27/11; v2.12.0 ≥11/12) |

**Exige release:**
- valores de token consumidos pelo Xscore (e pela Electia);
- `contracts/` dentro do pacote (v2.11.0).

**Não exige release:**
- contratos, adaptador e aliases consumidos pelo IMO por SHA;
- o site do catálogo, que o Pages publica da `main`;
- ajustes de primitive local do Xscore.

---

## 3. Regra D7 e a v2.11.0 ≥27/11

**Recomendação:** manter a D7 e a data de 27/11, e escrever o que já se pratica. A cópia do IMO por SHA da `main` não conta como "versão" na D7. A D7 continua valendo para tags: Xscore, Electia, FinanceX e Site.

| Caminho | Custo para o "sem parar" | Custo de risco e governança |
|---|---|---|
| **A. D7 estrita, IMO só por tag** | Alto. As ondas de formulário do IMO (5–8) esperam a v2.12.0 (≥11/12) e a v2.13.0 (≥25/12): ~5 semanas de fila no maior produto | Contradiz a prática atual do piloto (`DS:docs/STATUS.md:135`) |
| **B. D7 afrouxada para 1 versão por semana** | Baixo para o Xscore | Dobra o inventário de release que o Revisor confere e as PRs de atualização que o Marcos mescla. A equipe do Xscore absorve mudança toda semana. Perde-se o motivo da D7 (`DS:docs/adr/0005-governance-propagation-decisions.md:36`) |
| **C. D7 para tags; IMO por SHA da `main` (recomendado)** | Quase nulo. O IMO anda no ritmo do Executor; o Xscore não depende de tag para contrato (§0, fato 2) | O IMO pode ficar à frente da tag. Mitigação: o teste de SHA do IMO e o inventário de cada release listam o que o IMO já absorveu. Exige emenda da ADR-0005, decisão do Marcos (§7, item 1) |

- O mandato "sem parar" só colide com a D7 no caminho A. No C, a colisão desaparece.
- **Não recomendo antecipar a v2.11.0.** A exceção da D7 para acessibilidade (`DS:docs/adr/0005-governance-propagation-decisions.md:20`) não deve ser usada para o primário do IMO: não é caso de acessibilidade, e esticar a exceção enfraquece a regra.

---

## 4. Bloqueio DS-10: o que falta, quem faz, e se a Onda 0 corre junto

**Situação no painel:**
- nenhuma linha trabalhada da matriz tem o critério comprovado;
- 3 comprovadamente não atendem: 1, 5 e 14;
- 5 estão sem verificação: 7, 8, 10, 11 e 20 (`DS:docs/STATUS.md:43,62,151`);
- a DS-21 (E5) depende delas (`:73`).

| Linha | Critério | Situação | O que fecha |
|---|---|---|---|
| 1 | Texto sobre a marca ≥4,5:1 para qualquer cor (`DS:docs/audits/2026-11-13-ds-auditoria/diagnostico-resultx-ds.md:177`) | Exigia mudar valor de token | **Agora é possível:** a C-cor-1 (entrega 6) traz o token de texto calculado; o IMO aplica numa PR pequena depois dela |
| 5 | 100% dos botões pelo componente (`:181`) | Faltam os primários (IMO-30b) | Onda 2, depois da v2.11.0 |
| 7 | Borda ≥3:1 e erro por `aria-describedby` (`:183`) | A IMO-31 ligou os erros; a borda depende de token | Prova por captura na entrega 2; se a borda não passar, vai para a C-cor-2 |
| 8 | select2 e flatpickr legíveis no escuro, só no piloto (`:184`) | Sem verificação | Captura com o script da entrega 2 |
| 10 | StatCard: normal, vazio "—", carregando, link, `tabular-nums` (`:186`) | Sem verificação | Teste de view e captura |
| 11 | Tabela herda o tema sem editar a view; carregando, vazio e erro; leitor de tela (`:187`) | IMO-29 e IMO-33 entregaram partes | Captura e registro do VoiceOver já feito (`IMO:docs/governance/STATUS.md:81`) |
| 14 | Foco volta ao gatilho (`:190`) | **Já entregue** na DS-20 (`DS:docs/STATUS.md:72`); o indicador da linha 43 do painel está desatualizado | Corrigir o painel |
| 20 | Vazio com o quê + próximo passo + ação (`:196`) | Entregue pela IMO-28 e pela IMO-29 | Captura |

**Quem faz:**
- o **Executor** produz as provas dentro da entrega 2 (documento em `docs/qa` no IMO, capturas do script versionado);
- o **Revisor** dá o parecer independente linha a linha;
- o **Supervisor DS** atualiza a DS-10 e a linha 43 do painel.

**Decisão de arquitetura (cabe a mim).**
- A DS-10 fecha quando as linhas 7, 8, 10, 11, 14 e 20 tiverem prova aprovada pelo Revisor.
- As linhas 1 e 5 viram ressalvas com dono e data:
  - linha 1: aplicação da C-cor-1;
  - linha 5: IMO-30b, depois de 27/11.
- Base para isso:
  - a ADR-0004 exige "avaliação do Marcos → só então ampliação" (`DS:docs/adr/0004-contracts-adapters-pilot.md:31`), e o aceite visual existe desde 14/11 (`DS:docs/STATUS.md:63`);
  - as duas ressalvas dependem de entregas já na fila;
  - a Onda 1 mantém o primário como está (`diag-imo:372`).
- **Continua exigindo a DS-10 fechada sem ressalva:**
  - a pele global (91 modais e todas as tabelas, Onda 8; `DS:docs/adr/0004-contracts-adapters-pilot.md:24`; `IMO:AGENTS.md:100`);
  - qualquer superfície pintada com a cor do portal.

**A Onda 0 pode correr em paralelo? Sim.**
- Ela não muda nenhuma tela (`diag-imo:371,398`).
- É ela que produz o script de captura de que a DS-10 precisa.
- Só a Onda 1 espera a DS-10 fechada.

---

## 5. Ordem no IMO: empresa antes de candidato

**Decisão: empresa primeiro.** A ordem fica:
1. Onda 1: empresa, listas;
2. Onda 2: primários, com a v2.11.0;
3. Onda 3: candidato, listas e leitura.

É a proposta de `diag-imo:383`. Ela substitui "candidato → empregador → admin" (`DS:docs/audits/2026-11-13-ds-auditoria/diagnostico-resultx-ds.md:329`).

**Motivos, pensando como @ux:**
1. **Coerência dentro da mesma sessão.**
   - O recrutador vai e volta entre "Minhas vagas", já no DS, e "Candidatos", "Etapas" e "Modelos", ainda antigos.
   - Na área da empresa, 9 de 19 telas estão no estado ANTIGO (`diag-imo:38`).
   - A pior experiência é a mesma tarefa alternar entre dois idiomas visuais.
   - No lado do candidato, 14 de 15 telas já estão no estado PARCIAL, com `.jl-*` sobre token (`diag-imo:35`). Ele já vê uma linguagem coerente.
2. **Risco e custo menores.**
   - O adaptador só está no layout da empresa (`diag-imo:19`), e a Onda 1 usa as mesmas peças que o piloto já provou.
   - O candidato precisa da Onda 0 (parte b). Para não refazer trabalho, precisa também dos primários da v2.11.0 (`diag-imo:374`).
3. **A ordem do DS é anterior ao piloto.** Foi escrita sem saber onde o adaptador ficaria. A regra que importa no DS (a catraca cai a cada lote) continua valendo.

**Salvaguarda de UX:**
- a Onda 3 começa logo depois da Onda 2;
- dentro dela, listas antes de formulários;
- o funil de entrada do candidato (Onda 6) não pode ficar para depois do admin.

**Registro:** o Supervisor DS anota a mudança de ordem na DS-21 e no plano da E5 do painel, citando esta decisão.

---

## 6. Xscore: `ui/*` locais e convivência com a equipe do Xscore

### 6.1 `ui/*` locais seguindo os contratos, sem adaptador React: confirmado

**Por quê:**
- é o que diz a ADR-0004:18, já aceita;
- um pacote React compartilhado só se justifica depois de dois produtos convergidos, com duplicação real (Electia na E6 e Xscore);
- importar CSS do DS é proibido pelo gate do repo (`diag-xscore:16`);
- os contratos usam nomes do núcleo que o Xscore não tem (`diag-xscore:188`).

**Correção registrada: a E7 do roteiro do DS fica suspensa.** Ela previa importar núcleo + ponte (`DS:docs/audits/2026-11-13-ds-auditoria/diagnostico-resultx-ds.md:331`), o que traria efeitos em cascata e as 26 colisões. No lugar:
- um teste no Xscore mapeia cada token citado pelo contrato para o token da marca Xscore;
- a escala de espaçamento entra na marca Xscore pela C-cor-2 ou pela E4.

**Registros pendentes:** uma emenda curta da ADR-0004, escrita pelo @architect, e o novo critério da DS-23 (`DS:docs/STATUS.md:75`).

**Gatilho para rever:** quando Electia e Xscore tiverem 4 ou mais primitives conformes ao mesmo contrato, com código quase igual, avaliar um pacote React.

### 6.2 Como evitar colisão no mesmo repo (`carneiromarcos/marcos-workspace`)

O git é o do workspace inteiro: `git add -A` varre o portfólio (`XS:PAPEIS.md:76-77`). Código só se mexe em worktree de `origin/main` (`:85-86`).

1. **Faixas de propriedade.**
   - A frente DS escreve só em `apps/web/components/ui/**`, nos `*.module.css` e na camada de apresentação das telas da onda (JSX e marcação).
   - A equipe do Xscore é dona de `lib/`, `supabase/`, `workers/`, `packages/`, server actions, loaders e managers.
   - A prova de fronteira de cada onda (`diag-xscore:155`) torna essa divisão verificável.
2. **Reserva por onda.**
   - Antes de abrir o worktree, o Supervisor publica a lista de arquivos da onda na nota do Xscore.
   - Em seguida roda `gh pr list` e `gh pr diff --name-only` nas PRs abertas.
   - Se houver sobreposição, a PR funcional da equipe entra primeiro e a onda faz rebase depois.
   - Durante a onda, `components/ui/**` fica reservado à frente DS.
3. **PR curta.**
   - Uma PR por onda, aberta só quando estiver pronta para o Revisor.
   - Rebase em `origin/main` antes do parecer final.
   - `git add` sempre com caminho explícito.
4. **O8 só com a fila livre.** A O8 (fila e decisão de crédito) só começa quando a equipe confirmar que não há trabalho aberto em `solicitacoes/` e `approvals/`. A "decisão simplificada" acabou de entrar (#331, `diag-xscore:142`).
5. **Autoridade.**
   - O `PAPEIS.md` ainda manda "sem execução autônoma" enquanto o mandato não for conciliado (`XS:PAPEIS.md:110-112`).
   - O mandato do Marcos de 17/11 cobre o Xscore de forma explícita.
   - Antes da entrega 3, o Supervisor do Xscore registra em `governance/` que as ondas de DS estão autorizadas. Esse é o lugar onde o Supervisor escreve (`XS:PAPEIS.md:63`).
6. **Merge não é deploy.** Só vai para produção com "go deploy" do Marcos (`XS:CLAUDE.md:118`).

---

## 7. Decisões que só o Marcos pode tomar (5)

1. **Esclarecer a D7 (emenda da ADR-0005).** Proposta: a cópia por SHA da `main` do DS no IMO não conta como versão; continua valendo 1 tag a cada 2 semanas para quem consome por tag.
   - *Recomendo aprovar.*
   - Sem isso, as ondas de formulário do IMO só andam por volta de 25/12 (§3).
2. **Ritmo de merge e de aceite visual nos produtos.**
   - *Recomendo:* mesclar em lote, uma ou duas vezes por dia ("merge 9xx 9yy"), e dar o aceite visual pelas capturas anexadas à PR, sem precisar abrir a tela no ar.
   - Sem um ritmo combinado, o Executor acumula fila e o "sem parar" trava no merge.
3. **Cor do texto nos botões pintados com a cor do portal no IMO (white-label).**
   - Com o cálculo de contraste, o texto de um CTA pode passar de branco para preto nos portais de cor clara, e o cliente vai notar.
   - *Recomendo aprovar o cálculo:* preto ou branco, o que der ≥4,5:1, sem mexer na cor da marca do cliente.
4. **Vitrines do Xscore (`/styleguide` e `/styleguide/finance`) abertas ao público em produção** (`diag-xscore:200`).
   - *Recomendo deixá-las só no preview.*
   - Em produção, elas expõem a estrutura da interface sem necessidade. O risco é baixo, mas evitável.
5. **Logo do Xscore:** usar o asset do DS, com versões clara e escura, no lugar de `public/finance/xscore-official.svg` (`diag-xscore:49,198`).
   - *Recomendo o asset do DS, depois de uma comparação lado a lado na O4.*
   - Ainda não está confirmado que é a mesma arte.

**Decidido aqui, sem levar ao Marcos:**
- Card sem sombra: o contrato já manda.
- Direção da página pública do Xscore (O9): fica para o fim; pergunta-se quando chegar a vez.
- Ordem empresa antes de candidato: §5.
- Fechamento da DS-10 com ressalvas datadas: §4.
- Divisão da PR de cores em aditiva e de valor: §0, fato 3.

---

## 8. Segurança e riscos sinalizados

- **IMO-31:** o erro por campo pode revelar que um e-mail já está cadastrado. A rota exige login (`IMO:docs/governance/STATUS.md:79`). Não repetir esse padrão em telas anônimas, como login e cadastro, na Onda 6.
- **Xscore O7 (`/p/[token]`):** formulário anônimo com PDF de até 10 MB, honeypot e link que expira. É a onda mais exposta ao público. Exige ensaio no preview e prova de que `actions.ts` ficou byte-idêntico.
- **IMO Onda 7 (fluxos legais e de pagamento Stripe):**
  - texto conferido palavra por palavra, por hash do texto visível;
  - parecer do @architect antes de mexer no pagamento (`diag-imo:378`).
- **EditalHub:**
  - nenhuma cópia nova do `eds-root` antes de 10/12;
  - a C-cor-2 deixa IMO e EditalHub com SHAs diferentes por algum tempo; essa divergência é aceita e registrada no painel;
  - o critério "SHA igual nas 3 cópias" (`DS:docs/STATUS.md:70`) volta a valer depois de 10/12.
- **Testes de navegador do IMO fora do CI** (`diag-imo:48`):
  - a entrega 2 versiona o script de captura;
  - pôr o script no CI é tarefa separada e não bloqueia as ondas.

## 9. Não confirmado

- O tamanho real de cada entrega diante do limite semanal do Executor. P, M e G são estimativas minhas.
- Se a C-cor-1 e a C-B cabem antes de 27/11. Se não couberem, vão para a v2.12.0, sem prejuízo para o IMO (§2.2).
- Se `--warning` e `--info` existem nas outras marcas com contraste suficiente para a C-A. Só conferi no Xscore (`DS:brands/xscore/tokens/tokens.css:85-88`).
- O estado das PRs abertas da equipe do Xscore. Não consultei o GitHub.
