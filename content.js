export const topics = [
 {id:'kennenlernen',n:'01',icon:'✳',tag:'GEMEINSAM ANKOMMEN',title:'Wir lernen uns kennen',text:'Neue Gesichter, neue Ideen. Finde heraus, wer mit dir startet.',time:'ca. 25 Minuten',color:'peach'},
 {id:'regeln',n:'02',icon:'☷',tag:'GEMEINSAM LERNEN',title:'So arbeiten wir zusammen',text:'Was wir brauchen, damit sich alle wohlfühlen und gut lernen können.',time:'ca. 15 Minuten',color:'mint'},
 {id:'orientierung',n:'03',icon:'↗',tag:'DEN WEG KENNEN',title:'Dein Schuljahr im Blick',text:'Bewertung, Bildungspläne und die nächsten Schritte an einem Ort.',time:'In deinem Tempo',color:'lilac'}
];
// [Claude, 2026-10-17] Status „Original aus OneNote“: Inhalt aus Jakobs Unterlagen übernommen (inhalte.js).
export const materials = [
 {id:'vorstellung',category:'Kennenlernen',title:'Persönliche Vorstellung',description:'Fragen und Ablauf für eure erste gemeinsame Vorstellungsrunde.',status:'Original aus OneNote',action:'Vorstellung öffnen'},
 {id:'bingo',category:'Kennenlernen',title:'Kennenlern-Bingo',description:'Komm ins Gespräch und entdecke Gemeinsamkeiten.',status:'StartLab-Neufassung',action:'Bingo starten'},
 {id:'vertrag',category:'Zusammenarbeit',title:'Vertrag: Black-Forest-Industry',description:'Unser Unternehmen, NAGOLD, Regeln und Jobs im Unterricht.',status:'Original aus OneNote',action:'Vertrag öffnen'},
 {id:'lernvereinbarung',category:'Zusammenarbeit',title:'Gesprächsvorlage Lernvereinbarung',description:'Offene Vorlage für ergänzende Absprachen in der Klasse.',status:'StartLab-Entwurf',action:'Vorlage öffnen'},
 {id:'bewertung',category:'Orientierung',title:'Leistungsbewertung',description:'Gewichtung, NAGOLD, Bewertungsmatrix, Kopfnoten und Notenschlüssel.',status:'Original aus OneNote',action:'Bewertung ansehen'},
 {id:'bildungsplaene',category:'Orientierung',title:'Bildungspläne',description:'Offizielle Bildungspläne für BK 1 und BK 2 Informatik und Hinweise zu den Ausbildungsberufen.',status:'Links aus OneNote',action:'Bildungspläne ansehen'},
 {id:'praktikum',category:'Orientierung',title:'Betriebspraktikum BK1',description:'Ablauf, Termine 2026/27, Bericht und Präsentation.',status:'Original aus OneNote',action:'Praktikum ansehen'},
 {id:'gfs',category:'Orientierung',title:'GFS im beruflichen Gymnasium',description:'Regeln nach § 16 BGVO und Anforderungen im Fach Informatik.',status:'Original aus OneNote',action:'GFS ansehen'},
 {id:'hotkeys',category:'Werkzeuge',title:'Tipps & Tastenkürzel',description:'Kleine Handgriffe, die deinen Schulalltag leichter machen.',status:'StartLab-Neufassung',action:'Tipps entdecken'},
 {id:'kalender',category:'Orientierung',title:'Termine & Kalender',description:'Klausuren, Prüfungen und wichtige Termine 2026/27.',status:'Kalender 2026/27 aus OneNote',action:'Termine ansehen'}
];
export const bingo = ['spielt ein Instrument','mag Rätsel','hat ein Haustier','kocht gern','spricht mehr als eine Sprache','fährt gern Fahrrad','hat schon program\u00admiert','liest gern','hört gern Podcasts','interes\u00adsiert sich für Technik','zeichnet gern','macht gern Sport','mag Brett\u00adspiele','ist gern draußen','möchte etwas Neues lernen','hat heute jemanden kennen\u00adgelernt'];
// [Claude, 2026-10-17] Identical table in supabase/migrations/202610170002_startlab_accounts.sql
// and supabase/functions/startlab/index.ts; tests/content.test.mjs compares all three.
export const kuerzelMap = Object.freeze({
 pairs:[['ä','ae'],['ö','oe'],['ü','ue'],['ß','ss'],['æ','ae'],['œ','oe']],
 from:'áàâãåāăąéèêëēėęěíìîïīįıóòôõøōőúùûūůűųýÿñńňçćčďđğłľĺřŕšśşťţžźż',
 to:'aaaaaaaaeeeeeeeeiiiiiiiooooooouuuuuuuyynnncccddglllrrsssttzzz'
});
export function usernameBase(first,last) {
 const norm=s=>{let v=String(s??'').normalize('NFC').trim().toLowerCase();for(const [a,b] of kuerzelMap.pairs)v=v.replaceAll(a,b);return [...v].map(c=>{const i=kuerzelMap.from.indexOf(c);return i<0?c:kuerzelMap.to[i];}).join('').replace(/[^a-z]/g,'');};
 return norm(first).slice(0,3)+norm(last).slice(0,3);
}
