// [Codex, 2026-10-17] Deferred mock responses exercise view/session changes.
// No real backend, email or account is contacted.
const {chromium}=require(process.env.STARTLAB_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const api='https://startlab-race-test.supabase.co/functions/v1/startlab';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const context=await browser.newContext();const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));let loginNumber=0;const pending=new Map(),calls=[];
  function pause(action,result,status=200){let ready,release;const started=new Promise(r=>ready=r),gate=new Promise(r=>release=r);pending.set(action,{ready,gate,result,status});return {started,release};}
  await context.route('**/config.js',r=>r.fulfill({contentType:'text/javascript',body:`export const config=Object.freeze({apiUrl:'${api}'});`}));
  await context.route(api,async route=>{
   const body=JSON.parse(route.request().postData());calls.push({action:body.action,authorization:route.request().headers().authorization});
   let data={message:'Abgemeldet.'},status=200;const delayed=pending.get(body.action);
   if(delayed){pending.delete(body.action);delayed.ready();await delayed.gate;data=delayed.result;status=delayed.status;}
   else if(body.action==='login')data={access_token:'token-'+(++loginNumber),expires_in:3600};
   else if(body.action==='profile')data={first_name:'Test',last_name:'Admin',username:'tesadm',is_admin:true};
   else if(body.action==='admin-list')data={users:[],has_more:false,page:0};
   await route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
  });
  const open=()=>page.locator('#account').click();
  async function login(){await page.getByLabel('Kürzel oder E-Mail').fill('tesadm');await page.getByLabel('Passwort',{exact:true}).fill('test-passwort-lang');await page.locator('#auth-form [type=submit]').click();}
  async function finish(gate){const finished=page.waitForEvent('requestfinished',{predicate:r=>r.url()===api});gate.release();await finished;await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
  await page.goto('http://127.0.0.1:4173');await open();
  const lateLogin=pause('login',{access_token:'ignored-token',expires_in:3600});
  await login();await lateLogin.started;await page.locator('#auth [data-close]').click();await open();await finish(lateLogin);
  assert.equal(await page.locator('#auth-title').textContent(),'Willkommen zurück.');assert.match(await page.locator('#account').textContent(),/Anmelden/);assert.equal(calls.filter(c=>c.action==='profile').length,0);

  const lateProfile=pause('profile',{first_name:'Alt',last_name:'Profil',username:'altpro',is_admin:true});
  await login();await lateProfile.started;await page.getByRole('button',{name:'Passwort ändern',exact:true}).click();await finish(lateProfile);
  assert.equal(await page.locator('#auth-title').textContent(),'Dein neues Passwort');assert.equal(await page.locator('#admin').count(),0);
  await page.locator('#auth [data-close]').click();await open();await page.locator('#load-users').waitFor();

  const lateList=pause('admin-list',{users:[{id:'00000000-0000-0000-0000-000000000001',username:'altkonto',first_name:'Alt',last_name:'Konto',email:'alt@example.invalid'}],page:0,has_more:false});
  await page.locator('#load-users').click();await lateList.started;assert.equal(await page.locator('#load-users').isDisabled(),true);
  await page.locator('#auth [data-close]').click();await open();await page.locator('#load-users').waitFor();await finish(lateList);
  assert.equal(await page.locator('#users tbody tr').count(),0);assert.ok(!(await page.locator('#auth-body').textContent()).includes('alt@example.invalid'));

  const oldUnauthorized=pause('admin-list',{message:'Alte Sitzung ist abgelaufen.'},401);
  await page.locator('#load-users').click();await oldUnauthorized.started;await page.getByRole('button',{name:'Abmelden',exact:true}).click();await login();await page.locator('#load-users').waitFor();
  await finish(oldUnauthorized);assert.equal(await page.locator('#auth-title').textContent(),'Dein StartLab-Konto');assert.match(await page.locator('#account').textContent(),/Mein Konto/);
  await page.locator('#load-users').click();await page.locator('#auth-status').filter({hasText:'0 Konten angezeigt.'}).waitFor();assert.equal(calls.at(-1).authorization,'Bearer token-2');
  assert.deepEqual(errors,[]);console.log('Verzögerte Kontoantworten geprüft: geschlossener Login, ersetztes Profil, alte Adminliste, alte 401 nach neuer Anmeldung; keine Datenübernahme oder JavaScript-Fehler.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
