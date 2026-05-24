# Changelog — ResultX Brand Kit

Mudanças notaveis no brand kit ResultX (consultoria de transformação digital).
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

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
