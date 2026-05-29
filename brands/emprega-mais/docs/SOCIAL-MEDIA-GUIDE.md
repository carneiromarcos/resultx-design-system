# Guia de Social Media — Emprega+

**Versão:** 1.0 | **Data:** 2026-05-27

> Canal ativo: **@empregamais** (Instagram + LinkedIn empresa). IMO e Editais COMPARTILHAM esses canais (sem perfis próprios). Electia compartilha mas tem mala direta própria.

---

## 1. Regras Gerais (herdadas do Brand Book)

- **Paleta:** gold (`#c4993b`) + navy (`#1B2A4A`) — nunca usar cores fora da paleta oficial
- **Tipografia:** Sora (headings, 700-800) + Inter (body, 400-600)
- **Tom:** Profissional, acessível e otimista — mas sempre realista (ver BB §6)
- **Logo:** `emprega+` no canto inferior direito ou superior esquerdo — nunca centralizado
- **Accent:** gold é a ÚNICA cor de destaque (exceto badges de produto — ver §3)

---

## 2. Dimensões por Plataforma

| Plataforma | Formato | Dimensão | Uso principal |
|---|---|---|---|
| Instagram feed | 1:1 | 1080×1080 | Posts padrão, dados, citações |
| Instagram feed | 4:5 | 1080×1350 | Carrosséis, conteúdo editorial |
| Instagram story / reels | 9:16 | 1080×1920 | Stories, reels, bastidores |
| LinkedIn post | 1.91:1 | 1200×627 | Artigos, cases, anúncios |
| LinkedIn banner | — | 1584×396 | Banner da página empresa |
| YouTube thumbnail | 16:9 | 1280×720 | Thumbnails de vídeo |
| YouTube banner | — | 2560×1440 | Banner do canal |
| WhatsApp status | 9:16 | 1080×1920 | Status, divulgação rápida |
| WhatsApp link preview | 1.91:1 | 1200×627 | OG image para links |

---

## 3. Tipos de Conteúdo Visual

### Por categoria

| Categoria | Fundo | Destaque | Exemplo |
|-----------|-------|----------|---------|
| **Vagas em destaque** | Navy escuro (`#1B2A4A`) | Gold (`#c4993b`) | "Vagas abertas: Analista de RH — Recife/PE" |
| **Dados de mercado** | Light (`#f5f7f9`) | Navy texto + gold accent | "32% dos candidatos não passam da primeira entrevista" |
| **Frases inspiracionais** | Gold gradient | White texto | Citações sobre trabalho, carreira, empregabilidade |
| **Depoimentos** | Light glass | Navy texto | Foto + quote de candidato/empresa/prefeito |
| **Bastidores Emprega+** | Foto real (warm grading) | Gold overlay sutil | Time trabalhando, eventos, visitas a prefeituras |
| **Produto (Gov B2G)** | Light | Green badge `#16a34a` | Features do IMO, resultados de prefeituras |
| **Produto (Editais C&S)** | Light | Cyan badge `#0891b2` | Features do Editais, ciclo do concurso |
| **Produto (Electia B2B)** | Dark + purple | Purple badge `#6f32b1` | Assessments, dados comportamentais |
| **Produto (PdV B2C)** | Gold accent | Gold badge `#c49a3c` | Workshops, comunidade, networking |

Cada produto usa seu gradient canônico (BB §7) no badge do canto. O restante do post segue a paleta Emprega+ (gold + navy).

---

## 4. Estrutura Narrativa (PAID)

Framework para copy de posts:

1. **P**roblema — dor real do público (desemprego, processo seletivo ruim, falta de dados, gestão pública ineficiente)
2. **A**gitação — consequências de ignorar (perda de talentos, custo de contratação errada, cidadão sem emprego)
3. **I**magine — cenário ideal com Emprega+ (plataforma que conecta, dados que decidem, transparência)
4. **D**ireção — CTA claro e único (link, DM, cadastro)

**Exemplo:**
> 🔍 **65% das prefeituras** ainda usam planilha pra gerenciar vagas de emprego. (P)
>
> Resultado: candidatos perdidos, processos lentos, zero rastreabilidade. (A)
>
> Imagina um portal onde o cidadão se cadastra, a empresa publica a vaga, e a prefeitura acompanha tudo em tempo real. (I)
>
> É isso que o Emprega+ Gov faz. Peça uma demonstração → link na bio. (D)

---

## 5. Temas por Eixo

| Eixo | Público | Frequência sugerida | Temas |
|------|---------|---------------------|-------|
| **Empregabilidade** | Candidatos e profissionais | 2x/semana | Dicas de currículo, entrevista, mercado, dados IBGE/CAGED |
| **Empresas** | RH, gestores | 1x/semana | Contratação, retenção, cultura, assessments (Electia) |
| **Governo** | Gestores públicos, prefeitos | 1x/semana | Cases IMO, Editais, transparência, eficiência pública |
| **Institucional** | Todos | 1x/quinzena | Bastidores, marcos, parcerias, releases de produto |
| **Comunidade PdV** | Profissionais PdV | 1x/semana | Workshops, conteúdo exclusivo (compartilhado do canal Marcos) |

---

## 6. Frequência Sugerida

| Canal | Posts/semana | Melhor horário | Formato preferido |
|-------|-------------|----------------|-------------------|
| **Instagram feed** | 3-4 | Ter/Qui 08h, Sex 12h | Carrossel 4:5, post 1:1 |
| **Instagram stories** | 5-7 | Diário, manhã | Bastidores, enquetes, countdowns |
| **LinkedIn** | 2-3 | Ter/Qua/Qui 07:30-09:00 | Artigo 1.91:1, texto longo |
| **WhatsApp (status)** | 2-3 | Seg/Qua/Sex manhã | Vagas, eventos, links |

---

## 7. Pipeline de Produção

### Fluxo

```
Pauta (Notion) → Copy (Claude/manual) → Design (Canva/template HTML) → Revisão → Agendamento → Publicação → Métricas
```

### Ferramentas

| Etapa | Ferramenta |
|-------|-----------|
| Pauta e calendário | Notion (database "Conteúdo Emprega+") |
| Copy | Claude Code (skill copywriting) ou manual |
| Design | Canva (templates Emprega+) ou HTML renderizado via Playwright |
| Agendamento | Meta Business Suite (Instagram) + LinkedIn nativo |
| Automação | Make.com (opcional — webhook Notion → agendamento) |

---

## 8. Templates Visuais

Templates HTML renderizáveis via Playwright.

### Pipeline de renderização

- **Source:** `../../templates/social-media/` (hub central)
- **Renderer:** `../../scripts/render-templates.mjs` (Playwright headless)
- **Output:** PNGs nos tamanhos da §2

### Templates necessários (prioridade)

| Template | Status | Dimensão |
|----------|--------|----------|
| Post feed padrão (dado/insight) | A criar | 1080×1080 |
| Carrossel (slide 1 + internas) | A criar | 1080×1350 |
| Story/reel capa | A criar | 1080×1920 |
| LinkedIn banner empresa | A criar | 1584×396 |
| OG image (link preview) | A criar | 1200×627 |
| Thumbnail YouTube | A criar | 1280×720 |

### Estrutura de template

Cada template usa:
- Fundo: navy (`--emp-bg`) ou light (`--emp-light-bg`)
- Heading: Sora 700-800, gold ou white
- Body: Inter 400-500, secondary text color
- Logo: `emprega+` no canto, Sora 800
- Badge de produto: gradient canônico (se aplicável)

---

## 9. Checklist Pré-Publicação

- [ ] Fundo dentro da paleta (navy escuro OU light limpo)?
- [ ] Gold como ÚNICA cor de destaque (exceto badge produto)?
- [ ] Tipografia Sora (heading) + Inter (body) aplicada?
- [ ] Logo `emprega+` posicionado (canto, não centralizado)?
- [ ] Contraste WCAG AA validado (especialmente gold sobre white)?
- [ ] CTA claro e único?
- [ ] Dimensão correta pro canal (§2)?
- [ ] Tom profissional, acessível e otimista (BB §6)?
- [ ] Sem erros de português?
- [ ] Hashtags relevantes (máx 5-8)?
- [ ] Alt text descritivo nas imagens?
