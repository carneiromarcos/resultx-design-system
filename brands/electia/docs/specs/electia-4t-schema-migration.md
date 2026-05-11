# Electia 4T — Schema Migration (Le Senne → Marsili)

> **Status:** v0.1 — proposta para validação interna (2026-05-09)
> **Conteúdo:** Schema atual vs novo, DDL changes, backfill, rollback, deploy
> **Origem:** Pivot Le Senne → 4 temperamentos clássicos hipocráticos
> **Uso:** spec técnico pro time backend executar quando OPS-SEC liberar

> ⚠️ **Disclaimer:** este doc assume o schema atual com base em padrões comuns de SaaS psicométrico. O time backend deve **validar contra o codebase real** antes de aplicar e ajustar nomes de tabelas/colunas conforme convenção Electia.

## 1. Visão geral

A migração tem 3 frentes paralelas:

1. **Schema** — adicionar tabelas/colunas pro Marsili 4
2. **Backfill** — converter dados existentes Le Senne → Marsili
3. **Roles ideais** — atualizar tabela de cargos com novo formato (dominante + secundário + rigidez)

Estratégia: **migration aditiva** (não destrutiva). Le Senne fica gravado como metadata histórica até confirmação de que tudo funciona — depois pode ser deprecado em fase posterior.

## 2. Schema atual (Le Senne) — assumido

```sql
-- Tabela de resultados de avaliações
CREATE TABLE assessment_results (
  id                    UUID PRIMARY KEY,
  user_id               UUID REFERENCES users(id),
  assessment_id         UUID REFERENCES assessments(id),
  theory                VARCHAR(50),  -- 'temperamentos' | 'mbti' | 'disc' | etc.
  created_at            TIMESTAMPTZ,

  -- Scores Le Senne (8 escalas)
  score_colerico        INT,  -- E.A.P
  score_apaixonado      INT,  -- E.A.S
  score_sanguineo       INT,  -- nE.A.P
  score_fleumatico      INT,  -- nE.A.S
  score_amorfo          INT,  -- nE.nA.P
  score_apatico         INT,  -- nE.nA.S
  score_nervoso         INT,  -- E.nA.P
  score_sentimental     INT,  -- E.nA.S

  -- Tipo dominante Le Senne
  tipo_dominante        VARCHAR(20),  -- 'colerico' | 'apaixonado' | ... (8 valores)

  -- 3 dimensões binárias Le Senne
  dim_emotividade       BOOLEAN,
  dim_atividade         BOOLEAN,
  dim_ressonancia       VARCHAR(1)  -- 'P' | 'S'
);

-- Tabela de cargos com perfil ideal
CREATE TABLE roles (
  id                    UUID PRIMARY KEY,
  company_id            UUID REFERENCES companies(id),
  name                  VARCHAR(255),

  -- Perfil ideal Le Senne (1 dos 8 tipos)
  tipo_ideal_lesenne    VARCHAR(20)
);
```

## 3. Schema novo (Marsili 4)

### 3.1 Tabela de resultados — colunas adicionais

```sql
ALTER TABLE assessment_results
  ADD COLUMN score_temp_colerico_marsili     INT,
  ADD COLUMN score_temp_sanguineo_marsili    INT,
  ADD COLUMN score_temp_fleumatico_marsili   INT,
  ADD COLUMN score_temp_melancolico_marsili  INT,

  -- Identificação calculada
  ADD COLUMN temperamento_dominante          VARCHAR(20),  -- 'colerico' | 'sanguineo' | 'fleumatico' | 'melancolico'
  ADD COLUMN temperamento_secundario         VARCHAR(20),  -- mesmos valores ou NULL (perfil equilibrado)
  ADD COLUMN perfil_classificacao            VARCHAR(20),  -- 'puro' | 'misto' | 'equilibrado_tripolar' | 'equilibrado_quadripolar'

  -- Metadata da migração
  ADD COLUMN scoring_version                 VARCHAR(10),  -- 'lesenne_v1' | 'marsili_v1' (4t)
  ADD COLUMN migrated_from_lesenne           BOOLEAN DEFAULT FALSE,
  ADD COLUMN migrated_at                     TIMESTAMPTZ;

-- Índices
CREATE INDEX idx_assessment_temperamento_dominante  ON assessment_results(temperamento_dominante);
CREATE INDEX idx_assessment_temperamento_secundario ON assessment_results(temperamento_secundario);
CREATE INDEX idx_assessment_scoring_version         ON assessment_results(scoring_version);
```

### 3.2 Tabela de cargos — colunas adicionais

```sql
ALTER TABLE roles
  ADD COLUMN temperamento_dominante_ideal      VARCHAR(20),  -- 'colerico' | 'sanguineo' | 'fleumatico' | 'melancolico'
  ADD COLUMN temperamento_secundario_desejavel VARCHAR(30),  -- 'colerico' | ... | 'qualquer' | NULL
  ADD COLUMN rigidez_match                     VARCHAR(10),  -- 'alta' | 'media' | 'baixa'
  ADD COLUMN role_temperamento_versao          VARCHAR(10) DEFAULT 'marsili_v1';

-- Constraints
ALTER TABLE roles ADD CONSTRAINT chk_temperamento_dominante_ideal
  CHECK (temperamento_dominante_ideal IN ('colerico', 'sanguineo', 'fleumatico', 'melancolico') OR temperamento_dominante_ideal IS NULL);

ALTER TABLE roles ADD CONSTRAINT chk_rigidez_match
  CHECK (rigidez_match IN ('alta', 'media', 'baixa') OR rigidez_match IS NULL);
```

### 3.3 Nova tabela: histórico de itens 4T (recomendado)

Pra permitir reanálise futura, gravar respostas item-a-item:

```sql
CREATE TABLE assessment_4t_responses (
  id              UUID PRIMARY KEY,
  assessment_result_id UUID REFERENCES assessment_results(id) ON DELETE CASCADE,
  item_code       VARCHAR(10),  -- 'C1' | 'C2' | ... | 'M10'
  raw_response    INT,           -- 1-5 (Likert original)
  processed_score INT,           -- 1-5 (após inversão de itens reverso)
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_4t_responses_result ON assessment_4t_responses(assessment_result_id);
```

### 3.4 Nova tabela: configuração do instrumento 4T

```sql
CREATE TABLE assessment_4t_items (
  id                    UUID PRIMARY KEY,
  item_code             VARCHAR(10) UNIQUE,  -- 'C1' | ... | 'M10'
  scale                 VARCHAR(20),  -- 'colerico' | 'sanguineo' | 'fleumatico' | 'melancolico'
  dimension             VARCHAR(5),   -- 'RE' | 'DE' | 'RC' | 'PF'
  reverse               BOOLEAN DEFAULT FALSE,
  text_pt_br            TEXT,
  text_en               TEXT,  -- futuro
  active                BOOLEAN DEFAULT TRUE,
  version               VARCHAR(10) DEFAULT 'v1.0'
);
```

Permite ativar/desativar itens individualmente após análise psicométrica (item com carga fatorial baixa pode ser substituído por reserva sem mexer no codebase).

## 4. Backfill algorítmico (Le Senne → Marsili)

### 4.1 Lógica

Convertemos os 8 scores Le Senne em 4 scores Marsili somando os pares:

```
score_colerico_marsili    = score_colerico_lesenne + score_apaixonado
score_sanguineo_marsili   = score_sanguineo_lesenne + score_fleumatico_lesenne
score_fleumatico_marsili  = score_amorfo + score_apatico
score_melancolico_marsili = score_nervoso + score_sentimental
```

⚠️ **Nota semântica:** "Fleumático Le Senne" (nE.A.S) é diferente de "Fleumático Marsili" (nE.nA). A conversão acima respeita o **mapeamento por quadrante hipocrático**, não por nome literal.

### 4.2 Script SQL de backfill

```sql
-- Backfill em uma transação (idempotente)
BEGIN;

UPDATE assessment_results
SET
  score_temp_colerico_marsili    = COALESCE(score_colerico, 0)   + COALESCE(score_apaixonado, 0),
  score_temp_sanguineo_marsili   = COALESCE(score_sanguineo, 0)  + COALESCE(score_fleumatico, 0),
  score_temp_fleumatico_marsili  = COALESCE(score_amorfo, 0)     + COALESCE(score_apatico, 0),
  score_temp_melancolico_marsili = COALESCE(score_nervoso, 0)    + COALESCE(score_sentimental, 0),
  scoring_version       = 'marsili_v1_converted',
  migrated_from_lesenne = TRUE,
  migrated_at           = NOW()
WHERE
  theory = 'temperamentos'
  AND scoring_version IS NULL  -- só registros não-migrados
  AND score_colerico IS NOT NULL;  -- só registros com Le Senne preenchido

COMMIT;
```

### 4.3 Calcular dominante e secundário

Pseudocódigo (implementação fica a cargo do time backend conforme convenção interna):

```
PARA cada linha em assessment_results WHERE migrated_from_lesenne = TRUE:
  scores = [score_temp_colerico_marsili, score_temp_sanguineo_marsili,
            score_temp_fleumatico_marsili, score_temp_melancolico_marsili]
  total = sum(scores)
  pcts  = [s/total*100 for s in scores]

  ORDENAR pcts DESC com nomes: dom, sec, terc, quarto

  temperamento_dominante = nome do maior

  SE (sec.pct - terc.pct) >= 15:
    temperamento_secundario = nome do segundo

    SE dom.pct > 65 E sec.pct < 50:
      perfil_classificacao = 'puro'
    SENÃO SE dom.pct entre 50-65 E sec.pct entre 35-50:
      perfil_classificacao = 'misto'
    SENÃO:
      perfil_classificacao = 'misto'  -- caso fallback
  SENÃO:
    temperamento_secundario = NULL
    SE (sec.pct - quarto.pct) <= 15:
      perfil_classificacao = 'equilibrado_quadripolar'
    SENÃO:
      perfil_classificacao = 'equilibrado_tripolar'
```

## 5. Migração da tabela `roles` (cargos ideais)

### 5.1 Mapping Le Senne → Marsili pra cargos

Pra cada cargo já cadastrado com `tipo_ideal_lesenne`, aplicar conversão:

| Le Senne (atual) | Marsili dominante | Marsili secundário sugerido |
|-----------------|-------------------|----------------------------|
| `colerico` (E.A.P) | `colerico` | `melancolico` |
| `apaixonado` (E.A.S) | `colerico` | `melancolico` |
| `sanguineo` (nE.A.P) | `sanguineo` | `colerico` |
| `fleumatico` (nE.A.S) | `sanguineo` | `fleumatico` |
| `amorfo` (nE.nA.P) | `fleumatico` | NULL |
| `apatico` (nE.nA.S) | `fleumatico` | `melancolico` |
| `nervoso` (E.nA.P) | `melancolico` | NULL |
| `sentimental` (E.nA.S) | `melancolico` | `fleumatico` |

```sql
UPDATE roles
SET
  temperamento_dominante_ideal = CASE
    WHEN tipo_ideal_lesenne IN ('colerico', 'apaixonado')   THEN 'colerico'
    WHEN tipo_ideal_lesenne IN ('sanguineo', 'fleumatico')  THEN 'sanguineo'
    WHEN tipo_ideal_lesenne IN ('amorfo', 'apatico')        THEN 'fleumatico'
    WHEN tipo_ideal_lesenne IN ('nervoso', 'sentimental')   THEN 'melancolico'
    ELSE NULL
  END,
  temperamento_secundario_desejavel = CASE
    WHEN tipo_ideal_lesenne IN ('colerico', 'apaixonado')   THEN 'melancolico'
    WHEN tipo_ideal_lesenne = 'sanguineo'                   THEN 'colerico'
    WHEN tipo_ideal_lesenne = 'fleumatico'                  THEN 'fleumatico'
    WHEN tipo_ideal_lesenne = 'apatico'                     THEN 'melancolico'
    WHEN tipo_ideal_lesenne = 'sentimental'                 THEN 'fleumatico'
    ELSE NULL
  END,
  rigidez_match = 'media',  -- Default conservador; cliente ajusta depois
  role_temperamento_versao = 'marsili_v1_converted'
WHERE
  tipo_ideal_lesenne IS NOT NULL
  AND temperamento_dominante_ideal IS NULL;
```

### 5.2 Cargos novos pós-migração

Cargos cadastrados após a migração podem usar a tabela mestre de `electia-4t-cargo-mapping.md` como sugestão automática.

## 6. Rollback plan

### 6.1 Pré-requisitos

- **Backup completo** do banco antes da migração
- Não usar `DROP COLUMN` na primeira fase — apenas adicionar colunas (não-destrutivo)
- Manter colunas Le Senne intactas por pelo menos 90 dias após go-live do Marsili

### 6.2 Rollback completo (se algo der muito errado)

```sql
-- 1. Reverter scoring_version
UPDATE assessment_results
SET scoring_version = 'lesenne_v1'
WHERE scoring_version = 'marsili_v1_converted';

-- 2. Limpar campos novos (mantém dados intactos pra próxima tentativa)
UPDATE assessment_results
SET
  score_temp_colerico_marsili = NULL,
  score_temp_sanguineo_marsili = NULL,
  score_temp_fleumatico_marsili = NULL,
  score_temp_melancolico_marsili = NULL,
  temperamento_dominante = NULL,
  temperamento_secundario = NULL,
  perfil_classificacao = NULL,
  migrated_from_lesenne = FALSE,
  migrated_at = NULL
WHERE migrated_from_lesenne = TRUE;

-- 3. Reverter roles
UPDATE roles
SET
  temperamento_dominante_ideal = NULL,
  temperamento_secundario_desejavel = NULL,
  rigidez_match = NULL,
  role_temperamento_versao = NULL
WHERE role_temperamento_versao = 'marsili_v1_converted';

-- 4. Frontend volta a renderizar Le Senne via feature flag
```

### 6.3 Rollback parcial

Se só uma parte dos clientes apresentar problema, dá pra reverter por `company_id`:

```sql
UPDATE assessment_results r
SET scoring_version = 'lesenne_v1'
FROM users u
WHERE r.user_id = u.id
  AND u.company_id = '<id_problemático>'
  AND r.scoring_version = 'marsili_v1_converted';
```

## 7. Estratégia de deploy

### 7.1 Feature flag

Implantar com feature flag `temperamentos_marsili_4t`:
- Default OFF — sistema continua mostrando Le Senne
- Ligar pra **piloto interno** (1-2 empresas voluntárias) por 2 semanas
- Se métricas OK, ligar pra **rollout 10% → 50% → 100%** em 4 semanas
- Manter Le Senne acessível como "modo legado" por 90 dias

### 7.2 Métricas de validação durante rollout

| Métrica | Meta |
|---------|------|
| Taxa de erro do scoring engine | < 0.1% |
| Tempo médio de resposta da query de match | < 100ms |
| Suporte ao cliente — tickets relacionados | < 5% acima do baseline |
| NPS da feature Temperamentos | ≥ baseline |
| Tempo médio de aplicação do teste | 5-7 min (proposta) |

### 7.3 Comunicação

- Email pré-launch (1 semana antes) explicando mudança aos clientes existentes
- In-app notification no primeiro acesso pós-deploy
- Theory page atualizada como "Saiba mais sobre a nova abordagem dos 4 temperamentos"
- Time de Customer Success treinado pra suportar perguntas

## 8. Impacto em queries existentes

### 8.1 Queries que filtram por `tipo_dominante` Le Senne

```sql
-- ANTES (Le Senne)
SELECT * FROM assessment_results WHERE tipo_dominante = 'apaixonado';

-- DEPOIS (Marsili)
SELECT * FROM assessment_results WHERE temperamento_dominante = 'colerico';
-- (Apaixonado Le Senne mapeia pra Colérico Marsili — perde-se a granularidade)
```

**Recomendação:** marcar todas as queries que filtram por `tipo_dominante` Le Senne pra refatoração. Lista deve sair do code search por `tipo_dominante`, `score_apaixonado`, `score_amorfo`, etc.

### 8.2 Dashboards/relatórios analíticos

Dashboards que mostram distribuição de tipos Le Senne (8 fatias) viram distribuição Marsili (4 fatias). Reduzir granularidade — ou manter dashboard Le Senne pra análise histórica.

### 8.3 Mentor IA — prompt update

Atualizar prompts que mencionam "Apaixonado", "Sentimental", etc. pra usar nomenclatura Marsili. Vide `electia-4t-narrativas.md`.

## 9. Testes de migração

### 9.1 Smoke test em ambiente staging

```sql
-- 1. Verificar que todas as linhas migradas têm scores Marsili
SELECT COUNT(*) AS total,
       COUNT(score_temp_colerico_marsili) AS com_score_marsili
FROM assessment_results
WHERE migrated_from_lesenne = TRUE;
-- Esperado: total = com_score_marsili (sem nulls)

-- 2. Verificar que dominante foi calculado
SELECT COUNT(*) AS total_sem_dominante
FROM assessment_results
WHERE migrated_from_lesenne = TRUE AND temperamento_dominante IS NULL;
-- Esperado: 0

-- 3. Verificar distribuição dos 4 temperamentos (sanity check)
SELECT temperamento_dominante, COUNT(*) AS qtd
FROM assessment_results
WHERE migrated_from_lesenne = TRUE
GROUP BY temperamento_dominante
ORDER BY qtd DESC;
-- Esperado: 4 categorias com distribuição não-degenerada (nenhuma com 0%, nenhuma com 100%)
```

### 9.2 Teste de regressão

Aplicar conversão em **dataset sintético** com casos extremos:
- Pessoa com score Le Senne 100% Apaixonado → deve virar Colérico Marsili 100%
- Pessoa com 50% Apaixonado + 50% Sentimental → deve virar Colérico-Melancólico
- Pessoa com 25% em cada um dos 4 quadrantes Le Senne → deve virar perfil equilibrado

### 9.3 Validação cruzada com Mentor IA

Aplicar 100 perfis convertidos, gerar narrativa via Mentor IA com prompt atualizado, verificar que:
- Narrativas estão coerentes com o perfil
- Não há resíduo de vocabulário Le Senne ("Apaixonado", "Sentimental", etc.)

## 10. Decisões pendentes

| # | Decisão | Default proposto |
|---|---------|------------------|
| SM1 | Manter colunas Le Senne ou dropar após X dias? | Manter por 90 dias mínimo |
| SM2 | Backfill em batch (em downtime) ou online (transação por linha)? | Online (zero downtime) |
| SM3 | Rigidez default pra cargos migrados (sem info original) | `media` (conservador) |
| SM4 | Permitir histórico Le Senne na UI como "modo legado"? | Sim, opt-in admin |
| SM5 | Versão do scoring engine como ENUM ou VARCHAR? | VARCHAR (mais flexível pra future versions) |

## 11. Histórico de versões

| Versão | Data | Mudança |
|--------|------|---------|
| v0.1 | 2026-05-09 | Spec inicial — DDL changes, backfill SQL, rollback plan, deploy strategy |

## 12. Próximos documentos relacionados

- `electia-4t-instrumento.md` ✓ criado
- `electia-4t-narrativas.md` ✓ criado
- `electia-4t-cargo-mapping.md` ✓ criado
- `electia-4t-theory-page.md` — Conteúdo educativo público
- `electia-4t-reservas.md` — 10 itens extras pra substituição psicométrica
