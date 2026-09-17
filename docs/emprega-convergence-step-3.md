# Passo 3 da convergência Emprega+ — a marca do sistema descreve a produção

- **Implementa:** ADR-0002 decisão 1
- **Não implementa:** decisão 3 (os dois Laravel lerem um arquivo `--eds-*`). Isso começou no passo 4a (`eds-root.css`); o EditalHub entra no 4b.
- **Aprovado por:** Marcos, ao mandar executar a opção 3 em 17/09/2026.

## O que este passo faz

Reescreve `brands/emprega-mais/tokens/tokens.css` (e o JSON, e a ponte) a
partir do `:root` do IMO em produção — o mesmo que a #463 acabou de
corrigir no contraste.

Não muda um pixel em nenhum produto: **zero consumidores** importam esta
marca. O que muda é o que o sistema *publica* como Emprega+.

## O que não faz

- Não extrai o `:root` do IMO para este repo (decisão 3).
- Não aponta o EditalHub nem o IMO para o pacote npm.
- Não decide as 8 cores órfãs do EditalHub.
- Não mexe no site gold-dominante (`emprega-mais-sites`).

## Mapa

| Papel | Antes (ficção) | Depois (IMO) |
|---|---|---|
| Accent (fill) | `--emp-gold` `#c4993b` | `--emp-indigo-dark` `#4f46e5` |
| Hover | `--emp-gold-light` | `--emp-indigo-hover` `#4940d3` |
| Secondary | `--emp-purple` | `--emp-gold` `#c49a3c` (prestígio) |
| Texto sobre superfície | `--emp-gold-ink` | `--emp-indigo-ink` (hex sólido, AA) |
| Navy | `#1B2A4A` | `#1c2444` |
