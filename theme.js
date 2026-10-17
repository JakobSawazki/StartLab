// [Claude, 2026-10-17] Classic (non-module) script, loaded in <head>: applies the stored light/dark theme and the
// display settings (colours, text size) before the first paint, wires the header buttons and the settings dialog,
// and shows a hint instead of a blank page when index.html is opened as a local file.
(function () {
 var THEME = 'startlab.theme', SETTINGS = 'startlab.settings', root = document.documentElement;
 var PRESETS = {creme: {bg: '#f4ecd8', ink: '#2b2418'}, 'kontrast-hell': {bg: '#ffffff', ink: '#000000'}, 'kontrast-dunkel': {bg: '#000000', ink: '#ffffff'}};
 var DEFAULTS = {preset: 'standard', bg: '#f6f4ee', ink: '#1c2a27', scale: 100};
 var VARS = ['--bg', '--surface', '--surface-2', '--ink', '--muted', '--line', '--line-strong', '--link', '--accent', '--accent-soft', '--primary', '--primary-hover', '--on-primary', '--primary-soft', '--input-border'];

 function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
 function write(key, value) { try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); } catch (e) { /* lasts until reload */ } }
 function systemDark() { return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); }
 function storedTheme() { var v = read(THEME); return v === 'light' || v === 'dark' ? v : null; }
 function current() { return root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light'); }
 function hex(v) { return /^#[0-9a-f]{6}$/i.test(v || '') ? v.toLowerCase() : null; }
 function loadSettings() {
  var s = {}; try { s = JSON.parse(read(SETTINGS) || '{}') || {}; } catch (e) { s = {}; }
  var scale = Number(s.scale);
  return {preset: PRESETS[s.preset] || s.preset === 'eigene' ? s.preset : 'standard', bg: hex(s.bg) || DEFAULTS.bg, ink: hex(s.ink) || DEFAULTS.ink, scale: scale >= 90 && scale <= 150 ? Math.round(scale / 10) * 10 : 100};
 }

 // Colour helpers (WCAG relative luminance and contrast).
 function rgb(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); }
 function toHex(c) { return '#' + c.map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join(''); }
 function mix(a, b, t) { var x = rgb(a), y = rgb(b); return toHex(x.map(function (v, i) { return v + (y[i] - v) * t; })); }
 function lum(h) { var c = rgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
 function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

 function palette(s) {
  var c = s.preset === 'eigene' ? {bg: s.bg, ink: s.ink} : PRESETS[s.preset];
  if (!c) return null;
  var dark = lum(c.bg) < 0.18, high = s.preset.indexOf('kontrast') === 0;
  var p = {'--bg': c.bg, '--ink': c.ink,
   '--surface': dark ? mix(c.bg, '#ffffff', high ? 0 : 0.05) : mix(c.bg, '#ffffff', high ? 0 : 0.6),
   '--surface-2': dark ? mix(c.bg, '#ffffff', high ? 0.08 : 0.09) : mix(c.bg, '#000000', high ? 0.04 : 0.045),
   '--line': mix(c.bg, c.ink, high ? 0.5 : 0.16), '--line-strong': mix(c.bg, c.ink, high ? 0.8 : 0.3),
   '--muted': high ? c.ink : mix(c.ink, c.bg, 0.28), '--input-border': mix(c.bg, c.ink, 0.6)};
  // Accent colours from the matching standard theme; fall back to the text colour when contrast is too low.
  var accents = dark ? {'--link': '#9fd0b9', '--accent': '#d6b47e', '--primary': '#8fc4ab', '--primary-hover': '#a7d3be', '--on-primary': '#0f1513', '--primary-soft': mix(c.bg, '#8fc4ab', 0.16), '--accent-soft': mix(c.bg, '#d6b47e', 0.14)}
                     : {'--link': '#1e4a3e', '--accent': '#7d5f2c', '--primary': '#1e4a3e', '--primary-hover': '#163a30', '--on-primary': '#ffffff', '--primary-soft': mix(c.bg, '#1e4a3e', 0.1), '--accent-soft': mix(c.bg, '#7d5f2c', 0.12)};
  for (var k in accents) p[k] = accents[k];
  if (high) { p['--link'] = c.ink; p['--accent'] = c.ink; }
  ['--link', '--accent'].forEach(function (k) { if (contrast(p[k], c.bg) < 4.5) p[k] = c.ink; });
  if (contrast(p['--muted'], c.bg) < 4.5) p['--muted'] = c.ink;
  return {vars: p, dark: dark};
 }

 function applySettings(s) {
  var p = palette(s);
  VARS.forEach(function (v) { root.style.removeProperty(v); });
  if (p) { for (var k in p.vars) root.style.setProperty(k, p.vars[k]); root.style.setProperty('color-scheme', p.dark ? 'dark' : 'light'); root.setAttribute('data-custom-colors', ''); }
  else { root.style.removeProperty('color-scheme'); root.removeAttribute('data-custom-colors'); }
  if (s.scale !== 100) root.style.setProperty('--text-scale', String(s.scale / 100)); else root.style.removeProperty('--text-scale');
 }
 function saveSettings(s) {
  var isDefault = s.preset === 'standard' && s.scale === 100;
  write(SETTINGS, isDefault ? null : JSON.stringify(s));
 }

 // Before first paint.
 root.setAttribute('data-theme', storedTheme() || (systemDark() ? 'dark' : 'light'));
 var settings = loadSettings(); applySettings(settings);

 function syncTheme() {
  var button = document.getElementById('theme-toggle'); if (!button) return;
  var dark = current() === 'dark';
  button.setAttribute('aria-pressed', String(dark));
  button.setAttribute('title', dark ? 'Helles Design verwenden' : 'Dunkles Design verwenden');
 }

 function initSettingsDialog() {
  var dialog = document.getElementById('settings'), open = document.getElementById('settings-toggle');
  if (!dialog || !open) return;
  var form = document.getElementById('settings-form'), bg = document.getElementById('set-bg'), ink = document.getElementById('set-ink');
  var scale = document.getElementById('set-scale'), out = document.getElementById('scale-out'), report = document.getElementById('contrast-out');
  function fill() {
   var radio = form.querySelector('input[name=preset][value="' + settings.preset + '"]'); if (radio) radio.checked = true;
   var c = settings.preset === 'eigene' ? settings : PRESETS[settings.preset] || (current() === 'dark' ? {bg: '#0f1513', ink: '#ebe6da'} : DEFAULTS);
   bg.value = c.bg; ink.value = c.ink; scale.value = settings.scale; out.textContent = settings.scale + ' %';
   var ratio = contrast(bg.value, ink.value), text = 'Kontrast Schrift zu Hintergrund: ' + ratio.toFixed(1).replace('.', ',') + ':1 – ';
   report.textContent = text + (ratio >= 7 ? 'sehr gut lesbar.' : ratio >= 4.5 ? 'gut lesbar.' : 'zu schwach, bitte andere Farben wählen.');
   report.classList.toggle('warn', ratio < 4.5);
  }
  function update(changes) { for (var k in changes) settings[k] = changes[k]; applySettings(settings); saveSettings(settings); fill(); }
  open.addEventListener('click', function () { fill(); dialog.showModal(); });
  form.addEventListener('change', function (e) {
   if (e.target.name === 'preset') update({preset: e.target.value, bg: e.target.value === 'eigene' ? bg.value : settings.bg, ink: e.target.value === 'eigene' ? ink.value : settings.ink});
  });
  [bg, ink].forEach(function (input) { input.addEventListener('input', function () { update({preset: 'eigene', bg: bg.value, ink: ink.value}); }); });
  scale.addEventListener('input', function () { update({scale: Number(scale.value)}); });
  form.addEventListener('click', function (e) {
   var step = e.target.closest('[data-scale]'); if (!step) return;
   update({scale: Math.min(150, Math.max(90, settings.scale + Number(step.getAttribute('data-scale'))))});
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  document.getElementById('settings-reset').addEventListener('click', function () {
   settings = {preset: 'standard', bg: DEFAULTS.bg, ink: DEFAULTS.ink, scale: 100};
   applySettings(settings); write(SETTINGS, null); fill(); report.textContent = 'Alle Einstellungen sind auf Standard zurückgesetzt.';
  });
 }

 document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('theme-toggle');
  if (button) button.addEventListener('click', function () {
   var next = current() === 'dark' ? 'light' : 'dark';
   root.setAttribute('data-theme', next); write(THEME, next);
   // The toggle switches between the two standard designs: custom colours give way, text size stays.
   if (settings.preset !== 'standard') { settings.preset = 'standard'; applySettings(settings); saveSettings(settings); }
   syncTheme();
  });
  if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if (!storedTheme()) root.setAttribute('data-theme', systemDark() ? 'dark' : 'light'); syncTheme(); });
  syncTheme();
  initSettingsDialog();
  if (location.protocol === 'file:') {
   var main = document.getElementById('main');
   if (main && !main.children.length) main.innerHTML = '<span class="eyebrow">Hinweis</span><h1 class="page-title">So siehst du StartLab.</h1>' +
    '<p class="intro">Diese Seite wurde als lokale Datei geöffnet. Browser blockieren dabei die Programmteile, die die Inhalte anzeigen. ' +
    'Öffne StartLab online unter <a href="https://jakobsawazki.github.io/StartLab/">jakobsawazki.github.io/StartLab</a> ' +
    'oder starte im Projektordner <code>npm run serve</code> und öffne <code>http://127.0.0.1:4173</code>.</p>';
  }
 });
})();
