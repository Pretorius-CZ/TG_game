import test from 'node:test';import assert from 'node:assert/strict';
import {iceMatches,iceMove,resolveIce,makeIceBoard,finaleRepair,moveBudget} from '../src/levelRules.js';
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
