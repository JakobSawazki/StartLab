# Integration mit echten lokalen Supabase-Komponenten

[Codex, 2026-10-17]

Die schnellen Node-Tests simulieren Auth-/Datenbankantworten. Der PGlite-Test
prüft SQL mit einem vereinfachten Auth-Schema. Der zusätzliche Workflow
`Supabase integration` startet dagegen einen vollständigen lokalen Supabase-
Teststack auf einem temporären GitHub-Runner und führt die Kontoabläufe über
die echte Edge Function, Auth, PostgreSQL/PostgREST und Mailpit aus.

## Voraussetzungen und Abgrenzung

- Node.js 24, Supabase-CLI 2.121.0 und Docker. Auf dem aktuellen Windows-Rechner
  sind Docker und Supabase-CLI nicht installiert; der Workflow nutzt Ubuntu 24.04.
- Keine Supabase-Organisation, kein gehostetes Projekt und keine hinterlegten
  GitHub-Secrets erforderlich. Die lokale CLI erzeugt die Testschlüssel.
- Das Werkzeug akzeptiert ausschließlich HTTP-Ziele auf Loopback. Es führt
  keine Prüfungen gegen einen produktiven oder gehosteten Dienst aus.
- Nur zufällig erzeugte `@example.invalid`-Testadressen und erfundene Namen.
  Bestätigungs-/Recovery-Mails verbleiben in der lokalen Mailpit-Instanz;
  es gibt keinen externen SMTP-Versand.
- Keine Zugangsdaten oder Token in Testausgaben/Artefakten. CLI-Status wird
  innerhalb des Prüfprozesses gelesen, nicht in die Konsole geschrieben.
- `supabase/config.toml` des Projekts bleibt für Registrierungen geschlossen.
  Die offene Testkonfiguration entsteht separat in `.local/integration-stack/`.

## Ablauf

```sh
node tools/integration-stack.mjs prepare
node tools/integration-stack.mjs start
node tools/integration-stack.mjs test
node tools/integration-stack.mjs stop
```

`prepare` kopiert die aktuellen Migrationen und die Function in den eigenen
Testordner. Ein Besitznachweis verhindert die Verwendung eines fremden
vorhandenen Ordners. `start` legt ausschließlich diesen lokalen Stack an.
`test` liest die lokalen Testschlüssel in den Arbeitsspeicher und startet die
Function mit lokaler Origin, lokaler Redirect-Adresse und offener Testregistrierung.
`stop` beendet den nachgewiesenen Teststack ohne eine Datenbanksicherung.

Nach den Prüfungen werden die im selben Lauf erzeugten Konten aufgeräumt.
Der Workflow beendet den Teststack auch nach Fehlern und veröffentlicht keine
Datenbank-, Mail- oder Schlüsselartefakte.

## Geprüfte Abläufe

1. Anonyme Aufrufe von Adminliste und Kontolöschung werden abgewiesen.
2. Gleichzeitige Registrierungen mit gleichen Namen und echte Bestätigungsmail;
   Anmeldung vor Bestätigung verweigert; unterschiedliche Kürzel trotz Konkurrenz.
3. Anmeldung über Kürzel und Trennung eigener/fremder Profile per RLS;
   Schüler können keine Adminaktionen ausführen, Rollen vergeben oder ihr Profil
   direkt ändern.
4. Administratorkonto, serverseitige Rolle und Kontenübersicht.
5. Eine administrativ bestätigte E-Mail-Änderung muss im Profil ankommen;
   Kürzel-Anmeldung und anschließender Reset nutzen die neue Auth-Adresse.
6. Datensicherung und Wiederherstellung von `auth` und `public` im temporären
   Datenbankcontainer; Profile/Rollen/Audit identisch, erneute Anmeldung und
   RLS-Trennung wirksam. Details: [BACKUP_RESTORE.md](BACKUP_RESTORE.md).
7. Administrativer Reset, echte Recovery-Mail, neuer Passwortsatz,
   Zurückweisung alter Sitzungen und des alten Passworts.
8. Abmeldung und erneute Verwendung des vorherigen Tokens; auch direktes
   Profil-RLS muss Zugriff verweigern.
9. Sperren eines Kontos mit vorhandener Sitzung, fehlgeschlagene Anmeldung,
   Entsperren und erneute Anmeldung.
10. Verweigerte Selbstlöschung/falsche Kürzelbestätigung, erfolgreiche Löschung,
   entferntes Profil, abgewiesene alte Sitzung und anonymisiertes Audit.
11. Selbst angeforderte Passwort-vergessen-Mail im lokalen Postfach.
12. Admin-TOTP: MFA-Pflicht vor Verwaltungszugriff, Einrichtung, falscher Code,
    Freigabe mit korrektem Code und erneute Bestätigung nach Login/Restore.
    Die OTP-Berechnung ist ausschließlich ein Testtreiber; Supabase validiert.

## Bedeutung des Ergebnisses

Ein erfolgreicher Lauf belegt das Zusammenspiel der verwendeten lokalen
Supabase-Versionen mit dem geprüften Commit. Er belegt weder die Einrichtung
des späteren gehosteten Projekts noch dessen SMTP-Zustellung, Betriebseinstellungen,
Region oder schulische Freigabe. Diese Abnahme bleibt vor echten Schülerkonten nötig.

Aktuellen Laufstatus und tatsächlich erreichte Prüfschritte im
[Prüfprotokoll](VERIFICATION.md) festhalten. Ein angelegter Workflow allein
ist kein bestandenes Integrationsergebnis.

## Offizielle Grundlagen

- [Supabase: automatisierte Tests](https://supabase.com/docs/guides/deployment/ci/testing)
- [CLI-Konfiguration](https://supabase.com/docs/guides/local-development/cli/config)
- [Mailpit-API](https://mailpit.axllent.org/docs/api-v1/)
