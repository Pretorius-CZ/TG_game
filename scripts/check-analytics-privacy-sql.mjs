import {PGlite} from '../.local/sql-check/node_modules/@electric-sql/pglite/dist/index.js';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const db=new PGlite();
await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,email text);create function auth.uid() returns uuid language sql as $$select null::uuid$$;create schema cron;create function cron.schedule(text,text,text) returns bigint language sql as $$select 1::bigint$$;`);
for(const name of ['016_balance_analytics','017_player_presence','027_country_tracking','028_analytics_quality','032_bot_traffic','033_analytics_privacy']){
 // PGlite cannot load pg_cron; only its installation/scheduling are stubbed.
 const sql=(await readFile('supabase/'+name+'.sql','utf8')).replace('create extension if not exists pg_cron with schema pg_catalog;','');
 await db.exec(sql);
}
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222',token='33333333-3333-4333-8333-333333333333';
const attempt=id=>({attemptId:id,level:'test',outcome:'won',moves:2,at:Date.now()});
async function record(reporter,id){await db.query('select public.record_balance_attempt($1,$2,$3::jsonb,1)',[reporter,token,JSON.stringify(attempt(id))]);}
await record(a,'44444444-4444-4444-8444-444444444444');await record(b,'55555555-5555-4555-8555-555555555555');
await db.query('select public.record_campaign_visit($1,$2,$3::jsonb)',[a,token,JSON.stringify({id:'66666666-6666-4666-8666-666666666666',revision:1,source:'direct',medium:'none',campaign:'none',attempts:{},visible:true,lastAt:Date.now()})]);
await assert.rejects(()=>db.query('select public.delete_browser_analytics($1,$2)',[a,b]),/token mismatch/);
await db.query('select public.delete_browser_analytics($1,$2)',[a,token]);await db.query('select public.delete_browser_analytics($1,$2)',[a,token]);
assert.equal((await db.query('select count(*)::int as n from public.balance_attempts')).rows[0].n,1);
assert.equal((await db.query('select count(*)::int as n from public.campaign_visits')).rows[0].n,0);
assert.equal((await db.query('select count(*)::int as n from public.analytics_activity_days')).rows[0].n,0);
await assert.rejects(()=>record(a,'77777777-7777-4777-8777-777777777777'),/revoked/);
await assert.rejects(()=>db.query('select public.record_player_presence($1,$2)',[a,token]),/revoked/);
await db.exec("update public.balance_attempts set created_at=now()-interval '91 days';select public.purge_expired_analytics();");
assert.equal((await db.query('select count(*)::int as n from public.balance_attempts')).rows[0].n,0);
await db.exec('set role anon;');await assert.rejects(()=>db.exec('select public.purge_expired_analytics()'),/permission denied/);
await db.exec('reset role;');
console.log('SQL: migration, token protection, isolated/idempotent deletion, stale uploads/presence blocked, 90-day purge, permissions passed. Cron scheduling stubbed; production cron must be verified separately.');
await db.close();
