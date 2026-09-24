import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeProgress,mergeProgress,storeProgress,loadProgress} from '../src/progressStorage.js';
import {mineRepairs,mineLogs,completeMine,expeditionCargo,canInstallScanner} from '../src/exploration.js';
import {makeIceBoard,iceMove,initialIce} from '../src/levelRules.js';
const launched={completed:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,airlockCompleted:3,navigationCompleted:4,exteriorCompleted:4,finaleDone:true,launchDone:true};
test('expedition requires departure; scanner requires the full expedition',()=>{
 assert.equal(normalizeProgress({mineCompleted:6,scannerInstalled:true,scene:'mine'}).mineCompleted,0);
 assert.equal(normalizeProgress({...launched,mineCompleted:5,scannerInstalled:true}).scannerInstalled,false);
 assert.equal(canInstallScanner({...launched,mineCompleted:6}),true);
 assert.equal(completeMine(0,'mine-lift'),0);
 assert.equal(completeMine(6,'mine-lift'),6);
 assert.deepEqual(expeditionCargo(6,true),{materials:0,data:0,energy:0});
});
test('expedition, logs, scanner and reset survive save merges',()=>{
 const full=normalizeProgress({...launched,mineCompleted:6,scannerInstalled:true,scene:'system',readIds:mineLogs.map(e=>e.id)});
 const storage={value:null,getItem(){return this.value;},setItem(k,v){this.value=v;}};
 storeProgress(storage,full);assert.deepEqual(loadProgress(storage).progress,full);
 const old=normalizeProgress(launched);assert.equal(mergeProgress(old,full).scannerInstalled,true);
 assert.equal(mergeProgress(full,normalizeProgress({resetRevision:1})).mineCompleted,0);
 assert.equal(normalizeProgress({...launched,mineCompleted:1,readIds:mineLogs.map(e=>e.id)}).readIds.length,1);
});
test('all six mine layouts generate playable boards with fixed goals and valid covers',()=>{
 let seed=22;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const repair of mineRepairs)for(let n=0;n<20;n++){
  const ice=initialIce(repair),board=makeIceBoard(repair.level,ice,random);
  assert.ok(iceMove(board,repair.level.cols,ice));
  assert.ok(ice.every(i=>board[i]!=null));
 }
 assert.equal(mineLogs.length,6);assert.equal(new Set(mineLogs.map(e=>e.id)).size,6);
});
