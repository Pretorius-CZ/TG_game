import test from 'node:test';
import assert from 'node:assert/strict';
import {accountStorage,accountKey} from '../src/accountStorage.js';
import {loadProgress,storeProgress,normalizeProgress,mergeProgress,SAVE_KEY} from '../src/progressStorage.js';
test('guest and two signed-in accounts never share a save implicitly',()=>{
 const values=new Map();const storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 storeProgress(accountStorage(storage),normalizeProgress({completed:4}));
 storeProgress(accountStorage(storage,'alice'),normalizeProgress({completed:2}));
 assert.equal(loadProgress(accountStorage(storage,'bob')).progress.completed,0);
 assert.equal(loadProgress(accountStorage(storage,'alice')).progress.completed,2);
 assert.equal(loadProgress(accountStorage(storage)).progress.completed,4);
 assert.equal(accountKey(),SAVE_KEY);
});
test('explicit guest import retains both sources and does not regress account repairs',()=>{
 const guest=normalizeProgress({completed:4,crewCompleted:2});
 const account=normalizeProgress({completed:4,engineCompleted:5});
 const combined=mergeProgress(account,guest);
 assert.equal(combined.crewCompleted,2);assert.equal(combined.engineCompleted,5);
 assert.equal(guest.engineCompleted,0);
});
