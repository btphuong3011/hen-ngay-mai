import {readFile} from 'node:fs/promises';
const lines=(await readFile(new URL('../.env.local',import.meta.url),'utf8')).split(/\r?\n/),env={};
for(const line of lines){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m)env[m[1]]=m[2].trim();}
if(!env.GEMINI_API_KEY)throw new Error('No local key configured.');
const generate=process.argv.includes('--generate');
const response=await fetch(generate?`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL)}:generateContent`:'https://generativelanguage.googleapis.com/v1beta/models',{method:generate?'POST':'GET',headers:{'x-goog-api-key':env.GEMINI_API_KEY,'content-type':'application/json'},...(generate?{body:JSON.stringify({contents:[{role:'user',parts:[{text:'Trả lời bằng tiếng Việt: chào bạn.'}]}],generationConfig:{maxOutputTokens:100}})}:{}),signal:AbortSignal.timeout(20000)});
const data=await response.json();
const clean=t=>String(t||'').replaceAll(env.GEMINI_API_KEY,'[REDACTED]').replace(/[A-Za-z0-9_-]{30,}/g,'[REDACTED]').slice(0,400);
console.log(JSON.stringify({status:response.status,errorCode:data.error?.status,error:clean(data.error?.message),configuredModel:env.GEMINI_MODEL,models:data.models?.filter(m=>m.supportedGenerationMethods?.includes('generateContent')&&/flash/.test(m.name)).map(m=>m.name).slice(0,20)}));
