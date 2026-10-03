import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {riftStoryPanels} from '../src/riftStory.js';
import {translate} from '../src/i18n/translate.js';

test('Rift prelude ships three distinct bilingual illustrations',()=>{
 assert.equal(riftStoryPanels.length,3);
 assert.equal(new Set(riftStoryPanels.map(p=>p.image)).size,3);
 for(const panel of riftStoryPanels){
  assert.ok(existsSync(new URL(`../public/scenes/${panel.image}.webp`,import.meta.url)));
  for(const key of ['title','caption'])assert.notEqual(translate(panel[key],'cs'),panel[key]);
 }
 for(const text of ['Rift crossing story','Begin the crossing','Replay the Rift story'])assert.notEqual(translate(text,'cs'),text);
});
