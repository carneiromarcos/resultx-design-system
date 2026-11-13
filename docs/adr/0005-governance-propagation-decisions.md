# ADR-0005 — Decisões de governança, propagação e conformidade (D4–D10)

- **Status:** Accepted — 2026-11-13, decisões D4–D10 do Marcos ("siga na sua ordem", aceitando as recomendações do desenho)
- **Date:** 2026-11-13
- **Related:** [ADR-0001](0001-role-named-tokens.md) · [ADR-0003](0003-token-single-source.md) (emendada por D10) · [ADR-0004](0004-contracts-adapters-pilot.md) · desenho `docs/audits/2026-11-13-ds-auditoria/governanca-propagacao-conformidade.md` e anexo `anexos/D-evidencias-governanca.md`

> Escrito em pt-BR, como os ADRs 0002–0004.

## Contexto

A missão complementar de 13/11 desenhou como uma versão nova do DS chega aos produtos (propagação), como se mede se um produto segue o DS (conformidade) e quem decide o quê (governança). O desenho passou por três rodadas do Revisor (REPROVA → APROVA COM RESSALVA → ressalvas corrigidas) e deixou sete decisões para o Marcos. Esta ADR registra o que foi decidido e o que **não** está autorizado por ela.

## Decisões

| ID | Decisão | Efeito imediato |
|----|---------|-----------------|
| **D4** | Remover `.github/workflows/npm-publish.yml`. Os produtos consomem o DS por tag do GitHub, não pelo npm. | Arquivo removido neste PR. Publicar no npm passa a exigir nova ADR. |
| **D5** | A GitHub App da automação `ds-propagate` só é criada **depois** que a prova descartável (P1) passar **e** a reconciliação de ADRs estiver feita. | Nada agora. Exige aceite de risco **expresso** do Marcos no momento de criar. |
| **D6** | Não contratar GitHub Team agora. Regras que dependem dele (revisão obrigatória por CODEOWNERS em repo privado) continuam convenção. | Nada agora. Rever se algum cliente exigir. |
| **D7** | No máximo **1 versão do DS a cada 2 semanas**. Correção de segurança ou de acessibilidade crítica pode furar a janela com OK do Marcos. | Vale a partir da v2.10.0. |
| **D8** | O teste visual Linux vira check obrigatório da `main`. Primeiro remove-se o filtro de caminhos (senão o check obrigatório não roda em PR fora dos caminhos e trava o merge); depois liga-se a regra e confere-se com `gh api`. | Parte 1 (filtro) neste PR; parte 2 (regra) logo após o merge. |
| **D9** | Exceção de conformidade vale no máximo **90 dias**. Exceção abaixo do contraste AA exige mitigação real, com prazo de correção próprio, e OK do Marcos. Esse OK é decisão de negócio, **não** é parecer jurídico nem atestado de conformidade WCAG. Exceção vencida só gera aviso; não bloqueia. | Vale quando a conformidade entrar em modo aviso. |
| **D10** | v2.10.0 = `main` atual com a mudança visual declarada; a E1 vira v2.11.0. | ADR-0003 emendada neste PR, antes de qualquer tag. |

## O que esta ADR **não** autoriza

- Criar a tag v2.10.0. Ela depende de: impacto preenchido em todos os consumidores conhecidos (FinanceX e ResultX Site hoje estão como **desconhecido**), versão no `package.json`, CHANGELOG com a mudança visual e ordem expressa do Marcos para o push da tag.
- Criar repositório de automação, GitHub App, segredo ou token.
- Abrir PR em produto por automação. Até a P2, o Supervisor abre PR à mão, com "push N" do Marcos.
- Mexer no `eds-root.css` do EditalHub antes do fim do recurso de 10/12.

## Consequências

- Some um caminho de publicação que ninguém usa e que poderia ser disparado por engano.
- Toda PR passa a rodar o teste visual Linux (um job a mais por PR, alguns minutos de CI).
- A cadência de 2 semanas dá tempo para os produtos absorverem cada versão e para o Revisor conferir o inventário.
- D5 e D6 ficam registradas como adiadas, com o gatilho para revisitá-las.
