import {caretakerLog,caretakerPanels,caretakerTranslations,caretakerReady} from '../src/caretakerStory.js';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {sanctuaryDestination as site,sanctuaryTranslations} from '../src/nightSanctuary.js';
import {elysiumDestinations,canVisitElysium} from '../src/elysium.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {completeDestination} from '../src/destinations.js';
import {makeIceBoard,iceMatches,iceMove} from '../src/levelRules.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
import {tileSetFor} from '../src/tileSets.js';
const arrived={completed:4,airlockCompleted:3,navigationCompleted:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,exteriorCompleted:4,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:true,buoyCompleted:3,verdantCompleted:6,fractureCompleted:6,elysiumRouteCompleted:1,elysiumArrival:1,...Object.fromEntries(Object.values(elysiumDestinations).map(s=>[s.key,4])),riftEchoCompleted:4,riftPlatformCompleted:4,riftBeaconsCompleted:4,riftCrossed:1,gardenCompleted:6,researchCompleted:5,relayCompleted:4,nightGladeCompleted:5,nightGroveCompleted:5,nightRootCompleted:5,scene:'night-sanctuary'};
test('sanctuary follows the root chamber, preserves replay, merge, logs and reset',()=>{
 assert.equal(normalizeProgress({...arrived,relayCompleted:3,nightSanctuaryCompleted:5}).nightSanctuaryCompleted,0);
 assert.equal(canVisitElysium({...arrived,relayCompleted:3},'night-sanctuary'),false);
 assert.equal(canVisitElysium({...arrived,nightRootCompleted:4},'night-sanctuary'),false);
 assert.equal(normalizeProgress({...arrived,nightRootCompleted:4,nightSanctuaryCompleted:5}).nightSanctuaryCompleted,0);
 let p=normalizeProgress(arrived);assert.equal(p.scene,'night-sanctuary');
 assert.equal(completeDestination(0,site.repairs[2].id,site.repairs),0);
 for(const r of site.repairs)p=normalizeProgress({...p,nightSanctuaryCompleted:completeDestination(p.nightSanctuaryCompleted,r.id,site.repairs)});
 p=normalizeProgress({...p,readIds:site.logs.map(l=>l.id)});assert.equal(p.nightSanctuaryCompleted,5);assert.equal(p.readIds.length,5);
 assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(p))),p);
 assert.equal(mergeProgress(normalizeProgress(arrived),p).nightSanctuaryCompleted,5);
 assert.equal(mergeProgress(p,normalizeProgress({resetRevision:1})).nightSanctuaryCompleted,0);
 assert.equal(completeDestination(5,site.repairs[0].id,site.repairs),5);
});
test('five sanctuary puzzles are playable and bilingual, same chapter tiles remain readable',()=>{
 missingTranslations.clear();let seed=1818;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const [i,r] of site.repairs.entries()){
  for(let n=0;n<30;n++){const b=makeIceBoard(r.level,r.ice,random);assert.deepEqual(iceMatches(b,r.level.cols),[]);assert.ok(iceMove(b,r.level.cols,r.ice));}
  for(const at of r.ice)assert.notEqual(r.level.mask[at],false);
  for(const ring of r.resonators){assert.equal(r.level.mask[ring.at],false);assert.ok(!r.ice.includes(ring.at));}
  for(const key of ['name','lesson','thought','result','room','action','objective'])translate(r[key],'cs');
  const sprites=tileSetFor(r).sprites;
  assert.equal(sprites.includes('night-pollen'),true);assert.equal(sprites.includes('night-root'),true);
 }
 for(const [en,cs] of Object.entries(sanctuaryTranslations))assert.equal(translate(en,'cs'),cs);
 assert.deepEqual([...missingTranslations],[]);
});


test('sanctuary cloud migration caps progress, guards prerequisites and resets it',()=>{
 const sql=readFileSync(new URL('../supabase/021_caretaker.sql',import.meta.url),'utf8');
 assert.ok(sql.includes("('nightSanctuaryCompleted',5)"));
 assert.ok(sql.includes("'nightSanctuaryCompleted',0"));
 assert.ok(sql.includes("(result->>'nightRootCompleted')::integer<5"));
 assert.ok(sql.includes("result->>'scene'='night-sanctuary'"));
 assert.ok(sql.includes("('caretakerMet',1)"));
 assert.ok(sql.includes("'caretakerMet',0"));
 assert.ok(sql.includes("(result->>'nightSanctuaryCompleted')::integer<5"));
});

test('encounter is gated by level 140 and survives merge, reload and reset',()=>{
 assert.equal(caretakerReady(arrived),false);
 assert.equal(normalizeProgress({...arrived,caretakerMet:1}).caretakerMet,0);
 const met=normalizeProgress({...arrived,nightSanctuaryCompleted:5,caretakerMet:1,readIds:[caretakerLog.id]});
 assert.equal(caretakerReady(met),true);assert.equal(met.caretakerMet,1);
 assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(met))),met);
 assert.equal(mergeProgress(normalizeProgress(arrived),met).caretakerMet,1);
 assert.equal(mergeProgress(met,normalizeProgress({resetRevision:1})).caretakerMet,0);
 assert.ok(met.readIds.includes(caretakerLog.id));
 assert.equal(caretakerPanels.length,3);
 for(const [en,cs] of Object.entries(caretakerTranslations))assert.equal(translate(en,'cs'),cs);
});
