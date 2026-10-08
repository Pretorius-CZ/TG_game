// Optional isolated PostgreSQL verification; no credentials or live database.
// npm install --prefix .local/analytics-sql --no-audit --no-fund --ignore-scripts @electric-sql/pglite
// node scripts/test-analytics-sql.mjs
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const {PGlite}=await import('../.local/analytics-sql/node_modules/@electric-sql/pglite/dist/index.js');
const db=new PGlite();
const admin=randomUUID(),device=randomUUID(),token=randomUUID(),visit=randomUUID(),attempt=randomUUID();
const one=async(sql,args=[]) => (await db.query(sql,args)).rows[0];
try{
 await db.exec(`create role anon; create role authenticated; create schema auth;
 create table auth.users(id uuid primary key,email text);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('test.user_id',true),'')::uuid$$;
 grant usage on schema auth to anon,authenticated;
 grant execute on function auth.uid() to anon,authenticated;`);
 for(const file of ['016_balance_analytics.sql','027_country_tracking.sql','028_analytics_quality.sql'])await db.exec(await readFile(new URL('../supabase/'+file,import.meta.url),'utf8'));
 // Reapplying the migration must not reset the retention start or erase data.
 const initial=(await one('select started_at from public.analytics_measurement')).started_at;
 await db.exec(await readFile(new URL('../supabase/028_analytics_quality.sql',import.meta.url),'utf8'));
 assert.deepEqual((await one('select started_at from public.analytics_measurement')).started_at,initial);
 await db.query('insert into auth.users(id) values($1)',[admin]);
 await db.query('insert into public.balance_admins(user_id) values($1)',[admin]);
 const incoming={id:visit,revision:1,source:'facebook',medium:'paid_social',campaign:'launch',country:'GB',device:'mobile',visible:true,lastAt:Date.now(),attempts:{[attempt]:{level:'airlock-power',outcome:'started',startedAt:Date.now()}},email:'not-stored',ip:'not-stored'};
 const record=async(value=incoming,reporter=device,secret=token)=>db.query('select public.record_campaign_visit($1,$2,$3)',[reporter,secret,JSON.stringify(value)]);
 await db.exec('set role anon');
 await record();await record();
 await assert.rejects(()=>db.query('select * from public.campaign_visits'),/permission denied/);
 await assert.rejects(()=>db.query('select public.read_analytics_overview()'),/permission denied/);
 await assert.rejects(()=>record(incoming,device,randomUUID()),/Reporter token mismatch/);
 await assert.rejects(()=>record(incoming,randomUUID(),randomUUID()),/Visit owner mismatch/);
 await db.exec('reset role');
 assert.equal(Number((await one('select count(*) as n from public.analytics_activity_days')).n),1);
 const payload=(await one('select payload from public.campaign_visits')).payload;
 assert.equal(payload.device,'mobile');assert.equal(payload.email,undefined);assert.equal(payload.ip,undefined);
 const second=randomUUID();
 await record({...incoming,revision:2,country:null,device:'unknown',attempts:{[second]:{level:'airlock-inner-hatch',outcome:'won'}}});
 const merged=(await one('select payload from public.campaign_visits')).payload;
 assert.equal(merged.country,'GB');assert.equal(merged.device,'mobile');assert.equal(Object.keys(merged.attempts).length,2);
 await record({...incoming,revision:1,attempts:{}});
 assert.equal(Object.keys((await one('select payload from public.campaign_visits')).payload.attempts).length,2);
 await record({...incoming,revision:3,attempts:{[attempt]:{level:'airlock-power',outcome:'exhausted'}}});
 await record({...incoming,revision:4,attempts:{[attempt]:{level:'airlock-power',outcome:'won'}}});
 await record({...incoming,revision:5});
 const afterStale=(await one('select payload from public.campaign_visits')).payload;
 assert.equal(afterStale.attempts[attempt].outcome,'won');assert.equal(Object.keys(afterStale.attempts).length,2);
 const offline=randomUUID();
 await record({...incoming,id:randomUUID(),lastAt:Date.now()-86400000},offline,randomUUID());
 assert.equal(Number((await one('select count(*) as n from public.analytics_activity_days where reporter_id=$1',[offline])).n),0);
 await db.exec('set role authenticated');
 await assert.rejects(()=>one('select public.read_analytics_overview()'),/Analytics administrator required/);
 await assert.rejects(()=>one('select public.set_analytics_tester($1,true)',[device]),/Analytics administrator required/);
 await db.query("select set_config('test.user_id',$1,false)",[admin]);
 await assert.rejects(()=>one('select public.read_analytics_visits(null,1000)'),/Invalid page/);
 const firstPage=(await one('select public.read_analytics_visits(0,1) as data')).data;
 assert.equal(firstPage.length,1);assert.equal(firstPage[0].reporter,device);assert.ok(firstPage[0].recordedAt);
 await one('select public.set_analytics_tester($1,true)',[device]);
 assert.ok((await one('select public.read_analytics_overview() as data')).data.testers.includes(device));
 await one('select public.set_analytics_tester($1,false)',[device]);
 assert.equal((await one('select public.read_analytics_overview() as data')).data.testers.length,0);
 await db.exec('reset role');
 // Seed relative UTC cohorts: mature day 8, immature day 1, and pre-measurement history.
 await db.exec("update public.analytics_measurement set started_at=(now() at time zone 'UTC')::date-interval '10 days'");
 const mature=randomUUID(),waiting=randomUUID(),old=randomUUID();
 for(const [id,age] of [[mature,8],[waiting,1],[old,12]]){
  await db.query('insert into public.balance_reporters(id,token_hash) values($1,$2)',[id,'fixture']);
  await db.query("insert into public.campaign_visits(id,reporter_id,payload,revision,created_at) values($1,$2,'{}',1,((now() at time zone 'UTC')::date-$3::integer)::timestamp at time zone 'UTC')",[randomUUID(),id,age]);
 }
 await db.query("insert into public.analytics_activity_days(reporter_id,day) values($1,(now() at time zone 'UTC')::date-7),($1,(now() at time zone 'UTC')::date-3),($2,(now() at time zone 'UTC')::date)",[mature,waiting]);
 await db.exec('set role authenticated');
 const overview=(await one('select public.read_analytics_overview() as data')).data;
 const eligible=overview.retention.filter(r=>r.eligible_week>0);
 assert.equal(eligible.length,1);assert.equal(eligible[0].returned_d1,1);assert.equal(eligible[0].returned_week,1);
 assert.equal(overview.retention.filter(r=>r.eligible_d1>0).length,1,'current return day is not complete');
 await one('select public.set_analytics_tester($1,true)',[mature]);
 assert.equal((await one('select public.read_analytics_overview() as data')).data.retention.filter(r=>r.eligible_week>0).length,0);
 console.log('Analytics SQL passed: migrations, grants, identity isolation, idempotency, pagination, tester reversal, UTC retention maturity and delayed uploads.');
}finally{await db.close();}
