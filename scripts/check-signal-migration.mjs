import {PGlite} from '../.local/sql-check/node_modules/@electric-sql/pglite/dist/index.js';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {normalizeProgress} from '../src/progressStorage.js';
const db=new PGlite();
await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;`);
const uid='11111111-1111-4111-8111-111111111111';await db.query('insert into auth.users(id) values($1)',[uid]);await db.query("select set_config('request.jwt.claim.sub',$1,false)",[uid]);
const raw=Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k.endsWith('Completed')||k==='completed').map(k=>[k,6]));
const full=normalizeProgress({...raw,elysiumRouteCompleted:1,elysiumArrival:1,riftCrossed:1,caretakerMet:1,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,scene:'signal-station'});
const old=normalizeProgress({...full,signalSolarCompleted:0,signalOrbitCompleted:0,signalGardenCompleted:0,signalStationCompleted:0,scene:'archive-core'});for(const key of ['signalSolarCompleted','signalOrbitCompleted','signalGardenCompleted','signalStationCompleted'])delete old[key];
async function sync(p){return (await db.query('select public.sync_game_progress($1::jsonb) as p',[JSON.stringify(p)])).rows[0].p;}
await db.exec(await readFile('supabase/031_archive_echoes.sql','utf8'));await sync(old);
await db.exec(await readFile('supabase/034_signal_answer.sql','utf8'));
const saved=await sync(full);assert.equal(saved.signalStationCompleted,4);assert.equal(saved.scene,'signal-station');assert.equal(Object.keys(saved.stars).length,200);
const stale=await sync(old);assert.equal(stale.signalStationCompleted,4);assert.equal(Object.keys(stale.stars).length,200);
const reset=(await db.query('select public.reset_game_progress(0) as p')).rows[0].p;assert.equal(reset.signalStationCompleted,0);assert.equal(reset.resetRevision,1);
assert.equal((await sync(full)).signalStationCompleted,0);
const invalid=await sync({...full,resetRevision:1,archiveCoreCompleted:0});assert.equal(invalid.signalSolarCompleted,0);assert.equal(invalid.signalStationCompleted,0);
console.log('SQL034: migration from187, save200/stars, old-client merge, reset protection and dependency gates passed in isolated PostgreSQL.');await db.close();
