import test from 'node:test';
import assert from 'node:assert/strict';
import {riftDestinations,riftOrder,riftScenes,canVisitRift,riftReady,crossRift,riftArrivalLog,riftTranslations} from '../src/rift.js';
import {elysiumDestinations} from '../src/elysium.js';
import {normalizeProgress,mergeProgress,storeProgress,loadProgress} from '../src/progressStorage.js';
import {completeDestination} from '../src/destinations.js';
import {makeIceBoard,iceMove,iceMatches} from '../src/levelRules.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
const base={completed:4,airlockCompleted:3,navigationCompleted:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,exteriorCompleted:4,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:true,buoyCompleted:3,verdantCompleted:6,fractureCompleted:6,elysiumRouteCompleted:1,elysiumArrival:1,...Object.fromEntries(Object.values(elysiumDestinations).map(s=>[s.key,4]))};
test('Rift unlocks after Elysium and the three expeditions enforce order',()=>{
 let p=normalizeProgress({...base,elysiumObservatoryCompleted:3,riftEchoCompleted:4,riftPlatformCompleted:4,riftBeaconsCompleted:4,riftCrossed:1,scene:'beyond-rift'});
 for(const s of riftScenes)assert.equal(canVisitRift(p,s),false);
 assert.equal(p.riftEchoCompleted,0);assert.equal(p.riftCrossed,0);assert.equal(p.scene,'elysium');
 p=normalizeProgress(base);
 for(const [i,id] of riftOrder.entries()){
  assert.equal(canVisitRift(p,id),true);
  for(const next of riftOrder.slice(i+1))assert.equal(canVisitRift(p,next),false);
  const site=riftDestinations[id];
  assert.equal(completeDestination(0,site.repairs[2].id,site.repairs),0);
  for(const r of site.repairs){assert.equal(riftReady(p),false);p=normalizeProgress({...p,[site.key]:completeDestination(p[site.key],r.id,site.repairs),scene:id});}
  assert.equal(p[site.key],4);assert.equal(p.scene,id);
 }
 assert.equal(riftReady(p),true);assert.equal(canVisitRift(p,'beyond-rift'),false);
 const crossed=normalizeProgress(crossRift(p));assert.equal(crossed.riftCrossed,1);assert.equal(crossed.scene,'beyond-rift');
 assert.equal(canVisitRift(crossed,'beyond-rift'),true);assert.deepEqual(crossRift(crossed),crossed);
 assert.equal(crossRift(normalizeProgress(base)).riftCrossed,0);
});
test('new progress, arrival and logs survive save, merge, replay and reset',()=>{
 const all={...base,riftEchoCompleted:4,riftPlatformCompleted:4,riftBeaconsCompleted:4,riftCrossed:1,scene:'beyond-rift',readIds:[riftArrivalLog.id,...Object.values(riftDestinations).flatMap(s=>s.logs.map(l=>l.id))]};
 const p=normalizeProgress(all);assert.equal(p.readIds.length,13);
 const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 storeProgress(storage,p);assert.deepEqual(loadProgress(storage).progress,p);
 const merged=mergeProgress(normalizeProgress(base),p);assert.equal(merged.riftCrossed,1);assert.equal(merged.readIds.length,13);
 for(const s of Object.values(riftDestinations))assert.equal(completeDestination(4,s.repairs[0].id,s.repairs),4);
 const reset=mergeProgress(p,normalizeProgress({resetRevision:1}));assert.equal(reset.riftCrossed,0);assert.equal(reset.riftEchoCompleted,0);assert.deepEqual(reset.readIds,[]);
 for(const key of ['riftEchoCompleted','riftPlatformCompleted','riftBeaconsCompleted']){
  const partial=normalizeProgress({...all,[key]:3});assert.equal(partial.riftCrossed,0);assert.notEqual(partial.scene,'beyond-rift');assert.ok(!partial.readIds.includes(riftArrivalLog.id));
 }
});
test('all twelve Rift boards start playable and all story text is bilingual',()=>{
 missingTranslations.clear();let seed=913;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const site of Object.values(riftDestinations)){
  for(const key of ['title','complete','chapter'])translate(site[key],'cs');
  for(const r of site.repairs){
   for(let i=0;i<20;i++){const b=makeIceBoard(r.level,r.ice,random);assert.deepEqual(iceMatches(b,r.level.cols),[]);assert.ok(iceMove(b,r.level.cols,r.ice));}
   assert.ok(r.moves>0);assert.equal(r.target,r.goals.reduce((n,g)=>n+g.target,0));
   for(const key of ['name','lesson','thought','result','objective','action','room'])translate(r[key],'cs');
   for(const cell of r.ice)assert.ok(cell<r.level.cols*r.level.rows&&r.level.mask?.[cell]!==false);
  }
  for(const l of site.logs)for(const key of ['title','text','source','time'])translate(l[key],'cs');
 }
 for(const [en,cs] of Object.entries(riftTranslations))assert.equal(translate(en,'cs'),cs);
 assert.deepEqual([...missingTranslations],[]);
});
