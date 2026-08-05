# design-sync — NOTES (Electia foundation)

## Modo deste sync
- **foundation off-script**: o repo `resultx-design-system` é CSS/tokens puro (`dependencies: []`, sem React, sem Storybook). O converter de componentes (`package-build.mjs`) NÃO se aplica — não há componentes pra bundlar. O layout foi montado à mão em `ds-bundle/`.
- **Projeto claude.ai/design:** "Electia — Design System" (`6eb19719-283d-40d9-bb6d-2c8577e7a81f`).
- **O que sobe:** `styles.css` (entry: @import Google Fonts Sora/Inter/JetBrains + `./tokens/tokens.css` + base reset grafite), `tokens/tokens.{css,json}`, `guidelines/{BRAND-BOOK,DESIGN-SYSTEM,MOTION-GUIDE}.md`, `README.md` (= header de convenções), sentinel `_ds_needs_recompile`.

## Re-sync (passo a passo)
1. Re-copiar de `brands/electia/` → `ds-bundle/`: `tokens/tokens.{css,json}` + os 3 docs de `docs/`.
2. `finalize_plan` (localDir `ds-bundle`, mesmos writes/deletes), depois `write_files` em 3 passadas: sentinel → conteúdo → sentinel.
3. Os globs estão em `config.json` (`tokensGlob`, `guidelinesGlob`).

## Re-sync risks / pendências
- **`_ds_sync.json` OMITIDO** de propósito (shape off-script não gera o sidecar honestamente). O projeto fica **un-anchored** → todo re-sync re-avalia e re-sobe tudo. É o estado seguro documentado, não um bug.
- **Fontes via Google Fonts em runtime** (não empacotadas no bundle). Se precisar offline, empacotar `.woff2` e trocar o @import por `@font-face`.
- **Teal `#2DD4BF` residual** em 4 templates de e-mail do brand (marca pré-roxo). NÃO sobe pro claude.ai/design, mas é inconsistência de marca a limpar (follow-up `teal→purple`).
- **Sem drift acionável p/ a LP (verificado 26/06):** a LP `resultx/electia` importa `resultx-design-system/tokens` (= `dist/tokens.min.css`, tokens RAIZ multi-brand) mas **redefine os próprios tokens de cor localmente** no `globals.css` (`--bg-primary #0B0E14` etc., que vencem por design). Os tokens do brand electia (`brands/electia/tokens`, editados pro grafite) são **documentação canônica** (subpath `./tokens/source`, NÃO importado pela LP) — agora sincronizada pro claude.ai/design. Logo, NÃO é preciso republicar tag pra LP ficar grafite: ela já está.
- **Drift residual menor (fora de escopo):** o `dist/tokens.min.css` raiz publicado ainda tem teal `#2dd4bf` + cores antigas. É o DS RAIZ multi-brand (PdV/IMO/Electia) — mexer afeta as 3 marcas, não só Electia. Tratar num release coordenado do DS raiz, separado.
- **Se o DS ganhar componentes React** no futuro: migrar pro fluxo `package` real do converter (entry `dist/`, `.d.ts`, esbuild) em vez do off-script.
