const fs = require('fs');
const postcss = require('postcss');
const yaml = require('js-yaml');

test('contrato exige navegação nativa e os casos de link para todos os adaptadores', () => {
  const contract = yaml.load(fs.readFileSync('contracts/button.yaml', 'utf8'));
  expect(contract.anatomia.join(' ')).toMatch(/link.*href/i);
  expect(contract.teclado.join(' ')).toMatch(/somente Enter/i);
  expect(contract.aria.join(' ')).toMatch(/aria-disabled=true.*sem href.*tabindex=-1/i);
  expect(contract.casos_teste.map((item) => item.id)).toEqual(expect.arrayContaining([
    'button-link-keyboard', 'button-link-unavailable', 'button-link-contrast',
  ]));
});

test('adaptador não aplica interação de hover ou active a links indisponíveis', () => {
  const css = postcss.parse(fs.readFileSync('adapters/css/pilot.css', 'utf8'));
  const interactive = [];
  css.walkRules((rule) => {
    if (/^\.rx-button(?:--primary)?:(?:hover|active)/.test(rule.selector)) interactive.push(rule.selector);
  });
  expect(interactive).toHaveLength(4);
  for (const selector of interactive) expect(selector).toContain("[aria-disabled='true']");
  const html = fs.readFileSync('examples/pilot.html', 'utf8');
  for (const variant of ['primary', 'secondary', 'danger']) {
    const tag = html.match(new RegExp(`<a\\b[^>]*id="link-unavailable-${variant}"[^>]*>`));
    expect(tag).not.toBeNull();
    expect(tag[0]).toContain('aria-disabled="true"');
    expect(tag[0]).toContain('tabindex="-1"');
    expect(tag[0]).not.toMatch(/\bhref\s*=/);
  }
});
