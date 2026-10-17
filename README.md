# StartLab

Gemeinsam ankommen, kennenlernen und das Schuljahr gestalten.

Version **0.1.0**, 17. Oktober 2026 · Jakob Sawazki / Codex · seither unveröffentlichte
Weiterentwicklung durch Claude (siehe [CHANGELOG](CHANGELOG.md)).

StartLab ergänzt Excel-Lab und WorkbenchLab um einen übersichtlichen Einstieg
für die organisatorischen Themen zum Schuljahresbeginn.

- Drei Stationen: Kennenlernen, Zusammenarbeit (Unternehmen Black-Forest-Industry), Orientierung.
- Inhalte aus Jakobs OneNote: Vorstellung, Vertrag und Regeln, Leistungsbewertung mit
  Notenschlüsseln, Praktikum BK1, GFS BG, Termine 2026/27, Bildungspläne.
- Materialsuche über Titel und Inhalte, Bingo, druckbare Dialoge, lokale Checkliste,
  „Als Nächstes“ mit den kommenden Terminen.
- Supabase-Vorbereitung: Registrierung, Kürzel-Anmeldung, Reset-Links, Adminliste,
  Audit-Ansicht, Kontosperre.

**Konten sind noch deaktiviert.** Ohne Supabase-Projekt und dessen Konfiguration
werden keine Registrierungsangaben erfasst oder versendet. Die Website ist
bereits ohne Konto nutzbar. Die OneNote-Originaldateien liegen nur lokal und
Git-ignoriert in `resources/`; veröffentlicht wird ausschließlich ihr Inhalt.
Tipps, Tastenkürzel und Bingo sind noch StartLab-Neufassungen.

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

Externe Links prüfen (Netz nötig): `node tools/link-check.mjs`.

Optional zusätzlich ein axe-Audit: `STARTLAB_AXE=/pfad/zu/node_modules/axe-core/axe.min.js`.

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
- [Übergabe an Codex](Docs/claude2codex.md)
- [Freigabe vor dem nächsten Push](Docs/FREIGABE.md)

Keine Lizenz für die Weiterverwendung vergeben. Weitere Originalmaterialien nur
nach Jakobs Freigabe und ohne personenbezogene Daten übernehmen.
