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
