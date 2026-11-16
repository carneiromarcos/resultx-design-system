const {
  guard
} = require('../scripts/catalog/guard.cjs');
test('critério 3 — pacote restrito e pastas protegidas intactas', () => expect(guard()).toMatch('intactas'));
test('npm pack mantém exatamente a lista publicada da base', () => {
  expect(require('../scripts/catalog/guard.cjs').checkPack()).toMatch('idênticos');
}, 30000);
