import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeProgress,mergeProgress,storeProgress,loadProgress} from '../src/progressStorage.js';
test('restart defeats stale progress in either merge direction',()=>{
 const old=normalizeProgress({completed:4,crewCompleted:4});
 const fresh=normalizeProgress({resetRevision:1});
 assert.deepEqual(mergeProgress(old,fresh),fresh);
 assert.deepEqual(mergeProgress(fresh,old),fresh);
});
test('old tabs cannot resurrect cleared local progress',()=>{
 let raw=JSON.stringify(normalizeProgress({resetRevision:2}));
 const storage={getItem:()=>raw,setItem:(_,v)=>{raw=v;}};
 storeProgress(storage,normalizeProgress({resetRevision:1,completed:4}));
 assert.equal(loadProgress(storage).progress.completed,0);
 assert.equal(loadProgress(storage).progress.resetRevision,2);
 storeProgress(storage,normalizeProgress({resetRevision:2,completed:1}));
 assert.equal(loadProgress(storage).progress.completed,1);
});
