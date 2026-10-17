# Prüfprotokoll 0.1.0

17. Oktober 2026 · Codex

- `npm test`: 7 Tests bestanden. Kürzel und Materialstruktur sowie Backendprüfung
  mit simuliertem Supabase: fehlende Anmeldung, fehlende Adminrolle, falsche
  Herkunft, deaktivierte Registrierung, erlaubte Adminliste.
- `npm run check`: JavaScript-Syntaxprüfung bestanden.
- `node tools/build.mjs`: Website aus expliziter Dateiliste erzeugt.
- `tools/browser-check.cjs`: Microsoft Edge headless, Desktop 1440 × 1000 sowie
  Mobilansicht 390 × 844. Navigation, Suche, Bingo-Markierung, Checkliste nach
  Neuladen und deaktivierte Konten bestanden. Sechs Ansichten ohne horizontalen
  Überlauf, keine JavaScript-Laufzeitfehler.
- Desktopansicht visuell anhand lokalem Screenshot geprüft. Screenshots bleiben
  unter `.local/` und sind nicht Teil des Repositories.

Keine reale Supabase-Datenbank angelegt, keine Migration ausgeführt, keine
Bestätigungs-/Recovery-Mail versendet. Die Backendtests ersetzen diese Abnahme
nicht. Keine Screenreaderprüfung, kein echter Schul-PC oder echtes Mobilgerät.

Das öffentliche Repository wurde unter
https://github.com/JakobSawazki/StartLab angelegt. Pages-Status wird nach dem
ersten Deployment ergänzt.
