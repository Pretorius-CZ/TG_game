-- Independent analytics migration. Run in Supabase SQL Editor after game setup.
-- No changes to progress or authentication. Reporter IDs represent browsers, not people.
begin;
create table if not exists public.balance_reporters (
 id uuid primary key,
 token_hash text not null,
 created_at timestamptz not null default now()
);
create table if not exists public.balance_attempts (
 attempt_id uuid primary key,
 reporter_id uuid not null references public.balance_reporters(id) on delete cascade,
 revision bigint not null,
 payload jsonb not null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists balance_attempts_reporter_created on public.balance_attempts(reporter_id,created_at);
create table if not exists public.balance_admins (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.balance_reporters enable row level security;
alter table public.balance_attempts enable row level security;
alter table public.balance_admins enable row level security;
revoke all on public.balance_reporters,public.balance_attempts,public.balance_admins from public,anon,authenticated;

create or replace function public.record_balance_attempt(reporter_id uuid,reporter_token uuid,incoming jsonb,incoming_revision bigint)
returns void language plpgsql security definer set search_path='' as $$
declare
 aid uuid;
 owner_id uuid;
 safe_payload jsonb;
begin
 if reporter_id is null or reporter_token is null or incoming_revision is null or incoming_revision<1
   or jsonb_typeof(incoming)<>'object' or octet_length(incoming::text)>16384 then
   raise exception 'Invalid analytics payload';
 end if;
 if coalesce(incoming->>'level','') !~ '^[a-zA-Z0-9_-]{1,80}$'
   or coalesce(incoming->>'outcome','') not in ('won','failed','quit','fault','exhausted')
   or coalesce(incoming->>'moves','') !~ '^[0-9]{1,4}$' then
   raise exception 'Invalid attempt';
 end if;
 aid:=(incoming->>'attemptId')::uuid;
 if aid is null then raise exception 'Attempt ID required'; end if;
 -- A private random capability lets guests update their own attempts only.
 insert into public.balance_reporters(id,token_hash) values(reporter_id,pg_catalog.md5(reporter_token::text))
 on conflict(id) do nothing;
 perform 1 from public.balance_reporters r
 where r.id=record_balance_attempt.reporter_id and r.token_hash=pg_catalog.md5(reporter_token::text) for update;
 if not found then raise exception 'Reporter token mismatch'; end if;
 select a.reporter_id into owner_id from public.balance_attempts a where a.attempt_id=aid;
 if owner_id is not null and owner_id<>record_balance_attempt.reporter_id then raise exception 'Attempt owner mismatch'; end if;
 if owner_id is null and (select count(*) from public.balance_attempts a
 where a.reporter_id=record_balance_attempt.reporter_id and a.created_at>now()-interval '1 day')>=300 then
 raise exception 'Daily analytics limit reached'; end if;
 -- Store only gameplay fields, never tokens or account profile data.
 select jsonb_object_agg(e.key,e.value) into safe_payload from jsonb_each(incoming) e
 where e.key=any(array['attemptId','level','outcome','moves','budget','baseBudget','remaining','at','durationMs',
 'configuration','counts','remainingCovers','resonance','helpers','extraMoves','hints','build','legacy']);
 insert into public.balance_attempts as existing(attempt_id,reporter_id,revision,payload)
 values(aid,reporter_id,incoming_revision,safe_payload)
 on conflict(attempt_id) do update set revision=excluded.revision,payload=excluded.payload,updated_at=now()
 where existing.reporter_id=excluded.reporter_id and existing.revision<excluded.revision;
end;
$$;
revoke all on function public.record_balance_attempt(uuid,uuid,jsonb,bigint) from public,anon,authenticated;
grant execute on function public.record_balance_attempt(uuid,uuid,jsonb,bigint) to anon,authenticated;

create or replace function public.read_balance_attempts(page_offset integer default 0,page_size integer default 1000)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not exists(select 1 from public.balance_admins where user_id=auth.uid()) then
 raise exception 'Analytics administrator required'; end if;
 if page_offset is null or page_size is null or page_offset<0 or page_size<1 or page_size>1000 then raise exception 'Invalid page'; end if;
 select coalesce(jsonb_agg(r.payload||jsonb_build_object('reporter',r.reporter_id)),'[]'::jsonb)
 into result from (select payload,reporter_id from public.balance_attempts
 order by created_at,attempt_id offset page_offset limit page_size) r;
 return result;
end;
$$;
revoke all on function public.read_balance_attempts(integer,integer) from public,anon,authenticated;
grant execute on function public.read_balance_attempts(integer,integer) to authenticated;
commit;
-- In a separate SQL query, grant YOUR signed-in account access:
-- insert into public.balance_admins(user_id)
-- select id from auth.users where lower(email)=lower('YOUR_GOOGLE_EMAIL')
-- on conflict(user_id) do nothing;
