-- Requires 027 (and 016). Does not change game progress. Run once in Supabase SQL Editor.
begin;
create table if not exists public.analytics_testers(reporter_id uuid primary key references public.balance_reporters(id), marked_at timestamptz not null default now());
create table if not exists public.analytics_activity_days(reporter_id uuid references public.balance_reporters(id),day date not null,primary key(reporter_id,day));
create table if not exists public.analytics_measurement(id boolean primary key default true check(id), started_at timestamptz not null default now());
insert into public.analytics_measurement(id) values(true) on conflict do nothing;
alter table public.analytics_testers enable row level security;
alter table public.analytics_activity_days enable row level security;
alter table public.analytics_measurement enable row level security;
revoke all on public.analytics_testers,public.analytics_activity_days,public.analytics_measurement from public,anon,authenticated;
-- Guest capability protects ownership; merging protects completed outcomes from stale tabs.
create or replace function public.merge_campaign_attempts(previous jsonb,incoming jsonb)
returns jsonb language sql immutable set search_path='' as $$
 select coalesce(jsonb_object_agg(k.key,case
 when previous->k.key->>'outcome'='won'
 or (incoming->k.key->>'outcome'='started' and previous->k.key->>'outcome' in ('won','failed','quit','fault','exhausted'))
 or (incoming->k.key->>'outcome'='exhausted' and previous->k.key->>'outcome' in ('failed','quit','fault'))
 then previous->k.key else coalesce(incoming->k.key,previous->k.key) end),'{}'::jsonb)
 from (select jsonb_object_keys(coalesce(previous,'{}'::jsonb)||coalesce(incoming,'{}'::jsonb)) as key) k;
$$;
revoke all on function public.merge_campaign_attempts(jsonb,jsonb) from public,anon,authenticated;
create or replace function public.record_campaign_visit(reporter_id uuid,reporter_token uuid,incoming jsonb)
returns void language plpgsql security definer set search_path='' as $$
declare vid uuid; rev bigint; safe jsonb; owner_id uuid; observed_ms numeric;
begin
 if reporter_id is null or reporter_token is null or incoming is null or jsonb_typeof(incoming)<>'object' or octet_length(incoming::text)>65536 then raise exception 'Invalid visit'; end if;
 vid:=(incoming->>'id')::uuid; rev:=(incoming->>'revision')::bigint;
 if vid is null or rev is null or rev<1 or jsonb_typeof(incoming->'attempts') is distinct from 'object' then raise exception 'Invalid visit'; end if;
 if coalesce(incoming->>'source','') !~ '^[a-zA-Z0-9_.-]{1,80}$' or coalesce(incoming->>'medium','') !~ '^[a-zA-Z0-9_.-]{1,80}$' or coalesce(incoming->>'campaign','') !~ '^[a-zA-Z0-9_.-]{1,80}$' then raise exception 'Invalid campaign'; end if;
 if exists(select 1 from jsonb_each(incoming->'attempts') e where e.key !~ '^[a-fA-F0-9-]{36}$' or coalesce(e.value->>'level','') !~ '^[a-zA-Z0-9_-]{1,80}$' or coalesce(e.value->>'outcome','') not in ('started','won','failed','quit','fault','exhausted')) then raise exception 'Invalid attempts'; end if;
 insert into public.balance_reporters(id,token_hash) values(reporter_id,pg_catalog.md5(reporter_token::text)) on conflict(id) do nothing;
 perform 1 from public.balance_reporters r where r.id=record_campaign_visit.reporter_id and r.token_hash=pg_catalog.md5(reporter_token::text) for update;
 if not found then raise exception 'Reporter token mismatch'; end if;
 select v.reporter_id into owner_id from public.campaign_visits v where v.id=vid;
 if owner_id is not null and owner_id<>reporter_id then raise exception 'Visit owner mismatch'; end if;
 if owner_id is null and (select count(*) from public.campaign_visits v where v.reporter_id=record_campaign_visit.reporter_id and v.created_at>now()-interval '1 day')>=300 then raise exception 'Daily visit limit'; end if;
 select jsonb_build_object('country',case when coalesce(incoming->>'country','') ~ '^[A-Z]{2}$' and incoming->>'country' not in ('XX','ZZ','EU','UN') then incoming->>'country' else null end,'device',case when incoming->>'device' in ('mobile','desktop') then incoming->>'device' else 'unknown' end,'source',incoming->>'source','medium',incoming->>'medium','campaign',incoming->>'campaign','attempts',coalesce(jsonb_object_agg(e.key,jsonb_build_object('level',e.value->>'level','outcome',e.value->>'outcome','startedAt',case when jsonb_typeof(e.value->'startedAt')='number' then e.value->'startedAt' else null end,'finishedAt',case when jsonb_typeof(e.value->'finishedAt')='number' then e.value->'finishedAt' else null end)),'{}'::jsonb)) into safe from jsonb_each(incoming->'attempts') e;
 insert into public.campaign_visits as existing(id,reporter_id,payload,revision) values(vid,reporter_id,safe,rev)
 on conflict(id) do update set payload=excluded.payload||jsonb_build_object('country',coalesce(existing.payload->>'country',excluded.payload->>'country'),'device',coalesce(nullif(excluded.payload->>'device','unknown'),existing.payload->>'device','unknown'),'attempts',public.merge_campaign_attempts(existing.payload->'attempts',excluded.payload->'attempts')),revision=excluded.revision where existing.reporter_id=excluded.reporter_id and existing.revision<excluded.revision;
 -- Delayed offline uploads must not manufacture a return on the upload day.
 if incoming->>'visible'='true' and jsonb_typeof(incoming->'lastAt')='number' then
  observed_ms:=(incoming->>'lastAt')::numeric;
  if observed_ms between extract(epoch from now())*1000-300000 and extract(epoch from now())*1000+60000 then
   insert into public.analytics_activity_days(reporter_id,day) values(reporter_id,(to_timestamp(observed_ms/1000) at time zone 'UTC')::date) on conflict do nothing;
  end if;
 end if;
end;
$$;
revoke all on function public.record_campaign_visit(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.record_campaign_visit(uuid,uuid,jsonb) to anon,authenticated;

create or replace function public.set_analytics_tester(device_id uuid,is_tester boolean)
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from public.balance_admins where user_id=auth.uid()) then raise exception 'Analytics administrator required'; end if;
 if device_id is null or is_tester is null then raise exception 'Invalid tester'; end if;
 if is_tester then insert into public.analytics_testers(reporter_id) values(device_id) on conflict do nothing;
 else delete from public.analytics_testers where reporter_id=device_id; end if;
end;
$$;
revoke all on function public.set_analytics_tester(uuid,boolean) from public,anon,authenticated;
grant execute on function public.set_analytics_tester(uuid,boolean) to authenticated;
create or replace function public.read_analytics_visits(page_offset integer default 0,page_size integer default 1000)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not exists(select 1 from public.balance_admins where user_id=auth.uid()) then raise exception 'Analytics administrator required'; end if;
 if page_offset is null or page_size is null or page_offset<0 or page_size<1 or page_size>1000 then raise exception 'Invalid page'; end if;
 select coalesce(jsonb_agg(v.payload||jsonb_build_object('id',v.id,'reporter',v.reporter_id,'recordedAt',v.created_at)),'[]'::jsonb) into result
 from (select * from public.campaign_visits order by created_at,id offset page_offset limit page_size) v;
 return result;
end;
$$;
revoke all on function public.read_analytics_visits(integer,integer) from public,anon,authenticated;
grant execute on function public.read_analytics_visits(integer,integer) to authenticated;
create or replace function public.read_analytics_overview()
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; started timestamptz;
begin
 if auth.uid() is null or not exists(select 1 from public.balance_admins where user_id=auth.uid()) then raise exception 'Analytics administrator required'; end if;
 select started_at into started from public.analytics_measurement where id=true;
 with first_seen as (
 select reporter_id,min(created_at) as first_at from public.campaign_visits group by reporter_id
 ), cohorts as (
 select f.reporter_id,(f.first_at at time zone 'UTC')::date as day from first_seen f
 where f.first_at>=started and not exists(select 1 from public.analytics_testers t where t.reporter_id=f.reporter_id)
 ), summary as (
 select c.day,count(*) as devices,
 count(*) filter(where c.day+1<(now() at time zone 'UTC')::date) as eligible_d1,
 count(*) filter(where c.day+1<(now() at time zone 'UTC')::date and exists(select 1 from public.analytics_activity_days a where a.reporter_id=c.reporter_id and a.day=c.day+1)) as returned_d1,
 count(*) filter(where c.day+7<(now() at time zone 'UTC')::date) as eligible_week,
 count(*) filter(where c.day+7<(now() at time zone 'UTC')::date and exists(select 1 from public.analytics_activity_days a where a.reporter_id=c.reporter_id and a.day between c.day+1 and c.day+7)) as returned_week
 from cohorts c group by c.day order by c.day desc
 ) select jsonb_build_object('startedAt',started,'testers',coalesce((select jsonb_agg(reporter_id) from public.analytics_testers),'[]'::jsonb),'retention',coalesce((select jsonb_agg(to_jsonb(s)) from summary s),'[]'::jsonb)) into result;
 return result;
end;
$$;
revoke all on function public.read_analytics_overview() from public,anon,authenticated;
grant execute on function public.read_analytics_overview() to authenticated;
commit;
