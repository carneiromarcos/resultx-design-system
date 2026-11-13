# ADR-0003 — Tokens têm uma fonte única estruturada, e todo artefato é gerado

- **Status:** Accepted — 2026-11-13, decisão D2 do Marcos · **Emendada** em 2026-11-13 (decisão D10, ver "Emenda")
- **Date:** 2026-11-13
- **Related:** [ADR-0001](0001-role-named-tokens.md) — a gramática que esta fonte carrega · [ADR-0002](0002-emprega-brand-convergence.md) — `eds-root.css` e a trava de SHA · auditoria `docs/audits/2026-11-13-ds-auditoria/`

> Escrito em pt-BR, como o ADR-0002.

## Contexto — o que está quebrado

Medido em `origin/main` `6083ce3` (13/11/2026):

- **Duas fontes que se contradizem.** `scripts/build-tokens.js:9-11` declara `tokens.css` como fonte ("NEVER writes back"); `README.md:123,166` chama o `tokens.json` de fonte de verdade.
- **O JSON está parado.** `tokens/tokens.json` tem 85 folhas sob o namespace legado `emprega-app.*`; `tokens/tokens.css` tem 199 variáveis. Nenhum teste compara os dois. `CONTRIBUTING.md` manda atualizá-lo à mão.
- **A marca Emprega+ tem duas fontes no próprio DS.** `brands/emprega-mais/tokens/tokens.css` (`--emp-*`, alimenta a ponte) e `eds-root.css` (`--eds-*`, vai para o Laravel). A paridade é testada para 3 pigmentos (`tests/eds-root.test.js:52-55`).
- **`@theme` do Tailwind escrito à mão nos produtos.** `dist/tokens.theme.css` é gerado, mas Electia e Xscore escrevem o próprio `@theme inline`.

## Decisão

1. **Fonte única: JSON no formato DTCG** (Design Tokens Community Group), em três níveis:
   - **primitivos** — paleta e escalas cruas (`color.purple.600`, `space.4`);
   - **semânticos** — por papel, conforme ADR-0001 (`surface.card`, `action.primary.bg`, `action.primary.fg`, `border.control`, `text.muted`);
   - **de componente** — só quando o papel semântico não basta (`button.height.md`).
   Marcas (`brands/<id>/`) sobrescrevem **valores** de semânticos; não criam nomes novos fora do domínio da marca.
2. **Gerador: Style Dictionary** (ou equivalente com a mesma capacidade, escolhido pelo Executor com parecer do @architect). Emite todos os artefatos consumidos hoje: `tokens/tokens.css`, `brands/*/tokens/tokens.css` e `ds-bridge.css`, `brands/emprega-mais/tokens/eds-root.css` (+ `.sha256`), `dist/tokens.theme.css` (Tailwind v4), `dist/tokens.ts` e os **aliases legados** da ADR-0001.
3. **Primeira entrega com saída equivalente.** A troca de fonte só é aceita quando um teste prova que cada artefato gerado é **igual** ao atual (diff normalizado de declarações que preserva também a ordem e o escopo da cascata: seletor, `@media`, `@layer`), exceto tokens novos explicitamente listados. Consumidores não percebem a troca.
4. **Artefato gerado não se edita à mão.** O CI já falha se `npm run build` alterar `dist/` ou `brands/`; a regra passa a cobrir também `tokens/tokens.css` e `eds-root.css`.
5. **O contraste continua medido no build.** A verificação atual da ponte (falha abaixo de 4,5:1) passa a rodar sobre a saída gerada.

## O que não muda

- Os consumidores continuam importando os mesmos caminhos. Cada um permanece na tag que usa hoje até atualizar por conta própria, de forma gradual; a tag da E1 (v2.11.0, ver "Emenda") entrega a mesma saída semântica da tag anterior, então atualizar não muda nada visível.
- `eds-root.css` continua copiado por SHA para IMO e EditalHub (ADR-0002). Alteração de **valor** nele segue a janela do EditalHub (nada antes do fim do recurso de 10/12).
- Decisão de distribuição de 11/10 (tag git, não npm) mantida.

## Consequências

**Boas** — fim da dúvida "qual arquivo vale"; o JSON legado some; as duas fontes da Emprega+ viram uma; `@theme` deixa de ser escrito à mão; tokens novos (alturas de controle, ícones, header, z-index, breakpoints, foco único) entram uma vez e chegam a todas as stacks.

**Custos** — uma dependência de build nova; a primeira entrega é trabalho sem efeito visível (proposital); quem editava `tokens.css` à mão passa a editar o JSON.

## Critério de aceite da implementação (etapa E1)

- Teste de equivalência verde para todos os artefatos do item 2.
- `README.md` e `CONTRIBUTING.md` corrigidos para apontar a fonte única.
- `tokens/tokens.json` legado removido ou substituído pela nova fonte.
- Tag nova (**v2.11.0**, ver "Emenda") sem mudança de valor para nenhum consumidor em relação à v2.10.0.

## Emenda — 2026-11-13 (decisão D10 do Marcos)

**Por quê.** Esta ADR foi escrita contra a v2.9.0 e previa a E1 como v2.10.0 "sem mudança de valor". Depois do aceite, a `main` recebeu mudanças distribuídas que alteram a tela para quem importa `components`: a correção de contraste do `.btn-success` no tema escuro (E0, #111) e a saída de `tokens/themes/preview.html` do pacote (#112). Uma v2.10.0 cortada da `main` atual não cumpre o critério original.

**O que muda.**
1. **v2.10.0** = `main` atual, com mudança visual **declarada** no CHANGELOG e o inventário completo `v2.9.0 → v2.10.0` (auditoria `docs/audits/2026-11-13-ds-auditoria/governanca-propagacao-conformidade.md` §2.6).
2. A **E1** (fonte única com saída equivalente) passa a ser **v2.11.0**, e a equivalência é medida contra a v2.10.0.
3. A v2.10.0 só é cortada depois que o impacto em **todos** os consumidores conhecidos estiver preenchido. Consumidor com uso **desconhecido** (hoje FinanceX e ResultX Site) trava a tag, salvo ordem expressa do Marcos.

**O que não muda.** Fonte única em DTCG, gerador, equivalência normalizada (com ordem e escopo da cascata), adoção gradual por tag e a trava do `eds-root.css` até o fim do recurso de 10/12 do EditalHub.
