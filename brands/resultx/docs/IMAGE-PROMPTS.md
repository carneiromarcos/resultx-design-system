# Prompts de Imagem — ResultX

**Versão:** 2.0 | **Data:** 2026-10-09 | Base: as artes de ambiência do site (geradas por IA em 08/10/2026 e aprovadas pelo Marcos). Este arquivo guarda **o briefing**, não os prompts originais, que não foram preservados no repositório.

## 1. Papel da imagem

Ambiência: textura e luz **atrás** do conteúdo. Nunca prova, nunca cliente, nunca equipe.

## 2. Briefing-base (todas as artes)

- Fundo **grafite `#0B0E14`**, com **ouro `#c4993b`** e **roxo `#6f32b1`** da ponte como as únicas cores de luz.
- Abstrata: painéis, linhas, feixes de luz, fluxo. Alto contraste de forma, baixo contraste de luz (o texto vai por cima).
- **Sem orb, sem pessoas reconhecíveis, sem texto, sem logotipo, sem tela com dado legível, sem número.**
- Exportar em WebP (qualidade ~78, < 250 KB) com versão menor para telas estreitas.

## 3. Slots do site

| Slot | Proporção | Composição |
|---|---|---|
| Abertura (hero) | 16:9 | assunto à direita; esquerda escura e limpa para o texto |
| Serviços | 12:5 | painéis ouro → roxo, baixo contraste |
| Método | 12:5 | linhas se ordenando da esquerda para a direita |
| Diagnóstico | 12:5 | feixe de luz quente vindo de baixo, à esquerda |

## 4. Aplicação no CSS

Imagem em `position: absolute; inset: 0; z-index: -2`, `object-fit: cover`, opacidade 0,12 a 0,9 conforme o slot, **máscara que apaga as bordas** para o grafite. Em coluna única, a arte desce para trás do painel de vidro e fica mais apagada. A opacidade de cada slot é medida para o texto por cima manter 4,5:1 sobre o ponto mais claro.

## 5. Telas de produto

Capturas reais de Electia e Xscore, com **dados de demonstração** identificados como tal, em moldura de navegador (`.screen-frame`). Nunca dado de cliente real.

## 6. Superado

O esboço anterior pedia "diverse executives in business attire" e "deep navy". Está descartado: a marca não usa pessoas como cliente ou equipe, e o chão é grafite, não navy.
