import test from 'node:test';
import assert from 'node:assert/strict';
import {replyTo,normalize,nextQuote,QUOTES,restoreGarden,connectionText,TRACKS,chooseSeed,finishSeed} from '../dist/companion-engine.js';

test('urgent first-person statements receive human support instead of playful replies',()=>{
 for(const input of ['Mình muốn tự tử','Tôi không muốn sống nữa','I want to kill myself']){
  const r=replyTo(input);assert.equal(r.kind,'urgent');assert.match(r.text,/người thật/);assert.match(r.text,/cấp cứu/);
 }
});
test('clinical and medication requests do not produce a diagnosis or dosage',()=>{
 const a=replyTo('Mình bị trầm cảm phải không?'),b=replyTo('Mình nên uống thuốc gì?');
 assert.equal(a.kind,'clinical');assert.equal(b.kind,'clinical');assert.match(a.text,/không thể xác định/);
});
test('autism receives a neurodevelopmental explanation, not an isolation label',()=>{
 const r=replyTo('Mình nghĩ mình tự kỷ');assert.equal(r.kind,'neuro');assert.match(r.text,/phát triển thần kinh/);
});
test('belonging language is not confused with the Vietnamese word for medication',()=>{
 assert.notEqual(replyTo('Mình cảm thấy không thuộc về nơi này').kind,'clinical');
});
test('loneliness opens a voluntary connection to a trusted person',()=>{
 const r=replyTo('Mình cô đơn quá');assert.equal(r.kind,'connect');assert.match(r.text,/tự chọn/);
});
test('listening and reflection modes provide different responses without diagnosis',()=>{
 const a=replyTo('Hôm nay mình mệt','listen'),b=replyTo('Hôm nay mình mệt','reflect');
 assert.equal(a.kind,'support');assert.notEqual(a.text,b.text);
});
test('quotes are valid and do not repeat immediately',()=>{
 for(let last=-1;last<QUOTES.length;last++)for(const r of [0,.2,.5,.999]){const n=nextQuote(last,()=>r);assert.ok(n>=0&&n<QUOTES.length);if(last>=0)assert.notEqual(n,last);}
});
test('saved garden ignores chat and mood, clamps plants and rejects arbitrary mode names',()=>{
 const r=restoreGarden(JSON.stringify({mode:'<script>',flowers:800,chat:['private'],mood:'sad',motion:false}));
 assert.deepEqual(r,{version:3,mode:'day',flowers:6,motion:false,seed:null});
 assert.equal(restoreGarden('bad json').flowers,0);
});
test('connection drafts are user editable text, and audio scripts are fixed authored content',()=>{
 assert.match(connectionText('urgent'),/ở cùng/);assert.match(connectionText(),/lắng nghe/);
 assert.equal(TRACKS.length,4);assert.ok(TRACKS.every(t=>t.text.length>300&&t.text.length<2500));
});
test('normalization supports Vietnamese and empty input remains a gentle optional invitation',()=>{
 assert.equal(normalize('Đang MỆT'),'dang met');assert.equal(replyTo(' ').kind,'empty');
});
test('choosing a seed does not grant a flower; completion only counts once',()=>{
 const initial=restoreGarden(null),seed=chooseSeed(initial,'water');
 assert.equal(seed.flowers,0);assert.equal(seed.seed,'water');
 const done=finishSeed(seed);assert.equal(done.flowers,1);assert.equal(done.seed,null);assert.equal(finishSeed(done),done);
 assert.equal(chooseSeed(initial,'arbitrary'),initial);
 assert.equal(restoreGarden(JSON.stringify(seed)).seed,'water');
});
