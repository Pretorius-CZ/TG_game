import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm,access} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {prepareMainSite} from '../scripts/prepare-main-site.mjs';
import {gameAddress,hasOriginalSave} from '../src/gameAddress.js';
test('main website mode retains transfer and the original OAuth recovery entry',async t=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'main-site-mode-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const game='<html><head></head><body>game</body></html>',website='<html><body>website</body></html>';
 await writeFile(path.join(root,'index.html'),game);await writeFile(path.join(root,'welcome.html'),website);await writeFile(path.join(root,'transfer.html'),'transfer');
 await prepareMainSite(root,'website');assert.equal(await readFile(path.join(root,'index.html'),'utf8'),website);assert.match(await readFile(path.join(root,'legacy-game.html'),'utf8'),/noindex,nofollow/);assert.equal(await readFile(path.join(root,'transfer.html'),'utf8'),'transfer');
 assert.equal(JSON.parse(await readFile(path.join(root,'hosting-policy.json'),'utf8')).mode,'website');
 const sitemap=await readFile(path.join(root,'sitemap.xml'),'utf8');
 assert.match(sitemap,/https:\/\/playbeyondthesignal.com\/how-to-play.html/);
 assert.doesNotMatch(sitemap,/transfer|legacy-game|balance|playtest/);
 assert.match(await readFile(path.join(root,'robots.txt'),'utf8'),/Sitemap: https:\/\/playbeyondthesignal.com\/sitemap.xml/);
});
test('parallel mode leaves the main game untouched and rejects invalid mode',async t=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'main-site-mode-'));t.after(()=>rm(root,{recursive:true,force:true}));await writeFile(path.join(root,'index.html'),'game');
 await prepareMainSite(root,'game');assert.equal(await readFile(path.join(root,'index.html'),'utf8'),'game');await assert.rejects(access(path.join(root,'legacy-game.html')));await assert.rejects(prepareMainSite(root,'invalid'));
});
test('game links preserve QA campaigns but do not forward OAuth codes or arbitrary data',()=>{
 const url=gameAddress('https://playbeyondthesignal.com/?utm_source=automated_test&utm_medium=bot&utm_campaign=qa_01&code=secret&other=x',{transfer:true});
 assert.equal(url,'https://game.playbeyondthesignal.com/transfer.html?utm_source=automated_test&utm_medium=bot&utm_campaign=qa_01');
 assert.equal(gameAddress('https://playbeyondthesignal.com/welcome.html'),'https://game.playbeyondthesignal.com/');
 assert.equal(hasOriginalSave({length:1,key:()=> 'to-the-stars-progress-v1:user:123'}),true);assert.equal(hasOriginalSave({length:1,key:()=> 'to-the-stars-language'}),false);
});
