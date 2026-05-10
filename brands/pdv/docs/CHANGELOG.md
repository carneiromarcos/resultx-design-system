# Changelog — PdV Design System

Todas as mudancas notaveis neste design system serao documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

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
