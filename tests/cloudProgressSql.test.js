import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';

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
  const full=normalizeProgress({...Object.fromEntries(Object.keys(fresh).filter(k=>k==='completed'||k.endsWith('Completed')).map(k=>[k,99])),elysiumArrival:1,riftCrossed:1,caretakerMet:1,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true});
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
