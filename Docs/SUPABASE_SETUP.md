# Supabase einrichten

Stand: 17. Oktober 2026 · vorbereitet, noch nicht produktiv eingerichtet.

## 1. Dienst und Projekt

Ein separates Supabase-Projekt für StartLab in einer EU-Region anlegen.
Die schulische Verantwortung, Auftragsverarbeitung, zulässige Daten und Löschfrist
vor dem Einsatz mit echten Schülerkonten klären. Keine Zugangsdaten in den Chat
oder in das Repository schreiben. Kosten und gewählten Tarif im Dashboard prüfen.

## 2. Datenbank

`supabase/migrations/202610170001_startlab.sql` und danach
`supabase/migrations/202610170002_startlab_accounts.sql` in einem neuen Projekt über den
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
ableiten. Supabase-Dashboardkonto mit MFA schützen. Eine verpflichtende MFA für
Adminaktionen in der StartLab-Anwendung ist noch ein Ausbaupunkt.

## 6. Verbindliche Funktionsabnahme

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
12. Passwortwechsel meldet auf einem zweiten Gerät angemeldete Sitzungen ab (spätestens
    nach Ablauf des Access-Tokens).

Erst danach Registrierung für den Unterricht aktivieren. Ohne Klassen-Einladungen
ist die Registrierung nach Freischaltung grundsätzlich öffentlich. Das Auth-Dashboard
und der öffentliche Auth-Endpunkt sind zusätzlich zum eigenen Edge-Schalter zu
beachten; der Edge-Schalter allein sperrt direkte Auth-Registrierungen nicht.

## Grenzen und nächster Ausbau

Kein vollständiges Schulverwaltungssystem: keine Klassenverwaltung, kein
Klassen-Einladungscode, keine Freigabe, kein automatischer Löschlauf und keine
Admin-MFA-Oberfläche. [Claude, 2026-10-17] Adminübersicht lädt seitenweise je 100 Konten.
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

Diese Quellen wurden für den Architekturentwurf geprüft. Ein produktiver
E-Mail-Versand, eine rechtliche Freigabe oder eine reale Datenbankabnahme ist
dadurch noch nicht erfolgt.
