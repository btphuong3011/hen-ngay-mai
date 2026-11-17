// Offline authoring tool. It reads the local secret directly and never prints it.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {TRACKS} from '../dist/companion-engine.js';
const root=resolve(import.meta.dirname,'..'),env={};
for(const line of (await readFile(resolve(root,'.env.local'),'utf8')).split(/\r?\n/)){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m)env[m[1]]=m[2].trim();}
if(!env.GEMINI_API_KEY)throw new Error('Local Gemini key is missing.');
const model=process.env.NARRATION_MODEL||'gemini-3.8-flash-lite-tts',voice='Sulafat';
const out=resolve(root,'../audio-masters-v4');await mkdir(out,{recursive:true});
const ids=process.argv.slice(2),tracks=ids.length?TRACKS.filter(t=>ids.includes(t.id)):TRACKS;
for(const track of tracks){
 const sentences=track.text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)||[track.text];
 const n=Math.ceil(sentences.length/3),chunks=[sentences.slice(0,n).join(''),sentences.slice(n,2*n).join(''),sentences.slice(2*n).join('')].filter(Boolean);
 const styles=['Warm, clear Vietnamese storytelling. Conversational pace with natural variation. Begin with gentle curiosity, smile lightly at everyday details. Do not sound breathy, sleepy, melodramatic or like an advertisement. Do not imitate any real person.','Same narrator and Vietnamese accent. Make the small scene vivid: lightly animated and a little playful during dialogue, then settle. Vary phrasing, pause briefly after meaningful sentences. No exaggerated sadness.','Same narrator and Vietnamese accent. Land the story thoughtfully, slower and grounded, without a motivational speech or forced cheer. Let the final question breathe; avoid drawing out every word.'];
 const body={model,input:[{type:'user_input',content:chunks.map((text,i)=>({type:'text',text:text.trim()+(i<chunks.length-1?' <short pause>':''),annotations:[{type:'speech_metadata',style:styles[i]}]}))}],response_format:{type:'audio',mime_type:'audio/wav'},generation_config:{speech_config:[{voice}]}};
 const response=await fetch('https://generativelanguage.googleapis.com/v1beta/interactions',{method:'POST',headers:{'x-goog-api-key':env.GEMINI_API_KEY,'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(100000)});
 const data=await response.json();
 if(!response.ok){const message=String(data.error?.message||'Provider error').replaceAll(env.GEMINI_API_KEY,'[REDACTED]').replace(/[A-Za-z0-9_-]{30,}/g,'[REDACTED]').slice(0,300);console.log(JSON.stringify({id:track.id,status:response.status,error:message}));process.exitCode=1;break;}
 const pieces=(data.steps||[]).filter(s=>s.type==='model_output').flatMap(s=>s.content||[]).filter(c=>c.type==='audio'&&c.data);
 const piece=pieces.at(-1)||data.output_audio;
 if(!piece?.data)throw new Error(`No audio for ${track.id}.`);
 const bytes=Buffer.from(piece.data,'base64');
 if(bytes.subarray(0,4).toString()!=='RIFF')throw new Error('Expected a WAV container; no output overwritten.');
 await writeFile(resolve(out,`${track.id}.wav`),bytes);
 await writeFile(resolve(out,`${track.id}.json`),JSON.stringify({model,voice,aiGenerated:true,title:track.title,text:track.text,styles,source:'Original project story; no voice reference sample used.'},null,2));
 console.log(JSON.stringify({id:track.id,model,voice,bytes:bytes.length,file:`audio-masters-v4/${track.id}.wav`}));
}
