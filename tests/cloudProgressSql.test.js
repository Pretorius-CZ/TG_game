import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {networkStops} from '../src/networkExpansion.js';
import {networkDestinations} from '../src/networkExpansion.js';

test('SQL036 restores two-device sync after level 200 without losing saves or isolation',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`create role anon;create role authenticated;create role service_role;
   create schema auth;create table auth.users(id uuid primary key);
   create function auth.uid() returns uuid language sql as $$select current_setting('test.uid')::uuid$$;
   grant usage on schema auth to authenticated;
   insert into auth.users values ('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');
   set test.uid='11111111-1111-4111-8111-111111111111';`);
  const migration=readFileSync('supabase/035_network_expansion.sql','utf8');
  // Reproduce the exact SQL035 that had already been installed on the server.
  assert.match(migration,/jsonb_object_keys\(incoming->'stars'\)\)>210/);
  await db.exec(migration.replace("jsonb_object_keys(incoming->'stars'))>210","jsonb_object_keys(incoming->'stars'))>200"));
  const fresh=normalizeProgress();
  const full=normalizeProgress({...Object.fromEntries(Object.keys(fresh).filter(k=>k==='completed'||k.endsWith('Completed')).map(k=>[k,99])),...Object.fromEntries(networkStops.slice(2).map(s=>[s.key,0])),elysiumArrival:1,riftCrossed:1,caretakerMet:1,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true});
  const at200=normalizeProgress({...full,networkHandoverCompleted:0,networkPlatformCompleted:0});
  const at201=normalizeProgress({...full,networkHandoverCompleted:1,networkPlatformCompleted:0});
  const sync=async save=>(await db.query('select public.sync_game_progress($1::jsonb) as progress',[JSON.stringify(save)])).rows[0].progress;
  await db.exec('set role authenticated;');
  assert.equal(Object.keys((await sync(at200)).stars).length,200);
  await assert.rejects(()=>sync(at201),/Too many star ratings/);
  assert.equal((await db.query('select progress from public.game_progress')).rows[0].progress.networkHandoverCompleted,0);
  await db.exec('reset role;');
  const repair=readFileSync('supabase/036_network_cloud_star_limit.sql','utf8');
  await db.exec(repair);await db.exec(repair); // Safe to apply again.
  await db.exec('set role authenticated;');
  const saved=await sync(at201);assert.equal(saved.networkHandoverCompleted,1);
  const secondDevice=mergeProgress(at200,await sync(at200));
  assert.equal(secondDevice.networkHandoverCompleted,1);
  assert.equal(Object.keys(secondDevice.stars).length,201);
  const finished=await sync(full);assert.equal(Object.keys(finished.stars).length,210);
  const legacy={...at200};delete legacy.networkHandoverCompleted;delete legacy.networkPlatformCompleted;
  assert.equal((await sync(legacy)).networkPlatformCompleted,5);
  await assert.rejects(()=>sync({...full,stars:{...full.stars,unexpected:3}}),/Too many star ratings/);
  await db.exec("set test.uid='22222222-2222-4222-8222-222222222222';");
  assert.equal((await db.query('select * from public.game_progress')).rows.length,0);
  assert.equal((await sync(fresh)).networkHandoverCompleted,0);
  assert.equal((await db.query('select * from public.game_progress')).rows.length,1);
 }finally{await db.close();}
});

test('SQL038 preserves all 250 stars, read entries, legacy saves and reset isolation',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key);
   create function auth.uid() returns uuid language sql as $$select '11111111-1111-4111-8111-111111111111'::uuid$$;
   insert into auth.users values ('11111111-1111-4111-8111-111111111111');`);
  await db.exec(readFileSync('supabase/037_network_short_stops.sql','utf8'));
  const full=normalizeProgress({...Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k==='completed'||k.endsWith('Completed')).map(k=>[k,99])),elysiumArrival:1,riftCrossed:1,caretakerMet:1,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,scene:'network-first-watch',readIds:Object.values(networkDestinations).flatMap(s=>s.logs.map(e=>e.id))});
  for(const id of Object.keys(full.stars))full.stars[id]=3;
  const old=normalizeProgress({...full,...Object.fromEntries(networkStops.slice(10).map(s=>[s.key,0])),scene:'network-far-core'});
  const sync=async p=>(await db.query('select public.sync_game_progress($1::jsonb) as p',[JSON.stringify(p)])).rows[0].p;
  await db.exec('set role authenticated;');await sync(old);await db.exec('reset role;');
  const sql=readFileSync('supabase/038_network_first_watch.sql','utf8');await db.exec(sql);await db.exec(sql);
  await db.exec('set role authenticated;');
  const saved=await sync(full);assert.equal(Object.keys(saved.stars).length,250);assert.equal(saved.readIds.length,50);
  const legacy={...old};for(const s of networkStops.slice(10))delete legacy[s.key];
  const received=mergeProgress(old,await sync(legacy));
  for(const s of networkStops)assert.equal(received[s.key],s.total,s.key);
  assert.equal(Object.values(received.stars).filter(n=>n===3).length,250);
  assert.deepEqual(new Set(received.readIds),new Set(full.readIds));
  await assert.rejects(()=>sync({...full,stars:{...full.stars,extra:3}}),/Too many star ratings/);
  await assert.rejects(()=>sync({...full,readIds:Array(513).fill('x')}),/Invalid log entries/);
  const reset=(await db.query('select public.reset_game_progress(0) as p')).rows[0].p;
  for(const s of networkStops)assert.equal(reset[s.key],0);
  const stale=await sync(full);assert.equal(stale.resetRevision,1);assert.equal(stale.networkFirstWatchCompleted,0);assert.deepEqual(stale.stars,{});
 }finally{await db.close();}
});

test('SQL037 merges every short stop and all 230 stars across new and legacy devices',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key);
   create function auth.uid() returns uuid language sql as $$select '11111111-1111-4111-8111-111111111111'::uuid$$;
   insert into auth.users values ('11111111-1111-4111-8111-111111111111');`);
  await db.exec(readFileSync('supabase/035_network_expansion.sql','utf8'));
  const full=normalizeProgress({...Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k==='completed'||k.endsWith('Completed')).map(k=>[k,99])),elysiumArrival:1,riftCrossed:1,caretakerMet:1,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,...Object.fromEntries(networkStops.slice(10).map(s=>[s.key,0])),scene:'network-far-core'});
  for(const id of Object.keys(full.stars))full.stars[id]=3;
  const old=normalizeProgress({...full,...Object.fromEntries(networkStops.slice(2).map(s=>[s.key,0])),scene:'network-platform'});
  const sync=async p=>(await db.query('select public.sync_game_progress($1::jsonb) as p',[JSON.stringify(p)])).rows[0].p;
  await db.exec('set role authenticated;');await sync(old);await db.exec('reset role;');
  const sql=readFileSync('supabase/037_network_short_stops.sql','utf8');await db.exec(sql);await db.exec(sql);
  await db.exec('set role authenticated;');
  const saved=await sync(full);assert.equal(Object.keys(saved.stars).length,230);
  assert.equal(saved.scene,'network-far-core');
  const received=mergeProgress(old,await sync(old));
  for(const s of networkStops.slice(0,10))assert.equal(received[s.key],s.total,s.key);
  assert.equal(Object.values(received.stars).filter(n=>n===3).length,230);
  const legacy={...old};for(const s of networkStops.slice(2))delete legacy[s.key];
  assert.equal(Object.keys((await sync(legacy)).stars).length,230);
  await assert.rejects(()=>sync({...full,stars:{...full.stars,extra:3}}),/Too many star ratings/);
  const reset=(await db.query('select public.reset_game_progress(0) as p')).rows[0].p;
  for(const s of networkStops.slice(0,10))assert.equal(reset[s.key],0);
  assert.equal((await sync(full)).resetRevision,1);
  assert.equal((await sync(full)).networkFarCoreCompleted,0);
 }finally{await db.close();}
});
