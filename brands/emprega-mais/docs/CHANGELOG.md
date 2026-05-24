# Changelog — Emprega+ Design System

Todas as mudancas notaveis neste design system serao documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [0.1.0] - 2026-05-23

### Added
- `tokens/tokens.json` — W3C Design Tokens Community Format (canonical source). Paleta gold + navy extraida de `previews/brand-guidelines.html` (2026-05-10).
- `tokens/tokens.css` — CSS custom properties com prefixo `--emp-*`.
- Estrutura padrao de pastas (`assets/`, `docs/`, `previews/`, `tokens/`) — alinhada com brands/electia e brands/pdv.
- `previews/` agora hospeda os 5 HTMLs historicos (`brand-guidelines.html`, `design-system.html`, `design-system-preview.html`, `design-system-v2-preview.html`, `mockups-gov.html`) — antes soltos na raiz do brand.

## [0.3.1] - 2026-05-23 (mesmo dia)

### Added — BRAND-BOOK preenchido (§1, §5, §6, §7)
- **§1 Essencia da Marca** — completa: posicionamento oficial do site ("Tecnologia para Empregabilidade" + "infraestrutura digital que conecta governos/empresas/profissionais"), tagline oficial "Conectando pessoas ao trabalho certo", proposito/missao/visao/promessa redigidos, 4 frentes ecossistema (Gov B2G, Editais C&S, Electia B2B, PdV B2C), 4 valores (Profissional/Acessivel/Otimista/Realista).
- **§4 Paleta de Cores** — sincronizada com tokens v0.3 (`#c4993b` gold, `#1B2A4A` navy, glass tokens, semantic tailwind-aligned).
- **§6 Tom e Voz** — completa: 4 atributos cristalizados, 4 exemplos de tom por contexto (Site/Editais/Electia/PdV), checklist DEVEMOS/EVITAMOS.
- **§7 Iconografia** — completa: Lucide Icons + 7 icones canonicos, Light Glass parametros, gradient por produto (Gov green/Editais cyan/Electia purple/PdV gold/Institucional blue), referencia galeria `mockups/dashboards/` (8 PNGs).

### Pending
- §3 Logo — aguarda exportar SVGs Canva master `DAHFDuSkSXE` (6 variantes: 2 Emprega+ light/dark + 3 Electia + 1 symbol `a+`).
- §10 Origem da Marca — precisa input Marcos (cronologia 2022→hoje, momento fundacao, marcos importantes).

## [0.3.0] - 2026-05-23

### Changed — Tokens alinhados ao site live empregamais.me
- `tokens/tokens.json` + `tokens.css` — paleta REAL canonizada substituindo valores do brand-guidelines.html (provavelmente outdated):
  - Navy `--emp-bg`: `#0F1A2E` → **`#1B2A4A`** (theme-color oficial do site)
  - Gold `--emp-gold`: `#D4A928` → **`#c4993b`** (`--color-brand-dark` do site)
  - Border `--emp-light-border`: `#D6E0E8` → **`#e0e6eb`** (`--color-border` do site)
  - Text secondary: `#D6E0E8` → `#bfd0ec` (light blue subtle real)
  - Semantic refeitos com tailwind padrao (green-600, red-500, amber-600)
- Tipografia confirmada inalterada: Sora + Inter + JetBrains Mono.

### Added
- Glass tokens (`--emp-glass-bg`, `--emp-glass-border`, `--emp-glass-border-hover`) — sistema "Light Glass" oficial do Emprega+ ate entao nao tokenizado.
- Utility class `.emp-glass` com `backdrop-filter: blur(12px)`.
- `mockups/dashboards/` — **8 PNGs renderizados** das demos do hub (dashboard, login, candidatos, employer-jobs, employer-job-applicants, triagem, 404, positioning-wheel-demo). Galeria visual oficial Emprega+ pra brand kit.
- `scripts/render-dashboards.mjs` (no hub root) — script Playwright reusavel pra regerar a galeria.

## [0.2.0] - 2026-05-23

### Added
- `docs/BRAND-BOOK.md` — template estrutural completo (11 secoes) com `[TBD]` em campos que requerem input Marcos. Paleta + tipografia ja preenchidas a partir dos tokens.
- `docs/DESIGN-SYSTEM.md` — template v0.1 (espelho Electia).
- `docs/IMAGE-PROMPTS.md` — esboco de prompt-base + tabela de aspect ratios + placeholders.
- `docs/MOTION-GUIDE.md` — principios + tabela de tokens duracao/easing propostos.
- `docs/SOCIAL-MEDIA-GUIDE.md` — 9 secoes (paridade Electia/PdV); inclui tabela completa de dimensoes por plataforma e checklist pre-publicacao.

### Pending (requer input Marcos)
- Preencher todos os `[TBD]` dos 5 docs (priorizar BRAND-BOOK §1 Essencia, §6 Tom e Voz, §10 Origem).
- `assets/logo/` — SVGs canonicos (extrair dos HTMLs previews ou gerar novos).
- TODOs herdados do `brands/README.md`: newsletter "Empregabilidade" pertence a quem? PdV tem site proprio?
