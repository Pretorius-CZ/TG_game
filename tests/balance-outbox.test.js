import test from 'node:test';
import assert from 'node:assert/strict';
import {readQueue,enqueueAttempt,drainQueue} from '../src/balanceOutbox.js';
function storage(){const data=new Map();globalThis.localStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};return ()=>delete globalThis.localStorage;}
test('offline failure retains queued result and retry removes it',async()=>{
 const cleanup=storage();try{enqueueAttempt({attemptId:'a',outcome:'exhausted'});await assert.rejects(()=>drainQueue(async()=>{throw new Error('offline')}));assert.equal(readQueue().length,1);await drainQueue(async()=>{});assert.equal(readQueue().length,0);}finally{cleanup();}
});
test('acknowledging an old snapshot cannot delete a newer continued result',async()=>{
 const cleanup=storage();try{enqueueAttempt({attemptId:'a',outcome:'exhausted'});await drainQueue(async(identity,item)=>{assert.equal(item.payload.outcome,'exhausted');enqueueAttempt({attemptId:'a',outcome:'won'});});assert.equal(readQueue().length,1);assert.equal(readQueue()[0].payload.outcome,'won');assert.equal(readQueue()[0].revision,2);await drainQueue(async()=>{});assert.equal(readQueue().length,0);}finally{cleanup();}
});
test('multiple updates coalesce and reporter secret never enters gameplay payload',async()=>{
 const cleanup=storage();try{enqueueAttempt({attemptId:'a',outcome:'exhausted'});enqueueAttempt({attemptId:'a',outcome:'won'});assert.equal(readQueue().length,1);await drainQueue(async(identity,item)=>{assert.ok(identity.id&&identity.token);assert.equal(item.payload.outcome,'won');assert.ok(!('token' in item.payload));});}finally{cleanup();}
});
