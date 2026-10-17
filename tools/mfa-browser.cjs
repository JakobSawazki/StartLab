// MFA interface checks use only synthetic factors and intercepted HTTP calls.
const {chromium}=require(process.env.STARTLAB_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
// [Claude, 2026-10-17] Poll from Node: page.waitForFunction evaluates inside the page and is blocked by the
// site's CSP (no 'unsafe-eval') as soon as it actually has to wait. Dialog 'close' events fire asynchronously.
const until=async(page,fn,message,timeout=5000)=>{const end=Date.now()+timeout;while(!(await page.evaluate(fn))){if(Date.now()>end)throw new assert.AssertionError({message});await new Promise(r=>setTimeout(r,50));}};const {readFileSync}=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();const errors=[],calls=[];let enrolled=false;
  const api='https://startlab-mfa-test.supabase.co/functions/v1/startlab',factor='44444444-4444-4444-4444-444444444444';
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/Content Security Policy/i.test(m.text()))errors.push(m.text());});
  await context.route('**/config.js',r=>r.fulfill({contentType:'text/javascript',body:`export const config=Object.freeze({apiUrl:'${api}'});`}));
  await context.route(api,async route=>{
   const b=JSON.parse(route.request().postData()),verified=route.request().headers().authorization==='Bearer verified-token';calls.push(b.action);
   const send=(status,body)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
   if(b.action==='login')return send(200,{access_token:'password-token',expires_in:3600});
   if(b.action==='profile')return send(200,{first_name:'Test',last_name:'Admin',username:'tesadm',is_admin:true,admin_mfa_required:!verified});
   if(b.action==='mfa-status')return send(200,{verified:enrolled?[{id:factor,name:'StartLab Verwaltung'}]:[]});
   if(b.action==='mfa-enroll')return send(200,{factor_id:factor,secret:'SYNTHETIC-SETUP-ONLY',qr_code:'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white"/><rect x="10" y="10" width="30" height="30" fill="black"/></svg>'});
   if(b.action==='mfa-verify'){if(b.code!=='123456')return send(400,{message:'Der Code ist ungültig oder abgelaufen.'});enrolled=true;return send(200,{access_token:'verified-token',expires_in:3600});}
   if(b.action==='admin-list')return verified?send(200,{users:[],page:0,has_more:false}):send(403,{message:'Zweiter Faktor fehlt.'});
   return send(200,{message:'Abgemeldet.'});
  });
  async function audit(){if(!process.env.STARTLAB_AXE)return;await page.evaluate(readFileSync(process.env.STARTLAB_AXE,'utf8'));const result=await page.evaluate(()=>axe.run(document.querySelector('#auth'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));assert.deepEqual(result.violations.map(v=>v.id),[]);}
  async function login(){await page.getByLabel('Kürzel oder E-Mail').fill('tesadm');await page.getByLabel('Passwort',{exact:true}).fill('test-passwort-lang');await page.locator('#auth-form [type=submit]').click();}
  await page.goto('http://127.0.0.1:4173');await page.locator('#account').click();await login();await page.getByRole('button',{name:'Authenticator einrichten',exact:true}).waitFor();assert.equal(await page.locator('#load-users').count(),0);assert.ok(!calls.includes('admin-list'));
  await page.getByRole('button',{name:'Authenticator einrichten',exact:true}).click();await page.getByLabel('Authenticator-Code').waitFor();await audit();
  assert.equal(await page.locator('#mfa-secret').textContent(),'SYNTHETIC-SETUP-ONLY');assert.equal(await page.locator('#admin svg').count(),0);assert.match(await page.locator('#mfa-qr').getAttribute('src'),/^data:image\/svg\+xml/);
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('#auth').isVisible(),false,'Kontodialog und Einrichtungsschlüssel nicht drucken');await page.emulateMedia({media:'screen'});
  // [Claude, 2026-10-17] Wait up to 5 s for layout to settle (QR image); a persistent overflow still fails. See VERIFICATION.md.
  await until(page,()=>document.querySelector('#auth').scrollWidth<=document.querySelector('#auth').clientWidth+1,'Kontodialog läuft seitlich über');
  await page.getByLabel('Authenticator-Code').fill('12345');await page.getByRole('button',{name:'Anmeldung bestätigen'}).click();assert.equal(calls.filter(x=>x==='mfa-verify').length,0);
  await page.getByLabel('Authenticator-Code').fill('000000');await page.getByRole('button',{name:'Anmeldung bestätigen'}).click();await page.locator('#auth-status').filter({hasText:'ungültig oder abgelaufen'}).waitFor();assert.equal(await page.locator('#load-users').count(),0);
  await page.getByLabel('Authenticator-Code').fill('123456');await page.getByRole('button',{name:'Anmeldung bestätigen'}).click();await page.locator('#load-users').waitFor();assert.equal(await page.locator('#mfa-secret').count(),0);assert.equal(await page.locator('#mfa-qr').count(),0);
  await page.locator('#load-users').click();await page.locator('#auth-status').filter({hasText:'0 Konten angezeigt.'}).waitFor();
  await page.getByRole('button',{name:'Abmelden',exact:true}).click();await login();await page.getByLabel('Authenticator-Code').waitFor();assert.equal(await page.locator('#enroll-mfa').count(),0);await audit();
  await page.locator('#auth [data-close]').click();await until(page,()=>document.querySelector('#admin')?.textContent==='','Admininhalt nach dem Schließen nicht entfernt');
  await page.locator('#account').click();await page.getByLabel('Authenticator-Code').waitFor();assert.equal(await page.locator('#load-users').count(),0);
  assert.deepEqual(await page.evaluate(()=>[localStorage.length,sessionStorage.length]),[0,0]);assert.deepEqual(errors,[]);
  console.log('MFA-Oberfläche bestanden: Einrichtung, sichere QR-Darstellung, lokale Validierung, falscher Code, Freigabe, erneute MFA nach Anmeldung, Entfernen des Schlüssels, Mobilansicht, kein Speicher-/CSP-/JS-Fehler'+(process.env.STARTLAB_AXE?', axe ohne Verstöße.':'.'));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
