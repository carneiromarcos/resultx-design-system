# ADR-0004 — Contratos de componente, adaptadores por stack e piloto no IMO

- **Status:** Accepted — 2026-11-13, decisão D3 do Marcos (piloto) e arquitetura aprovada no mesmo GO
- **Date:** 2026-11-13
- **Related:** [ADR-0001](0001-role-named-tokens.md) · [ADR-0003](0003-token-single-source.md) · auditoria `docs/audits/2026-11-13-ds-auditoria/` (§5 matriz, §6 arquitetura, §10 roteiro, §12 parecer)

> Escrito em pt-BR, como o ADR-0002.

## Contexto

A auditoria de 13/11 mediu que **nenhum produto importa a camada principal de componentes do DS** (`components.css`, 2.658 linhas + 18 arquivos + 9 JS); a única exceção é a Electia, que importa só `components/data-cards`. Cada produto reimplementa Button, Card, Modal, Tabs e Badge com anatomia, estados e foco próprios. A camada atual é feita de classes globais sem prefixo (`.btn`, `.card`, `.modal`), que colidem com o Bootstrap do IMO (678 `btn-*`) e não entram em React+Tailwind. As fichas `docs/components/*.md` são prosa, sem teste.

## Decisão

1. **Contrato antes de código.** Cada componente compartilhado tem um arquivo `contracts/<componente>.yaml` com anatomia, props/variantes, estados (inclusive carregando, vazio e erro), tokens consumidos, teclado e ARIA, critérios de aceite mensuráveis e **casos de teste** que todo adaptador precisa passar. As fichas Markdown passam a ser geradas a partir do contrato.
2. **Adaptadores finos por stack, sem copiar markup entre stacks.**
   - **CSS:** os componentes atuais ganham prefixo `.rx-*` e entram em `@layer components`; aliases sem prefixo ficam por um ciclo de versão.
   - **React (Electia, Xscore):** sem biblioteca nova por enquanto. Os `ui/*` de cada app passam a seguir o contrato e os tokens semânticos, verificados pelos casos de teste. Pacote React compartilhado só se, depois de dois produtos convergidos, a duplicação for real.
   - **Blade (IMO, depois EditalHub):** componentes `<x-rx-*>` finos; plugins (select2, flatpickr, rappasoft, SweetAlert2) recebem pele por token, sem trocar biblioteca.
3. **Contratos neutros quanto a bibliotecas de produto.** O contrato de ícone, por exemplo, fixa tamanhos, semântica e `aria-hidden`, não a biblioteca: Lucide é escolha da Electia, Font Awesome do IMO.
4. **Primeiro lote de contratos = o que o piloto usa:** Button, Field, Card, StatCard, DataTable, Modal/ConfirmDialog, StatusBadge, EmptyState/ErrorState.
5. **Piloto único antes de qualquer ampliação: lista de vagas e candidatos do empregador no IMO.** Reúne tabela Livewire (rappasoft, classes em PHP — maior risco técnico), filtro, KPI, modal e estados.
   - **Efeito restrito ao piloto:** tema rappasoft em **uma** tabela; peles de modal e de select2/flatpickr com escopo por classe nas telas do piloto; o partial de white-label troca só o mecanismo (sem mudar valor), provado por captura das demais áreas.
   - Aplicação global (91 modais `admin-modal-*`, todas as tabelas, plugins em todas as áreas) só depois do piloto aprovado pelo Marcos, com captura antes/depois por amostra de cada área.
   - Critérios no relatório §10 (E3): capturas em 320/768/1024/1440 nos dois temas, teclado, testes do IMO verdes, diff restrito a view, CSS e componente (nenhuma regra de negócio).
6. **White-label com contraste garantido por cálculo**, não por amostra: a cor do texto sobre a marca é escolhida (ou o tom ajustado) para ≥4,5:1 em qualquer cor, com teste de varredura sobre uma grade de matiz × luminosidade.
7. **Particularidades de marca ficam fora do núcleo.** Tema escuro padrão, degradê e brilho roxos, Sora/Mono, cores de teoria e Nexus são da marca ou do domínio Electia; o IMO mantém tema claro, Font Awesome e paginação numerada.

## Ordem e travas

E0 governança → E1 fonte única (ADR-0003) → E2 contratos do lote → F3 do IMO (já pronta, aguarda gate MySQL) → E3 piloto → avaliação do Marcos → só então ampliação. Mudança de valor no `eds-root.css` (F2/E4) só depois do recurso de 10/12 do EditalHub.

## Consequências

**Boas** — um único lugar define o que é "um botão certo" para todas as stacks; teste visual e de contraste passa a valer por componente; a camada CSS do DS deixa de colidir com Bootstrap.

**Custos** — renomear `.btn` → `.rx-btn` com alias por um ciclo; escrever casos de teste por adaptador; o piloto pode mostrar que o tema do rappasoft exige mais trabalho do que o estimado (por isso ele vem primeiro).

## Adendo (13/11/2026) — consumo em stacks cujo CSS não usa `@layer`

**Problema medido no IMO.** `adapters/css/pilot.css` declara todas as regras dentro de `@layer components`. Uma regra fora de camada vence qualquer regra em camada, seja qual for a especificidade. No IMO nenhuma folha usa camada, e o reskin do empregador tem seletores de especificidade até (0,3,2) que pegam rótulo, link e foco. Além disso, nenhum dos 21 tokens semânticos que o adaptador consome existe no `eds-root` da marca, que só declara `--eds-*`. Importado como está, o adaptador não pintaria borda, espaço interno nem anel de foco.

**Decisão (@architect).** Nessas stacks o consumo usa duas peças **geradas pelo DS** a partir da fonte única, nunca reescritas à mão no produto:

1. **Variante escopada** do adaptador, gerada a partir de `pilot.css`:
   - não fica em camada;
   - cada seletor recebe um prefixo de escopo com piso de especificidade, por padrão `:is(.rx-pilot, #rx-pilot-floor)`, que pesa (1,0,0) mesmo casando só pela classe;
   - as declarações são idênticas às de `pilot.css`; muda apenas o seletor, e um teste prova isso;
   - publicada com o seu `.sha256`.
2. **Aliases da marca**: um arquivo que liga cada token semântico consumido pelo adaptador a um `--eds-*` existente, ou a um valor da base do DS quando a marca não tem o token. Os aliases valem só dentro do escopo, e o build checa o contraste nos dois temas. Nenhum valor do `eds-root` muda, de modo que a trava até 10/12 continua valendo.

O produto copia as duas peças fixadas por SHA, como já faz com o `eds-root`, e liga o escopo só nas telas do piloto.

**Rejeitadas:**
- **Rebaixar o template e o Bootstrap do produto para uma camada inferior:** o efeito valeria para todas as telas e inverteria a regra do `!important`.
- **CSS próprio do produto:** duplica o adaptador e diverge em silêncio, o que contraria a decisão 2.

**Conformidade.** Os casos de `tests/visual/pilot-contracts.spec.js` rodam contra o produto por `RESULTX_ADAPTER_URL`. A URL aponta para uma vitrine gerada pelo produto que segue o mesmo contrato de vitrine de `examples/pilot.html`: os mesmos IDs, `?theme=` e as mesmas folhas, na mesma ordem do layout real. As capturas de referência do DS valem só para a vitrine do DS e são puladas quando a URL é de outro adaptador.

**Risco registrado.** O token de destaque segue a cor de marca do cliente (white-label). Para cores muito claras, como o amarelo puro, a conta dá cerca de 3,6:1. Antes do aceite do piloto, a varredura de matiz × luminosidade da decisão 6 cobre o link e o anel de foco. Se ela reprovar, a correção muda valor e fica para depois de 10/12.
