import test from 'node:test';
import assert from 'node:assert/strict';
import {shipStages,currentShipStage,chapterEntry,canVisitChapter} from '../src/chapterFlow.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
test('first chapter has exactly one repair stage in a fixed order',()=>{
 let p=normalizeProgress();
 for(const stage of shipStages){
  assert.equal(currentShipStage(p).scene,stage.scene);
  for(const other of shipStages)if(other.scene!==stage.scene&&other.scene!==chapterEntry(p)&&other.scene!=='exterior')assert.equal(canVisitChapter(p,other.scene),false);
  for(let n=1;n<=stage.total;n++)p=normalizeProgress({...p,[stage.key]:n});
 }
 assert.equal(currentShipStage(p).name,'Launch check');assert.equal(chapterEntry(p),'exterior');
 assert.equal(currentShipStage({...p,finaleDone:true}).name,'Departure');
});
test('airlock completion persists before cockpit, including a stale device merge',()=>{
 const p=normalizeProgress({airlockCompleted:3,scene:'airlock',readIds:['airlock-pressure-safe']});
 assert.equal(p.completed,0);assert.equal(p.airlockCompleted,3);assert.ok(p.readIds.includes('airlock-pressure-safe'));
 assert.equal(mergeProgress(normalizeProgress(),p).airlockCompleted,3);
});
test('old out-of-order repairs survive and the guide selects only missing stages',()=>{
 const old=normalizeProgress({completed:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,navigationCompleted:4,exteriorCompleted:4,scene:'engine'});
 assert.equal(currentShipStage(old).scene,'airlock');assert.equal(old.engineCompleted,5);assert.equal(old.exteriorCompleted,4);
 const done=normalizeProgress({...old,airlockCompleted:3,finaleDone:true,launchDone:true});
 assert.equal(canVisitChapter(done,'crew'),true);assert.equal(done.launchDone,true);
});
