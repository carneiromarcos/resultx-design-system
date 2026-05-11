# Electia 4T — Especificação do Instrumento Psicométrico

> **Status:** v0.1 — proposta para validação interna (2026-05-09)
> **Autor:** Equipe Electia (Orion + Marcos)
> **Referência conceitual:** Italo Marsili — "Os 4 Temperamentos" (4 humores hipocráticos modernizados)
> **Origem:** Pivot Le Senne → Marsili documentado em `electia-temperamentos-pivot-marsili.md`

## 1. Resumo executivo

Instrumento psicométrico próprio da Electia para classificar colaboradores em 4 temperamentos (Colérico, Sanguíneo, Fleumático, Melancólico) associados aos 4 elementos da natureza (Fogo, Ar, Água, Terra), com identificação de temperamento secundário (mistura) — totalizando 4 perfis puros + 12 misturas = 16 padrões distintos.

**Por que próprio:** o instrumento oficial Marsili (225 itens) é longo demais pra SaaS B2B e tem direitos autorais. O Electia 4T é construído com vocabulário corporativo brasileiro, mais curto (40 itens, 5-7 minutos), sem dependência externa.

## 2. Estrutura geral

| Parâmetro | Valor |
|-----------|-------|
| **Itens** | 40 |
| **Itens por temperamento** | 10 |
| **Formato** | Likert 1-5 (Discordo totalmente → Concordo totalmente) |
| **Tempo médio de aplicação** | 5-7 min |
| **Apresentação** | Aleatorizada, ~10 itens por tela |
| **Itens reverso** | 4 (1 por temperamento — anti-aquiescência) |

### Dimensões temáticas (cobertura)

Cada temperamento tem 10 itens distribuídos em 4 dimensões para garantir cobertura ampla:

| Dimensão | Sigla | Itens/temperamento |
|----------|-------|--------------------|
| Reação emocional (intensidade × duração) | RE | 3 |
| Estilo de decisão e ação | DE | 3 |
| Relacionamento e comunicação | RC | 2 |
| Persistência e foco | PF | 2 |

## 3. Catálogo dos 40 itens

### 🔥 Colérico — Fogo (rápido + duradouro · alta intensidade)

| # | Item | Dim |
|---|------|-----|
| C1 | Quando vejo algo errado, reajo na hora — mesmo correndo risco de conflito. | RE |
| C2 | Tenho pavio curto para situações que considero injustas. | RE |
| C3 | Decisões difíceis não me paralisam — prefiro errar agindo do que esperar. | DE |
| C4 | Lidero naturalmente, mesmo quando não sou o líder formal. | RC |
| C5 | Quando me comprometo com uma meta, vou até o fim, custe o que custar. | PF |
| C6 | Tenho dificuldade de esperar quando outros são mais lentos do que eu. | DE |
| C7 | Minhas reações intensas às vezes intimidam quem não me conhece. | RE |
| C8 | Confronto diretamente quem está errado, sem rodeios. | RC |
| C9 | Em momentos de pressão, eu fico mais focado, não menos. | PF |
| C10 | (REV) Prefiro adiar uma decisão difícil a tomar errado. | DE |

### 💨 Sanguíneo — Ar (rápido + passageiro · expansivo)

| # | Item | Dim |
|---|------|-----|
| S1 | Faço amizade com facilidade em qualquer ambiente novo. | RC |
| S2 | Mudo de assunto, projeto ou interesse com naturalidade. | DE |
| S3 | Quando algo me chateia, geralmente esqueço em pouco tempo. | RE |
| S4 | Sou conhecido(a) por trazer leveza e humor para o grupo. | RC |
| S5 | Tomo decisões rápidas no impulso e ajusto no caminho. | DE |
| S6 | Tenho dificuldade de manter foco em um projeto longo sem variar. | PF |
| S7 | Minhas emoções aparecem na hora, mas duram pouco. | RE |
| S8 | Conheço pessoas em todo lugar e gosto de sentir-me popular. | RC |
| S9 | (REV) Prefiro um pequeno grupo de amigos íntimos a muitos conhecidos. | RC |
| S10 | Costumo perceber oportunidades antes dos outros e me animar com elas. | DE |

### 💧 Fleumático — Água (lento + passageiro · calmo)

| # | Item | Dim |
|---|------|-----|
| F1 | Mantenho a calma mesmo em situações de alta pressão. | RE |
| F2 | Prefiro contornar um conflito a confrontá-lo de frente. | DE |
| F3 | Tenho paciência com pessoas e processos que demoram. | RC |
| F4 | Adapto-me bem a mudanças sem grande estresse emocional. | PF |
| F5 | Pessoas me veem como alguém estável, confiável e equilibrado. | RC |
| F6 | Faço o que precisa ser feito, sem grande agitação ou drama. | PF |
| F7 | Raramente me deixo abalar emocionalmente por problemas pequenos. | RE |
| F8 | Reflito antes de agir e prefiro evitar movimentos bruscos. | DE |
| F9 | Trabalhos de longo prazo não me cansam — vou no meu ritmo. | PF |
| F10 | (REV) Tenho dificuldade de me adaptar quando os planos mudam. | PF |

### 🌍 Melancólico — Terra (lento + duradouro · profundo)

| # | Item | Dim |
|---|------|-----|
| M1 | Penso muito antes de tomar decisões importantes. | DE |
| M2 | Mágoas e impressões fortes ficam comigo por muito tempo. | RE |
| M3 | Prefiro um pequeno círculo de relações profundas a muitos contatos. | RC |
| M4 | Tenho padrões altos para mim e me cobro com frequência. | PF |
| M5 | Sinto as coisas profundamente, mesmo quando não demonstro. | RE |
| M6 | Análise detalhada e planejamento são pontos fortes meus. | DE |
| M7 | Levo tempo para confiar em alguém, mas quando confio é duradouro. | RC |
| M8 | Sou perfeccionista — entrego algo só quando está bom de verdade. | PF |
| M9 | Memórias antigas (boas ou ruins) ainda me afetam hoje. | RE |
| M10 | (REV) Sou rápido(a) para esquecer ofensas e seguir em frente. | RE |

## 4. Scoring

### 4.1 Cálculo bruto

```
score_colerico    = soma(C1..C10, com C10 invertido: 6 - resposta)   → range 10-50
score_sanguineo   = soma(S1..S10, com S9 invertido)                  → range 10-50
score_fleumatico  = soma(F1..F10, com F10 invertido)                 → range 10-50
score_melancolico = soma(M1..M10, com M10 invertido)                 → range 10-50
```

**Inversão de itens reverso:** se a resposta original é `r` (1-5), o valor processado é `6 - r`. Isso transforma "discordo totalmente" no item reverso em "alta concordância" com o construto medido.

### 4.2 Normalização (%)

```
score_pct = (score - 10) / 40 × 100
```

Resultado: 0-100% por temperamento.

### 4.3 Identificação de dominante e secundário

```
dominante  = temperamento com maior score_pct
secundario = 2º maior score_pct, SE (segundo - terceiro) ≥ 15 pontos %
           SENÃO: null (perfil "equilibrado tripolar")
```

### 4.4 Classificação do perfil resultante

| Critério | Estado |
|----------|--------|
| dominante > 65% e secundário < 50% | **Perfil puro** (ex: "Colérico puro") |
| dominante 50-65% E secundário 35-50% | **Perfil clássico misto** (ex: "Colérico-Melancólico") — caso mais comum |
| dominante < 50% e (top 3 ou 4 dentro de 15 pts) | **Perfil equilibrado tripolar/quadripolar** (raro, ~5%) |

## 5. Apresentação na UI

### 5.1 Fluxo de aplicação

1. Tela inicial com instruções (15-20 segundos)
2. 4 telas com 10 itens cada (~75 segundos por tela)
3. Tela de processamento (animação ~2 segundos)
4. Apresentação do resultado no card v0.5 do `temperamentos-card.html`

### 5.2 Apresentação dos itens

- **Embaralhamento:** itens dos 4 temperamentos misturados (não em blocos)
- **Sem indicação de qual temperamento o item está medindo**
- **Tipo de questão:** Likert visual (5 círculos) ou slider 1-5
- **Barra de progresso** visível no rodapé
- **Botão "voltar"** disponível em cada tela
- **Auto-save** parcial a cada tela (resiliência)

### 5.3 Apresentação do resultado

Pós-aplicação, o usuário é levado pro card Temperamentos com:
- **Dominante** destacado (slot com borda intensificada + halo verde se match cargo)
- **Secundário** indicado no centro como "+ Melancólico" (ou null se equilibrado)
- **Tabela compacta** com os 4 scores ordenados
- **Narrativa interpretativa** (vide `electia-4t-narrativas.md` quando criado)

## 6. Validação interna proposta

### 6.1 Etapas

| Etapa | Quando | Critério de sucesso |
|-------|--------|---------------------|
| **Soft launch** | Sprint 1 | Aplicar em N=50 voluntários (colaboradores Electia, beta testers) |
| **Análise de consistência interna** | Sprint 2 | α de Cronbach por escala > 0.70 |
| **Análise fatorial confirmatória** | Sprint 2-3 | Itens carregam ≥ 0.40 na escala correta + < 0.30 nas outras |
| **Calibragem de pontos de corte** | Sprint 3 | N=300+ usuários · ajustar critérios da seção 4.4 |
| **Versão 1.0** | Sprint 4 | Documentação técnica + manual interpretativo + selo "instrumento próprio Electia, validado internamente" |

### 6.2 Itens reserva

Caso algum item não atinja critério psicométrico (carga fatorial baixa ou inconsistência), saem na v1.0 e são substituídos por reservas. Reservas pré-preparadas (10 itens extras, ~2 por temperamento) ficam em `electia-4t-reservas.md` (a criar).

### 6.3 Estabilidade temporal (test-retest)

Em N=30 usuários, reaplicar após 4 semanas. Critério: **r ≥ 0.70** entre primeira e segunda aplicação por escala.

## 7. Decisões pendentes (Marcos)

| # | Decisão | Default proposto |
|---|---------|------------------|
| D1 | Linguagem dos itens (formal vs informal) | Corporativo neutro (proposta acima) |
| D2 | Likert 5 vs 7 níveis | 5 (mais simples, menos cansativo) |
| D3 | Itens reverso: 1 ou 2 por temperamento | 1 (4 total) |
| D4 | Apresentação de equilibrado tripolar/quadripolar | Mostrar 3 ou 4 chips + texto "perfil multifacetado" |
| D5 | Quando aplicar pra novos usuários | Imediato após pivot ir pra produção |

## 8. Conversão Le Senne → Marsili (clientes existentes)

Para clientes que já fizeram o teste Le Senne (8 escalas), aplicar conversão algorítmica sem reaplicar:

```
score_colerico_marsili    = score_colerico_lesenne + score_apaixonado
score_sanguineo_marsili   = score_sanguineo_lesenne + score_fleumatico_lesenne
score_fleumatico_marsili  = score_amorfo + score_apatico
score_melancolico_marsili = score_nervoso + score_sentimental
```

Cada nova soma vai pra range 20-100 (cada Le Senne ia 10-50). Re-normalizar:

```
score_pct = (soma - 20) / 80 × 100
```

Aplicar regras das seções 4.3 e 4.4 normalmente.

## 9. Histórico de versões

| Versão | Data | Mudança |
|--------|------|---------|
| v0.1 | 2026-05-09 | Spec inicial — 40 itens documentados, scoring, validação plan |

## 10. Referências

- **Italo Marsili** — "Elogio aos Quatro Temperamentos", "Os 4 Temperamentos na Educação dos Filhos", Editora Auster
- **Hipócrates** (séc. V a.C.) — Teoria dos 4 humores corporais
- **Galeno** (séc. II d.C.) — Sistematização dos 4 temperamentos
- **Empédocles** (séc. V a.C.) — 4 elementos da natureza (água, ar, fogo, terra)
- **Card visual de referência:** `~/meus-projetos/_drafts/electia-viz/mockups/temperamentos-card.html` v0.5

## 11. Próximos documentos relacionados (a criar)

- `electia-4t-narrativas.md` — 4 narrativas puras + 12 narrativas de mistura (Mentor IA prompts)
- `electia-4t-cargo-mapping.md` — Tabela cargo × temperamento ideal (16 padrões)
- `electia-4t-schema-migration.md` — Spec técnico da migração de banco
- `electia-4t-theory-page.md` — Conteúdo educativo público (theory page)
- `electia-4t-reservas.md` — 10 itens extras pra substituição psicométrica
