import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {asterJumpPanels,completeAsterJump} from '../src/asterJumpStory.js';
import {translate} from '../src/i18n/translate.js';

test('Aster Veil introduction has three bilingual, shipped illustrations',()=>{
 assert.equal(asterJumpPanels.length,3);
 for(const panel of asterJumpPanels){
  assert.ok(existsSync(new URL(`../public/scenes/${panel.image}.webp`,import.meta.url)));
  for(const key of ['title','caption'])assert.notEqual(translate(panel[key],'cs'),panel[key]);
 }
});

test('crossing requires the gate and preserves independent repairs and future progress',()=>{
 const ready={scannerInstalled:true,iceCompleted:6,wreckCompleted:6,havenCompleted:6,buoyCompleted:3,elysiumArrival:1,resetRevision:2};
 const result=completeAsterJump(ready);
 assert.deepEqual(result,{...ready,jumpDone:true,scene:'system2'});
 assert.deepEqual(completeAsterJump(result),result);
 for(const key of ['scannerInstalled','iceCompleted','wreckCompleted','havenCompleted']){
  const incomplete={...ready,[key]:0};assert.equal(completeAsterJump(incomplete),incomplete);
 }
});
