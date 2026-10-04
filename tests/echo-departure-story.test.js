import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {echoDeparturePanels,shouldShowEchoDeparture} from '../src/echoDepartureStory.js';
import {elysiumDestinations} from '../src/elysium.js';
import {translate} from '../src/i18n/translate.js';
test('Elysium departure has three bilingual shipped panels',()=>{
 assert.equal(echoDeparturePanels.length,3);
 for(const panel of echoDeparturePanels){
  assert.ok(existsSync(new URL(`../public/scenes/${panel.image}.webp`,import.meta.url)));
  for(const key of ['title','caption'])assert.notEqual(translate(panel[key],'cs'),panel[key]);
 }
});
test('departure introduction requires the restored station and never interrupts later Rift progress',()=>{
 const p={scene:'rift',riftEchoCompleted:0,...Object.fromEntries(Object.values(elysiumDestinations).map(s=>[s.key,s.repairs.length]))};
 assert.equal(shouldShowEchoDeparture(p),true);
 assert.equal(shouldShowEchoDeparture({...p,scene:'rift-echo'}),true);
 for(const s of Object.values(elysiumDestinations))assert.equal(shouldShowEchoDeparture({...p,[s.key]:3}),false);
 for(const scene of ['elysium','rift-platform','rift-beacons','beyond-rift'])assert.equal(shouldShowEchoDeparture({...p,scene}),false);
 assert.equal(shouldShowEchoDeparture({...p,riftEchoCompleted:1}),false);
});
