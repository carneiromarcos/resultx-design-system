# Anexo D — Evidências do capítulo de governança, propagação e conformidade

@architect (Aria) · 13/11/2026 · somente leitura.
Snapshots (`git archive` de `origin/main`): DS `c86f1e6` · Electia `91b86b51` · IMO `3472e0ee` · Xscore (workspace) `35921bf5`. Caminhos relativos a cada snapshot. Comandos `gh` são só de leitura e foram rodados em 13/11 com a conta do Supervisor.
Capítulo: `../governanca-propagacao-conformidade.md`.

## DS (`design-system/`)

| ID | Evidência | Resultado |
|---|---|---|
| E01 | `package.json:3`, `:9-30`, `:84-100` | versão 2.9.0; `exports` (tokens, theme, ts, components, data-cards, bridges, JS); `prepare: husky`; `check:eds-root` |
| E02 | `README.md:27-35`, `:41-44`, `:48` | distribuição por tag (decisão 11/10); consumidores Electia, FinanceX, ResultX Site, Xscore em `#v2.9.0`; `brand-tokens.css` do Xscore apagado; IMO/EditalHub por cópia+SHA |
| E03 | `.github/workflows/npm-publish.yml:3-5`, `:26-28` | dispara em `release: published`; `npm publish --provenance` com `NPM_TOKEN` |
| E04 | `npm view resultx-design-system` → 404; `gh api repos/carneiromarcos/resultx-design-system/releases` → `[]`; `gh run list --workflow npm-publish.yml` → vazio; `gh secret list` → vazio | workflow nunca rodou; pacote não existe no npm |
| E05 | `.github/workflows/ci.yml:10-22`, `:28-50`, `:33` | lint → lint:tokens → build → test; falha se o build alterar `dist/`/`brands/`; comentário: `dist/` usado em produção por electia, financex e resultx-site |
| E06 | `.github/workflows/release-gate.yml:3-6`, `:43`, `:52`, `:67` | só `::warning` |
| E07 | `.github/CODEOWNERS:2` | `* @carneiromarcos` |
| E08 | `gh api repos/carneiromarcos/resultx-design-system/branches/main/protection` | checks obrigatórios `lint-and-build` e `PR shape (title + body + size)`; `strict: false`; `required_approving_review_count: 0`; `require_code_owner_reviews: false`; `enforce_admins: true`. Repo `public` (`gh api repos/…` → `visibility: public`) |
| E09 | `.github/dependabot.yml:8-60` | github-actions, npm e composer, semanal |
| E10 | `.husky/pre-commit:1-2`; `.husky/commit-msg:1` | `npm run lint` + `npm test -- --runInBand`; commitlint |
| E11 | `.stylelintrc.json:4`, `:41-47` | `color-no-hex` em componentes; desligado em `tokens/**` |
| E12 | `tests/button-contrast.test.js:10-31` | 5 temas × 4 variantes; 18 dívidas listadas |
| E13 | `playwright.config.js:7-8`, `:29`; `ls tests/visual/preview.spec.js-snapshots` | baselines só `*-chromium-darwin.png`; "not yet run in CI"; `maxDiffPixelRatio: 0.005` |
| E14 | `gh pr view 112 -R carneiromarcos/resultx-design-system --json …` | OPEN na primeira leitura (mesclada depois, ver E80); checks `lint-and-build`, `PR shape`, `visual-linux` = SUCCESS; adiciona `visual-baseline-linux.yml`, fontes locais, 4 baselines Linux. Workflow: filtro de caminhos (`:4-17`), imagem por digest (`:28`), comparação (`:49-50`). Diff do CONTRIBUTING: procedimento de aprovação de baseline pelo Revisor |
| E15 | `CONTRIBUTING.md:101-141`, `:143-150` | release manual; tag anotada; conferir ancestral da `main`; "aditivo é minor, remover/renomear é major" |
| E16 | `CHANGELOG.md:6-12` | `[Unreleased]`: contraste do `.btn-success` no escuro |
| E17 | `gh api repos/carneiromarcos/resultx-design-system/compare/v2.9.0...main` | `ahead_by: 8` no snapshot `c86f1e6` (9 após o merge da #112, ver E77/E79); inclui `components/components.css`, `dist/components.min.css`, ADRs, `.husky/`, CODEOWNERS. `components.css:484,486` usa `--text-on-success`; `grep -c text-on-success` no `components.css` da `v2.9.0` = 0 |
| E18 | `gh api repos/carneiromarcos/resultx-design-system/tags` | última tag `v2.9.0` |
| E19 | `docs/adr/0001-role-named-tokens.md:3`, `:153-154`; `0002…:3`, `:84`; `0003…:20-34`, `:42-47`; `0004…:15-31` | ADR-0001/0003/0004 Accepted em 13/11; cópia+SHA; "v2.10.0 sem mudança de valor"; contratos, adaptadores, piloto |
| E20 | `cat brands/emprega-mais/tokens/eds-root.sha256`; `shasum -a 256 brands/emprega-mais/tokens/eds-root.css` | ambos `c2366a517a96…ce86` |
| E21 | `scripts/check-eds-root-copies.js:14-19`, `:34-38` | exige `gh auth`; cópias IMO `main`, app `dev` e `main` |
| E22 | `gh api repos/<repo>/contents/<arquivo> -X GET -f ref=<ref> --jq .content \| base64 -d \| shasum -a 256` para as 3 cópias | IMO@main, app@dev, app@main = `c2366a517a96` (iguais ao canônico) |
| E23 | `AGENTS.md:14-23` | bloco-modelo "Interface — regras do ResultX DS" |
| E24 | `docs/audits/2026-11-13-ds-auditoria/e0-provas.md:24-26`, `:28-34`, `:40-50` | visual Linux pendente (OOM local); limites do gate de contraste; situação da E0 |
| E25 | `.github/pull_request_template.md:23` | campo "Rollback plan" |

## Electia (`electia/`)

| ID | Evidência | Resultado |
|---|---|---|
| E30 | `package.json:32`; `package-lock.json:8458-8460` | `github:…#v2.9.0` → `git+ssh://…#405b33517ffc…` |
| E31 | `src/app/globals.css:14`, `:22`, `:23`, `:26` | imports: tokens, bridge electia, data-cards, viz-tokens local |
| E32 | `.github/dependabot.yml:32-34`, `:46-60`, `:146-174` | Node 24; mensal e teto 5 (cota esgotada em 18/08); `ignore` do DS em version updates porque o lock de dep git não se re-resolve; segurança continua chegando. Comentário `:147` ainda cita `#v2.6.0` (desatualizado) |
| E33 | `.github/workflows/ci.yml:27-30`, `:39-44`, `:64-76`, `:82-93`, `:154-171` | sem CI em push na `main`; cota de 2.000 min; "CI é sinal, não bloqueio" (DEC-7/DEC-11, proteção 403 no plano free); um job só |
| E34 | `.github/workflows/deploy-production.yml:14-20` | deploy de produção AWS por `workflow_dispatch` |
| E35 | `src/lib/__tests__/ds-ratchet.test.ts:7`, `:12-20`, `:21-27`, `:28`, `:48`, `:55`, `:59-69`, `:89-97` | regenerar base; exclusões; 5 métricas (hex só 6 dígitos); orientação; exceção `ds-exception:`; só `.ts/.tsx`; por arquivo; reprova troca e arquivo novo |
| E36 | `node -e 'const b=require("./src/lib/__tests__/ds-ratchet-baseline.json");const t={};let f=0;for(const k in b){f++;for(const m in b[k])t[m]=(t[m]\|\|0)+b[k][m]}console.log(f,t)'` | 79 arquivos; rawPalette 491, hex 83, arbitraryText 113, accentText 0, accentFocus 0 |
| E37 | `src/lib/__tests__/ds-contrast.test.ts:4-6` | contraste dos tokens locais nos 3 fundos |
| E38 | `eslint.config.mjs:51-55` | só regras `react-hooks`; nenhuma regra de DS |
| E39 | `AGENTS.md:291-314` | §4.10 "Interface segue o ResultX DS" |
| E40 | `grep -rEo accent-teal src \| wc -l` = 436; `grep -rl … \| wc -l` = 153; `grep -rEo '\[#[0-9a-fA-F]{3,8}\]' src --include='*.tsx' \| wc -l` = 152; hex em `src/**/*.css` = 114; `.tsx` em `src/app`+`src/components` sem teste = 451; `grep -rn ds-exception src` (sem testes) = 4, todos em `PhoneMessagePreview.tsx:63-68`; `ls src/components/ui` = 13; `ls src/app` mostra `design-system`, `desing-system`, `styleguide`; nenhum Playwright no `package.json` | contagens do manifesto |
| E41 | `gh api repos/empregamais/electia/branches/main/protection` | 403 "Upgrade to GitHub Pro or make this repository public"; repo `private`; organização `empregamais` plano `free` (`gh api orgs/empregamais --jq .plan.name`) |

## IMO (`imo/`)

| ID | Evidência | Resultado |
|---|---|---|
| E50 | `composer.json:20`, `:27`, `:34`; `package.json:12`, `:19`, `:30` | Laravel ^12.60, Livewire ^3.5, rappasoft ^3.7; ESLint só em `resources/assets/js`; Bootstrap ^5.3.8; laravel-mix |
| E51 | `shasum -a 256 public/css/eds-root.css` | `c2366a51…ce86` |
| E52 | `tests/Unit/EdsRootVendoredCopyTest.php:20`, `:22` | constante SHA; caminho da cópia |
| E53 | `resources/views/partials/emprega-ds-css.blade.php:4-9`, `:15-16` | ordem eds-root → emprega-ds com `versionedAsset` (cache Cloudflare 4 h); teste reprova folha avulsa |
| E54 | `resources/views/front_web/layouts/app.blade.php:149-150` | `--eds-indigo` = cor do portal em runtime |
| E55 | `scripts/ci/debt-ratchet.php:34-63`; `scripts/ci/DebtMetrics.php:25-31`; `scripts/ci/debt-baseline.json`; `.github/workflows/tests.yml:147-148` | catraca de dívida **global** com 5 métricas (escopo global, `{!!`, schema em teste, linhas de helpers, IDs Livewire), nenhuma de cor; roda no CI |
| E56 | `.github/workflows/tests.yml:18-30`, `:138-145` | PR contra `main`, ignora docs; build de produção do front; compila views |
| E57 | `.github/workflows/deploy.yml:3-6` | deploy no push da `main` |
| E58 | `AGENTS.md:86-98` | seção "Interface segue o ResultX DS" |
| E59 | `tests/Browser/employer-lists.cjs:10-15`, `:22` | captura `/employer/jobs`, candidaturas, etapas, perfil em 1440/390 × claro/escuro; não roda no CI (`grep Browser .github/workflows/*.yml` vazio) |
| E60 | `config/livewire-tables.php:7` | tema `bootstrap-5` |
| E61 | `ls resources/views/components` | `admin-modal-{shell,header,body,footer}`, `admin-form-section`, `status-badge`, `portal-brand`, `location-fields` |
| E62 | hex nas views: `grep -roE '#[0-9a-fA-F]{6}\b\|#[0-9a-fA-F]{3}\b' resources/views \| wc -l` = 344 (`grep -rlE '#[0-9a-fA-F]{6}\b' resources/views \| wc -l` = 70 arquivos); `style="` = 633; Bootstrap `btn-*` = 678; `jl-btn` = 662; `<x-rx-` = 0; views `.blade.php` = 984; `emprega-ds.css` 7.237 linhas e 32 hex | contagens do manifesto |
| E63 | `grep -rIl -i "ratchet\|catraca" --exclude-dir=vendor --exclude-dir=node_modules --exclude-dir=public .` | só `scripts/ci/debt-*`, `tests.yml` e docs de QA: catraca de cor **não localizada pela busca** (termos `ratchet`/`catraca`; não prova ausência absoluta: uma trava com outro nome não seria achada) |
| E64 | `.github/CODEOWNERS` | todas as linhas comentadas (`@OWNER`) |
| E65 | `gh api repos/empregamais/emprega-mais-imo/branches/main/protection` (e `empregamais/app`) | 403; repos `private` |

## Xscore (`xscore/`)

| ID | Evidência | Resultado |
|---|---|---|
| E70 | `apps/web/package.json:26`; `package-lock.json:6133-6135`; `apps/web/app/globals.css:18` | `#v2.9.0` → `405b335`; import único `brands/xscore/tokens` |
| E71 | `find . -name brand-tokens.css -not -path '*/node_modules/*'` → vazio; DS `README.md:48` | arquivo não existe; apagado em 12/10 |
| E72 | `CLAUDE.md:106-109` | regra "ler `docs/design-system.md` antes de mexer em QUALQUER tela" (cita 8 componentes; `ls apps/web/components/ui \| wc -l` = 19) |
| E73 | `ls apps/web/lib/brand`; `hardcoded-color.test.ts:8-21`; `primitives-contract.test.ts:5-12`; `undefined-token.test.ts:8-20` | travas de cor, token inexistente, contraste, contrato de primitives, motion etc. |
| E74 | `git show origin/main:.github/workflows/xscore-ci.yml` no repo do workspace (linhas 34-36, 52, 59) | `npm ci`, typecheck, lint, `npm test`, build. Lido fora do snapshot (main local do workspace) |
| E75 | `ls apps/web` | `AGENTS.md`, `playwright.config.ts`, `e2e/` existem; `@playwright/test` em `package.json:31` |
| E76 | `gh api repos/carneiromarcos/marcos-workspace/branches/main/protection` | 403; repo `private` |

## DS depois do snapshot (Revisão 2, API do GitHub em 13/11)

| ID | Fonte | Achado |
|---|---|---|
| E77 | `gh api repos/carneiromarcos/resultx-design-system/compare/v2.9.0...main` | `ahead_by` 9; `components/components.css` +4 linhas (`.btn-success` escuro com `color: var(--text-on-success)`, linhas 484 e 486) e `dist/components.min.css` 1 linha: mudança visual distribuída desde a v2.9.0 |
| E78 | `.npmignore` (lista `assets/`, sem mudança desde v2.9.0); `package.json` `files` | fontes de `assets/fonts/**` adicionadas pela #112 **não** vão no pacote; `files` ganha `"!tokens/themes/preview.html"` (linha 36), tirando o arquivo do pacote instalado |
| E79 | mesmo `compare` (lista de commits e arquivos) | commits `784dce6` (#99), `d7f2a59` (#100), `2eb457c` (#101), `e5a1a52` (#103), `d0c03f5` (#104), `fd00657` (#105, devDeps), `6083ce3` (#106, `overrides` sprintf-js/js-yaml), `c86f1e6` (#111, E0), `4fc9422` (#112). devDeps: `@playwright/test` ^1.63.0→^1.64.1, `cssnano` ^9.3.1→^9.8.0, `postcss-import` ^17.0.0→^17.0.1. Sem mudança: `dist/tokens.min.css`, `brands/*`, `components/data-cards.css`. Também mudam `docs/` (distribuído), `tokens/themes/preview.html`, CHANGELOG, CONTRIBUTING, README, workflows, `.husky/`, CODEOWNERS, testes e baselines (não distribuídos) |
| E80 | `gh pr view 112` + `gh api …/branches/main/protection` | #112 `MERGED`, merge commit `4fc94227ad44e73b6b8d25e5c6da1cfa8aa22268`; `required_status_checks.contexts` = `["lint-and-build", "PR shape (title + body + size)"]`: o visual Linux ainda não é obrigatório |
| E81 | `.github/workflows/visual-baseline-linux.yml:4-17` na `main` | filtro `paths` ainda presente, com o comentário "Não tornar este check obrigatório enquanto houver filtro de paths" |
| E82 | `grep -rn "preview.html\|tokens/themes\|components/source\|tokens/source"` em `electia/src` e em `xscore/apps/web/{app,components}`, mais busca do import `components"` | nenhuma ocorrência: a saída de `preview.html` e a mudança em `components.css` não alcançam Electia nem Xscore pelos imports (inferência por import, nada renderizado) |
| E83 | DS `package.json:99` na `main` | `"prepare": "husky"`: script de ciclo de vida que pode rodar ao instalar dependência git (comportamento do npm não verificado) → `--ignore-scripts` obrigatório na automação |

## Fontes externas (documentação)

| ID | Fonte | Uso |
|---|---|---|
| X1 | [Renovate — npm manager](https://docs.renovatebot.com/modules/manager/npm/) | lista `github-tags` entre os datasources; não detalha `github:…#tag` nem lock de dep git |
| X2 | [Renovate — Git Tags Datasource](https://docs.renovatebot.com/modules/datasource/git-tags) · [GitHub Tags Datasource](https://docs.renovatebot.com/modules/datasource/github-tags) | datasources de tag |
| X3 | [Renovate — self-hosted configuration (espelho)](https://git.shivering-isles.com/github-mirror/renovatebot/renovate/-/blob/6fe49c6f59c37fb8219f19e23fdbd3cb921a1129/docs/usage/self-hosted-configuration.md) | `postUpgradeTasks`/`allowedCommands` só em self-hosted |
| X4 | [GitHub Docs — Trigger a workflow](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow) | eventos gerados com `GITHUB_TOKEN` não disparam novos runs (PR fica aguardando aprovação); usar token de App/PAT |

## Não verificado

- Suporte do Renovate a `github:owner/repo#vX.Y.Z` com lock correto; gratuidade do app hospedado da Mend para repos privados.
- Minutos do Actions grátis em repo público; preço do GitHub Team.
- Se FinanceX e ResultX Site importam `components` do DS.
- Data de início das catracas da Electia (ADR-127) e autoria da exceção do WhatsApp.
- Conteúdo de `xscore/apps/web/AGENTS.md`.
- Se `npm install --package-lock-only` re-resolve o SHA ao trocar a tag de uma dependência git, e se o lock `git+ssh://` instala sem chave SSH (objeto da prova P1).
- Se o npm executa `prepare` ao instalar o DS como dependência git.
- Proteção de branch num repo privado novo no plano free; minutos do Actions no repo privado de automação.
- Se a listagem de tags da API vem em ordem SemVer: não é presumido; R1 ordena com `sort -V` e exclui `-rc.N` (Revisão 3).
- Comportamento de concorrência da criação de branch/PR pela API do GitHub (objeto do teste da P2).
- Nenhum teste foi executado (jest, vitest, phpunit, node --test, Playwright).
