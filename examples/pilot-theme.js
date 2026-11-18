'use strict';
const theme = new URLSearchParams(location.search).get('theme');
if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
const partialChoice = document.getElementById('choice-checkbox-indeterminate-control');
if (partialChoice) partialChoice.indeterminate = true;
