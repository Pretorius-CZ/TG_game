import test from 'node:test';
import assert from 'node:assert/strict';
import {asterDestinations,asterLogs,canVisitAster,asterComplete} from '../src/aster.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {makeIceBoard,iceMove,iceMatches} from '../src/levelRules.js';
import {completeDestination} from '../src/destinations.js';
import {tileSetFor} from '../src/tileSets.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
const base={completed:4,airlockCompleted:3,navigationCompleted:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,exteriorCompleted:4,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:true};
test('arrival opens buoy; both planets require all three buoy repairs',()=>{
 assert.equal(canVisitAster({},'buoy'),false);
 for(let n=0;n<=3;n++){
  const p=normalizeProgress({...base,buoyCompleted:n,verdantCompleted:6,fractureCompleted:6,scene:'verdant'});
  assert.equal(canVisitAster(p,'buoy'),true);
  assert.equal(canVisitAster(p,'verdant'),n===3);
  assert.equal(canVisitAster(p,'fracture'),n===3);
  assert.equal(p.verdantCompleted,n===3?6:0);
  assert.equal(p.scene,n===3?'verdant':'system2');
 }
 assert.equal(normalizeProgress({...base,jumpDone:false,buoyCompleted:3}).buoyCompleted,0);
});
test('both planet orders persist, stale saves merge, replay cannot duplicate, reset clears all',()=>{
 for(const order of [['verdant','fracture'],['fracture','verdant']]){
  let p=normalizeProgress({...base,buoyCompleted:3});
  for(const name of order){const site=asterDestinations[name];for(const repair of site.repairs)p[site.key]=completeDestination(p[site.key],repair.id,site.repairs);assert.equal(completeDestination(6,site.repairs[0].id,site.repairs),6);}
  p=normalizeProgress({...p,readIds:asterLogs.map(e=>e.id),scene:order[1]});
  assert.equal(asterComplete(p),true);assert.equal(p.readIds.length,15);
  const merged=mergeProgress(normalizeProgress(base),JSON.parse(JSON.stringify(p)));
  assert.equal(asterComplete(merged),true);assert.equal(merged.readIds.length,15);
  const reset=mergeProgress(merged,normalizeProgress({resetRevision:1}));
  assert.equal(reset.buoyCompleted,0);assert.equal(reset.verdantCompleted,0);assert.equal(reset.fractureCompleted,0);
 }
});
test('all 15 puzzles open playable and use translated themed goals without changing old tiles',()=>{
 missingTranslations.clear();let seed=19;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const site of Object.values(asterDestinations)){
  assert.equal(site.logs.length,site.repairs.length);assert.equal(site.clips.length,site.repairs.length);
  for(const r of site.repairs){
   for(let i=0;i<12;i++){const b=makeIceBoard(r.level,r.ice,random);assert.deepEqual(iceMatches(b,r.level.cols),[]);assert.ok(iceMove(b,r.level.cols,r.ice));}
   for(const f of ['name','lesson','thought','result','action','objective'])translate(r[f],'cs');
   for(const g of r.goals)translate(g.label,'cs');
   assert.equal(tileSetFor(r).sprites[3],'aster-ore');assert.equal(tileSetFor(r).sprites[5],'aster-bio');
  }
 }
 assert.equal(asterLogs.length,15);assert.equal(new Set(asterLogs.map(e=>e.id)).size,15);
 assert.equal(tileSetFor({}).sprites[3],'asteroid');assert.equal(tileSetFor({}).sprites[5],'orb');
 assert.deepEqual([...missingTranslations],[]);
});
