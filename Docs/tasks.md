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
  **Antwort 6 (Jakob im Chat, 17.10.2026, notiert von Claude):** Die Dokumente in `resources/`
  sollen inhaltlich in die Website integriert werden – der Inhalt, nicht die Dateien selbst.
  Umgesetzt: siehe documentation.md Abschnitt 8.10. Bingo-Original sowie Tipps/Hotkeys fehlen noch.
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
  [Codex, 2026-10-17] Alle vier Migrationen in Reihenfolge 0001 bis 0004 anwenden,
  Edge Function deployen, Secrets und Redirects konfigurieren.
- [ ] 12. Erstes bestätigtes Admin-Konto und SMTP einrichten; Registrierung gezielt freischalten.
- [ ] 13. [Claude, 2026-10-17] Vorab mit PGlite geprüft (tools/sql-check.mjs): Kürzel, Kollisionen,
  Mailabgleich, RLS/Rechte, Limits, Löschkaskade. Offen bleibt die echte Abnahme:
  Mit zwei Schüler-Testkonten und einem Admin-Konto RLS, parallele
  Kürzelkollision, E-Mail-Bestätigung, Recovery, unbefugte Adminaufrufe und Limits testen.
  [Codex, 2026-10-17] Zusätzlich vorhandene Tokens nach Abmeldung/Passwortwechsel
  sowie Auth-Bann und Profil-Sperre getrennt prüfen; Migration 0004 ergänzt die
  aktive Sitzungsprüfung für Edge-Aktionen und direkte Profilabfragen.
  Inzwischen auch mit echten lokalen Supabase-Komponenten einschließlich paralleler
  Registrierung und Mailpit bestanden (Aufgabe 29). Offen ist die Abnahme des
  gehosteten Projekts samt dessen SMTP-Dienst.
- [ ] 14. Kontosperre, Einladung/Freigabe, MFA, Kontolöschung, Auditansicht und
  ggf. Klassen-/Schuljahresverwaltung ausbauen. [Claude, 2026-10-17] Adminliste lädt jetzt
  seitenweise je 100 Konten; Auditansicht (letzte 100 Vorgänge) ergänzt. Beides gegen echtes
  Supabase ungeprüft. Kontosperre ergänzt (ungeprüft gegen echtes Supabase).
  [Codex, 2026-10-17] Kontolöschung mit Kürzelbestätigung, serverseitigem Schutz
  von Admin-/eigenen Konten und Audit ergänzt; lokale Abnahme bestanden, echte
  Supabase-Abnahme offen. [Codex, 2026-10-17] Admin-TOTP jetzt ebenfalls
  implementiert; Einrichtung, Codefehler, Freigabe und erneute MFA nach Login/
  Restore im lokalen Supabase geprüft. Offen: Einladung/Freigabe sowie gehostete
  MFA-Konfiguration und Abnahme mit der tatsächlichen Authenticator-App.
- [ ] 15. OneNote-Anhänge exportieren, lokal prüfen, Inhalte und Veröffentlichungsrechte sichten.
  [Claude, 2026-10-17] „Persönliche Vorstellung“ und „Vertrag“ liegen in `resources/` (jetzt
  Git-ignoriert) und sind gesichtet; Analyse lokal in `private/`.
  [Codex, 2026-10-17] Bestandsabgleich: Auch Leistungsbewertung, Bildungspläne,
  Praktikum, GFS und Kalender liegen vor und wurden bereits teilweise integriert.
  Offen sind insbesondere die Bingo-, Tipps- und Hotkey-Originale sowie die
  dokumentierten Inhaltsrückfragen; siehe ONENOTE_INVENTAR.md.
- [ ] 16. Bildungspläne zuordnen, bestehende Regeln und Bewertungsunterlagen übernehmen.
  [Claude, 2026-10-17] Regeln (Vertrag), Leistungsbewertung, Notenschlüssel BG/BK/IHK, Praktikum,
  GFS, Kalender 2026/27 und Bildungsplan-Links übernommen. Offen: Rückfragen in claude2codex.md.
- [ ] 17. Bedienung an Schul-PCs, per Tastatur, mit Screenreader und auf echten Mobilgeräten prüfen.
  [Claude, 2026-10-17] Teilweise: Tastatur-/Fokuslogik, Kontraste, 375-px-Ansicht und Druck lokal
  geprüft; Screenreader, Schul-PC und echte Geräte stehen aus.
- [ ] 18. Datenschutzinformationen vervollständigen, Backups und Wiederherstellung testen.
  [Codex, 2026-10-17] Sicherung/Wiederherstellung der Auth- und Anwendungsdaten
  im lokalen Supabase-Teststack bestanden. Offen: geschützter betrieblicher
  Sicherungsort, Rhythmus/Aufbewahrung und Abnahme im gehosteten Projekt.
  [Claude, 2026-10-17] Bestandsaufnahme der verarbeiteten Daten und Entwurfsgerüst in
  `Docs/DATENSCHUTZ_ENTWURF.md`; offen sind die dort mit [OFFEN] markierten Entscheidungen.
- [x] 22. [Claude, 2026-10-17] tools/browser-check.cjs um Dialognamen, Seitentitel, Bingo-Status,
  Druckmedium und simulierte Kontoabläufe erweitert; mit Edge bestanden.

## Veröffentlichungsstand

Repository und Live-Veröffentlichung: siehe [VERIFICATION.md](VERIFICATION.md).

## Weiterarbeit Codex [2026-10-17]

- [x] 23. Claudes Kontensperre und Sitzungsbehandlung nachgeprüft. Aktive
  Datenbanksitzung, Kontozuordnung, bestätigte E-Mail und beide Sperrsignale
  werden vor geschützten Aktionen geprüft. RLS-Regel entsprechend erweitert.
- [x] 24. Fehlgeschlagene globale Abmeldung nach Passwortwechsel wird nicht
  mehr als bestätigte Abmeldung aller Geräte ausgegeben.
- [ ] 25. Migration 0004 und die neuen Sitzungsfälle im echten Supabase abnehmen;
  Kontofunktionen bis zur Einrichtung und Abnahme weiter deaktiviert lassen.
- [x] 26. Kontolöschung für Nicht-Administratoren vorbereitet: Zielkonto prüfen,
  Kürzel eingeben, Auftrag protokollieren, Auth-Konto samt Profil/Sitzungen löschen;
  unbestätigte Löschung und Protokollfehler ausdrücklich behandeln.
- [x] 27. Verzögerte Kontoantworten nach Dialogwechsel/Schließen oder neuer
  Anmeldung werden verworfen; paralleles Laden derselben Kontenliste verhindert.
- [ ] 28. Kontolöschung gegen das gehostete Supabase-Projekt prüfen: Zielkonto,
  Profil, Sitzungen und anonymisierte Auditbezüge; blockierende Storage-Eigentümer
  und unbestätigte Antworten gesondert untersuchen. Keine automatische Löschfrist festgelegt.
- [x] 29. Vollständigen Supabase-Teststack auf temporärem GitHub-Runner eingerichtet
  und ausgeführt: zehn Prüfgruppen für parallele Registrierung, Bestätigungsmail,
  Kürzel, Rollen-/RLS-Trennung, Auth-Mailänderung, Recovery, Passwortwechsel,
  Abmeldung, Sperren und Löschung bestanden. Nur synthetische lokale Testdaten.
- [ ] 30. Ergebnisse der lokalen Integration nach Einrichtung des gehosteten
  Projekts dort reproduzieren; realen SMTP-Dienst und betriebliche Freigaben prüfen.
- [x] 31. Auth-/Anwendungsdaten per pg_dump sichern und im isolierten Stack
  wiederherstellen; Datenvergleich, bestehende Anmeldung, Adminrolle und RLS
  bestanden. Gesamtlauf umfasst nun elf Integrationsgruppen. BACKUP_RESTORE.md
  dokumentiert Umfang, Wartungsrechte und betriebliche Grenzen.
- [x] 32. Verpflichtende TOTP-Bestätigung für alle Adminaktionen ergänzt:
  Einrichtung und Codeansicht, serverseitiges AAL2 plus aktueller bestätigter
  Faktor, Schutz vor Ersatz durch bloßen Passwort-Reset. Browser-/Backend- und
  lokale Supabase-Prüfung bestanden; ADMIN_MFA.md dokumentiert Einrichtung.
- [ ] 33. Admin-TOTP im gehosteten Auth-Dienst aktivieren, mit echter App
  einrichten und Wiederherstellungszuständigkeit bei Faktorverlust festlegen.


## Gehostete Einrichtung [Codex, 2026-10-17]

- EU-Projekt in Sawazki angelegt (Aufgabe 10 technisch teilweise erledigt, schulische Freigabe offen).
- Alle vier Migrationen, Edge Function und Betriebswerte bereitgestellt, 13 gehostete Smoke-Prüfungen bestanden (Aufgabe 11). Weiterhin keine öffentliche Kontoanmeldung aktiviert.
- Site-/Redirect-URL, E-Mail-Bestätigung, zwölf Zeichen Mindestlänge und TOTP mit zwei Faktoren konfiguriert.
- Nächster notwendiger Schritt: Gmail-SMTP mit Jakobs gewählter Absenderadresse; App-Passwort ausschließlich durch Jakob direkt im Dienst eingeben. Danach erst Mailtest mit ausdrücklich gewähltem Empfänger und Admin-Einrichtung. Aufgaben 12/13/25/28/30/33 bleiben bis zur vollständigen Abnahme offen.
