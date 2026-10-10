# Brand Book — ResultX

**Versão:** 2.0 | **Data:** 2026-10-09 | **Classificação:** Interno

> ResultX é, ao mesmo tempo, a entidade legal (CNPJ) e a marca de consultoria. Este Brand Book descreve a identidade **como ela está no site novo (resultx.app, DS v2.8.1)**: tema grafite, Sora + Inter, header flutuante, acentos ouro e roxo. Vitrine navegável: [`../previews/brand-system.html`](../previews/brand-system.html). Tokens: [`../tokens/`](../tokens/). Logo: [`../assets/logo/README.md`](../assets/logo/README.md).
>
> **Regra da verdade.** Nenhum número, cliente, depoimento ou promessa entra em material da marca sem estar publicado e com fonte. Onde este documento traz conteúdo do Brand Book v1.0 que o site não publica, ele está marcado como *interno*.

---

## 1. Essência

### Posicionamento atual (site, 07–08/10/2026)

> **Implementação de IA e melhoria de processos.**
> "Sua empresa pode produzir mais com menos trabalho manual."

A ResultX identifica os gargalos da operação, implementa inteligência artificial e automações e capacita a equipe para ganhar produtividade, reduzir custos e decidir com mais informação. O primeiro passo é um **diagnóstico gratuito** dos desafios e das oportunidades de melhoria.

### Serviços (como o site os apresenta)

1. **IA e automação na operação**
2. **Sua equipe preparada para usar IA** (capacitação prática)
3. **Processos organizados para crescer**
4. **Software para os desafios do seu negócio**

### Aplicações por área (exemplos)

Comercial, Atendimento, Financeiro, RH, Gestão e Documentos. O site as chama de **exemplos de aplicações**: o escopo de cada projeto é definido na proposta comercial. Nunca apresente uma aplicação como entrega garantida.

### Método (como o site o apresenta)

Entender a operação → Definir o primeiro projeto → Implementar e preparar a equipe → Acompanhar e melhorar. **Cada etapa termina em um entregável.**

### Posicionamento anterior (histórico)

O Brand Book v1.0 (05/2026) e o site antigo diziam "Consultoria em Transformação Digital … squads de desenvolvimento". Esse texto está superado; não o use em material novo.

### Do Brand Book v1.0 (interno, não publicado no site)

- **Missão:** transformar a operação de empresas brasileiras com tecnologia, dados e gestão de pessoas, da estratégia à execução, sem terceirizar o pensar.
- **Valores:** Método · Profundidade técnica · Transformação real · Independência · Autonomia do cliente.
- Afirmações de histórico (anos de operação, cases, origem dos produtos) dependem de confirmação do Marcos antes de ir a qualquer peça pública. Esta versão não as repete.

---

## 2. Arquitetura de marca

```
ResultX (CNPJ · consultoria · marca-mãe legal)
├── Emprega+ (ecossistema de empregabilidade)
│   ├── IMO B2G
│   ├── Editais C&S
│   └── Electia by Emprega+ (B2B SaaS)
├── PdV (marca pessoal do Marcos)
└── ResultX Labs: Electia e Xscore, produtos que servem a consultoria
```

- Escreva sempre **ResultX** (R e X maiúsculos, sem espaço). Nunca `Result X`, `Resultx` ou `RESULTX`. Em frase, "a ResultX".
- A ResultX **não** aparece em material de marketing de Emprega+, PdV, IMO ou Electia. Em Termos, Privacidade e NF ela aparece como controladora.
- No site da ResultX, Electia e Xscore aparecem como **demonstrações**: telas reais, com dados de demonstração identificados como tal.
- Nunca coloque o logo Emprega+ e o da ResultX lado a lado.

---

## 3. Logo

Os arquivos vêm do site e estão em `assets/logo/` (detalhes, tamanhos e fundos no README da pasta).

| Peça | Descrição | Arquivo |
|---|---|---|
| Logomarca, fundo escuro (**padrão**) | `result` em minúsculas, branco, + `X` contornado em gradiente | `resultx-logo-on-dark.svg` |
| Logomarca, fundo claro | igual, com "result" em `#0B0E14` | `resultx-logo-on-light.svg` |
| Ícone / favicon | `X` sobre tile arredondado `#192744` | `resultx-favicon.svg`, `resultx-icon-{16,32,180,512}.png` |

- **Altura no header:** 25 px (desktop), 20 px (gaveta móvel), 22 px (rodapé).
- **Respiro:** a altura do `X` em todas as direções.
- **Gradiente do X:** `#2040A0 → #00AFEF → #8040A0 → #C08020 → #B29442`. É do logotipo e não se mistura com a ponte ouro → roxo da interface.
- **Não faça:** separar `result` e `X`, girar, distorcer, recolorir o `X`, aplicar sombra, contornar a palavra, usar o `on-dark` em fundo claro, usar o logo sobre imagem sem overlay escuro.
- **Superado:** a "direção v1.0" (wordmark `ResultX` em Sora com X ouro → roxo) nunca foi implementada e não corresponde ao site. Está descartada.
- **Pendente (Marcos):** vetor original do logo; trocar ou não o gradiente do X pela ponte ouro → roxo.

---

## 4. Cor

Tema padrão: **grafite**, o mesmo chão do DS, do Electia e do Xscore. O tema claro existe como opt-in para propostas e documentos.

### Grafite (tema padrão)

| Token | Hex | Uso |
|---|---|---|
| `--rx-bg` | `#0B0E14` | página |
| `--rx-surface-1` | `#111620` | faixas tintadas, rodapé |
| `--rx-surface-2` | `#161B26` | cards, painéis |
| `--rx-surface-3` | `#1C2333` | hover |
| `--rx-border-subtle` / `--rx-border` / `--rx-border-strong` | `#1E2736` / `#2A3444` / `#3D4A5C` | divisores, bordas |
| `--rx-text` | `#E6EDF3` | texto (16,3:1) |
| `--rx-text-secondary` | `#8B949E` | lead e apoio (6,3:1) |
| `--rx-text-muted` | `#8A939D` | metadado (6,2:1) |

### Acentos: a regra (extraída do CSS do site)

| Cor | Papel | Onde aparece |
|---|---|---|
| **Ouro** `--rx-gold` `#c4993b` | **Ação e estado ativo** | botão primário (tinta `#0B0E14`, 7,33:1), eyebrow, ícone em pastilha, link, nó do método, anel de foco, sombra do hover |
| **Roxo** `--rx-purple` `#6f32b1` | **Atmosfera** | luz de fundo do hero e do diagnóstico, moldura das telas de produto, ponta do gradiente da ponte |
| **Ponte** `--rx-gradient-bridge` (ouro → roxo, 135°) | **Assinatura** | fio do eyebrow, fio do painel do hero, topo do card, linha do método |

- Texto dourado: `--rx-gold-ink` (no escuro é o próprio ouro; no claro vira `#866425`, 5,44:1).
- **Roxo nunca é texto** (2,55:1 sobre o grafite) **nem preenchimento de botão.** Ouro nunca marca erro ou aviso.
- Semânticas (só estado): sucesso `#22c55e`, aviso `#f59e0b`, erro `#ef4444`, info `#3b82f6`.

### Tema claro (opt-in, `[data-theme="light"]`)

Fundo `#FFFFFF`, superfícies `#F8FAFB` / `#F0F3F5` / `#E8ECF0`, texto `#0F1729` / `#4B5563` / `#5F6672`, ouro como texto `#866425`. O ouro de preenchimento continua `#c4993b`. Use em propostas, documentos e slides; o site é só grafite.

### Diferenciação no ecossistema

| Marca | Accent | Chão |
|---|---|---|
| **ResultX** | ouro (ação) + roxo (atmosfera) | grafite |
| Electia | roxo | grafite |
| Xscore | ouro (ação) + roxo (inteligência) | grafite |
| Emprega+ | índigo, ouro como secundária | navy / claro |
| PdV | ouro | claro |

---

## 5. Tipografia

| Família | Papel | Pesos carregados |
|---|---|---|
| **Sora** | títulos, eyebrow, títulos de card | 500, 600, 700 |
| **Inter** | corpo, UI | 400, 500, 600, 700 |
| **JetBrains Mono** | rótulos, índices, dado | 500, 600 |

- H1: `--rx-text-h1` = `clamp(2.25rem, 1.35rem + 2.9vw, 3.6rem)`, Sora 700, entrelinha 1,08. H2: `--rx-text-h2` = `clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)`, Sora 700. H3: 1,25 rem, Sora 600. Corpo: 1 rem Inter. Lead do hero: 1,25 rem.
- **Eyebrow:** Sora 600, 0,75 rem, caixa alta, `letter-spacing: 0.16em`, ouro, com o fio da ponte antes.
- Rótulos e índices (`01`, `ENTREGÁVEL`): JetBrains Mono 600, caixa alta.
- `font-display: swap`. O site declara fontes de reserva (`Sora Fallback`, `Inter Fallback`) sobre a Arial, com métricas casadas, para a troca não mover o layout.
- Máximo de 3 famílias. Poppins e Roboto (site antigo) estão **descontinuadas**.

---

## 6. Tom e voz

| Atributo | É | Não é |
|---|---|---|
| Direto e prático | diz o que será feito e o que a pessoa recebe | promessa vaga |
| Consultivo | começa pelo diagnóstico do problema | vendedor de ferramenta |
| Acessível | explica sem simplificar demais | técnico impenetrável |
| Honesto | "exemplos de aplicações", "escopo definido na proposta" | resultado garantido |

- Português do Brasil, frases e parágrafos curtos, "nós" quando transmite responsabilidade.
- Sem jargão vazio ("sinergia", "stakeholder", "ecossistema de soluções").
- **Dado concreto só com fonte publicada.** Nunca invente percentual, prazo, cliente ou ganho. Exemplo de tom correto: "Cada etapa termina em um entregável." Exemplo errado: um percentual de redução sem fonte.
- Chamadas do site: "Solicitar diagnóstico gratuito", "Quero identificar oportunidades na minha empresa", "Conhecer aplicações de IA".

---

## 7. Iconografia

**Lucide**, contorno, `stroke-width` 2, `currentColor`, sempre decorativos (o texto ao lado dá o nome). Tamanhos do DS: `.icon-sm` 16 px, `.icon-md` 20 px, `.icon-lg` 24 px.

Em pastilha (`.icon-chip`): 40 px (52 px nos cards de serviço), borda `--border-accent`, fundo `--accent-primary-muted`, ícone em ouro.

**Orb: não usar.** A orb animada é a assinatura dos agentes de IA do DS (Nexus, Copilot Electia, IMO, Xscore). A ResultX não tem agente próprio.

---

## 8. Aplicações

### Site (resultx.app)

- Tema grafite, `data-theme="dark"`, accent ouro pela ponte da marca.
- **Header flutuante** (`.header-float` do DS): pílula de vidro, logomarca de 25 px (20 px abaixo de 1024 px), links de 16 px, barra de 76 px, CTA "Solicitar diagnóstico". Abaixo de 1024 px os links viram a gaveta (`.menu-drawer`).
- Estrutura: hero (promessa + fluxo de 3 passos) · problemas · aplicações por área · serviços · demonstrações · método · sobre · perguntas · diagnóstico (formulário) · rodapé.
- Faixas alternam grafite e `--bg-surface-1`. Cards usam `.card` do DS com profundidade no hover.

### Imagens

- **Ambiência:** arte gerada, em WebP, sobre o grafite, com ouro e roxo da ponte, atrás do conteúdo e apagada nas bordas por máscara. A opacidade de cada uma é medida para o texto por cima manter 4,5:1.
- **Telas de produto:** capturas reais de Electia e Xscore em moldura de navegador (`.screen-frame`), com **dados de demonstração** identificados como tal.
- **Sem pessoas como cliente ou equipe**, sem depoimento, sem logotipo de cliente.
- Imagem decorativa não carrega informação essencial.

### Propostas, slides e e-mail

Tema claro (ou grafite para capas e seções de impacto), logomarca `on-light` (ou `on-dark`), ouro como destaque de ação, ponte como fio. Sem número inventado.

---

## 9. Movimento (resumo)

Expressivo, mas elegante. Revelar ao rolar (28 px, 800 ms, 90 ms por item), cards com profundidade no hover (6 px, 280 ms, fio da ponte, sombra e brilho ouro), método com fio que se desenha. Só `transform`, `opacity` e sombra; tudo respeita `prefers-reduced-motion`. Detalhes em [`MOTION-GUIDE.md`](MOTION-GUIDE.md).

---

## 10. Nomenclatura

| Termo | Grafia | Nunca |
|---|---|---|
| Marca | **ResultX** | Result X, Resultx, RESULTX, resultX |
| URL | `resultx.app` | — |
| Referência legal | ResultX Consultoria em Transformação Digital (razão social do CNPJ) | — |
| Em frase | "a ResultX" | "o ResultX" |
| Contato | `contato@resultx.app` · WhatsApp (11) 96794-7557 | outro número |

---

## 11. Histórico e decisões em aberto

- **2026-05-27 (v1.0):** navy `#1B2A4A`, tema adaptativo, wordmark Sora com X ouro → roxo, Poppins/Roboto no site. **Superado em 09/10/2026.**
- **2026-10-09 (v2.0):** alinhado ao site novo.
- **Pendente (Marcos):** (1) vetor original do logo e destino do gradiente do X; (2) quais afirmações de histórico podem ir a material público; (3) se haverá banner de LinkedIn e OG próprio no DS.

---

*Brand Book ResultX v2.0 — alinhado a resultx.app (DS v2.8.1), 09/10/2026.*
