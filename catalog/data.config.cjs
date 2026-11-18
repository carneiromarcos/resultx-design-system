'use strict';

module.exports = [{
  id: 'data-cards',
  doc: 'data-cards',
  title: 'Dados visuais',
  group: 'Conteúdo e dados',
  applies: ['eletia', 'emprega', 'xscore', 'pdv', 'resultx'],
  families: ['statcard', 'coin', 'delta', 'chart', 'donut', 'table', 'sparkline', 'avatar-stack', 'status', 'callout'],
  recipe: 'catalog/recipes/data/data-cards.html',
  pending: 'Os dados são fictícios. Os fundos decorativos suaves usam tokens próprios e sempre aparecem com rótulos textuais. Os gráficos não respondem a mouse ou toque.'
}, {
  id: 'data-patterns',
  doc: 'composite',
  title: 'Composições de dados',
  group: 'Conteúdo e dados',
  applies: ['eletia', 'emprega', 'xscore', 'pdv', 'resultx'],
  families: ['enhanced-table', 'bulk-toolbar', 'chart-card', 'sparkline-svg'],
  recipe: 'catalog/recipes/data/data-patterns.html',
  pending: 'Ordenação, seleção em lote e troca de período são só estados visuais. Nenhuma dessas ações altera dados. O próximo passo é definir e autorizar o comportamento antes de usar esta página como referência funcional.'
}];
