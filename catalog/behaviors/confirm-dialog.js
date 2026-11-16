'use strict';
const dialog = document.querySelector('#confirm');
document.querySelector('#open-dialog').addEventListener('click', () => dialog.showModal());
dialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const controls = [...dialog.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled)')];
  if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
  else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
});
document.querySelector('#cancel').addEventListener('click', () => dialog.close());
document.querySelector('#confirm-action').addEventListener('click', (event) => {
  const button = event.currentTarget, loading = document.querySelector('#dialog-loading'), error = document.querySelector('#dialog-error');
  const retry = !error.hidden;
  dialog.setAttribute('aria-busy', 'true'); button.disabled = true; loading.hidden = false; error.hidden = true;
  setTimeout(() => { dialog.removeAttribute('aria-busy'); button.disabled = false; loading.hidden = true; if (retry) dialog.close('confirmed'); else error.hidden = false; }, 500);
});
