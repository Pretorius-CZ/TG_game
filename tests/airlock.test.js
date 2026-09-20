import test from 'node:test';
import assert from 'node:assert/strict';
import {airlockRepairs,airlockLogs} from '../src/airlockRepairs.js';
import {makeBoard,matches,findMove,swap,refill} from '../src/match3.js';
test('airlock boards remain playable with their masks and targets',()=>{
 let seed=123;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 airlockRepairs.forEach((r,i)=>{assert.equal(airlockLogs[i].repair,r.id);for(let n=0;n<100;n++){
  const b=makeBoard(r.level,random);assert.equal(b.length,42);assert.equal(matches(b,6).length,0);const move=findMove(b,6);assert.ok(move);
  const changed=swap(b,...move),next=refill(changed,matches(changed,6),r.level,random);
  next.forEach((v,j)=>{assert.equal(v===null,b[j]===null);if(v!==null)assert.ok(v>=0&&v<5);});
 }});
});
