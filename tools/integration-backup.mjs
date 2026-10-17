// Destructive round trip ONLY inside the owned disposable integration database.
// Dump contents may include Auth hashes. They stay in process memory and are
// never written to logs, files, GitHub outputs or downloadable artifacts.
import {execFileSync} from 'node:child_process';

export function restoreSQL(tables,dump){
 if(!Array.isArray(tables)||!tables.includes('auth.users')||!tables.includes('public.profiles')||!tables.every(t=>/^(auth|public)\.[a-z_][a-z0-9_]*$/.test(t)))throw Error('Unerwarteter Tabellenumfang für die isolierte Wiederherstellung.');
 if(typeof dump!=='string'||!dump.includes('COPY auth.users ')||!dump.includes('COPY public.profiles '))throw Error('Sicherung enthält nicht die erforderlichen Auth-/Profildaten.');
 // Replica mode is transaction-local: the restore must not run the new-user
 // trigger and duplicate profiles already contained in the snapshot.
 return `BEGIN;
SET LOCAL session_replication_role = replica;
TRUNCATE ${tables.join(', ')} RESTART IDENTITY CASCADE;
DO $$ BEGIN IF EXISTS(SELECT 1 FROM auth.users) OR EXISTS(SELECT 1 FROM public.profiles) THEN RAISE EXCEPTION 'Test data was not cleared'; END IF; END $$;
${dump}
COMMIT;
DO $$ BEGIN IF current_setting('session_replication_role') <> 'origin' THEN RAISE EXCEPTION 'Restore mode was not reset'; END IF; END $$;
`;
}

export async function roundTripBackup(){
 // This constant is derived from testConfig.project_id, never caller input.
 const name='supabase_db_startlab-integration';
 function docker(args,input){
  try{return execFileSync('docker',args,{input,encoding:'utf8',stdio:['pipe','pipe','pipe'],timeout:60000,maxBuffer:20*1024*1024});}
  catch{throw Error('Sicherung/Wiederherstellung im isolierten Testcontainer fehlgeschlagen. Keine Dumpdaten ausgegeben.');}
 }
 const id=docker(['inspect','--format','{{.Id}}',name]).trim();
 if(!/^[0-9a-f]{64}$/.test(id))throw Error('Isolierter Datenbankcontainer nicht eindeutig.');
 const psql=['exec','-i',id,'psql','-X','-U','postgres','-d','postgres','-v','ON_ERROR_STOP=1','-At'];
 if(docker(psql,'select current_database();').trim()!=='postgres')throw Error('Falsche Testdatenbank.');
 const tables=JSON.parse(docker(psql,"select json_agg(schemaname||'.'||tablename order by schemaname,tablename) from pg_tables where schemaname in ('auth','public');"));
 const dump=docker(['exec',id,'pg_dump','-U','postgres','-d','postgres','--data-only','--schema=auth','--schema=public','--no-owner','--no-privileges']);
 docker(psql,restoreSQL(tables,dump));
}
