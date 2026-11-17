import test from 'node:test';
import assert from 'node:assert/strict';
import {createNarrator,formatTime} from '../dist/companion-narrator.js';

class Control extends EventTarget {value='';textContent='';dataset={kind:'listen'};open=true;change(value,type='change'){this.value=value;this.dispatchEvent(new Event(type));}}
class Player extends EventTarget {
 currentTime=0;duration=70;ended=false;plays=0;pauses=0;defer=false;
 constructor(src){super();this.src=src;}
 async play(){this.plays++;if(this.defer)await new Promise(resolve=>this.resolve=resolve);this.dispatchEvent(new Event('playing'));}
 pause(){this.pauses++;this.dispatchEvent(new Event('pause'));}
 removeAttribute(name){if(name==='src')this.src='';}load(){}
}
function setup(){
 const controls=Object.fromEntries(['dialog','narration-seek','narration-elapsed','narration-duration','voice-source','voice-speed','voice-volume','narration-hint'].map(id=>['#'+id,new Control()]));
 const root=new EventTarget();root.querySelector=id=>controls[id];const players=[],states=[];
 const speech={cancel(){},pause(){},resume(){},getVoices(){return[];},speak(u){this.last=u;u.onstart();}};
 const n=createNarrator({root,speech,createUtterance:text=>({text}),createAudio:src=>{const a=new Player(src);players.push(a);return a;},onState:(state,message)=>states.push({state,message})});
 n.bind();n.select({id:'ordinary',text:'Chuyện nhỏ.'});return {n,players,states,controls,root,speech};
}
test('selecting a story does not autoplay; pause/resume preserves position and stop allows replay',async()=>{
 const {n,players}=setup();assert.equal(players[0].plays,0);await n.toggle();assert.equal(n.status,'playing');players[0].currentTime=25;n.pause();assert.equal(n.status,'paused');await n.toggle();assert.equal(players[0].currentTime,25);n.stop();assert.equal(n.status,'idle');await n.toggle();assert.equal(players.length,2);assert.equal(n.status,'playing');assert.equal(players[1].currentTime,0);n.stop();
});
test('changing stories cancels old playback and ignores stale media events',async()=>{
 const {n,players}=setup();players[0].defer=true;const pending=n.toggle();n.select({id:'photo',text:'Chuyện mới.'});await n.toggle();players[0].resolve();await pending;players[0].dispatchEvent(new Event('ended'));players[0].dispatchEvent(new Event('error'));assert.equal(n.status,'playing');assert.equal(players[1].plays,1);assert.equal(players[0].src,'');n.stop();
});
test('pause while audio is loading cannot start late playback',async()=>{
 const {n,players}=setup();const p=players[0];p.defer=true;const pending=n.toggle();n.pause();p.resolve();await pending;assert.equal(n.status,'paused');assert.ok(p.pauses>0);n.stop();
});
test('a late play promise cannot pause a newer resume request on the same player',async()=>{
 const {n,players}=setup();const p=players[0];p.defer=true;const first=n.toggle(),resolveFirst=p.resolve;n.pause();const second=n.toggle(),resolveSecond=p.resolve;resolveSecond();await second;const pauses=p.pauses;resolveFirst();await first;assert.equal(n.status,'playing');assert.equal(p.pauses,pauses);n.stop();
});
test('recorded speed, seeking and volume update the player without restarting',async()=>{
 const {n,players,controls}=setup();await n.toggle();controls['#voice-speed'].change('1.1');controls['#voice-volume'].change('.3','input');controls['#narration-seek'].change('31','input');assert.equal(players[0].playbackRate,1.1);assert.equal(players[0].volume,.3);assert.equal(players[0].currentTime,31);assert.equal(players[0].plays,1);assert.equal(controls['#narration-elapsed'].textContent,'0:31');n.stop();
});
test('source change is explicit and silent until play; hidden tabs pause narration',async()=>{
 const {n,controls,root,speech}=setup();await n.toggle();controls['#voice-source'].change('device');assert.equal(n.mode,'device');assert.equal(n.status,'idle');assert.equal(speech.last,undefined);assert.equal(controls['#narration-seek'].disabled,true);await n.toggle();assert.equal(n.status,'playing');root.hidden=true;root.dispatchEvent(new Event('visibilitychange'));assert.equal(n.status,'paused');n.stop();
});
test('media errors are visible and do not silently select a different voice',()=>{
 const {n,players,states}=setup();players[0].dispatchEvent(new Event('error'));assert.equal(n.status,'error');assert.equal(n.mode,'recorded');assert.match(states.at(-1).message,/Chưa mở/);n.stop();
});
test('time labels tolerate unknown audio metadata',()=>{assert.equal(formatTime(Infinity),'0:00');assert.equal(formatTime(NaN),'0:00');assert.equal(formatTime(-20),'0:00');assert.equal(formatTime(72.9),'1:12');});
