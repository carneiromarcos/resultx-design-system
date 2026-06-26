# Electia Design System — v2.0

**Versão:** 2.0 (purple refactor) | **Data:** 2026-05-27 | **Status:** Canônico

**Escopo:** Sistema de visualização e UI do produto Electia (assessments comportamentais). Foco em cards de teoria, anatomia de relatórios e tokens de produto.

**Audiência:** equipe de produto + agente que implementa.

**Cross-references:**
- **Tokens canônicos:** `../tokens/tokens.css` e `../tokens/tokens.json` — paleta purple + escalas de fundo, bordas, texto, motion. Sempre que houver conflito entre este doc e os tokens, **os tokens prevalecem** (eles são a source of truth executável).
- **Brand Book:** `BRAND-BOOK.md` (v2.0) — voz, posicionamento, arquétipo, regras de uso visual.
- **DS root (multi-brand):** `../../../DESIGN-SYSTEM.md` (ResultX DS v2.1.1) — fundação compartilhada entre PdV, Electia, IMO. Electia herda tokens base e adiciona overrides de marca.

---

## 0. Tokens canônicos

**Fonte da verdade:** `tokens/tokens.json` (W3C Design Tokens format) → gera `tokens/tokens.css` no build.

Principais grupos:
- `color.purple` — `#a55eea` (light) / `#6f32b1` (DEFAULT/accent-primary) / `#5a2890` (dark) / `#3d1a64` (muted) / `#c084fc` (on-dark — texto/ícone/borda roxo sobre fundo escuro, 7.1:1 vs `#0B0E14`, nunca fill de botão)
- `color.bg` — `#0B0E14` (base, grafite canonical — navy `#1B2A4A` aposentado 26/06) → `#161B26` (surface-1/card) → `#1C2333` (surface-2/card-hover) → `#232B3B` → `#2A3444` (= border)
- `color.text` — `#E6EDF3` (primary) / `#8B949E` (secondary) / `#6E7681` (muted)
- `color.border` — `#2A3444` (default) / `#6f32b1` (focus ring purple)
- `color.semantic` — success `#22C55E` / warning `#F59E0B` / danger `#EF4444`
- `color.theory` — 6 cores (DISC azul, Tipologia Cognitiva roxo, Eneagrama âmbar, Big Five verde, Le Senne rosa, Motivadores ciano)
- `motion.duration` — 200ms / 400ms / 600ms / 1200ms
- `motion.easing` — `cubic-bezier(0.16, 1, 0.3, 1)` (spring-out, padrão)

**Como usar no app:**
```css
@import 'resultx-design-system/tokens';
@import './tokens/tokens.css'; /* override Electia em cima do DS base */
```

```tsx
<div style={{ color: 'var(--purple)', background: 'var(--bg)' }} />
```

---

## 1. Anatomy do card

```
┌──────────────────────────────────────────┐
│ [icon] Nome da Teoria       [?] tooltip  │  ← header (24px)
├──────────────────────────────────────────┤
│                                          │
│         HERO NUMBER / PATTERN            │  ← display 48-72px
│           "Catalisador"                  │     subtitle 14px muted
│                                          │
│         ┌──────────────┐                 │
│         │              │                 │
│         │   VIZ SVG    │                 │  ← 40-60% do card
│         │              │                 │
│         └──────────────┘                 │
│                                          │
│  D72   I58   S41   C39                   │  ← subscores tabular
│  ───   ───   ───   ───                   │     (4-10 conforme teoria)
│                                          │
│  "Perfil predominante em D, alinhado     │  ← narrativa 2-3 frases
│   ao alvo do cargo Comercial Sr."        │
│                                          │
│           [ Saiba mais →  ]              │  ← CTA secundário
└──────────────────────────────────────────┘
```

**Layout responsivo:**
- Mobile (<640px): coluna única, viz reduz para 280×280
- Tablet (640-1024px): coluna única, viz cresce para 360×360
- Desktop (>1024px): opcional 2 colunas (viz esquerda / dados+narrativa direita) só em telas full

---

## 2. Color zones — 3 sistemas distintos

### A. Neutral (DISC, MBTI, Big Five, Eneagrama, Temperamentos, Motivadores)

Todos perfis são **válidos** — não há "bom" ou "ruim". Usa `THEORY_COLORS` já existente em produção:

| Teoria | Cor base |
|---|---|
| DISC | blue |
| MBTI | purple |
| Eneagrama | amber |
| Big Five | green |
| Temperamentos | rose |
| Motivadores | cyan |

**NUNCA** verde/vermelho aqui. Mata o discurso "todo perfil tem força".

### B. Match zones (só em comparativo cargo × colaborador)

| Estado | Light | Dark | Significado |
|---|---|---|---|
| Within target | `oklch(60% 0.18 145)` (verde sóbrio) | `oklch(70% 0.16 145)` | Dentro da faixa do cargo |
| Near target (±10pp) | `oklch(70% 0.15 75)` (âmbar) | `oklch(78% 0.13 75)` | Próximo, atenção branda |
| Off target | `oklch(58% 0.18 25)` (rose, NÃO vermelho puro) | `oklch(70% 0.16 25)` | Fora |
| No target | `oklch(70% 0 0)` (cinza neutro) | `oklch(50% 0 0)` | Sem alvo definido |

### C. Risk zones (BAT, CBI — saúde mental, UX delicado)

Gauge com 3 zonas explícitas, jamais ranqueamento competitivo:

| Zona | Light | Dark |
|---|---|---|
| Saudável | `oklch(60% 0.10 195)` (teal sóbrio) | `oklch(72% 0.10 195)` |
| Atenção | `oklch(72% 0.13 75)` (âmbar) | `oklch(78% 0.13 75)` |
| Risco | `oklch(58% 0.18 25)` (rose) | `oklch(70% 0.16 25)` |

Acompanhado SEMPRE de copy psicológicamente segura ("merece atenção", não "você está em risco").

---

## 3. Tipografia de número

| Função | Size | Weight | Tracking | Feature |
|---|---|---|---|---|
| Hero pattern (texto) | 32-44px | 600 | -0.02em | — |
| Hero number / center number (SVG) | 28-38px | 600-700 | -0.03em | `tnum` |
| Subscore | 18-22px | 500-600 | -0.01em | `tnum` |
| Subscore label | 10-12px | 500-600 | 0.04-0.06em (uppercase) | — |
| Axis label viz | 9-13px | 500-700 | 0 | — |
| Narrativa | 13-14px | 400 | 0 | — |
| Compare-row value | 14-15px | 600 | -0.01em | `tnum` |
| Match-badge | 12px | 600 | 0 | — |

**Nota (2026-05-11):** faixas reconciliadas com os 6 mockups aprovados (v0.5 Temperamentos, v1.0 MBTI, v0.3 Big Five/Eneagrama, v0.1 DISC/BAT). Hero number 56-72px do spec v0.1 não foi adotado nos mockups — escala maior dominaria o viz no iframe 820×830 do wireframe colaborador.

**Regras:**

- `font-feature-settings: "tnum" 1` em todo número comparativo (alinha colunas)
- Fonte: Inter (já no Electia) — não trocar
- Negative space: nunca menos de 16px ao redor do hero number
- Display de números nunca em italic, nunca decorativo

---

## 4. Motion

| Token | Valor | Uso |
|---|---|---|
| `--viz-motion-entry-duration` | 600ms | Aparição inicial do viz |
| `--viz-motion-entry-ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | Ease-out-expo, "respiração" |
| `--viz-motion-stagger` | 80ms | Delay entre eixos do radar |
| `--viz-motion-hover` | 150ms | Tooltip e highlight |
| `--viz-motion-counter` | 1200ms | Contagem do número (opcional, off por default) |

**Sequência de entrada padrão (radar):**

1. 0ms — card opacity 0→1 + translateY 8px→0 (200ms)
2. 100ms — grid lines fade-in (300ms)
3. 200ms — axes labels (cada uma com stagger 80ms)
4. 400ms — polygon path stroke draw (600ms)
5. 800ms — pills/dots aparecem (200ms)
6. 1000ms — narrativa fade-in (300ms)

**Reduce motion:** TUDO em 0ms exceto opacity (preserva clareza). Counter desliga sempre.

**Banido:**

- Rotação contínua / pulsação infinita
- "Bounce" / spring overshoot (não combina com peso clínico do conteúdo)
- Parallax no viz
- Animação ao scroll que não comunique (cosmética é distração)

---

## 5. Card surface + elevation

```css
--viz-card-padding: clamp(20px, 4vw, 28px);
--viz-card-radius: 16px; /* alinhado ResultX DS v2.1 */
--viz-card-bg-light: oklch(98.5% 0 0);
--viz-card-bg-dark: oklch(16% 0 0);
--viz-card-border-light: 1px solid oklch(92% 0 0);
--viz-card-border-dark: 1px solid oklch(22% 0 0);
--viz-card-shadow-light: 0 1px 2px oklch(0% 0 0 / 0.04), 0 4px 12px oklch(0% 0 0 / 0.06);
--viz-card-shadow-dark: 0 1px 2px oklch(0% 0 0 / 0.3);
```

**Nota (2026-05-11):** padding `clamp(20px, 4vw, 28px)` unificado a partir de duas opções coexistentes (24-32 vs 20-28). Faixa menor cabe melhor no iframe 820×830 do wireframe colaborador e foi a já adotada por 4/6 mockups.

---

## 6. Estados

| Estado | UX |
|---|---|
| **Loading** | Skeleton shimmer (já no Electia) — placeholder do shape do viz, não spinner genérico |
| **Empty** (n=0 aplicações) | Ícone outline neutro + "Aguardando aplicação do teste" + CTA "Aplicar agora" |
| **Insufficient data** (n<mín teórico) | Banner discreto topo: "Resultado parcial — recomenda-se reaplicar" — viz aparece com `opacity: 0.6` |
| **Error** | Card branco + ícone alerta + "Não foi possível calcular" + "Reportar problema" — não exibir SVG quebrado |
| **No target** (sem perfil de cargo) | Viz aparece sem zona de alvo, subtitle: "Defina um perfil de cargo para comparar" |

---

## 7. Acessibilidade (não-negociável — Electia é WCAG AA)

```html
<svg role="img" aria-labelledby="disc-title-{id} disc-desc-{id}">
  <title id="disc-title-{id}">Perfil DISC do colaborador</title>
  <desc id="disc-desc-{id}">
    Predominância em Dominância (72), seguido de Influência (58),
    Estabilidade (41) e Conformidade (39). Alinhado ao cargo Comercial Sr.
  </desc>
  ...
</svg>
<table class="sr-only">{dados brutos}</table>
```

- Contraste mín 3:1 em linhas do radar (não-textual)
- Contraste mín 4.5:1 em labels e números
- Não depende só de cor — match zones têm padrão hatch/dotted alternativo
- Focus ring visível em hovers interativos
- Tooltip acessível via teclado (Tab + Enter)

---

## 8. Mapping por teoria — quais tokens cada uma puxa

| Teoria | Color sys | Geometria | Hero | Notes |
|---|---|---|---|---|
| DISC | Neutral (blue) + Match (se cargo) | Radar 4 macro + 12 sub | "Catalisador" | 16 axes hierárquicos |
| MBTI | Neutral (purple) | 4 sliders bipolares | "ENTJ" | Bipolar ≠ radar |
| Big Five | Neutral (green) | Pentagrama | "Aberto/Estável/..." | 5 axes ortogonais |
| Eneagrama | Neutral (amber) | Radar 9 + linhas integ/desint | "Tipo 8 — w7" | Geometria nativa da teoria |
| Temperamentos | Neutral (rose) | Quadrante 2×2 | "Sanguíneo dominante" | Categórico, não radar |
| Motivadores | Neutral (cyan) + Match (top-3) | Bar ranked horizontal duplo (Ideal × Realizado lado a lado) | "Executivo" (perfil composto top 2) | 6 valores ordinais; perfil composto pelos 2 mais altos |
| BAT/CBI | **Risk system** | Gauge zonas | "Saudável / Atenção / Risco" | UX delicado, narrativa cuidadosa |

---

## 9. Tokens novos a adicionar ao DS Electia

```css
:root {
  /* Card surface */
  --viz-card-padding: clamp(20px, 4vw, 28px);
  --viz-card-radius: 16px;

  /* Match zones (comparativo) */
  --viz-match-on:    oklch(60% 0.18 145);
  --viz-match-near:  oklch(70% 0.15 75);
  --viz-match-off:   oklch(58% 0.18 25);
  --viz-match-empty: oklch(70% 0 0);

  /* Risk zones (saúde mental) */
  --viz-zone-healthy:   oklch(60% 0.10 195);
  --viz-zone-attention: oklch(72% 0.13 75);
  --viz-zone-risk:      oklch(58% 0.18 25);

  /* Grid + structure */
  --viz-grid:        oklch(85% 0 0 / 0.4);
  --viz-axis-label:  oklch(45% 0 0);
  --viz-target-band: oklch(60% 0.18 145 / 0.12);

  /* Motion */
  --viz-motion-entry-duration: 600ms;
  --viz-motion-entry-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --viz-motion-stagger: 80ms;
  --viz-motion-hover: 150ms;
}

[data-theme="dark"] {
  --viz-match-on:    oklch(70% 0.16 145);
  --viz-match-near:  oklch(78% 0.13 75);
  --viz-match-off:   oklch(70% 0.16 25);
  --viz-zone-healthy:   oklch(72% 0.10 195);
  --viz-zone-attention: oklch(78% 0.13 75);
  --viz-zone-risk:      oklch(70% 0.16 25);
  --viz-grid:        oklch(40% 0 0 / 0.4);
  --viz-axis-label:  oklch(70% 0 0);
  --viz-target-band: oklch(70% 0.16 145 / 0.15);
}
```

---

## 10. Stack recomendada

**Visx (Airbnb)** + base SVG do stash já existente.

Por quê:

1. Aproveita 100% o que está em `feature/disc-comparative-radar` stash (`geometry.ts` continua sendo a verdade — Visx só adiciona primitives `<Group>`, `<Polygon>`, `<Axis>`, `<Annotation>`)
2. Theory-agnostic real — DISC (radar), MBTI (sliders), Eneagrama (radar+linhas), Motivadores (bar) compartilham primitives, não código duplicado
3. SSR nativo no Next 16 (hydration leve)
4. SVG inline → screenshot/PDF vetorial perfeito (Puppeteer, react-pdf, Playwright print)
5. Bundle: tree-shakable (~20-40kb gzipped vs ApexCharts ~120kb)

**Trade-off:** mais código que Nivo. Mas Marcos não escreve. Custo zero pro decisor, ganho permanente em fidelidade visual.

**Alternativa B:** Nivo — componentes prontos, velocidade alta, mas todas teorias com mesma cara Nivo.
**Alternativa C:** Continuar SVG custom puro — máxima fidelidade ao mockup HUD, sem comunidade pra resolver edge cases.

**Não recomendo:**

- ApexCharts (já instalado) — manter pra KPIs internos, não pra perfil comportamental
- Recharts 3 — fraco em radar/custom geometry
- Chart.js — Canvas only mata PDF vetorial
- D3 puro — escrever do zero a integração React 19/RSC é dor desnecessária

---

## Checklist de aprovação Marcos

- [ ] Anatomy do card aceitável (header / hero / viz / subscores / narrativa / CTA)
- [ ] Color zones com 3 sistemas distintos faz sentido
- [ ] Tipografia de número (Inter + tnum + tracking negativo) ok
- [ ] Motion 600ms ease-out + stagger 80ms ok
- [ ] Banidos (rotação infinita, bounce, parallax) ok
- [ ] Mapping por teoria condizente
- [ ] Stack Visx aprovada (ou pediu comparativo de produto antes)
- [ ] Tokens nomeados aceitáveis (`--viz-*` prefix)
