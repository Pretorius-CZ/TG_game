import test from 'node:test';
import assert from 'node:assert/strict';
import {chaptersFor,chapterSectionOpen} from '../src/chapters.js';
import {normalizeProgress} from '../src/progressStorage.js';
test('chapters account for all 150 levels without unlocking future chapters',()=>{
 const rows=chaptersFor(normalizeProgress());assert.equal(rows.reduce((n,c)=>n+c.total,0),150);assert.equal(rows.filter(c=>c.open).length,1);assert.equal(rows[0].next,'airlock');assert.equal(rows.at(-1).partial,true);
});
test('chapter sections preserve scanner and ship progression gates',()=>{
 const p={launchDone:true,scannerInstalled:false};const c=chaptersFor(p)[1];assert.equal(chapterSectionOpen(p,c,'mine'),true);assert.equal(chapterSectionOpen(p,c,'ice'),false);assert.equal(chapterSectionOpen({...p,scannerInstalled:true},c,'ice'),true);
 const fresh=normalizeProgress();const ship=chaptersFor(fresh)[0];assert.equal(chapterSectionOpen(fresh,ship,'cockpit'),false);assert.equal(chapterSectionOpen(fresh,ship,'airlock'),true);
});
