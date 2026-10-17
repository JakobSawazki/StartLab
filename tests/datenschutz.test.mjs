import test from 'node:test';import assert from 'node:assert/strict';import {readFile,readdir} from 'node:fs/promises';
// [Claude, 2026-10-17] Keeps Docs/DATENSCHUTZ_ENTWURF.md in step with the code: every application table and
// every browser-storage key must be described there. A new table or key fails this test until the draft is updated.
const read=f=>readFile(new URL('../'+f,import.meta.url),'utf8');
const publishedScripts=async()=>JSON.parse((await read('tools/build.mjs')).match(/for\(const file of (\[[^\]]+\])/)[1].replaceAll("'",'"')).filter(f=>f.endsWith('.js'));
test('Datenschutz-Entwurf nennt alle Anwendungstabellen [Claude]',async()=>{const doc=await read('Docs/DATENSCHUTZ_ENTWURF.md');const dir=new URL('../supabase/migrations/',import.meta.url);let sql='';for(const f of (await readdir(dir)).filter(f=>f.endsWith('.sql')))sql+=await readFile(new URL(f,dir),'utf8');const tables=[...sql.matchAll(/create table (public\.[a-z_]+)/g)].map(m=>m[1]);assert.ok(tables.length>=4);for(const t of tables)assert.ok(doc.includes('`'+t+'`'),t+' fehlt im Datenschutz-Entwurf');});
test('Datenschutz-Entwurf nennt alle Browserspeicher-Schlüssel [Claude]',async()=>{const doc=await read('Docs/DATENSCHUTZ_ENTWURF.md');const list=await publishedScripts();assert.ok(list.includes('theme.js'));let js='';for(const f of list)js+=await read(f);
 // Keys passed literally and keys kept in constants within the startlab.* namespace.
 const keys=new Set([...[...js.matchAll(/(?:localStorage|sessionStorage)\.(?:getItem|setItem|removeItem)\('([^']+)'/g)].map(m=>m[1]),...[...js.matchAll(/['"](startlab\.[a-z][a-z.-]*)['"]/g)].map(m=>m[1])]);
 assert.ok(keys.has('startlab.checks')&&keys.has('startlab.theme'),[...keys].join(', '));for(const k of keys)assert.ok(doc.includes(k),k+' fehlt im Datenschutz-Entwurf');assert.doesNotMatch(js,/document\.cookie|indexedDB\.open/,'Cookies/IndexedDB wären im Entwurf zu ergänzen');});
