import test from 'node:test';
import assert from 'node:assert/strict';
import {researchDestination as site,researchTranslations} from '../src/research.js';
import {elysiumDestinations} from '../src/elysium.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {completeDestination} from '../src/destinations.js';
import {makeIceBoard,iceMove,iceMatches} from '../src/levelRules.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
import {readFileSync} from 'node:fs';
const base={completed:4,airlockCompleted:3,navigationCompleted:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,exteriorCompleted:4,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:true,buoyCompleted:3,verdantCompleted:6,fractureCompleted:6,elysiumRouteCompleted:1,elysiumArrival:1,...Object.fromEntries(Object.values(elysiumDestinations).map(s=>[s.key,4]))};
const arrived={...base,riftEchoCompleted:4,riftPlatformCompleted:4,riftBeaconsCompleted:4,riftCrossed:1,gardenCompleted:6,scene:'elysium-research'};
test('research requires arrival, prevents skipping, persists and resets',()=>{
 assert.equal(normalizeProgress({...arrived,riftCrossed:0,researchCompleted:5}).researchCompleted,0);
 let p=normalizeProgress(arrived);
 assert.equal(completeDestination(0,site.repairs[2].id,site.repairs),0);
 for(const r of site.repairs)p=normalizeProgress({...p,researchCompleted:completeDestination(p.researchCompleted,r.id,site.repairs)});
 p=normalizeProgress({...p,readIds:site.logs.map(l=>l.id)});
 assert.equal(p.researchCompleted,5);assert.equal(p.readIds.length,5);
 assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(p))),p);
 assert.equal(completeDestination(5,site.repairs[0].id,site.repairs),5);
 assert.equal(mergeProgress(normalizeProgress(arrived),p).researchCompleted,5);
 assert.equal(mergeProgress(p,normalizeProgress({resetRevision:1})).researchCompleted,0);
});
test('five research puzzles are stable, playable and translated',()=>{
 missingTranslations.clear();let seed=1616;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 assert.equal(site.repairs.length,5);assert.equal(site.logs.length,5);
 for(const [i,r] of site.repairs.entries()){
  for(let n=0;n<30;n++){const b=makeIceBoard(r.level,r.ice,random);assert.deepEqual(iceMatches(b,r.level.cols),[]);assert.ok(iceMove(b,r.level.cols,r.ice));}
  if(i<2)assert.equal(r.ice.length,0);
  for(const cell of r.ice)assert.ok(cell<r.level.cols*r.level.rows&&r.level.mask?.[cell]!==false);
  assert.equal(r.target,r.goals.reduce((sum,g)=>sum+g.target,0));
  for(const key of ['name','lesson','thought','result','room','action','objective'])translate(r[key],'cs');
 }
 for(const [en,cs] of Object.entries(researchTranslations))assert.equal(translate(en,'cs'),cs);
 assert.deepEqual([...missingTranslations],[]);
});
test('cloud migration includes research cap, arrival prerequisite and reset',()=>{
 const sql=readFileSync(new URL('../supabase/014_research.sql',import.meta.url),'utf8');
 assert.ok(sql.includes("('researchCompleted',5)"));assert.ok(sql.includes("'researchCompleted',0"));
 assert.ok(sql.includes('{"researchCompleted":0}'));
});

