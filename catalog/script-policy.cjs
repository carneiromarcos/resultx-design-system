'use strict';
// GO Marcos 16/11: somente scripts existentes, apenas no próprio componente.
// As molduras e os documentos de legado não carregam script.
const scripts = Object.freeze({
  'confirm-dialog': ['catalog/behaviors/confirm-dialog.js'],
  'data-table': ['catalog/behaviors/data-table.js'],
  'sidebar-overlay': ['dist/sidebar-overlay.js'],
  'menu-drawer': ['dist/menu-drawer.js'],
  'split-pane': ['dist/split-pane.js'],
  'header-float': ['dist/header-float.js'],
  'cta-dock': ['dist/cta-dock.js'],
  disclosure: ['dist/disclosure.js']
});
function allowedScripts(pageId) {
  return Object.hasOwn(scripts, pageId) ? [...scripts[pageId]] : [];
}
module.exports = {allowedScripts};
