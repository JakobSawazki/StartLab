# StartLab – Aufgaben und Fragen an Jakob

Stand: 17. Oktober 2026 · Codex, ergänzt von Claude

Nach dem Vorbild von Excel-Lab: nummerierte offene Fragen. Jakob kann hier mit
`Antwort 3: …` antworten. Erledigte Punkte werden im Protokoll der
`documentation.md` dokumentiert; Nummern werden nicht neu vergeben.

## Erledigt

- [x] 1. Projekt StartLab und Dokumentationsstruktur anlegen.
- [x] 2. Supabase als Backendgrundlage vorbereiten (Jakobs Auswahl im Chat).
- [x] 3. Erste motivierende Oberfläche mit Einstieg und Materialregal erstellen.
- [x] 4. Registrierung, Kürzel, Recovery und Adminübersicht als Backendcode vorbereiten.
- [x] Öffentliches GitHub-Repository und Live-Seite eingerichtet; siehe Prüfprotokoll.
- [x] 19. [Claude, 2026-10-17] Kontenarchitektur geprüft und nachgebessert: einheitliche Kürzeltabelle,
  Auth-E-Mail als Quelle, Mailfehler protokolliert, Tokenablauf, Abmeldung nach Passwortwechsel.
  Details in documentation.md Abschnitt 8; Migration 202610170002 neu.
- [x] 20. [Claude, 2026-10-17] Dialogfokus und -namen, Seitentitel, Kontraste, mobiles Bingo und
  Druckansicht verbessert; lokal geprüft (VERIFICATION.md).

## Fragen an Jakob

- **5.** Für welche Bildungsgänge, Klassen und welches Schuljahr startet StartLab?
- **6.** Welche vorhandenen OneNote-Dokumente sollen in ihrer Originalfassung
  öffentlich zugänglich sein? Besonders benötigt: persönliche Vorstellung,
  Kennenlern-Bingo, Vertrag, Leistungsbewertung und zugeordnete Bildungspläne.
- **7.** Wer übernimmt die schulische Verantwortung und welche E-Mail-Adresse
  wird für Kontomails verwendet? Welcher schulisch freigegebene SMTP-Dienst steht bereit?
- **8.** Sollen Registrierungen später nur mit Klassen-Einladung oder nach
  Freigabe durch die Lehrkraft zugelassen werden? Aktuell ist die Registrierung deaktiviert.
- **9.** Welche Löschfrist soll für Konten gelten, und wer darf zusätzlich zu
  Jakob administrieren? Noch keine automatische Löschung eingerichtet.
- **21.** [Claude, 2026-10-17] Wie sollen Personen ein Kürzel erhalten, deren Name keine zwei
  lateinischen Buchstaben enthält? Aktuell ist dann keine Registrierung möglich; das Formular
  verweist an die Lehrkraft. Denkbar wäre eine Vergabe durch die Lehrkraft.

## Technische nächste Schritte

- [ ] 10. Supabase-Projekt in EU-Region anlegen, schulische Freigabe und Dienstbedingungen klären.
- [ ] 11. [Claude, 2026-10-17] Nach dem Deploy `tools/smoke-check.mjs` ausführen (SUPABASE_SETUP.md).
  Beide Migrationen (0001, dann 0002) anwenden, Edge Function deployen, Secrets und Redirects konfigurieren.
- [ ] 12. Erstes bestätigtes Admin-Konto und SMTP einrichten; Registrierung gezielt freischalten.
- [ ] 13. [Claude, 2026-10-17] Vorab mit PGlite geprüft (tools/sql-check.mjs): Kürzel, Kollisionen,
  Mailabgleich, RLS/Rechte, Limits, Löschkaskade. Offen bleibt die echte Abnahme:
  Mit zwei Schüler-Testkonten und einem Admin-Konto RLS, parallele
  Kürzelkollision, E-Mail-Bestätigung, Recovery, unbefugte Adminaufrufe und Limits testen.
- [ ] 14. Kontosperre, Einladung/Freigabe, MFA, Kontolöschung, Auditansicht und
  ggf. Klassen-/Schuljahresverwaltung ausbauen. [Claude, 2026-10-17] Adminliste lädt jetzt
  seitenweise je 100 Konten (erledigt, gegen echtes Supabase ungeprüft).
- [ ] 15. OneNote-Anhänge exportieren, lokal prüfen, Inhalte und Veröffentlichungsrechte sichten.
  [Claude, 2026-10-17] „Persönliche Vorstellung“ und „Vertrag“ liegen in `resources/` (jetzt
  Git-ignoriert) und sind gesichtet; Analyse lokal in `private/`. Bingo und Leistungsbewertung fehlen.
- [ ] 16. Bildungspläne zuordnen, bestehende Regeln und Bewertungsunterlagen übernehmen.
- [ ] 17. Bedienung an Schul-PCs, per Tastatur, mit Screenreader und auf echten Mobilgeräten prüfen.
  [Claude, 2026-10-17] Teilweise: Tastatur-/Fokuslogik, Kontraste, 375-px-Ansicht und Druck lokal
  geprüft; Screenreader, Schul-PC und echte Geräte stehen aus.
- [ ] 18. Datenschutzinformationen vervollständigen, Backups und Wiederherstellung testen.
- [x] 22. [Claude, 2026-10-17] tools/browser-check.cjs um Dialognamen, Seitentitel, Bingo-Status,
  Druckmedium und simulierte Kontoabläufe erweitert; mit Edge bestanden.

## Veröffentlichungsstand

Repository und Live-Veröffentlichung: siehe [VERIFICATION.md](VERIFICATION.md).
