import test from 'node:test';
import assert from 'node:assert/strict';
import {chaptersFor,chapterSectionOpen} from '../src/chapters.js';
import {normalizeProgress} from '../src/progressStorage.js';
test('chapters account for all 200 levels without unlocking future chapters',()=>{
 const rows=chaptersFor(normalizeProgress());assert.equal(rows.reduce((n,c)=>n+c.total,0),200);assert.equal(rows.filter(c=>c.open).length,1);assert.equal(rows[0].next,'airlock');assert.equal(rows.at(-1).partial,false);
});
test('chapter sections preserve scanner and ship progression gates',()=>{
 const p={launchDone:true,scannerInstalled:false};const c=chaptersFor(p)[1];assert.equal(chapterSectionOpen(p,c,'mine'),true);assert.equal(chapterSectionOpen(p,c,'ice'),false);assert.equal(chapterSectionOpen({...p,scannerInstalled:true},c,'ice'),true);
 const fresh=normalizeProgress();const ship=chaptersFor(fresh)[0];assert.equal(chapterSectionOpen(fresh,ship,'cockpit'),false);assert.equal(chapterSectionOpen(fresh,ship,'airlock'),true);
});

test('chapter buttons reopen completed ship segments while navigation remains the next task',()=>{
 const p=normalizeProgress({airlockCompleted:3,completed:4}),ship=chaptersFor(p)[0];
 for(const scene of ['airlock','cockpit','navigation'])assert.equal(chapterSectionOpen(p,ship,scene),true);
 for(const scene of ['crew','galley','engine'])assert.equal(chapterSectionOpen(p,ship,scene),false);
 assert.equal(p.launchDone,false);
});
