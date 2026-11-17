import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const files=['index.html','companion.js','companion-narrator.js','companion-show.js','companion-show.css','companion-plus.js','companion-engine.js','companion.css','companion-plus.css','assets/cloud-garden.png','assets/rain-room.png','assets/sun.svg','assets/narration/manifest.json',...['ordinary','curiosity','table','photo'].map(id=>`assets/narration/${id}.mp3`),'assets/fonts/BeVietnamPro-Regular.ttf'];
const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',png:'image/png',svg:'image/svg+xml',ttf:'font/ttf',mp3:'audio/mpeg',json:'application/json; charset=utf-8'};
const assets={};for(const file of files){const b=await readFile(resolve(root,'dist',file));assets['/'+file]={type:types[file.split('.').at(-1)],data:b.toString('base64')};}
const engine=await readFile(resolve(root,'dist/companion-engine.js'),'utf8');
const api=(await readFile(resolve(root,'server/chat-api.js'),'utf8')).replace(/^import .*?;\r?\n/gm,'');
const staticHelper=await readFile(resolve(root,'server/static.js'),'utf8');
const worker=(await readFile(resolve(root,'server/worker.js'),'utf8')).replace(/^import .*?;\r?\n/gm,'');
await mkdir(resolve(root,'dist/server'),{recursive:true});
await writeFile(resolve(root,'dist/server/index.js'),`const ASSET_TABLE=${JSON.stringify(assets)};\n${engine}\n${api}\n${staticHelper}\n${worker}`);
console.log(`Built Worker with ${files.length} embedded assets; no runtime secrets in bundle.`);
