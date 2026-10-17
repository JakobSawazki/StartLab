// [Claude, 2026-10-17] HTML for the OneNote contents in inhalte.js. All text passes through esc().
import {vorstellung, unternehmen, bewertung, schluessel, praktikum, gfs, bildungsplaene, termine, tastenkuerzel} from './inhalte.js';
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list = (items, tag = 'ul') => `<${tag}>${items.map(i => `<li>${esc(i)}</li>`).join('')}</${tag}>`;
const quelle = q => `<p class="source">Quelle: ${esc(q)}</p>`;
const zahl = n => String(n).replace('.', ',');
const bereich = (a, b) => a === b ? `${a}` : `${a}–${b}`;

export function vorstellungHTML() {
 return `<p>So läuft eure erste Vorstellungsrunde ab. Du entscheidest selbst, was du über dich erzählst.</p>
 <h2>Ablauf</h2><ol class="steps">${vorstellung.ablauf.map(s => `<li><strong>${esc(s.zeit)}</strong> ${esc(s.text)}</li>`).join('')}</ol>
 <h2>Kurz und knapp</h2>${list(vorstellung.kurzfragen)}
 <h2>Deine Vorstellung</h2><ol class="question-list">${vorstellung.fragen.map(f => `<li><strong>${esc(f.titel)}</strong>${f.punkte.length ? list(f.punkte) : ''}<div class="sheet-line"></div></li>`).join('')}</ol>
 ${quelle(vorstellung.quelle)}`;
}

export function vertragHTML() {
 const u = unternehmen;
 return `<h2>Herzlich willkommen bei ${esc(u.name)}</h2>${u.einleitung.map(p => `<p>${esc(p)}</p>`).join('')}
 <h2>Du erhältst NAGOLD für</h2>${list(u.nagoldFuer)}
 <h2>Unsere Regeln</h2><p>${esc(u.regelnHinweis)}</p>
 <div class="table-wrap" tabindex="0" role="region" aria-label="Regeln und NAGOLD"><table><caption class="sr-only">Regeln und NAGOLD-Abzug</caption><thead><tr><th scope="col">Regel</th><th scope="col">NAGOLD</th></tr></thead><tbody>${u.regeln.map(([r, n], i) => `<tr><td>${i + 1}. ${esc(r)}</td><td class="num">${esc(n)}</td></tr>`).join('')}</tbody></table></div>
 <h2>Eckdaten</h2>${list(u.eckdaten)}
 <h2>Jobs in unserem Unternehmen</h2><div class="table-wrap" tabindex="0" role="region" aria-label="Jobs im Unternehmen"><table><thead><tr><th scope="col">Tätigkeit</th><th scope="col">NAGOLD</th><th scope="col">Stellen</th></tr></thead><tbody>${u.jobs.map(([t, n, s]) => `<tr><td>${esc(t)}</td><td class="num">${n}</td><td class="num">${s}</td></tr>`).join('')}</tbody></table></div>
 <h2>Unser Firmenserver</h2><p>${esc(u.firmenserver)}</p>
 <p class="signature"><span>Unterschrift Mitarbeiter/in</span><span>Datum</span></p>${quelle(u.quelle)}`;
}

function schluesselTabelle(s, istProzent) {
 return `<details><summary>${esc(s.titel)}</summary><div class="table-wrap" tabindex="0" role="region" aria-label="${esc('Notenschlüssel '+s.titel)}"><table><thead><tr>${s.spalten.map(c => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${s.baender.map(([a, b, ...rest]) => `<tr><td>${bereich(a, b)}${istProzent ? ' %' : ''}</td>${rest.map(v => `<td class="num">${esc(zahl(v))}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;
}

export function bewertungHTML() {
 const b = bewertung, k = b.kopfnoten;
 return `<p>${esc(b.einleitung)}</p>
 <h2>So setzt sich deine Note zusammen</h2><div class="table-wrap" tabindex="0" role="region" aria-label="Zusammensetzung der Note"><table><thead><tr><th scope="col">Art der Leistung</th><th scope="col">Ausführung</th><th scope="col">Anteil</th></tr></thead><tbody>${b.anteile.map(a => `<tr><td>${esc(a.art)}</td><td>${list(a.ausfuehrung)}</td><td class="num">${esc(a.anteil)}</td></tr>`).join('')}</tbody></table></div>
 <details><summary>Bewertungsmatrix für kontinuierlich erbrachte Leistungen</summary><div class="table-wrap" tabindex="0" role="region" aria-label="Bewertungsmatrix"><table class="wide"><thead><tr>${b.matrixKoepfe.map(c => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${b.matrix.map(r => `<tr>${r.map((c, i) => i ? `<td>${esc(c)}</td>` : `<th scope="row">${esc(c)}</th>`).join('')}</tr>`).join('')}</tbody></table></div></details>
 <details><summary>Kopfnoten für Verhalten und Mitarbeit</summary>${list(k.hinweise)}<div class="table-wrap" tabindex="0" role="region" aria-label="Kopfnoten"><table class="wide"><thead><tr><th scope="col">Note</th><th scope="col">Verhalten</th><th scope="col">Mitarbeit</th></tr></thead><tbody>${k.stufen.map(r => `<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</tbody></table></div><p class="source">${esc(k.quelle)}</p></details>
 <h2>Notenschlüssel</h2><p>Welcher Schlüssel für deine Klasse gilt, sagt dir deine Lehrkraft.</p>
 ${schluesselTabelle(schluessel.bg, true)}${schluesselTabelle(schluessel.bk, true)}${schluesselTabelle(schluessel.ihk, false)}
 ${quelle(b.quelle)}`;
}

export function praktikumHTML() {
 const p = praktikum, k = p.klasse;
 return `${list(p.eckdaten)}
 <h2>Schritt für Schritt</h2><ol class="steps">${p.schritte.map(s => `<li><strong>${esc(s.wann)}</strong> ${esc(s.text)}</li>`).join('')}</ol>
 <h2>Gut zu wissen</h2>${list(p.recht)}
 <h2>Dein Praktikumsbericht</h2><p>Form und Umfang:</p>${list(p.form)}
 <p>Verpflichtend: Kurzporträt / Steckbrief des Betriebs</p>${list(p.steckbrief)}
 <p>Mögliche weitere Inhalte:</p>${list(p.weitereInhalte)}
 <h2>Bewertung</h2><div class="table-wrap" tabindex="0" role="region" aria-label="Bewertung des Praktikumsberichts"><table><thead><tr><th scope="col">Bericht</th><th scope="col">Gewichtung</th></tr></thead><tbody>${p.bewertung.map(([a, b]) => `<tr><td>${esc(a)}</td><td class="num">${esc(b)}</td></tr>`).join('')}</tbody></table></div>${list(p.bewertungHinweise)}
 <p>Bewertungskriterien für die Präsentation:</p>${list(p.praesentation)}
 <h2>${esc(k.titel)}</h2><p class="hint">${esc(k.stand)}</p>${list(k.punkte)}<p>Aufbau der Website:</p>${list(k.website)}
 ${quelle(p.quelle)}`;
}

export function gfsHTML() {
 const i = gfs.informatik;
 return `<p>GFS steht für „gleichwertige Feststellung von Schülerleistungen“ und ist formale Voraussetzung für die Zulassung zum Abitur.</p>
 <h2>Das gilt für alle Fächer</h2>${list(gfs.allgemein)}
 <h2>GFS im Fach Informatik (J1/J2)</h2><div class="table-wrap" tabindex="0" role="region" aria-label="Gewichtung der GFS in Informatik"><table><thead><tr><th scope="col">Baustein</th><th scope="col">Anteil</th></tr></thead><tbody>${i.gewichtung.map(([a, b]) => `<tr><td>${esc(a)}</td><td class="num">${esc(b)}</td></tr>`).join('')}</tbody></table></div><p>${esc(i.gewichtungHinweis)}</p>
 <h3>Schriftliche Ausarbeitung</h3><p>${esc(i.umfang)}</p><p>Pflichtbestandteile:</p>${list(i.bestandteile, 'ol')}${list(i.inhalt)}
 <h3>Präsentation und Kolloquium</h3>${list(i.praesentation)}
 <h3>Themen und Vorgaben</h3><p>Das Thema muss zu den Schwerpunkten der J1 und J2 passen, z. B.:</p>${list(i.themenbereiche)}${list(i.vorgaben)}
 <p>In der GFS sollen die vier Kompetenzbereiche des Bildungsplans sichtbar werden:</p>${list(i.kompetenzen, 'ol')}
 <h3>Eigenständigkeit und KI</h3>${list(i.ki)}
 <details><summary>Beispielthemen</summary><ul>${i.beispiele.map(([t, b]) => `<li>„${esc(t)}“ (${esc(b)})</li>`).join('')}</ul></details>
 ${quelle(gfs.quelle)}`;
}

export function bildungsplaeneHTML() {
 return `<p>Die Bildungspläne beschreiben, welche Ziele und Kompetenzen in deinem Bildungsgang gelten. Die Links führen zu den offiziellen Dokumenten des Landes Baden-Württemberg.</p>
 <ul class="link-list">${bildungsplaene.links.map(([t, u]) => `<li><a href="${esc(u)}" rel="noopener noreferrer" target="_blank">${esc(t)}<span class="sr-only"> (öffnet in neuem Tab)</span></a></li>`).join('')}</ul>
 <h2>Ausbildungsberufe</h2><p>Für diese Ausbildungsberufe liegen die Pläne in OneNote vor. Die KMK-Rahmenlehrpläne findest du im Downloadbereich der KMK, die Bildungspläne des Landes auf der Bildungsplan-Seite; deine Lehrkraft hilft dir beim richtigen Dokument.</p><ul>${bildungsplaene.berufe.map(([b, s]) => `<li><strong>${esc(b)}</strong><br>${esc(s)}</li>`).join('')}</ul>
 ${quelle(bildungsplaene.quelle)}`;
}

const gruppen = {Alle: () => true, J1: g => g === 'J1' || g === 'Alle', J2: g => g === 'J2' || g === 'Alle', BK: g => g === 'BK' || g === 'BK1' || g === 'Alle'};
const datum = new Intl.DateTimeFormat('de-DE', {weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'UTC'});
const monat = new Intl.DateTimeFormat('de-DE', {month: 'long', year: 'numeric', timeZone: 'UTC'});
export function termineListe(filter = 'Alle') {
 const passend = termine.eintraege.filter(([, g]) => gruppen[filter](g));
 const monate = new Map();
 for (const e of passend) { const key = e[0].slice(0, 7); if (!monate.has(key)) monate.set(key, []); monate.get(key).push(e); }
 return [...monate].map(([key, items]) => `<h2>${esc(monat.format(new Date(key + '-01T12:00:00Z')))}</h2><div class="table-wrap" tabindex="0" role="region" aria-label="${esc('Termine '+monat.format(new Date(key+'-01T12:00:00Z')))}"><table><thead><tr><th scope="col">Datum</th><th scope="col">Für</th><th scope="col">Termin</th></tr></thead><tbody>${items.map(([d, g, t]) => `<tr><td class="num">${esc(datum.format(new Date(d + 'T12:00:00Z')))}</td><td>${esc(g)}</td><td>${esc(t)}</td></tr>`).join('')}</tbody></table></div>`).join('');
}
export function kalenderHTML() {
 return `<p>${esc(termine.hinweis)}</p><div class="filters" role="group" aria-label="Termine filtern">${Object.keys(gruppen).map((g, i) => `<button type="button" data-termine="${g}" aria-pressed="${i === 0}">${g === 'Alle' ? 'Alle Termine' : g}</button>`).join('')}</div><p id="termine-status" class="sr-only" role="status"></p><div id="termine-liste">${termineListe()}</div>${quelle(termine.quelle)}`;
}
export const termineGruppen = Object.keys(gruppen);
// [Claude, 2026-10-17] Next dates for the overview; `heute` as YYYY-MM-DD (Europe/Berlin), injectable for tests.
export const heuteBerlin = () => new Intl.DateTimeFormat('en-CA', {timeZone: 'Europe/Berlin'}).format(new Date());
export function naechsteTermine(heute = heuteBerlin(), anzahl = 3) { return termine.eintraege.filter(([d]) => d >= heute).slice(0, anzahl); }
export function naechsteTermineHTML(heute = heuteBerlin()) {
 const liste = naechsteTermine(heute);
 return liste.length ? `<ul class="next-dates">${liste.map(([d, g, t]) => `<li><time datetime="${d}">${esc(datum.format(new Date(d + 'T12:00:00Z')))}</time><span>${esc(t)}<small>${esc(g === 'Alle' ? 'Alle Klassen' : g)}</small></span></li>`).join('')}</ul>` : '<p>Für dieses Schuljahr sind keine weiteren Termine eingetragen.</p>';
}
// [Claude, 2026-10-17] Shortcut list (StartLab version, see inhalte.js).
export function tastenkuerzelHTML() {
 return `<p>${esc(tastenkuerzel.hinweis)}</p>${tastenkuerzel.gruppen.map(([titel, liste]) => `<h2>${esc(titel)}</h2><dl class="shortcuts">${liste.map(([k, t]) => `<dt><kbd>${esc(k)}</kbd></dt><dd>${esc(t)}</dd>`).join('')}</dl>`).join('')}<p>${esc(tastenkuerzel.tipp)}</p>`;
}
