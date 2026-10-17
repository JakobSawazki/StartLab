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
