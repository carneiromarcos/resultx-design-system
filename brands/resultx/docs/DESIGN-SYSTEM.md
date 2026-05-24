# ResultX Design System — v0.1 (template inicial)

> ⚠️ ResultX e a marca-base do hub. Hoje os tokens canonicos vivem em `../../tokens/` (raiz do DS). Quando ResultX tiver paleta propria definida, brand-specific overrides entram em `../tokens/`. Este documento descreve a marca-base; para tokens consumidos por outras marcas, ver `../../DESIGN-SYSTEM.md` (raiz).

---

## 0. Tokens canonicos

Estado atual:
- **Tokens raiz do hub:** `../../tokens/tokens.json` (paleta `emprega-app.*` — legado de naming; refatorar pra `base.*`)
- **Tokens ResultX:** `../tokens/tokens.css` e `../tokens/tokens.json` — stubs aguardando decisao da paleta (vide BRAND-BOOK §4)
- **Themes opt-in:** 5 themes em `../../tokens/themes/` (dark, light, premium-light, sober-dark, vibrant-dark) — ResultX pode usar qualquer um via `data-theme`

---

## 1. Componentes base

`[TBD]` — Inventariar componentes que ResultX usa especificamente (site institucional, materiais de consultoria, slides cliente).

---

## 2. Color zones

`[TBD]` — Depende de decisao §4 do BRAND-BOOK (3 direcoes: Premium consultoria · Tech moderna · Resultado ousado).

---

## 3. Tipografia

Provavel heranca do ecossistema:
- **Heading:** Sora (a confirmar — alinhado com Emprega+)
- **Body:** Inter
- **Mono:** JetBrains Mono

`[TBD validar com Marcos se ResultX usa o mesmo stack ou se quer fonte distinta pra projetar "consultoria premium"]`.

---

## 4. Motion

`[TBD]` — Ver `MOTION-GUIDE.md`.

---

## 5. Surface + elevation

`[TBD]` — Depende da paleta.

---

## 6. Acessibilidade

Meta: WCAG AA cross-canal (site, slides, propostas, LinkedIn).

---

## 7. Stack recomendada

Site institucional ResultX: `[TBD confirmar — provavelmente React/Vite, alinhado com `emprega-mais-sites/`]`.
