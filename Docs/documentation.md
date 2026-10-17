# StartLab – Projektdokumentation

Stand: **17. Oktober 2026 (Europe/Berlin)** · Release **0.1.0**

Mitwirkende: Jakob Sawazki, Codex. Einträge werden mit Autor und Datum geführt.
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
| Konten | Code vorbereitet, noch kein produktiver Supabase-Dienst |
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
