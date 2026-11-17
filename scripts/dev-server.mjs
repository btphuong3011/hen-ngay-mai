import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {Readable} from 'node:stream';
import {createChatApi} from '../server/chat-api.js';
const root=resolve(import.meta.dirname,'../dist');let env={LOCAL_DEV:'1'};
try{for(const line of (await readFile(resolve(import.meta.dirname,'../.env.local'),'utf8')).split(/\r?\n/)){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m&&m[2].trim())env[m[1]]=m[2].trim().replace(/^(['"])(.*)\1$/,'$2');}}catch{}
env.AI_PROVIDER='gemini';const api=createChatApi();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf'};
http.createServer(async(req,res)=>{
 try{const url=new URL(req.url,'http://127.0.0.1:4183');
  if(url.pathname.startsWith('/api/')){const request=new Request(url,{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Readable.toWeb(req),duplex:'half'}:{})});const response=await api(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;}
  const file=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  const bytes=await readFile(file);res.writeHead(200,{'content-type':types[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(4183,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4183/ (API keys stay server-side)'));
