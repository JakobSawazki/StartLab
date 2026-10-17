# Änderungen

## Veröffentlicht ohne neue Versionsnummer · 2026-10-17 [Claude]

Auf GitHub Pages seit Commit 7dfab4c (Freigabe durch Jakob).

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
