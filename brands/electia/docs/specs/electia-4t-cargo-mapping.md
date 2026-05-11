# Electia 4T — Mapping cargo × temperamento ideal

> **Status:** v0.1 — proposta para validação interna (2026-05-09)
> **Conteúdo:** Lógica de matching cargo×colaborador + tabela mestre de cargos comuns
> **Origem:** Pivot Le Senne → 4 temperamentos clássicos hipocráticos
> **Uso:** alimenta scoring de match na UI, recomendações da IA, comparativo cargo × candidato

## 1. Visão geral

O Electia mostra um **score de match** entre cargo e colaborador (ex: "92% alinhado ao cargo Comercial Sr."). Esse score depende de **dois inputs:**

1. **Perfil do colaborador** — vem do teste 4T (dominante + secundário ou null)
2. **Perfil ideal do cargo** — definido pelo cliente OU sugerido pelo sistema com base nesta tabela mestre

Cada cliente pode **customizar** o perfil ideal de cargos próprios; esta tabela é o **default sugerido** pra acelerar onboarding.

## 2. Lógica do matching

### 2.1 Estrutura do "perfil ideal do cargo"

Cada cargo tem 3 atributos:

```yaml
cargo:
  nome: "Comercial Sr."
  dominante_ideal: Colérico         # 1 dos 4 obrigatório
  secundario_desejavel: Melancólico  # 1 dos 3 restantes ou null (qualquer secundário OK)
  rigidez: alta                      # alta | média | baixa (ver 2.2)
```

### 2.2 Rigidez do match

A "rigidez" indica quão sensível o cargo é ao temperamento:

| Rigidez | Significado | Exemplos |
|---------|-------------|----------|
| **Alta** | Perfil errado custa caro pro time/cliente. Match abaixo de 60% = recomenda re-alocação. | CEO, Comercial Sr. de alto ticket, Cirurgião, Piloto |
| **Média** | Perfil ideal performa melhor, mas adaptação é viável. Match abaixo de 50% = sinaliza desafio. | Gerente, Analista sênior, Designer, Professor |
| **Baixa** | Cargo flexível, vários perfis brilham. Match raramente bloqueia. | Suporte júnior, Estagiário, Atendimento operacional |

### 2.3 Cálculo do score de match

```
match_dominante = 100 se colaborador.dominante == cargo.dominante_ideal
                =  60 se colaborador.dominante == cargo.secundario_desejavel
                =  20 caso contrário

match_secundario = 100 se colaborador.secundario == cargo.secundario_desejavel
                 =  60 se colaborador.secundario == cargo.dominante_ideal
                 =  40 se cargo.secundario_desejavel for null (qualquer secundário OK)
                 =  20 caso contrário

# Pesos: dominante 70%, secundário 30%
score_match_pct = (match_dominante × 0.7) + (match_secundario × 0.3)
```

### 2.4 Interpretação do score

| Score | Estado | UI |
|-------|--------|-----|
| **≥ 80%** | Match forte | "Alinhado ao cargo" badge verde |
| **60-79%** | Match parcial | "Match parcial" badge âmbar |
| **40-59%** | Match fraco | "Atenção · perfil tensionado" badge laranja |
| **< 40%** | Mismatch | "Perfil divergente" badge vermelho |

Em cargos de **rigidez alta**, mismatch (<40%) bloqueia a contratação ou recomenda realocação. Em rigidez baixa, é apenas informativo.

## 3. Tabela mestre de cargos

### 3.1 Liderança & Estratégia

| Cargo | Dominante | Secundário | Rigidez | Por quê |
|-------|-----------|------------|---------|---------|
| CEO (empresa em crescimento) | Colérico | Melancólico | Alta | Decisão rápida + visão estratégica de longo prazo |
| CEO (empresa estável) | Melancólico | Colérico | Alta | Sustentação + capacidade de decisão pontual |
| COO / Diretor de Operações | Colérico | Fleumático | Alta | Execução + paciência operacional |
| CFO / Diretor Financeiro | Melancólico | Fleumático | Alta | Análise profunda + estabilidade emocional |
| Diretor Comercial | Colérico | Sanguíneo | Alta | Liderança + sociabilidade |
| Diretor de Marketing | Sanguíneo | Colérico | Média | Criatividade + capacidade de decisão |
| Diretor de RH (CHRO) | Fleumático | Melancólico | Média | Mediação + profundidade analítica |
| Conselheiro / Board Member | Melancólico | qualquer | Média | Maturidade reflexiva é o eixo |

### 3.2 Comercial & Vendas

| Cargo | Dominante | Secundário | Rigidez | Por quê |
|-------|-----------|------------|---------|---------|
| Comercial Sr. (consultivo, alto ticket) | Colérico | Melancólico | Alta | Decisão + análise técnica do cliente |
| Comercial Pleno (transacional) | Sanguíneo | Colérico | Média | Sociabilidade + drive de fechamento |
| Comercial Júnior (prospecção) | Sanguíneo | qualquer | Baixa | Cadência alta de contatos |
| Closer (alto ticket) | Colérico | Sanguíneo | Alta | Confronto + relacional |
| Customer Success Sr. | Fleumático | Melancólico | Média | Paciência + análise de uso |
| Inside Sales | Sanguíneo | Fleumático | Baixa | Energia + paciência com volume |
| Negociação complexa | Colérico | Melancólico | Alta | Firmeza + cálculo de longo prazo |
| Captação institucional | Melancólico | Sanguíneo | Média | Profundidade + sociabilidade pontual |

### 3.3 Marketing & Comunicação

| Cargo | Dominante | Secundário | Rigidez | Por quê |
|-------|-----------|------------|---------|---------|
| Brand Manager | Sanguíneo | Melancólico | Média | Criatividade + cuidado com detalhes da marca |
| Marketing de Conteúdo (sênior) | Melancólico | Sanguíneo | Média | Profundidade na pesquisa + leveza no formato |
| Performance Marketing | Colérico | Melancólico | Média | Velocidade de teste + análise dos dados |
| Comunicação Interna | Fleumático | Sanguíneo | Baixa | Estabilidade + leveza relacional |
| PR / Assessoria de Imprensa | Sanguíneo | Fleumático | Média | Relacional + paciência diplomática |
| Designer de Marca | Melancólico | Sanguíneo | Média | Detalhe + comunicação visual |

### 3.4 Tecnologia & Produto

| Cargo | Dominante | Secundário | Rigidez | Por quê |
|-------|-----------|------------|---------|---------|
| CTO | Melancólico | Colérico | Alta | Profundidade técnica + decisão |
| Tech Lead | Melancólico | Fleumático | Média | Análise + estabilidade pra mentorar time |
| Engenheiro Sr. | Melancólico | qualquer | Média | Profundidade técnica é o eixo |
| Product Manager | Colérico | Melancólico | Alta | Decisão + análise de usuário |
| UX Researcher | Melancólico | Fleumático | Média | Escuta profunda + paciência com processo |
| UX Designer | Melancólico | Sanguíneo | Média | Detalhe + comunicação |
| Engenheiro Júnior | qualquer | qualquer | Baixa | Atitude > temperamento nesta fase |
| DevOps / SRE | Fleumático | Melancólico | Alta | Calma sob crise + análise de logs |
| QA / Testes | Melancólico | Fleumático | Média | Detalhe + paciência com repetição |

### 3.5 Financeiro & Auditoria

| Cargo | Dominante | Secundário | Rigidez | Por quê |
|-------|-----------|------------|---------|---------|
| Controller | Melancólico | Fleumático | Alta | Análise + estabilidade |
| Analista Financeiro | Melancólico | qualquer | Média | Detalhe é o eixo |
| Auditor Interno | Melancólico | Colérico | Alta | Análise + coragem para apontar |
| Compliance Officer | Fleumático | Melancólico | Alta | Calma + rigor analítico |
| Tesoureiro | Melancólico | Fleumático | Alta | Cuidado + estabilidade |

### 3.6 RH & Pessoas

| Cargo | Dominante | Secundário | Rigidez | Por quê |
|-------|-----------|------------|---------|---------|
| Recrutador | Sanguíneo | Fleumático | Média | Sociabilidade + paciência |
| Business Partner / RH Estratégico | Fleumático | Colérico | Média | Mediação + capacidade de decisão |
| Treinamento & Desenvolvimento | Sanguíneo | Melancólico | Média | Comunicação + profundidade no conteúdo |
| Comp & Benefits | Melancólico | Fleumático | Alta | Análise + estabilidade |
| Cultura & Engajamento | Sanguíneo | Fleumático | Média | Energia + escuta acolhedora |

### 3.7 Operações & Logística

| Cargo | Dominante | Secundário | Rigidez | Por quê |
|-------|-----------|------------|---------|---------|
| Gerente de Operações | Colérico | Fleumático | Alta | Decisão sob pressão + paciência operacional |
| Coordenador de Logística | Fleumático | Colérico | Média | Estabilidade + capacidade de virar mesa quando necessário |
| Supervisor de Produção | Colérico | Fleumático | Média | Liderança de chão de fábrica + calma com volume |
| Analista de Processos | Melancólico | Fleumático | Média | Detalhe + paciência com mapeamento |

### 3.8 Atendimento & Customer Service

| Cargo | Dominante | Secundário | Rigidez | Por quê |
|-------|-----------|------------|---------|---------|
| Atendimento ao Cliente Júnior | Sanguíneo | Fleumático | Baixa | Energia + paciência |
| Atendimento Sênior / Escalonamento | Fleumático | Sanguíneo | Média | Calma + relacional |
| Suporte Técnico Nível 1 | Fleumático | Sanguíneo | Baixa | Calma com cliente irritado |
| Suporte Técnico Nível 3 | Melancólico | Fleumático | Alta | Análise profunda + paciência |
| Customer Success Manager | Fleumático | Sanguíneo | Média | Confiabilidade + relacional |

### 3.9 Criativo & Design

| Cargo | Dominante | Secundário | Rigidez | Por quê |
|-------|-----------|------------|---------|---------|
| Diretor de Arte | Melancólico | Sanguíneo | Média | Detalhe + capacidade de comunicar visão |
| Designer Pleno | Melancólico | Sanguíneo | Média | Detalhe + leveza no processo criativo |
| Copywriter | Sanguíneo | Melancólico | Média | Criatividade + atenção à palavra |
| Editor de Vídeo | Melancólico | Fleumático | Média | Detalhe + paciência com renderização |
| Ilustrador | Melancólico | qualquer | Média | Detalhe é o eixo |

### 3.10 Saúde & Educação

| Cargo | Dominante | Secundário | Rigidez | Por quê |
|-------|-----------|------------|---------|---------|
| Médico Cirurgião | Colérico | Melancólico | Alta | Decisão sob pressão + análise técnica |
| Médico Clínico | Fleumático | Melancólico | Alta | Calma com paciente + análise de sintomas |
| Psicólogo Clínico | Fleumático | Melancólico | Alta | Escuta + análise profunda |
| Psicólogo Organizacional | Fleumático | Sanguíneo | Média | Calma + relacional |
| Enfermeiro | Fleumático | Sanguíneo | Alta | Calma com paciente + cuidado caloroso |
| Professor (ensino fundamental) | Sanguíneo | Fleumático | Média | Energia + paciência |
| Professor (ensino superior) | Melancólico | Sanguíneo | Média | Profundidade + comunicação |
| Coach Executivo | Fleumático | Melancólico | Alta | Escuta + análise profunda |

## 4. Casos especiais

### 4.1 "Qualquer perfil serve" (rigidez baixa)

Cargos onde o temperamento importa pouco. A fórmula vira: `secundario_desejavel = "qualquer"`.

Exemplos típicos:
- Estagiário / Trainee (atitude > temperamento nesta fase)
- Cargos de carreira inicial em geral
- Funções altamente estruturadas (operacional padronizado)

### 4.2 "Perfil errado custa caro" (rigidez alta)

Cargos onde mismatch frequentemente leva a:
- Burnout do colaborador
- Atrito no time
- Erro operacional grave
- Custo alto pro cliente final

Exemplos:
- Cirurgião errado (Sanguíneo puro) → falha de foco em situação crítica
- CFO errado (Sanguíneo puro) → otimismo excessivo em projeção financeira
- Atendimento ao cliente irritado por Colérico puro → escalada de conflito

Em cargos de rigidez alta, o sistema **bloqueia ou alerta** antes da contratação se match < 40%.

### 4.3 Cargos sazonais ou em transformação

Algumas empresas têm cargos que mudam conforme fase:
- Startup early-stage: precisa de Colérico-Sanguíneo (decidir rápido + comunicar visão)
- Mesma startup pós-PMF: passa a precisar de Colérico-Melancólico (decidir + analisar dados)

Cliente pode definir **2 perfis ideais** para o mesmo cargo, com data de transição.

## 5. Customização por cliente

### 5.1 Tela de "Editar Cargo Ideal"

Cliente pode criar cargo customizado escolhendo:
1. **Nome do cargo** (livre)
2. **Dominante ideal** (dropdown 4 opções)
3. **Secundário desejável** (dropdown 4 opções OU "qualquer")
4. **Rigidez** (alta / média / baixa)
5. **Notas internas** (campo livre, ex: "Sucessor do Pedro, espera-se mesmo perfil")

### 5.2 Sugestão automática

Ao cadastrar novo cargo, sistema sugere o perfil ideal com base em:
1. Match exato pelo nome (consulta tabela mestre)
2. Match parcial por palavras-chave (ex: "Comercial" → sugere Colérico-Sanguíneo)
3. Se falhar: pede pro usuário escolher manualmente

### 5.3 Aprendizado por uso

Quando empresa contrata várias pessoas pra mesmo cargo, sistema aprende:
- Se 70%+ dos contratados de "Comercial Sr. da Empresa X" são Colérico-Melancólico
- E performance dessas pessoas é alta
- Sistema **sugere ajustar** o perfil ideal do cargo pra Colérico-Melancólico (vs Colérico-Sanguíneo do default)

## 6. Decisões pendentes

| # | Decisão | Default proposto |
|---|---------|------------------|
| CM1 | Pesos dominante/secundário (proposta: 70/30) | 70/30 |
| CM2 | Threshold de "match forte" (proposta: 80%) | 80% |
| CM3 | Em rigidez alta, bloquear contratação ou apenas alertar? | Alertar (cliente decide bloquear) |
| CM4 | Permitir cliente desativar a tabela mestre e usar só configuração própria? | Sim (opt-out) |
| CM5 | Idioma: nomes de cargos em pt-BR, traduzir pra en/es no roadmap | pt-BR v0.1; multi-língua v0.2 |
| CM6 | Cargos do governo / setor público (administração pública, etc.) | Adicionar em v0.2 |
| CM7 | Cargos do terceiro setor / ONGs | Adicionar em v0.2 |

## 7. Histórico de versões

| Versão | Data | Mudança |
|--------|------|---------|
| v0.1 | 2026-05-09 | Mapping inicial — 50+ cargos cobrindo 10 áreas, lógica de matching, customização por cliente |

## 8. Próximos documentos relacionados

- `electia-4t-instrumento.md` ✓ criado
- `electia-4t-narrativas.md` ✓ criado
- `electia-4t-schema-migration.md` — Spec técnico da migração de banco
- `electia-4t-theory-page.md` — Conteúdo educativo público
- `electia-4t-reservas.md` — 10 itens extras pra substituição psicométrica
