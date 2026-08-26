# Passos 1 e 2 da convergência Emprega+ — ordem de serviço

- **Implementa:** [ADR-0002](adr/0002-emprega-brand-convergence.md)
- **Aprovado por:** Marcos, em 26/08/2026
- **Escopo:** apenas os passos 1 e 2. Os passos 3 a 6 dependem de decisões ainda abertas.
- **Executor:** não atribuído — nenhum agente conectado ao canal no momento da escrita.

> Os dois passos abaixo são independentes e podem ir em PRs separadas. O passo 2 não muda um pixel.

---

## Passo 1 — a fonte

### 1.1 IMO — `emprega-mais-imo/public/css/emprega-ds.css`

Hoje há **um** token de fonte para os dois papéis:

```css
/* linha 88 */
--eds-font: 'Nunito', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
```

Passa a haver dois, espelhando `--font-heading` / `--font-body` do design system:

```css
--eds-font-heading: 'Sora', ui-sans-serif, system-ui, sans-serif;
--eds-font-body:    'Inter', ui-sans-serif, system-ui, sans-serif;
```

`--eds-font` **permanece**, apontando para `--eds-font-body`, para não quebrar a aplicação única na linha 197 nem a camada de alias `--jl-*`. Remover o alias é passo 3, não este.

### 1.2 IMO — a política de peso

Este é o item que resolve a queixa, não a troca de família. O arquivo tem **78 declarações de peso e nenhuma em 400**:

| Peso | Ocorrências | Vira |
|---|---:|---|
| `800` | 38 | `600` em título; `500` em rótulo |
| `700` | 28 | `600` em título; `400` em corpo |
| `600` | 11 | mantém em título; `500` em rótulo |
| `500` | 1 | mantém |
| `400` | **0** | passa a ser o padrão do corpo |

Regra a aplicar, por papel do seletor:

- **Título** (`h1`–`h4`, `.jl-card__title`, `.jl-page-title` e equivalentes): `--eds-font-heading`, peso `600`. Só o maior título da página pode usar `700`.
- **Corpo** (parágrafo, célula de tabela, descrição, valor de campo): `--eds-font-body`, peso `400`.
- **Rótulo** (label, eyebrow, badge, cabeçalho de coluna): `--eds-font-body`, peso `500`, com `letter-spacing` já existente.
- **Teto:** nada acima de `700`. O peso `800` sai do arquivo.

### 1.3 IMO — o carregamento

`resources/views/layouts/superadmin.blade.php` e `app.blade.php` carregam fontes do Google. Hoje o Nunito é baixado com os pesos `400;600;700;800` e o `400` nunca é usado; Sora e Inter também são baixados e o design system não os pinta. Depois desta mudança: **um só `<link>`, com Sora `500;600;700` e Inter `400;500;600`, e o Nunito sai.**

### 1.4 EditalHub

`editais-ds.css` **não declara família de fonte nenhuma** — cada tela herda o que sobrar, e as views referenciam Inter, Poppins e Taviraj em pontos diferentes, com Arial e OpenSans no CSS. O arquivo passa a declarar as mesmas duas famílias e a mesma política de peso do item 1.2.

⚠️ **`editais-ds.css` não é carregado por layout nenhum** — é puxado por view, uma a uma (`components/auth/*`, `site/concursos/apply/*` e outras). Enquanto isso não mudar, a fonte só se aplica onde o arquivo é puxado. Unificar o carregamento **não** faz parte deste passo.

---

## Passo 2 — tokenizar o EditalHub

**Zero mudança visual.** Cada valor abaixo é substituído por um token cujo valor é idêntico. Se algum pixel mudar, a substituição está errada.

### 2.1 Substituição direta — 21 cores, 123 ocorrências

| Valor literal | Ocorrências | Passa a ser |
|---|---:|---|
| `#ffffff` | 34 | `var(--eds-surface)` |
| `#4f46e5` | 11 | `var(--eds-indigo-dark)` |
| `#34427a` | 8 | `var(--eds-navy-2)` |
| `#6b7280` | 8 | `var(--eds-ink-medium)` |
| `#1e2433` | 7 | `var(--eds-ink-strong)` |
| `#e9ebf3` | 7 | `var(--eds-border)` |
| `#6366f1` | 7 | `var(--eds-indigo)` |
| `#1c2444` | 6 | `var(--eds-navy)` |
| `#7c3aed` | 5 | `var(--eds-violet-dark)` |
| `#b45309` | 4 | `var(--eds-warning-ink)` |
| `#9aa3b5` | 4 | `var(--eds-ink-soft)` |
| `#047857` | 4 | `var(--eds-success-ink)` |
| `#eef0f7` | 3 | `var(--eds-surface-tonal-dark)` |
| `#c9cede` | 3 | `var(--eds-border-mid)` |
| `#fafbfe` | 3 | `var(--eds-surface-tonal)` |
| `#b91c1c` | 2 | `var(--eds-danger-ink)` |
| `#1d4ed8` | 2 | `var(--eds-info-ink)` |
| `#d7dbe8` | 2 | `var(--eds-border-input)` |
| `#64748b` | 1 | `var(--eds-neutral-ink)` |
| `#2a2f45` | 1 | `var(--eds-table-head)` |
| `#8b5cf6` | 1 | `var(--eds-violet)` |

Onde há mais de um token com o mesmo valor, a escolha acima é a semântica: `#ffffff` vira `--eds-surface` (superfície), não `--eds-on-accent` (tinta sobre acento); `#4f46e5` vira `--eds-indigo-dark` (cor de ação), não `--eds-violet-ink`. **Usar o token que descreve o papel, nunca o que descreve a cor** — é o ADR-0001.

### 2.2 Pontas de gradiente — 4 cores, 8 ocorrências

| Valor literal | Ocorrências | Observação |
|---|---:|---|
| `#10b981` | 2 | já vive dentro de `--eds-grad-success (ponta inicial)` |
| `#059669` | 2 | já vive dentro de `--eds-grad-success (ponta final)` |
| `#ef4444` | 1 | já vive dentro de `--eds-grad-danger (ponta inicial)` |
| `#dc2626` | 2 | já vive dentro de `--eds-grad-danger (ponta final)` |

Não substituir por token de cor: se o uso for o gradiente inteiro, trocar pela chamada do gradiente. Se for cor sólida solta, **é caso da seção 2.3**.

### 2.3 Órfãs — 6 cores, 7 ocorrências, decisão do Marcos

| Valor literal | Ocorrências |
|---|---:|
| `#f1f3fb` | 2 |
| `#e9ecfb` | 1 |
| `#f0c4c4` | 1 |
| `#f6f7fb` | 1 |
| `#eef0f8` | 1 |
| `#0e7490` | 1 |

Recomendação registrada no ADR: absorver os quatro quase-brancos num token de fundo existente e decidir caso a caso o rosa e o teal — provavelmente resto de tela antiga. **Não inventar token novo sem confirmar.**

---

## Prova de que deu certo

1. `git diff` do passo 2 mostra **apenas** troca de literal por `var(--eds-*)` — nenhuma alteração de valor, seletor ou propriedade.
2. Nenhum hexadecimal sobra em `editais-ds.css` fora dos casos 2.2 e 2.3.
3. Nenhum `font-weight` acima de `700` sobra em `emprega-ds.css`.
4. `grep` por `Nunito`, `Poppins` e `Taviraj` volta vazio nas duas árvores.
5. Comparação visual das telas afetadas antes e depois do passo 2: **idênticas**.
