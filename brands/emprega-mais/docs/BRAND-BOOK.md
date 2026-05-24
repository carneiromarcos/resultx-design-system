# Brand Book — Emprega+

**Versão:** 0.3 | **Data:** 2026-05-23 | **Classificação:** Interno

> ✅ **Atualizado 2026-05-23.** Essencia (§1), Tipografia (§5), Tom e Voz (§6), Iconografia (§7) e Paleta (§4) preenchidas com material real extraido de `empregamais.me` + `previews/brand-guidelines.html`. Faltam: §3 Logo (referencia Canva DAHFDuSkSXE — 6 variantes a exportar) e §10 Origem (precisa input Marcos sobre cronologia 2022→hoje).

---

## 1. Essência da Marca

### Posicionamento oficial (empregamais.me)

> **"Emprega+ | Tecnologia para Empregabilidade"**
>
> **"A infraestrutura digital que conecta governos, empresas e profissionais para fortalecer o mercado de trabalho."**

### Tagline oficial

> **"Conectando pessoas ao trabalho certo."**

A tagline acompanha a marca em materiais institucionais. Pode aparecer abaixo do logo ou como frase de abertura em apresentacoes e LPs.

### Propósito

Emprega+ existe pra ser a **infraestrutura digital da empregabilidade brasileira** — conectando os 3 lados (governos, empresas, profissionais) num so ecossistema, ate aqui dispersos em ferramentas isoladas e processos burocraticos.

### Missao

Conectar pessoas ao trabalho certo, com transparencia e agilidade — para o gestor publico, para a empresa e para o candidato.

### Visao

Ser a infraestrutura padrao da empregabilidade no Brasil — onde prefeituras, empresas e profissionais operam empregabilidade num so lugar, com decisoes baseadas em dados.

### Promessa de Marca

> Conexao com transparencia. Decisao com dados. Resultado real — nao promessa.

### 4 frentes do ecossistema

Emprega+ se materializa em 4 produtos complementares:

| Produto | Publico | O que faz |
|---------|---------|-----------|
| **Gov / IMO B2G** | Prefeituras e governos | Portal de vagas + intermediacao mao de obra setor publico |
| **Editais / C&S** | Setor publico | Gestao completa de concursos e processos seletivos |
| **Electia B2B SaaS** | Empresas privadas | Assessments comportamentais (DISC, Big Five, MBTI, Eneagrama, Le Senne) |
| **PdV B2C** | Profissionais | Comunidade de desenvolvimento profissional (workshops, conteudo, networking) |

### Valores

| Valor | Significado |
|-------|-------------|
| **Profissional** | Linguagem que transmite competencia e seriedade, sem ser fria ou distante |
| **Acessivel** | Falamos de forma clara e direta, entendivel pelo gestor publico e pelo candidato que busca primeira vaga |
| **Otimista** | Acreditamos que tecnologia transforma empregabilidade — inspiramos acao com mensagens positivas |
| **Realista** | Nao fazemos promessas vazias. Apresentamos dados, resultados concretos e expectativas reais |

---

## 2. Arquitetura de Marca

```
Emprega+ (marca-mãe — ecossistema empregabilidade)
├── IMO         (B2G empregabilidade municipal — herda visual Emprega+)
├── Editais     (concursos públicos — herda visual Emprega+, em reformulação)
└── Electia by Emprega+  (B2B SaaS assessments — identidade própria com endosso)
```

**Regras de co-branding** (ver também `brands/README.md`):
- IMO e Editais usam visual Emprega+ direto (sem brand kit próprio)
- Electia usa identidade própria (teal + JetBrains Mono) com endosso "by Emprega+"
- PdV não é produto Emprega+ — é personal-brand separada (vive no perfil pessoal Marcos)

---

## 3. Logo e Variações

`[TBD — popular após gerar SVGs canônicos em ../assets/logo/]`

Variações esperadas (referência: `previews/brand-guidelines.html` seção "Logo e Variações"):
- Wordmark completo `emprega+`
- Variante gold sobre navy (uso padrão dark)
- Variante navy sobre branco (uso light)
- Monograma `e+` para favicons/avatares
- Versão em gradient brand

---

## 4. Paleta de Cores

Fonte canônica: `../tokens/tokens.json` e `../tokens/tokens.css`.

> ⚠️ **Canonizada 2026-05-23 alinhando ao site live `empregamais.me`** (theme-color oficial + CSS bundle). Substituiu valores extraidos do brand-guidelines.html (provavelmente outdated).

### Gold (accent — `--color-brand-*` no site)

| Token | Hex | Uso |
|-------|-----|-----|
| `--emp-gold` | `#c4993b` | Primary — CTAs, links, eyebrows |
| `--emp-gold-light` | `#d4ae54` | Hover, highlights |
| `--emp-gold-warm` | `#c49a3c` | Variante quente, contraste fundo claro |
| `--emp-gold-dark` | `#a07b2a` | Outline, borders, gradient end |

### Navy (backgrounds dark — theme-color oficial)

| Token | Hex | Uso |
|-------|-----|-----|
| `--emp-bg` | `#1B2A4A` | Page background (theme-color oficial) |
| `--emp-surface-1` | `#1c2a4a` | Cards, surfaces elevadas |
| `--emp-surface-deep` | `#0f1117` | Backgrounds profundos pontuais |

### Light surfaces (Gov, Editais, light glass)

| Token | Hex | Uso |
|-------|-----|-----|
| `--emp-light-bg` | `#FFFFFF` | Background light |
| `--emp-light-subtle` | `#f5f7f9` | Alternating sections |
| `--emp-light-muted` | `#f0f4f8` | Cards light |
| `--emp-light-border` | `#e0e6eb` | Bordas light |

### Glass effects (Light Glass — sistema oficial)

| Token | Valor | Uso |
|-------|-------|-----|
| `--emp-glass-bg` | `rgba(255,255,255,0.7)` | Background translucido |
| `--emp-glass-border` | `rgba(28,42,74,0.08)` | Borda glass |
| `--emp-glass-border-hover` | `rgba(28,42,74,0.15)` | Borda hover |

Utility: `.emp-glass` com `backdrop-filter: blur(12px)`.

### Semantic (tailwind-aligned)

| Token | Hex | Uso |
|-------|-----|-----|
| `--emp-success` | `#16a34a` | Success — badges Gov, confirmacoes |
| `--emp-error` | `#ef4343` | Erro, destructive |
| `--emp-warning` | `#d97706` | Aviso (distinto do gold da marca) |

---

## 5. Tipografia

- **Heading:** Sora (700/800)
- **Body:** Inter (400/500/600)
- **Mono:** JetBrains Mono

`[TBD — escala completa de tamanhos. Extrair de previews/brand-guidelines.html seção "Fontes e Escala Tipográfica"]`

---

## 6. Tom e Voz

> **Como a Emprega+ Fala** (cristalizado de `previews/brand-guidelines.html`)

**Profissional, acessivel e otimista — mas sempre realista.** Nossa comunicacao foca em empregabilidade, governos, empresas e desenvolvimento de carreira.

### 4 Atributos de voz

| Atributo | Significado |
|----------|-------------|
| **Profissional** | Linguagem que transmite competencia e seriedade, sem ser fria ou distante. Evitamos jargoes tecnicos desnecessarios. |
| **Acessivel** | Falamos de forma clara e direta, entendivel tanto pelo gestor publico quanto pelo candidato que busca sua primeira vaga. |
| **Otimista** | Acreditamos que a tecnologia pode transformar a empregabilidade. Inspiramos acao com mensagens positivas e motivadoras. |
| **Realista** | Nao fazemos promessas vazias. Apresentamos dados, resultados concretos e expectativas reais sobre nossos servicos. |

### Exemplos de tom por contexto

| Contexto | Exemplo |
|----------|---------|
| **Site Institucional** | "Conectamos prefeituras a profissionais qualificados, com transparencia e agilidade que o servico publico merece." |
| **Editais / C&S** | "Gerencie todo o ciclo do processo seletivo em um so lugar — da publicacao do edital ao resultado final." |
| **SaaS / Empresas (Electia)** | "Descubra o perfil comportamental dos seus candidatos antes de contratar. Decisoes baseadas em dados, nao em intuicao." |
| **Comunidade PdV** | "Seu proximo passo profissional comeca aqui. Workshops semanais, conteudo pratico e uma comunidade que cresce junto." |

### Devemos

- Usar **verbos de acao**: "conecte", "gerencie", "descubra"
- Focar em **beneficios**, nao em funcionalidades
- Incluir **dados e metricas** quando possivel
- Ser **direto e objetivo** em CTAs
- Tratar o usuario como **parceiro**

### Evitamos

- Linguagem excessivamente informal ou girias
- Promessas absolutas: "garantimos", "100% certeza"
- Tom de urgencia falsa: "ULTIMA CHANCE!!!"
- Jargoes tecnicos sem explicacao
- Linguagem que exclua ou intimide

---

## 7. Iconografia e Elementos Visuais

### Sistema de icones

- **Lucide Icons** no estilo outline (stroke).
- Cor de destaque: `--emp-gold` (`#c4993b`)
- Cor neutra: `--emp-text-muted` (`#5a6b7c`)
- Icones canonicos do brand-guidelines: `user`, `briefcase`, `file-text`, `search`, `building`, `check`, `bar-chart`

### Light Glass (efeito oficial)

Tokenizado em §4. Aplicado via utility `.emp-glass`:
```css
background: var(--emp-glass-bg);          /* rgba(255,255,255,0.7) */
border: 1px solid var(--emp-glass-border); /* rgba(28,42,74,0.08) */
backdrop-filter: blur(12px);
```

### Gradientes da marca

Brand gradient principal (gold):
```css
linear-gradient(135deg, #c4993b 0%, #d4ae54 100%)
```

Gradients por produto (tailwind-generated no site live, usados em badges/CTAs):

| Produto | Gradient |
|---------|---------|
| Gov / IMO B2G | green: `#16a34a → #0d7a30` |
| Editais C&S | cyan: `#0891b2 → #0e7490` |
| Electia | purple: `#6f32b1 → #5a2890` |
| Marca-mae / PdV | gold: `#c49a3c → #a07b2a` |
| Institucional | blue: `#1d4ed8 → #1540b0` ou `#4f46e5 → #4338ca` |

### Galeria visual

8 dashboards renderizados em `../mockups/dashboards/`:
- `dashboard.png` · `login.png` · `candidatos.png` · `employer-jobs.png` · `employer-job-applicants.png` · `triagem.png` · `404.png` · `positioning-wheel-demo.png`

Regerar com `node scripts/render-dashboards.mjs` (no design-system root).

---

## 8. Aplicações

`[TBD]` — Site, app, materiais impressos, eventos. Referência: seção "Aplicações da Marca" em previews.

---

## 9. Diretrizes Fotográficas

`[TBD]` — Estilo de imagens, pessoas, contexto. Já existe seção "Diretrizes Fotográficas" em previews.

---

## 10. Origem da Marca

`[TBD]` — História da Emprega+ (fundada 2022, B2C/B2G empregabilidade, etc).
