# Passo 4a — o `:root` do IMO vira arquivo

- **Implementa:** ADR-0002 decisão 3, só a extração no IMO.
- **Não implementa:** EditalHub ler o arquivo (4b); trava de SHA entre os três repos (4c); npm; site gold; Electia.
- **Aprovado por:** Marcos, ao fechar as quatro travas em 17/09/2026.

## O que este passo faz

Cria `brands/emprega-mais/tokens/eds-root.css` com a Camada 1 de produção
(`:root` + tema escuro + canvas do body). O IMO guarda a mesma folha em
`public/css/eds-root.css` e o `emprega-ds.css` passa a `@import` ela.
Aliases `--jl-*` e componentes `.jl-*` não saem do IMO.

Pixel zero: os valores são os que já estavam em produção depois da #463.

## O que não faz

- Não aponta o Laravel para `ds-bridge.css` / `--accent-primary`.
- Não extrai componentes.
- Não mexe no EditalHub, no site, nem no pacote npm (`files[]` / `exports`).
