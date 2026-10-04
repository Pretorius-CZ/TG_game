import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {refugeHomes as site,refugeHomesTranslations as refugeTranslations} from '../src/refugeHomes.js';
import {elysiumDestinations,canVisitElysium} from '../src/elysium.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {completeDestination} from '../src/destinations.js';
import {makeIceBoard,iceMatches,iceMove} from '../src/levelRules.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
import {tileSetFor} from '../src/tileSets.js';
const arrived={completed:4,airlockCompleted:3,navigationCompleted:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,exteriorCompleted:4,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:true,buoyCompleted:3,verdantCompleted:6,fractureCompleted:6,elysiumRouteCompleted:1,elysiumArrival:1,...Object.fromEntries(Object.values(elysiumDestinations).map(s=>[s.key,4])),riftEchoCompleted:4,riftPlatformCompleted:4,riftBeaconsCompleted:4,riftCrossed:1,gardenCompleted:6,researchCompleted:5,relayCompleted:4,nightGladeCompleted:5,nightGroveCompleted:5,nightRootCompleted:5,nightSanctuaryCompleted:5,caretakerMet:1,refugeDockCompleted:5,scene:'refuge-homes'};

test('residential entry requires the completed or skipped encounter, and preserves progress safely',()=>{
 assert.equal(canVisitElysium({...arrived,refugeDockCompleted:4},'refuge-homes'),false);
 assert.equal(normalizeProgress({...arrived,refugeDockCompleted:4,refugeHomesCompleted:5}).refugeHomesCompleted,0);
 assert.equal(canVisitElysium({...arrived,caretakerMet:0},'refuge-homes'),false);
 assert.equal(canVisitElysium({...arrived,nightSanctuaryCompleted:4},'refuge-homes'),false);
 assert.equal(normalizeProgress({...arrived,caretakerMet:0,refugeHomesCompleted:5}).refugeHomesCompleted,0);
 assert.equal(normalizeProgress({...arrived,nightSanctuaryCompleted:4,refugeHomesCompleted:5}).refugeHomesCompleted,0);
 let p=normalizeProgress(arrived);assert.equal(p.scene,'refuge-homes');
 assert.equal(completeDestination(0,site.repairs[2].id,site.repairs),0);
 for(const r of site.repairs)p=normalizeProgress({...p,refugeHomesCompleted:completeDestination(p.refugeHomesCompleted,r.id,site.repairs)});
 p=normalizeProgress({...p,readIds:site.logs.map(l=>l.id)});assert.equal(p.refugeHomesCompleted,5);assert.equal(p.readIds.length,5);
 assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(p))),p);
 assert.equal(mergeProgress(normalizeProgress(arrived),p).refugeHomesCompleted,5);
 assert.equal(mergeProgress(p,normalizeProgress({resetRevision:1})).refugeHomesCompleted,0);
 assert.equal(completeDestination(5,site.repairs[0].id,site.repairs),5);
});
test('residential boards are stable and translated, and new tiles enter one at a time',()=>{
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
test('residential cloud migration validates encounter, cap and reset',()=>{
 const sql=readFileSync(new URL('../supabase/023_refuge_homes.sql',import.meta.url),'utf8');
 assert.ok(sql.includes("('refugeHomesCompleted',5)"));
 assert.ok(sql.includes("'refugeHomesCompleted',0"));
 assert.ok(sql.includes("(result->>'refugeDockCompleted')::integer<5"));
 assert.ok(sql.includes("result->>'scene'='refuge-homes'"));
});
