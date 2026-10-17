// No third-party dependencies. Credentials are read only from Edge secrets.
const base=Deno.env.get('SUPABASE_URL')!;
const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const anon=Deno.env.get('SUPABASE_ANON_KEY')!;
const origin=Deno.env.get('SITE_ORIGIN')!;
const site=Deno.env.get('SITE_URL')!;
const registration=Deno.env.get('REGISTRATION_ENABLED')==='true';
const generic='Wenn ein passendes Konto existiert, erhältst du eine E-Mail mit den nächsten Schritten.';
class Failure extends Error { constructor(public status:number,message:string){super(message);} }
// [Claude, 2026-10-17] Upstream status classes are kept (429 / 502) so rate limits and mail outages are not reported as wrong input.
// Logs carry only path and status: no query strings, IDs, e-mails, names or passwords.
// [Claude, 2026-10-17] 10 s per upstream call; a hanging Supabase request ends as 502 instead of blocking the function.
async function request(path:string,method='GET',body?:unknown,token=service){let r:Response;try{r=await fetch(base+path,{method,headers:{apikey:token===service?service:anon,Authorization:`Bearer ${token}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(10000),...(body===undefined?{}:{body:JSON.stringify(body)})});}catch{console.error(JSON.stringify({event:'upstream_unreachable',path:path.split('?')[0].replace(/[0-9a-f-]{36}/gi,':id')}));throw new Failure(502,'Der Kontodienst ist gerade nicht erreichbar. Bitte versuche es später erneut.');}const data=await r.json().catch(()=>null);if(!r.ok){console.error(JSON.stringify({event:'upstream_error',path:path.split('?')[0].replace(/[0-9a-f-]{36}/gi,':id'),status:r.status}));if(r.status===429)throw new Failure(429,'Zu viele Anfragen. Bitte warte einige Minuten.');if(r.status>=500)throw new Failure(502,'Der Kontodienst ist gerade nicht erreichbar. Bitte versuche es später erneut.');throw new Failure(400,'Die Anfrage konnte nicht abgeschlossen werden. Prüfe deine Angaben oder versuche es später erneut.');}return data;}
async function digest(value:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');}
async function limit(key:string,max:number){if(!await request('/rest/v1/rpc/startlab_limit','POST',{key,maximum:max}))throw new Failure(429,'Zu viele Versuche. Bitte warte 15 Minuten.');}
function text(value:unknown,max:number){if(typeof value!=='string'||!value.trim()||value.length>max)throw new Failure(400,'Bitte fülle alle Angaben korrekt aus.');return value.trim();}
function name(value:unknown){const v=text(value,60);if(/[\u0000-\u001f\u007f]/.test(v))throw new Failure(400,'Bitte fülle alle Angaben korrekt aus.');return v;}
function password(value:unknown){if(typeof value!=='string'||value.length<12||value.length>128)throw new Failure(400,'Das Passwort muss 12 bis 128 Zeichen lang sein.');return value;}
function email(value:unknown){const v=text(value,254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))throw new Failure(400,'Bitte gib eine gültige E-Mail-Adresse ein.');return v;}
// [Claude, 2026-10-17] Same table as content.js kuerzelMap and migration 202610170002; compared in tests/content.test.mjs.
const kuerzelPairs=[['ä','ae'],['ö','oe'],['ü','ue'],['ß','ss'],['æ','ae'],['œ','oe']];
const kuerzelFrom='áàâãåāăąéèêëēėęěíìîïīįıóòôõøōőúùûūůűųýÿñńňçćčďđğłľĺřŕšśşťţžźż',kuerzelTo='aaaaaaaaeeeeeeeeiiiiiiiooooooouuuuuuuyynnncccddglllrrsssttzzz';
function usernameBase(first:string,last:string){const norm=(s:string)=>{let v=s.normalize('NFC').trim().toLowerCase();for(const [a,b] of kuerzelPairs)v=v.replaceAll(a,b);return [...v].map(c=>{const i=kuerzelFrom.indexOf(c);return i<0?c:kuerzelTo[i];}).join('').replace(/[^a-z]/g,'');};return norm(first).slice(0,3)+norm(last).slice(0,3);}
// The confirmed Auth e-mail is authoritative; the profile copy is only for listing.
async function authEmail(id:string){const user=await request('/auth/v1/admin/users/'+encodeURIComponent(id));if(!user?.email)throw new Failure(404,'Konto nicht gefunden.');return user.email as string;}
async function identity(req:Request){const token=req.headers.get('Authorization')?.replace(/^Bearer /,'');if(!token)throw new Failure(401,'Bitte melde dich an.');try{const user=await request('/auth/v1/user','GET',undefined,token);if(!user.email_confirmed_at)throw Error();if(user.banned_until&&new Date(user.banned_until).getTime()>Date.now())throw Error();return {user,token};}catch{throw new Failure(401,'Die Anmeldung ist abgelaufen. Bitte melde dich erneut an.');}}
Deno.serve(async req=>{const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store','Vary':'Origin'};const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});try{
 if(!origin||!site||new URL(site).origin!==origin)throw new Failure(503,'Der Kontodienst wird noch eingerichtet.');
 if(req.headers.get('Origin')!==origin)throw new Failure(403,'Diese Herkunft ist nicht zugelassen.');
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')throw new Failure(405,'Nur POST ist erlaubt.');
 if(Number(req.headers.get('content-length')||0)>8192)throw new Failure(413,'Anfrage zu groß.');
 const raw=await req.text();if(raw.length>8192)throw new Failure(413,'Anfrage zu groß.');
 let body;try{body=JSON.parse(raw);}catch{throw new Failure(400,'Ungültige Anfrage.');}
 if(!body||typeof body!=='object'||Array.isArray(body))throw new Failure(400,'Ungültige Anfrage.');
 const action=text(body.action,30);
 if(!['register','login','reset','profile','password','logout','admin-list','admin-reset','admin-audit','admin-lock','admin-unlock'].includes(action))throw new Failure(400,'Unbekannte Aktion.');
 await limit('global:'+action,action==='register'?100:1000);
 if(['register','login','reset'].includes(action)){
 const identifier=text(body.identifier,254).toLowerCase();await limit(action+':'+await digest(identifier),action==='reset'?3:10);
 if(action==='register'){
 if(!registration)throw new Failure(503,'Die Registrierung ist noch nicht freigeschaltet.');
 const e=email(identifier);const first=name(body.first_name),last=name(body.last_name);
 if(usernameBase(first,last).length<2)throw new Failure(400,'Für das automatische Kürzel braucht dein Name mindestens zwei lateinische Buchstaben. Bitte wende dich an deine Lehrkraft.');
 await request('/auth/v1/signup?redirect_to='+encodeURIComponent(site),'POST',{email:e,password:password(body.password),data:{first_name:first,last_name:last}},anon);
 return reply({message:'Prüfe dein E-Mail-Postfach. Nach der Bestätigung kannst du dich mit deiner E-Mail anmelden und dein Kürzel im Profil ablesen.'});
 }
 // Same answer for every address; a failed send is logged (status only) so the acceptance test and monitoring notice it.
 if(action==='reset'){const e=email(identifier);try{await request('/auth/v1/recover?redirect_to='+encodeURIComponent(site),'POST',{email:e},anon);}catch(error){console.error(JSON.stringify({event:'recover_failed',status:error instanceof Failure?error.status:500}));}return reply({message:generic});}
 let loginEmail=identifier;
 if(!identifier.includes('@')){if(!/^[a-z]{2,6}[0-9]*$/.test(identifier))throw new Failure(401,'Kürzel/E-Mail oder Passwort nicht korrekt.');const profiles=await request('/rest/v1/profiles?select=id&username=eq.'+encodeURIComponent(identifier)+'&limit=1');loginEmail=profiles[0]?await authEmail(profiles[0].id).catch(()=>'invalid-account@invalid.invalid'):'invalid-account@invalid.invalid';}
 try{const data=await request('/auth/v1/token?grant_type=password','POST',{email:loginEmail,password:password(body.password)},anon);return reply({access_token:data.access_token,expires_in:data.expires_in});}catch(error){if(error instanceof Failure&&error.status!==400)throw error;throw new Failure(401,'Kürzel/E-Mail oder Passwort nicht korrekt oder E-Mail noch nicht bestätigt.');}
 }
 const {user,token}=await identity(req);
 if(action==='logout'){await request('/auth/v1/logout','POST',{},token);return reply({message:'Abgemeldet.'});}
 // [Claude, 2026-10-17] After a password change all sessions are revoked (e.g. a login left open on a shared school PC).
 if(action==='password'){await request('/auth/v1/user','PUT',{password:password(body.password)},token);await request('/auth/v1/logout?scope=global','POST',{},token).catch(()=>null);return reply({message:'Dein neues Passwort ist gespeichert. Aus Sicherheitsgründen wurdest du auf allen Geräten abgemeldet. Melde dich mit dem neuen Passwort an.',signed_out:true});}
 const roles=await request('/rest/v1/administrators?select=user_id&user_id=eq.'+encodeURIComponent(user.id));const isAdmin=roles.length===1;
 if(action==='profile'){const profiles=await request('/rest/v1/profiles?select=username,first_name,last_name&id=eq.'+encodeURIComponent(user.id));if(!profiles.length)throw new Failure(404,'Kein Profil gefunden.');return reply({...profiles[0],is_admin:isAdmin});}
 if(!isAdmin)throw new Failure(403,'Nur für Administratoren.');
 // [Claude, 2026-10-17] Read-only audit view: last 100 entries, accounts shown by Kürzel only (no e-mail).
 if(action==='admin-audit'){const rows=await request('/rest/v1/admin_audit?select=created_at,action,actor,target&order=created_at.desc,id.desc&limit=100');const ids:string[]=[...new Set<string>(rows.flatMap((r:{actor:string|null,target:string|null})=>[r.actor,r.target]).filter((v:string|null):v is string=>!!v&&/^[0-9a-f-]{36}$/i.test(v)))];const names=new Map<string,string>();if(ids.length)for(const p of await request('/rest/v1/profiles?select=id,username&id=in.('+ids.map(encodeURIComponent).join(',')+')'))names.set(p.id,p.username);const label=(id:string|null)=>id?names.get(id)??'unbekannt':'gelöschtes Konto';return reply({entries:rows.map((r:{created_at:string,action:string,actor:string|null,target:string|null})=>({created_at:r.created_at,action:r.action,actor:label(r.actor),target:label(r.target)}))});}
 // [Claude, 2026-10-17] Pages of 100 with a stable order; one extra row tells whether more exist.
 if(action==='admin-list'){const page=body.page??0;if(!Number.isInteger(page)||page<0||page>999)throw new Failure(400,'Ungültige Seite.');const rows=await request(`/rest/v1/profiles?select=id,username,first_name,last_name,email,created_at,locked_at&order=created_at.desc,id.asc&limit=101&offset=${page*100}`);return reply({users:rows.slice(0,100),page,has_more:rows.length>100});}
 if(action==='admin-reset'){const id=text(body.id,36);if(!/^[0-9a-f-]{36}$/i.test(id))throw new Failure(400,'Ungültiges Konto.');await limit('admin-reset:'+id,3);const target=await request('/rest/v1/profiles?select=id&id=eq.'+encodeURIComponent(id));if(!target.length)throw new Failure(404,'Konto nicht gefunden.');const address=await authEmail(id);
 const audit=(result:string)=>request('/rest/v1/admin_audit','POST',{actor:user.id,target:id,action:result});
 try{await request('/auth/v1/recover?redirect_to='+encodeURIComponent(site),'POST',{email:address},anon);}catch(error){await audit('password_reset_failed').catch(()=>null);throw new Failure(error instanceof Failure&&error.status===429?429:502,'Der Reset-Link konnte nicht versendet werden. Prüfe den Mailversand (SMTP) und versuche es später erneut.');}
 await audit('password_reset_requested');return reply({message:'Der Reset-Link wurde angefordert. Das neue Passwort wählt die Person selbst.'});}
 // [Claude, 2026-10-17] Lock = Supabase Auth ban (no sign-in, no token refresh; identity() also rejects banned users).
 // locked_at mirrors the state for the list. No self-lock, so the last admin cannot lock themselves out.
 if(action==='admin-lock'||action==='admin-unlock'){const id=text(body.id,36);if(!/^[0-9a-f-]{36}$/i.test(id))throw new Failure(400,'Ungültiges Konto.');if(id===user.id)throw new Failure(400,'Das eigene Konto kann nicht gesperrt werden.');const target=await request('/rest/v1/profiles?select=id&id=eq.'+encodeURIComponent(id));if(!target.length)throw new Failure(404,'Konto nicht gefunden.');const lock=action==='admin-lock';
 await request('/auth/v1/admin/users/'+encodeURIComponent(id),'PUT',{ban_duration:lock?'876000h':'none'});
 await request('/rest/v1/profiles?id=eq.'+encodeURIComponent(id),'PATCH',{locked_at:lock?new Date().toISOString():null});
 await request('/rest/v1/admin_audit','POST',{actor:user.id,target:id,action:lock?'account_locked':'account_unlocked'});
 return reply({message:lock?'Das Konto ist gesperrt. Anmeldung und Verlängerung der Sitzung sind nicht mehr möglich.':'Das Konto ist wieder freigegeben.',locked:lock});}
 throw new Failure(400,'Unbekannte Aktion.');
 }catch(error){if(error instanceof Failure)return reply({message:error.message},error.status);console.error(JSON.stringify({event:'unexpected_error'}));return reply({message:'Der Kontodienst ist derzeit nicht verfügbar.'},500);}});
