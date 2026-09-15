import test from 'node:test';
import assert from 'node:assert/strict';
import {airlockRepairs,airlockLogs,exteriorStage} from '../src/airlockRepairs.js';
import {makeBoard,matches,findMove,swap,refill} from '../src/match3.js';
test('airlock boards remain playable with their masks and targets',()=>{
 let seed=123;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 airlockRepairs.forEach((r,i)=>{assert.equal(airlockLogs[i].repair,r.id);for(let n=0;n<100;n++){
  const b=makeBoard(r.level,random);assert.equal(b.length,42);assert.equal(matches(b,6).length,0);const move=findMove(b,6);assert.ok(move);
  const changed=swap(b,...move),next=refill(changed,matches(changed,6),r.level,random);
  next.forEach((v,j)=>{assert.equal(v===null,b[j]===null);if(v!==null)assert.ok(v>=0&&v<5);});
 }});
});
test('exterior changes only for completed cockpit, hull and seals',()=>{
 for(let cockpit=0;cockpit<4;cockpit++)assert.equal(exteriorStage(cockpit,0),0);
 for(let airlock=0;airlock<3;airlock++)assert.equal(exteriorStage(4,airlock),1);
 assert.equal(exteriorStage(4,3),2);assert.equal(exteriorStage(4,4),3);
});
