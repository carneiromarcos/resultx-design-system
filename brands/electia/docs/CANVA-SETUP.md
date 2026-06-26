# Canva Setup — Electia by Emprega+

**Data:** 2026-05-25 | **Status:** 🟡 Pasta Electia existe — falta Brand Kit + templates

> Guia operacional pra Marcos criar Brand Kit Electia no Canva + configurar paleta, fontes, logos e templates editáveis.
> Tempo estimado: 30-45min seguindo passo-a-passo.

---

## 📂 Pasta Canva Electia

- **Pasta:** [`FAHKrfRufXE`](https://www.canva.com/folder/FAHKrfRufXE) — Electia
- **Conteúdo atual:** 1 design (`DAHKrTrl7uo` movido pra cá 2026-05-25)
- **Convenção:** TODOS os designs Electia (templates, peças sociais, posts) vivem nesta pasta. Designs novos criados no Canva devem ser movidos pra cá imediatamente.

### Designs Electia em outras pastas (mover pra cá quando puder):
- `DAHFDuSkSXE` — master logos Emprega+ + Electia (6 variantes). **Atenção:** tem Emprega+ também — decisão se move pra Electia ou cria pasta cross-brand.

---

## 📋 Pré-requisito

- Canva Pro ou Teams ativo (Brand Hub requer Pro+)
- Acesso aos arquivos locais: `~/meus-projetos/resultx/design-system/brands/electia/assets/logo/`

---

## Passo 1 — Criar Brand Kit "Electia"

1. Abre Canva → menu lateral → **Brand Hub** (ou "Brand Kit")
2. Clica **+ Criar novo Brand Kit**
3. Nome: `Electia by Emprega+`
4. Descrição (opcional): "B2B SaaS — Sistema operacional de pessoas com IA"

---

## Passo 2 — Paleta (cole/configure cada cor)

> Extraída do BRAND-BOOK Electia v2.5 (`brands/electia/docs/BRAND-BOOK.md` §4) e `tokens/tokens.css` v2.5.

### 🟣 Cores principais (roxo canonical)

| Nome no Canva | Hex | Uso |
|---|---|---|
| Purple Light | `#a55eea` | Hover CTAs, highlights |
| **Purple** ⭐ | **`#6f32b1`** | Primary — CTAs, links, eyebrows |
| Purple Dark | `#5a2890` | Outline, borders de destaque |
| Purple Muted | `#3d1a64` | Badges premium, detalhes sutis |

### 🌑 Grafite (backgrounds)

| Nome | Hex | Uso |
|---|---|---|
| **Grafite Base** ⭐ | **`#0B0E14`** | Background principal (theme-color) |
| Grafite Surface 1 | `#161B26` | Cards, surfaces elevadas |
| Grafite Surface 2 | `#1C2333` | Hover, alternating sections |
| Grafite Surface 3 | `#232B3B` | Inputs, bordas ativas |

### ⚪ Texto

| Nome | Hex | Uso |
|---|---|---|
| White | `#FFFFFF` | Headings, texto principal sobre dark |
| Gray 100 | `#E8E8EC` | Texto corpo importante |
| Gray 300 | `#A0A0AC` | Texto secundário |

### 🚦 Semantic (UI states — pouco usado em peças)

| Nome | Hex | Uso |
|---|---|---|
| Success | `#16a34a` | Confirmação |
| Error | `#ef4343` | Erro |
| Warning | `#d97706` | Aviso |

### 🌌 Brand Gradients (cole como "Gradient" no Canva)

Canva permite cores degradê em elementos:

**B — Default (Roxo → Royal Blue ResultX):**
- Stop 1 (0%): `#6f32b1`
- Stop 2 (100%): `#2040a0`
- Ângulo: 135°
- **Uso:** CTAs principais, hero text, badges destacados

**C — Premium (Roxo → Ouro ResultX):**
- Stop 1 (0%): `#6f32b1`
- Stop 2 (100%): `#b29442`
- Ângulo: 135°
- **Uso:** apenas em peças "premium/recomendado/upgrade" (raro = especial)

---

## Passo 3 — Fontes (upload ou Google Fonts)

Canva aceita Google Fonts diretamente. Adicione os 3:

| Familia | Pesos a usar | Uso |
|---|---|---|
| **Sora** | 600, 700, 800 | Headlines, títulos, eyebrows |
| **Inter** | 400, 500, 600 | Body, parágrafos, UI |
| **JetBrains Mono** | 400, 500 | Code, valores técnicos, dados |

**Como adicionar:**
1. Brand Hub → Brand Kit Electia → **Fontes**
2. Buscar "Sora" → adicionar
3. Buscar "Inter" → adicionar
4. Buscar "JetBrains Mono" → adicionar

---

## Passo 4 — Logos (upload local)

Faça upload dos 7 SVGs de `~/meus-projetos/resultx/design-system/brands/electia/assets/logo/`:

| Arquivo | Quando usar |
|---|---|
| `electia-wordmark.svg` | **Padrão** — wordmark completo (header, footer) |
| `electia-wordmark-light.svg` | Sobre fundo branco |
| `electia-wordmark-accent.svg` | Quando quer destaque do roxo |
| `electia-short.svg` | Espaço apertado (mobile nav) |
| `electia-monogram.svg` | Favicon, avatar (apenas símbolo) |
| `electia-monogram-purple.svg` | Variante monogram com fill roxo |
| `electia-lockup-vertical.svg` | Lockup vertical com "by emprega+" |

**Como uploadar:**
1. Brand Hub → Brand Kit Electia → **Logotipos**
2. Arrastar os 7 SVGs (ou upload em batch)
3. Marcar `electia-wordmark.svg` como **Logo principal**

> ⚠️ **Atenção:** Marcos vai REDESENHAR formato dos logos no Canva (proporções, distâncias). Por enquanto, esses SVGs têm cor purple correta mas formato pendente revisão.

---

## Passo 5 — Templates a criar (5 essenciais)

Crie estes 5 templates como **Brand Templates** (Canva Pro permite marcar como template).

### Template 1 — Instagram Post (1080×1080)
- **Nome:** `Electia · IG Post · Quote Navy`
- **Layout:** Grafite base + headline branca (Sora 700) + tagline gold/purple (Sora 600) + logo electia-wordmark canto inferior direito + glow purple sutil

### Template 2 — Instagram Story (1080×1920)
- **Nome:** `Electia · IG Story · Conceito`
- **Layout:** Grafite base + headline branca + ícone Lucide centralizado + CTA "saiba mais →" branco + logo canto superior

### Template 3 — LinkedIn Post (1200×627)
- **Nome:** `Electia · LinkedIn Post · B2B`
- **Layout:** Grafite + headline executiva (Sora 700) + subtítulo (Inter 500) + ícone roxo + logo electia-wordmark + faixa "by emprega+" sutil

### Template 4 — LinkedIn Banner Empresa (1584×396)
- **Nome:** `Electia · LinkedIn Banner Empresa`
- **Layout:** Grafite gradient (Grafite base → Surface 1) + logo electia-wordmark-light alinhado à esquerda + headline "Sistema operacional de pessoas com IA" à direita + accent roxo

### Template 5 — Email Header (440×120)
- **Nome:** `Electia · Email Header`
- **Layout:** Grafite base + electia-wordmark centralizado + linha roxa sutil abaixo + spacing equilibrado

### Naming convention pros templates:
```
{Marca} · {Plataforma} · {Tipo} · {Variante}

Ex:
Electia · IG Post · Quote Navy
Electia · IG Story · CTA Roxo
Electia · LinkedIn · Anúncio Vaga
Electia · Email · Newsletter Mensal
```

---

## Passo 6 — Workflow operacional (dia-a-dia)

### Pra criar peça nova:
1. Canva → Brand Templates → escolhe template Electia
2. Clica **Usar este template** → cria cópia editável
3. Edita texto/imagem (mantém paleta + fontes do Brand Kit automaticamente)
4. Exporta: **Compartilhar** → **Baixar** → PNG (qualidade alta)
5. (Opcional) Salva PNG em `~/meus-projetos/resultx/design-system/brands/electia/templates/social-output/`

### Pra ajustar template existente:
- Brand Templates é versionado — Canva guarda histórico
- Só **administradores** do Brand Kit podem editar templates (proteção)

---

## ✅ Checklist final

- [ ] Brand Kit "Electia by Emprega+" criado
- [ ] 4 cores principais adicionadas (Purple + Grafite + variantes)
- [ ] 4 surfaces grafite adicionadas
- [ ] Brand gradients B + C criados (se Canva suportar gradient salvo)
- [ ] 3 fontes adicionadas (Sora, Inter, JetBrains Mono)
- [ ] 7 logos uploadados de `electia/assets/logo/`
- [ ] `electia-wordmark.svg` marcado como principal
- [ ] Template 1 — IG Post criado
- [ ] Template 2 — IG Story criado
- [ ] Template 3 — LinkedIn Post criado
- [ ] Template 4 — LinkedIn Banner criado
- [ ] Template 5 — Email Header criado

---

## 🔗 Links relacionados

- Brand Book: `brands/electia/docs/BRAND-BOOK.md` §4 (paleta), §5 (tipografia)
- Tokens: `brands/electia/tokens/tokens.json` e `tokens/tokens.css` v2.5
- Logos: `brands/electia/assets/logo/`
- CHANGELOG: `brands/electia/docs/CHANGELOG.md` v2.5.0 (refactor purple)

---

## 🧬 Master Anatômico — passo-a-passo (PRIORIDADE)

> **Por que isso é importante:** o master atual `DAHFDuSkSXE` tem "electia" e fingerprint como **imagens fundidas** (bitmap), não elementos editáveis. O MCP do Canva pode SUBSTITUIR uma imagem inteira, mas **não consegue trocar a cor dentro de um bitmap**. Pra eu replicar/editar peças programaticamente via MCP, preciso de um master onde cada elemento é uma **camada separada e editável**.

> **Resultado:** depois de 30min seu fazendo isso, eu gero infinitas variações via MCP (paleta diferente, texto diferente, gradient diferente) sem precisar redesenhar nada.

### Passo a passo (Canva UI, ~30min)

#### 1. Criar novo design
- Canva → Criar design → Personalizado → **1080 × 1080 px**
- Salvar dentro da pasta `FAHKrfRufXE` (Electia)
- Nome: `Electia · MASTER ANATÔMICO · IG Post 1080`

#### 2. Background (1 camada)
- Inserir → Elementos → Retângulo
- Tamanho: 1080×1080 (cobre tela inteira)
- Cor de preenchimento: **`#0B0E14`** (grafite canonical)
- **NÃO** fundir com outra camada (mantém separado pra MCP poder trocar cor depois)

#### 3. Wordmark "electia" (1 camada de TEXTO, não imagem)
- Inserir → **Texto** (não "Logotipo"!)
- Digitar: `electia`
- Fonte: **JetBrains Mono** (peso Semibold/600)
- Tamanho: ~140pt
- Cor: **`#6f32b1`** (roxo canonical) — ou metade roxo metade branco se quiser bicolor
- Posição: centralizado na linha vertical média
- Letter-spacing: -0.04em (tight)
- **CRÍTICO:** mantenha como TEXTO, não converta em imagem/forma

#### 4. Tagline "by emprega+" (1 camada de TEXTO separada)
- Inserir → Texto
- Digitar: `by emprega+`
- Fonte: **Sora** (peso Regular 400 + ExtraBold 800 mix)
  - "by" em Sora Regular 400
  - "emprega+" em Sora ExtraBold 800
- Tamanho: ~20pt
- Cor: branco `#FFFFFF` com opacidade 70% (`#FFFFFF` alpha 0.7)
- Posição: abaixo do wordmark electia

#### 5. Fingerprint decorativo (1 camada de ELEMENTO/IMAGEM separada)
- Inserir → Elementos → Buscar "fingerprint" ou usar PNG/SVG da pasta atual
- Cor: tinta **`#6f32b1`** com opacidade 25-30% (sutil, no fundo)
- Posição: atrás do texto, centralizado
- Z-index: **abaixo** dos textos
- Se for SVG: pode aplicar cor via picker. Se PNG: vai precisar uploadar versão roxa

#### 6. Verificar camadas (CRÍTICO)

Canva → menu lateral → **Camadas** (ou Layers). Deve aparecer:
```
[topo]
├── Texto: "by emprega+"   ← editável
├── Texto: "electia"        ← editável
├── Imagem/SVG: fingerprint ← editável
└── Retângulo: background   ← editável (cor)
[fundo]
```

❌ **NUNCA** clique "Mesclar camadas" / "Achatar" / "Group + Flatten" / "Convert to image".
❌ **NUNCA** importe o master atual como imagem e cole — perde editabilidade.

#### 7. Salvar como Brand Template
- Canva → menu **"…"** ou compartilhar → **Salvar como Brand Template**
- Esse template fica disponível no Brand Hub pra duplicação posterior

#### 8. Me passa o design_id

Quando terminar, abra o design e copie o ID da URL:
```
https://www.canva.com/design/DAHKxxxxx/...
                            ^^^^^^^^^^ esse é o ID
```

Me passa o ID. Daí eu:
1. Confirmo que todas as camadas estão como TEXT/elementos editáveis (`start-editing-transaction`)
2. Posso replicar via `copy-design` quantas vezes quiser
3. Aplicar variações de cor automaticamente via `format_text` (cor) + `update_fill` (background)
4. Renomear, mover, exportar PNG

### Variações que vou conseguir gerar automaticamente

A partir do seu master anatômico, vou gerar variações como:

| Variação | Mudança automática (eu faço via MCP) |
|---|---|
| `Electia · IG Post · Hero Statement` | cor texto → gradient B (roxo→azul) |
| `Electia · IG Post · Quote Roxa Solid` | texto roxo sólido `#6f32b1` |
| `Electia · IG Post · Dados Light` | bg invertido → branco, texto grafite |
| `Electia · IG Post · Premium` | gradient C (roxo→ouro) em accent |
| `Electia · Story 1080×1920` | resize + reposicionamento |
| `Electia · LinkedIn 1200×627` | resize + crop |
| `Electia · LinkedIn Banner 1584×396` | resize + reposicionar logo à esquerda |
| `Electia · Email Header 440×120` | resize + simplificar |

Tudo isso **eu faço via MCP**, programaticamente, sem você precisar redesenhar cada uma.

---

## ❓ Quando precisar de ajuda

- **Cor não bate?** Compare com `brands/electia/docs/BRAND-BOOK.md` §4 — fonte canônica
- **Fonte não aparece?** Canva tem Sora/Inter/JetBrains Mono nativamente (Google Fonts)
- **Logo errado?** Veja `brands/electia/assets/logo/README.md` ou Canva master `DAHFDuSkSXE` (template kit Emprega+ + Electia 6 variantes)
- **Brand Kit ID Canva (depois de criado):** anote aqui pra eu referenciar via MCP: `kAXXX...`
