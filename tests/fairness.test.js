import test from 'node:test';
import assert from 'node:assert/strict';
import {levelGroups} from '../src/levelCatalog.js';
import {goalRefillRandom,makeGoalBoard,hasGoalMove} from '../src/goalRefill.js';
import {engineRepairs} from '../src/engineRepairs.js';
import {goalsFor} from '../src/objectives.js';
import {initialIce,iceMove} from '../src/levelRules.js';
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
test('one or two target pieces receive another within three new spawns across waves',()=>{
 const level={types:6,cols:7,rows:7},goal=[{type:2,target:8}],history={},board=Array(49).fill(0);board[0]=2;
 let pick=goalRefillRandom(level,goal,[0],board,[],[],history,()=>0);
 assert.deepEqual(Array.from({length:2},()=>Math.floor(pick()*6)),[0,0]);
 pick=goalRefillRandom(level,goal,[0],board,[],[],history,()=>0);
 assert.equal(Math.floor(pick()*6),2);
});

test('three goal crystals cannot wait eighteen spawns and scarce stock is replenished',()=>{
 const level={types:6,cols:7,rows:8},board=Array(56).fill(0);board[0]=board[1]=board[2]=1;
 const pick=goalRefillRandom(level,[{type:1,target:22}],[0],board,[],[],{},()=>0);
 const draws=Array.from({length:9},()=>Math.floor(pick()*6));
 assert.equal(draws[2],1);
});

test('scattered goal pieces are distinguished from an accessible goal match',()=>{
 const board=[1,0,1,2,0,1,2,0,2,2,0,1,0,1,2,2];
 assert.equal(hasGoalMove(board,4,[],1),true);
 assert.equal(hasGoalMove(board,4,[1,5],1),false);
 const scattered=Array.from({length:49},(_,i)=>i%3);
 scattered[0]=scattered[24]=scattered[48]=3;
 assert.equal(hasGoalMove(scattered,7,[],3),false);
 const pick=goalRefillRandom({cols:7,rows:7,types:6},[{type:3,target:20}],[0],scattered,[],[],{},()=>0);
 assert.equal(Math.floor(pick()*6),0);assert.equal(Math.floor(pick()*6),0);assert.equal(Math.floor(pick()*6),3);
});

test('beating heart opens with enough usable crystals and a playable board',()=>{
 const repair=engineRepairs.find(r=>r.id==='engine-power'),covers=initialIce(repair);
 let seed=812;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 for(let n=0;n<40;n++){
  const board=makeGoalBoard(repair.level,goalsFor(repair),covers,random);
  assert.ok(board.filter((v,i)=>v===1&&!covers.includes(i)).length>=6);
  assert.ok(iceMove(board,repair.level.cols,covers));
 }
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
