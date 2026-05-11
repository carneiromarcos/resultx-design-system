# Changelog — Electia Brand & Design System

Mudanças notaveis no brand kit e design system Electia.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

---

## [1.3] - 2026-05-11

### Refinado — "electia não tem logo gráfico"
- BRAND-BOOK §3 renomeado de "Logo" para "Wordmark" — explícita que electia não tem simbolo gráfico próprio, o wordmark tipográfico **e** a marca
- Variante "Monogram" reclassificada como "**helper de favicon/avatar**" (não mais como variante do logo)
- Adicionada regra explícita: "Não desenhar um ícone/simbolo/grafismo próprio para Electia (a marca **e** o wordmark)"
- `assets/logo/README.md` reescrito refletindo a separacao: 4 wordmarks + 2 helpers `e` para favicon

### Removido — previews desatualizados
Cinco HTMLs clones de PdV (paleta gold residual) ou tasks já concluídas foram apagados:
- `previews/brand-book-viewer.html`
- `previews/brand-preview.html`
- `previews/social-media-templates.html`
- `previews/emprega-font-match.html` (task concluída: fonte emprega+ = Sora 800)
- `previews/logo-typography-preview.html` (task concluída: direcao T2 escolhida)

Previews restantes (3):
- `aurora-hero-demo.html` (filter electia-subtle ao vivo)
- `logo-variants.html` (galeria dos SVGs)
- `prototype.html` (preservado original Electia)

---

## [1.2] - 2026-05-11

### Logo & grafia oficial — fechados
- **Grafia oficial:** `electia` (tudo minúsculo, sem acento) — aplicável em wordmark, copy, posts, emails, app, materiais. Exceção única: início de frase em texto editorial vira "Electia" (regra ortográfica).
- **Wordmark:** `electia by emprega+`
  - `electia` em **JetBrains Mono Semibold 600** (decisão tipográfica T2 — mono tech)
  - `by` em Sora Regular 400
  - `emprega+` em **Sora ExtraBold 800** (fonte oficial da marca-mae Emprega+; logo Emprega+ original tem o "ga+" desenhado custom, mas no endorsement Electia usamos Sora reto)
- **5 versões definidas:** wordmark completo, wordmark curto (`electia` sozinho), monogram `e`, lockup vertical, monocromatico
- **4 variantes de cor:** padrão dark, accent dark, accent glow, light
- **Container do monogram `e`:** quadrado arredondado (border-radius 24%), 3 opções de cor
- **Usos proibidos atualizados:** sem capital "E" em wordmark, sem `by ResultX`, sem trocar fontes

### Atualizado
- `BRAND-BOOK.md` §2 (Regras de grafia) — substituidas regras antigas pela grafia oficial lowercase
- `BRAND-BOOK.md` §3 (Logo) — reescrita completa com spec definitiva (fontes, tamanhos, cores, container, versões)

### Adicionado
- `previews/logo-typography-preview.html` — comparação das 3 direcoes tipográficas
- `previews/emprega-font-match.html` — página de match da fonte Emprega+ (Sora 800 confirmada)

### Adicionado — Aurora Hero v1 movido para o brand
- `assets/hero/aurora-hero-v1.mp4` (4.6 MB, H.264, 12s loop)
- `assets/hero/aurora-hero-v1.webm` (4.8 MB, VP9, 12s loop)
- `assets/hero/aurora-hero-v1.poster.jpg` (71 KB, 1280x720)
- `assets/hero/README.md` — spec completa (fonte Pexels, pipeline ffmpeg, filter electia-subtle, scrim CSS, casos de uso)
- `previews/aurora-hero-demo.html` — demo funcional com 3 modos toggle (original / electia-dark / electia-subtle)

### Atualizado — BRAND-BOOK §14 (Fotografia e Imagens)
- Adicionada subseção "Asset hero canônico: aurora-hero-v1" no topo da seção
- Cross-reference para `assets/hero/README.md` e `previews/aurora-hero-demo.html`

### Logo SVGs v1 — gerados
- `assets/logo/electia-wordmark.svg` — wordmark completo dark (branco)
- `assets/logo/electia-wordmark-accent.svg` — wordmark com `electia` em teal
- `assets/logo/electia-wordmark-light.svg` — wordmark para fundo claro
- `assets/logo/electia-short.svg` — wordmark curto (`electia` sozinho)
- `assets/logo/electia-monogram.svg` — `e` em container dark (variante A)
- `assets/logo/electia-monogram-teal.svg` — `e` em container teal bg (variante B)
- `assets/logo/electia-lockup-vertical.svg` — lockup vertical
- `previews/logo-variants.html` — galeria visual dos 7 SVGs com download direto

**Técnica:** SVG com `<text>` + Google Fonts via `@import` interno. Funciona em browsers e renderers modernos. Para uso offline (Figma export final), converter texto em paths.

### TODO (subiu de prioridade)
- Rasterizar PNGs do monogram em 32x32, 64x64, 128x128, 256x256 (favicon multi-size)
- Rasterizar email header 440x120 e email icon 200x200
- Rasterizar OG cover 1200x630
- Converter SVGs em outline (paths) para uso offline em Figma/Canva
- Reproduzir o "ga+" desenhado custom do logo Emprega+ caso precise pixel-perfect parity (atualmente o endorsement usa Sora reto)
- Reformatar aurora-hero-v1 em 1080x1920 (Stories/Reels) e 1080x1080 (feed Instagram)

---

## [1.1] - 2026-05-11

### Added — Brand Book v1.1
- Seção 11. Origem da Marca (história, fundador, raizes da ResultX)
- Seção 12. Posicionamento Estratégico (ICP, dor, alternativas competitivas, "por que agora", categoria de mercado)
- Seção 13. Arquétipo de Marca (Sábio + Mago + Cuidador — diferente do PdV)
- Seção 14. Fotografia e Imagens (filosofia visual abstrata, filter `electia-subtle`, anti-clichês de RH)
- Seção 15. Checklist de Validação (compliance LGPD/CFP/WCAG AA)

### Added — Brand assets (estrutura)
- `tokens/tokens.css` + `tokens/tokens.json` — paleta canônica Electia (teal #2DD4BF)
- `assets/logo/README.md` — placeholder com 9 arquivos esperados (TODO: logo definitivo)
- `email-templates/` — 4 templates Brevo (base + newsletter + product-cta + brevo-base.yaml) adaptados de PdV
- `previews/brand-preview.html` + `brand-book-viewer.html` + `social-media-templates.html` (adaptados)
- `docs/SOCIAL-MEDIA-GUIDE.md` — guia de social média adaptado
- `docs/MOTION-GUIDE.md` — diretrizes de animacao
- `docs/IMAGE-PROMPTS.md` — TODO: rewrite editorial (clonado de PdV, paleta gold incompatível)

### Migrated
- Renomeacao: `brand-book-electia.md` -> `BRAND-BOOK.md` (uppercase, padronizado com PdV)
- Renomeacao: `design-system-v0.1.md` -> `DESIGN-SYSTEM.md`
- Paleta: gold (#D4A928 family) -> teal (#2DD4BF family) em todos os arquivos copiados
- Strings: "PdV" / "Profissional de Valor" -> "Electia" / "Electia by Emprega+"

### Preserved
- `docs/specs/` (5 specs do instrumento 4T)
- `mockups/` (6 cards de teorias + 6 iteracoes)
- `wireframes/colaborador-page.html`
- `previews/prototype.html`

### TODO
- Definir e gerar logo Electia (atualmente placeholder em `assets/logo/`)
- Rewrite editorial de `IMAGE-PROMPTS.md` (estética gold/mountain -> teal/tech)
- Promover `DESIGN-SYSTEM.md` de v0.1 (spec) para v1.0 (canônico)
- Adicionar `assets/aurora-hero-v1.{mp4,webm,jpg}` (validado em sessao 2026-05-10)
- Tagline Electia oficial (atualmente `[Tagline Electia a definir]`)

---

## [1.0] - 2026-04-XX

### Added
- Brand Book inicial Electia (10 seções) — `brand-book-electia.md`
- Design System v0.1 (spec) — `design-system-v0.1.md`
- 5 specs do instrumento 4T em `docs/specs/`
- 6 mockups de cards por teoria (DISC, MBTI/Tipologia Cognitiva, Eneagrama, Big Five, Le Senne/Temperamentos, BAT) + 6 iteracoes em `mockups/_iterations/`
- Wireframe da área do colaborador
- Prototype interativo

### Identity
- Paleta: teal #2DD4BF (accent-primary) + dark navy #0B0E14 (bg-base)
- Tipografia: Sora (display) + Inter (body)
- Tom: científico, direto, provocativo, sem motivacional vazio
- Naming canônico: Electia by Emprega+ · Mentor AI · Tipologia Cognitiva
