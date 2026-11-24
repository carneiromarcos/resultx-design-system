# NÃO USAR — nota única abolida (D-0001)

Referência histórica. **Não é padrão, não é aplicação aprovada e não entra na vitrine publicada.**

O padrão vigente é o **Resumo da análise**, como está no ar no Xscore (#360, 24/11/2026):
[DESIGN-SYSTEM.md › Resumo da análise](../../docs/DESIGN-SYSTEM.md#resumo-da-análise) e a seção 06
do [Brand System](../../previews/brand-system/index.html#ds-credit-summary).

## O que está aqui

> **Dados fictícios — exemplo de layout. Notas de birô, nomes e CNPJs não são reais; citar birôs
> não indica parceria.** Empresas, pessoas, números e faixas foram inventados para mostrar o layout.

Modelo "Resumo da política" de 23/11/2026, que serviu de ponto de partida. A cópia era idêntica ao
original; em 24/11, por ressalva do Revisor e decisão do Marcos, cada arquivo HTML ganhou:

- um comentário HTML no topo e um aviso visível no início do corpo, com o texto exato
  "Dados fictícios — exemplo de layout. Notas de birô, nomes e CNPJs não são reais; citar birôs não
  indica parceria. Não usar (nota única abolida, D-0001)";
- nomes trocados por outros claramente fictícios, porque os originais podiam coincidir com empresas
  ou pessoas reais: "Comercial Andrade Ltda." virou "Comercial Exemplo Ltda.", "Distribuidora Sol
  Nascente" virou "Distribuidora Exemplo" e "Ana Lima" virou "Pessoa Exemplo". Não há CNPJ nos arquivos.

Nada mais mudou. O teste da vitrine exige o aviso em todo HTML desta pasta e falha se um nome antigo voltar.

| Arquivo | Tema | SHA-256 do original | SHA-256 atual |
|---|---|---|---|
| `Main.dc.html` | escuro | `6aba0105b584fb5937af125cbcdddb912ce093c43b26425f4794f01c85a2f5a9` | `cd84ef6d39dbff825da82acaf2c06b8118b9cd81e9b5950d3f24e0522ba6c5bd` |
| `Claro.dc.html` | claro | `4423546bd8b1a7ab6fe82fbf63c60394c0b9babb2f6247e6458492f413eb1b50` | `5dfa35e103c473b58ed9ea1929f9ee177d3baf34e969368ce99654a1c2147bae` |

## Por que não usar

- **Nota de 0 a 1000 ("Score Xscore") e régua Negar / Revisão / Restrição / Aprovar:** o Xscore
  não tem nota única nem fundida (decisão D-0001), e a política vigente não tem faixas.
- **Selo "Dentro da política" / "Com restrição" / "Precisa de revisão" / "Fora da política" e a
  legenda dos selos:** dependem da régua e de mínimos que não existem.
- **Mínimos por critério ("mín. 600", "mín. 2") e "Por que caiu aqui":** nenhum mínimo configurado;
  não há faixa onde "cair".
- **"Limite sugerido pela política":** a política não sugere limite. O padrão mostra só o limite
  sugerido pelo birô, como recomendação.
- **Nome/versão da política, atraso na carteira e versão curta para listas:** sem fonte nesta análise.

## Por que os arquivos ficam fora da vitrine

Os arquivos não seguem as regras de documentação do DS: dependem de um `support.js` que não
acompanha a cópia, carregam fontes do Google Fonts, usam cor fixa e estilo inline. Por isso não
abrem como página aqui e não constam da lista de publicação do Pages (`scripts/prepare-pages.cjs`).
O teste da vitrine Xscore falha se esta pasta entrar na publicação ou for linkada pelo Brand System.
O repositório é público: os arquivos podem ser lidos no GitHub, mas não são publicados no Pages.
