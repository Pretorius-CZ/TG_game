import test from 'node:test';
import assert from 'node:assert/strict';
import {exteriorRepairs,exteriorLogs,exteriorScene,canRefuel} from '../src/exteriorRepairs.js';
import {airlockRepairs} from '../src/airlockRepairs.js';
import {shipReadiness} from '../src/navigationRepairs.js';
import {makeIceBoard,iceMove,initialIce} from '../src/levelRules.js';
test('exterior owns hull once, three tasks and all 28 repairs gate departure',()=>{
 assert.equal(airlockRepairs.length,3);assert.equal(exteriorRepairs.length,4);
 assert.ok(!airlockRepairs.some(r=>r.id.includes('hull')));
 assert.equal(shipReadiness({}).reduce((n,r)=>n+r.total,0),28);
 assert.equal(exteriorScene(4,0),'./scenes/exterior-cockpit-lit.webp');
 assert.equal(exteriorScene(4,1),'./scenes/exterior-hull.webp');
 assert.equal(exteriorScene(4,2),'./scenes/exterior-engines.webp');
 assert.equal(exteriorScene(4,3),'./scenes/exterior-gear.webp');
});
test('exterior lessons and log entries are ordered and playable with covers only on landing gear',()=>{
 let seed=31;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 exteriorRepairs.forEach((r,i)=>{assert.equal(exteriorLogs[i].repair,r.id);assert.equal(initialIce(r).length,i===2?4:0);for(let n=0;n<100;n++)assert.ok(iceMove(makeIceBoard(r.level,initialIce(r),random),r.level.cols,initialIce(r)));});
});

test('refueling requires both exterior preparation and repaired internal fuel lines',()=>{
 assert.equal(canRefuel(3,1),false);assert.equal(canRefuel(2,5),false);
 assert.equal(canRefuel(3,2),true);assert.equal(canRefuel(4,5),true);
 assert.equal(exteriorScene(4,4),exteriorScene(4,3));
});
