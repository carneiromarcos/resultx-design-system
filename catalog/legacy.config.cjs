'use strict';

const brands = ['eletia', 'emprega', 'xscore', 'pdv', 'resultx'];
module.exports = [{
  id: 'button',
  doc: 'buttons',
  successor: 'Botão',
  title: 'Botões anteriores',
  group: 'Ações',
  families: ['variants', 'sizes', 'width', 'social', 'sheen', 'states']
}, {
  id: 'card',
  doc: 'cards',
  successor: 'Cartão',
  title: 'Cartões anteriores',
  group: 'Conteúdo e dados',
  families: ['base', 'accent', 'content', 'grid']
}, {
  id: 'field',
  doc: 'forms',
  successor: 'Campo',
  title: 'Campos anteriores',
  group: 'Formulários',
  families: ['input', 'select', 'checkbox', 'divider', 'toggle', 'textarea', 'keyboard', 'login', 'states']
}, {
  id: 'status-badge',
  doc: 'badges',
  successor: 'Status',
  title: 'Etiquetas anteriores',
  group: 'Conteúdo e dados',
  families: ['status', 'compact', 'icons', 'tags', 'dot'],
  pending: 'Os estilos de avaliação são específicos da eletia e ficam para a etapa de domínio. Eles não aparecem como opções das outras marcas.'
}, {
  id: 'empty-state',
  doc: 'empty-state',
  successor: 'Vazio e erro',
  title: 'Vazio anterior',
  group: 'Avisos e retorno',
  families: ['page', 'inline']
}, {
  id: 'confirm-dialog',
  doc: 'modals',
  successor: 'Confirmação',
  title: 'Janela anterior',
  group: 'Avisos e retorno',
  families: ['default', 'small', 'large'],
  pending: 'A janela anterior é apenas visual: abrir, fechar, conter o foco e devolver o foco não estão implementados aqui. Próximo passo: usar a confirmação acima para testar o comportamento; só reativar o mecanismo antigo após autorização.'
}, {
  id: 'stat-card',
  doc: 'stats',
  successor: 'Indicador',
  title: 'Indicadores anteriores',
  group: 'Conteúdo e dados',
  families: ['standard', 'mini', 'progress'],
  pending: 'As métricas são fictícias. Esta versão anterior fica para consulta; use o indicador oficial acima nas telas novas.'
}, {
  id: 'data-table',
  doc: 'tables',
  successor: 'Tabela',
  title: 'Tabelas anteriores',
  group: 'Conteúdo e dados',
  families: ['basic', 'dense'],
  pending: 'A tabela anterior mostra dados fixos. Não há exportação, ordenação ou seleção conectada. Use a tabela oficial acima para testar o comportamento de ordenação.'
}, {
  id: 'navigation',
  doc: 'navigation',
  title: 'Navegação',
  group: 'Navegação e layout',
  families: ['sidebar', 'rail', 'overlay', 'panel', 'header', 'tabs', 'breadcrumb', 'dropdown'],
  pending: 'Abas e menu suspenso são amostras visuais: troca de conteúdo e teclado ainda estão pendentes de autorização. O menu lateral sobre a página tem uma demonstração funcional própria, indicada abaixo.'
}, {
  id: 'layout',
  doc: 'layout',
  title: 'Organização da página',
  group: 'Navegação e layout',
  families: ['list-detail', 'centered', 'auth', 'fullwidth', 'positioning'],
  pending: 'Esta página mostra a organização visual. O menu suspenso e a seleção que atualiza o painel ainda não alteram conteúdo. Próximo passo: autorizar e testar esses comportamentos.'
}, {
  id: 'segmented',
  doc: 'segmented',
  title: 'Escolha entre opções',
  group: 'Navegação e layout',
  families: ['base', 'stacked', 'small', 'large', 'block', 'chips', 'disabled'],
  keyboard: 'Tab entra no grupo; as setas escolhem uma opção e Espaço a marca. O próximo Tab sai do grupo. Esse comportamento é nativo, sem JavaScript.'
}, {
  id: 'list-item',
  doc: 'list-item',
  title: 'Itens de lista',
  group: 'Conteúdo e dados',
  families: ['default', 'current', 'unread', 'compact', 'alias'],
  keyboard: 'Tab chega ao item e Enter segue o link. Não há mudança de painel ou carregamento de dados nesta demonstração.'
}].map(d => ({
  ...d,
  applies: brands,
  recipe: `catalog/recipes/legacy/${d.doc}.html`
}));
