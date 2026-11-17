// New obligations are explicit opt-ins. A skipped obligation is not conformity.
const STATUS_DECLARATION = 'status-badge-warning-info';
const requiredDeclaration = id => id.startsWith('notice-') ? 'notice' : ['badge-warning-info', 'badge-next-step'].includes(id) ? STATUS_DECLARATION : null;
const tokens = text => new Set(String(text || '').split(/\s+/).filter(Boolean));
async function declarations(page) {
  return new Set((await page.locator('[data-rx-contracts]').evaluateAll(nodes => nodes.flatMap(node => (node.getAttribute('data-rx-contracts') || '').split(/\s+/)))).filter(Boolean));
}
const enabled = (id, declared) => !requiredDeclaration(id) || declared.has(requiredDeclaration(id));
module.exports = { STATUS_DECLARATION, requiredDeclaration, tokens, declarations, enabled };
