import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlaytest,readPlaytest,queuePlaytestResult,ratePlaytest,playtestExport,isPlaytestAttempt} from '../src/playtestStorage.js';
import {levelGroups,levelCatalog} from '../src/levelCatalog.js';
const repairs=levelGroups.flatMap(([,rs])=>rs);
test('blind test pins every one of 200 repairs once without mutating production data',()=>{
 const before=JSON.stringify(repairs),s=createPlaytest(repairs,{random:()=>0.3,rules:'test'});
 assert.equal(s.order.length,200);assert.equal(new Set(s.order).size,200);assert.deepEqual([...s.order].sort(),levelCatalog.map(r=>r.id).sort());
 assert.notDeepEqual(s.order,repairs.map(r=>r.id));s.repairs[0].moves=999;assert.equal(JSON.stringify(repairs),before);assert.equal(s.consent,false);
 const storage={getItem:()=>JSON.stringify(s)};assert.deepEqual(readPlaytest(storage,'test'),s);
 assert.throws(()=>readPlaytest({getItem:()=>'{broken'},'test'));
 assert.throws(()=>readPlaytest({getItem:()=>JSON.stringify({...s,order:Array(200).fill('lights')})},'test'));
});
test('rating revises the same attempt, preserves charge measurements and never exports secrets',()=>{
 const s=createPlaytest(repairs),row={attemptId:crypto.randomUUID(),level:s.order[0],outcome:'won',moves:8,configuration:{playtest:{chargeSwaps:2}},at:Date.now()};
 const queued=queuePlaytestResult(s,row),rated=ratePlaytest(queued,'hard','  Těsné  ');
 assert.equal(rated.attempts.length,1);assert.equal(rated.pending.length,1);assert.equal(rated.attempts[0].configuration.playtest.chargeSwaps,2);assert.equal(rated.attempts[0].configuration.playtest.note,'Těsné');assert.equal(rated.cursor,0);
 assert.ok(isPlaytestAttempt(rated.attempts[0]));assert.equal(isPlaytestAttempt(row),false);
 const exported=JSON.stringify(playtestExport(rated));assert.ok(!exported.includes(s.token));assert.ok(!exported.includes('reporter'));assert.throws(()=>ratePlaytest(queued,'invalid'));
});
