begin;
-- Requires 016_balance_analytics.sql. Reuse pseudonymous browser identity.
alter table public.balance_reporters add column if not exists last_seen timestamptz;
create index if not exists balance_reporters_seen on public.balance_reporters(last_seen);
create or replace function public.record_player_presence(reporter_id uuid,reporter_token uuid)
returns void language plpgsql security definer set search_path='' as $$
begin
 if reporter_id is null or reporter_token is null then raise exception 'Identity required'; end if;
 insert into public.balance_reporters(id,token_hash,last_seen)
 values(reporter_id,pg_catalog.md5(reporter_token::text),now())
 on conflict(id) do update set last_seen=now()
 where balance_reporters.token_hash=pg_catalog.md5(reporter_token::text)
 and (balance_reporters.last_seen is null or balance_reporters.last_seen<now()-interval '20 seconds');
end;
$$;
revoke all on function public.record_player_presence(uuid,uuid) from public,anon,authenticated;
grant execute on function public.record_player_presence(uuid,uuid) to anon,authenticated;
create or replace function public.read_player_stats()
returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from public.balance_admins where user_id=auth.uid()) then raise exception 'Analytics administrator required'; end if;
 return jsonb_build_object(
 'active',(select count(*) from public.balance_reporters where last_seen>now()-interval '2 minutes'),
 'today',(select count(*) from public.balance_reporters where last_seen>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC'),
 'total',(select count(*) from public.balance_reporters),
 'attemptsToday',(select count(*) from public.balance_attempts where created_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC'),
 'measuredAt',now());
end;
$$;
revoke all on function public.read_player_stats() from public,anon,authenticated;
grant execute on function public.read_player_stats() to authenticated;
commit;
