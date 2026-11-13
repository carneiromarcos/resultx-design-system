# Papéis — ResultX Design System

> **Lido por todo terminal Maestri aberto neste repositório.** Papéis genéricos no Maestri.
> Este arquivo diz **o que muda aqui**. **Aponta, não duplica.**

## Identidade

| | |
|---|---|
| **Repositório** | `carneiromarcos/resultx-design-system` (público) |
| **Produto** | Hub multi-marca / multi-tema (ResultX, Emprega+, Electia, PdV, Xscore…) |
| **Entrada** | `README.md` · `AGENTS.md` · `DESIGN-SYSTEM.md` · `brands/` |

## Atenção — diretório de trabalho

Se o terminal abriu fora deste repositório (por exemplo, no diretório pessoal ou num
workspace legado), **mude para a raiz do repositório** antes de agir. Sem isso, este arquivo
e os tokens não são encontrados. Trabalho de branch acontece numa `git worktree` própria,
nunca na cópia principal, que pode estar atrasada em relação a `origin/main`.

## Ordem de leitura antes de agir

1. `README.md` — mapa de entrada e consumidores conhecidos
2. `AGENTS.md` — regras de execução e de interface
3. `DESIGN-SYSTEM.md` — filosofia e tokens
4. `docs/adr/` — decisões em vigor (0001–0005)
5. `brands/<marca>/` — brand book + tokens da marca tocada

## Quem escreve onde

| Papel | Escreve em |
|---|---|
| **Supervisor** | `docs/`, `DESIGN-SYSTEM.md`, `CHANGELOG.md`, `README.md`, este arquivo, versionamento de release; único a rodar git push, PR, merge e tag (com ordem do Marcos) |
| **Executor** | `brands/`, `components/`, `templates/`, `tokens/`, `dist/` gerado, `tests/`, `.github/workflows/` |
| **Revisor** | nada — só parecer; não substituído por outro papel |
| **Pesquisas** | `docs/research/` |

## Guard-rails

- 🔴 Repositório público: nada de caminho local, e-mail ou dado pessoal em arquivo versionado.
- 🔴 Baseline visual só nasce no workflow `Visual Linux` do GitHub e é aprovada pelo Revisor (ver `CONTRIBUTING.md`); nunca gerar no Mac.
- 🔴 Produtos que espelham tokens à mão: comparar seletor a seletor antes de apagar o espelho.
- 🔴 Consumo via pacote `resultx-design-system` (por tag do git) vs cópia manual: não misturar sem decisão registrada.
- ⚠️ Staging git por caminho explícito; nada de `git stash` em worktree; nada de `--no-verify`.

## Decisão que vira registro

Changelog + tag anotada de versão do DS (no máximo uma a cada 2 semanas, ADR-0005);
ADRs em `docs/adr/` para decisões de arquitetura ou de hierarquia de marcas.

---

*Criado em 21/08/2026; versionado em 13/11/2026.*
