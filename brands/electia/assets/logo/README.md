# electia — Logo Assets

> **Status: 🟢 v1 gerado** — 7 SVGs criados em 2026-05-11 seguindo spec do BRAND-BOOK §3. PNGs raster ainda pendentes.

## Spec oficial do wordmark

```
electia by emprega+
```

| Trecho | Fonte | Peso | Notas |
|--------|-------|------|-------|
| `electia` | **JetBrains Mono** | 600 (Semibold) | Tudo minúsculo. Letter-spacing: -0.04em |
| `by` | Sora | 400 (Regular) | ~30% do tamanho do `electia` |
| `emprega+` | **Sora** | 800 (ExtraBold) | ~50% do tamanho do `electia`. Fonte oficial Emprega+ |

**Grafia oficial:** `electia` tudo minúsculo (decisão 2026-05-11). Vide BRAND-BOOK §2 (Regras de grafia) e §3 (Logo).

## Arquivos esperados

| Arquivo | Conteúdo | Formato | Status |
|---------|----------|---------|--------|
| `electia-wordmark.svg` | Wordmark completo `electia by emprega+` (dark, texto branco) | SVG | ✅ Gerado |
| `electia-wordmark-accent.svg` | Wordmark com `electia` em teal accent (#2DD4BF) | SVG | ✅ Gerado |
| `electia-wordmark-light.svg` | Wordmark para fundo claro (cor invertida) | SVG | ✅ Gerado |
| `electia-wordmark-mono.svg` | Wordmark single-color (branco) | SVG | 🟡 Use `electia-wordmark.svg` (já é single-color branco) |
| `electia-short.svg` | Wordmark curto (`electia` sozinho) | SVG | ✅ Gerado |
| `electia-lockup-vertical.svg` | Lockup vertical para social/papelaria | SVG | ✅ Gerado |
| `electia-monogram.svg` | "e" minúsculo em container arredondado (dark bg, letra teal) | SVG | ✅ Gerado |
| `electia-monogram-teal.svg` | "e" em container teal bg + letra dark (variante B) | SVG | ✅ Gerado |
| `electia-monogram-outline.svg` | Versão outline do monogram | SVG | 🔴 Pendente |
| `electia-monogram-micro.svg` | Monogram para <16px | SVG | 🟡 Use `electia-monogram.svg` em 16px (escala bem) |
| `electia-favicon.svg` | Favicon (alias do monogram dark) | SVG | 🟡 Use `electia-monogram.svg` |
| `electia-favicon-32x32.png` + `64x64.png` + `256x256.png` | Favicons PNG | PNG | 🔴 Pendente |
| `electia-email-header-440x120.png` | Header de email Brevo | PNG | 🔴 Pendente |
| `electia-email-icon-200x200.png` | Avatar de email | PNG | 🔴 Pendente |
| `electia-og-cover-1200x630.png` | OG image social | PNG | 🔴 Pendente |
| `electia-app-icon-1024x1024.png` | App icon (iOS/Android template) | PNG | 🔴 Pendente |

## Workflow para gerar

1. **Figma / Canva** — montar wordmark seguindo a spec (JetBrains Mono 600 + Sora 400/800)
2. Exportar versões em SVG (vetor, escalável) e PNG (sizes específicos acima)
3. Versionar nesta pasta com naming exato listado acima
4. Atualizar `BRAND-BOOK.md` §3 com previews quando arquivos existirem
5. Atualizar `previews/brand-preview.html` apontando pros assets reais

## Container do monogram "e"

- Forma: quadrado arredondado, `border-radius: 24%`
- Tamanho mínimo: 32×32px
- Padding interno: 22% do tamanho
- 3 variantes de cor:
  - **A — Dark bg:** fundo `#0B0E14` com letra teal `#2DD4BF`
  - **B — Teal bg:** fundo `#2DD4BF` com letra dark `#0B0E14`
  - **C — Subtle:** fundo `rgba(45,212,191,0.15)` com letra teal `#2DD4BF`

## Referências

- Spec completa: `../../docs/BRAND-BOOK.md` §3 (Logo)
- Direção tipográfica T2 (mono tech): `../../previews/logo-typography-preview.html`
- Match da fonte Emprega+: `../../previews/emprega-font-match.html`
