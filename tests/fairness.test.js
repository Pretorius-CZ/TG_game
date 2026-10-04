import test from 'node:test';
import assert from 'node:assert/strict';
import {levelGroups} from '../src/levelCatalog.js';
import {goalRefillRandom} from '../src/goalRefill.js';
import {wave} from '../src/boosters.js';

test('all resonator layouts leave a full neighbouring gap and cap two rings at three covers',()=>{
 for(const r of levelGroups.flatMap(([,levels])=>levels).filter(r=>r.resonators?.length)){
  const distance=(a,b)=>Math.max(Math.abs(a%r.level.cols-b%r.level.cols),Math.abs(Math.floor(a/r.level.cols)-Math.floor(b/r.level.cols)));
  if(r.resonators.length>=2)assert.ok(r.ice.length<=3,r.id);
  for(const at of r.ice){assert.notEqual(r.level.mask?.[at],false);assert.ok(r.resonators.every(device=>distance(at,device.at)>1),r.id);assert.ok(r.ice.every(other=>other===at||distance(at,other)>1),r.id);}
 }
});
test('drought guard supplies scarce unfinished colours, including two simultaneous goals',()=>{
 const history={},level={types:6,cols:7,rows:7},goals=[{type:1,target:8},{type:2,target:8}];
 const pick=goalRefillRandom(level,goals,[0,0],Array(49).fill(0),[],[],history,()=>0);
 const draws=Array.from({length:45},()=>Math.floor(pick()*6));
 assert.ok(draws.filter(t=>t===1).length>=2);assert.ok(draws.filter(t=>t===2).length>=2);
 assert.deepEqual(draws.slice(0,2),[1,2]);
});
test('covered and removed target pieces do not hide a missing colour',()=>{
 const level={types:6,cols:7,rows:7},board=Array(49).fill(0);board[0]=2;board[1]=2;
 const pick=goalRefillRandom(level,[{type:2,target:8}],[0],board,[0],[1],{},()=>0);
 assert.equal(Math.floor(pick()*6),2);
});
test('one or two target pieces receive another within seven new spawns across waves',()=>{
 const level={types:6,cols:7,rows:7},goal=[{type:2,target:8}],history={},board=Array(49).fill(0);board[0]=2;
 let pick=goalRefillRandom(level,goal,[0],board,[],[],history,()=>0);
 assert.deepEqual(Array.from({length:3},()=>Math.floor(pick()*6)),[0,0,0]);
 pick=goalRefillRandom(level,goal,[0],board,[],[],history,()=>0);
 assert.deepEqual(Array.from({length:4},()=>Math.floor(pick()*6)),[0,0,0,2]);
});
test('completed goals and plentiful colours keep uniform generation',()=>{
 const level={types:6,cols:7,rows:7},goal=[{type:1,target:8}];
 for(const [counts,board] of [[[8],Array(49).fill(0)],[[0],Array(49).fill(1)]]){
  const pick=goalRefillRandom(level,goal,counts,board,[],[],{1:99},()=>0.4);
  assert.equal(Math.floor(pick()*6),2);
 }
});
test('refill callback sees collected original colours and preserves charge creation',()=>{
 const board=[0,0,0,0,1,2,1,2,2,1,2,1,1,2,1,2],level={cols:4,rows:4,types:3};
 let collected;
 const result=wave(board,[],level,{preferred:[2],refillRandom:cells=>{collected=cells;return ()=>0.5;}});
 assert.deepEqual(collected,[0,1,2,3]);assert.equal(result.board[2],10);assert.equal(result.collected.length,4);
});
