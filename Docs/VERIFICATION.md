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
https://github.com/JakobSawazki/StartLab angelegt (Sichtbarkeit PUBLIC geprüft).
Der GitHub-Actions-Lauf 39022327933 ist erfolgreich abgeschlossen.
Die Live-Seite https://jakobsawazki.github.io/StartLab/ antwortet mit HTTP 200;
StartLab-Titel im ausgelieferten HTML geprüft. Die öffentliche Version enthält
keine Schülerkonten, Schlüssel oder OneNote-Anhänge.

## Nachprüfung [Claude, 2026-10-17]

- `npm test`: 21 Tests bestanden (vorher 7). Neu u. a.: ungültiges JSON,
  Kürzel-Login mit aktueller Auth-E-Mail, unbekanntes Kürzel, Auth-Ratenlimit
  als 429, neutraler Reset bei Mailfehler mit adressfreiem Log, Admin-Reset mit
  Versandfehler und Audit, Name ohne lateinische Buchstaben, Steuerzeichen,
  Mailausfall bei Registrierung als 502, Passwortwechsel mit globaler Abmeldung,
  manipuliertes Token, erweiterte Kürzelfälle und wortgleiche Kürzeltabelle in
  `content.js`, Edge Function und Migration 0002.
- `npm run check` und `node tools/build.mjs` bestanden.
- `tools/browser-check.cjs` **nicht** ausgeführt: Playwright ist auf diesem
  Rechner nicht installiert. Ersatzweise im eingebauten Browser der Claude-App
  (Chromium) geprüft:
  - Ohne Konten: Seitentitel je Route, Fokus auf `main` nach Navigation,
    Filtergruppe, Trefferanzahl, Dialogname, Bingo-Status inkl. Reihen und
    Diagonale, Kontodialog ohne Eingabefelder.
  - 375 × 812: alle sechs Ansichten ohne horizontalen Überlauf, Bingo 4 × 4
    ohne überlaufende Felder (Screenshot visuell geprüft).
  - Kontooberfläche gegen ein lokales Schein-Backend (Skript nur im
    Scratchpad, erfundene Werte, nicht im Repository): Umschalter-Zustand,
    Fokus auf Überschrift, Kürzelvorschau, Sperre für nichtlateinische Namen,
    Leereingabe, falsches Passwort, Anmeldung, „Mein Konto“, Adminliste,
    Admin-Reset mit Rückfrage, Passwortwechsel mit Abmeldung, abgelaufener
    Link (`otp_expired`), Recovery-Link, manipuliertes Token. Fragment jeweils
    aus der Adresszeile entfernt; nichts im Local-/Session-Storage.
- Druck mit Microsoft Edge headless als PDF: Seite „So arbeiten wir zusammen“
  ohne Navigation/Bedienelemente; geöffnete Vorlagen Bingo und Lernvereinbarung
  oben ausgerichtet ohne Abdunklung. PDFs nur lokal, nicht im Repository.
- Kontraste rechnerisch (WCAG-Formel): Begleittext 4,98–5,74:1, Eingaberänder
  3,45:1, Statusbadge 5,98:1.

### Zweiter Block [Claude, 2026-10-17]

- `npm test`: 23 Tests bestanden (neu: Adminliste seitenweise, ungültige Seitenangaben).
- `tools/browser-check.cjs` mit Microsoft Edge headless **bestanden**. Playwright wurde dafür
  außerhalb des Repositories (`playwright-core` 1.48.2 im temporären Arbeitsordner, ohne
  Browserdownload) installiert und per `STARTLAB_PLAYWRIGHT` angegeben. Neu geprüft:
  Seitentitel, Filtergruppe, Trefferanzahl, Dialognamen, Bingo-Status, Escape schließt
  Dialog, Druckmedium blendet Kopf und Bedienelemente aus, mobiles 4×4-Bingo ohne Überlauf,
  sowie simulierte Kontoabläufe per `page.route` (erfundene Werte, keine Anfrage verlässt den
  Rechner): abgelaufener Link, Umschalter-Zustand, Fokus, Kürzelvorschau, Sperre
  nichtlateinischer Namen, falsches/richtiges Passwort, Adminliste über zwei Seiten (103
  Konten), Admin-Reset mit Rückfrage, Abmelden, Recovery mit Passwortwechsel, manipuliertes
  Token, leerer Local-/Session-Storage.

Weiterhin nicht geprüft: echte Supabase-Datenbank, Migrationen 0001/0002,
Trigger zur Mailsynchronisierung, echte Bestätigungs- und Recovery-Mails,
Screenreader, Schul-PC, echte Mobilgeräte, Firefox/Safari.
