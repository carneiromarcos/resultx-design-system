# Motion & Animation Guide — Emprega+

> ⚠️ Template inicial. Definir princípios de motion da marca-mãe — IMO e Editais herdam.

---

## 1. Princípios de Motion

`[TBD]` — Sugestões: motion sutil/profissional, sem exageros, respeita `prefers-reduced-motion`, foca em clareza de fluxo.

---

## 2. Scroll Reveal (entrada de elementos)

`[TBD]` — Fade up, stagger, threshold.

---

## 3. Hover Effects

`[TBD]` — Botões, cards, links. Default: elevação sutil + glow gold.

---

## 4. Background Effects

`[TBD]` — Light glass mencionado nos previews — formalizar parâmetros.

---

## 5. Page Transitions

`[TBD]` — Navegação entre páginas (Next.js no jobs-frontend, Livewire no app legado).

---

## 6. Tabela de Duração e Easing

`[TBD]` — Tokens propostos:
| Token | Valor | Uso |
|---|---|---|
| `--emp-duration-fast` | 150ms | Hover/focus |
| `--emp-duration-normal` | 300ms | Entrada elementos |
| `--emp-duration-slow` | 500ms | Page transitions |
| `--emp-ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveal natural |

---

## 7. Performance

- Animar apenas `transform` e `opacity` (compositor-friendly)
- `will-change` narrow, remover após uso
- Respeitar `prefers-reduced-motion`
