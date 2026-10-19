import test from 'node:test';
import assert from 'node:assert/strict';
import {matches,swap} from '../src/match3.js';
import {chargeResonators,resonatorMatchGroups} from '../src/resonators.js';
const boardFor=runs=>{const board=Array(49).fill(null);for(const [cells,type]of runs)for(const at of cells)board[at]=type;return board;};
test('two independent matches charge a shared ring twice in one wave',()=>{
 for(const type of [0,1]){
  const board=boardFor([[[15,16,17],0],[[29,30,31],type]]),hit=matches(board,7);
  assert.equal(resonatorMatchGroups(hit,7,board).length,2);
  assert.deepEqual(chargeResonators([{at:24,target:4},{at:18,target:4}],[0,0],hit,7,board),[2,1]);
  assert.deepEqual(chargeResonators([{at:24,target:4}],[3],hit,7,board),[4]);
 }
});
test('intersecting runs form one combination even when several tiles touch a ring',()=>{
 const board=boardFor([[[15,16,17],0],[[16,23,30],0]]),hit=matches(board,7);
 assert.equal(resonatorMatchGroups(hit,7,board).length,1);
 assert.deepEqual(chargeResonators([{at:24,target:4}],[0],hit,7,board),[1]);
 // A later cascade of the same shape is a new impulse, not a duplicate.
 assert.deepEqual(chargeResonators([{at:24,target:4}],[1],hit,7,board),[2]);
});
test('touching parallel runs remain distinct; colours, holes, blasts and diagonals do not merge them',()=>{
 for(const type of [0,1]){
  const board=[0,0,0,type,type,type];assert.equal(resonatorMatchGroups(matches(board,3),3,board).length,2);
 }
 const board=boardFor([[[8,9,10],0]]);
 assert.deepEqual(chargeResonators([{at:24,target:4}],[0],matches(board,7),7,board),[0]);
 assert.deepEqual(chargeResonators([{at:24,target:4}],[0],[],7,board),[0]);
 board[17]=10;assert.deepEqual(chargeResonators([{at:24,target:4}],[0],[17],7,board),[0]);
});
test('one legal swap creates two simultaneous impulses before any refill',()=>{
 const board=Array.from({length:64},(_,i)=>(Math.floor(i/8)+2*(i%8))%6);
 for(const [i,type]of [[18,1],[19,0],[20,0],[21,3],[24,1],[25,1],[26,0],[27,null]])board[i]=type;
 assert.deepEqual(matches(board,8),[]);
 const next=swap(board,18,26),hit=matches(next,8);
 assert.deepEqual(chargeResonators([{at:27,target:3}],[0],hit,8,next),[2]);
});
