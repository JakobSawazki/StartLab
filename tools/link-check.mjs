// [Claude, 2026-10-17] Checks the external links shown on the site (needs network, therefore not part of npm test).
// node tools/link-check.mjs
import {bildungsplaene} from '../inhalte.js';
const links = [...bildungsplaene.links.map(([t, u]) => [t, u]), ['WorkbenchLab', 'https://jakobsawazki.github.io/WorkbenchLab/']];
let failed = 0;
for (const [title, url] of links) {
 try {
  const r = await fetch(url, {redirect: 'follow', signal: AbortSignal.timeout(30000)});
  const ok = r.ok; if (!ok) failed++;
  console.log((ok ? 'ok' : 'FEHLER').padEnd(7), r.status, title, ok ? '' : url);
 } catch (error) { failed++; console.log('FEHLER ', '---', title, url, error.message); }
}
if (failed) process.exitCode = 1;
