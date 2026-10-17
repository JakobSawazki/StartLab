// Full Supabase integration runs only against this owned, disposable local stack.
// No hosted project, production key, real address or external SMTP is accepted.
import {mkdir,writeFile,readFile,access,cp} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {execFileSync,spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {runIntegration} from './integration-test.mjs';
export const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const workdir=join(root,'.local','integration-stack'),marker=join(workdir,'.startlab-integration-owned');
export const testConfig=`project_id = "startlab-integration"
[api]
port = 54321
[db]
port = 54322
shadow_port = 54320
major_version = 17
[db.seed]
enabled = false
[studio]
enabled = false
[inbucket]
enabled = true
port = 54324
[storage]
enabled = false
[realtime]
enabled = false
[analytics]
enabled = false
[auth]
site_url = "http://127.0.0.1:4173/"
additional_redirect_urls = ["http://127.0.0.1:4173/"]
jwt_expiry = 3600
enable_signup = true
minimum_password_length = 12
[auth.email]
enable_signup = true
enable_confirmations = true
double_confirm_changes = true
max_frequency = "1s"
[auth.rate_limit]
email_sent = 1000
sign_in_sign_ups = 1000
token_verifications = 1000
[edge_runtime]
enabled = true
policy = "per_worker"
[functions.startlab]
verify_jwt = false
`;
export function localURL(value){
 const url=new URL(value);
 if(url.protocol!=='http:'||!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||url.username||url.password)throw Error('Integration akzeptiert ausschließlich HTTP-Adressen auf Loopback.');
 return url;
}
function cli(args){
 try{return execFileSync('supabase',[...args,'--workdir',workdir],{encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:15*60*1000,maxBuffer:20*1024*1024});}
 catch(error){
  // CLI summaries can contain local keys. Never print unfiltered output.
  const safe=String(error.stderr||'').split('\n').filter(l=>/error|failed|invalid|unknown|unhealthy|fatal/i.test(l)&&!/key|secret|password|token|authorization|eyJ/i.test(l)).slice(-6).map(l=>l.slice(0,220)).join('\n');
  throw Error(`Supabase ${args[0]} fehlgeschlagen (Status ${error.status??'unbekannt'}).${safe?'\n'+safe:''}`);
 }
}
async function owned(){await access(marker);if((await readFile(marker,'utf8'))!=='StartLab disposable integration stack\n')throw Error('Testordner gehört nicht diesem Prüfwerkzeug.');}
async function prepare(){
 try{await access(workdir);await owned();}catch(error){if(error.code!=='ENOENT')throw error;try{await access(workdir);throw Error('Vorhandener Testordner ohne Besitznachweis.');}catch(inner){if(inner.code!=='ENOENT')throw inner;}}
 await mkdir(join(workdir,'supabase'),{recursive:true});await writeFile(marker,'StartLab disposable integration stack\n');
 await writeFile(join(workdir,'supabase','config.toml'),testConfig);
 for(const folder of ['migrations','functions'])await cp(join(root,'supabase',folder),join(workdir,'supabase',folder),{recursive:true});
 await writeFile(join(workdir,'runtime.env'),'SITE_ORIGIN=http://127.0.0.1:4173\nSITE_URL=http://127.0.0.1:4173/\nREGISTRATION_ENABLED=true\n');
 console.log('Isolierte Testkonfiguration und aktuelle Migrationen/Function vorbereitet.');
}
async function test(){
 await owned();const status=JSON.parse(cli(['status','--output','json']));
 const api=localURL(status.API_URL).origin,mail=localURL(status.MAILPIT_URL||status.INBUCKET_URL||'http://127.0.0.1:54324').origin;
 if(!status.ANON_KEY||!status.SERVICE_ROLE_KEY)throw Error('Lokale Testschlüssel nicht verfügbar.');
 const child=spawn('supabase',['functions','serve','startlab','--env-file',join(workdir,'runtime.env'),'--workdir',workdir],{stdio:'ignore'});
 let childError=false;child.on('error',()=>{childError=true;});
 try{
  let ready=false;
  for(let i=0;i<90;i++){
   if(childError||child.exitCode!==null)throw Error('Lokaler Function-Prozess wurde beendet.');
   try{const r=await fetch(api+'/functions/v1/startlab',{method:'OPTIONS',headers:{Origin:'http://127.0.0.1:4173'},signal:AbortSignal.timeout(2000)});if(r.status===204){ready=true;break;}}catch{}
   await new Promise(r=>setTimeout(r,1000));
  }
  if(!ready)throw Error('Lokale Edge Function wurde nicht rechtzeitig bereit.');
  await runIntegration({api,mail,anon:status.ANON_KEY,service:status.SERVICE_ROLE_KEY});
 }finally{child.kill('SIGTERM');}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const command=process.argv[2];
  if(command==='prepare')await prepare();
  else if(command==='start'){await owned();console.log('Temporären Supabase-Stack starten …');cli(['start','--exclude','studio,realtime,storage-api,imgproxy,postgres-meta,logflare,vector,supavisor']);console.log('Lokaler Stack ist bereit; Zugangsdaten bleiben im Prüfprozess.');}
  else if(command==='test')await test();
  else if(command==='stop'){await owned();cli(['stop','--no-backup']);console.log('Temporärer Stack beendet.');}
  else throw Error('Aufruf: node tools/integration-stack.mjs prepare|start|test|stop');
 }catch(error){console.error(error.message);process.exitCode=1;}
}
