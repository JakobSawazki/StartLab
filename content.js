export const topics = [
 {id:'kennenlernen',n:'01',icon:'✳',tag:'GEMEINSAM ANKOMMEN',title:'Wir lernen uns kennen',text:'Neue Gesichter, neue Ideen. Finde heraus, wer mit dir startet.',time:'ca. 25 Minuten',color:'peach'},
 {id:'regeln',n:'02',icon:'☷',tag:'GEMEINSAM LERNEN',title:'So arbeiten wir zusammen',text:'Was wir brauchen, damit sich alle wohlfühlen und gut lernen können.',time:'ca. 15 Minuten',color:'mint'},
 {id:'orientierung',n:'03',icon:'↗',tag:'DEN WEG KENNEN',title:'Dein Schuljahr im Blick',text:'Bewertung, Bildungspläne und die nächsten Schritte an einem Ort.',time:'In deinem Tempo',color:'lilac'}
];
export const materials = [
 {id:'vorstellung',category:'Kennenlernen',title:'Das bin ich',description:'Ein kurzer Steckbrief für die erste gemeinsame Runde.',status:'StartLab-Neufassung',action:'Steckbrief öffnen'},
 {id:'bingo',category:'Kennenlernen',title:'Kennenlern-Bingo',description:'Komm ins Gespräch und entdecke Gemeinsamkeiten.',status:'StartLab-Neufassung',action:'Bingo starten'},
 {id:'vertrag',category:'Zusammenarbeit',title:'Unsere Lernvereinbarung',description:'Gesprächsvorlage für eure gemeinsamen Absprachen.',status:'Entwurf zur Abstimmung',action:'Vereinbarung öffnen'},
 {id:'bewertung',category:'Orientierung',title:'Leistungsbewertung',description:'Wie Leistungen bewertet werden und wo du nachfragen kannst.',status:'Original noch zu übernehmen',action:'Stand ansehen'},
 {id:'bildungsplaene',category:'Orientierung',title:'Bildungspläne',description:'Welche Ziele und Kompetenzen für deinen Bildungsgang gelten.',status:'Zuordnung noch offen',action:'Stand ansehen'},
 {id:'praktikum',category:'Orientierung',title:'Betriebspraktikum BK1',description:'Platz für Ablauf, Fristen und Unterlagen zum Praktikum.',status:'Original noch zu übernehmen',action:'Stand ansehen'},
 {id:'gfs',category:'Orientierung',title:'GFS im beruflichen Gymnasium',description:'Platz für Themenwahl, Anforderungen und Absprachen.',status:'Original noch zu übernehmen',action:'Stand ansehen'},
 {id:'hotkeys',category:'Werkzeuge',title:'Tipps & Tastenkürzel',description:'Kleine Handgriffe, die deinen Schulalltag leichter machen.',status:'StartLab-Neufassung',action:'Tipps entdecken'},
 {id:'kalender',category:'Orientierung',title:'Termine & Kalender',description:'Wichtige Termine für eure Klasse im Überblick.',status:'Termine noch offen',action:'Stand ansehen'}
];
export const bingo = ['spielt ein Instrument','mag Rätsel','hat ein Haustier','kocht gern','spricht mehr als eine Sprache','fährt gern Fahrrad','hat schon programmiert','liest gern','hört gern Podcasts','interessiert sich für Technik','zeichnet gern','macht gern Sport','mag Brettspiele','ist gern draußen','möchte etwas Neues lernen','hat heute jemanden kennengelernt'];
export function usernameBase(first,last) {
 const norm=s=>s.trim().toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,'');
 return norm(first).slice(0,3)+norm(last).slice(0,3);
}
