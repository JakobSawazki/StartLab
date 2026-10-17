# Supabase einrichten

Stand: 17. Oktober 2026 · EU-Projekt angelegt, Einrichtung und Abnahme laufen.

## 1. Dienst und Projekt

Ein separates Supabase-Projekt für StartLab in einer EU-Region anlegen.
Die schulische Verantwortung, Auftragsverarbeitung, zulässige Daten und Löschfrist
vor dem Einsatz mit echten Schülerkonten klären. Keine Zugangsdaten in den Chat
oder in das Repository schreiben. Kosten und gewählten Tarif im Dashboard prüfen.

## 2. Datenbank

`supabase/migrations/202610170001_startlab.sql` und danach
`supabase/migrations/202610170002_startlab_accounts.sql` sowie
`supabase/migrations/202610170003_startlab_lock.sql` (Spalte `locked_at`) und
`supabase/migrations/202610170004_startlab_sessions.sql` (aktive Sitzungen) in einem neuen Projekt über den
SQL-Editor anwenden (oder per `supabase db push`). [Claude, 2026-10-17] Die zweite Migration
vereinheitlicht die Kürzelbildung mit Website und Edge Function und hält `profiles.email`
per Trigger mit der bestätigten Auth-Adresse synchron. Sie erstellt Profile, Adminrollen, temporäre Anfragelimits,
Audit sowie die RLS-Regeln und einen Trigger zur Kürzelvergabe.

Die Migration ist für die einmalige Initialisierung ausgelegt. Bei Fehlern den
Zustand prüfen, nicht blind erneut ausführen. Keine bestehenden Tabellen löschen.

## 3. Authentifizierung und Mail

Im Auth-Dashboard E-Mail-Bestätigung aktiv lassen, Passwortminimum auf mindestens
12 Zeichen setzen und zunächst neue Registrierungen deaktivieren. Eigenen
SMTP-Dienst konfigurieren und mit Testadressen prüfen. Supabase-Standardmail ist
für Entwicklung begrenzt und kein fertig eingerichteter Schulversand.

[Claude, 2026-10-17] Diese Werte stehen zusätzlich in `supabase/config.toml` (`enable_signup = false`,
`enable_confirmations = true`, `minimum_password_length = 12`, Site/Redirect-URL). Sie gelten für
`supabase start` lokal; im gehosteten Projekt bleiben die Dashboard-Werte maßgeblich, bis sie
bewusst übertragen werden. Ein Test prüft, dass Datei, Anleitung und Edge Function übereinstimmen.

Site URL und erlaubte Redirect URL genau setzen:

`https://jakobsawazki.github.io/StartLab/`

Keine offenen Wildcards verwenden. Die Anwendung verarbeitet Bestätigungs- und
Recovery-Sitzungen über das URL-Fragment, entfernt es sofort aus der Adresszeile
und speichert die Kennung nur im Arbeitsspeicher.

## 4. Edge Function und Secrets

Die Supabase-CLI erst nach Installation aus offizieller Quelle verwenden.
Im Projekt `supabase link --project-ref DEINE_PROJEKTREFERENZ` und
`supabase functions deploy startlab` ausführen. `config.toml` deaktiviert die
Gateway-JWT-Pflicht, damit Login und Reset anonym erreichbar sind. Der Code
prüft Auth-Token und Adminrolle bei geschützten Aktionen selbst.

Supabase stellt `SUPABASE_URL`, `SUPABASE_ANON_KEY` und
`SUPABASE_SERVICE_ROLE_KEY` im Edge-Umfeld bereit. Diese Werte nie veröffentlichen.
Zusätzlich im Dashboard unter Edge Function Secrets setzen:

| Secret | Wert |
| --- | --- |
| SITE_ORIGIN | `https://jakobsawazki.github.io` |
| SITE_URL | `https://jakobsawazki.github.io/StartLab/` |
| REGISTRATION_ENABLED | zunächst `false` |

`config.js` enthält nur die öffentliche Funktionsadresse:

```js
export const config = Object.freeze({
  apiUrl: 'https://DEINE-PROJEKTREFERENZ.supabase.co/functions/v1/startlab'
});
```

[Claude, 2026-10-17] `index.html` erlaubt per Content-Security-Policy Verbindungen nur zu
`https://*.supabase.co`. Bei einer eigenen Domain für die Function muss `connect-src` dort
angepasst werden, sonst blockiert der Browser die Kontoanfragen.

Im Browser ist weder der Service-Schlüssel noch eine Datenbankverbindung nötig.
Der Service-Schlüssel bleibt ausschließlich in der Edge-Umgebung.

### Smoke-Test nach dem Deploy [Claude, 2026-10-17]

`tools/smoke-check.mjs` prüft die deployte Function ohne Konten anzulegen und ohne Mail an
reale Personen (Reset nur an eine reservierte `.invalid`-Adresse): fremde Herkunft, Preflight,
Methode, ungültiges JSON, unbekannte Aktion, fehlende/gefälschte Anmeldung, falsches Passwort,
neutraler Reset, `no-store` und gesperrte Registrierung.

```sh
STARTLAB_API=https://DEINE-PROJEKTREFERENZ.supabase.co/functions/v1/startlab STARTLAB_ORIGIN=https://jakobsawazki.github.io node tools/smoke-check.mjs
```

Mehr als drei Läufe in 15 Minuten lösen das Reset-Limit (429) aus; das ist erwartetes Verhalten.
Der Smoke-Test ersetzt nicht die Funktionsabnahme in Abschnitt 6.

## 5. Erstes Admin-Konto

Registrierung im Auth-Dashboard und `REGISTRATION_ENABLED` vorübergehend
freischalten. Eigenes Konto über StartLab anlegen und E-Mail bestätigen.
Die Konten-UUID aus dem Auth-Dashboard prüfen und dann im SQL-Editor:

```sql
insert into public.administrators(user_id)
values ('HIER-DIE-GEPRUEFTE-KONTEN-UUID');
```

Kein Adminrecht aus Name, E-Mail-Adresse oder frei beschreibbaren Metadaten
ableiten. Supabase-Dashboardkonto mit MFA schützen. [Codex, 2026-10-17] Auch
StartLab selbst verlangt nun TOTP für Adminaktionen: Im gehosteten Auth-Dienst
TOTP-Einrichtung und -Bestätigung aktivieren und nach der Rollenvergabe in
StartLab die Authenticator-App einrichten. Anleitung: [ADMIN_MFA.md](ADMIN_MFA.md).
Die lokale Konfiguration enthält beide erforderlichen TOTP-Schalter; eine
zusätzliche Datenbankmigration ist dafür nicht nötig.

## 6. Verbindliche Funktionsabnahme

[Codex, 2026-10-17] Die grundlegenden Kontoabläufe lassen sich inzwischen mit
echten lokalen Supabase-Komponenten im temporären GitHub-Testsystem prüfen:
[Integrationstest](INTEGRATION_TEST.md). Das reduziert die Lücke gegenüber den
simulierten Tests, ersetzt aber nicht die folgende Abnahme des tatsächlichen
gehosteten Projekts und seines SMTP-Dienstes.

Mit ausschließlich erfundenen Testpersonen und eigenen Testadressen prüfen:

1. Registrierung, Bestätigung, Login über E-Mail und eigenes Kürzel.
2. Zwei gleiche Namen gleichzeitig: unterschiedliche, stabile Kürzel.
3. Unbestätigte E-Mail, falsches Passwort, unbekanntes Konto, Rate-Limits.
4. Schüler A kann Profil von B weder lesen noch ändern; keine Adminliste oder Rolle.
5. Adminliste enthält nur benötigte Daten; Reset für gewählte Person; Audit vorhanden.
6. Reset-Link erreichbar, neue Passwortvergabe, abgelaufener Link, erneute Anmeldung.
7. Abmelden und Neuladen auf gemeinsamem Schul-PC hinterlassen keine Sitzung.
8. Kontolöschung im Dashboard entfernt Profil und Rolle; Backup-Restore separat prüfen.
9. [Claude, 2026-10-17] Mailadresse eines Testkontos ändern und bestätigen: `profiles.email`
   folgt, Kürzel-Login und Admin-Reset nutzen die neue Adresse.
10. Namen mit Akzenten (z. B. erfundene Testperson „Šimon Øster“) ergeben dasselbe Kürzel wie
    die Vorschau im Formular (`simost`).
11. SMTP absichtlich falsch konfigurieren: „Passwort vergessen“ bleibt neutral, die
    Function-Logs zeigen `recover_failed`; Admin-Reset meldet den Fehler, Audit enthält
    `password_reset_failed`. Logs enthalten keine Adressen.
12. [Codex, 2026-10-17] Nach Abmeldung bzw. erfolgreicher globaler Abmeldung beim
    Passwortwechsel eine zuvor gespeicherte Test-Sitzung auf einem zweiten Gerät
    erneut verwenden: geschützte Edge-Aktionen müssen sofort 401 liefern, direkte
    Profilabfragen dürfen keine Zeile liefern (auch vor Ablauf des Access-Tokens).
    Passwortwechsel mit absichtlich gestörtem globalem Logout: Passwort ist geändert,
    die Oberfläche meldet die nicht bestätigte Abmeldung anderer Geräte ausdrücklich.
13. [Claude, 2026-10-17] Kontosperre: Admin sperrt Testkonto B; B kann sich nicht anmelden und
    keine geschützte Aktion mehr ausführen; Audit `account_locked`; Entsperren stellt den Zugang her.
    Ein Admin kann das eigene Konto nicht sperren.
14. [Codex, 2026-10-17] Ausschließlich mit einem eigens angelegten Testkonto:
    Kontolöschung abbrechen, falsches Kürzel eingeben, dann korrekt bestätigen.
    Nur die richtige Bestätigung darf das gewählte Konto löschen. Profil und
    Sitzungen müssen fehlen, zugehörige alte Auditbezüge müssen null sein.
    Neue Anmeldung und vorhandenes altes Token dürfen keinen Zugriff erlauben.
15. Eigene und fremde Administratorkonten sind über `admin-delete` geschützt.
    Ein fehlgeschlagenes Vorabprotokoll verhindert den Löschaufruf. Bei Timeout
    wird die Löschung nicht automatisch wiederholt: erst den tatsächlichen
    Auth-/Profilzustand im Dashboard prüfen. Storage-Eigentum kann die Löschung
    verhindern; gespeicherte Dateien nicht ungeprüft entfernen.
16. Administrator nach neuer Passwort-Anmeldung: Kontenliste, Audit, Reset,
    Sperren und Löschung müssen vor der TOTP-Bestätigung 403 liefern. Faktor
    einrichten, falschen Code prüfen, korrekten Code bestätigen und danach
    Adminaktionen prüfen. Nach Abmeldung/Neuladen ist erneut ein Code nötig.
    Passwort-Reset allein darf einen bestätigten Faktor nicht ersetzen.
    Bedienung mit der tatsächlich eingesetzten Authenticator-App abnehmen.

### Sitzungsprüfung [Codex, 2026-10-17]

Ein gültiges Access-Token allein genügt nicht für geschützte StartLab-Anfragen.
Nach der Auth-Prüfung wird dessen `session_id` mit einer aktiven Sitzung derselben
Person in `auth.sessions` abgeglichen. Bestätigte E-Mail, aktueller Auth-Bann und
`profiles.locked_at` werden in derselben Datenbankabfrage geprüft. Eine fehlende
oder unzulässige Sitzung wird abgewiesen. Bei Datenbankausfall wird kein Zugriff
gewährt; die API meldet den Dienstausfall, statt ein falsches Passwort zu behaupten.

Die neue RLS-Regel bindet auch direkte Profilabfragen an die aktive eigene Sitzung.
Der Browser erhält weder Zugriff auf `auth.sessions` noch die Möglichkeit, fremde
Sitzungen abzufragen. Die allgemeine Prüffunktion darf nur die Service-Rolle
aufrufen; angemeldete Personen erhalten lediglich eine parameterlose Prüfung
ihrer eigenen signierten JWT-Sitzung.

Das ist lokal mit PostgreSQL/PGlite und simulierten Auth-Antworten geprüft. Vor
Produktivbetrieb müssen die Existenz von `auth.sessions`, das tatsächliche
Entfernen der Sitzungen beim Logout und das Verhalten von Recovery-Sitzungen
gegen das eingerichtete Supabase-Projekt abgenommen werden. Bei teilweise
fehlgeschlagener Kontosperre können Auth-Bann und Profilstatus voneinander
abweichen; beide Sperrsignale verweigern Zugriff bis zur erfolgreichen Entsperrung.

Erst danach Registrierung für den Unterricht aktivieren. Ohne Klassen-Einladungen
ist die Registrierung nach Freischaltung grundsätzlich öffentlich. Das Auth-Dashboard
und der öffentliche Auth-Endpunkt sind zusätzlich zum eigenen Edge-Schalter zu
beachten; der Edge-Schalter allein sperrt direkte Auth-Registrierungen nicht.

## Grenzen und nächster Ausbau

Kein vollständiges Schulverwaltungssystem: keine Klassenverwaltung, kein
Klassen-Einladungscode, keine Freigabe und kein automatischer Löschlauf.
[Codex, 2026-10-17] Admin-TOTP ist implementiert; die gehostete Konfiguration und
das Vorgehen bei Faktorverlust müssen vor Betriebsaufnahme abgenommen werden.
[Claude, 2026-10-17] Adminübersicht lädt seitenweise je 100 Konten.
Kürzel-Login und Admin-Reset verwenden die Auth-Adresse; `profiles.email` wird per
Trigger nachgeführt (ungeprüft gegen echtes Supabase). Ist im Dashboard
„Secure password change“ aktiv, kann ein Passwortwechsel ohne frische Anmeldung eine
erneute Bestätigung verlangen; das ist in der Abnahme zu prüfen.

Globale und personenbezogene Limits sind eine erste Missbrauchsbremse, kein
vollständiger DDoS-/Bot-Schutz. Für produktiven öffentlichen Betrieb Schutz am
Gateway, CAPTCHA-/Einladungsstrategie und Monitoringschwellen festlegen. Keine
Passwörter oder personenbezogenen Request-Bodies in eigene Logs schreiben.

## Offizielle Referenzen

- [Passwort-Anmeldung und Wiederherstellung](https://supabase.com/docs/guides/auth/passwords)
- [Benutzerprofile](https://supabase.com/docs/guides/auth/managing-user-data)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Edge Function Secrets](https://supabase.com/docs/guides/functions/secrets)
- [Sitzungen und Prüfung nach Abmeldung](https://supabase.com/docs/guides/auth/sessions)
- [Konten serverseitig löschen](https://supabase.com/docs/reference/javascript/auth-admin-deleteuser)
- [Zwei-Faktor-Anmeldung (TOTP)](https://supabase.com/docs/guides/auth/auth-mfa/totp)

Diese Quellen wurden für den Architekturentwurf geprüft. Ein produktiver
E-Mail-Versand, eine rechtliche Freigabe oder eine reale Datenbankabnahme ist
dadurch noch nicht erfolgt.


## Einrichtungsprotokoll 17. Oktober 2026

- Jakob hat Supabase verbunden und das Anlegen in der Organisation „Sawazki“ bestätigt.
- Projekt `StartLab`, Referenz `hrkmnmrfffcqlzbpzifm`, Region `eu-central-1` (Frankfurt), Organisation im Free-Tarif. Status ACTIVE_HEALTHY.
- Vier vorhandene Migrationen über den Connector in der vorgesehenen Reihenfolge angewandt; gehostete Versionsnummern 20261017140432, 20261017140434, 20261017140436, 20261017140439. Der Connector vergibt eigene Zeitstempel; keine lokale Migration doppelt anwenden.
- Vier Anwendungstabellen mit RLS bestätigt, noch keine Auth-Konten vorhanden.
- Advisor: keine offenen Tabellenzugriffe; drei Hinweise auf absichtlich fehlende Client-Policies der nur für den Dienst zugänglichen Tabellen. Warnung für die absichtlich auf die eigene JWT-Sitzung begrenzte SECURITY-DEFINER-Hilfsfunktion; keine frei wählbare Konto-ID. Zwei Performance-Hinweise zu Audit-Fremdschlüsselindizes bleiben nachrangig.
- Dashboard: Registrierung geschlossen, E-Mail-Bestätigung aktiv, Passwortminimum 12 gespeichert. Site-URL und exakte Redirect-URL auf https://jakobsawazki.github.io/StartLab/ gesetzt; TOTP aktiviert, maximal zwei Faktoren. Edge Function `startlab` Version 1 bereitgestellt; SITE_ORIGIN, SITE_URL und REGISTRATION_ENABLED=false hinterlegt. Website bleibt bis zur Endabnahme ohne API-Verbindung.

- Gehosteter Smoke-Test: alle 13 Prüfungen bestanden (Herkunft, Preflight, Methode, Eingabe, fehlende/gefälschte Anmeldung, neutrale Recovery-Antwort, Cache-Verbot und geschlossene Registrierung). Keine Konten angelegt oder Mail an echte Empfänger ausgelöst. Eine neutrale Recovery-Antwort bestätigt noch keinen funktionierenden Mailversand.
- Jakob hat `sawazki.electronics@googlemail.com` als Absender gewählt. SMTP wird für Gmail vorbereitet (smtp.gmail.com, Port 587/STARTTLS, vollständige Adresse als Benutzername). Google verlangt hierfür gegebenenfalls ein App-Passwort bei aktiver Zwei-Schritt-Bestätigung; dieses muss Jakob selbst im Konto erstellen und direkt in Supabase eintragen. Kein Passwort in Chat, Code oder Git. Echte Mail-/Kontoabnahme weiterhin offen.
- SMTP-Quellen: https://supabase.com/docs/guides/auth/auth-smtp und https://support.google.com/mail/answer/7104828 sowie https://support.google.com/accounts/answer/185833 .
- Schulische Freigabe, Verantwortlichkeit, Löschfrist, Registrierungsfreigabe und Einrichtung des ersten Admin-Kontos bleiben offen. Keine echten Schülerdaten erfasst.
