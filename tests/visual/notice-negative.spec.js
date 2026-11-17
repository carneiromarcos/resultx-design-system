const {test,expect}=require('@playwright/test');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const {checks}=require('./lib/notice-cases');
const {declarations,enabled}=require('./lib/contract-capabilities');
test.beforeEach(async({page})=>{await page.goto(pathToFileURL(path.resolve('examples/pilot.html')).href);});
test('ação local permitida removida é rejeitada',async({page})=>{await page.locator('#notice-warning-action a').evaluate(e=>e.remove());await expect(checks['notice-action-policy'](page)).rejects.toThrow('Ação local permitida é obrigatória');});
test('ação indevida desativada também é rejeitada',async({page})=>{await page.locator('#notice-warning-external').evaluate(e=>{const b=document.createElement('button');b.disabled=true;b.textContent='Enviar arquivo';e.append(b);});await expect(checks['notice-action-policy'](page)).rejects.toThrow('Ação indevida deve estar ausente');});
test('próximo passo ausente é rejeitado',async({page})=>{await page.locator('#notice-info .rx-notice__next-step').evaluate(e=>e.remove());await expect(checks['notice-content'](page)).rejects.toThrow('Fato e próximo passo');});
test('texto técnico no aviso é rejeitado',async({page})=>{await page.locator('#notice-info .rx-notice__title').evaluate(e=>e.textContent='HTTP 500');await expect(checks['notice-content'](page)).rejects.toThrow('Texto humano');});
test('vitrine sem declaração não ganha obrigações novas',async({page})=>{await page.locator('[data-rx-contracts]').evaluateAll(nodes=>nodes.forEach(e=>e.removeAttribute('data-rx-contracts')));const d=await declarations(page);expect(enabled('notice-content',d)).toBe(false);expect(enabled('badge-warning-info',d)).toBe(false);expect(enabled('badge-variants',d)).toBe(true);});

test('cenário sem declaração de local não passa por orientação externa implicitamente',async({page})=>{await page.locator('#notice-info').evaluate(e=>e.removeAttribute('data-rx-step-location'));await expect(checks['notice-content'](page)).rejects.toThrow('Cenário da vitrine');});
test('detalhe recolhido não pode esconder log técnico',async({page})=>{await page.locator('#notice-warning-external details p').evaluate(e=>e.textContent='HTTP 500: falha na requisição');await expect(checks['notice-content'](page)).rejects.toThrow('Texto humano');});
