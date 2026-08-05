# ResultX Design System — Hub

> Multi-product, multi-brand, multi-theme design system do ecossistema **ResultX**.
> Atende: ResultX (consultoria), Emprega+ (empregabilidade), Electia (B2B SaaS), PdV (personal-brand Marcos).
> Atualizado em 2026-05-23.

---

## 🚪 Por onde entrar

| Voce quer... | Va para |
|---|---|
| Entender a hierarquia de marcas | [`brands/README.md`](brands/README.md) |
| Filosofia + tokens + componentes do DS | [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) (14 secoes, v2.1.1) |
| Brand book de uma marca especifica | `brands/{marca}/docs/BRAND-BOOK.md` |
| Tokens W3C de uma marca | `brands/{marca}/tokens/tokens.json` |
| Logos canonicos | `brands/{marca}/assets/logo/` |
| Templates de redes sociais (PNGs prontos) | [`templates/social-media/`](templates/social-media/) |
| Renderer Playwright (HTML→PNG) | [`render-templates.mjs`](render-templates.mjs) |
| Tokens compilados pra consumir em JS/TS | [`dist/tokens.ts`](dist/tokens.ts) |

---

## 🏛️ Hierarquia de marcas

```
👤 Marcos Carneiro
│
├─ 💼 ResultX                    Consultoria · entidade legal CNPJ
│
├─ 🟢 Emprega+                   Marca-mae empregabilidade · gold+navy
│   ├─ 🟢 IMO          ─── herdam visual Emprega+ (sem brand kit proprio)
│   ├─ 🟢 Editais      ─┘
│   └─ 🔷 Electia by Emprega+    Unico produto com identidade propria · teal+mono
│
└─ 🟡 PdV (Profissional de Valor)  Personal-brand do Marcos
```

Detalhes em [`brands/README.md`](brands/README.md).

---

## 📁 Estrutura do hub (reorganizada 2026-05-24)

```
design-system/
├── DESIGN-SYSTEM.md           ← filosofia + tokens base + componentes (canonico)
├── README.md                  ← voce esta aqui (porta de entrada)
├── CHANGELOG.md               ← mudancas estruturais do hub
│
├── tokens/                    ← tokens base + 5 themes opt-in
│   ├── tokens.json            ← W3C Design Tokens Community Format
│   ├── tokens.css             ← CSS custom properties
│   ├── base/tokens-base.css
│   └── themes/                ← dark, light, premium-light, sober-dark, vibrant-dark
│
├── components/                ← componentes reutilizaveis cross-brand (CSS)
│
├── brands/                    ← 4 brand kits (1 pasta por marca)
│   ├── README.md              ← arquitetura de marca (hierarquia, paletas, co-branding)
│   ├── resultx/               ← consultoria · paleta gradient 5-cor · Poppins+Roboto
│   ├── emprega-mais/          ← marca-mae · gold+navy · Sora+Inter
│   ├── electia/               ← B2B SaaS · roxo+navy · Sora+Inter+JBMono
│   └── pdv/                   ← personal-brand Marcos · sincronizada Emprega+
│
├── demos/                     ← demos full-page (dashboard, login, candidatos, ...) — antes era `pages/`
│
├── templates/                 ← outputs renderizados (social + email cross-brand)
│   └── social-media/          ← templates social renderizados
│
├── scripts/                   ← scripts de build/render — antes `render-templates.mjs` ficava na raiz
│   ├── render-templates.mjs   ← Playwright HTML→PNG (social-media templates)
│   ├── render-dashboards.mjs  ← Playwright HTML→PNG (demos/ → brands/X/mockups/)
│   ├── build-tokens.js        ← compila tokens
│   └── bundle-analysis.js
│
├── dist/                      ← outputs compilados (tokens.ts, tokens.theme.css, theme-toggle.js)
├── docs/                      ← documentacao adicional
│   ├── viewer.html            ← viewer interativo do DS — antes `docs-viewer.html` na raiz
│   ├── components/            ← docs de componentes
│   └── tokens/                ← docs de tokens
└── tests/                     ← Playwright + visual regression
```

---

## 📐 Estrutura padrao por marca (`brands/{marca}/`)

Padrao canonico estabelecido em **Electia** (referencia) e **PdV** (segunda referencia):

```
{marca}/
├── tokens/
│   ├── tokens.json            ← W3C DTCG (source-of-truth dos valores)
│   └── tokens.css             ← CSS vars com prefixo da marca
├── docs/
│   ├── BRAND-BOOK.md          ← essencia, voz, paleta, tipografia, aplicacoes
│   ├── CHANGELOG.md           ← Keep a Changelog
│   ├── DESIGN-SYSTEM.md       ← (opcional) tokens, componentes, padroes
│   ├── IMAGE-PROMPTS.md       ← (opcional) prompts pra IA generativa
│   ├── MOTION-GUIDE.md        ← (opcional) animacoes, transicoes, easing
│   └── SOCIAL-MEDIA-GUIDE.md  ← (opcional) 9 secoes: dimensoes, PAID, pipeline Make+Notion, templates
├── assets/
│   └── logo/                  ← SVGs/PNGs canonicos (source-of-truth)
├── previews/                  ← HTMLs navegaveis (organizados por categoria — reorganizado 2026-05-24)
│   ├── logos/                 ← variants.html, purple-v2.5.html, concepts-v2/
│   ├── brand-book/            ← index.html, aurora-hero.html
│   ├── gradients/             ← options-2026-05-24.html
│   ├── prototypes/            ← protótipos
│   ├── visual-language/       ← visual language demos
│   └── _archive/              ← versões antigas (v1, v2)
├── templates/
│   └── email/                 ← (opcional) base + newsletter + product-cta + Brevo YAML
├── mockups/                   ← (opcional) cards HTML demo + dashboards/ (PNGs renderizados)
└── wireframes/                ← (opcional) low-fi HTML
```

**Estado atual:**

| Marca | tokens | docs/BRAND-BOOK | docs/CHANGELOG | docs (extras) | assets/logo | previews | mockups |
|---|---|---|---|---|---|---|---|
| ResultX | ⚠️ stub | ⚠️ TBDs | ✅ | ✅ 4 (templates TBDs) | ⚠️ só README placeholder | (vazio) | — |
| **Electia** | ✅ | ✅ | ✅ | ✅ 4 (DS, IMAGE, MOTION, SOCIAL) + specs/ | ✅ 7 SVGs | ✅ | ✅ 7 cards |
| **PdV** | ✅ | ✅ | ✅ | ✅ 4 (DS, IMAGE, MOTION, SOCIAL) | ✅ 18+ arquivos | ✅ | — |
| **Emprega+** | ✅ | ✅ TBDs | ✅ | ✅ 4 (templates TBDs) | ❌ | ✅ 5 HTMLs | — |

> Atualizado 2026-05-23: ResultX e Emprega+ agora com paridade estrutural completa nos 4 docs extras (DS/IMAGE/MOTION/SOCIAL). Conteudo aguarda decisoes Marcos. Detalhes em `brands/{marca}/docs/CHANGELOG.md`.

---

## 🔗 Regra de heranca — ResultX e a base

ResultX e simultaneamente (a) **entidade legal** que opera tudo e (b) uma das **marcas comerciais**. Quando ResultX tiver paleta definida, sera a **base** que outras marcas podem herdar via override.

Hoje a heranca acontece via:
1. **Themes opt-in no hub** (`tokens/themes/`) — qualquer marca pode usar `data-theme="premium-light"` etc.
2. **Tokens compartilhados no hub** (`tokens/tokens.json`) — naming `emprega-app.*` (legado — refatorar pra `base.*` ou `resultx.*` no futuro).
3. **Brand-specific overrides** em `brands/{marca}/tokens/tokens.json` — cada marca define seus proprios values com prefixo proprio (`--emp-*`, `--pdv-*`, etc).

Co-branding e regras detalhadas: [`brands/README.md`](brands/README.md) secao "Co-branding rules".

---

## 🤝 Como contribuir

- Tocou em tokens? Bump CHANGELOG da marca afetada (`brands/{marca}/docs/CHANGELOG.md`).
- Tocou em componente cross-brand? Bump `CHANGELOG.md` raiz.
- Logo novo? Add em `brands/{marca}/assets/logo/` (canonical) + atualizar `brands/README.md` secao "Logo status".
- Doc nova de brand? Seguir padrao `BRAND-BOOK.md` ou `SOCIAL-MEDIA-GUIDE.md` ja existente em `brands/electia/docs/`.
