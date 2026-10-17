# Übergabe Claude → Codex

[Claude, 2026-10-17] · Grundlage: `Docs/CLAUDE_HANDOFF.md`

## Stand

Arbeitsbaum geändert, **nichts committet oder veröffentlicht**. Ein Push nach
`main` würde die Website sofort veröffentlichen; vorher bitte mit Jakob abstimmen.
Kontofunktionen bleiben deaktiviert (`config.js` unverändert).

## Geänderte Dateien

| Datei | Änderung |
| --- | --- |
| `content.js` | `kuerzelMap` + neue `usernameBase` (NFC, gemeinsame Tabelle); weiche Trennstellen in vier Bingo-Texten |
| `supabase/migrations/202610170002_startlab_accounts.sql` | neu: `startlab_username_base()`, Trigger-Funktion ersetzt (Tabelle, Steuerzeichen), Mailabgleich-Trigger |
| `supabase/functions/startlab/index.ts` | Statusklassen 429/502, adressfreie Logs, JSON-Prüfung, Namensprüfung, Auth-E-Mail für Kürzel-Login/Admin-Reset, Audit bei Versandfehler, globale Abmeldung nach Passwortwechsel |
| `auth.js` | Sitzungsablauf, 401 verwirft Token, `#error=…`-Links, Fokus/ARIA, Kürzelvorschau, Passwort ändern, „Mein Konto“, Adminliste mit Rückfrage |
| `app.js` | Dialogname, Seitentitel, Filtergruppe, Trefferanzahl, Linkkontext, Bingo-Status |
| `index.html` | `aria-labelledby` an beiden Dialogen |
| `styles.css` | Kontraste, `.sr-only`, Konto-Hilfsklassen, mobiles 4×4-Bingo, Druckregeln |
| `tests/*.mjs` | 7 → 23 Tests |
| `tools/browser-check.cjs` | Barrierefreiheit, Druck, simulierte Kontoabläufe |
| `Docs/*`, `CHANGELOG.md` | Einträge `[Claude, 2026-10-17]` |

## Prüfungen

Siehe `VERIFICATION.md`, Abschnitt „Nachprüfung [Claude, 2026-10-17]“.
`tools/browser-check.cjs` besteht mit Edge (Playwright außerhalb des Repositories).

## Zweiter Block [Claude, 2026-10-17]

- Adminliste seitenweise (Edge: `page`, Antwort `has_more`; UI: „Weitere Konten laden“).
- `tools/browser-check.cjs` erweitert und mit Edge bestanden (Kontodienst per `page.route` simuliert).
- Unsichtbarer Kontext in Buttons/Links jetzt in Klammern, z. B. „Bingo starten (Kennenlern-Bingo)“,
  weil Chromium sonst „Bingo starten : …“ vorliest.

## Dritter Block [Claude, 2026-10-17]

- `tools/sql-check.mjs`: beide Migrationen gegen PGlite mit Supabase-Stubs, 9 Prüfungen bestanden,
  Gegenprobe mit fehlendem `revoke` schlägt korrekt fehl. Aufruf siehe README.

## Vierter Block [Claude, 2026-10-17]

- axe-Audit (optional via `STARTLAB_AXE` im Browser-Prüfstand): verschachteltes `aside` behoben, jetzt ohne Verstöße.
- Skiplink-Fehler behoben (wechselte per `#main` zur Übersicht).

## Fünfter Block [Claude, 2026-10-17]

- CSP-Meta-Tag in `index.html`; Browser-Prüfstand wertet CSP-Verstöße als Fehler und prüft die Blockade fremder Ziele.
  Bei eigener Function-Domain `connect-src` anpassen.

## Sechster Block [Claude, 2026-10-17]

- Zeitlimits: `auth.js` 20 s mit deutschen Meldungen für Offline/Timeout; Edge Function 10 s je Supabase-Aufruf (502, Log ohne Daten).
- Offline-Fall im Browser-Prüfstand; `npm run check` umfasst `tools/`.

- Edge Function besteht `tsc --strict` (Deklaration: `declare namespace Deno { const env:{get(k:string):string|undefined}; function serve(h:(r:Request)=>Response|Promise<Response>):void; }`).

## Siebter Block [Claude, 2026-10-17]

- `tools/smoke-check.mjs`: zerstörungsfreier Smoke-Test der deployten Function; lokal gegen die echte Function-Datei mit simuliertem Supabase geprüft.
- Fokusrückgabe nach Dialogen im Browser-Prüfstand.

## Achter Block [Claude, 2026-10-17]

- `tests/build.test.mjs`: Build-Liste vollständig, keine Geheimnisse in öffentlichen Dateien, `apiUrl` passend zur CSP. Neue Website-Dateien immer in `tools/build.mjs` eintragen.

## Neunter Block [Claude, 2026-10-17]

- Neuer Ordner `resources/` mit zwei Word-Originalen (nicht von mir angelegt) in `.gitignore` aufgenommen, damit sie nicht versehentlich öffentlich werden. Gesichtet; Analyse nur in `private/UEBERNAHME_ANALYSE.md`. Keine Inhalte auf die Website übernommen (Frage 6).

## Zehnter Block [Claude, 2026-10-17]

- `supabase/config.toml`: Auth-Einstellungen aus der Anleitung, per Test mit Edge Function und Anleitung abgeglichen.
- Bingo-Knopf „Markierungen zurücksetzen“.

## Elfter Block [Claude, 2026-10-17]

- Admin-Aktion `admin-audit` (letzte 100 Einträge, Kürzel statt E-Mail) mit Tabelle im Adminbereich; Tests, Browser- und Smoke-Test ergänzt.

## Offen / Vorschläge

1. Migrationen 0001+0002 erst mit echtem Projekt anwenden; Abnahmepunkte 9–12
   in `SUPABASE_SETUP.md` sind neu.
2. Frage 21 an Jakob: Kürzel für Namen ohne lateinische Buchstaben.
3. Die Kürzeltabelle existiert dreifach (Browser, Edge, SQL); Änderungen immer
   an allen drei Stellen vornehmen – der Test schlägt sonst fehl.
