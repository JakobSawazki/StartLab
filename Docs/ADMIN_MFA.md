# Zwei-Faktor-Anmeldung für die Verwaltung

[Codex, 2026-10-17]

Die vorbereitete Kontenverwaltung verlangt neben Passwort und bestätigter
E-Mail einen aktuellen TOTP-Code aus einer Authenticator-App. Schülerinnen und
Schüler melden sich weiterhin mit Kürzel/E-Mail und Passwort an.

## Erste Einrichtung

1. Nach der Supabase-Einrichtung ein bestätigtes Konto anlegen und die
   geprüfte UUID in `public.administrators` eintragen (SUPABASE_SETUP.md).
2. Mit diesem Konto in StartLab anmelden. Vor der Kontenübersicht erscheint
   „Zwei-Faktor-Anmeldung einrichten“.
3. „Authenticator einrichten“ wählen, den QR-Code mit einer geeigneten
   Authenticator-App scannen und einen aktuellen sechsstelligen Code eingeben.
   Alternativ lässt sich der Einrichtungsschlüssel anzeigen und manuell eintragen.
4. Erst nach erfolgreicher Bestätigung wird die Kontenverwaltung freigegeben.
   Bei jeder neuen Passwort-Anmeldung ist wieder ein aktueller Code nötig.

QR-Code und Einrichtungsschlüssel sind Zugangsdaten. Sie werden ausschließlich
während der Einrichtung im Kontodialog angezeigt, nicht im Browserspeicher
gesichert oder in das Audit geschrieben. Beim Schließen bzw. erfolgreichen
Bestätigen entfernt die Oberfläche sie aus dem Dialog. Für die Sicherung der
Authenticator-App ein geschütztes Verfahren wählen. Kontodialoge sind von der
Druckausgabe ausgeschlossen, damit Einrichtungsschlüssel und Kontenlisten nicht
versehentlich mitgedruckt werden.

Eine unterbrochene Einrichtung kann neu gestartet werden. Dabei ersetzt die
Anwendung ausschließlich eigene, noch unbestätigte Faktoren mit dem Namen
„StartLab Verwaltung“. Ein bereits bestätigter Faktor lässt sich nicht durch
eine bloße Passwort-Anmeldung oder einen Passwort-Reset ersetzen.

## Serverseitiger Schutz

- Die Edge Function validiert zuerst das Zugriffstoken über Supabase Auth und
  prüft die aktive, passende Datenbanksitzung wie bisher.
- Für Adminaktionen sind zusätzlich `aal2` im bestätigten Token und ein
  aktuell bestätigter TOTP-Faktor im frischen Auth-Benutzerdatensatz nötig.
  Ein Feld im Request oder eine Anzeige in der Oberfläche ersetzt das nicht.
- Die Pflicht gilt für Kontenliste, Audit, Reset-Link, Sperren/Entsperren und
  Kontolöschung. Die eigene Profilansicht, Abmeldung und Einrichtungs-/Codeabläufe
  bleiben für den notwendigen Anmeldeprozess erreichbar.
- MFA-Endpunkte der Anwendung sind ausschließlich Administratoren zugänglich.
  Ein Code kann nur für einen eigenen Faktor geprüft werden. Einrichtung und
  Bestätigung sind zusätzlich pro Benutzer begrenzt (3 bzw. 10 in 15 Minuten).
- Neue Token werden nur im Arbeitsspeicher übernommen. Token, Codes und
  Einrichtungsschlüssel werden nicht in eigene Logs geschrieben.
- Die Prüfung der TOTP-Codes übernimmt Supabase Auth. Der Node-Prüftreiber
  berechnet ausschließlich für synthetische Integrationstest-Faktoren Codes.

Die lokale Konfiguration aktiviert `auth.mfa.totp.enroll_enabled` und
`auth.mfa.totp.verify_enabled`. Diese beiden Werte müssen im späteren gehosteten
Projekt ebenfalls aktiviert sein. Die öffentliche Registrierung bleibt in der
Projektkonfiguration geschlossen. Es ist keine neue Datenbankmigration nötig.

## Verlust der Authenticator-App

Ein Passwort-Reset allein öffnet die Kontenverwaltung weiterhin nicht.
Ein Faktorverlust benötigt eine gesonderte Identitätsprüfung und einen
berechtigten, geschützten Supabase-Projektzugang zum Zurücksetzen des Faktors.
Danach erfolgt eine neue Einrichtung mit StartLab. Dafür gibt es bewusst keinen
ungeschützten Umgehungslink in der Website.

Vor dem Einsatz mit echten Konten festlegen: Wer darf diese Wiederherstellung
durchführen und wie wird die Identität geprüft? Der Projektzugang selbst muss
ebenfalls geschützt sein. Die Anwendung enthält derzeit keine Oberfläche zum
Hinzufügen eines zweiten bereits bestätigten Backup-Faktors oder zum Entfernen
eines bestätigten Faktors.

## Prüfungen und Grenzen

- Backendtests: AAL1-Sperre sämtlicher Adminaktionen, ignoriertes Body-AAL,
  entfernte Faktoren, eigene Faktorzuordnung, Codes, Limits und Ausfallbehandlung.
- Browser: Einrichtung, Bilddarstellung des SVG-QR statt direkter SVG-Einfügung,
  mobile Ansicht, Codefehler, Freigabe, erneute MFA nach Anmeldung und Entfernen
  des Einrichtungsschlüssels; zusätzlich automatische axe-Prüfung.
- Echte lokale Supabase-Integration: Einrichtung, falscher Code, AAL2-Upgrade,
  Zugriff erst nach Bestätigung und erneute MFA nach Anmeldung/Restore.
- Der Testtreiber ist anhand der SHA1-Testvektoren aus RFC 6238 geprüft.

Die konkreten Prüfläufe stehen in VERIFICATION.md. Die Abnahme des gehosteten
Projekts und die tatsächliche Bedienung mit Jakobs Authenticator-App bleiben
vor der Freischaltung erforderlich.

## Offizielle Grundlagen

- [Supabase MFA mit TOTP](https://supabase.com/docs/guides/auth/auth-mfa/totp)
- [Supabase CLI: MFA-Konfiguration](https://supabase.com/docs/guides/local-development/cli/config)
- [RFC 6238 und Testvektoren](https://www.rfc-editor.org/rfc/rfc6238)
