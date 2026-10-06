-- Includes 026 definitions. Requires 016 analytics. No changes to game progress.
-- Browser supplies an approximate country; never an IP address.
begin;
create table if not exists public.campaign_visits (
 id uuid primary key,
 reporter_id uuid not null references public.balance_reporters(id),
 payload jsonb not null,
 revision bigint not null,
 created_at timestamptz not null default now()
);
create index if not exists campaign_visits_reporter on public.campaign_visits(reporter_id,created_at);
alter table public.campaign_visits enable row level security;
revoke all on public.campaign_visits from public,anon,authenticated;
create or replace function public.record_campaign_visit(reporter_id uuid,reporter_token uuid,incoming jsonb)
returns void language plpgsql security definer set search_path='' as $$
declare vid uuid; rev bigint; safe jsonb; owner_id uuid;
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
 select jsonb_build_object('country',case when coalesce(incoming->>'country','') ~ '^[A-Z]{2}$' and incoming->>'country' not in ('XX','ZZ','EU','UN') then incoming->>'country' else null end,'source',incoming->>'source','medium',incoming->>'medium','campaign',incoming->>'campaign','attempts',coalesce(jsonb_object_agg(e.key,jsonb_build_object('level',e.value->>'level','outcome',e.value->>'outcome')),'{}'::jsonb)) into safe from jsonb_each(incoming->'attempts') e;
 insert into public.campaign_visits as existing(id,reporter_id,payload,revision) values(vid,reporter_id,safe,rev)
 on conflict(id) do update set payload=excluded.payload||jsonb_build_object('country',coalesce(existing.payload->>'country',excluded.payload->>'country')),revision=excluded.revision where existing.reporter_id=excluded.reporter_id and existing.revision<excluded.revision;
end;
$$;
revoke all on function public.record_campaign_visit(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.record_campaign_visit(uuid,uuid,jsonb) to anon,authenticated;
create or replace function public.read_campaign_stats()
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not exists(select 1 from public.balance_admins where user_id=auth.uid()) then raise exception 'Analytics administrator required'; end if;
 select coalesce(jsonb_agg(to_jsonb(summary)),'[]'::jsonb) into result from (
 select payload->>'source' as source,payload->>'medium' as medium,payload->>'campaign' as campaign,count(*) as visits,count(distinct reporter_id) as devices,
 count(*) filter(where a.n>0) as started,count(*) filter(where a.w>0) as won,count(*) filter(where a.levels>1) as continued,sum(a.n) as attempts
 from public.campaign_visits v cross join lateral (select count(*) as n,count(*) filter(where value->>'outcome'='won') as w,count(distinct value->>'level') as levels from jsonb_each(v.payload->'attempts')) a
 group by payload->>'source',payload->>'medium',payload->>'campaign' order by count(*) desc
 ) summary;
 return result;
end;
$$;
revoke all on function public.read_campaign_stats() from public,anon,authenticated;
grant execute on function public.read_campaign_stats() to authenticated;
create or replace function public.read_country_stats()
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not exists(select 1 from public.balance_admins where user_id=auth.uid()) then raise exception 'Analytics administrator required'; end if;
 select coalesce(jsonb_agg(to_jsonb(summary)),'[]'::jsonb) into result from (
 select coalesce(payload->>'country','unknown') as country,payload->>'source' as source,payload->>'medium' as medium,payload->>'campaign' as campaign,count(*) as visits,count(distinct reporter_id) as devices,
 count(*) filter(where a.n>0) as started,count(*) filter(where a.w>0) as won,count(*) filter(where a.levels>1) as continued,sum(a.n) as attempts
 from public.campaign_visits v cross join lateral (select count(*) as n,count(*) filter(where value->>'outcome'='won') as w,count(distinct value->>'level') as levels from jsonb_each(v.payload->'attempts')) a
 group by coalesce(payload->>'country','unknown'),payload->>'source',payload->>'medium',payload->>'campaign' order by count(*) desc
 ) summary;
 return result;
end;
$$;
revoke all on function public.read_country_stats() from public,anon,authenticated;
grant execute on function public.read_country_stats() to authenticated;
commit;
