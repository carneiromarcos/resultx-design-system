# Motion & Animation Guide — Electia by Emprega+

> Movimento e vida. Mas vida controlada — como a chama da forja, nunca como fogos de artificio.
>
> Referencia principal: academialendaria.ai — suave, premium, intencional.

---

## 1. Principios de Motion

### Filosofia

O Electia nao e um site estatico, mas tambem nao e um parque de diversoes. O motion deve:

- **Guiar o olhar** — direcionar a atencao para o que importa
- **Criar profundidade** — reforcar o mundo dark/caverna da marca
- **Transmitir sofisticacao** — cada movimento preciso, nenhum aleatorio
- **Nunca distrair** — se o usuario percebe a animacao consciente, esta exagerada

### Regra de teal

> Se voce tirasse todas as animacoes, o site ainda funcionaria perfeitamente.
> As animacoes adicionam CAMADA, nao dependencia.

---

## 2. Scroll Reveal (entrada de elementos)

### 2.1 Fade Up (padrao para tudo)

O efeito mais usado. Elementos entram de baixo para cima com fade.

```css
/* Estado inicial (antes de entrar na viewport) */
.reveal {
  opacity: 0;
  transform: translateY(32px);
}

/* Estado final (visivel) */
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
```

| Propriedade | Valor |
|-------------|-------|
| **Duracao** | 700ms |
| **Easing** | `cubic-bezier(0.16, 1, 0.3, 1)` — ease-out exponencial |
| **Deslocamento** | 32px para cima |
| **Trigger** | Elemento 20% visivel na viewport |
| **Repeat** | Nao — anima uma vez, nunca reseta |

### 2.2 Fade Up Staggered (grupos de cards/itens)

Cards ou itens em grid entram com delay progressivo.

```css
.reveal-group > *:nth-child(1) { transition-delay: 0ms; }
.reveal-group > *:nth-child(2) { transition-delay: 100ms; }
.reveal-group > *:nth-child(3) { transition-delay: 200ms; }
.reveal-group > *:nth-child(4) { transition-delay: 300ms; }
```

| Propriedade | Valor |
|-------------|-------|
| **Delay entre itens** | 100ms |
| **Delay maximo** | 400ms (nao importa quantos itens) |
| **Duracao de cada** | 700ms (igual ao fade up) |

### 2.3 Fade In (sem deslocamento)

Para elementos que so aparecem, sem subir. Usado em textos de corpo, paragrafos.

```css
.fade-in {
  opacity: 0;
  transition: opacity 0.6s ease-out;
}
.fade-in.visible {
  opacity: 1;
}
```

### 2.4 Scale In (logo, icones de destaque)

Para elementos que merecem atencao especial — logo no hero, icones de pilares.

```css
.scale-in {
  opacity: 0;
  transform: scale(0.92);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.scale-in.visible {
  opacity: 1;
  transform: scale(1);
}
```

### 2.5 Slide In (lateral — barras, linhas decorativas)

```css
.slide-left {
  opacity: 0;
  transform: translateX(-24px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-left.visible {
  opacity: 1;
  transform: translateX(0);
}
```

### Onde usar cada tipo

| Tipo | Elementos |
|------|-----------|
| **Fade Up** | Headings, cards, secoes, CTAs, badges |
| **Fade Up Stagger** | Grids de cards, logo variations, social posts, pilares |
| **Fade In** | Paragrafos, textos de corpo, labels |
| **Scale In** | Logo hero, icones de feature, manifesto blockquote |
| **Slide In** | Teal line separadores, barras decorativas, nav ao scroll |

---

## 3. Hover Effects

### 3.1 Botoes

```css
/* Teal button */
.btn-teal {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.btn-teal:hover {
  background: var(--teal-light);
  box-shadow: 0 0 30px rgba(196, 154, 60, 0.25);
  transform: translateY(-2px);
}
.btn-teal:active {
  transform: translateY(0);
  transition-duration: 0.1s;
}

/* Outline buttons */
.btn-teal-outline:hover {
  border-color: var(--teal);
  background: rgba(196, 154, 60, 0.08);
  transition: all 0.2s ease-out;
}
```

| Propriedade | Valor |
|-------------|-------|
| **Duracao hover** | 250ms |
| **Duracao active** | 100ms (snap rapido) |
| **Lift** | -2px translateY |
| **Glow** | 30px spread, 25% opacidade teal |
| **Easing** | ease-out exponencial |

### 3.2 Cards

```css
.card {
  transition: border-color 0.3s ease-out,
              transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.3s ease-out;
}
.card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* Card featured (borda teal) */
.card-featured:hover {
  border-color: var(--teal);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4),
              0 0 20px rgba(196, 154, 60, 0.08);
}
```

### 3.3 Links

```css
a {
  transition: color 0.2s ease-out;
}
a:hover {
  color: var(--white);
}

/* Links com underline */
a.link-teal {
  text-decoration-color: rgba(196, 154, 60, 0.4);
  transition: text-decoration-color 0.2s ease-out, color 0.2s ease-out;
}
a.link-teal:hover {
  text-decoration-color: var(--teal);
}
```

### 3.4 Logo (nav)

```css
.nav-logo {
  transition: opacity 0.2s ease-out;
}
.nav-logo:hover {
  opacity: 0.8;
}
/* Sem scale, sem glow — minimalismo Apple */
```

---

## 4. Background Effects

### 4.1 Teal Radial Glow (hero)

Um glow dourado sutil atras do hero que pulsa MUITO lentamente.

```css
.hero-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 500px;
  background: radial-gradient(ellipse, rgba(196, 154, 60, 0.12) 0%, transparent 70%);
  pointer-events: none;
  animation: glow-pulse 8s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
}
```

| Propriedade | Valor |
|-------------|-------|
| **Ciclo** | 8 segundos (MUITO lento) |
| **Variacao de opacidade** | 0.6 → 1.0 |
| **Variacao de escala** | 1.0 → 1.05 (quase imperceptivel) |
| **Easing** | ease-in-out (suave nos extremos) |

### 4.2 Teal Line (separadores animados)

Linhas douradas que "acendem" quando entram na viewport.

```css
.teal-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--teal), transparent);
  transform: scaleX(0);
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.teal-line.visible {
  transform: scaleX(1);
}
```

### 4.3 Noise Texture (background global)

Uma textura de ruido muito sutil no fundo para dar "vida" ao preto.

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('data:image/svg+xml,...'); /* noise pattern */
  opacity: 0.015; /* quase invisivel */
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: overlay;
}
```

### 4.4 Parallax Sutil (secoes)

Elementos de fundo se movem mais lento que o conteudo. MUITO sutil.

```css
.parallax-bg {
  transform: translateY(calc(var(--scroll-y) * -0.05));
  will-change: transform;
}
/* --scroll-y atualizado via JS: requestAnimationFrame */
```

| Propriedade | Valor |
|-------------|-------|
| **Fator** | 0.05 (5% do scroll) |
| **Elementos** | Apenas glows, patterns, montanhas decorativas |
| **Nunca** | Textos, cards, CTAs — so backgrounds |

---

## 5. Page Transitions

### 5.1 Entrada da pagina

```css
.page-enter {
  opacity: 0;
}
.page-enter-active {
  opacity: 1;
  transition: opacity 0.5s ease-out;
}
```

### 5.2 Navbar ao scroll

A navbar fica mais opaca e ganha borda inferior ao rolar.

```css
.nav {
  background: rgba(8, 8, 10, 0.6);
  border-bottom-color: transparent;
  transition: background 0.3s ease-out, border-color 0.3s ease-out;
}
.nav.scrolled {
  background: rgba(8, 8, 10, 0.92);
  border-bottom-color: rgba(255, 255, 255, 0.06);
}
```

---

## 6. Animacoes Especiais

### 6.1 Logo Montanha (hero — primeira carga)

A logo entra com scale + fade, os dois triangulos aparecem sequencialmente.

```css
.logo-small-tri {
  opacity: 0;
  transform: scale(0.85) translateY(8px);
  animation: logo-enter 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
}
.logo-large-tri {
  opacity: 0;
  transform: scale(0.9) translateX(4px);
  animation: logo-enter 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
}

@keyframes logo-enter {
  to {
    opacity: 1;
    transform: scale(1) translate(0);
  }
}
```

| Elemento | Delay | Efeito |
|----------|-------|--------|
| Triangulo menor (solido) | 200ms | Scale up + fade in |
| Triangulo maior (outline teal) | 500ms | Scale up + fade in |
| Tagline | 900ms | Fade up padrao |
| CTAs | 1100ms | Fade up padrao |

### 6.2 Counter Animado (numeros de impacto)

Numeros como "92M" ou "1.000+" contam de 0 ate o valor final.

```javascript
// Duracao: 2 segundos
// Easing: ease-out (rapido no inicio, desacelera)
// Trigger: quando entra na viewport
function countUp(element, target, duration = 2000) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    element.textContent = Math.floor(target * eased).toLocaleString('pt-BR');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
```

### 6.3 Teal Shimmer (badge "Novo" ou "Vagas limitadas")

Um brilho dourado que percorre o badge de tempos em tempos.

```css
.badge-shimmer {
  position: relative;
  overflow: hidden;
}
.badge-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  animation: shimmer 4s ease-in-out infinite;
}
@keyframes shimmer {
  0%, 80%, 100% { left: -100%; }
  40% { left: 100%; }
}
```

---

## 7. Tabela de Duracao e Easing

### Duracao por tipo

| Tipo | Duracao | Quando |
|------|---------|--------|
| **Micro** | 100-150ms | Active states, toggles, tooltips |
| **Rapida** | 200-250ms | Hover, focus, links, nav items |
| **Media** | 300-400ms | Cards, modais, dropdowns |
| **Longa** | 600-800ms | Scroll reveal, section transitions |
| **Dramatica** | 1000-2000ms | Hero entrance, counters, teal lines |
| **Ambiente** | 4000-8000ms | Glow pulse, shimmer, background loops |

### Easing curves

| Nome | Valor | Uso |
|------|-------|-----|
| **Standard** | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll reveals, entradas. Sai rapido, desacelera suave |
| **Ease out** | `ease-out` | Hovers, transicoes rapidas |
| **Ease in-out** | `ease-in-out` | Loops infinitos (glow, shimmer) |
| **Snap** | `cubic-bezier(0.22, 0.68, 0, 1.71)` | Feedback tatil (bounce sutil em CTAs) — usar com parcimonia |

### NUNCA usar

- `linear` — parece robotico, sem alma
- `ease-in` sozinho — parece que esta "engasgando"
- Duracao > 1s para interacoes do usuario (hover, click)
- Duracao < 100ms para reveals (imperceptivel)
- `animation-iteration-count: infinite` em elementos de UI (so em backgrounds)

---

## 8. Performance

### Regras

1. **Apenas animar `transform` e `opacity`** — nunca width, height, margin, padding, top, left
2. **`will-change`** em elementos que animam frequentemente (nav, glow, parallax)
3. **`prefers-reduced-motion`** — respeitar preferencias do sistema:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

4. **Intersection Observer** para scroll reveals (nao scroll listener)
5. **`requestAnimationFrame`** para parallax (nao setInterval)
6. **Maximo 3 animacoes simultaneas** visiveis na viewport

---

## 9. Implementacao (React)

### Scroll Reveal Hook

```tsx
function useReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
```

### Componente Reveal

```tsx
function Reveal({ children, className, delay = 0 }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
                     transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
```

### Biblioteca recomendada

**Framer Motion** — se precisar de mais complexidade:
```tsx
<motion.div
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
/>
```

---

*Motion Guide v1.0 — Electia by Emprega+*
*Movimento e vida. Vida controlada.*
