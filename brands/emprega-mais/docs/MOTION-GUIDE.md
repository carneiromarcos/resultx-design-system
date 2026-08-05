# Motion & Animation Guide — Emprega+

**Versão:** 1.0 | **Data:** 2026-05-27

> Princípios de motion da marca-mãe. IMO e Editais herdam estas diretrizes.

---

## 1. Princípios de Motion

- **Sutil e profissional.** Motion existe pra guiar o olho, não pra impressionar. Emprega+ fala com gestores públicos, RH de empresas e candidatos — clareza importa mais que drama.
- **Respeita `prefers-reduced-motion`.** Toda animação desliga quando o sistema pede.
- **Compositor-friendly.** Animar apenas `transform` e `opacity`. Nunca `width`, `height`, `top`, `left`, `margin`, `padding`.
- **`will-change` cirúrgico.** Aplicar antes da animação, remover depois. Nunca permanente.

---

## 2. Tokens de Duração e Easing

| Token | Valor | Uso |
|-------|-------|-----|
| `--emp-duration-fast` | `150ms` | Hover, focus, toggle |
| `--emp-duration-normal` | `300ms` | Entrada de elementos, transições de estado |
| `--emp-duration-slow` | `500ms` | Page transitions, overlays |
| `--emp-duration-reveal` | `700ms` | Scroll reveal (fade-in-up) |
| `--emp-ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Easing padrão (spring-out natural) |
| `--emp-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transições suaves bidirecionais |

---

## 3. Scroll Reveal (entrada de elementos)

Padrão: fade-in-up com stagger.

```css
@keyframes emp-fade-in-up {
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: translateY(0); }
}

.emp-reveal {
  animation: emp-fade-in-up 700ms var(--emp-ease-out-expo) forwards;
}
.emp-reveal.d1 { animation-delay: 100ms; opacity: 0; }
.emp-reveal.d2 { animation-delay: 200ms; opacity: 0; }
.emp-reveal.d3 { animation-delay: 300ms; opacity: 0; }
```

- **Threshold:** 20% do elemento visível no viewport
- **Stagger:** 100ms entre itens irmãos
- **Direção:** Sempre de baixo pra cima (translateY positivo → 0)
- Usar `IntersectionObserver` pra acionar — não scroll handlers

---

## 4. Hover Effects

### Cards
```css
.emp-card {
  transition: all 250ms var(--emp-ease-out-expo);
}
.emp-card:hover {
  transform: translateY(-2px);
  border-color: rgba(196, 153, 59, 0.3); /* gold 30% */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

### Botões
```css
.emp-btn-primary:hover {
  filter: brightness(1.08);
  box-shadow: var(--glow-brand); /* 0 0 20px gold/20% */
}
```

### Links
```css
.emp-link:hover {
  color: var(--emp-gold-light); /* #d4ae54 */
}
```

---

## 5. Background Effects

### Glow Pulse (hero sections)
```css
@keyframes emp-glow-pulse {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
}

.emp-hero-glow {
  position: absolute;
  width: 700px; height: 500px;
  background: radial-gradient(ellipse at center, rgba(196, 153, 59, 0.08) 0%, transparent 70%);
  animation: emp-glow-pulse 8s ease-in-out infinite;
  pointer-events: none;
}
```

Usar com parcimônia — apenas em hero sections de landing pages.

---

## 6. Page Transitions

- **Next.js (jobs-frontend):** Fade cross-dissolve entre rotas (opacity 0→1, 300ms)
- **Laravel/Livewire (app legado):** Livewire loading states com spinner gold + opacity transition
- **React/Vite (sites):** Router-level fade, 300ms

---

## 7. Glass Animations

O sistema Light Glass (`.emp-glass`) usa transição de borda no hover:
```css
.emp-glass {
  transition: border-color var(--emp-duration-fast) var(--emp-ease-out-expo);
}
.emp-glass:hover {
  border-color: var(--emp-glass-border-hover); /* navy 15% */
}
```

---

## 8. Performance Checklist

- [ ] Apenas `transform` e `opacity` animados
- [ ] `will-change` temporário (não permanente)
- [ ] `prefers-reduced-motion` respeitado
- [ ] Sem scroll handlers — usar IntersectionObserver
- [ ] Stagger máximo: 500ms (5 itens × 100ms)
- [ ] Sem animação de layout (`width`, `height`, `top`, `left`)
