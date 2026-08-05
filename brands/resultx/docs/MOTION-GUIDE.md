# Motion & Animation Guide — ResultX

> ⚠️ Template inicial. ResultX e consultoria premium — motion deve transmitir competencia/seriedade, evitando exageros. Site institucional, slides cliente, materiais de proposta.

---

## 1. Principios de Motion

`[TBD]` — Sugestoes:
- Motion **sutil e profissional** — nada de bouncing/wobble
- Easing `ease-out` (entrada elegante, saida discreta)
- Respeitar `prefers-reduced-motion` (executivos seniores podem ter motion sickness)
- Animacoes funcionais (revelar info), nao decorativas

---

## 2. Scroll Reveal

`[TBD]` — Fade up sutil, threshold 30%, stagger 100ms maximo.

---

## 3. Hover Effects

`[TBD]` — Botoes: elevation sutil + cor primary (a definir apos paleta). Cards: subtle lift.

---

## 4. Page Transitions

`[TBD]` — Site institucional ResultX (a confirmar stack).

---

## 5. Tabela de Duracao e Easing

Tokens propostos (consistentes com PdV/Electia/Emprega+):

| Token | Valor | Uso |
|---|---|---|
| `--rx-duration-fast` | 150ms | Hover/focus |
| `--rx-duration-normal` | 300ms | Entrada elementos |
| `--rx-duration-slow` | 500ms | Page transitions |
| `--rx-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveal natural |

---

## 6. Performance

- Animar apenas `transform` e `opacity`
- `will-change` narrow, remover apos uso
- Respeitar `prefers-reduced-motion`
