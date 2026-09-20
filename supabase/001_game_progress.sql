-- Run once in Supabase SQL Editor. No database password belongs in the browser.
create table if not exists public.game_progress (
 user_id uuid primary key references auth.users(id) on delete cascade,
 progress jsonb not null,
 updated_at timestamptz not null default now()
);
alter table public.game_progress enable row level security;
drop policy if exists own_save_read on public.game_progress;
create policy own_save_read on public.game_progress for select to authenticated using ((select auth.uid())=user_id);
revoke all on public.game_progress from anon, authenticated;
grant select on public.game_progress to authenticated;

create or replace function public.sync_game_progress(incoming jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 uid uuid := auth.uid();
 previous jsonb;
 result jsonb;
 field text;
 cap integer;
 n integer;
begin
 if uid is null then raise exception 'Authentication required'; end if;
 if incoming->>'version' is distinct from '1' or jsonb_typeof(incoming)<>'object' then
  raise exception 'Unsupported save version';
 end if;
 -- Serialize creation and updates for one account, including concurrent first saves.
 perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
 select progress into previous from public.game_progress where user_id=uid;
 if previous is not null and previous->>'version' is distinct from '1' then
  raise exception 'Unsupported stored save version';
 end if;
 previous := coalesce(previous,'{}'::jsonb);
 result := jsonb_build_object('version',1,'scene',case when incoming->>'scene' in
 ('exterior','airlock','cockpit','corridor','crew','galley','engine','navigation') then incoming->>'scene' else 'exterior' end);
 for field,cap in select * from (values ('completed',4),('crewCompleted',4),('galleyCompleted',4),('engineCompleted',5),('airlockCompleted',3),('navigationCompleted',4),('exteriorCompleted',4)) as limits(k,v)
 loop
  if coalesce(incoming->>field,'0') !~ '^[0-9]{1,2}$' then raise exception 'Invalid repair count'; end if;
  n := least(cap,greatest(coalesce((incoming->>field)::integer,0),coalesce((previous->>field)::integer,0)));
  result := result || jsonb_build_object(field,n);
 end loop;
 if (result->>'completed')::integer < 4 then
  result := result || '{"crewCompleted":0,"galleyCompleted":0,"engineCompleted":0,"airlockCompleted":0,"navigationCompleted":0,"exteriorCompleted":0}'::jsonb;
 end if;
 if (result->>'engineCompleted')::integer < 2 then
  result := result || jsonb_build_object('exteriorCompleted',least(3,(result->>'exteriorCompleted')::integer));
 end if;
 if jsonb_typeof(incoming->'readIds') is distinct from 'array' or jsonb_array_length(incoming->'readIds')>100 then raise exception 'Invalid log entries'; end if;
 result := result || jsonb_build_object('readIds',(select coalesce(jsonb_agg(distinct x),'[]'::jsonb) from jsonb_array_elements(coalesce(previous->'readIds','[]'::jsonb) || incoming->'readIds') x where jsonb_typeof(x)='string' and length(x::text)<100));
 result := result || jsonb_build_object('finaleDone',
  (incoming->'finaleDone'='true'::jsonb or coalesce(previous->'finaleDone'='true'::jsonb,false))
  and result @> '{"completed":4,"crewCompleted":4,"galleyCompleted":4,"engineCompleted":5,"airlockCompleted":3,"navigationCompleted":4,"exteriorCompleted":4}'::jsonb);
 insert into public.game_progress(user_id,progress) values(uid,result)
 on conflict(user_id) do update set progress=excluded.progress,updated_at=now();
 return result;
end;
$$;
revoke all on function public.sync_game_progress(jsonb) from public, anon;
grant execute on function public.sync_game_progress(jsonb) to authenticated;
