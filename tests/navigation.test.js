import test from 'node:test';
import assert from 'node:assert/strict';
import {navigationRepairs,navigationLogs,shipReadiness} from '../src/navigationRepairs.js';
import {makeBoard,matches,findMove,swap,refill} from '../src/match3.js';
test('navigation targets and masks remain playable',()=>{
 let seed=73;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 navigationRepairs.forEach((r,i)=>{assert.equal(navigationLogs[i].repair,r.id);for(let n=0;n<100;n++){
  const b=makeBoard(r.level,random);assert.equal(matches(b,7).length,0);const move=findMove(b,7);assert.ok(move);
  const changed=swap(b,...move),next=refill(changed,matches(changed,7),r.level,random);
  next.forEach((v,j)=>{assert.equal(v===null,b[j]===null);if(v!==null)assert.ok(v>=0&&v<6);});
 }});
});
test('every system is required regardless of completion order',()=>{
 const ready={cockpit:4,'airlock-work':4,crew:4,galley:4,engine:5,navigation:4};
 assert.ok(shipReadiness(ready).every(r=>r.ready));
 for(const id of Object.keys(ready))assert.equal(shipReadiness({...ready,[id]:ready[id]-1}).every(r=>r.ready),false);
 assert.equal(shipReadiness({navigation:4}).filter(r=>r.ready).length,1);
});
