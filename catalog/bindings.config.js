'use strict';

// Papéis somente; nenhum valor visual vive neste mapa.
const brands = [{
  id: 'eletia',
  dir: 'electia',
  label: 'eletia',
  logo: {
    dark: 'electia-wordmark.svg',
    light: 'electia-wordmark-light.svg'
  },
  voice: 'Sua equipe não e ruim. Esta desencaixada.',
  voiceSource: 'brands/electia/docs/BRAND-BOOK.md',
  common: {
    '--bg-base': '--bg',
    '--bg-surface-1': '--surface-1',
    '--bg-surface-2': '--surface-2',
    '--bg-surface-3': '--surface-3',
    '--border-default': '--border'
  },
  statuses: {
    success: '--success',
    warning: '--warning',
    error: '--error',
    info: '--color-info'
  }
}, {
  id: 'emprega',
  dir: 'emprega-mais',
  label: 'emprega+',
  logo: {
    dark: 'emprega-plus-white.png',
    light: 'emprega-plus-navy.png'
  },
  voice: 'Profissional, acessivel e otimista — mas sempre realista.',
  voiceSource: 'brands/emprega-mais/docs/BRAND-BOOK.md',
  common: {
    '--bg-base': '--emp-bg',
    '--bg-surface-1': '--emp-surface',
    '--bg-surface-2': '--emp-surface-tonal',
    '--text-primary': '--emp-text',
    '--text-secondary': '--emp-text-secondary',
    '--border-default': '--emp-border',
    '--font-body': '--emp-font-sans',
    '--font-heading': '--emp-font-heading',
    '--font-mono': '--emp-font-mono',
    '--radius-md': '--emp-radius-md',
    '--shadow-md': '--emp-shadow-md'
  },
  statuses: {
    success: '--emp-success',
    warning: '--emp-warning',
    error: '--emp-error',
    info: '--color-info'
  }
}, {
  id: 'xscore',
  dir: 'xscore',
  label: 'Xscore',
  logo: {
    dark: 'xscore-wordmark-light.svg',
    light: 'xscore-wordmark-dark.svg'
  },
  voice: null,
  voiceSource: null,
  common: {
    '--bg-base': '--bg',
    '--bg-surface-1': '--surface-1',
    '--bg-surface-2': '--surface-2',
    '--bg-surface-3': '--surface-3',
    '--border-default': '--border'
  },
  statuses: {
    success: '--success',
    warning: '--warning',
    error: '--danger',
    info: '--info'
  }
}, {
  id: 'pdv',
  dir: 'pdv',
  label: 'PdV',
  logo: {
    dark: 'pdv-icon-inverted.svg',
    light: 'pdv-icon.svg'
  },
  voiceSource: 'brands/pdv/docs/BRAND-BOOK.md',
  common: {},
  dark: {
    '--bg-base': '--bg',
    '--bg-surface-1': '--surface-1',
    '--bg-surface-2': '--surface-2',
    '--border-default': '--border'
  },
  statuses: {
    success: '--color-success',
    warning: '--color-warning',
    error: '--color-error',
    info: '--color-info'
  }
}, {
  id: 'resultx',
  dir: 'resultx',
  label: 'ResultX',
  logo: {
    dark: 'resultx-logo-on-dark.svg',
    light: 'resultx-logo-on-light.svg'
  },
  voice: 'Cada etapa termina em um entregável.',
  voiceSource: 'brands/resultx/docs/BRAND-BOOK.md',
  common: {
    '--bg-base': '--rx-bg',
    '--bg-surface-1': '--rx-surface-1',
    '--bg-surface-2': '--rx-surface-2',
    '--bg-surface-3': '--rx-surface-3',
    '--text-primary': '--rx-text',
    '--text-secondary': '--rx-text-secondary',
    '--border-default': '--rx-border',
    '--font-body': '--rx-font-body',
    '--font-heading': '--rx-font-heading',
    '--font-mono': '--rx-font-mono',
    '--radius-md': '--rx-radius-md',
    '--shadow-md': '--rx-shadow-md'
  },
  statuses: {
    success: '--rx-success',
    warning: '--rx-warning',
    error: '--rx-error',
    info: '--rx-info'
  }
}];
// GO UX 17/11: somente reservas semânticas existentes; não é tema opt-in.
const dataRoles = Object.freeze({
  '--delta-positive-fg': '--color-success',
  '--delta-positive-bg': '--color-success-bg',
  '--delta-negative-fg': '--color-warning',
  '--delta-negative-bg': '--color-warning-bg',
  '--delta-neutral-fg': '--text-secondary',
  '--delta-neutral-bg': '--bg-surface-2',
  '--surface-accent-green': '--color-success-bg',
  '--surface-accent-amber': '--color-warning-bg'
});
const pendingDataRoles = Object.freeze({
  '--surface-accent-cyan': 'Ciano suave',
  '--surface-accent-magenta': 'Magenta suave',
  '--surface-accent-purple': 'Roxo suave'
});
module.exports = { brands, dataRoles, pendingDataRoles };
