import test from 'node:test';import assert from 'node:assert/strict';
import {iceMatches,iceMove,resolveIce,makeIceBoard,finaleRepair,moveBudget} from '../src/levelRules.js';
test('gravity flows through cover cells while covers stay in place',()=>{
 const board=[0,1,2,3,4];
 const result=resolveIce(board,[4],[2],{rows:5,cols:1,types:5},()=>0.8);
 assert.deepEqual(result.board,[4,0,1,2,3]);
 assert.deepEqual(result.ice,[2]);
 assert.deepEqual(result.collected,[4]);
 assert.deepEqual(board,[0,1,2,3,4]);
});
test('breaking a cover retains its piece in the falling column and preserves holes',()=>{
 const result=resolveIce([0,1,2,null,3,4],[1,2,5],[1],{rows:6,cols:1,types:5},()=>0.8);
 assert.deepEqual(result.board,[4,0,1,null,4,3]);
 assert.deepEqual(result.ice,[]);
 assert.deepEqual(result.collected,[2,5]);
});
test('covered pieces join matching lines, lose only their cover and remain uncollected',()=>{
 const level={rows:3,cols:3,types:4},board=[0,0,0,1,2,1,2,1,2];
 assert.deepEqual(iceMatches(board,3,[1]),[0,1,2]);
 const r=resolveIce(board,[0,1,2],[1,4],level,()=>.9);
 assert.equal(r.board[1],0);assert.equal(r.board[4],2);
 assert.deepEqual(r.thawed,[1]);assert.deepEqual(r.ice,[4]);assert.deepEqual(r.collected,[0,2]);
});
test('a nearby match does not break a cover',()=>{
 const r=resolveIce([0,0,0,1,2,1,2,1,2],[0,1,2],[4],{rows:3,cols:3,types:4},()=>.9);
 assert.deepEqual(r.thawed,[]);assert.deepEqual(r.ice,[4]);
});
test('covered pieces cannot be swapped; final boards have playable starts',()=>{
 let seed=97;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(let i=0;i<100;i++){const b=makeIceBoard(finaleRepair.level,finaleRepair.ice,random);const move=iceMove(b,7,finaleRepair.ice);assert.ok(move);assert.ok(move.every(n=>!finaleRepair.ice.includes(n)));assert.deepEqual(iceMatches(b,7,finaleRepair.ice),[]);}
 assert.ok(moveBudget(finaleRepair)>0);
});
import {ensurePlayableBoard} from '../src/levelRules.js';
test('dead boards recover with and without covers and keep holes and cover positions usable',()=>{
 const level={rows:6,cols:6,types:4,mask:Array.from({length:36},(_,i)=>![0,5,30,35].includes(i))};
 const dead=level.mask.map((v,i)=>v?(Math.floor(i/6)+i%6)%4:null);
 let seed=12;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const covers of [[],[14,16,26,28]]){
  assert.equal(iceMove(dead,6,covers),null);
  const original=[...dead],saved=[...covers];
  const result=ensurePlayableBoard(dead,level,covers,random);
  assert.equal(result.reshuffled,true);assert.ok(iceMove(result.board,6,covers));
  assert.deepEqual(iceMatches(result.board,6,covers),[]);
  assert.deepEqual(dead,original);assert.deepEqual(covers,saved);
  assert.deepEqual(result.board.map(v=>v!==null),level.mask);
  covers.forEach(i=>assert.notEqual(result.board[i],null));
  assert.equal(ensurePlayableBoard(result.board,level,covers).board,result.board);
 }
});
