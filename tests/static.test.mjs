import test from 'node:test';
import assert from 'node:assert/strict';
import {assetResponse} from '../server/static.js';
const bytes=new Uint8Array([0,1,2,3,4,5,6,7,8,9]);
const request=(range,method='GET')=>new Request('https://game.test/story.mp3',{method,headers:range?{range}:{}});
test('audio ranges return the exact requested bytes and headers',async()=>{
 const r=assetResponse(request('bytes=2-5'),bytes,'audio/mpeg');assert.equal(r.status,206);assert.equal(r.headers.get('content-range'),'bytes 2-5/10');assert.equal(r.headers.get('content-length'),'4');assert.equal(r.headers.get('content-type'),'audio/mpeg');assert.deepEqual([...new Uint8Array(await r.arrayBuffer())],[2,3,4,5]);
});
test('suffix, open-ended and oversized end ranges work',async()=>{
 for(const [range,expected] of [['bytes=-3',[7,8,9]],['bytes=8-',[8,9]],['bytes=8-99',[8,9]],['bytes=-99',[0,1,2,3,4,5,6,7,8,9]]]){const r=assetResponse(request(range),bytes,'audio/mpeg');assert.equal(r.status,206);assert.deepEqual([...new Uint8Array(await r.arrayBuffer())],expected);}
});
test('unsatisfiable and empty suffix ranges report 416',()=>{
 for(const range of ['bytes=10-','bytes=8-3','bytes=-0']){const r=assetResponse(request(range),bytes,'audio/mpeg');assert.equal(r.status,416);assert.equal(r.headers.get('content-range'),'bytes */10');}
});
test('HEAD is bodyless and unsupported range formats receive a full response',async()=>{
 const head=assetResponse(request('bytes=0-2','HEAD'),bytes,'audio/mpeg');assert.equal(head.status,200);assert.equal(head.headers.get('content-length'),'10');assert.equal((await head.arrayBuffer()).byteLength,0);
 for(const range of ['bytes=1-2,4-5','invalid','bytes=-']){const r=assetResponse(request(range),bytes,'audio/mpeg');assert.equal(r.status,200);assert.equal((await r.arrayBuffer()).byteLength,10);}
 assert.equal(assetResponse(request(null,'POST'),bytes,'audio/mpeg').status,405);
});
