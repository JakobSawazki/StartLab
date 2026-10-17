# StartLab – Projektdokumentation

Stand: **17. Oktober 2026 (Europe/Berlin)** · Release **0.1.0**

Mitwirkende: Jakob Sawazki, Codex, Claude. Einträge werden mit Autor und Datum geführt.
Struktur in Anlehnung an die Projektdokumentation von WorkbenchLab sowie die
Aufgabenliste von Excel-Lab; keine Übernahme historischer Protokolle.

Repository: https://github.com/JakobSawazki/StartLab

Vorgesehene Live-Adresse: https://jakobsawazki.github.io/StartLab/

## Wegweiser und aktueller Stand

| Thema | Stand / Ort |
| --- | --- |
| Projektziel | Motivierender gemeinsamer Einstieg und zentraler Ort für Organisation |
| Oberfläche | Responsive Website, ohne Framework und externe Schriftarten |
| Einstieg | Kennenlernen → Zusammenarbeit → Orientierung |
| Materialien | Suche, Filter, Status je Material; Neufassungen direkt druckbar |
| Originale aus OneNote | Inventar begonnen, Anhänge noch nicht exportiert oder geprüft |
| Startfortschritt | Vier lokale Häkchen, ohne Namen; kein Cloud-Lernstand |
| Konten | Code vorbereitet und von Claude geprüft/nachgebessert (Abschnitt 8), noch kein produktiver Supabase-Dienst |
| Administration | Servergeprüfte Rolle, Kontenübersicht, Reset-Link und Audit vorbereitet |
| Offene Aufgaben / Antworten | [tasks.md](tasks.md) |
| Einrichtung | [SUPABASE_SETUP.md](SUPABASE_SETUP.md) |
| Materialienübernahme | [ONENOTE_INVENTAR.md](ONENOTE_INVENTAR.md) |

## 1. Auftrag und didaktisches Konzept [Codex, 2026-10-17]

StartLab soll den organisatorischen OneNote-Bereich übersichtlicher machen und
die Lab-Familie ergänzen. Die Startseite leitet durch drei Stationen. Die Sprache
lädt zum Ankommen ein; Kennenlernen erfordert keine persönlichen Offenbarungen.
Ein Bingo fördert Gespräche, ein Steckbrief und eine Lernvereinbarung lassen
sich drucken. Vereinbarungen werden mit der Klasse und Lehrkraft besprochen.

Die Website behauptet keine unbekannten Bewertungsregeln und bindet noch keine
unzugeordneten Bildungspläne ein. Neue Vorlagen ersetzen nicht stillschweigend
die Originale. Termine, Praktikums- und GFS-Vorgaben bleiben bis zur Sichtung offen.

## 2. Technische Architektur [Codex, 2026-10-17]

Öffentlicher Quellcode und die statische Website liegen auf GitHub / Pages.
Die Veröffentlichung verwendet ausschließlich die Dateiliste in `tools/build.mjs`.
Die Backendvorbereitung besteht aus einer PostgreSQL-Migration und einer
Supabase Edge Function; keine zusätzlichen JavaScript-Laufzeitpakete nötig.

Browser → Edge Function → Supabase Auth / PostgreSQL. Die Kürzelauflösung findet
serverseitig statt und gibt keine E-Mail-Adresse an anonyme Aufrufer zurück.
Aufrufe haben Größenlimits, feste erlaubte Aktionen, Herkunftsprüfung und
Datenbanklimits pro Aktion und gehashtem Identifikator. CORS allein ist kein
Zugriffsschutz; jede privilegierte Aktion prüft das Auth-Token und die Adminrolle.

## 3. Registrierung und Datenmodell [Codex, 2026-10-17]

Erfasst werden Vorname, Nachname und E-Mail. Ein separates Passwort wird nur an
Supabase Auth übermittelt, nie als Profilfeld gespeichert. Profile enthalten
UUID, Kürzel, Vorname, Nachname, E-Mail und Anlagedatum. Klassen und Schuljahre
sind spätere Erweiterungen, keine bereits implementierten Felder.

Ein Datenbanktrigger erzeugt das Kürzel aus den ersten drei normalisierten
Buchstaben jedes Namens: `Jakob Sawazki` → `jaksaw`, `Max Müller` → `maxmue`.
Umlaute werden vor dem Kürzen umgeschrieben. Kurze Namen bleiben kurz.
Kollisionen erhalten eine fortlaufende Zahl ab 2. Transaktionssperre und UNIQUE
verhindern doppelte Kürzel auch bei paralleler Registrierung. Namen ohne mindestens
zwei unterstützte lateinische Buchstaben benötigen eine spätere alternative
Kürzelvergabe. E-Mail-Anmeldung dient auch zum Nachschlagen des eigenen Kürzels.

E-Mail-Bestätigung ist vor produktiver Nutzung verpflichtend. Passwörter haben
mindestens 12 Zeichen. Die Sitzungskennung bleibt nur im Arbeitsspeicher des
Browsers, nicht im LocalStorage; nach Neuladen ist eine neue Anmeldung nötig.
Abmelden widerruft die Supabase-Sitzung. Es gibt noch keine automatische Erneuerung.

## 4. Rollen, Zurücksetzung und Schutz [Codex, 2026-10-17]

RLS schützt alle Anwendungstabellen. Angemeldete Personen dürfen direkt nur
ihr eigenes Profil lesen; Änderungen und vollständige Übersichten erfolgen
über das Backend. Die Tabelle `administrators` ist nicht durch Schüler änderbar.
Die erste Adminrolle wird gezielt im Supabase-Dashboard vergeben.

„Passwort vergessen“ sendet an die Kontoadresse. Die Antwort verrät nicht,
ob diese Adresse registriert ist. Nach Klick auf einen gültigen Recovery-Link
kann die Person selbst ein neues Passwort festlegen. Administratoren können
denselben Wiederherstellungsprozess für ein ausgewähltes Konto auslösen;
dies wird ohne Passwort im Audit protokolliert. Es gibt kein auslesbares Passwort
und keine vom Lehrer zu verteilenden Dauerpasswörter. Ohne Zugriff auf das
E-Mail-Postfach ist eine gesonderte Identitätsprüfung und ein dokumentierter
administrativer Wiederherstellungsprozess nötig; dieser ist noch nicht umgesetzt.

## 5. Daten und Betrieb [Codex, 2026-10-17]

Vor produktiver Einführung: Dienstverantwortung, schulische Freigabe, Region,
Auftragsverarbeitung, Datenschutzhinweise, Löschfristen, SMTP-Versand und
Zugriffsberechtigungen konkret festlegen. Das ist keine abgeschlossene rechtliche
Prüfung. Region EU vorbereiten; keine automatische Zusicherung vollständiger
EU-Datenhaltung allein durch diese Regionswahl.

Keine Schülernamen, Klassenlisten, Noten, Fehltage, ausgefüllten Formulare oder
SMTP-/Service-Schlüssel ins öffentliche Repository übernehmen. Öffentliche
Materialien sind auch ohne Anmeldung abrufbar; ein versteckter Link oder ein
Login vor einer statischen Datei schützt diese Datei nicht. Geschützte spätere
Dokumente benötigen privaten Storage und servergeprüften Zugriff.

Backups, Wiederherstellungstest, Kontolöschung zum festgelegten Zeitpunkt und
protokollierte Adminvorgänge gehören zum Betrieb. Beim Löschen eines Auth-Kontos
entfernt die Datenbank zugehöriges Profil und Adminrolle per Fremdschlüssel.
Ein eigener Löschdialog, Klassenfreigaben, Kontosperren und MFA-Oberfläche stehen
noch auf der Aufgabenliste.

## 6. Prüfung und Grenzen [Codex, 2026-10-17]

Prüfungen und Ergebnisse stehen ergänzend im Prüfprotokoll
[VERIFICATION.md](VERIFICATION.md). Die produktive Datenbank, Migration,
E-Mail-Bestätigung und Recovery-Mails müssen nach dem Anlegen des Dienstes
mit getrennten Testkonten abgenommen werden. Die vorbereiteten Kontofunktionen
sind ohne diese Abnahme nicht als produktionsbereit zu verstehen.

## 7. Arbeitsprotokoll [Codex, 2026-10-17]

1. WorkbenchLab-Dokumentation und Excel-Lab-Aufgabenformat gesichtet.
2. OneNote-Abschnitt, Unternehmen und Leistungsbewertung gesichtet; Tipps,
   Hotkeys und Bildungspläne gelesen, Praktikumsbereich geöffnet.
3. StartLab-Oberfläche und eigene Einstiegsvorlagen erstellt.
4. Supabase auf Jakobs ausdrückliche Auswahl hin vorbereitet.
5. Öffentliches Repository erstellt und auf GitHub Pages veröffentlicht;
   erfolgreicher Workflow und HTTP-200-Antwort im Prüfprotokoll festgehalten.

## 8. Bestandsprüfung und erster Verbesserungsblock [Claude, 2026-10-17]

Grundlage: `Docs/CLAUDE_HANDOFF.md`, alle dort genannten Dokumente sowie
`auth.js`, Edge Function, Migration, `app.js`, `styles.css` und Tests. Es gab
keine fremden lokalen Änderungen außer der ungetrackten Übergabedatei.
Supabase ist weiterhin **nicht** eingerichtet; alle Kontoprüfungen laufen gegen
simulierte Antworten bzw. ein lokales Schein-Backend (nicht im Repository).

### 8.1 Befunde Kontenarchitektur und Behebung

| Befund | Behebung |
| --- | --- |
| Kürzelbildung in Website (NFD, alle Akzente) und SQL (kurze Liste) wich ab, z. B. `Šimon` → `sim` bzw. `imo`; zerlegte Umlaute (macOS) ergaben `a` statt `ae` | Eine gemeinsame Zeichentabelle in `content.js`, Edge Function und neuer Migration `202610170002_startlab_accounts.sql`, jeweils mit NFC-Normalisierung; ein Test vergleicht die drei Stellen wortgleich |
| Kürzel-Login und Admin-Reset nutzten `profiles.email`, das nach einer Mailänderung veraltet | Edge Function liest die bestätigte Adresse aus Supabase Auth (`/auth/v1/admin/users/{id}`); zusätzlich Trigger `startlab_email_changed` gleicht `profiles.email` ab |
| „Passwort vergessen“ verschluckte Versandfehler vollständig | Antwort bleibt neutral (keine Kontoexistenz), der Fehler wird ohne Adresse, Kürzel oder ID als `recover_failed` mit Statuscode protokolliert |
| Admin-Reset meldete Mailausfall als allgemeinen Eingabefehler, Audit nur bei Erfolg | Admin erhält eine klare Versandfehlermeldung (502/429); Audit `password_reset_failed` bzw. `password_reset_requested` |
| Alle Supabase-Fehler wurden zu 400; Ratenlimit beim Login erschien als „falsches Passwort“ | Statusklassen bleiben erhalten (429, 502); Login meldet nur echte Ablehnungen als 401 |
| Ungültiges JSON / `null` / Array im Request führte zu 500 | 400 „Ungültige Anfrage.“ vor jedem Backendzugriff |
| Namen ohne zwei lateinische Buchstaben scheiterten erst im Trigger mit unklarer Meldung | Edge Function und Formular prüfen vorab und verweisen ehrlich an die Lehrkraft (alternative Kürzelvergabe bleibt offen); Steuerzeichen in Namen abgewiesen (Edge und Trigger) |
| Passwortwechsel ließ andere Sitzungen bestehen | Nach dem Wechsel `logout?scope=global`; die Oberfläche meldet ab und bittet um neue Anmeldung |
| Abgelaufene/benutzte Links (`#error=…&error_code=otp_expired`) wurden still ignoriert | Fragment wird entfernt, Dialog „Passwort vergessen?“ mit Erklärung geöffnet |
| Manipuliertes oder abgelaufenes Token blieb im Speicher | Sitzung speichert Ablaufzeit; bei 401 oder Ablauf wird sie verworfen, der Kopfbereich zeigt wieder „Anmelden“ |

Geprüft ohne Änderungsbedarf: RLS und `revoke` auf allen vier Tabellen,
keine Grants für `anon`/`authenticated` auf Funktionen, Adminrolle nur über
`administrators` (keine Selbstvergabe, nicht aus Metadaten), parallele
Kürzelvergabe per Advisory-Lock plus UNIQUE, Herkunftsprüfung vor jedem
Backendzugriff, kein Passwort im Profil oder Audit, Token nur im Arbeitsspeicher.

Bekannte Grenzen (dokumentiert, nicht behoben):

- Die Registrierungssperre per `REGISTRATION_ENABLED` sperrt den öffentlichen
  Auth-Endpunkt nicht; dafür bleibt „Allow new users to sign up“ im Dashboard
  maßgeblich. Direkte Registrierungen dort umgehen die Edge-Vorprüfung, der
  Trigger prüft Namen aber weiterhin.
- Ein Kürzel-Login für ein existierendes Kürzel macht eine Anfrage mehr als für
  ein unbekanntes; über Antwortzeiten ist die Existenz eines Kürzels erkennbar.
  Kürzel sind aus Namen ableitbar und gelten deshalb nicht als geheim.
- Registrierung meldet einen Mailausfall als 502. Bei defektem SMTP kann das in
  Einzelfällen anzeigen, dass eine Adresse noch nicht registriert ist; dafür
  wartet niemand auf eine Bestätigungsmail, die nie kommt.
- Anfragelimits zählen pro Identifikator und global, nicht pro IP.
- Die Migrationen und Trigger sind nicht gegen ein echtes PostgreSQL/Supabase
  ausgeführt worden.

### 8.2 Bedienbarkeit und Barrierefreiheit

- Dialoge haben einen zugänglichen Namen (`aria-labelledby` auf die Überschrift).
- Nach jedem Ansichtswechsel im Kontodialog liegt der Fokus auf der neuen
  Überschrift; Fehleingaben setzen den Fokus auf das betroffene Feld und nennen
  den Grund im Statusbereich. Umschalter „Anmelden/Registrieren“ zeigen den
  aktiven Zustand (`aria-pressed`). Passwortregel per `aria-describedby`.
- Registrierung zeigt vorab das voraussichtliche Kürzel bzw. einen Hinweis,
  wenn das automatische Kürzel nicht gebildet werden kann.
- Kopfbutton zeigt „Mein Konto“ bei aktiver Sitzung; Profil erklärt das
  Verhalten auf gemeinsam genutzten Rechnern; Passwort kann nach Anmeldung
  geändert werden. Adminliste: Spaltenköpfe mit `scope`, eindeutige
  Button-Namen je Konto, Rückfrage vor dem Reset.
- Seitentitel je Ansicht (WCAG 2.4.2), Filtergruppe mit `role="group"`,
  Trefferanzahl der Materialsuche als Statusmeldung, Linktexte wie
  „Entdecken“ und „Stand ansehen“ mit unsichtbarem Kontext.
- Bingo: auf allen Bildschirmgrößen 4 × 4 (vorher mobil 2 Spalten, wodurch
  „vier in einer Reihe“ nicht passte), weiche Trennstellen in langen Wörtern,
  Statusmeldung zu markierten Feldern und vollständigen Reihen.
- Kontraste: `--muted` von `#677572` auf `#5b6966` (vorher 4,2:1 auf getönten
  Flächen, jetzt ≥ 4,98:1); Eingabefeldränder von 1,8–1,9:1 auf 3,45:1.
- Druck: Ohne geöffneten Dialog wurde bisher eine leere Seite gedruckt. Jetzt
  druckt jede Seite ihren Inhalt ohne Navigation und Bedienelemente; geöffnete
  Vorlagen drucken oben ausgerichtet ohne Abdunklung.

### 8.3 Nicht verändert

Keine Inhalte zu Bewertung, Fristen, Bildungsplänen, Praktikum oder GFS
ergänzt; Statusanzeigen für fehlende OneNote-Originale unverändert. Keine
Versionsnummer erhöht, nichts veröffentlicht oder committet.

### 8.4 Zweiter Block [Claude, 2026-10-17]

- Adminliste: seitenweise je 100 Konten mit stabiler Sortierung (neueste zuerst,
  dann ID); ungültige Seitenangaben werden abgewiesen. Damit entfällt die harte
  Grenze von 500 Konten.
- Browser-Prüfstand erweitert (siehe VERIFICATION.md). Der Kontodienst wird im
  Test per `page.route` simuliert; es entsteht keine scheinbar echte Registrierung
  im Browser und keine Anfrage an einen echten Dienst.
- Unsichtbarer Kontext in wiederholten Button- und Linktexten steht in Klammern,
  damit Screenreader „Stand ansehen (Leistungsbewertung)“ statt „Stand ansehen : …“ lesen.

### 8.5 SQL-Prüfung mit PGlite [Claude, 2026-10-17]

`tools/sql-check.mjs` führt beide Migrationen in PGlite aus und prüft Kürzelregel
(gleich `content.js`), Kollisionen, Namensprüfung, Mailabgleich, RLS und Rechte,
Ratenlimit sowie die Löschkaskade. Die Stubs bilden nur die benötigten Teile von
Supabase nach, einschließlich der Default-Grants für `anon`/`authenticated`, damit
fehlende `revoke`-Anweisungen auffallen. PGlite ist wie Playwright keine
Projektabhängigkeit. Die reale Abnahme in Supabase ersetzt das nicht.

### 8.6 Barrierefreiheits-Audit [Claude, 2026-10-17]

Automatisches axe-Audit über alle Ansichten und Dialoge in Desktop- und
Handybreite; der Hinweiskasten der Startseite ist kein verschachteltes `aside`
mehr. Der Skiplink springt jetzt zum Inhalt, ohne die Route zu wechseln (vorher
führte er von jeder Unterseite zur Übersicht). Beides ist im Browser-Prüfstand
abgesichert.

### 8.7 Content-Security-Policy [Claude, 2026-10-17]

`index.html` setzt eine CSP: keine fremden Skripte, Styles, Formularziele oder
Basis-URLs; Netzwerkzugriffe nur zur eigenen Herkunft und zu `*.supabase.co`.
Das begrenzt die Folgen einer möglichen HTML-Einschleusung. GitHub Pages erlaubt
keine eigenen HTTP-Header; `frame-ancestors` ist per Meta-Tag nicht wirksam.

### 8.8 Zeitlimits und Verbindungsfehler [Claude, 2026-10-17]

Die Website bricht Kontoanfragen nach 20 Sekunden ab und meldet Offline- und
Zeitüberschreitungen verständlich auf Deutsch, statt dauerhaft „Bitte kurz
warten …“ oder die englische Browsermeldung anzuzeigen. Die Edge Function
begrenzt jeden Supabase-Aufruf auf 10 Sekunden und antwortet dann mit 502; das
Log enthält nur Pfad und Ereignis.

### 8.9 Audit-Ansicht [Claude, 2026-10-17]

Administratoren sehen im Kontodialog die letzten 100 Verwaltungsvorgänge
(Zeitpunkt in Berliner Zeit, Vorgang, ausführendes und betroffenes Kürzel). E-Mail-
Adressen werden nicht ausgegeben; Einträge zu inzwischen gelöschten Konten zeigen
„gelöschtes Konto“, weil die Datenbank die Verweise beim Löschen leert.

### 8.10 Übernahme der OneNote-Inhalte [Claude, 2026-10-17]

Auf Jakobs Wunsch (Antwort 6) sind die Inhalte aus `resources/` in die Website übernommen,
nicht die Dateien. Daten stehen in `inhalte.js`, die Darstellung in `ansicht.js`; `app.js`
öffnet sie in den Materialdialogen (alle druckbar, zugeklappte Abschnitte öffnen sich beim Drucken).

- Station 02 zeigt jetzt das Unternehmen Black-Forest-Industry mit NAGOLD, Eckdaten und den
  zehn Regeln aus dem Vertrag. Die vier frei formulierten Gesprächsimpulse des ersten Entwurfs
  sind entfallen; die Gesprächsvorlage bleibt als ergänzendes Material („StartLab-Entwurf“).
- Anrede: Die Originale siezen, StartLab duzt durchgängig. Anleitungstexte sind angepasst;
  Regeln, Kriterien, Prozentwerte und Fristen sind wörtlich übernommen.
- Notenschlüssel BG und BK sind per Skript aus den Excel-Dateien erzeugt (Prozentbänder), der
  IHK-Schlüssel aus dem PDF. Tests prüfen Lückenlosigkeit und Monotonie.
- Termine: nur schülerrelevante Einträge aus Schulkalender, J1 und J2 (107), maschinell gegen
  die Excel-Zellen abgeglichen. Interne Konferenzen, Deputats- und Lehrertermine fehlen bewusst.
- Datenschutz: keine Namen von Kolleginnen und Kollegen (Funktionen statt Namen), keine
  Formularfelder für persönliche Daten, keine Bilder/Logos. Ein Test erlaubt als namentliche
  Anrede nur „Herr Sawazki“ und verbietet E-Mail-Adressen und Telefonnummern in den Inhalten.
- Barrierefreiheit: Tabellenbereiche sind fokussierbar und eindeutig benannt (axe fand sonst
  auf dem Handy nicht per Tastatur scrollbare Bereiche), Kalenderfilter mit Statusmeldung.

### 8.11 Startseite: „Als Nächstes“ [Claude, 2026-10-17]

Die Übersicht zeigt die nächsten drei Termine aus dem Kalender 2026/27 (ab dem heutigen Datum
in Europe/Berlin) und verlinkt den vollständigen, filterbaren Kalender. Nach dem letzten Termin
erscheint ein Hinweis statt einer leeren Liste; für 2027/28 braucht es neue Kalenderdaten.

### 8.12 Kontosperre [Claude, 2026-10-17]

Administratoren können Konten sperren und entsperren. Technisch ist das ein Bann in Supabase
Auth (keine Anmeldung, keine Sitzungsverlängerung); zusätzlich weist die Edge Function Konten
mit aktivem `banned_until` bei jeder geschützten Aktion ab. `profiles.locked_at` (Migration
0003) spiegelt den Zustand für die Adminliste. Das eigene Konto kann nicht gesperrt werden, damit
sich der letzte Admin nicht aussperrt. Jeder Vorgang wird auditiert.

### 8.13 Suche im Inhalt [Claude, 2026-10-17]

Die Materialsuche durchsucht neben Titel und Beschreibung auch den Text der Dialoge (einmalig
beim ersten Suchen aufgebaut). Treffer nur im Inhalt sind mit „Treffer im Inhalt“ markiert.
