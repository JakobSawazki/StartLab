// [Claude, 2026-10-17] Non-destructive smoke test for the deployed Edge Function. Creates no accounts and sends no mail
// to real people (the reset uses a reserved .invalid address). Run right after `supabase functions deploy startlab`:
// STARTLAB_API=https://REF.supabase.co/functions/v1/startlab STARTLAB_ORIGIN=https://jakobsawazki.github.io node tools/smoke-check.mjs
import assert from 'node:assert/strict';
const api=process.env.STARTLAB_API,origin=process.env.STARTLAB_ORIGIN;
if(!api||!origin){console.error('STARTLAB_API und STARTLAB_ORIGIN setzen.');process.exit(2);}
const call=async(body,{from=origin,method='POST',token}={})=>{const r=await fetch(api,{method,headers:{Origin:from,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(method==='POST'?{body:typeof body==='string'?body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)});return {status:r.status,headers:r.headers,data:await r.json().catch(()=>null)};};
const results=[];const check=async(name,fn)=>{try{await fn();results.push(['ok',name]);}catch(error){results.push(['FEHLER',name+': '+error.message]);}};
await check('Fremde Herkunft abgewiesen (403)',async()=>assert.equal((await call({action:'login'},{from:'https://example.com'})).status,403));
await check('Preflight der eigenen Herkunft (204, CORS-Header)',async()=>{const r=await call(null,{method:'OPTIONS'});assert.equal(r.status,204);assert.equal(r.headers.get('access-control-allow-origin'),origin);});
await check('Nur POST erlaubt (405)',async()=>assert.equal((await call(null,{method:'GET'})).status,405));
await check('Ungültiges JSON (400)',async()=>assert.equal((await call('{kaputt')).status,400));
await check('Unbekannte Aktion (400)',async()=>assert.equal((await call({action:'drop-table'})).status,400));
await check('Adminliste ohne Anmeldung (401)',async()=>assert.equal((await call({action:'admin-list'})).status,401));
await check('Gefälschtes Token (401)',async()=>assert.equal((await call({action:'profile'},{token:'kein.gueltiges.token'})).status,401));
await check('Falsches Passwort für erfundenes Kürzel (401)',async()=>assert.equal((await call({action:'login',identifier:'zzqxyv',password:'kein-echtes-passwort'})).status,401));
await check('Reset für reservierte Adresse neutral (200)',async()=>{const r=await call({action:'reset',identifier:'smoke-check@example.invalid'});assert.equal(r.status,200);assert.match(r.data?.message||'',/Wenn ein passendes Konto existiert/);});
await check('Antworten nicht zwischenspeicherbar',async()=>assert.match((await call({action:'admin-list'})).headers.get('cache-control')||'',/no-store/));
const registration=await call({action:'register',identifier:'smoke-check@example.invalid'});
results.push([registration.status===503?'ok':'HINWEIS',registration.status===503?'Registrierung gesperrt (503)':`Registrierung antwortet mit ${registration.status}: REGISTRATION_ENABLED prüfen`]);
for(const [state,text] of results)console.log(state.padEnd(7),text);
if(results.some(r=>r[0]==='FEHLER'))process.exitCode=1;
