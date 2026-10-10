# Motion & Animation Guide — ResultX

**Versão:** 2.0 | **Data:** 2026-10-09 | Fonte: `src/styles/motion.css` do site (resultx.app) e `../tokens/tokens.css`.

Movimento **expressivo, mas elegante**. Ele revela, orienta e dá profundidade; nunca decora em loop ao lado de texto que precisa ser lido.

## 1. Princípios

1. Só `transform` (incluindo `translate` e `scale`), `opacity` e `box-shadow`/borda em hover. Nada de largura, altura, margem.
2. **Sem JS, ou com movimento reduzido, tudo fica visível.** O estado inicial "escondido" só existe quando o script põe `.js-reveal` no `<html>`.
3. Tudo o que se move de forma contínua mora em `@media (prefers-reduced-motion: no-preference)`. Com `reduce`, nada se desloca: cards não levantam, o fio da ponte não se anima, a grade não deriva.
4. Hover responde na hora. O atraso do revelar vale só para a entrada.
5. Sem orb. A orb animada é a assinatura dos agentes de IA do DS; a ResultX não a usa.

## 2. Revelar ao rolar

Elemento com `data-reveal` sobe `--rx-reveal-distance` e aparece em `--rx-reveal-duration` com `--rx-ease-smooth`; o atraso é `índice × --rx-reveal-step`. Um `IntersectionObserver` (sem handler de scroll) adiciona `.is-revealed` uma vez. Em impressão, tudo é exibido.

## 3. Cards com profundidade (`.card-lift`)

No hover ou foco: sobe `--rx-lift-distance`, borda `--border-accent`, sombra `--elevation-3` + brilho ouro, e o **fio da ponte** acende no topo (cresce da esquerda). O ícone em pastilha sobe 2 px e cresce levemente (mola `--spring-bounce`). No `:active` sobe metade. O card grande de demonstração não levanta inteiro: quem ganha profundidade são as telas.

## 4. Método

Cada etapa tem um nó dourado (entra com mola) e o fio ouro → roxo que se desenha da esquerda em 1100 ms, com 260 ms entre etapas.

## 5. Hero

Atmosfera ouro/roxo que deriva devagar (24 s), grade fina de 64 px que desce (18 s, linear) apagada nas bordas e um reflexo de luz que atravessa o painel do fluxo (7 s, curva `--ease-sheen`). Telas de produto inclinam com a rolagem por `animation-timeline: view()`, só onde o navegador suporta. Imagens de ambiência derivam ±3 % com a rolagem.

## 6. Botão

`.btn-sheen` do DS: um reflexo por passada, em `:hover`/`:focus-visible`, nunca em loop.

## 7. Tokens

| Token | Valor | Uso |
|---|---|---|
| `--rx-duration-fast` | 150ms | hover, foco |
| `--rx-duration-normal` | 300ms | transição de estado |
| `--rx-duration-slow` | 500ms | overlays |
| `--rx-ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | entrada natural |
| `--rx-ease-smooth` | `cubic-bezier(0.22, 1, 0.36, 1)` | revelar e levantar (= `--spring-smooth` do DS) |
| `--rx-reveal-distance` | 28px | deslocamento inicial |
| `--rx-reveal-duration` | 800ms | entrada |
| `--rx-reveal-step` | 90ms | atraso por item |
| `--rx-lift-duration` | 280ms | hover de card |
| `--rx-lift-distance` | -6px | subida no hover |

A classe utilitária `.rx-reveal` (com `.d1`/`.d2`/`.d3`) usa os mesmos números, para páginas sem script.

## 8. Checklist

- [ ] Só `transform`, `opacity` e sombra se animam.
- [ ] Página legível com JS desligado e com `prefers-reduced-motion: reduce`.
- [ ] Nenhum movimento contínuo atrás de texto sem máscara e sem teste de contraste.
- [ ] `will-change` só onde há animação ativa.
