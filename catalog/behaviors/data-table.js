'use strict';
document.querySelector('#sort').addEventListener('click', () => {
  const header = document.querySelector('#sort').closest('th');
  const next = header.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
  header.setAttribute('aria-sort', next);
  const body = document.querySelector('#table tbody');
  [...body.rows].sort((a, b) => (next === 'ascending' ? 1 : -1) * a.cells[0].textContent.localeCompare(b.cells[0].textContent, 'pt-BR')).forEach((row) => body.append(row));
});
