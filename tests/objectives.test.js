import test from 'node:test';
import assert from 'node:assert/strict';
import {goalsFor,collectGoals,goalsComplete} from '../src/objectives.js';
test('dual goals cannot be completed by overcollecting one color',()=>{
  const goals=[{type:0,target:3},{type:1,target:3}];
  const counts=collectGoals(goals,[0,0],[0,0,0,0,0,0],[0,1,2,3,4,5]);
  assert.deepEqual(counts,[3,0]);assert.equal(goalsComplete(goals,counts),false);
  assert.equal(goalsComplete(goals,collectGoals(goals,counts,[1,1,1],[0,1,2])),true);
});
test('legacy any-piece and single-color goals retain their rules',()=>{
  const repair={target:3,targetType:null,name:'Legacy'};
  assert.deepEqual(collectGoals(goalsFor(repair),[0],[0,1,2],[0,1,2]),[3]);
  assert.deepEqual(collectGoals(goalsFor({...repair,targetType:1}),[0],[0,1,2],[0,1,2]),[1]);
});
