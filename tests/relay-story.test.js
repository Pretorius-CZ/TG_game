import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {relayStoryPanels} from '../src/relayStory.js';
import {storySeenKey,hasSeenStory,rememberStory} from '../src/storySeen.js';
import {translate} from '../src/i18n/translate.js';

test('relay descent ships three bilingual illustrations',()=>{
 assert.equal(relayStoryPanels.length,3);
 for(const panel of relayStoryPanels){
  assert.ok(existsSync(new URL(`../public/scenes/${panel.image}.webp`,import.meta.url)));
  for(const key of ['title','caption'])assert.notEqual(translate(panel[key],'cs'),panel[key]);
 }
});

test('story preference is isolated by profile and reset, with a safe blocked-storage fallback',()=>{
 const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 const key=storySeenKey('relay-descent','alice',0);
 assert.equal(hasSeenStory(key,storage),false);
 rememberStory(key,storage);assert.equal(hasSeenStory(key,storage),true);assert.equal(values.get(key),'seen');
 for(const other of [storySeenKey('relay-descent','bob',0),storySeenKey('relay-descent','alice',1),storySeenKey('relay-descent','guest',0)])assert.equal(hasSeenStory(other,storage),false);
 const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},fallback=storySeenKey('relay-descent','offline',0);
 assert.equal(hasSeenStory(fallback,blocked),false);rememberStory(fallback,blocked);assert.equal(hasSeenStory(fallback,blocked),true);
});
