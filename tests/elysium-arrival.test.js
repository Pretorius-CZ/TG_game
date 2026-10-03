import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {elysiumArrivalPanels,completeElysiumArrival} from '../src/elysiumArrivalStory.js';
import {translate} from '../src/i18n/translate.js';

test('arrival comic is bilingual and has three shipped illustrations',()=>{
 assert.equal(elysiumArrivalPanels.length,3);
 for(const panel of elysiumArrivalPanels){
  assert.ok(existsSync(new URL(`../public/scenes/${panel.image}.webp`,import.meta.url)));
  for(const key of ['title','caption'])assert.notEqual(translate(panel[key],'cs'),panel[key]);
 }
});

test('finishing or skipping arrival preserves repairs and requires the completed route',()=>{
 const ready={jumpDone:true,buoyCompleted:3,verdantCompleted:6,fractureCompleted:6,elysiumRouteCompleted:1,elysiumDockCompleted:4,resetRevision:2};
 const result=completeElysiumArrival(ready);
 assert.deepEqual(result,{...ready,elysiumArrival:1,scene:'elysium'});
 assert.deepEqual(completeElysiumArrival(result),result);
 for(const key of ['elysiumRouteCompleted','buoyCompleted','verdantCompleted','fractureCompleted']){
  const incomplete={...ready,[key]:0};assert.equal(completeElysiumArrival(incomplete),incomplete);
 }
});
