# Übergabe Codex → Claude

[Codex, 2026-10-17]

Nach Jakobs Auftrag zur Weiterarbeit Claudes Stand bis `3efc9cd` übernommen.
Die vorhandenen Inhalte und die laufende Website sind Grundlage der Weiterarbeit.
Die ungetrackte `Docs/CLAUDE_HANDOFF.md` bleibt erhalten und wird nicht mit veröffentlicht.

## Neue Änderungen

- Migration `202610170004_startlab_sessions.sql` ergänzt zwei eng berechtigte
  Sitzungsprüffunktionen und ersetzt die eigene Profil-RLS-Regel.
- Die Edge Function lässt Auth zuerst das Token prüfen, liest dann dessen
  `session_id` und gleicht sie mit der bestätigten Benutzer-ID in der Datenbank ab.
- Sitzung vorhanden, E-Mail bestätigt, Auth-Bann abgelaufen/fehlend und
  `profiles.locked_at` leer sind gemeinsam nötig. Auch direkte Profilabfragen
  über PostgREST nutzen diese Prüfung.
- Auth-/Datenbankausfälle bei der Identitätsprüfung bleiben Dienstausfälle.
- Ein fehlgeschlagener globaler Logout nach Passwortwechsel wird mit
  `sessions_revoked:false` und einer ausdrücklichen Meldung beantwortet.
  `signed_out:true` bedeutet in diesem Fehlerfall nur Abmeldung in der Oberfläche.

Grundlage: [Supabase-Sitzungsdokumentation](https://supabase.com/docs/guides/auth/sessions).
Ein signiertes, noch gültiges Access-Token allein ist kein Nachweis einer weiterhin
bestehenden Sitzung. Die neue Prüfung ersetzt nicht die vorgelagerte Auth-Validierung.

## Prüfergebnisse

49 Node-Tests, Syntaxprüfung, strikte TypeScript-Prüfung und Build bestanden.
11 lokale SQL-Prüfgruppen gegen PGlite bestanden. Der Browserprüfstand mit
axe-core ist ebenfalls bestanden. Einzelheiten: `Docs/VERIFICATION.md`.

## Für die nächste Einrichtung beachten

Alle **vier** Migrationen vor dem Deploy der neuen Edge Function anwenden.
Die Konten bleiben deaktiviert. Reale Testkonten müssen Abmeldung,
Passwortwechsel/Recovery, Kontosperre und direkte Profil-RLS abdecken.
Supabase-Zugang, SMTP und Jakobs offene organisatorische Entscheidungen fehlen
weiterhin. Keine OneNote- oder Computeraktion im Rahmen dieses Arbeitsblocks.

## Autonome Weiterarbeit: Kontolöschung [Codex, 2026-10-17]

`admin-delete` und die Bestätigung in der Kontenübersicht sind ergänzt. Der
Server prüft Kürzel und Zielkonto, verhindert Selbst-/Adminlöschung, begrenzt
Versuche und protokolliert den Auftrag vor dem Auth-Hard-Delete. Ein Fehler des
Vorabprotokolls verhindert den Löschaufruf. Unbestätigte Löschung und nicht
bestätigtes Abschlussprotokoll werden getrennt behandelt. Die bestehende
Datenbank-Kaskade entfernt Profil und Sitzungen; Auditbezüge werden anonymisiert.
Keine weitere Migration erforderlich. Keine echten Konten gelöscht.

Die Oberfläche verwirft außerdem Antworten auf alte Kontoansichten und schützt
eine neue Sitzung vor verspäteten 401-Antworten alter Sitzungen. Listenanfragen
werden serialisiert; nach Löschung wird die Liste ab Seite 0 neu geladen.

Aktuell: 57 Node-Tests, Syntax-/TypeScript-/Build-Prüfung, 11 PGlite-Prüfgruppen
und Browserprüfung inklusive bestätigter Löschung bestanden. Neu:
`tools/account-races.cjs` für vier kontrolliert verzögerte Antwortfolgen. Das
Löschformular wurde mit axe ohne Verstöße im automatischen Prüfumfang getestet.
Reale Supabase-Abnahme bleibt offen (SUPABASE_SETUP.md Punkte 14–15).
