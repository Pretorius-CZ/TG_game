-- Requires 028 and 017. Read-only analytics extension; no game progress changes.
begin;
create index if not exists campaign_visits_bot_reporters on public.campaign_visits(reporter_id)
 where payload->>'source'='automated_test' and payload->>'medium'='bot';
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
   where (traffic='all' or (r.id=any(bot_ids))=(traffic='bots'))
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
commit;
