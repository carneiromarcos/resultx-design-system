# Electia by Emprega+ — Design System (Foundation)

Fundação de design da Electia: **tokens de cor, tipografia, gradientes e classes utilitárias**. Não há componentes React empacotados — você constrói a UI, mas SEMPRE com este vocabulário, pra que todo design saia on-brand. Posicionamento: B2B sênior, "Sistema operacional de pessoas com IA". Tom direto e aspiracional; identidade roxa sobre fundo grafite escuro.

## Onde está a verdade (leia antes de estilizar)
- `styles.css` — entry: importa as fontes + todos os tokens. Já está no closure de todo design.
- `tokens/tokens.css` — todas as CSS custom properties (`var(--*)`) e as classes utilitárias.
- `guidelines/BRAND-BOOK.md` — voz, posicionamento, uso de cor/logo, do/don't.
- `guidelines/DESIGN-SYSTEM.md` — anatomia de cards e relatórios.

## Idioma de styling
Estilize via **CSS custom properties** (`var(--token)`) e as classes utilitárias abaixo. **Nunca hardcode hex — sempre o token.** Dark é o default; tema claro é opt-in com `<html data-theme="light">` (os mesmos tokens trocam de valor).

### Cor — fundos
- `--bg` (#0B0E14, grafite — page background) · `--surface-1` (#161B26, cards) · `--surface-2` (#1C2333, hover/elevado) · `--surface-3` · `--surface-4` (bordas ativas)
- `--border` (bordas) · `--text-primary` / `--text-secondary` / `--text-muted` (texto) · `--white`

### Cor — marca (roxo é a identidade)
- `--purple` (#6f32b1) — primary: fill de botões, links, eyebrows.
- `--purple-light` (#a55eea) — hover.
- `--purple-on-dark` (#c084fc) — **destaque de texto roxo sobre fundo escuro** (ex.: a palavra-chave dentro do headline do hero). NÃO usar como fill de botão.
- Semânticos: `--success` (#22C55E) · `--warning` (#F59E0B) · `--error` (#EF4444).

### Gradientes (roxo)
- `--gradient-purple-vibrant` (roxo→royal-blue) — **DEFAULT** em CTAs/botões/headlines.
- `--gradient-purple-premium` (roxo→ouro) — pontual: pricing "Recomendado", upgrade.
- `--gradient-brand` · `--gradient-purple-deep` — barras e fundos de seção.
- Para texto preenchido com gradiente, use a classe `.text-gradient-brand`.

### Tipografia
- `--font-heading` = Sora (700/800) — H1/H2/H3.
- `--font-body` = Inter (400–600) — corpo e UI.
- (Wordmark "electia" usa JetBrains Mono 600.)

### Classes utilitárias prontas
- `.glass` / `.glass-subtle` / `.glass-strong` — superfícies glassmorphism.
- `.eyebrow` — rótulo de seção (uppercase, tracking largo, roxo).
- `.glow-brand` / `.glow-brand-lg` — glow roxo (máx. 1 forte por página).
- `.hover-elevate` — micro-elevação no hover.
- `.text-gradient-brand` — texto preenchido com o gradiente da marca.

## Snippet idiomático (hero on-brand)
```html
<section style="background: var(--bg); color: var(--text-primary); font-family: var(--font-body); padding: 5rem 1.5rem; text-align: center;">
  <span class="eyebrow">Sistema operacional de pessoas com IA</span>
  <h1 style="font-family: var(--font-heading); font-weight: 800; font-size: clamp(2.5rem, 6vw, 4rem); line-height: 1.1;">
    Times de alta performance começam com a
    <span style="color: var(--purple-on-dark);">pessoa certa no lugar certo.</span>
  </h1>
  <a href="#" style="display: inline-block; margin-top: 2rem; background: var(--gradient-purple-vibrant); color: #fff; font-weight: 600; padding: 0.75rem 2rem; border-radius: var(--radius-md);">Começar grátis</a>
</section>
```
