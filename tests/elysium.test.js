import test from 'node:test';
import assert from 'node:assert/strict';
import {elysiumDestinations,elysiumRoute,elysiumRouteLog,elysiumArrivalLog,canVisitElysium} from '../src/elysium.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {makeIceBoard,iceMove,iceMatches} from '../src/levelRules.js';
import {completeDestination} from '../src/destinations.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
const base={completed:4,airlockCompleted:3,navigationCompleted:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,exteriorCompleted:4,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:true,buoyCompleted:3,verdantCompleted:6,fractureCompleted:6};
test('Elysium requires both records, route and arrival; core requires completed dock',()=>{
 const full={...base,elysiumRouteCompleted:1,elysiumArrival:1,elysiumDockCompleted:4,elysiumCoreCompleted:4,scene:'elysium-core'};
 for(const [key,value] of [['verdantCompleted',5],['fractureCompleted',5],['elysiumRouteCompleted',0],['elysiumArrival',0],['elysiumDockCompleted',3]]){
  const p=normalizeProgress({...full,[key]:value});assert.equal(canVisitElysium(p,'elysium-core'),false);assert.equal(p.elysiumCoreCompleted,0);assert.equal(p.scene,'system2');
 }
 assert.equal(canVisitElysium(normalizeProgress(full),'elysium-core'),true);
 assert.equal(normalizeProgress({...base,elysiumRouteCompleted:1}).elysiumArrival,0);
});
test('station repairs persist, replay does not advance; reset generation wins',()=>{
 let p=normalizeProgress({...base,elysiumRouteCompleted:1,elysiumArrival:1});
 for(const site of Object.values(elysiumDestinations))for(const repair of site.repairs){p[site.key]=completeDestination(p[site.key],repair.id,site.repairs);p=normalizeProgress(p);}
 const ids=[elysiumRouteLog,elysiumArrivalLog,...Object.values(elysiumDestinations).flatMap(s=>s.logs)].map(e=>e.id);
 p=normalizeProgress({...p,readIds:ids,scene:'elysium-core'});assert.equal(p.readIds.length,10);
 const merged=mergeProgress(normalizeProgress(base),JSON.parse(JSON.stringify(p)));assert.equal(merged.elysiumCoreCompleted,4);assert.equal(merged.readIds.length,10);
 assert.equal(completeDestination(4,elysiumDestinations['elysium-dock'].repairs[0].id,elysiumDestinations['elysium-dock'].repairs),4);
 const reset=mergeProgress(p,normalizeProgress({resetRevision:1}));for(const key of ['elysiumRouteCompleted','elysiumArrival','elysiumDockCompleted','elysiumCoreCompleted'])assert.equal(reset[key],0);
});
test('all nine Elysium puzzles start playable; stories and goals are bilingual',()=>{
 missingTranslations.clear();let seed=73;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const r of [elysiumRoute,...Object.values(elysiumDestinations).flatMap(s=>s.repairs)]){
  for(let i=0;i<12;i++){const board=makeIceBoard(r.level,r.ice,random);assert.deepEqual(iceMatches(board,r.level.cols),[]);assert.ok(iceMove(board,r.level.cols,r.ice));}
  for(const key of ['name','lesson','thought','result','objective','action'])if(r[key])translate(r[key],'cs');
 }
 for(const log of [elysiumRouteLog,elysiumArrivalLog,...Object.values(elysiumDestinations).flatMap(s=>s.logs)])for(const key of ['title','text','source','time'])translate(log[key],'cs');
 assert.deepEqual([...missingTranslations],[]);
});
