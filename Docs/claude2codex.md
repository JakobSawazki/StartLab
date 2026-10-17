# Übergabe Claude → Codex

[Claude, 2026-10-17] · Ergänzt `Docs/CLAUDE_HANDOFF.md`. Diese Datei ist so geschrieben, dass
Codex ohne den Chatverlauf weiterarbeiten kann. Sie wird nach jedem Arbeitsblock aktualisiert.

## 1. Arbeitsstand auf einen Blick

- **Git:** Alle Arbeiten sind **lokal auf `main` committet, nichts gepusht.** Ein Push nach
  `main` veröffentlicht die Website sofort (GitHub Pages) – nur nach Jakobs Freigabe.
  `git log --oneline 9946a19..HEAD` zeigt alle Claude-Commits.
- **Zusammenarbeit:** Jakob lässt derzeit nur Claude arbeiten, nicht parallel Codex. Wenn
  Codex übernimmt, ist der Arbeitsbaum sauber bis auf `Docs/CLAUDE_HANDOFF.md` (von Jakob,
  bewusst nicht committet – Jakob entscheidet, ob sie ins öffentliche Repository soll).
- **Konten:** Weiterhin deaktiviert (`config.js` → `apiUrl: ''`). Kein Supabase-Projekt.
- **Originale:** `resources/` (Jakobs OneNote-Exporte) und `private/` sind Git-ignoriert.
  Dateien nie veröffentlichen; Inhalte nur so übernehmen, wie in Abschnitt 4 beschrieben.

## 2. Was seit 0.1.0 dazugekommen ist

| Bereich | Stand | Details |
| --- | --- | --- |
| OneNote-Inhalte | Vorstellung, Vertrag/Regeln, Leistungsbewertung + Notenschlüssel, Praktikum BK1, GFS BG, Termine 2026/27, Bildungsplan-Links auf der Website | documentation.md 8.10, ONENOTE_INVENTAR.md |
| Konten (Code) | Kürzeltabelle einheitlich (Browser, Edge, SQL), Auth-E-Mail als Quelle, Mailfehler/Timeouts sauber, Abmeldung nach Passwortwechsel, Adminliste paginiert, Audit-Ansicht | documentation.md 8.1–8.9 |
| Datenbank | Migration 0002 (Kürzelfunktion, Mailabgleich-Trigger), 0003 (`locked_at`) | `supabase/migrations/` |
| Barrierefreiheit | Dialognamen, Fokus, Seitentitel, Kontraste, Skiplink, axe ohne Verstöße | documentation.md 8.2, 8.6 |
| Sicherheit | CSP, Schutztests gegen Geheimnisse/fehlende Build-Dateien | documentation.md 8.7 |
| Startseite | „Als Nächstes“: drei kommende Termine (Datum Europe/Berlin), Link zum Kalender | `ansicht.js` `naechsteTermine` |
| Suche | Materialsuche durchsucht auch Dialoginhalte („Treffer im Inhalt“) | `app.js` `contentText` |
| Links | BK-2-Link ersetzt (alter Pfad HTTP 503), KMK-Downloadbereich, `tools/link-check.mjs` | VERIFICATION.md |
| Einrichtung | `supabase/config.toml` mit Auth-Werten, Smoke-Test für die deployte Function | SUPABASE_SETUP.md |

## 3. Prüfbefehle

```sh
npm test            # 44 Unit-Tests (Kürzel, Backend simuliert, Inhalte, Build-Schutz)
npm run check       # Syntaxprüfung aller Website- und Werkzeugdateien
node tools/build.mjs
npm run serve       # http://127.0.0.1:4173
```

Optionale Werkzeuge, jeweils **außerhalb** des Projekts installiert (keine Projektabhängigkeit):

```sh
STARTLAB_PLAYWRIGHT=/pfad/node_modules/playwright-core STARTLAB_AXE=/pfad/node_modules/axe-core/axe.min.js node tools/browser-check.cjs
STARTLAB_PGLITE=/pfad/node_modules/@electric-sql/pglite node tools/sql-check.mjs
STARTLAB_API=https://REF.supabase.co/functions/v1/startlab STARTLAB_ORIGIN=https://jakobsawazki.github.io node tools/smoke-check.mjs
node tools/link-check.mjs   # externe Links (Netz nötig)
```

Claude nutzte playwright-core 1.48.2 (Browser: installiertes Microsoft Edge), axe-core 4.10.2,
@electric-sql/pglite 0.2.17 und für `tsc --strict` TypeScript 5.6.3 mit der Deklaration
`declare namespace Deno { const env:{get(k:string):string|undefined}; function serve(h:(r:Request)=>Response|Promise<Response>):void; }`.

## 4. Regeln für die Übernahme von OneNote-Inhalten (von Jakob bestätigt, Antwort 6)

- Inhalte ja, Dateien nein. Daten in `inhalte.js`, Darstellung in `ansicht.js`, neue Dateien in
  `tools/build.mjs` eintragen (der Build-Test meldet es sonst).
- Website duzt; Anleitungstexte anpassen, Regeln/Kriterien/Zahlen/Fristen wörtlich lassen.
- Keine Namen von Kolleginnen und Kollegen (Funktion nennen), keine Kontaktdaten, keine
  Formulare mit persönlichen Feldern, keine Logos/Bilder ohne geklärte Rechte, keine internen
  Konferenztermine. `tests/inhalte.test.mjs` prüft Teile davon automatisch.
- Zahlenwerte aus Excel per Skript erzeugen und einmal gegen die Quelle abgleichen; Unklares
  nicht „reparieren“, sondern Jakob fragen (Abschnitt 5).
- Lokale Auszüge zur Sichtung liegen in `private/extract/` (ignoriert).

## 5. Offene Rückfragen an Jakob (nicht eigenmächtig entscheiden)

1. `resources/2. Leistungsbewertung/BS.xlsx`: 17 Punkte → Note 5,5 (davor 16 → 5,2, danach
   18 → 5,1). Vermutlich Tippfehler; Tabelle deshalb nicht veröffentlicht. Welcher Schlüssel gilt
   für die Berufsschule – diese Tabelle oder der IHK-Schlüssel?
2. Der IHK-Schlüssel stammt von der IHK Hannover. Gilt er so für eure Klassen?
3. `Links.txt`: Der Link für BKFH ist identisch mit dem für BK 2 (deshalb kein eigener BKFH-Link
   auf der Seite). Außerdem war der BK-2-Link selbst gestört (HTTP 503); Claude hat ihn durch
   dieselbe Dokumentnummer unter `/site/bildungsplan-rebrush2024/` ersetzt (Inhalt geprüft).
4. Praktikum: Die OneNote-Seite zu deinen Klassen (Website-Präsentation) trägt Termine von
   2025/26. Gilt das Vorgehen 2026/27 unverändert? Auf der Website als „Stand 2025/26“ markiert.
5. Kalender 2026/27: Rosenmontag steht am 07.02.2027 (Sonntag), richtig wäre 08.02. Betrifft die
   Website nicht. Ferien sind im Kalender nicht als Text enthalten und fehlen deshalb.
6. Station 02: Die vier frei formulierten Gesprächsimpulse des ersten Entwurfs sind durch deine
   Vertragsregeln ersetzt. Die Gesprächsvorlage bleibt als ergänzendes Material – passt das?
7. Frage 21 in tasks.md: Kürzel für Namen ohne lateinische Buchstaben.
8. Weiterhin offen in tasks.md: Fragen 5, 7, 8, 9 (Klassen/Schuljahr, Verantwortung/SMTP,
   Registrierungsfreigabe, Löschfristen/weitere Admins).

## 6. Nächste sinnvolle Schritte

1. Tipps, Hotkeys und Kennenlern-Bingo: Originale fehlen in `resources/`. Jakob bot die
   OneNote-Desktop-App an, lehnte den Computerzugriff im Freigabedialog dann aber ab
   (17.10.2026) – nicht erneut anfragen. Besser: Jakob legt Exporte in `resources/` ab.
2. Nach Antworten auf Abschnitt 5 die betroffenen Daten in `inhalte.js` anpassen.
3. Supabase-Einrichtung nach SUPABASE_SETUP.md, sobald Jakob Projekt und SMTP bereitstellt;
   danach Smoke-Test und Funktionsabnahme (Abschnitt 6 der Anleitung, Punkte 1–12).
4. Kontosperre ist umgesetzt (`admin-lock`/`admin-unlock`, Migration 0003, Audit, keine
   Selbstsperre). Bei der echten Abnahme prüfen, ob `/auth/v1/user` `banned_until` liefert
   (Abnahmepunkt 13). Weiterer Ausbau: Einladung/Freigabe, MFA, Kontolöschung.
5. Weiterhin: Screenreader-Test, echte Mobilgeräte, Schul-PC (Aufgabe 17).

## 7. Besonderheiten im Code

- Die Kürzeltabelle existiert dreifach (`content.js`, Edge Function, Migration 0002); der Test
  vergleicht sie wortgleich. Änderungen immer an allen drei Stellen.
- Unsichtbarer Kontext in Buttons steht in Klammern („Bingo starten (Kennenlern-Bingo)“), weil
  Chromium sonst „Bingo starten : …“ vorliest. Tests suchen Buttons mit diesen Namen.
- Der Skiplink verhindert bewusst die Hash-Navigation (`#main` würde die Übersicht rendern).
- Tabellenbereiche in Dialogen sind fokussierbar und eindeutig benannt (axe-Regeln
  `scrollable-region-focusable`, `landmark-unique`).
- CSP in `index.html`: Bei einer eigenen Function-Domain `connect-src` anpassen; ein Test prüft,
  dass `apiUrl` zur CSP passt.
