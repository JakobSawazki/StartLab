// Real local Supabase/Auth/PostgREST/Mailpit integration. Keys and tokens stay
// in memory; errors deliberately exclude response bodies and request data.
import {randomUUID} from 'node:crypto';
import {totp} from './integration-totp.mjs';

export async function runIntegration({api,mail,anon,service,restoreSnapshot}){
 for(const endpoint of [api,mail]){const u=new URL(endpoint);if(u.protocol!=='http:'||!['127.0.0.1','localhost','[::1]'].includes(u.hostname))throw Error('Integration darf nur Loopback-Systeme kontaktieren.');}
 const origin='http://127.0.0.1:4173',created=new Set(),readMessages=new Set(),checks=[];
 const password='StartLab-Test-'+randomUUID(),newPassword='StartLab-Neu-'+randomUUID();
 const email=suffix=>'startlab-'+randomUUID()+'-'+suffix+'@example.invalid';
 const a={email:email('a')},b={email:email('b')},admin={email:email('admin')};
 let factorId,totpSecret,lastTotpStep=-1;
 function ensure(ok,message){if(!ok)throw Error(message);}
 async function http(path,{method='GET',body,token=anon,expected}={}){
  let r;try{r=await fetch(api+path,{method,headers:{apikey:token===service?service:anon,Authorization:'Bearer '+token,'Content-Type':'application/json',Origin:origin},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(25000)});}catch{throw Error('Lokaler Kontodienst nicht erreichbar.');}
  const data=await r.json().catch(()=>null);
  if(expected!==undefined)ensure(r.status===expected,`HTTP ${r.status} statt ${expected}: ${path.split('?')[0].replace(/[0-9a-f-]{36}/gi,':id')}`);
  return {status:r.status,data};
 }
 const edge=(action,body={},token=anon,expected=200)=>http('/functions/v1/startlab',{method:'POST',body:{action,...body},token,expected});
 async function check(label,fn){await fn();checks.push(label);console.log('OK '+label);}
 async function login(person,pass=password,identifier=person.email){const {data}=await edge('login',{identifier,password:pass});ensure(data.access_token,'Login lieferte keine Sitzung.');person.token=data.access_token;}
 async function upgradeAdmin(){
  let step=Math.floor(Date.now()/30000);
  if(step<=lastTotpStep){await new Promise(r=>setTimeout(r,(lastTotpStep+1)*30000-Date.now()+200));step=Math.floor(Date.now()/30000);}
  const {data}=await edge('mfa-verify',{factor_id:factorId,code:totp(totpSecret)},admin.token);ensure(data.access_token,'Zweiter Faktor liefert keine Sitzung.');
  admin.token=data.access_token;lastTotpStep=step;
 }
 async function profile(person){const {data}=await edge('profile',{},person.token);person.username=data.username;const {data:own}=await http('/rest/v1/profiles?select=id,username',{token:person.token,expected:200});ensure(own.length===1,'RLS liefert nicht genau ein eigenes Profil.');person.id=own[0].id;created.add(person.id);return data;}
 async function messageLink(address,type){
  for(let attempt=0;attempt<60;attempt++){
   let listing;try{listing=await (await fetch(mail+'/api/v1/messages',{signal:AbortSignal.timeout(5000)})).json();}catch{throw Error('Lokales Testpostfach nicht erreichbar.');}
   const messages=listing.messages||[];
   for(const message of messages){
    if(readMessages.has(message.ID)||!message.To?.some(p=>p.Address===address))continue;
    const detail=await (await fetch(mail+'/api/v1/message/'+encodeURIComponent(message.ID),{signal:AbortSignal.timeout(5000)})).json();
    const text=(detail.HTML||'')+'\n'+(detail.Text||'');
    for(const match of text.matchAll(/https?:\/\/[^\s<>"']+/g)){
     let u;try{u=new URL(match[0].replaceAll('&amp;','&'));}catch{continue;}
     if(u.origin===api&&u.pathname==='/auth/v1/verify'&&u.searchParams.get('type')===type){readMessages.add(message.ID);return u;}
    }
   }
   await new Promise(r=>setTimeout(r,500));
  }
  throw Error('Erwartete Bestätigungs-/Recovery-Mail fehlt im lokalen Postfach.');
 }
 async function confirm(link){
  ensure(link.origin===api&&link.pathname==='/auth/v1/verify','Unzulässiges Mailziel.');
  const r=await fetch(link,{redirect:'manual',signal:AbortSignal.timeout(20000)});
  ensure(r.status===302||r.status===303,'Bestätigungslink liefert keine Weiterleitung.');
  const target=new URL(r.headers.get('location'));ensure(target.origin===origin,'Bestätigungslink führt zum falschen Ursprung.');
  const hash=new URLSearchParams(target.hash.slice(1));ensure(!hash.has('error')&&hash.has('access_token'),'Bestätigungslink liefert keine gültige Sitzung.');
  return hash.get('access_token');
 }
 try{
  await check('Anonyme Administration ist gesperrt',async()=>{await edge('admin-list',{},anon,401);await edge('admin-delete',{id:randomUUID(),confirm_username:'test'},anon,401);});
  await check('Parallele Registrierung gleicher Namen und E-Mail-Bestätigung',async()=>{
   await Promise.all([a,b].map(person=>edge('register',{identifier:person.email,first_name:'Test',last_name:'Person',password})));
   for(const person of [a,b]){
    await edge('login',{identifier:person.email,password},anon,401);
    person.token=await confirm(await messageLink(person.email,'signup'));await profile(person);
   }
   ensure([a.username,b.username].sort().join(',')==='tesper,tesper2','Parallele Kürzelkollision wurde nicht korrekt aufgelöst.');
  });
  await check('Kürzel-Anmeldung und getrennte Profile',async()=>{
   await login(a,password,a.username);await login(b,password,b.username);
   const {data}=await http('/rest/v1/profiles?select=id&id=eq.'+b.id,{token:a.token,expected:200});ensure(data.length===0,'Fremdes Profil ist lesbar.');
   await edge('admin-list',{},a.token,403);await edge('admin-lock',{id:b.id},a.token,403);await edge('admin-delete',{id:b.id,confirm_username:b.username},a.token,403);
   await http('/rest/v1/administrators?select=user_id',{token:a.token,expected:403});
   await http('/rest/v1/administrators',{method:'POST',body:{user_id:a.id},token:a.token,expected:403});
   await http('/rest/v1/profiles?id=eq.'+a.id,{method:'PATCH',body:{username:'admin'},token:a.token,expected:403});
  });
  await check('Admin-Konto und serverseitige Rolle',async()=>{
   const {data}=await http('/auth/v1/admin/users',{method:'POST',token:service,body:{email:admin.email,password,email_confirm:true,user_metadata:{first_name:'Test',last_name:'Admin'}},expected:200});
   admin.id=data.id;ensure(admin.id,'Admin-Testkonto konnte nicht angelegt werden.');created.add(admin.id);
   await http('/rest/v1/administrators',{method:'POST',token:service,body:{user_id:admin.id},expected:201});await login(admin);const p=await profile(admin);ensure(p.is_admin===true,'Adminrolle wird nicht erkannt.');
   ensure(p.admin_mfa_required===true,'Administration verlangt keinen zweiten Faktor.');
  });
  await check('Admin-TOTP: Pflicht, Einrichtung, falscher Code und AAL2-Freigabe',async()=>{
   for(const action of ['admin-list','admin-audit','admin-reset','admin-lock','admin-delete'])await edge(action,{id:b.id,confirm_username:b.username},admin.token,403);
   await edge('mfa-enroll',{},a.token,403);
   const {data:factor}=await edge('mfa-enroll',{},admin.token);factorId=factor.factor_id;totpSecret=factor.secret;ensure(factorId&&totpSecret&&factor.qr_code,'TOTP-Einrichtung unvollständig.');
   const validCodes=[-30000,0,30000].map(offset=>totp(totpSecret,Date.now()+offset));let wrong='000000';if(validCodes.includes(wrong))wrong='000001';
   await edge('mfa-verify',{factor_id:factorId,code:wrong},admin.token,400);
   await upgradeAdmin();ensure((await edge('profile',{},admin.token)).data.admin_mfa_required===false,'AAL2 wurde nicht übernommen.');
   await edge('mfa-enroll',{},admin.token,409);
   const {data:list}=await edge('admin-list',{},admin.token);ensure(list.users.length===3,'Kontenliste ist unvollständig.');
  });
  await check('Bestätigte Auth-Mailänderung, Profilabgleich und Kürzel-Anmeldung',async()=>{
   const previous=a.email;a.email=email('changed');
   await http('/auth/v1/admin/users/'+a.id,{method:'PUT',token:service,body:{email:a.email,email_confirm:true},expected:200});
   const {data}=await http('/rest/v1/profiles?select=email&id=eq.'+a.id,{token:service,expected:200});ensure(data[0]?.email===a.email,'Profil folgt der bestätigten Auth-Adresse nicht.');
   await edge('login',{identifier:previous,password},anon,401);await login(a,password,a.username);
  });
  await check('Sicherung und Wiederherstellung von Auth-/Anwendungsdaten',async()=>{
   ensure(typeof restoreSnapshot==='function','Kein isolierter Wiederherstellungstest verfügbar.');
   await http('/rest/v1/admin_audit',{method:'POST',token:service,body:{actor:admin.id,target:a.id,action:'backup_round_trip_test'},expected:201});
   const paths=['/rest/v1/profiles?select=*&order=id','/rest/v1/administrators?select=*&order=user_id','/rest/v1/admin_audit?select=*&order=id'];
   const before=[];for(const path of paths)before.push((await http(path,{token:service,expected:200})).data);
   await restoreSnapshot();
   for(let i=0;i<paths.length;i++){const after=(await http(paths[i],{token:service,expected:200})).data;ensure(JSON.stringify(after)===JSON.stringify(before[i]),'Wiederhergestellte Anwendungsdaten stimmen nicht mit der Sicherung überein.');}
   ensure((await edge('profile',{},admin.token)).data.is_admin===true,'Adminrolle nach Wiederherstellung fehlt.');
   ensure((await edge('profile',{},a.token)).data.username===a.username,'Schülersitzung nach Wiederherstellung nicht korrekt.');
   await login(a,password,a.username);await login(b,password,b.username);await login(admin);
   await edge('admin-list',{},admin.token,403);await upgradeAdmin();
   const {data:other}=await http('/rest/v1/profiles?select=id&id=eq.'+b.id,{token:a.token,expected:200});ensure(other.length===0,'Profil-RLS nach Wiederherstellung verletzt.');
  });
  await check('Recovery-Mail, Passwortwechsel und alte Sitzungen',async()=>{
   const oldToken=a.token;await edge('admin-reset',{id:a.id},admin.token);
   const recovery=await messageLink(a.email,'recovery');const recoveryToken=await confirm(recovery);
   await edge('profile',{},recoveryToken);
   const {data}=await edge('password',{password:newPassword},recoveryToken);ensure(data.signed_out===true&&data.sessions_revoked===true,'Globale Abmeldung wurde nicht bestätigt.');
   await edge('profile',{},oldToken,401);await edge('profile',{},recoveryToken,401);
   const {data:rows}=await http('/rest/v1/profiles?select=id',{token:oldToken,expected:200});ensure(rows.length===0,'Abgemeldete Sitzung kann Profil lesen.');
   await edge('login',{identifier:a.email,password},anon,401);await login(a,newPassword,a.username);
  });
  await check('Abmeldung verwirft vorhandenes Token',async()=>{
   const token=a.token;await edge('logout',{},token);await edge('profile',{},token,401);
   const {data}=await http('/rest/v1/profiles?select=id',{token,expected:200});ensure(data.length===0,'Profil nach Abmeldung lesbar.');await login(a,newPassword);
  });
  await check('Kontosperre und Entsperren mit aktiver Sitzung',async()=>{
   const token=b.token;await edge('admin-lock',{id:b.id},admin.token);await edge('profile',{},token,401);await edge('login',{identifier:b.email,password},anon,401);
   const {data}=await http('/rest/v1/profiles?select=id',{token,expected:200});ensure(data.length===0,'Gesperrtes Konto kann Profil lesen.');
   await edge('admin-unlock',{id:b.id},admin.token);await login(b);await profile(b);
  });
  await check('Geschützte Kontolöschung und anonymisiertes Audit',async()=>{
   await edge('admin-delete',{id:admin.id,confirm_username:admin.username},admin.token,400);
   await edge('admin-delete',{id:b.id,confirm_username:'falsch'},admin.token,400);
   const {data}=await edge('admin-delete',{id:b.id,confirm_username:b.username},admin.token);ensure(data.deleted===true&&data.audit_complete===true,'Löschung wurde nicht bestätigt.');
   await edge('profile',{},b.token,401);await edge('login',{identifier:b.email,password},anon,401);
   const {data:rows}=await http('/rest/v1/profiles?select=id&id=eq.'+b.id,{token:service,expected:200});ensure(rows.length===0,'Gelöschtes Profil ist noch vorhanden.');
   const {data:audit}=await edge('admin-audit',{},admin.token);ensure(audit.entries.some(r=>r.action==='account_deleted'&&r.target==='gelöschtes Konto'),'Abschluss-Audit fehlt.');
   created.delete(b.id);
  });
  await check('Passwort-vergessen versendet weitere Recovery-Mail',async()=>{await edge('reset',{identifier:a.email});await messageLink(a.email,'recovery');});
  console.log(`Supabase-Integration bestanden (${checks.length} Prüfgruppen). Nur lokale Testdaten und Testpostfach verwendet.`);
 }finally{
  for(const id of created){if(!/^[0-9a-f-]{36}$/i.test(id))continue;await http('/auth/v1/admin/users/'+id,{method:'DELETE',token:service,body:{should_soft_delete:false}}).catch(()=>null);}
 }
}
