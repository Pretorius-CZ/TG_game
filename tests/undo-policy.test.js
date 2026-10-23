import test from 'node:test';
import assert from 'node:assert/strict';
import {rewardAllowed} from '../src/rewardPolicy.js';
test('undo is supported on web and Android without enabling other native rewards',()=>{
 for(const kind of ['moves','undo','helper','hint','energy',undefined]){
  assert.equal(rewardAllowed('production',kind),true);
  assert.equal(rewardAllowed('android',kind),kind==='moves'||kind==='undo');
 }
});
