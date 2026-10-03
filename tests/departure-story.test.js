import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {departurePanels} from '../src/departureStory.js';
import {translate} from '../src/i18n/translate.js';

test('departure introduces the exploration chapter through three bilingual panels',()=>{
 assert.equal(departurePanels.length,3);
 assert.equal(new Set(departurePanels.map(p=>p.image)).size,3);
 for(const panel of departurePanels){
  assert.ok(existsSync(new URL(`../public/scenes/${panel.image}.webp`,import.meta.url)));
  for(const key of ['title','caption'])assert.notEqual(translate(panel[key],'cs'),panel[key]);
 }
 for(const text of ['Departure story','Explore Kepler Reach','Replay the departure story'])assert.notEqual(translate(text,'cs'),text);
});
