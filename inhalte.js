// [Claude, 2026-10-17] Inhalte aus Jakobs OneNote-Originalen (resources/, nicht veröffentlicht).
// Übernommen auf Jakobs Wunsch: Inhalt ja, Dateien nein. Anrede an die Website angepasst (du),
// Regeln, Kriterien und Zahlen wörtlich bzw. aus den Excel-Dateien erzeugt. Keine Personennamen
// außer der Lehrkraft, keine internen Konferenztermine, keine Schülerdaten.

export const vorstellung = {
 quelle: 'OneNote „Unternehmen“ – Persönliche Vorstellung',
 ablauf: [
  {zeit: '10 Minuten', text: 'Einzelarbeit: Beantworte die Fragen für dich und mach dir Notizen.'},
  {zeit: '5 Minuten', text: 'Stell dich deinen Mitschülerinnen und Mitschülern mit Hilfe der Fragen vor.'},
  {zeit: '10 Minuten', text: 'Bildet Vierergruppen und bereitet eine gemeinsame Vorstellung eurer Gruppe vor.'},
  {zeit: '5 Minuten pro Gruppe', text: 'Jede Gruppe stellt sich der Klasse vor.'}
 ],
 kurzfragen: ['Welches Tier passt zu mir?', 'Was ist mein Lieblingsessen?', 'Was sind meine Hobbys / was mache ich gerne?', 'Was sind meine Ziele (schulisch / beruflich)?', 'Wo sehe ich mich in 10 Jahren?'],
 fragen: [
  {titel: 'Wer bin ich? Etwas über mich und meine Person.', punkte: ['Vorname, Nachname. Bisher besuchte Schulen.', 'Wo bin ich geboren, aufgewachsen? Wie und wo lebe ich?']},
  {titel: 'Meine Persönlichkeit und mein Umgang mit anderen Personen.', punkte: ['Was liegt mir mehr: Auge (sehen, beobachten), Ohr (hören, aufnehmen), Mund (sprechen, mitteilen)?', 'Was ist für mich der richtige Platz unter Menschen?', 'Welches Tier passt am besten zu mir?']},
  {titel: 'Was habe ich in meiner bisherigen Schulzeit gelernt …', punkte: ['über mich selbst?', 'über meine Mitschülerinnen und Mitschüler?', 'über meine Lehrerinnen und Lehrer?']},
  {titel: 'Meine Ziele, meine Visionen.', punkte: ['Was ist mein Berufswunsch oder sogar mein Traumberuf?', 'Wie will ich dieses Ziel erreichen? Was bin ich bereit, dafür zu investieren?']},
  {titel: 'Meine konkreten Vorstellungen vom kommenden Schuljahr.', punkte: ['Warum bin ich hier an der Schule? Mit welchen Gedanken und Erwartungen komme ich hierher?', 'Was bringe ich mit? Was kann ich gut? Was kann ich weniger gut? Meine Qualifikationen, Kenntnisse, Fertigkeiten sind …', 'Meine Ziele für das kommende Schuljahr sind … Zur Erreichung meiner Ziele bin ich bereit, Folgendes zu tun … Was möchte ich zukünftig ändern? Was beibehalten?', 'Ich möchte, dass meine Mitschülerinnen und Mitschüler, Lehrerinnen und Lehrer im kommenden Schuljahr mit mir umgehen, indem sie …', 'Ich möchte mit allen in der Klasse umgehen, indem ich …', 'Ich werde die Klassengemeinschaft mitgestalten, indem ich …']},
  {titel: 'Was ich sonst noch sagen möchte …', punkte: []}
 ]
};

export const unternehmen = {
 quelle: 'OneNote „Unternehmen“ – Vertrag und Seite „Unternehmen“',
 name: 'Black-Forest-Industry',
 einleitung: [
  'Ab heute bist du Mitarbeiterin oder Mitarbeiter im Unternehmen Black-Forest-Industry. Du bewältigst gemeinsam mit deinen Kolleginnen und Kollegen Arbeits- und Projektaufträge in Einzel- sowie in Teamarbeit.',
  'Dein Geschäftsführer (Herr Sawazki) weist dich in deine Aufgaben ein und macht dich mit deinen Kunden- und Projektaufträgen vertraut.',
  'Als Mitarbeiterin oder Mitarbeiter von Black-Forest-Industry erhältst du auch Gehalt (sogenanntes NAGOLD). Dieses Gehalt wird dir ausgezahlt und fließt in die Bewertung deiner kontinuierlich erbrachten Leistung ein (vgl. Informationen zur Leistungsbewertung).'
 ],
 nagoldFuer: ['erfolgreich absolvierte Kunden-, Arbeits- und Projektaufträge', 'konstruktive Teamarbeit', 'qualitativ / quantitativ gute (mündliche) Mitarbeit', 'Sozialkompetenz, Teamwork', 'zusätzliche Präsentationen, eigenverantwortliche Projekte', 'Mitarbeit unter OneNote (Digitalplattformen)'],
 regelnHinweis: 'In unserem Unternehmen sind ebenso Regeln von jedem Mitarbeiter einzuhalten. Bei Nichteinhaltung der jeweiligen Regel werden die angegebenen NAGOLD als Sanktion einbehalten.',
 regeln: [
  ['Smartphones lautlos stellen', '−1'],
  ['Smartphones / Tablets / Notebooks nur zum Arbeiten erlaubt', '−1'],
  ['Kapuzen im Unterricht abziehen', '−1'],
  ['Erst melden, dann sprechen (zu häufiges Auffallen)', '−1'],
  ['Trinken / Essen im IT-Raum nicht erlaubt', '−1'],
  ['Toilettengänge erlaubt (immer nur eine Person)', '−1'],
  ['Unentschuldigte Verspätung (in der Summe für alle 30 min)', '−5'],
  ['Respektloses / störendes Verhalten (z. B. laut Hineinrufen)', '≤ −1'],
  ['Missbrauch von Daten (OneNote)', '−1'],
  ['Betrugsfälle jeglicher Art in unserem Unternehmen (NAGOLD-Manipulation)', '≤ −5']
 ],
 eckdaten: ['Startkapital: 5 NAGOLD', 'Richtwert: 100 NAGOLD ⇒ Note 1', 'Anwesenheit: 2 NAGOLD'],
 jobs: [['Personalrat', 2, 2], ['Stuhlbeauftragte/r', 1, 2], ['FinanzmanagerIn', 1, 2], ['BewertungsmanagerIn', 2, 2], ['KlimamanagerIn', 1, 2], ['TafelmanagerIn', 1, 2]],
 firmenserver: 'Ab heute erhältst du als Mitarbeiterin oder Mitarbeiter von Black-Forest-Industry Zutritt zu unserem gemeinsamen Firmenserver (OneNote). Hierauf werden wir gemeinsam Arbeits- und Projektaufgaben ablegen und die Ergebnisse abspeichern. Alle Mitarbeiterinnen und Mitarbeiter haben Lese- und Zugriffsrechte! Achte bitte darauf, dass beim Schreibzugriff jegliche Daten (auch deine!) gelöscht werden können. Arbeite daher stets gewissenhaft und mit Bedacht!'
};

export const bewertung = {
 quelle: 'OneNote „Leistungsbewertung“ – Informationen zur Leistungsbewertung im Lernfeld (Informatik, Berufsschule)',
 einleitung: 'Vorschlag für die Ausgestaltung der Bewertung der Leistungen im Lernfeld. Die Verteilung der NAGOLD lässt sich auf den schulinternen Bewertungsschlüssel zurückführen. Hierbei entspricht ein NAGOLD einem Bewertungspunkt.',
 anteile: [
  {art: 'Leistungsnachweise', ausfuehrung: ['Pro Halbjahr: 1 schriftliche Arbeit', 'Benotung durch die Lehrkraft nach schulinternem Bewertungsschema'], anteil: '50 %'},
  {art: 'Kontinuierlich erbrachte Leistungen (keL) – NAGOLD', ausfuehrung: ['Beiträge zum Unterrichtsgeschehen, Strukturierung im Arbeitsverhalten, Mitarbeit auf den Lernplattformen OneNote, Kahoot! etc. (Qualität und Quantität der Beiträge) – Benotung gemäß Bewertungsmatrix für kontinuierlich erbrachte Leistungen', 'Technische Dokumentation eines Projektauftrages (Lastenheft / Pflichtenheft): eine rechnergestützt gefertigte technische Gesamtdokumentation – Einzel- sowie Gruppenarbeitsbewertung', 'Projektaufträge: bewertete Partner- oder Teamarbeit zu einem Projekt- bzw. Kundenauftrag – Einzel- sowie Gruppenarbeitsbewertung'], anteil: '50 %'}
 ],
 matrixKoepfe: ['Note', 'Beiträge – Quantität', 'Beiträge – Qualität (Kenntnisstand über die bisherigen Kursinhalte)', 'Personale und soziale Komponente', 'Umgang mit Informationssystemen (IS), Dateien, Arbeitsaufträgen und -materialien'],
 matrix: [
  ['1 – Die Leistung entspricht den Anforderungen in besonderem Maße.', 'Konstante überragende Mitarbeit', 'Sehr gut: bringt immer eigene Ideen ein, gibt Wissen immer weiter (in Form von Unterstützung für andere, Ausarbeitungen, Vorträgen) …', 'Fähigkeit, immer eigenständig zu strukturieren, zusammenzufassen, konzentriert und zielgerichtet zu arbeiten; unterstützt immer selbstständig andere', 'Nutzt bereitgestellte IS immer zielgerichtet, sehr gute Organisation der handschriftlichen und digitalen Datenbestände, dokumentiert Ergebnisse immer übersichtlich und nachvollziehbar'],
  ['2 – Die Leistung entspricht den Anforderungen voll.', 'Konstante gute Mitarbeit', 'Gut: bringt überwiegend eigene Ideen ein, gibt Wissen meistens weiter (in Form von Unterstützung für andere, Ausarbeitungen, Vorträgen) …', 'Fähigkeit, überwiegend eigenständig zu strukturieren, zusammenzufassen, konzentriert und zielgerichtet zu arbeiten; unterstützt manchmal selbstständig andere', 'Nutzt bereitgestellte IS überwiegend zielgerichtet, gute Organisation der handschriftlichen und digitalen Datenbestände, dokumentiert Ergebnisse überwiegend übersichtlich und nachvollziehbar'],
  ['3 – Die Leistung entspricht im Allgemeinen den Anforderungen.', 'Regelmäßige Mitarbeit in allen Stunden', 'Zufriedenstellend: entwickelt manchmal eigene Ideen und bringt diese im Unterricht ein, gibt Wissen manchmal weiter', 'Fähigkeit, meistens eigenständig zu strukturieren, zusammenzufassen, am Thema zu arbeiten; unterstützt nach Aufforderung andere', 'Nutzt bereitgestellte IS meist zielgerichtet, erkennbare Organisation der handschriftlichen und digitalen Datenbestände, dokumentiert Ergebnisse meistens übersichtlich und nachvollziehbar'],
  ['4 – Die Leistung weist zwar Mängel auf, entspricht aber im Ganzen noch den Anforderungen.', 'Unregelmäßige Mitarbeit; nicht in allen Stunden; oft nur nach Aufforderung', 'Teilweise lückenhaft: entwickelt manchmal eigene Ideen und bringt diese manchmal im Unterricht ein, gibt Wissen selten weiter', 'Fähigkeit, manchmal eigenständig zu strukturieren, zusammenzufassen, zu arbeiten; holt sich Hilfe, wenn nötig, braucht manchmal Unterstützung', 'Nutzt bereitgestellte IS manchmal zielgerichtet, kaum Organisation der handschriftlichen und digitalen Datenbestände, dokumentiert Ergebnisse manchmal übersichtlich und nachvollziehbar'],
  ['5 – Die Leistung entspricht den Anforderungen nicht, lässt jedoch erkennen, … (siehe Notendefinition)', 'Gelegentliche Mitarbeit; meist nur nach Aufforderung', 'Stark lückenhaft: entwickelt selten eigene Ideen und bringt diese selten im Unterricht ein, gibt Wissen nicht weiter', 'Fähigkeit des eigenständigen strukturierten Arbeitens ist gering ausgeprägt, braucht überwiegend Unterstützung, holt sich selten Hilfe, wenn nötig', 'Nutzt bereitgestellte IS kaum zielgerichtet, keine Organisation der handschriftlichen und digitalen Datenbestände, dokumentiert Ergebnisse selten übersichtlich und nachvollziehbar'],
  ['6 – Die Leistung entspricht den Anforderungen nicht, … (siehe Notendefinition)', 'Äußerst seltene Mitarbeit; auch nicht nach Aufforderung', 'Minimal: entwickelt kaum eigene Ideen und bringt diese nicht im Unterricht ein; wesentliche vorgegebene Inhalte werden nicht erfasst oder umgesetzt', 'Fähigkeit des eigenständigen strukturierten Arbeitens fehlt, holt sich kaum Hilfe, wenn nötig, ist auf Unterstützung angewiesen', 'Nutzt bereitgestellte IS äußerst selten zielgerichtet, keine Organisation der handschriftlichen und digitalen Datenbestände, dokumentiert Ergebnisse weder übersichtlich noch nachvollziehbar']
 ],
 kopfnoten: {
  quelle: 'Erläuterungen zu den Kopfnoten für Verhalten und Mitarbeit (in Anlehnung an die Ergänzungslieferung zum Schulrecht vom Mai 2002)',
  hinweise: ['Die Note 2 als Regelnote sollte erteilt werden, wenn die Kriterien für diese Note überwiegend erfüllt sind.', 'Bei von der Klassenkonferenz erteilter Attestpflicht kann für Verhalten höchstens die Note 3 erteilt werden.'],
  stufen: [
   ['sehr gut (1): Verhalten bzw. Mitarbeit verdienen besondere Anerkennung', 'Alle Kriterien der Note 2 sind erfüllt und darüber hinaus: übernimmt bereitwillig Gemeinschaftsaufgaben, setzt sich aktiv für die Lösung von Konflikten ein', 'Kriterien der Note 2 sind erfüllt und darüber hinaus: entwickelt Eigeninitiative, hat überdurchschnittliches Interesse'],
   ['gut (2): Regelnote', 'nimmt regelmäßig am Unterricht teil, ist pünktlich, verlässlich, erkennt Ordnungsprinzipien an, ist ehrlich, rücksichtsvoll, hilfsbereit, tolerant, höflich', 'kann selbstständig arbeiten, macht regelmäßig Hausaufgaben, nimmt aufmerksam am Unterricht teil, bringt eigenständig Beiträge'],
   ['befriedigend (3): Verhalten und Mitarbeit entsprechen ohne wesentliche Einschränkungen den Erwartungen', 'fehlt häufig beim Unterricht oder ist unpünktlich, stört den Unterricht, ist gleichgültig gegenüber Ordnungsprinzipien, unhöflich, unzuverlässig, geltungsbedürftig und vorlaut, geschwätzig, unehrlich', 'ist gleichgültig, lustlos, hat lückenhaft angefertigte Hausaufgaben, arbeitet weitgehend unselbstständig'],
   ['unbefriedigend (4): Verhalten und Mitarbeit entsprechen nicht den Erwartungen', 'Kriterien der Note 3 sind erfüllt und darüber hinaus: ist rücksichtslos gegenüber Personen und Sachen, stört permanent den Unterricht, ist frech, Ordnungsmaßnahmen sind angedroht und verhängt', 'Kriterien der Note 3 sind erfüllt und darüber hinaus: macht Hausaufgaben unregelmäßig oder überhaupt nicht, ist teilnahmslos und desinteressiert am Unterricht']
  ]
 }
};

// Prozentbänder aus BG.xlsx bzw. BK.xlsx automatisch erzeugt (siehe Docs/documentation.md 8.10).
export const schluessel = {
 bg: {titel: 'Berufliches Gymnasium', spalten: ['Prozent', 'Note', 'Notenpunkte'], baender: [[95, 100, '1+', 15], [90, 94, '1', 14], [85, 89, '1−', 13], [80, 84, '2+', 12], [75, 79, '2', 11], [70, 74, '2−', 10], [65, 69, '3+', 9], [60, 64, '3', 8], [55, 59, '3−', 7], [50, 54, '4+', 6], [45, 49, '4', 5], [40, 44, '4−', 4], [33, 39, '5+', 3], [27, 32, '5', 2], [20, 26, '5−', 1], [0, 19, '6', 0]]},
 bk: {titel: 'Berufskolleg', spalten: ['Prozent', 'Note'], baender: [[100, 100, 1], [97, 99, 1.1], [95, 96, 1.2], [94, 94, 1.3], [91, 93, 1.4], [90, 90, 1.5], [87, 89, 1.6], [85, 86, 1.7], [84, 84, 1.8], [81, 83, 1.9], [79, 80, 2], [77, 78, 2.1], [75, 76, 2.2], [73, 74, 2.3], [71, 72, 2.4], [69, 70, 2.5], [67, 68, 2.6], [65, 66, 2.7], [63, 64, 2.8], [61, 62, 2.9], [59, 60, 3], [57, 58, 3.1], [55, 56, 3.2], [53, 54, 3.3], [51, 52, 3.4], [49, 50, 3.5], [47, 48, 3.6], [45, 46, 3.7], [43, 44, 3.8], [41, 42, 3.9], [39, 40, 4], [37, 38, 4.1], [35, 36, 4.2], [33, 34, 4.3], [31, 32, 4.4], [29, 30, 4.5], [27, 28, 4.6], [25, 26, 4.7], [23, 24, 4.8], [21, 22, 4.9], [19, 20, 5], [17, 18, 5.1], [15, 16, 5.2], [13, 14, 5.3], [11, 12, 5.4], [9, 10, 5.5], [7, 8, 5.6], [5, 6, 5.7], [3, 4, 5.8], [1, 2, 5.9], [0, 0, 6]]},
 ihk: {titel: 'IHK-Bewertungsschlüssel', spalten: ['Punkte', 'Note'], baender: [[100, 100, 1], [98, 99, 1.1], [96, 97, 1.2], [94, 95, 1.3], [92, 93, 1.4], [91, 91, 1.5], [90, 90, 1.6], [89, 89, 1.7], [88, 88, 1.8], [87, 87, 1.9], [85, 86, 2], [84, 84, 2.1], [83, 83, 2.2], [82, 82, 2.3], [81, 81, 2.4], [79, 80, 2.5], [78, 78, 2.6], [77, 77, 2.7], [75, 76, 2.8], [74, 74, 2.9], [72, 73, 3], [71, 71, 3.1], [70, 70, 3.2], [68, 69, 3.3], [67, 67, 3.4], [65, 66, 3.5], [63, 64, 3.6], [62, 62, 3.7], [60, 61, 3.8], [58, 59, 3.9], [56, 57, 4], [55, 55, 4.1], [53, 54, 4.2], [51, 52, 4.3], [50, 50, 4.4], [48, 49, 4.5], [46, 47, 4.6], [44, 45, 4.7], [42, 43, 4.8], [40, 41, 4.9], [38, 39, 5], [36, 37, 5.1], [34, 35, 5.2], [32, 33, 5.3], [30, 31, 5.4], [25, 29, 5.5], [20, 24, 5.6], [15, 19, 5.7], [10, 14, 5.8], [5, 9, 5.9], [0, 4, 6]]}
};

export const praktikum = {
 quelle: 'OneNote „Betriebspraktikum BK1“ – Informationen, Hinweise, Elternbrief und Bewertungskriterien 2026/27',
 eckdaten: [
  'Das berufsorientierte Betriebspraktikum ist Voraussetzung für die Aufnahme ins BK 2.',
  'Es ist nicht nur in kaufmännischen Bereichen möglich, sondern steht allen Berufsrichtungen offen.',
  'Pflichtwoche im BK 1 und BKFR 1: Montag, 15.02., bis Freitag, 19.02.2027. Eine weitere freiwillige Woche ist in den Ferien möglich, z. B. in den Winter-, Oster- oder Pfingstferien. Bei zwei Wochen sind zwei unterschiedliche Praktikumsstellen möglich.',
  'Das Praktikum dauert fünf bis zehn Tage und beginnt jeweils montags und endet freitags.'
 ],
 schritte: [
  {wann: 'ab sofort', text: 'Du bewirbst dich selbstständig bei möglichen Betrieben, Behörden oder Ämtern. Unterstützung erhältst du von deinen Lehrkräften und der Agentur für Arbeit (www.arbeitsagentur.de). Anmeldeformular und Hinweise bekommst du von deinen Klassenlehrkräften.'},
  {wann: 'bis 01.12.2026', text: 'Melde deine Praktikumsstelle deinen Klassenlehrkräften, damit sie dich bei Bedarf noch bei der Suche unterstützen können.'},
  {wann: 'nach den Weihnachtsferien', text: 'Wer noch keine Praktikumsstelle hat, führt ein Gespräch mit den Klassenlehrkräften über das weitere Vorgehen. Ziel ist, dass alle eine Praktikumsstelle haben.'},
  {wann: '15.02.–19.02.2027', text: 'Praktikumswoche. Wer kein Praktikum absolviert, wird morgens in einer gemeinsamen Klasse unterrichtet und verfasst nachmittags eine Ersatzleistung für den Praktikumsbericht.'},
  {wann: 'bis 03.03.2027', text: 'Abgabe des schriftlichen Praktikumsberichts bei deiner Informatik- bzw. Büromanagement-Fachlehrkraft.'},
  {wann: 'bis 04.06.2027', text: 'Bericht, Präsentation und Kolloquium fließen als weitere Schülerleistung in das Fach Projektkompetenz (BK 1) bzw. Büromanagement (BKFR 1) ein und werden bewertet.'}
 ],
 recht: ['Das Praktikum ist rechtlich und versicherungstechnisch eine Schulveranstaltung; du bist über die Schule gesetzlich unfallversichert.', 'Es ist weder ein Ausbildungs- noch ein Beschäftigungsverhältnis; eine Vergütung ist nicht vorgesehen.', 'Im Betrieb gilt die Betriebsordnung. Das Führen von Kraftfahrzeugen aller Art ist verboten, auch innerhalb des Betriebs.'],
 form: ['Links oben geheftet und gelocht, keine Mappe nötig', 'Deckblatt mit einem Foto von dir am Arbeitsplatz, deinem Namen und deiner Adresse sowie der betreuenden Ansprechperson', 'Inhaltsverzeichnis', 'Mindestens 4 Seiten Fließtext in max. 12er-Schriftgröße, max. 1,5 Zeilenabstand, Schrift: Calibri (ohne Deckblatt, Inhaltsverzeichnis, Bilder und weitere Anlagen)', 'Quellenangaben', 'Eigenständigkeitserklärung mit Angabe zur KI-Nutzung, unterschrieben – jede und jeder legt einen eigenen Bericht vor'],
 steckbrief: ['Unternehmen/Einrichtung (Gründung/Historie)', 'Anzahl der Mitarbeiter, Rechtsform, Niederlassungen national/international', 'Geschäftsform (Standort beschreiben)', 'Branche/Wirtschaftssektor', 'Geschäftsführung, Aufbau des Unternehmens, Abteilungen', 'Produktpalette/Service', '„Company Benefits“, Angebote bzw. Vorteile für Mitarbeiter, Auszeichnungen, Zertifikate', 'Ausbildungs- und Weiterbildungsmöglichkeiten'],
 weitereInhalte: ['Eigene Tätigkeitsbereiche (evtl. mit Beschreibung von Prozessabläufen, Bildern, Flyern)', 'Eigene Erfahrungen im Praktikum', 'Ausbildungsstellen / duales Studium?', 'Potenzieller Arbeitgeber?'],
 bewertung: [['Inhalt', '70 %'], ['Umfang', '10 %'], ['Layout', '20 %']],
 bewertungHinweise: ['Bewertet wird in halben Noten.', 'Mangelnde Rechtschreibung und Zeichensetzung: bis zu einer Note Abzug.', 'Bericht : Präsentation und Fachgespräch = 1 : 2'],
 praesentation: ['Inhalt', 'Aufbau (Begrüßung, sinnvolle Reihenfolge, roter Faden, Schluss)', 'Sprache und Rechtschreibung', 'Anschaulichkeit (z. B. Bilder, Skizzen, Diagramme, Beispiele, nicht zu viel Text)', 'Zeitvorgabe: mindestens 5 Minuten pro Person'],
 klasse: {
  titel: 'Umsetzung in den Informatikklassen von Herrn Sawazki',
  stand: 'Stand der OneNote-Seite: Schuljahr 2025/26. Termine für 2026/27 siehe oben.',
  punkte: [
   'Abgabe des Berichts in OneNote (Collaboration Space → Praktikumsbericht) als PDF oder Word, keine Fotos einzelner Seiten.',
   'Wenn du KI nutzt: kurz notieren wofür (z. B. Rechtschreibung, Gliederung) und das Tool bzw. den Link angeben.',
   'Präsentation als Website (HTML/CSS) mit kurzem Reflexionsgespräch; Mindestdauer 5 Minuten pro Person, Richtwert 10 Minuten inklusive Rückfragen.',
   'Das Website-Projekt ersetzt in Informatik eine Klassenarbeit (Lehrplaneinheit „Entwurf und Gestaltung statischer Webseiten“). Die Informatiknote bezieht sich auf Technik und Code, die Praktikumsnote in Projektkompetenz auf Inhalte, Präsentation und Reflexion.'
  ],
  website: ['Startseite (index.html) mit Überschrift, Absätzen und Liste: Praktikum (Betrieb, Zeitraum, Bereich/Abteilung)', 'Unterseite 1: Tätigkeiten (3–5 typische Aufgaben)', 'Unterseite 2: Erkenntnisse/Reflexion (Was gelernt? Was hat überrascht?)', 'Unterseite 3: Quellen und KI-Hinweis', 'Mindestens 1 Bild (wenn erlaubt) oder ein Symbol/Platzhalter, mindestens 2 Links (z. B. Betrieb/Branche, Ausbildung)', 'Einfache CSS-Gestaltung (Schrift, Abstände, Farben – schlicht reicht) und klare Struktur (Ordner /images, sinnvolle Dateinamen)']
 }
};

export const gfs = {
 quelle: 'OneNote „GFS BG“ – Informationsblatt nach § 16 BGVO und Anforderungen im Fach Informatik',
 allgemein: [
  'In jedem der Halbjahre J1.1, J1.2 und J2.1 ist eine GFS zu halten bzw. zu erstellen. Sie wird wie eine weitere schriftliche Klassenarbeit gewichtet.',
  'Innerhalb der ersten 6 Wochen der J1.1 wählst du die 3 Fächer, in denen du eine GFS halten möchtest. Die Oberstufenberatung koordiniert mit den Fachlehrkräften eine gleichmäßige Verteilung; du erhältst ein Dokumentationsblatt mit deinen 3 GFS-Fächern.',
  'Die GFS werden auf einem „Laufzettel“ festgehalten. Du bist für deinen Laufzettel verantwortlich und bewahrst ihn bis zum bestandenen Abitur auf; er ist zwingende Voraussetzung für die Zulassung zum Abitur.',
  'Vor der Notenkonferenz des Halbjahres J2.1 legst du den Laufzettel mit drei GFS deiner Klassenlehrkraft zur Kontrolle vor.',
  'Wer ein Halbjahr wiederholt, muss die GFS dieses Halbjahres neu erbringen.',
  'Kannst du wegen Krankheit den Termin nicht wahrnehmen, legst du innerhalb von drei Unterrichtstagen eine ärztliche Bescheinigung vor. Die Fachlehrkraft bestimmt dann Form und Zeitpunkt des Nachholens. Die GFS kann nicht entfallen. In anderen Fällen wird eine nicht erbrachte GFS mit 00 Punkten bewertet.',
  'Fachliche Fragen: deine Fachlehrkraft. Organisatorische Fragen: die Oberstufenberatung.'
 ],
 informatik: {
  gewichtung: [['Schriftliche Ausarbeitung', '60 %'], ['Präsentation mit anschließendem Kolloquium', '40 %']],
  gewichtungHinweis: 'Beide Teile fließen gemeinsam in die GFS-Note ein. Eine sehr schwache oder offensichtlich unzureichende Teilleistung kann die Gesamtnote deutlich begrenzen.',
  umfang: 'Richtwert ca. 10–15 Seiten, ohne Deckblatt, Inhaltsverzeichnis und Quellenverzeichnis. Ein Anhang (z. B. Code, ER-Diagramme, Screenshots) zählt nicht zum Seitenumfang.',
  bestandteile: ['Deckblatt (Thema, Name, Klasse, Datum, Fach, Lehrkraft)', 'Inhaltsverzeichnis mit Seitennummern', 'Einleitung (Thema, Ziel der Arbeit, Aufbau)', 'Hauptteil (fachliche Ausarbeitung)', 'Fazit / Ausblick', 'Quellenverzeichnis (Literatur, Websites, ggf. KI, Dokus, Videos)', 'ggf. Anhang (Code, Diagramme, Tabellen, Screenshots …)'],
  inhalt: ['Fachliche Tiefe: theoretische Grundlagen, fachliche Begriffsverwendung und konkrete Beispiele/Anwendungen', 'Praxisbezug: eigene Beispiele, kleine Experimente, Screenshots, Diagramme, Code-Auszüge, ER-Modelle; wenn möglich ein eigener praktischer Teil (Programm, Datenbank, Simulation, Skript)', 'Sprache und Stil: sachlich, klar, durchgängig im selben Stil, keine Umgangssprache, keine Stichwortsätze', 'Klare Gliederung, korrekte Zitation (Fußnoten oder Kurzbelege wie „(Muster, 2023)“), mehrere Quellen (nicht nur Wikipedia), wörtliche Zitate gekennzeichnet'],
  praesentation: ['Dauer ca. 15–20 Minuten; Medien z. B. PowerPoint, OneNote, Live-Demo, Visualisierung von Diagrammen/Code', 'Kurze Einführung, verständliche Darstellung der wichtigsten Begriffe und Zusammenhänge, anschauliche Beispiele, Verknüpfung mit Inhalten der J1/J2', 'Kolloquium ca. 5–10 Minuten mit fachlichen Rückfragen – du zeigst, dass du das Thema wirklich verstanden hast'],
  themenbereiche: ['Programmierung (BPE 5)', 'Relationale Datenbanken (BPE 6)', 'Algorithmen und Datenstrukturen (BPE 7)', 'Netze und vernetzte Gesellschaft (BPE 3)', 'Gesellschaftliche Aspekte von Algorithmen und Informatik (BPE 8)'],
  vorgaben: ['Das Thema wird mit der Lehrkraft abgesprochen und freigegeben.', 'Es wird durch eigene Recherche und ein klar strukturiertes Konzept erarbeitet.', 'Theoretische Grundlagen und praktische Anwendungsbeispiele kommen beide vor.'],
  kompetenzen: ['Strukturieren und Vernetzen', 'Modellieren und Implementieren', 'Kommunizieren und Kooperieren', 'Analysieren und Bewerten'],
  ki: ['Der Einsatz von KI (z. B. ChatGPT, Copilot, Gemini, DeepL Write) ist erlaubt, aber nur mit vollständiger Transparenz.', 'Die GFS enthält eine unterschriebene Eigenständigkeitserklärung, in der auch verwendete KI-Systeme angegeben sind.', 'Kennzeichne, welche KI-Systeme du wofür genutzt hast (z. B. Rechtschreibung, Gliederung, Beispieltexte, Ideen, Code- oder SQL-Vorschläge).', 'Dokumentiere wichtige Prompts und Chatverläufe im Anhang oder als Link.', 'KI-Texte müssen kritisch geprüft und angepasst werden. Unreflektiertes Übernehmen ohne Kennzeichnung kann als Täuschungsversuch gewertet werden.'],
  beispiele: [['Entwicklung einer interaktiven Anwendung mit Python', 'BPE 5'], ['Modellierung und Implementierung einer relationalen Datenbank für eine Vereinsverwaltung', 'BPE 6'], ['Effiziente Such- und Sortieralgorithmen: Analyse und Implementierung', 'BPE 7'], ['Sicherheitsaspekte in der vernetzten Gesellschaft: Chancen und Risiken', 'BPE 3'], ['Der Einfluss von Algorithmen auf unseren Alltag: Chancen und Risiken der Digitalisierung', 'BPE 8']]
 }
};

export const bildungsplaene = {
 quelle: 'OneNote „Bildungspläne“ – Links und Dokumente; Links am 17.10.2026 geprüft',
 links: [
  ['Bildungspläne Baden-Württemberg (Startseite)', 'https://bildungsplaene-bw.de/,Lde/Startseite'],
  ['BK 1 – Informatik (Kaufmännisches Berufskolleg I)', 'https://bildungsplaene-bw.de/site/bildungsplan-rebrush2024/get/documents_E-245063636/lsbw/Bildungsplaene-BERS/MediaCenter/bk/bk_schv/bk_kfm/bk1/08_3571_Kfm-BK%20I_Informatik.pdf'],
  // [Claude, 2026-10-17] Der OneNote-Link (Pfad /site/bildungsplan/) lieferte dauerhaft HTTP 503; gleiche Dokumentnummer unter /site/bildungsplan-rebrush2024/, Inhalt geprüft.
  ['BK 2 – Informatik (Kaufmännisches Berufskolleg II)', 'https://bildungsplaene-bw.de/site/bildungsplan-rebrush2024/get/documents_E271796087/lsbw/Bildungsplaene-BERS/MediaCenter/bk/bk_I-II/bkkfm2/08_3572_Kfm-BK%20II_Informatik.pdf'],
  ['KMK-Rahmenlehrpläne für Ausbildungsberufe (Downloadbereich)', 'https://www.kmk.org/service/servicebereich-berufliche-schulen/downloadbereich-rahmenlehrplaene.html']
 ],
 // Titel und Stand aus den in OneNote abgelegten Dokumenten.
 berufe: [
  ['Kaufmann/Kauffrau im E-Commerce', 'KMK-Rahmenlehrplan, Beschluss vom 24.11.2017'],
  ['Kaufmann/Kauffrau im Einzelhandel', 'KMK-Rahmenlehrplan (mit Verkäufer/Verkäuferin), Beschluss vom 17.06.2004 i. d. F. vom 16.09.2016'],
  ['Fachkraft für Lagerlogistik', 'KMK-Rahmenlehrplan vom 25.03.2004 und Bildungsplan Baden-Württemberg (in Kraft seit 01.08.2006, Fassung vom 01.08.2014)'],
  ['Industriekaufmann/Industriekauffrau', 'Bildungsplan Baden-Württemberg, KMK-Beschluss vom 15.12.2023'],
  ['Kaufmann/Kauffrau für Büromanagement', 'Bildungsplan Baden-Württemberg, KMK-Beschluss vom 27.09.2013, dazu Zusatzmaterialien zu den Lernfeldern 1–4']
 ]
};

// Schülerrelevante Termine aus den Kalendern 2026/27 (allgemein, J1, J2). Interne Konferenzen weggelassen.
export const termine = {
 quelle: 'OneNote „Kalender“ – Schuljahr 2026/27',
 hinweis: 'Prüfungstermine können sich noch ändern. Maßgeblich sind die Ankündigungen deiner Lehrkräfte.',
 eintraege: [
  ['2026-09-17', 'J2', 'Bestätigung Wahl P3 / P4 / Einzel- bzw. Tandemprüfung Englisch'],
  ['2026-09-25', 'Alle', 'Abmeldung Religion'],
  ['2026-09-25', 'J1', 'Wahl der GFS-Fächer für J1.1–J2.1'],
  ['2026-10-12', 'J2', 'Studienfahrt Barcelona (12.–16.10.)'],
  ['2026-10-19', 'J2', 'Klausur VBWL: BWL 1'], ['2026-10-20', 'J1', 'Klausur VBWL: BWL 1'],
  ['2026-10-21', 'J2', 'Klausur Deutsch 1'], ['2026-10-22', 'J1', 'Klausur Deutsch 1'],
  ['2026-11-02', 'J2', 'Klausur Englisch 1'], ['2026-11-03', 'J1', 'Klausur Mathematik 1'],
  ['2026-11-04', 'J2', 'Klausur Mathematik 1'], ['2026-11-05', 'J1', 'Klausur Englisch 1'],
  ['2026-11-11', 'J1', 'Klausur Spanisch 1'], ['2026-11-11', 'J2', 'Klausur GGK 1'],
  ['2026-11-12', 'J1', 'Klausur GGK 1'], ['2026-11-13', 'J2', 'Klausur Spanisch 1'],
  ['2026-11-16', 'J2', 'Klausur GLOST 1 / PVM 1'], ['2026-11-17', 'J1', 'Klausur GLOST 1 / PVM 1'],
  ['2026-11-17', 'J2', 'Klausur VBWL: VWL 1'], ['2026-11-18', 'J1', 'Studieninformationstag'], ['2026-11-18', 'J2', 'Studieninformationstag'],
  ['2026-11-20', 'J1', 'Klausur VBWL: VWL 1'], ['2026-11-23', 'J1', 'Klausur Informatik 1'], ['2026-11-23', 'J2', 'Klausur Informatik 1'],
  ['2026-11-24', 'J2', 'Klausur Religion 1 / Ethik 1'], ['2026-11-25', 'J1', 'Klausur Religion 1 / Ethik 1'],
  ['2026-12-01', 'BK1', 'Praktikumsstelle an die Klassenlehrkräfte melden'],
  ['2026-12-01', 'J1', 'Klausur VBWL: BWL 2'], ['2026-12-01', 'J2', 'Klausur VBWL: BWL 2'],
  ['2026-12-02', 'J2', 'Klausur Deutsch 2'], ['2026-12-03', 'J1', 'Klausur Deutsch 2'],
  ['2026-12-07', 'J2', 'Klausur NW 1'], ['2026-12-08', 'J1', 'Klausur Englisch 2'],
  ['2026-12-10', 'J1', 'Klausur Mathematik 2'], ['2026-12-11', 'J2', 'Klausur Mathematik 2'],
  ['2026-12-14', 'J1', 'Klausur Spanisch 2'], ['2026-12-15', 'J2', 'Hörverstehen Englisch'],
  ['2026-12-16', 'J1', 'Klausur NW 1'], ['2026-12-16', 'J2', 'Hörverstehen Spanisch'],
  ['2026-12-21', 'J1', 'Seminarkurs'], ['2026-12-22', 'Alle', 'Schulgottesdienst, 7:30 Uhr'],
  ['2027-01-14', 'J1', 'Klausur Sport 1'], ['2027-01-14', 'J2', 'Klausur Sport 1'],
  ['2027-01-21', 'J1', 'Wahl P5 / Sportdisziplin'], ['2027-01-21', 'J2', 'Wahl P5 / Sportdisziplin'],
  ['2027-01-29', 'J1', 'Zeugnisausgabe'], ['2027-01-29', 'J2', 'Zeugnisausgabe J2.1'], ['2027-01-29', 'Alle', 'Berufsinfotag'],
  ['2027-01-30', 'Alle', 'Infotag, 9–13 Uhr'],
  ['2027-02-01', 'Alle', 'Beginn der Zeugnisausgabe (Halbjahr)'],
  ['2027-02-04', 'Alle', 'Elternsprechabend, 17:30–20 Uhr'],
  ['2027-02-15', 'BK1', 'Praktikumswoche (15.–19.02.)'],
  ['2027-02-17', 'J2', 'Klausur Deutsch 3'], ['2027-02-18', 'J1', 'Klausur Deutsch 3'],
  ['2027-02-22', 'J2', 'Klausur Englisch 3'], ['2027-02-24', 'J1', 'Klausur Sport 2'], ['2027-02-24', 'J2', 'Klausur Mathematik 3'],
  ['2027-03-02', 'J1', 'Klausur VBWL: BWL 3'], ['2027-03-03', 'BK1', 'Abgabe Praktikumsbericht'], ['2027-03-03', 'J2', 'Klausur GGK 2'],
  ['2027-03-05', 'J2', 'Klausur Spanisch 3'], ['2027-03-11', 'J1', 'Klausur Mathematik 3'], ['2027-03-11', 'J2', 'Kommunikationsprüfung Englisch'],
  ['2027-03-15', 'J2', 'Klausur VBWL: BWL 3'], ['2027-03-16', 'J1', 'Klausur Englisch 3'], ['2027-03-16', 'J2', 'Klausur VBWL: VWL 2'],
  ['2027-03-22', 'J1', 'Klausur Spanisch 3'], ['2027-04-05', 'J2', 'Klausur NW 2'],
  ['2027-04-13', 'J1', 'Klausur GLOST 2 / PVM 2'],
  ['2027-04-16', 'J2', 'Abitur: Biologie'], ['2027-04-20', 'J2', 'Abitur: Physik / Informatik'], ['2027-04-21', 'J2', 'Abitur: Chemie'],
  ['2027-04-23', 'J1', 'Klausur VBWL: VWL 2'], ['2027-04-23', 'J2', 'Abitur: VBWL'], ['2027-04-26', 'J2', 'Abitur: GGK / Ethik / Religion'],
  ['2027-04-27', 'J2', 'Abitur: Deutsch'], ['2027-04-28', 'J1', 'Klausur NW 2'], ['2027-04-30', 'J2', 'Abitur: Englisch'],
  ['2027-05-05', 'J2', 'Abitur: Mathematik'], ['2027-05-10', 'J2', 'Wiederbeginn des Unterrichts'],
  ['2027-05-10', 'BK', 'Prüfung: Zusatz Wirtschaft'], ['2027-05-11', 'J1', 'Klausur Mathematik 4'], ['2027-05-11', 'J2', 'Klausur Religion 2 / Ethik 2'],
  ['2027-05-12', 'BK', 'Prüfung: BWL'], ['2027-05-13', 'BK', 'Prüfung: ÜFA/GP'],
  ['2027-05-31', 'BK', 'Prüfung: Deutsch'], ['2027-05-31', 'J1', 'Klausur Informatik 3'], ['2027-05-31', 'J2', 'Klausur Informatik 3'],
  ['2027-06-01', 'J1', 'Klausur Informatik 2'], ['2027-06-02', 'BK', 'Prüfung: Englisch'], ['2027-06-04', 'BK', 'Prüfung: Mathematik'],
  ['2027-06-07', 'J2', 'Klausur GLOST 2 / PVM 2'], ['2027-06-08', 'J1', 'Klausur Englisch 4'], ['2027-06-10', 'J1', 'Klausur VBWL: BWL 4'],
  ['2027-06-14', 'J1', 'Klausur Spanisch 4'], ['2027-06-17', 'J1', 'Klausur GGK 2'],
  ['2027-06-23', 'BK', 'Zentrale Arbeit BK'], ['2027-06-23', 'J1', 'Klausur Religion 2 / Ethik 2'],
  ['2027-06-24', 'BK', 'Notenbekanntgabe BK/BKFH'], ['2027-06-24', 'J1', 'Klausur Deutsch 4'],
  ['2027-06-30', 'J2', 'Notenbekanntgabe Abitur'],
  ['2027-07-01', 'BK', 'Mündliche Prüfungen BK2/BKFR2/BKFH'],
  ['2027-07-06', 'J2', 'Mündliches Abitur (06./07.07.)'],
  ['2027-07-08', 'BK', 'Feier der Berufskollegs, 18 Uhr'], ['2027-07-09', 'J2', 'Voraussichtlich Abiball'],
  ['2027-07-21', 'BK1', 'Zeugnisausgabe BK1'], ['2027-07-28', 'Alle', 'Zeugnisausgabe; Schulgottesdienst 7:30 Uhr']
 ]
};

// [Claude, 2026-10-17] StartLab-Neufassung, an den Kategorien der OneNote-Seite „Hotkeys“ ausgerichtet
// (Kopieren, Ausschneiden, Einfügen, Screenshot, Desktop, Zoom; laut ONENOTE_INVENTAR.md). Allgemeine
// Windows-Standardkürzel; das Original selbst liegt noch nicht vor.
export const tastenkuerzel = {
 hinweis: 'Diese Auswahl ist neu für StartLab zusammengestellt und orientiert sich an den Themen deiner OneNote-Seite. Je nach Programm können Tastenkürzel abweichen.',
 gruppen: [
  ['Text und Dateien', [['Strg + C', 'Kopieren'], ['Strg + X', 'Ausschneiden'], ['Strg + V', 'Einfügen'], ['Strg + Z', 'Letzten Schritt rückgängig machen'], ['Strg + S', 'Speichern'], ['Strg + F', 'In einer Seite oder Datei suchen'], ['Strg + P', 'Drucken bzw. Druckansicht öffnen']]],
  ['Bildschirm', [['Windows + Umschalt + S', 'Bildschirmausschnitt aufnehmen (Screenshot)'], ['Druck', 'Ganzen Bildschirm in die Zwischenablage kopieren'], ['Windows + D', 'Desktop anzeigen bzw. Fenster wiederherstellen'], ['Alt + Tab', 'Zwischen geöffneten Fenstern wechseln']]],
  ['Zoom', [['Strg + Plus', 'Vergrößern'], ['Strg + Minus', 'Verkleinern'], ['Strg + 0', 'Zoom zurücksetzen (im Browser)'], ['Windows + Plus', 'Bildschirmlupe einschalten']]]
 ],
 tipp: 'Tipp: Gib Dateien verständliche Namen und speichere sie im passenden Fachordner.'
};
