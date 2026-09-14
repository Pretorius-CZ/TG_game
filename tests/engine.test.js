import test from 'node:test';
import assert from 'node:assert/strict';
import {engineRepairs,engineLogs} from '../src/engineRepairs.js';
import {makeBoard,matches,findMove,swap,refill} from '../src/match3.js';
test('all five engine boards start stable and preserve masked cells through refill',()=>{
 let seed=91;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 assert.equal(engineRepairs.length,5);
 engineRepairs.forEach((r,i)=>{assert.equal(engineLogs[i].repair,r.id);for(let n=0;n<100;n++){
  const b=makeBoard(r.level,random);assert.equal(b.length,56);assert.equal(matches(b,7).length,0);const move=findMove(b,7);assert.ok(move);
  const changed=swap(b,...move),next=refill(changed,matches(changed,7),r.level,random);
  next.forEach((v,j)=>{assert.equal(v===null,b[j]===null);if(v!==null)assert.ok(v>=0&&v<6);});
 }});
});
