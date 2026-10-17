# Datenschutz – Bestandsaufnahme und Entwurf

[Claude, 2026-10-17] · Grundlage für Aufgabe 18. **Keine Rechtsberatung und keine fertige
Datenschutzerklärung.** Die Angaben unten sind aus dem Code abgeleitet (Stand `main` nach 0.2.0)
und vor einer Aktivierung der Konten von der verantwortlichen Stelle und ggf. der oder dem
Datenschutzbeauftragten zu prüfen. Alles mit **[OFFEN]** ist nicht aus dem Code ableitbar und
darf nicht geraten werden.

## 1. Website ohne Konto (heute live)

| Thema | Stand laut Code |
| --- | --- |
| Hosting | GitHub Pages. GitHub verarbeitet beim Abruf technisch notwendige Verbindungsdaten (z. B. IP-Adresse) in eigener Verantwortung. **[OFFEN]** Hinweis auf GitHub und ggf. Drittlandbezug (USA) formulieren. |
| Cookies, Analyse, Werbung | Keine. Keine externen Skripte, Schriften oder Tracker; die Content-Security-Policy erlaubt nur eigene Skripte/Styles. |
| Browserspeicher | Nur `localStorage["startlab.checks"]`: Nummern (0–3) der abgehakten Startschritte, keine Namen; und `localStorage["startlab.theme"]` (`light`/`dark`), nur wenn das Design über den Umschalter gewählt wird. Löschbar über „Datenschutz & Speicherung“. Bingo-Markierungen werden nicht gespeichert. |
| Externe Links | bildungsplaene-bw.de, kmk.org, WorkbenchLab. Verbindung erst beim Anklicken; Bildungsplan-Links öffnen mit `rel="noopener noreferrer"`. |
| Inhalte | Organisatorische Inhalte aus OneNote ohne Schülerdaten; als einzige Person namentlich genannt: die Lehrkraft. |
| Downloads | Vier Dateien in `downloads/`, Metadaten (Autor, Bearbeiter, Firma) entfernt; das PDF nennt die Lehrkraft als Autor. |

## 2. Konten (vorbereitet, derzeit deaktiviert)

### 2.1 Verarbeitete Daten

| Bereich | Daten | Ort |
| --- | --- | --- |
| Konto | E-Mail-Adresse, Passwort (nur als Hash bei Supabase Auth, nie im Profil), Zeitpunkt der E-Mail-Bestätigung, Sitzungen/Refresh-Tokens, ggf. Bann-Zeitpunkt | Supabase Auth (`auth.*`) |
| Profil | Vorname, Nachname, E-Mail (Kopie, per Trigger aktuell gehalten), Kürzel, Anlagedatum, `locked_at` | `public.profiles` |
| Administration | Adminrolle (Konten-ID), TOTP-Faktor der Admins (bei Supabase Auth; Einrichtungsschlüssel wird von StartLab weder gespeichert noch protokolliert) | `public.administrators`, Supabase Auth |
| Protokoll | Zeitpunkt, Aktion (Reset angefordert/fehlgeschlagen, Sperre, Entsperrung, Löschung), ausführende und betroffene Konten-ID; beim Löschen eines Kontos werden die Bezüge geleert | `public.admin_audit` |
| Missbrauchsbremse | SHA-256-Hash des Identifikators (Kürzel/E-Mail bzw. Konten-ID), Zähler, Zeitfenster; Einträge älter als 1 Tag werden gelöscht | `public.request_limits` |
| Server-Protokolle von StartLab | Nur Ereignis, Pfad ohne Parameter/IDs und Statuscode; keine E-Mails, Namen, Passwörter, IP-Adressen | Edge-Function-Logs |
| Plattform-Protokolle | Supabase führt eigene Auth- und Dienstprotokolle (laut Supabase-Schema u. a. Sitzungs- und Audit-Einträge mit technischen Verbindungsdaten). **[OFFEN]** Umfang und Aufbewahrung beim eingerichteten Projekt prüfen. | Supabase |
| E-Mails | Bestätigungs- und Wiederherstellungslinks an die Kontoadresse | **[OFFEN]** SMTP-Dienst |
| Im Browser | Zugangstoken nur im Arbeitsspeicher des Tabs, nicht im Browserspeicher; nach Neuladen weg | Browser |

### 2.2 Wer sieht was

- Schülerinnen und Schüler: nur das eigene Profil (Datenbankregel mit aktiver Sitzung).
- Administratoren (mit bestätigtem TOTP): Kürzel, Vor- und Nachname, E-Mail, Anlagedatum und
  Sperrstatus aller Konten sowie das Protokoll mit Kürzeln. Passwörter sind nie einsehbar.
- Der Service-Schlüssel liegt ausschließlich in der Edge Function, nicht im Browser.

### 2.3 Rechte der Betroffenen – was technisch schon geht

| Recht | Stand |
| --- | --- |
| Auskunft | Profil im Kontodialog; vollständige Auskunft über Adminliste/Datenbank. **[OFFEN]** Ablauf festlegen. |
| Berichtigung | E-Mail-Änderung über Supabase wird ins Profil übernommen. Namenskorrektur hat noch keine Oberfläche. **[OFFEN]** |
| Löschung | Admin-Löschung mit Bestätigung (Konto, Profil, Sitzungen; Protokollbezüge geleert). Automatische Löschfrist fehlt (Frage 9). **[OFFEN]** |
| Einschränkung | Kontosperre durch Admins. |

### 2.4 Technische Schutzmaßnahmen (Auswahl, umgesetzt)

Row Level Security auf allen Anwendungstabellen, keine Grants für anonyme Zugriffe, Sitzungsprüfung
gegen die Datenbank, TOTP-Pflicht für Adminaktionen, Kontosperre, Anfragelimits, Zeitlimits,
Herkunftsprüfung, Passwortminimum 12 Zeichen, E-Mail-Bestätigung, globale Abmeldung nach
Passwortwechsel, Content-Security-Policy, keine Personendaten in eigenen Logs. Belege:
`Docs/VERIFICATION.md`, `Docs/INTEGRATION_TEST.md`, `Docs/BACKUP_RESTORE.md`.

## 3. Offene Punkte vor der Aktivierung (nicht von Claude oder Codex zu entscheiden)

1. **[OFFEN]** Verantwortliche Stelle und Kontakt, ggf. Datenschutzbeauftragte/r (Frage 7).
2. **[OFFEN]** Zweck und Rechtsgrundlage der Kontenverarbeitung; Umgang mit minderjährigen Schülerinnen und Schülern.
3. **[OFFEN]** Auftragsverarbeitung mit Supabase und dem SMTP-Dienst; Region (EU vorgesehen) und mögliche Drittlandbezüge.
4. **[OFFEN]** Löschfrist und Verantwortliche für die Löschung (Frage 9); Aufbewahrung der Protokolle.
5. **[OFFEN]** Informationsweg an Schülerinnen und Schüler vor der Registrierung (Frage 8: Einladung/Freigabe).
6. **[OFFEN]** Sicherungen: Häufigkeit, Speicherort, Löschung aus Sicherungen (siehe `Docs/BACKUP_RESTORE.md`).

## 4. Gerüst für die spätere Datenschutzseite

Erst veröffentlichen, wenn alle **[OFFEN]**-Stellen geklärt sind. Bis dahin bleibt der heutige
Dialog „Datenschutz & Speicherung“ maßgeblich, der die Website ohne Konto zutreffend beschreibt.

1. Verantwortliche Stelle und Kontakt **[OFFEN]**
2. Website ohne Konto: Hosting, keine Cookies/Analyse, lokale Checkliste (Abschnitt 1)
3. Konten: Zweck, Rechtsgrundlage **[OFFEN]**, Datenkategorien (Abschnitt 2.1)
4. Empfänger und Auftragsverarbeiter **[OFFEN]**
5. Speicherdauer **[OFFEN]**
6. Rechte der Betroffenen und Beschwerderecht **[OFFEN]**
7. Stand und Änderungen
