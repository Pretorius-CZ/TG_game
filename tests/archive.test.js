import {createHash} from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {archiveDestinations as sites,archiveScenes as scenes} from '../src/archive.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {canVisitElysium} from '../src/elysium.js';
import {completeDestination} from '../src/destinations.js';
import {chaptersFor,chapterSectionOpen} from '../src/chapters.js';
import {levelCatalog} from '../src/levelCatalog.js';
import {makeGoalBoard} from '../src/goalRefill.js';
import {iceMove,iceMatches} from '../src/levelRules.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
function arrived(){const raw=Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k.endsWith('Completed')||k==='completed').map(k=>[k,6]));return normalizeProgress({...raw,...Object.fromEntries(Object.values(sites).map(s=>[s.key,0])),elysiumRouteCompleted:1,elysiumArrival:1,riftCrossed:1,caretakerMet:1,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,scene:scenes[0]});}
test('archive follows the rescued crew; its four areas persist and cannot be skipped',()=>{
 let p=arrived();const before=JSON.parse(JSON.stringify(p));
 assert.equal(canVisitElysium(p,scenes[0]),true);assert.equal(canVisitElysium({...p,refugeArrivalCompleted:5},scenes[0]),false);
 for(const [i,scene] of scenes.entries()){
  const site=sites[scene];assert.equal(canVisitElysium(p,scene),true);
  if(i<3)assert.equal(canVisitElysium(p,scenes[i+1]),false);
  assert.equal(completeDestination(0,site.repairs[1].id,site.repairs),0);
  for(const r of site.repairs)p=normalizeProgress({...p,[site.key]:completeDestination(p[site.key],r.id,site.repairs)});
  assert.equal(completeDestination(5,site.repairs[0].id,site.repairs),5);
 }
 p=normalizeProgress({...p,scene:scenes[3],readIds:Object.values(sites).flatMap(s=>s.logs.map(l=>l.id))});
 assert.equal(p.readIds.length,20);assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(p))),p);
 for(const s of Object.values(sites))assert.equal(mergeProgress(before,p)[s.key],5);
 assert.equal(mergeProgress(p,normalizeProgress({resetRevision:1})).archiveCoreCompleted,0);
 const invalid=normalizeProgress({...p,refugeArrivalCompleted:5});for(const s of Object.values(sites))assert.equal(invalid[s.key],0);
 const chapter=chaptersFor(p).at(-1);assert.equal(chapter.number,9);assert.equal(chapter.total,20);assert.equal(chapter.done,20);
 assert.deepEqual(levelCatalog.slice(167).map(r=>r.number),Array.from({length:20},(_,i)=>168+i));
 for(const s of Object.values(sites))for(const r of s.repairs)assert.equal(p.stars[r.id],1);
});
test('chapter regrouping preserves catalog order and gates within the living map',()=>{
 const p=arrived(),rows=chaptersFor(p);assert.deepEqual(rows.map(c=>c.total),[29,24,16,24,12,15,20,27,20]);
 const living=rows.find(c=>c.id==='ring');assert.equal(chapterSectionOpen({...p,riftCrossed:0},living,'elysium-research'),false);
 // Catalog after the approved 2026-10-17 refuge rebalance: IDs, order,
 // names and sizes preserved; nineteen move budgets intentionally changed.
 assert.equal(createHash('sha256').update(JSON.stringify(levelCatalog.slice(0,167))).digest('hex'),'460d9e6cf487ad534eaa8b94cafc452a29585c93d6f39a37a076b4d060a3d2f1');
});
test('archive boards, bilingual content, images and migration cover all twenty tasks',()=>{
 missingTranslations.clear();let seed=2701;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const site of Object.values(sites)){
  assert.ok(existsSync(new URL('../public/scenes/'+site.image+'.webp',import.meta.url)));
  for(const r of site.repairs){for(const k of ['name','thought','result','objective','action','room'])translate(r[k],'cs');
   for(let n=0;n<20;n++){const board=makeGoalBoard(r.level,r.goals,r.ice,random);assert.equal(iceMatches(board,r.level.cols,r.ice).length,0);assert.ok(iceMove(board,r.level.cols,r.ice));}
  }
  for(const l of site.logs)for(const k of ['title','text','source','time'])translate(l[k],'cs');
  for(const k of ['title','chapter','complete','nextLabel'])translate(site[k],'cs');
 }
 assert.deepEqual([...missingTranslations],[]);
 const sql=readFileSync(new URL('../supabase/031_archive_echoes.sql',import.meta.url),'utf8');
 assert.match(sql,/jsonb_object_keys\(incoming->'stars'\)\)>187/);
 for(const [scene,s] of Object.entries(sites)){assert.ok(sql.includes("('"+s.key+"',5)"));assert.ok(sql.includes("'"+s.key+"',0"));assert.ok(sql.includes("scene'='"+scene+"'"));for(const r of s.repairs)assert.ok(sql.includes("('"+r.id+"','"+s.key+"'"));}
});
