import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {researchStoryPanels} from '../src/researchStory.js';
import {translate} from '../src/i18n/translate.js';

test('research return has three bilingual shipped story illustrations',()=>{
 assert.equal(researchStoryPanels.length,3);
 for(const panel of researchStoryPanels){
  assert.ok(existsSync(new URL(`../public/scenes/${panel.image}.webp`,import.meta.url)));
  for(const key of ['title','caption'])assert.notEqual(translate(panel[key],'cs'),panel[key]);
 }
});
