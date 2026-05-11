# Brand Book — ResultX

**Versão:** 0.1 (inicial) | **Data:** 2026-05-11 | **Classificação:** Interno

> ⚠️ **Status: rascunho inicial.** Muitos campos marcados `[TBD]` (to-be-defined). ResultX e a marca de consultoria — o brand kit aqui esta em fase de bootstrap. Refinar com Marcos quando a estratégia de canais (LinkedIn empresa + newsletter) estiver mais madura.

---

## 1. Essência da Marca

### Propósito

ResultX e a consultoria de **transformação digital** fundada por Marcos Carneiro. Atende PMEs e grandes operações brasileiras desde 2012, ajudando empresas a destravar produtividade e tomada de decisão com tecnologia, dados e gestão de pessoas.

### O que ResultX faz

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

### Status

- ✅ **Logo existe** (Marcos confirmou em 2026-05-11)
- 🟡 Logo precisa ser hospedado em `brands/resultx/assets/logo/` seguindo workflow do DS

### Spec inicial

`[TBD]` — apos hospedagem dos arquivos, documentar aqui:
- Versoes (full, monogram, micro, inverted, email-header)
- Cores do logo
- Área de protecao
- Usos proibidos

Vide `assets/logo/README.md` para lista de arquivos esperados.

---

## 4. Paleta de Cores

### Status

`[TBD]` — não definida formalmente. Sugestoes para discussão:

| Direcao | Cor primária | Vibe |
|---------|--------------|------|
| **Premium consultoria** | Navy profundo `#0F1A2E` + accent platinum `#C5C5CD` | Conservador, premium, sereno |
| **Tech moderna** | Dark `#0B0E14` + accent ciano `#0EA5E9` | Tech, tras associacao Emprega+ |
| **Resultado ousado** | Black `#000` + accent red `#DC2626` | Confronto, impacto |

Recomendo iniciar com **Tech moderna** pela coerência com o restante do ecossistema (DS root usa Dark+Teal). ResultX poderia usar Dark + variante azul ciano pra se distinguir de Electia (teal).

### Cores de fundo, texto e bordas

Herda do DS root (`tokens/tokens.css` raiz) que já define escalas dark/light, surfaces, text scales. Sem override por enquanto.

---

## 5. Tipografia

Herda do ecossistema:
- **Sora** (display/headings) — pesos 600, 700, 800
- **Inter** (body/UI) — pesos 400, 500, 600

Sem fonte própria até decisão de marca.

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
| **Site institucional** | ✅ Existe | URL: `[TBD confirmar]` |
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
| URL | `[TBD confirmar dominio oficial]` | — |
| Slogan | `[TBD]` | — |

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
