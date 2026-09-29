import test from 'node:test';import assert from 'node:assert/strict';import {recoverLives,RECHARGE_MS} from '../src/livesRules.js';import {initialIce} from '../src/levelRules.js';
test('lives recover by elapsed time and never exceed five',()=>{assert.deepEqual(recoverLives({count:0,nextAt:100},100),{count:1,nextAt:100+RECHARGE_MS});assert.deepEqual(recoverLives({count:0,nextAt:100},100+10*RECHARGE_MS),{count:5,nextAt:null});assert.equal(recoverLives(null).count,5);assert.equal(recoverLives({count:-3,nextAt:100},99).count,0);});
test('ice is introduced at the third room repair, not cold storage or tutorials',()=>{assert.deepEqual(initialIce({id:'galley-cold',level:{cols:7}}),[]);assert.equal(initialIce({id:'galley-racks',level:{cols:7}}).length,4);assert.deepEqual(initialIce({id:'computer',level:{cols:6}}),[]);});
test('intro energy recovers while offline and caps at five',async()=>{
 const {configureRecharge,INTRO_RECHARGE_MS:I}=await import('../src/livesRules.js');
 const now=100000000;
 const saved={count:0,nextAt:now+I,interval:I};
 assert.deepEqual(configureRecharge(saved,false,now+3*I),{count:3,nextAt:now+4*I,interval:I});
 assert.equal(configureRecharge(saved,false,now+10*I).count,5);
});
test('departure preserves pending charge then uses thirty minutes',async()=>{
 const {configureRecharge,INTRO_RECHARGE_MS:I}=await import('../src/livesRules.js');
 const now=100000000;
 const departed=configureRecharge({count:2,nextAt:now+I,interval:I},true,now);
 assert.equal(departed.nextAt,now+I);
 assert.equal(departed.interval,RECHARGE_MS);
 assert.deepEqual(configureRecharge(departed,true,now+I),{count:3,nextAt:now+I+RECHARGE_MS,interval:RECHARGE_MS});
});
test('legacy introductory countdown shortens only once',async()=>{
 const {configureRecharge,INTRO_RECHARGE_MS:I}=await import('../src/livesRules.js');
 const now=100000000;
 const migrated=configureRecharge({count:2,nextAt:now+RECHARGE_MS},false,now);
 assert.deepEqual(migrated,{count:2,nextAt:now+I,interval:I});
 assert.deepEqual(configureRecharge(JSON.parse(JSON.stringify(migrated)),false,now),migrated);
});
