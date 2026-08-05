# Review Debt — Squad Flow v2

> Registro vivo de débitos de revisão de código identificados ao longo da operação. Cada entrada deve ser pequena, datada e ter dono claro.

## Como usar

- Toda PR que mergeia com pendência conhecida adiciona linha aqui.
- Revisar este arquivo **toda segunda-feira** (cadência semanal).
- Item aberto há mais de 2 semanas vira issue rastreada no board.

## Convenção de status

| Status | Significado |
|--------|-------------|
| `open` | Débito identificado, ainda não atacado |
| `wip` | Em andamento (alguém pegou) |
| `done` | Resolvido — manter linha por 30 dias para histórico, depois remover |
| `wontfix` | Decidido conscientemente não atacar — escrever motivo |

## Schema de entrada

```
- [STATUS] YYYY-MM-DD — <título curto> — dono: @user — PR: #123 — ref: <link/arquivo>
  Detalhe: <1-2 linhas explicando o débito e a razão de ter sido aceito agora>
```

## Itens

<!-- Adicionar entradas abaixo desta linha, mais recentes no topo. -->

- [open] 2026-04-28 — Bootstrap Squad Flow v2 — dono: @carneiromarcos — PR: (este) — ref: chore/squad-flow-v2-bootstrap
  Detalhe: Estrutura inicial criada. Próximas iterações vão popular este arquivo conforme PRs forem mergeadas com débitos conhecidos.

---

_Última revisão: 2026-04-28._
