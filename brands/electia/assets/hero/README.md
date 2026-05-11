# electia — Hero Assets

> **Status: ✅ v1 em producao** — validado por Marcos em 2026-05-10 (modo Electia Subtle).

## Asset principal: `aurora-hero-v1`

Video abstract energy flow em loop, base do hero das LPs e materiais Electia.

| Arquivo | Formato | Dimensoes | Peso | Notas |
|---------|---------|-----------|------|-------|
| `aurora-hero-v1.mp4` | H.264 | 1920x1080 @ 24fps | 4.6 MB | 12s loop · CRF 28 slow · faststart · sem audio |
| `aurora-hero-v1.webm` | VP9 | 1920x1080 @ 24fps | 4.8 MB | 12s loop · CRF 42 · row-mt 1 |
| `aurora-hero-v1.poster.jpg` | JPEG | 1280x720 | 71 KB | Frame extraido @ t=1s · q=6 |

**Browser strategy:**
```html
<video autoplay muted loop playsinline preload="metadata"
       poster="assets/hero/aurora-hero-v1.poster.jpg">
  <source src="assets/hero/aurora-hero-v1.webm" type="video/webm" />
  <source src="assets/hero/aurora-hero-v1.mp4" type="video/mp4" />
</video>
```

Chrome/Firefox/Edge pegam WebM (menor); Safari pega MP4.

## Fonte e licenca

- **Origem:** Pexels — "Dynamic Blue Abstract Energy Animation" por Colin Jones (@larchmedia)
- **URL fonte:** https://www.pexels.com/video/dynamic-blue-abstract-energy-animation-35484445/
- **Licenca:** Pexels License (uso comercial OK, atribuicao opcional)
- **Pipeline original:** 1920x1080 24fps h264, 274 MB, 120s -> trim 12s + h264 CRF 28 + VP9 CRF 42 + poster q6 -> 4.6 + 4.8 + 0.07 MB
- **Ferramenta:** ffmpeg (binario arm64 via Rosetta + evermeet.cx)

## Filter oficial "electia-subtle"

O video e aplicado com filter CSS pra escurecer e adequar a paleta Electia:

```css
.aurora-hero-frame video {
  filter: brightness(0.38) saturate(0.55) hue-rotate(-12deg) contrast(1.10);
}
```

Este filter:
- **brightness(0.38)** — escurece para o orb ficar discreto, nao dominante
- **saturate(0.55)** — dessatura para sair do cyan vibrante
- **hue-rotate(-12deg)** — desloca cyan -> teal (alinhando a paleta Electia)
- **contrast(1.10)** — leve aumento de contraste para manter punch

Modos alternativos disponiveis (no preview):
- `original` — cyan vibrante (nao usar em producao)
- `electia-dark` — filter mais leve (brightness 0.55)
- `electia-subtle` — **modo oficial** (validado)

## Scrim de sobreposicao

Sobre o video aplica-se um scrim duplo (radial teal sutil + linear vertical escuro):

```css
.aurora-hero-frame .scrim {
  background:
    radial-gradient(ellipse at center, rgba(45, 212, 191, 0.06) 0%, transparent 45%, rgba(11, 14, 20, 0.55) 75%),
    linear-gradient(180deg, rgba(11, 14, 20, 0.65) 0%, rgba(11, 14, 20, 0.35) 40%, rgba(11, 14, 20, 0.40) 60%, rgba(11, 14, 20, 0.96) 100%);
}
```

Garante headroom para texto branco no centro e fade limpo na transicao com a proxima secao.

## Uso

| Contexto | Status | Notas |
|----------|--------|-------|
| **LP electia.empregamais.me — hero** | 🟡 a integrar | Proximo PR no DS/site |
| **Material institucional (PDF, deck)** | 🟡 frame estatico via poster.jpg | Poster JPG suficiente para PDF |
| **Social media (Instagram Reels, Stories)** | 🟡 reformatar 1080x1920 | Re-render via ffmpeg quando precisar |
| **Email Brevo (header)** | ❌ video nao toca em email | Usar poster.jpg como fallback |

## Acessibilidade

- `prefers-reduced-motion: reduce` -> pausar video, mostrar so poster
- WCAG AA: scrim garante contraste 4.5:1 do texto branco sobre video (testado @ 88% pior caso)

## Preview funcional

`../../previews/aurora-hero-demo.html` — demo com 3 modos toggle (original / electia-dark / electia-subtle).

## Roadmap

- [ ] Reformatar versao 1080x1920 para Stories/Reels
- [ ] Reformatar versao 1080x1080 para feed Instagram
- [ ] Gerar versao SD (480p) como fallback mobile data-saver
- [ ] Considerar render proprio em Blender (longo prazo, controle total de paleta)
