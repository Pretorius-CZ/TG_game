import test from 'node:test';
import assert from 'node:assert/strict';
import {PULSE,NOVA,rewards,blast,wave,boostersEnabled,awardCascadePulse} from '../src/boosters.js';

test('three subsequent cascades award one untriggered Pulse on an ordinary uncovered tile',()=>{
 const board=[null,NOVA,PULSE,1,2,3],ice=[3];
 for(const cascades of [0,1,2])assert.equal(awardCascadePulse(board,ice,{cascades}).at,null);
 const result=awardCascadePulse(board,ice,{cascades:3,preferred:[0,1,2,3,4]});
 assert.equal(result.at,4);assert.deepEqual(result.board,[null,NOVA,PULSE,1,PULSE,3]);assert.equal(board[4],2);
 assert.equal(awardCascadePulse(result.board,ice,{cascades:10,used:true}).at,null);
 assert.equal(awardCascadePulse(board,ice,{cascades:10,enabled:false}).at,null);
 assert.equal(awardCascadePulse([null,NOVA,PULSE,1],[3],{cascades:3}).at,null);
 assert.equal(awardCascadePulse(board,ice,{cascades:10}).board.filter(v=>v===PULSE).length,2);
 assert.deepEqual(matches(result.board,6),[]);
});
import {matches,swap,refill} from '../src/match3.js';
import {collectGoals} from '../src/objectives.js';
import {iceMove,swapMatches,ensurePlayableBoard} from '../src/levelRules.js';

test('charges swap only when the opposing ordinary tile joins a match',()=>{
 for(const charge of [PULSE,NOVA]){
  const board=[0,0,charge,0,1,2];
  assert.deepEqual(swapMatches(board,2,3,6),[0,1,2]);
  assert.deepEqual(swapMatches(board,3,2,6),[0,1,2]);
  assert.deepEqual(swapMatches(board,1,2,6),[]);
  assert.deepEqual(swapMatches(board,2,3,6,[2]),[]);
  assert.deepEqual(swapMatches(board,2,3,6,[3]),[]);
  assert.deepEqual(swapMatches([0,0,charge,null],2,3,4),[]);
  assert.deepEqual(swapMatches([0,0,charge,NOVA],2,3,4),[]);
  // A pre-existing remote match does not legalize moving the charge.
  assert.deepEqual(swapMatches([1,1,1,2,charge,3],4,5,6),[]);
  const result=wave(swap(board,2,3),[],{rows:1,cols:6,types:4},{random:()=>0.7});
  assert.equal(result.board[3],charge);
  assert.ok(!result.hit.includes(3));
 }
});

test('four, five and T matches create one reward, preferring the swapped cell',()=>{
  assert.deepEqual(rewards([1,1,1,1,2],5,[],[2]),[{at:2,type:PULSE}]);
  assert.deepEqual(rewards([1,1,1,1,1],5),[{at:0,type:NOVA}]);
  assert.deepEqual(rewards([1,1,1,2,1,2,2,1,2],3),[{at:1,type:PULSE}]);
  assert.deepEqual(rewards([1,1,1,1],4,[0,1,2,3]),[]);
});
test('charges do not match by color and are a legal action on an otherwise dead board',()=>{
  const board=[PULSE,PULSE,PULSE];
  assert.deepEqual(matches(board,3),[]);
  assert.deepEqual(iceMove(board,3),[0,0]);
  assert.equal(ensurePlayableBoard(board,{rows:1,cols:3,types:4}).reshuffled,false);
  assert.equal(boostersEnabled({id:'lights'}),true);
});
test('chain blasts hit each cell once, preserve holes, and only strip covered pieces',()=>{
  const board=[0,1,null,2,PULSE,NOVA,3,2,1];
  const hit=blast(board,3,[4]);assert.equal(new Set(hit).size,hit.length);assert.ok(!hit.includes(2));
  const result=wave(board,[7],{rows:3,cols:3,types:4},{activate:4,random:()=>0.3});
  assert.equal(result.board[2],null);assert.equal(result.board[7],2);
  assert.deepEqual(result.ice,[]);assert.ok(!result.collected.includes(7));
  assert.ok(!result.collected.includes(4)&&!result.collected.includes(5));
});
test('created reward counts its original color and is retained without firing',()=>{
  const result=wave([1,1,1,1],[],{rows:1,cols:4,types:4},{preferred:[2],random:()=>0.5});
  assert.equal(result.board[2],PULSE);assert.deepEqual(result.collected,[0,1,2,3]);
  const legacy=wave([1,1,1,1],[],{rows:1,cols:4,types:4},{enabled:false,random:()=>0.5});
  assert.equal(legacy.collected.length,4);assert.deepEqual(legacy.created,[]);
});

test('helper hits strip covers without collecting protected tiles or creating match rewards',()=>{
 const board=[0,1,2,1,2,0,2,0,1];
 const level={rows:3,cols:3,types:3};
 const result=wave(board,[4],level,{hit:[3,4,5],random:()=>.2});
 assert.deepEqual(result.hit,[3,4,5]);
 assert.deepEqual(result.collected,[3,5]);
 assert.deepEqual(result.ice,[]);
 assert.deepEqual(result.created,[]);
 assert.equal(result.board.length,9);
});

test('a vertical four counts all colors and pins the charge at the swapped match cell',()=>{
 const board=[0,1,2,3, 3,2,1,0, 2,1,0,3, 0,1,3,2];
 const next=swap(board,6,5),level={rows:4,cols:4,types:4};
 for(const preferred of [[5,6],[6,5]]){
  const result=wave(next,[],level,{preferred,random:()=>.6});
  assert.deepEqual(result.created,[{at:5,type:PULSE}]);
  assert.equal(result.board[5],PULSE);
  assert.deepEqual(result.collected,[1,5,9,13]);
  assert.deepEqual(collectGoals([{type:1,target:25},{type:null,target:25}],[0,0],next,result.collected),[4,4]);
  // Once created, the charge obeys normal gravity on later waves.
  assert.equal(refill(result.board,[9,13],level,()=>.6)[13],PULSE);
 }
});

test('five and intersecting matches count the reward color once while covered colors stay uncollected',()=>{
 const result=wave([1,1,1,1,1],[0],{rows:1,cols:5,types:4},{preferred:[2],random:()=>.6});
 assert.equal(result.board[2],NOVA);
 assert.deepEqual(result.collected,[1,2,3,4]);
 assert.deepEqual(result.ice,[]);
 const intersect=wave([1,1,1,2,1,2,2,1,2],[],{rows:3,cols:3,types:4},{preferred:[1],random:()=>.6});
 assert.equal(intersect.board[1],PULSE);
 assert.equal(intersect.collected.length,5);
 assert.equal(new Set(intersect.collected).size,5);
});
