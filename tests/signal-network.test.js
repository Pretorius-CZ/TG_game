import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync,readFileSync} from 'node:fs';
import {signalDestinations as sites,signalScenes as scenes} from '../src/signalNetwork.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {canVisitElysium} from '../src/elysium.js';
import {journeyFor} from '../src/journey.js';
import {levelCatalog} from '../src/levelCatalog.js';
import {completeDestination} from '../src/destinations.js';
import {makeGoalBoard} from '../src/goalRefill.js';
import {iceMatches,iceMove} from '../src/levelRules.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
import {journeyStories} from '../src/journeyStories.js';
export function afterArchive(){const raw=Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k.endsWith('Completed')||k==='completed').map(k=>[k,6]));return normalizeProgress({...raw,...Object.fromEntries(Object.values(sites).map(s=>[s.key,0])),elysiumRouteCompleted:1,elysiumArrival:1,riftCrossed:1,caretakerMet:1,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,scene:scenes[0]});}
test('thirteen consecutive tasks close the signal journey exactly at level 200',()=>{
 // Baseline includes approved 2026-10-23 limits and the20 unchanged archive repairs.
 assert.equal(createHash('sha256').update(JSON.stringify(levelCatalog.slice(0,187))).digest('hex'),'11f7fefa87fb8d51787ed280c11a969611099e61f3cf6375228cf5cb319f2de3');
 let p=afterArchive();const before=structuredClone(p);
 assert.deepEqual(levelCatalog.slice(187).map(r=>r.number),Array.from({length:13},(_,i)=>188+i));
 for(const [i,scene] of scenes.entries()){
  const site=sites[scene];assert.equal(canVisitElysium(p,scene),true);if(i<3)assert.equal(canVisitElysium(p,scenes[i+1]),false);
  assert.equal(completeDestination(0,site.repairs[1].id,site.repairs),0);
  for(const repair of site.repairs){assert.equal(journeyFor(p).repair.id,repair.id);p=normalizeProgress({...p,[site.key]:completeDestination(p[site.key],repair.id,site.repairs)});}
  assert.equal(completeDestination(site.repairs.length,site.repairs[0].id,site.repairs),site.repairs.length);
 }
 assert.equal(journeyFor(p).kind,'end');assert.equal(journeyFor(p).scene,'signal-station');
 assert.equal(journeyFor({...p,signalStationCompleted:3}).kind,'repair');
 assert.equal(Object.keys(p.stars).length,200);
 for(const site of Object.values(sites))assert.equal(mergeProgress(before,p)[site.key],site.repairs.length);
 assert.equal(mergeProgress(p,normalizeProgress({resetRevision:1})).signalStationCompleted,0);
 for(const site of Object.values(sites))assert.equal(normalizeProgress({...p,archiveCoreCompleted:4})[site.key],0);
 assert.equal(canVisitElysium({...p,archiveCoreCompleted:4},scenes[0]),false);
});
test('new boards and all story text are playable, translated and backed by project artwork',()=>{
 missingTranslations.clear();let seed=200;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const site of Object.values(sites)){
  assert.ok(existsSync(new URL('../public/scenes/'+site.image+'.webp',import.meta.url)));
  for(const repair of site.repairs){
   for(const key of ['name','thought','result','objective','room','action'])translate(repair[key],'cs');
   for(let i=0;i<20;i++){const board=makeGoalBoard(repair.level,repair.goals,repair.ice,random);assert.equal(iceMatches(board,repair.level.cols,repair.ice).length,0);assert.ok(iceMove(board,repair.level.cols,repair.ice));}
  }
  for(const log of site.logs)for(const key of ['title','text','source','time'])translate(log[key],'cs');
  for(const key of ['title','chapter','complete','nextLabel'])translate(site[key],'cs');
 }
 assert.deepEqual([...missingTranslations],[]);
 const finale=journeyStories.find(s=>s.id==='signal-delivered-200');assert.equal(finale.ready({signalStationCompleted:3}),false);assert.equal(finale.ready({signalStationCompleted:4}),true);
 const sql=readFileSync(new URL('../supabase/034_signal_answer.sql',import.meta.url),'utf8');
 for(const site of Object.values(sites)){assert.ok(sql.includes(`('${site.key}',${site.repairs.length})`));for(const r of site.repairs)assert.ok(sql.includes(`('${r.id}','${site.key}'`));}
});
