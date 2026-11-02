import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {networkDestinations,networkScenes,canVisitNetwork} from '../src/networkExpansion.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {journeyFor} from '../src/journey.js';
import {levelCatalog} from '../src/levelCatalog.js';
import {tileSetFor} from '../src/tileSets.js';
import {networkIntroStory} from '../src/networkStory.js';
import {normalizeStars} from '../src/starRating.js';

const finished200=()=>normalizeProgress({
 ...Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k==='completed'||k.endsWith('Completed')).map(k=>[k,99])),
 networkHandoverCompleted:0,networkPlatformCompleted:0,elysiumArrival:1,riftCrossed:1,caretakerMet:1,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,
});
test('200 remains the rescue milestone; 201–210 continue and survive stale saves',()=>{
 let p=finished200();assert.equal(Object.keys(p.stars).length,200);
 assert.equal(journeyFor(p).repair.number,201);assert.equal(networkIntroStory.ready(p),true);
 assert.equal(canVisitNetwork(p,'network-platform'),false);
 const old=structuredClone(p);
 for(let number=201;number<=210;number++){
  const next=journeyFor(p);assert.equal(next.repair.number,number);
  const site=networkDestinations[next.scene];assert.equal(canVisitNetwork(p,next.scene),true);
  p=normalizeProgress({...p,[site.key]:p[site.key]+1,scene:next.scene});
 }
 assert.equal(journeyFor(p).kind,'end');assert.equal(Object.keys(normalizeStars(p)).length,210);
 assert.deepEqual(mergeProgress(old,p).networkPlatformCompleted,5);
 assert.equal(normalizeProgress({...p,signalStationCompleted:3}).networkHandoverCompleted,0);
 assert.equal(normalizeProgress({...p,signalStationCompleted:3}).networkPlatformCompleted,0);
 assert.equal(mergeProgress(p,normalizeProgress({resetRevision:1})).networkHandoverCompleted,0);
 assert.deepEqual(levelCatalog.slice(200).map(r=>r.number),Array.from({length:10},(_,i)=>201+i));
});
test('new scene art, fixed hotspots and six distinct sprites are shipped',()=>{
 for(const scene of networkScenes){
  const site=networkDestinations[scene];assert.equal(site.repairs.length,5);assert.equal(site.clips.length,5);
  for(const suffix of ['', '-restored'])assert.ok(existsSync(`public/scenes/${site.image}${suffix}.png`));
  for(const r of site.repairs){
   assert.ok(r.x>=10&&r.x<=90&&r.y>=30&&r.y<=85);
   const tiles=tileSetFor(r);assert.equal(new Set(tiles.sprites).size,6);
   for(const sprite of tiles.sprites)assert.ok(existsSync(`public/tiles/${sprite}.png`));
  }
 }
});
test('migration retains previous version fields and declares all new levels and privileges',()=>{
 const sql=readFileSync('supabase/035_network_expansion.sql','utf8');
 for(const site of Object.values(networkDestinations)){
  assert.ok(sql.includes(`('${site.key}',5)`));
  for(const r of site.repairs)assert.ok(sql.includes(`('${r.id}','${site.key}',`));
 }
 assert.match(sql,/previous->>field/);assert.match(sql,/pg_advisory_xact_lock/);
 assert.match(sql,/grant execute on function public.sync_game_progress\(jsonb\) to authenticated/);
 assert.match(sql,/grant select,insert,update,delete on public.game_progress to service_role/);
});
