import test from 'node:test';import assert from 'node:assert/strict';
import {SAVE_KEY,normalizeProgress,loadProgress,storeProgress,mergeProgress} from '../src/progressStorage.js';
function memory(){const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};}
test('completed ship, fuel, finale, scene and read logs survive serialization',()=>{
 const storage=memory(),save=normalizeProgress({completed:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,airlockCompleted:3,navigationCompleted:4,exteriorCompleted:4,finaleDone:true,scene:'navigation'});
 assert.equal(storeProgress(storage,save).status,'saved');assert.deepEqual(loadProgress(storage).progress,save);assert.equal(save.finaleDone,true);
});
test('invalid fields cannot unlock rooms, fuel or finale',()=>{
 const save=normalizeProgress({completed:-1,crewCompleted:99,finaleDone:true,scene:'crew',readIds:['fake']});
 assert.equal(save.completed,0);assert.equal(save.crewCompleted,0);assert.equal(save.finaleDone,false);assert.equal(save.scene,'exterior');assert.deepEqual(save.readIds,[]);
 assert.equal(normalizeProgress({completed:4,exteriorCompleted:4,engineCompleted:1}).exteriorCompleted,3);
});
test('stale tab writes never erase completed repairs or read entries',()=>{
 const storage=memory();const newer=normalizeProgress({completed:4,engineCompleted:3,scene:'engine'});
 storeProgress(storage,newer);const stale=normalizeProgress({completed:2,scene:'cockpit'});
 const result=storeProgress(storage,stale);assert.equal(result.progress.completed,4);assert.equal(result.progress.engineCompleted,3);assert.equal(result.progress.scene,'cockpit');
 assert.deepEqual(mergeProgress(stale,newer),result.progress);
});
test('blocked, corrupt and newer saves fail safely without overwriting',()=>{
 const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('quota');}};
 assert.equal(loadProgress(blocked).status,'unavailable');assert.equal(storeProgress(blocked,normalizeProgress()).status,'unavailable');
 const storage=memory();for(const raw of ['broken','{"version":2}']){storage.setItem(SAVE_KEY,raw);assert.notEqual(loadProgress(storage).status,'ready');assert.notEqual(storeProgress(storage,normalizeProgress()).status,'saved');assert.equal(storage.getItem(SAVE_KEY),raw);}
});
