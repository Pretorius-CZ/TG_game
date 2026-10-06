import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {earnedStars,completedLevelIds} from '../src/starRating.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {levelCatalog} from '../src/levelCatalog.js';
test('stars use original moves and rounded-up boundaries, including ad continuation',()=>{
 assert.equal(earnedStars(20,14),3);assert.equal(earnedStars(20,15),2);
 assert.equal(earnedStars(20,17),2);assert.equal(earnedStars(20,18),1);
 assert.equal(earnedStars(27,18),3);assert.equal(earnedStars(27,19),2);
 assert.equal(earnedStars(20,23),1);assert.equal(earnedStars(20,20),1);
});
test('old completion gains one star, unknown and unfinished ratings are discarded',()=>{
 const p=normalizeProgress({airlockCompleted:1,stars:{'airlock-power':3,lights:3,fake:3}});
 assert.deepEqual(p.stars,{'airlock-power':3});
 assert.deepEqual(normalizeProgress({airlockCompleted:1}).stars,{'airlock-power':1});
 assert.equal(normalizeProgress({airlockCompleted:1,stars:{'airlock-power':9}}).stars['airlock-power'],1);
});
test('best rating survives both merge orders and reset defeats old ratings',()=>{
 const best=normalizeProgress({airlockCompleted:1,stars:{'airlock-power':3}}),old=normalizeProgress({airlockCompleted:1});
 assert.equal(mergeProgress(best,old).stars['airlock-power'],3);
 assert.equal(mergeProgress(old,best).stars['airlock-power'],3);
 assert.deepEqual(mergeProgress(best,normalizeProgress({resetRevision:1})).stars,{});
});
test('all 150 completed levels receive stars, including launch and approach',()=>{
 const raw=Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k.endsWith('Completed')||k==='completed').map(k=>[k,6]));
 const p=normalizeProgress({...raw,elysiumRouteCompleted:1,elysiumArrival:1,riftCrossed:1,caretakerMet:1,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true});
 assert.equal(Object.keys(p.stars).length,150);
 assert.deepEqual(new Set(completedLevelIds(p)),new Set(levelCatalog.map(r=>r.id)));
 assert.ok(Object.values(p.stars).every(n=>n===1));
 const sql=readFileSync(new URL('../supabase/024_star_ratings.sql',import.meta.url),'utf8');
 for(const r of levelCatalog)assert.ok(sql.includes("('"+r.id+"','"));
 assert.ok(sql.includes("'stars','{}'::jsonb"));
});
