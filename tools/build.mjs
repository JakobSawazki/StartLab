import {mkdir,copyFile} from 'node:fs/promises';
const out=new URL('../dist/',import.meta.url);await mkdir(out,{recursive:true});
for(const file of ['index.html','styles.css','theme.js','app.js','auth.js','content.js','inhalte.js','ansicht.js','config.js'])await copyFile(new URL('../'+file,import.meta.url),new URL(file,out));
await copyFile(new URL('../.nojekyll',import.meta.url),new URL('.nojekyll',out));console.log('Öffentliche Website in dist/ vorbereitet.');
