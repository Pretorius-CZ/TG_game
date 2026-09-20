import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
const ship={completed:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,airlockCompleted:3,navigationCompleted:4,exteriorCompleted:4,finaleDone:true,launchDone:true,readIds:['departure-log']};
test('departure requires completed repairs and final challenge',()=>{
 assert.equal(normalizeProgress({launchDone:true}).launchDone,false);
 assert.equal(normalizeProgress({...ship,finaleDone:false}).launchDone,false);
 assert.equal(normalizeProgress({...ship,exteriorCompleted:3}).launchDone,false);
 assert.equal(normalizeProgress(ship).launchDone,true);
});
test('departure and its log survive reload and stale cloud merges',()=>{
 const completed=normalizeProgress(JSON.parse(JSON.stringify(ship)));
 assert.ok(completed.readIds.includes('departure-log'));
 const old=normalizeProgress({...ship,launchDone:false,readIds:[]});
 assert.equal(mergeProgress(old,completed).launchDone,true);
 assert.ok(mergeProgress(old,completed).readIds.includes('departure-log'));
 assert.equal(normalizeProgress({...ship,finaleDone:false}).readIds.includes('departure-log'),false);
});
