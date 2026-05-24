# Changelog — PdV Design System

Todas as mudancas notaveis neste design system serao documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [2.5.0] - 2026-05-23

### Changed — Sinergia com ecossistema Emprega+

PdV vive em `profissional.empregamais.me` (subdominio Emprega+). Faz sentido alinhar paleta-base, mantendo DNA proprio (Sora+Inter, glass scale, gradient brand, glow-brand, voz Heroi+Sabio+Rebelde).

- `tokens/tokens.json` + `tokens/tokens.css` — paleta canonizada alinhada Emprega+:
  - **Gold DEFAULT:** `#D4A928` (json) / `#C49A3C` (css) → unificado em **`#c4993b`** (`--emp-gold` do ecossistema, extraido de `empregamais.me/--color-brand-dark`).
  - **Gold light:** `#D4AD55` → `#d4ae54` (paralelo `--emp-gold-light`).
  - **Gold dark:** `#9C7C1E` / `#A07D2E` → `#a07b2a` (paralelo `--emp-gold-dark`).
  - **Background base:** `#0F1A2E` (json) / `#08080A` (css quase preto) → unificado em **`#1B2A4A`** (theme-color oficial Emprega+).
  - **Surface scale (1-4):** recalibrada como escala crescente sobre nova base navy (`#1c2a4a` → `#36508f`).
  - **Glass scale (subtle/default/strong):** rgba base atualizada de `rgba(14,14,17,*)` (dark puro) → `rgba(28,42,74,*)` (navy ecossistema).
  - **Gradient-brand + gradient-gold-line + gradient-radial-glow:** atualizados pro novo hex gold.
  - **Gold-muted:** mantido em `#8B6B2A` / `#6D5918` (variantes proprias PdV).

### Fixed — Desconjunto interno tokens
- Resolvida divergencia ENTRE `tokens.json` (navy `#0F1A2E`) e `tokens.css` (dark puro `#08080A`) — agora ambos canonicamente em `#1B2A4A`.

### Notes
- **Mantido (DNA PdV):** typography Sora+Inter, escala tipografica completa (h1 76px → caption 11px), glass scale 3-niveis (subtle/default/strong), gradient-brand, glow-brand, transitions com spring+reveal, utility classes (`.glass`, `.glow-brand`, `.text-gradient-brand`, `.hover-elevate`, `.eyebrow`).
- **Mantido (logo):** versao atual em `assets/logo/` (pdv-icon variantes + monogram footer/navbar). Versao mountain arquivada em `_archive-v1-mountain/`.
- **Logo template kit Canva:** `DAHFDkEfITg` ("logomarca-pdv", 8 paginas) — descoberta nesta sessao. NAO e logo lockup, e sim template kit de posts sociais 1080x1350 (card navy, card gold, card foto, KPI light, testemunho, evento, autor stock, autor real). Util pra social media producao. Lockup completo (simbolo + wordmark "Profissional de Valor") ainda precisa ser gerado.
- **Sinergia obtida:** paleta unificada ecossistema (gold #c4993b + navy #1B2A4A); fontes compartilhadas (Sora+Inter); PdV mantem identidade visual unica via glass scale + glow-brand + tom de voz Mountain/Forge.

## [2.3.1] - 2026-03-26

### Added
- `tokens/tokens.json` — W3C Design Tokens Community Format (canonical source)
- `tokens/tokens.css` — CSS custom properties + utility classes (.glass, .glow-brand, .eyebrow, .hover-elevate)
- `--color-whatsapp`, `--color-whatsapp-hover`, `--color-urgency` tokens em `index.css`
- `SectionHeader` molecula (eyebrow + title + subtitle) em `components/ui/section-header.tsx`
- `brand-book-viewer.html` — visualizador interativo do Brand Book (11 secoes)

### Changed
- `Section` base refatorado com CVA (bg: default|surface|transparent, width, flush)
- `vsl.tsx` — WhatsApp colors migrados de hardcoded para `var(--color-whatsapp)`
- `countdown-timer.tsx` — red migrado de `#FF0000` para `var(--color-urgency)`
- `ContextSection` — usa `Section bg` prop + `SectionHeader`
- `FeatureGrid` — usa `Section bg` prop + `SectionHeader`
- `BonusGrid` — usa `Section bg` prop + `SectionHeader`
- `TestimonialSection` — usa `Section bg` prop
- `AudienceSection` — usa `Section bg` prop

### Fixed
- Zero cores hardcoded restantes nos componentes (exceto chart defaults intencionais)

## [2.3.0] - 2026-03-25

### Changed
- Logo atualizado para monograma P/V isometrico (substituiu os dois triangulos)
- 9 variacoes de logo geradas
- Navbar: so monograma (sem texto, sem barra)
- Footer: monograma + "Forjando Vencedores." + copyright
- Assets antigos arquivados em `assets/logo/_archive-v1-mountain/`

## [2.2.0] - 2026-03-19

### Added
- Social media templates (26 PNGs renderizados)
- `render-templates.mjs` — Playwright automation para gerar PNGs
- `social-media-templates.html` — source HTML dos templates

## [2.1.0] - 2026-03-13

### Added
- Email templates (base, newsletter, product-cta) compatíveis com Brevo
- `pdv-brevo-base.yaml` — configuracao Brevo

## [2.0.0] - 2026-03-07

### Added
- Brand Book v2.0 — documento completo de identidade
- DESIGN-SYSTEM.md — tokens e componentes
- MOTION-GUIDE.md — animacoes e scroll reveals
- IMAGE-PROMPTS.md — prompts para geracao de imagens
- `brand-preview.html` — showcase visual

## [1.0.0] - 2026-02-23

### Added
- Identidade inicial PdV (dark + gold)
- Paleta de cores, tipografia (Sora + Inter)
- Glassmorphism 3 niveis
