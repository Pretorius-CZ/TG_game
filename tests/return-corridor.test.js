import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {returnCorridor as site} from '../src/returnCorridor.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {canVisitElysium,elysiumDestinations} from '../src/elysium.js';
import {completeDestination} from '../src/destinations.js';
import {chaptersFor} from '../src/chapters.js';
import {levelCatalog} from '../src/levelCatalog.js';
import {makeIceBoard,iceMatches,iceMove} from '../src/levelRules.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
const arrived={...{completed:4,airlockCompleted:3,navigationCompleted:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,exteriorCompleted:4,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:true,buoyCompleted:3,verdantCompleted:6,fractureCompleted:6,elysiumRouteCompleted:1,elysiumArrival:1,...Object.fromEntries(Object.values(elysiumDestinations).map(s=>[s.key,4])),riftEchoCompleted:4,riftPlatformCompleted:4,riftBeaconsCompleted:4,riftCrossed:1,gardenCompleted:6,researchCompleted:5,relayCompleted:4,nightGladeCompleted:5,nightGroveCompleted:5,nightRootCompleted:5,nightSanctuaryCompleted:5,caretakerMet:1,refugeDockCompleted:5,refugeHomesCompleted:5,scene:'refuge-medical'},refugeMedicalCompleted:5,scene:'return-corridor'};
test('return corridor gates, replay, save, merge and reset preserve the rescue sequence',()=>{
 assert.equal(canVisitElysium(arrived,'return-corridor'),true);
 assert.equal(canVisitElysium({...arrived,refugeMedicalCompleted:4},'return-corridor'),false);
 const locked=normalizeProgress({...arrived,refugeMedicalCompleted:4,returnCorridorCompleted:6});
 assert.equal(locked.returnCorridorCompleted,0);assert.notEqual(locked.scene,'return-corridor');
 let p=normalizeProgress(arrived);
 assert.equal(p.returnCorridorCompleted,0);
 assert.equal(completeDestination(0,site.repairs[1].id,site.repairs),0);
 for(const r of site.repairs)p=normalizeProgress({...p,returnCorridorCompleted:completeDestination(p.returnCorridorCompleted,r.id,site.repairs)});
 p=normalizeProgress({...p,readIds:site.logs.map(l=>l.id)});
 assert.equal(p.returnCorridorCompleted,6);assert.equal(p.readIds.length,6);
 assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(p))),p);
 assert.equal(mergeProgress(normalizeProgress(arrived),p).returnCorridorCompleted,6);
 assert.equal(mergeProgress(p,normalizeProgress({resetRevision:1})).returnCorridorCompleted,0);
 assert.equal(completeDestination(6,site.repairs[0].id,site.repairs),6);
 const chapter=chaptersFor(p).at(-1);assert.equal(chapter.number,10);assert.equal(chapter.done,6);assert.equal(chapter.total,6);
 assert.deepEqual(levelCatalog.slice(-6).map(r=>r.number),[156,157,158,159,160,161]);
 for(const r of site.repairs)assert.equal(p.stars[r.id],1);
});
test('return corridor boards generate legal starts and complete EN/CZ content',()=>{
 missingTranslations.clear();let seed=913;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(const r of site.repairs){
  for(let i=0;i<40;i++){const b=makeIceBoard(r.level,r.ice,random);assert.deepEqual(iceMatches(b,r.level.cols),[]);assert.ok(iceMove(b,r.level.cols,r.ice));}
  for(const at of r.ice)assert.equal(r.level.mask[at],true);
  for(const d of r.resonators){assert.equal(r.level.mask[d.at],false);assert.ok(!r.ice.includes(d.at));}
  for(const k of ['name','thought','result','room','action','objective'])translate(r[k],'cs');
 }
 for(const l of site.logs)for(const k of ['title','text','source','time'])translate(l[k],'cs');
 for(const k of ['title','chapter','complete','nextLabel'])translate(site[k],'cs');
 assert.deepEqual([...missingTranslations],[]);
});

test('cloud migration allows ratings for the full catalog and resets the added chapter',()=>{
 const sql=readFileSync(new URL('../supabase/029_return_corridor.sql',import.meta.url),'utf8');
 const cap=Number(sql.match(/jsonb_object_keys\(incoming->'stars'\)\)>(\d+)/)[1]);
 assert.equal(cap,levelCatalog.length);
 assert.ok(sql.includes("('returnCorridorCompleted',6)"));
 assert.ok(sql.includes("'returnCorridorCompleted',0"));
 assert.ok(sql.includes("(result->>'refugeMedicalCompleted')::integer<5"));
 for(const r of levelCatalog)assert.ok(sql.includes("('"+r.id+"','"));
});
