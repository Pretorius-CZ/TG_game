import test from 'node:test';
import assert from 'node:assert/strict';
import {relayDestination as site,relayTranslations} from '../src/relay.js';
import {elysiumDestinations} from '../src/elysium.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {completeDestination} from '../src/destinations.js';
import {makeIceBoard,iceMove,iceMatches} from '../src/levelRules.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
import {readFileSync} from 'node:fs';
const base={completed:4,airlockCompleted:3,navigationCompleted:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,exteriorCompleted:4,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:true,buoyCompleted:3,verdantCompleted:6,fractureCompleted:6,elysiumRouteCompleted:1,elysiumArrival:1,...Object.fromEntries(Object.values(elysiumDestinations).map(s=>[s.key,4]))};
const arrived={...base,riftEchoCompleted:4,riftPlatformCompleted:4,riftBeaconsCompleted:4,riftCrossed:1,gardenCompleted:6,researchCompleted:5,scene:'fading-relay'};
test('relay requires arrival, prevents skipping, persists and resets',()=>{
 assert.equal(normalizeProgress({...arrived,riftCrossed:0,relayCompleted:4}).relayCompleted,0);
 let p=normalizeProgress(arrived);
 assert.equal(completeDestination(0,site.repairs[2].id,site.repairs),0);
 for(const r of site.repairs)p=normalizeProgress({...p,relayCompleted:completeDestination(p.relayCompleted,r.id,site.repairs)});
 p=normalizeProgress({...p,readIds:site.logs.map(l=>l.id)});
 assert.equal(p.relayCompleted,4);assert.equal(p.readIds.length,4);
 assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(p))),p);
 assert.equal(completeDestination(4,site.repairs[0].id,site.repairs),4);
 assert.equal(mergeProgress(normalizeProgress(arrived),p).relayCompleted,4);
 assert.equal(mergeProgress(p,normalizeProgress({resetRevision:1})).relayCompleted,0);
});
test('four relay puzzles are stable, playable and translated',()=>{
 missingTranslations.clear();let seed=1616;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 assert.equal(site.repairs.length,4);assert.equal(site.logs.length,4);
 for(const [i,r] of site.repairs.entries()){
  for(let n=0;n<30;n++){const b=makeIceBoard(r.level,r.ice,random);assert.deepEqual(iceMatches(b,r.level.cols),[]);assert.ok(iceMove(b,r.level.cols,r.ice));}
  if(i<2)assert.equal(r.ice.length,0);
  for(const cell of r.ice)assert.ok(cell<r.level.cols*r.level.rows&&r.level.mask?.[cell]!==false);
  assert.equal(r.target,r.goals.reduce((sum,g)=>sum+g.target,0));
  for(const key of ['name','lesson','thought','result','room','action','objective'])translate(r[key],'cs');
 }
 for(const [en,cs] of Object.entries(relayTranslations))assert.equal(translate(en,'cs'),cs);
 assert.deepEqual([...missingTranslations],[]);
});
test('cloud migration includes relay cap, arrival prerequisite and reset',()=>{
 const sql=readFileSync(new URL('../supabase/015_relay.sql',import.meta.url),'utf8');
 assert.ok(sql.includes("('relayCompleted',4)"));assert.ok(sql.includes("'relayCompleted',0"));
 assert.ok(sql.includes('{"relayCompleted":0}'));
});


test('resonators count one orthogonal impulse per match wave and cap at target',async()=>{
 const {chargeResonators,resonatorsComplete}=await import('../src/resonators.js');
 const r=[{at:24,target:2},{at:26,target:3}];
 assert.deepEqual(chargeResonators(r,[0,0],[16,32],7),[0,0]);
 assert.deepEqual(chargeResonators(r,[0,0],[17,23,25,31],7),[1,1]);
 assert.deepEqual(chargeResonators(r,[1,1],[],7),[1,1]);
 assert.deepEqual(chargeResonators(r,[2,3],[25],7),[2,3]);
 assert.equal(resonatorsComplete(r,[2,2]),false);
 assert.equal(resonatorsComplete(r,[2,3]),true);
 for(const repair of site.repairs)for(const resonator of repair.resonators){assert.equal(repair.level.mask[resonator.at],false);assert.ok(!repair.ice.includes(resonator.at));}
});
