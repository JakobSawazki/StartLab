// [Codex, 2026-10-17] Runs all ordered migrations against PGlite (PostgreSQL as WebAssembly) with minimal Supabase stubs.
// PGlite is not a project dependency: install it outside the project and pass its folder, e.g.
// STARTLAB_PGLITE=/path/node_modules/@electric-sql/pglite node tools/sql-check.mjs
// Checks Kürzel rule parity, collisions, e-mail sync, grants/RLS and limits. Not a substitute for the real Supabase acceptance.
import {createRequire} from 'node:module';import {readFile,readdir} from 'node:fs/promises';import assert from 'node:assert/strict';import {usernameBase} from '../content.js';
const {PGlite}=createRequire(import.meta.url)(process.env.STARTLAB_PGLITE||'@electric-sql/pglite');
const db=new PGlite();const sql=(q,p)=>db.query(q,p);const one=async(q,p)=>(await sql(q,p)).rows[0];
const fails=async(q,pattern,p)=>{await assert.rejects(sql(q,p),pattern,q);};
await db.exec(`create role anon nologin;create role authenticated nologin;create role service_role nologin bypassrls;
create schema auth;grant usage on schema auth to anon,authenticated,service_role;grant usage on schema public to anon,authenticated,service_role;
create table auth.users(id uuid primary key default gen_random_uuid(),email text,raw_user_meta_data jsonb,email_confirmed_at timestamptz,banned_until timestamptz);
create table auth.sessions(id uuid primary key,user_id uuid references auth.users(id) on delete cascade);
create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
grant execute on function auth.uid() to anon,authenticated,service_role;
-- Supabase grants new public objects to these roles by default; the migrations must revoke them.
alter default privileges in schema public grant all on tables to anon,authenticated,service_role;
alter default privileges in schema public grant all on functions to anon,authenticated,service_role;`);
const migrations=(await readdir(new URL('../supabase/migrations/',import.meta.url))).filter(f=>f.endsWith('.sql')).sort();
for(const file of migrations)await db.exec(await readFile(new URL('../supabase/migrations/'+file,import.meta.url),'utf8'));
const checks=[];const check=async(name,fn)=>{await fn();checks.push(name);};
await check('Kürzel: SQL = Website',async()=>{for(const [f,l] of [['Jakob','Sawazki'],['Max','Müller'],['Éva','Öztürk'],['Li','Wu'],['ÄNNE','Groß'],['Mäx'.normalize('NFD'),'Wu'],['Šimon','Øster'],['Łukasz','Żak'],['Anna-Lena',"O'Neill"],['Æsa','Œdipus'],['Иван','Петров'],['A','Иванов'],[' Zoë ','Ðoković']]){assert.equal((await one('select public.startlab_username_base($1,$2) as k',[f,l])).k,usernameBase(f,l),f+' '+l);}});
const add=async(first,last,email)=>(await one(`insert into auth.users(email,raw_user_meta_data) values($1,jsonb_build_object('first_name',$2::text,'last_name',$3::text)) returning id`,[email,first,last])).id;
const ids=[];
await check('Kollisionen erhalten fortlaufende Zahl',async()=>{for(const n of [1,2,3])ids.push(await add('Test','Person','test'+n+'@example.invalid'));assert.deepEqual((await sql('select username from public.profiles order by created_at,username')).rows.map(r=>r.username).sort(),['tesper','tesper2','tesper3']);});
await check('Nichtlateinischer Name und Steuerzeichen abgewiesen',async()=>{await fails(`insert into auth.users(email,raw_user_meta_data) values('x@example.invalid','{"first_name":"Иван","last_name":"Петров"}')`,/supported letters/);await fails(`insert into auth.users(email,raw_user_meta_data) values('y@example.invalid',jsonb_build_object('first_name',E'Max\\u0007','last_name','Muster'))`,/Invalid name/);await fails(`insert into auth.users(email,raw_user_meta_data) values('z@example.invalid','{}')`,/Invalid name/);});
await check('Profil-E-Mail folgt Auth-E-Mail',async()=>{await sql(`update auth.users set email='neu@example.invalid' where id=$1`,[ids[0]]);assert.equal((await one('select email from public.profiles where id=$1',[ids[0]])).email,'neu@example.invalid');await sql(`update auth.users set email_confirmed_at=now() where id=$1`,[ids[1]]);assert.equal((await one('select email from public.profiles where id=$1',[ids[1]])).email,'test2@example.invalid');});
const sessionId='33333333-3333-3333-3333-333333333333';
await sql('insert into auth.sessions(id,user_id) values($1,$2)',[sessionId,ids[0]]);
await sql('update auth.users set email_confirmed_at=now() where id=$1',[ids[0]]);
await sql("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({session_id:sessionId})]);
const as=async(role,uid,fn)=>{await db.exec(`set role ${role}`);await sql(`select set_config('request.jwt.claim.sub',$1,false)`,[uid||'']);try{return await fn();}finally{await db.exec('reset role');}};
await check('Schüler sieht nur das eigene Profil',async()=>{const rows=await as('authenticated',ids[0],()=>sql('select id from public.profiles'));assert.deepEqual(rows.rows.map(r=>r.id),[ids[0]]);});
await check('Schüler kann Profile, Rollen, Limits und Audit nicht ändern',async()=>{await as('authenticated',ids[0],async()=>{await fails(`update public.profiles set username='admin' where id='${ids[0]}'`,/permission denied/);await fails(`update public.profiles set locked_at=null where id='${ids[0]}'`,/permission denied/);await fails(`insert into public.administrators values('${ids[0]}')`,/permission denied/);await fails('select * from public.administrators',/permission denied/);await fails('select * from public.admin_audit',/permission denied/);await fails('select * from public.request_limits',/permission denied/);await fails(`select public.startlab_limit('x',5)`,/permission denied/);await fails(`select public.startlab_username_base('a','b')`,/permission denied/);});});
await check('Anonym: kein Zugriff auf Profile',async()=>{await as('anon','',()=>fails('select * from public.profiles',/permission denied/));});
await check('Ratenlimit zählt im Zeitfenster',async()=>{const r=[];await as('service_role','',async()=>{for(let i=0;i<3;i++)r.push((await one(`select public.startlab_limit('test:bucket',2) as ok`)).ok);});assert.deepEqual(r,[true,true,false]);});
await check('Sitzungsprüfung bindet Sitzung an Person, Sperre und bestätigte E-Mail',async()=>{
 const active=async(uid=ids[0],sid=sessionId)=>(await as('service_role','',()=>one('select public.startlab_session_active($1,$2) as ok',[uid,sid]))).ok;
 assert.equal(await active(),true);assert.equal(await active(ids[1]),false);
 await sql('update public.profiles set locked_at=now() where id=$1',[ids[0]]);
 assert.equal(await active(),false);
 assert.equal((await as('authenticated',ids[0],()=>sql('select id from public.profiles'))).rows.length,0);
 await sql('update public.profiles set locked_at=null where id=$1',[ids[0]]);
 await sql("update auth.users set banned_until=now()+interval '1 hour' where id=$1",[ids[0]]);assert.equal(await active(),false);
 await sql('update auth.users set banned_until=null,email_confirmed_at=null where id=$1',[ids[0]]);assert.equal(await active(),false);
 await sql('update auth.users set email_confirmed_at=now() where id=$1',[ids[0]]);assert.equal(await active(),true);
 await as('authenticated',ids[0],()=>fails('select public.startlab_session_active($1,$2)',/permission denied/,[ids[0],sessionId]));
 await as('anon','',()=>fails('select public.startlab_current_session_active()',/permission denied/));
});
await check('Gelöschte Sitzung sperrt API-Prüfung und direkten Profilzugriff',async()=>{
 await sql('delete from auth.sessions where id=$1',[sessionId]);
 assert.equal((await as('service_role','',()=>one('select public.startlab_session_active($1,$2) as ok',[ids[0],sessionId]))).ok,false);
 assert.equal((await as('authenticated',ids[0],()=>sql('select id from public.profiles'))).rows.length,0);
});
await check('Kontolöschung entfernt Profil und Adminrolle',async()=>{await sql('insert into public.administrators values($1)',[ids[2]]);await sql('delete from auth.users where id=$1',[ids[2]]);assert.equal((await one('select count(*)::int as n from public.profiles where id=$1',[ids[2]])).n,0);assert.equal((await one('select count(*)::int as n from public.administrators')).n,0);});
await db.close();
console.log(`SQL-Prüfung bestanden (${checks.length}): ${checks.join('; ')}. Parallele Registrierungen sind mit einer PGlite-Verbindung nicht prüfbar.`);
