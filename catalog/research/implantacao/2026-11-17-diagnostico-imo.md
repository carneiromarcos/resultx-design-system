# Diagnóstico — todas as páginas do IMO no ResultX DS

Data: 17/11/2026. Executor: Uma (UX), somente leitura. Nenhum arquivo de repositório foi alterado.
Fontes: IMO `origin/main` `341ab68` (PR #931, IMO-31) e DS `origin/main` `0827c21` (PR #138, DS-30 PR 4b), cópias rasas (1 commit cada) em `scratchpad/ro/`.
Marca: emprega+ (sempre minúscula).

## 0. Como medi, e o que conta como "usar o DS"

**Prova de uso técnico do DS** (e não semelhança visual), em três níveis:

| Nível | O que precisa existir na tela | Arquivo/teste que prova |
|---|---|---|
| **PILOTO** (componente do DS) | `body` com a classe `rx-pilot` **e** componentes `<x-rx.*>` / classes `.rx-*` do adaptador copiado do DS | `resources/views/employer/layouts/app.blade.php:130-138` carrega `rx-pilot-aliases.css` + `rx-pilot.css` (cópias por SHA, `tests/Unit/RxPilotVendoredCopyTest.php:10-14`, todo seletor começa por `:is(.rx-pilot, #rx-pilot-floor)` em `:25`); `:155` põe `@yield('rx_scope')` no `body`; `tests/Feature/Painel/EscopoDoPilotoDsTest.php:64-81` prova onde o escopo liga e onde não liga (também no gate MySQL via `tests/Smoke/EscopoDoPilotoDsSmokeTest.php`) |
| **PARCIAL** (só tokens do DS) | a tela lê os tokens `--eds-*` do `eds-root.css` (cópia byte-idêntica do DS, `tests/Unit/EdsRootVendoredCopyTest.php:20`) e usa a biblioteca **local** `.jl-*` do IMO (`public/css/emprega-ds.css`, 7.260 linhas, camada 3 "construída sobre `--eds-*`", cabeçalho `:1-12`) ou `var(--eds-*)` na própria view. **Não** usa contrato do DS | critério medido: ≥5 classes `jl-` ou ≥3 `--eds-` na view + includes + views Livewire (até 3 níveis) |
| **ANTIGO** | marcação Bootstrap/Metronic (`btn btn-*`, `form-control`, `card-body`) ou CSS próprio da página. Recebe só a cor da marca pela ponte (`ponte-de-marca.css`, `admin-ds.css`) | abaixo dos limiares acima |

Observação importante: **quase todo layout já carrega o `eds-root.css`** pelo parcial `resources/views/partials/emprega-ds-css.blade.php:15-16` (candidato `candidate/layouts/app.blade.php:92`, site `front_web/layouts/app.blade.php:134`, admin `layouts/app.blade.php:33`, superadmin `layouts/superadmin.blade.php:11`, empresa `employer/layouts/app.blade.php:37`). Carregar o token não é "usar o DS": por isso o critério de PARCIAL olha a marcação da tela. Exceção: `layouts/auth.blade.php` **não** inclui o parcial; as telas de senha o empurram por `@push('css')` (ex.: `auth/passwords/email.blade.php:8-12`). Achado já registrado no IMO como "login sem `eds-root`" (`docs/qa/2026-11-13-ds-e3-piloto-avaliacao.md:55`).

**O adaptador do DS só é carregado no layout da empresa.** Os layouts de candidato, site, admin, superadmin e auth não linkam `rx-pilot*.css` (grep em `resources/views/**/layouts`). Ampliar o DS para fora da área da empresa exige uma PR de layout antes.

**Método do inventário:** script estático sobre `routes/{web,public,candidate,employer,shared,admin,superadmin,autonomo,company-careers,whatsapp}.php` (321 rotas GET/`Route::view`), resolvendo controller → método → `view('...')`. Excluí respostas JSON, redirecionamentos, downloads e fragmentos AJAX (164). Somei à mão as telas que o script não resolve: abas do perfil do candidato e das configurações do admin (`?section=`), páginas de erro, `/email/verify` e `/password/confirm` do `Auth::routes`, consentimento e listas do superadmin. **Resultado: 219 telas (202 views distintas).** Limites: contagem por grep, sem servidor nem captura. Os números são indicativos (ex.: "Field" sugerido onde há `<form>`). Os riscos são classificação minha, conferida por amostra.

## Resumo

| Estado | Telas | % |
|---|---|---|
| PILOTO | **2** | 1% |
| PARCIAL (tokens + `.jl-*` local) | **85** | 39% |
| ANTIGO | **132** | 60% |
| **Total** | **219** | |

| Público | Telas | PILOTO | PARCIAL | ANTIGO |
|---|---|---|---|---|
| Anônimo (site público, mural, carreiras) | 53 | 0 | 37 | 16 |
| Candidato (logado) | 15 | 0 | 14 | 1 |
| Candidato por link assinado (consentimento) | 2 | 0 | 0 | 2 |
| Logado qualquer papel (confirmar conta, verificar e-mail, confirmar senha) | 3 | 0 | 3 | 0 |
| Empresa | 19 | **2** | 8 | 9 |
| Logado empresa/gestão (detalhe do candidato, `/candidate-lists`) | 2 | 0 | 2 | 0 |
| Prestador autônomo (painel) | 5 | 0 | 0 | 5 |
| Admin do portal (inclui `admin/mural`) | 102 | 0 | 9 | 93 |
| Superadmin | 14 | 0 | 12 | 2 |
| Erros (todos) | 4 | 0 | 0 | 4 |

As **2 telas do piloto** (com evidência):
- `GET /employer/jobs` (`routes/employer.php:91`) → `resources/views/employer/jobs/index.blade.php:2` `@section('rx_scope', 'rx-pilot')`. Teste: `EscopoDoPilotoDsTest.php:64`.
- `GET /employer/jobs/{jobId}/applications`, **só na visão lista** (`routes/employer.php:64`) → `resources/views/employer/job_applications/index.blade.php:3`. Testes: `EscopoDoPilotoDsTest.php:65`; a visão funil fica fora do escopo (`:66`).
- Componentes do DS em uso nelas: `<x-rx.*>` em 9 arquivos (`employer/jobs/index`, `job_table_components/empty_state`, `job_applications/index`, `job_stages_modal`, `table_components/{bulk_stage_modal,empty_state,action_button,barra_selecao}`, `partials/perguntar-encerrar-vaga`). Os 8 componentes Blade ficam em `resources/views/components/rx/`: button, card, confirm-dialog, data-table, field, stat-card, state, status-badge. Mais testes: `tests/Unit/BotoesPilotoE3Test.php`, `tests/Feature/Views/CarregamentoTabelasPilotoTest.php`, `tests/Feature/Views/RxPilotVitrineTest.php`, `tests/Unit/RxPilotBridgeTest.php` e 7 testes de navegador `tests/Browser/piloto-*.cjs`, que **não rodam no CI** (nenhuma referência em `.github/workflows/`).
- O escopo `rx-pilot` também liga comportamentos do piloto: `piloto-aviso-falha.js`, `piloto-retorno-foco.js`, `piloto-perfil-erros.js`, `rx-pilot-dialogs.css` e `rx-pilot-tables.css` (`employer/layouts/app.blade.php:77-79` e `:132-137`). O teste exige isso (`EscopoDoPilotoDsTest.php:93-99`). **Consequência:** pôr `rx-pilot` numa tela nova liga junto o JS e a pele de diálogo e tabela do piloto. Ver Onda 0.

Painéis desatualizados: o painel do IMO (`docs/governance/STATUS.md:16`, `:79`) ainda mostra a IMO-31 "EM ANDAMENTO / em PR". A `main` lida já é o merge da #931 (`341ab68`). O painel do DS registra a #931 com deploy 43920051603 (`ds/docs/STATUS.md:62`). Eu não conferi o deploy.

## 1 e 2. Inventário tela a tela, com contratos que servem, o que falta no DS e o risco

Legenda das colunas: **Sinais medidos** = contagem de `jl-*`, `--eds-*` e classes Bootstrap legadas na view com os includes. **Contratos que servem** = dos 8 contratos do DS (`ds/contracts/*.yaml`): Button, Field, Card, StatCard, DataTable, StatusBadge, EmptyState, ConfirmDialog. **Falta no DS** = padrão presente na tela sem contrato no DS. Hoje o `Field` cobre só `text` e `search` (`ds/contracts/field.yaml:7-9`), e o `ConfirmDialog` cobre só confirmação.

### anônimo — 53 telas (PILOTO 0, PARCIAL 37, ANTIGO 16)

| # | Rota (arquivo:linha) | View | Layout | Estado | Sinais medidos | Contratos que servem | Falta no DS | Risco |
|---|---|---|---|---|---|---|---|---|
| 1 | `/services` (routes/autonomo.php:32) | `front_web/servicos/index.blade.php` | front_web.layouts.app | PARCIAL | --eds×7 bootstrap×12 | Field, Button, Card | select/multiselect, paginação | MÉDIO: formulário |
| 2 | `/prestador-register` (routes/autonomo.php:36) | `front_web/auth/provider_register.blade.php` | front_web.layouts.app | PARCIAL | jl×50 --eds×2 | Field, Button, Card | checkbox/rádio/switch | ALTO: autenticação/cadastro |
| 3 | `/services/category/{slug}` (routes/autonomo.php:39) | `front_web/servicos/category.blade.php` | front_web.layouts.app | PARCIAL | --eds×7 bootstrap×11 | Field, Button, Card | select/multiselect, paginação | MÉDIO: formulário |
| 4 | `/services/{slug}` (routes/autonomo.php:53) | `front_web/servicos/show.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×5 | Field, Button, Card | select/multiselect, textarea | BAIXO: leitura/lista |
| 5 | `/products/{slug}` (routes/autonomo.php:56) | `front_web/servicos/show.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×5 | Field, Button, Card | select/multiselect, textarea | BAIXO: leitura/lista |
| 6 | `/prestador/{slug}` (routes/autonomo.php:58) | `front_web/prestador/show.blade.php` | front_web.layouts.app | ANTIGO | sem classe DS/legada contada | Button, Card | — | BAIXO: leitura/lista |
| 7 | `/autonomo/mei` (routes/autonomo.php:62) | `front_web/mei/index.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×5 | Button, Card | — | BAIXO: leitura/lista |
| 8 | `/{companySlug}` (routes/company-careers.php:14) | `front_web/company/company_details.blade.php` | front_web.layouts.app | PARCIAL | jl×71 --eds×10 bootstrap×7 | Field, Button, ConfirmDialog, Card | textarea, modal genérico (além de confirmação) | BAIXO: leitura/lista |
| 9 | `/` (routes/public.php:44) | `front_web/home/home.blade.php` | front_web.layouts.app | PARCIAL | jl×161 --eds×63 bootstrap×12 | Field, Button, StatCard, Card | select/multiselect, abas | BAIXO: leitura/lista |
| 10 | `/search-jobs` (routes/public.php:54) | `front_web/jobs/index.blade.php` | front_web.layouts.app | PARCIAL | jl×52 --eds×7 bootstrap×11 | Field, Button, Card | select/multiselect, checkbox/rádio/switch, paginação | MÉDIO: formulário |
| 11 | `/job-details/{uniqueId?}` (routes/public.php:55) | `front_web/jobs/job_details.blade.php` | front_web.layouts.app | PARCIAL | jl×165 --eds×1 bootstrap×13 | Field, Button, ConfirmDialog, Card | textarea, modal genérico (além de confirmação) | MÉDIO: formulário |
| 12 | `/vagas/{jobId}/candidatar-sem-conta` (routes/public.php:58) | `front_web/curriculo/index.blade.php` | front_web.layouts.app | PARCIAL | jl×32 --eds×4 bootstrap×12 | Field, Button, Card | textarea, checkbox/rádio/switch, upload | ALTO: currículo/candidatura (upload/IA) |
| 13 | `/curriculo` (routes/public.php:59) | `front_web/curriculo/index.blade.php` | front_web.layouts.app | PARCIAL | jl×32 --eds×4 bootstrap×12 | Field, Button, Card | textarea, checkbox/rádio/switch, upload | ALTO: currículo/candidatura (upload/IA) |
| 14 | `/curriculo/conta/{portal}/{submissao}/{token}` (routes/public.php:60) | `front_web/captacao/conta.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×7 | Field, Button, Card | — | ALTO: currículo/candidatura (upload/IA) |
| 15 | `/curriculo/confirmar/{token}` (routes/public.php:63) | `front_web/curriculo/confirmar.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×1 | Field, Button, Card | — | ALTO: currículo/candidatura (upload/IA) |
| 16 | `/curriculo/gerir/{token}` (routes/public.php:65) | `front_web/curriculo/gerir.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×2 | Field, Button, Card | — | ALTO: currículo/candidatura (upload/IA) |
| 17 | `/convites/{convite}` (routes/public.php:73) | `front_web/convite/responder.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×7 | Field, Button, Card | — | ALTO: currículo/candidatura (upload/IA) |
| 18 | `/bancodetalentos` (routes/public.php:84) | `front_web/banco_talentos/index.blade.php` | front_web.layouts.app | PARCIAL | jl×7 --eds×18 | Button, Card | — | BAIXO: leitura/lista |
| 19 | `/cursos` (routes/public.php:88) | `front_web/courses/index.blade.php` | front_web.layouts.app | PARCIAL | --eds×7 bootstrap×7 | Field, Button, Card | select/multiselect, paginação | BAIXO: leitura/lista |
| 20 | `/cursos/{slug}` (routes/public.php:89) | `front_web/courses/show.blade.php` | front_web.layouts.app | PARCIAL | --eds×7 bootstrap×4 | Field, Button, Card | — | BAIXO: leitura/lista |
| 21 | `/instituicoes` (routes/public.php:92) | `front_web/organizations/index.blade.php` | front_web.layouts.app | ANTIGO | sem classe DS/legada contada | Button, Card | — | BAIXO: leitura/lista |
| 22 | `/instituicoes/{slug}` (routes/public.php:93) | `front_web/organizations/show.blade.php` | front_web.layouts.app | ANTIGO | sem classe DS/legada contada | Button, Card | — | BAIXO: leitura/lista |
| 23 | `/associacoes` (routes/public.php:94) | `front_web/organizations/index.blade.php` | front_web.layouts.app | ANTIGO | sem classe DS/legada contada | Button, Card | — | BAIXO: leitura/lista |
| 24 | `/associacoes/{slug}` (routes/public.php:95) | `front_web/organizations/show.blade.php` | front_web.layouts.app | ANTIGO | sem classe DS/legada contada | Button, Card | — | BAIXO: leitura/lista |
| 25 | `/acoes` (routes/public.php:96) | `front_web/actions/index.blade.php` | front_web.layouts.app | PARCIAL | --eds×7 bootstrap×5 | Field, Button, Card | select/multiselect, paginação | BAIXO: leitura/lista |
| 26 | `/acoes/{slug}` (routes/public.php:97) | `front_web/actions/show.blade.php` | front_web.layouts.app | PARCIAL | --eds×7 bootstrap×3 | Field, Button, Card | — | BAIXO: leitura/lista |
| 27 | `/concursos` (routes/public.php:102) | `front_web/contests/index.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×7 | Field, Button, Card | select/multiselect, paginação | BAIXO: leitura/lista |
| 28 | `/editais` (routes/public.php:109) | `front_web/editais/index.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×4 | Button, Card | paginação | BAIXO: leitura/lista |
| 29 | `/editais/{id}` (routes/public.php:112) | `front_web/editais/show.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×2 | Button, DataTable, StatusBadge, EmptyState, Card | — | BAIXO: leitura/lista |
| 30 | `/company-lists` (routes/public.php:116) | `front_web/company/index.blade.php` | front_web.layouts.app | PARCIAL | jl×34 --eds×2 | Field, Button, Card | select/multiselect, paginação | BAIXO: leitura/lista |
| 31 | `/company-details/{uniqueId?}` (routes/public.php:117) | `front_web/company/company_details.blade.php` | front_web.layouts.app | PARCIAL | jl×71 --eds×10 bootstrap×7 | Field, Button, ConfirmDialog, Card | textarea, modal genérico (além de confirmação) | BAIXO: leitura/lista |
| 32 | `/about-us` (routes/public.php:118) | `front_web/about_us/index.blade.php` | front_web.layouts.app | PARCIAL | jl×14 --eds×27 | Button, Card | editor rico | BAIXO: leitura/lista |
| 33 | `/categories` (routes/public.php:119) | `front_web/categories/index.blade.php` | front_web.layouts.app | PARCIAL | jl×22 --eds×2 | Button, Card | paginação | BAIXO: leitura/lista |
| 34 | `/front-register` (routes/public.php:120) | `front_web/auth/candidate_register.blade.php` | front_web.layouts.app | PARCIAL | jl×49 --eds×2 | Field, Button, Card | checkbox/rádio/switch | ALTO: autenticação/cadastro |
| 35 | `/candidate-register` (routes/public.php:121) | `front_web/auth/candidate_register.blade.php` | front_web.layouts.app | PARCIAL | jl×49 --eds×2 | Field, Button, Card | checkbox/rádio/switch | ALTO: autenticação/cadastro |
| 36 | `/employer-register` (routes/public.php:122) | `front_web/auth/employer_register.blade.php` | front_web.layouts.app | PARCIAL | jl×46 --eds×2 | Field, Button, Card | checkbox/rádio/switch | ALTO: autenticação/cadastro |
| 37 | `/privacy-policy-list` (routes/public.php:123) | `front_web/privacy_policy/index.blade.php` | front_web.layouts.app | PARCIAL | jl×9 --eds×4 | Button, Card | — | ALTO: texto legal/LGPD (não mudar texto) |
| 38 | `/terms-conditions-list` (routes/public.php:124) | `front_web/terms_conditions/index.blade.php` | front_web.layouts.app | PARCIAL | jl×9 --eds×4 | Button, Card | — | ALTO: texto legal/LGPD (não mudar texto) |
| 39 | `/contact-us` (routes/public.php:125) | `front_web/contact/index.blade.php` | front_web.layouts.app | PARCIAL | jl×22 --eds×9 | Field, Button, Card | textarea | BAIXO: leitura/lista |
| 40 | `/posts` (routes/public.php:140) | `front_web/blogs/index.blade.php` | front_web.layouts.app | PARCIAL | jl×35 --eds×58 | Field, Button, Card | editor rico, paginação | BAIXO: leitura/lista |
| 41 | `/posts/details/{post}` (routes/public.php:143) | `front_web/blogs/blogs_details.blade.php` | front_web.layouts.app | PARCIAL | jl×25 --eds×54 bootstrap×4 | Field, Button, Card | textarea, editor rico | BAIXO: leitura/lista |
| 42 | `/posts/category/{postCategory}` (routes/public.php:144) | `front_web/blogs/blogs_based_on_category.blade.php` | front_web.layouts.app | PARCIAL | jl×24 --eds×58 | Button, Card | editor rico, paginação | BAIXO: leitura/lista |
| 43 | `portal não encontrado` ((handler de exceção)) | `errors/portal-nao-encontrado.blade.php` | (standalone) | ANTIGO | sem classe DS/legada contada | Button, Card | — | BAIXO: leitura/lista |
| 44 | `admin/login` (routes/web.php:51) | `front_web/auth/admin_login.blade.php` | front_web.layouts.app | PARCIAL | jl×26 --eds×2 | Field, Button, Card | checkbox/rádio/switch | ALTO: autenticação/cadastro |
| 45 | `users/employee-login` (routes/web.php:59) | `front_web/auth/employer_login.blade.php` | front_web.layouts.app | PARCIAL | jl×35 --eds×2 | Field, Button, Card | checkbox/rádio/switch | ALTO: autenticação/cadastro |
| 46 | `users/candidate-login` (routes/web.php:63) | `front_web/auth/candidate_login.blade.php` | front_web.layouts.app | PARCIAL | jl×36 --eds×2 | Field, Button, Card | checkbox/rádio/switch | ALTO: autenticação/cadastro |
| 47 | `users/provider-login` (routes/web.php:67) | `front_web/auth/provider_login.blade.php` | front_web.layouts.app | PARCIAL | jl×28 --eds×2 | Field, Button, Card | checkbox/rádio/switch | ALTO: autenticação/cadastro |
| 48 | `password/reset` (routes/web.php:72) | `auth/passwords/email.blade.php` | layouts.auth | PARCIAL | jl×26 --eds×5 | Field, Button, Card | — | ALTO: autenticação/cadastro |
| 49 | `password/whatsapp/codigo` (routes/web.php:79) | `auth/passwords/whatsapp-codigo.blade.php` | layouts.auth | PARCIAL | jl×8 --eds×1 | Field, Button, Card | — | ALTO: autenticação/cadastro |
| 50 | `password/whatsapp/nova` (routes/web.php:81) | `auth/passwords/whatsapp-nova.blade.php` | layouts.auth | PARCIAL | jl×10 --eds×1 | Field, Button, Card | — | ALTO: autenticação/cadastro |
| 51 | `password/reset/{token}` (routes/web.php:84) | `auth/passwords/reset.blade.php` | layouts.auth | PARCIAL | jl×26 --eds×5 | Field, Button, Card | — | ALTO: autenticação/cadastro |
| 52 | `pricing` (routes/web.php:88) | `pricing/index.blade.php` | employer.layouts.app | PARCIAL | jl×36 bootstrap×3 | Field, Button, ConfirmDialog, Card | textarea, modal genérico (além de confirmação) | ALTO: pagamento/plano |
| 53 | `/conta-criada` (routes/web.php:105) | `conta/criada.blade.php` | (standalone) | PARCIAL | jl×9 --eds×1 | Button, Card | — | ALTO: autenticação/cadastro |

### candidato (link assinado, sem login) — 2 telas (PILOTO 0, PARCIAL 0, ANTIGO 2)

| # | Rota (arquivo:linha) | View | Layout | Estado | Sinais medidos | Contratos que servem | Falta no DS | Risco |
|---|---|---|---|---|---|---|---|---|
| 54 | `/decisoes/{pedido} (link assinado)` (routes/public.php:36) | `consentimento/decisao.blade.php` | (standalone) | ANTIGO | --eds×1 | Field, Button, Card | — | ALTO: texto legal/LGPD (não mudar texto) |
| 55 | `/decisoes (indisponível)` (routes/public.php:36) | `consentimento/indisponivel.blade.php` | (standalone) | ANTIGO | sem classe DS/legada contada | Button, Card | — | ALTO: texto legal/LGPD (não mudar texto) |

### candidato — 15 telas (PILOTO 0, PARCIAL 14, ANTIGO 1)

| # | Rota (arquivo:linha) | View | Layout | Estado | Sinais medidos | Contratos que servem | Falta no DS | Risco |
|---|---|---|---|---|---|---|---|---|
| 56 | `dashboard` (routes/candidate.php:23) | `candidate/dashboard/dashboard.blade.php` | candidate.layouts.app | PARCIAL | jl×163 --eds×6 | Button, StatCard, Card | — | BAIXO: leitura/lista |
| 57 | `/profile (aba geral)` (routes/candidate.php:25) | `candidate/profile/general.blade.php` | candidate.profile.index | PARCIAL | jl×83 --eds×8 bootstrap×3 | Field, Button, Card | select/multiselect, checkbox/rádio/switch, upload | MÉDIO: upload |
| 58 | `/profile?section=career-informations` (routes/candidate.php:25) | `candidate/profile/career-informations.blade.php` | candidate.profile.index | PARCIAL | jl×107 --eds×4 bootstrap×12 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, modal genérico (além de confirmação) | ALTO: currículo/candidatura (upload/IA) |
| 59 | `/profile?section=resume` (routes/candidate.php:25) | `candidate/profile/resume.blade.php` | candidate.profile.index | PARCIAL | jl×31 --eds×13 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | checkbox/rádio/switch, upload, modal genérico (além de confirmação) | ALTO: currículo/candidatura (upload/IA) |
| 60 | `/profile?section=cv-builder` (routes/candidate.php:25) | `candidate/profile/cv-builder.blade.php` | candidate.profile.index | PARCIAL | jl×197 --eds×62 bootstrap×53 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, modal genérico (além de confirmação) | ALTO: currículo/candidatura (upload/IA) |
| 61 | `/profile/summary` (routes/candidate.php:26) | `candidate/profile/summary.blade.php` | candidate.profile.index | PARCIAL | jl×13 | Field, Button, Card | select/multiselect, textarea | BAIXO: leitura/lista |
| 62 | `curriculo/revisar-resumo` (routes/candidate.php:37) | `candidate/curriculo/revisar-resumo.blade.php` | candidate.layouts.app | PARCIAL | jl×18 | Field, Button, Card | textarea, checkbox/rádio/switch, upload | ALTO: currículo/candidatura (upload/IA) |
| 63 | `preferencias` (routes/candidate.php:78) | `candidate/preferences/index.blade.php` | candidate.layouts.app | PARCIAL | jl×23 --eds×3 | Button, Card | checkbox/rádio/switch, abas | BAIXO: leitura/lista |
| 64 | `favourite-jobs` (routes/candidate.php:81) | `candidate/favourite_jobs/index.blade.php` | candidate.layouts.app | PARCIAL | jl×11 --eds×2 | Button, DataTable, StatusBadge, EmptyState, Card | abas | BAIXO: leitura/lista |
| 65 | `favourite-companies` (routes/candidate.php:85) | `candidate/favourite_companies/index.blade.php` | candidate.layouts.app | PARCIAL | jl×11 --eds×2 | Button, DataTable, StatusBadge, EmptyState, Card | abas | BAIXO: leitura/lista |
| 66 | `selecoes/{candidatura}` (routes/candidate.php:91) | `candidate/selecao/responder.blade.php` | candidate.layouts.app | ANTIGO | jl×1 bootstrap×3 | Field, Button, Card | — | MÉDIO: formulário |
| 67 | `applied-jobs` (routes/candidate.php:102) | `candidate/applied_job/index.blade.php` | candidate.layouts.app | PARCIAL | jl×86 --eds×2 bootstrap×4 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, abas, paginação, modal genérico (além de confirmação) | MÉDIO: formulário |
| 68 | `job-alerts` (routes/candidate.php:134) | `candidate/job_alert/edit.blade.php` | candidate.layouts.app | PARCIAL | jl×39 --eds×13 | Field, Button, Card | select/multiselect, checkbox/rádio/switch, abas | MÉDIO: formulário |
| 69 | `apply-job/{jobId}` (routes/candidate.php:160) | `front_web/jobs/apply_job/apply_job.blade.php` | front_web.layouts.app | PARCIAL | jl×36 --eds×1 bootstrap×2 | Field, Button, Card | select/multiselect, textarea, upload | ALTO: currículo/candidatura (upload/IA) |
| 70 | `candidate/completar-cadastro` (routes/web.php:137) | `front_web/auth/candidate_complete_cpf.blade.php` | front_web.layouts.app | PARCIAL | jl×14 --eds×2 | Field, Button, Card | — | ALTO: autenticação/cadastro |

### logado (qualquer) — 3 telas (PILOTO 0, PARCIAL 3, ANTIGO 0)

| # | Rota (arquivo:linha) | View | Layout | Estado | Sinais medidos | Contratos que servem | Falta no DS | Risco |
|---|---|---|---|---|---|---|---|---|
| 71 | `/email/verify (Auth::routes)` (routes/web.php:36) | `auth/verify.blade.php` | layouts.app | PARCIAL | jl×21 --eds×7 | Field, Button, Card | — | ALTO: autenticação/cadastro |
| 72 | `/password/confirm (Auth::routes)` (routes/web.php:36) | `auth/passwords/confirm.blade.php` | layouts.auth | PARCIAL | jl×23 --eds×6 | Field, Button, Card | — | ALTO: autenticação/cadastro |
| 73 | `/confirmar-conta` (routes/web.php:117) | `conta/confirmar.blade.php` | (standalone) | PARCIAL | jl×13 --eds×1 | Field, Button, Card | — | ALTO: autenticação/cadastro |

### logado (empresa/gestão) — 1 telas (PILOTO 0, PARCIAL 1, ANTIGO 0)

| # | Rota (arquivo:linha) | View | Layout | Estado | Sinais medidos | Contratos que servem | Falta no DS | Risco |
|---|---|---|---|---|---|---|---|---|
| 74 | `candidate-details/{uniqueId}` (routes/public.php:161) | `front_web/candidate/candidate_details.blade.php` | front_web.layouts.app | PARCIAL | jl×42 --eds×14 bootstrap×7 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, modal genérico (além de confirmação) | BAIXO: leitura/lista |

### logado (gestão do portal) — 1 telas (PILOTO 0, PARCIAL 1, ANTIGO 0)

| # | Rota (arquivo:linha) | View | Layout | Estado | Sinais medidos | Contratos que servem | Falta no DS | Risco |
|---|---|---|---|---|---|---|---|---|
| 75 | `/candidate-lists` (routes/public.php:169) | `front_web/candidate/index.blade.php` | front_web.layouts.app | PARCIAL | jl×131 --eds×1 bootstrap×4 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, abas, paginação, modal genérico (além de confirmação) | MÉDIO: formulário |

### empresa — 19 telas (PILOTO 2, PARCIAL 8, ANTIGO 9)

| # | Rota (arquivo:linha) | View | Layout | Estado | Sinais medidos | Contratos que servem | Falta no DS | Risco |
|---|---|---|---|---|---|---|---|---|
| 76 | `jobs/{jobId}/applications` (routes/employer.php:64) | `employer/job_applications/index.blade.php` | employer.layouts.app | PILOTO | `rx_scope`=rx-pilot + `<x-rx.*>`; EscopoDoPilotoDsTest | já usa Button, DataTable, ConfirmDialog, StatusBadge, EmptyState, Field | primário com preenchimento e link-botão (v2.11.0) | — |
| 77 | `jobs` (routes/employer.php:91) | `employer/jobs/index.blade.php` | employer.layouts.app | PILOTO | `rx_scope`=rx-pilot + `<x-rx.*>`; EscopoDoPilotoDsTest | já usa Button, DataTable, ConfirmDialog, StatusBadge, EmptyState, Field | primário com preenchimento e link-botão (v2.11.0) | — |
| 78 | `dashboard` (routes/employer.php:36) | `employer/dashboard/index.blade.php` | employer.layouts.app | PARCIAL | jl×276 --eds×6 bootstrap×5 | Field, Button, DataTable, StatusBadge, EmptyState, StatCard, Card | select/multiselect, data, passos | ALTO: pagamento/plano |
| 79 | `configuracoes` (routes/employer.php:38) | `employer/configuracoes/index.blade.php` | employer.layouts.app | PARCIAL | jl×8 | Button, Card | abas | BAIXO: leitura/lista |
| 80 | `etapas` (routes/employer.php:39) | `employer/job_stages/index.blade.php` | employer.layouts.app | PARCIAL | jl×20 bootstrap×8 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | textarea, checkbox/rádio/switch, modal genérico (além de confirmação) | MÉDIO: formulário |
| 81 | `/employer/candidates` (routes/employer.php:46) | `employer/candidates/index.blade.php` | employer.layouts.app | PARCIAL | jl×130 bootstrap×4 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, abas, paginação, modal genérico (além de confirmação) | MÉDIO: formulário |
| 82 | `jobs/{jobId}/applications/{jobApplicationId}/slots` (routes/employer.php:77) | `employer/job_applications/view_slot_screen.blade.php` | employer.layouts.app | ANTIGO | bootstrap×37 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, modal genérico (além de confirmação) | MÉDIO: formulário |
| 83 | `jobs/create` (routes/employer.php:94) | `employer/jobs/create.blade.php` | employer.layouts.app | PARCIAL | jl×185 bootstrap×19 | Field, Button, Card | select/multiselect, checkbox/rádio/switch, abas, data, editor rico | ALTO: formulário com regra de negócio |
| 84 | `jobs/{job}/divulgar` (routes/employer.php:100) | `employer/jobs/divulgar.blade.php` | employer.layouts.app | ANTIGO | bootstrap×13 | Field, Button, Card | select/multiselect, textarea, checkbox/rádio/switch | BAIXO: leitura/lista |
| 85 | `jobs/{job}` (routes/employer.php:102) | `employer/jobs/show.blade.php` | employer.layouts.app | ANTIGO | bootstrap×5 | Button, Card | — | BAIXO: leitura/lista |
| 86 | `jobs/{job}/edit` (routes/employer.php:103) | `employer/jobs/edit.blade.php` | employer.layouts.app | PARCIAL | jl×185 bootstrap×19 | Field, Button, Card | select/multiselect, checkbox/rádio/switch, abas, data | ALTO: formulário com regra de negócio |
| 87 | `equipe` (routes/employer.php:120) | `employer/equipe/index.blade.php` | employer.layouts.app | PARCIAL | jl×8 bootstrap×2 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | BAIXO: leitura/lista |
| 88 | `job-templates` (routes/employer.php:136) | `employer/job_templates/index.blade.php` | employer.layouts.app | ANTIGO | bootstrap×28 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, modal genérico (além de confirmação) | MÉDIO: formulário |
| 89 | `/employer/job-templates/{id}/electia-profile` (routes/employer.php:141) | `employer/job_templates/ideal_profile.blade.php` | employer.layouts.app | ANTIGO | bootstrap×10 | Field, Button, Card | select/multiselect, textarea, checkbox/rádio/switch, editor rico | MÉDIO: formulário |
| 90 | `followers` (routes/employer.php:156) | `employer/followers/index.blade.php` | employer.layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | BAIXO: leitura/lista |
| 91 | `manage-subscription` (routes/employer.php:159) | `pricing/index.blade.php` | employer.layouts.app | PARCIAL | jl×36 bootstrap×3 | Field, Button, ConfirmDialog, Card | textarea, modal genérico (além de confirmação) | ALTO: pagamento/plano |
| 92 | `transactions` (routes/employer.php:160) | `transactions/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | ALTO: pagamento/plano |
| 93 | `payment-method/{plan}` (routes/employer.php:162) | `pricing/payment_methods.blade.php` | employer.layouts.app | ANTIGO | bootstrap×3 | Button, Card | — | ALTO: pagamento/plano |
| 94 | `failed-payment` (routes/employer.php:169) | `transactions/failed_payments.blade.php` | employer.layouts.app | ANTIGO | bootstrap×2 | Button, Card | — | ALTO: pagamento/plano |

### prestador — 5 telas (PILOTO 0, PARCIAL 0, ANTIGO 5)

| # | Rota (arquivo:linha) | View | Layout | Estado | Sinais medidos | Contratos que servem | Falta no DS | Risco |
|---|---|---|---|---|---|---|---|---|
| 95 | `/` (routes/autonomo.php:70) | `front_web/prestador/activate.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×9 | Field, Button, StatCard, Card | textarea, checkbox/rádio/switch | BAIXO: leitura/lista |
| 96 | `/` (routes/autonomo.php:79) | `front_web/prestador/dashboard.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×9 | Field, Button, StatCard, Card | paginação | MÉDIO: formulário |
| 97 | `/ficha` (routes/autonomo.php:81) | `front_web/prestador/edit.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×12 | Field, Button, Card | textarea, checkbox/rádio/switch, upload | ALTO: formulário com regra de negócio |
| 98 | `/anuncios/novo` (routes/autonomo.php:84) | `front_web/prestador/service_ad_wizard.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×20 | Field, Button, Card | select/multiselect, textarea, checkbox/rádio/switch, upload, passos | ALTO: formulário com regra de negócio |
| 99 | `/anuncios/{serviceAd}/editar` (routes/autonomo.php:85) | `front_web/prestador/service_ad_wizard.blade.php` | front_web.layouts.app | ANTIGO | bootstrap×20 | Field, Button, Card | select/multiselect, textarea, checkbox/rádio/switch, upload, passos | ALTO: formulário com regra de negócio |

### admin — 102 telas (PILOTO 0, PARCIAL 9, ANTIGO 93)

| # | Rota (arquivo:linha) | View | Layout | Estado | Sinais medidos | Contratos que servem | Falta no DS | Risco |
|---|---|---|---|---|---|---|---|---|
| 100 | `acoes` (routes/admin.php:86) | `actions/admin/index.blade.php` | layouts.app | ANTIGO | bootstrap×14 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | MÉDIO: formulário |
| 101 | `acoes/create` (routes/admin.php:87) | `actions/admin/create.blade.php` | layouts.app | ANTIGO | bootstrap×26 | Field, Button, Card | select/multiselect, textarea, checkbox/rádio/switch, upload | MÉDIO: upload |
| 102 | `acoes/inscricoes` (routes/admin.php:88) | `actions/admin/enrollments_index.blade.php` | layouts.app | ANTIGO | bootstrap×18 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | MÉDIO: formulário |
| 103 | `acoes/{tenantAction}/edit` (routes/admin.php:90) | `actions/admin/edit.blade.php` | layouts.app | ANTIGO | bootstrap×38 | Field, Button, Card | select/multiselect, textarea, checkbox/rádio/switch, upload | MÉDIO: upload |
| 104 | `acoes/{tenantAction}/inscricoes` (routes/admin.php:92) | `actions/admin/enrollments.blade.php` | layouts.app | ANTIGO | bootstrap×10 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | MÉDIO: formulário |
| 105 | `organizacoes` (routes/admin.php:102) | `organizations/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | BAIXO: leitura/lista |
| 106 | `organizacoes/create` (routes/admin.php:103) | `organizations/form.blade.php` | layouts.app | PARCIAL | --eds×3 bootstrap×11 | Field, Button, Card | select/multiselect, textarea, checkbox/rádio/switch, upload | MÉDIO: upload |
| 107 | `organizacoes/{organization}/edit` (routes/admin.php:105) | `organizations/form.blade.php` | layouts.app | PARCIAL | --eds×3 bootstrap×11 | Field, Button, Card | select/multiselect, textarea, checkbox/rádio/switch, upload | MÉDIO: upload |
| 108 | `organizacoes/{organization}` (routes/admin.php:106) | `organizations/show.blade.php` | layouts.app | ANTIGO | --eds×1 bootstrap×4 | Field, Button, Card | — | MÉDIO: formulário |
| 109 | `campanhas` (routes/admin.php:115) | `talent_campaigns/index.blade.php` | layouts.app | ANTIGO | bootstrap×9 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | MÉDIO: formulário |
| 110 | `caixa-de-entrada` (routes/admin.php:122) | `talent_inbox/index.blade.php` | layouts.app | ANTIGO | bootstrap×12 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | ALTO: pagamento/plano |
| 111 | `atendimento` (routes/admin.php:134) | `actions/attendance/index.blade.php` | layouts.app | ANTIGO | bootstrap×23 | Field, Button, Card | editor rico | MÉDIO: formulário |
| 112 | `atendimento/pessoas/{user}/editar` (routes/admin.php:137) | `actions/attendance/edit.blade.php` | layouts.app | ANTIGO | bootstrap×30 | Field, Button, Card | select/multiselect, textarea, checkbox/rádio/switch, data | MÉDIO: formulário |
| 113 | `/dashboard` (routes/admin.php:196) | `dashboard/index.blade.php` | layouts.app | PARCIAL | jl×29 bootstrap×9 | Field, Button, DataTable, StatusBadge, EmptyState, StatCard, Card | select/multiselect, data | ALTO: pagamento/plano |
| 114 | `capital-humano` (routes/admin.php:197) | `observatorio/capital-humano.blade.php` | layouts.app | ANTIGO | jl×1 bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, StatCard, Card | select/multiselect, data | ALTO: pagamento/plano |
| 115 | `observatorio/vagas` (routes/admin.php:198) | `observatorio/vagas.blade.php` | layouts.app | PARCIAL | jl×6 bootstrap×4 | Field, Button, DataTable, StatusBadge, EmptyState, StatCard, Card | select/multiselect, data | BAIXO: leitura/lista |
| 116 | `observatorio/empresas` (routes/admin.php:199) | `observatorio/empresas.blade.php` | layouts.app | ANTIGO | jl×4 bootstrap×4 | Field, Button, StatCard, Card | select/multiselect, data | BAIXO: leitura/lista |
| 117 | `observatorio/funis` (routes/admin.php:200) | `observatorio/funis.blade.php` | layouts.app | ANTIGO | jl×4 bootstrap×4 | Field, Button, StatCard, Card | select/multiselect, data | BAIXO: leitura/lista |
| 118 | `observatorio/territorio` (routes/admin.php:201) | `observatorio/territorio.blade.php` | layouts.app | ANTIGO | jl×3 bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, StatCard, Card | select/multiselect, data | ALTO: pagamento/plano |
| 119 | `observatorio/rankings` (routes/admin.php:202) | `observatorio/rankings.blade.php` | layouts.app | PARCIAL | jl×13 bootstrap×4 | Field, Button, StatCard, Card | select/multiselect, data | BAIXO: leitura/lista |
| 120 | `talent-bank` (routes/admin.php:209) | `talent_bank/index.blade.php` | layouts.app | ANTIGO | bootstrap×1 | Button, Card | checkbox/rádio/switch | BAIXO: leitura/lista |
| 121 | `resumes` (routes/admin.php:211) | `resumes/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | modal genérico (além de confirmação) | BAIXO: leitura/lista |
| 122 | `employers` (routes/admin.php:214) | `companies/index.blade.php` | layouts.app | PARCIAL | jl×5 bootstrap×3 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | select/multiselect, editor rico, modal genérico (além de confirmação) | BAIXO: leitura/lista |
| 123 | `employers/create` (routes/admin.php:215) | `companies/create.blade.php` | layouts.app | ANTIGO | bootstrap×50 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, upload, editor rico, modal genérico (além de confirmação) | ALTO: formulário com regra de negócio |
| 124 | `employers/{company}` (routes/admin.php:217) | `companies/show.blade.php` | layouts.app | ANTIGO | bootstrap×3 | Button, Card | — | BAIXO: leitura/lista |
| 125 | `employers/{company}/edit` (routes/admin.php:218) | `companies/edit.blade.php` | layouts.app | ANTIGO | bootstrap×53 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, upload, editor rico, modal genérico (além de confirmação) | ALTO: formulário com regra de negócio |
| 126 | `jobs` (routes/admin.php:234) | `jobs/index.blade.php` | layouts.app | PARCIAL | jl×5 bootstrap×7 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, modal genérico (além de confirmação) | MÉDIO: formulário |
| 127 | `jobs/create` (routes/admin.php:235) | `jobs/create.blade.php` | layouts.app | ANTIGO | bootstrap×60 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, upload, data, editor rico, modal genérico (além de confirmação) | ALTO: formulário com regra de negócio |
| 128 | `jobs/{job}/edit` (routes/admin.php:237) | `jobs/edit.blade.php` | layouts.app | ANTIGO | bootstrap×60 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, upload, data, editor rico, modal genérico (além de confirmação) | ALTO: formulário com regra de negócio |
| 129 | `jobs/{job}` (routes/admin.php:239) | `jobs/show.blade.php` | layouts.app | ANTIGO | bootstrap×3 | Button, Card | — | BAIXO: leitura/lista |
| 130 | `pending-jobs` (routes/admin.php:247) | `pending_jobs/index.blade.php` | layouts.app | ANTIGO | bootstrap×3 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | textarea, modal genérico (além de confirmação) | BAIXO: leitura/lista |
| 131 | `expired-jobs` (routes/admin.php:251) | `job_expired/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | BAIXO: leitura/lista |
| 132 | `candidates` (routes/admin.php:253) | `candidates/index.blade.php` | layouts.app | PARCIAL | jl×31 | Button, DataTable, StatusBadge, EmptyState, Card | abas | BAIXO: leitura/lista |
| 133 | `candidates/create` (routes/admin.php:254) | `candidates/create.blade.php` | layouts.app | ANTIGO | bootstrap×91 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, upload, editor rico, modal genérico (além de confirmação) | ALTO: formulário com regra de negócio |
| 134 | `candidates/{candidate}/edit` (routes/admin.php:256) | `candidates/edit.blade.php` | layouts.app | ANTIGO | bootstrap×89 | Field, Button, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, upload, editor rico, modal genérico (além de confirmação) | ALTO: formulário com regra de negócio |
| 135 | `candidates/{candidate}` (routes/admin.php:257) | `candidates/show.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, Card | upload | MÉDIO: upload |
| 136 | `reported-jobs` (routes/admin.php:266) | `employer/jobs/reported_jobs.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | modal genérico (além de confirmação) | BAIXO: admin pouco usado (CRUD simples) |
| 137 | `reported-employers` (routes/admin.php:269) | `employer/companies/reported_companies.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | modal genérico (além de confirmação) | BAIXO: admin pouco usado (CRUD simples) |
| 138 | `reported-candidates` (routes/admin.php:275) | `candidate/reported_candidate/reported_candidates.blade.php` | layouts.app | PARCIAL | jl×9 --eds×2 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | modal genérico (além de confirmação) | BAIXO: admin pouco usado (CRUD simples) |
| 139 | `ongoing-candidates` (routes/admin.php:281) | `selected_candidate/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | BAIXO: leitura/lista |
| 140 | `pre-selected-candidates` (routes/admin.php:282) | `selected_candidate/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | BAIXO: leitura/lista |
| 141 | `forwarded-candidates` (routes/admin.php:283) | `selected_candidate/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | BAIXO: leitura/lista |
| 142 | `selected-candidates` (routes/admin.php:284) | `selected_candidate/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | BAIXO: leitura/lista |
| 143 | `subscribers` (routes/admin.php:334) | `subscribers/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | BAIXO: admin pouco usado (CRUD simples) |
| 144 | `job-categories` (routes/admin.php:342) | `job_categories/index.blade.php` | layouts.app | ANTIGO | bootstrap×10 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | textarea, editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 145 | `settings (geral)` (routes/admin.php:351) | `settings/general.blade.php` | settings.index | ANTIGO | bootstrap×16 | Field, Button, Card | select/multiselect, textarea, checkbox/rádio/switch, upload | MÉDIO: configuração do portal |
| 146 | `settings?section=front_office_details` (routes/admin.php:351) | `settings/front_office_details.blade.php` | settings.index | ANTIGO | bootstrap×6 | Field, Button, Card | textarea | MÉDIO: configuração do portal |
| 147 | `settings?section=social_settings` (routes/admin.php:351) | `settings/social_settings.blade.php` | settings.index | ANTIGO | bootstrap×7 | Field, Button, Card | — | MÉDIO: configuração do portal |
| 148 | `settings?section=about_us` (routes/admin.php:351) | `settings/about_us.blade.php` | settings.index | ANTIGO | bootstrap×4 | Field, Button, Card | textarea | MÉDIO: configuração do portal |
| 149 | `taxonomias` (routes/admin.php:359) | `tenant_taxonomy/index.blade.php` | layouts.app | ANTIGO | bootstrap×14 | Field, Button, Card | select/multiselect, checkbox/rádio/switch | MÉDIO: formulário |
| 150 | `privacy-policy` (routes/admin.php:362) | `privacy_policy/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, Card | textarea, editor rico | ALTO: texto legal/LGPD (não mudar texto) |
| 151 | `company-sizes` (routes/admin.php:366) | `company_sizes/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 152 | `skills` (routes/admin.php:373) | `skills/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 153 | `pending-skills` (routes/admin.php:381) | `pending-skills/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | BAIXO: admin pouco usado (CRUD simples) |
| 154 | `marital-status` (routes/admin.php:390) | `marital_status/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 155 | `salary-periods` (routes/admin.php:407) | `salary_periods/index.blade.php` | layouts.app | ANTIGO | bootstrap×8 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | textarea, editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 156 | `job-shifts` (routes/admin.php:415) | `job_shifts/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 157 | `degree-levels` (routes/admin.php:423) | `required_degree_levels/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | modal genérico (além de confirmação) | MÉDIO: formulário |
| 158 | `job-tags` (routes/admin.php:444) | `job_tags/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 159 | `job-types` (routes/admin.php:452) | `job_types/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 160 | `ownership-types` (routes/admin.php:460) | `ownership_types/index.blade.php` | layouts.app | ANTIGO | bootstrap×8 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | textarea, modal genérico (além de confirmação) | MÉDIO: formulário |
| 161 | `industries` (routes/admin.php:468) | `industries/index.blade.php` | layouts.app | ANTIGO | bootstrap×10 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | textarea, editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 162 | `admins` (routes/admin.php:476) | `admins/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | editor rico | BAIXO: leitura/lista |
| 163 | `admins/create` (routes/admin.php:477) | `admins/create.blade.php` | layouts.app | ANTIGO | bootstrap×13 | Field, Button, Card | select/multiselect, upload | MÉDIO: upload |
| 164 | `admins/{user}/edit` (routes/admin.php:479) | `admins/edit.blade.php` | layouts.app | ANTIGO | bootstrap×13 | Field, Button, Card | select/multiselect, upload | MÉDIO: upload |
| 165 | `languages` (routes/admin.php:485) | `languages/index.blade.php` | layouts.app | ANTIGO | bootstrap×8 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | modal genérico (além de confirmação) | MÉDIO: formulário |
| 166 | `functional-areas` (routes/admin.php:494) | `functional_areas/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | modal genérico (além de confirmação) | MÉDIO: formulário |
| 167 | `career-levels` (routes/admin.php:510) | `career_levels/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | modal genérico (além de confirmação) | MÉDIO: formulário |
| 168 | `salary-currencies` (routes/admin.php:530) | `salary_currencies/index.blade.php` | layouts.app | ANTIGO | bootstrap×10 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | modal genérico (além de confirmação) | MÉDIO: formulário |
| 169 | `testimonials` (routes/admin.php:551) | `testimonial/index.blade.php` | layouts.app | ANTIGO | bootstrap×9 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | upload, editor rico, modal genérico (além de confirmação) | MÉDIO: upload |
| 170 | `image-sliders` (routes/admin.php:561) | `image_sliders/index.blade.php` | layouts.app | ANTIGO | bootstrap×13 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | textarea, checkbox/rádio/switch, upload, editor rico, modal genérico (além de confirmação) | MÉDIO: upload |
| 171 | `header-sliders` (routes/admin.php:579) | `header_sliders/index.blade.php` | layouts.app | ANTIGO | bootstrap×5 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | checkbox/rádio/switch, upload, modal genérico (além de confirmação) | MÉDIO: upload |
| 172 | `branding-sliders` (routes/admin.php:595) | `branding_sliders/index.blade.php` | layouts.app | ANTIGO | bootstrap×7 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | checkbox/rádio/switch, upload, modal genérico (além de confirmação) | MÉDIO: upload |
| 173 | `noticeboards` (routes/admin.php:616) | `noticeboards/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | checkbox/rádio/switch, editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 174 | `cms-services` (routes/admin.php:625) | `cms_services/index.blade.php` | layouts.app | ANTIGO | bootstrap×4 | Field, Button, Card | textarea, checkbox/rádio/switch, upload | MÉDIO: upload |
| 175 | `cms-about-us` (routes/admin.php:626) | `cms_services/about-us.blade.php` | layouts.app | ANTIGO | bootstrap×8 | Field, Button, Card | textarea, upload | MÉDIO: upload |
| 176 | `faqs` (routes/admin.php:630) | `faqs/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 177 | `inquires` (routes/admin.php:638) | `inquires/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | modal genérico (além de confirmação) | BAIXO: admin pouco usado (CRUD simples) |
| 178 | `inquires/{inquiry}` (routes/admin.php:639) | `inquires/show.blade.php` | layouts.app | ANTIGO | bootstrap×2 | Button, Card | — | BAIXO: admin pouco usado (CRUD simples) |
| 179 | `post-categories` (routes/admin.php:643) | `blog_categories/index.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 180 | `posts` (routes/admin.php:651) | `blogs/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | BAIXO: leitura/lista |
| 181 | `posts/create` (routes/admin.php:652) | `blogs/create.blade.php` | layouts.app | ANTIGO | bootstrap×11 | Field, Button, Card | select/multiselect, textarea, upload | MÉDIO: upload |
| 182 | `posts/{post}` (routes/admin.php:654) | `blogs/show.blade.php` | layouts.app | ANTIGO | bootstrap×3 | Button, Card | — | BAIXO: leitura/lista |
| 183 | `posts/{post}/edit` (routes/admin.php:655) | `blogs/edit.blade.php` | layouts.app | ANTIGO | bootstrap×11 | Field, Button, Card | select/multiselect, textarea, upload | MÉDIO: upload |
| 184 | `post-comments` (routes/admin.php:662) | `post_comments/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | modal genérico (além de confirmação) | BAIXO: admin pouco usado (CRUD simples) |
| 185 | `plans` (routes/admin.php:670) | `plans/index.blade.php` | layouts.app | ANTIGO | bootstrap×18 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | select/multiselect, textarea, checkbox/rádio/switch, modal genérico (além de confirmação) | ALTO: pagamento/plano |
| 186 | `transactions` (routes/admin.php:678) | `transactions/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | ALTO: pagamento/plano |
| 187 | `front-settings` (routes/admin.php:682) | `front_settings/index.blade.php` | layouts.app | ANTIGO | bootstrap×11 | Field, Button, Card | select/multiselect, checkbox/rádio/switch, upload | MÉDIO: configuração do portal |
| 188 | `notification-settings` (routes/admin.php:695) | `notification_settings/index.blade.php` | layouts.app | ANTIGO | bootstrap×13 | Field, Button, Card | checkbox/rádio/switch | MÉDIO: configuração do portal |
| 189 | `countries` (routes/admin.php:706) | `countries/index.blade.php` | layouts.app | ANTIGO | bootstrap×10 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | modal genérico (além de confirmação) | MÉDIO: formulário |
| 190 | `states` (routes/admin.php:713) | `states/index.blade.php` | layouts.app | ANTIGO | bootstrap×8 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | select/multiselect, modal genérico (além de confirmação) | MÉDIO: formulário |
| 191 | `cities` (routes/admin.php:720) | `cities/index.blade.php` | layouts.app | ANTIGO | bootstrap×8 | Field, Button, DataTable, StatusBadge, EmptyState, ConfirmDialog, Card | select/multiselect, editor rico, modal genérico (além de confirmação) | MÉDIO: formulário |
| 192 | `translation-manager` (routes/admin.php:727) | `translation-manager/index.blade.php` | layouts.app | ANTIGO | bootstrap×10 | Field, Button, ConfirmDialog, Card | select/multiselect, modal genérico (além de confirmação) | MÉDIO: configuração do portal |
| 193 | `email-template` (routes/admin.php:757) | `email_templates/index.blade.php` | layouts.app | ANTIGO | sem classe DS/legada contada | Button, DataTable, StatusBadge, EmptyState, Card | — | MÉDIO: configuração do portal |
| 194 | `email-template/{emailTemplate}/edit` (routes/admin.php:758) | `email_templates/edit.blade.php` | layouts.app | ANTIGO | bootstrap×6 | Button, Card | editor rico | MÉDIO: configuração do portal |
| 195 | `/` (routes/autonomo.php:102) | `autonomo/admin/mural/index.blade.php` | layouts.app | ANTIGO | --eds×1 bootstrap×24 | Field, Button, DataTable, StatusBadge, EmptyState, StatCard, Card | checkbox/rádio/switch | MÉDIO: formulário |
| 196 | `/banners` (routes/autonomo.php:104) | `autonomo/admin/mural/banners.blade.php` | layouts.app | ANTIGO | bootstrap×9 | Field, Button, Card | textarea, checkbox/rádio/switch, upload | MÉDIO: upload |
| 197 | `/anuncios` (routes/autonomo.php:107) | `autonomo/admin/mural/ads.blade.php` | layouts.app | ANTIGO | bootstrap×8 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | ALTO: formulário com regra de negócio |
| 198 | `/prestadores` (routes/autonomo.php:114) | `autonomo/admin/providers/index.blade.php` | layouts.app | ANTIGO | bootstrap×9 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | MÉDIO: formulário |
| 199 | `/prestadores/{provider}/editar` (routes/autonomo.php:115) | `autonomo/admin/providers/edit.blade.php` | layouts.app | ANTIGO | bootstrap×15 | Field, Button, Card | textarea, checkbox/rádio/switch, upload | MÉDIO: upload |
| 200 | `/` (routes/autonomo.php:135) | `autonomo/admin/catalog/index.blade.php` | layouts.app | ANTIGO | bootstrap×13 | Field, Button, StatCard, Card | select/multiselect | MÉDIO: formulário |
| 201 | `/` (routes/autonomo.php:154) | `autonomo/admin/product-catalog/index.blade.php` | layouts.app | ANTIGO | bootstrap×11 | Field, Button, StatCard, Card | select/multiselect | MÉDIO: formulário |

### superadmin — 14 telas (PILOTO 0, PARCIAL 12, ANTIGO 2)

| # | Rota (arquivo:linha) | View | Layout | Estado | Sinais medidos | Contratos que servem | Falta no DS | Risco |
|---|---|---|---|---|---|---|---|---|
| 202 | `settings?section=env_setting` (routes/admin.php:351) | `settings/env_setting.blade.php` | settings.index | ANTIGO | bootstrap×14 | Field, Button, Card | checkbox/rádio/switch | ALTO: pagamento/plano |
| 203 | `consumo-ia` (routes/superadmin.php:26) | `superadmin/tenants/ai-usage.blade.php` | layouts.superadmin | ANTIGO | jl×1 | Button, DataTable, StatusBadge, EmptyState, StatCard, Card | — | MÉDIO: configuração do portal |
| 204 | `tenants` (routes/superadmin.php:27) | `superadmin/tenants/index.blade.php` | layouts.superadmin | PARCIAL | jl×23 --eds×6 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | MÉDIO: configuração do portal |
| 205 | `tenants/create` (routes/superadmin.php:28) | `superadmin/tenants/create.blade.php` | layouts.superadmin | PARCIAL | jl×35 --eds×3 | Field, Button, Card | select/multiselect | MÉDIO: configuração do portal |
| 206 | `tenants/{tenant}` (routes/superadmin.php:30) | `superadmin/tenants/show.blade.php` | layouts.superadmin | PARCIAL | jl×22 --eds×20 | Field, Button, DataTable, StatusBadge, EmptyState, StatCard, Card | — | MÉDIO: configuração do portal |
| 207 | `tenants/{tenant}/edit` (routes/superadmin.php:31) | `superadmin/tenants/edit.blade.php` | layouts.superadmin | PARCIAL | jl×41 --eds×5 | Field, Button, Card | select/multiselect, checkbox/rádio/switch | MÉDIO: configuração do portal |
| 208 | `tenants/{tenant}/classes` (routes/superadmin.php:34) | `superadmin/tenants/classes.blade.php` | layouts.superadmin | PARCIAL | jl×10 --eds×6 | Field, Button, Card | checkbox/rádio/switch | MÉDIO: configuração do portal |
| 209 | `classes` (routes/superadmin.php:37) | `superadmin/taxonomy_classes/index.blade.php` | layouts.superadmin | PARCIAL | jl×10 --eds×3 | Button, Card | — | MÉDIO: configuração do portal |
| 210 | `classes/create` (routes/superadmin.php:38) | `superadmin/taxonomy_classes/form.blade.php` | layouts.superadmin | PARCIAL | jl×31 --eds×6 | Field, Button, Card | select/multiselect | MÉDIO: configuração do portal |
| 211 | `classes/{taxonomyClass}/edit` (routes/superadmin.php:40) | `superadmin/taxonomy_classes/form.blade.php` | layouts.superadmin | PARCIAL | jl×31 --eds×6 | Field, Button, Card | select/multiselect | MÉDIO: configuração do portal |
| 212 | `empresas` (routes/superadmin.php:50) | `superadmin/data/index.blade.php` | layouts.superadmin | PARCIAL | jl×17 --eds×3 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | MÉDIO: configuração do portal |
| 213 | `candidatos` (routes/superadmin.php:51) | `superadmin/data/index.blade.php` | layouts.superadmin | PARCIAL | jl×17 --eds×3 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | MÉDIO: configuração do portal |
| 214 | `vagas` (routes/superadmin.php:52) | `superadmin/data/index.blade.php` | layouts.superadmin | PARCIAL | jl×17 --eds×3 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | MÉDIO: configuração do portal |
| 215 | `usuarios` (routes/superadmin.php:53) | `superadmin/data/index.blade.php` | layouts.superadmin | PARCIAL | jl×17 --eds×3 | Field, Button, DataTable, StatusBadge, EmptyState, Card | select/multiselect | MÉDIO: configuração do portal |

### todos — 4 telas (PILOTO 0, PARCIAL 0, ANTIGO 4)

| # | Rota (arquivo:linha) | View | Layout | Estado | Sinais medidos | Contratos que servem | Falta no DS | Risco |
|---|---|---|---|---|---|---|---|---|
| 216 | `erro 404` ((handler de exceção)) | `errors/404.blade.php` | (standalone) | ANTIGO | bootstrap×1 | Button, Card | — | BAIXO: leitura/lista |
| 217 | `erro 403` ((handler de exceção)) | `errors/403.blade.php` | (fragment) | ANTIGO | sem classe DS/legada contada | Button, Card | — | BAIXO: leitura/lista |
| 218 | `erro 500` ((handler de exceção)) | `errors/500.blade.php` | (fragment) | ANTIGO | sem classe DS/legada contada | Button, Card | — | BAIXO: leitura/lista |
| 219 | `erro 503` ((handler de exceção)) | `errors/503.blade.php` | (fragment) | ANTIGO | sem classe DS/legada contada | Button, Card | — | BAIXO: leitura/lista |
### 2.1 Consolidado do que falta no DS (217 telas fora do piloto)

| Lacuna (padrão sem contrato no DS) | Telas onde aparece | Impacto |
|---|---|---|
| **Field ampliado: select/multiselect** (inclui select2 e os chips de `public/js/emprega-ds/chips.js`) | 79 | bloqueia formulários de vaga, cadastro, perfil e quase todo o admin |
| **Field ampliado: checkbox, rádio, switch** | 59 | idem; termos de aceite no cadastro |
| **Field ampliado: textarea** | 58 | idem |
| **Modal genérico** (formulário dentro de diálogo; os 91 `admin-modal-*` citados em `ds/docs/adr/0004-contracts-adapters-pilot.md:24`) | 57 | o admin inteiro usa modal para criar e editar |
| **Upload de arquivo** (currículo, laudo, logo, banner) | 34 | currículo e captação; admin de CMS |
| **Editor rico** (quill e similares) | 32 | descrição da vaga, CMS e blog |
| **Paginação fora da DataTable** | 15 | listas públicas (vagas, cursos, ações, mural) |
| **Data** (flatpickr/datepicker) | 13 | agenda de entrevista, vaga, ações |
| **Abas** | 12 | configurações da empresa, home, perfil do candidato |
| **Passos (wizard)** | 3 | anúncio do prestador, cadastro |
| **Casca de navegação** (sidebar, header e rodapé dos 5 layouts) | todas | o catálogo tem `navigation`, `sidebar-overlay` e `header-float` só como famílias anteriores, sem contrato (`ds/catalog/manifest.yaml:146-235`) |

Pela regra do IMO, componente novo "vira `<x-rx-*>` fino, seguindo o contrato" (`imo/AGENTS.md:96`). Sem contrato, a tela fica em `.jl-*`. **Conclusão:** só as telas de lista, leitura e confirmação dá para migrar com os 8 contratos de hoje. Formulário de verdade depende de o DS publicar antes um **Field ampliado** (select, textarea, checkbox/rádio/switch), um **Modal genérico** e um **Upload**.

### 2.2 Risco das 217 telas fora do piloto

| Risco | Telas | Tipos |
|---|---|---|
| ALTO | 58 | pagamento e plano (Stripe), texto legal e LGPD, autenticação e cadastro, currículo e candidatura (upload e IA), formulários de vaga, empresa e candidato com regra de negócio |
| MÉDIO | 88 | configuração do portal e superadmin, upload em CMS, formulários menores |
| BAIXO | 71 | leitura e listas públicas; CRUD de cadastro auxiliar do admin (tipos de vaga, países, estados etc.), pouco usado |

## 3. Proposta de ondas (9 ondas, de 0 a 8; dentro de cada onda, PRs pequenas, uma tela ou família por PR)

Regras comuns a **todas** as ondas (de `imo/AGENTS.md:99-102` e ADR-0004):
- **Diff só em view, CSS e componente.** Nada de controller, rota, query, migration, nome de campo, `wire:model`, `data-*` ou classe usada por JS (decisão D-E3-2, `docs/qa/2026-11-13-ds-e3-piloto-inventario.md`).
- **Textos visíveis idênticos**, inclusive textos legais. Nenhuma rota nova ou renomeada. Permissões e visibilidade condicionadas iguais: ação indevida continua oculta.
- **Nenhum valor de token muda antes de 10/12.** `eds-root.css` e as cópias por SHA não se editam no IMO.
- **Prova de pronto em toda PR:**
  - capturas antes e depois em **390 px e 1440 px**, nos temas que a área já tem (empresa e candidato têm escuro: `candidate/layouts/app.blade.php:4-7`; o site também: `front_web/layouts/app.blade.php:9-17`), com massa sintética;
  - uma rota fora da onda sem diferença;
  - Tab e Shift+Tab, foco visível, contraste medido (≥4,5:1 no texto, ≥3:1 em borda e foco);
  - CI verde com o smoke MySQL; Revisor no SHA final; "merge N" do Marcos.
- **Pendência de ferramenta:** as capturas 320/768/1024/1440 do piloto foram feitas à mão e não estão versionadas (`docs/governance/STATUS.md:110`). Os testes `tests/Browser/*.cjs` não rodam no CI.

| Onda | Telas (nº) | Por que nesta ordem | Pronto quando (testes que já existem → teste novo) | Não pode mudar | Depende de |
|---|---|---|---|---|---|
| **0. Preparo, sem mudança visual** | nenhuma tela muda | destrava todas as outras | (a) **separar o escopo de componentes (`rx-pilot`) dos comportamentos do piloto**, hoje acoplados em `employer/layouts/app.blade.php:77-79,132-137`. Novo teste no padrão do `EscopoDoPilotoDsTest` provando que só as 2 telas do piloto carregam `piloto-*.js`. (b) Linkar `rx-pilot-aliases.css` e `rx-pilot.css` nos layouts de candidato, site, admin e auth. Inerte sem a classe. Prova: `RxPilotVendoredCopyTest` + teste novo de que nenhum `body` fora das ondas recebe `rx-pilot`, e capturas idênticas de 1 tela por layout. (c) Script de captura versionado (390/1440, claro/escuro) reaproveitando `tests/Browser/employer-lists.cjs`. (d) Catraca de convergência por área: contagem de `btn btn-`/`form-control`/`.jl-*` por layout. Hoje a catraca do CI só mede escopo, echo cru, schema e Livewire (`scripts/ci/DebtMetrics.php:26-30`); a E5 exige "catraca do IMO cai a cada lote" (`ds/docs/audits/2026-11-13-ds-auditoria/diagnostico-resultx-ds.md:329`) | nenhuma tela, nenhum texto | nada; **dá para fazer já** |
| **1. Empresa: listas irmãs do piloto** | 6: `/employer/candidates` (busca geral, já marcada como E5 no inventário E3), `/employer/etapas`, `/employer/job-templates`, `/employer/followers`, `/employer/equipe`, `/employer/jobs/{job}` | maior reuso: o adaptador já está no layout. Tabelas rappasoft, vazios, selos e botões secundários são o que o piloto provou | existentes: `EmployerCandidatosRobustezSmokeTest`, `CandidateListsAccessSmokeTest`, `ListagensCandidatosContextoSmokeTest`, `JobStageAssignmentSmokeTest`, `EtapasPersonalizadasPorPlanoSmokeTest`, `ConviteDeEquipeSchemaRealSmokeTest`, `CandidatosNoPainelTest`, `EtapasDaVagaOrdenaveisTest`, `ShellSegueOTemaTest`. **Mudar de propósito** `EscopoDoPilotoDsTest.php:67`, que hoje exige `employer.candidates` **fora** do escopo. Novo: teste de view por tela (botões secundários e de perigo em `<x-rx.button>`, como o `BotoesPilotoE3Test`) | botão primário fica como está até a v2.11.0; filtros, seleção em lote, permissões | **fechar a DS-10/DS-21** (ver §4); Onda 0 (a) |
| **2. v2.11.0 + primários** | as 2 do piloto + as 6 da Onda 1 + `/employer/dashboard` (StatCard) | o preenchimento do primário e o link com cara de botão só existem no DS `main`: `ds/adapters/css/pilot.scoped.css:22,25-27,34` contra a cópia do IMO `public/css/rx-pilot.css:25` (sem preenchimento); aliases novos `--accent-primary` e `--text-inverse` em `ds/brands/emprega-mais/tokens/pilot-aliases.css:3,24` | IMO-10/DS-17: recópia por SHA e `RxPilotVendoredCopyTest` com os SHAs novos. IMO-30b conforme `ds/contracts/button.yaml:58` (o painel do IMO cita `:49`, linha antiga). Existentes: `EmployerDashboardKpisTest`, `...ListsTest`, `...FunnelTest`, `...ChartsTest`, `...TimelineTest`, `RequerAtencaoDoRecrutadorViewTest`. Novo: captura do primário em marca clara e escura | CTA "Ver planos" conforme decisão da DS-17; texto do botão; ordem das ações | tag **v2.11.0** (a partir de 27/11, `ds/docs/STATUS.md:66,69`) |
| **3. Candidato logado: listas e leitura** | 8: `/candidate/dashboard`, `applied-jobs`, `favourite-jobs`, `favourite-companies`, `preferencias`, `job-alerts`, `selecoes/{candidatura}`, `/profile/summary` | público grande, risco baixo (pouco formulário), já é PARCIAL com `.jl-*` | existentes: `CandidateDashboardTest`, `AbaEmAndamentoSmokeTest`, `AcoesPendentesDoCandidatoSmokeTest`, `PreferenciasCandidatoSmokeTest`, `PreferenciasMultiplasSmokeTest`, `JobAlertRecipientsSmokeTest`, `SelecaoDeCurriculoNoBancoDeTalentosSmokeTest`, `TelasCandidatoEListaSmokeTest:245-248` (cabeçalho do candidato). Novo: teste de escopo no layout do candidato | ações de candidatura (desistir, confirmar horário: `TelasCandidatoEListaSmokeTest:230-236`), textos | Onda 0 (b); idealmente depois da Onda 2, para não refazer primários |
| **4. Site público: leitura** | ~30: home, `/search-jobs`, `/job-details`, empresas, carreira (`/{companySlug}`), categorias, sobre, blog (3), cursos (2), ações (2), editais (2), concursos, instituições e associações (4), mural de serviços (5), banco de talentos, MEI | maior visibilidade; sem regra de negócio | existentes: `PublicRoutesSmokeTest` (lista em `:29-42`), `CoresDoPortalNasTelasSmokeTest`, `LogoDoPortalSmokeTest`, `AreasRecolhidasHomeSmokeTest`, `CategoriasPopularesAbasHomeSmokeTest`, `BannersDaHomeSmokeTest`, `MenuCursosServicosSmokeTest`, `NoindexAgroSmokeTest`, `VagasExternasSmokeTest`, `ProdutosNoMuralSmokeTest`; navegador `home-proporcoes`, `home-categorias-abas`, `gradiente-portal`. Novo: capturas com 3 cores de portal (clara, média, escura) | SEO (títulos, `noindex`), textos, gradiente do portal, ordem das áreas da home | Onda 0 (b) e Onda 2. **Superfícies pintadas com a cor do portal** (CTA, faixa) ficam como estão até 10/12: contraste do white-label (IMO-08, 49 pares abaixo) |
| **5. Empresa: formulários** | 6: `jobs/create`, `jobs/{job}/edit`, `jobs/{job}/divulgar`, agenda `applications/{id}/slots`, perfil ideal Electia, `configuracoes` (abas) | regra de negócio, select2, flatpickr, editor rico | existentes: `EmployerJobCreateSmokeTest`, `EmployerJobEditSmokeTest`, `FormularioDaVagaDsTest`, `FormularioDaVagaAjustesB21Test`, `JobSocialShareSmokeTest`, `AgendaDeEntrevistaSmokeTest`, `ElectiaCredentialSmokeTest`, `ConfiguracoesDoEmpregadorTest`, `PerfilDaEmpresaDsTest`; navegador `share-job-art`, `employer-profile-save`. Novo: erro por campo (`aria-describedby`, como a IMO-31) em cada formulário | validação, campos, limites do plano, publicação | **contratos novos no DS** (Field ampliado, Abas, Data, Editor) + release seguinte à v2.11.0 (D7: 1 versão a cada 2 semanas, `ds/docs/adr/0005-governance-propagation-decisions.md:20`) |
| **6. Candidato e acesso: formulários** | ~20: perfil (geral, carreira, currículo e laudos, montador de CV), `apply-job`, `revisar-resumo`, `completar-cadastro`, 4 logins, 4 rotas de cadastro (candidato ×2, empresa, prestador), 4 telas de senha e WhatsApp, `/email/verify`, `/password/confirm` | funil de entrada; upload e IA | existentes: `CarregarCurriculoSmokeTest`, `CarregarCurriculoComIASmokeTest`, `RevisarResumoDoArquivoSmokeTest`, `CepDoPerfilSmokeTest`, `SecaoDeLaudosSmokeTest`, `LaudoNaoSaiComoCurriculoSmokeTest`, `LoginReturnUrlSmokeTest`, `LinkRecuperacaoPorCpfSmokeTest`, `GoogleEntraEmQualquerPortalSmokeTest`, `EmailVerifiedDefaultSmokeTest`; navegador `resumo-upload`, `perfil-resumo-visual`, `fluxo2-candidatura`, `verificacao-dois-canais`. Novo: `layouts/auth` com o parcial do DS (lacuna do login), com teste | limite de tentativas, CPF, login social, mensagens de erro e segurança (não revelar conta existente), textos de aceite | Onda 5 (mesmos contratos) + **contrato de Upload** |
| **7. Fluxos legais, de pagamento e de captação** | 17: `/decisoes/{pedido}` e indisponível (HTML próprio com CSS inline: `consentimento/decisao.blade.php:3-4`), `/privacy-policy-list`, `/terms-conditions-list`, `/pricing`, `manage-subscription`, `transactions`, `payment-method/{plan}` (Stripe), `failed-payment`, `/curriculo` e `/vagas/{id}/candidatar-sem-conta`, `/curriculo/{conta,confirmar,gerir}`, `/convites/{convite}`, `/conta-criada`, `/confirmar-conta` | maior risco jurídico e financeiro; só depois de o padrão estar maduro | existentes: `PedidoDeDecisaoSmokeTest`, `PedidoDeDecisaoConcorrenciaSmokeTest`, `ConsentimentoContextoSmokeTest`, `RegistroDeConsentimentoSmokeTest`, `PublicarTextosLegaisSmokeTest`, `CaptacaoPublica{Fundacao,Jornada,ComIA,TenantLink}SmokeTest`, `ConviteDeCurriculoPublicoSmokeTest`, `PlanoDeEntradaSmokeTest`, `CatalogoDeRecursosDosPlanosSmokeTest`, `CargosPorPlanoSmokeTest`; navegador `captacao-resumo-publico`, `curriculos-sem-cadastro`, `fluxo1-captacao-conta`. Novo: comparar o texto renderizado antes e depois (hash do texto visível) nas telas legais | **texto legal palavra por palavra**, versões de termo, botões aceitar e recusar, fluxo do Stripe, links assinados | Ondas 5 e 6; parecer do @architect para o pagamento |
| **8. Admin, superadmin, prestador e erros** | 125: admin do portal (102, incluindo mural), superadmin (14), painel do prestador (5), erros (4) | mais telas e menos uso. Exige a **pele global** de tabela rappasoft e dos modais, que a ADR-0004 só libera com captura por amostra de cada área (`ds/docs/adr/0004-contracts-adapters-pilot.md:24`) | existentes: `AdminJobEditSmokeTest`, `AdminEncerraVagaComMotivoSmokeTest`, `AdminTabelasAutorDeOutroTenantSmokeTest`, `ObservatorioFase0SmokeTest`, `CapitalHumanoMySqlSmokeTest`, `OrganizationManagementMySqlSmokeTest`, `CampanhaDeCaptacaoSmokeTest`, `CaixaDeEntradaDeCurriculosSmokeTest`, `RecursosDoPlanoNoAdminSmokeTest`, `ModeloDeEmailSoSuperAdminSmokeTest`, `SuperadminTenantEditSmokeTest`, `TenantProvisioningSmokeTest`, `PortalNaoEncontradoSmokeTest`; navegador `mural-moderacao`. Novo: amostra de captura por família (CRUD auxiliar, CMS, cadastro de vaga, empresa e candidato, observatório) | dados e permissões por portal; `env_setting` só para superadmin (`SettingController.php:43`) | Modal genérico + Field ampliado + Upload no DS; subondas por família (CRUD auxiliar primeiro, BAIXO risco) |

Fora das ondas (decidir depois): `/employer/employer` (`routes/employer.php:32-34`, rota "TODO" que renderiza só o layout) e o fragmento `get-cv-template`.

Desvio de ordem para o @ux/@architect decidirem (não é decisão do Marcos): o diagnóstico do DS manda a E5 na ordem **candidato → empregador → admin** (`diagnostico-resultx-ds.md:329`). Proponho a empresa antes (Ondas 1–2) porque o adaptador já está no layout dela e o piloto provou as mesmas peças. Isso dispensa PR de layout e tem menor risco. Se preferirem seguir o documento, troque as Ondas 1 e 3. A Onda 0 (b) já cobre o layout do candidato.

## 4. Bloqueios, dependências e o que dá para fazer já

| Bloqueio | Afeta | Evidência | O que destrava |
|---|---|---|---|
| **E5 formalmente bloqueada:** DS-21 "E5 — ampliação do IMO" está BLOQUEADO, dependente da DS-10 (piloto), que segue EM ANDAMENTO com as linhas 7, 8, 10, 11 e 20 da matriz sem verificação | Ondas 1 a 8 (toda ampliação) | `ds/docs/STATUS.md:62,73`; `imo/docs/governance/STATUS.md:51`; regra "pele global só depois do piloto aprovado" em `imo/AGENTS.md:101` (o aceite visual de 14/11, IMO-05, existe, mas o fechamento da IMO-04 não) | verificar as 5 linhas e fechar a DS-10, ou decisão do @architect de liberar a Onda 1 com a DS-10 aberta. **Dá para começar a verificação já** |
| **IMO-30b → DS-17 (v2.11.0)** | primários e links com cara de botão (Onda 2 em diante) | `imo/docs/governance/STATUS.md:78`; DS-29 já concluída (`ds/docs/STATUS.md:81`, #129), então a pendência "PR do contrato de link antes da tag" do painel do IMO está vencida; DS-14 corta a partir de 27/11 (`ds/docs/STATUS.md:66`); `package.json` do DS ainda em `2.10.0` | a tag. A D7 permite release fora do ritmo para correção de acessibilidade (`adr/0005...md:20`); usar isso para o primário é decisão do Supervisor DS |
| **IMO-32 cores** (texto sobre a cor da marca; vermelho de confirmar 3,94:1) e IMO-07/08/DS-18/19 | toda superfície pintada com a cor do portal (CTA, faixas da home, SweetAlert de exclusão) | `imo/docs/governance/STATUS.md:54-55,80`; `docs/qa/2026-11-13-ds-e3-piloto-avaliacao.md:53` | **10/12** (janela de recurso do EditalHub). Até lá, migrar a estrutura e manter os preenchimentos de marca atuais |
| **Contratos inexistentes no DS** (Field ampliado, Modal genérico, Upload, Abas, Data, Editor, Paginação, casca de navegação) | Ondas 5 a 8 | §2.1; `ds/contracts/field.yaml:7-9` | PRs de contrato no DS + release; cadência D7 = **pelo menos 1 release depois da v2.11.0** (não antes de ~2 semanas após ela) |
| **Adaptador só no layout da empresa** | Ondas 3, 4, 6, 7, 8 | §0 | Onda 0 (b) |
| **Escopo acoplado aos JS do piloto** | toda ampliação | `employer/layouts/app.blade.php:77-79,132-137`; `EscopoDoPilotoDsTest.php:93-99` | Onda 0 (a) |
| **Superadmin sem `pintura-de-marca`** | Onda 8 (superadmin) | o parcial é incluído em candidato, site, empresa, auth e admin, não em `layouts/superadmin.blade.php` (grep). Os aliases da v2.11.0 caem no fallback `--eds-indigo-dark` (`pilot-aliases.css:3`) | decidir na Onda 8 (o superadmin não é white-label: provavelmente aceitável, **não confirmado**) |

**Dá para fazer já (sem release do DS e sem mexer em valor de token):**
1. Onda 0 inteira: separar escopo e comportamentos, linkar o adaptador inerte nos outros layouts, script de captura versionado, catraca de convergência por área.
2. Verificar as linhas 7, 8, 10, 11 e 20 da matriz para fechar a DS-10 e destravar a DS-21.
3. Atualizar o painel do IMO: IMO-31 mesclada (#931); pendência da DS-29 já resolvida. Só documentação.
4. No DS, em paralelo: abrir os contratos de **Field ampliado** e **Modal genérico**, que destravam o maior número de telas (79 e 57), para entrarem no release seguinte à v2.11.0.
5. Depois da DS-10 fechada: Onda 1 com botões secundários e de perigo, mantendo o primário como está (mesmo padrão da IMO-30a).

## 5. Não confirmado

- Deploy da #931 em produção e o arquivo publicado igual ao do repositório: só li o painel do DS (`ds/docs/STATUS.md:62`). **Não confirmado.**
- Existência da tag v2.11.0 ou de outras tags: as cópias são rasas (1 commit), `git tag` vazio. O `package.json` diz 2.10.0. **Não confirmado** se já existe tag no remoto.
- Contagens de "falta no DS" e de risco são estáticas (grep em view, includes e views Livewire até 3 níveis). Tabelas rappasoft montam colunas em PHP (`app/Livewire/*Table.php`), e esses botões e selos não foram contados. **Não confirmado** tela a tela.
- Telas montadas por componente Livewire com `render()` para outra view, e views com `@include` de nome dinâmico (ex.: abas de `employer/configuracoes`): podem ter sinais `.jl-*` não contados, e alguma tela ANTIGO pode na verdade ser PARCIAL.
- Uso real (qual tela do admin é "pouco usada"): sem dados de acesso; classifiquei pelo tipo. **Não confirmado.**
- Tema escuro em cada área: confirmei o código de tema nos layouts de candidato, site e empresa. No admin e no superadmin, **não confirmado**.
- Se `/pricing` (`routes/web.php:88`, sem middleware de login, mas com `@extends('employer.layouts.app')` em `pricing/index.blade.php:10`) renderiza para anônimo sem erro: **não confirmado** (não executei).
- Efeito real das peles atuais (contraste e foco) em telas fora do piloto: não capturei nada. As afirmações de contraste vêm dos relatórios citados.
- Rotas registradas por pacotes (ex.: `translation-manager`, Cashier) além das listadas em `routes/`: só contei as declaradas em `routes/*.php`.
