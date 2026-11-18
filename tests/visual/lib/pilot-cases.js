const { expect } = require('@playwright/test');
const { PNG } = require('pngjs');
const { paintedEdge, paintedFill, controlBoundary, textContrast, descendantTextContrast } = require('./contract-probes');
const { parseCssColor } = require('./css-color');
async function contrast(page, selector, property = 'color') {
  if (property === 'outlineColor') return paintedEdge(page, selector, 'outline');
  if (property === 'borderTopColor') return paintedEdge(page, selector, 'border');
  return textContrast(page, selector);
}
const { modalSemantics, tableHeaders, dialogKeyboard, tableSorting } = require('./behavior-probes');
const visualProperties = ['backgroundColor', 'color', 'borderTopColor', 'borderTopStyle', 'fontWeight'];
const contrastRatio = (a, b) => {
  const luminance = (css) => parseCssColor(css).slice(0, 3).map((v) => v / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
async function compareVisualStates(page, state) {
  const styles = (el, props) => Object.fromEntries(props.map((prop) => [prop, getComputedStyle(el)[prop]]));
  const reference = await page.locator('#button-unavailable-primary').evaluate(styles, visualProperties);
  for (const tag of ['button', 'link']) for (const variant of ['primary', 'secondary', 'danger']) {
    const available = tag === 'button' ? { primary: '#primary', secondary: '#secondary', danger: '#state-available-danger' }[variant] : `#link-${variant}`;
    const unavailable = `#${tag}-unavailable-${variant}`;
    const loading = tag === 'link' && variant === 'primary' ? '#link-loading' : `#${tag}-loading-${variant}`;
    const target = state === 'loading' ? loading : unavailable;
    if (tag === 'button') await expect(page.locator(target)).toBeDisabled();
    else {
      await expect(page.locator(target)).toHaveAttribute('aria-disabled', 'true');
      await expect(page.locator(target)).not.toHaveAttribute('href');
      await expect(page.locator(target)).toHaveAttribute('tabindex', '-1');
    }
    const current = await page.locator(target).evaluate(styles, visualProperties);
    const normal = await page.locator(available).evaluate(styles, visualProperties);
    expect(visualProperties.slice(0, 4).filter((prop) => current[prop] !== normal[prop]).length, `${target} deve diferir em duas propriedades`).toBeGreaterThanOrEqual(2);
    await textContrast(page, target);
    if (state === 'loading') {
      expect(current.borderTopStyle).toBe('solid');
      expect(await page.locator(target).evaluate((el) => getComputedStyle(el).cursor)).toBe('progress');
      await controlBoundary(page, target);
      await expect(page.locator(target)).toHaveAttribute('aria-busy', 'true');
      expect((await page.locator(target).textContent()).trim()).toMatch(/(?:ando|endo|indo)(?:\s|…|$)/i);
      const disabled = await page.locator(unavailable).evaluate(styles, visualProperties);
      expect(current).not.toEqual(disabled);
    } else {
      expect(current.borderTopStyle).toBe('dashed');
      expect(current, `${target}: aparência neutra comum`).toEqual(reference);
    }
  }
}
const checks = {
  'button-unavailable-visual': async (p) => compareVisualStates(p, 'unavailable'),
  'button-loading-visual': async (p) => compareVisualStates(p, 'loading'),
  'button-link-keyboard': async (p) => {
    for (const [variant, name, previous] of [
      ['primary', 'Abrir vaga', '#link-secondary'],
      ['secondary', 'Ver filtros', '#link-primary'],
      ['danger', 'Ver exclusão', '#link-secondary'],
    ]) {
      const link = p.locator(`#link-${variant}`);
      await expect(link).toHaveAttribute('href', '#link-destination');
      await expect(link).toHaveAccessibleName(name);
      expect(await link.locator('a, button, input, select, textarea, [tabindex]').count()).toBe(0);
      expect(await link.evaluate((e) => Boolean(e.parentElement.closest('a, button, input, select, textarea, [tabindex]')))).toBe(false);
      await p.locator(previous).focus();
      await p.keyboard.press(variant === 'primary' ? 'Shift+Tab' : 'Tab');
      await expect(link).toBeFocused();
      await p.keyboard.press('Space');
      await expect.poll(() => new URL(p.url()).hash).toBe('');
      await p.keyboard.press('Enter');
      await expect.poll(() => new URL(p.url()).hash).toBe('#link-destination');
      await p.evaluate(() => history.replaceState(null, '', location.pathname + location.search));
    }
  },
  'button-link-unavailable': async (p) => {
    for (const variant of ['primary', 'secondary', 'danger']) {
      const link = p.locator(`#link-unavailable-${variant}`);
      await expect(link).toHaveAttribute('aria-disabled', 'true');
      await expect(link).not.toHaveAttribute('href');
      await expect(link).toHaveAttribute('tabindex', '-1');
      await expect(link).toHaveAccessibleName(/Abrir vaga|Ver filtros|Ver exclusão/);
      const before = await link.evaluate((e) => getComputedStyle(e).backgroundColor);
      await link.hover();
      expect(await link.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(before);
      await p.mouse.down();
      try { expect(await link.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(before); }
      finally { await p.mouse.up(); }
    }
    await p.locator('#link-danger').focus();
    await p.keyboard.press('Tab');
    for (const variant of ['primary', 'secondary', 'danger']) await expect(p.locator(`#link-unavailable-${variant}`)).not.toBeFocused();
    const loading = p.locator('#link-loading');
    await expect(loading).toHaveAttribute('aria-busy', 'true');
    await expect(loading).toHaveAttribute('aria-disabled', 'true');
    await expect(loading).not.toHaveAttribute('href');
    await expect(loading).toHaveAttribute('tabindex', '-1');
    await expect(loading).not.toBeFocused();
  },
  'button-link-contrast': async (p) => {
    for (const selector of ['#link-primary', '#link-secondary', '#link-danger']) {
      const el = p.locator(selector);
      const native = p.locator({ '#link-primary': '#primary', '#link-secondary': '#secondary', '#link-danger': '#confirm-action' }[selector]);
      const properties = ['display', 'boxSizing', 'lineHeight', 'paddingTop', 'paddingRight', 'borderTopWidth', 'alignItems'];
      const styles = (node, props) => props.map((property) => getComputedStyle(node)[property]);
      expect(await el.evaluate(styles, properties)).toEqual(await native.evaluate(styles, properties));
      await el.scrollIntoViewIfNeeded();
      await expect(el).toHaveCSS('text-decoration-line', 'none');
      await expect(el).toHaveCSS('display', 'inline-block');
      await p.mouse.move(0, 0);
      for (const state of ['normal', 'hover', 'active']) {
        if (state !== 'normal') await el.hover();
        if (state === 'active') await p.mouse.down();
        try { await controlBoundary(p, selector); await textContrast(p, selector); }
        finally { if (state === 'active') await p.mouse.up(); }
      }
      await el.focus();
      await p.keyboard.press('Tab');
      await p.keyboard.press('Shift+Tab');
      await expect(el).toBeFocused();
      await paintedEdge(p, selector, 'outline');
    }
    const primary = await p.locator('#link-primary').evaluate((e) => getComputedStyle(e).backgroundColor);
    const secondary = await p.locator('#link-secondary').evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(primary).not.toBe(secondary);
    await paintedFill(p, '#link-primary');
  },
  'button-accessible': async (p) => expect(p.getByRole('button', { name: 'Publicar vaga' }).first()).toBeVisible(),
  'button-disabled': async (p) => { const b = p.locator('#disabled'); await expect(b).toBeDisabled(); expect(await b.evaluate((el) => { let count = 0; el.addEventListener('click', () => count++); el.click(); return count; })).toBe(0); },
  'button-loading': async (p) => { await expect(p.locator('#loading-button')).toBeDisabled(); await expect(p.locator('#loading-button')).toHaveAttribute('aria-busy', 'true'); },
  'button-keyboard': async (p) => { const el = p.locator('#primary'); await el.focus(); await p.keyboard.press('Tab'); await expect(p.locator('#secondary')).toBeFocused(); await p.keyboard.press('Shift+Tab'); await expect(el).toBeFocused(); await contrast(p, '#primary', 'outlineColor', 3); await el.evaluate((e) => e.addEventListener('click', () => { e.dataset.clicks = String(Number(e.dataset.clicks || 0) + 1); })); await p.keyboard.press('Enter'); await p.keyboard.press('Space'); await expect.poll(() => el.evaluate((e) => Number(e.dataset.clicks))).toBe(2); },
  'button-contrast': async (p) => {
    for (const selector of ['#primary', '#secondary', '#confirm-action']) {
      if (selector === '#confirm-action') await p.locator('#open-dialog').click();
      const el = p.locator(selector);
      await p.mouse.move(0, 0);
      for (const state of ['normal', 'hover', 'active']) {
        if (state !== 'normal') await el.hover();
        if (state === 'active') await p.mouse.down();
        try {
          await controlBoundary(p, selector);
          await textContrast(p, selector);
          {
            const primary = await p.locator('#primary').evaluate((e) => getComputedStyle(e).backgroundColor);
            const secondary = await p.locator('#secondary').evaluate((e) => getComputedStyle(e).backgroundColor);
            expect(primary, `primary diferente de secondary em ${state}`).not.toBe(secondary);
          }
        }
        finally { if (state === 'active') await p.mouse.up(); }
      }
      if (selector === '#confirm-action') await p.keyboard.press('Escape');
    }
    await p.locator('#primary').focus();
    await paintedEdge(p, '#primary', 'outline');
    await controlBoundary(p, '#primary');
    const neutral = await p.locator('#primary').evaluate((e) => ({ border: getComputedStyle(e).borderTopColor, color: getComputedStyle(e).getPropertyValue('--text-secondary').trim() }));
    const expected = await p.locator('#primary').evaluate((e) => { const t = document.createElement('span'); t.style.color = 'var(--text-secondary)'; e.appendChild(t); const c = getComputedStyle(t).color; t.remove(); return c; });
    expect(neutral.border).toBe(expected);
  },
  'button-variant-hierarchy': async (p) => {
    const primary = await p.locator('#primary').evaluate((e) => ({ background: getComputedStyle(e).backgroundColor, parent: getComputedStyle(e.parentElement).backgroundColor }));
    const secondary = await p.locator('#secondary').evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(primary.background, 'Primary deve ter preenchimento diferente de secondary').not.toBe(secondary);
    expect(primary.background, 'Primary deve ter preenchimento diferente do entorno').not.toBe(primary.parent);
    await paintedFill(p, '#primary');
    await textContrast(p, '#primary');
  },
  'field-label': async (p) => expect(p.getByLabel('Buscar candidato')).toBeVisible(),
  'field-error': async (p) => {
    for (const [control, message] of [['#invalid', '#invalid-message'], ['#invalid-select', '#invalid-select-message'], ['#invalid-textarea', '#invalid-textarea-message']]) {
      await expect(p.locator(control)).toHaveAttribute('aria-invalid', 'true');
      await expect(p.locator(control)).toHaveAttribute('aria-describedby', message.slice(1));
      await expect(p.locator(message)).toBeVisible();
      await expect(p.locator(message).locator('[aria-hidden="true"]')).toBeVisible();
    }
    await expect(p.locator('#invalid-message')).toContainText('válido');
    await expect(p.locator('#invalid-select-message')).toContainText('Selecione');
    await expect(p.locator('#invalid-textarea-message')).toContainText('Informe');
    await p.locator('#search').focus();
    const normalRing = await p.locator('#search').evaluate((el) => getComputedStyle(el).outlineColor);
    for (const control of ['#invalid', '#invalid-select', '#invalid-textarea']) {
      await p.locator(control).focus();
      await expect(p.locator(control)).toBeFocused();
      const errorRing = await p.locator(control).evaluate((el) => getComputedStyle(el).outlineColor);
      expect(errorRing).toBe(normalRing);
      await paintedEdge(p, control, 'outline');
    }
  },
  'field-select': async (p) => {
    const select = p.getByLabel('Status do perfil');
    await expect(select).toBeVisible();
    expect(await select.evaluate((el) => el.tagName)).toBe('SELECT');
    for (const selector of ['#profile-status', '#invalid-select']) {
      const geometry = await p.locator(selector).evaluate((el) => {
        const wrapper = el.closest('.rx-field__select-wrap');
        const selectBox = el.getBoundingClientRect();
        const wrapperBox = wrapper.getBoundingClientRect();
        const arrow = getComputedStyle(wrapper, '::after');
        const arrowWidth = parseFloat(arrow.width);
        const arrowRightInset = parseFloat(arrow.right);
        const arrowRight = wrapperBox.right - arrowRightInset;
        return {
          selectLeft: selectBox.left,
          selectRight: selectBox.right,
          selectWidth: selectBox.width,
          wrapperLeft: wrapperBox.left,
          wrapperRight: wrapperBox.right,
          wrapperWidth: wrapperBox.width,
          arrowLeft: arrowRight - arrowWidth,
          arrowRight,
          arrowRightInset,
          arrowWidth,
          paddingRight: parseFloat(getComputedStyle(el).paddingRight),
        };
      });
      expect(Math.abs(geometry.selectWidth - geometry.wrapperWidth), `${selector}: select ocupa a largura do wrapper`).toBeLessThan(1);
      expect(Math.abs(geometry.selectLeft - geometry.wrapperLeft), `${selector}: select começa no wrapper`).toBeLessThan(1);
      expect(geometry.arrowLeft, `${selector}: chevron dentro do select à esquerda`).toBeGreaterThanOrEqual(geometry.selectLeft);
      expect(geometry.arrowRight, `${selector}: chevron dentro do select à direita`).toBeLessThanOrEqual(geometry.selectRight);
      expect(geometry.paddingRight, `${selector}: padding reserva espaço para o chevron`).toBeGreaterThanOrEqual(geometry.arrowWidth + geometry.arrowRightInset);
    }
    await select.focus();
    await contrast(p, '#profile-status', 'outlineColor');
    await select.selectOption('active');
    await expect(select).toHaveValue('active');
    await expect(select).toHaveAttribute('aria-describedby', 'profile-status-help');
  },
  'field-select2-skin': async (p) => {
    const native = await p.locator('#profile-status').evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        borderTopColor: style.borderTopColor,
        borderTopStyle: style.borderTopStyle,
        borderTopWidth: style.borderTopWidth,
        borderRadius: style.borderRadius,
        backgroundColor: style.backgroundColor,
        padding: style.padding,
      };
    });
    for (const selector of ['#select2-selection-single', '#select2-selection-multiple']) {
      const selection = p.locator(selector);
      await selection.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center' }));
      await expect(selection).toBeVisible();
      const computed = await selection.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          borderTopColor: style.borderTopColor,
          borderTopStyle: style.borderTopStyle,
          borderTopWidth: style.borderTopWidth,
          borderRadius: style.borderRadius,
          backgroundColor: style.backgroundColor,
          padding: style.padding,
        };
      });
      expect(computed).toEqual(native);
      await controlBoundary(p, selector);
    }
  },
  'field-textarea': async (p) => {
    const textarea = p.getByLabel('Observações');
    await expect(textarea).toBeVisible();
    expect(await textarea.evaluate((el) => getComputedStyle(el).resize)).toBe('vertical');
    expect(await textarea.evaluate((el) => parseFloat(getComputedStyle(el).minHeight))).toBeGreaterThan(80);
    await textarea.focus();
    await contrast(p, '#profile-notes', 'outlineColor');
    await textarea.fill('Observação de exemplo.');
    await expect(textarea).toHaveValue('Observação de exemplo.');
  },
  'field-inputmode-numeric': async (p) => {
    const input = p.locator('#numeric-code');
    await expect(input).toHaveAttribute('inputmode', 'numeric');
    await expect(input).toHaveAttribute('type', 'text');
    await input.fill('12345');
    await expect(input).toHaveValue('12345');
  },
  'field-inputmode-money': async (p) => {
    const input = p.locator('#amount');
    await expect(input).toHaveAttribute('inputmode', 'decimal');
    await expect(input).toHaveAttribute('type', 'text');
    await input.fill('125,50');
    await expect(input).toHaveValue('125,50');
  },
  'field-empty': async (p) => { await expect(p.locator('#search')).toHaveValue(''); expect(await p.locator('#search').evaluate((e) => e.validity.valid)).toBe(true); },
  'field-loading': async (p) => { await expect(p.locator('#field-loading')).toHaveAttribute('aria-busy', 'true'); await expect(p.locator('#loading-field')).toBeDisabled(); },
  'field-disabled': async (p) => expect(p.locator('#disabled-field')).toBeDisabled(),
  'field-keyboard': async (p) => { await p.locator('#primary').focus(); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await expect(p.locator('#search')).toBeFocused(); await p.keyboard.type('Ana'); await expect(p.locator('#search')).toHaveValue('Ana'); await contrast(p, '#search', 'outlineColor', 3); },
  'field-contrast': async (p) => { for (const s of ['#search', '#invalid', '#disabled-field', '#profile-status', '#profile-notes', '#numeric-code', '#amount', '#invalid-select', '#invalid-textarea']) { await contrast(p, s); await contrast(p, s, 'borderTopColor', 3); } },
  'card-heading': async (p) => expect(p.locator('#card').getByRole('heading', { name: 'Vagas recentes', level: 2 })).toBeVisible(),
  'card-sizes': async (p) => { const sizes = []; for (const id of ['sm', 'md', 'lg']) sizes.push(await p.locator(`#card-${id}`).evaluate((e) => parseFloat(getComputedStyle(e).paddingTop))); expect(sizes[0]).toBeLessThan(sizes[1]); expect(sizes[1]).toBeLessThan(sizes[2]); },
  'card-empty-error': async (p) => { await expect(p.locator('#card-empty button')).toBeVisible(); await expect(p.locator('#card-error [role=alert]')).toContainText('Tente novamente'); },
  'card-keyboard': async (p) => { await p.locator('#card button:not(:disabled)').focus(); await expect(p.locator('#card button:not(:disabled)')).toBeFocused(); await contrast(p, '#card button:not(:disabled)', 'outlineColor', 3); },
  'card-disabled': async (p) => expect(p.locator('#card-disabled')).toBeDisabled(),
  'card-loading': async (p) => expect(p.locator('#card-loading')).toHaveAttribute('aria-busy', 'true'),
  'card-shadow': async (p) => expect(await p.locator('#card').evaluate((e) => getComputedStyle(e).boxShadow)).toBe('none'),
  'card-contrast': async (p) => { for (const s of ['#card', '#card-sm', '#card-md', '#card-lg', '#card-empty', '#card-error', '#card-loading']) await descendantTextContrast(p, s); },
  'stat-value': async (p) => { await expect(p.locator('#stat [data-part=value]')).toHaveText('42'); expect(await p.locator('#stat [data-part=value]').evaluate((e) => getComputedStyle(e).fontVariantNumeric)).toContain('tabular-nums'); },
  'stat-empty': async (p) => expect(p.locator('#stat-empty [data-part=value]')).toHaveText('—'),
  'stat-loading': async (p) => expect(p.locator('#stat-loading')).toHaveAttribute('aria-busy', 'true'),
  'stat-error': async (p) => { await expect(p.locator('#stat-error p')).toContainText('Não foi possível'); await expect(p.locator('#stat-error button')).toBeVisible(); await expect(p.locator('#stat-error button')).toHaveText('Tentar novamente'); },
  'stat-link': async (p) => { const a = p.locator('#stat-link a'); await a.focus(); await expect(a).toBeFocused(); await paintedEdge(p, '#stat-link a', 'outline'); await p.keyboard.press('Enter'); await expect.poll(() => new URL(p.url()).hash).toBe('#table'); },
  'stat-contrast': async (p) => { for (const s of ['#stat', '#stat-empty', '#stat-loading', '#stat-error', '#stat-link']) await descendantTextContrast(p, s); },
  'table-semantics': async (p) => { await expect(p.getByRole('table', { name: 'Candidatos à vaga' })).toBeVisible(); await tableHeaders(p); },
  'table-sorting': tableSorting,
  'table-empty-error': async (p) => { await expect(p.locator('#table-empty button')).toBeVisible(); await expect(p.locator('#table-error')).toHaveAttribute('role', 'alert'); await expect(p.locator('#table-error button')).toBeVisible(); },
  'table-disabled': async (p) => expect(p.locator('#table-disabled')).toBeDisabled(),
  'table-focus': async (p) => { await p.locator('#sort').focus(); await expect(p.locator('#sort')).toBeFocused(); await contrast(p, '#sort', 'outlineColor', 3); },
  'table-loading': async (p) => expect(p.locator('#table-loading')).toHaveAttribute('aria-busy', 'true'),
  'table-contrast': async (p) => { await p.addStyleTag({ content: '@layer components { caption { color: #6c757e; } }' }); await textContrast(p, '#table caption'); for (const s of ['#table', '#table-loading', '#table-empty', '#table-error']) await descendantTextContrast(p, s); },
  'dialog-closed': async (p) => expect(p.locator('#confirm')).toBeHidden(),
  'dialog-loading-error': async (p) => { await p.locator('#open-dialog').click(); const dialog = p.locator('#confirm'), confirm = p.locator('#confirm-action'), err = p.locator('#dialog-error'); await confirm.click(); await expect(dialog).toHaveAttribute('aria-busy', 'true'); await expect(confirm).toBeDisabled(); await expect(p.locator('#dialog-loading')).toBeVisible(); await expect(err).toHaveAttribute('role', 'alert'); await expect(err).toBeVisible(); await expect(err).toContainText('Tente novamente'); await expect(confirm).toBeEnabled(); },
  'dialog-confirm': async (p) => { await p.locator('#open-dialog').click(); await p.locator('#confirm-action').click(); await expect(p.locator('#dialog-error')).toBeVisible(); await p.locator('#confirm-action').click(); await expect(p.locator('#confirm')).toBeHidden(); expect(await p.locator('#confirm').evaluate((e) => e.returnValue)).toBe('confirmed'); await expect(p.locator('#open-dialog')).toBeFocused(); },
  'dialog-semantics': async (p) => { await p.locator('#open-dialog').click(); await modalSemantics(p); },
  'dialog-keyboard': dialogKeyboard,
  'dialog-contrast': async (p) => { await p.locator('#open-dialog').click(); await contrast(p, '#confirm'); await contrast(p, '#confirm-action'); await contrast(p, '#confirm-action', 'borderTopColor', 3); await p.locator('#confirm-action').hover(); await contrast(p, '#confirm-action'); },
  'badge-semantics': async (p) => { await expect(p.locator('#badge-neutral')).toBeVisible(); expect(await p.locator('#badge-neutral').evaluate((e) => e.tabIndex)).toBe(-1); },
  'badge-variants': async (p) => { for (const name of ['Pendente', 'Aprovado', 'Recusado']) await expect(p.getByText(name, { exact: true }).first()).toBeVisible(); },
  'badge-loading': async (p) => { await expect(p.locator('#badge-loading')).toHaveAttribute('aria-busy', 'true'); await expect(p.locator('#badge-loading')).toContainText('Atualizando'); },
  'badge-empty': async (p) => expect(p.locator('#badge-empty')).toHaveText('Sem status'),
  'badge-contrast': async (p) => { for (const s of ['#badge-neutral', '#badge-success', '#badge-error']) { await contrast(p, s); await contrast(p, s, 'borderTopColor', 3); } },
  'empty-content': async (p) => { await expect(p.locator('#empty h2')).toContainText('Nenhuma'); await expect(p.locator('#empty p')).toContainText('Publique'); await expect(p.locator('#empty button')).toBeVisible(); },
  'error-content': async (p) => { await expect(p.locator('#error')).toHaveAttribute('role', 'alert'); await expect(p.locator('#error button')).toHaveText('Tentar novamente'); },
  'empty-keyboard': async (p) => { await p.locator('#empty button').focus(); await p.keyboard.press('Tab'); await expect(p.locator('#error button')).toBeFocused(); await contrast(p, '#error button', 'outlineColor', 3); const b = p.locator('#error button'); await b.evaluate((e) => e.addEventListener('click', () => { e.dataset.clicks = String(Number(e.dataset.clicks || 0) + 1); })); await p.keyboard.press('Enter'); await p.keyboard.press('Space'); await expect.poll(() => b.evaluate((e) => Number(e.dataset.clicks))).toBe(2); },
  'empty-loading': async (p) => { await expect(p.locator('#empty-loading')).toHaveAttribute('aria-busy', 'true'); await expect(p.locator('#empty-loading button')).toBeDisabled(); },
  'empty-contrast': async (p) => { await contrast(p, '#empty'); await contrast(p, '#error'); },
  'choice-group': async (p) => {
    const checkboxGroup = p.getByRole('group', { name: 'Canais de contato' });
    const radioGroup = p.getByRole('group', { name: 'Frequência dos avisos' });
    await expect(checkboxGroup.getByLabel('Receber novidades por e-mail')).toBeVisible();
    await expect(radioGroup.getByLabel('Semanal')).toBeVisible();
    await expect(radioGroup.getByLabel('Mensal')).toBeVisible();
    for (const selector of ['#choice-checkbox-control', '#choice-radio-weekly', '#choice-radio-monthly', '#choice-switch-control']) {
      const input = p.locator(selector);
      expect(await input.evaluate((el) => el.labels?.length)).toBeGreaterThan(0);
      const label = p.locator(`label[for="${selector.slice(1)}"]`);
      expect(await label.evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    }
  },
  'choice-checked': async (p) => {
    for (const [input, mark] of [['#choice-checkbox-selected-control', '#choice-checkbox-selected-mark'], ['#choice-radio-selected-control', '#choice-radio-selected-mark'], ['#choice-switch-selected-control', '#choice-switch-selected-mark']]) {
      await expect(p.locator(input)).toBeChecked();
      const expectedBorder = await p.locator(mark).evaluate((el) => { const probe = document.createElement('span'); probe.style.color = 'var(--text-muted)'; document.body.append(probe); const color = getComputedStyle(probe).color; probe.remove(); return color; });
      await expect(p.locator(mark)).toHaveCSS('border-top-color', expectedBorder);
      await controlBoundary(p, mark);
      const colors = await p.locator(mark).evaluate((el) => {
        const s = getComputedStyle(el), after = getComputedStyle(el, '::after');
        return { fill: s.backgroundColor, ink: parseFloat(after.borderRightWidth) > 0 ? after.borderRightColor : after.backgroundColor };
      });
      expect(contrastRatio(colors.ink, colors.fill), `${mark}: marca legível no preenchimento`).toBeGreaterThanOrEqual(4.5);
    }
  },
  'choice-switch': async (p) => {
    const sw = p.locator('#choice-switch-control');
    await expect(sw).toHaveAccessibleName('Receber avisos por e-mail');
    await expect(sw).toHaveAttribute('type', 'checkbox');
    await expect(sw).not.toHaveAttribute('aria-label');
    await expect(p.locator('#choice-switch-label')).not.toContainText(/ligado|desligado/i);
    await expect(sw).not.toBeChecked();
    await p.locator('label[for="choice-switch-control"]').click();
    await expect(sw).toBeChecked();
  },
  'choice-indeterminate': async (p) => {
    const checkbox = p.locator('#choice-checkbox-indeterminate-control');
    await expect(checkbox).toHaveJSProperty('indeterminate', true);
    const mark = p.locator('#choice-checkbox-indeterminate-mark');
    const bar = await mark.evaluate((el) => { const s = getComputedStyle(el, '::after'); return { width: parseFloat(s.width), height: parseFloat(s.height), color: s.backgroundColor, fill: getComputedStyle(el).backgroundColor }; });
    expect(bar.width).toBe(10);
    expect(bar.height).toBe(2);
    expect(contrastRatio(bar.color, bar.fill)).toBeGreaterThanOrEqual(4.5);
    await mark.scrollIntoViewIfNeeded();
    const box = await mark.boundingBox();
    const png = PNG.sync.read(await p.screenshot({ animations: 'disabled' }));
    const sample = (x, y) => [...png.data.subarray((png.width * Math.floor(y) + Math.floor(x)) * 4, (png.width * Math.floor(y) + Math.floor(x)) * 4 + 3)];
    const center = sample(box.x + box.width / 2, box.y + box.height / 2);
    const adjacent = sample(box.x + box.width / 2 + 6, box.y + box.height / 2);
    expect(center).not.toEqual(adjacent);
    expect(contrastRatio(`rgb(${center.join(',')})`, `rgb(${adjacent.join(',')})`)).toBeGreaterThanOrEqual(4.5);
    await expect(p.locator('#choice-radio-weekly')).not.toHaveJSProperty('indeterminate', true);
    await expect(p.locator('#choice-switch-control')).not.toHaveJSProperty('indeterminate', true);
  },
  'choice-disabled': async (p) => {
    const checkbox = p.locator('#choice-checkbox-disabled-control');
    const mark = p.locator('#choice-checkbox-disabled-mark');
    await expect(checkbox).toBeDisabled();
    await expect(checkbox).toBeChecked();
    const initial = await checkbox.isChecked();
    await checkbox.evaluate((el) => el.click());
    expect(await checkbox.isChecked()).toBe(initial);
    const style = await mark.evaluate((el) => {
      const pseudo = getComputedStyle(el, '::after');
      return { background: getComputedStyle(el).backgroundColor, opacity: getComputedStyle(el).opacity,
        ink: pseudo.borderInlineEndColor, lowerInk: pseudo.borderBlockEndColor, glyphFill: pseudo.backgroundColor };
    });
    const muted = await mark.evaluate((el) => { const probe = document.createElement('span'); probe.style.color = 'var(--text-muted)'; document.body.append(probe); const color = getComputedStyle(probe).color; probe.remove(); return color; });
    const surface = await mark.evaluate((el) => { const probe = document.createElement('span'); probe.style.backgroundColor = 'var(--bg-surface-2)'; document.body.append(probe); const color = getComputedStyle(probe).backgroundColor; probe.remove(); return color; });
    expect(style.opacity).toBe('1');
    expect(style.background).toBe(surface);
    expect(style.ink).toBe(muted);
    expect(style.lowerInk).toBe(style.ink);
    expect(style.glyphFill).toBe('rgba(0, 0, 0, 0)');
    await controlBoundary(p, '#choice-checkbox-disabled-mark');

    await checkbox.evaluate((el) => { el.checked = false; el.indeterminate = true; });
    const partial = await mark.evaluate((el) => ({ background: getComputedStyle(el).backgroundColor,
      glyph: getComputedStyle(el, '::after').backgroundColor, width: getComputedStyle(el, '::after').width,
      height: getComputedStyle(el, '::after').height, opacity: getComputedStyle(el).opacity }));
    expect(partial.background).toBe(surface);
    expect(partial.glyph).toBe(muted);
    expect(partial.width).toBe('10px');
    expect(partial.height).toBe('2px');
    expect(partial.opacity).toBe('1');

    const sw = p.locator('#choice-switch-control');
    const knob = p.locator('#choice-switch-mark');
    await sw.evaluate((el) => { el.disabled = true; el.indeterminate = false; });
    await p.addStyleTag({ content: '@layer components { .rx-choice__control:disabled + .rx-choice__mark--switch::after { background: var(--text-inverse); } }' });
    const before = await knob.evaluate((el) => getComputedStyle(el, '::after').backgroundColor);
    await sw.evaluate((el) => { el.indeterminate = true; });
    await expect(sw).toHaveJSProperty('indeterminate', true);
    const after = await knob.evaluate((el) => {
      const s = getComputedStyle(el, '::after');
      return { color: s.backgroundColor, width: s.width, height: s.height, radius: s.borderRadius };
    });
    expect(after.color).toBe(before);
    expect(after.width).toBe('20px');
    expect(after.height).toBe('20px');
    expect(after.radius).toBe('50%');
  },
  'choice-error': async (p) => {
    const input = p.locator('#choice-checkbox-error-control');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAttribute('aria-describedby', 'choice-checkbox-error-message');
    await expect(p.locator('#choice-checkbox-error-message')).toContainText('Confirme sua preferência');
    await textContrast(p, '#choice-checkbox-error-message');
    const errorSpacing = await p.locator('#choice-checkbox-error-message').evaluate((el) => {
      const mark = document.querySelector('#choice-checkbox-error-mark'),
        label = document.querySelector('label[for="choice-checkbox-error-control"]');
      return { gap: el.getBoundingClientRect().top - mark.getBoundingClientRect().bottom,
        targetHeight: label.getBoundingClientRect().height };
    });
    expect(errorSpacing.targetHeight).toBeGreaterThanOrEqual(44);
    expect(errorSpacing.gap).toBeLessThanOrEqual(22);
    await input.focus();
    const fieldErrorRing = await p.locator('#invalid').evaluate((el) => { el.focus(); return getComputedStyle(el).outlineColor; });
    await input.focus();
    const errorMark = p.locator('#choice-checkbox-error-mark');
    await expect(errorMark).toHaveCSS('outline-color', fieldErrorRing);
    await expect(errorMark).toHaveCSS('outline-style', 'solid');
    expect(parseFloat(await errorMark.evaluate((el) => getComputedStyle(el).outlineWidth))).toBeGreaterThanOrEqual(1);
    await paintedEdge(p, '#choice-checkbox-error-mark', 'outline');
  },
  'choice-keyboard': async (p) => {
    const checkbox = p.locator('#choice-checkbox-control');
    await checkbox.focus();
    await p.keyboard.press('Space');
    await expect(checkbox).toBeChecked();
    const sw = p.locator('#choice-switch-control');
    await sw.focus();
    await p.keyboard.press('Space');
    await expect(sw).toBeChecked();
    const radio = p.locator('#choice-radio-weekly');
    await radio.focus();
    await p.keyboard.press('ArrowDown');
    await expect(p.locator('#choice-radio-monthly')).toBeChecked();
  },
  'choice-focus': async (p) => {
    await p.locator('#choice-checkbox-control').focus();
    const mark = p.locator('#choice-checkbox-mark');
    await expect(mark).toHaveCSS('outline-style', 'solid');
    expect(parseFloat(await mark.evaluate((el) => getComputedStyle(el).outlineWidth))).toBeGreaterThanOrEqual(1);
    await paintedEdge(p, '#choice-checkbox-mark', 'outline');
  },
  'choice-contrast': async (p) => {
    for (const selector of ['#choice-checkbox-label', '#choice-radio-weekly-label', '#choice-switch-label']) await textContrast(p, selector);
    for (const selector of ['#choice-checkbox-mark', '#choice-radio-weekly-mark', '#choice-switch-mark']) await controlBoundary(p, selector);
    const colors = await p.locator('#choice-checkbox-selected-mark').evaluate((el) => ({ accent: getComputedStyle(el).backgroundColor, inverse: getComputedStyle(el).getPropertyValue('--text-inverse').trim(), ink: getComputedStyle(el, '::after').borderRightColor }));
    const { accent, inverse, ink } = colors;
    const expectedInverse = await p.locator('#choice-checkbox-selected-mark').evaluate((el) => { const probe = document.createElement('span'); probe.style.color = 'var(--text-inverse)'; document.body.append(probe); const color = getComputedStyle(probe).color; probe.remove(); return color; });
    expect(ink).toBe(expectedInverse);
    expect(contrastRatio(ink, accent)).toBeGreaterThanOrEqual(4.5);
    expect(inverse).toBeTruthy();
    await p.locator('html').evaluate((root) => {
      root.dataset.theme = 'sober-dark';
    });
    for (const [selector, property] of [['#choice-checkbox-selected-mark', 'borderRightColor'], ['#choice-switch-selected-mark', 'backgroundColor']]) {
      const sober = await p.locator(selector).evaluate((el, inkProperty) => {
        const style = getComputedStyle(el), pseudo = getComputedStyle(el, '::after'), probe = document.createElement('span');
        probe.style.color = 'var(--text-on-accent)'; document.body.append(probe);
        const expected = getComputedStyle(probe).color; probe.remove();
        return { expected, actual: pseudo[inkProperty], background: style.backgroundColor };
      }, property);
      expect(sober.actual).toBe(sober.expected);
      expect(contrastRatio(sober.actual, sober.background)).toBeGreaterThanOrEqual(4.5);
    }
  },
  'choice-multiline-rtl': async (p) => {
    const label = p.locator('#choice-switch-label');
    const mark = p.locator('#choice-switch-mark');
    await label.evaluate((el) => { el.style.maxWidth = '8rem'; });
    const metrics = await label.evaluate((el) => {
      const mark = el.previousElementSibling;
      const cs = getComputedStyle(mark), lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      return { height: el.getBoundingClientRect().height, top: parseFloat(cs.marginBlockStart), expected: (lineHeight - 24) / 2 };
    });
    expect(metrics.height).toBeGreaterThan(24);
    expect(Math.abs(metrics.top - metrics.expected)).toBeLessThan(1);
    const sw = p.locator('#choice-switch-selected-control'), knob = p.locator('#choice-switch-selected-mark');
    const ltr = await knob.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el, '::after').transform).m41);
    await p.locator('#choice-switch-selected').evaluate((el) => { el.dir = 'rtl'; });
    const rtl = await knob.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el, '::after').transform).m41);
    expect(ltr).toBeGreaterThan(0);
    expect(rtl).toBeLessThan(0);
    expect(await sw.evaluate((el) => getComputedStyle(el.nextElementSibling).insetInlineStart)).toBe('0px');
  },
  'choice-forced-colors': async (p) => {
    await p.emulateMedia({ forcedColors: 'active' });
    const checkbox = p.locator('#choice-checkbox-selected-control');
    const mark = p.locator('#choice-checkbox-selected-mark');
    const colors = await mark.evaluate((el) => ({ adjustment: getComputedStyle(el).forcedColorAdjust, border: getComputedStyle(el).borderTopColor, bg: getComputedStyle(el).backgroundColor, ink: getComputedStyle(el, '::after').borderRightColor }));
    expect(colors.adjustment).toBe('none');
    expect(colors.border).not.toBe('rgba(0, 0, 0, 0)');
    expect(colors.bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(colors.ink).not.toBe('rgba(0, 0, 0, 0)');
    await expect(checkbox).toBeChecked();
    await controlBoundary(p, '#choice-checkbox-selected-mark');
  },
};


module.exports = { checks };
