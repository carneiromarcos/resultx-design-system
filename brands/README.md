# Brand Architecture — ResultX Ecosystem

> Mapa canônico de marcas, canais e relacionamentos. Atualizado em 2026-05-11.

> Ponto de partida prático por marca: [STARTING-POINT.md](./STARTING-POINT.md)

---

## Entidade legal vs marcas comerciais

```
┌────────────────────────────────────────────────────────────┐
│ ENTIDADE LEGAL: ResultX (CNPJ único)                        │
│ Marcos Carneiro · CEO/Founder                               │
└──────────────────────┬──────────────────────────────────────┘
                       │ opera as marcas comerciais abaixo
                       ▼
┌────────────────────────────────────────────────────────────┐
│                    MARCAS COMERCIAIS                        │
└────────────────────────────────────────────────────────────┘
```

**Tudo está sob o CNPJ ResultX.** "ResultX" é simultaneamente (a) a entidade fiscal e (b) uma das marcas comerciais (consultoria em transformação digital). Não confundir.

---

## Hierarquia de marcas

```
👤 Marcos Carneiro  (pessoa · CEO · canal social pessoal)
│
├─ 💼 ResultX                       Consultoria em transformação digital
│   ├─ Site: site institucional (URL a confirmar)
│   ├─ Canais hoje: ❌ sem redes sociais
│   └─ Roadmap: criar LinkedIn (página empresa) + newsletter ResultX
│
├─ 🟢 Emprega+                      Marca-mãe · plataforma empregabilidade
│   ├─ Site: empregamais.me
│   ├─ Canais: ✅ Instagram + LinkedIn (@empregamais)
│   ├─ Identidade visual: paleta gold + navy (a verificar/canonizar)
│   ├─ Produtos que COMPARTILHAM identidade Emprega+ (sem brand kit próprio):
│   │   ├─ 🟢 IMO                  B2G empregabilidade municipal — usa visual Emprega+
│   │   └─ 🟢 Editais              Concursos públicos — usa visual Emprega+ (parado, reformulação)
│   └─ Produto com identidade PRÓPRIA (sub-brand visual distinta):
│       └─ 🔷 Electia by Emprega+  B2B SaaS · paleta teal + JetBrains Mono · brand kit próprio
│
└─ 🟡 PdV (Profissional de Valor)   Comunidade · personal-brand do Marcos
    ├─ Canais próprios: ❌ sem redes próprias
    ├─ Comunicação via canais pessoais do Marcos Carneiro
    └─ Newsletters LinkedIn (no perfil pessoal Marcos):
        ├─ "Profissional de Valor" (newsletter PdV oficial)
        └─ "Empregabilidade" (newsletter — vinculação a confirmar: PdV ou Emprega+?)
```

### Regras-chave

1. **PdV é personal-brand.** Sem CNPJ próprio aparente, sem redes próprias. O canal É o Marcos.
2. **IMO e Editais COMPARTILHAM identidade visual Emprega+.** Não têm brand kit próprio, não têm logo próprio, não têm canais próprios — herdam tudo da Emprega+.
3. **Electia é o ÚNICO produto Emprega+ com identidade visual própria.** Paleta teal + JetBrains Mono + wordmark `electia by emprega+`. Mantém endorsement "by Emprega+".
4. **ResultX é marca separada da Emprega+.** Consultoria de transformação digital — não pertence ao funil Emprega+.
5. **Co-branding "by Emprega+"** aparece em: Electia (obrigatório). NÃO se aplica a IMO/Editais (eles SÃO Emprega+, não "by").

---

## Canais sociais por marca (matriz)

| Marca | Site | Instagram | LinkedIn empresa | Newsletter LinkedIn | Personal-channel |
|-------|------|-----------|------------------|---------------------|------------------|
| **ResultX** | ✅ existe | 🔜 @resultxdigital (a criar) | 🔜 resultx (a criar) | — (sem newsletter por enquanto) | — |
| **Emprega+** | ✅ empregamais.me | ✅ @empregamais.me | ✅ empregamais | ✅ "Empregabilidade" (na conta @empregamais) | — |
| **IMO** | herda Emprega+ | herda @empregamais.me | herda empregamais | herda Emprega+ | — |
| **Editais** | herda Emprega+ | herda @empregamais.me | herda empregamais | herda Emprega+ | — |
| **Electia by Emprega+** | identidade propria, via Emprega+ | compartilha @empregamais.me | compartilha empregamais | — (tem mala direta propria) | — |
| **PdV** | ✅ profissional.empregamais.me | via @marcosxcarneirox (Marcos pessoal) | via carneiromarcos (Marcos pessoal) | ✅ "Profissional de Valor" (na conta Marcos) | ✅ Marcos pessoal |
| **Marcos Carneiro** | — | @marcosxcarneirox (canal PdV) | carneiromarcos (canal PdV) | — | — |

### TikTok, YouTube e Blogs

| Marca | TikTok | YouTube | Blog |
|-------|--------|---------|------|
| **ResultX** | — | — | — |
| **Emprega+** | — | 🔜 empregamais (a criar) | ✅ dentro do portal jobs (futuro `app.empregamais.me`) |
| **Electia by Emprega+** | — | — (sem YT) | ✅ dentro do portal jobs |
| **PdV** | @marcoscarneiro (canal Marcos pessoal) | carneiromarcos (canal Marcos pessoal) | ✅ dentro do portal jobs |

### Email marketing

| Marca | Email mkt |
|-------|----------|
| **Emprega+** | proprio |
| **Electia by Emprega+** | **mala direta propria** (canal independente do Emprega+) |
| **PdV** | proprio |
| **ResultX** | — (sem email mkt por enquanto) |

> ✅ **Decisoes resolvidas 2026-05-23** (matriz canonizada por Marcos):
> - Newsletter "Empregabilidade" pertence a **Emprega+** (conta @empregamais).
> - Newsletter "Profissional de Valor" pertence a **PdV** (na conta pessoal Marcos).
> - PdV vive em `profissional.empregamais.me` (subdominio Emprega+).
> - Marcos Carneiro nao tem site pessoal separado — sao canais sociais (carneiromarcos.*).
> - Paleta Emprega+ canonizada: gold+navy.

---

## Estado dos brand kits em `brands/`

| Brand | Pasta | Status | Versão |
|-------|-------|--------|--------|
| Emprega+ | `emprega-mais/` | 🟡 Estruturada (tokens ✅ · 5 docs com `[TBD]` · logos pendentes) — atende Emprega+ + IMO + Editais | v0.2 (2026-05-23) |
| PdV | `pdv/` | ✅ Completo | Brand Book v2.4 |
| Electia | `electia/` | ✅ Completo · logos canonicos agora em `electia/assets/logo/` (movidos do app 2026-05-23) | Brand Book v1.2 · DS v1.0 |
| IMO | (não tem) | N/A — herda Emprega+ (visual + canais) | — |
| Editais | (não tem) | N/A — herda Emprega+ (visual + canais) | — |
| ResultX | `resultx/` | 🟡 Inicial (rascunho v0.1 com TBDs) | Brand Book v0.1 (2026-05-11) |

---

## Paletas por marca

| Marca | Cor primária | Hex | Vibe |
|-------|--------------|-----|------|
| **ResultX** | (a definir) | — | Consultoria premium |
| **Emprega+** | Gold + Navy (canonizado 2026-05-23) | `#D4A928` (+ navy `#0F1A2E`) — extraido de `emprega-mais/previews/brand-guidelines.html` | Empregabilidade |
| **PdV** | Gold | `#D4A928` (+ navy `#0F1A2E`) | Forjar, montanha |
| **IMO** | — | — | Herda 100% Emprega+ |
| **Editais** | — | — | Herda 100% Emprega+ |
| **Electia** | **Teal** | `#2DD4BF` (+ dark `#0B0E14`) | Tech, ciência |

> ✅ **Paleta Emprega+ canonizada 2026-05-23.** Gold + navy confirmados extraindo de `emprega-mais/previews/brand-guidelines.html` (96KB). Tokens cristalizados em `emprega-mais/tokens/tokens.json` + `tokens.css` (prefixo `--emp-*`). PdV reutiliza o navy `#0F1A2E` como `bg.base` (descrito como "navy escuro Emprega+" no tokens.json do PdV) — confirmando que o navy e canonico do ecossistema, herdado pela personal-brand.

---

## Co-branding rules

| Combinação | Permitido? | Regra |
|------------|-----------|-------|
| **Electia + by Emprega+** | ✅ | Endosso obrigatório no footer + canais Emprega+. Electia tem identidade própria mas declara herança |
| **IMO** (sozinho como nome) | ✅ | IMO é Emprega+. Visual = Emprega+. Não precisa "by Emprega+" porque ele É Emprega+ |
| **Editais** (sozinho como nome) | ✅ | Idem IMO — é Emprega+, visual = Emprega+ |
| **PdV + by Emprega+** | ❌ | PdV é personal-brand. Não usa endorsement Emprega+ |
| **PdV + by Marcos Carneiro** | ✅ | Implícito — Marcos é o canal |
| **ResultX + by Emprega+** | ❌ | ResultX é marca separada (consultoria) |
| **ResultX + by Marcos Carneiro** | ⚠️ Provisório | Até criar canais ResultX próprios |
| **Paletas misturadas** (ex: gold PdV em LP Electia) | ❌ | Cada marca com identidade visual própria mantém estanque |

---

## Logo status

| Marca | Logo existe? | Onde |
|-------|--------------|------|
| Emprega+ | ⚠️ Canva-only | Canva (logomarca-pdv emprega-mais, DAHFDuSkSXE — fonte: Sora ExtraBold 800 + "ga+" desenhado custom). **Pendente:** exportar SVGs canonicos pra `brands/emprega-mais/assets/logo/`. |
| PdV | ✅ | `brands/pdv/assets/logo/` (10+ variantes SVG/PNG + `_archive-v1-mountain/` com versao antiga) |
| ResultX | ⚠️ | (a confirmar localização — `brands/resultx/assets/logo/` so tem README placeholder) |
| Electia | ✅ | `brands/electia/assets/logo/` (7 SVGs canonicos — movidos do app 2026-05-23). App Next.js mantem copia em `resultx/electia/public/brand/` por compat. |
| IMO | — | Usa logo Emprega+ (mesma marca visual) |
| Editais | — | Usa logo Emprega+ (mesma marca visual) |

### Direção para logo Electia by Emprega+

Decisão final 2026-05-11:

- **"electia"** em **JetBrains Mono Semibold 600** (tudo lowercase)
- **"by emprega+"** em **Sora Regular 400 + Sora ExtraBold 800** (fonte oficial Emprega+)
- Logo Emprega+ original (Canva DAHFDuSkSXE) tem o "ga+" desenhado custom — no endorsement Electia usamos Sora reto
- 7 variantes SVG geradas em `brands/electia/assets/logo/`

Spec completa: `brands/electia/docs/BRAND-BOOK.md` §3 (Logo)

---

## Próximos passos sugeridos

> Atualizado 2026-05-23 apos consolidacao (Emprega+ estruturada · logos Electia canonical · 6 agents brand/design espelhados no `.antigravity`).

1. **`brands/emprega-mais/` — preencher os `[TBD]`** dos 5 docs (BRAND-BOOK §1 Essencia + §6 Tom e Voz + §10 Origem em primeiro). Estrutura ja existe; falta conteudo de Marcos.
2. **Exportar SVGs canonicos do logo Emprega+** do Canva (DAHFDuSkSXE) pra `brands/emprega-mais/assets/logo/`. Bloqueia uso em apps/emails.
3. **`brands/resultx/` — promover do stub.** Marcos preencher TBDs (paleta, tagline, URL oficial, tom de voz, hospedar logo). E a marca-mae legal — merece ser primeira-classe.
4. **Rasterizar PNGs do logo Electia** (favicon, email header/icon, OG cover) — SVGs v1 ja gerados em `electia/assets/logo/`.
5. **Confirmar com Marcos** as 2 duvidas TODO ainda em aberto:
   - Vinculo da newsletter "Empregabilidade" (PdV, Emprega+ ou ResultX?)
   - Site proprio PdV ou subpath Emprega+
6. **Refatorar `tokens/tokens.json` raiz:** renomear key `emprega-app` para `base` ou `resultx` (legado de quando o DS era app-specifico).

**Removido do roadmap:** ~~`brands/imo/`~~ e ~~`brands/editais/`~~ não serão criados — herdam 100% Emprega+ (decisão Marcos 2026-05-11).
