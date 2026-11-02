import {readFileSync,writeFileSync} from 'node:fs';
import {networkDestinations,networkScenes,networkStops} from '../src/networkExpansion.js';
const extra=networkStops.slice(2);
let sql=readFileSync('supabase/035_network_expansion.sql','utf8');
sql=sql.replace('-- Network extension, levels201-210. Apply after034.','-- Network short stops, levels231-250. Includes SQL035–037 behavior.\n-- Preserves all previous progress, uses the same reset revision and account lock.');
sql=sql.replaceAll("'network-handover','network-platform'",networkScenes.map(s=>`'${s}'`).join(','));
sql=sql.replace("('networkPlatformCompleted',5)) as limits",`('networkPlatformCompleted',5),${extra.map(s=>`('${s.key}',${s.total})`).join(',')}) as limits`);
sql=sql.replace("jsonb_object_keys(incoming->'stars'))>210","jsonb_object_keys(incoming->'stars'))>250");
const gates=extra.map((s,i)=>{const previous=networkStops[i+1];return ` if (result->>'${previous.key}')::integer<${previous.total} then\n  result := result || '{"${s.key}":0}'::jsonb;\n  if result->>'scene'='${s.scene}' then result := result || '{"scene":"${previous.scene}"}'::jsonb; end if;\n end if;`;}).join('\n');
sql=sql.replace(' for rating in select * from (values',gates+'\n for rating in select * from (values');
const ratings=extra.flatMap(s=>networkDestinations[s.scene].repairs.map((r,i)=>` ('${r.id}','${s.key}',${i+1}),`)).join('\n');
sql=sql.replace(" ('network-handover','networkHandoverCompleted',1),",ratings+"\n ('network-handover','networkHandoverCompleted',1),");
sql=sql.replace("'networkPlatformCompleted',0,'jumpDone'",`'networkPlatformCompleted',0) || jsonb_build_object(${extra.map(s=>`'${s.key}',0`).join(',')},'jumpDone'`);
// A player who reads every entry now exceeds the old 256-entry request cap.
sql=sql.replace("jsonb_array_length(incoming->'readIds')>256","jsonb_array_length(incoming->'readIds')>512");
// Parenthesize extraction: || and -> otherwise associate left and drop read markers.
sql=sql.replace(" || incoming->'readIds'"," || (incoming->'readIds')");
writeFileSync('supabase/038_network_first_watch.sql',sql);
console.log('SQL038 generated for '+networkScenes.length+' stops and '+Object.values(networkDestinations).reduce((n,s)=>n+s.repairs.length,0)+' network levels');

