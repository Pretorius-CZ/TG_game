import {readFileSync,writeFileSync} from 'node:fs';
import {signalDestinations,signalScenes} from '../src/signalNetwork.js';
const sites=Object.values(signalDestinations);
let sql=readFileSync('supabase/031_archive_echoes.sql','utf8');
sql='begin;\n-- The answer, levels 188-200. Apply after031; analytics032/033 unchanged.\n'+sql.slice(sql.indexOf('create table if not exists'));
sql=sql.replace("'archive-core') then",()=>"'archive-core',"+signalScenes.map(s=>"'"+s+"'").join(',')+") then");
sql=sql.replace("('archiveCoreCompleted',5)) as limits",()=>"('archiveCoreCompleted',5),"+sites.map(s=>`('${s.key}',${s.repairs.length})`).join(',')+") as limits");
sql=sql.replace("'archiveCoreCompleted',0,'jumpDone'",()=>"'archiveCoreCompleted',0,"+sites.map(s=>`'${s.key}',0`).join(',')+",'jumpDone'");
// PostgreSQL limits function calls to 100 arguments; keep reset objects in small pieces.
sql=sql.replace(/('exteriorCompleted',0),\s*('mineCompleted',0)/,(_,a,b)=>a+') || jsonb_build_object(\n '+b);
sql=sql.replace("jsonb_object_keys(incoming->'stars'))>187","jsonb_object_keys(incoming->'stars'))>200");
const gates=sites.map((s,i)=>{
 const previous=i?sites[i-1]:{key:'archiveCoreCompleted',repairs:Array(5),scene:'archive-core'};
 return ` if (result->>'${previous.key}')::integer<${previous.repairs.length} then\n  result := result || '{"${s.key}":0}'::jsonb;\n  if result->>'scene'='${signalScenes[i]}' then result := result || '{"scene":"${i?signalScenes[i-1]:'archive-core'}"}'::jsonb; end if;\n end if;\n`;
}).join('');
sql=sql.replace(' for rating in select * from (values',()=>gates+' for rating in select * from (values\n'+sites.flatMap(s=>s.repairs.map((r,i)=>` ('${r.id}','${s.key}',${i+1}),`)).join('\n'));
writeFileSync('supabase/034_signal_answer.sql',sql);
