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

## Offen / Vorschläge

1. Migrationen 0001+0002 erst mit echtem Projekt anwenden; Abnahmepunkte 9–12
   in `SUPABASE_SETUP.md` sind neu.
2. Frage 21 an Jakob: Kürzel für Namen ohne lateinische Buchstaben.
3. Die Kürzeltabelle existiert dreifach (Browser, Edge, SQL); Änderungen immer
   an allen drei Stellen vornehmen – der Test schlägt sonst fehl.
