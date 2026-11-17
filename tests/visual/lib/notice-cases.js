const assert = require('node:assert/strict');
const { expect } = require('@playwright/test');
const { textContrast, paintedEdge } = require('./contract-probes');
async function edge(page,selector,kind){await page.locator(selector).evaluate(el=>el.scrollIntoView({block:'center'}));await paintedEdge(page,selector,kind);}
const ids = ['notice-warning-action', 'notice-warning-external', 'notice-info', 'notice-loading'];
function validateNotice(model) {
  assert.ok(model.title && model.nextStep, 'Fato e próximo passo são obrigatórios');
  assert.ok(!/^(Atenção|Info|Informação)$/i.test(model.title), 'Título específico obrigatório');
  assert.ok(!model.technicalNodes && !/\b(DTO|UUID|HTTP|SQL|payload)\b/i.test(model.title + ' ' + model.nextStep + ' ' + (model.consequence || '') + ' ' + (model.detail || '')), 'Texto humano, sem código ou identificador');
  assert.ok((model.consequence || '').split(/[.!?]+/).filter(s => s.trim()).length <= 1, 'Consequência em uma frase opcional');
  assert.ok(['here','elsewhere'].includes(model.location) && typeof model.permitted === 'boolean', 'Cenário da vitrine deve declarar local e permissão explicitamente');
  const required = model.location === 'here' && model.permitted;
  assert.equal(model.actions.length, required ? 1 : 0, required ? 'Ação local permitida é obrigatória' : 'Ação indevida deve estar ausente');
  for (const action of model.actions) {
    assert.ok(action.name, 'Ação tem nome específico');
    assert.ok(!action.disabled || action.busy, 'Sem ação desativada decorativa');
    if (action.tag === 'a') assert.ok(action.href && action.href !== '#', 'Destino nativo real');
  }
}
async function model(page, id) {
  const notice = page.locator('#' + id);
  await expect(notice).toHaveCount(1);
  return notice.evaluate(el => ({
    title: el.querySelector('.rx-notice__title')?.textContent.trim(),
    consequence: [...el.children].find(n => n.classList.contains('rx-notice__text') && n.getAttribute('role') !== 'status')?.textContent.trim(),
    nextStep: el.querySelector('.rx-notice__next-step')?.textContent.trim(),
    technicalNodes: el.querySelectorAll('pre,code').length,
    detail: [...el.querySelectorAll('details')].map(d => [...d.children].map(n => n.textContent.trim()).join(' ')).join(' '),
    location: el.dataset.rxStepLocation, permitted: el.dataset.rxActionPermitted === 'true' ? true : el.dataset.rxActionPermitted === 'false' ? false : undefined,
    actions: [...el.querySelectorAll('a,button')].map(a => ({ tag: a.tagName.toLowerCase(), name: (a.getAttribute('aria-label') || a.textContent).trim(), href: a.getAttribute('href'), disabled: a.disabled || a.getAttribute('aria-disabled') === 'true', busy: a.getAttribute('aria-busy') === 'true' }))
  }));
}
const checks = {
  'notice-content': async p => { for (const id of ids) { validateNotice(await model(p,id)); await expect(p.locator('#' + id + ' .rx-notice__next-step')).toBeVisible(); } },
  'notice-action-policy': async p => { for (const id of ids) validateNotice(await model(p,id)); },
  'notice-semantics': async p => { for (const id of ids) {
    const notice = p.locator('#' + id); await expect(notice).toHaveCount(1);
    expect(await notice.evaluate(el => ({tag:el.tagName,role:el.getAttribute('role'),tab:el.tabIndex,heading:/^H[1-6]$/.test(el.querySelector('.rx-notice__title')?.tagName || '')}))).toEqual({tag:'DIV',role:null,tab:-1,heading:true});
    for (const icon of await notice.locator('svg,[data-icon]').all()) await expect(icon).toHaveAttribute('aria-hidden','true');
  } },
  'notice-announcement': async p => {
    const live = p.locator('#notice-live'); await expect(live).toHaveAttribute('role','status'); await expect(live).toBeEmpty();
    const original = await live.elementHandle(); await p.locator('#notice-destination').focus();
    await live.evaluate(el => { el.textContent='Atualização concluída.'; el.closest('[aria-busy]').setAttribute('aria-busy','false'); });
    expect(await original.evaluate(el => el === document.getElementById('notice-live'))).toBe(true);
    await expect(live).toHaveText('Atualização concluída.'); await expect(p.locator('#notice-destination')).toBeFocused();
  },
  'notice-loading': async p => { await expect(p.locator('#notice-loading')).toHaveAttribute('aria-busy','true'); await expect(p.locator('#notice-loading .rx-notice__next-step')).toBeVisible(); await expect(p.locator('#notice-loading button,#notice-loading a')).toHaveCount(0); },
  'notice-keyboard': async p => {
    const link=p.locator('#notice-warning-action a'); await link.focus(); await p.keyboard.press('Tab'); await p.keyboard.press('Shift+Tab'); await expect(link).toBeFocused(); await edge(p,'#notice-warning-action a','outline');
    await p.keyboard.press('Enter'); await expect(p.locator('#notice-destination')).toBeFocused();
    const summary=p.locator('#notice-warning-external summary');await summary.focus();await p.keyboard.press('Enter');await expect(p.locator('#notice-warning-external details')).toHaveAttribute('open','');await p.keyboard.press('Enter');await expect(p.locator('#notice-warning-external details')).not.toHaveAttribute('open','');
  },
  'notice-contrast': async p => { for (const id of ids) { await textContrast(p,'#'+id+' .rx-notice__title');await textContrast(p,'#'+id+' .rx-notice__next-step');await edge(p,'#'+id,'border'); } },
  'notice-responsive': async p => { for(const width of [390,1440]){await p.setViewportSize({width,height:1000});for(const id of ids){const result=await p.locator('#'+id).evaluate(el=>{const title=el.querySelector('.rx-notice__title'),range=document.createRange();range.selectNodeContents(title);return {lines:range.getClientRects().length,fits:el.scrollWidth<=el.clientWidth,titleFits:title.scrollWidth<=title.clientWidth};});expect(result).toEqual({lines:1,fits:true,titleFits:true});}} },
  'badge-warning-info': async p => {
    const session=await p.context().newCDPSession(p);await session.send('Emulation.setEmulatedVisionDeficiency',{type:'achromatopsia'});
    try {for(const [id,label] of [['badge-warning','Arquivo não recebido'],['badge-info','Atualização recebida']]){await expect(p.locator('#'+id)).toHaveText(label);expect(await p.locator('#'+id).evaluate(el=>el.tabIndex)).toBe(-1);await expect(p.locator('#'+id+' a,#'+id+' button')).toHaveCount(0);}return await p.screenshot({animations:'disabled'});}
    finally{await session.send('Emulation.setEmulatedVisionDeficiency',{type:'none'});await session.detach();}
  },
  'badge-next-step': async p => { const id=await p.locator('#badge-warning').getAttribute('aria-describedby');expect(id).toBeTruthy();await expect(p.locator('#'+id)).toBeVisible();await expect(p.locator('#'+id)).toContainText('Peça o arquivo');await textContrast(p,'#'+id); }
};
module.exports = { checks, validateNotice, model };
