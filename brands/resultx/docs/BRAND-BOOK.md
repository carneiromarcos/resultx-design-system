# Brand Book — ResultX

**Versão:** 0.1 (inicial) | **Data:** 2026-05-11 | **Classificação:** Interno

> ⚠️ **Status: rascunho inicial.** Muitos campos marcados `[TBD]` (to-be-defined). ResultX e a marca de consultoria — o brand kit aqui esta em fase de bootstrap. Refinar com Marcos quando a estratégia de canais (LinkedIn empresa + newsletter) estiver mais madura.

---

## 1. Essência da Marca

### Propósito

ResultX e a consultoria de **transformação digital** fundada por Marcos Carneiro. Atende PMEs e grandes operações brasileiras desde 2012, ajudando empresas a destravar produtividade e tomada de decisão com tecnologia, dados e gestão de pessoas.

### Posicionamento oficial (resultx.app)

> **"ResultX — Consultoria em Transformação Digital. Implementamos IA, reestruturamos processos e montamos squads de desenvolvimento para resultados reais."**

### Os 3 Pilares (declarados no site)

1. **Implementação de IA** — IA aplicada a problemas reais de negócio
2. **Reestruturação de processos** — diagnóstico + redesenho de operacao
3. **Squads de desenvolvimento** — times de tecnologia montados e operados pela ResultX

### O que ResultX faz (visao expandida — escopo historico)

- Diagnóstico de processos e organizacao
- Implementação de tecnologia (ERPs, automações, IA aplicada)
- Gestão de pessoas e cultura
- Operacoes (logística, financeiro, telemetria, KPIs)
- Mentoria executiva para diretores e CEOs

### Como a ResultX se diferencia

`[TBD — Marcos definir]` Sugestoes baseadas no que sei:
1. **12+ anos de operação** com PMEs brasileiras — conhecimento de campo, não academico
2. **Cases que viraram produtos** — Emprega+, PdV e Electia nasceram de necessidades reais de cliente
3. **Engenharia + estratégia** — Marcos e engenheiro de formação, traz rigor metodológico
4. **Brasil-real** — atende empresas brasileiras de médio porte que não tem acesso a McKinsey/BCG

### Missão

`[TBD — Marcos definir]` Rascunho: ajudar empresas brasileiras a transformar processos com tecnologia, dados e pessoas, sem deslumbramento por buzzwords.

### Visão

`[TBD]`

### Promessa de Marca

`[TBD]` Rascunho de direcao: "Da estratégia a execucao — sem terceirizar o pensar."

### Valores

`[TBD]` Pré-rascunho:

| Valor | O que significa |
|-------|-----------------|
| **Método** | Estrutura, processo, rigor. Nada por achismo |
| **Profundidade técnica** | Engenharia de verdade. Conhece o código, a planilha, o operacional |
| **Transformação real** | Resultado em KPI/PnL, não em PDF |
| **Independência** | Não vende ferramenta. Vende clareza |

---

## 2. Arquitetura de Marca

### Posição no ecossistema

```
ResultX (consultoria + entidade legal CNPJ)
  |
  +--- Emprega+ (marca-mae, plataforma B2B/B2G/SaaS)
  |     +--- IMO, Electia, Editais
  |
  +--- PdV (Profissional de Valor, personal-brand do Marcos)
  |
  +--- (ResultX como marca de consultoria, autônoma e separada das outras)
```

**Importante:** ResultX e simultaneamente:
- **A entidade legal** (CNPJ único) sob a qual TUDO opera
- **Uma das marcas comerciais** (consultoria de transformação digital) — autônoma, distinta de Emprega+/PdV

### Regras de uso

- O nome "ResultX" e sempre escrito com R e X maiúsculos, sem espaço (`ResultX`, nunca `Result X` ou `Resultx`)
- **Nunca usar** o nome ResultX em material de marketing de Emprega+, PdV, IMO ou Electia (cada um tem identidade própria)
- ResultX aparece em Termos, Privacidade, NF, faturamento — documentos legais — como controlador
- Em materiais de marketing da ResultX (site, LinkedIn empresa, newsletter), ResultX e a marca primária

---

## 3. Logo

### Source-of-truth atual

- **Canva master:** `DAHFnUzUpeA` (criado 2026-05-02) — [editor](https://www.canva.com/d/XIbP_lf5i76V-oB) · [view](https://www.canva.com/d/F1Pur7n4ExCrm_Z)
- **Site (favicon):** `https://resultx.app/images/logo-icon.svg`
- 🟡 Falta exportar SVGs canonicos pra `brands/resultx/assets/logo/`

### Spec visual

Wordmark **"resultx"**:
- **"result"** — sans-serif bold branco sobre navy (fonte alinhada com Poppins)
- **"X"** — desenhado em outline com **gradient 5-cor** (brand gradient oficial: blue → cyan → magenta → orange → gold)
- Fundo: navy `#0d1b2e`
- Dimensoes master: 2048×400 (banner) e 400×400 (quadrado)

### Variacoes esperadas (a exportar)

| Arquivo | Conteudo | Status |
|---------|----------|--------|
| `resultx-wordmark.svg` | Wordmark completo sobre navy | 🔴 |
| `resultx-wordmark-light.svg` | Wordmark sobre branco | 🔴 |
| `resultx-wordmark-mono.svg` | Single-color (sem gradient) | 🔴 |
| `resultx-x-monogram.svg` | "X" isolado com gradient | 🔴 |
| `resultx-favicon.svg` + `32x32.png` + `256x256.png` | Favicons | 🔴 |
| `resultx-og-cover-1200x630.png` | OG image | 🔴 |
| `resultx-linkedin-banner-1584x396.png` | Banner LinkedIn empresa (a criar) | 🔴 |

---

## 4. Paleta de Cores

Fonte canonica: `../tokens/tokens.json` e `../tokens/tokens.css` (prefixo `--rx-*`). Extraida de `resultx.app` (CSS bundle e theme-color oficial).

### Backgrounds (navy)

| Token | Hex | Uso |
|-------|-----|-----|
| `--rx-bg` | `#0d1b2e` | Page background — theme-color oficial do site |
| `--rx-surface-elevated` | `#192744` | Cards, surfaces elevadas |

### Brand Gradient 5-cor (alma da marca)

A marca ResultX se distingue do ecossistema (Emprega+ navy+gold, Electia teal, PdV gold) por usar um **gradient multi-cor** como assinatura visual. Aparece no "X" do logo e em elementos hero.

| Token | Hex | Posicao no gradient |
|-------|-----|---------------------|
| `--rx-blue` | `#2040a0` | Stop 1 — royal blue |
| `--rx-cyan` | `#00afef` | Stop 2 — cyan vibrante |
| `--rx-magenta` | `#8040a0` | Stop 3 — magenta/roxo |
| `--rx-orange` | `#c08020` | Stop 4 — laranja queimado |
| `--rx-gold` | `#b29442` | Stop 5 — ouro/amarelo dourado |

**Gradient oficial:**
```css
linear-gradient(135deg, #2040a0, #00afef, #8040a0, #c08020, #b29442)
```

### Text

| Token | Hex | Uso |
|-------|-----|-----|
| `--rx-text` | `#FFFFFF` | Texto principal sobre navy |
| `--rx-text-inverse` | `#0d1b2e` | Texto sobre fundo claro |

### Diferenciacao no ecossistema

| Marca | Cor primaria | Logica |
|-------|-------------|--------|
| **ResultX** | Navy + **gradient 5-cor** | Holding criativa/diversa — gradient simboliza diversidade de produtos |
| Emprega+ | Navy + gold | Marca-mae empregabilidade — sobria, autoridade |
| Electia | Dark + teal | Tech/ciencia — frieza analitica |
| PdV | Dark + gold (mountain) | Personal-brand — heroi/forja |

---

## 5. Tipografia

ResultX usa stack proprio (NAO Sora+Inter do restante do ecossistema). Confirmado em `resultx.app` HTML head:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
```

| Familia | Uso | Pesos disponiveis |
|---------|-----|-------------------|
| **Poppins** | Headings, display, hero, eyebrows | 300, 400, 500, 600, 700, 800, 900 |
| **Roboto** | Body, UI, captions | 300, 400, 500, 700 |

CSS vars:
- `--rx-font-heading: 'Poppins', system-ui, sans-serif;`
- `--rx-font-body: 'Roboto', system-ui, sans-serif;`

### Por que stack diferente do ecossistema?

Reforca posicionamento "ResultX e marca separada" — Emprega+/PdV/Electia compartilham Sora+Inter (alinhamento ecossistema empregabilidade). ResultX e consultoria, vive em outro campo semantico (transformacao digital B2B).

---

## 6. Tom e Voz

### Personalidade

`[TBD]` Rascunho:

| Atributo | E | Não e |
|----------|---|-------|
| **Técnico** | Profundidade real, conhece o código e o KPI | Jargao consultoria genérico |
| **Direto** | Diz o que precisa ser dito | Politicamente correto vazio |
| **Confiavel** | 12 anos de operação, cases reais | Promessas mirabolantes |
| **Independente** | Não vende ferramenta, vende clareza | Disfarcado de revendedor de SaaS |

### Exemplos de tom

`[TBD]` — escrever quando Marcos definir direcao final.

### Regras de escrita

- Portugues brasileiro
- Sem jargao corporativo vazio ("sinergia", "stakeholder", "capital humano")
- Dados concretos sobre adjetivos
- Sem superlativos sem prova

---

## 7. Aplicações

### Hoje

| Canal | Status | Notas |
|-------|--------|-------|
| **Site institucional** | ✅ Existe | URL: **resultx.app** (SPA React/Vite + Facebook Pixel + Google Fonts) |
| **LinkedIn empresa** | 🔜 A criar | Roadmap Marcos 2026-05-11 |
| **Newsletter LinkedIn (ResultX)** | 🔜 A criar | Roadmap Marcos 2026-05-11 |
| **Instagram** | ❌ Sem plano | ResultX e B2B consultoria — não precisa |
| **Email Brevo** | ❌ A definir | Se precisar, replicar templates de PdV/Electia |

### Diretrizes visuais

Quando os assets visuais existirem (logo + tokens definidos), padronizar:
- Fundo: provavelmente dark (alinhado com DS)
- Tipografia: Sora + Inter
- Tom: profissional, sereno, técnico

---

## 8. Co-branding e relações

### ResultX não se mistura com:
- **Emprega+ / IMO / Electia / Editais** — marcas comerciais autônomas do Emprega+ funnel. ResultX aparece só em Termos/Privacidade/NF
- **PdV** — personal-brand do Marcos. ResultX e empresa, não pessoa

### ResultX se relaciona com:
- **Marcos Carneiro** — CEO da consultoria. Pode aparecer como "by Marcos Carneiro" em fase inicial (ate marca própria amadurecer)
- **Cases públicos** — clientes que autorizarem podem ser referênciados em site/portfolio
- **Produtos derivados** — Emprega+, PdV, Electia sao mencionados como "produtos nascidos de consultorias da ResultX" em material institucional

---

## 9. Nomenclatura

| Termo | Grafia | Nunca usar |
|-------|--------|------------|
| Nome | ResultX | Result X, Resultx, RESULTX, ResultaX |
| URL | `resultx.app` | — |
| Slogan / tagline embutida | "resultados reais" (final da meta description) | — |

---

## 10. Roadmap do brand kit

Status atual de cada peca:

| Item | Status | Próximo passo |
|------|--------|---------------|
| Brand Book (este) | 🟡 v0.1 rascunho | Marcos preencher TBDs |
| Logo arquivos | 🔴 Pendente | Hospedar em `assets/logo/` |
| Tokens (cores, motion) | 🔴 Pendente | Definir paleta apos decisão de direcao |
| Brand Preview HTML | 🔴 Pendente | Gerar quando logo e tokens existirem |
| Email templates | 🔴 Sem plano | Só criar se Brevo entrar |
| Social Media Guide | 🔴 Pendente | Apos LinkedIn empresa criado |
| Motion Guide | 🔴 Pendente | Quando site institucional for redesenhado |

---

*Brand Book ResultX v0.1 — Marcos Carneiro · Consultoria de Transformação Digital*
*Criado em 2026-05-11. Rascunho inicial — TBDs a preencher.*
