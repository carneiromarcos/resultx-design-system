# electia — Wordmark Assets

> **electia não tem logo gráfico.** O wordmark tipográfico **e** a marca. Sem simbolo isolado, sem ícone próprio. Esta pasta hospeda as variantes do wordmark + um helper "e" para favicon/avatar (espaços onde o wordmark não cabe).

## Spec oficial do wordmark

```
electia by emprega+
```

| Trecho | Fonte | Peso | Notas |
|--------|-------|------|-------|
| `electia` | **JetBrains Mono** | 600 (Semibold) | Tudo minúsculo. Letter-spacing: -0.04em |
| `by` | Sora | 400 (Regular) | ~30% do tamanho do `electia` |
| `emprega+` | **Sora** | 800 (ExtraBold) | ~50% do tamanho do `electia`. Fonte oficial Emprega+ |

**Grafia oficial:** `electia` tudo minúsculo (decisão 2026-05-11). Vide BRAND-BOOK §2 (Regras de grafia) e §3 (Wordmark).

## Arquivos disponíveis (v1)

### Wordmark — 4 variantes

| Arquivo | Conteudo | Status |
|---------|----------|--------|
| `electia-wordmark.svg` | Wordmark completo dark (texto branco em fundo dark) | ✅ Gerado |
| `electia-wordmark-accent.svg` | Wordmark com `electia` em teal accent (#2DD4BF) | ✅ Gerado |
| `electia-wordmark-light.svg` | Wordmark para fundo claro (texto dark em fundo branco) | ✅ Gerado |
| `electia-short.svg` | Wordmark curto: apenas `electia` (sem endorsement) | ✅ Gerado |
| `electia-lockup-vertical.svg` | Lockup vertical: `electia` em cima, `by emprega+` embaixo | ✅ Gerado |

### Favicon helper "e" — NAO E LOGO

| Arquivo | Conteudo | Status |
|---------|----------|--------|
| `electia-monogram.svg` | "e" em container dark (variante A: bg dark + letra teal) | ✅ Gerado |
| `electia-monogram-teal.svg` | "e" em container teal (variante B: bg teal + letra dark) | ✅ Gerado |

> Estes 2 arquivos sao **helpers** para favicon, app icon e avatar em contextos onde o wordmark não cabe (16-48px). **Não usar como logo**. Em qualquer espaço maior, sempre preferir o wordmark.

## PNGs pendentes

| Arquivo | Tamanho | Uso |
|---------|---------|-----|
| `electia-favicon-32x32.png` + `64x64.png` + `128x128.png` + `256x256.png` | varios | Favicon multi-size (rasterizado do monogram.svg) |
| `electia-email-header-440x120.png` | 440x120 | Header de email Brevo |
| `electia-email-icon-200x200.png` | 200x200 | Avatar de email |
| `electia-og-cover-1200x630.png` | 1200x630 | OG image social/site |
| `electia-app-icon-1024x1024.png` | 1024x1024 | App icon iOS/Android template |

Workflow: rasterizar SVGs no tamanho exato via Figma, Canva ou ImageMagick.

## Container do helper "e"

- Forma: quadrado arredondado, `border-radius: 24%`
- Tamanho minimo: 32x32px
- Padding interno: 22% do tamanho
- 3 variantes de cor:
  - **A — Dark bg:** fundo `#0B0E14` com letra teal `#2DD4BF` (electia-monogram.svg)
  - **B — Teal bg:** fundo `#2DD4BF` com letra dark `#0B0E14` (electia-monogram-teal.svg)
  - **C — Subtle:** fundo `rgba(45,212,191,0.15)` com letra teal `#2DD4BF` (gerar quando precisar)

## Referências

- Spec completa: `../../docs/BRAND-BOOK.md` §3 (Wordmark)
- Galeria visual: `../../previews/logo-variants.html`
