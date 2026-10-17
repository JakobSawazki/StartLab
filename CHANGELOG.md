# Änderungen

## Unveröffentlicht · 2026-10-17 [Claude]

Kontenvorbereitung nachgebessert (einheitliche Kürzeltabelle, Migration 0002 mit
Mailabgleich, Auth-E-Mail als Quelle, Mail- und Tokenfehler sauber behandelt,
Abmeldung nach Passwortwechsel). Barrierefreiheit: Dialognamen und Fokus,
Seitentitel, Statusmeldungen, Kontraste, mobiles 4×4-Bingo, Druckansicht.
Adminliste seitenweise (je 100 Konten); Browser-Prüfstand um Barrierefreiheit,
Druck und simulierte Kontoabläufe erweitert.
Auth-Einstellungen in supabase/config.toml; Bingo-Reset. Schutztests für Build-Liste, Geheimnisse und apiUrl. Smoke-Test-Skript für die deployte Edge Function. Content-Security-Policy für die Website. Zeitlimits (Website 20 s, Edge 10 s je
Supabase-Aufruf) und verständliche Meldungen bei fehlender Verbindung.
Skiplink wechselt nicht mehr zur Übersicht; axe-Audit ohne Verstöße.
SQL-Prüfung beider Migrationen gegen PGlite (`tools/sql-check.mjs`).
Keine neue Version vergeben; Kontofunktionen bleiben deaktiviert.

## 0.1.0 · 2026-10-17 [Codex]

Erste StartLab-Version: Übersicht, drei Einstiegsstationen, Materialregal,
Kennenlern-Bingo, Druckvorlagen, lokale Startcheckliste und vorbereitete
Supabase-Architektur. Registrierung bleibt bis zur Einrichtung deaktiviert.
