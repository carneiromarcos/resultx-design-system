# Comandos e saídas — Core Aviso

Executados na raiz deste repositório. Retornos tratados individualmente; saídas integrais com somente espaços finais normalizados. Os PNGs de diagnóstico local não são baselines Linux.

## RED inicial

```sh
npx jest tests/notice.test.js --runInBand
```

Retorno: 1. Saída:

````text
FAIL tests/notice.test.js (21.494 s)
  ● Aviso distingue próximo passo obrigatório e ação local obrigatória quando permitida

    ENOENT: no such file or directory, open 'contracts/notice.yaml'

       5 | const baseline = require('./fixtures/notice-source.json');
       6 | const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
    >  7 | const contract = () => yaml.load(fs.readFileSync('contracts/notice.yaml', 'utf8'));
         |                                     ^
       8 |
       9 | test('Aviso distingue próximo passo obrigatório e ação local obrigatória quando permitida', () => {
      10 |   const c = contract();

      at readFileSync (tests/notice.test.js:7:37)
      at Object.contract (tests/notice.test.js:10:13)

  ● Aviso e novos status usam superfície e texto existentes, apenas duas tintas semânticas novas no adaptador

    expect(received).toEqual(expected) // deep equality

    Expected: ObjectContaining {"border-color": "var(--color-warning)"}
    Received: undefined

      22 |   });
      23 |   for (const variant of ['warning', 'info']) {
    > 24 |     expect(styles[`.rx-badge--${variant}`]).toEqual(expect.objectContaining({ 'border-color': `var(--color-${variant})` }));
         |                                             ^
      25 |     expect(styles[`.rx-notice--${variant}`]).toEqual(expect.objectContaining({ 'border-color': `var(--color-${variant})` }));
      26 |   }
      27 |   expect(styles['.rx-notice']).toEqual(expect.objectContaining({ color: 'var(--text-primary)', background: 'var(--bg-surface-1)' }));

      at Object.toEqual (tests/notice.test.js:24:45)

  ● receitas reais mostram Aviso com ação, sem ação indevida e status específicos

    Exemplo do piloto ausente: notice-warning-action

      42 |   const tokens = [...html.matchAll(/<!--[\s\S]*?-->|<\/?[a-z][^>]*>/gi)];
      43 |   const at = tokens.findIndex(m => new RegExp(`\\bid=["']${id}["']`).test(m[0]));
    > 44 |   if (at < 0) throw Error('Exemplo do piloto ausente: ' + id);
         |                     ^
      45 |   const start = tokens[at],
      46 |     tag = /^<([\w-]+)/.exec(start[0])[1];
      47 |   if (/^(input|img|br|hr|meta|link)$/.test(tag)) return start[0];

      at elementById (scripts/catalog/components.cjs:44:21)
      at Object.elementById (tests/notice.test.js:32:17)

  ● aliases anteriores são byte-idênticos ao remover apenas as duas linhas novas e eds-root mantém SHA

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      39 |   const css = fs.readFileSync('brands/emprega-mais/tokens/pilot-aliases.css', 'utf8');
      40 |   const additions = ['  --color-info: var(--eds-info-ink);', '  --color-warning: var(--eds-warning-ink);'];
    > 41 |   for (const line of additions) expect(css.split('\n').filter(s => s === line)).toHaveLength(1);
         |                                                                                 ^
      42 |   expect(css.split('\n').filter(line => !additions.includes(line)).join('\n')).toBe(baseline.aliasesBefore);
      43 |   expect(hash(fs.readFileSync('brands/emprega-mais/tokens/eds-root.css'))).toBe(baseline.edsRootSha256);
      44 | });

      at Object.toHaveLength (tests/notice.test.js:41:81)

  ● catálogo registra Aviso sem JavaScript e usa a ficha gerada, sem documento duplicado

    expect(received).toEqual(expected) // deep equality

    Expected: ObjectContaining {"contract": "contracts/notice.yaml", "js": []}
    Received: undefined

      48 | test('catálogo registra Aviso sem JavaScript e usa a ficha gerada, sem documento duplicado', () => {
      49 |   const entry = yaml.load(fs.readFileSync('catalog/manifest.yaml', 'utf8')).pages.find(e => e.id === 'notice');
    > 50 |   expect(entry).toEqual(expect.objectContaining({ contract: 'contracts/notice.yaml', js: [] }));
         |                 ^
      51 |   expect(entry.sources).toContain('generated/component-cards/notice.md');
      52 |   expect(fs.existsSync('docs/components/notice.md')).toBe(false);
      53 | });

      at Object.toEqual (tests/notice.test.js:50:17)

Test Suites: 1 failed, 1 total
Tests:       5 failed, 1 passed, 6 total
Snapshots:   0 total
Time:        570.378 s
Ran all test suites matching tests/notice.test.js.
````

## Unitários finais

```sh
npm test -- --runInBand --watchman=false
```

Retorno: 0. Saída:

````text

> resultx-design-system@2.10.0 test
> jest --runInBand --watchman=false


Test Suites: 42 passed, 42 total
Tests:       846 passed, 846 total
Snapshots:   0 total
Time:        40.061 s
Ran all test suites.
````

## Build

```sh
npm run build
```

Retorno: 0. Saída:

````text

> resultx-design-system@2.10.0 build
> npm run build:all


> resultx-design-system@2.10.0 build:all
> node scripts/build-eds-root.mjs --check && npm run build:tokens && npm run build:components && npm run build:icons && npm run build:bridges && node scripts/build-pilot-scoped.mjs && node scripts/check-pilot-contrast.cjs


> resultx-design-system@2.10.0 build:tokens
> node scripts/build-base.mjs && node scripts/build-data-layer.mjs && node scripts/build-themes.mjs && node scripts/build-core.mjs && node scripts/build-aliases.mjs && node scripts/build-tokens.js && postcss tokens/tokens.css -o dist/tokens.min.css

✓ dist/tokens.theme.css (141 shared + 93 dark + 93 light + 74 premium-light + 74 sober-dark + 74 vibrant-dark tokens)
✓ dist/tokens.ts

> resultx-design-system@2.10.0 build:components
> postcss components/components.css -o dist/components.min.css


> resultx-design-system@2.10.0 build:icons
> postcss components/icons.css -o dist/icons.min.css


> resultx-design-system@2.10.0 build:bridges
> node scripts/build-eds-root.mjs --check && node scripts/build-core.mjs && node scripts/build-brand-tokens.mjs && node scripts/build-eds-root.mjs && node scripts/build-brand-bridges.js


Ponte de marca — contraste medido (WCAG 2.2, AA = 4.5:1)

marca         tema   accent    tinta     razao   accent como texto
--------------------------------------------------------------------------------
electia       dark   #6f32b1   #FFFFFF   7.59:1  #c084fc (7.31:1)
electia       light  #6f32b1   #FFFFFF   7.59:1  #6f32b1 (7.59:1)
emprega-mais  dark   #4f46e5   #FFFFFF   6.29:1  #b9baf9 (10.54:1)
emprega-mais  light  #4f46e5   #FFFFFF   6.29:1  #363885 (10.19:1)
pdv           dark   #c4993b   #0B0E14   7.33:1  #c4993b (7.33:1)
pdv           light  #c4993b   #0B0E14   7.33:1  #866425 (5.44:1)
resultx       dark   #c4993b   #0B0E14   7.33:1  #c4993b (7.33:1)
resultx       light  #c4993b   #0B0E14   7.33:1  #866425 (5.44:1)
xscore        dark   #c4993b   #0B0E14   7.33:1  #c4993b (7.33:1)
xscore        light  #c4993b   #0B0E14   7.33:1  #866425 (5.44:1)

OK — 5 pontes escritas em brands/<marca>/tokens/ds-bridge.css

Gerados adapters/css/pilot.scoped.css e brands/emprega-mais/tokens/pilot-aliases.css; 28 aliases.
light | primário | --text-inverse / --accent-primary | 6.29:1 (mín. 4.5:1)
light | texto | --text-primary / --bg-surface-1 | 15.49:1 (mín. 4.5:1)
light | texto hover | --text-primary / --bg-surface-3 | 13.61:1 (mín. 4.5:1)
light | texto ativo | --text-primary / --bg-surface-2 | 14.97:1 (mín. 4.5:1)
light | texto indisponível | --text-muted / --bg-surface-2 | 4.67:1 (mín. 4.5:1)
light | erro | --color-error / --bg-surface-1 | 6.47:1 (mín. 4.5:1)
light | sucesso | --text-on-success / --color-success | 5.48:1 (mín. 4.5:1)
light | aviso warning | --color-warning / --bg-surface-1 | 5.56:1 (mín. 3:1)
light | aviso info | --color-info / --bg-surface-1 | 6.70:1 (mín. 3:1)
light | link | --accent-primary-text / --bg-surface-1 | 10.18:1 (mín. 4.5:1)
light | limite botão | --text-secondary / --bg-surface-1 | 4.83:1 (mín. 3:1)
light | borda sobre superfície 2 | --text-secondary / --bg-surface-2 | 4.67:1 (mín. 3:1)
light | borda sobre superfície 3 | --text-secondary / --bg-surface-3 | 4.25:1 (mín. 3:1)
light | foco | --accent-primary-text / --bg-surface-1 | 10.18:1 (mín. 3:1)
light | foco sobre superfície 2 | --accent-primary-text / --bg-surface-2 | 9.84:1 (mín. 3:1)
light | foco sobre superfície 3 | --accent-primary-text / --bg-surface-3 | 8.94:1 (mín. 3:1)
dark | primário | --text-inverse / --accent-primary | 6.29:1 (mín. 4.5:1)
dark | texto | --text-primary / --bg-surface-1 | 14.24:1 (mín. 4.5:1)
dark | texto hover | --text-primary / --bg-surface-3 | 11.67:1 (mín. 4.5:1)
dark | texto ativo | --text-primary / --bg-surface-2 | 12.98:1 (mín. 4.5:1)
dark | texto indisponível | --text-muted / --bg-surface-2 | 6.81:1 (mín. 4.5:1)
dark | erro | --color-error / --bg-surface-1 | 6.18:1 (mín. 4.5:1)
dark | sucesso | --text-on-success / --color-success | 8.89:1 (mín. 4.5:1)
dark | aviso warning | --color-warning / --bg-surface-1 | 10.24:1 (mín. 3:1)
dark | aviso info | --color-info / --bg-surface-1 | 6.73:1 (mín. 3:1)
dark | link | --accent-primary-text / --bg-surface-1 | 9.33:1 (mín. 4.5:1)
dark | limite botão | --text-secondary / --bg-surface-1 | 7.47:1 (mín. 3:1)
dark | borda sobre superfície 2 | --text-secondary / --bg-surface-2 | 6.81:1 (mín. 3:1)
dark | borda sobre superfície 3 | --text-secondary / --bg-surface-3 | 6.13:1 (mín. 3:1)
dark | foco | --accent-primary-text / --bg-surface-1 | 9.33:1 (mín. 3:1)
dark | foco sobre superfície 2 | --accent-primary-text / --bg-surface-2 | 8.51:1 (mín. 3:1)
dark | foco sobre superfície 3 | --accent-primary-text / --bg-surface-3 | 7.65:1 (mín. 3:1)
````

## Lint

```sh
npm run lint
```

Retorno: 0. Saída:

````text

> resultx-design-system@2.10.0 lint
> stylelint 'components/**/*.css' 'adapters/**/*.css'

````

## Lint dos tokens

```sh
npm run lint:tokens
```

Retorno: 0. Saída:

````text

> resultx-design-system@2.10.0 lint:tokens
> stylelint 'tokens/**/*.css'

````

## Contratos e negativos no navegador

```sh
npx playwright test tests/visual/pilot-contracts.spec.js tests/visual/notice-negative.spec.js --grep 'cada caso|(light|dark):|notice-negative' --workers=2 --output=test-results/notice-contracts
```

Retorno: 0. Saída:

````text

Running 138 tests using 2 workers

(node:29227) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:29230) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓    2 [chromium] › tests/visual/notice-negative.spec.js:8:1 › ação indevida desativada também é rejeitada (451ms)
  ✓    1 [chromium] › tests/visual/notice-negative.spec.js:7:1 › ação local permitida removida é rejeitada (451ms)
  ✓    3 [chromium] › tests/visual/notice-negative.spec.js:9:1 › próximo passo ausente é rejeitado (241ms)
  ✓    4 [chromium] › tests/visual/notice-negative.spec.js:10:1 › texto técnico no aviso é rejeitado (248ms)
  ✓    5 [chromium] › tests/visual/notice-negative.spec.js:11:1 › vitrine sem declaração não ganha obrigações novas (187ms)
  ✓    6 [chromium] › tests/visual/notice-negative.spec.js:13:1 › cenário sem declaração de local não passa por orientação externa implicitamente (222ms)
  ✓    8 [chromium] › tests/visual/pilot-contracts.spec.js:26:1 › cada caso dos contratos tem implementação executável (3ms)
  ✓    7 [chromium] › tests/visual/notice-negative.spec.js:14:1 › detalhe recolhido não pode esconder log técnico (203ms)
  ✓    9 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: button-unavailable-visual (295ms)
  ✓   11 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: button-link-keyboard (294ms)
  ✓   12 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: button-link-unavailable (394ms)
  ✓   10 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: button-loading-visual (907ms)
  ✓   14 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: button-accessible (142ms)
  ✓   15 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: button-disabled (143ms)
  ✓   16 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: button-loading (144ms)
  ✓   17 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: button-keyboard (382ms)
  ✓   13 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: button-link-contrast (2.1s)
  ✓   19 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: button-variant-hierarchy (308ms)
  ✓   18 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: button-contrast (1.7s)
  ✓   20 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: card-heading (212ms)
  ✓   21 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: card-loading (235ms)
  ✓   23 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: card-sizes (224ms)
  ✓   22 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: card-contrast (512ms)
  ✓   24 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: card-shadow (215ms)
  ✓   25 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: card-empty-error (207ms)
  ✓   27 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: card-disabled (222ms)
  ✓   26 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: card-keyboard (443ms)
  ✓   28 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: dialog-semantics (362ms)
  ✓   29 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: dialog-keyboard (467ms)
  ✓   30 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: dialog-contrast (439ms)
  ✓   31 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: dialog-closed (187ms)
  ✓   32 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: dialog-loading-error (1.1s)
  ✓   34 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: table-semantics (177ms)
  ✓   35 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: table-sorting (158ms)
  ✓   36 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: table-loading (143ms)
  ✓   33 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: dialog-confirm (1.9s)
  ✓   37 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: table-contrast (396ms)
  ✓   38 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: table-empty-error (170ms)
  ✓   39 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: table-disabled (144ms)
  ✓   41 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: empty-content (144ms)
  ✓   40 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: table-focus (289ms)
  ✓   42 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: error-content (139ms)
  ✓   44 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: empty-contrast (162ms)
  ✓   43 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: empty-keyboard (290ms)
  ✓   45 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: empty-loading (143ms)
  ✓   46 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: field-label (140ms)
  ✓   47 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: field-error (142ms)
  ✓   48 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: field-disabled (142ms)
  ✓   49 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: field-keyboard (328ms)
  ✓   51 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: field-loading (147ms)
  ✓   50 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: field-contrast (393ms)
  ✓   52 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: field-empty (141ms)
  ✓   53 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: notice-content (174ms)
  ✓   54 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: notice-action-policy (173ms)
  ✓   55 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: notice-semantics (164ms)
  ✓   57 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: notice-loading (246ms)
  ✓   56 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: notice-announcement (291ms)
  ✓   58 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: notice-keyboard (444ms)
  ✓   59 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: notice-contrast (724ms)
  ✓   60 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: notice-responsive (298ms)
  ✓   61 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: stat-value (181ms)
  ✓   62 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: stat-empty (176ms)
  ✓   63 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: stat-loading (209ms)
  ✓   64 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: stat-contrast (375ms)
  ✓   65 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: stat-error (210ms)
  ✓   67 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: badge-semantics (405ms)
  ✓   66 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: stat-link (986ms)
  ✓   68 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: badge-variants (1.1s)
  ✓   70 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: badge-loading (382ms)
  ✓   71 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: badge-empty (387ms)
  ✓   69 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: badge-contrast (1.6s)
  ✓   72 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: badge-warning-info (468ms)
  ✓   73 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › light: badge-next-step (303ms)
  ✓   74 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: button-unavailable-visual (612ms)
  ✓   76 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: button-link-keyboard (557ms)
  ✓   77 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: button-link-unavailable (759ms)
  ✓   75 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: button-loading-visual (1.8s)
  ✓   79 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: button-accessible (261ms)
  ✓   80 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: button-disabled (221ms)
  ✓   81 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: button-loading (215ms)
  ✓   82 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: button-keyboard (417ms)
  ✓   78 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: button-link-contrast (2.4s)
  ✓   84 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: button-variant-hierarchy (241ms)
  ✓   85 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: card-heading (141ms)
  ✓   83 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: button-contrast (1.8s)
  ✓   86 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: card-loading (226ms)
  ✓   88 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: card-sizes (267ms)
  ✓   89 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: card-shadow (225ms)
  ✓   87 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: card-contrast (580ms)
  ✓   90 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: card-empty-error (288ms)
  ✓   92 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: card-disabled (218ms)
  ✓   91 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: card-keyboard (484ms)
  ✓   93 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: dialog-semantics (319ms)
  ✓   94 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: dialog-keyboard (468ms)
  ✓   96 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: dialog-closed (146ms)
  ✓   95 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: dialog-contrast (392ms)
  ✓   97 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: dialog-loading-error (1.1s)
  ✓   99 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: table-semantics (177ms)
  ✓  100 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: table-sorting (173ms)
  ✓  101 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: table-loading (141ms)
  ✓  102 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: table-contrast (315ms)
  ✓   98 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: dialog-confirm (1.9s)
  ✓  103 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: table-empty-error (158ms)
  ✓  104 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: table-disabled (143ms)
  ✓  106 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: empty-content (165ms)
  ✓  105 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: table-focus (293ms)
  ✓  107 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: error-content (181ms)
  ✓  109 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: empty-contrast (184ms)
  ✓  108 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: empty-keyboard (331ms)
  ✓  110 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: empty-loading (182ms)
  ✓  111 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: field-label (210ms)
  ✓  112 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: field-error (215ms)
  ✓  113 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: field-disabled (192ms)
  ✓  114 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: field-keyboard (339ms)
  ✓  115 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: field-contrast (454ms)
  ✓  116 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: field-loading (241ms)
  ✓  117 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: field-empty (280ms)
  ✓  118 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: notice-content (315ms)
  ✓  119 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: notice-action-policy (274ms)
  ✓  120 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: notice-semantics (317ms)
  ✓  121 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: notice-announcement (394ms)
  ✓  122 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: notice-loading (333ms)
  ✓  123 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: notice-keyboard (536ms)
  ✓  125 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: notice-responsive (265ms)
  ✓  124 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: notice-contrast (754ms)
  ✓  126 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: stat-value (194ms)
  ✓  127 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: stat-empty (187ms)
  ✓  128 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: stat-loading (228ms)
  ✓  130 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: stat-error (292ms)
  ✓  129 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: stat-contrast (581ms)
  ✓  132 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: badge-semantics (318ms)
  ✓  131 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: stat-link (579ms)
  ✓  133 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: badge-variants (272ms)
  ✓  135 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: badge-loading (292ms)
  ✓  136 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: badge-empty (372ms)
  ✓  134 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: badge-contrast (1.1s)
  ✓  137 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: badge-warning-info (483ms)
  ✓  138 [chromium] › tests/visual/pilot-contracts.spec.js:32:5 › dark: badge-next-step (266ms)

  138 passed (30.6s)
````

## Catálogo publicado e diagnóstico nas duas larguras

```sh
CATALOG_EVIDENCE_DIR=test-results/catalog-diagnostic npx playwright test tests/visual/catalog-components.spec.js --grep 'notice|status-badge' --workers=1
```

Retorno: 0. Saída:

````text

Running 20 tests using 1 worker

(node:14248) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
Catálogo: fundações, contratos e famílias documentadas nas dez combinações; JavaScript local somente nas páginas autorizadas de cada componente.
  ✓   1 [chromium] › tests/visual/catalog-components.spec.js:120:93 › eletia light status-badge: estados, estilo, publicação (819ms)
  ✓   2 [chromium] › tests/visual/catalog-components.spec.js:120:93 › eletia light notice: estados, estilo, publicação (588ms)
  ✓   3 [chromium] › tests/visual/catalog-components.spec.js:120:93 › eletia dark status-badge: estados, estilo, publicação (449ms)
  ✓   4 [chromium] › tests/visual/catalog-components.spec.js:120:93 › eletia dark notice: estados, estilo, publicação (772ms)
  ✓   5 [chromium] › tests/visual/catalog-components.spec.js:120:93 › emprega light status-badge: estados, estilo, publicação (793ms)
  ✓   6 [chromium] › tests/visual/catalog-components.spec.js:120:93 › emprega light notice: estados, estilo, publicação (633ms)
  ✓   7 [chromium] › tests/visual/catalog-components.spec.js:120:93 › emprega dark status-badge: estados, estilo, publicação (477ms)
  ✓   8 [chromium] › tests/visual/catalog-components.spec.js:120:93 › emprega dark notice: estados, estilo, publicação (476ms)
  ✓   9 [chromium] › tests/visual/catalog-components.spec.js:120:93 › xscore light status-badge: estados, estilo, publicação (428ms)
  ✓  10 [chromium] › tests/visual/catalog-components.spec.js:120:93 › xscore light notice: estados, estilo, publicação (712ms)
  ✓  11 [chromium] › tests/visual/catalog-components.spec.js:120:93 › xscore dark status-badge: estados, estilo, publicação (796ms)
  ✓  12 [chromium] › tests/visual/catalog-components.spec.js:120:93 › xscore dark notice: estados, estilo, publicação (556ms)
  ✓  13 [chromium] › tests/visual/catalog-components.spec.js:120:93 › pdv light status-badge: estados, estilo, publicação (528ms)
  ✓  14 [chromium] › tests/visual/catalog-components.spec.js:120:93 › pdv light notice: estados, estilo, publicação (471ms)
  ✓  15 [chromium] › tests/visual/catalog-components.spec.js:120:93 › pdv dark status-badge: estados, estilo, publicação (457ms)
  ✓  16 [chromium] › tests/visual/catalog-components.spec.js:120:93 › pdv dark notice: estados, estilo, publicação (465ms)
  ✓  17 [chromium] › tests/visual/catalog-components.spec.js:120:93 › resultx light status-badge: estados, estilo, publicação (427ms)
  ✓  18 [chromium] › tests/visual/catalog-components.spec.js:120:93 › resultx light notice: estados, estilo, publicação (469ms)
  ✓  19 [chromium] › tests/visual/catalog-components.spec.js:120:93 › resultx dark status-badge: estados, estilo, publicação (435ms)
  ✓  20 [chromium] › tests/visual/catalog-components.spec.js:120:93 › resultx dark notice: estados, estilo, publicação (722ms)

  20 passed (18.4s)
````

## Compatibilidade explícita

```sh
node scripts/check-pilot-compat.cjs
```

Retorno: 0. Saída:

````text
{
  "sourceSha": "64a26656170ae506f3bb4c05647c5f3c63c43177",
  "previousShowcase": true,
  "currentRunner": true,
  "passed": 110,
  "failed": 0,
  "skippedNewObligations": 20,
  "latestConformity": false
}
````

## Gerados da marca

```sh
node docs/qa/2026-11-17-notice/verify-generated-brand.cjs
```

Retorno: 0. Saída:

````text
{
  "base": "64a26656170ae506f3bb4c05647c5f3c63c43177",
  "html": [
    {
      "file": "brands/emprega-mais/previews/brand-system/index.html",
      "onlyNoticeLinkAndContentId": true,
      "sha256": "96afdd56e6c2145b409be2d23a3fc569d92086361ee6cf522db1cdeb42e5507f"
    },
    {
      "file": "brands/emprega-mais/previews/brand-system/dark.html",
      "onlyNoticeLinkAndContentId": true,
      "sha256": "d4780c603731ef7f47f24ab567d37ddd2d0a9294a6f06f02f3ce30586799f5c1"
    }
  ],
  "noticeRegistrationOnly": true,
  "addedInputs": [
    "contracts/notice.yaml",
    "generated/component-cards/notice.md"
  ],
  "changedInputHashes": [
    "brands/emprega-mais/tokens/pilot-aliases.css",
    "contracts/status-badge.yaml",
    "generated/component-cards/status-badge.md"
  ],
  "otherProvenanceFieldsIdentical": true,
  "brandGeneratorTestCssFontLogoUnchanged": true,
  "brandChanges": [
    "brands/emprega-mais/previews/brand-system/dark.html",
    "brands/emprega-mais/previews/brand-system/index.html",
    "brands/emprega-mais/previews/brand-system/provenance.json",
    "brands/emprega-mais/tokens/pilot-aliases.css",
    "brands/emprega-mais/tokens/pilot-aliases.css.sha256"
  ]
}
````

## Contraste renderizado e carregamento de fontes

```sh
node scripts/measure-notice-contrast.cjs > /tmp/ds-aviso-contrast.json 2> /tmp/ds-aviso-contrast-errors.txt
result=$?
echo "measure_exit=$result"
node -e 'const x=require("/tmp/ds-aviso-contrast.json"); console.log(JSON.stringify({basePairs:x.basePairs,baseFailures:x.baseFailures,geometryFailures:x.geometryFailures,additionalFailures:x.additionalFailures,failedRequests:x.failedRequests})); if(x.baseFailures||x.geometryFailures||x.failedRequests.length)process.exitCode=1'
```

Retorno: 0. Saída:

```text
measure_exit=0
{"basePairs":40,"baseFailures":0,"geometryFailures":0,"additionalFailures":4,"failedRequests":[]}
```

A saída JSON integral está em contrast.json. As quatro reprovações adicionais são
conhecidas, registradas em color-pending.json; não são pares padrão aprovados. O comando
reprova pares padrão, geometria ou falhas de rede. Não certifica todas as superfícies.

Ensaios anteriores dessa medição retornaram 1 por cancelamento de uma face local durante
a troca de documento; não são gates aprovados. O medidor agora aguarda o carregamento
explícito de todas as FontFace registradas, sem ignorar requestfailed. A execução acima
não contém cancelamento nem erro HTTP.

## CSS do catálogo

```sh
npx --no -- stylelint 'catalog/*.css'
```

Retorno: 0. Saída vazia.

## Reexecução após o commit funcional 8708e3f

```sh
npm run build > /tmp/ds-aviso-postcommit-build.txt 2>&1
build_result=$?
echo "build_exit=$build_result"
if [ "$build_result" -ne 0 ]; then cat /tmp/ds-aviso-postcommit-build.txt; exit "$build_result"; fi
npm test -- --runInBand --watchman=false > /tmp/ds-aviso-postcommit-test.txt 2>&1
test_result=$?
echo "test_exit=$test_result"
tail -6 /tmp/ds-aviso-postcommit-test.txt
if [ "$test_result" -ne 0 ]; then exit "$test_result"; fi
git status --porcelain -- dist/ brands/ tokens/ adapters/
if [ -n "$(git status --porcelain -- dist/ brands/ tokens/ adapters/)" ]; then exit 1; fi
echo 'generated_artifacts_gate=PASS (empty git status)'
```

Retorno: 0. Saída:

```text
build_exit=0
test_exit=0

Test Suites: 42 passed, 42 total
Tests:       846 passed, 846 total
Snapshots:   0 total
Time:        28.054 s, estimated 29 s
Ran all test suites.
generated_artifacts_gate=PASS (empty git status)
```

O status vazio cobre gerados depois de build e testes, incluindo os três gerados da
marca. A prova de conteúdo isolada foi reexecutada e conservou os hashes registrados.

## Complemento do ciclo de vida do processo

Com o script publicado em 6c69edad e o teste novo, antes da correção:

```sh
npx jest tests/pilot-compat-lifecycle.test.js --runInBand --watchman=false > /tmp/ds-aviso-close-red.txt 2>&1
red_result=$?
echo "red_exit=$red_result"
cat /tmp/ds-aviso-close-red.txt
```

Saída (retorno do ensaio: 1):

```text
red_exit=1
FAIL tests/pilot-compat-lifecycle.test.js
  ● compatibilidade aguarda stdout tardio até close antes de interpretar JSON

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "Unterminated string in JSON at position 27 (line 1 column 28)",
    + ]

      34 |     URL,
      35 |   }, { filename: 'check-pilot-compat.cjs' });
    > 36 |   expect(errors).toEqual([]);
         |                  ^
      37 |   expect(executionProcess.exitCode).toBe(0);
      38 |   expect(closed).toBe(true);
      39 |   expect(JSON.parse(output.join(''))).toEqual(expect.objectContaining({ passed: 110, failed: 0, skippedNewObligations: 20, latestConformity: false }));

      at Object.toEqual (tests/pilot-compat-lifecycle.test.js:36:18)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        0.4 s
Ran all test suites matching tests/pilot-compat-lifecycle.test.js.
```

Depois de mudar somente a espera de exit para close:

```sh
npx jest tests/pilot-compat-lifecycle.test.js --runInBand --watchman=false > /tmp/ds-aviso-close-green.txt 2>&1
green_result=$?
echo "green_exit=$green_result"
cat /tmp/ds-aviso-close-green.txt
if [ "$green_result" -ne 0 ]; then exit "$green_result"; fi
node scripts/check-pilot-compat.cjs > /tmp/ds-aviso-close-compat.txt 2>&1
compat_result=$?
echo "compat_exit=$compat_result"
cat /tmp/ds-aviso-close-compat.txt
exit "$compat_result"
```

Retorno: 0. Saída:

```text
green_exit=0
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.235 s, estimated 1 s
Ran all test suites matching tests/pilot-compat-lifecycle.test.js.
compat_exit=0
{
  "sourceSha": "64a26656170ae506f3bb4c05647c5f3c63c43177",
  "previousShowcase": true,
  "currentRunner": true,
  "passed": 110,
  "failed": 0,
  "skippedNewObligations": 20,
  "latestConformity": false
}
```

O negativo executa o script real com processo filho controlado: stdout chega em duas
partes, exit entre elas e close depois da última. O erro de JSON truncado aparece antes
da correção; depois o relatório completo preserva 110 pass/20 não verificados.

## Suíte completa depois do complemento

```sh
npm test -- --runInBand --watchman=false > /tmp/ds-aviso-close-full.txt 2>&1
full_result=$?
echo "test_exit=$full_result"
tail -6 /tmp/ds-aviso-close-full.txt
exit "$full_result"
```

Retorno: 0. Saída:

```text
test_exit=0

Test Suites: 43 passed, 43 total
Tests:       847 passed, 847 total
Snapshots:   0 total
Time:        35.536 s
Ran all test suites.
```

## Correção do veredito de contraste (major da segunda passagem)

A execução anteriormente registrada com retorno 0 ignorava additionalFailures no veredito.
A aprovação da medição inteira foi retirada: os 40 pares padrão passam, mas há quatro
pares adicionais não conformes. O veredito atual reprova qualquer falha de base, geometria,
contraste adicional ou rede. O medidor é diagnóstico manual, não um gate chamado pelo CI.

### Chamadas verificadas

```sh
rg -n -F 'measure-notice-contrast' package.json .github/workflows
search_result=$?
echo "direct_call_search_exit=$search_result"
rg -n 'build:all|check-pilot-contrast|npm test|npm run build' package.json .github/workflows/ci.yml .github/workflows/visual-baseline-linux.yml
```

Saída:

```text
direct_call_search_exit=1
package.json:100:    "build:all": "node scripts/build-eds-root.mjs --check && npm run build:tokens && npm run build:components && npm run build:icons && npm run build:bridges && node scripts/build-pilot-scoped.mjs && node scripts/check-pilot-contrast.cjs",
package.json:101:    "build": "npm run build:all",
.github/workflows/ci.yml:22:      - run: npm run build
.github/workflows/ci.yml:23:      - run: npm test
.github/workflows/ci.yml:32:            echo "::error::npm run build produced output that differs from what is committed (or created new untracked files under dist/, brands/, tokens/ or adapters/)."
.github/workflows/ci.yml:37:            echo "Then: run \`npm run build\`, REVIEW the diff, and only commit if the output is correct (dist/, tokens/ and brands/*/tokens/*.css)."
```

```sh
rg -n -F 'measure-notice-contrast' scripts --glob '!measure-notice-contrast.cjs'
echo "transitive_call_search_exit=$?"
```

Saída:

```text
transitive_call_search_exit=1
```

Retorno 1 da busca significa nenhuma chamada encontrada. O build chama outro medidor,
check-pilot-contrast.cjs; ele não chama este diagnóstico. O teste unitário importa somente
o predicado puro. require.main impede build/navegador ao importar. Sem nova exceção de gate.

### RED e GREEN permanentes

```sh
npx jest tests/notice.test.js --runInBand --watchman=false > /tmp/ds-aviso-measure-red.txt 2>&1
red_result=$?
echo "red_exit=$red_result"
cat /tmp/ds-aviso-measure-red.txt
```

Retorno do ensaio: 1. Saída:

```text
red_exit=1
FAIL tests/notice.test.js
  ● medidor reprova contraste adicional de borda ou foco com os pares padrão verdes

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      77 |   expect(measurementFailed(clean)).toBe(false);
      78 |   // One new focus failure is blocking, as are the four known surface failures.
    > 79 |   expect(measurementFailed({ ...clean, additionalFailures: 1 })).toBe(true);
         |                                                                  ^
      80 |   expect(measurementFailed({ ...clean, additionalFailures: 4 })).toBe(true);
      81 |   expect(measurementFailed({ ...clean, baseFailures: 1 })).toBe(true);
      82 |   expect(measurementFailed({ ...clean, geometryFailures: 1 })).toBe(true);

      at Object.toBe (tests/notice.test.js:79:66)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 passed, 9 total
Snapshots:   0 total
Time:        0.654 s, estimated 1 s
Ran all test suites matching tests/notice.test.js.
```

```sh
npx jest tests/notice.test.js --runInBand --watchman=false > /tmp/ds-aviso-measure-green.txt 2>&1
result=$?
echo "green_exit=$result"
cat /tmp/ds-aviso-measure-green.txt
exit "$result"
```

Retorno: 0. Saída:

```text
green_exit=0
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        0.584 s, estimated 1 s
Ran all test suites matching tests/notice.test.js.
```

O mesmo caso exige reprovação com uma falha adicional futura e com as quatro conhecidas,
além de base, geometria e rede. O cenário totalmente limpo deve aprovar.

### Execução manual atual — quatro reprovações conhecidas

```sh
node scripts/measure-notice-contrast.cjs > /tmp/ds-aviso-contrast-strict.json 2> /tmp/ds-aviso-contrast-strict-errors.txt
measure_result=$?
echo "measure_exit=$measure_result"
node -e 'const x=require("/tmp/ds-aviso-contrast-strict.json"); console.log(JSON.stringify({basePairs:x.basePairs,baseFailures:x.baseFailures,geometryFailures:x.geometryFailures,additionalFailures:x.additionalFailures,failedRequests:x.failedRequests}));'
exit "$measure_result"
```

Retorno: **1**, esperado pelas bordas pendentes. Saída:

```text
measure_exit=1
{"basePairs":40,"baseFailures":0,"geometryFailures":0,"additionalFailures":4,"failedRequests":[]}
```

Não é um gate verde ou conformidade total. As quatro pendências seguem na PR de cores;
nenhuma falha nova pode passar silenciosamente. Se este diagnóstico vier a integrar
package/workflow, decidir antes uma lista explícita e temporária de exceções.

## Baselines Linux aprovadas — commit separado

Origem: Visual Linux run 44146500625, artefato da árvore de ensaio
545935d78fcaf3b8a85b073e634a9a7576155c62, head da PR 6c69edad. O primeiro run
retornou 1, com 592 pass/2 fail, exclusivamente as duas capturas inteiras do piloto.
O diagnóstico foi entregue antes da cópia; o Revisor aprovou explicitamente os bytes.

Comando executado:

```sh
git commit -F /tmp/ds-aviso-review-20261117/baseline-commit-message.txt
```

Recorte da saída do hook e do commit (retorno 0):

```text
> resultx-design-system@2.10.0 lint
> stylelint 'components/**/*.css' 'adapters/**/*.css'

> resultx-design-system@2.10.0 test
> jest --runInBand

Test Suites: 43 passed, 43 total
Tests:       848 passed, 848 total
Snapshots:   0 total
Time:        29.552 s, estimated 38 s
Ran all test suites.
[feat/ds-aviso-status-badge c7f046c] test(visual): adopt reviewed notice pilot Linux baselines
 2 files changed, 0 insertions(+), 0 deletions(-)
```

Hashes da origem Linux e dos arquivos copiados, iguais:

```text
0e88e60dd47499d39cd1673ea3d89a67e910e5592602c3d9860ed9c2f31f2fd6  tests/visual/pilot-contracts.spec.js-snapshots/pilot-light-chromium-linux.png
384aaa4b5d87a31f83effc8644f0607eaf7e9cb84c0ec824896162c3a1ef9959  tests/visual/pilot-contracts.spec.js-snapshots/pilot-dark-chromium-linux.png
```

O corpo do commit contém o parecer integral. Crescimento 4433→5430, inserção de 997 px
a partir de y=3390. Prefixo pixel-idêntico; alinhado o sufixo, 101 pixels/13 linhas no
claro e 114/14 no escuro são discrepâncias reais aceitas pelo Revisor. O conteúdo
seguinte desce no fluxo; não houve corte/perda/sobreposição na inspeção independente.
Remover só os acréscimos recupera HTML/CSS antigos byte a byte. Diagnóstico local dos
68 IDs antigos por tema: HTML/estilos/x/dimensões iguais, y=0 ou+997; não substitui Linux.

Não houve alteração de fonte visual, seletor ou tolerância. CI final continua pendente.

## CI raso — correção hermética do teste de stdout

O CI do head be2eee2 passou visual-linux e PR shape, mas lint-and-build falhou no
run 44151598079: 847/848 passaram. O unitário de ciclo de vida dependia indevidamente
do histórico Git local porque o script real lê a vitrine anterior ao carregar.
O script manual não mudou; somente seu contexto no teste recebe uma leitura sintética.
O mock confere o comando exato solicitado e deve ser usado uma vez. Nenhum Git ou
browser é lançado por esse teste; spawn também permanece simulado.

Reprodução: clone isolado --depth 1 --no-local do ramo publicado no head be2eee2.
Dependências Node do mesmo lockfile foram reutilizadas por symlink; fonte e cwd
vieram do clone raso. O mesmo clone foi usado para RED e GREEN, sem fetch entre eles.
Os comandos abaixo foram executados na raiz desse clone temporário.

```sh
git rev-parse --is-shallow-repository
git rev-parse HEAD
git cat-file -e 64a26656170ae506f3bb4c05647c5f3c63c43177:examples/pilot.html
base_result=$?
echo "base_lookup_exit=$base_result"
npx jest tests/pilot-compat-lifecycle.test.js --runInBand --watchman=false > /tmp/ds-aviso-shallow-red.txt 2>&1
red_result=$?
echo "red_exit=$red_result"
cat /tmp/ds-aviso-shallow-red.txt
```

Saída (RED:1; commit-base ausente:128):

```text
true
be2eee213aa2ab405e65312d41fc356c45be214c
fatal: path 'examples/pilot.html' exists on disk, but not in '64a26656170ae506f3bb4c05647c5f3c63c43177'
base_lookup_exit=128
red_exit=1
fatal: path 'examples/pilot.html' exists on disk, but not in '64a26656170ae506f3bb4c05647c5f3c63c43177'
FAIL tests/pilot-compat-lifecycle.test.js
  ● compatibilidade aguarda stdout tardio até close antes de interpretar JSON

    node:child_process:955
        throw err;
        ^

    Error: Command failed: git show 64a26656170ae506f3bb4c05647c5f3c63c43177:examples/pilot.html
    fatal: path 'examples/pilot.html' exists on disk, but not in '64a26656170ae506f3bb4c05647c5f3c63c43177'

      at check-pilot-compat.cjs:8:16
      at Object.runInNewContext (tests/pilot-compat-lifecycle.test.js:29:12)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        0.397 s
Ran all test suites matching tests/pilot-compat-lifecycle.test.js.
```

Aplicado somente o arquivo de teste corrigido, no mesmo clone:

```sh
git rev-parse --is-shallow-repository
git cat-file -e 64a26656170ae506f3bb4c05647c5f3c63c43177:examples/pilot.html
base_result=$?
echo "base_lookup_exit=$base_result"
npx jest tests/pilot-compat-lifecycle.test.js --runInBand --watchman=false > /tmp/ds-aviso-shallow-green.txt 2>&1
green_result=$?
echo "green_exit=$green_result"
cat /tmp/ds-aviso-shallow-green.txt
exit "$green_result"
```

Retorno:0. Saída:

```text
true
fatal: path 'examples/pilot.html' exists on disk, but not in '64a26656170ae506f3bb4c05647c5f3c63c43177'
base_lookup_exit=128
green_exit=0
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.331 s, estimated 1 s
Ran all test suites matching tests/pilot-compat-lifecycle.test.js.
```

O JSON do filho também é sintético nesse teste de fronteira: ele verifica a espera de
close e a leitura completa, não a conformidade real de 110 casos. A prova manual de
compatibilidade anterior registrada separadamente continua exigindo a fonte fixada.
Não foram alterados workflow, fetch-depth, medidor ou fonte visual. CI novo necessário.

Suíte completa executada no MESMO clone raso, depois da correção:

```sh
npm test -- --runInBand --watchman=false > /tmp/ds-aviso-shallow-full.txt 2>&1
full_result=$?
echo "test_exit=$full_result"
tail -6 /tmp/ds-aviso-shallow-full.txt
exit "$full_result"
```

Retorno:0. Saída:

```text
test_exit=0

Test Suites: 43 passed, 43 total
Tests:       848 passed, 848 total
Snapshots:   0 total
Time:        28.977 s
Ran all test suites.
```
