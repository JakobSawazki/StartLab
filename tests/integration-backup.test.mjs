import test from 'node:test';import assert from 'node:assert/strict';import {restoreSQL} from '../tools/integration-backup.mjs';
const dump='COPY auth.users (id) FROM stdin;\n\\.\nCOPY public.profiles (id) FROM stdin;\n\\.\n';
test('Wiederherstellung verweigert fremde Schemas und SQL in Tabellennamen [Codex]',()=>{
 for(const tables of [['auth.users','public.profiles','storage.objects'],['auth.users','public.profiles;drop table auth.users'],['public.profiles'],null])assert.throws(()=>restoreSQL(tables,dump));
});
test('Wiederherstellung benötigt Auth-/Profildaten und begrenzt den Replikamodus auf eine Transaktion [Codex]',()=>{
 const tables=['auth.users','public.profiles'];assert.throws(()=>restoreSQL(tables,'-- schema-only'));
 const sql=restoreSQL(tables,dump);assert.match(sql,/^BEGIN;/);assert.match(sql,/SET LOCAL session_replication_role = replica/);assert.match(sql,/COMMIT;\nDO .*current_setting\('session_replication_role'\)/);assert.ok(sql.indexOf('TRUNCATE')<sql.indexOf('COPY auth.users'));
});
