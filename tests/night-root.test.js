import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {rootDestination as site,rootTranslations} from '../src/nightRoot.js';
import {elysiumDestinations,canVisitElysium} from '../src/elysium.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {completeDestination} from '../src/destinations.js';
import {makeIceBoard,iceMatches,iceMove} from '../src/levelRules.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
import {tileSetFor} from '../src/tileSets.js';
const arrived={completed:4,airlockCompleted:3,navigationCompleted:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,exteriorCompleted:4,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:true,buoyCompleted:3,verdantCompleted:6,fractureCompleted:6,elysiumRouteCompleted:1,elysiumArrival:1,...Object.fromEntries(Object.values(elysiumDestinations).map(s=>[s.key,4])),riftEchoCompleted:4,riftPlatformCompleted:4,riftBeaconsCompleted:4,riftCrossed:1,gardenCompleted:6,researchCompleted:5,relayCompleted:4,nightGladeCompleted:5,nightGroveCompleted:5,scene:'night-root'};
test('root follows the grove, preserves replay, merge, logs and reset',()=>{
 assert.equal(normalizeProgress({...arrived,relayCompleted:3,nightRootCompleted:5}).nightRootCompleted,0);
 assert.equal(canVisitElysium({...arrived,relayCompleted:3},'night-root'),false);
 assert.equal(canVisitElysium({...arrived,nightGroveCompleted:4},'night-root'),false);
 assert.equal(normalizeProgress({...arrived,nightGroveCompleted:4,nightRootCompleted:5}).nightRootCompleted,0);
 let p=normalizeProgress(arrived);assert.equal(p.scene,'night-root');
 assert.equal(completeDestination(0,site.repairs[2].id,site.repairs),0);
 for(const r of site.repairs)p=normalizeProgress({...p,nightRootCompleted:completeDestination(p.nightRootCompleted,r.id,site.repairs)});
 p=normalizeProgress({...p,readIds:site.logs.map(l=>l.id)});assert.equal(p.nightRootCompleted,5);assert.equal(p.readIds.length,5);
 assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(p))),p);
 assert.equal(mergeProgress(normalizeProgress(arrived),p).nightRootCompleted,5);
 assert.equal(mergeProgress(p,normalizeProgress({resetRevision:1})).nightRootCompleted,0);
 assert.equal(completeDestination(5,site.repairs[0].id,site.repairs),5);
});
test('five root puzzles are playable and bilingual, same chapter tiles remain readable',()=>{
 missingTranslations.clear();let seed=1818;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const [i,r] of site.repairs.entries()){
  for(let n=0;n<30;n++){const b=makeIceBoard(r.level,r.ice,random);assert.deepEqual(iceMatches(b,r.level.cols),[]);assert.ok(iceMove(b,r.level.cols,r.ice));}
  for(const at of r.ice)assert.notEqual(r.level.mask[at],false);
  for(const ring of r.resonators){assert.equal(r.level.mask[ring.at],false);assert.ok(!r.ice.includes(ring.at));}
  for(const key of ['name','lesson','thought','result','room','action','objective'])translate(r[key],'cs');
  const sprites=tileSetFor(r).sprites;
  assert.equal(sprites.includes('night-pollen'),true);assert.equal(sprites.includes('night-root'),true);
 }
 for(const [en,cs] of Object.entries(rootTranslations))assert.equal(translate(en,'cs'),cs);
 assert.deepEqual([...missingTranslations],[]);
});


test('root cloud migration caps progress, guards prerequisites and resets it',()=>{
 const sql=readFileSync(new URL('../supabase/020_night_root.sql',import.meta.url),'utf8');
 assert.ok(sql.includes("('nightRootCompleted',5)"));
 assert.ok(sql.includes("'nightRootCompleted',0"));
 assert.ok(sql.includes("(result->>'nightGroveCompleted')::integer<5"));
 assert.ok(sql.includes("result->>'scene'='night-root'"));
});
