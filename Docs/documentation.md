# StartLab – Projektdokumentation

Stand: **17. Oktober 2026 (Europe/Berlin)** · Release **0.2.0**

Mitwirkende: Jakob Sawazki, Codex, Claude. Einträge werden mit Autor und Datum geführt.
Struktur in Anlehnung an die Projektdokumentation von WorkbenchLab sowie die
Aufgabenliste von Excel-Lab; keine Übernahme historischer Protokolle.

Repository: https://github.com/JakobSawazki/StartLab

Live-Adresse: https://jakobsawazki.github.io/StartLab/

## Wegweiser und aktueller Stand

| Thema | Stand / Ort |
| --- | --- |
| Projektziel | Motivierender gemeinsamer Einstieg und zentraler Ort für Organisation |
| Oberfläche | Responsive Website, ohne Framework und externe Schriftarten |
| Einstieg | Kennenlernen → Zusammenarbeit → Orientierung |
| Materialien | Suche, Filter, Status je Material; Neufassungen direkt druckbar |
| Originale aus OneNote | Mehrere Bereiche aus lokalen Exporten integriert; Originaldateien bleiben ignoriert; Inhaltsrückfragen und fehlende Bingo-/Tipps-Originale offen |
| Startfortschritt | Vier lokale Häkchen, ohne Namen; kein Cloud-Lernstand |
| Konten | In echter lokaler Supabase-Integration geprüft; gehosteter Dienst und produktive Registrierung weiterhin nicht eingerichtet |
| Administration | TOTP-geschützte Kontenübersicht, Reset, Sperren, Löschung und Audit im lokalen Supabase-Teststack geprüft |
| Integration | [Temporärer Supabase-Stack mit Testpostfach](INTEGRATION_TEST.md), Prüfergebnisse in VERIFICATION.md |
| Offene Aufgaben / Antworten | [tasks.md](tasks.md) |
| Einrichtung | [SUPABASE_SETUP.md](SUPABASE_SETUP.md) |
| Materialienübernahme | [ONENOTE_INVENTAR.md](ONENOTE_INVENTAR.md) |

## 1. Auftrag und didaktisches Konzept [Codex, 2026-10-17]

StartLab soll den organisatorischen OneNote-Bereich übersichtlicher machen und
die Lab-Familie ergänzen. Die Startseite leitet durch drei Stationen. Die Sprache
lädt zum Ankommen ein; Kennenlernen erfordert keine persönlichen Offenbarungen.
Ein Bingo fördert Gespräche, ein Steckbrief und eine Lernvereinbarung lassen
sich drucken. Vereinbarungen werden mit der Klasse und Lehrkraft besprochen.

Die Website verwendet die bereits gesichteten organisatorischen Inhalte,
Bewertungsinformationen, Termine, Praktikums-/GFS-Vorgaben und Bildungsplanlinks.
Unklare Zuordnungen, Quellenabweichungen und der teilweise ältere Praktikumsstand
sind als Rückfragen dokumentiert. Neufassungen ersetzen Originale nicht stillschweigend.

## 2. Technische Architektur [Codex, 2026-10-17]

Öffentlicher Quellcode und die statische Website liegen auf GitHub / Pages.
Die Veröffentlichung verwendet ausschließlich die Dateiliste in `tools/build.mjs`.
Die Backendvorbereitung besteht aus vier geordneten PostgreSQL-Migrationen und einer
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
Kontosperren, bestätigter Löschdialog und Admin-TOTP sind implementiert.
Klassenfreigaben, automatische Löschfristen, Betriebs-Backups sowie die gehostete
Konfiguration und Abnahme der Kontofunktionen sind noch offen.

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

### 8.14 Selbstprüfung der Kontooberfläche [Claude, 2026-10-17]

Zwei Lücken behoben: Bestätigungs- und Reset-Links werden auch ausgewertet, wenn sie in einem
Tab mit bereits geöffnetem StartLab landen (nur Hash-Wechsel, kein Neuladen); das Token
verschwindet sofort aus Adresszeile und Verlauf. Eine abgelaufene oder widerrufene
Admin-Sitzung führt zur Anmeldung statt zu einer stehen gebliebenen Adminansicht.
README auf den aktuellen Stand gebracht.

### 8.15 Tastenkürzel [Claude, 2026-10-17]

Die Liste steht jetzt als Daten in `inhalte.js` (`tastenkuerzel`) und deckt die Themen der
OneNote-Seite „Hotkeys“ ab (Kopieren, Ausschneiden, Einfügen, Screenshot, Desktop, Zoom). Es
bleibt eine StartLab-Neufassung mit Windows-Standardkürzeln, bis das Original vorliegt.

## 9. Nachprüfung und Sitzungsabsicherung [Codex, 2026-10-17]

Claudes Stand einschließlich der neuen Inhalte und Kontoverwaltung übernommen.
Die bestehende Auth-Abfrage wurde um einen expliziten Sitzungsabgleich ergänzt:
Nach Prüfung des Tokens durch Auth werden dessen Sitzungs-ID und die bestätigte
Benutzer-ID gemeinsam in der Datenbank geprüft. Migration 0004 berücksichtigt
`auth.sessions`, die E-Mail-Bestätigung, den Auth-Bann und `profiles.locked_at`.
Die RLS-Regel für eigene Profile nutzt denselben Abgleich auch bei direktem
PostgREST-Zugriff. Es entstehen keine öffentlich lesbaren Sitzungstabellen.

Damit hängt die Wirkung von Abmeldung und Sperren nicht nur vom Ablauf eines
bereits ausgestellten Tokens oder von `banned_until` in der User-API-Antwort ab.
Die Grundlage ist Supabases dokumentierte Empfehlung zum Abgleich mit
[`auth.sessions`](https://supabase.com/docs/guides/auth/sessions).

Ein Dienstausfall bei der Identitäts-/Sitzungsprüfung bleibt als solcher erkennbar
(502/429), statt als falsche Anmeldung dargestellt zu werden. Beim Passwortwechsel
wird ein Fehler der globalen Abmeldung nicht mehr verschluckt: Die Person erhält
die Bestätigung des Passwortwechsels und einen ausdrücklichen Hinweis, dass die
Abmeldung anderer Geräte nicht bestätigt werden konnte; lokal wird abgemeldet.

Die Funktion bleibt deaktiviert, bis alle vier Migrationen und die echte
Supabase-Abnahme einschließlich Recovery-Sitzungen abgeschlossen sind.

## 10. Kontolöschung und verzögerte Antworten [Codex, 2026-10-17]

Die vorbereitete Adminoberfläche enthält einen eigenen Löschbereich. Vor dem
Absenden muss das Kürzel des gewählten Kontos eingegeben werden. Abbrechen und
falsche Eingabe erzeugen keinen Löschaufruf. Der Server verlangt aktuelle
Sitzung und Adminrolle, gültige Ziel-ID, das passende Kürzel und ein Zielkonto
ohne Adminrolle. Eigenes Konto und alle Administratorkonten sind auf diesem
Weg nicht löschbar. Ein zielbezogenes Limit begrenzt Wiederholungsversuche.

Vor dem Auth-Hard-Delete wird der Auftrag im Audit gespeichert. Schlägt das
fehl, wird nicht gelöscht. Nach erfolgreicher Löschung werden die vorhandenen
Fremdschlüssel genutzt: Profil und Sitzungen entfallen; Auditbezüge zum
Zielkonto werden null. Ein Abschlussereignis enthält keine Kopie von Namen,
E-Mail oder Kürzel. Kann die Löschung wegen eines Dienstausfalls nicht bestätigt
werden, meldet der Server diesen unklaren Zustand und wiederholt nicht
automatisch. Schlägt nur das Abschlussprotokoll fehl, bestätigt die Antwort die
tatsächliche Löschung samt Hinweis auf den fehlenden Abschlussnachweis.

Keine echten Konten wurden angelegt oder gelöscht. Einrichtungs- und
Abnahmevoraussetzungen bleiben bestehen. Die Funktion ersetzt keine geregelte
Löschfrist, keinen Backup-Löschprozess und keine Datenbereinigung in später
hinzukommenden Diensten. Storage-Eigentum kann die Auth-Löschung blockieren;
solche Dateien werden nicht automatisch entfernt.

Zusätzlich ordnet die Oberfläche asynchrone Antworten ihrer ursprünglichen
Kontoansicht zu. Antworten auf bereits geschlossene oder ersetzte Dialoge
ändern die aktuelle Ansicht nicht. Eine verspätete 401 einer alten Sitzung
verwirft keine inzwischen neu angemeldete Sitzung. Parallel gestartete
Ladevorgänge erzeugen keine doppelten Zeilen in der Kontenliste. Der gezielte
Browserprüfstand `tools/account-races.cjs` verwendet dafür kontrolliert
verzögerte simulierte Antworten.

## 11. Echte lokale Supabase-Integration [Codex, 2026-10-17]

Der Workflow `Supabase integration` prüft die Kontoabläufe mit echten lokalen
Supabase-Komponenten auf einem temporären GitHub-Runner. Alle vier Migrationen
werden auf dessen PostgreSQL-Datenbank angewandt; die Edge Function läuft im
Supabase-Runtime-Container. Auth-Mails landen ausschließlich im lokalen Mailpit.
Es werden keine gehosteten Projekte, echten Personen oder externen SMTP-Dienste
verwendet. Die Testwerkzeuge verweigern gehostete Ziele.

Nach dem ersten erfolgreichen Lauf wurde die Prüfung um gleichzeitige
Registrierungen identischer Namen und eine administrativ bestätigte
Auth-Mailänderung ergänzt. Lauf 39033467128 (Commit `0477baa`) hat zehn
Prüfgruppen bestanden, einschließlich direkter RLS-/Rechteprüfungen, Recovery,
Widerruf offener Sitzungen, Sperren und Kontolöschung. Der Stack wurde anschließend
beendet. Einzelheiten und Grenzen: VERIFICATION.md und INTEGRATION_TEST.md.

Die Kontoabläufe sind damit über die vorherigen simulierten Prüfungen hinaus
integriert geprüft. Die spätere gehostete Umgebung mit ihren eigenen Einstellungen,
SMTP-Zustellung, Berechtigungen und schulischen Vorgaben muss weiterhin abgenommen
werden. Die produktive Registrierung bleibt geschlossen. Die Projektkonfiguration
enthält jetzt auch die von der CLI verlangte lokale `project_id`.

## 12. Sicherung/Wiederherstellung im Teststack [Codex, 2026-10-17]

Der Integrationstest sichert jetzt auch die Auth- und Anwendungsdaten per
`pg_dump` im temporären Datenbankcontainer, leert die erfassten Tabellen und
stellt sie in einer Transaktion wieder her. Dumpdaten verlassen den
Arbeitsspeicher des Prüfprozesses nicht. Die Wartungsrolle `supabase_admin`
wird nur für diesen lokalen Restore verwendet; App-Rechte bleiben unverändert.

Profile, Adminrollen und Audit wurden vor/nach Restore identisch geprüft.
Anmeldung mit dem bestehenden Passwort sowie Admin- und RLS-Rechte funktionieren
danach; die weiteren Kontoabläufe sind im selben Lauf ebenfalls bestanden.
Nach dem Commit ist der transaktionslokale Wartungsmodus beendet. Lauf
39034370695 für `70dece7` hat elf Integrationsgruppen bestanden.

Das ersetzt keine betriebliche Sicherung. Verfahren, geschützter Aufbewahrungsort,
Fristen, Zuständigkeiten und Wiederanlauf des gehosteten Projekts fehlen weiterhin.
Bei echtem Restore müssen insbesondere alte Sitzungen und zwischenzeitlich
erfolgte Löschungen/Sperren behandelt werden. Siehe BACKUP_RESTORE.md.

## 13. Zweiter Faktor für Administratoren [Codex, 2026-10-17]

Sämtliche Verwaltungsaktionen verlangen jetzt zusätzlich zur aktiven Sitzung
und Adminrolle eine von Supabase Auth bestätigte AAL2-Sitzung und einen aktuell
bestätigten TOTP-Faktor. Ohne Bestätigung sind Kontenliste, Audit, Reset,
Sperren/Entsperren und Löschung gesperrt. Die Schüleranmeldung bleibt unverändert.

Der Kontodialog ermöglicht die erste Einrichtung per QR-Code oder manuellem
Schlüssel sowie die Bestätigung eines aktuellen Codes bei erneuter Anmeldung.
Der SVG-QR-Code wird als Bild eingebunden, nicht als aktiver SVG-DOM-Inhalt.
Schlüssel und Codes werden nicht gespeichert oder protokolliert; die Oberfläche
entfernt Einrichtungsschlüssel beim Schließen bzw. erfolgreichen Bestätigen.
Ein bestätigter Faktor kann mit Passwort/Recovery-Link allein nicht ersetzt
werden. Faktorverlust benötigt einen gesonderten Wiederherstellungsprozess.

Backendtests und Browserprüfung einschließlich axe sind bestanden. Der echte
lokale Supabase-Lauf 39035260660 (Code `e3408c2`) bestätigt die MFA-Pflicht,
Einrichtung, Ablehnung falscher Codes, AAL2-Freigabe und erneute Bestätigung nach
Login/Restore; insgesamt zwölf Integrationsgruppen. Einzelheiten: ADMIN_MFA.md.
Die Freischaltung und App-Bedienung im gehosteten Projekt sind weiterhin offen.

### 8.16 Datenschutz-Bestandsaufnahme [Claude, 2026-10-17]

`Docs/DATENSCHUTZ_ENTWURF.md` beschreibt, welche Daten die Website ohne Konto und die
vorbereiteten Konten verarbeiten (aus dem Code abgeleitet), welche Rechte technisch schon
umsetzbar sind und welche Entscheidungen vor der Aktivierung fehlen. Keine Rechtsberatung;
der Dialog „Datenschutz & Speicherung“ bleibt bis zur Klärung unverändert.

### 8.17 Neues Design und Dunkelmodus [Claude, 2026-10-17]

Auf Jakobs Wunsch („edel, professionell“) wurde `styles.css` vollständig auf Design-Variablen
umgestellt. Typografie: Überschriften in einer Systemserifenschrift (Iowan/Palatino/Georgia),
Text in der Systemschrift; keine externen Schriften (CSP, Datenschutz). Farben: Elfenbein,
Waldgrün, Messing; im Dunkelmodus warmes Anthrazit mit hellem Grün. Strichsymbole ersetzen die
Emoji, die Startseite nutzt eine ruhige Karte statt gedrehter Elemente. `theme.js` (klassisches
Skript, vor dem ersten Zeichnen) setzt das Theme: gespeicherte Wahl (`startlab.theme`) oder
Systemeinstellung; Umschalter mit `aria-pressed` in der Kopfzeile. Wird `index.html` als lokale
Datei geöffnet, erklärt die Seite, wie man sie ansieht, statt leer zu bleiben. Druck ist immer
schwarz auf weiß.

### 8.18 Eigene Seiten, Kacheln, Premium-Gestaltung, Anzeige-Einstellungen [Claude, 2026-10-17]

Auf Jakobs Wünsche:
- Jeder Inhalt hat eine eigene Seite mit eigener Adresse (`#vorstellung`, `#bingo`, `#vertrag`,
  `#lernvereinbarung`, `#bewertung`, `#bildungsplaene`, `#praktikum`, `#gfs`, `#hotkeys`,
  `#kalender`), mit Pfadnavigation, Seitentitel, Druckknopf und Zurück-Link. Hash-Adressen, weil
  GitHub Pages keine Server-Weiterleitung für tiefe Pfade bietet; Lesezeichen, Teilen und der
  Zurück-Knopf funktionieren. Die Materialdialoge entfallen; der Detaildialog bleibt nur für
  „Datenschutz & Speicherung“.
- Kacheln sind ganze Klickflächen („Stretched Link“: der Titel ist der Link, seine Fläche deckt die
  Kachel ab). Die Knöpfe „… öffnen“ entfallen. Beim Darüberfahren vergrößert sich die Kachel leicht,
  ein Lichtschimmer gleitet darüber, der Rahmen wird golden; ohne Animation bei „Bewegung reduzieren“.
- Premium-Ebene: gebürstete Metalloptik und Lichtkante auf Knöpfen mit Glanz beim Darüberfahren,
  champagnerfarbene Verlaufsrahmen, dezente Lichtverläufe im Hintergrund, metallische Kopfzeilenlinie.
  Alles aus den Design-Variablen abgeleitet, daher auch im Dunkelmodus und mit eigenen Farben.
- Anzeige-Einstellungen (Knopf links vom Hell-/Dunkel-Umschalter): Farbschemata (Standard, Creme,
  hoher Kontrast hell/dunkel, eigene Farben mit Live-Kontrastanzeige), Schriftgröße 90–150 % (alle
  Schriftgrößen in rem), Zurücksetzen. Gespeichert als `startlab.settings`; der Hell-/Dunkel-Knopf
  setzt eigene Farben auf das Standarddesign zurück. Druck bleibt schwarz auf weiß.
- Logo führt zur Übersicht und scrollt dort nach oben. Fußzeile: „Designed by Sawazki Electronics“.
- Downloads auf Wunsch wieder entfernt (ONENOTE_INVENTAR.md).
- Überschriften auf Inhaltsseiten eine Ebene höher (h1 → h2 → h3); axe meldete sonst
  übersprungene Ebenen.
