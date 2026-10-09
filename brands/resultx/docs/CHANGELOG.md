# Changelog — ResultX Brand Kit

Mudanças notaveis no brand kit ResultX (consultoria de transformação digital).
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

---

## [2.0] - 2026-10-09

### Changed — marca alinhada ao site novo (resultx.app, DS v2.8.1)

Tema **grafite** como padrão (dark-first), Sora + Inter + JetBrains Mono, header flutuante, regra de acento (ouro = ação, roxo = atmosfera), sem orb.

**Tokens (`tokens/tokens.json` + `tokens.css`) — antes → depois**

| Token | Antes | Depois | Quebra? |
|---|---|---|---|
| `--rx-bg` | `#1B2A4A` (navy) | `#0B0E14` (grafite) | visual |
| `--rx-surface-1/2/3` | `#1c2a4a` / `#243661` / `#2d4378` | `#111620` / `#161B26` / `#1C2333` | visual |
| `--rx-text` | `#FFFFFF` | `#E6EDF3` | visual |
| `--rx-text-secondary` | `#bfd0ec` | `#8B949E` | visual |
| `--rx-text-muted` | `#5a6b7c` (reprovava AA no grafite) | `#8A939D` | visual |
| `--rx-text-inverse` | `#1B2A4A` | `#0B0E14` (claro: `#FFFFFF`) | visual |
| `--rx-glass-dark-bg` | `rgba(28,42,74,.6)` | `rgba(22,27,38,.6)` | visual |
| `--rx-success/-error/-warning` | `#16a34a` / `#ef4343` / `#d97706` | escuro `#22c55e` / `#ef4444` / `#f59e0b`; claro `#16a34a` / `#dc2626` / `#d97706` | visual |
| `--rx-shadow-sm/md/lg` | navy `rgba(27,42,74,…)` | escuro: sombras pretas do DS; claro: as navy antigas | visual |
| `--rx-light-subtle/-muted/-border` | `#f5f7f9` / `#f0f4f8` / `#e0e6eb` | `#F8FAFB` / `#F0F3F5` / `#D1D9E0` (escala do DS) | visual |
| `--rx-text-h1` / `-h2` | `2.5rem` / `2rem` | `clamp(2.25rem, 1.35rem + 2.9vw, 3.6rem)` / `clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)` | visual |
| `--rx-space-section` | `clamp(4rem, 3rem + 5vw, 10rem)` | `clamp(4rem, 2.8rem + 4.5vw, 7rem)` | visual |
| `--rx-gutter` | `1.5rem` | `1rem` | visual |
| `--rx-font-heading-legacy`, `--rx-font-body-legacy` | Poppins / Roboto | **removidos** | **sim**, se alguém os usava (o site novo não usa) |
| `--rx-weight-extrabold` | `800` | **removido** (o site carrega 500/600/700) | **sim**, se alguém o usava |
| `--rx-font-heading/-body/-mono` | Sora / Inter / JetBrains Mono | iguais | não |
| `--rx-gold*`, `--rx-purple*`, `--rx-gradient-*`, `--rx-gold-ink`, `--rx-container-max` | — | iguais | não |

**Novos:** `--rx-border-subtle/-border/-border-strong`, `--rx-info`, `--rx-tracking-eyebrow`, `--rx-ease-smooth`, `--rx-reveal-distance/-duration/-step`, `--rx-lift-duration/-distance`, `--rx-header-logo-h/-logo-h-compact/-link/-bar-min`. `.rx-reveal` passa a usar os números do site (28 px, 800 ms, 90 ms por item). A ponte `ds-bridge.css` não mudou (o accent continua o mesmo).

### Added

- `assets/logo/`: `resultx-logo-on-dark.svg`, `resultx-logo-on-light.svg` (+ PNG 1200), `resultx-favicon.svg`, `resultx-icon-{16,32,180,512}.png`, `scripts/gerar-marca.js` e README de uso. Derivados dos arquivos reais do site; nada foi redesenhado.
- `previews/brand-system.html`: vitrine da marca (paleta, tipografia, logo, componentes, movimento, regras), grafite e claro.

### Changed (docs)

`BRAND-BOOK`, `DESIGN-SYSTEM`, `MOTION-GUIDE` e `IMAGE-PROMPTS` reescritos para o site novo. O posicionamento passa a ser "Implementação de IA e melhoria de processos". Superado: navy, "adaptive", Poppins/Roboto, wordmark Sora com X ouro → roxo (nunca implementado), pessoas em imagem, afirmações de histórico sem fonte.

---

## [0.3] - 2026-05-23

### Added — Canonizacao paleta + tipografia + 3 pilares (extraido de resultx.app)

- `tokens/tokens.json` — paleta REAL canonizada substituindo stubs: navy base `#0d1b2e` (theme-color oficial) + brand gradient 5-cor (blue/cyan/magenta/orange/gold) + Poppins+Roboto.
- `tokens/tokens.css` — CSS vars `--rx-*` companion. Inclui `--rx-gradient-brand` reutilizavel e classe `.rx-text-gradient`.
- `docs/BRAND-BOOK.md` §1 — adicionado posicionamento oficial do site + 3 pilares (Implementação de IA, Reestruturação de processos, Squads de desenvolvimento).
- `docs/BRAND-BOOK.md` §3 — logo Canva DAHFnUzUpeA referenciada + spec visual + tabela de variantes a exportar.
- `docs/BRAND-BOOK.md` §4 — substituidas 3 direcoes TBD pela paleta canonizada extraida de `resultx.app` (CSS bundle).
- `docs/BRAND-BOOK.md` §5 — Poppins+Roboto (NAO Sora+Inter como assumido). Stack proprio diferenca ResultX do ecossistema empregabilidade.
- `docs/BRAND-BOOK.md` §7, §9 — URL `resultx.app` canonizada + tagline embutida "resultados reais".

### Notes
- Site ao vivo: SPA React/Vite com Google Fonts (Poppins+Roboto) e Facebook Pixel ativo.
- Logo Canva master criada 2026-05-02 (`DAHFnUzUpeA`). Falta exportar SVGs canonicos pra `assets/logo/`.
- §6 (Tom e Voz) e §10 (Origem) ainda com TBDs — aguarda Marcos narrar conteudo das outras secoes do site.

---

## [0.2] - 2026-05-23

### Added — Paridade estrutural com Electia/PdV/Emprega+
- `docs/DESIGN-SYSTEM.md` — template v0.1 (8 secoes) com `[TBD]` em campos dependentes da decisao de paleta.
- `docs/IMAGE-PROMPTS.md` — template com prompt-base esbocado pra estetica "premium business / tech estrategica" + aspect ratios.
- `docs/MOTION-GUIDE.md` — principios + tokens duracao/easing propostos (prefixo `--rx-*`).
- `docs/SOCIAL-MEDIA-GUIDE.md` — 9 secoes focadas em LinkedIn (canal-fim B2B). Instagram explicitamente fora do roadmap ResultX (decisao Marcos 2026-05-11).

### Notes
- Estrutura agora identica a Electia/PdV/Emprega+ (5 docs + CHANGELOG + tokens + assets/logo + previews).
- Conteudo dos 4 novos docs e `[TBD]` aguardando decisao de paleta + posicionamento ResultX.
- ResultX continua sendo a marca-base do hub — quando paleta for definida, `tokens/tokens.css` e `tokens/tokens.json` saem do estado stub.

---

## [0.1] - 2026-05-11

### Added — Bootstrap inicial da brand
- `docs/BRAND-BOOK.md` v0.1 — 10 seções com rascunho + varios `[TBD]` markers
- `tokens/tokens.css` + `tokens/tokens.json` — stubs apontando para tokens root do DS (ResultX e a marca-base do ResultX DS)
- `assets/logo/README.md` — placeholder com TODO list dos arquivos esperados
- Estrutura de pastas padrão: `docs/`, `tokens/`, `assets/logo/`, `previews/`

### Identidade declarada
- **Nome:** ResultX (R e X maiúsculos, sem espaco)
- **Tipo:** Consultoria de transformação digital
- **Operação:** desde 2012
- **CEO:** Marcos Carneiro
- **CNPJ:** único (mesmo CNPJ legal de Emprega+, PdV, Electia, IMO, Editais)

### Decisões pendentes (TBD)
- Paleta de cores oficial (3 direcoes sugeridas no Brand Book §4)
- Tagline / slogan
- URL oficial
- Tom e voz refinados
- Logo arquivos (logo existe mas falta hospedar aqui)
- Tipografia (provavelmente Sora + Inter herdadas, mas confirmar)

### Roadmap
- LinkedIn página empresa (planejado Marcos 2026-05-11)
- Newsletter ResultX no LinkedIn (planejado Marcos 2026-05-11)
- Site institucional já existe — URL a confirmar
