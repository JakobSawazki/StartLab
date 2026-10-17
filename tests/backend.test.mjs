import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import vm from 'node:vm';import {stripTypeScriptTypes} from 'node:module';
const source=await readFile(new URL('../supabase/functions/startlab/index.ts',import.meta.url),'utf8');
// [Claude, 2026-10-17] `respond` lets a test replace single simulated Supabase answers; `logs` captures console.error.
async function setup(isAdmin=false,{registration='false',respond=()=>undefined}={}){let handler;const calls=[];const logs=[];const secrets={SUPABASE_URL:'https://test.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'fake-service',SUPABASE_ANON_KEY:'fake-anon',SITE_ORIGIN:'https://school.example',SITE_URL:'https://school.example/StartLab/',REGISTRATION_ENABLED:registration};const context={Deno:{env:{get:k=>secrets[k]},serve:fn=>handler=fn},console:{error:m=>logs.push(String(m))},URL,Response,Request,TextEncoder,crypto,AbortSignal,atob,fetch:async(url,options)=>{calls.push({url,options});const custom=await respond(url,options);if(custom)return custom;let data=true;if(url.endsWith('/auth/v1/user'))data={id:'test-user',email_confirmed_at:'2026-10-17'};else if(url.includes('/auth/v1/admin/users/'))data={id:'11111111-1111-1111-1111-111111111111',email:'current@example.test'};else if(url.includes('/administrators?'))data=isAdmin?[{user_id:'test-user'}]:[];else if(url.includes('/profiles?'))data=[{id:'11111111-1111-1111-1111-111111111111',username:'jaksaw',first_name:'Jakob',last_name:'Sawazki',email:'private@example.test'}];else if(url.includes('/auth/v1/token'))data={access_token:'new-token',expires_in:3600};return new Response(JSON.stringify(data),{status:200});}};vm.runInNewContext(stripTypeScriptTypes(source,{mode:'transform'}),context);return {handler,calls,logs};}
const sessionId='33333333-3333-3333-3333-333333333333';
const validToken='test.'+Buffer.from(JSON.stringify({session_id:sessionId})).toString('base64url')+'.signature';
function req(body,auth=false,origin='https://school.example'){return new Request('https://test.supabase.co/functions/v1/startlab',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(auth?{Authorization:'Bearer '+validToken}:{})},body:typeof body==='string'?body:JSON.stringify(body)});}
const fail=status=>new Response(JSON.stringify({msg:'upstream'}),{status});
const sent=call=>JSON.parse(call.options.body);

test('Widerrufene Sitzung verweigert alle geschützten Aktionen vor Rollen-/Datenzugriff [Codex]',async()=>{
 for(const action of ['profile','password','logout','admin-list','admin-reset','admin-audit','admin-lock','admin-unlock','admin-delete']){
  const {handler,calls}=await setup(true,{respond:url=>url.endsWith('/rpc/startlab_session_active')?new Response('false'):undefined});
  const r=await handler(req({action,password:'neues-passwort-lang',id:'22222222-2222-2222-2222-222222222222'},true));
  assert.equal(r.status,401,action);
  assert.ok(!calls.some(c=>c.url.includes('/administrators?')||c.url.includes('/profiles?')||c.options.method==='PUT'),action);
 }
});

test('Aktive Sitzung wird an die von Auth bestätigte Person gebunden [Codex]',async()=>{
 const {handler,calls}=await setup();assert.equal((await handler(req({action:'profile'},true))).status,200);
 const check=calls.find(c=>c.url.endsWith('/rpc/startlab_session_active'));
 assert.deepEqual(sent(check),{account_id:'test-user',session_id:sessionId});
 assert.ok(calls.findIndex(c=>c.url.endsWith('/auth/v1/user'))<calls.indexOf(check));
});

test('Token ohne gültige Sitzungs-ID wird auch bei bestätigter Auth-Antwort abgewiesen [Codex]',async()=>{
 for(const token of ['not-a-jwt','test.'+Buffer.from('{}').toString('base64url')+'.sig','test.'+Buffer.from('{"session_id":"bad"}').toString('base64url')+'.sig']){
  const {handler,calls}=await setup();const request=req({action:'profile'},true);request.headers.set('Authorization','Bearer '+token);
  assert.equal((await handler(request)).status,401);
  assert.ok(!calls.some(c=>c.url.endsWith('/rpc/startlab_session_active')||c.url.includes('/profiles?')));
 }
});

test('Sitzungsdienst-Ausfall bleibt 502 statt einer irreführenden Abmeldung [Codex]',async()=>{
 for(const part of ['/auth/v1/user','/rpc/startlab_session_active']){
  const {handler}=await setup(false,{respond:url=>url.endsWith(part)?fail(503):undefined});
  assert.equal((await handler(req({action:'profile'},true))).status,502,part);
 }
});

test('Fehlgeschlagener globaler Logout nach Passwortwechsel wird ausdrücklich gemeldet [Codex]',async()=>{
 const {handler}=await setup(false,{respond:url=>url.includes('/logout?scope=global')?fail(503):undefined});
 const r=await handler(req({action:'password',password:'ein-neues-langes-passwort'},true));
 assert.equal(r.status,200);const data=await r.json();assert.equal(data.signed_out,true);assert.equal(data.sessions_revoked,false);
 assert.match(data.message,/anderen Geräten konnte nicht bestätigt/);
});
test('Adminliste ohne Anmeldung verweigert',async()=>{const {handler,calls}=await setup();const r=await handler(req({action:'admin-list'}));assert.equal(r.status,401);assert.ok(!calls.some(c=>c.url.includes('/profiles?')));});
test('Schüler erhält keine Adminliste oder privaten Profildaten',async()=>{const {handler,calls}=await setup();const r=await handler(req({action:'admin-list'},true));assert.equal(r.status,403);assert.ok(!calls.some(c=>c.url.includes('/profiles?')));});
test('Falsche Herkunft wird vor Backendzugriff abgewiesen',async()=>{const {handler,calls}=await setup();assert.equal((await handler(req({action:'login'},false,'https://evil.example'))).status,403);assert.equal(calls.length,0);});
test('Registrierung bleibt ausgeschaltet',async()=>{const {handler,calls}=await setup();const r=await handler(req({action:'register',identifier:'test@example.test'}));assert.equal(r.status,503);assert.ok(!calls.some(c=>c.url.includes('/signup')));});
test('Admin bekommt Liste nach Rollenprüfung',async()=>{const {handler}=await setup(true);const r=await handler(req({action:'admin-list'},true));assert.equal(r.status,200);assert.equal((await r.json()).users.length,1);});
test('Ungültiges JSON ergibt 400 ohne Backendzugriff [Claude]',async()=>{const {handler,calls}=await setup();for(const body of ['{kaputt','null','[]']){const r=await handler(req(body));assert.equal(r.status,400,body);}assert.equal(calls.length,0);});
test('Kürzel-Login verwendet die aktuelle Auth-E-Mail, nicht die Profilkopie [Claude]',async()=>{const {handler,calls}=await setup();const r=await handler(req({action:'login',identifier:'JakSaw',password:'ein-langes-passwort'}));assert.equal(r.status,200);const token=calls.find(c=>c.url.includes('/auth/v1/token'));assert.equal(sent(token).email,'current@example.test');assert.ok(!calls.some(c=>c.url.includes('select=email')));});
test('Unbekanntes Kürzel prüft gegen Platzhalter und antwortet einheitlich [Claude]',async()=>{const {handler,calls}=await setup(false,{respond:url=>url.includes('/profiles?')?new Response('[]'):url.includes('/auth/v1/token')?fail(400):undefined});const r=await handler(req({action:'login',identifier:'xyzabc',password:'ein-langes-passwort'}));assert.equal(r.status,401);assert.equal(sent(calls.find(c=>c.url.includes('/auth/v1/token'))).email,'invalid-account@invalid.invalid');});
test('Login meldet Auth-Ratenlimit als 429 statt falsches Passwort [Claude]',async()=>{const {handler}=await setup(false,{respond:url=>url.includes('/auth/v1/token')?fail(429):undefined});assert.equal((await handler(req({action:'login',identifier:'a@example.test',password:'ein-langes-passwort'}))).status,429);});
test('Reset: Mailfehler bleibt nach außen neutral, wird aber ohne Adresse protokolliert [Claude]',async()=>{const {handler,logs}=await setup(false,{respond:url=>url.includes('/auth/v1/recover')?fail(500):undefined});const r=await handler(req({action:'reset',identifier:'Schueler@Example.test'}));assert.equal(r.status,200);assert.match((await r.json()).message,/Wenn ein passendes Konto existiert/);assert.ok(logs.some(l=>l.includes('recover_failed')));assert.ok(logs.every(l=>!/example\.test|schueler/i.test(l)));});
test('Admin-Reset: Versandfehler wird gemeldet und auditiert, Ziel ist Auth-E-Mail [Claude]',async()=>{const {handler,calls}=await setup(true,{respond:url=>url.includes('/auth/v1/recover')?fail(500):undefined});const r=await handler(req({action:'admin-reset',id:'11111111-1111-1111-1111-111111111111'},true));assert.equal(r.status,502);assert.equal(sent(calls.find(c=>c.url.includes('/auth/v1/recover'))).email,'current@example.test');const audit=calls.find(c=>c.url.endsWith('/admin_audit'));assert.equal(sent(audit).action,'password_reset_failed');});
test('Admin-Reset erfolgreich: Audit ohne Passwort [Claude]',async()=>{const {handler,calls}=await setup(true);const r=await handler(req({action:'admin-reset',id:'11111111-1111-1111-1111-111111111111'},true));assert.equal(r.status,200);const audit=sent(calls.find(c=>c.url.endsWith('/admin_audit')));assert.deepEqual(Object.keys(audit).sort(),['action','actor','target']);assert.equal(audit.action,'password_reset_requested');});
test('Registrierung: Name ohne lateinische Buchstaben wird vor Supabase abgefangen [Claude]',async()=>{const {handler,calls}=await setup(false,{registration:'true'});const r=await handler(req({action:'register',identifier:'neu@example.test',first_name:'Иван',last_name:'Петров',password:'ein-langes-passwort'}));assert.equal(r.status,400);assert.match((await r.json()).message,/lateinische Buchstaben/);assert.ok(!calls.some(c=>c.url.includes('/signup')));});
test('Registrierung: Steuerzeichen im Namen abgewiesen [Claude]',async()=>{const {handler,calls}=await setup(false,{registration:'true'});const r=await handler(req({action:'register',identifier:'neu@example.test',first_name:'Max\u0007',last_name:'Muster',password:'ein-langes-passwort'}));assert.equal(r.status,400);assert.ok(!calls.some(c=>c.url.includes('/signup')));});
test('Registrierung: Mailausfall wird als 502 gemeldet, nicht als Erfolg [Claude]',async()=>{const {handler}=await setup(false,{registration:'true',respond:url=>url.includes('/signup')?fail(500):undefined});const r=await handler(req({action:'register',identifier:'neu@example.test',first_name:'Max',last_name:'Muster',password:'ein-langes-passwort'}));assert.equal(r.status,502);});
test('Passwortwechsel widerruft alle Sitzungen [Claude]',async()=>{const {handler,calls}=await setup();const r=await handler(req({action:'password',password:'ein-neues-langes-passwort'},true));assert.equal(r.status,200);assert.equal((await r.json()).signed_out,true);assert.ok(calls.some(c=>c.url.endsWith('/auth/v1/logout?scope=global')));});
test('Manipuliertes Token ergibt 401 [Claude]',async()=>{const {handler}=await setup(false,{respond:url=>url.endsWith('/auth/v1/user')?fail(401):undefined});assert.equal((await handler(req({action:'profile'},true))).status,401);});
test('Adminliste wird seitenweise geladen [Claude]',async()=>{const rows=Array.from({length:101},(_,i)=>({id:String(i),username:'u'+i}));const {handler,calls}=await setup(true,{respond:url=>url.includes('/profiles?select=id,username')?new Response(JSON.stringify(rows)):undefined});const r=await handler(req({action:'admin-list',page:1},true));const data=await r.json();assert.equal(r.status,200);assert.equal(data.users.length,100);assert.equal(data.has_more,true);assert.ok(calls.some(c=>c.url.includes('limit=101&offset=100')));});
test('Adminliste: ungültige Seitenangabe abgewiesen [Claude]',async()=>{const {handler}=await setup(true);for(const page of [-1,1.5,'2',1000])assert.equal((await handler(req({action:'admin-list',page},true))).status,400,String(page));});
test('Nicht erreichbares Supabase ergibt 502 mit adressfreiem Log [Claude]',async()=>{const {handler,logs}=await setup(false,{respond:url=>{if(url.includes('/auth/v1/token'))throw new TypeError('network');}});const r=await handler(req({action:'login',identifier:'a@example.test',password:'ein-langes-passwort'}));assert.equal(r.status,502);assert.ok(logs.some(l=>l.includes('upstream_unreachable')));assert.ok(logs.every(l=>!l.includes('example.test')));});
test('Upstream-Aufrufe tragen ein Zeitlimit [Claude]',async()=>{const {handler,calls}=await setup();await handler(req({action:'login',identifier:'a@example.test',password:'ein-langes-passwort'}));assert.ok(calls.length>0&&calls.every(c=>c.options.signal instanceof AbortSignal));});
test('Audit-Ansicht nur für Admins [Claude]',async()=>{const {handler,calls}=await setup();assert.equal((await handler(req({action:'admin-audit'},true))).status,403);assert.ok(!calls.some(c=>c.url.includes('/admin_audit')));});
test('Audit-Ansicht zeigt Kürzel statt E-Mail und markiert gelöschte Konten [Claude]',async()=>{const audit=[{created_at:'2026-10-17T10:00:00Z',action:'password_reset_requested',actor:'11111111-1111-1111-1111-111111111111',target:null}];const {handler,calls}=await setup(true,{respond:url=>url.includes('/admin_audit?')?new Response(JSON.stringify(audit)):undefined});const r=await handler(req({action:'admin-audit'},true));const data=await r.json();assert.equal(r.status,200);assert.deepEqual(data.entries,[{created_at:'2026-10-17T10:00:00Z',action:'password_reset_requested',actor:'jaksaw',target:'gelöschtes Konto'}]);assert.ok(!JSON.stringify(data).includes('@'));assert.ok(calls.some(c=>c.url.includes('id=in.(11111111-1111-1111-1111-111111111111)')));});
const target='22222222-2222-2222-2222-222222222222';
test('Kontosperre: nur Admins, nicht das eigene Konto [Claude]',async()=>{const s=await setup();assert.equal((await s.handler(req({action:'admin-lock',id:target},true))).status,403);const a=await setup(true,{respond:url=>url.endsWith('/auth/v1/user')?new Response(JSON.stringify({id:target,email_confirmed_at:'2026-10-17'})):undefined});const r=await a.handler(req({action:'admin-lock',id:target},true));assert.equal(r.status,400);assert.match((await r.json()).message,/eigene Konto/);assert.ok(!a.calls.some(c=>c.url.includes('/auth/v1/admin/users/')&&c.options.method==='PUT'));});
test('Kontosperre setzt Bann, locked_at und Audit; Entsperren hebt beides auf [Claude]',async()=>{for(const [action,ban,audit] of [['admin-lock','876000h','account_locked'],['admin-unlock','none','account_unlocked']]){const {handler,calls}=await setup(true);const r=await handler(req({action,id:target},true));assert.equal(r.status,200,action);const put=calls.find(c=>c.url.endsWith('/auth/v1/admin/users/'+target)&&c.options.method==='PUT');assert.equal(sent(put).ban_duration,ban);const patch=calls.find(c=>c.options.method==='PATCH');assert.ok(patch.url.includes('id=eq.'+target));assert.equal(sent(patch).locked_at===null,action==='admin-unlock');assert.equal(sent(calls.find(c=>c.url.endsWith('/admin_audit'))).action,audit);}});
test('Gesperrtes Konto wird bei jeder geschützten Aktion abgewiesen [Claude]',async()=>{const {handler}=await setup(false,{respond:url=>url.endsWith('/auth/v1/user')?new Response(JSON.stringify({id:'test-user',email_confirmed_at:'2026-10-17',banned_until:'2126-01-01T00:00:00Z'})):undefined});assert.equal((await handler(req({action:'profile'},true))).status,401);});
test('Abgelaufener Bann sperrt nicht mehr [Claude]',async()=>{const {handler}=await setup(false,{respond:url=>url.endsWith('/auth/v1/user')?new Response(JSON.stringify({id:'test-user',email_confirmed_at:'2026-10-17',banned_until:'2020-01-01T00:00:00Z'})):undefined});assert.equal((await handler(req({action:'profile'},true))).status,200);});
test('Kontosperre ist pro Zielkonto begrenzt [Claude]',async()=>{const {handler,calls}=await setup(true,{respond:(url,o)=>url.includes('/rpc/startlab_limit')&&JSON.parse(o.body).key.startsWith('admin-lock:')?new Response('false'):undefined});const r=await handler(req({action:'admin-lock',id:target},true));assert.equal(r.status,429);assert.ok(!calls.some(c=>c.url.includes('/auth/v1/admin/users/')&&c.options.method==='PUT'));});

// All deletion cases use simulated Auth responses. No real account is involved.
const deleteBody={action:'admin-delete',id:target,confirm_username:'tesper'};
async function deleteSetup(respond=()=>undefined){return setup(true,{respond:async(url,options)=>{
 const custom=await respond(url,options);if(custom)return custom;
 if(url.includes('/administrators?')&&url.endsWith('user_id=eq.'+target))return new Response('[]');
 if(url.includes('/profiles?select=id,username&id='))return new Response(JSON.stringify([{id:target,username:'tesper'}]));
}});}
const deletions=calls=>calls.filter(c=>c.options.method==='DELETE');
test('Kontolöschung ohne Adminrolle bzw. Anmeldung bleibt gesperrt [Codex]',async()=>{
 for(const auth of [false,true]){const {handler,calls}=await setup();assert.equal((await handler(req(deleteBody,auth))).status,auth?403:401);assert.equal(deletions(calls).length,0);}
});
test('Kontolöschung schützt eigenes Konto, falsche UUID und fehlende Kürzelbestätigung [Codex]',async()=>{
 for(const body of [{...deleteBody,id:'falsch'},{...deleteBody,confirm_username:'anderes'},{action:'admin-delete',id:target}]){
  const {handler,calls}=await deleteSetup();assert.equal((await handler(req(body,true))).status,400);assert.equal(deletions(calls).length,0);
 }
 const {handler,calls}=await setup(true,{respond:url=>url.endsWith('/auth/v1/user')?new Response(JSON.stringify({id:target,email_confirmed_at:'2026-10-17'})):undefined});
 assert.equal((await handler(req(deleteBody,true))).status,400);assert.equal(deletions(calls).length,0);
});
test('Kontolöschung verweigert Administratorkonten und verschwundene Profile [Codex]',async()=>{
 for(const [part,response,status] of [['/administrators?','[{"user_id":"'+target+'"}]',403],['/profiles?','[]',404]]){
  const {handler,calls}=await deleteSetup(url=>url.includes(part)&&url.includes(target)?new Response(response):undefined);
  assert.equal((await handler(req(deleteBody,true))).status,status);assert.equal(deletions(calls).length,0);
 }
});
test('Kontolöschung beachtet Zielkonto-Limit [Codex]',async()=>{
 const {handler,calls}=await deleteSetup((url,options)=>url.includes('/rpc/startlab_limit')&&sent({options}).key==='admin-delete:'+target?new Response('false'):undefined);
 assert.equal((await handler(req(deleteBody,true))).status,429);assert.equal(deletions(calls).length,0);
});
test('Kontolöschung stoppt vor dem Auth-Aufruf, wenn Vorabprotokoll nicht gespeichert wird [Codex]',async()=>{
 const {handler,calls}=await deleteSetup(url=>url.endsWith('/admin_audit')?fail(503):undefined);
 assert.equal((await handler(req(deleteBody,true))).status,502);assert.equal(deletions(calls).length,0);
});
test('Kontolöschung verwendet Auth-Hard-Delete und anonymes Abschlussprotokoll [Codex]',async()=>{
 const {handler,calls,logs}=await deleteSetup();const r=await handler(req(deleteBody,true));assert.equal(r.status,200);
 const data=await r.json();assert.equal(data.deleted,true);assert.equal(data.audit_complete,true);
 const removal=deletions(calls)[0];assert.ok(removal.url.endsWith('/auth/v1/admin/users/'+target));assert.deepEqual(sent(removal),{should_soft_delete:false});
 const audit=calls.filter(c=>c.url.endsWith('/admin_audit'));assert.equal(audit.length,2);assert.equal(sent(audit[0]).target,target);assert.equal(sent(audit[0]).action,'account_deletion_requested');
 assert.ok(calls.indexOf(audit[0])<calls.indexOf(removal));assert.equal(sent(audit[1]).target,null);assert.equal(sent(audit[1]).action,'account_deleted');
 assert.ok(logs.every(l=>!l.includes(target)&&!l.includes('tesper')));
});
test('Unbestätigte Kontolöschung wird nicht als Erfolg ausgegeben oder automatisch wiederholt [Codex]',async()=>{
 const {handler,calls}=await deleteSetup((url,options)=>options.method==='DELETE'?fail(503):undefined);
 const r=await handler(req(deleteBody,true));assert.equal(r.status,502);assert.match((await r.json()).message,/nicht bestätigt/);assert.equal(deletions(calls).length,1);
 assert.equal(sent(calls.filter(c=>c.url.endsWith('/admin_audit')).at(-1)).action,'account_deletion_unconfirmed');
});
test('Nach erfolgreicher Löschung meldet ausfallendes Abschlussprotokoll den tatsächlichen Zustand [Codex]',async()=>{
 let auditCount=0;const {handler,calls}=await deleteSetup(url=>url.endsWith('/admin_audit')&&++auditCount===2?fail(503):undefined);
 const r=await handler(req(deleteBody,true));assert.equal(r.status,200);const data=await r.json();assert.equal(data.deleted,true);assert.equal(data.audit_complete,false);assert.match(data.message,/Protokolleintrag konnte nicht bestätigt/);assert.equal(deletions(calls).length,1);
});
