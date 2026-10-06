import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {refugeMedical as site,refugeMedicalTranslations as refugeTranslations} from '../src/refugeMedical.js';
import {elysiumDestinations,canVisitElysium} from '../src/elysium.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {completeDestination} from '../src/destinations.js';
import {makeIceBoard,iceMatches,iceMove} from '../src/levelRules.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
import {tileSetFor} from '../src/tileSets.js';
const arrived={completed:4,airlockCompleted:3,navigationCompleted:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,exteriorCompleted:4,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:true,buoyCompleted:3,verdantCompleted:6,fractureCompleted:6,elysiumRouteCompleted:1,elysiumArrival:1,...Object.fromEntries(Object.values(elysiumDestinations).map(s=>[s.key,4])),riftEchoCompleted:4,riftPlatformCompleted:4,riftBeaconsCompleted:4,riftCrossed:1,gardenCompleted:6,researchCompleted:5,relayCompleted:4,nightGladeCompleted:5,nightGroveCompleted:5,nightRootCompleted:5,nightSanctuaryCompleted:5,caretakerMet:1,refugeDockCompleted:5,refugeHomesCompleted:5,scene:'refuge-medical'};

test('medical entry requires the completed or skipped encounter, and preserves progress safely',()=>{
 assert.equal(canVisitElysium({...arrived,refugeHomesCompleted:4},'refuge-medical'),false);
 assert.equal(normalizeProgress({...arrived,refugeHomesCompleted:4,refugeMedicalCompleted:5}).refugeMedicalCompleted,0);
 assert.equal(canVisitElysium({...arrived,caretakerMet:0},'refuge-medical'),false);
 assert.equal(canVisitElysium({...arrived,nightSanctuaryCompleted:4},'refuge-medical'),false);
 assert.equal(normalizeProgress({...arrived,caretakerMet:0,refugeMedicalCompleted:5}).refugeMedicalCompleted,0);
 assert.equal(normalizeProgress({...arrived,nightSanctuaryCompleted:4,refugeMedicalCompleted:5}).refugeMedicalCompleted,0);
 let p=normalizeProgress(arrived);assert.equal(p.scene,'refuge-medical');
 assert.equal(completeDestination(0,site.repairs[2].id,site.repairs),0);
 for(const r of site.repairs)p=normalizeProgress({...p,refugeMedicalCompleted:completeDestination(p.refugeMedicalCompleted,r.id,site.repairs)});
 p=normalizeProgress({...p,readIds:site.logs.map(l=>l.id)});assert.equal(p.refugeMedicalCompleted,5);assert.equal(p.readIds.length,5);
 assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(p))),p);
 assert.equal(mergeProgress(normalizeProgress(arrived),p).refugeMedicalCompleted,5);
 assert.equal(mergeProgress(p,normalizeProgress({resetRevision:1})).refugeMedicalCompleted,0);
 assert.equal(completeDestination(5,site.repairs[0].id,site.repairs),5);
});
test('medical boards are stable and translated, and the refuge tile set remains consistent',()=>{
 missingTranslations.clear();let seed=22145;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const [i,r] of site.repairs.entries()){
  for(let n=0;n<30;n++){const b=makeIceBoard(r.level,r.ice,random);assert.deepEqual(iceMatches(b,r.level.cols),[]);assert.ok(iceMove(b,r.level.cols,r.ice));}
  for(const at of r.ice)assert.notEqual(r.level.mask[at],false);
  for(const ring of r.resonators){assert.equal(r.level.mask[ring.at],false);assert.ok(!r.ice.includes(ring.at));}
  for(const key of ['name','lesson','thought','result','room','action','objective'])translate(r[key],'cs');
  const tiles=tileSetFor(r);tiles.names.forEach(name=>translate(name,'cs'));
  assert.equal(tiles.sprites[3],'refuge-filter');
  assert.equal(tiles.sprites[4],'refuge-supply');
  assert.equal(tiles.sprites.length,6);
 }
 for(const [en,cs] of Object.entries(refugeTranslations))assert.equal(translate(en,'cs'),cs);
 assert.deepEqual([...missingTranslations],[]);
});
test('medical cloud migration validates encounter, cap and reset',()=>{
 const sql=readFileSync(new URL('../supabase/025_refuge_medical.sql',import.meta.url),'utf8');
 assert.ok(sql.includes("('refugeMedicalCompleted',5)"));
 assert.ok(sql.includes("'refugeMedicalCompleted',0"));
 assert.ok(sql.includes("(result->>'refugeHomesCompleted')::integer<5"));
 assert.ok(sql.includes("result->>'scene'='refuge-medical'"));
});
