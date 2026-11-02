begin;
-- Repair an already installed SQL035 without replacing saves or account data.
-- PostgreSQL retains the function owner and grants on CREATE OR REPLACE.
do $migration$
declare
 definition text;
 old_guard constant text := '(select count(*) from jsonb_object_keys(incoming->''stars''))>200';
 new_guard constant text := '(select count(*) from jsonb_object_keys(incoming->''stars''))>210';
begin
 definition := pg_get_functiondef('public.sync_game_progress(jsonb)'::regprocedure);
 if strpos(definition,'networkHandoverCompleted')=0 or strpos(definition,'network-platform')=0 then
  raise exception 'Apply 035_network_expansion.sql before SQL036';
 end if;
 if strpos(definition,old_guard)>0 then
  execute replace(definition,old_guard,new_guard);
 elsif strpos(definition,new_guard)=0 then
  raise exception 'Unexpected cloud save validation; no changes applied';
 end if;
end;
$migration$;
commit;
