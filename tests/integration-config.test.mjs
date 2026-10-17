import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {localURL,testConfig} from '../tools/integration-stack.mjs';
test('Integration verweigert gehostete Ziele und eingebettete Zugangsdaten [Codex]',()=>{
 for(const value of ['https://127.0.0.1:54321','https://example.supabase.co','http://127.0.0.1.evil.test','http://user:pass@127.0.0.1:54321','http://10.0.0.1'])assert.throws(()=>localURL(value));
 assert.equal(localURL('http://127.0.0.1:54321').origin,'http://127.0.0.1:54321');
});
test('Nur isolierte Testkonfiguration öffnet Registrierung und fängt Bestätigungsmails lokal ab [Codex]',async()=>{
 const production=await readFile(new URL('../supabase/config.toml',import.meta.url),'utf8');
 assert.match(production,/^project_id = "startlab"$/m);assert.match(production,/^enable_signup = false$/m);assert.match(testConfig,/project_id = "startlab-integration"/);assert.match(testConfig,/enable_confirmations = true/);for(const config of [production,testConfig])assert.match(config,/\[auth\.mfa\.totp\]\s+enroll_enabled = true\s+verify_enabled = true/);assert.doesNotMatch(testConfig,/smtp\.host|supabase\.co|github\.io/);
});
