# Brand Architecture — ResultX Ecosystem

> Mapa canônico de marcas, canais e relacionamentos. Atualizado em 2026-05-11.

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
| **ResultX** | ✅ existe | ❌ | 🔜 planejado | 🔜 planejado (ResultX) | — |
| **Emprega+** | ✅ empregamais.me | ✅ @empregamais | ✅ Emprega+ | — | — |
| **IMO** | herda Emprega+ (visual + canais) | herda Emprega+ | herda Emprega+ | — | — |
| **Editais** | herda Emprega+ (visual + canais) | herda Emprega+ | herda Emprega+ | — | — |
| **Electia** | identidade própria, via Emprega+ | via @empregamais | via Emprega+ | — | — |
| **PdV** | (a confirmar) | ❌ | ❌ | ✅ "Profissional de Valor" | ✅ Marcos pessoal |
| **Marcos Carneiro** | — | (pessoal) | ✅ pessoal | ✅ "Empregabilidade" | — |

> ⚠️ **TODO confirmar com Marcos:**
> - Newsletter "Empregabilidade" pertence a qual marca? PdV, Emprega+ ou ResultX?
> - PdV tem site próprio ou está em subpath Emprega+?
> - Paleta canônica oficial da Emprega+ (gold+navy ou outra?)

---

## Estado dos brand kits em `brands/`

| Brand | Pasta | Status | Versão |
|-------|-------|--------|--------|
| Emprega+ | `emprega-mais/` | 🟡 Legado (5 HTMLs) · **ALTA PRIORIDADE** — atende Emprega+ + IMO + Editais | — |
| PdV | `pdv/` | ✅ Completo | Brand Book v2.4 |
| Electia | `electia/` | ✅ Completo | Brand Book v1.2 · DS v1.0 · Aurora hero v1 · Logo SVGs v1 (2026-05-11) |
| IMO | (não tem) | N/A — herda Emprega+ (visual + canais) | — |
| Editais | (não tem) | N/A — herda Emprega+ (visual + canais) | — |
| ResultX | `resultx/` | 🟡 Inicial (rascunho v0.1 com TBDs) | Brand Book v0.1 (2026-05-11) |

---

## Paletas por marca

| Marca | Cor primária | Hex | Vibe |
|-------|--------------|-----|------|
| **ResultX** | (a definir) | — | Consultoria premium |
| **Emprega+** | (canonizar — provavelmente gold + navy) | — | Empregabilidade |
| **PdV** | Gold | `#D4A928` (+ navy `#0F1A2E`) | Forjar, montanha |
| **IMO** | — | — | Herda 100% Emprega+ |
| **Editais** | — | — | Herda 100% Emprega+ |
| **Electia** | **Teal** | `#2DD4BF` (+ dark `#0B0E14`) | Tech, ciência |

> ⚠️ **Paleta da Emprega+ precisa ser verificada.** Em README anterior estava "gold + navy" mas isso pode ter sido herança PdV. Pesquisar `brands/emprega-mais/brand-guidelines.html` e atualizar.

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
| Emprega+ | ✅ | Canva (logomarca-pdv emprega-mais, DAHFDuSkSXE — fonte: Sora ExtraBold 800 + "ga+" desenhado custom) |
| PdV | ✅ | `brands/pdv/assets/logo/` (10+ variantes SVG/PNG) |
| ResultX | ✅ | (a confirmar localização) |
| Electia | ✅ | `brands/electia/assets/logo/` (7 SVGs v1 gerados 2026-05-11) |
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

1. **`brands/emprega-mais/` — ALTA PRIORIDADE.** Promover legacy HTMLs a full brand kit (atende **3 produtos**: Emprega+ direto, IMO, Editais)
2. **Rasterizar PNGs do logo Electia** (favicon, email header/icon, OG cover) — SVGs v1 já gerados
3. **`brands/resultx/`** — Marcos preencher TBDs (paleta, tagline, URL oficial, tom de voz, hospedar logo)
4. **Confirmar com Marcos** as 3 dúvidas TODO ainda em aberto:
   - Vínculo da newsletter "Empregabilidade" (PdV, Emprega+ ou ResultX?)
   - Site próprio PdV ou subpath Emprega+
   - Paleta canônica Emprega+ (gold+navy? outra?)

**Removido do roadmap:** ~~`brands/imo/`~~ e ~~`brands/editais/`~~ não serão criados — herdam 100% Emprega+ (decisão Marcos 2026-05-11).
