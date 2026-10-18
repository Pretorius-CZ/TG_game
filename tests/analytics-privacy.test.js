import test from 'node:test';
import assert from 'node:assert/strict';
import {analyticsChoice,analyticsAllowed,setAnalyticsChoice,analyticsChoiceKey,analyticsSignal,analyticsRetentionMs,pruneLocalAnalytics} from '../src/analyticsPrivacy.js';
import {saveAttempt,readAttempts} from '../src/balanceTracking.js';
import {readQueue,drainQueue} from '../src/balanceOutbox.js';
function storage(){const values=new Map();globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};return values;}
test('missing, corrupt or old analytics choices never permit collecting history',()=>{
 const values=storage();try{
  for(const value of [null,'broken',JSON.stringify({version:0,state:'granted',at:0}),JSON.stringify({version:1,state:'granted'})]){
   if(value===null)values.delete(analyticsChoiceKey);else values.set(analyticsChoiceKey,value);
   assert.equal(analyticsChoice(),'unknown');assert.equal(analyticsAllowed(),false);
   saveAttempt({attemptId:'x',at:Date.now()});assert.equal(values.has('beyond-signal-balance-attempts-v1'),false);
  }
 }finally{delete globalThis.localStorage;}
});
test('opt-in clears legacy queues, keeps progress and bot classification, and collects only new results',()=>{
 const values=storage();try{
  values.set('to-the-stars-progress-v1','keep');values.set('beyond-signal-balance-attempts-v1','[{"attemptId":"legacy"}]');
  values.set('beyond-signal-campaign-visit-v1',JSON.stringify({source:'automated_test',medium:'bot',campaign:'qa'}));
  setAnalyticsChoice('granted');assert.equal(readAttempts().length,0);assert.equal(values.get('to-the-stars-progress-v1'),'keep');
  assert.equal(JSON.parse(values.get('beyond-signal-migrated-traffic-v1')).medium,'bot');
  saveAttempt({attemptId:'new',at:Date.now(),level:'x'});assert.equal(readQueue().length,1);
  saveAttempt({attemptId:'expired',at:Date.now()-analyticsRetentionMs-1});assert.equal(readQueue().length,1);
 }finally{delete globalThis.localStorage;}
});
test('withdrawal aborts in-flight requests and stops a drained snapshot from sending the next result',async()=>{
 storage();try{
  setAnalyticsChoice('granted');saveAttempt({attemptId:'a',at:Date.now()});saveAttempt({attemptId:'b',at:Date.now()});
  const signal=analyticsSignal();let calls=0;
  await drainQueue(async()=>{calls++;setAnalyticsChoice('denied');});
  assert.equal(calls,1);assert.equal(signal.aborted,true);assert.equal(readQueue().length,0);
  saveAttempt({attemptId:'c',at:Date.now()});assert.equal(readQueue().length,0);
 }finally{delete globalThis.localStorage;}
});
test('opening removes expired local records without touching saves or the deletion capability',()=>{
 const values=storage();try{
  values.set('to-the-stars-progress-v1','keep');values.set('beyond-signal-balance-reporter-v1','keep-id');
  values.set('beyond-signal-balance-attempts-v1',JSON.stringify([{at:Date.now()-analyticsRetentionMs-1},{at:Date.now()}]));
  values.set('beyond-signal-balance-outbox-v1',JSON.stringify([{payload:{at:Date.now()-analyticsRetentionMs-1}}]));
  pruneLocalAnalytics();assert.equal(JSON.parse(values.get('beyond-signal-balance-attempts-v1')).length,1);
  assert.equal(values.get('beyond-signal-balance-outbox-v1'),'[]');
  assert.equal(values.get('to-the-stars-progress-v1'),'keep');assert.equal(values.get('beyond-signal-balance-reporter-v1'),'keep-id');
 }finally{delete globalThis.localStorage;}
});
