-- Requires 016,017,027,028,032. Independent of progress/auth data.
-- Install Cron if needed. Run as the project owner in Supabase SQL Editor.
begin;
create extension if not exists pg_cron with schema pg_catalog;
alter table public.balance_reporters add column if not exists revoked_at timestamptz;
create index if not exists balance_attempts_expiry on public.balance_attempts(created_at);
create index if not exists campaign_visits_expiry on public.campaign_visits(created_at);
create index if not exists analytics_activity_expiry on public.analytics_activity_days(day);

-- Keep a minimal suppression record so stale/offline clients cannot recreate erased data.
create or replace function public.guard_analytics_write()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 perform 1 from public.balance_reporters where id=new.reporter_id and revoked_at is null for update;
 if not found then raise exception 'Analytics identity revoked or missing'; end if;
 return new;
end;
$$;
revoke all on function public.guard_analytics_write() from public,anon,authenticated;
drop trigger if exists analytics_write_guard on public.balance_attempts;
create trigger analytics_write_guard before insert or update on public.balance_attempts for each row execute function public.guard_analytics_write();
drop trigger if exists analytics_write_guard on public.campaign_visits;
create trigger analytics_write_guard before insert or update on public.campaign_visits for each row execute function public.guard_analytics_write();
drop trigger if exists analytics_write_guard on public.analytics_activity_days;
create trigger analytics_write_guard before insert or update on public.analytics_activity_days for each row execute function public.guard_analytics_write();

create or replace function public.guard_analytics_presence()
returns trigger language plpgsql set search_path='' as $$
begin
 if new.revoked_at is not null and new.last_seen is not null then raise exception 'Analytics identity revoked'; end if;
 return new;
end;
$$;
revoke all on function public.guard_analytics_presence() from public,anon,authenticated;
drop trigger if exists analytics_presence_guard on public.balance_reporters;
create trigger analytics_presence_guard before insert or update on public.balance_reporters for each row execute function public.guard_analytics_presence();

create or replace function public.delete_browser_analytics(reporter_id uuid,reporter_token uuid)
returns void language plpgsql security definer set search_path='' as $$
begin
 if reporter_id is null or reporter_token is null then raise exception 'Reporter capability required'; end if;
 insert into public.balance_reporters(id,token_hash) values(reporter_id,pg_catalog.md5(reporter_token::text)) on conflict(id) do nothing;
 perform 1 from public.balance_reporters r where r.id=delete_browser_analytics.reporter_id and r.token_hash=pg_catalog.md5(reporter_token::text) for update;
 if not found then raise exception 'Reporter token mismatch'; end if;
 update public.balance_reporters r set revoked_at=coalesce(revoked_at,now()),last_seen=null where r.id=delete_browser_analytics.reporter_id;
 delete from public.balance_attempts a where a.reporter_id=delete_browser_analytics.reporter_id;
 delete from public.campaign_visits v where v.reporter_id=delete_browser_analytics.reporter_id;
 delete from public.analytics_activity_days d where d.reporter_id=delete_browser_analytics.reporter_id;
 delete from public.analytics_testers t where t.reporter_id=delete_browser_analytics.reporter_id;
end;
$$;
revoke all on function public.delete_browser_analytics(uuid,uuid) from public,anon,authenticated;
grant execute on function public.delete_browser_analytics(uuid,uuid) to anon,authenticated;

create or replace function public.purge_expired_analytics()
returns void language plpgsql security definer set search_path='' as $$
begin
 -- First creation, not a later update, determines the maximum record lifetime.
 delete from public.balance_attempts where created_at<now()-interval '90 days';
 delete from public.campaign_visits where created_at<now()-interval '90 days';
 delete from public.analytics_activity_days where day<(now() at time zone 'UTC')::date-90;
 delete from public.analytics_testers t where not exists(select 1 from public.balance_attempts a where a.reporter_id=t.reporter_id)
  and not exists(select 1 from public.campaign_visits v where v.reporter_id=t.reporter_id)
  and not exists(select 1 from public.analytics_activity_days d where d.reporter_id=t.reporter_id)
  and exists(select 1 from public.balance_reporters r where r.id=t.reporter_id and r.created_at<now()-interval '90 days' and (r.last_seen is null or r.last_seen<now()-interval '90 days'));
 delete from public.balance_reporters r where revoked_at is null and created_at<now()-interval '90 days'
  and (last_seen is null or last_seen<now()-interval '90 days')
  and not exists(select 1 from public.balance_attempts a where a.reporter_id=r.id)
  and not exists(select 1 from public.campaign_visits v where v.reporter_id=r.id)
  and not exists(select 1 from public.analytics_activity_days d where d.reporter_id=r.id)
  and not exists(select 1 from public.analytics_testers t where t.reporter_id=r.id);
end;
$$;
revoke all on function public.purge_expired_analytics() from public,anon,authenticated;
create or replace function public.read_traffic_overview()
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 result jsonb; started timestamptz; bot_ids uuid[]; tester_ids uuid[];
 traffic text; include_testers boolean; scopes jsonb := '{}'::jsonb;
 live_stats jsonb; retention_stats jsonb;
begin
 -- Reuse the existing administrator check; no new public read access.
 result := public.read_analytics_overview();
 select started_at into started from public.analytics_measurement where id=true;
 select coalesce(array_agg(distinct reporter_id),array[]::uuid[]) into bot_ids
 from public.campaign_visits where payload->>'source'='automated_test' and payload->>'medium'='bot';
 select coalesce(array_agg(reporter_id),array[]::uuid[]) into tester_ids from public.analytics_testers;
 foreach traffic in array array['players','bots','all'] loop
  foreach include_testers in array array[false,true] loop
   select jsonb_build_object(
    'active',count(*) filter(where last_seen>now()-interval '2 minutes'),
    'today',count(*) filter(where last_seen>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC'),
    'total',count(*),'measuredAt',now()) into live_stats
   from public.balance_reporters r
   where r.revoked_at is null and (traffic='all' or (r.id=any(bot_ids))=(traffic='bots'))
    and (include_testers or not(r.id=any(tester_ids)));
   with first_seen as (
    select reporter_id,min(created_at) as first_at from public.campaign_visits group by reporter_id
   ), cohorts as (
    select f.reporter_id,(f.first_at at time zone 'UTC')::date as day from first_seen f
    where f.first_at>=started
     and (traffic='all' or (f.reporter_id=any(bot_ids))=(traffic='bots'))
     and (include_testers or not(f.reporter_id=any(tester_ids)))
   ), summary as (
    select c.day,count(*) as devices,
     count(*) filter(where c.day+1<(now() at time zone 'UTC')::date) as eligible_d1,
     count(*) filter(where c.day+1<(now() at time zone 'UTC')::date and exists(
      select 1 from public.analytics_activity_days a where a.reporter_id=c.reporter_id and a.day=c.day+1)) as returned_d1,
     count(*) filter(where c.day+7<(now() at time zone 'UTC')::date) as eligible_week,
     count(*) filter(where c.day+7<(now() at time zone 'UTC')::date and exists(
      select 1 from public.analytics_activity_days a where a.reporter_id=c.reporter_id and a.day between c.day+1 and c.day+7)) as returned_week
    from cohorts c group by c.day
   ) select coalesce(jsonb_agg(to_jsonb(s) order by s.day desc),'[]'::jsonb) into retention_stats from summary s;
   scopes := jsonb_set(scopes,array[traffic],coalesce(scopes->traffic,'{}'::jsonb)||jsonb_build_object(
    case when include_testers then 'included' else 'excluded' end,
    jsonb_build_object('live',live_stats,'retention',retention_stats)),true);
  end loop;
 end loop;
 return result||jsonb_build_object('bots',to_jsonb(bot_ids),'trafficScopes',scopes);
end;
$$;
revoke all on function public.read_traffic_overview() from public,anon,authenticated;
grant execute on function public.read_traffic_overview() to authenticated;

create or replace function public.read_player_stats()
returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from public.balance_admins where user_id=auth.uid()) then raise exception 'Analytics administrator required'; end if;
 return jsonb_build_object(
 'active',(select count(*) from public.balance_reporters where last_seen>now()-interval '2 minutes'),
 'today',(select count(*) from public.balance_reporters where last_seen>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC'),
 'total',(select count(*) from public.balance_reporters where revoked_at is null),
 'attemptsToday',(select count(*) from public.balance_attempts where created_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC'),
 'measuredAt',now());
end;
$$;
revoke all on function public.read_player_stats() from public,anon,authenticated;
grant execute on function public.read_player_stats() to authenticated;

-- Fail visibly if Cron has not been enabled; do not claim an unscheduled expiry.
select cron.schedule('purge-game-analytics','17 3 * * *','select public.purge_expired_analytics();');
commit;
-- Check cron.job and cron.job_run_details after installation; see docs/analytics-privacy.md.
