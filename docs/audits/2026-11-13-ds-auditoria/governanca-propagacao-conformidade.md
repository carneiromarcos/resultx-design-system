# ResultX DS — Governança, propagação de mudanças e conformidade

**Data:** 13/11/2026 · **Autoria:** @architect (Aria) · **Revisão 3** (após pareceres do Revisor, §11) · **Modo:** desenho técnico, somente leitura (nenhum repositório, configuração do GitHub ou deploy alterado)
**Snapshots de `origin/main` lidos:** DS `c86f1e6` (depois conferido pela API até `4fc9422`, merge da #112) · Electia `91b86b51` · IMO `3472e0ee` · Xscore (workspace) `35921bf5`
**Complementa:** `diagnostico-resultx-ds.md` (mesma pasta), sem contradizê-lo. Evidências numeradas (E01…) em `anexos/D-evidencias-governanca.md`.
**Convenção:** caminhos relativos a cada snapshot (`design-system/…`, `electia/…`, `imo/…`, `xscore/…`). **[C]** confirmado (arquivo:linha ou comando) · **(não verificado)** quando não deu para conferir · **(por amostra)** quando a prova cobre só parte dos casos.

---

## 0. Resumo executivo

1. Hoje uma versão nova do DS **não chega sozinha a nenhum produto e não avisa ninguém**. Electia e Xscore travam a tag `#v2.9.0`, e o Dependabot da Electia ignora o DS de propósito. IMO e EditalHub dependem de uma cópia do `eds-root.css` conferida por SHA, atualizada à mão em 3 lugares [C E30, E32, E70, E21].
2. **Proposta (hipótese a validar por prova descartável, §6.5):** a automação `ds-propagate` mora num **repositório privado** de automação e abre **uma PR por produto e por versão**. Antes disso há uma etapa de plano, sem escrita nenhuma. O DS público não guarda segredo. Merge só com ordem do Marcos.
3. **Versionamento:** PATCH = **nenhum artefato não documental, export coberto ou metadado de instalação muda** (lista do pacote, arquivos, `scripts`/dependências, cascata, comparados por máquina; `docs/` pode mudar). Ausência de mudança de pixel nos consumidores é **inferida por amostra**, não provada. Mudou valor, ou reverteu uma mudança visual, é MINOR. Remover/renomear nome público ou mudar a cascata é MAJOR.
4. **Conformidade:** estende as catracas que já existem, sempre **por arquivo e por regra**, em três passos: avisar, depois bloquear só o que é novo, depois queimar o legado. Exceção vencida avisa, mas não esconde infração nova.
5. **Manifesto por produto:** `.ds/manifest.yaml` (escrito à mão) e `.ds/status.json` (gerado, **só com fatos do próprio repo**: o CI exige diff zero). Fatos externos ou que dependem da data (última tag, prazos vencidos, paridade entre repos) vão para um **relatório gerado** que não bloqueia CI.
6. **Limite real:** nos repositórios privados, "bloquear" quer dizer CI vermelho + regra "não se mescla vermelho" [C E41, E65]. No DS (público) a proteção vale [C E08].
7. **Antes de qualquer tag:** a `main` do DS está 9 commits à frente da `v2.9.0`, com mudança visual no `.btn-success`, arquivo removido do pacote e fontes novas fora do pacote [C E17, E77]. Isso conflita com o critério da ADR-0003:47 e exige **reconciliar a ADR aceita** (D10) antes de cortar v2.10.0.

### 0.1 Decisões para o Marcos

| # | Decisão | Opções e recomendação | Custo | Risco |
|---|---|---|---|---|
| D4 | Destino do `npm-publish.yml` do DS (publica no npm a cada GitHub Release) | A) remover; B) manter desligado. **Rec.: A.** Hoje está dormente: 0 releases, pacote inexistente no npm, nenhum run, lista de segredos vazia [C E03, E04] | 1 PR pequena no DS | Remover: se a decisão de 11/10 for reaberta, o workflow precisa ser refeito. Manter: quem cadastrar `NPM_TOKEN` e criar um Release publica uma versão difícil de desfazer (`README.md:35`) |
| D5 | Credencial da automação: **repo privado de automação + GitHub App próprio**, instalado só nos repos-alvo | **Rec.: criar só depois que a prova descartável (P1) passar e a ADR-0003 estiver reconciliada**, no desenho de §6.3. Até lá o Supervisor abre as PRs à mão com o próprio `gh`, por ordem "push N" | App: US$ 0. Minutos do repo privado saem da cota da conta dona (valor não verificado; estimativa de poucos minutos por versão). Cerca de 30 min do Marcos para criar o repo e o App (só ele tem acesso às organizações) | Credencial com escrita em vários repositórios privados. Ameaças e mitigações em §6.3. Quem tiver escrita no repo de automação alcança a chave, por isso só o Marcos é colaborador. **Aceite de risco explícito:** a checagem `github.ref == main` é só trava de execução; não é proteção de branch nem controla um colaborador com escrita. O controle real é ter um único colaborador; aceitar isso faz parte da D5 |
| D6 | Proteção de branch nos repositórios privados (Electia, IMO, EditalHub) | A) manter a decisão DEC-7/DEC-11 de 08/08 [C E33]: CI vermelho bloqueia por convenção + checklist de merge; B) pagar GitHub Team. **Rec.: A agora; reavaliar no primeiro merge vermelho** | A: US$ 0. B: preço por usuário/mês **não verificado** | A: merge vermelho por engano continua possível |
| D7 | Ritmo de versões do DS | A) no máximo 1 versão a cada 2 semanas; B) mensal; C) sob demanda. Em todas, 1 PR de DS por produto por versão, e correção de segurança ou de acessibilidade sai fora do ritmo. **Rec.: A** | Minutos de CI por PR **não medidos** (estimativa: 1 run do CI atual de cada produto por versão) | A: correção visual espera até 2 semanas. C: mais PRs para o Marcos |
| D8 | Tornar o teste visual Linux (PR #112, **já mesclada em 13/11**, 4fc9422) check obrigatório no DS. Antes disso, é preciso tirar o filtro de caminho do workflow, porque com filtro o check fica pendente nas PRs que não tocam a aparência. Depois, conferir com `gh api …/branches/main/protection` que o check aparece em `required_status_checks` (hoje só `lint-and-build` e "PR shape") [C E80, E81] | **Sim, nessa ordem.** Em repo público os minutos do Actions são grátis (não verificado nesta sessão), e o check já passa [C E14] | Cerca de 3 min de CI por PR no DS (estimativa) | Captura instável gerar falso vermelho. Mitigação: `retries` já configurado e procedimento de baseline (§8.3) |
| D9 | Política de exceção | Prazo máximo de 90 dias; o Supervisor DS concede. **Exceção abaixo do piso AA** só com (1) mitigação alternativa registrada que dê acesso equivalente enquanto a barreira existir (o mesmo conteúdo acessível por outro meio, ou variante AA no mesmo fluxo), (2) plano e prazo de correção registrados à parte (prazo **não** é mitigação: não dá acesso enquanto a barreira persiste) e (3) aprovação do Marcos. Sem alternativa possível, registra-se a **ausência de mitigação** e o risco explícito para o Marcos decidir, sem afirmar AA. A aprovação é governança interna e **não equivale a conformidade legal nem WCAG**. Vencimento segue §4.3: avisa e congela, não esconde infração nova | — | Lista de exceções virar depósito; vigiada no relatório (R2) |
| D10 | Reconciliar a **ADR-0003 (aceita em D2)** com o estado real da `main` antes de qualquer tag | A) v2.10.0 = `main` atual (mudança visual declarada, inventário §2.6); a E1 (equivalência) vira v2.11.0; emenda na ADR-0003 aprovada antes da tag. B) não cortar nada agora; a E1 sai como v2.10.0 levando o `.btn-success` como exceção listada (também exige emenda, porque a ADR só admite tokens novos). **Rec.: A** | 1 PR de documentação no DS + 1 tag | A: um MINOR a mais. B: mistura correção visual com a versão que promete equivalência |

Decisões técnicas resolvidas sem o Marcos (marcadas como `[AUTO-DECISION]` no texto): formato do manifesto, regras de SemVer, ferramenta de catraca por stack, mensagens de CI. A escolha da ferramenta de propagação fica **condicionada à prova P1**.

### 0.2 Premissas do briefing que não se confirmaram

| Premissa | O que os snapshots mostram |
|---|---|
| "O IMO tem catraca de cor própria" | **Não localizada** em `3472e0ee` pela busca ampla de E63, que não prova ausência absoluta. O que existe é uma catraca de **dívida** com 5 métricas, nenhuma de cor (`imo/scripts/ci/DebtMetrics.php:25-31`) [C E55]. Ela vira o ponto de extensão (§4) |
| "O Xscore espelha tokens (`brand-tokens.css`)" | O arquivo **não existe** (`find` vazio). O README do DS diz que foi apagado em 12/10 [C E71] |
| "CODEOWNERS e proteção garantem revisão no DS" | CODEOWNERS existe, mas a proteção exige **0 aprovações** e não exige code owner [C E07, E08] |
| "`npm-publish.yml` publica no npm" | Publicaria num GitHub Release; nunca rodou [C E04] → D4 |
| Cópias do `eds-root.css` | As 3 cópias remotas batem com o canônico `c2366a51…` (API, 13/11) [C E22] |

---

## 1. Arquitetura de distribuição e sincronização

### 1.1 Como cada produto consome o DS hoje

| Produto | Canal | Evidência | Quem atualiza | Chega a produção como |
|---|---|---|---|---|
| Electia | **Dependência git por tag** `github:carneiromarcos/resultx-design-system#v2.9.0`; o lock fixa `405b335` (`git+ssh://`) | `electia/package.json:32`; `package-lock.json:8458-8460` | À mão. O Dependabot ignora o DS em version updates (`dependabot.yml:170-174`) | Deploy manual (`deploy-production.yml:16-20`) |
| Electia | Imports: `tokens` → `brands/electia/bridge` → `components/data-cards` | `electia/src/app/globals.css:14,22,23` | — | — |
| Xscore | Dependência git por tag `#v2.9.0` → `405b335` | `xscore/apps/web/package.json:26`; lock `6133-6135` | À mão (não há `dependabot.yml` na `main` do repo do workspace; não verificado além disso) | (não verificado) |
| Xscore | Import único `brands/xscore/tokens` | `xscore/apps/web/app/globals.css:18` | — | — |
| IMO | **Cópia vendored** `public/css/eds-root.css`, SHA `c2366a51…`, travada por teste | `imo/tests/Unit/EdsRootVendoredCopyTest.php:20,22`; `resources/views/partials/emprega-ds-css.blade.php:15-16` | À mão: copiar o arquivo e trocar a constante (`check-eds-root-copies.js:17-19`) | **Merge na `main` = deploy** (`imo/.github/workflows/deploy.yml:3-6`) |
| IMO | White-label regrava `--eds-indigo*` em runtime | `imo/resources/views/front_web/layouts/app.blade.php:149-150` | — | — |
| EditalHub | Cópia vendored `public/site/css/eds-root.css` em `dev` e `main` | `design-system/scripts/check-eds-root-copies.js:34-38`; hash conferido [E22] | À mão, `dev` antes de `main` | Janela de recurso até 10/12 |
| FinanceX, ResultX Site | Tag `#v2.9.0` | `design-system/README.md:41-43` | — | Fora do escopo, **mas afetados por toda versão** (`ci.yml:33` cita `dist/` em produção); imports não verificados |

Nada usa CDN nem npm.

### 1.2 Arquitetura-alvo

```
          ResultX DS (repo PÚBLICO — nenhum segredo)
 ┌──────────────────────────────────────────────────────────────────┐
 │ tokens DTCG (E1) ─► gerador ─► dist/ · brands/*/ · eds-root.css  │
 │ contracts/*.yaml (E2)        CHANGELOG + tabela "Impacto"        │
 │ consumers.yaml (documentação do inventário; não autoriza nada)   │
 │ CI: lint · build · testes · contraste · visual Linux (D8)        │
 └────────────┬─────────────────────────────────────────────────────┘
              │ tag anotada vX.Y.Z, ancestral da main (imutável)
              ▼
  resultx-ds-automation (repo PRIVADO; só o Marcos é colaborador)
  targets.yaml (allowlist) · pending (fila de congelados)
  job PLANEJAR (sem credencial de escrita) ─► artefato com o diff
  job PUBLICAR (token curto por repo) ─► 1 PR por consumidor
              │
   ┌──────────┼──────────────┬──────────────────┬───────────────────┐
   ▼          ▼              ▼                  ▼                   ▼
 Electia    Xscore          IMO              EditalHub         FinanceX/Site
 TAG        TAG (observe)   COPY+SHA         COPY+SHA (dev)    TAG (relatório)
   └──── CI do produto: build · testes · catracas · status.json (diff zero) ────┘
                             │
                      Revisor (parecer) ─► Marcos ("merge N") ─► deploy do produto
```

### 1.3 O que é dependência compartilhada, adaptador ou manual

| Camada | Natureza | Como chega |
|---|---|---|
| Tokens, temas de marca, ponte, `data-cards`, `.rx-*` CSS | **Dependência compartilhada** (gerada no DS) | Tag (Electia/Xscore) ou cópia por SHA (só `eds-root.css`, Laravel) |
| Contratos `contracts/*.yaml` | **Especificação compartilhada** | Vão com a tag; os produtos Laravel declaram a versão no manifesto |
| Adaptadores React (`ui/*` da Electia e do Xscore) | **Locais**, seguem o contrato (ADR-0004:16-18) | Manual quando o contrato muda |
| Adaptadores Blade `<x-rx-*>` | **Locais no IMO** (depois EditalHub) | Manual; pacote Composer só se o EditalHub adotar o mesmo componente (YAGNI) |
| White-label por cliente | Local, calculado no servidor (diagnóstico §6.3) | Fora da propagação |

[AUTO-DECISION] Os produtos Laravel passam a instalar o pacote? → **Não** (motivo: ADR-0002:84 decidiu cópia + SHA; a cópia já é auditável).

### 1.4 Inventário de consumidores

Dois arquivos, com papéis diferentes:

- `consumers.yaml` no DS (público): **documentação** do inventário, de onde a tabela "Consumidores conhecidos" do README passa a ser gerada. Não autoriza nenhuma escrita.
- `targets.yaml` no repo privado de automação: **allowlist** que autoriza escrita. Se divergir do `consumers.yaml`, a automação para e avisa.

O inventário lista **todos** os consumidores conhecidos, inclusive os fora do escopo, e diz para cada um se existe forma de contar uso (`usage_scan`). Sem forma de contar, o estado é `unknown`, e isso tem efeito em §2.3.

```yaml
# consumers.yaml (DS, documentação) — o targets.yaml privado tem os mesmos ids
consumers:
  - { id: electia, repo: empregamais/electia, channel: tag, base: main, brands: [electia],
      imports: [tokens, brands/electia/bridge, components/data-cards], usage_scan: ratchet }
  - { id: xscore, repo: carneiromarcos/marcos-workspace,
      path: meus-projetos/resultx/labs/xscore/apps/web, channel: tag, base: main,
      brands: [xscore], imports: [brands/xscore/tokens], mode: observe, usage_scan: brand-tests }
  - { id: imo, repo: empregamais/emprega-mais-imo, channel: copy, base: main,
      copies: [{ from: brands/emprega-mais/tokens/eds-root.css, to: public/css/eds-root.css,
                 sha_constant: "tests/Unit/EdsRootVendoredCopyTest.php#CANONICAL_SHA256" }],
      merge_deploys_to_production: true, usage_scan: none-yet }
  - { id: editalhub, repo: empregamais/app, channel: copy, base: dev,
      copies: [{ from: brands/emprega-mais/tokens/eds-root.css, to: public/site/css/eds-root.css }],
      freeze: [{ until: 2026-12-11, reason: "janela de recurso de 10/12",
                 requires_human_release: true }], usage_scan: unknown }
  - { id: financex, repo: carneiromarcos/financex, channel: tag, mode: report-only, usage_scan: unknown }
  - { id: resultx-site, repo: carneiromarcos/resultx-site, channel: tag, mode: report-only, usage_scan: unknown }
```

---

## 2. Estratégia de versionamento

### 2.1 Invariantes verificáveis

O CONTRIBUTING já diz: "tudo aditivo é minor" e "só é major se remover ou renomear algo público" (`design-system/CONTRIBUTING.md:143-150`). Faltava dizer o que é PATCH. Uma versão só é **PATCH** se todos os invariantes abaixo valem entre a tag anterior e a nova:

| # | Invariante | Como se verifica | Natureza da prova |
|---|---|---|---|
| V1 | Lista de arquivos do pacote igual | `npm pack --dry-run --json` nas duas tags (respeita `files` e `.npmignore`) | completa |
| V2 | Todo arquivo distribuído não-documental idêntico: CSS, JS, TS, fontes (se distribuídas), mapa `exports` (a documentação em `docs/` pode mudar) | hash por arquivo; para CSS, também a forma normalizada `seletor → propriedade → valor` (CONTRIBUTING:152-158) | completa |
| V2b | Metadados funcionais do `package.json` iguais: `scripts` de ciclo de vida (`prepare`, `install`, `postinstall` etc.), `dependencies`/`peerDependencies`/`optionalDependencies`, `engines`, `main`/`exports`, `files` | comparação campo a campo nas duas tags | completa |
| V3 | Escopo de cascata igual: seletores, `@media`, `@layer`, ordem | comparação normalizada que preserva escopo e ordem (ADR-0003:26) | completa |
| V4 | Capturas sem diferença | visual Linux do DS (4 capturas hoje; contratos depois) | **por amostra**, com tolerância de 0,5% (`playwright.config.js:29`) |

Neste documento, "V1–V3" inclui V2b. V1, V2, V2b e V3 provam que **os artefatos não documentais, os exports cobertos e os metadados que afetam a instalação não mudaram**; a documentação distribuída pode ter mudado e isso não é efeito de tela. V4 não prova a ausência de mudança de pixel em todas as telas de todos os consumidores; ela é evidência por amostra. Com V1–V3 verdes, o pixel só pode mudar por causa de algo fora do pacote.

- **MINOR**: aditivo, mudança de valor que preserva nomes, ou **reversão de mudança visual**. Exige tabela de impacto e captura aprovada.
- **MAJOR**: remove ou renomeia algo público (arquivo em `exports`, token, classe), muda unidade/tipo de token ou muda escopo/ordem de cascata.

[AUTO-DECISION] Correção de contraste é PATCH ou MINOR? → **MINOR com tipo `fix`** (motivo: viola V2; PATCH fica reservado a "nada distribuído mudou").

### 2.2 Tabela por tipo de mudança

| Mudança | Nível | Exemplo concreto |
|---|---|---|
| Doc, teste, CI, refator do gerador com V1–V3 verdes | PATCH | E1 gerando de DTCG os mesmos `dist/` (ADR-0003:26) |
| Token novo | MINOR | `--control-height-md`, `--icon-sm`, `--z-modal` (diagnóstico §4.1) |
| Valor de token existente (núcleo ou marca) | MINOR + "Mudança visual: sim" | Escurecer `--border-control` |
| Regra nova num componente existente | MINOR + captura | `.btn-success` escuro com `--text-on-success` (`components.css:484,486`, já na `main`) |
| Reverter mudança visual já publicada | MINOR | Desfazer um valor de token |
| Reverter **adição** já publicada | MINOR, mantendo o nome como *deprecated* (remover seria MAJOR) | Token novo que se mostrou errado |
| Valor no `eds-root.css` | MINOR + **gate de janela** + SHA novo nas cópias | F2/E4 (só depois de 10/12) |
| Alias legado gerado (`--bg-card: var(--surface-card)`) | MINOR | ADR-0001 (aceite, item 2) |
| Prefixar componente mantendo alias (`.btn` → `.rx-btn` + `.btn`) | MINOR | ADR-0004:17 |
| Remover alias ou nome público | **MAJOR** | §2.3 |
| `@layer` nos tokens / mudar ordem ou escopo de cascata | **MAJOR** | A Electia depende da ordem atual (diagnóstico §1.4 item 2) |
| Remover arquivo distribuído **fora** de `exports` | MINOR, com busca de referência nos consumidores registrada | `tokens/themes/preview.html` saiu do pacote (§2.6) |
| Remover/renomear subpath de `exports` | **MAJOR** | `./tokens/source` (`package.json:27`) |
| Tema de marca: novo pigmento ou fonte | MINOR, afeta só quem importa a marca | `brands/xscore` |
| Tema reprovando contraste | **Não publica** (a ponte falha abaixo de 4,5:1) | `build-brand-bridges.js` |
| Contrato: item opcional novo | MINOR; `contract.version` +minor | variante `ghost` |
| Contrato: exigência nova (prop obrigatória, ARIA/teclado mais estrito, variante removida) | **MAJOR do contrato**; MINOR do DS se nenhum artefato público for removido | `IconButton` exigir `label` |
| Asset de fonte **distribuído** | adicionar = MINOR; trocar = MINOR visual; remover = MAJOR | hoje as fontes da #112 **não** são distribuídas (`.npmignore` exclui `assets/`) [C E78] |
| Baseline visual do DS | sem versão própria | #112 |
| Adaptador de produto | versionado no produto; o manifesto declara `contract.version` | — |

### 2.3 Janela de deprecação e remoção

Um nome *deprecated* só é removido (MAJOR) quando valem as três condições:

1. passaram pelo menos 2 versões MINOR desde o anúncio;
2. passaram pelo menos 90 dias;
3. **todo** consumidor do inventário (§1.4, inclusive `report-only` e EditalHub) tem contagem **conhecida e igual a 0**, medida por uma varredura que existe para aquele consumidor.

Consumidor com `usage_scan: unknown` ou `none-yet` **bloqueia a remoção**, a menos que o Marcos conceda exceção explícita com o risco descrito. Hoje nenhuma varredura de alias está pronta: a catraca da Electia conta só `text-accent-teal` e foco com `accent-teal` (`ds-ratchet.test.ts:25-26`), e nada conta uso de `--eds-*` no EditalHub. Não há contagem automática prometida para quem não tem varredura.

### 2.4 Requisitos do CHANGELOG

Mantém o Keep a Changelog à mão (`CONTRIBUTING.md:101-115`). Toda versão ganha:

```markdown
### Inventário desde a versão anterior
<commits; arquivos distribuídos alterados/adicionados/removidos (V1–V3); o que não é distribuído>
### Impacto por consumidor
| Consumidor | Efeito | Como foi verificado | Ação |
|---|---|---|---|
| electia | nenhum / visual / quebra / desconhecido | análise de import · captura · não verificado | … |
| imo · xscore · editalhub · financex · resultx-site | … | … | … |
**Mudança visual:** sim/não — capturas: <artefato aprovado>
**Deprecations:** <nome> → <substituto>, remoção não antes de vX.0.0 e AAAA-MM-DD
```

Um check do DS falha se a PR que muda `version` não tiver as duas seções. A automação copia a seção para o corpo de cada PR de atualização.

### 2.5 Distribuição por tag git: regras

- **Tag publicada é imutável.** Erro se corrige com versão nova.
- Tag **anotada** e **ancestral da `main`** (`CONTRIBUTING.md:131-141`).
- Release candidate `vX.Y.Z-rc.N` para teste em branch do produto.
- Produto fixa **tag exata**; nada de `#semver:`.
- **Integridade do lock** (check novo no CI do produto, determinístico): o SHA em `resolved` tem de bater com o SHA declarado em `.ds/manifest.yaml > ds.adopted_sha`. A consulta ao remoto (`git ls-remote`) fica no relatório, não no CI.
- Dependabot de segurança continua ligado para o DS na Electia (`dependabot.yml:157-166`).

### 2.6 Antes da v2.10.0: inventário completo `v2.9.0 → main` e reconciliação da ADR

Hoje são 9 commits, de `784dce6` a `4fc9422` (merge da #112) [C E79]:

| Mudança | Distribuída no pacote? | Efeito esperado |
|---|---|---|
| `components/components.css` +4 linhas (`.btn-success` escuro); `dist/components.min.css` 1 linha | **Sim** | Visual para quem importa `components` ou `components/source` |
| `package.json` `files` ganha `!tokens/themes/preview.html` | **Remove** do pacote um arquivo que ia em `tokens/themes/` | Arquivo fora de `exports` → MINOR (§2.2). Nenhuma referência em `electia/src` nem nas pastas `app/` e `components/` do Xscore [C E82]. FinanceX/Site não verificados |
| Atualização de devDeps (cssnano 9.3.1→9.8.0, postcss-import, Playwright) e `overrides` | Não (devDeps) | Podem mudar a saída minificada (`CONTRIBUTING.md:152-158`). No diff, só `dist/components.min.css` mudou; `dist/tokens.min.css` não aparece [C E79] |
| `docs/` (ADRs 0001–0004, auditoria, `buttons.md`), README, CHANGELOG, CONTRIBUTING | Sim, como documentação (`files: docs/`) | Nenhum em tela; a auditoria passa a ir dentro do pacote |
| `assets/fonts/**` (Inter, Sora, JetBrains Mono) | **Não** (`.npmignore: assets/`, fora de `files`) [C E78] | Só no teste visual |
| `tokens/themes/preview.html` (+8), baselines Linux, `visual-baseline-linux.yml`, `.husky/`, CODEOWNERS, AGENTS/CLAUDE, testes | Não | Nenhum para consumidores |

**Impacto por consumidor, por análise de import (não renderizado):**
- Electia: importa `dist/tokens.min.css`, `brands/electia/tokens/ds-bridge.css` e `components/data-cards.css`. Nenhum dos três aparece no diff, então não há efeito esperado.
- Xscore: importa `brands/xscore/tokens/tokens.css`, que não mudou.
- IMO e EditalHub: `eds-root` inalterado.
- FinanceX/ResultX Site: **desconhecido** até conferir os imports. Isso bloqueia o preenchimento da tabela de impacto, e a tag não sai com "desconhecido" sem ordem do Marcos.

**Reconciliação da ADR (D10):** a ADR-0003:47 diz "tag nova (v2.10.0) sem mudança de valor para nenhum consumidor". Ela foi aceita pelo Marcos (D2), então a renumeração **não é decisão do arquiteto**. A ordem é:
1. o Marcos escolhe D10;
2. emenda na ADR-0003 numa PR própria, com parecer do Revisor;
3. inventário e impacto completos no CHANGELOG;
4. só então a tag.

A E1 como v2.11.0 também depende dessa emenda.

---

## 3. Matriz de propagação de alterações

Legenda: **AUTO** = chega pela PR de atualização sem mudar código do produto (nunca mesclada sozinha) · **ADAPT** = exige mudar o adaptador · **MANUAL** = migração no produto · **BLOQ** = bloqueado por janela ou fase · **?** = uso desconhecido (sem varredura) · **—** = não se aplica.

| Mudança | Electia (tag) | IMO (cópia SHA) | Xscore (tag, observe) | EditalHub (só `eds-root`) | Verificação obrigatória |
|---|---|---|---|---|---|
| Valor de token do núcleo | AUTO (lido via ponte e `dl-*`) | — | — | — | V1–V3 + visual DS; captura nas telas-chave |
| Token novo | AUTO (sem efeito até usar) | — até E4 | — | — | Paridade de temas |
| Token renomeado (com alias) | AUTO; catraca conta o alias | — | — | — | Catraca de nomes legados |
| Remoção de alias do núcleo (MAJOR) | MANUAL antes do bump | — | MANUAL | — | Contagem conhecida = 0 em todo o inventário (§2.3) |
| Remoção de token `--eds-*` (MAJOR) | — | MANUAL (varredura a criar) | — | **?** → bloqueia até haver varredura ou exceção do Marcos | idem |
| Tema da marca | AUTO se `electia` | — | AUTO se `xscore` | — | Contraste da ponte + visual |
| `eds-root.css` (valor ou token novo) | — | AUTO via cópia+SHA; **BLOQ até a janela fechar** | — | AUTO na `dev`; **BLOQ até liberação humana** (§6.6) | SHA nas 3 cópias; captura das áreas do IMO; testes de view |
| CSS de componente (`.rx-*`, `data-cards`) | AUTO para `data-cards` | — até consumir `.rx-*` (E3) | — | — | Visual DS + produto |
| `@layer` / cascata (MAJOR) | **MANUAL** com captura antes/depois (E6) | — | MANUAL (26 colisões) | — | Visual completo |
| Contrato aditivo | ADAPT opcional | ADAPT opcional | ADAPT opcional | — | Casos de teste |
| Contrato com exigência nova | ADAPT obrigatório, atômico ou encadeado (§9 item 7) | idem | idem | — | Casos de teste + captura + teclado |
| Arquivo removido do pacote (fora de `exports`) | busca de referência | — | busca de referência | — | Registro no CHANGELOG |
| Asset de fonte distribuído | AUTO se virar export (hoje `next/font`) | — | — | — | Visual |
| Baseline visual do DS | — | — | — | — | §8.3 |

**Congelamento:** consumidor com `freeze` ativo **não recebe nenhuma operação** da automação, nem leitura, nem branch. A retomada segue §6.6.

---

## 4. Regras automatizadas de conformidade

### 4.1 Princípios comuns

1. **Base por arquivo e por regra.** Total global deixa a dívida mudar de arquivo; a catraca da Electia já reprova isso (`ds-ratchet.test.ts:89-94`). A do IMO é global (`debt-baseline.json`), então as métricas de DS do IMO terão base própria por arquivo.
2. **Bloqueia só o novo.** Arquivo novo nasce com limite 0 (`ds-ratchet.test.ts:95-97`). Em arquivo antigo, a contagem `(arquivo, regra)` não pode subir.
3. **Queda vira aviso pedindo para baixar a base** (`ds-ratchet.test.ts:66`; `debt-ratchet.php:56`).
4. **A mensagem diz o substituto** (`ds-ratchet.test.ts:28`) e o contrato.
5. **Lista de nomes legados vem do DS** (`dist/legacy-aliases.json`, gerado na E1), não de listas à mão.
6. **Nenhum check de CI depende da data nem de rede para decidir vermelho/verde.** Prazo vencido e versões remotas viram aviso ou relatório.

### 4.2 Verificações por stack

| Stack / repo | Verificação | Hoje | Adicionar | Relatório |
|---|---|---|---|---|
| **DS** | Hex fora de tokens | stylelint `color-no-hex` (`.stylelintrc.json:4`) | — | bloqueia |
| DS | Artefato gerado = commitado | `ci.yml:28-50` | estender a `tokens/tokens.css` e `eds-root.css` quando forem gerados (ADR-0003:27) | bloqueia |
| DS | V1–V3 contra a tag anterior | — | script de comparação; roda na PR de release | bloqueia classificação PATCH indevida |
| DS | Contraste de botões | `tests/button-contrast.test.js:12-31` (18 dívidas) | por superfície e variante (`e0-provas.md:28-34`) | bloqueia regressão |
| DS | Visual | `visual-baseline-linux.yml` (com filtro de caminho) [C E81] | D8 | bloqueia após D8 |
| DS | Inventário + Impacto no CHANGELOG | — | check em PR que muda `version` | bloqueia |
| **Electia** | Paleta crua, hex 6 dígitos, `text-[Npx]`, `accent-teal` em texto/foco | `ds-ratchet.test.ts:21-27` (só TS/TSX, `:55`) | `hex3`, `arbitraryColor` (152 usos), `arbitraryRadius/Shadow/Space`, `inlineStyleColor`, `legacyAlias` (`accent-teal` 436) | por arquivo e regra; G1 aviso → G2 bloqueia aumento |
| Electia | Hex em CSS do app | nenhum (114 em `src/**/*.css`) | estender a catraca a CSS, sem os blocos de token do `globals.css` | idem |
| Electia | Contraste de tokens | `ds-contrast.test.ts:4-6` | ler a ponte quando E6 trocar nomes | bloqueia |
| Electia | Token inexistente | — | portar `undefined-token` do Xscore | G1 aviso → G2 bloqueia novo |
| Electia | Componente paralelo a contrato | — | arquivo novo com nome de contrato fora de `components/ui/` e de `components.local` | **sempre aviso** |
| Electia | ESLint | `eslint.config.mjs:51-55` (sem regra DS) | `no-restricted-imports` contra vitrines | bloqueia |
| Electia | a11y | — | axe só quando houver Playwright (hoje não há) | aviso |
| **IMO** | Cor, `style=""`, Bootstrap `btn-*` nas views | **nenhum** | métricas DS em `DebtMetrics` com base **por arquivo** (`scripts/ci/ds-baseline.json`): `hex_views` (344 em 70 arquivos), `inline_style_attr` (633), `bootstrap_btn` (678), `hex_own_css` | G1 aviso → G2 bloqueia aumento |
| IMO | Token `--eds-*` inexistente | — (11, anexo C R7) | teste PHP com os 11 atuais na base | G2 bloqueia novo |
| IMO | Stylelint em CSS próprio | — (ESLint só em JS, `package.json:12`) | stylelint nos CSS alterados (padrão `scripts/ci/pint-changed.php`), mas **comparando a contagem `(arquivo, regra)` da base com a da PR**: hex e `!important` legados não reprovam; só o aumento reprova | G1 aviso → G2 bloqueia aumento |
| IMO | Folha avulsa / cópia `eds-root` | `EmpregaDsCssPartialTest`; `EdsRootVendoredCopyTest.php:20` | — | bloqueia |
| IMO | Visual e a11y do piloto | `tests/Browser/employer-lists.cjs:10-15,22`, fora do CI | comparação com baseline aprovada + axe, job condicional | aviso no G1; bloqueia na E3 |
| **Xscore** | Cor, token inexistente, contraste, primitives | `lib/brand/*.test.ts` | `legacy-aliases.json` na E7 | já bloqueia (`xscore-ci.yml:52`) |
| **EditalHub** | Cópia `eds-root` | trava de SHA (ADR-0002:3) | nada até a janela fechar | bloqueia |

[AUTO-DECISION] ESLint ou catraca para valores arbitrários do Tailwind? → **Catraca** (motivo: já existe por arquivo, com exceção e testes; o suporte de plugins ESLint a Tailwind v4 não foi verificado).

### 4.3 Exceções

**Na linha**, com ID: `{/* ds-exception: DSX-ELE-001 */}` · `{{-- ds-exception: DSX-IMO-004 --}}`. **No manifesto**, a entrada com o mesmo ID, escopo e `count` (quantas ocorrências cobre).

| Estado | Efeito na catraca | CI |
|---|---|---|
| Válida | Até `count` ocorrências no escopo não contam | verde |
| **Vencida** | As ocorrências já cobertas viram **dívida congelada** do arquivo (não contam como novas) | **aviso** em toda PR que toque o repo; nunca vermelho por isso |
| Qualquer estado | Ocorrência **além de `count`**, ou uso do ID fora do escopo | conta como infração nova (G2: vermelho) |
| Exceção nova sem ID, sem prazo ou com prazo > limite (D9) | — | vermelho (G1 em diante) |

Assim o vencimento não bloqueia PR alheia e também não esconde infração nova. O formato livre atual (`ds-exception: <motivo>`, `ds-ratchet.test.ts:48`) vale como legado no G1 e vira ID. Hoje são 4 usos, na prévia do WhatsApp (`PhoneMessagePreview.tsx:63-68`). Exceção de arquivo inteiro só pela lista `excluded` (`ds-ratchet.test.ts:11-20`), com revisão do Revisor.

### 4.4 Como evitar falso bloqueio

1. Comentários removidos antes de contar (`ds-ratchet.test.ts:30-42`); portar para PHP/Blade.
2. Arquivo renomeado: a mensagem orienta mover a entrada (`ds-ratchet.test.ts:65`).
3. Saídas que não são interface (PDF, e-mail, impressão) ficam fora por caminho (`ds-ratchet.test.ts:12-20`).
4. Heurísticas nunca bloqueiam.
5. Cada regra tem `mode: off|warn|block` no manifesto; regra que erra volta a `warn` em 1 linha (§8.4).
6. Visual: imagem por digest, fontes locais, tolerância de 0,5% (`playwright.config.js:29`); nunca gerar baseline Linux no Mac.
7. Nada de data ou rede decidindo vermelho no CI (§4.1 item 6).

---

## 5. Manifesto por produto

### 5.1 Três saídas, cada uma com uma regra

| Saída | Quem escreve | Conteúdo | Bloqueia CI? |
|---|---|---|---|
| `.ds/manifest.yaml` | Humano (agente via PR) | adotado (tag + SHA), tema, adaptadores, componentes locais, exceções (com `expires` e `count`), divergências, backlog, modo das regras | schema inválido bloqueia |
| `.ds/status.json` | **Gerado** (`npm run ds:status` / `php scripts/ci/ds-status.php`), **determinístico**: só fatos derivados do conteúdo do repo do produto (SHA no lock ou hash da cópia, contagens por regra, ocorrências por exceção) | instalado, contagens, uso por exceção | **sim**: regerar tem de dar diff zero |
| Relatório de conformidade | Gerado fora do CI (automação ou Supervisor), para o Marcos | última tag, distância de versão, `main` à frente, prazos vencidos, paridade entre repos, consumidores fora do escopo | **não** |

Assim, uma tag nova, um commit no DS ou um prazo vencendo **não mudam** o `status.json` e não bloqueiam PR alheia. Manifesto e status são atualizados **na mesma PR de propagação**.

[AUTO-DECISION] Um arquivo com bloco gerado ou arquivos separados? → **Separados** (motivo: gerador reescrevendo YAML com comentários humanos é frágil; repete o padrão "fonte × gerado" que o CI do DS já protege).

**Validação no CI do produto** (passos dentro do job atual):
1. schema do manifesto (`schemas/ds-manifest.schema.json` publicado pelo DS);
2. regerar o `status.json` e exigir diff zero;
3. `status.installed_sha` = `manifest.ds.adopted_sha`;
4. todo `ds-exception: ID` do código existe no manifesto, e ID sem uso gera aviso;
5. exceção vencida gera aviso, calculado na hora e não gravado.

### 5.2 Schema (campos)

```yaml
schema: 1
product: <id do inventário>
ds:
  adopted: <tag | eds-root>              # intenção
  adopted_sha: <commit da tag | sha256 da cópia>
  channel: tag | copy
  brand: <electia|emprega-mais|xscore|…>
  imports: [<subpaths de exports>]        # só canal tag
  contracts: { <componente>: { version: <x.y>, adapter: <caminho>, status: conforme|parcial|pendente } }
components:
  shared: [<componente do DS usado como está>]
  local: [{ name: <Nome>, path: <caminho>, contract: <componente|null>, reason: <texto> }]
rules: { <rule-id>: { mode: off|warn|block, since: <AAAA-MM-DD> } }
exceptions:
  - { id: DSX-<PROD>-NNN, rule: <rule-id>, scope: <arquivo[:linhas]>, count: <n>, reason: <texto>,
      owner: <papel>, granted_by: Supervisor DS | Marcos, expires: <AAAA-MM-DD>,
      evidence: <link>, a11y_mitigation: <texto, obrigatório se abaixo de AA> }
divergences: [{ what: <texto>, decision: <ADR/decisão>, until: <data|permanente> }]
backlog: [{ id: <texto>, stage: <E0..E7>, item: <texto>, metric: <indicador> }]
```

### 5.3 Exemplo — IMO (valores reais de `3472e0ee`)

```yaml
schema: 1
product: imo
ds:
  adopted: eds-root
  adopted_sha: c2366a517a96da9e8f31f5a466e82fc8bc37de66ed769a190b0c22b67931ce86
  channel: copy
  brand: emprega-mais
  contracts: {}                          # nenhum <x-rx-*> ainda (0 usos em views)
components:
  shared: []                             # só tokens --eds-*
  local:
    - { name: emprega-ds (.jl-*), path: public/css/emprega-ds.css, contract: null, reason: "DS Emprega+ local, 7.237 linhas; converge na E3/E5" }
    - { name: admin-modal-*, path: resources/views/components/admin-modal-shell.blade.php, contract: modal, reason: "cobre 91 modais; pele no piloto" }
    - { name: status-badge, path: resources/views/components/status-badge.blade.php, contract: status-badge, reason: "tons sem prova de contraste" }
rules:
  imo.eds-root-sha:  { mode: block, since: 2026-09-17 }   # data do ADR-0002:5; o teste não traz data
  imo.ds-hex-views:  { mode: warn, since: <G1> }
  imo.inline-style:  { mode: warn, since: <G1> }
  imo.bootstrap-btn: { mode: warn, since: <G1> }
  imo.undefined-eds: { mode: warn, since: <G1> }
exceptions: []
divergences:
  - { what: "Tema claro padrão", decision: "decisão 12/11; diagnóstico §5 linha 23", until: permanente }
  - { what: "Font Awesome 6, não Lucide", decision: "ADR-0004 item 3", until: permanente }
  - { what: "Paginação numerada (rappasoft)", decision: "diagnóstico §5 linha 13", until: permanente }
  - { what: "White-label regrava --eds-indigo em runtime", decision: "ADR-0002:84", until: "E3" }
  - { what: "Admin em Bootstrap/Metronic, sem eds-root", decision: "anexo A §3.5", until: E5 }
backlog:
  - { id: P0-1, stage: E3, item: "Tema rappasoft em 1 tabela do piloto", metric: I5 }
  - { id: P0-2, stage: E3, item: "<x-rx-button>, <x-rx-field>, StatCard, Empty/Error", metric: I5 }
  - { id: P0-3, stage: E3, item: "Partial único de white-label", metric: "5 blocos inline → 1" }
  - { id: P1-1, stage: E4, item: "eds-root com escalas (depois de 10/12)", metric: R3 }
  - { id: P1-2, stage: G1, item: "11 tokens --eds-* inexistentes (anexo C R7)", metric: I8 }
```

`status.json` (determinístico, 13/11): `{ "installed_sha": "c2366a51…", "metrics": { "hex_views": 344, "hex_views_files": 70, "inline_style_attr": 633, "bootstrap_btn": 678, "jl_btn": 662, "x_rx_components": 0, "undefined_eds_tokens": 11 }, "exception_usage": {} }`.

### 5.4 Exemplo — Electia (valores reais de `91b86b51`)

```yaml
schema: 1
product: electia
ds:
  adopted: v2.9.0
  adopted_sha: 405b33517ffc1ef7be04da47f68935e9d8b9c894
  channel: tag
  brand: electia
  imports: [tokens, brands/electia/bridge, components/data-cards]
  contracts: {}                          # contratos ainda não publicados (E2)
components:
  shared: [data-cards]
  local:
    - { name: Button,       path: src/components/ui/button.tsx,        contract: button,       reason: "gradiente roxo é da marca" }
    - { name: Modal,        path: src/components/ui/modal.tsx,         contract: modal,        reason: "referência de a11y" }
    - { name: Tabs,         path: src/components/ui/tabs.tsx,          contract: tabs,         reason: "8 outras a unificar (E6)" }
    - { name: StatusBadge,  path: src/components/ui/status-badge.tsx,  contract: status-badge, reason: "7 tons AA" }
    - { name: PageMessages, path: src/components/ui/page-messages.tsx, contract: alert,        reason: "live region" }
    # demais ui/*: card, checkbox, input, select, slider, textarea, theme-toggle, read-only-notice
rules:
  electia.ratchet.rawPalette:    { mode: block, since: <ADR-127, data não verificada> }
  electia.ratchet.hex:           { mode: block, since: <idem> }
  electia.ratchet.arbitraryText: { mode: block, since: <idem> }
  electia.ratchet.legacyAlias:   { mode: warn,  since: <G1> }
  electia.ratchet.css:           { mode: warn,  since: <G1> }
  electia.undefined-token:       { mode: warn,  since: <G1> }
exceptions:
  - id: DSX-ELE-001
    rule: electia.ratchet.rawPalette
    scope: src/components/recruitment/whatsapp/PhoneMessagePreview.tsx:63-68
    count: 4
    reason: "imita as cores do WhatsApp na prévia (hoje em comentário livre)"
    owner: <a definir>                   # (não verificado)
    granted_by: <a regularizar no G1>
    expires: <a definir no G1>
    evidence: <PR original não identificada>  # (não verificado)
divergences:
  - { what: "Tema escuro padrão, degradê/brilho roxos, Sora/Mono", decision: "ADR-0004 item 7", until: permanente }
  - { what: "Tokens do DS fora de @layer", decision: "diagnóstico §1.4 item 2", until: E6 }
  - { what: "Dialeto --bg-card/--accent-teal", decision: "ADR-0001 (aliases gerados)", until: "legacyAlias = 0" }
  - { what: "3 vitrines locais", decision: "diagnóstico §6.7", until: E6 }
backlog:
  - { id: E1-1, stage: E1, item: "Atualizar para a tag da E1", metric: R1 }
  - { id: E6-1, stage: E6, item: "Unificar 5 diálogos e 9 abas", metric: I4 }
  - { id: E6-2, stage: E6, item: "@layer com captura antes/depois", metric: visual }
```

`status.json` (determinístico, 13/11): `{ "installed_sha": "405b335…", "ratchet": { "files": 79, "rawPalette": 491, "hex": 83, "arbitraryText": 113 }, "legacy": { "accent-teal": 436, "accent-teal_files": 153 }, "arbitraryColor": 152, "css_hex": 114, "exception_usage": { "legacy-inline": 4 } }`.

### 5.5 Indicadores objetivos

**No `status.json` (determinísticos; podem ser usados pelo CI):**

| # | Indicador | Comando | Valor 13/11 | Meta |
|---|---|---|---|---|
| I2 | Dívida da catraca Electia | soma de `ds-ratchet-baseline.json` (E36) | 79 arquivos · 491/83/113 | só cai |
| I3 | Nome legado | `grep -rEo accent-teal src \| wc -l` | 436 em 153 arquivos | só cai |
| I4 | Duplicatas de contrato | contagem por família (anexo B) | 5 diálogos, 9 abas | 1 por família |
| I5 | Telas em contratos | registro de telas do manifesto | IMO piloto 0% | 100% na E3 |
| I8 | Tokens inexistentes | teste novo (§4.2) | IMO 11; Xscore 0 | só cai |
| I9 | IMO: cor e estilo crus | `grep -roE '#[0-9a-fA-F]{6}\b\|#[0-9a-fA-F]{3}\b' resources/views \| wc -l`; `grep -roE 'style="' resources/views \| wc -l` | 344 (70 arquivos); 633 | só cai |
| I10 | IMO: dois idiomas de botão | `grep -roE '\bbtn-(primary\|secondary\|success\|danger\|light\|outline-[a-z]+)\b' resources/views \| wc -l` × `grep -roE '\bjl-btn' resources/views \| wc -l` | 678 × 662 | Bootstrap cai por lote |

**No relatório (externos ou dependentes da data; nunca bloqueiam CI):**

| # | Indicador | Comando | Valor 13/11 |
|---|---|---|---|
| R1 | Distância de versão | lock × última tag **estável**: `gh api --paginate repos/carneiromarcos/resultx-design-system/tags --jq '.[].name'` filtrado por `^v[0-9]+\.[0-9]+\.[0-9]+$` (exclui `-rc.N`) e ordenado por SemVer (`sort -V`); a ordem da API não é critério | Electia/Xscore v2.9.0 = última tag; `main` 9 commits à frente |
| R2 | Exceções vencidas/abertas | manifesto × data do dia | 0/0 (+4 legadas na Electia) |
| R3 | Paridade `eds-root` | `npm run check:eds-root` (DS) | 3/3 |
| R4 | Consumidores com uso desconhecido | inventário `usage_scan` | EditalHub, FinanceX, Site |
| R5 | Dívida de contraste DS | chaves de `debt` em `tests/button-contrast.test.js:12-31` | 18 |

---

## 6. Pipeline de atualização e validação

### 6.1 Fluxo (P2; até lá, passos manuais)

```
1 ENTRADA     workflow_dispatch(tag) ou reconciliação agendada, NUNCA evento do DS
2 VALIDAR     ref do workflow = main do repo de automação; tag casa ^v\d+\.\d+\.\d+(-rc\.\d+)?$;
              tag anotada; ancestral de origin/main do DS; fixa o SHA e usa só o SHA dali em diante
3 ALVOS       targets.yaml (allowlist) ∩ consumers.yaml; divergência = para e avisa;
              congelado = registra pendência (§6.6) e não toca o repo
4 PLANEJAR    job sem credencial de escrita, `--ignore-scripts`: gera o diff proposto por alvo
              (package.json + lock, ou cópia + constante SHA, + .ds/manifest.yaml + .ds/status.json)
              ─► artefato com hash. MODO PLANO = para aqui, ZERO escrita
5 PUBLICAR    passo separado, autorizado: token de instalação curto e restrito a 1 repo;
              confere o hash do artefato (integridade em trânsito, não segurança do conteúdo);
              valida cada patch: caminhos na lista fechada, base = SHA da main lido no plano,
              tamanho máximo, semântica (só a ref/versão do DS no package.json; no lock só as
              entradas do DS; cópia com hash = canônico da tag; constante = esse hash);
              fora disso ABORTA o alvo. Branch determinística + commit pela API + PR
              (1 por alvo por versão). Não executa código do DS nem do produto
6 TESTAR      CI do próprio produto (build, testes, catracas, status diff zero, lock = adopted_sha)
7 APROVAR     Revisor (capturas quando "Mudança visual: sim") ─► Marcos "merge N" (IMO: merge = deploy)
8 REGISTRAR   relatório atualizado (R1–R5)
```

### 6.2 Avaliação de ferramentas (nenhuma comprovada para o caso)

| Critério | Dependabot | Renovate (app hospedado) | Automação própria |
|---|---|---|---|
| Dependência git por tag | **Não serve** para version update: o lock fica no SHA antigo (`electia/dependabot.yml:150-156`) | O manager npm lista `github-tags` entre os datasources; **não comprova** `github:…#tag` com lock correto | **Hipótese**: troca explícita de ref + geração do lock. É exatamente o padrão que a Electia registra como falho (lock sem re-resolver, `dependabot.yml:150-153`; EUSAGE com npm diferente, `:16-27`) → precisa da prova P1 |
| Cópia com SHA + constante PHP | Não | Regex manager troca texto; copiar arquivo exige `postUpgradeTasks` (só self-hosted) | Sim, por desenho (não implementado) |
| Fila de congelados | Não | `schedule` parcial | Sim, por desenho (§6.6) |
| CI do produto dispara | Sim | Sim | Só com token de App/PAT (PR aberta com `GITHUB_TOKEN` não dispara workflow sem aprovação; doc do GitHub) |
| Custo | CI do produto | CI do produto | Minutos do repo privado (não medido) + CI do produto |
| Segurança | já instalado | app de terceiro com escrita nos privados | app próprio, desenho de §6.3 |
| Manutenção | 0 | configuração por repo | script + testes (estimativa: algumas centenas de linhas) |

**Recomendação condicionada:** automação própria é a hipótese mais plausível, porque cobre os dois canais e a fila com um só mecanismo. Ela só vira decisão se a P1 passar. Se a P1 falhar no canal tag, esse canal segue com PR manual do Supervisor e o Renovate é avaliado numa prova equivalente. O canal cópia não depende do resultado do npm. Dependabot de segurança fica como está.

### 6.3 Segurança da credencial e ameaças

**Desenho:**
- Repo **privado** `resultx-ds-automation` (nome sugerido). Só o Marcos é colaborador, e mudança nele só com ordem do Marcos.
- O DS público não guarda segredo, e nenhum workflow do DS tem acesso à credencial.
- GitHub App instalado **só** nos repos-alvo. Permissões: `contents: write` e `pull_requests: write` no job PUBLICAR, mais `contents: read` para o checkout do PLANEJAR.
- O token de instalação é emitido **por repo** (parâmetro `repositories`) e só no passo que precisa dele.
- Ações de terceiros fixadas por SHA.
- Proteção de branch do repo privado no plano free: indisponível nos privados verificados (E41, E65/E76); no repo novo, não verificado. O workflow aborta se `github.ref != refs/heads/main`, mas isso é **só trava de execução**: não é proteção de branch e não impede um colaborador com escrita de mudar o workflow. O controle é ter um único colaborador, risco aceito explicitamente na D5.

| Ameaça | Mitigação |
|---|---|
| Tag maliciosa ou fora da `main` do DS | Validação de ancestralidade + SHA fixado; a `main` do DS exige PR + checks (E08); o conteúdo só entra no produto por PR revisada |
| Script de ciclo de vida do pacote do DS ou de dependências executando com credencial | `npm … --ignore-scripts` no PLANEJAR. O DS tem `"prepare": "husky"` (`package.json:99` na `main`) [C E83]. O PLANEJAR não tem token de escrita, e o PUBLICAR não executa npm |
| `consumers.yaml` público alterado para mirar outro repo | Escrita só para alvos do `targets.yaml` privado; interseção obrigatória |
| Arquivo inesperado na PR (ex.: workflow do produto) | PUBLICAR aceita só a lista fechada (`package.json`, `package-lock.json`, `.ds/*`, cópia `eds-root.css`, arquivo da constante SHA) e valida base, tamanho e semântica de cada patch (§6.1 passo 5). Ajuste de adaptador **nunca** passa pela automação: vai numa PR preparatória compatível com as duas versões, aberta pelo executor/Supervisor e mesclada antes (§9 item 7). O escopo da chave não é ampliado em silêncio; ampliar exige nova decisão do Marcos |
| Artefato adulterado entre jobs | Hash registrado no PLANEJAR e conferido no PUBLICAR. O hash garante só que o conteúdo não mudou no caminho, **não** que o conteúdo proposto é seguro: a validação do PUBLICAR e a revisão humana da PR continuam obrigatórias |
| Texto do CHANGELOG injetando comando ou markdown | Tratado como dado: sem interpolação em shell; corpo enviado pela API |
| Chave vazada | Rotação semestral; revogação no App; tokens de 1 hora; escopo por repo |
| Quem tem escrita no repo de automação lê o segredo | Só o Marcos colaborador; agentes não alteram esse repo sem ordem dele |
| Automação tocando o EditalHub durante a janela | Congelado não é lido nem escrito; retomada exige liberação humana (§6.6) |

### 6.4 Regras do projeto respeitadas

- **1 PR por produto por versão** (cota de 2.000 min da organização, `electia/ci.yml:39-44`). Volume conforme D7.
- **Nunca auto-merge.** Merge com "merge N"; push com "push N".
- **IMO:** a PR avisa no topo "merge = deploy em produção" (`imo/deploy.yml:3-6`).
- **EditalHub:** PR na `dev`, só depois da liberação humana.
- **Xscore:** `observe` até a E7. **FinanceX/Site:** `report-only`.

### 6.5 Faseamento

| Fase | O quê | Escrita? | Depende de |
|---|---|---|---|
| P0 | Inventário + manifesto e status nos 2 produtos (G0) + relatório à mão | PRs de documentação, com "push N" | E0 |
| P1 | **Prova descartável** num clone local da Electia, sem push: ref explícita para uma tag existente; `npm install --package-lock-only --ignore-scripts` no Node 24; conferir que `resolved` = SHA de `git ls-remote <DS> refs/tags/vX^{}`; `npm ci` limpo verde; repetir com o npm do CI. Também conferir se o lock mantém `git+ssh://` (`package-lock.json:8460`) e se isso instala sem chave SSH. Para o canal cópia: script gera cópia + constante e roda `EdsRootVendoredCopyTest`. **Modo plano** do script: imprime o diff, não escreve nada | nenhuma | D10 + 1ª tag |
| P1b | Primeira PR real aberta pelo Supervisor com o script, por ordem explícita | sim, 1 PR | P1 verde |
| P2 | Repo privado + App (D5); workflow com `workflow_dispatch` e reconciliação; teste de concorrência e idempotência (§6.6) | sim | D5 |

### 6.6 Consumidores congelados (EditalHub)

- **Até a P2: retomada manual.** No primeiro dia útil após 10/12, o Supervisor confere com o responsável pelo EditalHub que o recurso acabou, registra a liberação e só então gera a PR.
- **Na P2:** a pendência é gravada com chave idempotente `<consumidor>@<tag>` (issue com rótulo `pending-freeze` no repo privado; recriar não duplica). Uma reconciliação diária às 12:00 UTC (09:00 em America/Sao_Paulo) só abre a PR quando valem as duas condições: (a) a data em America/Sao_Paulo é posterior a `until`; (b) existe liberação humana registrada (`released_by`, `released_at`) no `targets.yaml`. Sem (b), nada roda contra o repo. Pendências de versões superadas são fechadas, e só a mais nova é aberta.
- **Sem atomicidade.** Branch, commit e PR são chamadas separadas da API: uma falha no meio deixa resíduo (branch sem PR), e uma corrida ou nova tentativa pode duplicar. Por isso, na P2:
  - nome de branch **determinístico** por alvo e tag (`ds/update-<consumidor>-<tag>`) e `concurrency` do workflow por alvo, sem cancelar o run em andamento;
  - antes de criar, **reconciliar**: PR aberta para essa branch → não faz nada; branch sem PR com o commit esperado → só abre a PR; branch com conteúdo diferente → para e avisa, sem sobrescrever;
  - falha registrada na issue de pendência com o passo em que parou; nova tentativa no dia seguinte segue a reconciliação acima; resíduo que não se resolve é limpo à mão pelo Supervisor;
  - critério de saída da P2: teste com duas execuções simultâneas e com falha injetada entre commit e PR, provando no máximo 1 branch e 1 PR por alvo e tag.

---

## 7. Plano de adoção gradual

### 7.1 Fases de conformidade (G0–G3)

| Fase | O que vale | Aviso | Bloqueia | Critério de saída |
|---|---|---|---|---|
| **G0 Observar** | Manifesto e status existem; métricas novas só medidas | — | só o que já bloqueia hoje (catraca Electia, travas Xscore, SHA do IMO, contraste DS) + status com diff zero | 2 relatórios coerentes com §5.5 |
| **G1 Avisar** | Métricas novas como `warn`; exceções legadas ganham ID e `count` | métricas novas, exceção vencida | idem G0 + exceção nova sem ID/prazo | 2 semanas sem falso positivo aberto |
| **G2 Bloquear o novo** | Contagem `(arquivo, regra)` não sobe; arquivo novo nasce com 0 | heurísticas, exceção vencida | catracas, token inexistente, stylelint por contagem, lock = `adopted_sha`, status desatualizado, uso além do `count` | 1 ciclo de versão sem rollback de regra |
| **G3 Queimar o legado** | Meta de queda por lote; aliases somem | — | idem G2; MAJOR só com contagem conhecida = 0 em todo o inventário | indicadores na meta |

### 7.2 Sequência contra o roteiro E0–E7

| Momento | DS | IMO (piloto primeiro) | Electia | Xscore | EditalHub |
|---|---|---|---|---|---|
| E0 | D4, D8, **D10** e emenda na ADR-0003; inventário; checks de inventário/impacto; v2.10.0 só depois da emenda | G0 | G0 | `observe` | — |
| E1 (v2.11.0 se D10=A) | P1 + modo plano; `legacy-aliases.json`; V1–V3 provam equivalência | G1 | G1; PR de tag por P1b | relatório | — |
| E2 | contratos + capturas; visual obrigatório | G1 | G1 | relatório | — |
| F3 + E3 | — | **G2 só nas telas do piloto**; visual + axe de `employer-lists.cjs` | G2 nas métricas existentes | — | — |
| Avaliação do piloto | — | Marcos aprova; I5/I9/I10 antes e depois | — | — | — |
| E4 (após 10/12) | MINOR no `eds-root` | PR de cópia+SHA | — | — | PR na `dev` **após liberação humana** (§6.6) |
| E5 | — | G2 em todo o IMO; G3 por família | — | — | G1 |
| E6 | MAJOR `@layer` (depende de inventário com contagens conhecidas) | — | G3 | — | — |
| E7 | — | — | — | sai de `observe` | — |

---

## 8. Critérios de aprovação e rollback

### 8.1 Papéis (nunca autorrevisão)

- **Executor** abre a PR e anexa as provas; não aprova.
- **Supervisor DS** coordena, concede exceção ≤ 90 dias, corta a tag depois do "push N", registra a liberação de congelados.
- **Revisor** dá parecer independente. Sem Revisor, o gate fica pendente.
- **Marcos** dá "merge N"/"push N"; aprova MAJOR, emendas de ADR aceita, exceção acima de 90 dias ou abaixo de AA, valor no `eds-root` e exceções de remoção com uso desconhecido.

A proteção do DS exige 0 aprovações [C E08]. Os agentes abrem PR com a conta do Marcos, e quem abre não aprova a própria PR; exigir code owner travaria tudo. [AUTO-DECISION] O parecer do Revisor fica como comentário na PR e é item do checklist de merge.

### 8.2 Aprovação por tipo de mudança

| Mudança | Provas mínimas | Parecer | Merge |
|---|---|---|---|
| PATCH | V1–V3 verdes + V4 por amostra | Revisor | Marcos |
| MINOR sem visual | inventário + impacto | Revisor | Marcos |
| MINOR visual (inclui reversão) | capturas aprovadas (DS e produtos afetados), contraste | Revisor aprova as imagens | Marcos |
| `eds-root` | + SHA nas 3 cópias + janela liberada + capturas do IMO por área | Revisor | Marcos |
| MAJOR | + contagem conhecida = 0 em todo o inventário (ou exceção do Marcos) + guia de migração | Revisor + @architect | Marcos |
| Emenda de ADR aceita | texto da emenda + motivo | Revisor | Marcos |
| PR de atualização no produto | CI verde + lock = `adopted_sha` + capturas se "visual: sim" | Revisor | Marcos |
| Regra nova ou mudança de modo | 2 semanas de G1 | Revisor | Supervisor (aviso) / Marcos (bloqueio) |
| Exceção | ID + prazo + `count` + evidência (+ mitigação se abaixo de AA) | — | Supervisor (≤ 90 d) / Marcos |

### 8.3 Baselines visuais

Procedimento da #112 (`CONTRIBUTING.md`, seção de baseline Linux):
1. rodar o workflow;
2. o **Revisor aprova** as imagens `actual`;
3. copiar exatamente os PNGs aprovados;
4. conferir o SHA-256;
5. versionar junto da mudança.

Nunca gerar baseline no Mac.

### 8.4 Rollback

| O que voltar | Como | Tempo |
|---|---|---|
| Versão do DS num produto (tag) | PR que reverte a PR de atualização (ref, lock, manifesto e status juntos) | 1 PR |
| Versão publicada com defeito | Nunca mover ou apagar tag. **Nova MINOR** que reverte a mudança visual; adição errada fica como *deprecated* (remover seria MAJOR) | 1 versão |
| `eds-root.css` | Recopiar a versão anterior + constante, nas 3 cópias (IMO → EditalHub `dev` → `main`, respeitando a janela); `check:eds-root`. No IMO o merge é o deploy | 3 PRs |
| White-label após E3 | chave no partial (decidir na E3) | 1 PR |
| Baseline errada | reverter o commit dos PNGs | 1 PR |
| Regra bloqueando errado | `rules.<id>.mode: warn` no manifesto (1 linha) | minutos |
| Automação abrindo PR indevida | fechar PRs; desativar o workflow no repo privado; revogar a instalação do App se houver suspeita | minutos |

O "Rollback plan" do template (`design-system/.github/pull_request_template.md:23`) recebe a linha correspondente.

---

## 9. Contrato de desenvolvimento para agentes (bloco para colar)

**Reconciliação:** já existem o bloco-modelo do DS (`design-system/AGENTS.md:14-23`), o §4.10 da Electia (`electia/AGENTS.md:291-314`), a seção do IMO (`imo/AGENTS.md:86-98`) e o ponteiro do Xscore (`xscore/CLAUDE.md:106-109`). Eles cobrem "ler contrato, usar token, não copiar entre stacks". O bloco abaixo **acrescenta** reuso → verificação → proposta → manifesto, e é colado logo depois do bloco existente.

```markdown
### Interface — reuso, verificação e extensão do ResultX DS

Complementa o bloco "Interface segue o ResultX DS" acima; não o substitui.

1. **Antes de escrever UI, faça o inventário e cite-o no PR:** (a) o contrato do DS que
   cobre o caso (`contracts/<componente>.yaml`; até existir, `docs/components/`); (b) o
   componente local que já o implementa (`components.local` em `.ds/manifest.yaml`);
   (c) a receita de padrão (lista+filtro, formulário, KPI, estados).
2. **Reuse nesta ordem:** componente local conforme → variante prevista no contrato → só
   então algo novo. Nunca crie segunda implementação de algo que já tem contrato.
3. **Não existe padrão?** Abra no repo do DS a issue "Proposta de contrato: <componente>"
   com problema, telas, rascunho de anatomia/variantes/estados/teclado/ARIA, tokens e caso
   de teste de aceite. Se a entrega não pode esperar, implemente atrás de uma exceção
   (item 5) apontando para a issue e registre em `components.local` com `contract: null`.
4. **Rode as verificações antes do PR** e cole o resultado: testes do projeto (incluem as
   catracas), `.ds/status.json` regenerado sem diferença, capturas nos dois temas quando a
   tela muda. Nenhuma contagem (arquivo, regra) pode subir.
5. **Exceção só com ID:** `ds-exception: DSX-<PROD>-NNN` na linha + entrada em
   `.ds/manifest.yaml > exceptions` (motivo, dono, prazo ≤ 90 dias, `count`, evidência).
   Abaixo de AA: mitigação que dê acesso equivalente enquanto a barreira existir, plano e
   prazo de correção registrados à parte (prazo não é mitigação) e aprovação do Marcos. Sem
   alternativa possível, registre a ausência de mitigação e o risco, sem afirmar AA (D9).
   Exceção vencida avisa; nunca cobre ocorrência nova.
6. **Não edite à mão** `.ds/status.json`, cópias vendored nem a base das catracas para
   "fazer passar". Base só desce.
7. **Atualização do DS nunca deixa a main quebrada:** a PR de atualização leva só a troca
   de versão e o ajuste mínimo indispensável para continuar verde (mudança atômica). Ajuste
   grande vai antes, numa PR compatível com as duas versões, e a PR de atualização depende
   dela (encadeadas; mescla na ordem). PR aberta pela automação nunca leva ajuste de
   adaptador: se a nova versão exigir ajuste, a PR preparatória vem primeiro.
8. **Você não aprova o próprio trabalho.** Parecer é do Revisor; merge e push só com ordem
   do Marcos.
```

Onde colar:
- **Electia:** como §4.11.
- **IMO:** depois do item 7 do bloco atual.
- **Xscore:** em `apps/web/AGENTS.md` (o arquivo existe; conteúdo não lido) ou perto do `CLAUDE.md:106`.
- **DS:** como seção "Para consumidores".

O bloco do DS (`AGENTS.md:22`) e o diagnóstico §9.1 (`docs/ds-exceptions.md`) passam a apontar para o manifesto.

---

## 10. Relação com a auditoria de 13/11

### 10.1 O que muda no roteiro (diagnóstico §10)

| Etapa | Mudança |
|---|---|
| E0 | Entra: D4, D8 (#112 já mesclada; tirar o filtro de caminho e tornar o check obrigatório), **D10 + emenda da ADR-0003 antes de qualquer tag**, inventário, checks de inventário/impacto, manifesto e status em G0 no IMO e na Electia. Já na `main` e conferido: CODEOWNERS, `.husky/`, ADRs 0001/0003/0004, blocos no AGENTS.md dos produtos [C E07, E10, E19, E39, E58]. A proteção do DS já está ativa, sem exigir revisão [C E08] |
| E1 | Versão conforme D10 (v2.11.0 na opção A). Equivalência provada por V1–V3; pixel por amostra (V4). P1 (prova descartável) e P1b (primeira PR real manual) |
| E2 | Contratos com `version`; capturas por contrato no check visual |
| E3 | G2 nas telas do piloto; `employer-lists.cjs` com baseline aprovada + axe; I5/I9/I10 antes/depois |
| E4 | PR de cópia+SHA; no EditalHub, só após liberação humana (§6.6) |
| E5–E7 | Fase G declarada (§7.2); a E6 (MAJOR) depende de varredura de uso nos consumidores hoje `unknown` |

### 10.2 Etapas novas

- **G0–G3** (conformidade), transversais às E.
- **P0, P1, P1b, P2** (pipeline). A P2 depende de D5 e da P1.

### 10.3 Riscos

| Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|
| Merge da PR do IMO vira deploy imediato | alta | médio | aviso na PR; MINOR visual só com capturas do IMO |
| Bloqueio por convenção ignorado (privados) | média | alto | checklist de merge; relatório acusa merge vermelho (D6) |
| Falso positivo trava entrega | média | médio | G1 de 2 semanas; contagem por arquivo e regra; rollback em 1 linha |
| Credencial da automação abusada | baixa | alto | repo privado, allowlist, tokens por repo, `--ignore-scripts`, jobs separados (§6.3) |
| P1 falhar no canal tag | média | médio | canal tag segue manual; Renovate avaliado em prova equivalente |
| Remoção de nome bloqueada indefinidamente por uso desconhecido | média | baixo | criar varreduras; exceção explícita do Marcos |
| Exceções virarem depósito | média | médio | D9, R2 no relatório |
| Consumidores fora do escopo afetados | baixa | médio | impacto "desconhecido" bloqueia a tag sem ordem do Marcos |
| Tag movida ou apagada | baixa | alto | imutabilidade + lock = `adopted_sha` |

### 10.4 Não verificado nesta etapa

- Renovate com `github:…#tag` e lock correto; gratuidade do app hospedado para repos privados.
- Se a troca de ref + `npm install --package-lock-only` re-resolve o SHA, e se o lock `git+ssh://` instala sem chave (objeto da P1).
- Se o npm roda `prepare` ao instalar dependência git do DS (por isso `--ignore-scripts` é obrigatório de qualquer forma).
- Minutos do Actions (público e privado), preço do GitHub Team, proteção de branch num repo privado novo.
- Imports de FinanceX e ResultX Site.
- Nenhum teste foi executado; os valores vêm de leitura, `grep` e API do GitHub.

---

## 11. Revisão 2 — o que mudou

| # | Achado do Revisor | Correção (seção) |
|---|---|---|
| 1 | Chave do App como segredo do DS público; gatilhos que rodam código não confiável | Repo **privado** de automação; gatilho só manual ou agendado, com checagem de ref; validação de tag e ancestralidade; allowlist privada; jobs PLANEJAR (sem escrita, `--ignore-scripts`) e PUBLICAR (token curto por repo, lista fechada de arquivos); tabela de ameaças (§1.2, §1.4, §6.1, §6.3); D5 refeita (§0.1) |
| 2 | `status.json` com dados externos ou temporais conflitando com "diff zero" | Status **determinístico** (só fatos do repo do produto); R1–R5 só no relatório, que não bloqueia CI; manifesto e status na mesma PR (§4.1 item 6, §5.1, §5.3–§5.5) |
| 3 | "PATCH nunca muda pixel" não provável; reversão visual como PATCH; v2.10.0 sem inventário; errata como decisão própria | Invariantes V1–V3 (completas) e V4 (por amostra) (§2.1); reversão visual = MINOR (§2.2, §8.4); inventário completo dos 9 commits, incluindo #112, `preview.html` fora do pacote e fontes não distribuídas (§2.6); reconciliação da ADR-0003 como **D10**, antes de qualquer tag (§0.1, §2.6, §7.2, §10.1) |
| 4 | PR de congelado "automática em 11/12" sem mecanismo; risco de tocar o EditalHub | Retomada **manual** até a P2; na P2, pendência idempotente + reconciliação diária (12:00 UTC / 09:00 America/Sao_Paulo) exigindo data **e** liberação humana; congelado não é lido nem escrito (§3, §6.6) |
| 5 | Stylelint no arquivo inteiro reprovando legado; exceção vencida bloqueando ou escondendo | Stylelint por contagem `(arquivo, regra)` base × PR (§4.2); vencida = aviso + dívida congelada, `count` limita a cobertura, ocorrência nova sempre conta (§4.3) |
| 6 | "Dry run" que escreve; `npm install --package-lock-only` não comprovado | Modo plano sem nenhuma escrita; PR real é passo separado (P1b) (§6.1, §6.5); prova descartável com ref explícita, comparação de SHA, `npm ci` e checagem do `git+ssh://` (§6.5); automação apresentada como hipótese, com caminho alternativo (§6.2) |
| 7 | "0 usos em todos" não mensurável; EditalHub como "—"; PR de adaptador separada pode quebrar a `main` | Inventário com `usage_scan`; uso desconhecido bloqueia remoção salvo exceção do Marcos; nenhuma contagem automática prometida (§1.4, §2.3, §3 com linha `--eds-*`); mudança atômica ou PRs encadeadas (§9 item 7) |
| 8 | D9 sem mitigação para abaixo de AA e confundindo aprovação com conformidade; vencimento contraditório; D8, D4, D6, D7 | D9 com mitigação obrigatória e ressalva legal/WCAG; vencimento alinhado a §4.3; D8 com conferência da proteção depois da mudança (texto do Supervisor mantido); D4 com risco real; D6/D7 como opções, custo e minutos marcados como não verificados; D5 sujeita ao item 1; D10 nova (§0.1) |
| — | E63 era tratada como prova de ausência | Redação suavizada para "não localizada pela busca" (§0.2; anexo D E63) |

Não discordo de nenhum dos 8 achados. Num ponto fui além do pedido: no item 6, também deixo condicionada a escolha de ferramenta e marco o Renovate como igualmente não comprovado, em vez de só rebaixar a automação própria.

### Revisão 3 — ressalvas do parecer "aprovado com ressalvas"

| # | Ressalva | Correção (seção) |
|---|---|---|
| R3-1 | Lista fechada do PUBLICAR × ajuste mínimo de adaptador; hash tratado como garantia de conteúdo | Ajuste de adaptador fora da automação, em PR preparatória compatível, sem ampliar a chave; PUBLICAR valida caminhos, base, tamanho e semântica de cada patch; hash = integridade em trânsito, revisão humana obrigatória (§6.1 passo 5, §6.3 tabela, §9 item 7) |
| R3-2 | Promessa de "sem efeito parcial" na reconciliação | Atomicidade negada; branch determinística, `concurrency` por alvo, reconciliação de branch/PR existentes, registro de falha e teste de concorrência + falha injetada como critério da P2 (§6.6, §6.5) |
| R3-3 | Prazo de correção listado como mitigação em D9 | Mitigação efetiva separada de plano e prazo; sem alternativa, registro de ausência e risco para o Marcos, sem afirmar AA (§0.1 D9) |
| R3-4 | V1/V2 não provam "nada distribuído mudou"; faltava controle de scripts e metadados | Redação restrita a artefatos não documentais e exports cobertos; novo invariante V2b para `scripts`, dependências, `engines`, `main`/`exports`, `files` (§0 item 3, §2.1) |
| R3-5 | `github.ref = main` apresentado como proteção; R1 com a primeira tag da API | Aceite de risco explícito na D5 (trava de execução, não proteção; controle real = colaborador único) (§0.1 D5, §6.3); R1 com tags estáveis ordenadas por SemVer, sem RCs (§5.5) |
