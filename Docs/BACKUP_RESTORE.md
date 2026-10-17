# Sicherung und Wiederherstellung

[Codex, 2026-10-17]

## Was für StartLab gesichert werden muss

Ein reiner Export der Kontenübersicht reicht nicht für die Wiederherstellung
der Anmeldung. Benötigt werden die Auth-Daten (einschließlich Passwort-Hashes
und Identitäten) und die Anwendungsdaten: Profile, Adminrollen und Audit.
Schema, Funktionen, RLS-Regeln und Migrationstand müssen ebenfalls verfügbar sein.
Die vier Projektmigrationen stehen versioniert im Repository.

Auth-Dumps sind vertrauliche Sicherungen. Sie gehören weder ins öffentliche
Repository noch in GitHub-Artefakte, Chatnachrichten oder normale Testprotokolle.
Für den späteren Betrieb sind ein geschützter Sicherungsort, Zugriffsrechte,
Aufbewahrung und Verantwortliche festzulegen. SMTP-Zugangsdaten und andere
Dienstkonfigurationen werden getrennt und geschützt verwaltet.

Supabase-Storage-Dateien sind ein eigener Sicherungsumfang; Datenbankbackups
enthalten deren Metadaten, nicht automatisch die eigentlichen Dateien. StartLab
verwendet derzeit keinen produktiven privaten Dateispeicher. Sobald einer
hinzukommt, muss dessen Sicherungs-/Wiederherstellungsplan ergänzt werden.

## Automatischer Test im isolierten Stack

`tools/integration-backup.mjs` erweitert die [Supabase-Integration](INTEGRATION_TEST.md).
Der Test erstellt einen PostgreSQL-Datendump der Schemas `auth` und `public`
im eigenen temporären Datenbankcontainer. Der Dump verbleibt im Prozessspeicher;
es wird keine herunterladbare Sicherungsdatei erzeugt.

Im Test werden die erfassten Tabellen in einer Transaktion geleert und aus dem
Dump wieder befüllt. Der Modus zum Unterdrücken der Einfügetrigger gilt nur
innerhalb dieser Transaktion; sonst würde der Auth-Trigger bereits gesicherte
Profile doppelt anlegen. Nach dem Commit prüft dieselbe Datenbanksitzung die
Rückkehr zum normalen Modus. Fehler brechen den SQL-Lauf ab; der temporäre
Stack wird vom Workflow anschließend beendet.

Dieser Wiederherstellungsschritt benötigt Wartungsrechte. Der normale
`postgres`-Zugang hat im Test SQLSTATE `42501` geliefert. Deshalb wird für den
Restore ausschließlich im eigenen lokalen Testcontainer dessen Wartungsrolle
`supabase_admin` verwendet. Die Rollen und Berechtigungen der Anwendung werden
dabei nicht verändert.

Vorher-/Nachhervergleich und anschließende API-Aufrufe sollen belegen:

- Profile, Adminrollen und Audit stimmen mit dem gesicherten Stand überein.
- Auth-Konten und Identitäten lassen die Anmeldung mit dem bisherigen Passwort zu.
- Die Adminrolle und die Trennung fremder Profile über RLS bleiben wirksam.
- Der vorherige Kontentest läuft nach der Wiederherstellung weiter und prüft
  Recovery, Passwortwechsel, Abmeldung, Sperre und Löschung.

Das ist ein Wiederherstellungstest mit einem bereits vorhandenen, unveränderten
Schema derselben lokalen Supabase-Version. Er beweist keine Migration eines
gehosteten Projekts auf eine andere Version, keinen vollständigen Neuaufbau aus
einer leeren Infrastruktur und keine Sicherung externer Dienste oder Dateien.
Tatsächlich bestandene Ergebnisse stehen in [VERIFICATION.md](VERIFICATION.md).

Der vollständige Lauf
[39034370695](https://github.com/JakobSawazki/StartLab/actions/runs/39034370695)
für Codecommit `70dece7` ist erfolgreich abgeschlossen: elf Integrationsgruppen
einschließlich der Sicherung/Wiederherstellung und der danach weitergeführten
Kontoabläufe. Der temporäre Stack wurde im selben Workflow beendet.

## Vor dem Unterrichtsbetrieb festlegen

| Entscheidung / Nachweis | Noch erforderlich |
| --- | --- |
| Zuständigkeit | Wer erzeugt Sicherungen, kontrolliert sie und darf wiederherstellen? |
| Umfang | Auth, Anwendungsdaten, Schema/Migrationstand, Dienstkonfiguration und ggf. Dateien |
| Rhythmus | Maximal akzeptierter Datenverlust und Ausfallzeit bestimmen Sicherungsrhythmus und Wiederanlauf |
| Aufbewahrung | Fristen, Zugriff und sichere Entfernung alter Sicherungen konkret festlegen |
| Verfahren | Im gewählten gehosteten Projekt verfügbares Backup-/Restoreverfahren prüfen |
| Abnahme | Testwiederherstellung in getrennter Umgebung einschließlich Anmeldung, Rollen und RLS |

Nach einer betrieblichen Wiederherstellung sind Sitzungen und bereits erfolgte
Kontolöschungen besonders zu behandeln. Ein älterer Auth-Dump kann noch
Sitzungsdatensätze oder inzwischen gelöschte Konten enthalten. Vor Wiederfreigabe
müssen bestehende Sitzungen widerrufen und seit dem Sicherungsstand durchgeführte
Löschungen/Sperren anhand eines geschützt geführten Betriebsnachweises erneut
angewandt werden. Der lokale Test lässt Sitzungen gezielt bestehen, um den
Datenerhalt zu prüfen; das ist keine Vorgabe für den produktiven Wiederanlauf.

## Offizielle Grundlagen

- [Supabase-Backups und Umfang](https://supabase.com/docs/guides/platform/backups)
- [Supabase: Sicherung und Restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore)
- [PostgreSQL 17: pg_dump](https://www.postgresql.org/docs/17/app-pgdump.html)
