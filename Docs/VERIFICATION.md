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

### SQL-Prüfung [Claude, 2026-10-17]

- `tools/sql-check.mjs` gegen PGlite 0.2.17 (PostgreSQL als WebAssembly, außerhalb des
  Repositories installiert) mit minimalen Supabase-Stubs (`auth.users`, `auth.uid()`,
  Rollen `anon`/`authenticated`/`service_role`, Supabase-typische Default-Grants):
  9 Prüfungen bestanden. Beide Migrationen laufen fehlerfrei; Kürzel aus SQL gleich
  `content.js` für 13 Namensfälle; Kollisionen `tesper`, `tesper2`, `tesper3`;
  nichtlateinische Namen, Steuerzeichen und fehlende Namen abgewiesen; Profil-E-Mail folgt
  Auth-E-Mail; Schüler sieht nur das eigene Profil und kann Profile, Rollen, Audit, Limits
  und Funktionen weder lesen noch ändern; anonym kein Profilzugriff; Ratenlimit; Löschkaskade.
- Gegenprobe: Ohne das `revoke` auf `startlab_username_base` schlägt die Prüfung fehl.
- Grenzen: echte Supabase-Rollen, Auth-Dienst, Mailversand und parallele Registrierungen
  (eine PGlite-Verbindung) sind damit nicht geprüft.

### Barrierefreiheits-Audit [Claude, 2026-10-17]

- axe-core 4.10.2 (WCAG 2.0/2.1 A und AA plus Best Practices, außerhalb des Repositories)
  über sechs Ansichten, fünf Materialdialoge, Datenschutzdialog und die Kontoansichten
  Anmelden/Registrieren/Passwort vergessen, jeweils bei 1440 und 375 px Breite.
  Einziger Befund: verschachteltes `aside` auf der Startseite, behoben. Danach ohne Verstöße.
- Fehler gefunden und behoben: Der Skiplink setzte `#main` als Route und schaltete deshalb
  von jeder Unterseite zur Übersicht. Jetzt bleibt die Route erhalten, der Fokus springt auf
  den Inhalt. Im Browser-Prüfstand von der Materialseite aus geprüft.
- `tools/browser-check.cjs` mit `STARTLAB_AXE` und ohne bestanden.
- axe deckt nicht alles ab (z. B. Verständlichkeit, Screenreader-Ausgabe, reale Geräte).

### Content-Security-Policy [Claude, 2026-10-17]

- CSP per Meta-Tag: nur eigene Skripte/Styles, Verbindungen nur zur eigenen Herkunft und zu
  `https://*.supabase.co`. Browser-Prüfstand bestanden, keine CSP-Verstöße in der Konsole;
  ein Abruf zu einem fremden Ziel löst nachweislich einen `connect-src`-Verstoß aus. Der
  simulierte Kontodienst nutzt eine `*.supabase.co`-Adresse und läuft damit unter der CSP.

### Zeitlimits und Verbindungsfehler [Claude, 2026-10-17]

- `npm test`: 25 Tests bestanden (neu: nicht erreichbares Supabase ergibt 502 mit adressfreiem
  Log; alle Upstream-Aufrufe tragen ein Zeitlimit).
- Browser-Prüfstand (mit axe) bestanden; neu: unterbrochene Verbindung beim Anmelden zeigt
  „Keine Verbindung zum Kontodienst …“ und gibt den Button wieder frei.
- `npm run check` prüft jetzt auch die Werkzeugskripte.
- Fokusrückgabe: Nach Escape liegt der Fokus wieder auf dem auslösenden Button (Materialdialog
  und Kontodialog), im Browser-Prüfstand bestanden.

### Typprüfung Edge Function [Claude, 2026-10-17]

- `tsc` 5.6.3 mit `--strict --moduleDetection force` und einer minimalen Deklaration für
  `Deno.env`/`Deno.serve` (außerhalb des Repositories): keine Fehler. Ersetzt keinen
  `supabase functions deploy`-Lauf mit echter Deno-Laufzeit.

### Smoke-Test-Skript [Claude, 2026-10-17]

- `tools/smoke-check.mjs` gegen die echte Edge-Function-Datei, lokal gehostet mit simuliertem
  Supabase: 11 von 11 Punkten ok. Gegenprobe mit falscher Herkunft endet mit Fehlercode 1.
  Gegen eine echte Supabase-Instanz noch nicht gelaufen.

### Schutztests für das Pages-Paket [Claude, 2026-10-17]

- `tests/build.test.mjs` (28 Tests gesamt bestanden): Jede in `index.html` verlinkte und jede
  per `import` geladene Datei steht in der Build-Liste; die öffentlichen Dateien enthalten keine
  JWTs oder Schlüsselbegriffe; eine gesetzte `apiUrl` muss eine `*.supabase.co`-Function sein,
  damit die CSP sie zulässt.
- Gegenproben: fehlende Datei in der Build-Liste, eingefügtes JWT und fremde `apiUrl` schlagen
  jeweils fehl; eine gültige Supabase-Adresse besteht. Da der Pages-Workflow `npm test` vor dem
  Deploy ausführt, stoppen diese Fehler eine Veröffentlichung.

### Auth-Konfiguration und Bingo-Reset [Claude, 2026-10-17]

- `supabase/config.toml` enthält die Auth-Einstellungen (Schlüssel gegen die CLI-Referenz geprüft;
  `minimum_password_length` steht dort nicht, nur in der CLI-Vorlage). Neuer Test gleicht sie mit
  Edge Function und Anleitung ab; Gegenprobe mit Minimum 8 schlägt fehl. 29 Tests bestanden.
- Bingo „Markierungen zurücksetzen“ im Browser-Prüfstand bestanden; im Druck ausgeblendet.

### Audit-Ansicht [Claude, 2026-10-17]

- Neue Admin-Aktion `admin-audit`: 31 Tests bestanden (nur Admins; Kürzel statt E-Mail; gelöschte
  Konten markiert). `tsc --strict` fand einen Typfehler in der ersten Fassung, behoben, danach ohne Fehler.
- Browser-Prüfstand mit axe bestanden: Protokolltabelle mit Berliner Zeit und deutschen Vorgangsnamen.
- Smoke-Test um „Audit ohne Anmeldung (401)“ ergänzt; lokal 12 von 12 ok.

### Übernahme der OneNote-Inhalte [Claude, 2026-10-17]

- `npm test`: 37 Tests bestanden; neu `tests/inhalte.test.mjs` (Schlüssel lückenlos und monoton,
  Termine gültig und sortiert, Vollständigkeit von Vertrag/Vorstellung/Praktikum/GFS, keine
  Fremdnamen oder Kontaktdaten). Der Build-Schutztest meldete die neue Datei, bevor sie in der
  Build-Liste stand.
- Einmaliger Abgleich mit den Originalen (Skripte nur lokal): BG/BK-Bänder aus den Excel-Zellen
  erzeugt; alle J1/J2-Klausuren in beide Richtungen gegen die Kalenderzellen geprüft; allgemeine
  und BK-Termine einzeln gegen den Schulkalender; keine Klausur am Wochenende.
- Browser-Prüfstand mit axe bestanden: Station 02 mit zehn Regeln, Kalenderfilter J2,
  Notenschlüssel BG mit 16 Zeilen, axe über zehn Materialdialoge in zwei Breiten (zuerst zwei
  Befunde: nicht fokussierbare Scrollbereiche und doppelte Bereichsnamen, behoben).
- Druck (Edge headless): Bewertungsdialog mit aufgeklappten Abschnitten; Spalten korrekt.
- Repository-Suche: keine Namen von Kolleginnen und Kollegen außerhalb von `private/`/`resources/`.

### „Als Nächstes“ auf der Startseite [Claude, 2026-10-17]

- 38 Tests bestanden (neu: nächste Termine ab festem Datum, leere Liste am Schuljahresende).
- Browser-Prüfstand mit axe bestanden: Bereich „Als Nächstes“ mit höchstens drei Terminen,
  Link öffnet den Kalenderdialog.

### Kontosperre [Claude, 2026-10-17]

- 42 Tests bestanden (neu: nur Admins, keine Selbstsperre, Bann/`locked_at`/Audit beim Sperren
  und Entsperren, gesperrtes Konto bei geschützten Aktionen abgewiesen, abgelaufener Bann wirkt nicht).
- `tsc --strict` ohne Fehler; SQL-Prüfung mit Migration 0003 bestanden (Schüler können
  `locked_at` nicht ändern).
- Browser-Prüfstand mit axe bestanden: Sperren/Entsperren mit Rückfrage, Abbrechen ändert nichts.
- Smoke-Test lokal: „Kontosperre ohne Anmeldung (401)“ ergänzt.
- Nicht geprüft: Verhalten echter Supabase-Bans (z. B. ob `/auth/v1/user` `banned_until` liefert).

### Bildungsplan-Links [Claude, 2026-10-17]

- Der BK-2-Link aus OneNote (`/site/bildungsplan/…`) lieferte mehrfach HTTP 503. Dieselbe
  Dokumentnummer unter `/site/bildungsplan-rebrush2024/…` liefert ein PDF; dessen Titelseite
  („Kaufmännisches Berufskolleg II – Informatik“) wurde geprüft. Link ersetzt.
- `tools/link-check.mjs`: alle fünf externen Links HTTP 200. Ein Test verhindert den alten Pfad.
- Ausbildungsberufe mit Dokumentstand aus den OneNote-PDFs und Link zum KMK-Downloadbereich
  (Weiterleitung auf die aktuelle KMK-Adresse übernommen).

### Inhaltsdialoge auf dem Handy [Claude, 2026-10-17]

- Browser-Prüfstand: sieben Inhaltsdialoge bei 375 px mit aufgeklappten Abschnitten ohne seitlichen
  Überlauf. Sichtprüfung Kalender: Datum bricht nicht mehr um, Tabellen auf schmalen Bildschirmen
  kompakter.

### Suche im Inhalt [Claude, 2026-10-17]

- Im Browser: „Laufzettel“ → GFS, „Calibri“ → Praktikum, „Abitur“ → GFS und Kalender, „NAGOLD“ →
  Vertrag und Bewertung, Unsinn → 0. Browser-Prüfstand um „Laufzettel“ ergänzt und bestanden.

### Selbstprüfung auth.js [Claude, 2026-10-17]

- Befund 1: Ein Mail-Link, der in einem Tab mit bereits geöffnetem StartLab landet, ändert nur den
  Hash. Das Fragment wurde nicht ausgewertet und blieb mit Token in Adresszeile und Verlauf.
  Behoben (Auswertung auch bei `hashchange`). Prüfstand: `#error=…` und Recovery-Fragment im selben
  Dokument; Gegenprobe ohne Listener schlägt fehl.
- Befund 2: Lief eine Admin-Sitzung ab, blieb die Adminansicht mit Fehlermeldung stehen. Jetzt
  Wechsel zur Anmeldung; im Prüfstand mit widerrufener Sitzung bestanden.

### Tastenkürzel [Claude, 2026-10-17]

- Liste an die laut Inventar gelesenen Themen der Hotkey-Seite angeglichen; 43 Tests bestanden
  (neu: alle Themen enthalten). Browser-Prüfstand mit axe bestanden.

### Selbstprüfung app.js [Claude, 2026-10-17]

- Nur Kleinigkeiten: Pfeil in den Buttons von Station 01 für Screenreader ausgeblendet; `showDetail`
  öffnet den Dialog nur, wenn er noch nicht offen ist. Tests und Browser-Prüfstand mit axe bestanden.

Weiterhin nicht geprüft: echte Supabase-Datenbank, echte Bestätigungs- und Recovery-Mails,
Screenreader, Schul-PC, echte Mobilgeräte, Firefox/Safari.
