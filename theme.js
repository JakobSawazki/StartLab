// [Claude, 2026-10-17] Classic (non-module) script, loaded in <head> before the stylesheet is applied:
// sets the stored light/dark choice before the first paint, wires the header toggle and, when the page is
// opened as a local file (module scripts are blocked there), explains how to view it instead of a blank page.
(function () {
 var KEY = 'startlab.theme', root = document.documentElement;
 function stored() { try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null; } catch (e) { return null; } }
 function systemDark() { return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
 function current() { return root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light'); }
 // Always set an explicit theme so the toggle icon matches; without a stored choice the system setting decides.
 root.setAttribute('data-theme', stored() || (systemDark() ? 'dark' : 'light'));
 function sync() {
  var button = document.getElementById('theme-toggle'); if (!button) return;
  var dark = current() === 'dark';
  button.setAttribute('aria-pressed', String(dark));
  button.setAttribute('title', dark ? 'Helles Design verwenden' : 'Dunkles Design verwenden');
 }
 document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('theme-toggle');
  if (button) button.addEventListener('click', function () {
   var next = current() === 'dark' ? 'light' : 'dark';
   root.setAttribute('data-theme', next);
   try { localStorage.setItem(KEY, next); } catch (e) { /* choice then lasts until reload */ }
   sync();
  });
  if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if (!stored()) root.setAttribute('data-theme', systemDark() ? 'dark' : 'light'); sync(); });
  sync();
  if (location.protocol === 'file:') {
   var main = document.getElementById('main');
   if (main && !main.children.length) main.innerHTML = '<span class="eyebrow">Hinweis</span><h1 class="page-title">So siehst du StartLab.</h1>' +
    '<p class="intro">Diese Seite wurde als lokale Datei geöffnet. Browser blockieren dabei die Programmteile, die die Inhalte anzeigen. ' +
    'Öffne StartLab online unter <a href="https://jakobsawazki.github.io/StartLab/">jakobsawazki.github.io/StartLab</a> ' +
    'oder starte im Projektordner <code>npm run serve</code> und öffne <code>http://127.0.0.1:4173</code>.</p>';
  }
 });
})();
