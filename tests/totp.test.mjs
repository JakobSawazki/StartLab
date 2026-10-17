import test from 'node:test';import assert from 'node:assert/strict';import {totp} from '../tools/integration-totp.mjs';
test('TOTP-Prüftreiber entspricht RFC-6238-SHA1-Testvektoren, auf sechs Ziffern gekürzt [Codex]',()=>{
 const secret='GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
 for(const [seconds,code] of [[59,'287082'],[1111111109,'081804'],[1111111111,'050471'],[1234567890,'005924'],[2000000000,'279037']])assert.equal(totp(secret,seconds*1000),code);
});
