# Changelog — Electia Brand & Design System

Mudanças notaveis no brand kit e design system Electia.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

**Escopo deste CHANGELOG:** o brand-kit inteiro deste diretório (`brands/electia/`) — BRAND-BOOK editorial, DESIGN-SYSTEM, mockups, wireframes, specs, tokens, assets, decisões. O header de versão dentro do `BRAND-BOOK.md` reflete apenas o estado editorial das seções §1-16 e pode estar em versão anterior ao deste CHANGELOG sem indicar atraso — significa apenas que o texto não mudou.

---

## [2.5.0] - 2026-05-24 — Sinergia ecossistema: teal → roxo

### Changed — Cor primary: teal #2DD4BF → roxo profundo #6f32b1

Marcos validou: teal nao conversa com restante do ecossistema (gold+navy Emprega+/PdV; gradient ResultX). Substituido pelo roxo profundo `#6f32b1` — **cor que JA estava documentada como gradient "Electia" no CSS bundle do empregamais.me** (`gradient #6f32b1 → #5a2890`).

**Tokens substituidos:**
- `tokens/tokens.json` — namespace `teal` → `purple`:
  - light: `#5EEAD4` → `#a55eea`
  - DEFAULT: `#2DD4BF` → **`#6f32b1`** (canonical)
  - dark: `#14B8A6` → `#5a2890`
  - muted: `#0F766E` → `#3d1a64`
- `tokens/tokens.css` — vars renomeadas `--teal-*` → `--purple-*` (BREAKING — app refactor em task #18).
- Background: `#0F1A2E` (json) / `#08080A` (css quase preto) → **`#1B2A4A`** (theme-color oficial Emprega+ — paridade total com PdV v2.5).
- Surface scale (1-4) recalibrada como escala crescente sobre nova base navy (`#1c2a4a` → `#36508f`).
- Glass scale rgba refeita pra navy (`rgba(28,42,74,*)` em 3 niveis).
- `--glow-brand` rgba: gold (196,154,60) → purple (111,50,177).
- `--gradient-brand`: teal → purple. `--gradient-teal-line` renomeado pra `--gradient-purple-line`.
- `.eyebrow` color: `var(--teal)` → `var(--purple)`.

### Fixed — Desconjunto interno tokens
- Mesma divergencia que PdV tinha (tokens.json `#0F1A2E` vs tokens.css `#08080A`) — agora unificado em `#1B2A4A`.

### Why purple?

Critérios convergem:
1. **Canonical no ecossistema**: gradient purple `#6f32b1 → #5a2890` ja documentado como cor Electia no CSS empregamais.me.
2. **Match com posicionamento**: "Electia — O sistema operacional de pessoas com IA". Roxo = cor universal de IA/tech moderna (Linear, Vercel, Anthropic, OpenAI, Cursor).
3. **Distingue ecossistema**: gold = PdV/Emprega+; gradient 5-cor = ResultX; navy = base. Roxo solido = Electia.
4. **Conversa com navy**: roxo profundo + navy escuro = combinacao premium B2B.

### Notes
- **Mantido (DNA Electia):** Sora+Inter+JetBrains Mono, glass scale 3-niveis, gradient brand, glow-brand, transitions com spring+reveal, utility classes (`.glass`, `.glow-brand`, `.text-gradient-brand`, `.hover-elevate`, `.eyebrow`).
- **Mantido (logo):** 7 SVGs canonicos em `assets/logo/` (lockup vertical, monogram, monogram-teal, wordmark, wordmark-light, wordmark-accent, short). Nota: cor "teal" no nome dos arquivos vira historico — proxima onda renomear pra "purple" + regenerar com nova cor.
- **Pendente:** logos Electia ainda usam teal `#2DD4BF` visualmente. Regerar SVGs com `#6f32b1` apos validacao.
- **Pendente:** task #18 — refactor `--teal-* → --purple-*` no app Next.js.

---

## [1.7.2] - 2026-05-20 — Harmonização de versionamento BB ↔ CHANGELOG

### Esclarecido — escopo de versionamento
- BRAND-BOOK.md ganha bloco "Escopo de versionamento" no topo distinguindo:
  - **Versão BB (§1-16 editorial):** 1.3 — texto não muda desde 11/05
  - **Versão Brand Kit (este diretório):** 1.7.1 — coberta por este CHANGELOG
- CHANGELOG.md ganha bloco "Escopo deste CHANGELOG" no topo explicitando a cobertura ampla.
- Resolve ambiguidade de leitura: leitor casual que via BB v1.3 + CHANGELOG v1.7.1 podia achar o BB desatualizado. Não está — são dois sistemas de versão com escopos distintos.

### Não alterado
- Nenhuma mudança no conteúdo editorial das §1-16 do BRAND-BOOK.
- Nenhuma mudança em tokens, mockups, wireframes, specs ou assets.
- Wordmark v1.1 (JetBrains Mono + Sora) inalterado.

---

## [1.7.1] - 2026-05-12 — Decisões D1-D6 aprovadas

### Confirmado por Marcos (6/6 defaults)
- **D1 · Engine viz:** SVG puro inline (zero lib nova)
- **D2 · Tokens:** Tailwind v4 `@theme` (centralizado em globals.css)
- **D3 · Render model:** Cards = RSC; theme toggle = Client
- **D4 · Theme switch:** `data-theme` em `<html>` + inline script anti-flash
- **D5 · BAT ACL:** Admin/gestor não vê a seção (componente retorna null)
- **D6 · Animations:** CSS keyframes puros (sem Framer)

### Status
- Spec `electia-cards-react-implementation.md` promovida 1.0 (pendente) → 1.1 (aprovada)
- Bloqueio externo único restante: **OPS-SEC liberação**
- Sprint A pode disparar assim que OPS-SEC liberar (5 dias úteis · fundação + primitives, zero acoplamento com produto sensível)
- 4 ADRs (024-027) serão registradas durante Sprint A

---

## [1.7] - 2026-05-11 — Spec implementação React/Next.js

### Adicionado
- `docs/specs/electia-cards-react-implementation.md` — sexto spec do bloco (junto aos 5 do Marsili 4T)
- Documenta arquitetura, contratos TypeScript, plano faseado (3 sprints / 20 dias úteis), riscos e divergências mockup → produção
- **6 decisões pendentes (D1-D6):** Visx vs SVG · tokens via @theme · RSC vs Client · theme switching · BAT ACL · animation engine
- **Recomendações fechadas:** SVG puro inline · `@theme` Tailwind v4 · cards RSC · `data-theme` em html · admin não vê BAT · CSS keyframes
- 4 ADRs a registrar pós-execução (024-027)
- Mapeamento mockup ↔ component: 15 arquivos, ~4k LOC mockup → ~2.3k LOC produção (-40% via primitives compartilhadas)

### Bloqueio externo
- 🛡️ Implementação aguarda liberação de OPS-SEC
- 🚧 `<TemperamentosCard>` adicionalmente bloqueado por execução da migration Marsili (specs `electia-4t-schema-migration.md`)

---

## [1.6] - 2026-05-11 — Wireframe colaborador-page v0.5

### Promovido — Motivadores + BAT para coluna principal
- Wireframe `wireframes/colaborador-page.html` agora exibe os **7 cards via `<iframe>`** no scroll principal
- Motivadores (rank 6º): `data-completed` false → true · placeholder substituído por iframe `../mockups/motivadores-card.html` · insights IA reescritos com narrativa Executivo + 5 bullets (match 3/3, Conhecimento +5, Harmonia +15, baixo Altruísmo)
- BAT (rank 7º): `data-completed` false → true · placeholder substituído por iframe `../mockups/bat-card.html` · insights IA com narrativa Zona Atenção (58) + linha sobre ACL ADR-018 (admin não vê resultado individual)
- Pill Motivadores: "Realização · Poder" → "Executivo"
- Pill BAT: "Saudável" → "Atenção" (coerente com cenário fictício do card v0.1)
- Anchor nav: ambos passam a aparecer

### Atualizado — contadores e banner
- Banner topo: "v0.4 · 5 de 7 (DISC, MBTI, Big Five, Eneagrama, Temperamentos)" → "v0.5 · 7 de 7 (DISC, MBTI, Big Five, Eneagrama, Temperamentos, Motivadores, Bem-Estar)"
- Hero summary: "5 de 7" → "7 de 7"
- Counter Próximos testes: "5 de 7" → "7 de 7 concluídos"

### Removido — bloco "Próximos testes" (cena atual)
- Lista vazia (7/7 concluídos) · `<section hidden>` preserva estrutura pra cenários futuros (colaborador parcial)
- Comentário inline documenta: "Em produção, cada teste pendente vira um `<li data-theory=\"X\">` aqui"

### Preservado — CSS rules `data-completed="false"` (linhas 245-247)
- Regras `display: none` permanecem ativas pra suportar demonstrações de cena com testes pendentes (sem necessidade de refactor pra cenário 100% completo da cena atual)

### Estado dos 7 cards no wireframe
| Rank | Card | Status no wireframe v0.5 |
|---|---|---|
| 1 | DISC v0.1 | iframe ativo |
| 2 | MBTI v1.0 | iframe ativo |
| 3 | Big Five v0.3 | iframe ativo |
| 4 | Eneagrama v0.3 | iframe ativo |
| 5 | Temperamentos v0.5 | iframe ativo |
| 6 | **Motivadores v0.1** | **iframe ativo** ⭐ |
| 7 | **Bem-Estar v0.1** | **iframe ativo** ⭐ |

---

## [1.5] - 2026-05-11 — Card Motivadores v0.1

### Adicionado
- `mockups/motivadores-card.html` — sétimo (e último) card de teoria comportamental do Electia
- Padrão dimensional ranked-bar (igual Big Five) com Ideal × Realizado **lado a lado** (não sobrepostos)
- Layout: 2 colunas top-3 (Cargo · Você) + match-arrows tracejadas entre rankings idênticos + tabela completa 6×Δ abaixo
- Cores próprias por motivador (`--mot-conhecimento`, `--mot-altruismo`, `--mot-economico`, `--mot-reconhecimento`, `--mot-harmonia`, `--mot-causa`) saturadas estilo Adioma
- Hero "Executivo" — perfil composto dos 2 mais altos (Econômico + Reconhecimento)
- Match-badge ✓ · compare-row · narrative · CTA "Saiba mais →" · sr-only table — anatomy completa do padrão
- ViewBox 600×270 (mais baixo que os outros — bar ranked precisa altura, não largura)

### Reconciliado — DESIGN-SYSTEM.md §8
- "10 valores" → "6 valores" (motivadores Electia: Conhecimento, Altruísmo, Econômico, Reconhecimento, Harmonia, Causa)
- Geometria: "Bar ranked horizontal" → "Bar ranked horizontal **duplo** (Ideal × Realizado lado a lado)"
- Hero: "Top 3: ..." → "Executivo (perfil composto top 2)"

### Estado dos 7 cards Electia
| Card | Versão | Padrão |
|---|---|---|
| DISC | v0.1 | Tipológico — radar 4 macro |
| MBTI | v1.0 | Tipológico — wheel 3 anéis Keirsey |
| Big Five | v0.3 | Dimensional — pentagrama + polos bipolares |
| Eneagrama | v0.3 | Tipológico — wheel 9 + linhas integ/desint |
| Temperamentos (Marsili) | v0.5 | Tipológico — quadrante 2×2 + secundário |
| **Motivadores** | **v0.1** ⭐ | **Dimensional — bar ranked duplo** |
| BAT/Bem-Estar | v0.1 | Risk — gauge 3 zonas |

**7/7 cards Electia agora têm mockup standalone aprovado.** Próxima frente: wireframe `colaborador-page.html` v0.5 com Motivadores promovido pra coluna principal (sai do bloco "Próximos testes").

---

## [1.4] - 2026-05-11 — Consistência cross-card dos 6 mockups

### Padronizado — match-badge "✓ Alinhado ao cargo"
- Adicionado em `disc-card.html` e `bigfive-card.html` (faltavam — eram os 2 cards mais antigos pré-padrão)
- BAT mantido sem badge (justificado: saúde mental sem ideal individualizado)
- 5/6 cards agora com match-badge consistente

### Padronizado — CTA "Saiba mais →"
- Adicionado em `eneagrama-card.html`, `temperamentos-card.html`, `bigfive-card.html`
- 6/6 cards com CTA (BAT mantém adaptação "Conversar com saúde →")

### Padronizado — compare-row Ideal × Realizado
- Adicionado em `disc-card.html` (faltava — usava só legend + subscores)
- Cards tipológicos (DISC, MBTI, Eneagrama, Temperamentos) usam `compare-row`
- Cards dimensionais (Big Five, BAT) usam tabela compacta (decisão arquitetural mantida)

### Unificado — `--viz-card-padding: clamp(20px, 4vw, 28px)`
- BAT e DISC ajustados (eram 24-32)
- DESIGN-SYSTEM.md §5 e §9 atualizados — antes coexistiam 2 padrões
- Faixa menor cabe melhor no iframe 820×830 do wireframe colaborador

### Padronizado — tokens motion completos
- Adicionados `--viz-motion-entry-duration: 600ms` e `--viz-motion-stagger: 80ms` em BAT, MBTI, Eneagrama, Temperamentos, Big Five
- DISC já tinha
- 6/6 com mesmo conjunto de tokens motion no `:root`

### Versões reconciliadas
| Card | `<title>` antes | `<title>` depois |
|---|---|---|
| MBTI | v0.4 (mesclada) | v1.0 |
| Big Five | v0.2 | v0.3 |
| Eneagrama | v0.2 | v0.3 |
| Temperamentos | v0.4 | v0.5 |
| DISC, BAT | v0.1 | v0.1 (sem mudança) |

### Footer-notes atualizados
- 6/6 mockups agora apontam para `../docs/DESIGN-SYSTEM.md` (antes: `../design-system-v0.1.md` que não existe mais nessa estrutura)

### Corrigido — aria-desc Temperamentos
- Removida menção a "secundário conectado por linha cinza" — linha foi removida na v0.5 do mockup, mas o `<desc>` ainda mencionava

### Reconciliado — DESIGN-SYSTEM.md §3 Tipografia
- Hero number `56-72px` do spec v0.1 nunca foi adotado pelos mockups → faixas ajustadas para refletir prática real (32-44px hero text, 28-38px center number SVG)
- Adicionada linha para `Compare-row value` e `Match-badge`

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
- `templates/email/` — 4 templates Brevo (base + newsletter + product-cta + brevo-base.yaml) adaptados de PdV
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
