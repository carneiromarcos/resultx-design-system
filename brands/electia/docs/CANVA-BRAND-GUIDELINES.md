# Electia — Brand Guidelines no Canva

**Versão:** v1.0 · **Data:** 2026-05-25 · **Uso:** referência operacional no Canva (cole/imprima/abra ao lado da peça que tá criando)

> Fonte canônica: `BRAND-BOOK.md` §17. Esse documento é a versão **enxuta** pra ter aberto enquanto edita no Canva.

---

## 🎨 Paleta

```
PRIMÁRIA — Purple
  #a55eea  light    → hover, highlights
  #6f32b1  DEFAULT  → CTAs, links, accents
  #5a2890  dark     → outline, borders
  #3d1a64  muted    → badges sutis

BACKGROUNDS — Grafite
  #0B0E14  base     → fundo principal toda peça dark
  #161B26  surface  → cards
  #1C2333  alt      → hover, alternating
  #232B3B  deep     → inputs

TEXTO
  #FFFFFF  white    → texto sobre grafite
  #E8E8EC  gray-100 → body importante
  #A0A0AC  gray-300 → secundário
  #5A5A66  gray-500 → metadados

SEMANTIC (só UI)
  #2D8B5C  success  → confirmação
  #B83A3A  error    → erro
  #B8862A  warning  → aviso
```

---

## 🌌 Gradients (apenas 2 oficiais)

```
B — DEFAULT (uso frequente)
  linear-gradient(135°, #6f32b1 → #2040a0)
  → CTAs principais, badges, hero text grande

C — PREMIUM (uso raro)
  linear-gradient(135°, #6f32b1 → #b29442)
  → APENAS pricing "Recomendado", upgrade, enterprise
```

⚠️ **NUNCA aplique gradient em texto pequeno** (caption, label, body). Só em texto grande ou fills.

---

## ✍️ Fontes (todas Google Fonts, nativas no Canva)

```
SORA           → headlines, eyebrows
  pesos: 600, 700, 800
  H1 hero: 76px desktop / 40px mobile
  H2 seção: 44px / 28px
  H3 título: 24px / 20px
  Eyebrow: 12px UPPERCASE letter-spacing 0.15em

INTER          → body, UI, parágrafos
  pesos: 400, 500, 600
  Body: 16px
  Subtítulo: 20px
  Small: 13px

JETBRAINS MONO → wordmark "electia", code, dados
  pesos: 400, 500, 600
  ❌ NÃO usar em copy de marketing
```

---

## 🖼️ Logos (na pasta `brands/electia/assets/logo/`)

| Contexto | Arquivo |
|---|---|
| Header dark (padrão) | `electia-wordmark.svg` |
| Header sobre branco | `electia-wordmark-light.svg` |
| Footer | `electia-wordmark.svg` (menor) |
| Favicon | `electia-monogram.svg` |
| Avatar IG/LinkedIn | `electia-monogram-purple.svg` |
| Splash apresentação | `electia-lockup-vertical.svg` |
| Mobile nav | `electia-short.svg` |
| Email header | `electia-wordmark.svg` (440×120) |

### Tamanho mínimo

- Wordmark: 120px largura
- Monogram: 32px
- Lockup: 80px altura

### Área de proteção

Margem ao redor = altura da letra "e" do wordmark. Nada invade.

---

## ✅ Faça / ❌ Não faça

### Cores

| ✅ Faça | ❌ Não faça |
|---|---|
| Roxo `#6f32b1` em CTA principal | Roxo em parágrafos longos |
| Grafite `#0B0E14` como fundo padrão | Grafite em texto sobre grafite |
| White em headlines sobre grafite | White em backgrounds grandes |
| Success/Error só funcionalmente | Verde decorativo (vai contra brand) |

### Gradients

| ✅ Faça | ❌ Não faça |
|---|---|
| Gradient B em CTA hero | Gradient em texto pequeno |
| Gradient C SÓ em premium | Gradient C decorativo |
| 1 gradient por peça (foco) | 3 gradients diferentes na mesma peça |

### Fontes

| ✅ Faça | ❌ Não faça |
|---|---|
| Sora pra headlines (peso bold) | Sora pra body (fica heavy demais) |
| Inter pra parágrafos | Outras fontes (Arial, Roboto, etc) |
| JetBrains Mono pra wordmark | JetBrains Mono em copy |

### Logos

| ✅ Faça | ❌ Não faça |
|---|---|
| Usar SVG canonical sempre | Digitar "electia" à mão |
| Cor roxa/branca canonical | Mudar cor do logo |
| Respeitar área de proteção | Texto/elemento colado no logo |
| Logo no canto (regra default) | Logo centralizado (a menos lockup proposital) |
| Variante light sobre branco | Variante dark sobre branco (some) |

---

## 🎯 Combinações prontas (template-padrão por uso)

### 1. Hero corporativo
- Fundo: grafite `#0B0E14`
- H1: white Sora 800 (palavra-chave em gradient B)
- Body: gray-100 Inter 400
- CTA: gradient B + texto branco
- Logo: wordmark canto

### 2. Quote vibrante
- Fundo: gradient B (roxo→azul)
- Headline: white Sora 700
- Tagline: white opacity 0.85 Inter 500
- Logo: wordmark branco canto

### 3. Light editorial (Gov/Editais)
- Fundo: white
- H1: grafite Sora 800
- Body: gray-500 Inter 400
- Accent: roxo `#6f32b1` em links
- Logo: wordmark-light

### 4. Dado/KPI
- Fundo: grafite
- Numeral grande: white ou gradient B (Sora 800, 120px+)
- Label: gray-300 uppercase Inter 500 + letter-spacing
- Logo: monogram canto

### 5. Premium/Recomendado
- Fundo: grafite
- Badge "RECOMENDADO": gradient C + white + glow ouro
- Resto: paleta padrão

---

## 📋 Checklist antes de exportar

- [ ] Fundo brand (grafite / branco / gradient B)?
- [ ] Roxo `#6f32b1` é o único acento? (sem verdes/azuis aleatórios)
- [ ] Fonte é Sora / Inter / JetBrains Mono?
- [ ] Gradient C só se peça é premium/upgrade?
- [ ] Texto pequeno SEM gradient?
- [ ] Logo na variante certa pro fundo?
- [ ] Logo com área de proteção respeitada?
- [ ] Contraste texto/fundo passa WCAG AA (4.5:1)?
- [ ] Sem sombras/outlines não-oficiais?
- [ ] Logo no canto (não centralizado)?

---

## 📂 Arquivos relacionados

- Brand Book completo: `BRAND-BOOK.md` §17 (canônico, mais detalhado)
- Tokens: `tokens/tokens.css` v2.5 (CSS vars)
- Logos SVG: `assets/logo/`
- Setup Canva (passo-a-passo): `CANVA-SETUP.md`

---

*Imprima esse doc e cole na mesa, ou abra em PDF lado da peça que tá criando.*
