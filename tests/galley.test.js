import test from 'node:test';
import assert from 'node:assert/strict';
import {galleyRepairs,galleyLogs} from '../src/galleyRepairs.js';
import {makeBoard,matches,findMove,swap,refill} from '../src/match3.js';
test('galley fifth and sixth tile boards are playable and refill valid types',()=>{
 let seed=39;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 galleyRepairs.forEach((repair,i)=>{assert.equal(galleyLogs[i].repair,repair.id);for(let n=0;n<100;n++){
  const board=makeBoard(repair.level,random);assert.equal(matches(board,7).length,0);
  const move=findMove(board,7);assert.ok(move);const changed=swap(board,...move);
  const next=refill(changed,matches(changed,7),repair.level,random);
  next.forEach((v,j)=>{assert.equal(v===null,board[j]===null);if(v!==null)assert.ok(v>=0&&v<repair.level.types);});
 }});
});
