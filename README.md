# StartLab

Gemeinsam ankommen, kennenlernen und das Schuljahr gestalten.

Version **0.1.0**, 17. Oktober 2026 · Jakob Sawazki / Codex.

StartLab ergänzt Excel-Lab und WorkbenchLab um einen übersichtlichen Einstieg
für die organisatorischen Themen zum Schuljahresbeginn.

- Drei Stationen: Kennenlernen, Zusammenarbeit, Orientierung.
- Materialsuche und Kategorien, Bingo, druckbare Vorlagen, lokale Checkliste.
- Supabase-Vorbereitung für Registrierung, Kürzel-Anmeldung und Reset-Links.
- Geschützte Adminübersicht im vorbereiteten Backend.

**Konten sind noch deaktiviert.** Ohne Supabase-Projekt und dessen Konfiguration
werden keine Registrierungsangaben erfasst oder versendet. Die Website ist
bereits ohne Konto nutzbar. OneNote-Originaldateien sind noch nicht importiert;
Materialstatus unterscheidet Neufassungen, Entwürfe und offene Übernahmen.

Repository: https://github.com/JakobSawazki/StartLab

Website nach erfolgreichem Pages-Deployment: https://jakobsawazki.github.io/StartLab/

## Entwicklung

Node.js ab 22. Keine Paketinstallation für die Website erforderlich.

```sh
npm test
npm run check
npm run serve
```

Vorschau: http://127.0.0.1:4173

Browserprüfung (Microsoft Edge, Playwright außerhalb des Projekts, z. B. `playwright-core`):

```sh
STARTLAB_PLAYWRIGHT=/pfad/zu/node_modules/playwright-core node tools/browser-check.cjs
```

SQL-Prüfung der Migrationen (PGlite außerhalb des Projekts):

```sh
STARTLAB_PGLITE=/pfad/zu/node_modules/@electric-sql/pglite node tools/sql-check.mjs
```

`node tools/build.mjs` erstellt das öffentliche Website-Paket mit einer festen
Dateiliste. Datenbankmigrationen und Projektdokumentation gehören zum öffentlichen
Quellcode, nicht zum Website-Paket. Keine Schülerdaten oder Schlüssel einchecken.

## Wegweiser

- [Projektdokumentation](Docs/documentation.md)
- [Aufgaben und Fragen](Docs/tasks.md)
- [Supabase einrichten](Docs/SUPABASE_SETUP.md)
- [OneNote-Inventar](Docs/ONENOTE_INVENTAR.md)
- [Versionsverlauf](CHANGELOG.md)

Keine Lizenz für die Weiterverwendung vergeben. Originalmaterialien erst nach
inhaltlicher Prüfung und Klärung der Veröffentlichungsrechte übernehmen.
