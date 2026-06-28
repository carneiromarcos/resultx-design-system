# Brand Book — Electia by Emprega+

**Versão BB (conteúdo editorial §1-17):** 2.2 · **Data:** 2026-06-27 · **Classificação:** Interno
**Versão Brand Kit (este diretório):** 1.7.1 · **Data:** 2026-05-12 · ver [CHANGELOG.md](./CHANGELOG.md)

> **Escopo de versionamento.** O **header do Brand Book** versiona apenas o conteúdo editorial das seções §1-17 abaixo. O **CHANGELOG.md** versiona o brand-kit inteiro (mockups, wireframes, specs, tokens, decisões D1-D6). Se você abriu este doc procurando o estado atual do brand-kit, vá direto ao CHANGELOG. Se procura a especificação visual oficial, está aqui.
>
> **BB 2.0 (27/05) — Purple Refactor.** Migração completa de teal `#2DD4BF` para roxo `#6f32b1` como cor de acento primária da marca. Commit `8e4cadb` em produção (24/05), 126 arquivos atualizados. Gradients de sinergia ResultX: B (roxo→Royal Blue `#2040a0`) em CTAs + C (roxo→Ouro `#b29442`) em pricing "Recomendado". WCAG 2.2 (1.4.3/1.4.11/2.4.11) validado.
>
> **BB 2.1 (26/06) — Grafite canonical.** O experimento navy `#1B2A4A` (adotado em 24/05) foi **APOSENTADO**: grafite `#0B0E14` é a base única do ecossistema em tudo (tokens, web, social, Canva, e-mail, image-prompts), alinhada à LP real em produção. Adicionado o token `purple.on-dark` `#c084fc` (texto/ícone/borda roxo sobre fundo escuro — 7.1:1 vs `#0B0E14`, destaque do hero, nunca fill de botão). Tema light (`data-theme="light"`) documentado nos tokens. Semânticos alinhados aos vivos da LP.
>
> **BB 2.2 (27/06) — Theory colors OKLCH.** A tabela de cores por teoria comportamental (§4) foi alinhada aos valores canônicos **OKLCH** dos tokens (`--theory-*`) usados pelo DS/preview, substituindo os hex Tailwind `-400` legados. Famílias de cor preservadas (DISC azul, Tipologia Cognitiva violeta, Eneagrama âmbar, Big Five verde, Le Senne rosa, Motivadores ciano); apenas precisão/fonte atualizadas.

---

## 1. Essência da Marca

### Propósito

Electia vem do grego *electio* — o eleito, o escolhido. Acreditamos que trabalho e vocação deveriam ser a mesma coisa. Que quando uma pessoa encontra o lugar certo, tudo muda — a produtividade, a satisfação, a saúde mental.

### Missão

Ajudar líderes a colocar a pessoa certa no lugar certo, usando ciência comportamental e inteligência artificial.

### Visão

Ser a plataforma de referência em gestão comportamental de pessoas no Brasil — onde empresas entendem sua equipe de verdade antes de tomar qualquer decisão sobre pessoas.

### Promessa de Marca

> "Sua equipe não e ruim. Esta desencaixada."

O Electia mostra quem cada colaborador realmente e — e onde deveria estar.

### Valores da Marca

| Valor | Significado |
|-------|-------------|
| **Profundidade** | Não fazemos testes rasos. Cruzamos 6 teorias para entregar o retrato completo. |
| **Verdade** | Cenarios situacionais revelam comportamento real, não autoimagem. |
| **Clareza** | Relatórios que gestores entendem sem ser psicologos. |
| **Acao** | Dados que geram decisões, não PDFs que ninguem le. |
| **Encaixe** | O problema não e a pessoa. E onde ela esta. |

---

## 2. Arquitetura de Marca

### Hierarquia

```
Emprega+  (marca-mae — ecossistema de empregabilidade)
└── Electia by Emprega+  (produto SaaS B2B — assessments comportamentais)
    ├── Mentor AI  (feature — assistente de gestão de pessoas)
    ├── Testes Situacionais  (feature — cenários sob pressao)
    └── [Recrutamento e Selecao]  (futuro — em breve)
```

### Assinaturas

| Uso | Formato |
|-----|---------|
| **Primário** | Electia |
| **Com endosso** | Electia by Emprega+ |
| **Feature** | Mentor AI — Assistente de Gestão de Pessoas |
| **URL** | electia.empregamais.me |

### Regras de grafia (oficial — atualizada 2026-05-11)

- **O nome da marca e sempre "electia" — tudo minúsculo, sem acento.** Aplicável a: wordmark, copy de site, posts, emails, app, materiais impressos. Exceção única: início de frase em texto editorial (ai vira "Electia" pela regra ortográfica padrão).
- **"by emprega+"** (também minúsculo) e o endosso obrigatório em materiais públicos
- **Nunca usar "electia by ResultX"** em materiais públicos (ResultX e consultoria, não marca de produto)
- **O "Mentor AI"** e sempre grafado com M e A maiúsculos, nunca "mentor ai" ou "MENTOR AI"
- **URL/dominio mantem o padrão:** `electia.empregamais.me` (ja era lowercase)

---

## 3. Wordmark (oficial — atualizado 2026-05-11)

> **electia não tem logo gráfico.** O wordmark tipográfico **e** a marca. Sem simbolo isolado, sem ícone próprio, sem marca registrada visual alem da palavra "electia".

### Wordmark canônico

```
electia by emprega+
```

**Composição tipográfica:**

| Trecho | Fonte | Peso | Estilo | Notas |
|--------|-------|------|--------|-------|
| `electia` | **JetBrains Mono** | 600 (Semibold) | Normal | Tudo minúsculo. Letter-spacing: `-0.04em`. Cor: branco `#E6EDF3` ou accent roxo `#6f32b1` em destaque |
| `by` | Sora | 400 (Regular) | Normal | Tamanho ~30% do `electia`. Cor: `rgba(230,237,243,0.55)` |
| `emprega+` | **Sora ExtraBold** | 800 | Normal | Mesma fonte oficial da marca-mae Emprega+. Tamanho ~50% do `electia`. Cor: `rgba(230,237,243,0.85)` |

**Por que JetBrains Mono em `electia`?** Decisão tipográfica T2 (mono tech). Sinaliza ferramenta científica/IA, diferencia de competidores que usam sans-serif puro (Sólides, Buk, Pulses). Aprovado em 2026-05-11.

**Por que Sora ExtraBold em `emprega+`?** E a fonte oficial da marca Emprega+ (logo original tem o "ga+" desenhado custom no Canva, mas para o endorsement do Electia usamos Sora reto sem o custom).

### Variantes do wordmark

| Variante | Uso |
|----------|-----|
| **Completo** | Site, LP, materiais oficiais, header. Composição: `electia by emprega+` |
| **Curto** | Espacos com pouca largura, segundo uso na mesma pagina. Composição: `electia` (sozinho, sem endosso) |
| **Lockup vertical** | Social média quadrado, papelaria. `electia` em cima, `by emprega+` embaixo centralizado |
| **Monocromatico** | Fundos complexos, impressao. Versão single-color (branco ou roxo) |

### Favicon e avatar — helper "e"

Quando o espaço e tao pequeno que não cabe nem `electia` (16-48px), usa-se um **helper visual**: a letra `e` (minuscula, JetBrains Mono 600) dentro de um container quadrado arredondado.

> **Importante:** o helper "e" **NAO e o logo**. Ele e apenas uma forma de manter a presença visual da marca em contextos de tamanho insuficiente para o wordmark (favicon do browser, app icon iOS/Android, avatar de mensagem, marca d'agua minuscula). Em qualquer espaço onde `electia` cabe legivel, sempre prefira o wordmark.

**Container:**
- Forma: quadrado arredondado, `border-radius: 24%` (proporcional ao tamanho)
- Tamanho minimo: 32x32px (favicon)
- Padding interno: 22% do tamanho
- Fundo: opção A `--bg` (#0B0E14) com letra roxa · opção B `--purple` (#6f32b1) com letra branca · opção C `rgba(111,50,177,0.15)` (purple/15) com letra roxa

### Tamanhos e proporcoes do wordmark

| Contexto | `electia` size | `emprega+` size |
|----------|---------------|-----------------|
| Hero LP (display) | 64-88px | 24-32px |
| Section / card | 32-44px | 12-16px |
| Navbar / header | 18-24px | 10-12px |
| Mobile compact | 14-18px | 9-11px |
| Email header | 28-36px | 12-14px |
| Favicon (helper "e") | 16-512px | — |

### Cores do wordmark

| Variante | `electia` | `by` | `emprega+` | Fundo |
|----------|-----------|------|------------|-------|
| **Padrão dark** | `#E6EDF3` (branco) | `rgba(230,237,243,0.55)` | `rgba(230,237,243,0.85)` | `#0B0E14` |
| **Accent dark** | `#6f32b1` (roxo) | `rgba(230,237,243,0.55)` | `rgba(230,237,243,0.85)` | `#0B0E14` |
| **Accent glow** | `#6f32b1` + text-shadow purple blur 32px 45% | idem | idem | `#0B0E14` ou gradient |
| **Light** | `#0F1729` (grafite escuro) | `rgba(15,23,41,0.65)` | `rgba(15,23,41,0.85)` | `#FFFFFF` ou `#F8FAFB` |

### Área de protecao

Manter espaço mínimo equivalente a **altura do "e" minúsculo** ao redor do wordmark inteiro. Nenhum elemento deve invadir essa area.

### Usos proibidos

- Não distorcer proporcoes do wordmark
- Não usar cores fora da paleta
- Não colocar sobre fundos que comprometam legibilidade
- Não rotacionar
- Não adicionar sombras, brilhos ou efeitos (exceto o glow purple oficial)
- Não escrever `Electia` com E maiúsculo em wordmark (so minúsculo)
- Não usar `electia by ResultX` em materiais públicos
- Não trocar a fonte do `electia` (so JetBrains Mono Semibold 600)
- Não trocar a fonte do `emprega+` (so Sora ExtraBold 800)
- Não tratar o helper "e" do favicon como logo — wordmark sempre que o espaço permitir
- Não desenhar um ícone/simbolo/grafismo próprio para Electia (a marca **e** o wordmark)

---

## 4. Paleta de Cores

### Cores Primárias

| Nome | Hex | Uso |
|------|-----|-----|
| **Accent Purple** | `#6f32b1` | Cor principal da marca. CTAs, links, destaques, wordmark |
| **Accent Purple Light** | `#a55eea` | Hover states, focus ring, interacoes |
| **Accent Purple Dark** | `#5a2890` | Pressed states, bordas ativas em dark |
| **Accent Purple Muted** | `rgba(111, 50, 177, 0.15)` | Backgrounds sutis, selecoes, badges |
| **Accent Purple On-Dark** | `#c084fc` | Texto/ícone/borda roxo sobre fundo grafite — 7.1:1 vs `#0B0E14` (AA normal text). Destaque do hero. NÃO usar como fill de botão |

### Cores de Fundo (Dark Theme)

| Nome | Hex | Uso |
|------|-----|-----|
| **BG Base (Grafite)** | `#0B0E14` | Fundo principal da aplicação e LP |
| **BG Surface** | `#161B26` | Cards, paineis, modais |
| **BG Surface Hover** | `#1C2333` | Hover de cards e elementos interativos |

### Cores de Texto

| Nome | Hex | Uso |
|------|-----|-----|
| **Text Primary** | `#E6EDF3` | Titulos, texto principal |
| **Text Secondary** | `#8B949E` | Texto de apoio, descricoes |
| **Text Muted** | `#6E7681` | Labels, placeholders, metadata |

### Cores de Borda

| Nome | Hex | Uso |
|------|-----|-----|
| **Border Default** | `#2A3444` | Bordas de cards, inputs, divisores |
| **Border Focus** | `#6f32b1` | Focus ring, borda ativa |

### Cores Semanticas

| Nome | Hex | Uso |
|------|-----|-----|
| **Success** | `#22C55E` | Confirmacoes, status positivo |
| **Warning** | `#F59E0B` | Alertas, atencao |
| **Danger** | `#EF4444` | Erros, exclusoes, crítico |

### Cores por Teoria Comportamental

Valores canônicos em **OKLCH** (token-driven), alinhados ao DS/preview — usados em badges, barras, gráficos e cards. Tema dark; o light usa variantes mais escuras dos mesmos tokens.

| Teoria | Família | OKLCH (dark) | Token |
|--------|---------|--------------|-------|
| DISC | Azul | `oklch(72% 0.18 240)` | `--theory-disc` |
| Tipologia Cognitiva | Violeta | `oklch(75% 0.18 305)` | `--theory-mbti` |
| Eneagrama | Âmbar | `oklch(78% 0.14 75)` | `--theory-enneagram` |
| Big Five | Verde | `oklch(72% 0.16 145)` | `--theory-big-five` |
| Le Senne | Rosa | `oklch(75% 0.14 10)` | `--theory-le-senne` |
| Motivadores | Ciano | `oklch(60% 0.14 195)` | `--theory-motivadores` |

### Cores por Macro-Dimensão (Testes Situacionais)

| Dimensão | Cor | Tailwind |
|----------|-----|----------|
| Ética e Valores | Azul | blue-400 |
| Execucao e Entrega | Verde | green-400 |
| Lideranca e Gestão | Roxo | purple-400 |
| Cultura e Clima | Ambar | amber-400 |
| Saúde Organizacional | Vermelho | red-400 |

---

## 5. Tipografia

### Fontes

| Uso | Fonte | Peso | Fallback |
|-----|-------|------|----------|
| **Headings / Display** | Sora | Bold (700), ExtraBold (800) | sans-serif |
| **Body / UI** | Inter | Regular (400), Medium (500), SemiBold (600) | system-ui, sans-serif |

### Hierarquia

| Nível | Fonte | Tamanho | Peso | Uso |
|-------|-------|---------|------|-----|
| H1 | Sora | 36-48px | ExtraBold 800 | Headline da LP, titulos de página |
| H2 | Sora | 24-30px | Bold 700 | Titulos de seção |
| H3 | Inter | 18-20px | SemiBold 600 | Subtitulos, card headers |
| Body | Inter | 14-16px | Regular 400 | Texto corrido, descricoes |
| Small | Inter | 12-13px | Medium 500 | Labels, metadata, badges |
| Micro | Inter | 10-11px | Medium 500 | Timestamps, tooltips |

### Regras tipográficas

- **Line-height:** 1.5 para body, 1.2 para headings
- **Letter-spacing:** -0.02em para Sora headings (mais apertado), normal para Inter
- **Máximo de largura de texto:** 640px para blocos de leitura
- **Cor do texto:** sempre var(--text-primary) ou var(--text-secondary). Nunca branco puro (#FFFFFF)

---

## 6. Tom e Voz

### Personalidade

| Atributo | E | Não e |
|----------|---|-------|
| **Direto** | Fala sem rodeios, vai ao ponto | Frio, agressivo ou impessoal |
| **Inteligente** | Mostra profundidade sem ser academico | Arrogante, jargao excessivo |
| **Confiante** | Afirma com segurança | Exagerado, promessas vazias |
| **Acessível** | Linguagem que gestores entendem | Infantil ou casual demais |
| **Provocativo** | Questiona premissas ("sua equipe não e ruim") | Ofensivo ou desrespeitoso |

### Exemplos de Tom

**Certo:**
> "Sua equipe não e ruim. Esta desencaixada."
> "Testes tradicionais medem autoimagem. Cenarios situacionais medem comportamento real."
> "Não e mais um PDF que ninguem le."

**Errado:**
> "A solucao definitiva e inovadora para gestão de pessoas!!!"
> "Potencialize os resultados do seu capital humano com nossa plataforma disruptiva."
> "Somos os melhores do mercado em people analytics."

### Regras de escrita

- **Sem exclamacao.** Confianca não precisa de pontuacao enfatica.
- **Sem jargao corporativo.** "Capital humano", "stakeholders", "sinergia" — fora.
- **Sem superlativos vazios.** "O melhor", "revolucionario", "único" — só se for comprovavel.
- **Dados concretos > adjetivos.** "6 teorias cruzadas" > "avaliação completa e abrangente".
- **Portugues brasileiro.** Sempre pt-BR. Código e variáveis em ingles.

---

## 7. Iconografia e Elementos Visuais

### Icones

- **Biblioteca:** Lucide React (ja em uso no app)
- **Estilo:** Outline, stroke 1.5-2px
- **Cor padrão:** var(--text-muted) para inativo, var(--accent-purple) para ativo/destaque
- **Tamanho padrão:** 20x20px (UI), 24x24px (destaque), 40x40px (hero/feature)

### Containers de ícone

- Background: accent-purple/15% (roxo sutil)
- Border-radius: 12px (rounded-xl)
- Padding: proporcional ao tamanho do ícone

### Cards

- Background: var(--bg-card)
- Border: 1px solid var(--border-default)
- Border-radius: 12px
- Hover: border muda para var(--border-focus) + sútil bg shift

### Botoes

| Variante | Background | Texto | Borda |
|----------|-----------|-------|-------|
| **Primário** | var(--accent-purple) | branco `#FFFFFF` | nenhuma |
| **Secundario** | transparente | var(--text-secondary) | var(--border-default) |
| **Ghost** | transparente | var(--text-muted) | nenhuma |
| **Danger** | var(--danger) | branco | nenhuma |

- Border-radius: 8px (rounded-lg)
- Altura padrão: 40px (h-10)
- Font: Inter SemiBold 14px

---

## 8. Aplicações

### Landing Page

- Fundo: var(--bg-primary) — dark
- Hero: headline em Sora ExtraBold, accent purple no CTA
- Seções alternam entre bg-primary e bg-card para ritmo visual
- Imagens: screenshots do produto com borda sutil, nunca mockups genéricos

### App (Dashboard)

- Sidebar: bg-card com items em text-muted, ativo em accent-purple
- Cards de dados: bg-card com borda, hover interativo
- Graficos: cores por teoria (6 cores distintas, sem repetir)
- Formularios: inputs com bg-primary, borda default, focus purple

### Email (Brevo)

- Fundo: #0B0E14 (grafite, consistente com app)
- Texto: #E6EDF3 (primary)
- CTA: botao purple (#6f32b1) com texto branco
- Logo: Electia by Emprega+ no header

### Redes Sociais

- Posts: fundo grafite (#0B0E14) com accent purple para destaques
- Tipografia: Sora Bold para frases de impacto
- Elementos gráficos: linhas e shapes em purple/15%
- Nunca usar fotos de banco de imagens genéricas

### PDF / Relatórios

- Header: logo + nome da empresa + data
- Tipografia: Inter (corpo) + Sora (titulos de seção)
- Cores de teoria nos gráficos
- Footer: "Gerado por Electia by Emprega+ — electia.empregamais.me"

---

## 9. Nomenclatura de Produto

| Termo | Grafia Correta | Nunca usar |
|-------|----------------|------------|
| Nome do produto | Electia | electia, ELECTIA, Eléctia |
| Com endosso | Electia by Emprega+ | Electia by ResultX, Electia/Emprega+ |
| Feature IA | Mentor AI | Mentor IA, mentor ai, Consultor IA |
| Subtitulo Mentor | Assistente de Gestão de Pessoas | Consultor de RH, Chatbot |
| Testes | Testes Situacionais | Testes de pegadinha, SJT |
| Módulo N1 | Cenarios de Postura | Assessment de Postura |
| Módulo N2 | Inventario de Práticas | Assessment de Maturidade |
| Módulo N3 | Diagnóstico de Lideranca | SJT de Prontidao |
| Módulo N4 | Termometro Organizacional | Pulso Coletivo |
| Teste antigo | Tipologia Cognitiva | MBTI |
| Plano gratis | Gratis | Free, Freemium |
| Trial | Teste gratis de 14 dias | Free trial, trial period |

---

## 10. Coexistência com Emprega+

### O que compartilham

- Fontes: Sora (headings) + Inter (body)
- Filosofia: empregabilidade, pessoa certa no lugar certo
- Dominio: electia.empregamais.me (subdominio da Emprega+)

### O que difere

| Aspecto | Emprega+ | Electia |
|---------|----------|---------|
| Público | Candidatos, editais, vagas | Gestores, RH, diretoria |
| Modelo | B2C (gratuito) | B2B SaaS (assinatura) |
| Tom | Acolhedor, motivacional | Direto, provocativo, inteligente |
| Paleta | Gold + grafite light (institucional) | Purple + grafite dark (identidade própria) |
| Complexidade | Simples, acessível | Profundo, dados, IA |

O Electia herda a credibilidade da Emprega+ mas se posiciona como produto premium para decisores corporativos.

### Hierarquia legal e canais

```
ResultX (CNPJ único, Marcos Carneiro CEO)
└── Emprega+ (marca-mae, plataforma empregabilidade)
    ├── Emprega+ direto    canais: empregamais.me + @empregamais (Insta + LinkedIn)
    ├── IMO                via Emprega+ (sem canais próprios)
    ├── Electia            via Emprega+ (sem canais próprios)
    └── Editais            via Emprega+ (parado, reformulacao prevista)
```

**O que isso significa para a comúnicação do Electia:**

1. **Electia NAO tem rede social própria.** Toda comúnicação social (posts, anuncios, lives) passa por `@empregamais` (Instagram + LinkedIn empresa).
2. **Domain:** `electia.empregamais.me` — subdominio da Emprega+, nunca dominio próprio.
3. **Endorsement obrigatório:** "Electia by Emprega+" em todo material público (site, anuncios, social, PDF).
4. **Entidade legal nas comúnicações:** "ResultX" aparece apenas em Termos, Privacidade, NF — nunca em marketing.
5. **Marcos Carneiro NAO e o canal do Electia.** Marcos representa PdV (personal-brand). Electia se comúnica como empresa, não como pessoa.

> Mapa completo da arquitetura de marcas: `../../README.md`

---

## 11. Origem da Marca

### A história por tras do Electia

Electia não nasceu de pesquisa de mercado. Nasceu de 12 anos de consultoria observando o mesmo padrão em empresas brasileiras: **o problema raramente eram as pessoas — eram pessoas desencaixadas**.

A ResultX (consultoria fundada por Marcos Carneiro) atendia PMEs e grandes operações brasileiras desde 2012. Em cada projeto de turnover alto, baixo engajamento ou conflito de equipe, o diagnóstico se repetia: gestores não sabiam quem tinham na equipe. O RH usava ferramentas rasas (DISC isolado, MBTI não-validado), faziam o teste uma vez na contratação e esqueciam.

A IA generativa de 2024-2026 tornou possivel o que era inviável antes: cruzar 6 teorias psicometricas de forma narrativa, interpretar contextos situacionais e gerar planos de desenvolvimento personalizados. Onde antes era preciso um psicologo para 8 horas de leitura, hoje a IA entrega em 30 segundos — sem substituir o psicologo, mas dando escala.

O nome **Electia** vem do grego *electio* — "o eleito, o escolhido". Reforca a promessa central:

> "Sua equipe não e ruim. Esta desencaixada."

Cada colaborador e o eleito de algum lugar — o trabalho do Electia e mostrar qual.

### O fundador — visão de produto

Marcos Carneiro traz para o Electia uma combinacao rara:

| Origem | Contribuicao para o produto |
|--------|----------------------------|
| **Engenheiro** (formação) | Rigor metodológico, base científica não-negociavel |
| **Empreendedor** (CRONIC Jeans, ResultX, Emprega+) | Foco em produto B2B real, não academico |
| **Consultor 12+ anos** | Conhecimento profundo da dor do gestor brasileiro |
| **Católico aplicado** (implícito) | Ética não-negociavel: LGPD, CFP, saúde mental |

**O que isso significa para a voz do Electia:** científico mas pratico, sofisticado mas direto, ousado em provocar mas blindado em etica.

---

## 12. Posicionamento Estratégico

### Declaracao de posicionamento

> Para diretores de RH, gestores de pessoas e CEOs de empresas brasileiras que precisam tomar decisões melhores sobre quem contratar, promover, desenvolver ou onde realocar — Electia by Emprega+ e uma plataforma SaaS de assessments comportamentais que, diferente de testes DISC rasos, MBTI não-validado ou consultorias caras de people analytics, cruza 6 teorias científicas (DISC + Tipologia Cognitiva + Eneagrama + Big Five + Le Senne + Motivadores) com IA aplicada e cenários situacionais — para que líderes entendam suas equipes com profundidade real e tomem decisões baseadas em comportamento, não em achismo.

### Perfil do cliente ideal (ICP)

| Atributo | Definição |
|----------|-----------|
| **Quem** | Diretores de RH, gestores de pessoas, CEOs/founders de PMEs (50-500 colab) |
| **Tamanho** | 50 a 1.000 colaboradores (sweet spot 100-300) |
| **Setores** | Tecnologia, serviços profissionais, varejo, industria leve |
| **Maturidade RH** | Empresa que já faz avaliação de desempenho mas sente que ela e rasa |
| **Gatilho de compra** | NR-1 (saúde mental), turnover alto, conflito de equipe, dificuldade de promoção interna |

### A dor — nas palavras deles

> "Contratamos um senior brilhante no papel, em 6 meses ele estava paralisando o time."
>
> "Meu RH faz DISC ha 3 anos. Ninguem mais olha o resultado depois da contratação."
>
> "A NR-1 vai pegar a gente. Não tenho como mapear saúde mental de 250 pessoas com 1 psicologa."
>
> "Eu sei quem da resultado. Não consigo explicar pro RH por que."

O que essas frases revelam: **autoimagem não bate com comportamento real**. Falta um instrumento que veja a pessoa por múltiplos angulos e mostre como ela age sob pressao.

### Alternativas competitivas

| Alternativa | Por que não funciona | O Electia e diferente porque... |
|-------------|----------------------|--------------------------------|
| **DISC isolado** (Sólides, Etalent) | 1 teoria só. Reduz pessoa a 4 cores. Resultado raso | Cruza 6 teorias — DISC + 5 outras complementares |
| **MBTI tradicional** | Nao-científicamente validado, 16 caixas rigidas | Migrou para Tipologia Cognitiva (validação + 8 funções) |
| **People analytics enterprise** (Korn Ferry, Mercer) | R$100k+, consultoria longa, fora do alcance de PME | SaaS self-service, planos de R$149-R$5k/mes |
| **Pulses de clima** (Pulses, Buk, Feedz) | Mede sentimento, não comportamento | Mede comportamento estavel + traz IA aplicada |
| **Mereo, Lattice** (OKRs/desempenho) | Foco em metas, não em pessoas | Foco em pessoas (assessment) — complementar |
| **Consultoria caso-a-caso** | Lenta (semanas), não escala, depende de individuo | 30 segundos para relatório cruzado, escala infinito |

### Atributos únicos do Electia

1. **6 teorias cruzadas** — DISC + Tipologia Cognitiva + Eneagrama + Big Five + Le Senne + Motivadores. Nenhum competidor brasileiro cruza tantas teorias com narrativa única
2. **IA aplicada com etica blindada** — IA interpreta, narra, recomenda. Mas nunca substitui psicologo (CRP) em decisão clinica
3. **Módulos situacionais N1-N4** — cenários sob pressao revelam comportamento real, não autoimagem
4. **NR-1 compliant** — módulo Saúde Mental gerido por psicologo (CRP) com acesso compartimentado
5. **LGPD by design** — consent gate, soft-delete 30d, cron mensal de cleanup, DPO designado
6. **Cobertura Brasil-real** — pt-BR nativo, mapeamento de cargos brasileiros, integracao com folha/ERP daqui
7. **Heranca Emprega+** — credibilidade de plataforma B2C já consolidada (milhões de candidatos)

### Por que agora

- **NR-1 (Saúde Mental no Trabalho)** — Norma regulamentadora que obriga empresas a mapear saúde mental. 89% das PMEs não estao prontas. Electia entrega protocolo CFP-compliant pronto
- **Gestores sobrecarregados** — pos-pandemia, gestor brasileiro lidera 8-12 pessoas com zero ferramenta. Mentor AI vira "consultor 24/7"
- **IA passou do POC para produção** — GPT-4o e equivalentes tornaram custo de interpretação narrativa <R$0.01/relatório. Era inviável até 2024
- **Brasil tem 2.5M empresas com 50+ colab** — TAM R$18-30M/ano (apenas o módulo basico, sem upsell)

### Categoria de mercado

**Plataforma de Assessment Comportamental e Saúde Mental Organizacional.**

Não e ATS. Não e LMS. Não e ERP de RH. E o **instrumento que conecta dados de pessoa a decisões de gestão** — o "raio-X comportamental" da equipe.

---

## 13. Arquétipo de Marca

### Triade arquetipica: Sábio + Mago + Cuidador

O Electia opera com três arquétipos em equilibrio. Diferente do PdV (Heroi-Rebelde-Sabio, motor de coragem), o Electia e motor de **profundidade, transformação e cuidado**.

#### O Sábio (dominante) — Profundidade científica

| Aspecto | Expressao no Electia |
|---------|---------------------|
| **Motivacao** | Mostrar a verdade comportamental por tras da fachada |
| **Promessa** | "Você vai entender sua equipe como nunca entendeu" |
| **Tom** | Profundo, científico, cada afirmacao referênciada |
| **Simbolo** | A clarividencia — ver o que esta latente |

#### O Mago — Transformação por dados/IA

| Aspecto | Expressao no Electia |
|---------|---------------------|
| **Motivacao** | Transformar dados em decisão acionavel |
| **Promessa** | "30 segundos para o que antes levava 8 horas de psicologo" |
| **Tom** | Tech-forward, IA como ferramenta nobre (não buzzword) |
| **Simbolo** | Energy core / aurora — energia em movimento (vide aurora-hero-v1) |

#### O Cuidador — Ética blindada

| Aspecto | Expressao no Electia |
|---------|---------------------|
| **Motivacao** | Proteger o colaborador. Saúde mental não e dado de RH |
| **Compromisso** | CFP, LGPD, soft-delete, consent gate, psicologo no circuito |
| **Tom** | Sereno, responsável, sem urgencia falsa |
| **Simbolo** | O escudo — protecao individual contra o coletivo |

### O que o Electia NAO e

| Anti-arquétipo | Por que não |
|----------------|-------------|
| O Heroi motivacional | Não vendemos superacao emocional. Vendemos dados |
| O Bobo da corte | Tom serio. Saúde mental no trabalho não e marketing leve |
| O Vendedor agressivo | Não usamos urgencia falsa, scarcity sintetico, FOMO |
| O Guru de RH | Não prometemos "transformar sua cultura". Damos instrumento, você decide |

### Framework etico (implícito, nunca explícito)

A marca trabalha 4 valores não-negociaveis que aparecem em decisões de produto, não em copy de marketing:

| Valor | Manifestacao no produto |
|-------|------------------------|
| **Verdade científica** | Toda teoria usada e validada. Migramos MBTI -> Tipologia Cognitiva por causa disso |
| **Consentimento** | Consent gate LGPD em onboarding. Soft-delete 30d. Cron mensal de purge |
| **Compartimentalizacao** | Admin não ve dado clinico. RH não ve resultado individual de saúde mental. Só psicologo (CRP) ve |
| **Dignidade do dado** | Resultado individual nunca usado para ranking ou demissão. Apenas desenvolvimento |

---

## 14. Fotografia e Imagens

### Asset hero canônico: `aurora-hero-v1`

**Arquivos:** `assets/hero/aurora-hero-v1.{mp4, webm, poster.jpg}`
**Status:** ✅ v1 em produção desde 2026-05-10 (modo Electia Subtle validado por Marcos)
**Origem:** Pexels (Colin Jones / @larchmedia) — Pexels License (uso comercial OK)
**Dimensoes:** 1920x1080 @ 24fps · 12s loop perfeito · 4.6 MB MP4 + 4.8 MB WebM + 71 KB poster JPG

Este e o asset visual primário da marca Electia. Aparece no hero de LPs, materiais institucionais e capas. Detalhes técnicos completos em `assets/hero/README.md`. Demo funcional com 3 modos toggle em `previews/aurora-hero-demo.html`.

### Filosofia visual

Electia não usa fotografia tradicional de RH (sorrisos corporativos, salas reluzentes, equipes em ilhotas). A estética visual e **abstrata, tech, científica** — refletindo o produto: dados em movimento. O aurora-hero-v1 (acima) e a materializacao dessa filosofia.

### Estilo visual

| Aspecto | Diretriz |
|---------|----------|
| **Iluminacao** | Dark mode dominante (grafite). Contraste alto. Glows purple sutis |
| **Temperatura** | Frias. Tons purple, grafite, royal blue. Acentos sutis em ambar (saúde mental) |
| **Movimento** | Lento, organico, "silk-flow". Nunca frenetico |
| **Densidade** | Limpa, com whitespace. Dado e protagonista — texto e suporte |
| **Cor dominante** | Grafite (#0B0E14 base) com acentos purple (#6f32b1) e amber em estados especiais |

### Categorias de imagem

| Categoria | Descricao | Uso |
|-----------|-----------|-----|
| **Abstract energy flow** | Fios, fitas, energy core, particles (vide aurora-hero-v1) | Hero sections, fundos, capas |
| **Data visualization estetizada** | Charts limpos, mockups de dashboards, network graphs | LP, features, blog técnico |
| **Retrato profissional** | Gestores reais, profissionais maduros, expressão pensativa | Depoimentos, social proof |
| **Detalhe tech** | Código em monitor, terminal, IA em acao | Material técnico, blog dev |

### Tratamento de imagem

#### Overlay padrão
```css
background: linear-gradient(
  180deg,
  rgba(27, 42, 74, 0.55) 0%,
  rgba(27, 42, 74, 0.20) 35%,
  rgba(27, 42, 74, 0.20) 65%,
  rgba(27, 42, 74, 0.92) 100%
);
```

#### Filter padrão (sobre vídeos hero — ver aurora-hero-v1)
```css
filter: brightness(0.38) saturate(0.55) hue-rotate(-12deg) contrast(1.10);
```

#### Color grade fotográfico
- **Saturacao**: Reduzir 30-40%
- **Contraste**: Alto (+15%)
- **Sombras**: Empurrar para frio (grafite/purple)
- **Highlights**: Manter neutros
- **Referência**: Look tech moderno, não editorial

### Imagens proibidas

- Stock photos de RH genéricas (sorrisos, polegares, brindes, mesas circulares)
- Cliches de "diversidade forcada" (cada raca e genero posando)
- Imagens motivacionais (montanhas, sol nascendo, "você consegue")
- Fotos de equipes felizes em cafe
- IA generativa com artefatos visíveis
- Cenarios de luxo corporativo
- Imagens em paleta gold/warm (essa e a paleta PdV — não confundir)

---

## 15. Checklist de Validação

Antes de publicar qualquer material visual:

- [ ] Fundo escuro (não branco)?
- [ ] Fonte correta (Sora titulos, Inter corpo)?
- [ ] Cores dentro da paleta Electia (roxo #6f32b1, grafite #0B0E14, branco)?
- [ ] ZERO gold/amber como destaque primário (ouro só em gradient C premium, ex: badge "Recomendado")?
- [ ] Roxo como UNICA cor de destaque primária?
- [ ] Logo presente com área de protecao respeitada?
- [ ] Tom de voz alinhado (científico, direto, sem motivacional vazio)?
- [ ] CTA digno e claro (máximo 2 por peca)?
- [ ] Imagens tratadas (overlay dark, dessaturacao, contraste alto)?
- [ ] Nenhuma imagem genérica de RH (sorrisos corporativos, polegares, brindes)?
- [ ] Contraste acessível (WCAG AA — 4.5:1 para texto)?
- [ ] Sem caixa alta em titulos ou parágrafos?
- [ ] Animacao com `prefers-reduced-motion` respeitado?
- [ ] Nomenclatura correta ("Electia", "Mentor AI", "Tipologia Cognitiva" — vide seção 9)?
- [ ] Se mencionar saúde mental: gate de psicologo (CRP) explícitado?
- [ ] Se coleta dados: consent gate LGPD presente?
- [ ] Sem promessas de "diagnóstico" ou "tratamento" clinico (não somos terapia)?

---

## 16. Aplicação na LP e Plataforma

Como instalar e aplicar este Brand Book no código real da LP (electia.empregamais.me institucional) e da plataforma (app electia.empregamais.me).

### 16.1 Quem consome o Brand Book

| Surface | Stack provavel | Path no monorepo |
|---------|---------------|------------------|
| **LP institucional** | Next.js + Tailwind | `resultx/electia/` (Next 16 app router) |
| **Plataforma SaaS** | Next.js + Supabase | `resultx/electia/` (mesmo repo, área autenticada) |
| **Email Brevo** | HTML estatico | usa `brands/electia/templates/email/*` |

### 16.2 Importar fontes (Google Fonts)

Adicionar no `<head>` da LP/plataforma (uma única vez no layout raiz):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

No Next.js (App Router), prefira `next/font/google` para self-host automático:

```ts
// app/layout.tsx
import { JetBrains_Mono, Sora, Inter } from 'next/font/google';

const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['500','600','700'], variable: '--font-mono' });
const sora      = Sora({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-display' });
const inter     = Inter({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-body' });

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${jetbrains.variable} ${sora.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### 16.3 Importar tokens (CSS variables)

O DS multi-brand vive em `resultx-design-system` (NPM). Ordem de import:

```css
/* 1. Tokens base do DS root (cores genéricas, escalas) */
@import 'resultx-design-system/tokens';

/* 2. Override Electia (paleta purple + tokens específicos) */
@import 'resultx-design-system/brands/electia/tokens/tokens.css';
```

Ou se o código viver no mesmo monorepo, importar por path relativo:

```css
@import '../../design-system/tokens/tokens.css';
@import '../../design-system/brands/electia/tokens/tokens.css';
```

Apos isso, todas as CSS variables ficam disponíveis: `var(--bg)`, `var(--purple)`, `var(--text-primary)`, `var(--surface-1)`, etc.

### 16.4 Aplicar o wordmark

Copiar os SVGs de `brands/electia/assets/logo/` para `public/brand/` da LP/plataforma:

```bash
cp brands/electia/assets/logo/electia-wordmark.svg          electia-app/public/brand/
cp brands/electia/assets/logo/electia-wordmark-accent.svg   electia-app/public/brand/
cp brands/electia/assets/logo/electia-wordmark-light.svg    electia-app/public/brand/
cp brands/electia/assets/logo/electia-short.svg             electia-app/public/brand/
cp brands/electia/assets/logo/electia-monogram.svg          electia-app/public/brand/
cp brands/electia/assets/logo/electia-monogram-purple.svg   electia-app/public/brand/
cp brands/electia/assets/logo/electia-lockup-vertical.svg   electia-app/public/brand/
```

Uso no header:

```tsx
import Image from 'next/image';

export function Header() {
  return (
    <header>
      <Image
        src="/brand/electia-wordmark.svg"
        alt="electia by emprega+"
        width={200}
        height={40}
        priority
      />
    </header>
  );
}
```

Favicon (helper "e"):

```tsx
// app/icon.tsx (Next.js auto-icon)
import { ImageResponse } from 'next/og';
export const size = { width: 256, height: 256 };
export const contentType = 'image/png';
export default function Icon() {
  // Renderiza electia-monogram.svg ou retorna SVG inline equivalente
}
```

Ou estatico em `public/favicon.svg` (apontar do `<head>` do layout).

### 16.5 Aplicar o aurora-hero

Copiar os 3 assets de `brands/electia/assets/hero/`:

```bash
mkdir -p electia-app/public/hero/
cp brands/electia/assets/hero/aurora-hero-v1.mp4         electia-app/public/hero/
cp brands/electia/assets/hero/aurora-hero-v1.webm        electia-app/public/hero/
cp brands/electia/assets/hero/aurora-hero-v1.poster.jpg  electia-app/public/hero/
```

Componente React:

```tsx
export function AuroraHero({ children }) {
  return (
    <section className="aurora-hero-frame">
      <video
        autoPlay muted loop playsInline preload="metadata"
        poster="/hero/aurora-hero-v1.poster.jpg"
      >
        <source src="/hero/aurora-hero-v1.webm" type="video/webm" />
        <source src="/hero/aurora-hero-v1.mp4" type="video/mp4" />
      </video>
      <div className="scrim" />
      <div className="content">{children}</div>
    </section>
  );
}
```

CSS aplicado (modo Electia Subtle oficial):

```css
.aurora-hero-frame {
  position: relative;
  width: 100%;
  min-height: clamp(420px, 78vh, 820px);
  overflow: hidden;
  isolation: isolate;
  background: var(--bg);
}
.aurora-hero-frame vídeo {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  z-index: 0;
  filter: brightness(0.38) saturate(0.55) hue-rotate(-12deg) contrast(1.10);
}
.aurora-hero-frame .scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(ellipse at center, rgba(111, 50, 177, 0.06) 0%, transparent 45%, rgba(27, 42, 74, 0.55) 75%),
    linear-gradient(180deg, rgba(27, 42, 74, 0.65) 0%, rgba(27, 42, 74, 0.35) 40%, rgba(27, 42, 74, 0.40) 60%, rgba(27, 42, 74, 0.96) 100%);
}
.aurora-hero-frame .content {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  text-align: center;
  padding: clamp(80px, 18vh, 200px) 24px;
}

/* Reduced motion: pausar vídeo, mostrar só poster */
@média (prefers-reduced-motion: reduce) {
  .aurora-hero-frame vídeo { display: none; }
  .aurora-hero-frame::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/hero/aurora-hero-v1.poster.jpg') center/cover;
    filter: brightness(0.38) saturate(0.55) hue-rotate(-12deg);
  }
}
```

### 16.6 Email Brevo

Os 4 templates em `brands/electia/templates/email/` (electia-email-base, newsletter, product-cta, brevo-base.yaml) já estao com paleta purple e grafia lowercase. Subir direto no painel Brevo via importacao YAML.

### 16.7 Checklist por surface

**Antes de subir uma nova pagina/LP do Electia, verificar:**

- [ ] Fontes Google carregadas (JetBrains Mono + Sora + Inter)
- [ ] Tokens importados (`@import` ou via Next/Tailwind config)
- [ ] Wordmark `electia by emprega+` no header (SVG do `public/brand/`)
- [ ] Favicon helper "e" no `<link rel="icon">`
- [ ] Hero usa `<AuroraHero>` ou equivalente com filter electia-subtle
- [ ] Cores apenas via `var(--*)` (zero hardcoded)
- [ ] Texto principal em `var(--text-primary)`, secundário em `var(--text-secondary)`
- [ ] Background dark (`var(--bg)` ou `var(--surface-1)`)
- [ ] `prefers-reduced-motion` respeitado em vídeos/animacoes
- [ ] Grafia "electia" minuscula em todo copy
- [ ] Endorsement "by emprega+" presente onde aplicável
- [ ] CTA usa cor `var(--purple)` ou gradient B (roxo→royal blue)
- [ ] WCAG AA: contraste 4.5:1 mínimo testado

### 16.8 Mapa de onde cada arquivo vive

```
brands/electia/                          <- fonte da verdade (este DS)
├── docs/BRAND-BOOK.md                   <- este arquivo (sempre consultar)
├── tokens/tokens.css                    <- importar na LP/plataforma
├── tokens/tokens.json                   <- W3C tokens (para build tools)
├── assets/logo/*.svg                    <- copiar para public/brand/
├── assets/hero/aurora-hero-v1.*         <- copiar para public/hero/
└── templates/email/*                    <- importar no Brevo

resultx/electia/                         <- consumidor (LP + plataforma)
├── public/
│   ├── brand/electia-wordmark.svg       <- copia do DS
│   ├── hero/aurora-hero-v1.{mp4,webm,jpg}  <- copia do DS
│   └── favicon.svg                      <- electia-monogram.svg renomeado
├── app/layout.tsx                       <- fontes + tokens import
├── components/AuroraHero.tsx            <- usa o vídeo hero
├── components/Header.tsx                <- usa o wordmark
└── styles/globals.css                   <- @import dos tokens
```

### 16.9 Atualizar quando o Brand muda

Sempre que este Brand Book virar v2.1, v2.2, etc:
1. Atualizar `brands/electia/` (fonte da verdade)
2. Bump versão no `package.json` do DS root
3. Republicar NPM se for um consumidor externo
4. Na LP/plataforma, atualizar imports + copiar novos assets
5. Documentar mudanças no CHANGELOG.md do Electia + da LP/plataforma

---

## 17. Diretrizes de Aplicação Visual

> Adicionado 2026-05-25. Regras de uso prático pra peças, materiais e qualquer criação visual Electia.

### 17.1 Cores — quando usar cada uma

#### Roxo `#6f32b1` (Purple canonical)

**USE EM:**
- ✅ CTAs principais ("Começar grátis", "Criar conta") — fill sólido com texto branco
- ✅ Links inline em texto corrido
- ✅ Eyebrows (rótulos uppercase pequenos acima de títulos)
- ✅ Bordas/ícones de destaque
- ✅ Wordmark "electia" sobre fundo grafite
- ✅ Glow effect (`box-shadow: 0 0 30px rgba(111,50,177,0.35)`)

**NÃO USE EM:**
- ❌ Texto corpo (parágrafos) — usar branco/gray
- ❌ Backgrounds grandes (fica pesado) — usar grafite
- ❌ Cor de erro/aviso — usar semantic colors

#### Roxo Light `#a55eea`

**USE EM:**
- ✅ Hover state de CTAs (mostra que botão acordou)
- ✅ Highlights em textos pequenos sobre fundo dark
- ✅ Focus ring (passa WCAG 2.4.11)

#### Grafite Base `#0B0E14`

**USE EM:**
- ✅ Background principal de TODA peça dark
- ✅ Cards principais
- ✅ Texto inverso (sobre fundo branco)

**NÃO USE EM:**
- ❌ Texto sobre dark (vai sumir)

#### White `#FFFFFF`

**USE EM:**
- ✅ Texto principal sobre grafite
- ✅ Logo wordmark sobre grafite
- ✅ Headlines

**NÃO USE EM:**
- ❌ Backgrounds grandes — peça fica "espacial demais"

#### Semantic (Success/Error/Warning)

**USE APENAS EM:**
- Confirmações de form/CTA submetido (Success)
- Mensagens de erro de validação (Error)
- Avisos contextuais (Warning)

**NÃO USE EM:**
- ❌ Peças de marketing/social — quebra a paleta brand
- ❌ Decoração — usar só funcionalmente

### 17.2 Gradients — uso seletivo

#### B — Default (`#6f32b1 → #2040a0` Royal Blue)

**USE EM:**
- ✅ Hero CTA principal (1 por peça)
- ✅ Badges destacados
- ✅ Background hero de seções

**FREQUÊNCIA:** alta — pode aparecer em 30-50% das peças

#### C — Premium (`#6f32b1 → #b29442` Ouro)

**USE APENAS EM:**
- ✅ Badge "Recomendado" no pricing
- ✅ Indicador de plano enterprise
- ✅ Upgrade banners
- ✅ Certificações/achievements

**FREQUÊNCIA:** baixa — máximo 5% das peças (raro = especial)

#### Regra de ouro sobre gradients

❌ **NUNCA aplique gradient em texto pequeno** (corpo, captions, labels). O olho não lê tons que variam.
✅ Gradient só em texto **GRANDE** (h1, h2 hero) ou em **fills** (botões, badges, backgrounds).

### 17.3 Fontes — hierarquia tipográfica

#### Sora (Heading)
**USE EM:**
- H1 hero (peso 800, 76px desktop / 40px mobile)
- H2 seções (peso 700, 44px desktop / 28px mobile)
- H3 títulos (peso 700, 24px desktop)
- Eyebrows (peso 600, 12px, uppercase, letter-spacing 0.15em)

#### Inter (Body)
**USE EM:**
- Parágrafos corpo (peso 400, 16px)
- Subtítulos (peso 500, 20px)
- UI labels, captions (peso 500, 13px)
- Botões (peso 600, 14-16px)

#### JetBrains Mono (Mono)
**USE EM:**
- ✅ Wordmark "electia" (peso 600/Semibold) — caso especial canônico
- ✅ Dados técnicos: hex codes, scores numéricos, IDs
- ✅ Swatches de cor
- ✅ Code blocks
- ❌ NÃO usar em copy/marketing — fica "muito técnico"

### 17.4 Logos — qual usar em qual contexto

| Contexto | Logo recomendado |
|---|---|
| Header website (dark) | `electia-wordmark.svg` |
| Header website (light) | `electia-wordmark-light.svg` |
| Footer | `electia-wordmark.svg` (menor) |
| Favicon | `electia-monogram.svg` (32×32, 64×64) |
| Avatar redes sociais | `electia-monogram-purple.svg` |
| Splash/Hero apresentação | `electia-lockup-vertical.svg` |
| Mobile nav apertado | `electia-short.svg` |
| Co-branding c/ parceiro | `electia-wordmark-accent.svg` |
| Email header | `electia-wordmark.svg` (440×120) |

#### Área de proteção (clear space)

Margem mínima ao redor do wordmark = **altura da letra "e"** do "electia". Nada (texto, imagem, borda) pode invadir esse espaço.

#### Tamanho mínimo

| Logo | Tamanho mínimo |
|---|---|
| Wordmark full | 120px largura |
| Monogram | 32px |
| Lockup vertical | 80px altura |

#### NUNCA faça com o logo

- ❌ Mudar a cor (sair de roxo/branco canonical)
- ❌ Esticar/comprimir desproporcional
- ❌ Adicionar sombra, outline, glow não-oficial
- ❌ Rotacionar
- ❌ Colocar sobre fundo de cor concorrente (gold, verde, etc)
- ❌ Adicionar elementos colados (ícones, taglines não-oficiais)
- ❌ Reproduzir o wordmark digitando o texto à mão — sempre usar SVG canonical

### 17.5 Combinações — paletas permitidas por contexto

#### Combinação 1: Hero corporativo (default)
- Background: Grafite base `#0B0E14`
- Headline: White `#FFFFFF` (Sora 800, com palavra-destaque em gradient B)
- Body: Gray 100 `#E8E8EC` (Inter 400)
- CTA: gradient B (roxo→azul) com texto branco
- Logo: `electia-wordmark.svg` (canto)

#### Combinação 2: Quote vibrante
- Background: Gradient B `#6f32b1 → #2040a0`
- Headline: White (Sora 700)
- Tagline: Inter 500 opacity 0.85
- Logo: `electia-wordmark.svg` (branco, canto)

#### Combinação 3: Light editorial (Gov/Editais)
- Background: White `#FFFFFF`
- Headline: Grafite `#0B0E14` (Sora 800)
- Body: Gray 500 `#5A5A66` (Inter 400)
- Accent: Roxo `#6f32b1` em links/destaques
- Logo: `electia-wordmark-light.svg`

#### Combinação 4: Dado/KPI
- Background: Grafite base
- Numeral grande: White ou gradient B (Sora 800, 120px+)
- Label embaixo: Gray 300 uppercase (Inter 500 + letter-spacing)
- Logo: monogram canto inferior direito

#### Combinação 5: Premium/Recomendado
- Background: Grafite base
- Badge "RECOMENDADO": gradient C (roxo→ouro) com texto branco + glow ouro
- Resto da peça: paleta padrão

### 17.6 Checklist pré-publicação

Antes de exportar/postar qualquer peça:

- [ ] Background está em paleta brand (grafite / branco / gradient B)?
- [ ] Roxo `#6f32b1` é o único acento de marca? (sem verdes/azuis aleatórios)
- [ ] Fonte é **Sora/Inter/JetBrains Mono** (não outras)?
- [ ] Gradient C aparece SÓ se peça é premium/upgrade? (não como decoração)
- [ ] Texto pequeno NÃO usa gradient?
- [ ] Logo está em variante correta pro fundo (light/dark)?
- [ ] Logo tem área de proteção respeitada?
- [ ] Contraste texto/fundo passa WCAG AA (mínimo 4.5:1)?
- [ ] Sem efeitos não-oficiais (sombra extrema, outline, fotos com filtro)?
- [ ] Logo no canto, não centralizado (a menos que seja lockup central proposital)?

---

## 18. Identidade para Postagens Sociais

> Esta seção extrai apenas a linguagem visual das referências: clima, cor, luz, profundidade e composição. Não extrai tipografia nem estilo de escrita.

### 18.1 O que extraímos das referências

- Atmosfera cinematográfica, escura e de alto contraste.
- Luzes de recorte e contaminação de cor nas bordas da cena.
- Fundo com profundidade: blur, bokeh, partículas, névoa e glow.
- Cena humana como eixo principal: retratos, close-ups, grupos, perfis e olhares.
- Sensação de movimento e conquista, sem parecer publicidade genérica.
- Camadas visuais sobre a imagem, em vez de texto “solto” diretamente no fundo.

### 18.2 O que não extraímos

- Fontes da referência.
- Tom de linguagem da peça.
- Copy promocional ou vocabulário da marca de origem.
- Paleta quente como identidade principal.
- Visual de RH stock, sorriso forçado, sala corporativa limpa demais.

### 18.3 Princípios de composição

| Elemento | Diretriz |
|----------|----------|
| **Base** | Grafite profundo como fundo dominante |
| **Foco** | Uma imagem principal por peça, com leitura imediata |
| **Assimetria** | Texto e sujeito podem dividir a tela, mas sem competição visual |
| **Profundidade** | Fundo desfocado, sujeito mais nítido, luz de borda e glow controlado |
| **Volume** | Sobreposição de cards, faixas e molduras para dar peso editorial |
| **Respiro** | Espaço negativo suficiente para a headline respirar |

### 18.4 Como o texto aparece sobre a imagem

- Headline curta, grande e com leitura imediata.
- Texto principal preferencialmente em bloco único, no máximo 2 blocos por peça.
- Alinhamento mais comum: esquerda, com exceção de layouts centralizados ou de capa.
- Destaque de 1 a 3 palavras em roxo `#6f32b1`, azul elétrico ou lavanda `#c084fc` sobre fundo escuro.
- Texto de apoio entra em card translúcido com blur, não direto em cima da área mais carregada da foto.
- Bordas com stroke fino em gradient ou roxo suave, nunca semântica aleatória.
- Quando houver número, data, contagem de série ou indicador de carrossel, ele entra em pill discreto no canto superior direito.

### 18.5 Tratamento de imagem

| Tratamento | Diretriz |
|-----------|----------|
| **Exposição** | Escurecer a base para dar leitura ao texto |
| **Contraste** | Alto, com pretos profundos e highlights controlados |
| **Saturação** | Reduzida; a cor aparece como luz, não como filtro inteiro |
| **Glow** | Sutil, concentrado em bordas, olhos, telas ou elementos de destaque |
| **Desfoque** | Usar em fundo, partículas e áreas periféricas |
| **Recorte** | Preferir cortes próximos e dramáticos, não cenas abertas genéricas |

### 18.6 Paleta visual das postagens

| Papel | Cor | Uso |
|------|-----|-----|
| **Dominante** | Grafite `#0B0E14` | Fundo e massa visual |
| **Texto** | Branco / off-white | Headline e corpo sobre fundo escuro |
| **Marca** | Roxo `#6f32b1` | Destaques, bordas, links, ênfase |
| **Apoio frio** | Azul elétrico / ciano / lavanda | Luz, aura, profundidade, não branding fixo |
| **Premiação** | Âmbar / ouro | Só em badges de conquista, certificação ou status premium |

### 18.7 Padrões de layout

| Tipo de peça | Estrutura recomendada |
|--------------|-----------------------|
| **Cover de carrossel** | Imagem forte + headline grande + contador no canto superior direito |
| **Manifesto** | Fundo escuro + frase curta + uma palavra destacada |
| **Educacional** | Título grande + subtexto em card + 3 a 5 pontos curtos |
| **Oportunidade / recrutamento** | Retrato humano + bloco de requisitos + CTA discreto |
| **Anúncio de produto** | Dashboard / tela / mockup + headline + label de contexto |

### 18.8 Regras de consistência

- A peça precisa parecer parte da mesma família, mesmo mudando o assunto.
- Cada post deve ter uma hierarquia clara: foco, mensagem, suporte e ação.
- A imagem não pode disputar com o texto.
- O brilho existe para guiar o olhar, não para decorar.
- Se a peça precisar de mais de dois blocos longos de texto, o layout está errado.

### 18.9 Templates base de postagem

#### Template A: Capa de carrossel

- Fundo: retrato ou cena humana em close, com contraste alto.
- Composição: sujeito em um lado, headline no outro, sem centralizar tudo.
- Texto: 1 frase principal + 1 apoio curto.
- Destaque: 1 palavra em roxo ou lavanda para criar ancoragem visual.
- Sinalização: pill discreto com `01` ou `1/5` no canto superior direito.
- Uso: abertura de série, manifesto, teaser de conteúdo.

#### Template B: Peça manifesto

- Fundo: grafite com textura, partículas ou luz abstrata.
- Composição: bloco de texto dominante com pouco ruído visual.
- Texto: frase curta e forte, ocupando a área central ou superior.
- Destaque: uma palavra em cor de acento, nunca mais que duas.
- Sinalização: opcional, somente se a peça fizer parte de uma sequência.
- Uso: posicionamento, opinião, virada de percepção.

#### Template C: Oportunidade ou anúncio

- Fundo: retrato profissional ou cena de trabalho, com recorte dramático.
- Composição: imagem ocupando metade ou mais da peça, com card textual sobreposto.
- Texto: título claro + bloco de requisitos ou contexto + CTA discreto.
- Destaque: ênfase controlada em uma linha só, para não virar peça comercial genérica.
- Sinalização: selo pequeno de contexto, como vaga, área ou etapa.
- Uso: recrutamento, chamada de ação, anúncio de disponibilidade.

#### Template D: Educacional

- Fundo: imagem tecnológica, dashboard, interface ou detalhe de produto.
- Composição: texto em bloco superior ou lateral, com espaço para leitura.
- Texto: título + 3 pontos curtos + fechamento direto.
- Destaque: número, dado ou palavra-chave em roxo.
- Sinalização: se houver série, usar indicador discreto no canto.
- Uso: explicação de conceito, feature, dado ou insight.

---

*Electia by Emprega+ — A pessoa certa no lugar certo.*
