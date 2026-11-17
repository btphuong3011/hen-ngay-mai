import {createChatApi} from './chat-api.js';
const api=createChatApi();
// ASSET_TABLE is inserted by scripts/build-worker.mjs; secrets are never bundled.
export default {async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname.startsWith('/api/'))return api(request,env);
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
  const key=url.pathname==='/'?'/index.html':url.pathname;
  const file=Object.hasOwn(ASSET_TABLE,key)?ASSET_TABLE[key]:null;
  if(!file)return new Response('Not found',{status:404});
  const bytes=Uint8Array.from(atob(file.data),c=>c.charCodeAt(0));
  return new Response(request.method==='HEAD'?null:bytes,{headers:{'content-type':file.type,'cache-control':'no-cache','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"}});
}};
