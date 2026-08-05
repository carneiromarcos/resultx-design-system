# Prompts de Imagem & Vídeo — Emprega+

**Versão:** 1.0 | **Data:** 2026-05-27

> Diretrizes para geração de imagens e vídeos alinhados à identidade visual Emprega+.

---

## 1. Estilo Base (prefixo para TODOS os prompts)

### Midjourney / DALL-E

```
cinematic lighting, gold accents (#c4993b) on deep navy (#1B2A4A),
professional corporate atmosphere, brazilian diverse workforce,
editorial photography style, warm tones, shallow depth of field,
high contrast, real workplace environment --style raw --v 6.1
```

### Variações por aspecto

| Formato | Aspect Ratio | Uso |
|---------|-------------|-----|
| Hero / site | `--ar 16:9` | Seções hero, banners, OG images |
| Social quadrado | `--ar 1:1` | Instagram feed |
| Social retrato | `--ar 4:5` | Carrosséis |
| Story | `--ar 9:16` | Stories, reels |
| LinkedIn | `--ar 1.91:1` | Posts LinkedIn, WhatsApp preview |

---

## 2. Categorias de Imagem

### Pessoas no trabalho (principal)

```
brazilian professional [role] working in [environment],
natural warm lighting, gold accent in background,
diverse workforce, authentic corporate setting,
editorial photography, shallow depth of field --ar 16:9 --style raw --v 6.1
```

**Roles:** analista de RH, gestor público, candidato em entrevista, equipe colaborando, operário qualificado, atendente de balcão de emprego

**Environments:** escritório moderno, prefeitura, balcão de atendimento, sala de entrevista, fábrica, coworking

### Dados e tecnologia

```
abstract data visualization, gold and navy color scheme (#c4993b, #1B2A4A),
floating charts and dashboards, clean minimal tech aesthetic,
light glass blur effect, professional enterprise software,
dark background with glowing gold accents --ar 16:9 --v 6.1
```

### Governo e serviço público

```
brazilian government service counter, public employment office,
warm professional lighting, citizens being attended,
institutional setting, navy blue and gold accents,
documentary style photography --ar 16:9 --style raw --v 6.1
```

### Eventos e feiras de emprego

```
brazilian job fair event, crowd of professionals,
booths with gold and navy branding, warm venue lighting,
documentary photography, diverse attendees,
professional corporate event --ar 16:9 --style raw --v 6.1
```

---

## 3. Prompts de Vídeo (Runway / Kling / Pika)

### Hero background (loop)

```
slow cinematic pan across modern office space,
warm golden light streaming through windows,
subtle lens flare, shallow depth of field,
professionals collaborating in background (blurred),
smooth camera movement, 4K --duration 4s
```

### Transição de dados

```
abstract data points connecting in network pattern,
gold (#c4993b) lines on dark navy (#1B2A4A) background,
smooth particle flow, enterprise dashboard aesthetic,
clean minimal motion graphics --duration 3s
```

---

## 4. Tratamento Pós-Geração

### Color grading obrigatório

1. **Temperatura:** Aquecer levemente (+5-10 em warmth)
2. **Saturação:** Reduzir 10-15% para sofisticação
3. **Contraste:** Aumentar levemente (+5)
4. **Highlights:** Tom dourado sutil (hue shift para gold)
5. **Shadows:** Navy profundo (shift para azul escuro)

### Filtro padrão (Lightroom/Photoshop)

- Exposure: +0.1
- Temperature: +8
- Tint: -3
- Saturation: -12
- Vibrance: +5
- Split toning: Highlights gold (#c4993b, 15%), Shadows navy (#1B2A4A, 20%)

---

## 5. Templates de Social Media

Cross-ref: `SOCIAL-MEDIA-GUIDE.md` §8.

Ao compor imagens pra social, o output do prompt serve como **fundo**. Sobre ele:
- Heading Sora 700-800 (gold ou white)
- Body Inter 400-500
- Logo `emprega+` no canto
- Badge de produto (se aplicável)

---

## 6. Imagens Proibidas

**NUNCA gerar ou usar:**

| Proibição | Razão |
|-----------|-------|
| Aperto de mão genérico (stock) | Clichê corporativo — não comunica nada |
| Escritório all-white sem diversidade | Não representa o Brasil |
| Pessoas apontando pra tela sorrindo | Forçado, sem autenticidade |
| Imagens com texto ilegível embutido | AI gera texto incorreto — usar overlay manual |
| Cenários americanos/europeus | Emprega+ é brasileiro — contexto deve ser brasileiro |
| Pessoas tristes/desesperadas | Tom é otimista — mesmo sobre desemprego, focar na solução |
| Imagens sexualizadas ou discriminatórias | Zero tolerância |
| Fotos de políticos ou figuras públicas | Risco legal e de associação não autorizada |

---

## 7. Banco de Imagens Recomendado

### Gratuitos

| Banco | Palavras-chave canônicas |
|-------|--------------------------|
| **Unsplash** | "brazilian office", "diverse workplace", "public service", "job interview brazil" |
| **Pexels** | "emprego", "trabalho brasil", "entrevista", "governo atendimento" |
| **Freepik** | "corporate brazil", "employment office", "data dashboard" |

### Pagos (quando free não basta)

| Banco | Quando usar |
|-------|-------------|
| **Adobe Stock** | Peças institucionais de alto impacto (hero site, materiais impressos) |
| **iStock** | Complemento para cenários específicos |

### Filtros de busca

- **Diversidade:** Sempre incluir diversidade racial, etária e de gênero
- **Contexto:** Priorizar cenários brasileiros (arquitetura, vestimenta, ambiente)
- **Iluminação:** Warm/natural — excluir luz fria/clínica
- **Orientação:** Filtrar pelo aspect ratio do template (§1)
