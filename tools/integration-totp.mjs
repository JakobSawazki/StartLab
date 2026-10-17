// Test driver only. Production OTP validation is performed by Supabase Auth.
import {createHmac} from 'node:crypto';
export function totp(secret,at=Date.now()){
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';let bits='';
 for(const c of secret.replace(/=+$/,'').toUpperCase()){const n=alphabet.indexOf(c);if(n<0)throw Error('Ungültiger Testfaktor.');bits+=n.toString(2).padStart(5,'0');}
 const bytes=[];for(let i=0;i+8<=bits.length;i+=8)bytes.push(parseInt(bits.slice(i,i+8),2));
 const counter=Buffer.alloc(8);counter.writeBigUInt64BE(BigInt(Math.floor(at/30000)));
 const mac=createHmac('sha1',Buffer.from(bytes)).update(counter).digest(),offset=mac[mac.length-1]&15;
 return ((mac.readUInt32BE(offset)&0x7fffffff)%1000000).toString().padStart(6,'0');
}
