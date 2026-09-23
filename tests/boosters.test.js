import test from 'node:test';
import assert from 'node:assert/strict';
import {PULSE,NOVA,rewards,blast,wave,boostersEnabled} from '../src/boosters.js';
import {matches} from '../src/match3.js';
import {iceMove,ensurePlayableBoard} from '../src/levelRules.js';

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
  assert.equal(boostersEnabled({id:'lights'}),false);
});
test('chain blasts hit each cell once, preserve holes, and only strip covered pieces',()=>{
  const board=[0,1,null,2,PULSE,NOVA,3,2,1];
  const hit=blast(board,3,[4]);assert.equal(new Set(hit).size,hit.length);assert.ok(!hit.includes(2));
  const result=wave(board,[7],{rows:3,cols:3,types:4},{activate:4,random:()=>0.3});
  assert.equal(result.board[2],null);assert.equal(result.board[7],2);
  assert.deepEqual(result.ice,[]);assert.ok(!result.collected.includes(7));
  assert.ok(!result.collected.includes(4)&&!result.collected.includes(5));
});
test('created reward is retained, not collected or fired during its creation',()=>{
  const result=wave([1,1,1,1],[],{rows:1,cols:4,types:4},{preferred:[2],random:()=>0.5});
  assert.equal(result.board[2],PULSE);assert.deepEqual(result.collected,[0,1,3]);
  const legacy=wave([1,1,1,1],[],{rows:1,cols:4,types:4},{enabled:false,random:()=>0.5});
  assert.equal(legacy.collected.length,4);assert.deepEqual(legacy.created,[]);
});
