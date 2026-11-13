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
| **D7** | No máximo **1 versão do DS a cada 2 semanas**, com 1 PR de DS por produto por versão. Correção de segurança ou de acessibilidade sai fora do ritmo (como no desenho §0.1 D7, sem qualificação adicional). | Vale a partir da v2.10.0. |
| **D8** | O teste visual Linux vira check obrigatório da `main`. Primeiro remove-se o filtro de caminhos (senão o check obrigatório não roda em PR fora dos caminhos e trava o merge); depois liga-se a regra e confere-se com `gh api`. | Parte 1 (filtro) neste PR; parte 2 (regra) logo após o merge. |
| **D9** | Exceção de conformidade vale no máximo **90 dias**; o Supervisor DS concede. Exceção **abaixo do piso AA** só com (1) mitigação alternativa registrada que dê acesso equivalente enquanto a barreira existir, (2) plano e prazo de correção registrados à parte (prazo não é mitigação) e (3) aprovação do Marcos. Sem alternativa possível, registra-se a **ausência de mitigação** e o risco explícito para o Marcos decidir, sem afirmar AA. A aprovação é governança interna e **não equivale a conformidade legal nem WCAG**. Vencimento segue o desenho §4.3: avisa e congela, não esconde infração nova. Texto igual ao do desenho §0.1 D9. | Vale quando a conformidade entrar em modo aviso. |
| **D10** | v2.10.0 = a `main` no momento de cortar a tag, com a mudança visual declarada e inventário completo até o SHA da tag; a E1 vira v2.11.0. | ADR-0003 emendada neste PR, antes de qualquer tag. |

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
