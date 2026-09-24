import test from 'node:test';
import assert from 'node:assert/strict';
import {havenRepairs,havenLogs,jumpLog,gateReady} from '../src/haven.js';
import {havenLog,systemCargo,completeDestination} from '../src/destinations.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {makeIceBoard,iceMove,initialIce} from '../src/levelRules.js';
const base={completed:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,airlockCompleted:3,navigationCompleted:4,exteriorCompleted:4,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true,iceCompleted:6,wreckCompleted:6};
test('Haven requires both bearings and a complete gate before transit',()=>{
 for(const key of ['iceCompleted','wreckCompleted']){
  const p=normalizeProgress({...base,[key]:5,havenCompleted:6,jumpDone:true,scene:'haven'});
  assert.equal(p.havenCompleted,0);assert.equal(p.jumpDone,false);assert.equal(p.scene,'system');
 }
 for(let n=0;n<=6;n++){
  const p=normalizeProgress({...base,havenCompleted:n,jumpDone:true,scene:'system2'});
  assert.equal(gateReady(p),n===6);assert.equal(p.jumpDone,n===6);assert.equal(p.scene,n===6?'system2':'system');
 }
});
test('shipments install once at dock, power and coordinates; replay cannot advance',()=>{
 let p=normalizeProgress(base);
 const expected=[{materials:1,data:2,energy:1},{materials:0,data:2,energy:1},{materials:0,data:2,energy:0},{materials:0,data:2,energy:0},{materials:0,data:2,energy:0},{materials:0,data:0,energy:0},{materials:0,data:0,energy:0}];
 for(let n=0;n<7;n++){
  assert.deepEqual(systemCargo(p),expected[n]);
  if(n<6){assert.equal(completeDestination(n,havenRepairs[(n+1)%6].id,havenRepairs),n);p.havenCompleted=completeDestination(n,havenRepairs[n].id,havenRepairs);}
 }
 for(const r of havenRepairs)assert.equal(completeDestination(6,r.id,havenRepairs),6);
 assert.deepEqual(systemCargo({...p,jumpDone:true}),expected[6]);
});
test('gate progress and arrival log survive merge but not reset',()=>{
 const complete=normalizeProgress({...base,havenCompleted:6,jumpDone:true,scene:'system2',readIds:[jumpLog.id,...havenLogs.map(e=>e.id)]});
 const old=normalizeProgress({...base,havenCompleted:2});
 const merged=mergeProgress(old,complete);assert.equal(merged.havenCompleted,6);assert.equal(merged.jumpDone,true);assert.equal(merged.readIds.length,7);
 const reset=mergeProgress(merged,normalizeProgress({resetRevision:1}));assert.equal(reset.havenCompleted,0);assert.equal(reset.jumpDone,false);assert.equal(reset.readIds.length,0);
 assert.deepEqual(normalizeProgress({...base,havenCompleted:2,readIds:[jumpLog.id,havenLogs[5].id]}).readIds,[]);
 assert.equal(new Set([havenLog,...havenLogs,jumpLog].map(e=>e.id)).size,8);
 assert.ok(havenLogs.every(e=>e.title&&e.text.length>50));
});
test('Haven boards have legal opening moves and valid covers and objectives',()=>{
 let seed=811;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const r of havenRepairs)for(let n=0;n<30;n++){
  const ice=initialIce(r),board=makeIceBoard(r.level,ice,random);
  assert.ok(ice.every(i=>board[i]!=null));assert.ok(iceMove(board,r.level.cols,ice));
  assert.ok(r.goals.every(g=>g.type<r.level.types&&g.target>0));
 }
 assert.equal(havenRepairs[5].ice.length,8);
});
