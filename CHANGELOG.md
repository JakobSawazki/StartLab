# Änderungen

## Unveröffentlicht · 2026-10-17 [Claude]

2026-10-18: Logo- und Navigationseffekte, ruhiger Hover für Kopfzeilen-Icons, flüssiges Scrollen.

2026-10-18: Website mit dem gehosteten Supabase-Backend verbunden (Anmelden, Passwort vergessen);
Registrierung bleibt bis zur Freischaltung im Dashboard gesperrt.

2026-10-18: Einstellungsdialog ohne Scrollen, mittiges Schließen-Kreuz, dezent gebürsteter
stahlblauer Hintergrund, Navigationspunkt „Übersicht“ entfernt (Logo führt zur Übersicht),
Fußzeile verlinkt Sawazki Electronics.

Eigene Seite mit eigener Adresse für jeden Inhalt; Kacheln als ganze Klickflächen mit
Vergrößerung und Lichtschimmer beim Darüberfahren; edle Metalloptik für Knöpfe, Rahmen und
Hintergrund; Anzeige-Einstellungen (Farbschemata, eigene Farben mit Kontrastanzeige,
Schriftgröße, Zurücksetzen); Logo scrollt die Übersicht nach oben; Fußzeile „Designed by
Sawazki Electronics“; Downloads auf Wunsch wieder entfernt.

Neues, ruhigeres Design: Serifenüberschriften, Elfenbein/Waldgrün/Messing, Strichsymbole statt
Emoji, Hero ohne gedrehte Elemente; Umschalter für helles und dunkles Design (Wahl lokal
gespeichert, sonst Systemeinstellung); Hinweis statt leerer Seite beim Öffnen als lokale Datei.
Ursache des seltenen MFA-Testfehlers behoben (Test, nicht Seite).
Downloads: Persönliche Vorstellung, Leistungsbewertung, Notenschlüssel BK, GFS Informatik
(bereinigte Kopien, Metadaten entfernt); weitere Dokumente begründet zurückgehalten.

Datenschutz-Bestandsaufnahme aus dem Code mit Entwurfsgerüst (`Docs/DATENSCHUTZ_ENTWURF.md`)
und Test, der den Entwurf mit Tabellen und Browserspeicher-Schlüsseln abgleicht.

## 0.2.0 · 2026-10-17 [Codex]

Sitzungsprüfung nach Auth-Validierung: Migration 0004 verknüpft aktiven
Sitzungsdatensatz, Benutzer, E-Mail-Bestätigung, Auth-Bann und Profilsperre.
Direkte Profilabfragen erhalten dieselbe Prüfung über RLS. Fehler bei der
globalen Abmeldung nach Passwortwechsel werden ausdrücklich gemeldet.
Kontofunktionen bleiben bis zur Supabase-Einrichtung und Abnahme deaktiviert.

Admin-Kontolöschung mit Kürzelbestätigung, Schutz eigener und fremder
Administratorkonten, Zielkonto-Limit und Audit vorbereitet. Verzögerte Antworten
auf geschlossene oder ersetzte Kontoansichten werden verworfen; eine alte 401
verwirft keine neue Sitzung. Eigener Browserprüfstand für diese Antwortfolgen.

Vollständige Integration mit echten lokalen Supabase-Komponenten und Mailpit
auf einem temporären GitHub-Runner: zehn Prüfgruppen bestanden, einschließlich
paralleler Registrierung, Mailbestätigung, Rollen-/RLS-Schutz, Auth-Mailänderung,
Recovery, Passwortwechsel, Sitzungswiderruf, Sperren und Löschung. Keine produktive
Registrierung aktiviert. Erforderliche lokale CLI-Projektkennung ergänzt.

Datensicherung/Wiederherstellung von Auth und Anwendung im temporären Teststack
ergänzt und bestanden; insgesamt elf Integrationsgruppen. Datenvergleich,
Anmeldung, Adminrolle und RLS nach Restore geprüft. Kein produktiver Backupdienst
eingerichtet. Betriebsumfang und Wiederanlauf in BACKUP_RESTORE.md dokumentiert.

Verpflichtende TOTP-Bestätigung für Kontenverwaltung ergänzt: Einrichtung per
Authenticator-App, Codeansicht bei neuer Anmeldung und serverseitige Prüfung
von AAL2 und aktuellem Faktor. Keine Änderung der Schüleranmeldung. Im lokalen
Supabase einschließlich neuer Anmeldung nach Restore geprüft (zwölf Gruppen);
gehostete MFA-Einrichtung und App-Abnahme bleiben offen.

## Veröffentlicht ohne neue Versionsnummer · 2026-10-17 [Claude]

Auf GitHub Pages seit Commit 7dfab4c (Freigabe durch Jakob). Pages-Workflow auf node24-Actions
aktualisiert (0ed2947).

Kontenvorbereitung nachgebessert (einheitliche Kürzeltabelle, Migration 0002 mit
Mailabgleich, Auth-E-Mail als Quelle, Mail- und Tokenfehler sauber behandelt,
Abmeldung nach Passwortwechsel). Barrierefreiheit: Dialognamen und Fokus,
Seitentitel, Statusmeldungen, Kontraste, mobiles 4×4-Bingo, Druckansicht.
Adminliste seitenweise (je 100 Konten); Browser-Prüfstand um Barrierefreiheit,
Druck und simulierte Kontoabläufe erweitert.
Tastenkürzel an die OneNote-Themen angeglichen und durchsuchbar. Mail-Links im bereits geöffneten Tab werden ausgewertet; abgelaufene Admin-Sitzung führt zur
Anmeldung. Materialsuche durchsucht auch die Inhalte. Gestörten BK-2-Bildungsplanlink ersetzt, Ausbildungsberufe mit Dokumentstand, Linkprüfung.
Kontosperre für Administratoren (Migration 0003). Startseite zeigt die nächsten drei Termine. Inhalte aus OneNote übernommen: Vorstellung, Vertrag/Regeln, Leistungsbewertung mit
Notenschlüsseln, Praktikum BK1, GFS BG, Termine 2026/27, Bildungsplan-Links.
Audit-Ansicht für Administratoren. Auth-Einstellungen in supabase/config.toml; Bingo-Reset. Schutztests für Build-Liste, Geheimnisse und apiUrl. Smoke-Test-Skript für die deployte Edge Function. Content-Security-Policy für die Website. Zeitlimits (Website 20 s, Edge 10 s je
Supabase-Aufruf) und verständliche Meldungen bei fehlender Verbindung.
Skiplink wechselt nicht mehr zur Übersicht; axe-Audit ohne Verstöße.
SQL-Prüfung beider Migrationen gegen PGlite (`tools/sql-check.mjs`).
Keine neue Version vergeben; Kontofunktionen bleiben deaktiviert.

## 0.1.0 · 2026-10-17 [Codex]

Erste StartLab-Version: Übersicht, drei Einstiegsstationen, Materialregal,
Kennenlern-Bingo, Druckvorlagen, lokale Startcheckliste und vorbereitete
Supabase-Architektur. Registrierung bleibt bis zur Einrichtung deaktiviert.
