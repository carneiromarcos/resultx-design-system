# Brand Book — Emprega+

**Versão:** 1.0 | **Data:** 2026-05-27 | **Classificação:** Interno

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

### Wordmark

O logo da Emprega+ é um wordmark tipográfico: **`emprega+`** composto em **Sora Extra Bold (800)**. O sinal `+` é o elemento distintivo da marca e deve sempre aparecer em gold (`#c4993b`), independentemente da variante.

### 3 Variantes principais

| Variante | Texto | Sinal `+` | Fundo recomendado | Uso |
|----------|-------|-----------|-------------------|-----|
| **Completa** | Navy `#1B2A4A` | Gold `#c4993b` | Branco / light | Uso primário — site, docs, apresentações |
| **Invertida** | Branco `#FFFFFF` | Gold `#c4993b` | Navy `#1B2A4A` / dark | Headers dark, banners, redes sociais |
| **Monocromática** | Cinza `#6b7280` | Cinza `#6b7280` | Qualquer neutro | Impressão P&B, marcas d'água, monotone |

### Favicon e App Icon

Ícone reduzido: apenas o símbolo `+` extraído do wordmark.

| Variante | Fundo | Símbolo | Uso |
|----------|-------|---------|-----|
| Gradient | Gold gradient `#c4993b → #d4ae54` | Branco | Favicon padrão, app icon |
| Navy | Navy `#1B2A4A` | Gold `#c4993b` | Ícones em contextos dark |
| Light | Branco `#FFFFFF` | Gold `#c4993b` | Ícones em contextos light |
| Mono | Cinza `#f5f7f9` | Cinza `#6b7280` | Contextos monotone |

### Área de proteção

Espaço mínimo ao redor do logo: equivalente à **altura do caractere `+`** em todas as direções. Nenhum elemento gráfico, texto ou borda pode invadir essa área.

### Uso correto (Do's)

- Usar exclusivamente as cores oficiais (§4)
- Manter as proporções originais do wordmark
- Respeitar a área de proteção em todos os contextos
- Aplicar sobre fundos brancos, navy ou neutros claros
- Manter o `+` sempre destacado em gold (exceto variante mono)

### Uso incorreto (Don'ts)

- Alterar as cores do logo para tons não oficiais
- Distorcer, rotacionar ou inclinar o wordmark
- Adicionar sombras, contornos, efeitos 3D ou brilhos
- Aplicar sobre fundos que comprometam a legibilidade (fotos ruidosas, gradientes conflitantes)
- Separar o `+` da palavra `emprega`
- Substituir a tipografia Sora por outra fonte

### Assets

Localização: `../assets/logo/` (SVGs a serem exportados do Canva master `DAHFDuSkSXE`).

Arquivos esperados:
- `empregamais-completa.svg` — variante completa
- `empregamais-invertida.svg` — variante invertida
- `empregamais-mono.svg` — variante monocromática
- `empregamais-favicon-gradient.svg` — favicon gold gradient
- `empregamais-favicon-navy.svg` — favicon navy
- `empregamais-favicon-light.svg` — favicon light
- `empregamais-favicon-mono.svg` — favicon mono

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

### Famílias

| Família | Papel | Pesos utilizados |
|---------|-------|-----------------|
| **Sora** | Headings, display, eyebrows | 600, 700, 800 |
| **Inter** | Body text, labels, UI | 400, 500, 600 |
| **JetBrains Mono** | Code blocks, tokens | 400 |

### Escala tipográfica

| Role | Fonte | Tamanho | Peso | Line-height | Notas |
|------|-------|---------|------|-------------|-------|
| Display | Sora | `clamp(2.5rem, 6vw, 4.5rem)` | 800 | 1.1 | Hero headings — responsivo |
| H1 | Sora | `2.5rem` (40px) | 700 | 1.2 | Títulos de página |
| H2 | Sora | `2rem` (32px) | 700 | 1.2 | Títulos de seção |
| H3 | Sora | `1.25rem` (20px) | 700 | 1.3 | Títulos de card / subseção |
| Eyebrow | Sora | `0.75rem` (12px) | 600 | — | `text-transform: uppercase`, `letter-spacing: 0.15em`, cor gold |
| Body Large | Inter | `1.25rem` (20px) | 400 | 1.7 | Parágrafos de introdução, lead text |
| Body | Inter | `1rem` (16px) | 400 | 1.7 | Texto padrão |
| Small | Inter | `0.875rem` (14px) | 400 | 1.6 | Labels, descrições, metadados |
| Code | JetBrains Mono | `0.8125rem` (13px) | 400 | — | Blocos de código, valores de tokens |

### Regras de uso

- **Headings** usam exclusivamente Sora. Nunca usar Inter para títulos.
- **Body** usa exclusivamente Inter. Nunca usar Sora para texto corrido.
- **Eyebrow** sempre em uppercase com letter-spacing expandido — funciona como rótulo de contexto acima de headings.
- **Display** é reservado para hero sections e momentos de alto impacto. Não usar em páginas internas genéricas.
- Máximo 2 famílias tipográficas por superfície (Sora + Inter). JetBrains Mono aparece apenas em contextos técnicos.
- `font-display: swap` obrigatório para todas as fontes web.

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

### Site institucional — empregamais.me

- **Tema:** Light com glass effects (`.emp-glass`)
- **Background:** Branco `#FFFFFF` com seções alternadas em `#f5f7f9`
- **CTAs:** Gold gradient (`#c4993b → #d4ae54`), texto branco, hover com `#d4ae54`
- **Headings:** Sora 700/800, cor navy `#1B2A4A`
- **Body:** Inter 400, cor `#374151`
- **Cards:** Light glass com `backdrop-filter: blur(12px)`, borda `rgba(28,42,74,0.08)`
- **Nav:** Fixa no topo, glass effect, logo completa à esquerda

### Plataforma app — app.empregamais.me

- **Back-office (Gov/IMO):** Tema navy dark — background `#1B2A4A`, surfaces `#1c2a4a`, texto branco
- **Editais (C&S):** Tema light — background branco, cards com bordas `#e0e6eb`, badges por status
- **Sidebar:** Navy com ícones Lucide em gold
- **Tabelas e formulários:** Inter 400/500, espaçamento generoso, estados de erro em `#ef4343`

### Plataforma jobs — jobs-v2.empregamais.me

- **Stack:** Next.js frontend, dark/light adaptive
- **Modo light:** Background branco, cards glass, CTAs gold
- **Modo dark:** Background navy, surfaces elevadas `#1c2a4a`, CTAs gold mantidos
- **Vagas:** Cards com badge de produto (gradient por tipo — ver §7 Gradientes)
- **Perfil candidato:** Layout limpo, Inter body, Sora para nome e headings

### Social media — @empregamais

- **Plataformas:** Instagram + LinkedIn (primárias), Facebook (secundária)
- **Paleta:** Gold `#c4993b` + Navy `#1B2A4A` como par dominante
- **Headings em posts:** Sora 700, branco sobre navy ou navy sobre branco
- **Templates:** Padronizados no Canva — ver `SOCIAL-MEDIA-GUIDE.md`
- **Formato carrossel:** Capa navy com título gold, slides internos light com body Inter
- **Stories:** Fundo navy ou gold gradient, texto branco, Sora bold

### Apresentações (slides)

- **Fundo padrão:** Branco com accent gold
- **Fundo alternativo:** Navy com texto branco e accent gold
- **Headings:** Sora 700, navy ou branco conforme fundo
- **Body:** Inter 400, `#374151` (light) ou `#e5e7eb` (dark)
- **Gráficos:** Usar paleta semântica (success, error, warning) + gold como destaque
- **Rodapé:** Logo completa (light) ou invertida (dark), tagline opcional

### Email marketing

- **Transacional:** Inline CSS (sem classes externas). Logo completa no header, texto Inter 16px, CTA gold com cantos arredondados `8px`
- **Campanhas:** Header navy com logo invertida, body light com Inter, CTA gold gradient, rodapé cinza com links de descadastro
- **Largura máxima:** 600px
- **Fontes fallback:** Arial, Helvetica, sans-serif (email clients não carregam Sora/Inter)

### Material impresso

- **Cartões de visita:** Frente navy com logo invertida e dados em branco. Verso branco com logo completa
- **Folders/flyers:** Sora para títulos, Inter para corpo. Gold como cor de destaque em CTAs e destaques
- **Conversão CMYK do gold:** `#c4993b` ≈ C:0 M:25 Y:75 K:25 — validar em prova de cor antes de impressão em escala
- **Papel:** Mínimo 250g/m² couché fosco para cartões. 150g/m² para folders
- **Acabamento:** Laminação fosca preferencial. Verniz localizado no logo e no `+` (opcional, para premium)

---

## 9. Diretrizes Fotográficas

### Estilo

Editorial corporativo brasileiro. Imagens devem transmitir realidade, competência e diversidade — nunca parecer stock genérico.

### Iluminação

- Natural ou estúdio com temperatura quente
- Evitar iluminação fria, clínica ou fluorescente
- Sombras suaves, sem contraste excessivo

### Temas e cenários

| Categoria | Exemplos |
|-----------|----------|
| **Profissionais trabalhando** | Escritórios, fábricas, comércios, canteiros — diversidade de setores |
| **Colaboração** | Reuniões, duplas trabalhando, mentorias, entrevistas |
| **Serviço público** | Balcões de atendimento, feiras de emprego, postos do trabalhador |
| **Desenvolvimento** | Treinamentos, workshops, eventos de capacitação |
| **Conquista** | Primeiro emprego, contratação, certificação — momentos reais |

### Tratamento de cor

- Tons quentes que harmonizem com a paleta gold + navy
- Leve desaturação para sofisticação (não exagerar — manter pele natural)
- Evitar filtros frios (azulados) ou saturação excessiva

### Representatividade

- Diversidade racial, etária e de gênero é obrigatória
- Incluir pessoas com deficiência quando o contexto permitir
- Representar diferentes níveis hierárquicos e setores econômicos
- Contexto brasileiro real — não replicar estética corporativa americana

### Don'ts fotográficos

- Apertos de mão genéricos em fundo branco
- Ambientes corporativos all-white sem identidade
- Poses excessivamente encenadas ou forçadas
- Clichê de "pessoas felizes apontando para tela"
- Imagens com marcas d'água ou baixa resolução
- Fotos que não representem o público brasileiro

### Imagens geradas por IA

Quando usar Midjourney, DALL-E ou similares:
- Aplicar o prompt base definido em `IMAGE-PROMPTS.md`
- Manter consistência com as diretrizes acima (iluminação quente, diversidade, contexto brasileiro)
- Sempre revisar rostos e mãos — corrigir artefatos antes de publicar
- Não usar imagens de IA para representar pessoas reais da equipe ou clientes

---

## 10. Origem da Marca

### Fundação

Emprega+ foi fundada em 2022 por Marcos Carneiro. A marca nasceu da experiência direta de Marcos como Secretário de Trabalho em uma das cidades mais violentas do Brasil, onde ele testemunhou a face perversa da exploração do emprego — intermediação precária, falta de dados, e desconexão total entre quem oferece e quem busca trabalho.

### Evolução

| Ano | Marco |
|-----|-------|
| **2022** | Início como intermediação de mão de obra B2G (IMO) para prefeituras — conectando governos municipais a profissionais qualificados |
| **2023** | Expansão para C&S (concursos e seleções) — gestão completa de processos seletivos públicos |
| **2024** | Lançamento da comunidade PdV (Profissional de Valor) — desenvolvimento profissional B2C |
| **2025** | Entrada no B2B SaaS com Electia — assessments comportamentais (DISC, Big Five, MBTI, Eneagrama, Le Senne) para empresas privadas |

### O nome

**"Emprega+"** é a contração de **"emprega mais"** — empregue mais pessoas, com mais qualidade, com mais dados. O sinal `+` representa:

- **Conexão** — o elo entre governo, empresa e profissional
- **Crescimento** — cada interação adiciona valor ao ecossistema
- **Adição** — produtos complementares que se somam numa plataforma única

### Hoje

Emprega+ opera 4 produtos sob uma marca-mãe, cobrindo o ciclo completo da empregabilidade brasileira:

1. **Gov / IMO B2G** — portal de vagas e intermediação para prefeituras
2. **Editais / C&S** — gestão de concursos e processos seletivos públicos
3. **Electia B2B SaaS** — assessments comportamentais para empresas privadas
4. **PdV B2C** — comunidade de desenvolvimento profissional

A infraestrutura digital que conecta governos, empresas e profissionais — esse é o propósito que deu origem à marca e continua guiando cada decisão.
