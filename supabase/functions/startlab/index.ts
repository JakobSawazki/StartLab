// No third-party dependencies. Credentials are read only from Edge secrets.
const base=Deno.env.get('SUPABASE_URL')!;
const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const anon=Deno.env.get('SUPABASE_ANON_KEY')!;
const origin=Deno.env.get('SITE_ORIGIN')!;
const site=Deno.env.get('SITE_URL')!;
const registration=Deno.env.get('REGISTRATION_ENABLED')==='true';
const generic='Wenn ein passendes Konto existiert, erhältst du eine E-Mail mit den nächsten Schritten.';
class Failure extends Error { constructor(public status:number,message:string){super(message);} }
async function request(path:string,method='GET',body?:unknown,token=service){const r=await fetch(base+path,{method,headers:{apikey:token===service?service:anon,Authorization:`Bearer ${token}`,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});const data=await r.json().catch(()=>null);if(!r.ok)throw new Failure(400,'Die Anfrage konnte nicht abgeschlossen werden. Prüfe deine Angaben oder versuche es später erneut.');return data;}
async function digest(value:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');}
async function limit(key:string,max:number){if(!await request('/rest/v1/rpc/startlab_limit','POST',{key,maximum:max}))throw new Failure(429,'Zu viele Versuche. Bitte warte 15 Minuten.');}
function text(value:unknown,max:number){if(typeof value!=='string'||!value.trim()||value.length>max)throw new Failure(400,'Bitte fülle alle Angaben korrekt aus.');return value.trim();}
function password(value:unknown){if(typeof value!=='string'||value.length<12||value.length>128)throw new Failure(400,'Das Passwort muss 12 bis 128 Zeichen lang sein.');return value;}
function email(value:unknown){const v=text(value,254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))throw new Failure(400,'Bitte gib eine gültige E-Mail-Adresse ein.');return v;}
async function identity(req:Request){const token=req.headers.get('Authorization')?.replace(/^Bearer /,'');if(!token)throw new Failure(401,'Bitte melde dich an.');try{const user=await request('/auth/v1/user','GET',undefined,token);if(!user.email_confirmed_at)throw Error();return {user,token};}catch{throw new Failure(401,'Die Anmeldung ist abgelaufen. Bitte melde dich erneut an.');}}
Deno.serve(async req=>{const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store','Vary':'Origin'};const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});try{
 if(!origin||!site||new URL(site).origin!==origin)throw new Failure(503,'Der Kontodienst wird noch eingerichtet.');
 if(req.headers.get('Origin')!==origin)throw new Failure(403,'Diese Herkunft ist nicht zugelassen.');
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')throw new Failure(405,'Nur POST ist erlaubt.');
 if(Number(req.headers.get('content-length')||0)>8192)throw new Failure(413,'Anfrage zu groß.');
 const raw=await req.text();if(raw.length>8192)throw new Failure(413,'Anfrage zu groß.');
 const body=JSON.parse(raw);const action=text(body.action,30);
 if(!['register','login','reset','profile','password','logout','admin-list','admin-reset'].includes(action))throw new Failure(400,'Unbekannte Aktion.');
 await limit('global:'+action,action==='register'?100:1000);
 if(['register','login','reset'].includes(action)){
 const identifier=text(body.identifier,254).toLowerCase();await limit(action+':'+await digest(identifier),action==='reset'?3:10);
 if(action==='register'){
 if(!registration)throw new Failure(503,'Die Registrierung ist noch nicht freigeschaltet.');
 const e=email(identifier);const first=text(body.first_name,60),last=text(body.last_name,60);
 await request('/auth/v1/signup?redirect_to='+encodeURIComponent(site),'POST',{email:e,password:password(body.password),data:{first_name:first,last_name:last}},anon);
 return reply({message:'Prüfe dein E-Mail-Postfach. Nach der Bestätigung kannst du dich mit deiner E-Mail anmelden und dein Kürzel im Profil ablesen.'});
 }
 if(action==='reset'){try{await request('/auth/v1/recover?redirect_to='+encodeURIComponent(site),'POST',{email:email(identifier)},anon);}catch{}return reply({message:generic});}
 let loginEmail=identifier;
 if(!identifier.includes('@')){if(!/^[a-z]{2,6}[0-9]*$/.test(identifier))throw new Failure(401,'Kürzel/E-Mail oder Passwort nicht korrekt.');const profiles=await request('/rest/v1/profiles?select=email&username=eq.'+encodeURIComponent(identifier)+'&limit=1');loginEmail=profiles[0]?.email||'invalid-account@invalid.invalid';}
 try{const data=await request('/auth/v1/token?grant_type=password','POST',{email:loginEmail,password:password(body.password)},anon);return reply({access_token:data.access_token,expires_in:data.expires_in});}catch{throw new Failure(401,'Kürzel/E-Mail oder Passwort nicht korrekt oder E-Mail noch nicht bestätigt.');}
 }
 const {user,token}=await identity(req);
 if(action==='logout'){await request('/auth/v1/logout','POST',{},token);return reply({message:'Abgemeldet.'});}
 if(action==='password'){await request('/auth/v1/user','PUT',{password:password(body.password)},token);return reply({message:'Dein neues Passwort ist gespeichert. Melde dich anschließend neu an.'});}
 const roles=await request('/rest/v1/administrators?select=user_id&user_id=eq.'+encodeURIComponent(user.id));const isAdmin=roles.length===1;
 if(action==='profile'){const profiles=await request('/rest/v1/profiles?select=username,first_name,last_name&id=eq.'+encodeURIComponent(user.id));if(!profiles.length)throw new Failure(404,'Kein Profil gefunden.');return reply({...profiles[0],is_admin:isAdmin});}
 if(!isAdmin)throw new Failure(403,'Nur für Administratoren.');
 if(action==='admin-list'){return reply({users:await request('/rest/v1/profiles?select=id,username,first_name,last_name,email,created_at&order=created_at.desc&limit=500')});}
 if(action==='admin-reset'){const id=text(body.id,36);if(!/^[0-9a-f-]{36}$/i.test(id))throw new Failure(400,'Ungültiges Konto.');await limit('admin-reset:'+id,3);const target=await request('/rest/v1/profiles?select=email&id=eq.'+encodeURIComponent(id));if(!target.length)throw new Failure(404,'Konto nicht gefunden.');await request('/auth/v1/recover?redirect_to='+encodeURIComponent(site),'POST',{email:target[0].email},anon);await request('/rest/v1/admin_audit','POST',{actor:user.id,target:id,action:'password_reset_requested'});return reply({message:'Der Reset-Link wurde angefordert. Das neue Passwort wählt die Person selbst.'});}
 throw new Failure(400,'Unbekannte Aktion.');
 }catch(error){if(error instanceof Failure)return reply({message:error.message},error.status);return reply({message:'Der Kontodienst ist derzeit nicht verfügbar.'},500);}});
