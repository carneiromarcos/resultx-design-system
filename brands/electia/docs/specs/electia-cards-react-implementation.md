# Spec — Implementação dos 7 Cards Electia em React/Next.js

**Versão:** 1.1 — 2026-05-12
**Status:** 🟢 spec aprovada por Marcos (6/6 decisões D1-D6 confirmadas com defaults em 2026-05-12)
**Bloqueador externo:** 🛡️ OPS-SEC vigente — implementação só pós-liberação
**Destino:** `~/meus-projetos/resultx/electia/` (Next 16 App Router · React 19 · Tailwind v4 · Supabase · Cloudflare Workers)

---

## 1. Escopo

Transformar os 7 mockups HTML standalone (`brands/electia/mockups/*.html`) e o wireframe `colaborador-page.html` v0.5 em componentes React/Next.js reutilizáveis no codebase de produção do Electia.

**Inclui:**
- 1 página principal `/employees/[id]/report` (já existe stub)
- 7 componentes de card de teoria
- 4-5 components primitivos compartilhados
- Tokens CSS migrados pra Tailwind v4 + custom properties
- Loader de dados via Supabase parallel queries
- A11y WCAG AA (não-negociável — Electia já é AA em produção)

**NÃO inclui (escopo separado):**
- PDF export (já tem `components/print/` separado)
- Link público compartilhado (rota distinta, com gate de autenticação leve)
- Variantes dashboard gestor (Tier 2 do princípio Ideal × Realizado)
- Coleta de respostas dos testes (já existe `/tests`)

---

## 2. Pré-requisitos

| # | Requisito | Status |
|---|---|---|
| 1 | 7 mockups standalone aprovados | ✅ (CHANGELOG 1.5) |
| 2 | Wireframe colaborador-page v0.5 aprovado | ✅ (CHANGELOG 1.6) |
| 3 | DESIGN-SYSTEM.md canônico v1.0 | ✅ (post audit 1.4) |
| 4 | OPS-SEC liberar implementação | ⏳ pendente |
| 5 | Decisões D1-D6 deste spec fechadas | ⏳ pendente |
| 6 | Marsili schema migration aplicada (afeta TemperamentosCard) | ⏳ pendente (specs `electia-4t-*.md`) |
| 7 | ADR-018 Bem-Estar acordada com legal (gate psicólogo, admin não vê) | ✅ snapshot 2026-05-07 |

---

## 3. Decisões aprovadas (D1-D6) — 2026-05-12

Marcos confirmou 6/6 com os defaults recomendados:

| ID | Decisão | ✅ Aprovado | Implicação técnica |
|---|---|---|---|
| **D1** | Engine de visualização | **SVG puro inline** | Zero nova lib. Helpers em `lib/viz/geometry.ts`. Porting direto dos 7 mockups. ADR-024 |
| **D2** | Estratégia de cores | **Tailwind v4 `@theme`** | Tokens centralizados via `@theme` em `globals.css`. Cards usam `text-theory-disc`, `bg-match-on/10`. ADR-025 |
| **D3** | RSC vs Client | **Cards = RSC; toggle = Client** | Cards puros (props in, SVG out). `"use client"` só em theme toggle, anchor nav e footer-actions. ADR-026 |
| **D4** | Theme switching | **`data-theme` em `<html>`** | Inline script no `<head>` aplica antes do hydrate (evita flash). Persist via cookie ou localStorage. ADR-027 |
| **D5** | BAT ACL admin/gestor | **Admin não vê a seção inteira** | Component retorna `null`. Soma-se ao gate server-side antes de renderizar. ADR-018 aplicada |
| **D6** | Animations | **CSS keyframes puros** | Zero lib. ~50-100 linhas CSS por card. `prefers-reduced-motion` já bem definido nos mockups |

**Status:** spec destravada — pronta pra execução assim que OPS-SEC liberar.

---

## 4. Arquitetura proposta

```
                        ┌──────────────────────────────┐
                        │ /employees/[id]/report (RSC) │
                        └─────────────┬────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
            ▼                         ▼                         ▼
   <CollaboratorHero/>      <SummaryGridChips/>        <AnchorNav/>  (client)
                                      │
                                      ▼
                       ┌──────────────┴──────────────┐
                       │ <TheorySection/> × 7        │
                       │  ┌──────────────┬─────────┐ │
                       │  │ <TheoryCard> │ Insights│ │
                       │  │  (variant)   │  Panel  │ │
                       │  └──────────────┴─────────┘ │
                       └─────────────────────────────┘
```

**Princípios:**
- 1 component por card de teoria (`<DiscCard>`, `<MbtiWheel>`, etc.)
- Props recebem o `*Result` tipado já existente em `lib/scoring/types.ts` + `roleTarget` opcional pro ideal × realizado
- Cards são RSC puros — sem `"use client"` exceto onde estritamente necessário
- Tokens vêm do `tokens.css` ResultX DS v2.1.1 + override Electia em `globals.css`

---

## 5. Estrutura de pastas (proposta)

```
src/
├── app/
│   └── employees/[id]/report/
│       ├── page.tsx                    # RSC · queries paralelas Supabase
│       ├── loading.tsx                 # skeleton dos 7 cards
│       └── components/
│           ├── collaborator-hero.tsx
│           ├── summary-grid.tsx
│           ├── anchor-nav.tsx          # "use client" — IntersectionObserver
│           ├── theory-section.tsx
│           ├── theory-insights.tsx
│           └── footer-actions.tsx      # "use client" — share/PDF
│
├── components/
│   ├── theory-cards/                   # 7 cards + primitives
│   │   ├── _shared/
│   │   │   ├── card-frame.tsx          # outer surface (bg, border, shadow, padding)
│   │   │   ├── card-header.tsx         # icon + title + help-tooltip
│   │   │   ├── match-badge.tsx         # ✓ Alinhado ao cargo X
│   │   │   ├── compare-row.tsx         # Ideal × Realizado (tipológico)
│   │   │   ├── score-table.tsx         # 6×Δ (dimensional)
│   │   │   ├── narrative-block.tsx     # quote-style com border-left
│   │   │   ├── cta-bar.tsx             # "Saiba mais →"
│   │   │   └── sr-only-table.tsx       # a11y dump dos dados
│   │   ├── disc-card.tsx               # radar 4 macro (16 axes hierárquico em v2)
│   │   ├── mbti-wheel.tsx              # wheel 3 anéis Keirsey + 16 ícones
│   │   ├── bigfive-card.tsx            # pentagrama + polos bipolares
│   │   ├── eneagrama-card.tsx          # wheel 9 + integ/desint
│   │   ├── temperamentos-card.tsx      # quadrante 2×2 Marsili (DEPENDE: migration 4T)
│   │   ├── motivadores-card.tsx        # bar ranked duplo top-3
│   │   └── bat-card.tsx                # gauge 3 zonas (ACL gate)
│   │
│   └── (legados — manter ou refatorar)
│       ├── charts/disc-wheel.tsx        # antigo — substituir por disc-card
│       ├── charts/match-gauge.tsx       # antigo — substituir por bat-card
│       └── charts/theory-match-bars.tsx # antigo — substituir por motivadores-card
│
└── lib/
    ├── viz/
    │   ├── geometry.ts                  # polarToCartesian, polygonPoints, getAxisStatus
    │   ├── colors.ts                    # THEORY_COLORS + match zones + risk zones
    │   └── types.ts                     # RadarData, RadarAxis, RankedItem, etc.
    ├── scoring/types.ts                 # JÁ EXISTE — fonte da verdade
    └── matching/
        └── theory-match.ts              # JÁ EXISTE
```

---

## 6. Tokens CSS — migração

### 6.1 De HTML standalone → globals.css + Tailwind v4

Atualmente os mockups têm tokens redundantes em cada `:root`. Centralizar em:

```css
/* src/app/globals.css */
@import 'tailwindcss';
@import 'resultx-design-system/tokens.css';
@import './tokens/electia-overrides.css';
@import './tokens/viz-tokens.css';     /* novo — extraído dos mockups */
```

`viz-tokens.css` agrupa:
- `--viz-card-*` (surface, padding, radius, shadow)
- `--viz-match-*` (on, near, off, empty)
- `--viz-zone-*` (healthy, attention, risk — BAT)
- `--viz-motion-*` (duration, ease, stagger, hover)
- `--viz-grid`, `--viz-axis-label`, `--viz-target-band`
- `--mot-*` (6 cores por motivador)
- `--kei-*` (12 cores Keirsey × 3 saturações)

### 6.2 Tailwind v4 `@theme`

```css
@theme {
  --color-theory-disc: oklch(58% 0.18 240);
  --color-theory-mbti: oklch(58% 0.20 295);
  --color-theory-bigfive: oklch(55% 0.13 145);
  --color-theory-eneagrama: oklch(70% 0.16 75);
  --color-theory-temperamentos: oklch(62% 0.16 10);
  --color-theory-motivadores: oklch(60% 0.14 195);
  --color-theory-bat: oklch(55% 0.12 175);

  --color-match-on: oklch(60% 0.18 145);
  --color-match-near: oklch(70% 0.15 75);
  --color-match-off: oklch(58% 0.18 25);
}
```

Cards usam: `text-theory-disc`, `bg-match-on/10`, etc.

---

## 7. Components base — interfaces TypeScript

### 7.1 `<CardFrame>`

```tsx
interface CardFrameProps {
  theory: TheoryType;             // dirige --theory inline
  ariaLabelledby: string;
  children: React.ReactNode;
  className?: string;
}
```

### 7.2 `<MatchBadge>`

```tsx
interface MatchBadgeProps {
  status: 'aligned' | 'near' | 'off' | 'no-target';
  roleName: string;               // "Comercial Sr."
}
```

### 7.3 `<CompareRow>`

```tsx
interface CompareRowProps {
  idealLabel: string;             // "ENTJ · Marechal"
  realizedLabel: string;          // "ENTJ · Marechal"
  divider?: boolean;
}
```

### 7.4 `<ScoreTable>` (padrão dimensional)

```tsx
interface ScoreTableRow {
  key: string;                    // "economico"
  label: string;                  // "Econômico"
  ideal: number;
  realized: number;
  dotColor?: string;              // CSS var ou hex
}

interface ScoreTableProps {
  rows: ScoreTableRow[];
  showDelta?: boolean;            // default true
}
```

### 7.5 `<NarrativeBlock>`

```tsx
interface NarrativeBlockProps {
  theory: TheoryType;             // border-left color
  children: React.ReactNode;      // suporta <strong>, <em>
}
```

### 7.6 `<SrOnlyTable>`

A11y — dump dos dados brutos em `<table class="sr-only">` pra screen readers.

---

## 8. 7 cards de teoria — contratos

### 8.1 `<DiscCard>`

```tsx
interface DiscCardProps {
  result: DISCResult;             // de lib/scoring/types.ts
  roleTarget?: {                  // do roles table (já no schema)
    D: [number, number]; I: [number, number];
    S: [number, number]; C: [number, number];
  };
  variant?: 'compact' | 'detailed'; // detailed = 16 axes (v2 futura)
}
```

**SVG:** viewBox 400×400, radar 4 macro. Porting do `disc-card.html` linhas 412-485.
**Animation:** stagger 80ms entre axes; polygon scale 0.85→1.

### 8.2 `<MbtiWheel>`

```tsx
interface MbtiWheelProps {
  result: MBTIResult;
  roleTarget?: { type: string };   // "ENTJ"
}
```

**SVG:** viewBox 460×460, 3 anéis (temperamento + papel + tipo). Porting de `mbti-wheel.html` linhas 239-368.
**Complexidade:** 16 paths invisíveis pra textPath + 16 ícones lucide inline via dangerouslySetInnerHTML em uma lookup table.

### 8.3 `<BigFiveCard>`

```tsx
interface BigFiveCardProps {
  result: BigFiveResult;
  roleTarget?: { O: number; C: number; E: number; A: number; N: number };
}
```

**SVG:** viewBox 600×600, pentagrama + polos bipolares. Porting de `bigfive-card.html` linhas 159-229.

### 8.4 `<EneagramaCard>`

```tsx
interface EneagramaCardProps {
  result: EnneagramResult;
  roleTarget?: { type: number; wing?: string };
}
```

**SVG:** viewBox 540×540, wheel 9 + linhas integ/desint. Porting de `eneagrama-card.html`.
**Atenção:** integration/stress arrows usam `result.stress_arrow` + `result.growth_arrow`.

### 8.5 `<TemperamentosCard>` 🚧 bloqueado por Marsili migration

```tsx
interface TemperamentosCardProps {
  result: MarsiliResult;          // schema novo — POS migration
  roleTarget?: { dominante: Element; secundario?: Element };
}

type Element = 'fogo' | 'ar' | 'agua' | 'terra';
```

**Dependência:** specs `electia-4t-schema-migration.md` + `electia-4t-instrumento.md` precisam ter sido executados primeiro. Até lá, fallback: usar `LeSenneResult` legado com `temperament-map.ts` aplicado em runtime.

### 8.6 `<MotivadoresCard>`

```tsx
interface MotivadoresCardProps {
  result: MotivadoresResult;       // já em lib/scoring/types
  roleTarget?: Partial<Record<MotivadorKey, number>>;
  layout?: 'top3-dual' | 'full-ranked';  // default top3-dual
}

type MotivadorKey = 'conhecimento' | 'altruismo' | 'economico' | 'reconhecimento' | 'harmonia' | 'causa';
```

**SVG:** viewBox 600×270 (bar ranked duplo). Porting de `motivadores-card.html`.
**Substitui** `theory-match-bars.tsx` legado.

### 8.7 `<BatCard>` 🔒 ACL ADR-018

```tsx
interface BatCardProps {
  result: BATResult;
  /** vem do useUser() na page parent — bat-card é RSC */
  viewerRole: 'self' | 'psychologist' | 'admin' | 'gestor';
}
```

**Comportamento por viewer:**
- `self`: card completo
- `psychologist`: card completo
- `admin`, `gestor`: **componente retorna `null`** — a seção inteira não renderiza no scroll (D5 confirma)

**SVG:** viewBox 360×240, gauge 3 zonas + needle. Porting de `bat-card.html`.

---

## 9. Página `/employees/[id]/report` — data flow

```tsx
// page.tsx (RSC)
export default async function ReportPage({ params }) {
  const employeeId = params.id;
  const supabase = await createServerClient();

  // Parallel queries (Promise.all)
  const [employee, role, results] = await Promise.all([
    getEmployee(supabase, employeeId),
    getEmployeeRole(supabase, employeeId),
    getAllTheoryResults(supabase, employeeId),  // 7 teorias
  ]);

  const viewerRole = await getViewerRole(supabase);  // ADR-018 gate

  return (
    <>
      <CollaboratorHero employee={employee} role={role} resultsCount={countCompleted(results)} />
      <SummaryGrid results={results} />
      <AnchorNav results={results} />

      {/* 7 sections — só renderizam se data-completed=true */}
      {results.disc && (
        <TheorySection theory="disc">
          <DiscCard result={results.disc} roleTarget={role.disc_target} />
          <TheoryInsights theory="disc" result={results.disc} />
        </TheorySection>
      )}
      {/* ... idem pras outras 5 ... */}
      {results.bat && viewerRole !== 'admin' && viewerRole !== 'gestor' && (
        <TheorySection theory="bat">
          <BatCard result={results.bat} viewerRole={viewerRole} />
          <TheoryInsights theory="bat" result={results.bat} />
        </TheorySection>
      )}

      <NextStepsBlock pending={getPending(results)} />
      <FooterActions employeeId={employeeId} />
    </>
  );
}
```

**Queries:** todas idempotentes, paralelas. ~200-400ms total no servidor.
**Cache:** `revalidate = 60` no `page.tsx` — atualização rápida sem hammering Supabase.

---

## 10. Acessibilidade (WCAG AA — não-negociável)

Por card:
- `<svg role="img" aria-labelledby="X-title X-desc">` com title + desc inline
- `<table class="sr-only">` com dados brutos
- Contraste mín 4.5:1 em labels e números; 3:1 em linhas/grids
- Focus ring visível em CTAs e tooltips
- Tooltip do `?` acessível via Tab+Enter (não só hover)
- `prefers-reduced-motion`: anima só opacity
- Cards NÃO devem depender só de cor — `data-match` + ícone/padrão pros estados

Por página:
- Heading hierarchy: `h1` colaborador → `h2` cada teoria → `h3` insights
- `<nav aria-label="...">` na anchor nav
- Skip link "Pular para conteúdo principal"
- `lang="pt-BR"` no `<html>`

---

## 11. Testes

| Tipo | Framework | Cobertura mínima |
|---|---|---|
| Unit (geometria, scoring helpers) | Vitest | 90% em `lib/viz/` |
| Component (props → render snapshot) | Vitest + Testing Library | 1 spec por card, 3 cenários (ideal=realizado, ideal≠realizado, no-target) |
| A11y | jest-axe (smoke) | 0 violações em cada card no light + dark |
| E2E rota | Playwright (já no projeto) | Render full page + theme toggle + anchor nav scroll |
| Visual regression | Playwright screenshots | 7 cards × 2 themes × 3 breakpoints (320/768/1280) |

---

## 12. Plano faseado (3 sprints)

### Sprint A — Fundação (5 dias úteis)

| Dia | Entrega |
|---|---|
| 1 | Tokens CSS migration + `@theme` Tailwind v4 |
| 2 | `lib/viz/` (geometry, colors, types) — port do stash legado |
| 3 | `CardFrame`, `CardHeader`, `MatchBadge` |
| 4 | `CompareRow`, `ScoreTable`, `NarrativeBlock`, `CTABar` |
| 5 | `SrOnlyTable` + storybook (opcional) + vitest setup |

### Sprint B — 7 cards (10 dias úteis)

| Dia | Card | Complexidade |
|---|---|---|
| 1 | `<BatCard>` | baixa (gauge simples) |
| 2 | `<MotivadoresCard>` | baixa (bar ranked) |
| 3-4 | `<BigFiveCard>` | média (pentagrama + polos) |
| 5 | `<DiscCard>` | média (radar 4 macro) |
| 6-7 | `<TemperamentosCard>` (Marsili) | alta (depende migration 4T) |
| 8 | `<EneagramaCard>` | alta (wheel + integ/desint) |
| 9-10 | `<MbtiWheel>` | alta (3 anéis + 16 ícones) |

### Sprint C — Página + integração (5 dias úteis)

| Dia | Entrega |
|---|---|
| 1 | `/employees/[id]/report/page.tsx` RSC com queries paralelas |
| 2 | `<CollaboratorHero>` + `<SummaryGrid>` + chips |
| 3 | `<AnchorNav>` client + `<TheorySection>` + `<TheoryInsights>` |
| 4 | `<NextStepsBlock>` + `<FooterActions>` + ACL ADR-018 |
| 5 | A11y audit + Playwright E2E + Lighthouse |

**Total: 20 dias úteis = ~4 semanas.** Pode ser feito em paralelo se 2 agentes trabalharem (sprint B comporta divisão).

---

## 13. Riscos

| # | Risco | Mitigação |
|---|---|---|
| R1 | Marsili migration atrasa | `<TemperamentosCard>` com fallback Le Senne → Marsili runtime via `temperament-map.ts` |
| R2 | textPath inconsistente cross-browser (MBTI/Eneagrama) | Já testado nos mockups; Playwright visual regression cobre |
| R3 | Performance render 7 SVGs simultâneos | SVG inline + RSC streaming + lazy iframe não é problema; medir com Lighthouse |
| R4 | BAT ACL bypass (admin abrindo URL direta) | Server-side check em `viewerRole` antes de renderizar; teste E2E como admin |
| R5 | Theme flash on load | inline script `<head>` que aplica `data-theme` antes do React hydrate |
| R6 | Bundle bloat ao adicionar bibliotecas | D1 = SVG puro evita o problema |

---

## 14. Divergências entre mockup e implementação final

| Item | Mockup HTML | Produção React | Razão |
|---|---|---|---|
| Theme toggle | `<button>` JS local | `next-themes` ou hook próprio | Theme persiste cross-route |
| Inter font | `link` rsms.me | `next/font/google` | Performance + self-host |
| Tokens | `:root` redundante | `@theme` Tailwind v4 + `tokens.css` global | DRY + edição centralizada |
| Lucide ícones | SVG inline copiado | `import { Flame } from 'lucide-react'` | Já instalado no projeto |
| Compose `oklch(from ...)` | suportado moderno | check Tailwind v4 build — pode precisar fallback | Compat browsers antigos |

---

## 15. Decisões a serem registradas como ADRs

Quando este spec for implementado, criar:
- **ADR-024:** SVG puro (não Visx) para viz comportamental
- **ADR-025:** Tailwind v4 `@theme` como fonte de tokens
- **ADR-026:** Cards = RSC; theme toggle = Client
- **ADR-027:** `data-theme` em `<html>` (não next-themes default)

---

## 16. Próximos passos

1. ✅ **Marcos aprovou D1-D6** — 2026-05-12 (todos defaults confirmados)
2. ⏳ **OPS-SEC libera** implementação (necessário pra mexer no codebase)
3. 🟢 **Sprint A começa** — fundação + primitives compartilhados (5 dias úteis)
4. 🟢 **Sprint B em paralelo** com agentes especializados (1 card por agente, 10 dias úteis)
5. 🟢 **Sprint C** integra tudo na rota `/employees/[id]/report` (5 dias úteis)
6. 🟢 **ADRs 024-027** registradas durante Sprint A
7. 🟢 **Memória `electia-cards-react-implemented.md`** atualiza esta spec com status pós-execução

---

## Apêndice A — Mapeamento mockup ↔ component

| Mockup standalone | Component produção | LOC mockup | LOC estimado component |
|---|---|---|---|
| `disc-card.html` | `<DiscCard>` | 582 | ~280 |
| `mbti-wheel.html` | `<MbtiWheel>` | 485 | ~340 |
| `bigfive-card.html` | `<BigFiveCard>` | 472 | ~260 |
| `eneagrama-card.html` | `<EneagramaCard>` | 582 | ~320 |
| `temperamentos-card.html` | `<TemperamentosCard>` | 602 | ~310 |
| `motivadores-card.html` | `<MotivadoresCard>` | 439 | ~200 |
| `bat-card.html` | `<BatCard>` | 197 | ~140 |
| `colaborador-page.html` | `page.tsx` + 6 components | 648 | ~480 distribuído |
| **Total** | **15 arquivos** | **~4.000** | **~2.330** |

Redução LOC ~40% por extração de primitives compartilhados.
