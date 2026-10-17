import {mkdir,copyFile} from 'node:fs/promises';
import {downloads} from '../inhalte.js';
const out=new URL('../dist/',import.meta.url);await mkdir(out,{recursive:true});
for(const file of ['index.html','styles.css','theme.js','app.js','auth.js','content.js','inhalte.js','ansicht.js','config.js'])await copyFile(new URL('../'+file,import.meta.url),new URL(file,out));
// [Claude, 2026-10-17] Approved downloads only (list in inhalte.js).
await mkdir(new URL('downloads/',out),{recursive:true});for(const d of Object.values(downloads).flat())await copyFile(new URL('../'+d.datei,import.meta.url),new URL(d.datei,out));
await copyFile(new URL('../.nojekyll',import.meta.url),new URL('.nojekyll',out));console.log('Öffentliche Website in dist/ vorbereitet.');
