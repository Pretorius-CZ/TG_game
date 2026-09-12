import test from 'node:test';
import assert from 'node:assert/strict';
import { matches, swap, adjacent, findMove, makeBoard, refill, tutorial } from '../src/match3.js';
function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }
test('horizontal matches do not wrap; intersecting matches count each cell once', () => {
 assert.deepEqual(matches([0,1,2,2,2,0],3),[]);
 assert.deepEqual(matches([0,1,0,1,1,1,0,1,0],3).sort(),[1,3,4,5,7]);
 assert.equal(adjacent(5,6,6),false);
});
test('generated boards start stable and have a legal swap across 200 seeds', () => {
 for(let seed=1;seed<=200;seed++) {
  const board=makeBoard(tutorial,rng(seed));assert.equal(matches(board,6).length,0);
  const [a,b]=findMove(board,6);assert.ok(adjacent(a,b,6));assert.ok(matches(swap(board,a,b),6).length>=3);
  assert.notDeepEqual(swap(board,a,b),board);
 }
});
test('gravity preserves order and does not cross holes', () => {
 const level={rows:5,cols:1,types:4,mask:[true,true,false,true,true]};
 const board=[0,1,null,2,3];
 assert.deepEqual(refill(board,[1,4],level,()=>.99),[3,0,null,3,2]);
 assert.deepEqual(board,[0,1,null,2,3]);
});
test('irregular mask remains intact and playable',()=>{
 const level={rows:6,cols:6,types:4,mask:Array.from({length:36},(_,i)=>![0,5,30,35,14,15].includes(i))};
 for(let seed=1;seed<=40;seed++) {
  const board=makeBoard(level,rng(seed));assert.equal(matches(board,6).length,0);assert.ok(findMove(board,6));
  level.mask.forEach((active,i)=>assert.equal(board[i]!==null,active));
 }
});