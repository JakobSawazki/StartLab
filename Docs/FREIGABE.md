# Freigabe vor dem nächsten Push

[Claude, 2026-10-17] · Ein Push nach `main` veröffentlicht die Website sofort über GitHub Pages.
Diese Liste hilft Jakob (oder Codex), den lokalen Stand bewusst freizugeben.

## Was sich öffentlich ändert

Seit dem veröffentlichten Stand `9946a19` lagen bei Erstellung dieser Liste 26 lokale Commits auf `main` (`git log --oneline 9946a19..HEAD`).
Auf der Website sichtbar werden:

- Station 02 „Willkommen bei Black-Forest-Industry“ mit NAGOLD, Eckdaten und den zehn Regeln.
- Materialdialoge mit Inhalten aus OneNote: Persönliche Vorstellung, Vertrag, Leistungsbewertung mit
  Notenschlüsseln BG/BK/IHK, Betriebspraktikum BK1, GFS BG, Termine 2026/27, Bildungspläne.
- Startseite „Als Nächstes“ (drei kommende Termine), Suche auch in den Inhalten.
- Barrierefreiheit, Druckansicht, Kontraste, mobiles Bingo, Content-Security-Policy.
- Kontofunktionen bleiben **aus** (`config.js` unverändert, `apiUrl: ''`).

Nicht veröffentlicht werden `resources/`, `private/` (Git-ignoriert) und `Docs/CLAUDE_HANDOFF.md`
(ungetrackt). Das Pages-Paket enthält nur die Dateien aus `tools/build.mjs`.

## Vor dem Push prüfen (ca. 10 Minuten)

1. Inhalte lesen: `npm run serve`, dann http://127.0.0.1:4173 – besonders Station 02,
   „Leistungsbewertung“, „Betriebspraktikum BK1“, „GFS“ und „Termine & Kalender“.
2. Offene Rückfragen in `Docs/claude2codex.md` Abschnitt 5 entscheiden oder bewusst offenlassen
   (z. B. IHK-Schlüssel, Praktikum „Stand 2025/26“).
3. Ist alles, was auf der Seite steht, für die Öffentlichkeit bestimmt? Das Repository und die
   Website sind öffentlich; Inhalte gelten auch ohne Anmeldung als veröffentlicht.
4. Automatische Prüfungen: `npm test` und `npm run check` (laufen auch im Pages-Workflow vor dem
   Deploy; ein Fehler stoppt die Veröffentlichung). Optional `node tools/link-check.mjs`.

## Veröffentlichen

```sh
git push origin main
```

Danach den Workflow „StartLab Pages“ auf GitHub abwarten und die Live-Seite öffnen:
https://jakobsawazki.github.io/StartLab/

## Falls etwas zurückgenommen werden muss

Einzelne Commits rückgängig machen, ohne die Historie umzuschreiben, z. B.:

```sh
git revert 675e865
git push origin main
```

`675e865` ist die Übernahme der OneNote-Inhalte; spätere Commits bauen darauf auf und müssen ggf.
mit zurückgenommen werden (`git log --oneline 675e865..HEAD`). Keine Force-Pushes auf `main`.
