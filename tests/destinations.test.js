import test from 'node:test';
import assert from 'node:assert/strict';
import {iceRepairs,wreckRepairs,iceLogs,wreckLogs,havenLog,havenLocated,systemCargo,completeDestination} from '../src/destinations.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {makeIceBoard,iceMove,initialIce} from '../src/levelRules.js';
const base={completed:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,airlockCompleted:3,navigationCompleted:4,exteriorCompleted:4,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true};
test('both expeditions require scanner and can be completed in either order',()=>{
 assert.equal(normalizeProgress({...base,scannerInstalled:false,iceCompleted:6,scene:'ice'}).iceCompleted,0);
 for(const order of [['iceCompleted','wreckCompleted'],['wreckCompleted','iceCompleted']]){
  let p=normalizeProgress(base);p[order[0]]=6;assert.equal(havenLocated(p),false);
  p[order[1]]=6;assert.equal(havenLocated(p),true);
  assert.deepEqual(systemCargo(p),{materials:1,data:2,energy:1});
 }
 assert.equal(completeDestination(0,'ice-cells',iceRepairs),0);
 assert.equal(completeDestination(6,'wreck-cargo',wreckRepairs),6);
});
test('merge retains independent expeditions, gates Haven log and respects resets',()=>{
 const ice=normalizeProgress({...base,iceCompleted:6,readIds:iceLogs.map(e=>e.id)});
 const wreck=normalizeProgress({...base,wreckCompleted:6,readIds:wreckLogs.map(e=>e.id)});
 const both=mergeProgress(ice,wreck);assert.equal(havenLocated(both),true);assert.equal(both.readIds.length,12);
 assert.ok(!normalizeProgress({...ice,readIds:[havenLog.id]}).readIds.includes(havenLog.id));
 assert.ok(normalizeProgress({...both,readIds:[havenLog.id]}).readIds.includes(havenLog.id));
 const reset=mergeProgress(both,normalizeProgress({resetRevision:1}));assert.equal(reset.iceCompleted,0);assert.equal(reset.wreckCompleted,0);
});
test('new boards support masks, cover positions and legal moves',()=>{
 let seed=18;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const r of [...iceRepairs,...wreckRepairs])for(let n=0;n<30;n++){
  const ice=initialIce(r),board=makeIceBoard(r.level,ice,random);
  assert.ok(ice.every(i=>board[i]!=null));assert.ok(iceMove(board,r.level.cols,ice));
  assert.ok(r.goals.every(g=>g.type<r.level.types&&g.target>0));
 }
 assert.equal(new Set([...iceLogs,...wreckLogs].map(e=>e.id)).size,12);
});
