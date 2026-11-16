const http = require('http');
const {revisionInfo} = require('../scripts/catalog/revision.cjs');
const {closeServer} = require('../scripts/catalog/test-server.cjs');
test('revisão vem do ambiente CI sem chamar git', () => {
  const sha = 'a'.repeat(40);
  expect(revisionInfo({env: {GITHUB_SHA: sha}})).toEqual({label: sha, ref: sha});
});
test('revisão explícita tem precedência e entradas inválidas são recusadas', () => {
  const sha = 'b'.repeat(40);
  expect(revisionInfo({revision:sha,env:{GITHUB_SHA:'a'.repeat(40)}}).ref).toBe(sha);
  expect(() => revisionInfo({revision:'../invalido',env:{}})).toThrow('SHA completo');
});
test('fallback local é determinístico e não publica link com SHA inventado', () => {
  const a = revisionInfo({env:{}}), b = revisionInfo({env:{}});
  expect(a).toEqual(b); expect(a.label).toMatch(/^geração local [a-f0-9]{16}$/); expect(a.ref).toBe('main');
});
test('encerramento seguro antes da criação e depois de fechar o servidor', async () => {
  await expect(closeServer(undefined)).resolves.toBeUndefined();
  const server = http.createServer();
  await closeServer(server);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  await closeServer(server); await closeServer(server);
  expect(server.listening).toBe(false);
});
