/**
 * ResultX Design System — Theme Toggle
 * Production-ready reference implementation.
 *
 * Usage:
 *   <script src="dist/theme-toggle.js"></script>
 *
 * API:
 *   ResultXTheme.toggle()       — cycle dark ↔ light
 *   ResultXTheme.set('dark')    — set specific theme
 *   ResultXTheme.get()          — returns current theme ('dark' | 'light')
 *
 * Behavior:
 *   - Persists choice in localStorage('resultx-theme')
 *   - On load: localStorage > system preference > 'dark' (default)
 *   - Sets data-theme on <html> and dispatches 'themechange' event
 */
;(function () {
  'use strict';

  var STORAGE_KEY = 'resultx-theme';
  var ATTR = 'data-theme';
  var root = document.documentElement;

  function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function apply(theme) {
    root.setAttribute(ATTR, theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* noop */ }
    root.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  function get() {
    return root.getAttribute(ATTR) || 'dark';
  }

  function set(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    apply(theme);
  }

  function toggle() {
    apply(get() === 'dark' ? 'light' : 'dark');
  }

  // Initialize on load
  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* noop */ }
  apply(stored || getSystemPreference());

  // Listen for system preference changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        apply(e.matches ? 'dark' : 'light');
      }
    });
  }

  window.ResultXTheme = { toggle: toggle, set: set, get: get };
})();
