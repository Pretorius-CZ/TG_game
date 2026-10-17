import test from 'node:test';
import assert from 'node:assert/strict';
import {createAttemptEnergy} from '../src/attemptEnergy.js';

function ledger(count=5){
 const disk={count};
 const open=()=>createAttemptEnergy({spend(){if(!disk.count)return false;disk.count--;return true;},reward(){disk.count=Math.min(5,disk.count+1);}});
 return {disk,open};
}
test('reload after paid play retains exactly one durable debit',()=>{
 const {disk,open}=ledger(),attempt=open();
 assert.equal(attempt.reserve('first'),true);
 for(let move=0;move<20;move++)assert.equal(attempt.reserve('first'),true);
 assert.equal(disk.count,4);
 const reloaded=open();assert.equal(reloaded.settle('first',true),false);
 assert.equal(disk.count,4);
 open();assert.equal(disk.count,4);
});
test('a win or technical fault refunds once; quitting and exhaustion do not',()=>{
 for(const refund of [false,true]){
  const {disk,open}=ledger(),attempt=open();attempt.reserve('try');
  assert.equal(attempt.settle('try',refund),true);
  assert.equal(attempt.settle('try',refund),false);
  assert.equal(disk.count,refund?5:4);
 }
});
test('leaving before the first paid move has no debit or refund',()=>{
 const {disk,open}=ledger(),attempt=open();assert.equal(attempt.settle('unplayed',true),false);assert.equal(disk.count,5);
});
test('continuation re-arms the refund without another net debit, even on last life',()=>{
 const {disk,open}=ledger(1),attempt=open();attempt.reserve('try');attempt.settle('try');
 assert.equal(disk.count,0);
 disk.count++; // Existing +5-move reward reverses the provisional failure.
 assert.equal(attempt.reserve('try'),true);assert.equal(disk.count,0);
 attempt.settle('try',true);assert.equal(disk.count,1);
});
test('zero energy cannot reserve; separate attempts cannot refund each other',()=>{
 const {disk,open}=ledger(1),first=open(),second=open();
 assert.equal(first.reserve('a'),true);assert.equal(second.reserve('b'),false);
 assert.equal(second.settle('a',true),false);assert.equal(disk.count,0);
 assert.equal(first.settle('a',true),true);assert.equal(disk.count,1);
});
