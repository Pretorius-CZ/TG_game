-- Refuge medical bay, levels 151-155. Cumulative through 024.
-- Star ratings for every level. Cumulative through 023.
-- Residential block: levels 146–150. Cumulative through 022; preserves existing saves.
-- Refuge arrival dock: five tasks after the caretaker encounter. Cumulative through 021.
-- Luminous grove: five tasks after landing glade. Cumulative game-progress migration.
-- Night garden landing glade: five levels after the relay. Cumulative game-progress migration.
-- Fading-world relay: four tasks. Cumulative after 003–014.
-- Elysium research, cumulative after 003–013.
-- Living ring: six sequential garden tasks. Cumulative after 003–012.
-- Rift chapter. Cumulative after 003–011. Preserves previous saves.
-- Final three Elysium sectors. Cumulative after 003–010.
-- Central ring. Cumulative after 003–009.
-- Elysium route, arrival and first two sectors. Cumulative after 003–008.
-- Aster Veil expeditions. Apply after 007; preserves existing progress.
-- Linear chapter: airlock repairs precede cockpit. Includes migrations 004–006.
-- Haven jump gate. Includes 004 and 005; apply after 003 or later.
-- Two planet expeditions. Includes 004 definitions; safe after 003 or 004.
-- Chapter two. Apply after 003; preserves all existing saves and reset revisions.
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
 rating record;
 best integer;
 star_results jsonb := '{}'::jsonb;
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
 -- Only the explicit reset RPC may advance a save generation.
 if coalesce(incoming->>'resetRevision','0') is distinct from coalesce(previous->>'resetRevision','0') then
  return previous;
 end if;
 result := jsonb_build_object('version',1,'resetRevision',coalesce((previous->>'resetRevision')::bigint,0),'scene',case when incoming->>'scene' in
 ('exterior','airlock','cockpit','corridor','crew','galley','engine','navigation','system','mine','ice','wreck','haven','system2','buoy','verdant','fracture','elysium','elysium-dock','elysium-core','elysium-ring','elysium-homes','elysium-garden','elysium-observatory','rift','rift-echo','rift-platform','rift-beacons','beyond-rift','elysium-research','fading-relay','night-glade','night-grove','night-root','night-sanctuary','refuge-dock','refuge-homes','refuge-medical') then incoming->>'scene' else 'exterior' end);
 for field,cap in select * from (values ('completed',4),('crewCompleted',4),('galleyCompleted',4),('engineCompleted',5),('airlockCompleted',3),('navigationCompleted',4),('exteriorCompleted',4),('mineCompleted',6),('iceCompleted',6),('wreckCompleted',6),('havenCompleted',6),('buoyCompleted',3),('verdantCompleted',6),('fractureCompleted',6),('elysiumRouteCompleted',1),('elysiumArrival',1),('elysiumDockCompleted',4),('elysiumCoreCompleted',4),('elysiumRingCompleted',4),('elysiumHomesCompleted',4),('elysiumGardenCompleted',4),('elysiumObservatoryCompleted',4),('riftEchoCompleted',4),('riftPlatformCompleted',4),('riftBeaconsCompleted',4),('riftCrossed',1),('gardenCompleted',6),('researchCompleted',5),('relayCompleted',4),('nightGladeCompleted',5),('nightGroveCompleted',5),('nightRootCompleted',5),('nightSanctuaryCompleted',5),('caretakerMet',1),('refugeDockCompleted',5),('refugeHomesCompleted',5),('refugeMedicalCompleted',5)) as limits(k,v)
 loop
  if coalesce(incoming->>field,'0') !~ '^[0-9]{1,2}$' then raise exception 'Invalid repair count'; end if;
  n := least(cap,greatest(coalesce((incoming->>field)::integer,0),coalesce((previous->>field)::integer,0)));
  result := result || jsonb_build_object(field,n);
 end loop;
 if (result->>'completed')::integer < 4 then
  result := result || '{"crewCompleted":0,"galleyCompleted":0,"engineCompleted":0,"navigationCompleted":0,"exteriorCompleted":0}'::jsonb;
 end if;
 if (result->>'engineCompleted')::integer < 2 then
  result := result || jsonb_build_object('exteriorCompleted',least(3,(result->>'exteriorCompleted')::integer));
 end if;
 if jsonb_typeof(incoming->'readIds') is distinct from 'array' or jsonb_array_length(incoming->'readIds')>256 then raise exception 'Invalid log entries'; end if;
 result := result || jsonb_build_object('readIds',(select coalesce(jsonb_agg(distinct x),'[]'::jsonb) from jsonb_array_elements(coalesce(previous->'readIds','[]'::jsonb) || incoming->'readIds') x where jsonb_typeof(x)='string' and length(x::text)<100));
 result := result || jsonb_build_object('finaleDone',
  (incoming->'finaleDone'='true'::jsonb or coalesce(previous->'finaleDone'='true'::jsonb,false))
  and result @> '{"completed":4,"crewCompleted":4,"galleyCompleted":4,"engineCompleted":5,"airlockCompleted":3,"navigationCompleted":4,"exteriorCompleted":4}'::jsonb);
 result := result || jsonb_build_object('launchDone',coalesce(result->'finaleDone'='true'::jsonb,false) and (coalesce(incoming->'launchDone'='true'::jsonb,false) or coalesce(previous->'launchDone'='true'::jsonb,false)));
 if not coalesce(result->'launchDone'='true'::jsonb,false) then
  result := result || '{"mineCompleted":0}'::jsonb;
  if result->>'scene' in ('system','mine','ice','wreck','haven','system2','buoy','verdant','fracture','elysium','elysium-dock','elysium-core','elysium-ring','elysium-homes','elysium-garden','elysium-observatory','rift','rift-echo','rift-platform','rift-beacons','beyond-rift') then result := result || '{"scene":"exterior"}'::jsonb; end if;
 end if;
 result := result || jsonb_build_object('scannerInstalled',
  (result->>'mineCompleted')::integer=6 and
  (coalesce(incoming->'scannerInstalled'='true'::jsonb,false) or coalesce(previous->'scannerInstalled'='true'::jsonb,false)));
 if not coalesce(result->'scannerInstalled'='true'::jsonb,false) then
  result := result || '{"iceCompleted":0,"wreckCompleted":0}'::jsonb;
  if result->>'scene' in ('ice','wreck') then
   result := result || jsonb_build_object('scene',case when result->'launchDone'='true'::jsonb then 'system' else 'exterior' end);
  end if;
 end if;
 if not (coalesce(result->'scannerInstalled'='true'::jsonb,false) and (result->>'iceCompleted')::integer=6 and (result->>'wreckCompleted')::integer=6) then
  result := result || '{"havenCompleted":0}'::jsonb;
  if result->>'scene'='haven' then
   result := result || jsonb_build_object('scene',case when result->'launchDone'='true'::jsonb then 'system' else 'exterior' end);
  end if;
 end if;
 result := result || jsonb_build_object('jumpDone',(result->>'havenCompleted')::integer=6 and
  (coalesce(incoming->'jumpDone'='true'::jsonb,false) or coalesce(previous->'jumpDone'='true'::jsonb,false)));
 if result->>'scene'='system2' and not (result->'jumpDone'='true'::jsonb) then
  result := result || jsonb_build_object('scene',case when result->'launchDone'='true'::jsonb then 'system' else 'exterior' end);
 end if;
 if not coalesce(result->'jumpDone'='true'::jsonb,false) then
  result := result || '{"buoyCompleted":0}'::jsonb;
 end if;
 if (result->>'buoyCompleted')::integer<3 then
  result := result || '{"verdantCompleted":0,"fractureCompleted":0}'::jsonb;
 end if;
 if result->>'scene' in ('buoy','verdant','fracture') then
  if not coalesce(result->'jumpDone'='true'::jsonb,false) then
   result := result || jsonb_build_object('scene',case when result->'launchDone'='true'::jsonb then 'system' else 'exterior' end);
  elsif result->>'scene' in ('verdant','fracture') and (result->>'buoyCompleted')::integer<3 then
   result := result || '{"scene":"system2"}'::jsonb;
  end if;
 end if;
 if not (result @> '{"buoyCompleted":3,"verdantCompleted":6,"fractureCompleted":6}'::jsonb) then
  result := result || '{"elysiumRouteCompleted":0}'::jsonb;
 end if;
 if (result->>'elysiumRouteCompleted')::integer<1 then result := result || '{"elysiumArrival":0}'::jsonb; end if;
 if (result->>'elysiumArrival')::integer<1 then result := result || '{"elysiumDockCompleted":0}'::jsonb; end if;
 if (result->>'elysiumDockCompleted')::integer<4 then result := result || '{"elysiumCoreCompleted":0}'::jsonb; end if;
 if (result->>'elysiumCoreCompleted')::integer<4 then result := result || '{"elysiumRingCompleted":0}'::jsonb; end if;
 if (result->>'elysiumRingCompleted')::integer<4 then result := result || '{"elysiumHomesCompleted":0}'::jsonb; end if;
 if (result->>'elysiumHomesCompleted')::integer<4 then result := result || '{"elysiumGardenCompleted":0}'::jsonb; end if;
 if (result->>'elysiumGardenCompleted')::integer<4 then result := result || '{"elysiumObservatoryCompleted":0}'::jsonb; end if;
 if result->>'scene' in ('elysium','elysium-dock','elysium-core','elysium-ring','elysium-homes','elysium-garden','elysium-observatory') and
  ((result->>'elysiumArrival')::integer<1 or (result->>'scene'='elysium-core' and (result->>'elysiumDockCompleted')::integer<4) or (result->>'scene'='elysium-ring' and (result->>'elysiumCoreCompleted')::integer<4) or (result->>'scene'='elysium-homes' and (result->>'elysiumRingCompleted')::integer<4) or (result->>'scene'='elysium-garden' and (result->>'elysiumHomesCompleted')::integer<4) or (result->>'scene'='elysium-observatory' and (result->>'elysiumGardenCompleted')::integer<4)) then
  result := result || jsonb_build_object('scene',case when result->'jumpDone'='true'::jsonb then 'system2' when result->'launchDone'='true'::jsonb then 'system' else 'exterior' end);
 end if;
 if (result->>'elysiumObservatoryCompleted')::integer<4 then result := result || '{"riftEchoCompleted":0}'::jsonb; end if;
 if (result->>'riftEchoCompleted')::integer<4 then result := result || '{"riftPlatformCompleted":0}'::jsonb; end if;
 if (result->>'riftPlatformCompleted')::integer<4 then result := result || '{"riftBeaconsCompleted":0}'::jsonb; end if;
 if (result->>'riftBeaconsCompleted')::integer<4 then result := result || '{"riftCrossed":0}'::jsonb; end if;
 if (result->>'riftCrossed')::integer<1 then result := result || '{"gardenCompleted":0}'::jsonb; end if;
 if result->>'scene' in ('rift','rift-echo','rift-platform','rift-beacons','beyond-rift') and
  ((result->>'elysiumObservatoryCompleted')::integer<4
   or (result->>'scene'='rift-platform' and (result->>'riftEchoCompleted')::integer<4)
   or (result->>'scene'='rift-beacons' and (result->>'riftPlatformCompleted')::integer<4)
   or (result->>'scene'='beyond-rift' and (result->>'riftCrossed')::integer<1)) then
  result := result || jsonb_build_object('scene',case when (result->>'elysiumArrival')::integer=1 then 'elysium' when result->'jumpDone'='true'::jsonb then 'system2' when result->'launchDone'='true'::jsonb then 'system' else 'exterior' end);
 end if;
 if (result->>'gardenCompleted')::integer<6 then
  result := result || '{"researchCompleted":0}'::jsonb;
  if result->>'scene'='elysium-research' then result := result || '{"scene":"elysium"}'::jsonb; end if;
 end if;
 if (result->>'researchCompleted')::integer<5 then
  result := result || '{"relayCompleted":0}'::jsonb;
  if result->>'scene'='fading-relay' then result := result || '{"scene":"elysium"}'::jsonb; end if;
 end if;
 if (result->>'relayCompleted')::integer<4 then
  result := result || '{"nightGladeCompleted":0}'::jsonb;
  if result->>'scene'='night-glade' then result := result || '{"scene":"elysium"}'::jsonb; end if;
 end if;
 if (result->>'nightGladeCompleted')::integer<5 then
  result := result || '{"nightGroveCompleted":0}'::jsonb;
  if result->>'scene'='night-grove' then result := result || '{"scene":"elysium"}'::jsonb; end if;
 end if;
 if (result->>'nightGroveCompleted')::integer<5 then
  result := result || '{"nightRootCompleted":0}'::jsonb;
  if result->>'scene'='night-root' then result := result || '{"scene":"elysium"}'::jsonb; end if;
 end if;
 if (result->>'nightRootCompleted')::integer<5 then
  result := result || '{"nightSanctuaryCompleted":0}'::jsonb;
  if result->>'scene'='night-sanctuary' then result := result || '{"scene":"elysium"}'::jsonb; end if;
 end if;
 if (result->>'nightSanctuaryCompleted')::integer<5 then result := result || '{"caretakerMet":0}'::jsonb; end if;
 if (result->>'caretakerMet')::integer<1 then
  result := result || '{"refugeDockCompleted":0}'::jsonb;
  if result->>'scene'='refuge-dock' then result := result || '{"scene":"elysium"}'::jsonb; end if;
 end if;
 if (result->>'refugeDockCompleted')::integer<5 then
  result := result || '{"refugeHomesCompleted":0}'::jsonb;
  if result->>'scene'='refuge-homes' then result := result || '{"scene":"elysium"}'::jsonb; end if;
 end if;
 if incoming ? 'stars' and (jsonb_typeof(incoming->'stars') is distinct from 'object') then raise exception 'Invalid star ratings'; end if;
 if jsonb_typeof(incoming->'stars')='object' and (select count(*) from jsonb_object_keys(incoming->'stars'))>150 then raise exception 'Too many star ratings'; end if;
 if (result->>'refugeHomesCompleted')::integer<5 then
  result := result || '{"refugeMedicalCompleted":0}'::jsonb;
  if result->>'scene'='refuge-medical' then result := result || '{"scene":"refuge-homes"}'::jsonb; end if;
 end if;
 for rating in select * from (values
 ('airlock-power','airlockCompleted',1),
 ('airlock-inner-hatch','airlockCompleted',2),
 ('airlock-seals','airlockCompleted',3),
 ('lights','completed',1),
 ('windows','completed',2),
 ('computer','completed',3),
 ('diagnostics','completed',4),
 ('nav-antenna','navigationCompleted',1),
 ('nav-receiver','navigationCompleted',2),
 ('nav-chart','navigationCompleted',3),
 ('nav-route','navigationCompleted',4),
 ('crew-ventilation','crewCompleted',1),
 ('crew-filters','crewCompleted',2),
 ('crew-bunk','crewCompleted',3),
 ('crew-cabin','crewCompleted',4),
 ('galley-water','galleyCompleted',1),
 ('galley-cold','galleyCompleted',2),
 ('galley-racks','galleyCompleted',3),
 ('galley-food','galleyCompleted',4),
 ('engine-cooling','engineCompleted',1),
 ('engine-fuel','engineCompleted',2),
 ('engine-power','engineCompleted',3),
 ('engine-drive','engineCompleted',4),
 ('engine-test','engineCompleted',5),
 ('exterior-hull','exteriorCompleted',1),
 ('exterior-engines','exteriorCompleted',2),
 ('exterior-landing-gear','exteriorCompleted',3),
 ('exterior-refuel','exteriorCompleted',4),
 ('launch-check','finaleDone',1),
 ('grove-sampler','nightGroveCompleted',1),
 ('grove-channels','nightGroveCompleted',2),
 ('grove-bloom','nightGroveCompleted',3),
 ('grove-resonance','nightGroveCompleted',4),
 ('grove-arch','nightGroveCompleted',5),
 ('root-air','nightRootCompleted',1),
 ('root-record','nightRootCompleted',2),
 ('root-nursery','nightRootCompleted',3),
 ('root-voice','nightRootCompleted',4),
 ('root-door','nightRootCompleted',5),
 ('sanctuary-beacon','nightSanctuaryCompleted',1),
 ('sanctuary-shelter','nightSanctuaryCompleted',2),
 ('sanctuary-translator','nightSanctuaryCompleted',3),
 ('sanctuary-heart','nightSanctuaryCompleted',4),
 ('sanctuary-route','nightSanctuaryCompleted',5),
 ('refuge-dock-beacon','refugeDockCompleted',1),
 ('refuge-dock-filters','refugeDockCompleted',2),
 ('refuge-dock-supplies','refugeDockCompleted',3),
 ('refuge-dock-walkway','refugeDockCompleted',4),
 ('refuge-dock-airlock','refugeDockCompleted',5),
 ('refuge-homes-air','refugeHomesCompleted',1),
 ('refuge-homes-water','refugeHomesCompleted',2),
 ('refuge-homes-warmth','refugeHomesCompleted',3),
 ('refuge-homes-bunks','refugeHomesCompleted',4),
 ('refuge-homes-ready','refugeHomesCompleted',5),
 ('refuge-medical-sterile','refugeMedicalCompleted',1),
 ('refuge-medical-supplies','refugeMedicalCompleted',2),
 ('refuge-medical-diagnostics','refugeMedicalCompleted',3),
 ('refuge-medical-culture','refugeMedicalCompleted',4),
 ('refuge-medical-ready','refugeMedicalCompleted',5),
 ('night-markers','nightGladeCompleted',1),
 ('night-drone','nightGladeCompleted',2),
 ('night-roots','nightGladeCompleted',3),
 ('night-bridge','nightGladeCompleted',4),
 ('night-glade','nightGladeCompleted',5),
 ('relay-resonator','relayCompleted',1),
 ('relay-dish','relayCompleted',2),
 ('relay-recording','relayCompleted',3),
 ('relay-descent','relayCompleted',4),
 ('research-unpack','researchCompleted',1),
 ('research-chamber','researchCompleted',2),
 ('research-decode','researchCompleted',3),
 ('research-compare','researchCompleted',4),
 ('research-route','researchCompleted',5),
 ('garden-terrace','gardenCompleted',1),
 ('garden-beacon','gardenCompleted',2),
 ('garden-bridge','gardenCompleted',3),
 ('garden-water','gardenCompleted',4),
 ('garden-archive','gardenCompleted',5),
 ('garden-heart','gardenCompleted',6),
 ('rift-echo-listen','riftEchoCompleted',1),
 ('rift-echo-clock','riftEchoCompleted',2),
 ('rift-echo-bearing','riftEchoCompleted',3),
 ('rift-echo-route','riftEchoCompleted',4),
 ('rift-platform-receiver','riftPlatformCompleted',1),
 ('rift-platform-recorder','riftPlatformCompleted',2),
 ('rift-platform-probe','riftPlatformCompleted',3),
 ('rift-platform-shield','riftPlatformCompleted',4),
 ('rift-beacons-anchor','riftBeaconsCompleted',1),
 ('rift-beacons-phase','riftBeaconsCompleted',2),
 ('rift-beacons-return','riftBeaconsCompleted',3),
 ('rift-beacons-stabilize','riftBeaconsCompleted',4),
 ('elysium-dock-guidance','elysiumDockCompleted',1),
 ('elysium-dock-tunnel','elysiumDockCompleted',2),
 ('elysium-dock-pressure','elysiumDockCompleted',3),
 ('elysium-dock-cargo','elysiumDockCompleted',4),
 ('elysium-core-cooling','elysiumCoreCompleted',1),
 ('elysium-core-grid','elysiumCoreCompleted',2),
 ('elysium-core-ignition','elysiumCoreCompleted',3),
 ('elysium-core-safeguards','elysiumCoreCompleted',4),
 ('elysium-ring-bulkhead','elysiumRingCompleted',1),
 ('elysium-ring-transit','elysiumRingCompleted',2),
 ('elysium-ring-junction','elysiumRingCompleted',3),
 ('elysium-ring-lighting','elysiumRingCompleted',4),
 ('elysium-homes-air','elysiumHomesCompleted',1),
 ('elysium-homes-water','elysiumHomesCompleted',2),
 ('elysium-homes-quarters','elysiumHomesCompleted',3),
 ('elysium-homes-commons','elysiumHomesCompleted',4),
 ('elysium-garden-irrigation','elysiumGardenCompleted',1),
 ('elysium-garden-climate','elysiumGardenCompleted',2),
 ('elysium-garden-nursery','elysiumGardenCompleted',3),
 ('elysium-garden-balance','elysiumGardenCompleted',4),
 ('elysium-observatory-optics','elysiumObservatoryCompleted',1),
 ('elysium-observatory-uplink','elysiumObservatoryCompleted',2),
 ('elysium-observatory-chart','elysiumObservatoryCompleted',3),
 ('elysium-observatory-beacon','elysiumObservatoryCompleted',4),
 ('buoy-power','buoyCompleted',1),
 ('buoy-antenna','buoyCompleted',2),
 ('buoy-archive','buoyCompleted',3),
 ('verdant-pad','verdantCompleted',1),
 ('verdant-water','verdantCompleted',2),
 ('verdant-power','verdantCompleted',3),
 ('verdant-habitat','verdantCompleted',4),
 ('verdant-scanner','verdantCompleted',5),
 ('verdant-sample','verdantCompleted',6),
 ('fracture-bridge','fractureCompleted',1),
 ('fracture-generator','fractureCompleted',2),
 ('fracture-drill','fractureCompleted',3),
 ('fracture-spectrum','fractureCompleted',4),
 ('fracture-sorter','fractureCompleted',5),
 ('fracture-probe','fractureCompleted',6),
 ('haven-dock','havenCompleted',1),
 ('haven-power','havenCompleted',2),
 ('haven-ring','havenCompleted',3),
 ('haven-coupler','havenCompleted',4),
 ('haven-route-coordinates','havenCompleted',5),
 ('haven-stabilize','havenCompleted',6),
 ('mine-pad','mineCompleted',1),
 ('mine-hatch','mineCompleted',2),
 ('mine-power','mineCompleted',3),
 ('mine-drill','mineCompleted',4),
 ('mine-terminal','mineCompleted',5),
 ('mine-lift','mineCompleted',6),
 ('ice-beacons','iceCompleted',1),
 ('ice-airlock','iceCompleted',2),
 ('ice-heater','iceCompleted',3),
 ('ice-lab','iceCompleted',4),
 ('ice-dish','iceCompleted',5),
 ('ice-cells','iceCompleted',6),
 ('wreck-dock','wreckCompleted',1),
 ('wreck-bulkhead','wreckCompleted',2),
 ('wreck-reactor','wreckCompleted',3),
 ('wreck-records','wreckCompleted',4),
 ('wreck-antenna','wreckCompleted',5),
 ('wreck-cargo','wreckCompleted',6),
 ('elysium-route','elysiumRouteCompleted',1)
 ) as levels(id,field,required)
 loop
  if (case when rating.field='finaleDone' then result->'finaleDone'='true'::jsonb
     else coalesce((result->>rating.field)::integer,0)>=rating.required end) then
   best := 1;
   if previous->'stars'->>rating.id ~ '^[1-3]$' then best := greatest(best,(previous->'stars'->>rating.id)::integer); end if;
   if incoming->'stars'->>rating.id ~ '^[1-3]$' then best := greatest(best,(incoming->'stars'->>rating.id)::integer); end if;
   star_results := star_results || jsonb_build_object(rating.id,best);
  end if;
 end loop;
 result := result || jsonb_build_object('stars',star_results);
 insert into public.game_progress(user_id,progress) values(uid,result)
 on conflict(user_id) do update set progress=excluded.progress,updated_at=now();
 return result;
end;
$$;
revoke all on function public.sync_game_progress(jsonb) from public, anon;
grant execute on function public.sync_game_progress(jsonb) to authenticated;


-- Reset and sync use the same account lock; old devices cannot resurrect repairs.
create or replace function public.reset_game_progress(expected_revision bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); previous jsonb; revision bigint; fresh jsonb;
begin
 if uid is null then raise exception 'Authentication required'; end if;
 perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
 select progress into previous from public.game_progress where user_id=uid;
 revision := coalesce((previous->>'resetRevision')::bigint,0);
 if expected_revision is distinct from revision then return previous; end if;
 fresh := jsonb_build_object('version',1,'resetRevision',revision+1,'scene','exterior',
 'completed',0,'crewCompleted',0,'galleyCompleted',0,'engineCompleted',0,
 'airlockCompleted',0,'navigationCompleted',0,'exteriorCompleted',0,
 'mineCompleted',0,'iceCompleted',0,'wreckCompleted',0,'havenCompleted',0,'buoyCompleted',0,'verdantCompleted',0,'fractureCompleted',0,'elysiumRouteCompleted',0,'elysiumArrival',0,'elysiumDockCompleted',0,'elysiumCoreCompleted',0,'elysiumRingCompleted',0,'elysiumHomesCompleted',0,'elysiumGardenCompleted',0,'elysiumObservatoryCompleted',0,'riftEchoCompleted',0,'riftPlatformCompleted',0,'riftBeaconsCompleted',0,'riftCrossed',0,'gardenCompleted',0,'researchCompleted',0,'relayCompleted',0,'nightGladeCompleted',0,'nightGroveCompleted',0,'nightRootCompleted',0,'nightSanctuaryCompleted',0,'caretakerMet',0,'refugeDockCompleted',0,'refugeHomesCompleted',0,'refugeMedicalCompleted',0,'jumpDone',false,'scannerInstalled',false,'finaleDone',false,'launchDone',false,'readIds','[]'::jsonb,'stars','{}'::jsonb);
 insert into public.game_progress(user_id,progress) values(uid,fresh)
 on conflict(user_id) do update set progress=excluded.progress,updated_at=now();
 return fresh;
end;
$$;
revoke all on function public.reset_game_progress(bigint) from public, anon;
grant execute on function public.reset_game_progress(bigint) to authenticated;
